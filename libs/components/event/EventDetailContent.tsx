import React, { useState } from 'react';
import { Stack, Box, Typography, IconButton, Chip, TextField, Button } from '@mui/material';
import { useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { Event } from '../../types/event/event';
import { userVar } from '../../../apollo/store';
import { LIKE_TARGET_EVENT, CREATE_COMMENT, UPDATE_COMMENT } from '../../../apollo/user/mutation';
import { GET_COMMENTS } from '../../../apollo/user/query';
import { useReactiveVar } from '@apollo/client';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StarIcon from '@mui/icons-material/Star';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import moment from 'moment';
import Swal from 'sweetalert2';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { Message } from '../../enums/common.enum';
import { CommentGroup } from '../../enums/comment.enum';
import CampaignIcon from '@mui/icons-material/Campaign';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import HailIcon from '@mui/icons-material/Hail';
import { borderBottom } from '@mui/system';

interface EventDetailContentProps {
	event: Event;
	eventRefetch: any;
}

const EventDetailContent: React.FC<EventDetailContentProps> = ({ event, eventRefetch }) => {
	const router = useRouter();
	const user = useReactiveVar(userVar);

	// Image Gallery State
	const [lightboxOpen, setLightboxOpen] = useState(false);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);

	// Comment State
	const [commentForm, setCommentForm] = useState({ commentContent: '' });
	const [editingCommentId, setEditingCommentId] = useState<string | null>(null);

	/** APOLLO MUTATIONS **/
	const [likeTargetEvent] = useMutation(LIKE_TARGET_EVENT);
	const [createComment] = useMutation(CREATE_COMMENT);
	const [updateComment] = useMutation(UPDATE_COMMENT);

	/** APOLLO QUERY - Comments **/
	const {
		loading: commentsLoading,
		data: commentsData,
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
					commentRefId: event._id,
				},
			},
		},
		notifyOnNetworkStatusChange: true,
	});

	/** HANDLERS **/
	const handleLikeEvent = async () => {
		try {
			if (!user?._id) {
				await sweetMixinErrorAlert(Message.NOT_AUTHENTICATED);
				return;
			}

			await likeTargetEvent({ variables: { input: event._id } });
			await eventRefetch({ input: event._id });
			await sweetTopSmallSuccessAlert('Success', 800);
		} catch (err: any) {
			console.log('ERROR, handleLikeEvent:', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	// Image Gallery Handlers
	const handleImageClick = (index: number) => {
		setCurrentImageIndex(index);
		setLightboxOpen(true);
	};

	const handleCloseLightbox = () => {
		setLightboxOpen(false);
	};

	const handlePrevImage = () => {
		setCurrentImageIndex((prev) => (prev === 0 ? event.eventImages.length - 1 : prev - 1));
	};

	const handleNextImage = () => {
		setCurrentImageIndex((prev) => (prev === event.eventImages.length - 1 ? 0 : prev + 1));
	};

	// Comment Handlers
	const handleCommentSubmit = async () => {
		try {
			if (!user?._id) throw new Error(Message.NOT_AUTHENTICATED);
			if (!commentForm.commentContent.trim()) {
				sweetMixinErrorAlert('Please write your review').then();
				return;
			}

			await createComment({
				variables: {
					input: {
						commentGroup: CommentGroup.EVENT,
						commentContent: commentForm.commentContent.trim(),
						commentRefId: event._id,
					},
				},
			});

			sweetTopSmallSuccessAlert('Review posted successfully!', 1500);
			setCommentForm({ commentContent: '' });
			await commentsRefetch();
			await eventRefetch({ input: event._id });
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

			await updateComment({
				variables: {
					input: {
						_id: editingCommentId,
						commentContent: commentForm.commentContent.trim(),
					},
				},
			});

			sweetTopSmallSuccessAlert('Review updated successfully!', 1500);
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

	const handleDeleteComment = async (commentId: string) => {
		try {
			if (!user?._id) throw new Error(Message.NOT_AUTHENTICATED);

			const result = await Swal.fire({
				title: 'Delete Review?',
				text: 'Are you sure you want to delete this review?',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#ef4444',
				cancelButtonColor: '#6b7280',
				confirmButtonText: 'Yes, delete it',
				cancelButtonText: 'Cancel',
			});

			if (!result.isConfirmed) return;

			await updateComment({
				variables: {
					input: {
						_id: commentId,
						commentStatus: 'DELETE',
					},
				},
			});

			sweetTopSmallSuccessAlert('Review deleted successfully!', 1500);
			await commentsRefetch();
			await eventRefetch({ input: event._id });
		} catch (err: any) {
			console.log('ERROR, handleDeleteComment:', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	/** HELPER FUNCTIONS **/
	const formatDuration = (minutes: number) => {
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		if (hours === 0) return `${mins} minutes`;
		if (mins === 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
		return `${hours}h ${mins}m`;
	};

	const parseHighlights = (description: string): string[] => {
		if (!description) return [];
		const lines = description.split('\n');
		return lines
			.filter((line) => line.trim().startsWith('•') || line.trim().startsWith('-'))
			.map((line) => line.replace(/^[•-]\s*/, '').trim());
	};

	const getMainDescription = (description: string): string => {
		if (!description) return '';
		return description
			.split('\n')
			.filter((line) => !line.trim().startsWith('•') && !line.trim().startsWith('-'))
			.join('\n')
			.trim();
	};

	const highlights = parseHighlights(event.eventDescription);
	const mainDescription = getMainDescription(event.eventDescription) || event.eventDescription;
	const isLiked = event?.meLiked?.[0]?.myFavorite || false;
	const comments = commentsData?.getComments?.list || [];
	const mainImage = event.eventImages[0] || '/img/default-event.jpg';
	const thumbnails = event.eventImages.slice(1, 5);

	return (
		<Stack className="event-detail-content-wrapper">
			{/* ===== HEADER ===== */}
			<Stack className="event-header">
				<Stack className="title-row">
					<Typography className="event-title">
						{event.eventTitle} <Chip label={event.eventCategory.replace(/_/g, ' ')} className="category-badge" />
					</Typography>
					<IconButton className={`like-btn ${isLiked ? 'liked' : ''}`} onClick={handleLikeEvent}>
						{isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
					</IconButton>
				</Stack>

				<Stack className="meta-row">
					<Box className="rating-box">
						<StarIcon className="star-icon" />
						<Typography className="rating-text">
							{event.eventRank ? (event.eventRank / 10).toFixed(1) : '5.0'}
						</Typography>
						<Typography className="reviews-text">({event.eventComments || 0} reviews)</Typography>
					</Box>

					<Box className="meta-item">
						<AccessTimeIcon className="meta-icon" />
						<Typography className="meta-text">{formatDuration(event.eventDurationMinutes)}</Typography>
					</Box>

					{event.eventLocation && (
						<Box className="meta-item">
							<LocationOnIcon className="meta-icon" />
							<Typography className="meta-text">{event.eventLocation.city}</Typography>
						</Box>
					)}

					<Stack className="stats-row">
						<Typography className="stat-text">{event.eventViews || 0} views</Typography>
						<Typography className="stat-text">•</Typography>
						<Typography className="stat-text">{event.eventLikes || 0} likes</Typography>
					</Stack>
				</Stack>

				<Stack className="static-row">
					<Box className="meta-item static-item">
						<Typography className="meta-text">English</Typography>
					</Box>

					<Box className="meta-item static-item">
						<Typography className="meta-text">Join in group</Typography>
					</Box>

					<Box className="meta-item static-item">
						<Typography className="meta-text">Meet at location</Typography>
					</Box>
				</Stack>
			</Stack>

			{/* ===== IMAGE GALLERY ===== */}
			<Stack className="event-image-gallery">
				<Box className="main-image" onClick={() => handleImageClick(0)}>
					<img src={mainImage} alt={event.eventTitle} />
					{event.eventImages.length > 1 && <Box className="image-count">+{event.eventImages.length - 1} photos</Box>}
				</Box>

				{thumbnails.length > 0 && (
					<Stack className="thumbnail-grid">
						{thumbnails.map((img, index) => (
							<Box key={index} className="thumbnail-image" onClick={() => handleImageClick(index + 1)}>
								<img src={img} alt={`${event.eventTitle} ${index + 2}`} />
							</Box>
						))}
					</Stack>
				)}
			</Stack>

			{/* Lightbox */}
			{lightboxOpen && (
				<Box className="image-lightbox">
					<IconButton className="close-btn" onClick={handleCloseLightbox}>
						<CloseIcon />
					</IconButton>
					<IconButton className="nav-btn prev-btn" onClick={handlePrevImage}>
						<ChevronLeftIcon />
					</IconButton>
					<Box className="lightbox-image">
						<img src={event.eventImages[currentImageIndex]} alt={`${event.eventTitle} ${currentImageIndex + 1}`} />
					</Box>
					<IconButton className="nav-btn next-btn" onClick={handleNextImage}>
						<ChevronRightIcon />
					</IconButton>
					<Box className="image-counter">
						{currentImageIndex + 1} / {event.eventImages.length}
					</Box>
				</Box>
			)}

			{/* ===== DESCRIPTION ===== */}
			<Box className="info-section">
				<Typography className="section-title">
					<CampaignIcon /> About This Experience
				</Typography>
				<Typography className="section-content">{mainDescription}</Typography>
			</Box>

			{/* ===== HIGHLIGHTS ===== */}
			{highlights.length > 0 && (
				<Box className="info-section highlights-section">
					<Typography className="section-title">Highlights</Typography>
					<Stack className="highlights-list">
						{highlights.map((highlight, index) => (
							<Box key={index} className="highlight-item">
								<CheckCircleIcon className="check-icon" />
								<Typography className="highlight-text">{highlight}</Typography>
							</Box>
						))}
					</Stack>
				</Box>
			)}

			{/* ===== REQUIREMENTS ===== */}
			{event.eventRequirements && (
				<Box className="info-section requirements-section">
					<Typography className="section-title">Requirements</Typography>
					<Stack className="requirements-list">
						{event.eventRequirements.minAge && (
							<Typography className="requirement-text">
								• Minimum age: {event.eventRequirements.minAge} years
							</Typography>
						)}
						{event.eventRequirements.maxAge && (
							<Typography className="requirement-text">
								• Maximum age: {event.eventRequirements.maxAge} years
							</Typography>
						)}
						{event.eventRequirements.experienceLevel && (
							<Typography className="requirement-text">
								• Experience level: {event.eventRequirements.experienceLevel.replace(/_/g, ' ')}
							</Typography>
						)}
						{event.eventRequirements.bringItems && event.eventRequirements.bringItems.length > 0 && (
							<>
								<Typography className="requirement-text">• What to bring:</Typography>
								{event.eventRequirements.bringItems.map((item, idx) => (
									<Typography key={idx} className="requirement-text-indent">
										- {item}
									</Typography>
								))}
							</>
						)}
						<div className="require-img">
							<img src="/img/icons/requirement.png" />
						</div>
					</Stack>
				</Box>
			)}

			{/* ===== CANCELLATION POLICY ===== */}
			{event.eventCancellationPolicy && (
				<Box className="info-section ">
					<Typography className="section-title">Cancellation Policy</Typography>
					<Typography className="section-content">{event.eventCancellationPolicy}</Typography>
				</Box>
			)}

			<Box className="info-section ">
				<Typography className="section-title">
					<EventAvailableIcon sx={{ color: 'orange' }} />
					Usage validity
				</Typography>
				<Typography className="section-content">
					The voucher is valid only on the specified date (and time if applicable)
				</Typography>
				<Typography className="section-title">
					Pick-up information <HailIcon />
				</Typography>
				<Typography className="section-content">
					Pick up location / Pick up time will be assigned when the voucher is confirmed. Please check the confirmation
					details on the voucher.
				</Typography>
			</Box>

			{/* ===== LOCATION ===== */}
			{event.eventLocation && (
				<Box className="info-section">
					<Typography className="section-title">
						Meeting Point <LocationOnIcon sx={{ color: 'red' }} />
					</Typography>
					<Stack className="location-info">
						<Typography className="location-text">
							<strong>City:</strong> {event.eventLocation.city}
						</Typography>
						{event.eventLocation.address && (
							<Typography className="location-text">
								<strong>Address:</strong> {event.eventLocation.address}
							</Typography>
						)}
					</Stack>
				</Box>
			)}

			{/* ===== PROVIDER INFO ===== */}
			{event.businessData && (
				<Box className="info-section provider-section">
					<Typography className="section-title">Provided By</Typography>
					<Stack className="provider-info">
						<Box className="provider-avatar">
							<img src={event.businessData.memberImage} alt={event.businessData.memberNick} />
						</Box>
						<Stack className="provider-details">
							<Typography className="provider-name">
								{event.businessData.memberNick} | {event.businessName}
							</Typography>
							<Typography className="provider-desc">
								Contact {event.businessData.memberNick} if you need more information
							</Typography>
						</Stack>
					</Stack>
				</Box>
			)}

			{/* ===== REVIEWS ===== */}
			<Box className="info-section reviews-section">
				<Typography className="section-title">
					Reviews ({commentsData?.getComments?.metaCounter[0]?.total || 0})
				</Typography>

				{/* Comments List */}
				<Stack className="comments-list">
					{commentsLoading ? (
						<Typography>Loading reviews...</Typography>
					) : comments.length > 0 ? (
						comments.map((comment: any) => (
							<Box key={comment._id} className="comment-card">
								<Stack className="comment-header">
									<Box className="user-avatar">
										<img
											src={comment.memberData?.memberImage || '/img/profile/default-user.png'}
											alt={comment.memberData?.memberNick || 'User'}
										/>
									</Box>
									<Stack className="user-info">
										<Typography className="user-name">
											{comment.memberData?.memberNick || comment.memberData?.memberFullName || 'Anonymous'}
										</Typography>
										<Typography className="comment-date">{moment(comment.createdAt).format('MMM DD, YYYY')}</Typography>
									</Stack>

									{user?._id === comment.memberId && (
										<Stack className="comment-actions">
											<IconButton
												className="action-btn"
												size="small"
												onClick={() => handleEditComment(comment._id, comment.commentContent)}
											>
												<EditIcon fontSize="small" />
											</IconButton>
											<IconButton className="action-btn" size="small" onClick={() => handleDeleteComment(comment._id)}>
												<DeleteIcon fontSize="small" />
											</IconButton>
										</Stack>
									)}
								</Stack>
								<Typography className="comment-content">{comment.commentContent}</Typography>
							</Box>
						))
					) : (
						<Stack className="no-reviews-container">
							<Typography className="no-reviews">No reviews yet</Typography>
							<Typography className="no-reviews-sub">Be the first to review this experience!</Typography>
						</Stack>
					)}
				</Stack>

				{/* Write Review Form */}
				<Stack className="write-review-section">
					<Typography className="review-form-title">
						{editingCommentId ? 'Edit Your Review' : 'Write a Review'}
					</Typography>

					<TextField
						fullWidth
						multiline
						rows={4}
						placeholder="Share your thoughts about this experience..."
						value={commentForm.commentContent}
						onChange={(e) => setCommentForm({ commentContent: e.target.value })}
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
			</Box>
		</Stack>
	);
};

export default EventDetailContent;
