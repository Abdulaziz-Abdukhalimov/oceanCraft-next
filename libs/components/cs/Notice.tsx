import React from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';

const Notice = () => {
	const device = useDeviceDetect();

	/** APOLLO REQUESTS **/
	/** LIFECYCLES **/
	/** HANDLERS **/

	const data = [
		{
			no: 1,
			title: 'Now you can get discounts by booking 2 activities at once 🪅',
			date: '28.01.2026',
		},
		{
			no: 2,
			title: "It's free to trade here , grow your business with us ",
			date: '31.01.2026',
		},
		{
			no: 3,
			title: 'New feature added 📲!  Now you can use our platform on dark/white mode',
			date: '1.02.2026',
		},
	];

	if (device === 'mobile') {
		return <div>NOTICE MOBILE</div>;
	} else {
		return (
			<Stack className={'notice-content'}>
				<span className={'title'}>Notice</span>
				<Stack className={'main'}>
					<Stack className={'bottom'}>
						{data.map((ele: any) => (
							<div className={`notice-card ${ele?.event && 'event'}`} key={ele.title}>
								<span className={'notice-title'}>{ele.title}</span>
								<span className={'notice-date'}>{ele.date}</span>
							</div>
						))}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default Notice;
