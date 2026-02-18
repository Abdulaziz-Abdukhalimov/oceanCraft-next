import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const SIGN_UP = gql`
	mutation Signup($input: MemberInput!) {
		signup(input: $input) {
			_id
			memberType
			memberStatus
			memberAuthType
			memberEmail
			memberPhone
			memberTelegram
			memberNick
			memberFullName
			memberImage
			memberAddress
			memberDesc
			memberEvents
			memberProducts
			memberFollowers
			memberFollowings
			memberPoints
			memberLikes
			memberViews
			memberRank
			memberWarnings
			memberComments
			memberBlocks
			deletedAt
			createdAt
			updatedAt
			accessToken
		}
	}
`;

export const LOGIN = gql`
	mutation Login($input: LoginInput!) {
		login(input: $input) {
			_id
			memberType
			memberStatus
			memberAuthType
			memberEmail
			memberPhone
			memberTelegram
			memberNick
			memberFullName
			memberImage
			memberAddress
			memberDesc
			memberEvents
			memberProducts
			memberFollowers
			memberFollowings
			memberPoints
			memberLikes
			memberViews
			memberRank
			memberWarnings
			memberComments
			memberBlocks
			deletedAt
			createdAt
			updatedAt
			accessToken
		}
	}
`;

export const UPDATE_MEMBER = gql`
	mutation UpdateMember($input: MemberUpdate!) {
		updateMember(input: $input) {
			_id
			memberType
			memberStatus
			memberAuthType
			memberEmail
			memberPhone
			memberTelegram
			memberNick
			memberFullName
			memberImage
			memberAddress
			memberDesc
			memberEvents
			memberProducts
			memberFollowers
			memberFollowings
			memberPoints
			memberLikes
			memberViews
			memberRank
			memberWarnings
			memberComments
			memberBlocks
			deletedAt
			createdAt
			updatedAt
			accessToken
		}
	}
`;

export const LIKE_TARGET_MEMBER = gql`
	mutation LikeTargetMember($input: String!) {
		likeTargetMember(memberId: $input) {
			_id
			memberType
			memberStatus
			memberAuthType
			memberPhone
			memberNick
			memberFullName
			memberImage
			memberAddress
			memberDesc
			memberWarnings
			memberBlocks
			memberProperties
			memberRank
			memberPoints
			memberLikes
			memberViews
			deletedAt
			createdAt
			updatedAt
			accessToken
		}
	}
`;

/**************************
 *        PRODUCT        *
 *************************/

export const CREATE_PRODUCT = gql`
	mutation CreateProduct($input: ProductInput!) {
		createProduct(input: $input) {
			_id
			memberId
			productCategory
			productCondition
			productStatus
			productTitle
			productDescription
			productBrand
			productModel
			productEngineType
			productSpeed
			productLength
			productPriceType
			productRentPeriod
			productPrice
			productCurrency
			productImages
			productAddress
			productViews
			productLikes
			productComments
			productRank
			productRent
			productBuildYear
			soldAt
			deletedAt
			createdAt
			updatedAt
		}
	}
`;

export const UPDATE_PRODUCT = gql`
	mutation UpdateProduct($input: ProductUpdate!) {
		updateProduct(input: $input) {
			_id
			productCategory
			productCondition
			productStatus
			productTitle
			productDescription
			productBrand
			productModel
			productPrice
			productCurrency
			productImages
			productAddress
			productViews
			productLikes
			productComments
			productRank
			productRent
			soldAt
			deletedAt
			createdAt
			updatedAt
			memberId
			productEngineType
			productSpeed
			productLength
			productPriceType
			productRentPeriod
			productBuildYear
		}
	}
`;

