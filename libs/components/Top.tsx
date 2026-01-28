import React, { useCallback, useEffect, useRef } from 'react';
import { useState } from 'react';
import { useRouter, withRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { getJwtToken, logOut, updateUserInfo } from '../auth';
import { Stack, Box } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { alpha, styled } from '@mui/material/styles';
import Menu, { MenuProps } from '@mui/material/Menu';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { CaretDown } from 'phosphor-react';
import useDeviceDetect from '../hooks/useDeviceDetect';
import Link from 'next/link';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { Logout } from '@mui/icons-material';
import { REACT_APP_API_URL } from '../config';
import MenuIcon from '@mui/icons-material/Menu';
// Import these icons if not already imported
import SearchIcon from '@mui/icons-material/Search';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import NavbarAdCarousel from './common/NavbarAdCarousel';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';

const Top = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const { t, i18n } = useTranslation('common');
	const router = useRouter();
	const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
	const [lang, setLang] = useState<string | null>('en');
	const drop = Boolean(anchorEl2);
	const [colorChange, setColorChange] = useState(false);
	const [anchorEl, setAnchorEl] = React.useState<any | HTMLElement>(null);
	let open = Boolean(anchorEl);
	const [bgColor, setBgColor] = useState<boolean>(false);
	const [logoutAnchor, setLogoutAnchor] = React.useState<null | HTMLElement>(null);
	const logoutOpen = Boolean(logoutAnchor);
	const [showTopBanner, setShowTopBanner] = useState(true);

	/** LIFECYCLES **/
	useEffect(() => {
		if (localStorage.getItem('locale') === null) {
			localStorage.setItem('locale', 'en');
			setLang('en');
		} else {
			setLang(localStorage.getItem('locale'));
		}
	}, [router]);

	useEffect(() => {
		switch (router.pathname) {
			case '/product/detail':
				setBgColor(true);
				break;
			default:
				break;
		}
	}, [router]);

	useEffect(() => {
		const jwt = getJwtToken();
		if (jwt) updateUserInfo(jwt);
	}, []);

	/** HANDLERS **/
	const langClick = (e: any) => {
		setAnchorEl2(e.currentTarget);
	};

	const langClose = () => {
		setAnchorEl2(null);
	};

	const langChoice = useCallback(
		async (e: any) => {
			setLang(e.target.id);
			localStorage.setItem('locale', e.target.id);
			setAnchorEl2(null);
			await router.push(router.asPath, router.asPath, { locale: e.target.id });
		},
		[router],
	);

	const changeNavbarColor = () => {
		if (window.scrollY >= 50) {
			setColorChange(true);
		} else {
			setColorChange(false);
		}
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleHover = (event: any) => {
		if (anchorEl !== event.currentTarget) {
			setAnchorEl(event.currentTarget);
		} else {
			setAnchorEl(null);
		}
	};

	const StyledMenu = styled((props: MenuProps) => (
		<Menu
			elevation={0}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'right',
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
			{...props}
		/>
	))(({ theme }) => ({
		'& .MuiPaper-root': {
			top: '109px',
			borderRadius: 6,
			marginTop: theme.spacing(1),
			minWidth: 160,
			color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
			boxShadow:
				'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
			'& .MuiMenu-list': {
				padding: '4px 0',
			},
			'& .MuiMenuItem-root': {
				'& .MuiSvgIcon-root': {
					fontSize: 18,
					color: theme.palette.text.secondary,
					marginRight: theme.spacing(1.5),
				},
				'&:active': {
					backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
				},
			},
		},
	}));

	if (typeof window !== 'undefined') {
		window.addEventListener('scroll', changeNavbarColor);
	}

	if (device == 'mobile') {
		return (
			<Stack className={'top'}>
				<Link href={'/'}>
					<div>{t('Home')}</div>
				</Link>
				<Link href={'/product'}>
					<div>{t('Products')}</div>
				</Link>
				<Link href={'/events'}>
					<div> {t('Events')} </div>
				</Link>
				<Link href={'/about'}>
					<div> {t('About us')} </div>
				</Link>
				<Link href={'/cs'}>
					<div> {t('CS')} </div>
				</Link>
			</Stack>
		);
	} else {
		return (
			<Stack className={'navbar'}>
				{/* TOP BANNER - Closeable Ad Section */}
				{showTopBanner && (
					<Box className={'top-banner'}>
						<Box className={'banner-content'}>
							<img src="/img/banner/firstBanner.jpg" alt="Top Banner" />
						</Box>
						<button className={'close-banner-btn'} onClick={() => setShowTopBanner(false)}>
							<CloseIcon />
						</button>
					</Box>
				)}

				{/* TOP BAR - Login/MyPage + Language */}
				<Stack className={'top-bar'}>
					<Stack className={'top-bar-container'}>
						<Box className={'left-empty'}></Box>
						<Box className={'right-actions'}>
							{/* If user is NOT logged in */}
							{!user?._id ? (
								<>
									<Link href={'/account/join'}>
										<div className={'top-bar-item'}>
											<PersonIcon />
											<span>{t('Login')}</span>
										</div>
									</Link>
									<span className={'divider'}>|</span>
								</>
							) : (
								<>
									{/* If user IS logged in */}
									<Link href={'/mypage'}>
										<div className={'top-bar-item'}>
											<PersonIcon />
											<span>{t('My Page')}</span>
										</div>
									</Link>
									<span className={'divider'}>|</span>
									{user?._id && <NotificationsOutlinedIcon className={'notification-icon'} />}
									<span className={'divider'}>|</span>
								</>
							)}

							{/* Language Dropdown */}
							<Box className={'language-dropdown'}>
								<Button
									disableRipple
									className="btn-lang"
									onClick={langClick}
									endIcon={<CaretDown size={14} color="#616161" weight="fill" />}
								>
									<Box component={'div'} className={'flag'}>
										{lang !== null ? (
											<img src={`/img/flag/lang${lang}.png`} alt={'flag'} />
										) : (
											<img src={`/img/flag/langen.png`} alt={'flag'} />
										)}
									</Box>
								</Button>

								<StyledMenu anchorEl={anchorEl2} open={drop} onClose={langClose} sx={{ position: 'absolute' }}>
									<MenuItem disableRipple onClick={langChoice} id="en">
										<img
											className="img-flag"
											src={'/img/flag/langen.png'}
											onClick={langChoice}
											id="en"
											alt={'usaFlag'}
										/>
										{t('English')}
									</MenuItem>
									<MenuItem disableRipple onClick={langChoice} id="kr">
										<img
											className="img-flag"
											src={'/img/flag/langkr.png'}
											onClick={langChoice}
											id="kr"
											alt={'koreanFlag'}
										/>
										{t('Korean')}
									</MenuItem>
								</StyledMenu>
							</Box>
						</Box>
					</Stack>
				</Stack>

				{/* MAIN NAVBAR */}
				<Stack className={'navbar-main'}>
					<Stack className={'container'}>
						{/* Logo */}
						<Box className={'logo-section'}>
							<Link href={'/'}>
								<img src="/img/logo/logo.png" alt="OceanCraft" />
							</Link>
						</Box>

						{/* Search + Tabs */}
						<Box className={'search-section'}>
							<Box className={'search-wrapper'}>
								<input type="text" className={'search-input'} placeholder="search products , events" />
								<button className={'search-btn'}>
									<SearchIcon />
								</button>
							</Box>
							<Box className={'search-tabs'}>
								<Link href={'/about'}>
									<span className={'tab-item'}>회사 소개</span>
								</Link>
								<Link href={'/cs'}>
									<span className={'tab-item'}>{t('CS')}</span>
								</Link>
								<Link href={'/agent'}>
									<span className={'tab-item'}>{t('Agents')}</span>
								</Link>
								<Link href={'/contact'}>
									<span className={'tab-item'}>연락하다 </span>
								</Link>
							</Box>
						</Box>

						{/* Side Banner */}
						<Box className={'side-banner-section'}>
							<NavbarAdCarousel />
						</Box>
					</Stack>
				</Stack>

				{/* BOTTOM NAVIGATION */}
				<Stack className={'nav-bottom'}>
					<Stack className={'nav-container'}>
						<Button className={'category-btn'}>
							<MenuIcon />
							<span>View All</span>
						</Button>
						<Link href={'/product'}>
							<div className={'nav-item'}>{t('Products')}</div>
						</Link>
						<Link href={'/product'}>
							<div className={'nav-item'}>관공서 납품</div>
						</Link>
						<Link href={'/event'}>
							<div className={'nav-item'}>{t('Events')}</div>
						</Link>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default withRouter(Top);
