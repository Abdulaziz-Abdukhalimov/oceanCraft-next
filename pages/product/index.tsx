import React, { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Box, Button, Menu, MenuItem, Pagination, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutMain from '../../libs/components/layout/LayoutHome';
import { useRouter } from 'next/router';
import { ProductsInquiry } from '../../libs/types/product/product.input';
import { Product } from '../../libs/types/product/product';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Direction, Message } from '../../libs/enums/common.enum';
import { GET_PRODUCTS } from '../../apollo/user/query';
import { useMutation, useQuery } from '@apollo/client';
import { T } from '../../libs/types/common';
import { LIKE_TARGET_PRODUCT } from '../../apollo/user/mutation';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import ProductCard from '../../libs/components/product/ProductCard';
import ProductFilter from '../../libs/components/product/Filter';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const ProductList: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [searchFilter, setSearchFilter] = useState<ProductsInquiry>(
		router?.query?.input ? JSON.parse(router?.query?.input as string) : initialInput,
	);
	const [products, setProducts] = useState<Product[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [sortingOpen, setSortingOpen] = useState(false);
	const [filterSortName, setFilterSortName] = useState('Popular');
	const [viewType, setViewType] = useState<'grid' | 'list'>('grid');

	/** APOLLO REQUESTS **/
	const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);

	const {
		loading: getProductsLoading,
		data: getProductsData,
		error: getProductsError,
		refetch: getProductsRefetch,
	} = useQuery(GET_PRODUCTS, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setProducts(data?.getProducts?.list);
			setTotal(data?.getProducts?.metaCounter[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (router.query.input) {
			const inputObj = JSON.parse(router?.query?.input as string);
			setSearchFilter(inputObj);
		}

		setCurrentPage(searchFilter.page === undefined ? 1 : searchFilter.page);
	}, [router]);

	useEffect(() => {
		console.log('Search Filter Updated:', searchFilter);
	}, [searchFilter]);

	/** HANDLERS **/
	const handlePaginationChange = async (event: ChangeEvent<unknown>, value: number) => {
		searchFilter.page = value;
		await router.push(
			`/product?input=${JSON.stringify(searchFilter)}`,
			`/product?input=${JSON.stringify(searchFilter)}`,
			{
				scroll: false,
			},
		);
		setCurrentPage(value);
	};

	const likeProductHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			// Execute likeTargetProduct mutation
			await likeTargetProduct({ variables: { input: id } });

			// Refetch products to update like status
			await getProductsRefetch({ input: searchFilter });

			await sweetTopSmallSuccessAlert('Success', 800);
		} catch (err: any) {
			console.log('ERROR, likeProductHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const sortingClickHandler = (e: MouseEvent<HTMLElement>) => {
		setAnchorEl(e.currentTarget);
		setSortingOpen(true);
	};

	const sortingCloseHandler = () => {
		setSortingOpen(false);
		setAnchorEl(null);
	};

	const sortingHandler = async (e: React.MouseEvent<HTMLLIElement>) => {
		let updatedFilter = { ...searchFilter };

		switch (e.currentTarget.id) {
			case 'popular':
				updatedFilter = { ...searchFilter, sort: 'productRank', direction: Direction.DESC };
				setFilterSortName('Popular');
				break;
			case 'newest':
				updatedFilter = { ...searchFilter, sort: 'createdAt', direction: Direction.DESC };
				setFilterSortName('Newest');
				break;
			case 'cheapest':
				updatedFilter = { ...searchFilter, sort: 'productPrice', direction: Direction.ASC };
				setFilterSortName('Cheapest');
				break;
			case 'expensive':
				updatedFilter = { ...searchFilter, sort: 'productPrice', direction: Direction.DESC };
				setFilterSortName('Most Expensive');
				break;
		}

		setSearchFilter(updatedFilter);
		await router.push(
			`/product?input=${JSON.stringify(updatedFilter)}`,
			`/product?input=${JSON.stringify(updatedFilter)}`,
			{ scroll: false },
		);

		setSortingOpen(false);
		setAnchorEl(null);
	};

	const handleViewTypeChange = (type: 'grid' | 'list') => {
		setViewType(type);
	};

	const handleBrandFilter = async (brand: string) => {
		const updatedFilter: ProductsInquiry = {
			...searchFilter,
			page: 1,
			search: {
				...searchFilter.search,
				text: brand,
			},
		};

		setSearchFilter(updatedFilter);

		await router.push(`/product?input=${JSON.stringify(updatedFilter)}`, undefined, { scroll: false });
	};

	if (device === 'mobile') {
		return <h1>PRODUCTS MOBILE</h1>;
	} else {
		return (
			<Stack id="product-list-page" style={{ position: 'relative' }}>
				<div className="container">
					{/* Top Bar */}
					<Stack className="top-bar">
						<Typography className="page-title">
							<span>{products.length}</span>
							<span>products</span>
						</Typography>
						<div className="line-border"></div>
						<Stack className="brand-filter">
							<button
								className={`brand ${searchFilter.search?.text === 'SeaDoo' ? 'active' : ''}`}
								onClick={() => handleBrandFilter('SeaDoo')}
							>
								SeaDoo
							</button>
							<button
								className={`brand ${searchFilter.search?.text === 'Yamaha' ? 'active' : ''}`}
								onClick={() => handleBrandFilter('Yamaha')}
							>
								Yamaha
							</button>
							<button
								className={`brand ${searchFilter.search?.text === 'Kawasaki' ? 'active' : ''}`}
								onClick={() => handleBrandFilter('Kawasaki')}
							>
								Kawasaki
							</button>
							<button
								className={`brand ${searchFilter.search?.text === '' ? 'active' : ''}`}
								onClick={() => handleBrandFilter('')}
							>
								Related Products
							</button>
						</Stack>
					</Stack>
					{/* Main Content */}
					<Stack className={'product-page'}>
						{/* Filter Sidebar */}
						<Stack className={'filter-config'}>
							<ProductFilter
								searchFilter={searchFilter}
								setSearchFilter={setSearchFilter}
								initialInput={initialInput}
							/>
						</Stack>

						{/* Products Grid */}
						<Stack className="main-config" mb={'76px'}>
							<Stack className={`list-config ${viewType === 'grid' ? 'grid-view' : 'list-view'}`}>
								{products?.length === 0 ? (
									<div className={'no-data'}>
										<img src="/img/icons/icoAlert.svg" alt="" />
										<p>No Products found!</p>
									</div>
								) : (
									products.map((product: Product) => {
										return <ProductCard product={product} likeProductHandler={likeProductHandler} key={product?._id} />;
									})
								)}
							</Stack>

							{/* Pagination */}
							<Stack className="pagination-config">
								{products.length !== 0 && (
									<Stack className="pagination-box">
										<Pagination
											page={currentPage}
											count={total}
											onChange={handlePaginationChange}
											shape="circular"
											color="primary"
										/>
									</Stack>
								)}

								{products.length !== 0 && (
									<Stack className="total-result">
										<Typography>
											Total {total} product{total > 1 ? 's' : ''} available
										</Typography>
									</Stack>
								)}
							</Stack>
						</Stack>
					</Stack>
				</div>
			</Stack>
		);
	}
};

ProductList.defaultProps = {
	initialInput: {
		page: 1,
		limit: 12,
		sort: 'productRank',
		direction: 'DESC',
		search: {},
	},
};

export default withLayoutMain(ProductList);
