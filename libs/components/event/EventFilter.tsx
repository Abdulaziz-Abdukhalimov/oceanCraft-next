import React, { useState } from 'react';
import { Stack, Box, Button, Menu, MenuItem, Checkbox, FormControlLabel, Typography, Slider } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import TuneIcon from '@mui/icons-material/Tune';
import { EventsInquiry } from '../../types/event/event.input';
import { EventCategory, EventAvailabilityStatus } from '../../enums/event.enum';
import { Event } from '../../types/event/event';
import Chip from '@mui/material/Chip';

interface EventFilterProps {
	searchFilter: EventsInquiry;
	setSearchFilter: (filter: EventsInquiry) => void;
	initialInput: EventsInquiry;
}

const EventFilter = (props: EventFilterProps) => {
	const { searchFilter, setSearchFilter, initialInput } = props;
	// Category Menu
	const [categoryAnchor, setCategoryAnchor] = useState<null | HTMLElement>(null);
	const categoryOpen = Boolean(categoryAnchor);

	// Availability Menu
	const [availabilityAnchor, setAvailabilityAnchor] = useState<null | HTMLElement>(null);
	const availabilityOpen = Boolean(availabilityAnchor);

	// Price Menu
	const [priceAnchor, setPriceAnchor] = useState<null | HTMLElement>(null);
	const priceOpen = Boolean(priceAnchor);

	// All Filters Menu (mobile)
	const [filtersAnchor, setFiltersAnchor] = useState<null | HTMLElement>(null);
	const filtersOpen = Boolean(filtersAnchor);

	// Price Range State
	const [priceRange, setPriceRange] = useState<number[]>([0, 1000000]);

	/** HANDLERS **/
	// Category
	const handleCategoryClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setCategoryAnchor(event.currentTarget);
	};

	const handleCategoryClose = () => {
		setCategoryAnchor(null);
	};

	const handleCategorySelect = (category: EventCategory) => {
		const currentCategories = searchFilter.search?.categoryList || [];
		const newCategories = currentCategories.includes(category)
			? currentCategories.filter((c) => c !== category)
			: [...currentCategories, category];

		setSearchFilter({
			...searchFilter,
			search: {
				...searchFilter.search,
				categoryList: newCategories.length > 0 ? newCategories : undefined,
			},
		});
	};

	// Availability
	const handleAvailabilityClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAvailabilityAnchor(event.currentTarget);
	};

	const handleAvailabilityClose = () => {
		setAvailabilityAnchor(null);
	};

	const handleAvailabilitySelect = (status: EventAvailabilityStatus) => {
		const currentStatuses = searchFilter.search?.availabilityList || [];
		const newStatuses = currentStatuses.includes(status)
			? currentStatuses.filter((s) => s !== status)
			: [...currentStatuses, status];

		setSearchFilter({
			...searchFilter,
			search: {
				...searchFilter.search,
				availabilityList: newStatuses.length > 0 ? newStatuses : undefined,
			},
		});
	};

	// Price Range
	const handlePriceClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setPriceAnchor(event.currentTarget);
	};

	const handlePriceClose = () => {
		setPriceAnchor(null);
	};

	const handlePriceChange = (event: Event, newValue: number | number[]) => {
		setPriceRange(newValue as number[]);
	};

	const handlePriceApply = () => {
		setSearchFilter({
			...searchFilter,
			search: {
				...searchFilter.search,
				pricesRange: {
					start: priceRange[0],
					end: priceRange[1],
				},
			},
		});
		handlePriceClose();
	};

	const handlePriceClear = () => {
		setPriceRange([0, 1000000]);
		setSearchFilter({
			...searchFilter,
			search: {
				...searchFilter.search,
				pricesRange: undefined,
			},
		});
	};

	// All Filters (mobile)
	const handleFiltersClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setFiltersAnchor(event.currentTarget);
	};

	const handleFiltersClose = () => {
		setFiltersAnchor(null);
	};

	// Active filter count
	const getActiveFilterCount = () => {
		let count = 0;
		if (searchFilter.search?.categoryList && searchFilter.search.categoryList.length > 0) count++;
		if (searchFilter.search?.availabilityList && searchFilter.search.availabilityList.length > 0) count++;
		if (searchFilter.search?.pricesRange) count++;
		return count;
	};

	const categories = [
		EventCategory.YACHT_TOUR,
		EventCategory.JETSKI_RENTAL,
		EventCategory.SURFING,
		EventCategory.DIVING,
	];

	const availabilityStatuses = [
		EventAvailabilityStatus.AVAILABLE,
		EventAvailabilityStatus.LIMITED,
		EventAvailabilityStatus.FULL,
	];

	const selectedCategories = searchFilter.search?.categoryList || [];
	const selectedAvailabilities = searchFilter.search?.availabilityList || [];

	return (
		<Stack className="event-filter">
			{/* Desktop Filters */}
			<Stack className="desktop-filters">
				{/* Category Filter */}
				<Button
					className={`filter-btn ${selectedCategories.length > 0 ? 'active' : ''}`}
					onClick={handleCategoryClick}
					endIcon={<KeyboardArrowDownIcon />}
				>
					Category
				</Button>
				<Menu open={categoryOpen} onClose={handleCategoryClose} anchorEl={categoryAnchor}>
					<Box display="flex" flexWrap="wrap" gap={1.5}>
						{categories.map((category) => (
							<Chip key={category} label={category.replace(/_/g, ' ')} onClick={() => handleCategorySelect(category)} />
						))}
					</Box>
				</Menu>

				{/* Availability Filter */}
				<Button
					className={`filter-btn ${selectedAvailabilities.length > 0 ? 'active' : ''}`}
					onClick={handleAvailabilityClick}
					endIcon={<KeyboardArrowDownIcon />}
				>
					Availability
				</Button>
				<Menu
					anchorEl={availabilityAnchor}
					open={availabilityOpen}
					onClose={handleAvailabilityClose}
					className="filter-menu"
				>
					{availabilityStatuses.map((status) => (
						<MenuItem key={status} onClick={() => handleAvailabilitySelect(status)} disableRipple>
							<FormControlLabel
								control={<Checkbox checked={selectedAvailabilities.includes(status)} />}
								label={status}
								sx={{ width: '100%', margin: 0 }}
							/>
						</MenuItem>
					))}
				</Menu>

				{/* Price Range Filter */}
				<Button
					className={`filter-btn ${searchFilter.search?.pricesRange ? 'active' : ''}`}
					onClick={handlePriceClick}
					endIcon={<KeyboardArrowDownIcon />}
				>
					Price
				</Button>
				<Menu
					anchorEl={priceAnchor}
					open={priceOpen}
					onClose={handlePriceClose}
					className="filter-menu price-menu"
					PaperProps={{
						style: { minWidth: '300px', padding: '16px' },
					}}
				>
					<Box className="price-filter-content">
						<Typography className="price-label">
							Price Range: ₩{priceRange[0].toLocaleString()} - ₩{priceRange[1].toLocaleString()}
						</Typography>
						<Slider
							value={priceRange}
							onChange={handlePriceChange}
							valueLabelDisplay="auto"
							min={0}
							max={1000000}
							step={10000}
							sx={{ margin: '20px 0' }}
						/>
						<Stack direction="row" spacing={1} justifyContent="flex-end">
							<Button size="small" onClick={handlePriceClear}>
								Clear
							</Button>
							<Button size="small" variant="contained" onClick={handlePriceApply} className="apply-btn">
								Apply
							</Button>
						</Stack>
					</Box>
				</Menu>
			</Stack>
		</Stack>
	);
};

export default EventFilter;
