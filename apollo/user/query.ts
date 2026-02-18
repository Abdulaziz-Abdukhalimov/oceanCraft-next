import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const GET_AGENTS = gql`
	query GetAgents($input: AgentsInquiry!) {
		getAgents(input: $input) {
			list {
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
			metaCounter {
				total
			}
		}
	}
`;

export const GET_MEMBER = gql(`
query GetMember($input: String!) {
    getMember(memberId: $input) {
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
`);

/**************************
 *        PRODUCT        *
 *************************/

export const GET_PRODUCT = gql`
	query GetProduct($input: String!) {
		getProduct(productId: $input) {
			_id
			memberId
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
			productPriceType
			productRentPeriod
			productEngineType
			productSpeed
			productLength
			productBuildYear
			memberData {
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
			meLiked {
				memberId
				likeRefId
				myFavorite
			}
		}
	}
`;

export const GET_PRODUCTS = gql`
	query GetProducts($input: ProductsInquiry!) {
		getProducts(input: $input) {
			list {
				_id
				memberId
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
				productEngineType
				productSpeed
				productLength
				productPriceType
				productRentPeriod
				memberData {
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
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_AGENT_PRODUCTS = gql`
	query GetSellerProducts($input: SellerProductsInquiry!) {
		getSellerProducts(input: $input) {
			list {
				_id
				memberId
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
				productEngineType
				productSpeed
				productLength
				productPriceType
				productRentPeriod
				productBuildYear
				memberData {
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
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_FAVORITES = gql`
	query GetAllFavorites($input: AllFavoritesInquiry!) {
		getAllFavorites(input: $input) {
			list {
				_id
				itemType
				likeRefId
				createdAt
				productData {
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
				eventData {
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
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

// export const GET_VISITED = gql`
// 	query GetVisited($input: OrdinaryInquiry!) {
// 		getVisited(input: $input) {
// 			list {
// 				_id
// 				propertyType
// 				propertyStatus
// 				propertyLocation
// 				propertyAddress
// 				propertyTitle
// 				propertyPrice
// 				propertySquare
// 				propertyBeds
// 				propertyRooms
// 				propertyViews
// 				propertyLikes
// 				propertyComments
// 				propertyRank
// 				propertyImages
// 				propertyDesc
// 				propertyBarter
// 				propertyRent
// 				memberId
// 				soldAt
// 				deletedAt
// 				constructedAt
// 				createdAt
// 				updatedAt
// 				memberData {
// 					_id
// 					memberType
// 					memberStatus
// 					memberAuthType
// 					memberPhone
// 					memberNick
// 					memberFullName
// 					memberImage
// 					memberAddress
// 					memberDesc
// 					memberProperties
// 					memberArticles
// 					memberPoints
// 					memberLikes
// 					memberViews
// 					memberComments
// 					memberFollowings
// 					memberFollowers
// 					memberRank
// 					memberWarnings
// 					memberBlocks
// 					deletedAt
// 					createdAt
// 					updatedAt
// 					accessToken
// 				}
// 			}
// 			metaCounter {
// 				total
// 			}
// 		}
// 	}
// `;

/**************************
 *      EVENTS     *
 *************************/

export const GET_EVENTS = gql`
	query GetEvents($input: EventsInquiry!) {
		getEvents(input: $input) {
			list {
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
				businessData {
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
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_EVENT = gql`
	query GetEvent($input: String!) {
		getEvent(eventId: $input) {
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
			createdAt
			updatedAt
			eventLocation {
				city
				address
			}
			meLiked {
				memberId
				likeRefId
				myFavorite
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
			cancelledAt
			completedAt
			businessData {
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
	}
`;

export const GET_AGENT_EVENTS = gql`
	query GetBusinessEvents($input: BusinessEventsInquiry!) {
		getBusinessEvents(input: $input) {
			list {
				_id
				eventCategory
				businessName
				eventPrice
				eventCurrency
				eventRegistrationDeadline
				eventImages
				eventAvailabilityStatus
				eventCapacity
				eventDurationMinutes
				eventCancellationPolicy
				eventStatus
				eventViews
				eventLikes
				eventComments
				eventRank
				approvedAt
				rejectedAt
				deletedAt
				createdAt
				updatedAt
				eventTitle
				eventDescription
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
				eventNotes
				memberId
				cancelledAt
				completedAt
				businessData {
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
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *         COMMENT        *
 *************************/

export const GET_COMMENTS = gql`
	query GetComments($input: CommentsInquiry!) {
		getComments(input: $input) {
			list {
				_id
				commentStatus
				commentGroup
				commentContent
				commentRefId
				memberId
				createdAt
				updatedAt
				memberData {
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
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *         FOLLOW        *
 *************************/
export const GET_MEMBER_FOLLOWERS = gql`
	query GetMemberFollowers($input: FollowInquiry!) {
		getMemberFollowers(input: $input) {
			list {
				_id
				followingId
				followerId
				createdAt
				updatedAt
				followerData {
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
				meFollowed {
					followingId
					followerId
					myFollowing
				}
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_MEMBER_FOLLOWINGS = gql`
	query GetMemberFollowings($input: FollowInquiry!) {
		getMemberFollowings(input: $input) {
			list {
				_id
				followingId
				followerId
				createdAt
				updatedAt
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
				meFollowed {
					followingId
					followerId
					myFollowing
				}
				followingData {
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
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *         INQUIRIES        *
 *************************/

export const GET_MEMBER_INQUIRIES = gql`
	query GetMyInquiries($input: InquiriesInput!) {
		getMyInquiries(input: $input) {
			list {
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
			metaCounter {
				total
			}
		}
	}
`;

export const GET_AGENT_INQUIRIES = gql`
	query GetReceivedInquiries($input: InquiriesInput!) {
		getReceivedInquiries(input: $input) {
			list {
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
			metaCounter {
				total
			}
		}
	}
`;

export const GET_UNREAD_INQUIRIESCOUNT = gql`
	query GetUnreadInquiryCount {
		getUnreadInquiryCount
	}
`;

/**************************
 *         RESERVATION        *
 *************************/
export const GET_EVENT_AVAILABILITY = gql`
	query GetAvailableDates($input: String!) {
		getAvailableDates(eventId: $input) {
			date
			remainingCapacity
			isAvailable
			isPastDate
		}
	}
`;

export const GET_MEMBER_RESERVATIONS = gql`
	query GetMyReservations {
		getMyReservations {
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

export const GET_AGENT_RESERVATIONS = gql`
	query GetAgentReservations($input: AgentReservationInquiry!) {
		getAgentReservations(input: $input) {
			total
			page
			totalPages
			list {
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
	}
`;

export const GET_AGENT_RESERVATION = gql`
	query GetReservation($input: String!) {
		getReservation(reservationId: $input) {
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

export const GET_MEMBER_RESERVATION = gql`
	query GetReservation($input: String!) {
		getReservation(reservationId: $input) {
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

export const GET_RESERVATION_STATISTICS = gql`
	query GetReservationStatistics {
		getReservationStatistics {
			totalBookings
			totalRevenue
			pendingPayments
			totalGuests
		}
	}
`;

export const GET_GREETING = gql`
	query GetGreeting {
		greeting {
			response
			quickReplies
		}
	}
`;

//NOTIFICATIONS

export const GET_MY_NOTIFICATIONS = gql`
	query GetMyNotifications($input: NotificationInquiry!) {
		getMyNotifications(input: $input) {
			list {
				_id
				notificationType
				notificationStatus
				notificationGroup
				notificationTitle
				notificationDesc
				authorId
				receiverId
				notifRefId
				readAt
				createdAt
				updatedAt
				authorData {
					_id
					memberNick
					memberImage
				}
				productData {
					_id
					productTitle
					productImages
					productPrice
				}
				eventData {
					_id
					eventTitle
					eventImages
					eventPrice
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_UNREAD_COUNT = gql`
	query GetUnreadNotificationCount {
		getUnreadNotificationCount
	}
`;
