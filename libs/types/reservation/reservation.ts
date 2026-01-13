import { EventStatus, PaymentMethod, PaymentStatus } from '../../enums/event.enum';

export interface ContactPerson {
	fullName: string;
	email: string;
	phone: string;
}

export interface PaymentInfoResponse {
	cardholderName?: string;
	cardLastFour?: string;
}

export interface Reservation {
	_id: string;
	eventId: string;
	slotId: string;
	memberId: string;
	reservationDate: Date;
	numberOfPeople: number;
	contactPerson: ContactPerson;
	pricePerPerson: number;
	totalAmount: number;
	paymentMethod: PaymentMethod;
	paymentInfo?: PaymentInfoResponse;
	paymentStatus: PaymentStatus;
	paymentProcessedAt?: Date;
	status: EventStatus;
	bookingReference: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface ReservationStatistics {
	totalBookings: number;
	totalRevenue: number;
	pendingPayments: number;
	totalGuests: number;
}

export interface AgentReservationsResponse {
	list: Reservation[];
	total: number;
	page: number;
	totalPages: number;
}

export interface Reservations {
	list: Reservation[];
	metaCounter?: { total: number }[];
}
