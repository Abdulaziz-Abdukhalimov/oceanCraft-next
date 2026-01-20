import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import { useMutation, useQuery } from '@apollo/client';
import { T } from '../../types/common';
import { Event } from '../../types/event/event';
import { EventsInquiry } from '../../types/event/event.input';
import { Message } from '../../enums/common.enum';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { LIKE_TARGET_EVENT } from '../../../apollo/user/mutation';
import { GET_EVENTS } from '../../../apollo/user/query';
import TopEventCard from './TopEventCard';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface TopEventsProps {
	initialInput: EventsInquiry;
}

const TopEvents = (props: TopEventsProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [topEvents, setTopEvents] = useState<Event[]>([]);

	/** APOLLO REQUESTS **/
	const [likeTargetEvent] = useMutation(LIKE_TARGET_EVENT);

	const {
		loading: getEventsLoading,
		data: getEventsData,
		error: getEventsError,
		refetch: getEventsRefetch,
	} = useQuery(GET_EVENTS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			console.log('Top Events loaded:', data?.getEvents?.list);
			setTopEvents(data?.getEvents?.list);
		},
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

	if (getEventsLoading) {
		return (
			<Stack className={'top-events'}>
				<Stack className={'container'}>
					<Box>Loading events...</Box>
				</Stack>
			</Stack>
		);
	}

	if (getEventsError) {
		console.error('Events Error:', getEventsError);
		return null;
	}

	if (!topEvents || topEvents.length === 0) {
		console.log('No events to display');
		return null;
	}

	if (device === 'mobile') {
		return (
			<Stack className={'top-events'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span className={'title'}>Top Events</span>
					</Stack>
					<Stack className={'card-box'}>
						<Swiper
							className={'top-event-swiper'}
							slidesPerView={'auto'}
							centeredSlides={true}
							spaceBetween={15}
							modules={[Autoplay]}
							autoplay={{
								delay: 3000,
								disableOnInteraction: false,
							}}
						>
							{topEvents.map((event: Event) => {
								return (
									<SwiperSlide className={'top-event-slide'} key={event?._id}>
										<TopEventCard event={event} likeEventHandler={likeEventHandler} />
									</SwiperSlide>
								);
							})}
						</Swiper>
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'top-events'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span className={'title'}>최고의 수상 스포츠 행사 및 활동</span>
							<p className={'subtitle'}>가장 인기 있는 요트 투어와 수상 스포츠 체험을 만나보세요.</p>
						</Box>
						<Box component={'div'} className={'right'}>
							<div className={'pagination-box'}>
								<WestIcon className={'swiper-top-prev'} />
								<div className={'swiper-top-pagination'}></div>
								<EastIcon className={'swiper-top-next'} />
							</div>
						</Box>
					</Stack>
					<Stack className={'card-box'}>
						<Swiper
							className={'top-event-swiper'}
							slidesPerView={'auto'}
							spaceBetween={20}
							modules={[Autoplay, Navigation, Pagination]}
							navigation={{
								nextEl: '.swiper-top-next',
								prevEl: '.swiper-top-prev',
							}}
							pagination={{
								el: '.swiper-top-pagination',
								clickable: true,
							}}
							autoplay={{
								delay: 4000,
								disableOnInteraction: false,
							}}
							breakpoints={{
								1200: {
									slidesPerView: 4,
									spaceBetween: 20,
								},
								768: {
									slidesPerView: 3,
									spaceBetween: 15,
								},
								576: {
									slidesPerView: 2,
									spaceBetween: 10,
								},
							}}
						>
							{topEvents.map((event: Event) => {
								return (
									<SwiperSlide className={'top-event-slide'} key={event?._id} style={{ width: '280px' }}>
										<TopEventCard event={event} likeEventHandler={likeEventHandler} />
									</SwiperSlide>
								);
							})}
						</Swiper>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

TopEvents.defaultProps = {
	initialInput: {
		page: 1,
		limit: 4,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default TopEvents;
