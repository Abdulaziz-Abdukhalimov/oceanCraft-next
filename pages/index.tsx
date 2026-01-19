import { NextPage } from 'next';
import useDeviceDetect from '../libs/hooks/useDeviceDetect';
import withLayoutMain from '../libs/components/layout/LayoutHome';
import TopAgents from '../libs/components/homepage/TopAgents';
import TopProperties from '../libs/components/homepage/TopEvents';
import { Stack } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import HeroCarousel from '../libs/components/homepage/Advertisement';
import PopularProducts from '../libs/components/homepage/PopularProducts';
import TrendAdvertisement from '../libs/components/homepage/TrendAdvertisement';
import TopEvents from '../libs/components/homepage/TopEvents';
import CategoryPopularProducts from '../libs/components/homepage/CategoryProducts';

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
				<HeroCarousel />
				<PopularProducts />
				<TrendAdvertisement />
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
				<TopEvents />
				<CategoryPopularProducts />
				{/*<TopAgents />
				<CommunityBoards />  */}
			</Stack>
		);
	}
};

export default withLayoutMain(Home);
