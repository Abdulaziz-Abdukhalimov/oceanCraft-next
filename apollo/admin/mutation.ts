import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const UPDATE_MEMBER_BY_ADMIN = gql`
	mutation UpdateMemberByAdmin($input: MemberUpdate!) {
		updateMemberByAdmin(input: $input) {
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

/**************************
 *        PRODUCT        *
 *************************/

export const UPDATE_PRODUCT_BY_ADMIN = gql`
	mutation UpdateProductByAdmin($input: ProductUpdate!) {
		updateProductByAdmin(input: $input) {
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
		}
	}
`;

export const REMOVE_PRODUCT_BY_ADMIN = gql`
	mutation RemoveProductByAdmin($input: String!) {
		removeProductByAdmin(productId: $input) {
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

/**************************
 *      EVENT     *
 *************************/

export const UPDATE_EVENT_BY_ADMIN = gql`
	mutation UpdateEventStatusByAdmin($input: EventUpdate!) {
		updateEventStatusByAdmin(input: $input) {
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

export const REMOVE_COMMENT_BY_ADMIN = gql`
	mutation RemoveCommentByAdmin($input: String!) {
		removeCommentByAdmin(commentId: $input) {
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
