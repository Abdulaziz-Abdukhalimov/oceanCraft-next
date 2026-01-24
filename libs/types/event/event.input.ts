import {
	EventAvailabilityStatus,
	EventCategory,
	EventCurrency,
	EventDayOfWeek,
	EventExperienceLevel,
	EventScheduleType,
	EventStatus,
} from '../../enums/event.enum';
import { Range } from '../product/product.input';
import { Direction } from '../../enums/common.enum';

export interface EventLocation {
	city: string;
	address: string;
}

export interface EventTimeSlot {
	startTime: string;
	endTime: string;
}

export interface EventSpecificDate {
	date: Date;
	startTime: string;
	endTime: string;
}

export interface EventSchedule {
	type: EventScheduleType;
	daysOfWeek?: EventDayOfWeek[];
	timeSlots?: EventTimeSlot[];
	specificDates?: EventSpecificDate[];
}

export interface EventPeriod {
	startDate: Date;
	endDate: Date;
}

export interface EventContact {
	phone?: string;
	email?: string;
	telegram?: string;
}

export interface EventRequirements {
	minAge?: number;
	maxAge?: number;
	bringItems?: string[];
	experienceLevel?: EventExperienceLevel;
}

export interface EISearch {
	memberId?: string;
	categoryList?: EventCategory[];
	availabilityList?: EventAvailabilityStatus[];
	pricesRange?: Range;
	city?: string;
	text?: string;
}

export interface EventsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: EISearch;
}

export interface BEISearch {
	eventStatus?: EventStatus;
	categoryList?: EventCategory[];
}

export interface BusinessEventsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: BEISearch;
}

export interface AEISearch {
	eventStatus?: EventStatus;
	categoryList?: EventCategory[];
	memberId?: string;
}

export interface AllEventsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: AEISearch;
}

export interface EventCreate {
	eventTitle: string;
	eventDescription: string;
	businessName: string;
	eventCategory: EventCategory;
	eventPrice: number;
	eventCurrency?: EventCurrency;
	eventLocation: EventLocation;
	eventSchedule: EventSchedule;
	eventPeriod: EventPeriod;
	eventRegistrationDeadline?: Date;
	eventContact: EventContact;
	eventImages: string[];
	eventCapacity: number;
	eventDurationMinutes: number;
	eventAvailabilityStatus: EventAvailabilityStatus;
	eventRequirements?: EventRequirements;
	eventNotes?: string;
	eventCancellationPolicy?: string;
	memberId?: string;
}

export interface AvailableDate {
	date: string;
	remainingCapacity: number;
	isAvailable: boolean;
	isPastDate?: boolean;
}

export interface MetaData {
	total: number;
}
