import React, { useState, useEffect } from 'react';
import { Box, Stack } from '@mui/material';

const NavbarAdCarousel = () => {
	const [currentIndex, setCurrentIndex] = useState(0);

	const adImages = ['/img/banner/topb_re.jpg', '/img/banner/topb_re02.jpg', '/img/banner/topb_re03.jpg'];

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentIndex((prevIndex) => (prevIndex + 1) % adImages.length);
		}, 4000);

		return () => clearInterval(interval);
	}, []);

	return (
		<Stack className="ad-carousel-container">
			<div className="ad-slide">
				<img src={adImages[currentIndex]} alt="Advertisement" />
			</div>
			<div className="ad-dots">
				{adImages.map((_, index) => (
					<span
						key={index}
						className={`dot ${index === currentIndex ? 'active' : ''}`}
						onClick={() => setCurrentIndex(index)}
					/>
				))}
			</div>
		</Stack>
	);
};

export default NavbarAdCarousel;
