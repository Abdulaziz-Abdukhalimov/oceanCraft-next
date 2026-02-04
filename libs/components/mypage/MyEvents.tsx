import React, { useState } from 'react';
import { NextPage } from 'next';
import { Pagination, Stack, Typography, Button, Menu, MenuItem, Chip, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { Event } from '../../types/event/event';
import { BusinessEventsInquiry } from '../../types/event/event.input';
import { T } from '../../types/common';
import { EventStatus, EventCategory } from '../../enums/event.enum';
import { userVar } from '../../../apollo/store';
import { useRouter } from 'next/router';
import { UPDATE_EVENT } from '../../../apollo/user/mutation';
import { GET_AGENT_EVENTS } from '../../../apollo/user/query';
import { sweetConfirmAlert, sweetErrorHandling } from '../../sweetAlert';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { EventCard } from './EventCard';

const MyEvents: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const [searchFilter, setSearchFilter] = useState<BusinessEventsInquiry>(initialInput);
	const [businessEvents, setBusinessEvents] = useState<Event[]>([]);
	const [total, setTotal] = useState<number>(0);
	const user = useReactiveVar(userVar);
	const router = useRouter();

	// Filter menu states
	const [categoryAnchor, setCategoryAnchor] = useState<null | HTMLElement>(null);

	/** APOLLO REQUESTS **/
	const [updateEvent] = useMutation(UPDATE_EVENT);

	const {
		loading: getBusinessEventsLoading,
		data: getBusinessEventsData,
		error: getBusinessEventsError,
		refetch: getBusinessEventsRefetch,
	} = useQuery(GET_AGENT_EVENTS, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setBusinessEvents(data?.getBusinessEvents?.list);
			setTotal(data?.getBusinessEvents?.metaCounter[0]?.total ?? 0);
		},
	});

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	const changeStatusHandler = (value: EventStatus) => {
		setSearchFilter({ ...searchFilter, page: 1, search: { ...searchFilter.search, eventStatus: value } });
	};

	const toggleCategoryFilter = (category: EventCategory) => {
		const currentCategories = searchFilter.search.categoryList || [];
		let newCategories: EventCategory[];

		if (currentCategories.includes(category)) {
			newCategories = currentCategories.filter((c) => c !== category);
		} else {
			newCategories = [...currentCategories, category];
		}

		setSearchFilter({
			...searchFilter,
			page: 1,
			search: { ...searchFilter.search, categoryList: newCategories.length > 0 ? newCategories : undefined },
		});
	};

	const clearAllFilters = () => {
		setSearchFilter({
			...searchFilter,
			page: 1,
			search: { eventStatus: searchFilter.search.eventStatus },
		});
	};

	const deleteEventHandler = async (id: string) => {
		try {
			if (await sweetConfirmAlert('Are you sure to delete this event?')) {
				await updateEvent({
					variables: {
						input: {
							_id: id,
							eventStatus: 'DELETED',
						},
					},
				});

				await getBusinessEventsRefetch({ input: searchFilter });
			}
		} catch (err: any) {
			await sweetErrorHandling(err);
		}
	};

	const updateEventHandler = async (status: string, id: string) => {
		try {
			if (await sweetConfirmAlert(`Are you sure to change to ${status} status?`)) {
				await updateEvent({
					variables: {
						input: {
							_id: id,
							eventStatus: status,
						},
					},
				});
				await getBusinessEventsRefetch({ input: searchFilter });
			}
		} catch (err) {
			await sweetErrorHandling(err);
		}
	};

	if (user?.memberType !== 'AGENT') {
		router.back();
	}

	const hasActiveFilters = searchFilter.search.categoryList && searchFilter.search.categoryList.length > 0;

	if (device === 'mobile') {
		return <div>MY EVENTS MOBILE</div>;
	} else {
		return (
			<div id="my-event-page">
				<Stack className="main-title-box">
					<Stack className="right-box">
						<Typography className="main-title">My Events</Typography>
						<Typography className="sub-title">Manage your water sports activities and tours</Typography>
					</Stack>
				</Stack>

				<Stack className="event-list-box">
					<Stack className="tab-name-box">
						<Typography
							onClick={() => changeStatusHandler(EventStatus.ACTIVE)}
							className={searchFilter.search.eventStatus === 'ACTIVE' ? 'active-tab-name' : 'tab-name'}
						>
							Active
						</Typography>
						<Typography
							onClick={() => changeStatusHandler(EventStatus.PENDING)}
							className={searchFilter.search.eventStatus === 'PENDING' ? 'active-tab-name' : 'tab-name'}
						>
							Pending
						</Typography>
						<Typography
							onClick={() => changeStatusHandler(EventStatus.COMPLETED)}
							className={searchFilter.search.eventStatus === 'COMPLETED' ? 'active-tab-name' : 'tab-name'}
						>
							Completed
						</Typography>
						<Typography
							onClick={() => changeStatusHandler(EventStatus.CANCELLED)}
							className={searchFilter.search.eventStatus === 'CANCELLED' ? 'active-tab-name' : 'tab-name'}
						>
							Cancelled
						</Typography>
					</Stack>

					{/* Filters Section */}
					<Stack className="filters-section">
						<Stack className="filter-buttons">
							{/* Category Filter */}
							<Button
								variant="outlined"
								onClick={(e: any) => setCategoryAnchor(e.currentTarget)}
								endIcon={<KeyboardArrowDownIcon />}
								className="filter-button"
							>
								Category
								{searchFilter.search.categoryList && searchFilter.search.categoryList.length > 0 && (
									<Chip label={searchFilter.search.categoryList.length} size="small" className="filter-badge" />
								)}
							</Button>
							<Menu
								anchorEl={categoryAnchor}
								open={Boolean(categoryAnchor)}
								onClose={() => setCategoryAnchor(null)}
								PaperProps={{ sx: { maxHeight: 400, width: 250 } }}
							>
								{Object.values(EventCategory).map((category) => (
									<MenuItem key={category} onClick={() => toggleCategoryFilter(category)}>
										<Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
											<input
												type="checkbox"
												checked={searchFilter.search.categoryList?.includes(category) || false}
												onChange={() => {}}
												style={{ marginRight: 12 }}
											/>
											<span>{category.replace(/_/g, ' ')}</span>
										</Box>
									</MenuItem>
								))}
							</Menu>

							{/* Clear Filters */}
							{hasActiveFilters && (
								<Button variant="text" onClick={clearAllFilters} className="clear-filters-button">
									Clear All
								</Button>
							)}
						</Stack>

						{/* Active Filters Display */}
						{searchFilter.search.categoryList && searchFilter.search.categoryList.length > 0 && (
							<Stack className="active-filters">
								{searchFilter.search.categoryList.map((category) => (
									<Chip
										key={category}
										label={category.replace(/_/g, ' ')}
										onDelete={() => toggleCategoryFilter(category)}
										size="small"
										className="filter-chip"
									/>
								))}
							</Stack>
						)}
					</Stack>

					<Stack className="list-box">
						<Stack className="listing-title-box">
							<Typography className="title-text">Event</Typography>
							<Typography className="title-text">Date Published</Typography>
							<Typography className="title-text">Status</Typography>
							<Typography className="title-text">Views</Typography>
							{searchFilter.search.eventStatus === 'ACTIVE' && <Typography className="title-text">Actions</Typography>}
						</Stack>

						{businessEvents?.length === 0 ? (
							<div className={'no-data'}>
								<img src="/img/icons/icoAlert.svg" alt="" />
								<p>No events found!</p>
							</div>
						) : (
							businessEvents.map((event: Event) => {
								return (
									<EventCard
										key={event._id}
										event={event}
										deleteEventHandler={deleteEventHandler}
										updateEventHandler={updateEventHandler}
									/>
								);
							})
						)}

						{businessEvents.length !== 0 && (
							<Stack className="pagination-config">
								<Stack className="pagination-box">
									<Pagination
										count={total}
										page={searchFilter.page}
										shape="circular"
										color="primary"
										onChange={paginationHandler}
									/>
								</Stack>
								<Stack className="total-result">
									<Typography>{total} events available</Typography>
								</Stack>
							</Stack>
						)}
					</Stack>
				</Stack>
			</div>
		);
	}
};

MyEvents.defaultProps = {
	initialInput: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		search: {
			eventStatus: 'ACTIVE',
		},
	},
};

export default MyEvents;
