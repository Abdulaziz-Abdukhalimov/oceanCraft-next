import { NotificationGroup, NotificationStatus, NotificationType } from '../../enums/notification.enum';
import { Member } from '../member/member';
import { Product, TotalCounter } from '../product/product';

export interface Notification {
	_id: string;
	notificationType: NotificationType;
	notificationStatus: NotificationStatus;
	notificationGroup: NotificationGroup;
	notificationTitle: string;
	notificationDesc?: string;
	authorId: string;
	receiverId: string;
	notifRefId?: string;
	readAt?: Date;
	createdAt: Date;
	updatedAt: Date;

	// Populated fields (from aggregation)
	authorData?: Member;
	productData?: Product;
	eventData?: Event;
}

export interface NotificationsResponse {
	list: Notification[];
	metaCounter?: TotalCounter[];
}

export interface NotificationActionResponse {
	success: boolean;
	message?: string;
}
