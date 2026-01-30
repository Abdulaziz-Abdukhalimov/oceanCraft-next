import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { Box, List, ListItem, Stack } from '@mui/material';
import { TabContext } from '@mui/lab';
import TablePagination from '@mui/material/TablePagination';
import { sweetConfirmAlert, sweetErrorHandling } from '../../../libs/sweetAlert';
import { T } from '../../../libs/types/common';
import { UPDATE_EVENT_BY_ADMIN } from '../../../apollo/admin/mutation';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ALL_EVENTS_BY_ADMIN, GET_ALL_PRODUCT_BY_ADMIN } from '../../../apollo/admin/query';
import { AllProductsInquiry } from '../../../libs/types/product/product.input';
import { Product } from '../../../libs/types/product/product';
import { ProductStatus } from '../../../libs/enums/product.enum';
import { ProductUpdate } from '../../../libs/types/product/property.update';
import { ProductPanelList } from '../../../libs/components/admin/products/ProductList';
import { AllEventsInquiry } from '../../../libs/types/event/event.input';
import { Event } from '../../../libs/types/event/event';
import { EventStatus } from '../../../libs/enums/event.enum';
import { EventUpdate } from '../../../libs/types/event/event.update';
import { EventPanelList } from '../../../libs/components/admin/events/EventList';

const AdminEvents: NextPage = ({ initialInquiry, ...props }: any) => {
	const [anchorEl, setAnchorEl] = useState<[] | HTMLElement[]>([]);
	const [eventsInquiry, setEventsInquiry] = useState<AllEventsInquiry>(initialInquiry);
	const [events, setEvents] = useState<Event[]>([]);
	const [eventsTotal, setEventsTotal] = useState<number>(0);
	const [value, setValue] = useState(eventsInquiry?.search?.eventStatus ? eventsInquiry?.search?.eventStatus : 'ALL');
	const [searchType, setSearchType] = useState('ALL');

	/** APOLLO REQUESTS **/

	const [updateEventByAdmin] = useMutation(UPDATE_EVENT_BY_ADMIN);

	const {
		loading: getAllEventsByAdminLoading,
		data: getAllEventsByAdminData,
		error: getAllEventsByAdminError,
		refetch: getAllEventsRefetch,
	} = useQuery(GET_ALL_EVENTS_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: { input: eventsInquiry },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setEvents(data?.getAllEventsByAdmin?.list);
			setEventsTotal(data?.getAllEventsByAdmin?.metaCounter[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		getAllEventsRefetch({ input: eventsInquiry }).then();
	}, [eventsInquiry]);

	/** HANDLERS **/
	const changePageHandler = async (event: unknown, newPage: number) => {
		eventsInquiry.page = newPage + 1;
		setEventsInquiry({ ...eventsInquiry });
	};

	const changeRowsPerPageHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
		eventsInquiry.limit = parseInt(event.target.value, 10);
		eventsInquiry.page = 1;
		setEventsInquiry({ ...eventsInquiry });
	};

	const menuIconClickHandler = (e: any, index: number) => {
		const tempAnchor = anchorEl.slice();
		tempAnchor[index] = e.currentTarget;
		setAnchorEl(tempAnchor);
	};

	const menuIconCloseHandler = () => {
		setAnchorEl([]);
	};

	const tabChangeHandler = async (event: any, newValue: string) => {
		setValue(newValue);

		setEventsInquiry({ ...eventsInquiry, page: 1, sort: 'createdAt' });

		switch (newValue) {
			case 'ACTIVE':
				setEventsInquiry({ ...eventsInquiry, search: { eventStatus: EventStatus.ACTIVE } });
				break;
			case 'COMPLETED':
				setEventsInquiry({ ...eventsInquiry, search: { eventStatus: EventStatus.COMPLETED } });
				break;
			case 'DELETED':
				setEventsInquiry({ ...eventsInquiry, search: { eventStatus: EventStatus.DELETED } });
				break;
			case 'CANCELLED':
				setEventsInquiry({ ...eventsInquiry, search: { eventStatus: EventStatus.CANCELLED } });
				break;
			default:
				delete eventsInquiry?.search?.eventStatus;
				setEventsInquiry({ ...eventsInquiry });
				break;
		}
	};

	// const removeEventHandler = async (id: string) => {
	// 	try {
	// 		if (await sweetConfirmAlert('Are you sure to remove?')) {
	// 			await removeEventByAdmin({ variables: { input: id } });
	// 		}

	// 		await getAllProductsRefetch({ input: productsInquiry });
	// 		menuIconCloseHandler();
	// 	} catch (err: any) {
	// 		sweetErrorHandling(err).then();
	// 	}
	// };

	// const searchTypeHandler = async (newValue: string) => {
	// 	try {
	// 		setSearchType(newValue);

	// 		if (newValue !== 'ALL') {
	// 			setProductsInquiry({
	// 				...productsInquiry,
	// 				page: 1,
	// 				sort: 'createdAt',
	// 				search: {
	// 					...productsInquiry.search,
	// 					propertyLocationList: [newValue as PropertyLocation],
	// 				},
	// 			});
	// 		} else {
	// 			delete propertiesInquiry?.search?.propertyLocationList;
	// 			setPropertiesInquiry({ ...propertiesInquiry });
	// 		}
	// 	} catch (err: any) {
	// 		console.log('searchTypeHandler: ', err.message);
	// 	}
	// };

	const updateEventHandler = async (updateData: EventUpdate) => {
		try {
			console.log('+updateData: ', updateData);
			await updateEventByAdmin({ variables: { input: updateData } });

			menuIconCloseHandler();
			await getAllEventsRefetch({ input: eventsInquiry });
		} catch (err: any) {
			menuIconCloseHandler();
			sweetErrorHandling(err).then();
		}
	};

	return (
		<Box component={'div'} className={'content'}>
			<Box component={'div'} className={'table-wrap'}>
				<Box component={'div'} sx={{ width: '100%', typography: 'body1' }}>
					<TabContext value={value}>
						<EventPanelList
							events={events}
							anchorEl={anchorEl}
							menuIconClickHandler={menuIconClickHandler}
							menuIconCloseHandler={menuIconCloseHandler}
							updateEventHandler={updateEventHandler}
						/>

						<TablePagination
							rowsPerPageOptions={[10, 20, 40, 60]}
							component="div"
							count={eventsTotal}
							rowsPerPage={eventsInquiry?.limit}
							page={eventsInquiry?.page - 1}
							onPageChange={changePageHandler}
							onRowsPerPageChange={changeRowsPerPageHandler}
						/>
					</TabContext>
				</Box>
			</Box>
		</Box>
	);
};

AdminEvents.defaultProps = {
	initialInquiry: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default withAdminLayout(AdminEvents);
