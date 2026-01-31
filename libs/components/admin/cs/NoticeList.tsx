import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
	TableCell,
	TableHead,
	TableBody,
	TableRow,
	Table,
	TableContainer,
	Button,
	Menu,
	Fade,
	MenuItem,
	Box,
	Checkbox,
	Toolbar,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { IconButton, Tooltip } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/material';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { NotePencil } from 'phosphor-react';

type Order = 'asc' | 'desc';

interface Data {
	category: string;
	title: string;
	id: string;
	writer: string;
	date: string;
	view: number;
	action: string;
}
interface HeadCell {
	disablePadding: boolean;
	id: keyof Data;
	label: string;
	numeric: boolean;
}

const headCells: readonly HeadCell[] = [
	{
		id: 'category',
		numeric: true,
		disablePadding: false,
		label: 'Category',
	},
	{
		id: 'title',
		numeric: true,
		disablePadding: false,
		label: 'TITLE',
	},
	{
		id: 'writer',
		numeric: true,
		disablePadding: false,
		label: 'WRITER',
	},
	{
		id: 'date',
		numeric: true,
		disablePadding: false,
		label: 'DATE',
	},
	{
		id: 'view',
		numeric: true,
		disablePadding: false,
		label: 'VIEW',
	},
	{
		id: 'action',
		numeric: false,
		disablePadding: false,
		label: 'ACTION',
	},
];

const noticeList = [
	{
		category: 'General',
		title: 'What is this platform about?',
		writer: 'Admin',
		date: '2025-01-05',
		status: 'Published',
	},
	{
		category: 'Account',
		title: 'How do I reset my password?',
		writer: 'Support Team',
		date: '2025-01-10',
		status: 'Published',
	},
	{
		category: 'Billing',
		title: 'What payment methods are accepted?',
		writer: 'Finance Team',
		date: '2025-01-12',
		status: 'Draft',
	},
	{
		category: 'Technical',
		title: 'Why can’t I log into my account?',
		writer: 'Tech Support',
		date: '2025-01-15',
		status: 'Published',
	},
	{
		category: 'Account',
		title: 'How do I change my email address?',
		writer: 'Admin',
		date: '2025-01-18',
		status: 'Published',
	},
	{
		category: 'Billing',
		title: 'Can I get a refund?',
		writer: 'Finance Team',
		date: '2025-01-20',
		status: 'Archived',
	},
	{
		category: 'General',
		title: 'Is my data secure?',
		writer: 'Security Team',
		date: '2025-01-22',
		status: 'Published',
	},
	{
		category: 'Technical',
		title: 'Which browsers are supported?',
		writer: 'Tech Team',
		date: '2025-01-25',
		status: 'Published',
	},
	{
		category: 'Account',
		title: 'How do I delete my account?',
		writer: 'Support Team',
		date: '2025-01-28',
		status: 'Draft',
	},
	{
		category: 'General',
		title: 'How can I contact support?',
		writer: 'Admin',
		date: '2025-01-30',
		status: 'Published',
	},
];

interface EnhancedTableProps {
	numSelected: number;
	onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
	onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
	order: Order;
	orderBy: string;
	rowCount: number;
}

interface EnhancedTableToolbarProps {
	numSelected: number;
	onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
	onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
	order: Order;
	orderBy: string;
	rowCount: number;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
	const [select, setSelect] = useState('');
	const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;

	return (
		<>
			{numSelected > 0 ? (
				<>
					<Toolbar>
						<Box component={'div'}>
							<Box component={'div'} className="flex_box">
								<Checkbox
									color="primary"
									indeterminate={numSelected > 0 && numSelected < rowCount}
									checked={rowCount > 0 && numSelected === rowCount}
									onChange={onSelectAllClick}
									inputProps={{
										'aria-label': 'select all',
									}}
								/>
								<Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="h6" component="div">
									{numSelected} selected
								</Typography>
							</Box>
							<Button variant={'text'} size={'large'}>
								Delete
							</Button>
						</Box>
					</Toolbar>
				</>
			) : (
				<TableHead>
					<TableRow>
						<TableCell padding="checkbox">
							<Checkbox
								color="primary"
								indeterminate={numSelected > 0 && numSelected < rowCount}
								checked={rowCount > 0 && numSelected === rowCount}
								onChange={onSelectAllClick}
								inputProps={{
									'aria-label': 'select all',
								}}
							/>
						</TableCell>
						{headCells.map((headCell) => (
							<TableCell
								key={headCell.id}
								align={headCell.numeric ? 'left' : 'right'}
								padding={headCell.disablePadding ? 'none' : 'normal'}
							>
								{headCell.label}
							</TableCell>
						))}
					</TableRow>
				</TableHead>
			)}
			{numSelected > 0 ? null : null}
		</>
	);
};

interface NoticeListType {
	dense?: boolean;
	membersData?: any;
	searchMembers?: any;
	anchorEl?: any;
	handleMenuIconClick?: any;
	handleMenuIconClose?: any;
	generateMentorTypeHandle?: any;
}

export const NoticeList = (props: NoticeListType) => {
	const {
		dense,
		membersData,
		searchMembers,
		anchorEl,
		handleMenuIconClick,
		handleMenuIconClose,
		generateMentorTypeHandle,
	} = props;
	const router = useRouter();

	/** APOLLO REQUESTS **/
	/** LIFECYCLES **/
	/** HANDLERS **/

	return (
		<Stack>
			<TableContainer>
				<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={dense ? 'small' : 'medium'}>
					{/*@ts-ignore*/}
					<EnhancedTableToolbar />
					<TableBody>
						{noticeList.map((ele: any, index: number) => {
							const member_image = '/img/profile/defaultUser.svg';

							return (
								<TableRow hover key={'member._id'} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
									<TableCell padding="checkbox">
										<Checkbox color="primary" />
									</TableCell>
									<TableCell align="left">{ele.category}</TableCell>
									<TableCell align="left">{ele.title}</TableCell>
									<TableCell align="left">{ele.writer}</TableCell>
									<TableCell align="left">{ele.date}</TableCell>
									<TableCell align="left">{ele.status}</TableCell>
									<TableCell align="right">
										<Tooltip title={'delete'}>
											<IconButton>
												<DeleteRoundedIcon />
											</IconButton>
										</Tooltip>
										<Tooltip title="edit">
											<IconButton onClick={() => router.push(`/_admin/cs/notice_create?id=notice._id`)}>
												<NotePencil size={24} weight="fill" />
											</IconButton>
										</Tooltip>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</TableContainer>
		</Stack>
	);
};
