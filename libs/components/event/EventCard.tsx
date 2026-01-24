import React from 'react';
import { useRouter } from 'next/router';
import { Stack, Box, Typography, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StarIcon from '@mui/icons-material/Star';
import { useReactiveVar } from '@apollo/client';
import { Event } from '../../types/event/event';
import { userVar } from '../../../apollo/store';

interface EventCardProps {
	event: Event;
	likeEventHandler: any;
}

const EventCard = (props: EventCardProps) => {
	const { event, likeEventHandler } = props;
	const router = useRouter();
	const user = useReactiveVar(userVar);

	/** HANDLERS **/
	const handleLikeEvent = async (e: React.MouseEvent) => {
		e.stopPropagation();
		if (likeEventHandler && user) {
			await likeEventHandler(user, event._id);
		}
	};

	const pushDetailHandler = (eventId: string) => {
		router.push({
			pathname: '/event/detail',
			query: { id: eventId },
		});
	};

	const formatDuration = (minutes: number) => {
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		if (hours === 0) return `${mins}m`;
		if (mins === 0) return `${hours}h`;
		return `${hours}h ${mins}m`;
	};

	const getImageUrl = (imagePath: string) => {
		return `${imagePath}`;
	};

	const isLiked = event?.meLiked && event?.meLiked[0]?.myFavorite;

	return (
		<Stack className="event-card">
			{/* Like Button */}
			<IconButton className={`like-btn ${isLiked ? 'liked' : ''}`} onClick={handleLikeEvent}>
				{isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
			</IconButton>

			{/* Availability Badge */}
			{event.eventAvailabilityStatus && event.eventAvailabilityStatus !== 'AVAILABLE' && (
				<Box className={`availability-badge ${event.eventAvailabilityStatus.toLowerCase()}`}>
					<Typography>{event.eventAvailabilityStatus}</Typography>
				</Box>
			)}

			{/* Event Image */}
			<Box className="card-img" onClick={() => pushDetailHandler(event._id)}>
				<img src={getImageUrl(event?.eventImages[0])} alt={event?.eventTitle} />
			</Box>

			{/* Event Info */}
			<Box className="info">
				<Typography className="title" onClick={() => pushDetailHandler(event._id)}>
					{event?.eventTitle}
				</Typography>

				<Box className="meta-info">
					<Typography className="provider">{event?.businessData?.memberNick || event?.businessName}</Typography>
					<Typography className="duration">{formatDuration(event?.eventDurationMinutes)}</Typography>
					{event?.eventCancellationPolicy && <Typography className="cancellation">Free cancellation</Typography>}
				</Box>

				<Box className="rating-box">
					<StarIcon className="star-icon" />
					<Typography className="rating">{event?.eventRank ? (event.eventRank / 10).toFixed(1) : '5.0'}</Typography>
					<Typography className="reviews">
						({event?.eventComments || 0}) • {event?.eventViews || 0}+ booked
					</Typography>
				</Box>

				<Typography className="price">
					{event?.eventCurrency === 'KRW' ? '₩' : event?.eventCurrency === 'USD' ? 'US$' : '€'}
					{event?.eventPrice?.toLocaleString()}
				</Typography>
			</Box>
		</Stack>
	);
};

export default EventCard;
