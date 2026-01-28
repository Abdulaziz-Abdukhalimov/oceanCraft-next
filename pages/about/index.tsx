import React from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Stack, Box } from '@mui/material';

const About: NextPage = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return <div>ABOUT PAGE MOBILE</div>;
	} else {
		return (
			<Stack className={'about-page'}>
				{/* Hero Section */}
				<Stack className={'hero'}>
					<div className={'video-background'}>
						<iframe
							src="https://www.youtube.com/embed/CA39EOk73dg?autoplay=1&mute=1&loop=1&playlist=CA39EOk73dg&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1"
							frameBorder="0"
							allow="autoplay; encrypted-media"
						/>
						<div className={'overlay'}></div>
					</div>

					<Stack className={'container'}>
						<h1>Powering Water Adventures</h1>
						<p className={'subtitle'}>
							We bring people closer to the water through premium equipment, safe experiences, and unforgettable
							moments.
						</p>
					</Stack>
				</Stack>

				{/* Philosophy Section */}
				<Stack className={'philosophy'}>
					<Stack className={'container'}>
						<Stack className={'content-grid'}>
							<Box className={'text-block'}>
								<span className={'label'}>Our Philosophy</span>
								<h2>Adventure meets safety</h2>
							</Box>
							<Box className={'text-block'}>
								<p>
									Every wave is an opportunity. Whether you're riding, exploring, or relaxing, we're here to equip you
									with everything you need for a smooth and thrilling water experience.
								</p>
								<p>
									With a strong focus on quality equipment, certified partners, and customer-first service, we make
									water sports accessible, safe, and exciting for everyone.
								</p>
							</Box>
						</Stack>

						<Stack className={'features'}>
							<Box className={'feature'}>
								<div className={'icon-circle'}>
									<img src="/img/icons/garden.svg" alt="" />
								</div>
								<h3>Premium Equipment</h3>
								<p>Carefully selected gear for every water adventure</p>
							</Box>
							<Box className={'feature'}>
								<div className={'icon-circle'}>
									<img src="/img/icons/securePayment.svg" alt="" />
								</div>
								<h3>Easy Booking</h3>
								<p>Simple, secure and hassle-free reservations</p>
							</Box>
							<Box className={'feature'}>
								<div className={'icon-circle'}>
									<img src="/img/icons/investment.svg" alt="" />
								</div>
								<h3>Expert Support</h3>
								<p>Guidance from experienced water sports professionals</p>
							</Box>
						</Stack>
					</Stack>
				</Stack>

				{/* Image Gallery Section */}
				<Stack className={'gallery'}>
					<Stack className={'container'}>
						<iframe
							width="900"
							height="500"
							src="https://www.youtube.com/embed/0HVlihbqU3s?si=LJ84I4hkH7ykqnNS&amp;controls=0"
							title="YouTube video player"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
						></iframe>
					</Stack>
				</Stack>

				{/* Statistics */}
				<Stack className={'statistics'}>
					<Stack className={'container'}>
						<Box className={'stat'}>
							<strong>12K+</strong>
							<p>Successful bookings</p>
						</Box>
						<Box className={'stat'}>
							<strong>1K+</strong>
							<p>Equipment Units</p>
						</Box>
						<Box className={'stat'}>
							<strong>17K+</strong>
							<p>Happy Adventures</p>
						</Box>
					</Stack>
				</Stack>

				{/* Services Section */}
				<Stack className={'services'}>
					<Stack className={'container'}>
						<h2>What we offer</h2>

						<Stack className={'service-list'}>
							<Box className={'service-item'}>
								<img src="/img/icons/security.svg" alt="" />
								<div>
									<h3>Equipment Rental</h3>
									<p>High-quality water sports equipment available for short or long-term use.</p>
								</div>
							</Box>
							<Box className={'service-item'}>
								<img src="/img/icons/keywording.svg" alt="" />
								<div>
									<h3>Guided Activities</h3>
									<p>Professional instructors for jet skiing, kayaking, paddleboarding, and more.</p>
								</div>
							</Box>
							<Box className={'service-item'}>
								<img src="/img/icons/investment.svg" alt="" />
								<div>
									<h3>Group & Corporate Events</h3>
									<p>Customized water sports experience for groups , teams, and scpecial events.</p>
								</div>
							</Box>
						</Stack>
					</Stack>
				</Stack>

				{/* CTA Section */}
				<Stack className={'cta'}>
					<Stack className={'container'}>
						<h2>Ready for your next adventure?</h2>
						<p>Book your experience and dive in today</p>
						<Stack className={'cta-buttons'}>
							<button className={'primary'}>Book Now</button>
							<button className={'secondary'}>
								<img src="/img/icons/call.svg" alt="" />
								010 6820 2122
							</button>
						</Stack>
					</Stack>
				</Stack>

				{/* Partners */}
				<Stack className={'partners'}>
					<Stack className={'container'}>
						<p className={'partners-label'}>Trusted by leading water sports providers</p>
						<Stack className={'partners-grid'}>
							<img src="/img/banner/spon.png" alt="" />
							<img src="/img/icons/brands/amd.svg" alt="" />
							<img src="/img/banner/spon3.png" alt="" />
							<img src="/img/icons/brands/dropcam.svg" alt="" />
							<img src="/img/banner/spon2.png" alt="" />
						</Stack>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default withLayoutBasic(About);
