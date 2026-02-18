import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Stack, Box, Typography, Button, Chip, Grid, Tabs, Tab, Dialog, DialogContent, Divider } from '@mui/material';
import { GET_MEMBER_RESERVATIONS, GET_EVENT } from '../../../apollo/user/query';
import { CANCEL_RESERVATION } from '../../../apollo/user/mutation';
import { sweetConfirmAlert, sweetTopSmallSuccessAlert, sweetErrorHandling } from '../../sweetAlert';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CancelIcon from '@mui/icons-material/Cancel';
import { format } from 'date-fns';

const ReservationCard = ({
	reservation,
	onCancel,
	onViewInvoice,
}: {
	reservation: any;
	onCancel: (id: string) => void;
	onViewInvoice: (reservation: any, event: any) => void;
}) => {
	const { data: eventData } = useQuery(GET_EVENT, {
		variables: { input: reservation.eventId },
		skip: !reservation.eventId,
		fetchPolicy: 'cache-first',
	});

	const event = eventData?.getEvent;
	const reservationDate = new Date(reservation.reservationDate);
	const balanceOwed = (reservation.totalAmount * 0.7).toFixed(1);

	const getStatusInfo = (status: string) => {
		const map: any = {
			PENDING: { label: 'Waiting', className: 'status-warning' },
			CONFIRMED: { label: 'Confirmed', className: 'status-success' },
			CANCELLED: { label: 'Cancelled', className: 'status-error' },
			COMPLETED: { label: 'Completed', className: 'status-info' },
		};
		return map[status] || { label: status, className: '' };
	};

	const statusInfo = getStatusInfo(reservation.status);

	return (
		<div className="reservation-card">
			<Grid container>
				<Grid item xs={12} md={2}>
					<div className="reservation-image">
						<img src={event?.eventImages?.[0] || '/img/event/default.jpg'} alt={event?.eventTitle || 'Event'} />
					</div>
				</Grid>

				<Grid item xs={12} md={7}>
					<div className="reservation-details">
						<div className="reservation-header">
							<Typography className="reservation-title">
								Booking request {reservation.bookingReference} for <span>{event?.eventTitle || 'Loading...'}</span>
							</Typography>
							<Typography className="invoice-number">Invoice No: {reservation.bookingReference}</Typography>
							<Typography className="guest-info">
								Guests: {reservation.numberOfPeople} ({reservation.numberOfPeople} Guests)
							</Typography>
							{reservation.paymentStatus === 'PENDING' && (
								<Typography className="balance-owed">
									Balance: {event.eventCurrency} {balanceOwed} to be paid until {format(reservationDate, 'MM-dd-yy')}
								</Typography>
							)}
						</div>

						<div className="action-buttons">
							<Button className="btn-invoice" variant="contained" onClick={() => onViewInvoice(reservation, event)}>
								Invoice Created - Check & Pay
							</Button>
							{(reservation.status === 'CONFIRMED' || reservation.status === 'PENDING') && (
								<Button className="btn-cancel" variant="contained" onClick={() => onCancel(reservation._id)}>
									Cancel Booking Request
								</Button>
							)}
							<Button className="btn-contact" variant="contained">
								Contact Owner
							</Button>
						</div>
					</div>
				</Grid>

				<Grid item xs={12} md={3}>
					<div className="reservation-meta">
						<div>
							<Typography className="meta-label">Status</Typography>
							<Chip label={statusInfo.label} className={`status-chip ${statusInfo.className}`} />
						</div>
						<div>
							<Typography className="meta-label">Period</Typography>
							<Typography className="period-text">{format(reservationDate, 'MM-dd-yy')}</Typography>
						</div>
						<div>
							<Typography className="meta-label">Location</Typography>
							<Typography className="period-text">{event?.eventLocation?.city || '-'}</Typography>
						</div>
						<div>
							<Typography className="meta-label">Request by</Typography>
							<Typography className="requester-text">{reservation.contactPerson?.fullName || 'Guest'}</Typography>
						</div>
					</div>
				</Grid>
			</Grid>
		</div>
	);
};

// ─── Tab Panel ─────────────────────────────────────────────────────────────
const TabPanel = ({ children, value, index }: { children?: React.ReactNode; value: number; index: number }) => (
	<div hidden={value !== index}>{value === index && <div style={{ padding: '12px 0' }}>{children}</div>}</div>
);

