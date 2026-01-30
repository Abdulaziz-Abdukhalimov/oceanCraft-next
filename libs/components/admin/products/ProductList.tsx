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

interface Data {
	id: string;
	title: string;
	type: string;
	price: string;
	agent: string;
	location: string;
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
		id: 'type',
		numeric: false,
		disablePadding: false,
		label: 'TYPE',
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

interface ProductPanelListType {
	products: Product[];
	anchorEl: any;
	menuIconClickHandler: any;
	menuIconCloseHandler: any;
	updateProductHandler: any;
	removeProductHandler: any;
}

export const ProductPanelList = (props: ProductPanelListType) => {
	const { products, anchorEl, menuIconClickHandler, menuIconCloseHandler, updateProductHandler, removeProductHandler } =
		props;

	// Filter states
	const [filterDate, setFilterDate] = useState('All Dates');
	const [filterType, setFilterType] = useState('all');
	const [filterStatus, setFilterStatus] = useState('all');

	const handleResetFilter = () => {
		setFilterDate('All Dates');
		setFilterType('all');
		setFilterStatus('all');
	};

	// Filter products based on selected filters
	const filteredProducts = products.filter((product) => {
		// Filter by product category/type
		if (filterType !== 'all' && product.productCategory !== filterType) {
			return false;
		}

		// Filter by product status
		if (filterStatus !== 'all' && product.productStatus !== filterStatus) {
			return false;
		}

		return true;
	});

	// Get status badge class based on product status
	const getStatusBadgeClass = (status: string) => {
		switch (status) {
			case ProductStatus.ACTIVE:
				return 'status-badge completed';
			case ProductStatus.SOLD:
				return 'status-badge pending';
			case ProductStatus.DELETE:
				return 'status-badge rejected';
			default:
				return 'status-badge processing';
		}
	};

	// Get unique product categories for filter
	const productCategories = Array.from(new Set(products.map((p) => p.productCategory)));

	return (
		<Box className="product-list-container fade-in">
			{/* Page Title with Results Count */}
			<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
				<Typography variant="h4" className="page-title" sx={{ mb: 0 }}>
					Products List
				</Typography>
				<Typography sx={{ color: '#64748b', fontSize: '14px' }}>
					Showing {filteredProducts.length} of {products.length} products
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
					<MenuItem value="all">Product Type</MenuItem>
					{productCategories.map((category) => (
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
					<MenuItem value="all">Product Status</MenuItem>
					<MenuItem value={ProductStatus.ACTIVE}>ACTIVE</MenuItem>
					<MenuItem value={ProductStatus.SOLD}>SOLD</MenuItem>
					<MenuItem value={ProductStatus.DELETE}>DELETE</MenuItem>
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
						{filteredProducts.length === 0 && (
							<TableRow>
								<TableCell align="center" colSpan={7} sx={{ py: 6 }}>
									<Typography sx={{ color: '#94a3b8', fontSize: '14px' }}>No data found!</Typography>
								</TableCell>
							</TableRow>
						)}

						{filteredProducts.length !== 0 &&
							filteredProducts.map((product: Product, index: number) => {
								const productImage = `${product?.productImages[0]}`;

								return (
									<TableRow
										hover
										key={product?._id}
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
											{product._id}
										</TableCell>

										{/* Title Column with Image */}
										<TableCell align="left" sx={{ padding: '16px 20px' }}>
											<Stack direction={'row'} alignItems="center" spacing={1.5}>
												<Avatar alt={product.productTitle} src={productImage} sx={{ width: 40, height: 40 }} />
												<Typography
													sx={{
														fontWeight: 500,
														color: '#1e293b',
														fontSize: '14px',
													}}
												>
													{product.productTitle}
												</Typography>
											</Stack>
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
											${product.productPrice.toLocaleString()}
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
											{product.memberData?.memberNick}
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
											{product.productAddress}
										</TableCell>

										{/* Type Column */}
										<TableCell
											align="center"
											sx={{
												padding: '16px 20px',
												fontSize: '14px',
												color: '#1e293b',
											}}
										>
											{product.productCategory}
										</TableCell>

										{/* Status Column */}
										<TableCell align="center" sx={{ padding: '16px 20px' }}>
											{product.productStatus === ProductStatus.DELETE && (
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
													onClick={() => removeProductHandler(product._id)}
												>
													<DeleteIcon fontSize="small" />
												</Button>
											)}

											{product.productStatus === ProductStatus.SOLD && (
												<span className={getStatusBadgeClass(product.productStatus)}>{product.productStatus}</span>
											)}

											{product.productStatus === ProductStatus.ACTIVE && (
												<>
													<Button
														onClick={(e: any) => menuIconClickHandler(e, index)}
														className={getStatusBadgeClass(product.productStatus)}
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
														{product.productStatus}
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
														{Object.values(ProductStatus)
															.filter((ele) => ele !== product.productStatus)
															.map((status: string) => (
																<MenuItem
																	onClick={() => updateProductHandler({ _id: product._id, productStatus: status })}
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
