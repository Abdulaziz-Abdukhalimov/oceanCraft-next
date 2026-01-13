import {
	ProductCategory,
	ProductCondition,
	ProductCurrency,
	ProductPriceType,
	ProductRentPeriod,
	ProductStatus,
} from '../../enums/product.enum';
import { Member } from '../member/member';

export interface MeLiked {
	memberId: string;
	likeRefId: string;
	myFavorite: boolean;
}

export interface TotalCounter {
	total: number;
}

export interface Product {
	_id: string;
	memberId: string;
	productCategory: ProductCategory;
	productCondition: ProductCondition;
	productStatus: ProductStatus;
	productTitle: string;
	productDescription?: string;
	productBrand: string;
	productModel: string;
	productEngineType?: string;
	productSpeed?: number;
	productLength?: number;
	productPriceType: ProductPriceType;
	productRentPeriod?: ProductRentPeriod;
	productPrice: number;
	productCurrency: ProductCurrency;
	productImages: string[];
	productAddress: string;
	productViews: number;
	productLikes: number;
	productComments: number;
	productRank: number;
	productRent: boolean;
	productBuildYear?: string;
	soldAt?: Date;
	deletedAt?: Date;
	createdAt: Date;
	updatedAt: Date;

	// Aggregated data (populated from joins)
	memberData?: Member;
	meLiked?: MeLiked[];
}

export interface Products {
	list: Product[];
	metaCounter: TotalCounter[];
}
