import React, { useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Stack, Box, Typography, Button, IconButton, Divider } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { useMutation, useQuery } from '@apollo/client';
import { GET_PRODUCT, GET_COMMENTS } from '../../apollo/user/query';
import { LIKE_TARGET_PRODUCT } from '../../apollo/user/mutation';
import { Product } from '../../libs/types/product/product';
import { T } from '../../libs/types/common';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useReactiveVar } from '@apollo/client';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { Message } from '../../libs/enums/common.enum';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import { userVar } from '../../apollo/store';
import { Tabs, Tab, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { CREATE_INQUIRY } from '../../apollo/user/mutation';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ClassIcon from '@mui/icons-material/Class';
import { useRef } from 'react';
import { CREATE_COMMENT, UPDATE_COMMENT } from '../../apollo/user/mutation';
import moment from 'moment';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const ProductDetail: NextPage = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const { id } = router.query;

	const [product, setProduct] = useState<Product | null>(null);
	const [selectedImage, setSelectedImage] = useState<number>(0);
	const [isLiked, setIsLiked] = useState<boolean>(false);
	const [activeTab, setActiveTab] = useState<number>(0);
	const [commentForm, setCommentForm] = useState({
		commentContent: '',
	});
	const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
	const inquiryRef = useRef<HTMLDivElement | null>(null);

	const [inquiryForm, setInquiryForm] = useState({
		inquiryMessage: '',
		preferredContactMethod: 'EMAIL',
		fullName: '',
		email: '',
		phone: '',
	});

	/** APOLLO REQUESTS **/
	const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);
	const [createInquiry] = useMutation(CREATE_INQUIRY);
	const [createComment] = useMutation(CREATE_COMMENT);
	const [updateComment] = useMutation(UPDATE_COMMENT);

	const {
		loading: getProductLoading,
		data: getProductData,
		error: getProductError,
		refetch: getProductRefetch,
	} = useQuery(GET_PRODUCT, {
		fetchPolicy: 'network-only',
		variables: { input: id as string },
		skip: !id,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			if (data?.getProduct) {
				setProduct(data.getProduct);
				setIsLiked(data.getProduct?.meLiked?.[0]?.myFavorite || false);
			}
		},
	});

	const {
		loading: commentsLoading,
		data: commentsData,
		error: commentsError,
		refetch: commentsRefetch,
	} = useQuery(GET_COMMENTS, {
		fetchPolicy: 'network-only',
		variables: {
			input: {
				page: 1,
				limit: 100,
				sort: 'createdAt',
				direction: 'DESC',
				search: {
					commentRefId: id,
				},
			},
		},
		skip: !id || activeTab !== 2,
		notifyOnNetworkStatusChange: true,
	});

	/** HANDLERS **/
	const handleInquirySubmit = async () => {
		try {
			if (!user?._id) throw new Error(Message.NOT_AUTHENTICATED);
			if (!product?._id) return;

			// Validation
			if (!inquiryForm.inquiryMessage) {
				sweetMixinErrorAlert('Please enter your inquiry message').then();
				return;
			}
			if (!inquiryForm.fullName || !inquiryForm.email) {
				sweetMixinErrorAlert('Please fill in your contact information').then();
				return;
			}

			// Create inquiry
			await createInquiry({
				variables: {
					input: {
						productId: product._id,
						inquiryMessage: inquiryForm.inquiryMessage,
						preferredContactMethod: inquiryForm.preferredContactMethod,
						contactPerson: {
							fullName: inquiryForm.fullName,
							email: inquiryForm.email,
							phone: inquiryForm.phone,
						},
					},
				},
			});

			sweetTopSmallSuccessAlert('Inquiry sent successfully!', 1500);

			// Reset form
			setInquiryForm({
				inquiryMessage: '',
				preferredContactMethod: 'EMAIL',
				fullName: '',
				email: '',
				phone: '',
			});
		} catch (err: any) {
			console.log('ERROR, handleInquirySubmit:', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const handleImageSelect = (index: number) => {
		setSelectedImage(index);
	};

	const handleLike = async () => {
		try {
			if (!user?._id) throw new Error(Message.NOT_AUTHENTICATED);
			if (!product?._id) return;

			// Optimistic update
			setIsLiked(!isLiked);

			await likeTargetProduct({ variables: { input: product._id } });
			await getProductRefetch({ input: product._id });
			await sweetTopSmallSuccessAlert('Success', 800);
		} catch (err: any) {
			console.log('ERROR, handleLike:', err.message);
			setIsLiked(isLiked); // Revert on error
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const handleShare = async () => {
		const shareUrl = window.location.href;

		if (navigator.share) {
			try {
				await navigator.share({
					title: product?.productTitle || 'Product',
					text: product?.productDescription || '',
					url: shareUrl,
				});
			} catch (err) {
				console.log('Error sharing:', err);
			}
		} else {
			// Fallback: copy to clipboard
			navigator.clipboard.writeText(shareUrl);
			sweetTopSmallSuccessAlert('Link copied to clipboard!', 1000);
		}
	};

	const handleContactKakao = () => {
		// KakaoTalk contact logic (static for now)
		window.open('https://pf.kakao.com/your-channel', '_blank');
	};

	const handleContactNaver = () => {
		// Naver contact logic (static for now)
		window.open('https://talk.naver.com/your-channel', '_blank');
	};

	const handleContact = () => {
		setActiveTab(3);

		setTimeout(() => {
			inquiryRef.current?.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			});
		}, 100);
	};

	const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
		setActiveTab(newValue);
	};

	const handleContactMethodChange = (method: string) => {
		setInquiryForm({ ...inquiryForm, preferredContactMethod: method });
	};

	const handleCommentSubmit = async () => {
		try {
			if (!user?._id) throw new Error(Message.NOT_AUTHENTICATED);
			if (!product?._id) return;

			if (!commentForm.commentContent.trim()) {
				sweetMixinErrorAlert('Please write your review').then();
				return;
			}

			if (commentForm.commentContent.length > 500) {
				sweetMixinErrorAlert('Review must be less than 500 characters').then();
				return;
			}

			await createComment({
				variables: {
					input: {
						commentGroup: 'PRODUCT',
						commentContent: commentForm.commentContent,
						commentRefId: product._id,
					},
				},
			});

			sweetTopSmallSuccessAlert('Review posted successfully!', 1500);

			setCommentForm({ commentContent: '' });

			await getProductRefetch({ input: product._id });
		} catch (err: any) {
			console.log('ERROR, handleCommentSubmit:', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const handleEditComment = (commentId: string, commentContent: string) => {
		setEditingCommentId(commentId);
		setCommentForm({ commentContent });

		window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
	};

	const handleUpdateComment = async () => {
		try {
			if (!user?._id) throw new Error(Message.NOT_AUTHENTICATED);
			if (!editingCommentId) return;

			if (!commentForm.commentContent.trim()) {
				sweetMixinErrorAlert('Please write your review').then();
				return;
			}

			if (commentForm.commentContent.length > 500) {
				sweetMixinErrorAlert('Review must be less than 500 characters').then();
				return;
			}

			await updateComment({
				variables: {
					input: {
						_id: editingCommentId,
						commentContent: commentForm.commentContent.trim(),
					},
				},
			});

			sweetTopSmallSuccessAlert('You updated your Review !', 1000);

			setCommentForm({ commentContent: '' });
			setEditingCommentId(null);

			await commentsRefetch();
		} catch (err: any) {
			console.log('ERROR, handleUpdateComment:', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const handleCancelEdit = () => {
		setEditingCommentId(null);
		setCommentForm({ commentContent: '' });
	};

	// const handleDeleteComment = async (commentId: string) => {
	// 	try {
	// 		if (!user?._id) throw new Error(Message.NOT_AUTHENTICATED);

	// 		// Confirm deletion
	// 		const result = await Swal.fire({
	// 			title: 'Delete Review?',
	// 			text: 'Are you sure you want to delete this review?',
	// 			icon: 'warning',
	// 			showCancelButton: true,
	// 			confirmButtonColor: '#ef4444',
	// 			cancelButtonColor: '#6b7280',
	// 			confirmButtonText: 'Yes, delete it',
	// 			cancelButtonText: 'Cancel',
	// 		});

	// 		if (!result.isConfirmed) return;

	// 		// Delete comment (use UPDATE_COMMENT with commentStatus: 'DELETE')
	// 		await updateComment({
	// 			variables: {
	// 				input: {
	// 					_id: commentId,
	// 					commentStatus: 'DELETE',
	// 				},
	// 			},
	// 		});

	// 		sweetTopSmallSuccessAlert('Review deleted successfully!', 1500);

	// 		// Refetch comments and product
	// 		await commentsRefetch();
	// 		await getProductRefetch({ input: product._id });
	// 	} catch (err: any) {
	// 		console.log('ERROR, handleDeleteComment:', err.message);
	// 		sweetMixinErrorAlert(err.message).then();
	// 	}
	// };

	if (device === 'mobile') {
		return <h1>PRODUCT DETAIL MOBILE</h1>;
	}

	if (getProductLoading) {
		return <div>Loading...</div>;
	}

	if (!product) {
		return <div>Product not found</div>;
	}

	// Get image URLs
	const productImages = product.productImages?.map((img) => `${img}`) || [];
	const mainImage = productImages[selectedImage] || '/img/banner/default-product.jpg';

	return (
		<div id="product-detail-page">
			<div className="container">
				<Stack className="product-detail-content">
					{/* Left Side - Image Gallery */}
					<Stack className="image-gallery">
						{/* Main Image */}
						<Box className="main-image-container">
							<img src={mainImage} alt={product.productTitle} className="main-image" />
							<IconButton className="zoom-btn">
								<ZoomInIcon />
							</IconButton>

							{/* Badges */}
							<Stack className="image-badges">
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
								{product.productPriceType === 'RENT' && (
									<Box className="badge rent-badge">
										<Typography>RENT</Typography>
									</Box>
								)}
							</Stack>
						</Box>
						<Stack className="thumbnail-container">
							<Box>
								<img src={mainImage} alt={`${product.productTitle}`} />
							</Box>
						</Stack>
					</Stack>

					{/* Right Side - Product Info */}
					<Stack className="product-info">
						{/* Title Section */}
						<Divider />
						<Stack className="title-section">
							<Typography className="product-title">{product.productTitle}</Typography>
							{product.productModel && <Typography className="product-model">{product.productModel}</Typography>}
							<IconButton className="like-btn" onClick={handleLike}>
								{isLiked ? (
									<FavoriteIcon style={{ fontSize: '28px', color: '#ef4444' }} />
								) : (
									<FavoriteBorderIcon style={{ fontSize: '28px', color: '#6b7280' }} />
								)}
							</IconButton>
						</Stack>

						{/* Price Section */}
						{/* <Stack className="price-section">
							<Typography className="price-label">Price</Typography>
							<Typography className="product-price">
								{product.productPrice?.toLocaleString()} {product.productCurrency || 'won'}
							</Typography>
						</Stack> */}

						{/* <Divider /> */}

						{/* Specifications */}
						<Stack className="specs-section">
							{/* <Typography className="section-title">Specifications</Typography> */}

							<Stack className="spec-row">
								<Typography className="spec-label">가격</Typography>
								<Typography className="spec-value">
									{product.productPrice?.toLocaleString()} {product.productCurrency}
								</Typography>
							</Stack>

							<Stack className="spec-row">
								<Typography className="spec-label">브랜드</Typography>
								<Typography className="spec-value">{product.productBrand || '-'}</Typography>
							</Stack>

							<Stack className="spec-row">
								<Typography className="spec-label">모델</Typography>
								<Typography className="spec-value">{product.productModel || '-'}</Typography>
							</Stack>

							{product.productBuildYear && (
								<Stack className="spec-row">
									<Typography className="spec-label">건설 연도</Typography>
									<Typography className="spec-value">{product.productBuildYear}</Typography>
								</Stack>
							)}

							{/* <Stack className="spec-row">
								<Typography className="spec-label">Condition</Typography>
								<Typography className="spec-value">{product.productCondition || '-'}</Typography>
							</Stack> */}

							{/* <Stack className="spec-row">
								<Typography className="spec-label">Category</Typography>
								<Typography className="spec-value">{product.productCategory || '-'}</Typography>
							</Stack> */}

							{/* {product.productEngineType && (
								<Stack className="spec-row">
									<Typography className="spec-label">Engine Type</Typography>
									<Typography className="spec-value">{product.productEngineType}</Typography>
								</Stack>
							)} */}

							{/* {product.productSpeed && (
								<Stack className="spec-row">
									<Typography className="spec-label">Max Speed</Typography>
									<Typography className="spec-value">{product.productSpeed} km/h</Typography>
								</Stack>
							)} */}

							{/* {product.productLength && (
								<Stack className="spec-row">
									<Typography className="spec-label">Length</Typography>
									<Typography className="spec-value">{product.productLength} m</Typography>
								</Stack>
							)} */}

							{/* <Stack className="spec-row">
								<Typography className="spec-label">Location</Typography>
								<Typography className="spec-value">{product.productAddress || '-'}</Typography>
							</Stack> */}
						</Stack>

						<Divider />
						<Stack className="price-section">
							<Typography className="price-label">{product.productTitle}</Typography>
							<Typography className="product-price">
								{product.productPrice?.toLocaleString()} {product.productCurrency || 'won'}
							</Typography>
						</Stack>
						<Divider />

						{/* Contact Buttons */}
						<Stack className="contact-section">
							<Stack className="contact-buttons">
								<Button className="kakao-btn" onClick={handleContactKakao}>
									<img src="/img/icons/kakao_logo.svg" alt="KakaoTalk" />
									<span>카카오톡</span>
								</Button>
								<Button className="naver-btn" onClick={handleContactNaver}>
									<img src="/img/icons/naver_logo.png" alt="Naver" />
									<span>네이버톡</span>
								</Button>
							</Stack>
							<Stack className="contact-share">
								<Button className="contact-btn" onClick={handleContact} variant="contained" fullWidth>
									연락하다
								</Button>
								<Button
									className="share-btn"
									onClick={handleShare}
									variant="outlined"
									fullWidth
									startIcon={<ShareIcon />}
								>
									Share
								</Button>
							</Stack>
						</Stack>
					</Stack>
				</Stack>
			</div>
			{/* Tabbed Info Section */}
			<Stack className="product-info-tabs">
				<Box className="tabs-header">
					<Tabs value={activeTab} onChange={handleTabChange} className="info-tabs">
						<Tab label="View More Images" className="info-tab" />
						<Tab label="Detailed Info" className="info-tab" />
						<Tab label="Product Reviews" className="info-tab" />
						<Tab label="Send Inquiry" className="info-tab" />
					</Tabs>
				</Box>

				{/* Tab Panels */}
				<Box className="tab-content">
					{/* Tab 0: View More Images */}
					{activeTab === 0 && (
						<Stack className="tab-panel images-panel">
							<Typography className="panel-title">Product Images</Typography>
							<Stack className="images-grid">
								{productImages.map((img, index) => (
									<Box key={index} className="image-item" onClick={() => handleImageSelect(index)}>
										<img src={img} alt={`${product.productTitle} ${index + 1}`} />
									</Box>
								))}
							</Stack>
						</Stack>
					)}

					{/* Tab 1: Detailed Info */}
					{activeTab === 1 && (
						<Stack className="tab-panel details-panel">
							<Typography className="panel-title">Detailed Information</Typography>

							{/* Specs Grid with Icons */}
							<Stack className="specs-grid">
								{/* Product Title */}
								<Box className="spec-card">
									<Box className="spec-icon">
										<img src="/img/icons/title.png" alt="Product" />
									</Box>
									<Stack className="spec-content">
										<Typography className="spec-label">Product Title</Typography>
										<Typography className="spec-value">{product.productTitle}</Typography>
									</Stack>
								</Box>

								{/* Brand */}
								<Box className="spec-card">
									<Box className="spec-icon brand-icon">
										<img src="/img/icons/brand.png" alt="Brand" />
									</Box>
									<Stack className="spec-content">
										<Typography className="spec-label">Brand</Typography>
										<Typography className="spec-value">{product.productBrand || '-'}</Typography>
									</Stack>
								</Box>

								{/* Model */}
								<Box className="spec-card">
									<Box className="spec-icon">
										<img src="/img/icons/model.svg" alt="Model" />
									</Box>
									<Stack className="spec-content">
										<Typography className="spec-label">Model</Typography>
										<Typography className="spec-value">{product.productModel || '-'}</Typography>
									</Stack>
								</Box>

								{/* Category */}
								<Box className="spec-card">
									<Box className="spec-icon category-icon">
										<img src="/img/icons/category.svg" alt="Model" />
									</Box>
									<Stack className="spec-content">
										<Typography className="spec-label">Category</Typography>
										<Typography className="spec-value">{product.productCategory || '-'}</Typography>
									</Stack>
								</Box>

								{/* Condition */}
								<Box className="spec-card">
									<Box className="spec-icon condition-icon">{product.productCondition === 'NEW' ? '✨' : '🔄'}</Box>
									<Stack className="spec-content">
										<Typography className="spec-label">Condition</Typography>
										<Typography className="spec-value">{product.productCondition || '-'}</Typography>
									</Stack>
								</Box>

								{/* Price Type */}
								<Box className="spec-card">
									<Box className="spec-icon price-type-icon">{product.productPriceType === 'RENT' ? '📅' : '💰'}</Box>
									<Stack className="spec-content">
										<Typography className="spec-label">Price Type</Typography>
										<Typography className="spec-value">{product.productPriceType || '-'}</Typography>
									</Stack>
								</Box>

								{/* Price */}
								<Box className="spec-card highlight-card">
									<Box className="spec-icon price-icon">
										<CurrencyExchangeIcon />
									</Box>
									<Stack className="spec-content">
										<Typography className="spec-label">Price</Typography>
										<Typography className="spec-value price-highlight">
											{product.productPrice?.toLocaleString()} {product.productCurrency || 'KRW'}
										</Typography>
									</Stack>
								</Box>

								{/* Engine Type */}
								{product.productEngineType && (
									<Box className="spec-card">
										<Box className="spec-icon">
											<img src="/img/icons/engine.svg" alt="Product" />
										</Box>
										<Stack className="spec-content">
											<Typography className="spec-label">Engine Type</Typography>
											<Typography className="spec-value">{product.productEngineType}</Typography>
										</Stack>
									</Box>
								)}

								{/* Max Speed */}
								{product.productSpeed && (
									<Box className="spec-card">
										<Box className="spec-icon">
											<img src="/img/icons/speed.svg" alt="Product" />
										</Box>
										<Stack className="spec-content">
											<Typography className="spec-label">Max Speed</Typography>
											<Typography className="spec-value">{product.productSpeed} km/h</Typography>
										</Stack>
									</Box>
								)}

								{/* Length */}
								{product.productLength && (
									<Box className="spec-card">
										<Box className="spec-icon">
											<img src="/img/icons/length.svg" alt="Product" />
										</Box>
										<Stack className="spec-content">
											<Typography className="spec-label">Length</Typography>
											<Typography className="spec-value">{product.productLength} m</Typography>
										</Stack>
									</Box>
								)}

								{/* Build Year */}
								{product.productBuildYear && (
									<Box className="spec-card">
										<Box className="spec-icon">
											<img src="/img/icons/year.svg" alt="Product" />
										</Box>
										<Stack className="spec-content">
											<Typography className="spec-label">Build Year</Typography>
											<Typography className="spec-value">{product.productBuildYear}</Typography>
										</Stack>
									</Box>
								)}

								{/* Location */}
								<Box className="spec-card">
									<Box className="spec-icon location-icon">
										<LocationOnIcon />
									</Box>
									<Stack className="spec-content">
										<Typography className="spec-label">Location</Typography>
										<Typography className="spec-value">{product.productAddress || '-'}</Typography>
									</Stack>
								</Box>

								{/* Views */}
								{/* <Box className="spec-card">
									<Box className="spec-icon views-icon">👁️</Box>
									<Stack className="spec-content">
										<Typography className="spec-label">Views</Typography>
										<Typography className="spec-value">{product.productViews || 0}</Typography>
									</Stack>
								</Box> */}

								{/* Likes */}
								{/* <Box className="spec-card">
									<Box className="spec-icon likes-icon">❤️</Box>
									<Stack className="spec-content">
										<Typography className="spec-label">Likes</Typography>
										<Typography className="spec-value">{product.productLikes || 0}</Typography>
									</Stack>
								</Box> */}
							</Stack>

							{/* Description - Full Width */}
							{product.productDescription && (
								<Stack className="description-card">
									<Box className="description-header">
										<Box className="spec-icon description-icon">📝</Box>
										<Typography className="description-title">Description</Typography>
									</Box>
									<Typography className="description-text">{product.productDescription}</Typography>
								</Stack>
							)}
						</Stack>
					)}

					{/* Tab 2: Product Reviews */}
					{activeTab === 2 && (
						<Stack className="tab-panel reviews-panel">
							<Typography className="panel-title">Product Reviews</Typography>

							{/* Reviews Count */}
							{commentsData?.getComments?.metaCounter?.total > 0 && (
								<Typography className="reviews-count">
									{commentsData.getComments.metaCounter.total} Review
									{commentsData.getComments.metaCounter.total !== 1 ? 's' : ''}
								</Typography>
							)}

							{/* Comments List */}
							<Stack className="comments-list">
								{commentsLoading ? (
									<Stack className="loading-container">
										<Typography>Loading reviews...</Typography>
									</Stack>
								) : commentsData?.getComments?.list && commentsData.getComments.list.length > 0 ? (
									commentsData.getComments.list.map((comment: any) => (
										<Box key={comment._id} className="comment-card">
											{/* Comment Header */}
											<Stack className="comment-header">
												<Box className="user-avatar">
													<img
														src={
															comment.memberData?.memberImage
																? `${comment.memberData.memberImage}`
																: '/img/profile/default-user.png'
														}
														alt={comment.memberData?.memberNick || 'User'}
													/>
												</Box>
												<Stack className="user-info">
													<Typography className="user-name">
														{comment.memberData?.memberNick || comment.memberData?.memberFullName || 'Anonymous'}
													</Typography>
													<Typography className="comment-date">
														{moment(comment.createdAt).format('MMM DD, YYYY')}
													</Typography>
												</Stack>

												{/* Edit/Delete buttons if user owns comment */}
												{user?._id === comment.memberId && (
													<Stack className="comment-actions">
														<IconButton
															className="action-btn"
															size="small"
															onClick={() => handleEditComment(comment._id, comment.commentContent)}
														>
															<EditIcon fontSize="small" />
														</IconButton>
														<IconButton
															className="action-btn"
															size="small"
															// onClick={() => handleDeleteComment(comment._id)}
														>
															<DeleteIcon fontSize="small" />
														</IconButton>
													</Stack>
												)}
											</Stack>

											{/* Comment Content */}
											<Typography className="comment-content">{comment.commentContent}</Typography>
										</Box>
									))
								) : (
									<Stack className="no-reviews-container">
										<Typography className="no-reviews">No reviews yet</Typography>
										<Typography className="no-reviews-sub">Be the first to review this product!</Typography>
									</Stack>
								)}
							</Stack>

							{/* Write Review Form - AT BOTTOM */}
							<Stack className="write-review-section">
								<Box className="review-form-header">
									<Typography className="review-form-title">
										{editingCommentId ? 'Edit Your Review' : 'Write a Review'}
									</Typography>
									<Typography className="review-form-subtitle">Share your experience with this product</Typography>
								</Box>

								<Stack className="review-form">
									<TextField
										fullWidth
										multiline
										rows={4}
										placeholder="Share your thoughts about this product..."
										value={commentForm.commentContent}
										onChange={(e) => setCommentForm({ ...commentForm, commentContent: e.target.value })}
										className="review-textarea"
										variant="outlined"
									/>

									<Stack className="review-form-actions">
										<Typography className="character-count">{commentForm.commentContent.length} / 500</Typography>
										<Stack className="action-buttons">
											{editingCommentId && (
												<Button variant="outlined" className="cancel-btn" onClick={handleCancelEdit}>
													Cancel
												</Button>
											)}
											<Button
												variant="contained"
												className="submit-review-btn"
												onClick={editingCommentId ? handleUpdateComment : handleCommentSubmit}
												disabled={!commentForm.commentContent.trim()}
											>
												{editingCommentId ? 'Update Review' : 'Post Review'}
											</Button>
										</Stack>
									</Stack>
								</Stack>
							</Stack>
						</Stack>
					)}

					{/* Tab 3: Send Inquiry   */}
					{activeTab === 3 && (
						<Stack className="tab-panel inquiry-panel" ref={inquiryRef}>
							<Typography className="panel-title">Send Product Inquiry</Typography>

							<Stack className="inquiry-form">
								{/* Contact Person Information */}
								<Stack className="contact-info-section">
									<Typography className="section-subtitle">Your Contact Information</Typography>

									<TextField
										fullWidth
										label="Full Name"
										placeholder="Enter your full name"
										value={inquiryForm.fullName}
										onChange={(e) => setInquiryForm({ ...inquiryForm, fullName: e.target.value })}
										className="inquiry-input"
										required
									/>

									<Stack className="contact-row">
										<TextField
											fullWidth
											label="Email"
											type="email"
											placeholder="your.email@example.com"
											value={inquiryForm.email}
											onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
											className="inquiry-input"
											required
										/>

										<TextField
											fullWidth
											label="Phone Number"
											placeholder="010-1234-5678"
											value={inquiryForm.phone}
											onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
											className="inquiry-input"
										/>
									</Stack>
								</Stack>

								{/* Preferred Contact Method */}
								<Stack className="contact-method-section">
									<Typography className="section-subtitle">Preferred Contact Method</Typography>
									<Stack className="contact-methods">
										<Button
											className={`method-btn ${inquiryForm.preferredContactMethod === 'EMAIL' ? 'active' : ''}`}
											onClick={() => handleContactMethodChange('EMAIL')}
										>
											📧 Email
										</Button>
										<Button
											className={`method-btn ${inquiryForm.preferredContactMethod === 'PHONE' ? 'active' : ''}`}
											onClick={() => handleContactMethodChange('PHONE')}
										>
											📞 Phone
										</Button>
										<Button
											className={`method-btn ${inquiryForm.preferredContactMethod === 'WHATSAPP' ? 'active' : ''}`}
											onClick={() => handleContactMethodChange('WHATSAPP')}
										>
											💬 WhatsApp
										</Button>
										<Button
											className={`method-btn ${inquiryForm.preferredContactMethod === 'ANY' ? 'active' : ''}`}
											onClick={() => handleContactMethodChange('ANY')}
										>
											💚 Any
										</Button>
									</Stack>
								</Stack>

								{/* Inquiry Message */}
								<TextField
									fullWidth
									multiline
									rows={8}
									label="Your Inquiry Message"
									placeholder="Please describe your inquiry about this product..."
									value={inquiryForm.inquiryMessage}
									onChange={(e) => setInquiryForm({ ...inquiryForm, inquiryMessage: e.target.value })}
									className="inquiry-textarea"
									required
								/>

								{/* Product Information Display */}
								<Stack className="inquiry-info">
									<Typography className="info-text">
										<strong>Product:</strong> {product.productTitle}
									</Typography>
									<Typography className="info-text">
										<strong>Price:</strong> {product.productPrice?.toLocaleString()} {product.productCurrency || 'won'}
									</Typography>
									{product.productBrand && (
										<Typography className="info-text">
											<strong>Brand:</strong> {product.productBrand}
										</Typography>
									)}
									{product.productModel && (
										<Typography className="info-text">
											<strong>Model:</strong> {product.productModel}
										</Typography>
									)}
								</Stack>

								{/* Submit Button */}
								<Button
									variant="contained"
									fullWidth
									className="inquiry-submit-btn"
									onClick={handleInquirySubmit}
									endIcon={<SendIcon />}
								>
									Send Inquiry
								</Button>

								{/* Privacy Notice */}
								<Typography className="privacy-notice">
									Your contact information will be shared with the seller to respond to your inquiry.
								</Typography>
							</Stack>
						</Stack>
					)}
				</Box>
			</Stack>
		</div>
	);
};

export default withLayoutBasic(ProductDetail);
