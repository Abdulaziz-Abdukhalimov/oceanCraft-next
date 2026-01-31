import type { NextPage } from 'next';
import withAdminLayout from '../../libs/components/layout/LayoutAdmin';
import { useRouter } from 'next/router';
import { Box, Stack, Typography } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { GET_ALL_EVENTS_BY_ADMIN, GET_ALL_MEMBERS_BY_ADMIN, GET_ALL_PRODUCT_BY_ADMIN } from '../../apollo/admin/query';
import { useQuery } from '@apollo/client';

const AdminHome: NextPage = (props: any) => {
	const router = useRouter();

	// Products Query
	const { data: productsData } = useQuery(GET_ALL_PRODUCT_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: {
			input: {
				page: 1,
				limit: 10,
				search: {},
			},
		},
	});

	// Events Query
	const { data: eventsData } = useQuery(GET_ALL_EVENTS_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: {
			input: {
				page: 1,
				limit: 10,
				search: {},
			},
		},
	});

	// Members Query
	const { data: membersData } = useQuery(GET_ALL_MEMBERS_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: {
			input: {
				page: 1,
				limit: 10,
				search: {},
			},
		},
	});

	const productsTotal = productsData?.getAllProductsByAdmin?.metaCounter[0]?.total || 0;
	console.log('products:', productsTotal);
	const eventsTotal = eventsData?.getAllEventsByAdmin?.metaCounter[0]?.total || 0;
	const membersTotal = membersData?.getAllMembersByAdmin?.metaCounter[0]?.total || 0;

	return (
		<>
			<div className="admin-home">
				<Stack className="admin-home-wrap">
					<Typography className="dash-title">DASHBOARD</Typography>
					<Stack className="info-sec">
						<Box className="infos">
							<GroupIcon />
							<p>Total users</p>
							<Typography className="info">{membersTotal}</Typography>
						</Box>
						<Box className="infos">
							<QrCode2Icon />
							<p>Total Products</p>
							<Typography className="info">{productsTotal}</Typography>
						</Box>
						<Box className="infos">
							<EventAvailableIcon />
							<p>Total Events</p>
							<Typography className="info">{eventsTotal}</Typography>
						</Box>
					</Stack>

					<Stack className="admin-todo">
						<Typography sx={{ fontWeight: '600', fontSize: '20px' }}>MAIN TASKS</Typography>
						<Stack className="admin-tasks">
							<Box className="task">
								<Typography>accurate information at any given point.</Typography>
								<p className="task1">Must</p>
							</Box>
							<Box className="task">
								<Typography>Sharing information with clients and stakeholders</Typography>
								<p className="task1">Today</p>
							</Box>
							<Box className="task ">
								<Typography>Checking information and responding</Typography>
								<p className="task2">Flexible</p>
							</Box>
							<Box className="task ">
								<Typography>Checking content accuracy</Typography>
								<p className="task2">Flexibale</p>
							</Box>
							<Box className="task">
								<Typography>Editing products, events or related fields - banned to share </Typography>
								<p className="task1">Must</p>
							</Box>
						</Stack>
					</Stack>
				</Stack>
			</div>
		</>
	);
};

export default withAdminLayout(AdminHome);
