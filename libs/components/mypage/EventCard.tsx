import { Menu, MenuItem, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import IconButton from '@mui/material/IconButton';
import ModeIcon from '@mui/icons-material/Mode';
import DeleteIcon from '@mui/icons-material/Delete';
import { Event } from '../../types/event/event';
import { formatterStr } from '../../utils';
import Moment from 'react-moment';
import { useRouter } from 'next/router';
import { EventStatus } from '../../enums/event.enum';

interface EventCardProps {
	event: Event;
	deleteEventHandler?: any;
	memberPage?: boolean;
	updateEventHandler?: any;
	likeEventHandler?: (user: any, id: string) => void;
	myFavorites?: boolean;
}

export const EventCard = (props: EventCardProps) => {
	const { event, deleteEventHandler, memberPage, updateEventHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	/** HANDLERS **/
	const pushEditEvent = async (id: string) => {
		await router.push({
			pathname: '/mypage',
			query: { category: 'addEvent', eventId: id },
		});
	};

	const pushEventDetail = async (id: string) => {
		if (memberPage) {
			await router.push({
				pathname: '/event/detail',
				query: { id: id },
			});
		} else return;
	};

	const handleClick = (event: any) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'ACTIVE':
				return { bg: '#e8f5e9', color: '#2e7d32' };
			case 'PENDING':
				return { bg: '#fff3e0', color: '#e65100' };
			case 'COMPLETED':
				return { bg: '#e3f2fd', color: '#1565c0' };
			case 'CANCELLED':
				return { bg: '#ffebee', color: '#c62828' };
			default:
				return { bg: '#f5f5f5', color: '#616161' };
		}
	};

	if (device === 'mobile') {
		return <div>MOBILE EVENT CARD</div>;
	} else {
		const statusColors = getStatusColor(event.eventStatus);

		return (
			<Stack className="event-card-box">
				<Stack className="image-box" onClick={() => pushEventDetail(event?._id)}>
					<img src={`${event.eventImages[0]}`} alt="" />
					<Stack className="information-box" onClick={() => pushEventDetail(event?._id)}>
						<Typography className="name">{event.eventTitle}</Typography>
						<Typography className="category">{event.eventCategory.replace(/_/g, ' ')}</Typography>
						<Typography className="price">
							<strong>
								{event?.eventCurrency}
								{formatterStr(event?.eventPrice)}
							</strong>
							<span className="per-person"> / person</span>
						</Typography>
					</Stack>
				</Stack>

				<Stack className="date-box">
					<Typography className="date">
						<Moment format="DD MMMM, YYYY">{event.createdAt}</Moment>
					</Typography>
				</Stack>
				<Stack className="status-box">
					<Stack className="coloured-box" sx={{ background: statusColors.bg }} onClick={handleClick}>
						<Typography className="status" sx={{ color: statusColors.color }}>
							{event.eventStatus}
						</Typography>
					</Stack>
				</Stack>
				{!memberPage && event.eventStatus === 'ACTIVE' && (
					<Menu
						anchorEl={anchorEl}
						open={open}
						onClose={handleClose}
						PaperProps={{
							elevation: 0,
							sx: {
								width: '120px',
								mt: 1,
								ml: '10px',
								overflow: 'visible',
								filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
							},
							style: {
								padding: 0,
								display: 'flex',
								justifyContent: 'center',
							},
						}}
					>
						<MenuItem
							disableRipple
							onClick={() => {
								handleClose();
								updateEventHandler(EventStatus.COMPLETED, event?._id);
							}}
						>
							Complete
						</MenuItem>
						<MenuItem
							disableRipple
							onClick={() => {
								handleClose();
								updateEventHandler(EventStatus.CANCELLED, event?._id);
							}}
						>
							Cancel
						</MenuItem>
					</Menu>
				)}

				<Stack className="views-box">
					<Typography className="views">{event.eventViews.toLocaleString()}</Typography>
				</Stack>
				{!memberPage && event.eventStatus === EventStatus.ACTIVE && (
					<Stack className="action-box">
						<IconButton className="icon-button" onClick={() => pushEditEvent(event._id)}>
							<ModeIcon className="buttons" />
						</IconButton>
						<IconButton className="icon-button" onClick={() => deleteEventHandler(event._id)}>
							<DeleteIcon className="buttons" />
						</IconButton>
					</Stack>
				)}
			</Stack>
		);
	}
};
