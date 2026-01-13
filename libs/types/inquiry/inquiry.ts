import { InquiryStatus, PreferredContactMethod } from '../../enums/productInquiry.enum';
import { TotalCounter } from '../product/product';
import { ContactPerson } from '../reservation/reservation';

export interface Inquiry {
	_id: string;
	buyerId: string;
	sellerId: string;
	productId: string;
	contactPerson: ContactPerson;
	inquiryMessage: string;
	preferredContactMethod: PreferredContactMethod;
	sellerReply?: string;
	status: InquiryStatus;
	isRead: boolean;
	viewedAt?: Date;
	respondedAt?: Date;
	closedAt?: Date;
	createdAt: Date;
	updatedAt: Date;
}

export interface InquiriesResponse {
	list: Inquiry[];
	metaCounter?: TotalCounter;
}

export interface InquiryResponse {
	data?: Inquiry;
	message?: string;
}
