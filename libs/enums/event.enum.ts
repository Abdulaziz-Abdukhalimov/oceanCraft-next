export enum EventCategory {
	YACHT_TOUR = 'YACHT_TOUR',
	JETSKI_RENTAL = 'JETSKI_RENTAL',
	SURFING = 'SURFING',
	DIVING = 'DIVING',
}

export enum EventCurrency {
	USD = 'USD',
	KRW = 'KRW',
	EUR = 'EUR',
}

export enum EventAvailabilityStatus {
	AVAILABLE = 'AVAILABLE',
	LIMITED = 'LIMITED',
	FULL = 'FULL',
}

export enum EventStatus {
	PENDING = 'PENDING',
	APPROVED = 'APPROVED',
	REJECTED = 'REJECTED',
	ACTIVE = 'ACTIVE',
	CANCELLED = 'CANCELLED',
	COMPLETED = 'COMPLETED',
	CONFIRMED = 'CONFIRMED',
	DELETED = 'DELETED',
}

export enum EventScheduleType {
	RECURRING = 'RECURRING',
	ONE_TIME = 'ONE_TIME',
}

export enum EventDayOfWeek {
	MONDAY = 'MONDAY',
	TUESDAY = 'TUESDAY',
	WEDNESDAY = 'WEDNESDAY',
	THURSDAY = 'THURSDAY',
	FRIDAY = 'FRIDAY',
	SATURDAY = 'SATURDAY',
	SUNDAY = 'SUNDAY',
}

export enum EventExperienceLevel {
	BEGINNER = 'BEGINNER',
	INTERMEDIATE = 'INTERMEDIATE',
	ADVANCED = 'ADVANCED',
	ALL_LEVELS = 'ALL_LEVELS',
}

export enum PaymentMethod {
	CASH = 'CASH',
	CARD = 'CARD',
}

export enum PaymentStatus {
	PENDING = 'PENDING',
	PAID = 'PAID',
}
