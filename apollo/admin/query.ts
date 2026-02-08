import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const GET_ALL_MEMBERS_BY_ADMIN = gql`
	query GetAllMembersByAdmin($input: MembersInquiry!) {
		getAllMembersByAdmin(input: $input) {
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

/**************************
 *        PRODUCT        *
 *************************/

export const GET_ALL_PRODUCT_BY_ADMIN = gql`
	query GetAllProductsByAdmin($input: AllProductsInquiry!) {
		getAllProductsByAdmin(input: $input) {
			list {
				_id
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
				memberId
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
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *      EVENT    *
 *************************/

export const GET_ALL_EVENTS_BY_ADMIN = gql`
	query GetAllEventsByAdmin($input: AllEventsInquiry!) {
		getAllEventsByAdmin(input: $input) {
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

//NOTIFICATIONS
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
