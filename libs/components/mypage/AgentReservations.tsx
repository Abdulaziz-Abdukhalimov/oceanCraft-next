import React, { useState } from 'react';
import {
	Stack,
	Typography,
	Chip,
	Button,
	TableContainer,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	Paper,
	Pagination,
	MenuItem,
	Select,
	FormControl,
	InputLabel,
	CircularProgress,
} from '@mui/material';
import { useQuery } from '@apollo/client';
import { GET_AGENT_RESERVATIONS } from '../../../apollo/user/query';
import { T } from '../../types/common';
import moment from 'moment';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PeopleIcon from '@mui/icons-material/People';
import { Reservation } from '../../types/reservation/reservation';

interface ReservationsData {
	total: number;
	page: number;
	totalPages: number;
	list: Reservation[];
}

const getStatusColor = (status: string): 'default' | 'warning' | 'success' | 'error' | 'info' => {
	switch (status?.toUpperCase()) {
		case 'CONFIRMED':
			return 'success';
		case 'PENDING':
			return 'warning';
		case 'CANCELLED':
			return 'error';
		case 'COMPLETED':
			return 'info';
		default:
			return 'default';
	}
};

const getPaymentStatusColor = (status: string): 'default' | 'warning' | 'success' | 'error' | 'info' => {
	switch (status?.toUpperCase()) {
		case 'PAID':
			return 'success';
		case 'PENDING':
			return 'warning';
		case 'FAILED':
			return 'error';
		case 'REFUNDED':
			return 'info';
		default:
			return 'default';
	}
};

