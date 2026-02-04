import React from 'react';
import { Stack, Box } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper';
import { useRouter } from 'next/router';
import { REACT_APP_API_URL } from '../../config';
import 'swiper/css';
import 'swiper/css/pagination';
import { useTranslation } from 'next-i18next';

interface AdBanner {
	id: string;
	imageUrl: string;
	linkUrl?: string;
	alt: string;
}

const TrendAdvertisement = () => {
	const router = useRouter();
	const { t, i18n } = useTranslation('common');

	const getImageUrl = (imagePath: string) => {
		if (!imagePath) return '';

		if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
			return imagePath;
		}

		// Otherwise, prepend API URL for local images
		return `${REACT_APP_API_URL}/${imagePath}`;
	};

	const adBanners: AdBanner[] = [
		{
			id: '1',
			imageUrl: '/img/banner/best_ban1.jpg',
			linkUrl: '/product?prodoductCategory=BOAT',
			alt: '고무보트 + 선외기 프로모션',
		},
		{
			id: '2',
			imageUrl: '/img/banner/best_ban2.jpg',
			linkUrl: '/product?productCategory=OTHER',
			alt: '로렌스 어탐기 GPS',
		},
		{
			id: '3',
			imageUrl: '/img/banner/best_ban3.jpg',
			linkUrl: '/product?productCategory=OTHER',
			alt: '팻보이 프로 550',
		},
	];

	const handleAdClick = (linkUrl?: string) => {
		if (linkUrl) {
			router.push(linkUrl);
		}
	};

	return (
		<Stack className={'advertisement-banner'}>
			<Stack className="add-title">
				<div>{t('Explore the best products')}</div>
			</Stack>
			<Stack className={'container'}>
				<Swiper
					className={'ad-swiper'}
					slidesPerView={3}
					spaceBetween={20}
					modules={[Autoplay, Pagination]}
					pagination={{
						clickable: true,
						el: '.ad-swiper-pagination',
					}}
					autoplay={{
						delay: 4000,
						disableOnInteraction: false,
						pauseOnMouseEnter: true,
					}}
					loop={true}
					breakpoints={{
						1200: {
							slidesPerView: 3,
							spaceBetween: 20,
						},
						768: {
							slidesPerView: 2,
							spaceBetween: 15,
						},
						320: {
							slidesPerView: 1,
							spaceBetween: 10,
						},
					}}
				>
					{adBanners.map((banner: AdBanner) => (
						<SwiperSlide key={banner.id} className={'ad-slide'}>
							<Box className={'ad-card'} onClick={() => handleAdClick(banner.linkUrl)}>
								<img
									src={banner.imageUrl}
									alt={banner.alt}
									onError={(e) => {
										console.error('Ad image failed to load:', banner.imageUrl);
										e.currentTarget.style.display = 'none';
									}}
								/>
							</Box>
						</SwiperSlide>
					))}
				</Swiper>
			</Stack>
		</Stack>
	);
};

export default TrendAdvertisement;
