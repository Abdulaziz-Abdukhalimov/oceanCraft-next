import { NotificationGroup, NotificationStatus, NotificationType } from '../../enums/notification.enum';

export interface NotificationInquiry {
	page: number;
	limit: number;
	notificationStatus?: NotificationStatus;
}

export interface CreateNotificationInput {
	receiverId: string;
	authorId: string;
	notificationType: NotificationType;
	notificationGroup: NotificationGroup;
	notificationTitle: string;
	notificationDesc?: string;
	notifRefId?: string;
}