export const LIKE_TARGET_PRODUCT = gql`
	mutation LikeTargetProduct($input: String!) {
		likeTargetProduct(productId: $input) {
			_id
			memberId
			productCategory
			productCondition
			productStatus
			productTitle
			productDescription
			productBrand
			productModel
			productEngineType
			productSpeed
			productLength
			productPriceType
			productRentPeriod
			productPrice
			productCurrency
			productImages
			productAddress
			productViews
			productLikes
			productComments
			productRank
			productRent
			soldAt
			deletedAt
			createdAt
			updatedAt
			productBuildYear
		}
	}
`;

/**************************
 *      EVENTS    *
 *************************/

export const CREATE_EVENT = gql`
	mutation CreateEvent($input: EventCreate!) {
		createEvent(input: $input) {
			_id
			memberId
			eventTitle
			eventDescription
			eventCategory
			businessName
			eventPrice
			eventCurrency
			eventRegistrationDeadline
			eventImages
			eventAvailabilityStatus
			eventCapacity
			eventDurationMinutes
			eventNotes
			eventCancellationPolicy
			eventStatus
			eventViews
			eventLikes
			eventComments
			eventRank
			approvedAt
			rejectedAt
			deletedAt
			cancelledAt
			completedAt
			createdAt
			updatedAt
			eventLocation {
				city
				address
			}
			eventSchedule {
				type
				daysOfWeek
			}
			eventPeriod {
				startDate
				endDate
			}
			eventContact {
				phone
				email
				telegram
			}
			eventRequirements {
				minAge
				maxAge
				bringItems
				experienceLevel
			}
		}
	}
`;

export const UPDATE_EVENT = gql`
	mutation UpdateEvent($input: EventUpdate!) {
		updateEvent(input: $input) {
			_id
			memberId
			eventTitle
			eventDescription
			eventCategory
			businessName
			eventPrice
			eventCurrency
			eventRegistrationDeadline
			eventImages
			eventAvailabilityStatus
			eventCapacity
			eventDurationMinutes
			eventNotes
			eventCancellationPolicy
			eventStatus
			eventViews
			eventLikes
			eventComments
			eventRank
			approvedAt
			rejectedAt
			deletedAt
			cancelledAt
			completedAt
			createdAt
			updatedAt
			eventLocation {
				city
				address
			}
			eventSchedule {
				type
				daysOfWeek
			}
			eventPeriod {
				startDate
				endDate
			}
			eventContact {
				phone
				email
				telegram
			}
			eventRequirements {
				minAge
				maxAge
				bringItems
				experienceLevel
			}
		}
	}
`;

export const LIKE_TARGET_EVENT = gql`
	mutation LikeTargetEvent($input: String!) {
		likeTargetEvent(eventId: $input) {
			_id
			memberId
			eventTitle
			eventDescription
			eventCategory
			businessName
			eventPrice
			eventCurrency
			eventRegistrationDeadline
			eventImages
			eventAvailabilityStatus
			eventCapacity
			eventDurationMinutes
			eventNotes
			eventCancellationPolicy
			eventStatus
			eventViews
			eventLikes
			eventComments
			eventRank
			approvedAt
			rejectedAt
			deletedAt
			cancelledAt
			completedAt
			createdAt
			updatedAt
			eventLocation {
				city
				address
			}
			eventSchedule {
				type
				daysOfWeek
			}
			eventPeriod {
				startDate
				endDate
			}
			eventContact {
				phone
				email
				telegram
			}
			eventRequirements {
				minAge
				maxAge
				bringItems
				experienceLevel
			}
		}
	}
`;

/**************************
 *         COMMENT        *
 *************************/

export const CREATE_COMMENT = gql`
	mutation CreateComment($input: CommentInput!) {
		createComment(input: $input) {
			_id
			commentStatus
			commentGroup
			commentContent
			commentRefId
			memberId
			createdAt
			updatedAt
		}
	}
`;

export const UPDATE_COMMENT = gql`
	mutation UpdateComment($input: CommentUpdate!) {
		updateComment(input: $input) {
			_id
			commentStatus
			commentGroup
			commentContent
			commentRefId
			memberId
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *         FOLLOW        *
 *************************/

export const SUBSCRIBE = gql`
	mutation Subscribe($input: String!) {
		subscribe(input: $input) {
			_id
			followingId
			followerId
			createdAt
			updatedAt
		}
	}
