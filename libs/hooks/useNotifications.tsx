import { useEffect, useState } from 'react';
import { useSocket } from '../context/SocketContext';
import { useMutation, useQuery } from '@apollo/client';
import { Notification as NotificationType } from '../types/notification/notification';
import { GET_MY_NOTIFICATIONS, GET_UNREAD_COUNT } from '../../apollo/user/query';
import { MARK_ALL_AS_READ, MARK_AS_READ } from '../../apollo/user/mutation';
import { NotificationStatus } from '../enums/notification.enum';

export const useNotifications = () => {
	const { socket, isConnected } = useSocket();
	const [notifications, setNotifications] = useState<NotificationType[]>([]);
	const [unreadCount, setUnreadCount] = useState(0);

	// Fetch initial unread count
	const { data: countData, refetch: refetchCount } = useQuery(GET_UNREAD_COUNT, {
		fetchPolicy: 'network-only',
		skip: false, // Always fetch
	});

	// Fetch notification list
	const { data: notifData, refetch: refetchNotifications } = useQuery(GET_MY_NOTIFICATIONS, {
		variables: {
			input: {
				page: 1,
				limit: 20,
				notificationStatus: NotificationStatus.WAIT,
			},
		},
		fetchPolicy: 'network-only',
		skip: false, // Always fetch
	});

	// Mark as read mutation
	const [markAsReadMutation] = useMutation(MARK_AS_READ);
	const [markAllAsReadMutation] = useMutation(MARK_ALL_AS_READ);

	// Update state when data loads
	useEffect(() => {
		if (countData?.getUnreadNotificationCount !== undefined) {
			console.log('📊 Unread count:', countData.getUnreadNotificationCount);
			setUnreadCount(countData.getUnreadNotificationCount);
		}
	}, [countData]);

	useEffect(() => {
		if (notifData?.getMyNotifications?.list) {
			console.log('📋 Notifications loaded:', notifData.getMyNotifications.list);
			setNotifications(notifData.getMyNotifications.list);
		}
	}, [notifData]);

	// Listen for real-time notifications via Socket.IO
	useEffect(() => {
		if (!socket) return;

		const handleNewNotification = (notification: NotificationType) => {
			console.log('🔔 New notification received via Socket.IO:', notification);

			// Add to notifications list at the beginning
			setNotifications((prev) => [notification, ...prev]);

			// Increment unread count
			setUnreadCount((prev) => prev + 1);

			// Optional: Show browser notification
			if (Notification.permission === 'granted') {
				new Notification(notification.notificationTitle, {
					body: notification.notificationDesc,
					icon: '/logo.png',
				});
			}

			// Optional: Play sound
			// const audio = new Audio('/notification-sound.mp3');
			// audio.play().catch(console.error);
		};

		socket.on('newNotification', handleNewNotification);

		// Cleanup
		return () => {
			socket.off('newNotification', handleNewNotification);
		};
	}, [socket]);

	// Request browser notification permission
	useEffect(() => {
		if (Notification.permission === 'default') {
			Notification.requestPermission();
		}
	}, []);

	// Mark single notification as read
	const markAsRead = async (notificationId: string) => {
		try {
			await markAsReadMutation({
				variables: { notificationId },
			});

			// Update local state
			setNotifications((prev) =>
				prev.map((n) =>
					n._id === notificationId ? { ...n, notificationStatus: NotificationStatus.READ, readAt: new Date() } : n,
				),
			);
			setUnreadCount((prev) => Math.max(0, prev - 1));

			// Refetch to sync with server
			await refetchCount();
		} catch (error) {
			console.error('Error marking as read:', error);
		}
	};

	// Mark all as read
	const markAllAsRead = async () => {
		try {
			const result = await markAllAsReadMutation();
			const count = result.data?.markAllNotificationsAsRead || 0;

			// Update local state
			setNotifications((prev) =>
				prev.map((n) => ({
					...n,
					notificationStatus: NotificationStatus.READ,
					readAt: new Date(),
				})),
			);
			setUnreadCount(0);

			console.log(`✅ Marked ${count} notifications as read`);

			// Refetch to sync with server
			await refetchNotifications();
		} catch (error) {
			console.error('Error marking all as read:', error);
		}
	};

	return {
		notifications,
		unreadCount,
		isConnected,
		markAsRead,
		markAllAsRead,
		refetchNotifications,
		refetchCount,
	};
};
