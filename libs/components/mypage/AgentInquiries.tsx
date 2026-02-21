import React, { useState } from 'react';
import {
	Stack,
	Typography,
	Chip,
	Button,
	Pagination,
	CircularProgress,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Tab,
	Tabs,
	Divider,
} from '@mui/material';
import { useQuery, useMutation } from '@apollo/client';
import { GET_AGENT_INQUIRIES } from '../../../apollo/user/query';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import moment from 'moment';
import InboxIcon from '@mui/icons-material/Inbox';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import ReplyIcon from '@mui/icons-material/Reply';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import { InquiryStatus } from '../../enums/productInquiry.enum';
import { MARK_INQUIRY_VIEWED, REPLY_INQUIRY } from '../../../apollo/user/mutation';

// ─── Types ───────────────────────────────────────────────────────────────────

interface ContactPerson {
	fullName: string;
	email: string;
	phone?: string;
}

interface Inquiry {
	_id: string;
	buyerId: string;
	sellerId: string;
	productId: string;
	inquiryMessage: string;
	preferredContactMethod: string;
	sellerReply?: string;
	status: string;
	isRead: boolean;
	viewedAt?: string;
	respondedAt?: string;
	closedAt?: string;
	createdAt: string;
	updatedAt: string;
	contactPerson: ContactPerson;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getStatusColor = (status: string): 'default' | 'warning' | 'success' | 'error' | 'info' => {
	switch (status?.toUpperCase()) {
		case 'PENDING':
			return 'warning';
		case 'RESPONDED':
			return 'success';
		case 'CLOSED':
			return 'default';
		default:
			return 'default';
	}
};

// ─── Component ────────────────────────────────────────────────────────────────

const AgentInquiries = () => {
	const [page, setPage] = useState<number>(1);
	const [statusFilter, setStatusFilter] = useState<string>('');
	const [isReadFilter, setIsReadFilter] = useState<string>('');
	const [replyDialogOpen, setReplyDialogOpen] = useState<boolean>(false);
	const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
	const [replyText, setReplyText] = useState<string>('');
	const LIMIT = 10;

	const buildFilter = () => {
		const filter: any = {};
		if (statusFilter) filter.status = statusFilter;
		if (isReadFilter !== '') filter.isRead = isReadFilter === 'true';
		return filter;
	};

	const { loading, data, refetch } = useQuery(GET_AGENT_INQUIRIES, {
		fetchPolicy: 'network-only',
		variables: {
			input: {
				page,
				limit: LIMIT,
				filter: buildFilter(),
			},
		},
	});

	const [markViewed] = useMutation(MARK_INQUIRY_VIEWED);
	const [replyToInquiry] = useMutation(REPLY_INQUIRY);

	const inquiries: Inquiry[] = data?.getReceivedInquiries?.list ?? [];
	const total: number = data?.getReceivedInquiries?.metaCounter?.[0]?.total ?? 0;
	const totalPages = Math.ceil(total / LIMIT);

	// ─── Handlers ─────────────────────────────────────────────────────────────

	const handleOpenReply = async (inquiry: Inquiry) => {
		setSelectedInquiry(inquiry);
		setReplyText(inquiry.sellerReply || '');
		setReplyDialogOpen(true);

		if (!inquiry.isRead) {
			try {
				await markViewed({ variables: { input: inquiry._id } });
				await refetch();
			} catch (err: any) {
				console.log('markViewed error:', err.message);
			}
		}
	};

	const handleCloseReply = () => {
		setReplyDialogOpen(false);
		setSelectedInquiry(null);
		setReplyText('');
	};

	const handleMarkViewed = async (inquiryId: string) => {
		try {
			await markViewed({ variables: { input: inquiryId } });
			await sweetTopSmallSuccessAlert('Marked as viewed', 1000);
			await refetch();
		} catch (err: any) {
			sweetMixinErrorAlert(err.message);
		}
	};

	const handleReplySubmit = async () => {
		if (!selectedInquiry || !replyText.trim()) return;
		try {
			await replyToInquiry({
				variables: {
					input: {
						inquiryId: selectedInquiry._id,
						sellerReply: replyText.trim(),
					},
				},
			});
			await sweetTopSmallSuccessAlert('Reply sent!', 1200);
			handleCloseReply();
			await refetch();
		} catch (err: any) {
			sweetMixinErrorAlert(err.message);
		}
	};

	const handleFilterChange = (type: 'status' | 'isRead', value: string) => {
		if (type === 'status') setStatusFilter(value);
		else setIsReadFilter(value);
		setPage(1);
	};

	return (
		<div className="agent-inquiries-page">
			{/* Header */}
			<Stack className="page-header" direction="row" alignItems="center" justifyContent="space-between">
				<Stack direction="row" alignItems="center" gap="12px">
					<InboxIcon className="header-icon" />
					<div>
						<Typography className="page-title">Inquiries</Typography>
						<Typography className="page-subtitle">{total} total inquiries</Typography>
					</div>
				</Stack>

				{/* Filters */}
				<Stack direction="row" gap="12px">
					<FormControl size="small" className="filter-select">
						<InputLabel>Status</InputLabel>
						<Select value={statusFilter} label="Status" onChange={(e) => handleFilterChange('status', e.target.value)}>
							<MenuItem value="">All</MenuItem>
							<MenuItem value="PENDING">Pending</MenuItem>
							<MenuItem value="RESPONDED">Responded</MenuItem>
							<MenuItem value="CLOSED">Closed</MenuItem>
						</Select>
					</FormControl>

					<FormControl size="small" className="filter-select">
						<InputLabel>Read</InputLabel>
						<Select value={isReadFilter} label="Read" onChange={(e) => handleFilterChange('isRead', e.target.value)}>
							<MenuItem value="">All</MenuItem>
							<MenuItem value="false">Unread</MenuItem>
							<MenuItem value="true">Read</MenuItem>
						</Select>
					</FormControl>
				</Stack>
			</Stack>

			{/* Content */}
			{loading ? (
				<Stack className="loading-state" alignItems="center" justifyContent="center">
					<CircularProgress size={40} />
					<Typography>Loading inquiries...</Typography>
				</Stack>
			) : inquiries.length === 0 ? (
				<Stack className="empty-state" alignItems="center" justifyContent="center">
					<InboxIcon className="empty-icon" />
					<Typography className="empty-title">No Inquiries Found</Typography>
					<Typography className="empty-sub">Inquiries from buyers will appear here.</Typography>
				</Stack>
			) : (
				<>
					<Stack className="inquiries-list" gap="12px">
						{inquiries.map((inq: Inquiry) => (
							<div key={inq._id} className={`inquiry-card ${!inq.isRead ? 'unread' : ''}`}>
								{/* Card Header */}
								<Stack direction="row" alignItems="flex-start" justifyContent="space-between" className="card-header">
									<Stack direction="row" alignItems="center" gap="12px">
										{/* Unread dot */}
										{!inq.isRead && <span className="unread-dot" />}

										{/* Contact info */}
										<div>
											<Stack direction="row" alignItems="center" gap="6px">
												<PersonIcon className="meta-icon" />
												<Typography className="guest-name">{inq.contactPerson?.fullName}</Typography>
											</Stack>
											<Stack direction="row" alignItems="center" gap="6px">
												<EmailIcon className="meta-icon" />
												<Typography className="guest-meta">{inq.contactPerson?.email}</Typography>
											</Stack>
											{inq.contactPerson?.phone && (
												<Stack direction="row" alignItems="center" gap="6px">
													<PhoneIcon className="meta-icon" />
													<Typography className="guest-meta">{inq.contactPerson.phone}</Typography>
												</Stack>
											)}
										</div>
									</Stack>

									{/* Right side: status + date */}
									<Stack alignItems="flex-end" gap="6px">
										<Chip label={inq.status} color={getStatusColor(inq.status)} size="small" className="status-chip" />
										<Typography className="date-text">{moment(inq.createdAt).format('MMM DD, YYYY HH:mm')}</Typography>
										<Typography className="contact-method">via {inq.preferredContactMethod}</Typography>
									</Stack>
								</Stack>

								<Divider className="card-divider" />

								{/* Message */}
								<Typography className="inquiry-message">{inq.inquiryMessage}</Typography>

								{/* Seller Reply (if exists) */}
								{inq.sellerReply && (
									<div className="seller-reply-box">
										<Typography className="reply-label">Your Reply</Typography>
										<Typography className="reply-text">{inq.sellerReply}</Typography>
									</div>
								)}

								{/* Actions */}
								<Stack direction="row" gap="10px" className="card-actions">
									<Button
										size="small"
										variant="contained"
										startIcon={<ReplyIcon />}
										className="btn-reply"
										onClick={() => handleOpenReply(inq)}
									>
										{inq.sellerReply ? 'Edit Reply' : 'Reply'}
									</Button>

									{!inq.isRead && (
										<Button
											size="small"
											variant="outlined"
											startIcon={<MarkEmailReadIcon />}
											className="btn-mark-read"
											onClick={() => handleMarkViewed(inq._id)}
										>
											Mark as Read
										</Button>
									)}
								</Stack>
							</div>
						))}
					</Stack>

					{/* Pagination */}
					{totalPages > 1 && (
						<Stack className="pagination-wrap" alignItems="center">
							<Pagination
								count={totalPages}
								page={page}
								onChange={(_, val) => setPage(val)}
								color="primary"
								shape="rounded"
							/>
						</Stack>
					)}
				</>
			)}

			{/* Reply Dialog */}
			<Dialog open={replyDialogOpen} onClose={handleCloseReply} fullWidth maxWidth="sm" className="reply-dialog">
				<DialogTitle className="dialog-title">
					Reply to Inquiry
					{selectedInquiry && (
						<Typography className="dialog-subtitle">
							From: {selectedInquiry.contactPerson?.fullName} · {selectedInquiry.contactPerson?.email}
						</Typography>
					)}
				</DialogTitle>

				<DialogContent className="dialog-content">
					{/* Original message */}
					<div className="original-message-box">
						<Typography className="original-label">Original Message</Typography>
						<Typography className="original-text">{selectedInquiry?.inquiryMessage}</Typography>
					</div>

					{/* Reply input */}
					<TextField
						fullWidth
						multiline
						rows={5}
						label="Your Reply"
						placeholder="Type your reply here..."
						value={replyText}
						onChange={(e) => setReplyText(e.target.value)}
						className="reply-input"
					/>
				</DialogContent>

				<DialogActions className="dialog-actions">
					<Button onClick={handleCloseReply} className="btn-cancel">
						Cancel
					</Button>
					<Button
						variant="contained"
						onClick={handleReplySubmit}
						disabled={!replyText.trim()}
						className="btn-send"
						startIcon={<ReplyIcon />}
					>
						Send Reply
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default AgentInquiries;
