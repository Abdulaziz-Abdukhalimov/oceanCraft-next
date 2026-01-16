import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import TelegramIcon from '@mui/icons-material/Telegram';
import TwitterIcon from '@mui/icons-material/Twitter';
import useDeviceDetect from '../hooks/useDeviceDetect';
import { Stack, Box } from '@mui/material';
import moment from 'moment';

const Footer = () => {
	const device = useDeviceDetect();

	if (device == 'mobile') {
		return (
			<Stack className={'footer-container'}>
				<Stack className={'main'}>
					<Stack className={'left'}>
						<Box component={'div'} className={'footer-box'}>
							<img src="/img/logo/logoWhite.svg" alt="" className={'logo'} />
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<span>total free customer care</span>
							<p>+82 10 4867 2909</p>
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<span>nee live</span>
							<p>+82 10 4867 2909</p>
							<span>Support?</span>
						</Box>
						<Box component={'div'} className={'footer-box'}>
							<p>follow us on social media</p>
							<div className={'media-box'}>
								<FacebookOutlinedIcon />
								<TelegramIcon />
								<InstagramIcon />
								<TwitterIcon />
							</div>
						</Box>
					</Stack>
					<Stack className={'right'}>
						<Box component={'div'} className={'bottom'}>
							<div>
								<strong>Popular Search</strong>
								<span>Property for Rent</span>
								<span>Property Low to hide</span>
							</div>
							<div>
								<strong>Quick Links</strong>
								<span>Terms of Use</span>
								<span>Privacy Policy</span>
								<span>Pricing Plans</span>
								<span>Our Services</span>
								<span>Contact Support</span>
								<span>FAQs</span>
							</div>
							<div>
								<strong>Discover</strong>
								<span>Seoul</span>
								<span>Gyeongido</span>
								<span>Busan</span>
								<span>Jejudo</span>
							</div>
						</Box>
					</Stack>
				</Stack>
				<Stack className={'second'}>
					<span>© Nestar - All rights reserved. Nestar {moment().year()}</span>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack id="footer">
				<Stack className="footer-container">
					{/* MAIN */}
					<Stack className="main" direction="row">
						{/* LEFT — Logo */}
						<Stack className="left">
							<Box className="logo">
								<img src="/img/logo/logo.png" alt="OceanCraft Logo" />
							</Box>
						</Stack>

						{/* CENTER — Newsletter */}
						<Stack className="center">
							<Box className="newsletter-section">
								<p>
									뉴스레터를 구독하세요
									<br />
									그리고 대규모 할인 행사에 유의하세요
								</p>
								<div className="newsletter">
									<input type="email" placeholder="write your e-mail" />
									<span>보내다</span>
								</div>
							</Box>
						</Stack>

						{/* RIGHT — Links + Social */}
						<Stack className="right" direction="row">
							{/* Information Column */}
							<Stack className="links-column">
								<strong>정보</strong>
								<span>회사 소개</span>
								<span>연락하다</span>
								<span>매상</span>
								<span>백화점</span>
							</Stack>

							{/* Online Store Column */}
							<Stack className="links-column">
								<strong>온라인 상점</strong>
								<span>배달 및 픽업</span>
								<span>지불</span>
								<span>환불-교환</span>
								<span>뉴스</span>
							</Stack>

							{/* Social Icons */}
							<Stack className="social-column">
								<div className="media-box">
									<InstagramIcon />
									<FacebookOutlinedIcon />
									<TelegramIcon />
									<TwitterIcon />
								</div>
							</Stack>
						</Stack>
					</Stack>

					{/* SECOND — Bottom Links */}
					<Stack className="second" direction="row" justifyContent="space-between">
						<span>제안 계약</span>
						<span>개인정보 처리방침</span>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default Footer;
