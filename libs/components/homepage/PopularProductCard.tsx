import React from 'react';
import { Stack, Box, Typography, IconButton } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EmailIcon from '@mui/icons-material/Email';
import { REACT_APP_API_URL, topProductRank } from '../../config';
import { useRouter } from 'next/router';
import { useReactiveVar, useMutation } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Product } from '../../types/product/product';
import { LIKE_TARGET_PRODUCT } from '../../../apollo/user/mutation';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { Message } from '../../enums/common.enum';

interface PopularProductCardProps {
	product: Product;
	likeProductHandler?: any;
}

const PopularProductCard = (props: PopularProductCardProps) => {
	const { product, likeProductHandler } = props;
	const router = useRouter();
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);

	/** APOLLO REQUESTS **/
	const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);

	/** HANDLERS **/
	const pushDetailHandler = async (productId: string) => {
		await router.push({ pathname: '/product/detail', query: { id: productId } });
	};

	const handleLikeProduct = async (e: React.MouseEvent, productId: string) => {
		e.stopPropagation();

		try {
			if (!user?._id) {
				await sweetMixinErrorAlert(Message.NOT_AUTHENTICATED);
				await router.push('/account/join');
				return;
			}

			await likeTargetProduct({
				variables: {
					input: productId,
				},
			});

			if (likeProductHandler) {
				likeProductHandler(user, productId);
			}
		} catch (err: any) {
			console.log('ERROR, handleLikeProduct:', err.message);
			await sweetMixinErrorAlert(err.message);
		}
	};

	const handleContactClick = async (e: React.MouseEvent) => {
		e.stopPropagation();

		if (!user?._id) {
			await sweetMixinErrorAlert(Message.NOT_AUTHENTICATED);
			await router.push('/account/join');
			return;
		}

		// Navigate to product detail to show contact form/info
		await pushDetailHandler(product._id);
	};

	const isLiked = product?.meLiked && product?.meLiked[0]?.myFavorite;

	if (device === 'mobile') {
		return (
			<Stack className="popular-product-card">
				<Box
					component={'div'}
					className={'card-img'}
					style={{ backgroundImage: `url(${REACT_APP_API_URL}/${product?.productImages[0]})` }}
					onClick={() => pushDetailHandler(product._id)}
				>
					{product?.productRank && product?.productRank >= topProductRank && (
						<div className={'top-badge'}>
							<span>TOP</span>
						</div>
					)}
				</Box>
				<Box component={'div'} className={'info'}>
					<strong className={'title'} onClick={() => pushDetailHandler(product._id)}>
						{product.productTitle}
					</strong>
					<p className={'brand'}>{product.productBrand}</p>
					<div className={'price-box'}>
						<span className={'price'}>
							{product.productPrice.toLocaleString()}{' '}
							{product.productCurrency === 'USD' ? '$' : product.productCurrency}
						</span>
					</div>
				</Box>
			</Stack>
		);
	} else {
		return (
			<Stack className="popular-product-card">
				{/* Like Button - Top Right */}
				<IconButton
					className={`like-btn ${isLiked ? 'liked' : ''}`}
					onClick={(e: any) => handleLikeProduct(e, product._id)}
				>
					{isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
				</IconButton>

				{/* Sale Badge - Top Left
				{product?.productRank && product?.productRank >= topProductRank && <div className={'sale-badge'}>SALE</div>} */}

				{/* Product Image */}
				<Box component={'div'} className={'card-img'} onClick={() => pushDetailHandler(product._id)}>
					<img
						src={`${product?.productImages[0]}`}
						alt={product.productTitle}
						onError={(e) => {
							console.error('Image failed to load:', `${REACT_APP_API_URL}/${product?.productImages[0]}`);
							e.currentTarget.src = '/img/banner/aboutBanner.svg'; // Fallback image
						}}
					/>
				</Box>

				{/* Product Info */}
				<Box component={'div'} className={'info'}>
					{/* Product Title */}
					<Typography className={'product-name'} onClick={() => pushDetailHandler(product._id)}>
						{product.productTitle}
					</Typography>

					{/* Stock Status */}
					<Typography className={'stock-status'}>
						{product?.productStatus === 'SOLD' ? '이용할 수 없음' : '재고 있음'}
					</Typography>

					{/* Bottom Row: Price + Contact Button */}
					<Box className={'bottom-box'}>
						<Typography className={'price'}>
							{product.productPrice.toLocaleString()}{' '}
							{product.productCurrency === 'USD'
								? '$'
								: product.productCurrency === 'KRW'
								? '₩'
								: product.productCurrency}
						</Typography>

						<IconButton className={'contact-btn'} onClick={handleContactClick}>
							<EmailIcon />
						</IconButton>
					</Box>
				</Box>
			</Stack>
		);
	}
};

export default PopularProductCard;
