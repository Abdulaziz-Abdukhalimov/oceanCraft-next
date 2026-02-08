import { NotificationGroup, NotificationStatus, NotificationType } from '../../enums/notification.enum';
import { TotalCounter } from '../product/product';

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

	//populated data
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

export interface Member {
	_id: string;
	memberNick: string;
	memberImage?: string;
}

export interface Product {
	_id: string;
	productTitle: string;
	productImages: string[];
	productPrice: number;
}

export interface Event {
	_id: string;
	eventTitle: string;
	eventImages: string[];
	eventPrice: number;
}
