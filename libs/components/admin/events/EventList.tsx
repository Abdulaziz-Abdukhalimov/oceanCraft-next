import React, { useState } from 'react';
import Link from 'next/link';
import {
	TableCell,
	TableHead,
	TableBody,
	TableRow,
	Table,
	TableContainer,
	Button,
	Menu,
	Fade,
	MenuItem,
	Select,
	Box,
	Stack,
	Typography,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DeleteIcon from '@mui/icons-material/Delete';
import { Product } from '../../../types/product/product';
import { ProductStatus } from '../../../enums/product.enum';
import { Event } from '../../../types/event/event';
import { EventStatus } from '../../../enums/event.enum';

interface Data {
	id: string;
	title: string;
	category: string;
	price: string;
	agent: string;
	location: string;
	schedule: string;
	period: {
		start: string;
		end: string;
	};
	status: string;
}

interface HeadCell {
	disablePadding: boolean;
	id: keyof Data;
	label: string;
	numeric: boolean;
}

const headCells: readonly HeadCell[] = [
	{
		id: 'id',
		numeric: true,
		disablePadding: false,
		label: 'MB ID',
	},
	{
		id: 'title',
		numeric: true,
		disablePadding: false,
		label: 'TITLE',
	},
	{
		id: 'category',
		numeric: true,
		disablePadding: false,
		label: 'CATEGORY',
	},
	{
		id: 'price',
		numeric: false,
		disablePadding: false,
		label: 'PRICE',
	},
	{
		id: 'agent',
		numeric: false,
		disablePadding: false,
		label: 'AGENT',
	},
	{
		id: 'location',
		numeric: false,
		disablePadding: false,
		label: 'LOCATION',
	},
	{
		id: 'schedule',
		numeric: false,
		disablePadding: false,
		label: 'SCHEDULE',
	},
	{
		id: 'period',
		numeric: false,
		disablePadding: false,
		label: 'PERIOD',
	},
	{
		id: 'status',
		numeric: false,
		disablePadding: false,
		label: 'STATUS',
	},
];

function EnhancedTableHead() {
	return (
		<TableHead>
			<TableRow>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						align={headCell.numeric ? 'left' : 'center'}
						padding={headCell.disablePadding ? 'none' : 'normal'}
						sx={{
							background: '#f8f9fa',
							borderBottom: '1px solid #e8ebed',
							padding: '16px 20px',
							fontSize: '12px',
							fontWeight: 600,
							color: '#64748b',
							textTransform: 'uppercase',
							letterSpacing: '0.5px',
						}}
					>
						{headCell.label}
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

interface EventPanelListType {
	events: Event[];
	anchorEl: any;
	menuIconClickHandler: any;
	menuIconCloseHandler: any;
	updateEventHandler: any;
}

export const EventPanelList = (props: EventPanelListType) => {
	const { events, anchorEl, menuIconClickHandler, menuIconCloseHandler, updateEventHandler } = props;

	// Filter states
	const [filterDate, setFilterDate] = useState('All Dates');
	const [filterType, setFilterType] = useState('all');
	const [filterStatus, setFilterStatus] = useState('all');

	const handleResetFilter = () => {
		setFilterDate('All Dates');
		setFilterType('all');
		setFilterStatus('all');
	};

	const filteredEvents = events.filter((event) => {
		if (filterType !== 'all' && event.eventCategory !== filterType) {
			return false;
		}

		if (filterStatus !== 'all' && event.eventStatus !== filterStatus) {
			return false;
		}

		return true;
	});

	const getStatusBadgeClass = (status: string) => {
		switch (status) {
			case EventStatus.ACTIVE:
				return 'status-badge completed';
			case EventStatus.COMPLETED:
				return 'status-badge pending';
			case EventStatus.CANCELLED:
				return 'status-badge rejected';
			case EventStatus.DELETED:
				return 'status-badge rejected';
			default:
				return 'status-badge processing';
		}
	};

	const eventCategories = Array.from(new Set(events.map((p) => p.eventCategory)));

	return (
		<Box className="product-list-container fade-in">
			<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
				<Typography variant="h4" className="page-title" sx={{ mb: 0 }}>
					Events List
				</Typography>
				<Typography sx={{ color: '#64748b', fontSize: '14px' }}>
					Showing {filteredEvents.length} of {events.length} events
				</Typography>
			</Stack>

			{/* Filter Section */}
			<Box className="filter-section" sx={{ mb: 3 }}>
				<Box className="filter-label">
					<FilterListIcon />
					<Typography sx={{ fontWeight: 600, fontSize: '14px' }}>Filter By</Typography>
				</Box>

				<Select
					value={filterDate}
					onChange={(e) => setFilterDate(e.target.value)}
					size="small"
					sx={{
						minWidth: 160,
						borderRadius: '8px',
						fontSize: '14px',
						'& .MuiOutlinedInput-notchedOutline': {
							borderColor: '#e8ebed',
						},
					}}
				>
					<MenuItem value="All Dates">All Dates</MenuItem>
					<MenuItem value="Today">Today</MenuItem>
					<MenuItem value="This Week">This Week</MenuItem>
					<MenuItem value="This Month">This Month</MenuItem>
				</Select>

				<Select
					value={filterType}
					onChange={(e) => setFilterType(e.target.value)}
					size="small"
					displayEmpty
					sx={{
						minWidth: 160,
						borderRadius: '8px',
						fontSize: '14px',
						'& .MuiOutlinedInput-notchedOutline': {
							borderColor: '#e8ebed',
						},
					}}
				>
					<MenuItem value="all">Event Category</MenuItem>
					{eventCategories.map((category) => (
						<MenuItem key={category} value={category}>
							{category}
						</MenuItem>
					))}
				</Select>

				<Select
					value={filterStatus}
					onChange={(e) => setFilterStatus(e.target.value)}
					size="small"
					displayEmpty
					sx={{
						minWidth: 160,
						borderRadius: '8px',
						fontSize: '14px',
						'& .MuiOutlinedInput-notchedOutline': {
							borderColor: '#e8ebed',
						},
					}}
				>
					<MenuItem value="all">Event Status</MenuItem>
					<MenuItem value={EventStatus.ACTIVE}>ACTIVE</MenuItem>
					<MenuItem value={EventStatus.COMPLETED}>COMPLETED</MenuItem>
					<MenuItem value={EventStatus.CANCELLED}>CANCELLED</MenuItem>
					<MenuItem value={EventStatus.DELETED}>DELETED</MenuItem>
				</Select>

				<Box className="reset-filter" onClick={handleResetFilter}>
					<RefreshIcon />
					<Typography sx={{ fontSize: '14px', fontWeight: 500 }}>Reset Filter</Typography>
				</Box>
			</Box>

			{/* Products Table */}
			<TableContainer className="admin-table">
				<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
					<EnhancedTableHead />
					<TableBody>
						{filteredEvents.length === 0 && (
							<TableRow>
								<TableCell align="center" colSpan={7} sx={{ py: 6 }}>
									<Typography sx={{ color: '#94a3b8', fontSize: '14px' }}>No data found!</Typography>
								</TableCell>
							</TableRow>
						)}

						{filteredEvents.length !== 0 &&
							filteredEvents.map((event: Event, index: number) => {
								const eventImage = `${event?.eventImages[0]}`;

								return (
									<TableRow
										hover
										key={event?._id}
										sx={{
											borderBottom: '1px solid #e8ebed',
											transition: 'background 0.2s ease',
											'&:hover': {
												background: 'rgba(65, 105, 225, 0.02)',
											},
											'&:last-child': {
												borderBottom: 'none',
											},
										}}
									>
										{/* ID Column */}
										<TableCell
											align="left"
											sx={{
												padding: '16px 20px',
												fontSize: '14px',
												fontWeight: 600,
												color: '#64748b',
											}}
										>
											{event._id}
										</TableCell>

										{/* Title Column with Image */}
										<TableCell align="left" sx={{ padding: '16px 20px' }}>
											<Stack direction={'row'} alignItems="center" spacing={1.5}>
												<Avatar alt={event.eventTitle} src={eventImage} sx={{ width: 40, height: 40 }} />
												<Typography
													sx={{
														fontWeight: 500,
														color: '#1e293b',
														fontSize: '14px',
													}}
												>
													{event.eventTitle}
												</Typography>
											</Stack>
										</TableCell>

										{/* Category Column */}
										<TableCell
											align="center"
											sx={{
												padding: '16px 20px',
												fontSize: '14px',
												color: '#1e293b',
												fontWeight: 600,
											}}
										>
											{event.eventCategory}
										</TableCell>

										{/* Price Column */}
										<TableCell
											align="center"
											sx={{
												padding: '16px 20px',
												fontSize: '14px',
												color: '#1e293b',
												fontWeight: 600,
											}}
										>
											${event.eventPrice.toLocaleString()}
										</TableCell>

										{/* Agent Column */}
										<TableCell
											align="center"
											sx={{
												padding: '16px 20px',
												fontSize: '14px',
												color: '#64748b',
											}}
										>
											{event.businessName}
										</TableCell>

										{/* Location Column */}
										<TableCell
											align="center"
											sx={{
												padding: '16px 20px',
												fontSize: '14px',
												color: '#64748b',
											}}
										>
											{event.eventLocation.city}
										</TableCell>

										{/* Schedule Column */}
										<TableCell
											align="center"
											sx={{
												padding: '16px 20px',
												fontSize: '14px',
												color: '#1e293b',
											}}
										>
											{event.eventSchedule?.type}
										</TableCell>

										{/* Period Column */}
										<TableCell align="center" sx={{ padding: '16px 20px', fontSize: '14px', color: '#1e293b' }}>
											{new Date(event.eventPeriod?.startDate).toLocaleDateString()} -{' '}
											{new Date(event.eventPeriod?.endDate).toLocaleDateString()}
										</TableCell>

										{/* Status Column */}
										<TableCell align="center" sx={{ padding: '16px 20px' }}>
											{event.eventStatus === EventStatus.DELETED && (
												<Button
													variant="outlined"
													sx={{
														p: '6px 12px',
														border: '1px solid #e8ebed',
														borderRadius: '6px',
														minWidth: 'auto',
														color: '#ef4444',
														'&:hover': {
															border: '1px solid #ef4444',
															background: 'rgba(239, 68, 68, 0.05)',
														},
													}}
												>
													<DeleteIcon fontSize="small" />
												</Button>
											)}

											{event.eventStatus === EventStatus.COMPLETED && (
												<span className={getStatusBadgeClass(event.eventStatus)}>{event.eventStatus}</span>
											)}

											{event.eventStatus === EventStatus.ACTIVE && (
												<>
													<Button
														onClick={(e: any) => menuIconClickHandler(e, index)}
														className={getStatusBadgeClass(event.eventStatus)}
														sx={{
															minWidth: '100px',
															textTransform: 'capitalize',
															cursor: 'pointer',
															border: 'none',
															'&:hover': {
																opacity: 0.8,
															},
														}}
													>
														{event.eventStatus}
													</Button>

													<Menu
														className={'menu-modal'}
														MenuListProps={{
															'aria-labelledby': 'fade-button',
														}}
														anchorEl={anchorEl[index]}
														open={Boolean(anchorEl[index])}
														onClose={menuIconCloseHandler}
														TransitionComponent={Fade}
														PaperProps={{
															sx: {
																boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
																borderRadius: '8px',
																mt: 1,
															},
														}}
													>
														{Object.values(EventStatus)
															.filter((ele) => ele !== event.eventStatus)
															.map((status: string) => (
																<MenuItem
																	onClick={() => updateEventHandler({ _id: event._id, eventStatus: status })}
																	key={status}
																	sx={{ px: 2, py: 1 }}
																>
																	<Typography variant={'subtitle1'} component={'span'} sx={{ fontSize: '14px' }}>
																		{status}
																	</Typography>
																</MenuItem>
															))}
													</Menu>
												</>
											)}
										</TableCell>
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	);
};
