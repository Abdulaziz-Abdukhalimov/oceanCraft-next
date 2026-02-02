import React, { useState } from 'react';
import { NextPage } from 'next';
import { Pagination, Stack, Typography, Button, Menu, MenuItem, Chip, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { ProductCard } from './ProductCard';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { Product } from '../../types/product/product';
import { SellerProductsInquiry } from '../../types/product/product.input';
import { T } from '../../types/common';
import { ProductStatus, ProductCategory, ProductPriceType } from '../../enums/product.enum';
import { userVar } from '../../../apollo/store';
import { useRouter } from 'next/router';
import { UPDATE_PRODUCT } from '../../../apollo/user/mutation';
import { GET_AGENT_PRODUCTS } from '../../../apollo/user/query';
import { sweetConfirmAlert, sweetErrorHandling } from '../../sweetAlert';
import FilterListIcon from '@mui/icons-material/FilterList';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const MyProducts: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const [searchFilter, setSearchFilter] = useState<SellerProductsInquiry>(initialInput);
	const [agentProducts, setAgentProducts] = useState<Product[]>([]);
	const [total, setTotal] = useState<number>(0);
	const user = useReactiveVar(userVar);
	const router = useRouter();

	// Filter menu states
	const [categoryAnchor, setCategoryAnchor] = useState<null | HTMLElement>(null);
	const [priceTypeAnchor, setPriceTypeAnchor] = useState<null | HTMLElement>(null);

	/** APOLLO REQUESTS **/
	const [updateProduct] = useMutation(UPDATE_PRODUCT);

	const {
		loading: getAgentProductsLoading,
		data: getAgentProductsData,
		error: getAgentProductsError,
		refetch: getAgentProductsRefetch,
	} = useQuery(GET_AGENT_PRODUCTS, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setAgentProducts(data?.getSellerProducts?.list);
			setTotal(data?.getSellerProducts?.metaCounter[0]?.total ?? 0);
		},
	});

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	const changeStatusHandler = (value: ProductStatus) => {
		setSearchFilter({ ...searchFilter, page: 1, search: { ...searchFilter.search, productStatus: value } });
	};

	const toggleCategoryFilter = (category: ProductCategory) => {
		const currentCategories = searchFilter.search.categoryList || [];
		let newCategories: ProductCategory[];

		if (currentCategories.includes(category)) {
			newCategories = currentCategories.filter((c) => c !== category);
		} else {
			newCategories = [...currentCategories, category];
		}

		setSearchFilter({
			...searchFilter,
			page: 1,
			search: { ...searchFilter.search, categoryList: newCategories.length > 0 ? newCategories : undefined },
		});
	};

	const changePriceTypeFilter = (priceType: ProductPriceType | undefined) => {
		setSearchFilter({
			...searchFilter,
			page: 1,
			search: { ...searchFilter.search, productPriceType: priceType },
		});
		setPriceTypeAnchor(null);
	};

	const clearAllFilters = () => {
		setSearchFilter({
			...searchFilter,
			page: 1,
			search: { productStatus: searchFilter.search.productStatus },
		});
	};

	const deleteProductHandler = async (id: string) => {
		try {
			if (await sweetConfirmAlert('Are you sure to delete this product?')) {
				await updateProduct({
					variables: {
						input: {
							_id: id,
							productStatus: 'DELETE',
						},
					},
				});

				await getAgentProductsRefetch({ input: searchFilter });
			}
		} catch (err: any) {
			await sweetErrorHandling(err);
		}
	};

	const updateProductHandler = async (status: string, id: string) => {
		try {
			if (await sweetConfirmAlert(`Are you sure to change to ${status} status?`)) {
				await updateProduct({
					variables: {
						input: {
							_id: id,
							productStatus: status,
						},
					},
				});
				await getAgentProductsRefetch({ input: searchFilter });
			}
		} catch (err) {
			await sweetErrorHandling(err);
		}
	};

	if (user?.memberType !== 'AGENT') {
		router.back();
	}

	const hasActiveFilters =
		(searchFilter.search.categoryList && searchFilter.search.categoryList.length > 0) ||
		searchFilter.search.productPriceType;

	if (device === 'mobile') {
		return <div>MY PRODUCTS MOBILE</div>;
	} else {
		return (
			<div id="my-product-page">
				<Stack className="main-title-box">
					<Stack className="right-box">
						<Typography className="main-title">My Products</Typography>
						<Typography className="sub-title">Manage your water sports equipment listings</Typography>
					</Stack>
				</Stack>

				<Stack className="product-list-box">
					<Stack className="tab-name-box">
						<Typography
							onClick={() => changeStatusHandler(ProductStatus.ACTIVE)}
							className={searchFilter.search.productStatus === 'ACTIVE' ? 'active-tab-name' : 'tab-name'}
						>
							On Sale
						</Typography>
						<Typography
							onClick={() => changeStatusHandler(ProductStatus.SOLD)}
							className={searchFilter.search.productStatus === 'SOLD' ? 'active-tab-name' : 'tab-name'}
						>
							Sold
						</Typography>
					</Stack>

					{/* Filters Section */}
					<Stack className="filters-section">
						<Stack className="filter-buttons">
							{/* Category Filter */}
							<Button
								variant="outlined"
								onClick={(e: any) => setCategoryAnchor(e.currentTarget)}
								endIcon={<KeyboardArrowDownIcon />}
								className="filter-button"
							>
								Category
								{searchFilter.search.categoryList && searchFilter.search.categoryList.length > 0 && (
									<Chip label={searchFilter.search.categoryList.length} size="small" className="filter-badge" />
								)}
							</Button>
							<Menu
								anchorEl={categoryAnchor}
								open={Boolean(categoryAnchor)}
								onClose={() => setCategoryAnchor(null)}
								PaperProps={{ sx: { maxHeight: 400, width: 250 } }}
							>
								{Object.values(ProductCategory).map((category) => (
									<MenuItem key={category} onClick={() => toggleCategoryFilter(category)}>
										<Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
											<input
												type="checkbox"
												checked={searchFilter.search.categoryList?.includes(category) || false}
												onChange={() => {}}
												style={{ marginRight: 12 }}
											/>
											<span>{category.replace(/_/g, ' ')}</span>
										</Box>
									</MenuItem>
								))}
							</Menu>

							{/* Price Type Filter */}
							<Button
								variant="outlined"
								onClick={(e: any) => setPriceTypeAnchor(e.currentTarget)}
								endIcon={<KeyboardArrowDownIcon />}
								className="filter-button"
							>
								{searchFilter.search.productPriceType ? searchFilter.search.productPriceType : 'Price Type'}
							</Button>
							<Menu anchorEl={priceTypeAnchor} open={Boolean(priceTypeAnchor)} onClose={() => setPriceTypeAnchor(null)}>
								<MenuItem onClick={() => changePriceTypeFilter(undefined)}>All</MenuItem>
								{Object.values(ProductPriceType).map((type) => (
									<MenuItem key={type} onClick={() => changePriceTypeFilter(type)}>
										{type}
									</MenuItem>
								))}
							</Menu>

							{/* Clear Filters */}
							{hasActiveFilters && (
								<Button variant="text" onClick={clearAllFilters} className="clear-filters-button">
									Clear All
								</Button>
							)}
						</Stack>

						{/* Active Filters Display */}
						{searchFilter.search.categoryList && searchFilter.search.categoryList.length > 0 && (
							<Stack className="active-filters">
								{searchFilter.search.categoryList.map((category) => (
									<Chip
										key={category}
										label={category.replace(/_/g, ' ')}
										onDelete={() => toggleCategoryFilter(category)}
										size="small"
										className="filter-chip"
									/>
								))}
							</Stack>
						)}
					</Stack>

					<Stack className="list-box">
						<Stack className="listing-title-box">
							<Typography className="title-text">Product</Typography>
							<Typography className="title-text">Date Published</Typography>
							<Typography className="title-text">Status</Typography>
							<Typography className="title-text">Views</Typography>
							{searchFilter.search.productStatus === 'ACTIVE' && (
								<Typography className="title-text">Actions</Typography>
							)}
						</Stack>

						{agentProducts?.length === 0 ? (
							<div className={'no-data'}>
								<img src="/img/icons/icoAlert.svg" alt="" />
								<p>No products found!</p>
							</div>
						) : (
							agentProducts.map((product: Product) => {
								return (
									<ProductCard
										key={product._id}
										product={product}
										deleteProductHandler={deleteProductHandler}
										updateProductHandler={updateProductHandler}
									/>
								);
							})
						)}

						{agentProducts.length !== 0 && (
							<Stack className="pagination-config">
								<Stack className="pagination-box">
									<Pagination
										count={Math.ceil(total / searchFilter.limit)}
										page={searchFilter.page}
										shape="circular"
										color="primary"
										onChange={paginationHandler}
									/>
								</Stack>
								<Stack className="total-result">
									<Typography>{total} products available</Typography>
								</Stack>
							</Stack>
						)}
					</Stack>
				</Stack>
			</div>
		);
	}
};

MyProducts.defaultProps = {
	initialInput: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		search: {
			productStatus: 'ACTIVE',
		},
	},
};

export default MyProducts;
