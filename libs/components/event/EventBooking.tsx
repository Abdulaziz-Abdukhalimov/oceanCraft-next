import React, { useState } from 'react';
import {
	Stack,
	Box,
	Typography,
	Button,
	IconButton,
	Dialog,
	DialogTitle,
	DialogContent,
	TextField,
	RadioGroup,
	FormControlLabel,
	Radio,
	CircularProgress,
	Divider,
} from '@mui/material';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { Event } from '../../types/event/event';
import { BOOK_EVENT } from '../../../apollo/user/mutation';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PeopleIcon from '@mui/icons-material/People';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { AvailableDate } from '../../types/reservation/reservation';
import { PaymentMethod } from '../../enums/event.enum';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { Message } from '../../enums/common.enum';
import { CreateReservationInput } from '../../types/reservation/reservation.input';

interface EventBookingSectionProps {
	event: Event;
	availableDates: AvailableDate[];
	availabilityLoading: boolean;
	eventRefetch: any;
}

const EventBookingSection: React.FC<EventBookingSectionProps> = ({
	event,
	availableDates,
	availabilityLoading,
	eventRefetch,
}) => {
	const router = useRouter();
	const user = useReactiveVar(userVar);

	// Booking State
	const [selectedDate, setSelectedDate] = useState<string | null>(null);
	const [numberOfPeople, setNumberOfPeople] = useState<number>(1);
	const [datePickerOpen, setDatePickerOpen] = useState(false);
	const [bookingModalOpen, setBookingModalOpen] = useState(false);
	const [bookingSuccess, setBookingSuccess] = useState(false);
	const [bookingReference, setBookingReference] = useState('');

	// Contact Form State
	const [contactForm, setContactForm] = useState({
		fullName: user?.memberFullName || '',
		email: user?.memberEmail || '',
		phone: user?.memberPhone || '',
	});

	// Payment State
	const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
	const [paymentInfo, setPaymentInfo] = useState({
		cardholderName: '',
		cardNumber: '',
		expiryDate: '',
		cvv: '',
	});

	/** APOLLO MUTATION **/
	const [bookEvent, { loading: bookingLoading }] = useMutation(BOOK_EVENT);

	/** HANDLERS **/
	const handleDecreasePeople = () => {
		if (numberOfPeople > 1) {
			setNumberOfPeople(numberOfPeople - 1);
		}
	};

	const handleIncreasePeople = () => {
		const maxCapacity = event.eventCapacity || 50;
		if (numberOfPeople < maxCapacity) {
			setNumberOfPeople(numberOfPeople + 1);
		}
	};

	const handleDateSelect = (date: Dayjs | null) => {
		if (!date) return;
		const dateStr = date.format('YYYY-MM-DD');
		setSelectedDate(dateStr);
		setDatePickerOpen(false);
	};

	const handleBookingClick = () => {
		if (!selectedDate) {
			sweetMixinErrorAlert('Please select a date').then();
			return;
		}
		if (!user?._id) {
			sweetMixinErrorAlert(Message.NOT_AUTHENTICATED).then();
			router.push('/account/join');
			return;
		}
		setBookingModalOpen(true);
	};

	const handleBookingSubmit = async () => {
		try {
			// Validation
			if (!contactForm.fullName || !contactForm.email || !contactForm.phone) {
				sweetMixinErrorAlert('Please fill in all contact information').then();
				return;
			}

			if (paymentMethod === PaymentMethod.CARD) {
				if (!paymentInfo.cardholderName || !paymentInfo.cardNumber || !paymentInfo.expiryDate || !paymentInfo.cvv) {
					sweetMixinErrorAlert('Please fill in all payment information').then();
					return;
				}
			}

			const input: CreateReservationInput = {
				eventId: event._id,
				date: selectedDate!,
				numberOfPeople: numberOfPeople,
				fullName: contactForm.fullName,
				email: contactForm.email,
				phone: contactForm.phone,
				paymentMethod: paymentMethod,
			};

			if (paymentMethod === PaymentMethod.CARD) {
				input.paymentInfo = paymentInfo;
			}

			const result = await bookEvent({ variables: { input } });

			if (result.data?.bookEvent) {
				setBookingReference(result.data.bookEvent.bookingReference);
				setBookingSuccess(true);
				await eventRefetch({ input: event._id });
				await sweetTopSmallSuccessAlert('Booking confirmed!', 1000);
			}
		} catch (err: any) {
			console.log('ERROR, handleBookingSubmit:', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const handleCloseModal = () => {
		setBookingModalOpen(false);
		setBookingSuccess(false);
		setContactForm({ fullName: '', email: '', phone: '' });
		setPaymentInfo({ cardholderName: '', cardNumber: '', expiryDate: '', cvv: '' });
		setPaymentMethod(PaymentMethod.CASH);
	};

	/** HELPER FUNCTIONS **/
	const totalPrice = event.eventPrice * numberOfPeople;

	const getCurrencySymbol = (currency: string) => {
		switch (currency) {
			case 'KRW':
				return '₩';
			case 'USD':
				return '$';
			case 'EUR':
				return '€';
			default:
				return currency;
		}
	};

	const formatDate = (dateString: string) => {
		return dayjs(dateString).format('MMM DD, YYYY');
	};

	const isDateAvailable = (date: Dayjs) => {
		const dateStr = date.format('YYYY-MM-DD');
		const availableDate = availableDates.find((d) => d.date === dateStr);
		return availableDate?.isAvailable && !availableDate?.isPastDate;
	};

	const shouldDisableDate = (date: Dayjs) => {
		return !isDateAvailable(date);
	};

	return (
		<>
			{/* ===== STICKY BOOKING CARD ===== */}
			<Stack className="booking-card">
				{/* Price Header */}
				<Box className="booking-header">
					<Typography className="price-label">From</Typography>
					<Typography className="price-value">
						{getCurrencySymbol(event.eventCurrency)}
						{event.eventPrice.toLocaleString()}
					</Typography>
					<Typography className="price-unit">per person</Typography>
				</Box>

				{/* Availability Badge */}
				{event.eventAvailabilityStatus && event.eventAvailabilityStatus !== 'AVAILABLE' && (
					<Box className={`availability-badge ${event.eventAvailabilityStatus.toLowerCase()}`}>
						<Typography>{event.eventAvailabilityStatus}</Typography>
					</Box>
				)}

				{/* Date Selection */}
				<Box className="booking-field">
					<Box className="field-label">
						<CalendarTodayIcon className="field-icon" />
						<Typography className="field-text">Select Date</Typography>
					</Box>
					<Button className="field-value" onClick={() => setDatePickerOpen(true)} endIcon={<CalendarTodayIcon />}>
						{selectedDate ? formatDate(selectedDate) : 'Choose a date'}
					</Button>
				</Box>

				{/* People Selection */}
				<Box className="booking-field">
					<Box className="field-label">
						<PeopleIcon className="field-icon" />
						<Typography className="field-text">Number of People</Typography>
					</Box>
					<Box className="people-selector">
						<IconButton className="people-btn" onClick={handleDecreasePeople} disabled={numberOfPeople <= 1}>
							<RemoveIcon />
						</IconButton>
						<Typography className="people-count">{numberOfPeople}</Typography>
						<IconButton className="people-btn" onClick={handleIncreasePeople}>
							<AddIcon />
						</IconButton>
					</Box>
				</Box>

				{/* Total Price */}
				<Box className="booking-total">
					<Typography className="total-label">Total Price</Typography>
					<Typography className="total-value">
						{getCurrencySymbol(event.eventCurrency)}
						{totalPrice.toLocaleString()}
					</Typography>
				</Box>

				{/* Book Button */}
				<Button
					variant="contained"
					fullWidth
					className="booking-btn"
					onClick={handleBookingClick}
					disabled={!selectedDate || availabilityLoading}
				>
					{availabilityLoading ? <CircularProgress size={24} color="inherit" /> : 'Check Availability'}
				</Button>

				{/* Additional Info */}
				<Stack className="booking-info">
					<Typography className="info-text">• Free cancellation available</Typography>
					<Typography className="info-text">• Instant confirmation</Typography>
					<Typography className="info-text">• Mobile ticket</Typography>
				</Stack>
			</Stack>

			{/* ===== DATE PICKER MODAL ===== */}
			<Dialog
				open={datePickerOpen}
				onClose={() => setDatePickerOpen(false)}
				className="date-picker-modal"
				maxWidth="sm"
				fullWidth
			>
				<DialogTitle>
					<Stack direction="row" justifyContent="space-between" alignItems="center">
						<Typography>Select Date</Typography>
						<IconButton onClick={() => setDatePickerOpen(false)}>
							<CloseIcon />
						</IconButton>
					</Stack>
				</DialogTitle>
				<DialogContent>
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<DateCalendar
							value={selectedDate ? dayjs(selectedDate) : null}
							onChange={handleDateSelect}
							shouldDisableDate={shouldDisableDate}
							minDate={dayjs()}
						/>
					</LocalizationProvider>
				</DialogContent>
			</Dialog>

			{/* ===== BOOKING CONFIRMATION MODAL ===== */}
			<Dialog open={bookingModalOpen} onClose={handleCloseModal} className="booking-modal" maxWidth="sm" fullWidth>
				<DialogTitle>
					<Stack direction="row" justifyContent="space-between" alignItems="center">
						<Typography>{bookingSuccess ? 'Booking Confirmed!' : 'Complete Your Booking'}</Typography>
						<IconButton onClick={handleCloseModal}>
							<CloseIcon />
						</IconButton>
					</Stack>
				</DialogTitle>
				<DialogContent>
					{bookingSuccess ? (
						/* Success Screen */
						<Stack className="booking-success">
							<CheckCircleIcon className="success-icon" />
							<Typography className="success-title">Booking Confirmed!</Typography>
							<Typography className="success-subtitle">Your booking reference: {bookingReference}</Typography>

							<Box className="booking-summary">
								<Typography className="summary-title">Booking Details</Typography>
								<Stack className="summary-item">
									<Typography className="summary-label">Event:</Typography>
									<Typography className="summary-value">{event.eventTitle}</Typography>
								</Stack>
								<Stack className="summary-item">
									<Typography className="summary-label">Date:</Typography>
									<Typography className="summary-value">{formatDate(selectedDate!)}</Typography>
								</Stack>
								<Stack className="summary-item">
									<Typography className="summary-label">Participants:</Typography>
									<Typography className="summary-value">{numberOfPeople}</Typography>
								</Stack>
								<Stack className="summary-item">
									<Typography className="summary-label">Total:</Typography>
									<Typography className="summary-value">
										{getCurrencySymbol(event.eventCurrency)}
										{totalPrice.toLocaleString()}
									</Typography>
								</Stack>
							</Box>

							<Button variant="contained" fullWidth onClick={handleCloseModal} className="done-btn">
								Done
							</Button>
						</Stack>
					) : (
						/* Booking Form */
						<Stack className="booking-form" spacing={3}>
							{/* Summary */}
							<Box className="booking-summary">
								<Typography className="summary-title">Booking Summary</Typography>
								<Stack className="summary-item">
									<Typography className="summary-label">Date:</Typography>
									<Typography className="summary-value">{formatDate(selectedDate!)}</Typography>
								</Stack>
								<Stack className="summary-item">
									<Typography className="summary-label">Participants:</Typography>
									<Typography className="summary-value">{numberOfPeople}</Typography>
								</Stack>
								<Stack className="summary-item">
									<Typography className="summary-label">Total:</Typography>
									<Typography className="summary-value">
										{getCurrencySymbol(event.eventCurrency)}
										{totalPrice.toLocaleString()}
									</Typography>
								</Stack>
							</Box>

							<Divider />

							{/* Contact Information */}
							<Box>
								<Typography className="form-section-title">Contact Information</Typography>
								<Stack spacing={2}>
									<TextField
										fullWidth
										label="Full Name"
										required
										value={contactForm.fullName}
										onChange={(e) => setContactForm({ ...contactForm, fullName: e.target.value })}
									/>
									<TextField
										fullWidth
										label="Email"
										type="email"
										required
										value={contactForm.email}
										onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
									/>
									<TextField
										fullWidth
										label="Phone Number"
										required
										value={contactForm.phone}
										onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
									/>
								</Stack>
							</Box>

							<Divider />

							{/* Payment Method */}
							<Box>
								<Typography className="form-section-title">Payment Method</Typography>
								<RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}>
									<FormControlLabel value={PaymentMethod.CASH} control={<Radio />} label="Cash" />
									<FormControlLabel value={PaymentMethod.CARD} control={<Radio />} label="Credit/Debit Card" />
								</RadioGroup>

								{/* Card Payment Fields */}
								{paymentMethod === PaymentMethod.CARD && (
									<Stack spacing={2} sx={{ mt: 2 }}>
										<TextField
											fullWidth
											label="Cardholder Name"
											required
											value={paymentInfo.cardholderName}
											onChange={(e) => setPaymentInfo({ ...paymentInfo, cardholderName: e.target.value })}
										/>
										<TextField
											fullWidth
											label="Card Number"
											required
											placeholder="1234 5678 9012 3456"
											value={paymentInfo.cardNumber}
											onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
										/>
										<Stack direction="row" spacing={2}>
											<TextField
												fullWidth
												label="Expiry Date"
												required
												placeholder="MM/YY"
												value={paymentInfo.expiryDate}
												onChange={(e) => setPaymentInfo({ ...paymentInfo, expiryDate: e.target.value })}
											/>
											<TextField
												fullWidth
												label="CVV"
												required
												placeholder="123"
												value={paymentInfo.cvv}
												onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })}
											/>
										</Stack>
									</Stack>
								)}
							</Box>

							{/* Confirm Button */}
							<Button
								variant="contained"
								fullWidth
								onClick={handleBookingSubmit}
								disabled={bookingLoading}
								className="confirm-booking-btn"
							>
								{bookingLoading ? <CircularProgress size={24} color="inherit" /> : 'Confirm Booking'}
							</Button>
						</Stack>
					)}
				</DialogContent>
			</Dialog>
		</>
	);
};

export default EventBookingSection;
