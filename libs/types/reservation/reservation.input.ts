import { EventStatus, PaymentMethod, PaymentStatus } from '../../enums/event.enum';

export interface PaymentInfo {
	cardholderName: string;
	cardNumber: string;
	expiryDate: string;
	cvv: string;
}

export interface CreateReservationInput {
	eventId: string;
	date: string;
	numberOfPeople: number;
	fullName: string;
	email: string;
	phone: string;
	paymentMethod: PaymentMethod;
	paymentInfo?: PaymentInfo;
}

export interface ReservationInquiry {
	page: number;
	limit: number;
	status?: EventStatus;
	paymentStatus?: PaymentStatus;
}

export interface AgentReservationInquiry {
	page: number;
	limit: number;
	status?: EventStatus;
	paymentStatus?: PaymentStatus;
	search?: string;
}

export interface UpdateReservationStatusInput {
	reservationId: string;
	status: EventStatus;
}
