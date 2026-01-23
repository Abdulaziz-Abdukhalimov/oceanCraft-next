import React, { useState } from 'react';
import { Stack, Typography, Box, IconButton } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Product } from '../../types/product/product';
import { useRouter } from 'next/router';
import { REACT_APP_API_URL } from '../../config';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { Message } from '../../enums/common.enum';
import { sweetMixinErrorAlert } from '../../sweetAlert';

interface ProductCardProps {
	product: Product;
	likeProductHandler?: any;
	myFavorites?: boolean;
}

const ProductCard = (props: ProductCardProps) => {
	const { product, likeProductHandler, myFavorites } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);

	// Use local state for optimistic UI updates
	const initialLiked = product?.meLiked && product?.meLiked[0]?.myFavorite;
	const [isLiked, setIsLiked] = useState(initialLiked);

	// Get image path
	const imagePath: string = product?.productImages?.[0]
		? `${product.productImages[0]}`
		: '/img/banner/default-product.jpg';

	// Get brand logo (if available)
	const brandLogo = product?.productBrand ? `/img/brands/${product.productBrand.toLowerCase()}.svg` : null;

	/** HANDLERS **/
	const handleProductClick = () => {
		router.push({
			pathname: '/product/detail',
			query: { id: product._id },
		});
	};

	const handleLikeClick = async (e: React.MouseEvent) => {
		e.stopPropagation();

		if (!user?._id) {
			await sweetMixinErrorAlert(Message.NOT_AUTHENTICATED);
			await router.push('/account/join');
			return;
		}

		// Optimistic update (correct)
		setIsLiked((prev) => !prev);

		try {
			await likeProductHandler?.(user, product._id);
		} catch {
			// revert
			setIsLiked((prev) => !prev);
		}
	};

	if (device === 'mobile') {
		return <div>PRODUCT CARD (Mobile)</div>;
	}

	return (
		<Stack className="product-card">
			{/* Image Section */}
			<Stack className="card-image" onClick={handleProductClick}>
				{/* Product Image */}
				<img src={imagePath} alt={product.productTitle} className="product-img" />

				{/* Like Button (Top Right) */}
				<IconButton className="like-btn" onClick={handleLikeClick}>
					{isLiked ? (
						<FavoriteIcon style={{ fontSize: '20px', color: '#ef4444' }} />
					) : (
						<FavoriteBorderIcon style={{ fontSize: '20px', color: '#6b7280' }} />
					)}
				</IconButton>
			</Stack>

			{/* Info Section */}
			<Stack className="card-info">
				{/* Title */}
				<Typography className="product-title" onClick={handleProductClick}>
					{product.productTitle}
				</Typography>

				{/* Subtitle / Model */}
				{product.productModel && <Typography className="product-subtitle">{product.productModel}</Typography>}

				{/* Price */}
				<Stack className="price-section">
					<Typography className="product-price">
						{product.productPrice?.toLocaleString()} {product.productCurrency}
					</Typography>
				</Stack>

				{/* Additional Info */}
				{product.productDescription && <Typography className="product-desc">{product.productDescription}</Typography>}

				{/* Badges at Bottom Left */}
				<Stack className="badges-bottom">
					{/* Condition Badge */}
					{product.productCondition === 'NEW' && (
						<Box className="badge new-badge">
							<Typography>NEW</Typography>
						</Box>
					)}
					{product.productCondition === 'USED' && (
						<Box className="badge used-badge">
							<Typography>USED</Typography>
						</Box>
					)}

					{/* Sale Type Badge */}
					{product.productPriceType === 'RENT' && (
						<Box className="badge rent-badge">
							<Typography>RENT</Typography>
						</Box>
					)}
				</Stack>
			</Stack>
		</Stack>
	);
};

export default ProductCard;
