import type { ComponentType } from 'react';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import MenuList from '../admin/AdminMenuList';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { Menu, MenuItem, InputBase } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Badge from '@mui/material/Badge';
import { getJwtToken, logOut, updateUserInfo } from '../../auth';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { MemberType } from '../../enums/member.enum';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const drawerWidth = 260;

const withAdminLayout = (Component: ComponentType) => {
	return (props: object) => {
		const router = useRouter();
		const user = useReactiveVar(userVar);
		const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
		const [title, setTitle] = useState('admin');
		const [loading, setLoading] = useState(true);
		const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

		/** LIFECYCLES **/
		useEffect(() => {
			const jwt = getJwtToken();
			if (jwt) updateUserInfo(jwt);
			setLoading(false);
		}, []);

		useEffect(() => {
			if (!loading && user.memberType !== MemberType.ADMIN) {
				router.push('/').then();
			}
		}, [loading, user, router]);

		/** HANDLERS **/
		const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
			setAnchorElUser(event.currentTarget);
		};

		const handleCloseUserMenu = () => {
			setAnchorElUser(null);
		};

		const logoutHandler = () => {
			logOut();
			router.push('/').then();
		};

		if (!user || user?.memberType !== MemberType.ADMIN) return null;

		return (
			<main id="pc-wrap" className="admin-layout">
				<Box component={'div'} sx={{ display: 'flex', minHeight: '100vh', background: '#f8f9fa' }}>
					{/* Sidebar Drawer */}
					<Drawer
						sx={{
							width: drawerWidth,
							flexShrink: 0,
							'& .MuiDrawer-paper': {
								width: drawerWidth,
								boxSizing: 'border-box',
								background: '#4169e1',
								border: 'none',
								color: '#fff',
							},
						}}
						variant="permanent"
						anchor="left"
						className="admin-sidebar"
					>
						{/* Logo Section */}
						<Box className="sidebar-logo" sx={{ p: '24px 20px' }}>
							<Stack direction="row" alignItems="center" spacing={1}>
								<Typography variant="h5" component="h1" sx={{ fontWeight: 700, color: '#fff', fontSize: '24px' }}>
									Ocean<span style={{ fontWeight: 400 }}>Craft</span>
								</Typography>
							</Stack>
						</Box>

						{/* Navigation Menu */}
						<MenuList />
					</Drawer>

					{/* Main Content Area */}
					<Box
						component={'div'}
						sx={{
							flexGrow: 1,
							display: 'flex',
							flexDirection: 'column',
							width: `calc(100% - ${drawerWidth}px)`,
						}}
					>
						{/* Top Header */}
						<Box
							className="admin-header"
							sx={{
								background: '#fff',
								borderBottom: '1px solid #e8ebed',
								px: '32px',
								py: '16px',
								position: 'sticky',
								top: 0,
								zIndex: 100,
							}}
						>
							<Stack direction="row" alignItems="center" justifyContent="space-between">
								{/* Search Bar */}
								<Box
									sx={{
										display: 'flex',
										alignItems: 'center',
										background: '#f8f9fa',
										borderRadius: '8px',
										px: '16px',
										py: '8px',
										width: '400px',
										border: '1px solid #e8ebed',
									}}
								>
									<SearchIcon sx={{ color: '#94a3b8', mr: 1 }} />
									<InputBase
										placeholder="Search"
										sx={{
											flex: 1,
											fontSize: '14px',
											color: '#334155',
											'& ::placeholder': {
												color: '#94a3b8',
												opacity: 1,
											},
										}}
									/>
								</Box>

								{/* Right Side - Notifications, Language, User */}
								<Stack direction="row" alignItems="center" spacing={2}>
									{/* Notifications */}
									<IconButton sx={{ color: '#64748b' }}>
										<Badge badgeContent={4} color="error">
											<NotificationsNoneIcon />
										</Badge>
									</IconButton>

									{/* Language Selector */}
									<Stack
										direction="row"
										alignItems="center"
										spacing={1}
										sx={{
											cursor: 'pointer',
											px: '12px',
											py: '6px',
											borderRadius: '6px',
											'&:hover': {
												background: '#f8f9fa',
											},
										}}
									>
										<Box
											component="img"
											src="https://flagcdn.com/w40/gb.png"
											alt="English"
											sx={{ width: '24px', height: '16px', borderRadius: '2px' }}
										/>
										<Typography sx={{ fontSize: '14px', color: '#334155', fontWeight: 500 }}>English</Typography>
										<ExpandMoreIcon sx={{ fontSize: '20px', color: '#94a3b8' }} />
									</Stack>

									{/* User Profile */}
									<Tooltip title="Open settings">
										<Stack
											direction="row"
											alignItems="center"
											spacing={1.5}
											onClick={handleOpenUserMenu}
											sx={{
												cursor: 'pointer',
												px: '12px',
												py: '6px',
												borderRadius: '8px',
												'&:hover': {
													background: '#f8f9fa',
												},
											}}
										>
											<Avatar
												src={user?.memberImage ? `${user?.memberImage}` : '/img/profile/defaultUser.svg'}
												sx={{ width: 40, height: 40 }}
											/>
											<Box>
												<Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b', lineHeight: 1.2 }}>
													{user?.memberNick || 'Admin'}
												</Typography>
												<Typography variant="caption" sx={{ color: '#64748b', fontSize: '12px' }}>
													Admin
												</Typography>
											</Box>
											<ExpandMoreIcon sx={{ fontSize: '20px', color: '#94a3b8' }} />
										</Stack>
									</Tooltip>

									<Menu
										sx={{ mt: '45px' }}
										id="menu-appbar"
										anchorEl={anchorElUser}
										anchorOrigin={{
											vertical: 'top',
											horizontal: 'right',
										}}
										keepMounted
										transformOrigin={{
											vertical: 'top',
											horizontal: 'right',
										}}
										open={Boolean(anchorElUser)}
										onClose={handleCloseUserMenu}
										PaperProps={{
											sx: {
												boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
												borderRadius: '8px',
												mt: 1,
											},
										}}
									>
										<Box component={'div'} sx={{ width: '200px', py: 1 }}>
											<MenuItem onClick={logoutHandler} sx={{ px: 2, py: 1 }}>
												<Typography variant="body2">Logout</Typography>
											</MenuItem>
										</Box>
									</Menu>
								</Stack>
							</Stack>
						</Box>

						{/* Main Content */}
						<Box
							component={'div'}
							id="bunker"
							sx={{
								flexGrow: 1,
								p: '32px',
								background: '#f8f9fa',
								minHeight: 'calc(100vh - 80px)',
							}}
						>
							{/*@ts-ignore*/}
							<Component {...props} setSnackbar={setSnackbar} setTitle={setTitle} />
						</Box>
					</Box>
				</Box>
			</main>
		);
	};
};

export default withAdminLayout;
