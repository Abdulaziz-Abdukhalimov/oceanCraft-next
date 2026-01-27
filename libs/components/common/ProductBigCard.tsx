import React from 'react';
import { Stack, Box, Typography } from '@mui/material';
import Link from 'next/link';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import CallIcon from '@mui/icons-material/Call';
import EmailIcon from '@mui/icons-material/Email';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ShareIcon from '@mui/icons-material/Share';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import useDeviceDetect from '../../hooks/useDeviceDetect';

interface ProductCardProps {
	product: any;
	likeProductHandler?: any;
}

const ProductBigCard = (props: ProductCardProps) => {
	const { product, likeProductHandler } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const imagePath = product?.productImages?.[0] || '/img/banner/default.jpg';

	if (device === 'mobile') {
		return <div>PRODUCT CARD MOBILE</div>;
	}

	return (
		<Stack className="listing-card">
			<Box className={'card-container'}>
				{/* Left Side - Image */}
				<Link href={`/product/${product._id}`}>
					<Box className={'listing-img'} style={{ backgroundImage: `url(${imagePath})` }}>
						{product?.productRent && <Box className={'badge featured'}>FOR RENT</Box>}
						{!product?.productRent && <Box className={'badge sale'}>FOR SALE</Box>}
					</Box>
				</Link>

				{/* Right Side - Info */}
				<Stack className={'listing-info'}>
					<Link href={`/product/${product._id}`}>
						<Box className={'info-top'}>
							<Typography className={'category'}>{product?.productCategory}</Typography>
							<Typography className={'price'}>
								{product?.productCurrency} {product?.productPrice?.toLocaleString()}
							</Typography>
							<Typography className={'title'}>{product?.productTitle}</Typography>
							<Typography className={'location'}>
								<span className={'icon'}>📍</span>
								{product?.productAddress || 'Location not specified'}
							</Typography>
						</Box>
					</Link>

					{/* Specs */}
					<Box className={'specs'}>
						{product?.productLength && (
							<Box className={'spec-item'}>
								<span className={'icon'}>📏</span>
								<span>{product.productLength}m</span>
							</Box>
						)}
						{product?.productSpeed && (
							<Box className={'spec-item'}>
								<span className={'icon'}>⚡</span>
								<span>{product.productSpeed}</span>
							</Box>
						)}
						{product?.productBrand && (
							<Box className={'spec-item'}>
								<span className={'icon'}>🏷️</span>
								<span>{product.productBrand}</span>
							</Box>
						)}
					</Box>

					{/* Footer - Agent & Actions */}
					<Box className={'listing-footer'}>
						<Box className={'agent-info'}>
							<img
								src={product?.memberData?.memberImage || '/img/profile/defaultUser.svg'}
								alt={product?.memberData?.memberNick}
								className={'agent-avatar'}
							/>
							<Box className={'agent-details'}>
								<Typography className={'agent-name'}>
									{product?.memberData?.memberFullName || product?.memberData?.memberNick}
								</Typography>
								<Typography className={'agent-time'}></Typography>
							</Box>
						</Box>

						<Box className={'action-buttons'}>
							<IconButton className={'action-btn'}>
								<CallIcon />
							</IconButton>
							<IconButton className={'action-btn'}>
								<EmailIcon />
							</IconButton>
							<IconButton className={'action-btn'}>
								<WhatsAppIcon />
							</IconButton>
							<IconButton className={'action-btn'}>
								<ShareIcon />
							</IconButton>
							{likeProductHandler && (
								<IconButton className={'action-btn'} onClick={() => likeProductHandler(user, product._id)}>
									{product?.meLiked?.[0]?.myFavorite ? <FavoriteIcon color="primary" /> : <FavoriteBorderIcon />}
								</IconButton>
							)}
							<IconButton className={'action-btn'}>
								<RemoveRedEyeIcon />
								<p>{product.productViews}</p>
							</IconButton>
						</Box>
					</Box>
				</Stack>
			</Box>
		</Stack>
	);
};

export default ProductBigCard;
