import {
	EventAvailabilityStatus,
	EventCategory,
	EventCurrency,
	EventDayOfWeek,
	EventExperienceLevel,
	EventScheduleType,
	EventStatus,
} from '../../enums/event.enum';
import { Member } from '../member/member';
import { MeLiked } from '../product/product';
import { MetaData } from './event.input';

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

export interface Event {
	_id: string;
	memberId: string;
	eventTitle: string;
	eventDescription: string;
	eventCategory: EventCategory;
	businessName: string;
	eventPrice: number;
	eventCurrency: EventCurrency;
	eventLocation: EventLocation;
	eventSchedule: EventSchedule;
	eventPeriod: EventPeriod;
	eventRegistrationDeadline?: Date;
	eventContact: EventContact;
	eventImages: string[];
	eventAvailabilityStatus: EventAvailabilityStatus;
	eventCapacity: number;
	eventDurationMinutes: number;
	eventRequirements?: EventRequirements;
	eventNotes?: string;
	eventCancellationPolicy?: string;
	eventStatus: EventStatus;
	eventViews: number;
	eventLikes: number;
	eventComments: number;
	eventRank: number;
	approvedAt?: Date;
	rejectedAt?: Date;
	deletedAt?: Date;
	cancelledAt?: Date;
	completedAt?: Date;
	createdAt: Date;
	updatedAt: Date;

	// Aggregated data (populated from joins)
	businessData?: Member;
	meLiked?: MeLiked[];
}

export interface Events {
	list: Event[];
	metaCounter?: MetaData[];
}
