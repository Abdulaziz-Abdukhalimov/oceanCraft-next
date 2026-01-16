import { useState, useEffect } from 'react';
import { Stack, Box, IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const HeroCarousel = () => {
	const [currentSlide, setCurrentSlide] = useState(0);
	const [isPlaying, setIsPlaying] = useState(true);

	const slides = [
		{
			image: '/img/banner/add1.jpg',
			alt: 'Slide 1',
		},
		{
			image: '/img/banner/add2.gif',
			alt: 'Slide 2',
		},
		{
			image: '/img/banner/add3.gif',
			alt: 'Slide 3',
		},
		{
			image: '/img/banner/add4.jpg',
			alt: 'Slide 4',
		},
	];

	// Auto-scroll effect
	useEffect(() => {
		if (!isPlaying) return;

		const interval = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % slides.length);
		}, 5000); // Change slide every 5 seconds

		return () => clearInterval(interval);
	}, [isPlaying, slides.length]);

	const handlePrevSlide = () => {
		setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
	};

	const handleNextSlide = () => {
		setCurrentSlide((prev) => (prev + 1) % slides.length);
	};

	const handlePlayPause = () => {
		setIsPlaying(!isPlaying);
	};

	const handleDotClick = (index: number) => {
		setCurrentSlide(index);
	};

	return (
		<Stack className={'hero-carousel'}>
			{/* Slides Container */}
			<Box className={'slides-container'}>
				{slides.map((slide, index) => (
					<Box
						key={index}
						className={`slide ${index === currentSlide ? 'active' : ''}`}
						style={{
							backgroundImage: `url(${slide.image})`,
						}}
					>
						<img src={slide.image} alt={slide.alt} />
					</Box>
				))}
			</Box>

			{/* Left Navigation */}
			<Box className={'nav-left'}>
				<IconButton className={'nav-btn'} onClick={handlePrevSlide}>
					<ArrowBackIosNewIcon />
				</IconButton>
			</Box>

			{/* Right Navigation */}
			<Box className={'nav-right'}>
				<IconButton className={'nav-btn'} onClick={handleNextSlide}>
					<ArrowForwardIosIcon />
				</IconButton>
			</Box>

			{/* Bottom Controls */}
			<Box className={'bottom-controls'}>
				{/* Play/Pause Button */}
				<IconButton className={'play-pause-btn'} onClick={handlePlayPause}>
					{isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
				</IconButton>

				{/* Slide Counter */}
				<Box className={'slide-counter'}>
					<span className={'current'}>{currentSlide + 1}</span>
					<span className={'separator'}>/</span>
					<span className={'total'}>{slides.length}</span>
				</Box>

				{/* Dots Navigation */}
				<Box className={'dots-navigation'}>
					{slides.map((_, index) => (
						<button
							key={index}
							className={`dot ${index === currentSlide ? 'active' : ''}`}
							onClick={() => handleDotClick(index)}
						/>
					))}
				</Box>
			</Box>
		</Stack>
	);
};

export default HeroCarousel;
