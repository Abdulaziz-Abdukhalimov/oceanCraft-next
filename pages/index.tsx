import { NextPage } from 'next';
import useDeviceDetect from '../libs/hooks/useDeviceDetect';
import withLayoutMain from '../libs/components/layout/LayoutHome';
import CommunityBoards from '../libs/components/homepage/CommunityBoards';
import PopularProperties from '../libs/components/homepage/PopularProducts';
import TopAgents from '../libs/components/homepage/TopAgents';
import Events from '../libs/components/homepage/Events';
import TrendProperties from '../libs/components/homepage/TrendProperties';
import TopProperties from '../libs/components/homepage/TopProperties';
import { Stack } from '@mui/material';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import HeroCarousel from '../libs/components/homepage/Advertisement';
import PopularProducts from '../libs/components/homepage/PopularProducts';
import TrendAdvertisement from '../libs/components/homepage/TrendAdvertisement';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Home: NextPage = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return (
			<Stack className={'home-page'}>
				<TrendProperties />
				<PopularProperties />
				<HeroCarousel />
				<TopProperties />
				<TopAgents />
			</Stack>
		);
	} else {
		return (
			<Stack className={'home-page'}>
				<HeroCarousel />
				<PopularProducts />
				<TrendAdvertisement />
				{/* <TopProperties /> */}
				{/*<TopAgents />
				<Events />
				<CommunityBoards />  */}
			</Stack>
		);
	}
};

export default withLayoutMain(Home);
