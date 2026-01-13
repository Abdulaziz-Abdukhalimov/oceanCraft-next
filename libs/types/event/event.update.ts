import {
	EventAvailabilityStatus,
	EventCategory,
	EventCurrency,
	EventDayOfWeek,
	EventExperienceLevel,
	EventScheduleType,
	EventStatus,
} from '../../enums/event.enum';

export interface EventLocationUpdate {
	city?: string;
	address?: string;
}

export interface EventTimeSlotUpdate {
	startTime?: string;
	endTime?: string;
}

export interface EventSpecificDateUpdate {
	date?: Date;
	startTime?: string;
	endTime?: string;
}

export interface EventScheduleUpdate {
	type?: EventScheduleType;
	daysOfWeek?: EventDayOfWeek[];
	timeSlots?: EventTimeSlotUpdate[];
	specificDates?: EventSpecificDateUpdate[];
}

export interface EventPeriodUpdate {
	startDate?: Date;
	endDate?: Date;
}

export interface EventContactUpdate {
	phone?: string;
	email?: string;
	telegram?: string;
}

export interface EventRequirementsUpdate {
	minAge?: number;
	maxAge?: number;
	bringItems?: string[];
	experienceLevel?: EventExperienceLevel;
}

export interface EventUpdate {
	_id: string;
	eventTitle?: string;
	eventDescription?: string;
	businessName?: string;
	eventCategory?: EventCategory;
	eventPrice?: number;
	eventCurrency?: EventCurrency;
	eventLocation?: EventLocationUpdate;
	eventSchedule?: EventScheduleUpdate;
	eventPeriod?: EventPeriodUpdate;
	eventRegistrationDeadline?: Date;
	eventContact?: EventContactUpdate;
	eventImages?: string[];
	eventAvailabilityStatus?: EventAvailabilityStatus;
	eventStatus?: EventStatus;
	eventCapacity?: number;
	eventDurationMinutes?: number;
	eventRequirements?: EventRequirementsUpdate;
	eventNotes?: string;
	eventCancellationPolicy?: string;
	rejectedAt?: Date;
	deletedAt?: Date;
	cancelledAt?: Date;
	completedAt?: Date;
}
