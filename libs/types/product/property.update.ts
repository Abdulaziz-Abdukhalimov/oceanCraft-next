import {
	ProductCategory,
	ProductCondition,
	ProductCurrency,
	ProductPriceType,
	ProductRentPeriod,
	ProductStatus,
} from '../../enums/product.enum';

export interface ProductUpdate {
	_id: string;
	productCategory?: ProductCategory;
	productStatus?: ProductStatus;
	productCondition?: ProductCondition;
	productTitle?: string;
	productDescription?: string;
	productBrand?: string;
	productModel?: string;
	productEngineType?: string;
	productSpeed?: number;
	productLength?: number;
	productPriceType?: ProductPriceType;
	productRentPeriod?: ProductRentPeriod;
	productPrice?: number;
	productCurrency?: ProductCurrency;
	productImages?: string[];
	productAddress?: string;
	productRent?: boolean;
	productBuildYear?: string;
	soldAt?: Date;
	deletedAt?: Date;
}
