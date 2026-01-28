import React, { useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Box, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import Notice from '../../libs/components/cs/Notice';
import Faq from '../../libs/components/cs/Faq';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import withLayoutMain from '../../libs/components/layout/LayoutHome';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

interface PopularData {
	id: string;
	title: string;
	icon: string;
	description: string;
	content: string;
}

const CS: NextPage = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [selectedCategory, setSelectedCategory] = useState<PopularData | null>(null);

	const categories: PopularData[] = [
		{
			id: 'bookings',
			title: 'Can I book an activity on behalf of someone else?',
			icon: '/img/icons/bookings.jpg',
			description:
				'Yes. Just be sure to provide their details when finalizing your booking details to make a booking on behalf of your family and friends.',
			content:
				'Yes, you can book activities on behalf of someone else. During the booking process, you will be asked to provide participant details. Simply enter the information of the person who will be participating in the activity. Make sure to provide accurate contact information so they can receive booking confirmations and any necessary updates about their activity.',
		},
		{
			id: 'use',
			title: 'How to use OceanCraft?',
			icon: '/img/icons/use.jpg',
			description: 'You can just signup or login, and browse equipments and activities',
			content:
				"Using OceanCraft is simple! First, create an account or log in if you already have one. Once logged in, you can browse through our wide selection of water sports equipment and activities. Use our search and filter features to find exactly what you're looking for. When you find something you like, click on it to see more details, then contact the agent or make a booking inquiry. You can also save your favorites and manage all your bookings from your dashboard.",
		},
		{
			id: 'payment',
			title: 'How can I get payment info and receipts?',
			icon: '/img/icons/payment.jpg',
			description: 'Go to your bookings section on your dashboard and select booking you wanted to get',
			content:
				'To access your payment information and receipts, log into your account and navigate to your dashboard. Click on the "Bookings" section where you\'ll see a list of all your past and current bookings. Select the specific booking you want details for, and you\'ll be able to view and download payment receipts, transaction history, and booking confirmations. All receipts are also sent to your registered email address.',
		},
		{
			id: 'refund',
			title: 'Booking changes and refunds?',
			icon: '/img/icons/refund.jpg',
			description:
				'Once your refund request is approved, the refund will be initiated within 24 hours. After the initiation, the time taken for you to receive the refund will be different depending on your payment method.',
			content:
				'Our refund policy varies depending on the specific activity or equipment rental. Generally, cancellations made 24 hours before the scheduled time are eligible for a full refund. To request a refund, go to your bookings and select "Cancel Booking". Once your refund request is approved, the refund will be initiated within 24 hours. The time it takes to receive your refund depends on your payment method: credit/debit cards typically take 5-10 business days, while PayPal refunds are usually processed within 24-48 hours.',
		},
	];

	const handleCardClick = (category: PopularData) => {
		setSelectedCategory(category);
	};

	const handleCloseModal = () => {
		setSelectedCategory(null);
	};

	/** HANDLERS **/
	const changeTabHandler = (tab: string) => {
		router.push(
			{
				pathname: '/cs',
				query: { tab: tab },
			},
			undefined,
			{ scroll: false },
		);
	};
	const tab = router.query.tab ?? 'notice';

	if (device === 'mobile') {
		return <h1>CS PAGE MOBILE</h1>;
	} else {
		return (
			<Stack className={'cs-page'}>
				<Stack className={'container'}>
					<Box component={'div'} className={'cs-main-info'}>
						<Box component={'div'} className={'info'}>
							<span>Customer Service Center</span>
						</Box>
						<Stack className={'category-browse-section'}>
							<Typography className={'section-title'}>Browse popular faqs</Typography>

							<Stack className={'popular-cards'}>
								{categories.map((category: PopularData) => (
									<Box key={category.id} className={'popular-faq'} onClick={() => handleCardClick(category)}>
										<img src={category.icon} alt={category.title} />
										<Typography className={'faq-title'}>{category.title}</Typography>
										<Typography className={'faq-description'}>{category.description}</Typography>
									</Box>
								))}
							</Stack>
						</Stack>
						<Box component={'div'} className={'btns'}>
							<div
								className={tab == 'notice' ? 'active' : ''}
								onClick={() => {
									changeTabHandler('notice');
								}}
							>
								Notice
							</div>
							<div
								className={tab == 'faq' ? 'active' : ''}
								onClick={() => {
									changeTabHandler('faq');
								}}
							>
								FAQ
							</div>
							<div> 1:1 inquiry</div>
						</Box>
					</Box>

					<Box component={'div'} className={'cs-content'}>
						{tab === 'notice' && <Notice />}

						{tab === 'faq' && <Faq />}
					</Box>
				</Stack>
			</Stack>
		);
	}
};

export default withLayoutMain(CS);
