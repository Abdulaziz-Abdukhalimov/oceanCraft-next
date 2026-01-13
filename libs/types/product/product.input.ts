import { Direction } from '../../enums/common.enum';
import {
	ProductCategory,
	ProductCondition,
	ProductCurrency,
	ProductPriceType,
	ProductRentPeriod,
	ProductStatus,
} from '../../enums/product.enum';

export interface PropertyInput {
	productCategory: ProductCategory;
	productCondition: ProductCondition;
	productTitle: string;
	productBrand: string;
	productModel: string;
	productEngineType: string;
	productSpeed: number;
	productLength: number;
	productPriceType: ProductPriceType;
	productRentPeriod: ProductRentPeriod;
	productPrice: number;
	productCurrency: ProductCurrency;
	productImages: string[];
	productAddress: string;
	productDescription: string;
	productRent: boolean;
	memberId: string;
	productBuildYear: string;
}

export interface PISearch {
	memberId?: string;
	categoryList?: ProductCategory[];
	conditionList?: ProductCondition[];
	currencyList?: ProductCurrency[];
	pricesRange?: Range;
	location?: string;
	productPriceType?: ProductPriceType;
	text?: string;
}

export interface ProductsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: PISearch;
}

export interface SPISearch {
	productStatus?: ProductStatus;
	categoryList?: ProductCategory[];
	productPriceType?: ProductPriceType;
}

export interface SellerProductsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: SPISearch;
}

export interface APISearch {
	productStatus?: ProductStatus;
	categoryList?: ProductCategory[];
	productPriceType?: ProductPriceType;
	memberId?: string;
}

export interface AllProductsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: APISearch;
}

interface Range {
	start: number;
	end: number;
}

export interface OrdinaryInquiry {
	page: number;
	limit: number;
}
