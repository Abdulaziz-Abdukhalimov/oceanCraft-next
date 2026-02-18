import { InquiryStatus, PreferredContactMethod } from '../../enums/productInquiry.enum';

export interface ContactPersonInput {
	fullName: string;
	email: string;
	phone: string;
}

export interface CreateInquiryInput {
	productId: string;
	contactPerson: ContactPersonInput;
	inquiryMessage: string;
	preferredContactMethod?: PreferredContactMethod;
}

export interface ReplyInquiryInput {
	inquiryId: string;
	sellerReply: string;
}

export interface UpdateInquiryStatusInput {
	inquiryId: string;
}

export interface InquiryFilter {
	status?: InquiryStatus;
	productId?: string;
	isRead?: boolean;
}

export interface InquiriesInput {
	page: number;
	limit: number;
	filter: InquiryFilter;
}
