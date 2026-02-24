import React, { useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import {
	Box,
	Button,
	Stack,
	Typography,
	TextField,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Grid,
	Card,
	IconButton,
	Stepper,
	Step,
	StepLabel,
	InputAdornment,
	Checkbox,
	FormControlLabel,
	FormGroup,
	Chip,
} from '@mui/material';
import { useMutation, useQuery } from '@apollo/client';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { getJwtToken } from '../../auth';
import { EventCreate } from '../../types/event/event.input';
import {
	EventAvailabilityStatus,
	EventCategory,
	EventCurrency,
	EventDayOfWeek,
	EventExperienceLevel,
	EventScheduleType,
} from '../../enums/event.enum';
import { CREATE_EVENT, UPDATE_EVENT } from '../../../apollo/user/mutation';
import { GET_EVENT } from '../../../apollo/user/query';
import { sweetErrorHandling, sweetMixinSuccessAlert } from '../../sweetAlert';

const steps = ['Basic Info', 'Schedule & Location', 'Requirements', 'Images'];

const AddEvent = () => {
	const router = useRouter();
	const inputRef = useRef<any>(null);
	const token = getJwtToken();
	const [activeStep, setActiveStep] = useState(0);

	const [eventData, setEventData] = useState<EventCreate>({
		eventTitle: '',
		eventDescription: '',
		businessName: '',
		eventCategory: '' as EventCategory,
		eventPrice: 0,
		eventCurrency: EventCurrency.KRW,
		eventLocation: {
			city: '',
			address: '',
		},
		eventSchedule: {
			type: EventScheduleType.ONE_TIME,
			daysOfWeek: [],
		},
		eventPeriod: {
			startDate: new Date(),
			endDate: new Date(),
		},
		eventContact: {
			phone: '',
			email: '',
			telegram: '',
		},
		eventImages: [],
		eventCapacity: 0,
		eventDurationMinutes: 0,
		eventAvailabilityStatus: EventAvailabilityStatus.AVAILABLE,
		eventRequirements: {
			minAge: undefined,
			maxAge: undefined,
			bringItems: [],
			experienceLevel: EventExperienceLevel.ALL_LEVELS,
		},
		eventNotes: '',
		eventCancellationPolicy: '',
	});

	const [bringItemInput, setBringItemInput] = useState('');

	// Mutations
	const [createEvent] = useMutation(CREATE_EVENT);
	const [updateEvent] = useMutation(UPDATE_EVENT);

	// Get event if editing
	const { data: eventInfo } = useQuery(GET_EVENT, {
		skip: !router.query.eventId,
		variables: { input: router.query.eventId },
		onCompleted: (data) => {
			const event = data?.getEvent;
			if (event) {
				setEventData({
					eventTitle: event.eventTitle || '',
					eventDescription: event.eventDescription || '',
					businessName: event.businessName || '',
					eventCategory: event.eventCategory,
					eventPrice: event.eventPrice || 0,
					eventCurrency: event.eventCurrency || EventCurrency.KRW,
					eventLocation: event.eventLocation || { city: '', address: '' },
					eventSchedule: event.eventSchedule || { type: EventScheduleType.ONE_TIME, daysOfWeek: [] },
					eventPeriod: event.eventPeriod || { startDate: new Date(), endDate: new Date() },
					eventContact: event.eventContact || { phone: '', email: '', telegram: '' },
					eventImages: event.eventImages || [],
					eventCapacity: event.eventCapacity || 0,
					eventDurationMinutes: event.eventDurationMinutes || 0,
					eventAvailabilityStatus: event.eventAvailabilityStatus || EventAvailabilityStatus.AVAILABLE,
					eventRequirements: event.eventRequirements || {
						minAge: undefined,
						maxAge: undefined,
						bringItems: [],
						experienceLevel: EventExperienceLevel.ALL_LEVELS,
					},
					eventNotes: event.eventNotes || '',
					eventCancellationPolicy: event.eventCancellationPolicy || '',
				});
			}
		},
	});

	// Upload images
	const uploadImages = async () => {
		try {
			const formData = new FormData();
			const selectedFiles = inputRef.current.files;

			if (selectedFiles.length === 0) return;
			if (selectedFiles.length > 5) throw new Error('Cannot upload more than 5 images!');

			formData.append(
				'operations',
				JSON.stringify({
					query: `mutation ImagesUploader($files: [Upload!]!, $target: String!) {
						imagesUploader(files: $files, target: $target)
					}`,
					variables: {
						files: Array(selectedFiles.length).fill(null),
						target: 'events',
					},
				}),
			);

			const map: any = {};
			for (let i = 0; i < selectedFiles.length; i++) {
				map[i.toString()] = [`variables.files.${i}`];
			}
			formData.append('map', JSON.stringify(map));

			for (let i = 0; i < selectedFiles.length; i++) {
				formData.append(i.toString(), selectedFiles[i]);
			}

			const response = await axios.post(`${process.env.REACT_APP_API_GRAPHQL_URL}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					'apollo-require-preflight': true,
					Authorization: `Bearer ${token}`,
				},
			});

			const responseImages = response.data.data.imagesUploader;
			setEventData({ ...eventData, eventImages: [...eventData.eventImages, ...responseImages] });
		} catch (err: any) {
			sweetErrorHandling(err);
		}
	};

	const removeImage = (index: number) => {
		const newImages = eventData.eventImages.filter((_, i) => i !== index);
		setEventData({ ...eventData, eventImages: newImages });
	};

	const toggleDayOfWeek = (day: EventDayOfWeek) => {
		const currentDays = eventData.eventSchedule.daysOfWeek || [];
		let newDays: EventDayOfWeek[];

		if (currentDays.includes(day)) {
			newDays = currentDays.filter((d) => d !== day);
		} else {
			newDays = [...currentDays, day];
		}

		setEventData({
			...eventData,
			eventSchedule: { ...eventData.eventSchedule, daysOfWeek: newDays },
		});
	};

	const addBringItem = () => {
		if (bringItemInput.trim()) {
			const currentItems = eventData.eventRequirements?.bringItems || [];
			setEventData({
				...eventData,
				eventRequirements: {
					...eventData.eventRequirements,
					bringItems: [...currentItems, bringItemInput.trim()],
				},
			});
			setBringItemInput('');
		}
	};

	const removeBringItem = (index: number) => {
		const newItems = eventData.eventRequirements?.bringItems?.filter((_, i) => i !== index) || [];
		setEventData({
			...eventData,
			eventRequirements: { ...eventData.eventRequirements, bringItems: newItems },
		});
	};

	const handleSubmit = async () => {
		try {
			const submitData: any = {
				eventTitle: eventData.eventTitle,
				eventDescription: eventData.eventDescription,
				businessName: eventData.businessName,
				eventCategory: eventData.eventCategory,
				eventPrice: eventData.eventPrice,
				eventCurrency: eventData.eventCurrency,
				eventLocation: eventData.eventLocation,
				eventSchedule: eventData.eventSchedule,
				eventPeriod: {
					startDate: new Date(eventData.eventPeriod.startDate).toISOString(),
					endDate: new Date(eventData.eventPeriod.endDate).toISOString(),
				},
				eventContact: eventData.eventContact,
				eventImages: eventData.eventImages,
				eventCapacity: eventData.eventCapacity,
				eventDurationMinutes: eventData.eventDurationMinutes,
				eventAvailabilityStatus: eventData.eventAvailabilityStatus,
			};

			// Only add optional fields if they have values
			if (eventData.eventRequirements) {
				const req: any = {
					experienceLevel: eventData.eventRequirements.experienceLevel || EventExperienceLevel.ALL_LEVELS,
					bringItems: eventData.eventRequirements.bringItems || [],
				};

				if (eventData.eventRequirements.minAge) {
					req.minAge = eventData.eventRequirements.minAge;
				}
				if (eventData.eventRequirements.maxAge) {
					req.maxAge = eventData.eventRequirements.maxAge;
				}

				submitData.eventRequirements = req;
			}

			if (eventData.eventNotes?.trim()) {
				submitData.eventNotes = eventData.eventNotes.trim();
			}

			if (eventData.eventCancellationPolicy?.trim()) {
				submitData.eventCancellationPolicy = eventData.eventCancellationPolicy.trim();
			}

			if (eventData.eventRegistrationDeadline) {
				submitData.eventRegistrationDeadline = new Date(eventData.eventRegistrationDeadline).toISOString();
			}

			console.log('📤 Submitting event data:', JSON.stringify(submitData, null, 2));

			if (router.query.eventId) {
				await updateEvent({
					variables: {
						input: {
							_id: router.query.eventId,
							...submitData,
						},
					},
				});
				await sweetMixinSuccessAlert('Event updated successfully!');
			} else {
				await createEvent({
					variables: { input: submitData },
				});
				await sweetMixinSuccessAlert('Event created successfully!');
			}
			router.push('/mypage?category=myEvents');
		} catch (err: any) {
			console.error('❌ Event creation error:', err);
			console.error('❌ Error response:', err.graphQLErrors?.[0]?.extensions);
			sweetErrorHandling(err);
		}
	};

	const handleNext = () => setActiveStep((prev) => prev + 1);
	const handleBack = () => setActiveStep((prev) => prev - 1);

	const isStepValid = () => {
		switch (activeStep) {
			case 0:
				return (
					eventData.eventTitle &&
					eventData.businessName &&
					eventData.eventCategory &&
					eventData.eventPrice > 0 &&
					eventData.eventDescription
				);
			case 1:
				return (
					eventData.eventLocation.city &&
					eventData.eventLocation.address &&
					eventData.eventCapacity > 0 &&
					eventData.eventDurationMinutes > 0
				);
			case 2:
				return eventData.eventContact.phone || eventData.eventContact.email;
			case 3:
				return eventData.eventImages.length > 0;
			default:
				return false;
		}
	};

	return (
		<Box sx={{ maxWidth: 1200, mx: 'auto', p: 4 }}>
			{/* Header */}
			<Stack spacing={1} mb={4}>
				<Typography variant="h4" fontWeight={700}>
					{router.query.eventId ? 'Edit Event' : 'Create New Event'}
				</Typography>
				<Typography variant="body1" color="text.secondary">
					Set up your water sports activity or tour
				</Typography>
			</Stack>

			{/* Stepper */}
			<Stepper activeStep={activeStep} sx={{ mb: 4 }}>
				{steps.map((label) => (
					<Step key={label}>
						<StepLabel>{label}</StepLabel>
					</Step>
				))}
			</Stepper>

			{/* Form Content */}
			<Card sx={{ p: 4, mb: 3 }}>
				{/* Step 0: Basic Info */}
				{activeStep === 0 && (
					<Grid container spacing={3}>
						<Grid item xs={12}>
							<Typography variant="h6" mb={2}>
								Basic Information
							</Typography>
						</Grid>
						<Grid item xs={12} md={6}>
							<TextField
								fullWidth
								label="Event Title *"
								value={eventData.eventTitle}
								onChange={(e) => setEventData({ ...eventData, eventTitle: e.target.value })}
								placeholder="e.g., Sunset Yacht Tour"
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<TextField
								fullWidth
								label="Business Name *"
								value={eventData.businessName}
								onChange={(e) => setEventData({ ...eventData, businessName: e.target.value })}
								placeholder="Your company name"
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<FormControl fullWidth>
								<InputLabel>Category *</InputLabel>
								<Select
									value={eventData.eventCategory}
									onChange={(e) => setEventData({ ...eventData, eventCategory: e.target.value as EventCategory })}
									label="Category"
								>
									{Object.values(EventCategory).map((cat) => (
										<MenuItem key={cat} value={cat}>
											{cat.replace(/_/g, ' ')}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={12} md={6}>
							<TextField
								fullWidth
								type="number"
								label="Price per Person *"
								value={eventData.eventPrice}
								onChange={(e) => setEventData({ ...eventData, eventPrice: parseInt(e.target.value) || 0 })}
								InputProps={{
									startAdornment: <InputAdornment position="start">$</InputAdornment>,
								}}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								fullWidth
								multiline
								rows={4}
								label="Description *"
								value={eventData.eventDescription}
								onChange={(e) => setEventData({ ...eventData, eventDescription: e.target.value })}
								placeholder="Describe your event..."
							/>
						</Grid>
					</Grid>
				)}

				{/* Step 1: Schedule & Location */}
				{activeStep === 1 && (
					<Grid container spacing={3}>
						<Grid item xs={12}>
							<Typography variant="h6" mb={2}>
								Schedule & Location
							</Typography>
						</Grid>
						<Grid item xs={12} md={6}>
							<FormControl fullWidth>
								<InputLabel>Schedule Type</InputLabel>
								<Select
									value={eventData.eventSchedule.type}
									onChange={(e) =>
										setEventData({
											...eventData,
											eventSchedule: { ...eventData.eventSchedule, type: e.target.value as EventScheduleType },
										})
									}
									label="Schedule Type"
								>
									{Object.values(EventScheduleType).map((type) => (
										<MenuItem key={type} value={type}>
											{type.replace(/_/g, ' ')}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>

						{eventData.eventSchedule.type === EventScheduleType.RECURRING && (
							<Grid item xs={12}>
								<Typography variant="subtitle2" mb={1}>
									Select Days of Week
								</Typography>
								<FormGroup row>
									{Object.values(EventDayOfWeek).map((day) => (
										<FormControlLabel
											key={day}
											control={
												<Checkbox
													checked={eventData.eventSchedule.daysOfWeek?.includes(day) || false}
													onChange={() => toggleDayOfWeek(day)}
												/>
											}
											label={day}
										/>
									))}
								</FormGroup>
							</Grid>
						)}

						<Grid item xs={12} md={6}>
							<TextField
								fullWidth
								type="date"
								label="Start Date"
								value={new Date(eventData.eventPeriod.startDate).toISOString().split('T')[0]}
								onChange={(e) =>
									setEventData({
										...eventData,
										eventPeriod: { ...eventData.eventPeriod, startDate: new Date(e.target.value) },
									})
								}
								InputLabelProps={{ shrink: true }}
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<TextField
								fullWidth
								type="date"
								label="End Date"
								value={new Date(eventData.eventPeriod.endDate).toISOString().split('T')[0]}
								onChange={(e) =>
									setEventData({
										...eventData,
										eventPeriod: { ...eventData.eventPeriod, endDate: new Date(e.target.value) },
									})
								}
								InputLabelProps={{ shrink: true }}
							/>
						</Grid>

						<Grid item xs={12} md={6}>
							<TextField
								fullWidth
								label="City *"
								value={eventData.eventLocation.city}
								onChange={(e) =>
									setEventData({ ...eventData, eventLocation: { ...eventData.eventLocation, city: e.target.value } })
								}
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<TextField
								fullWidth
								label="Address *"
								value={eventData.eventLocation.address}
								onChange={(e) =>
									setEventData({
										...eventData,
										eventLocation: { ...eventData.eventLocation, address: e.target.value },
									})
								}
							/>
						</Grid>

						<Grid item xs={12} md={6}>
							<TextField
								fullWidth
								type="number"
								label="Capacity *"
								value={eventData.eventCapacity}
								onChange={(e) => setEventData({ ...eventData, eventCapacity: parseInt(e.target.value) || 0 })}
								placeholder="Maximum participants"
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<TextField
								fullWidth
								type="number"
								label="Duration (minutes) *"
								value={eventData.eventDurationMinutes}
								onChange={(e) => setEventData({ ...eventData, eventDurationMinutes: parseInt(e.target.value) || 0 })}
							/>
						</Grid>
					</Grid>
				)}

				{/* Step 2: Requirements */}
				{activeStep === 2 && (
					<Grid container spacing={3}>
						<Grid item xs={12}>
							<Typography variant="h6" mb={2}>
								Requirements & Contact
							</Typography>
						</Grid>
						<Grid item xs={12} md={4}>
							<TextField
								fullWidth
								label="Phone"
								value={eventData.eventContact.phone}
								onChange={(e) =>
									setEventData({ ...eventData, eventContact: { ...eventData.eventContact, phone: e.target.value } })
								}
							/>
						</Grid>
						<Grid item xs={12} md={4}>
							<TextField
								fullWidth
								label="Email"
								value={eventData.eventContact.email}
								onChange={(e) =>
									setEventData({ ...eventData, eventContact: { ...eventData.eventContact, email: e.target.value } })
								}
							/>
						</Grid>
						<Grid item xs={12} md={4}>
							<TextField
								fullWidth
								label="Telegram"
								value={eventData.eventContact.telegram}
								onChange={(e) =>
									setEventData({ ...eventData, eventContact: { ...eventData.eventContact, telegram: e.target.value } })
								}
							/>
						</Grid>

						<Grid item xs={12} md={6}>
							<TextField
								fullWidth
								type="number"
								label="Minimum Age"
								value={eventData.eventRequirements?.minAge || ''}
								onChange={(e) =>
									setEventData({
										...eventData,
										eventRequirements: {
											...eventData.eventRequirements,
											minAge: parseInt(e.target.value) || undefined,
										},
									})
								}
							/>
						</Grid>
						<Grid item xs={12} md={6}>
							<TextField
								fullWidth
								type="number"
								label="Maximum Age"
								value={eventData.eventRequirements?.maxAge || ''}
								onChange={(e) =>
									setEventData({
										...eventData,
										eventRequirements: {
											...eventData.eventRequirements,
											maxAge: parseInt(e.target.value) || undefined,
										},
									})
								}
							/>
						</Grid>

						<Grid item xs={12}>
							<FormControl fullWidth>
								<InputLabel>Experience Level</InputLabel>
								<Select
									value={eventData.eventRequirements?.experienceLevel || EventExperienceLevel.ALL_LEVELS}
									onChange={(e) =>
										setEventData({
											...eventData,
											eventRequirements: {
												...eventData.eventRequirements,
												experienceLevel: e.target.value as EventExperienceLevel,
											},
										})
									}
									label="Experience Level"
								>
									{Object.values(EventExperienceLevel).map((level) => (
										<MenuItem key={level} value={level}>
											{level.replace(/_/g, ' ')}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>

						<Grid item xs={12}>
							<Typography variant="subtitle2" mb={1}>
								Items to Bring
							</Typography>
							<Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
								<TextField
									fullWidth
									size="small"
									placeholder="Add item..."
									value={bringItemInput}
									onChange={(e) => setBringItemInput(e.target.value)}
									onKeyPress={(e) => e.key === 'Enter' && addBringItem()}
								/>
								<Button variant="contained" onClick={addBringItem}>
									Add
								</Button>
							</Box>
							<Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
								{eventData.eventRequirements?.bringItems?.map((item, index) => (
									<Chip key={index} label={item} onDelete={() => removeBringItem(index)} />
								))}
							</Box>
						</Grid>

						<Grid item xs={12}>
							<TextField
								fullWidth
								multiline
								rows={3}
								label="Additional Notes"
								value={eventData.eventNotes}
								onChange={(e) => setEventData({ ...eventData, eventNotes: e.target.value })}
							/>
						</Grid>

						<Grid item xs={12}>
							<TextField
								fullWidth
								multiline
								rows={3}
								label="Cancellation Policy"
								value={eventData.eventCancellationPolicy}
								onChange={(e) => setEventData({ ...eventData, eventCancellationPolicy: e.target.value })}
							/>
						</Grid>
					</Grid>
				)}

				{/* Step 3: Images */}
				{activeStep === 3 && (
					<Box>
						<Typography variant="h6" mb={2}>
							Event Images
						</Typography>
						<Box
							sx={{
								border: '2px dashed #ccc',
								borderRadius: 2,
								p: 4,
								textAlign: 'center',
								mb: 3,
								cursor: 'pointer',
								'&:hover': { borderColor: '#1976d2' },
							}}
							onClick={() => inputRef.current?.click()}
						>
							<CloudUploadIcon sx={{ fontSize: 48, color: '#9e9e9e', mb: 2 }} />
							<Typography variant="body1" mb={1}>
								Drag and drop images or click to browse
							</Typography>
							<Typography variant="body2" color="text.secondary">
								Maximum 5 images (JPEG, PNG)
							</Typography>
							<input ref={inputRef} type="file" hidden multiple accept="image/*" onChange={uploadImages} />
						</Box>

						<Grid container spacing={2}>
							{eventData.eventImages.map((image: string, index: number) => (
								<Grid item xs={6} md={3} key={index}>
									<Card sx={{ position: 'relative' }}>
										<img
											src={`${image}`}
											alt={`Event ${index + 1}`}
											style={{ width: '100%', height: 200, objectFit: 'cover' }}
										/>
										<IconButton
											sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'white' }}
											onClick={() => removeImage(index)}
											size="small"
										>
											<DeleteIcon />
										</IconButton>
									</Card>
								</Grid>
							))}
						</Grid>
					</Box>
				)}
			</Card>

			{/* Navigation Buttons */}
			<Stack direction="row" spacing={2} justifyContent="space-between">
				<Button disabled={activeStep === 0} onClick={handleBack} variant="outlined" size="large">
					Back
				</Button>
				<Box sx={{ flex: 1 }} />
				{activeStep === steps.length - 1 ? (
					<Button onClick={handleSubmit} variant="contained" size="large" disabled={!isStepValid()}>
						{router.query.eventId ? 'Update Event' : 'Create Event'}
					</Button>
				) : (
					<Button onClick={handleNext} variant="contained" size="large" disabled={!isStepValid()}>
						Next
					</Button>
				)}
			</Stack>
		</Box>
	);
};

export default AddEvent;
