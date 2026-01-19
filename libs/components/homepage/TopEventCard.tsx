import React from 'react';
import { Stack, Box, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { Event } from '../../types/event/event';

interface TopEventCardProps {
	event: Event;
	likeEventHandler: any;
}

const TopEventCard = (props: TopEventCardProps) => {
	const { event, likeEventHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);

	// Helper function to handle both Cloudinary and local images
	const getImageUrl = (imagePath: string) => {
		if (!imagePath) return '/img/placeholder-event.jpg';

		// If it's already a full URL (Cloudinary), use it directly
		if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
			return imagePath;
		}

		// Otherwise, use local path (assuming images are in public folder)
		return imagePath;
	};

	/** HANDLERS **/
	const pushDetailHandler = async (eventId: string) => {
		await router.push({ pathname: '/event/detail', query: { id: eventId } });
	};

	const handleLikeEvent = async (e: React.MouseEvent) => {
		e.stopPropagation();
		if (likeEventHandler && user) {
			await likeEventHandler(user, event._id);
		}
	};

	// Format duration in hours
	const formatDuration = (minutes: number) => {
		if (minutes < 60) return `Up to ${minutes} mins`;
		const hours = Math.floor(minutes / 60);
		return `Up to ${hours} hr${hours > 1 ? 's' : ''}`;
	};

	const isLiked = event?.meLiked && event?.meLiked[0]?.myFavorite;

	if (device === 'mobile') {
		return (
			<Stack className="top-event-card">
				{/* Like Button */}
				<IconButton className={`like-btn ${isLiked ? 'liked' : ''}`} onClick={handleLikeEvent}>
					{isLiked ? <FavoriteIcon style={{ color: 'red' }} /> : <FavoriteIcon />}
				</IconButton>

				{/* Event Image */}
				<Box component={'div'} className={'card-img'} onClick={() => pushDetailHandler(event._id)}>
					<img src={getImageUrl(event?.eventImages[0])} alt={event?.eventTitle} />
				</Box>

				{/* Event Info */}
				<Box component={'div'} className={'info'}>
					<Typography className={'title'} onClick={() => pushDetailHandler(event._id)}>
						{event?.eventTitle}
					</Typography>

					<Box className={'meta-info'}>
						<Typography className={'booking-info'}>{event?.businessData?.memberNick}</Typography>
						<Typography className={'duration'}>{formatDuration(event?.eventDurationMinutes)}</Typography>
					</Box>

					<Box className={'rating-box'}>
						<StarIcon className={'star-icon'} />
						<Typography className={'rating'}>{event?.eventRank ? (event.eventRank / 10).toFixed(1) : '5.0'}</Typography>
						<Typography className={'reviews'}>
							({event?.eventComments}) • {event?.eventViews}+ booked
						</Typography>
					</Box>

					<Typography className={'price'}>
						{event?.eventCurrency === 'USD' ? 'US$' : event?.eventCurrency} {event?.eventPrice}
					</Typography>
				</Box>
			</Stack>
		);
	} else {
		return (
			<Stack className="top-event-card">
				{/* Like Button */}
				<IconButton
					className={`like-btn ${isLiked ? 'liked' : ''}`}
					onClick={handleLikeEvent}
					sx={{
						'& svg': {
							color: isLiked ? '#ef4444 !important' : '#6b7280',
						},
					}}
				>
					{isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
				</IconButton>

				{/* Event Image */}
				<Box component={'div'} className={'card-img'} onClick={() => pushDetailHandler(event._id)}>
					<img src={getImageUrl(event?.eventImages[0])} alt={event?.eventTitle} />
				</Box>

				{/* Event Info */}
				<Box component={'div'} className={'info'}>
					<Typography className={'title'} onClick={() => pushDetailHandler(event._id)}>
						{event?.eventTitle}
					</Typography>

					<Box className={'meta-info'}>
						<Typography className={'booking-info'}>{event?.businessData?.memberNick}</Typography>
						<Typography className={'duration'}>{formatDuration(event?.eventDurationMinutes)}</Typography>
						{event?.eventAvailabilityStatus === 'AVAILABLE' && (
							<Typography className={'cancellation'}>Free cancellation</Typography>
						)}
					</Box>

					<Box className={'rating-box'}>
						<StarIcon className={'star-icon'} />
						<Typography className={'rating'}>{event?.eventRank ? (event.eventRank / 10).toFixed(1) : '5.0'}</Typography>
						<Typography className={'reviews'}>
							({event?.eventComments}) • {event?.eventViews}+ booked
						</Typography>
					</Box>

					<Typography className={'price'}>
						{event?.eventCurrency === 'USD' ? 'US$' : event?.eventCurrency} {event?.eventPrice}
					</Typography>
				</Box>
			</Stack>
		);
	}
};

export default TopEventCard;
