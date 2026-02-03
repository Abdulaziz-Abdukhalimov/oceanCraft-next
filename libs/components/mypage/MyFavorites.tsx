import React, { useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Pagination, Stack, Typography, Tabs, Tab, Box } from '@mui/material';
import { Product } from '../../types/product/product';
import { Event } from '../../types/event/event';
import { T } from '../../types/common';
import { useMutation, useQuery } from '@apollo/client';
import { LIKE_TARGET_PRODUCT, LIKE_TARGET_EVENT } from '../../../apollo/user/mutation';
import { GET_FAVORITES } from '../../../apollo/user/query';
import { sweetMixinErrorAlert } from '../../sweetAlert';
import { Messages } from '../../config';
import ProductBigCard from '../common/ProductBigCard';
import EventBigCard from '../common/EventBigCard';

interface FavoriteItem {
	_id: string;
	itemType: string;
	likeRefId: string;
	createdAt: Date;
	productData?: Product;
	eventData?: Event;
}

const MyFavorites: NextPage = () => {
	const device = useDeviceDetect();
	const [myFavorites, setMyFavorites] = useState<FavoriteItem[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [searchFavorites, setSearchFavorites] = useState<T>({ page: 1, limit: 4 });
	const [activeTab, setActiveTab] = useState(0);

	/** APOLLO REQUESTS **/
	const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);
	const [likeTargetEvent] = useMutation(LIKE_TARGET_EVENT);

	const {
		loading: getFavoritesLoading,
		data: getFavoritesData,
		error: getFavoritesError,
		refetch: getFavoritesRefetch,
	} = useQuery(GET_FAVORITES, {
		fetchPolicy: 'network-only',
		variables: {
			input: searchFavorites,
		},
		notifyOnNetworkStatusChange: true,
		onCompleted(data: T) {
			setMyFavorites(data.getAllFavorites?.list || []);
			setTotal(data.getAllFavorites?.metaCounter[0]?.total ?? 0);
		},
	});

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchFavorites({ ...searchFavorites, page: value });
	};

	const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
		setActiveTab(newValue);
		setSearchFavorites({ ...searchFavorites, page: 1 });
	};

	const likeProductHandler = async (user: any, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Messages.error2);

			await likeTargetProduct({
				variables: { input: id },
			});

			await getFavoritesRefetch({ input: searchFavorites });
		} catch (err: any) {
			console.log('Error, likeProductHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const likeEventHandler = async (user: any, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Messages.error2);

			await likeTargetEvent({
				variables: { input: id },
			});

			await getFavoritesRefetch({ input: searchFavorites });
		} catch (err: any) {
			console.log('Error, likeEventHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	// Filter favorites based on active tab
	const filteredFavorites = myFavorites.filter((item) => {
		if (activeTab === 0) return true; // All
		if (activeTab === 1) return item.itemType === 'PRODUCT';
		if (activeTab === 2) return item.itemType === 'EVENT';
		return true;
	});

	const filteredTotal = filteredFavorites.length;

	if (device === 'mobile') {
		return <div>MY FAVORITES MOBILE</div>;
	} else {
		return (
			<div id="my-favorites-page">
				<Stack className="main-title-box">
					<Stack className="right-box">
						<Typography className="main-title">My Favorites</Typography>
						<Typography className="sub-title">Your saved products and events</Typography>
					</Stack>
				</Stack>

				{/* Tabs for filtering */}
				<Box className="tabs-wrapper">
					<Tabs value={activeTab} onChange={handleTabChange} className="favorites-tabs">
						<Tab label="All" />
						<Tab label="Products" />
						<Tab label="Events" />
					</Tabs>
				</Box>

				<Stack className="favorites-list-box">
					{filteredFavorites?.length ? (
						filteredFavorites?.map((favorite: FavoriteItem) => {
							if (favorite.itemType === 'PRODUCT' && favorite.productData) {
								return (
									<div key={favorite._id} className="favorite-card-wrapper">
										<ProductBigCard
											product={favorite.productData}
											likeProductHandler={likeProductHandler}
											myFavorites={true}
										/>
									</div>
								);
							} else if (favorite.itemType === 'EVENT' && favorite.eventData) {
								return (
									<div key={favorite._id} className="favorite-card-wrapper">
										<EventBigCard event={favorite.eventData} likeEventHandler={likeEventHandler} myFavorites={true} />
									</div>
								);
							}
							return null;
						})
					) : (
						<div className={'no-data'}>
							<img src="/img/icons/icoAlert.svg" alt="" />
							<p>No favorites found!</p>
						</div>
					)}
				</Stack>

				{filteredFavorites?.length ? (
					<Stack className="pagination-config">
						<Stack className="pagination-box">
							<Pagination
								count={filteredTotal}
								page={searchFavorites.page}
								shape="circular"
								color="primary"
								onChange={paginationHandler}
							/>
						</Stack>
						<Stack className="total-result">
							<Typography>
								Total {filteredTotal} favorite{filteredTotal > 1 ? 's' : ''}
							</Typography>
						</Stack>
					</Stack>
				) : null}
			</div>
		);
	}
};

export default MyFavorites;
