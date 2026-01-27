import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Stack, Container, CircularProgress, Typography } from '@mui/material';
import { useQuery } from '@apollo/client';
import { GET_EVENT, GET_EVENT_AVAILABILITY } from '../../apollo/user/query';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutMain from '../../libs/components/layout/LayoutHome';
import EventDetailContent from '../../libs/components/event/EventDetailContent';
import EventBookingSection from '../../libs/components/event/EventBooking';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const EventDetail: NextPage = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const { id } = router.query;

	/** APOLLO REQUESTS **/
	const {
		loading: eventLoading,
		data: eventData,
		error: eventError,
		refetch: eventRefetch,
	} = useQuery(GET_EVENT, {
		fetchPolicy: 'cache-and-network',
		variables: { input: id },
		skip: !id,
		notifyOnNetworkStatusChange: true,
	});

	const {
		loading: availabilityLoading,
		data: availabilityData,
		refetch: availabilityRefetch,
	} = useQuery(GET_EVENT_AVAILABILITY, {
		fetchPolicy: 'cache-and-network',
		variables: { input: id },
		skip: !id,
		notifyOnNetworkStatusChange: true,
	});

	//
	if (device === 'mobile') {
		return <div>MOBILE EVENT DETAIL</div>;
	}

	/** LOADING STATE **/
	if (eventLoading) {
		return (
			<Container
				maxWidth="xl"
				sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}
			>
				<CircularProgress size={60} />
			</Container>
		);
	}

	/** ERROR STATE **/
	if (eventError || !eventData?.getEvent) {
		return (
			<Container
				maxWidth="xl"
				sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}
			>
				<Typography variant="h5">Event not found</Typography>
			</Container>
		);
	}

	const event = eventData.getEvent;
	const availableDates = availabilityData?.getAvailableDates || [];

	return (
		<div id="event-detail-page">
			<Container maxWidth="xl">
				<Stack className="event-detail-wrapper">
					<Stack className="event-detail-content">
						<EventDetailContent event={event} eventRefetch={eventRefetch} />

						<EventBookingSection
							event={event}
							availableDates={availableDates}
							availabilityLoading={availabilityLoading}
							eventRefetch={eventRefetch}
						/>
					</Stack>
				</Stack>
			</Container>
		</div>
	);
};

export default withLayoutMain(EventDetail);