// ─── Main Component ────────────────────────────────────────────────────────
const MyReservations = () => {
	const [activeTab, setActiveTab] = useState(0);
	const [selectedReservation, setSelectedReservation] = useState<any>(null);
	const [selectedEvent, setSelectedEvent] = useState<any>(null);
	const [invoiceOpen, setInvoiceOpen] = useState(false);

	const { data, loading, refetch } = useQuery(GET_MEMBER_RESERVATIONS, {
		fetchPolicy: 'network-only',
	});

	const [cancelReservation] = useMutation(CANCEL_RESERVATION);
	const reservations = data?.getMyReservations || [];

	const handleCancelReservation = async (reservationId: string) => {
		try {
			const confirmed = await sweetConfirmAlert('Are you sure you want to cancel this reservation?');
			if (!confirmed) return;
			await cancelReservation({ variables: { input: reservationId } });
			await sweetTopSmallSuccessAlert('Reservation cancelled successfully');
			refetch();
		} catch (err) {
			sweetErrorHandling(err);
		}
	};

	const handleViewInvoice = (reservation: any, event: any) => {
		setSelectedReservation(reservation);
		setSelectedEvent(event);
		setInvoiceOpen(true);
	};

	const filter = (type: string) => {
		switch (type) {
			case 'upcoming':
				return reservations.filter((r: any) => r.status === 'CONFIRMED' || r.status === 'PENDING');
			case 'past':
				return reservations.filter((r: any) => r.status === 'COMPLETED');
			case 'cancelled':
				return reservations.filter((r: any) => r.status === 'CANCELLED');
			default:
				return reservations;
		}
	};

	const upcoming = filter('upcoming');
	const past = filter('past');
	const cancelled = filter('cancelled');

	const renderEmpty = (icon: React.ReactNode, text: string) => (
		<div className="empty-state">
			{icon}
			<Typography>{text}</Typography>
		</div>
	);

	if (loading) {
		return (
			<div className="loading-container">
				<Typography>Loading reservations...</Typography>
			</div>
		);
	}

	return (
		<Stack className="my-reservations-container">
			<Typography className="page-title">My Reservations</Typography>

			<Tabs value={activeTab} onChange={(_: any, v: any) => setActiveTab(v)} className="reservation-tabs">
				<Tab label={`Upcoming (${upcoming.length})`} />
				<Tab label={`Past (${past.length})`} />
				<Tab label={`Cancelled (${cancelled.length})`} />
			</Tabs>

			<TabPanel value={activeTab} index={0}>
				{upcoming.length === 0 ? (
					renderEmpty(<CalendarMonthIcon />, 'No upcoming reservations')
				) : (
					<Stack className="reservations-list">
						{upcoming.map((r: any) => (
							<ReservationCard
								key={r._id}
								reservation={r}
								onCancel={handleCancelReservation}
								onViewInvoice={handleViewInvoice}
							/>
						))}
					</Stack>
				)}
			</TabPanel>

			<TabPanel value={activeTab} index={1}>
				{past.length === 0 ? (
					renderEmpty(<CalendarMonthIcon />, 'No past reservations')
				) : (
					<Stack className="reservations-list">
						{past.map((r: any) => (
							<ReservationCard
								key={r._id}
								reservation={r}
								onCancel={handleCancelReservation}
								onViewInvoice={handleViewInvoice}
							/>
						))}
					</Stack>
				)}
			</TabPanel>

			<TabPanel value={activeTab} index={2}>
				{cancelled.length === 0 ? (
					renderEmpty(<CancelIcon />, 'No cancelled reservations')
				) : (
					<Stack className="reservations-list">
						{cancelled.map((r: any) => (
							<ReservationCard
								key={r._id}
								reservation={r}
								onCancel={handleCancelReservation}
								onViewInvoice={handleViewInvoice}
							/>
						))}
					</Stack>
				)}
			</TabPanel>

			{/* Invoice Dialog */}
			<Dialog open={invoiceOpen} onClose={() => setInvoiceOpen(false)} maxWidth="md" fullWidth>
				<DialogContent className="invoice-dialog">
					{selectedReservation && (
						<div className="invoice-container">
							<Typography className="invoice-title">Invoice {selectedReservation.bookingReference}</Typography>

							<div className="invoice-details">
								<div className="invoice-row">
									<Typography className="label">Period:</Typography>
									<Typography className="value">
										{format(new Date(selectedReservation.reservationDate), 'MM-dd-yy')}
									</Typography>
								</div>
								<div className="invoice-row">
									<Typography className="label">Guests:</Typography>
									<Typography className="value">{selectedReservation.numberOfPeople} Guests</Typography>
								</div>
								<div className="invoice-row">
									<Typography className="label">Price per person:</Typography>
									<Typography className="value">
										{selectedEvent.eventCurrency} {selectedReservation.pricePerPerson}
									</Typography>
								</div>
							</div>

							<div className="invoice-breakdown">
								<table>
									<thead>
										<tr>
											<th>Cost</th>
											<th>Price</th>
											<th>Detail</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>Subtotal</td>
											<td>
												{selectedEvent.eventCurrency} {selectedReservation.pricePerPerson}
											</td>
											<td>
												{selectedReservation.numberOfPeople} people × {selectedEvent.eventCurrency}{' '}
												{selectedReservation.pricePerPerson}
											</td>
										</tr>
										<tr>
											<td>Service fee</td>
											<td>{selectedEvent.eventCurrency} 0</td>
											<td>-</td>
										</tr>
										<tr className="total-row">
											<td>
												<strong>Total</strong>
											</td>
											<td>
												<strong>
													{selectedEvent.eventCurrency} {selectedReservation.totalAmount}
												</strong>
											</td>
											<td></td>
										</tr>
										<tr>
											<td>Reservation Fee (30%):</td>
											<td>
												{selectedEvent.eventCurrency} {(selectedReservation.totalAmount * 0.3).toFixed(1)}
											</td>
											<td></td>
										</tr>
										<tr className="balance-row">
											<td>Balance owed:</td>
											<td>
												{selectedEvent.eventCurrency} {(selectedReservation.totalAmount * 0.7).toFixed(1)}
											</td>
											<td></td>
										</tr>
									</tbody>
								</table>
							</div>

							<div className="invoice-footer">
								<Typography className="deposit-note">
									You are paying only the deposit required to confirm the booking: {selectedEvent.eventCurrency}{' '}
									{(selectedReservation.totalAmount * 0.3).toFixed(1)}
								</Typography>
								<Typography className="balance-note">
									You will need to pay the remaining balance before the first day of your booked period!
								</Typography>
								<Divider sx={{ my: 2 }} />
								<Typography className="payment-title">Pay Deposit & Confirm Reservation</Typography>
								<Button className="btn-wire-transfer" variant="contained">
									Wire Transfer
								</Button>
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</Stack>
	);
};

export default MyReservations;
