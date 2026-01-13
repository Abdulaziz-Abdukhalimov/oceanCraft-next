import { LikeGroup } from '../../enums/like.enum';

export interface LikeInput {
	memberId: string;
	likeRefId: string;
	likeGroup: LikeGroup;
}

export interface AllFavoritesInquiry {
	page: number;
	limit: number;
	likeGroup?: LikeGroup;
}
