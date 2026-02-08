import React, { useEffect, useState } from 'react';
import { Badge, IconButton, Menu, MenuItem, Box, Typography, Divider, Button, Avatar } from '@mui/material';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { useRouter } from 'next/router';
import { formatDistanceToNow } from 'date-fns';
import { useNotifications } from '../../hooks/useNotifications';
import { NotificationGroup, NotificationStatus, NotificationType } from '../../enums/notification.enum';

const NotificationDropdown = () => {
	const router = useRouter();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const { notifications, unreadCount, isConnected, markAsRead, markAllAsRead } = useNotifications();

	useEffect(() => {
		console.log('🔍 NotificationDropdown - notifications:', notifications);
		console.log('🔍 NotificationDropdown - unreadCount:', unreadCount);
	}, [notifications, unreadCount]);

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleNotificationClick = async (notification: any) => {
		// Mark as read
		if (notification.notificationStatus === 'WAIT') {
			await markAsRead(notification._id);
		}

		// Navigate based on notification type
		if (notification.notificationGroup === NotificationGroup.PRODUCT && notification.notifRefId) {
			router.push(`/product/${notification.notifRefId}`);
		} else if (notification.notificationGroup === NotificationGroup.EVENT && notification.notifRefId) {
			router.push(`/event/${notification.notifRefId}`);
		}

		handleClose();
	};

	const handleMarkAllAsRead = async () => {
		await markAllAsRead();
	};

	const getNotificationIcon = (type: NotificationType) => {
		switch (type) {
			case NotificationType.PRODUCT_INQUIRY:
				return '💬';
			case NotificationType.EVENT_BOOKING_RECEIVED:
				return '📅';
			case NotificationType.LIKE:
				return '❤️';
			case NotificationType.COMMENT:
				return '💭';
			case NotificationType.MEMBER_FOLLOW:
				return '👤';
			default:
				return '🔔';
		}
	};

	return (
		<>
			<IconButton onClick={handleClick} className={'notification-icon-btn'}>
				<Badge badgeContent={unreadCount} color="error" max={99}>
					<NotificationsOutlinedIcon />
				</Badge>
				{/* Connection indicator */}
				{/* {isConnected && <span className={'connection-dot'}></span>} */}
			</IconButton>

			<Menu
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				className={'notification-menu'}
				PaperProps={{
					sx: {
						width: 500,
						maxHeight: 500,
						mt: 1.5,
					},
				}}
			>
				{/* Header */}
				<Box className={'notification-header'}>
					<Typography variant="h6">Notifications</Typography>
					{unreadCount > 0 && (
						<Button size="small" onClick={handleMarkAllAsRead}>
							Mark all as read
						</Button>
					)}
				</Box>
				<Divider />

				{/* Notification List */}
				<Box className={'notification-list'}>
					{notifications.filter((n) => n.notificationStatus === NotificationStatus.WAIT).length === 0 ? (
						<Box className={'empty-state'}>
							<NotificationsOutlinedIcon sx={{ fontSize: 48, color: '#ccc' }} />
							<Typography color="textSecondary">No notifications yet</Typography>
						</Box>
					) : (
						notifications
							.filter((n) => n.notificationStatus == NotificationStatus.WAIT)
							.slice(0, 10)
							.map((notification) => (
								<MenuItem
									key={notification._id}
									onClick={() => handleNotificationClick(notification)}
									className={`notification-item ${notification.notificationStatus === 'WAIT' ? 'unread' : ''}`}
								>
									<Box className={'notification-content'}>
										<Avatar
											src={
												notification.authorData?.memberImage
													? `${notification.authorData.memberImage[0]}`
													: '/img/default-avatar.png'
											}
											sx={{ width: 40, height: 40, mr: 1.5 }}
										/>

										<Box flex={1}>
											<Box display="flex" alignItems="center" gap={0.5}>
												<span className={'notification-emoji'}>
													{getNotificationIcon(notification.notificationType)}
												</span>
												<Typography variant="body2" fontWeight={notification.notificationStatus === 'WAIT' ? 600 : 400}>
													{notification.notificationTitle}
												</Typography>
											</Box>

											{notification.notificationDesc && (
												<Typography variant="caption" color="textSecondary" display="block" mt={0.5}>
													{notification.notificationDesc}
												</Typography>
											)}

											{notification.productData && (
												<Box className={'preview-card'}>
													<img src={notification.productData.productImages[0]} alt="" />
													<Typography variant="caption">{notification.productData.productTitle}</Typography>
												</Box>
											)}

											{notification.eventData && (
												<Box className={'preview-card'}>
													<img src={notification?.eventData?.eventImages[0]} alt="" />
													<Typography variant="caption">{notification?.eventData?.eventTitle}</Typography>
												</Box>
											)}

											<Typography variant="caption" color="textSecondary" display="block" mt={0.5}>
												{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
											</Typography>
										</Box>

										{notification.notificationStatus === 'WAIT' && <span className={'unread-dot'}></span>}
									</Box>
								</MenuItem>
							))
					)}
				</Box>

				{notifications.length > 0 && <Divider />}
				{notifications.length > 0 && (
					<Box className={'notification-footer'}>
						<Button fullWidth onClick={() => router.push('/mypage?tab=notifications')}>
							View all notifications
						</Button>
					</Box>
				)}
			</Menu>
		</>
	);
};

export default NotificationDropdown;
