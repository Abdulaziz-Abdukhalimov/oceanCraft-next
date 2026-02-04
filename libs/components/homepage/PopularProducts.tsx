import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Swiper, SwiperSlide } from 'swiper/react';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import Link from 'next/link';
import { useQuery } from '@apollo/client';
import { T } from '../../types/common';
import { ProductsInquiry } from '../../types/product/product.input';
import { Product } from '../../types/product/product';
import { GET_PRODUCTS } from '../../../apollo/user/query';
import PopularProductCard from './PopularProductCard';
import { Autoplay, Navigation, Pagination } from 'swiper';
import { useTranslation } from 'next-i18next';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface PopularProductsProps {
	initialInput: ProductsInquiry;
}

const PopularProducts = (props: PopularProductsProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [popularProducts, setPopularProducts] = useState<Product[]>([]);
	const { t, i18n } = useTranslation('common');

	/** APOLLO REQUESTS **/
	const {
		loading: getProductsLoading,
		data: getProductsData,
		error: getProductsError,
		refetch: getProductsRefetch,
	} = useQuery(GET_PRODUCTS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			console.log('Products loaded:', data?.getProducts?.list);
			setPopularProducts(data?.getProducts?.list);
		},
	});

	/** HANDLERS **/
	const likeProductHandler = async (user: any, id: string) => {
		try {
			await getProductsRefetch({ input: initialInput });
		} catch (err: any) {
			console.log('ERROR, likeProductHandler:', err.message);
		}
	};

	console.log('Popular Products:', popularProducts?.length);

	if (getProductsLoading) {
		return (
			<Stack className={'popular-products'}>
				<Stack className={'container'}>
					<Box>Loading products...</Box>
				</Stack>
			</Stack>
		);
	}

	if (getProductsError) {
		console.error('Products Error:', getProductsError);
		return null;
	}

	if (!popularProducts || popularProducts.length === 0) {
		console.log('No products to display');
		return null;
	}

	if (device === 'mobile') {
		return (
			<Stack className={'popular-products'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span className={'title'}>Popular products</span>
						</Box>
					</Stack>
					<Stack className={'card-box'}>
						<Swiper
							className={'popular-product-swiper'}
							slidesPerView={'auto'}
							spaceBetween={15}
							modules={[Autoplay]}
							autoplay={{
								delay: 3000,
								disableOnInteraction: false,
							}}
						>
							{popularProducts.map((product: Product) => {
								return (
									<SwiperSlide key={product._id} className={'popular-product-slide'}>
										<PopularProductCard product={product} likeProductHandler={likeProductHandler} />
									</SwiperSlide>
								);
							})}
						</Swiper>
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'popular-products'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span className={'title'}>{t('Ocean Crafts Recommended')}</span>
							<p className={'subtitle'}>{t('Popular products with high customer preference.')}</p>
						</Box>
					</Stack>
					<Stack className={'card-box'}>
						<Swiper
							className={'popular-product-swiper'}
							slidesPerView={'auto'}
							spaceBetween={20}
							modules={[Autoplay, Navigation, Pagination]}
							navigation={{
								nextEl: '.swiper-popular-next',
								prevEl: '.swiper-popular-prev',
							}}
							pagination={{
								el: '.swiper-popular-pagination',
								clickable: true,
							}}
							autoplay={{
								delay: 4000,
								disableOnInteraction: false,
							}}
						>
							{popularProducts.map((product: Product) => {
								return (
									<SwiperSlide key={product._id} className={'popular-product-slide'} style={{ width: '273.3px' }}>
										<PopularProductCard product={product} likeProductHandler={likeProductHandler} />
									</SwiperSlide>
								);
							})}
						</Swiper>
					</Stack>
					{/* <Stack className={'pagination-box'}>
						<WestIcon className={'swiper-popular-prev'} />
						<div className={'swiper-popular-pagination'}></div>
						<EastIcon className={'swiper-popular-next'} />
					</Stack> */}
				</Stack>
			</Stack>
		);
	}
};

PopularProducts.defaultProps = {
	initialInput: {
		page: 1,
		limit: 4,
		sort: 'productRank',
		direction: 'DESC',
		search: {},
	},
};

export default PopularProducts;