const AgentReservations = () => {
	const [page, setPage] = useState<number>(1);
	const [statusFilter, setStatusFilter] = useState<string>('');
	const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('');
	const LIMIT = 10;

	const { loading, data, refetch } = useQuery(GET_AGENT_RESERVATIONS, {
		fetchPolicy: 'network-only',
		variables: {
			input: {
				page,
				limit: LIMIT,
				...(statusFilter && { status: statusFilter }),
				...(paymentStatusFilter && { paymentStatus: paymentStatusFilter }),
			},
		},
	});

	const reservationsData: ReservationsData | null = data?.getAgentReservations ?? null;
	const reservations: Reservation[] = reservationsData?.list ?? [];

	const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
		setPage(value);
	};

	const handleStatusFilter = (value: string) => {
		setStatusFilter(value);
		setPage(1);
	};

	const handlePaymentStatusFilter = (value: string) => {
		setPaymentStatusFilter(value);
		setPage(1);
	};

	return (
		<div className="agent-reservations-page">
			{/* Header */}
			<Stack className="page-header" direction="row" alignItems="center" justifyContent="space-between">
				<Stack direction="row" alignItems="center" gap="12px">
					<EventSeatIcon className="header-icon" />
					<div>
						<Typography className="page-title">Reservations</Typography>
						<Typography className="page-subtitle">{reservationsData?.total ?? 0} total bookings</Typography>
					</div>
				</Stack>

				{/* Filters */}
				<Stack direction="row" gap="12px">
					<FormControl size="small" className="filter-select">
						<InputLabel>Status</InputLabel>
						<Select value={statusFilter} label="Status" onChange={(e) => handleStatusFilter(e.target.value)}>
							<MenuItem value="">All</MenuItem>
							<MenuItem value="PENDING">Pending</MenuItem>
							<MenuItem value="CONFIRMED">Confirmed</MenuItem>
							<MenuItem value="COMPLETED">Completed</MenuItem>
							<MenuItem value="CANCELLED">Cancelled</MenuItem>
						</Select>
					</FormControl>

					<FormControl size="small" className="filter-select">
						<InputLabel>Payment</InputLabel>
						<Select
							value={paymentStatusFilter}
							label="Payment"
							onChange={(e) => handlePaymentStatusFilter(e.target.value)}
						>
							<MenuItem value="">All</MenuItem>
							<MenuItem value="PENDING">Pending</MenuItem>
							<MenuItem value="PAID">Paid</MenuItem>
							<MenuItem value="FAILED">Failed</MenuItem>
							<MenuItem value="REFUNDED">Refunded</MenuItem>
						</Select>
					</FormControl>
				</Stack>
			</Stack>

			{/* Table */}
			{loading ? (
				<Stack className="loading-state" alignItems="center" justifyContent="center">
					<CircularProgress size={40} />
					<Typography>Loading reservations...</Typography>
				</Stack>
			) : reservations.length === 0 ? (
				<Stack className="empty-state" alignItems="center" justifyContent="center">
					<EventSeatIcon className="empty-icon" />
					<Typography className="empty-title">No Reservations Found</Typography>
					<Typography className="empty-sub">Reservations will appear here once guests book your events.</Typography>
				</Stack>
			) : (
				<>
					<TableContainer component={Paper} className="reservations-table-container">
						<Table className="reservations-table">
							<TableHead>
								<TableRow>
									<TableCell>Booking Ref</TableCell>
									<TableCell>Guest</TableCell>
									<TableCell>Date</TableCell>
									<TableCell>People</TableCell>
									<TableCell>Amount</TableCell>
									<TableCell>Payment</TableCell>
									<TableCell>Status</TableCell>
									<TableCell>Booked At</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{reservations.map((res: Reservation) => (
									<TableRow key={res._id} className="reservation-row">
										{/* Booking Reference */}
										<TableCell>
											<Typography className="booking-ref">#{res.bookingReference}</Typography>
										</TableCell>

										{/* Guest Info */}
										<TableCell>
											<Stack gap="4px">
												<Stack direction="row" alignItems="center" gap="6px">
													<PersonIcon className="meta-icon" />
													<Typography className="guest-name">{res.contactPerson?.fullName}</Typography>
												</Stack>
												<Stack direction="row" alignItems="center" gap="6px">
													<EmailIcon className="meta-icon" />
													<Typography className="guest-meta">{res.contactPerson?.email}</Typography>
												</Stack>
												{res.contactPerson?.phone && (
													<Stack direction="row" alignItems="center" gap="6px">
														<PhoneIcon className="meta-icon" />
														<Typography className="guest-meta">{res.contactPerson.phone}</Typography>
													</Stack>
												)}
											</Stack>
										</TableCell>

										{/* Reservation Date */}
										<TableCell>
											<Stack direction="row" alignItems="center" gap="6px">
												<CalendarMonthIcon className="meta-icon" />
												<Typography className="date-text">
													{moment(res.reservationDate).format('MMM DD, YYYY')}
												</Typography>
											</Stack>
										</TableCell>

										{/* People */}
										<TableCell>
											<Stack direction="row" alignItems="center" gap="6px">
												<PeopleIcon className="meta-icon" />
												<Typography className="people-count">{res.numberOfPeople}</Typography>
											</Stack>
											<Typography className="price-per">₩{res.pricePerPerson?.toLocaleString()} / person</Typography>
										</TableCell>

										{/* Total Amount */}
										<TableCell>
											<Typography className="total-amount">₩{res.totalAmount?.toLocaleString()}</Typography>
											<Typography className="payment-method">{res.paymentMethod}</Typography>
										</TableCell>

										{/* Payment Status */}
										<TableCell>
											<Chip
												label={res.paymentStatus}
												color={getPaymentStatusColor(res.paymentStatus)}
												size="small"
												className="status-chip"
											/>
										</TableCell>

										{/* Reservation Status */}
										<TableCell>
											<Chip
												label={res.status}
												color={getStatusColor(res.status)}
												size="small"
												className="status-chip"
											/>
										</TableCell>

										{/* Created At */}
										<TableCell>
											<Typography className="created-at">{moment(res.createdAt).format('MMM DD, YYYY')}</Typography>
											<Typography className="created-time">{moment(res.createdAt).format('HH:mm')}</Typography>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>

					{/* Pagination */}
					{(reservationsData?.totalPages ?? 0) > 1 && (
						<Stack className="pagination-wrap" alignItems="center">
							<Pagination
								count={reservationsData?.totalPages ?? 1}
								page={page}
								onChange={handlePageChange}
								color="primary"
								shape="rounded"
							/>
						</Stack>
					)}
				</>
			)}
		</div>
	);
};

export default AgentReservations;
