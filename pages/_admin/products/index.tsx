import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { Box, List, ListItem, Stack } from '@mui/material';
import { TabContext } from '@mui/lab';
import TablePagination from '@mui/material/TablePagination';
import { sweetConfirmAlert, sweetErrorHandling } from '../../../libs/sweetAlert';
import { T } from '../../../libs/types/common';
import { REMOVE_PRODUCT_BY_ADMIN, UPDATE_PRODUCT_BY_ADMIN } from '../../../apollo/admin/mutation';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ALL_PRODUCT_BY_ADMIN } from '../../../apollo/admin/query';
import { AllProductsInquiry } from '../../../libs/types/product/product.input';
import { Product } from '../../../libs/types/product/product';
import { ProductStatus } from '../../../libs/enums/product.enum';
import { ProductUpdate } from '../../../libs/types/product/property.update';
import { ProductPanelList } from '../../../libs/components/admin/products/ProductList';

const AdminProducts: NextPage = ({ initialInquiry, ...props }: any) => {
	const [anchorEl, setAnchorEl] = useState<[] | HTMLElement[]>([]);
	const [productsInquiry, setProductsInquiry] = useState<AllProductsInquiry>(initialInquiry);
	const [products, setProducts] = useState<Product[]>([]);
	const [productsTotal, setProductsTotal] = useState<number>(0);
	const [value, setValue] = useState(
		productsInquiry?.search?.productStatus ? productsInquiry?.search?.productStatus : 'ALL',
	);
	const [searchType, setSearchType] = useState('ALL');

	/** APOLLO REQUESTS **/

	const [updateProductByAdmin] = useMutation(UPDATE_PRODUCT_BY_ADMIN);
	const [removeProductByAdmin] = useMutation(REMOVE_PRODUCT_BY_ADMIN);

	const {
		loading: getAllProductsByAdminLoading,
		data: getAllProductsByAdminData,
		error: getAllProductsByAdminError,
		refetch: getAllProductsRefetch,
	} = useQuery(GET_ALL_PRODUCT_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: { input: productsInquiry },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setProducts(data?.getAllProductsByAdmin?.list);
			setProductsTotal(data?.getAllProductsByAdmin?.metaCounter[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		getAllProductsRefetch({ input: productsInquiry }).then();
	}, [productsInquiry]);

	/** HANDLERS **/
	const changePageHandler = async (event: unknown, newPage: number) => {
		productsInquiry.page = newPage + 1;
		setProductsInquiry({ ...productsInquiry });
	};

	const changeRowsPerPageHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
		productsInquiry.limit = parseInt(event.target.value, 10);
		productsInquiry.page = 1;
		setProductsInquiry({ ...productsInquiry });
	};

	const menuIconClickHandler = (e: any, index: number) => {
		const tempAnchor = anchorEl.slice();
		tempAnchor[index] = e.currentTarget;
		setAnchorEl(tempAnchor);
	};

	const menuIconCloseHandler = () => {
		setAnchorEl([]);
	};

	const tabChangeHandler = async (event: any, newValue: string) => {
		setValue(newValue);

		setProductsInquiry({ ...productsInquiry, page: 1, sort: 'createdAt' });

		switch (newValue) {
			case 'ACTIVE':
				setProductsInquiry({ ...productsInquiry, search: { productStatus: ProductStatus.ACTIVE } });
				break;
			case 'SOLD':
				setProductsInquiry({ ...productsInquiry, search: { productStatus: ProductStatus.SOLD } });
				break;
			case 'DELETE':
				setProductsInquiry({ ...productsInquiry, search: { productStatus: ProductStatus.DELETE } });
				break;
			default:
				delete productsInquiry?.search?.productStatus;
				setProductsInquiry({ ...productsInquiry });
				break;
		}
	};

	const removeProductHandler = async (id: string) => {
		try {
			if (await sweetConfirmAlert('Are you sure to remove?')) {
				await removeProductByAdmin({ variables: { input: id } });
			}

			await getAllProductsRefetch({ input: productsInquiry });
			menuIconCloseHandler();
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	// const searchTypeHandler = async (newValue: string) => {
	// 	try {
	// 		setSearchType(newValue);

	// 		if (newValue !== 'ALL') {
	// 			setProductsInquiry({
	// 				...productsInquiry,
	// 				page: 1,
	// 				sort: 'createdAt',
	// 				search: {
	// 					...productsInquiry.search,
	// 					propertyLocationList: [newValue as PropertyLocation],
	// 				},
	// 			});
	// 		} else {
	// 			delete propertiesInquiry?.search?.propertyLocationList;
	// 			setPropertiesInquiry({ ...propertiesInquiry });
	// 		}
	// 	} catch (err: any) {
	// 		console.log('searchTypeHandler: ', err.message);
	// 	}
	// };

	const updateProductHandler = async (updateData: ProductUpdate) => {
		try {
			console.log('+updateData: ', updateData);
			await updateProductByAdmin({ variables: { input: updateData } });

			menuIconCloseHandler();
			await getAllProductsRefetch({ input: productsInquiry });
		} catch (err: any) {
			menuIconCloseHandler();
			sweetErrorHandling(err).then();
		}
	};

	return (
		<Box component={'div'} className={'content'}>
			<Box component={'div'} className={'table-wrap'}>
				<Box component={'div'} sx={{ width: '100%', typography: 'body1' }}>
					<TabContext value={value}>
						<ProductPanelList
							products={products}
							anchorEl={anchorEl}
							menuIconClickHandler={menuIconClickHandler}
							menuIconCloseHandler={menuIconCloseHandler}
							updateProductHandler={updateProductHandler}
							removeProductHandler={removeProductHandler}
						/>

						<TablePagination
							rowsPerPageOptions={[10, 20, 40, 60]}
							component="div"
							count={productsTotal}
							rowsPerPage={productsInquiry?.limit}
							page={productsInquiry?.page - 1}
							onPageChange={changePageHandler}
							onRowsPerPageChange={changeRowsPerPageHandler}
						/>
					</TabContext>
				</Box>
			</Box>
		</Box>
	);
};

AdminProducts.defaultProps = {
	initialInquiry: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default withAdminLayout(AdminProducts);
