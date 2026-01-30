import React, { useEffect, useState } from 'react';
import { useRouter, withRouter } from 'next/router';
import Link from 'next/link';
import { List, ListItemButton, ListItemIcon, ListItemText, Collapse, Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import HeadsetMicOutlinedIcon from '@mui/icons-material/HeadsetMicOutlined';
import useDeviceDetect from '../../hooks/useDeviceDetect';

const AdminMenuList = (props: any) => {
	const router = useRouter();
	const device = useDeviceDetect();
	const [clickMenu, setClickMenu] = useState<any>([]);
	const [clickSubMenu, setClickSubMenu] = useState('');

	const {
		router: { pathname },
	} = props;

	const pathnames = pathname.split('/').filter((x: any) => x);

	/** LIFECYCLES **/
	useEffect(() => {
		switch (pathnames[1]) {
			case 'products':
				setClickMenu([]);
				break;
			case 'events':
				setClickMenu([]);
				break;
			case 'cs':
				setClickMenu(['CS']);
				break;
			default:
				setClickMenu([]);
				break;
		}

		switch (pathnames[2]) {
			case 'faq':
				setClickSubMenu('FAQ');
				break;
			case 'notice':
				setClickSubMenu('Notice');
				break;
			default:
				setClickSubMenu('');
				break;
		}
	}, [pathname]);

	/** HANDLERS **/
	const subMenuChangeHandler = (target: string) => {
		if (clickMenu.find((item: string) => item === target)) {
			setClickMenu(clickMenu.filter((menu: string) => target !== menu));
		} else {
			setClickMenu([...clickMenu, target]);
		}
	};

	const menu_set = [
		{
			title: 'Users',
			icon: <PeopleOutlineOutlinedIcon sx={{ fontSize: 20 }} />,
			url: '/_admin/users',
			hasSubmenu: false,
		},
		{
			title: 'Products',
			icon: <GridViewOutlinedIcon sx={{ fontSize: 20 }} />,
			url: '/_admin/products',
			hasSubmenu: false,
		},
		{
			title: 'Events',
			icon: <ForumOutlinedIcon sx={{ fontSize: 20 }} />,
			url: '/_admin/events',
			hasSubmenu: false,
		},
		{
			title: 'CS',
			icon: <HeadsetMicOutlinedIcon sx={{ fontSize: 20 }} />,
			on_click: () => subMenuChangeHandler('CS'),
			hasSubmenu: true,
		},
	];

	// Submenu only for CS
	const sub_menu_set: any = {
		CS: [
			{ title: 'FAQ', url: '/_admin/cs/faq' },
			{ title: 'Notice', url: '/_admin/cs/notice' },
		],
	};

	return (
		<Box className="admin-menu-container" sx={{ pt: 2 }}>
			{/* Main Menu Items */}
			<List disablePadding>
				{menu_set.map((item, index) => (
					<React.Fragment key={index}>
						{item.hasSubmenu ? (
							<>
								<ListItemButton
									onClick={item.on_click}
									className={clickMenu.includes(item.title) ? 'menu-item active' : 'menu-item'}
									sx={{
										px: '20px',
										py: '12px',
										color: 'rgba(255,255,255,0.7)',
										'&:hover': {
											background: 'rgba(255,255,255,0.1)',
											color: '#fff',
										},
										'&.active': {
											background: 'rgba(255,255,255,0.15)',
											color: '#fff',
										},
									}}
								>
									<ListItemIcon sx={{ minWidth: '36px', color: 'inherit' }}>{item.icon}</ListItemIcon>
									<ListItemText
										primary={item.title}
										primaryTypographyProps={{
											fontSize: '14px',
											fontWeight: 500,
										}}
									/>
									{clickMenu.includes(item.title) ? (
										<ExpandLess sx={{ fontSize: 20 }} />
									) : (
										<ExpandMore sx={{ fontSize: 20 }} />
									)}
								</ListItemButton>
								<Collapse in={clickMenu.includes(item.title)} timeout="auto" unmountOnExit>
									<List disablePadding>
										{sub_menu_set[item.title]?.map((sub: any, i: number) => (
											<Link href={sub.url} shallow={true} replace={true} key={i}>
												<ListItemButton
													className={clickSubMenu === sub.title ? 'submenu-item active' : 'submenu-item'}
													sx={{
														pl: '56px',
														py: '10px',
														color: 'rgba(255,255,255,0.6)',
														'&:hover': {
															background: 'rgba(255,255,255,0.08)',
															color: '#fff',
														},
														'&.active': {
															color: '#fff',
															background: 'rgba(255,255,255,0.12)',
														},
													}}
												>
													<Typography variant="body2" sx={{ fontSize: '13px' }}>
														{sub.title}
													</Typography>
												</ListItemButton>
											</Link>
										))}
									</List>
								</Collapse>
							</>
						) : (
							<Link href={item.url || '#'} shallow={true} replace={true}>
								<ListItemButton
									className={pathname === item.url ? 'menu-item active' : 'menu-item'}
									sx={{
										px: '20px',
										py: '12px',
										color: 'rgba(255,255,255,0.7)',
										'&:hover': {
											background: 'rgba(255,255,255,0.1)',
											color: '#fff',
										},
										'&.active': {
											background: 'rgba(255,255,255,0.15)',
											color: '#fff',
										},
									}}
								>
									<ListItemIcon sx={{ minWidth: '36px', color: 'inherit' }}>{item.icon}</ListItemIcon>
									<ListItemText
										primary={item.title}
										primaryTypographyProps={{
											fontSize: '14px',
											fontWeight: 500,
										}}
									/>
								</ListItemButton>
							</Link>
						)}
					</React.Fragment>
				))}
			</List>
		</Box>
	);
};

export default withRouter(AdminMenuList);