`;

export const UNSUBSCRIBE = gql`
	mutation Unsubscribe($input: String!) {
		unsubscribe(input: $input) {
			_id
			followingId
			followerId
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *         INQUIRY        *
 *************************/

export const CREATE_INQUIRY = gql`
	mutation CreateInquiry($input: CreateInquiryInput!) {
		createInquiry(input: $input) {
			_id
			buyerId
			sellerId
			productId
			inquiryMessage
			preferredContactMethod
			sellerReply
			status
			isRead
			viewedAt
			respondedAt
			closedAt
			createdAt
			updatedAt
			contactPerson {
				fullName
				email
				phone
			}
		}
	}
`;

export const MARK_INQUIRY_VIEWED = gql`
	mutation MarkInquiryAsViewed($input: String!) {
		markInquiryAsViewed(inquiryId: $input) {
			_id
			buyerId
			sellerId
			productId
			inquiryMessage
			preferredContactMethod
			sellerReply
			status
			isRead
			viewedAt
			respondedAt
			closedAt
			createdAt
			updatedAt
			contactPerson {
				fullName
				email
				phone
			}
		}
	}
`;

export const REPLY_INQUIRY = gql`
	mutation ReplyToInquiry($input: ReplyInquiryInput!) {
		replyToInquiry(input: $input) {
			_id
			buyerId
			sellerId
			productId
			inquiryMessage
			preferredContactMethod
			sellerReply
			status
			isRead
			viewedAt
			respondedAt
			closedAt
			createdAt
			updatedAt
			contactPerson {
				fullName
				email
				phone
			}
		}
	}
`;

/**************************
 *         RESERVATION        *
 *************************/
export const BOOK_EVENT = gql`
	mutation BookEvent($input: CreateReservationInput!) {
		bookEvent(input: $input) {
			_id
			eventId
			slotId
			memberId
			reservationDate
			numberOfPeople
			pricePerPerson
			totalAmount
			paymentMethod
			paymentStatus
			status
			createdAt
			updatedAt
			contactPerson {
				fullName
				email
				phone
			}
			paymentInfo {
				cardholderName
				cardLastFour
			}
			paymentProcessedAt
			bookingReference
		}
	}
`;

export const UPDATE_RESERVATION = gql`
	mutation UpdateReservationStatus($input: UpdateReservationStatusInput!) {
		updateReservationStatus(input: $input) {
			_id
			eventId
			slotId
			memberId
			reservationDate
			numberOfPeople
			pricePerPerson
			totalAmount
			paymentMethod
			paymentStatus
			paymentProcessedAt
			status
			bookingReference
			createdAt
			updatedAt
		}
	}
`;

export const CANCEL_RESERVATION = gql`
	mutation CancelReservation($input: String!) {
		cancelReservation(reservationId: $input) {
			_id
			eventId
			slotId
			memberId
			reservationDate
			numberOfPeople
			pricePerPerson
			totalAmount
			paymentMethod
			paymentStatus
			paymentProcessedAt
			status
			bookingReference
			createdAt
			updatedAt
			contactPerson {
				fullName
				email
				phone
			}
			paymentInfo {
				cardholderName
				cardLastFour
			}
		}
	}
`;

//chat
export const SEND_MESSAGE = gql`
	mutation SendMessage($input: ChatMessageInput!) {
		sendMessage(input: $input) {
			response
			quickReplies
			confidence
		}
	}
`;

//NOTICATIONS

export const MARK_AS_READ = gql`
	mutation MarkNotificationAsRead($notificationId: String!) {
		markNotificationAsRead(notificationId: $notificationId)
	}
`;

export const MARK_ALL_AS_READ = gql`
	mutation MarkAllNotificationsAsRead {
		markAllNotificationsAsRead
	}
`;
