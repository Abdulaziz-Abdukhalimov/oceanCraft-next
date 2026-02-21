import React, { useState } from 'react';
import {
	Stack,
	Typography,
	Chip,
	Pagination,
	CircularProgress,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Divider,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
} from '@mui/material';
import { useQuery } from '@apollo/client';
import { GET_MEMBER_INQUIRIES } from '../../../apollo/user/query';
import moment from 'moment';
import InboxIcon from '@mui/icons-material/Inbox';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import ReplyIcon from '@mui/icons-material/Reply';
import { InquiryStatus } from '../../enums/productInquiry.enum';

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

const MyInquiries = () => {
	const [page, setPage] = useState<number>(1);
	const [statusFilter, setStatusFilter] = useState<string>('');
	const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
	const LIMIT = 10;

	const { loading, data } = useQuery(GET_MEMBER_INQUIRIES, {
		fetchPolicy: 'network-only',
		variables: {
			input: {
				page,
				limit: LIMIT,
				filter: {
					...(statusFilter && { status: statusFilter }),
				},
			},
		},
	});

	const inquiries: Inquiry[] = data?.getMyInquiries?.list ?? [];
	const total: number = data?.getMyInquiries?.metaCounter?.[0]?.total ?? 0;
	const totalPages = Math.ceil(total / LIMIT);

	return (
		<div className="my-inquiries-page">
			{/* Header */}
			<Stack className="page-header" direction="row" alignItems="center" justifyContent="space-between">
				<Stack direction="row" alignItems="center" gap="12px">
					<InboxIcon className="header-icon" />
					<div>
						<Typography className="page-title">My Inquiries</Typography>
						<Typography className="page-subtitle">{total} total inquiries sent</Typography>
					</div>
				</Stack>

				<FormControl size="small" className="filter-select">
					<InputLabel>Status</InputLabel>
					<Select
						value={statusFilter}
						label="Status"
						onChange={(e) => {
							setStatusFilter(e.target.value);
							setPage(1);
						}}
					>
						<MenuItem value="">All</MenuItem>
						<MenuItem value="PENDING">Pending</MenuItem>
						<MenuItem value="RESPONDED">Responded</MenuItem>
						<MenuItem value="CLOSED">Closed</MenuItem>
					</Select>
				</FormControl>
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
					<Typography className="empty-title">No Inquiries Yet</Typography>
					<Typography className="empty-sub">Your product inquiries will appear here.</Typography>
				</Stack>
			) : (
				<>
					<Stack gap="12px">
						{inquiries.map((inq: Inquiry) => (
							<div
								key={inq._id}
								className={`inquiry-card ${inq.sellerReply ? 'has-reply' : ''}`}
								onClick={() => setSelectedInquiry(inq)}
							>
								<Stack direction="row" alignItems="flex-start" justifyContent="space-between" className="card-header">
									{/* Contact info */}
									<Stack gap="4px">
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
									</Stack>

									{/* Right side */}
									<Stack alignItems="flex-end" gap="6px">
										<Chip label={inq.status} color={getStatusColor(inq.status)} size="small" className="status-chip" />
										<Typography className="date-text">{moment(inq.createdAt).format('MMM DD, YYYY HH:mm')}</Typography>
									</Stack>
								</Stack>

								<Divider className="card-divider" />

								{/* Message */}
								<Typography className="inquiry-message">{inq.inquiryMessage}</Typography>

								{/* Seller Reply */}
								{inq.sellerReply ? (
									<div className="seller-reply-box">
										<Stack direction="row" alignItems="center" gap="6px" className="reply-header">
											<ReplyIcon className="reply-icon" />
											<Typography className="reply-label">Seller Reply</Typography>
											{inq.respondedAt && (
												<Typography className="reply-date">
													· {moment(inq.respondedAt).format('MMM DD, YYYY')}
												</Typography>
											)}
										</Stack>
										<Typography className="reply-text">{inq.sellerReply}</Typography>
									</div>
								) : (
									<Typography className="awaiting-text">⏳ Awaiting seller reply...</Typography>
								)}
							</div>
						))}
					</Stack>

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

			{/* Detail Dialog */}
			<Dialog
				open={!!selectedInquiry}
				onClose={() => setSelectedInquiry(null)}
				fullWidth
				maxWidth="sm"
				className="inquiry-detail-dialog"
			>
				<DialogTitle className="dialog-title">
					Inquiry Detail
					<Typography className="dialog-subtitle">
						Sent on {moment(selectedInquiry?.createdAt).format('MMM DD, YYYY HH:mm')}
					</Typography>
				</DialogTitle>

				<DialogContent className="dialog-content">
					{/* Contact info */}
					<div className="info-section">
						<Typography className="section-label">Contact Info</Typography>
						<Typography className="info-row">
							<strong>Name:</strong> {selectedInquiry?.contactPerson?.fullName}
						</Typography>
						<Typography className="info-row">
							<strong>Email:</strong> {selectedInquiry?.contactPerson?.email}
						</Typography>
						{selectedInquiry?.contactPerson?.phone && (
							<Typography className="info-row">
								<strong>Phone:</strong> {selectedInquiry.contactPerson.phone}
							</Typography>
						)}
						<Typography className="info-row">
							<strong>Preferred Contact:</strong> {selectedInquiry?.preferredContactMethod}
						</Typography>
					</div>

					{/* Message */}
					<div className="message-box">
						<Typography className="section-label">Your Message</Typography>
						<Typography className="message-text">{selectedInquiry?.inquiryMessage}</Typography>
					</div>

					{/* Reply */}
					{selectedInquiry?.sellerReply ? (
						<div className="reply-box">
							<Typography className="section-label reply-section-label">Seller Reply</Typography>
							<Typography className="reply-text">{selectedInquiry.sellerReply}</Typography>
						</div>
					) : (
						<Typography className="awaiting-text">⏳ Awaiting seller reply...</Typography>
					)}
				</DialogContent>

				<DialogActions className="dialog-actions">
					<Button onClick={() => setSelectedInquiry(null)} className="btn-close">
						Close
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default MyInquiries;
