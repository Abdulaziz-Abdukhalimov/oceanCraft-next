import React, { useCallback, useState, useEffect } from 'react';
import { Stack, Typography, Checkbox, FormControlLabel, TextField, Button } from '@mui/material';
import { ProductsInquiry } from '../../types/product/product.input';
import { ProductCategory, ProductCondition, ProductPriceType } from '../../enums/product.enum';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';

interface ProductFilterProps {
	searchFilter: ProductsInquiry;
	setSearchFilter: (filter: ProductsInquiry) => void;
	initialInput: ProductsInquiry;
}

const ProductFilter = (props: ProductFilterProps) => {
	const { searchFilter, setSearchFilter, initialInput } = props;
	const device = useDeviceDetect();
	const router = useRouter();

	// Local state
	const [priceMin, setPriceMin] = useState<string>('');
	const [priceMax, setPriceMax] = useState<string>('');
	const [countrySearch, setCountrySearch] = useState<string>('');

	/** LIFECYCLES **/
	useEffect(() => {
		// Initialize price inputs from searchFilter
		if (searchFilter?.search?.pricesRange) {
			setPriceMin(searchFilter.search.pricesRange.start?.toString() || '');
			setPriceMax(searchFilter.search.pricesRange.end?.toString() || '');
		}
		if (searchFilter?.search?.location) {
			setCountrySearch(searchFilter.search.location);
		}
	}, []);

	/** HANDLERS **/

	// Sale Type Handler (Rent / For Sale)
	const handleSaleTypeChange = useCallback(
		async (type: ProductPriceType) => {
			const updatedFilter = {
				...searchFilter,
				search: {
					...searchFilter.search,
					productPriceType: searchFilter?.search?.productPriceType === type ? undefined : type,
				},
			};

			setSearchFilter(updatedFilter);

			await router.push(
				`/product?input=${JSON.stringify(updatedFilter)}`,
				`/product?input=${JSON.stringify(updatedFilter)}`,
				{ scroll: false },
			);
		},
		[searchFilter, router, setSearchFilter],
	);

	// Category Handler (Manufacturer)
	const handleCategoryChange = useCallback(
		async (category: ProductCategory) => {
			const currentList = searchFilter?.search?.categoryList || [];
			let newList: ProductCategory[];

			if (currentList.includes(category)) {
				newList = currentList.filter((item) => item !== category);
			} else {
				newList = [...currentList, category];
			}

			const updatedFilter = {
				...searchFilter,
				search: {
					...searchFilter.search,
					categoryList: newList.length > 0 ? newList : undefined,
				},
			};

			setSearchFilter(updatedFilter);

			await router.push(
				`/product?input=${JSON.stringify(updatedFilter)}`,
				`/product?input=${JSON.stringify(updatedFilter)}`,
				{ scroll: false },
			);
		},
		[searchFilter, router, setSearchFilter],
	);

	// Condition Handler (New / Used)
	const handleConditionChange = useCallback(
		async (condition: ProductCondition) => {
			const currentList = searchFilter?.search?.conditionList || [];
			let newList: ProductCondition[];

			if (currentList.includes(condition)) {
				newList = currentList.filter((item) => item !== condition);
			} else {
				newList = [...currentList, condition];
			}

			const updatedFilter = {
				...searchFilter,
				search: {
					...searchFilter.search,
					conditionList: newList.length > 0 ? newList : undefined,
				},
			};

			setSearchFilter(updatedFilter);

			await router.push(
				`/product?input=${JSON.stringify(updatedFilter)}`,
				`/product?input=${JSON.stringify(updatedFilter)}`,
				{ scroll: false },
			);
		},
		[searchFilter, router, setSearchFilter],
	);

	// Price Filter Handler
	const handlePriceChange = useCallback(
		async (value: string, type: 'start' | 'end') => {
			if (type === 'start') {
				setPriceMin(value);
			} else {
				setPriceMax(value);
			}

			// Only update filter if both values are valid numbers or empty
			const minVal = type === 'start' ? value : priceMin;
			const maxVal = type === 'end' ? value : priceMax;

			// If both are empty, remove pricesRange
			if (!minVal && !maxVal) {
				const updatedFilter = {
					...searchFilter,
					search: {
						...searchFilter.search,
						pricesRange: undefined,
					},
				};

				setSearchFilter(updatedFilter);

				await router.push(
					`/product?input=${JSON.stringify(updatedFilter)}`,
					`/product?input=${JSON.stringify(updatedFilter)}`,
					{ scroll: false },
				);
				return;
			}

			// Create range with proper number types
			const start = minVal ? parseInt(minVal) : 0;
			const end = maxVal ? parseInt(maxVal) : 999999999;

			const updatedFilter = {
				...searchFilter,
				search: {
					...searchFilter.search,
					pricesRange: {
						start,
						end,
					},
				},
			};

			setSearchFilter(updatedFilter);

			await router.push(
				`/product?input=${JSON.stringify(updatedFilter)}`,
				`/product?input=${JSON.stringify(updatedFilter)}`,
				{ scroll: false },
			);
		},
		[searchFilter, router, setSearchFilter, priceMin, priceMax],
	);

	// Country Search Handler
	const handleCountrySearch = useCallback(
		async (value: string) => {
			setCountrySearch(value);

			const updatedFilter = {
				...searchFilter,
				search: {
					...searchFilter.search,
					location: value || undefined,
				},
			};

			setSearchFilter(updatedFilter);

			await router.push(
				`/product?input=${JSON.stringify(updatedFilter)}`,
				`/product?input=${JSON.stringify(updatedFilter)}`,
				{ scroll: false },
			);
		},
		[searchFilter, router, setSearchFilter],
	);

	// Reset Handler
	const handleReset = useCallback(async () => {
		setPriceMin('');
		setPriceMax('');
		setCountrySearch('');
		setSearchFilter(initialInput);

		await router.push(
			`/product?input=${JSON.stringify(initialInput)}`,
			`/product?input=${JSON.stringify(initialInput)}`,
			{ scroll: false },
		);
	}, [initialInput, router, setSearchFilter]);

	if (device === 'mobile') {
		return <div>PRODUCT FILTER (Mobile)</div>;
	}

	return (
		<Stack className={'product-filter'}>
			{/* Header */}
			<Stack className={'filter-header'}>
				<Typography className={'filter-title'}>Products</Typography>
			</Stack>

			<Stack className={'filter-section'}>
				<Typography className={'section-title'}>Country</Typography>
				<TextField
					fullWidth
					size="small"
					placeholder="Search country..."
					value={countrySearch}
					onChange={(e) => handleCountrySearch(e.target.value)}
					className={'country-search'}
				/>
			</Stack>

			{/* Sale Type */}
			<Stack className={'filter-section'}>
				<Typography className={'section-title'}>Sale Type</Typography>
				<Stack className={'checkbox-list'}>
					<FormControlLabel
						control={
							<Checkbox
								size="small"
								checked={searchFilter?.search?.productPriceType === ProductPriceType.RENT}
								onChange={() => handleSaleTypeChange(ProductPriceType.RENT)}
							/>
						}
						label="Rent"
					/>
					<FormControlLabel
						control={
							<Checkbox
								size="small"
								checked={searchFilter?.search?.productPriceType === ProductPriceType.FORSALE}
								onChange={() => handleSaleTypeChange(ProductPriceType.FORSALE)}
							/>
						}
						label="For Sale"
					/>
				</Stack>
			</Stack>

			{/* Manufacturer (Category) */}
			<Stack className={'filter-section'}>
				<Typography className={'section-title'}>Manufacturer</Typography>
				<Stack className={'checkbox-list'}>
					<FormControlLabel
						control={
							<Checkbox
								size="small"
								checked={(searchFilter?.search?.categoryList || []).includes(ProductCategory.YACHT)}
								onChange={() => handleCategoryChange(ProductCategory.YACHT)}
							/>
						}
						label="Yacht"
					/>
					<FormControlLabel
						control={
							<Checkbox
								size="small"
								checked={(searchFilter?.search?.categoryList || []).includes(ProductCategory.BOAT)}
								onChange={() => handleCategoryChange(ProductCategory.BOAT)}
							/>
						}
						label="Boat"
					/>
					<FormControlLabel
						control={
							<Checkbox
								size="small"
								checked={(searchFilter?.search?.categoryList || []).includes(ProductCategory.SNOWMOBILE)}
								onChange={() => handleCategoryChange(ProductCategory.SNOWMOBILE)}
							/>
						}
						label="Snowmobile"
					/>
					<FormControlLabel
						control={
							<Checkbox
								size="small"
								checked={(searchFilter?.search?.categoryList || []).includes(ProductCategory.ATV)}
								onChange={() => handleCategoryChange(ProductCategory.ATV)}
							/>
						}
						label="ATV"
					/>
					<FormControlLabel
						control={
							<Checkbox
								size="small"
								checked={(searchFilter?.search?.categoryList || []).includes(ProductCategory.JET_SKIS)}
								onChange={() => handleCategoryChange(ProductCategory.JET_SKIS)}
							/>
						}
						label="Jet Ski"
					/>
					<Button className={'show-more-btn'}>+ more</Button>
				</Stack>
			</Stack>

			{/* Condition */}
			<Stack className={'filter-section'}>
				<Typography className={'section-title'}>Condition</Typography>
				<Stack className={'checkbox-list'}>
					<FormControlLabel
						control={
							<Checkbox
								size="small"
								checked={(searchFilter?.search?.conditionList || []).includes(ProductCondition.NEW)}
								onChange={() => handleConditionChange(ProductCondition.NEW)}
							/>
						}
						label="New"
					/>
					<FormControlLabel
						control={
							<Checkbox
								size="small"
								checked={(searchFilter?.search?.conditionList || []).includes(ProductCondition.USED)}
								onChange={() => handleConditionChange(ProductCondition.USED)}
							/>
						}
						label="Used"
					/>
				</Stack>
			</Stack>

			{/* Price */}
			<Stack className={'filter-section'}>
				<Typography className={'section-title'}>Price</Typography>
				<Stack className={'range-inputs'}>
					<TextField
						size="small"
						type="number"
						placeholder="Min"
						value={priceMin}
						onChange={(e) => handlePriceChange(e.target.value, 'start')}
						className={'range-input'}
					/>
					<span className={'range-divider'}>-</span>
					<TextField
						size="small"
						type="number"
						placeholder="Max"
						value={priceMax}
						onChange={(e) => handlePriceChange(e.target.value, 'end')}
						className={'range-input'}
					/>
				</Stack>
			</Stack>

			{/* Power (Placeholder) */}
			<Stack className={'filter-section'}>
				<Typography className={'section-title'}>Power</Typography>
				<Typography className={'section-note'}>Coming soon</Typography>
			</Stack>

			{/* Speed (Placeholder) */}
			<Stack className={'filter-section'}>
				<Typography className={'section-title'}>Speed</Typography>
				<Typography className={'section-note'}>Coming soon</Typography>
			</Stack>

			{/* Brand (Placeholder) */}
			<Stack className={'filter-section'}>
				<Typography className={'section-title'}>Brand</Typography>
				<Typography className={'section-note'}>Coming soon</Typography>
			</Stack>

			{/* Model (Placeholder) */}
			<Stack className={'filter-section'}>
				<Typography className={'section-title'}>Model</Typography>
				<Typography className={'section-note'}>Coming soon</Typography>
			</Stack>

			{/* Country */}
			{/* <Stack className={'filter-section'}>
				<Typography className={'section-title'}>Country</Typography>
				<TextField
					fullWidth
					size="small"
					placeholder="Search country..."
					value={countrySearch}
					onChange={(e) => handleCountrySearch(e.target.value)}
					className={'country-search'}
				/>
			</Stack> */}

			{/* Reset Button */}
			<Stack className={'filter-footer'}>
				<Button variant="outlined" fullWidth onClick={handleReset} className={'reset-btn'}>
					Reset All Filters
				</Button>
			</Stack>
		</Stack>
	);
};

export default ProductFilter;
