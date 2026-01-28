import React, { useState } from 'react';
import { Stack, Box, Typography } from '@mui/material';
import { useQuery, useMutation, useReactiveVar } from '@apollo/client';
import { GET_PRODUCTS } from '../../../apollo/user/query';
import { LIKE_TARGET_PRODUCT } from '../../../apollo/user/mutation';
import { Product } from '../../types/product/product';
import { userVar } from '../../../apollo/store';
import { sweetMixinErrorAlert } from '../../sweetAlert';
import { Message } from '../../enums/common.enum';
import CategoryProductSlider from './CategoryProductCard';

const CATEGORIES = [
	{ key: 'YACHT', label: '요트', imgUrl: '/img/icons/ca_ico04.png' },
	{ key: 'BOAT', label: '고무보트', imgUrl: '/img/icons/ca_ico03.png' },
	{ key: 'JET_SKIS', label: '제트스키', imgUrl: '/img/icons/ca_ico04.png' },
	{ key: 'ENGINES', label: '선외기', imgUrl: '/img/icons/ca_ico05.png' },
	{ key: 'SNOWMOBILE', label: '설상차', imgUrl: '/img/icons/ca_ico04.png' },
	{ key: 'OTHER', label: '어탐기·GPS', imgUrl: '/img/icons/ca_ico07.png' },
];

const CategoryPopularProducts = () => {
	const user = useReactiveVar(userVar);
	const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].key);
	const [products, setProducts] = useState<Product[]>([]);

	const { loading } = useQuery(GET_PRODUCTS, {
		variables: {
			input: {
				page: 1,
				limit: 4,
				sort: 'createdAt',
				direction: 'DESC',
				search: {
					categoryList: activeCategory,
				},
			},
		},
		fetchPolicy: 'cache-and-network',
		onCompleted: (data) => {
			setProducts(data?.getProducts?.list ?? []);
		},
	});

	const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);

	/* =====================
		LIKE HANDLER
	===================== */
	const likeProductHandler = async (productId: string) => {
		try {
			if (!user?._id) throw new Error(Message.NOT_AUTHENTICATED);

			setProducts((prev) =>
				prev.map((product) =>
					product._id === productId
						? {
								...product,
								meLiked: product.meLiked?.[0]
									? [{ ...product.meLiked[0], myFavorite: !product.meLiked[0].myFavorite }]
									: [{ myFavorite: true, memberId: user._id, likeRefId: productId }],
						  }
						: product,
				),
			);

			await likeTargetProduct({ variables: { input: productId } });
		} catch (err: any) {
			sweetMixinErrorAlert(err.message);
		}
	};

	return (
		<Stack className="category-popular">
			<Typography className="title">카테고리별 인기상품</Typography>
			<Typography className="subtitle">카테고리별 인기상품만 모아보았습니다.</Typography>

			<Stack className="category-tabs" direction="row">
				{CATEGORIES.map((category) => (
					<Box
						key={category.key}
						className={`tab ${activeCategory === category.key ? 'active' : ''}`}
						onClick={() => setActiveCategory(category.key)}
					>
						<img src={category.imgUrl} />
						{category.label}
					</Box>
				))}
			</Stack>

			<CategoryProductSlider loading={loading} products={products} likeProductHandler={likeProductHandler} />
		</Stack>
	);
};

export default CategoryPopularProducts;
