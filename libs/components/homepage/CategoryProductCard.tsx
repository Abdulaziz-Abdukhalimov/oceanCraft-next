import React from 'react';
import { Stack, Box, Typography, IconButton } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Product } from '../../types/product/product';
import { useRouter } from 'next/router';
import 'swiper/css';
import 'swiper/css/navigation';

interface Props {
	products: Product[];
	loading: boolean;
	likeProductHandler: (id: string) => void;
}

const CategoryProductSlider = ({ products, loading, likeProductHandler }: Props) => {
	const router = useRouter();

	if (loading) return <Typography>Loading...</Typography>;

	return (
		<Stack className="product-swiper">
			<Swiper
				slidesPerView={'auto'}
				spaceBetween={24}
				modules={[Navigation]}
				navigation
				breakpoints={{
					1200: { slidesPerView: 4 },
					768: { slidesPerView: 3 },
					576: { slidesPerView: 2 },
					0: { slidesPerView: 1.2 },
				}}
			>
				{products.map((product) => {
					const isLiked = product.meLiked?.[0]?.myFavorite;

					return (
						<SwiperSlide key={product._id}>
							<Stack className="product-card">
								<Box className="image-box" onClick={() => router.push(`/product/detail?id=${product._id}`)}>
									<img src={product.productImages?.[0] || '/img/placeholder.png'} alt={product.productTitle} />

									<IconButton
										className={`like-btn ${isLiked ? 'liked' : ''}`}
										onClick={(e: any) => {
											e.stopPropagation();
											likeProductHandler(product._id);
										}}
									>
										{isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
									</IconButton>
								</Box>

								<Typography className="product-title">{product.productTitle}</Typography>

								{/* 🔹 META INFO */}
								<Stack className="product-meta" direction="row" spacing={1}>
									{product.productLength && <span>{product.productLength} ft</span>}
									{product.productBuildYear && <span>{product.productBuildYear}</span>}
								</Stack>

								{/* 🔹 LOCATION */}
								{product.productAddress && <Typography className="location">{product.productAddress}</Typography>}

								<Typography className="price">
									{product.productPrice.toLocaleString()} {product.productCurrency}
								</Typography>
							</Stack>
						</SwiperSlide>
					);
				})}
			</Swiper>
		</Stack>
	);
};

export default CategoryProductSlider;
