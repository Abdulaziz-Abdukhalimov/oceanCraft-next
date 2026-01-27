import React, { ChangeEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import ReviewCard from '../../libs/components/agent/ReviewCard';
import { Box, Button, Pagination, Stack, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/router';
import { Product } from '../../libs/types/product/product';
import { Event } from '../../libs/types/event/event';
import { Member } from '../../libs/types/member/member';
import { sweetErrorHandling, sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { userVar } from '../../apollo/store';
import { ProductsInquiry } from '../../libs/types/product/product.input';
import { EventsInquiry } from '../../libs/types/event/event.input';
import { CommentInput, CommentsInquiry } from '../../libs/types/comment/comment.input';
import { Comment } from '../../libs/types/comment/comment';
import { CommentGroup } from '../../libs/enums/comment.enum';
import { Messages } from '../../libs/config';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { CREATE_COMMENT, LIKE_TARGET_PRODUCT, LIKE_TARGET_EVENT } from '../../apollo/user/mutation';
import { GET_COMMENTS, GET_MEMBER, GET_PRODUCTS, GET_EVENTS } from '../../apollo/user/query';
import { T } from '../../libs/types/common';
import ProductCard from '../../libs/components/product/ProductCard';
import EventCard from '../../libs/components/event/EventCard';
import withLayoutMain from '../../libs/components/layout/LayoutHome';
import ProductBigCard from '../../libs/components/common/ProductBigCard';
import EventBigCard from '../../libs/components/common/EventBigCard';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const AgentDetail: NextPage = ({ initialProductInput, initialEventInput, initialComment, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [agentId, setAgentId] = useState<string | null>(null);
	const [agent, setAgent] = useState<Member | null>(null);
	const [activeTab, setActiveTab] = useState<'products' | 'events'>('products');

	const [productFilter, setProductFilter] = useState<ProductsInquiry>(initialProductInput);
	const [agentProducts, setAgentProducts] = useState<Product[]>([]);
	const [productTotal, setProductTotal] = useState<number>(0);

	const [eventFilter, setEventFilter] = useState<EventsInquiry>(initialEventInput);
	const [agentEvents, setAgentEvents] = useState<Event[]>([]);
	const [eventTotal, setEventTotal] = useState<number>(0);

	const [commentInquiry, setCommentInquiry] = useState<CommentsInquiry>(initialComment);
	const [agentComments, setAgentComments] = useState<Comment[]>([]);
	const [commentTotal, setCommentTotal] = useState<number>(0);
	const [insertCommentData, setInsertCommentData] = useState<CommentInput>({
		commentGroup: CommentGroup.MEMBER,
		commentContent: '',
		commentRefId: '',
	});

	/** APOLLO REQUESTS **/
	const [createComment] = useMutation(CREATE_COMMENT);
	const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);
	const [likeTargetEvent] = useMutation(LIKE_TARGET_EVENT);

	const {
		loading: getMemberLoading,
		data: getMemberData,
		error: getMemberError,
		refetch: getMemberRefetch,
	} = useQuery(GET_MEMBER, {
		fetchPolicy: 'network-only',
		variables: { input: agentId },
		skip: !agentId,
		onCompleted: (data: T) => {
			setAgent(data?.getMember);

			setProductFilter({
				...productFilter,
				search: { memberId: data?.getMember?._id },
			});

			setEventFilter({
				...eventFilter,
				search: { memberId: data?.getMember?._id },
			});

			setCommentInquiry({
				...commentInquiry,
				search: { commentRefId: data?.getMember?._id },
			});

			setInsertCommentData({
				...insertCommentData,
				commentRefId: data?.getMember?._id,
			});
		},
	});

	const {
		loading: getProductsLoading,
		data: getProductsData,
		error: getProductsError,
		refetch: getProductsRefetch,
	} = useQuery(GET_PRODUCTS, {
		fetchPolicy: 'network-only',
		variables: { input: productFilter },
		skip: !productFilter.search.memberId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setAgentProducts(data?.getProducts?.list);
			setProductTotal(data?.getProducts?.metaCounter[0]?.total ?? 0);
		},
	});

	const {
		loading: getEventsLoading,
		data: getEventsData,
		error: getEventsError,
		refetch: getEventsRefetch,
	} = useQuery(GET_EVENTS, {
		fetchPolicy: 'network-only',
		variables: { input: eventFilter },
		skip: !eventFilter.search.memberId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setAgentEvents(data?.getEvents?.list);
			setEventTotal(data?.getEvents?.metaCounter[0]?.total ?? 0);
		},
	});

	const {
		loading: getCommentsLoading,
		data: getCommentsData,
		error: getCommentsError,
		refetch: getCommentsRefetch,
	} = useQuery(GET_COMMENTS, {
		fetchPolicy: 'network-only',
		variables: { input: commentInquiry },
		skip: !commentInquiry.search.commentRefId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setAgentComments(data?.getComments?.list);
			setCommentTotal(data?.getComments?.metaCounter[0]?.total);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (router.query.agentId) setAgentId(router.query.agentId as string);
	}, [router]);

	useEffect(() => {
		if (productFilter.search.memberId) {
			getProductsRefetch({ variables: { input: productFilter } }).then();
		}
	}, [productFilter]);

	useEffect(() => {
		if (eventFilter.search.memberId) {
			getEventsRefetch({ variables: { input: eventFilter } }).then();
		}
	}, [eventFilter]);

	useEffect(() => {
		if (commentInquiry.search.commentRefId) {
			getCommentsRefetch({ variables: { input: commentInquiry } }).then();
		}
	}, [commentInquiry]);

	/** HANDLERS **/
	const productPaginationChangeHandler = async (event: ChangeEvent<unknown>, value: number) => {
		productFilter.page = value;
		setProductFilter({ ...productFilter });
	};

	const eventPaginationChangeHandler = async (event: ChangeEvent<unknown>, value: number) => {
		eventFilter.page = value;
		setEventFilter({ ...eventFilter });
	};

	const commentPaginationChangeHandler = async (event: ChangeEvent<unknown>, value: number) => {
		commentInquiry.page = value;
		setCommentInquiry({ ...commentInquiry });
	};

	const createCommentHandler = async () => {
		try {
			if (!user._id) throw new Error(Messages.error2);
			if (user._id === agentId) throw new Error('Cannot write a review for yourself!');

			await createComment({ variables: { input: insertCommentData } });
			setInsertCommentData({ ...insertCommentData, commentContent: '' });
			await getCommentsRefetch({ variables: { input: commentInquiry } });
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const likeProductHandler = async (user: any, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Messages.error2);

			await likeTargetProduct({ variables: { input: id } });
			await getProductsRefetch({ variables: { input: productFilter } });
			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR:likeProductHandler', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const likeEventHandler: any = async (user: any, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Messages.error2);

			await likeTargetEvent({ variables: { input: id } });
			await getEventsRefetch({ variables: { input: eventFilter } });
			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR:likeEventHandler', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	if (device === 'mobile') {
		return <div>AGENT DETAIL PAGE MOBILE</div>;
	} else {
		return (
			<Stack className={'agent-detail-page'}>
				<Stack className={'container'}>
					{/* Agent Header */}
					<Stack className={'agent-header'}>
						<Box className={'agent-avatar'}>
							<img
								src={agent?.memberImage ? `${agent?.memberImage}` : '/img/profile/defaultUser.svg'}
								alt={agent?.memberFullName || agent?.memberNick}
							/>
						</Box>
						<Stack className={'agent-details'}>
							<Typography className={'agent-type'}>{agent?.memberType || 'COMPANY AGENT'}</Typography>
							<Box className={'agent-name-wrapper'}>
								<Typography className={'agent-name'}>{agent?.memberFullName ?? agent?.memberNick}</Typography>
								{/* {agent?.memberPoints > 10 && (
									<Box className={'verified-badge'}>
										<img src="/img/profile/agent.png" alt="verified" />
										<span>VERIFIED</span>
									</Box>
								)} */}
							</Box>
							<Box className={'agent-rating'}>
								<Box className={'stars'}>
									{[1, 2, 3, 4, 5].map((star) => (
										<StarIcon key={star} className={star <= 3 ? 'filled' : 'empty'} />
									))}
								</Box>
								<Typography className={'rating-text'}>3.4</Typography>
								<Typography className={'reviews-link'}>See all reviews</Typography>
							</Box>
							<Typography className={'agent-specialty'}>
								{agent?.memberDesc || 'MODERN WATER SPORT EQUIPMENTS'}
							</Typography>
							<Box className={'agent-actions'}>
								<Button className={'ask-btn'}>
									<img src="/img/icons/chat.svg" alt="" />
									Ask a question
								</Button>
								<Button className={'call-btn'}>
									<img src="/img/icons/call.svg" alt="" />
									{agent?.memberPhone || '321 456 9874'}
								</Button>
							</Box>
						</Stack>
					</Stack>

					{/* Main Content Area */}
					<Stack className={'main-content'}>
						{/* Left Side - Listings */}
						<Stack className={'listings-section'}>
							{/* Tabs */}
							<Box className={'tabs-wrapper'}>
								<Button
									className={`tab ${activeTab === 'products' ? 'active' : ''}`}
									onClick={() => setActiveTab('products')}
								>
									Products ({productTotal})
								</Button>
								<Button
									className={`tab ${activeTab === 'events' ? 'active' : ''}`}
									onClick={() => setActiveTab('events')}
								>
									Events ({eventTotal})
								</Button>
							</Box>

							{/* Filter Buttons */}
							<Box className={'filter-buttons'}>
								<Button className={'filter-btn active'}>ALL</Button>
								<Button className={'filter-btn'}>FOR RENT</Button>
								<Button className={'filter-btn'}>FOR SALE</Button>
							</Box>

							{/* Products/Events Grid */}
							{activeTab === 'products' ? (
								<>
									<Stack className={'items-grid'}>
										{agentProducts.length === 0 ? (
											<div className={'no-data'}>
												<img src="/img/icons/icoAlert.svg" alt="" />
												<p>No products found!</p>
											</div>
										) : (
											agentProducts.map((product: Product) => (
												<ProductBigCard product={product} key={product._id} likeProductHandler={likeProductHandler} />
											))
										)}
									</Stack>
									{productTotal > 0 && Math.ceil(productTotal / productFilter.limit) > 1 && (
										<Stack className={'pagination'}>
											<Pagination
												page={productFilter.page}
												count={Math.ceil(productTotal / productFilter.limit) || 1}
												onChange={productPaginationChangeHandler}
												shape="circular"
												color="primary"
											/>
										</Stack>
									)}
								</>
							) : (
								<>
									<Stack className={'items-list'}>
										{agentEvents.length === 0 ? (
											<div className={'no-data'}>
												<img src="/img/icons/icoAlert.svg" alt="" />
												<p>No events found!</p>
											</div>
										) : (
											agentEvents.map((event: Event) => (
												<EventBigCard event={event} key={event._id} likeEventHandler={likeEventHandler} />
											))
										)}
									</Stack>
									{eventTotal > 0 && Math.ceil(eventTotal / eventFilter.limit) > 1 && (
										<Stack className={'pagination'}>
											<Pagination
												page={eventFilter.page}
												count={Math.ceil(eventTotal / eventFilter.limit) || 1}
												onChange={eventPaginationChangeHandler}
												shape="circular"
												color="primary"
											/>
										</Stack>
									)}
								</>
							)}
						</Stack>

						{/* Right Side - About Agent */}
						<Stack className={'about-section'}>
							<Typography className={'about-title'}>About {agent?.memberFullName ?? agent?.memberNick}</Typography>
							<Typography className={'about-text'}>
								{agent?.memberDesc ||
									`A knowledgeable water sports sales agent who helps customers choose the right equipment and experiences for safe, fun, and unforgettable adventures on the water.`}
							</Typography>
							<Box className={'language-info'}>
								<img src="/img/icons/keywording.svg" alt="" />
								<Typography>Language: English, Spanish, French</Typography>
							</Box>
						</Stack>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

AgentDetail.defaultProps = {
	initialProductInput: {
		page: 1,
		limit: 6,
		search: {
			memberId: '',
		},
	},
	initialEventInput: {
		page: 1,
		limit: 6,
		search: {
			memberId: '',
		},
	},
	initialComment: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		direction: 'DESC',
		search: {
			commentRefId: '',
		},
	},
};

export default withLayoutMain(AgentDetail);
