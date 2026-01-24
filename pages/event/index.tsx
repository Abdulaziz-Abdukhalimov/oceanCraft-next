import React, { useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Stack, Box, Typography, Button, Menu, MenuItem, IconButton, Pagination } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import { useQuery, useMutation } from '@apollo/client';
import { GET_EVENTS } from '../../apollo/user/query';
import { LIKE_TARGET_EVENT } from '../../apollo/user/mutation';
import { Event } from '../../libs/types/event/event';
import { EventsInquiry } from '../../libs/types/event/event.input';
import { EventCategory, EventAvailabilityStatus } from '../../libs/enums/event.enum';
import { T } from '../../libs/types/common';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import EventFilter from '../../libs/components/event/EventFilter';
import { useReactiveVar } from '@apollo/client';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { Direction, Message } from '../../libs/enums/common.enum';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StarIcon from '@mui/icons-material/Star';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import withLayoutMain from '../../libs/components/layout/LayoutHome';
import { userVar } from '../../apollo/store';
import EventCard from '../../libs/components/event/EventCard';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const EventListPage: NextPage = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [topEvents, setTopEvents] = useState<Event[]>([]);

	// Initial filter
	const [searchFilter, setSearchFilter] = useState<EventsInquiry>({
		page: 1,
		limit: 4,
		sort: 'createdAt',
		direction: Direction.DESC,
		search: {},
	});

	const [sortAnchor, setSortAnchor] = useState<null | HTMLElement>(null);
	const sortOpen = Boolean(sortAnchor);
	const [sortLabel, setSortLabel] = useState('recommended');

	/** APOLLO REQUESTS **/
	const [likeTargetEvent] = useMutation(LIKE_TARGET_EVENT);

	const {
		loading: getEventsLoading,
		data: getEventsData,
		error: getEventsError,
		refetch: getEventsRefetch,
	} = useQuery(GET_EVENTS, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
	});

	/** HANDLERS **/
	const likeEventHandler = async (user: T, id: string) => {
		if (!id) return;
		if (!user?._id) {
			sweetMixinErrorAlert(Message.NOT_AUTHENTICATED);
			return;
		}

		setTopEvents((prev) =>
			prev.map((event) => {
				if (event._id !== id) return event;

				const currentLike = event.meLiked?.[0];

				return {
					...event,
					meLiked: currentLike
						? [
								{
									...currentLike,
									myFavorite: !currentLike.myFavorite,
								},
						  ]
						: [
								{
									myFavorite: true,
									memberId: user._id,
									likeRefId: event._id,
								},
						  ],
				};
			}),
		);

		try {
			await likeTargetEvent({ variables: { input: id } });
		} catch (err: any) {
			console.log('ERROR, likeEventHandler:', err.message);
		}
	};

	const handleSortClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setSortAnchor(event.currentTarget);
	};

	const handleSortClose = () => {
		setSortAnchor(null);
	};

	const handleSortChange = (sort: string, direction: string, label: string) => {
		setSearchFilter({
			...searchFilter,
			sort: sort,
			direction: direction as any,
			page: 1,
		});
		setSortLabel(label);
		handleSortClose();
	};

	const handlePaginationChange = (event: React.ChangeEvent<unknown>, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	if (device === 'mobile') {
		return <h1>EVENT LIST MOBILE</h1>;
	}

	const events = getEventsData?.getEvents?.list || [];
	const total = getEventsData?.getEvents?.metaCounter?.total || 0;
	const totalPages = Math.ceil(total / searchFilter.limit);

	return (
		<div id="event-list-page">
			<div className="container">
				<Stack className="event-page">
					{/* Top Section - Filters & Sort */}
					<Stack className="top-section">
						{/* Left - Filters */}
						<EventFilter searchFilter={searchFilter} setSearchFilter={setSearchFilter} initialInput={searchFilter} />

						{/* Right - Sort */}
						<Stack className="sort-section">
							<Typography className="sort-label">Sort by</Typography>
							<Button className="sort-btn" onClick={handleSortClick} endIcon={<KeyboardArrowDownIcon />}>
								{sortLabel}
							</Button>
							<Menu anchorEl={sortAnchor} open={sortOpen} onClose={handleSortClose} className="sort-menu">
								<MenuItem onClick={() => handleSortChange('eventRank', 'DESC', ' recommended')}>recommended</MenuItem>
								<MenuItem onClick={() => handleSortChange('createdAt', 'DESC', 'Newest')}>Newest</MenuItem>
								<MenuItem onClick={() => handleSortChange('eventPrice', 'ASC', 'Price: Low to High')}>
									Price: Low to High
								</MenuItem>
								<MenuItem onClick={() => handleSortChange('eventPrice', 'DESC', 'Price: High to Low')}>
									Price: High to Low
								</MenuItem>
							</Menu>
						</Stack>
					</Stack>

					{/* Results Count */}
					<Typography className="results-count">
						{events.length} {total === 1 ? 'activity' : 'activities'}
					</Typography>

					{/* Events Grid */}
					<Stack className="events-grid">
						{getEventsLoading ? (
							<Typography>Loading...</Typography>
						) : events.length > 0 ? (
							events.map((event: Event) => {
								return <EventCard event={event} likeEventHandler={likeEventHandler} />;
							})
						) : (
							<Typography>No events found</Typography>
						)}
					</Stack>

					{/* Pagination */}
					{totalPages > 1 && (
						<Stack className="pagination-section">
							<Pagination
								count={totalPages}
								page={searchFilter.page}
								onChange={handlePaginationChange}
								color="primary"
								size="large"
							/>
						</Stack>
					)}
				</Stack>
			</div>
		</div>
	);
};

export default withLayoutMain(EventListPage);
