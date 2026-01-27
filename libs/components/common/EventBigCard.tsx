import React from 'react';
import { Stack, Box, Typography } from '@mui/material';
import Link from 'next/link';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import CallIcon from '@mui/icons-material/Call';
import EmailIcon from '@mui/icons-material/Email';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ShareIcon from '@mui/icons-material/Share';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import useDeviceDetect from '../../hooks/useDeviceDetect';

interface EventCardProps {
	event: any;
	likeEventHandler?: any;
}

const EventBigCard = (props: EventCardProps) => {
	const { event, likeEventHandler } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const imagePath = event?.eventImages?.[0] || '/img/banner/default.jpg';

	if (device === 'mobile') {
		return <div>EVENT CARD MOBILE</div>;
	}

	return (
		<Stack className="listing-card">
			<Box className={'card-container'}>
				{/* Left Side - Image */}
				<Link href={`/event/${event._id}`}>
					<Box className={'listing-img'} style={{ backgroundImage: `url(${imagePath})` }}>
						<Box className={'badge featured'}>{event?.eventCategory}</Box>
					</Box>
				</Link>

				{/* Right Side - Info */}
				<Stack className={'listing-info'}>
					<Link href={`/event/${event._id}`}>
						<Box className={'info-top'}>
							<Typography className={'category'}>{event?.businessName}</Typography>
							<Typography className={'price'}>
								{event?.eventCurrency} {event?.eventPrice?.toLocaleString()}
							</Typography>
							<Typography className={'title'}>{event?.eventTitle}</Typography>
							<Typography className={'location'}>
								<span className={'icon'}>📍</span>
								{event?.eventLocation?.city || 'Location not specified'}
							</Typography>
						</Box>
					</Link>

					{/* Specs */}
					<Box className={'specs'}>
						{event?.eventDurationMinutes && (
							<Box className={'spec-item'}>
								<span className={'icon'}>⏱️</span>
								<span>{event.eventDurationMinutes} mins</span>
							</Box>
						)}
						{event?.eventCapacity && (
							<Box className={'spec-item'}>
								<span className={'icon'}>👥</span>
								<span>{event.eventCapacity} people</span>
							</Box>
						)}
						{event?.eventPeriod?.startDate && (
							<Box className={'spec-item'}>
								<span className={'icon'}>📅</span>
								<span>{new Date(event.eventPeriod.startDate).toLocaleDateString()}</span>
							</Box>
						)}
					</Box>

					{/* Footer - Agent & Actions */}
					<Box className={'listing-footer'}>
						<Box className={'agent-info'}>
							<img
								src={event?.businessData?.memberImage || '/img/profile/defaultUser.svg'}
								alt={event?.businessData?.memberNick}
								className={'agent-avatar'}
							/>
							<Box className={'agent-details'}>
								<Typography className={'agent-name'}>
									{event?.businessData?.memberFullName || event?.businessData?.memberNick}
								</Typography>
								<Typography className={'agent-time'}>3 years ago</Typography>
							</Box>
						</Box>

						<Box className={'action-buttons'}>
							<IconButton className={'action-btn'}>
								<CallIcon />
							</IconButton>
							<IconButton className={'action-btn'}>
								<EmailIcon />
							</IconButton>
							<IconButton className={'action-btn'}>
								<WhatsAppIcon />
							</IconButton>
							<IconButton className={'action-btn'}>
								<ShareIcon />
							</IconButton>
							{likeEventHandler && (
								<IconButton className={'action-btn'} onClick={() => likeEventHandler(user, event._id)}>
									{event?.meLiked?.[0]?.myFavorite ? <FavoriteIcon color="primary" /> : <FavoriteBorderIcon />}
								</IconButton>
							)}
							<IconButton className={'action-btn'}>
								<RemoveRedEyeIcon />
							</IconButton>
						</Box>
					</Box>
				</Stack>
			</Box>
		</Stack>
	);
};

export default EventBigCard;
