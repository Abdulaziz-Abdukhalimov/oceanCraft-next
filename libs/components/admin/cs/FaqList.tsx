import React from 'react';
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
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/material';

interface Data {
	category: string;
	title: string;
	writer: string;
	date: string;
	status: string;
	id?: string;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

type Order = 'asc' | 'desc';

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
		label: 'CATEGORY',
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
		id: 'status',
		numeric: false,
		disablePadding: false,
		label: 'STATUS',
	},
];

const faqList = [
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

function EnhancedTableHead(props: EnhancedTableProps) {
	const { onSelectAllClick } = props;

	return (
		<TableHead>
			<TableRow>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						align={headCell.numeric ? 'left' : 'center'}
						padding={headCell.disablePadding ? 'none' : 'normal'}
						sx={{
							background: '#f8f9fa',
							borderBottom: '1px solid #e8ebed',
							padding: '16px 20px',
							fontSize: '12px',
							fontWeight: 600,
							color: '#64748b',
							textTransform: 'uppercase',
							letterSpacing: '0.5px',
						}}
					>
						{headCell.label}
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

interface FaqArticlesPanelListType {
	dense?: boolean;
	membersData?: any;
	searchMembers?: any;
	anchorEl?: any;
	handleMenuIconClick?: any;
	handleMenuIconClose?: any;
	generateMentorTypeHandle?: any;
}

export const FaqArticlesPanelList = (props: FaqArticlesPanelListType) => {
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
					<EnhancedTableHead />
					<TableBody>
						{faqList.map((ele: any, index: number) => {
							const member_image = '/img/profile/defaultUser.svg';

							let status_class_name = '';

							return (
								<TableRow
									hover
									sx={{
										borderBottom: '1px solid #e8ebed',
										transition: 'background 0.2s ease',
										'&:hover': {
											background: 'rgba(65, 105, 225, 0.02)',
										},
										'&:last-child': {
											borderBottom: 'none',
										},
									}}
								>
									{/* ID Column */}
									<TableCell
										align="left"
										sx={{
											padding: '16px 20px',
											fontSize: '14px',
											fontWeight: 600,
											color: '#64748b',
										}}
									>
										{ele.category}
									</TableCell>

									{/* Title Column with Image */}
									<TableCell align="left" sx={{ padding: '16px 20px' }}>
										<Typography
											sx={{
												fontWeight: 500,
												color: '#1e293b',
												fontSize: '14px',
											}}
										>
											{ele.title}
										</Typography>
									</TableCell>

									<TableCell
										align="center"
										sx={{
											padding: '16px 20px',
											fontSize: '14px',
											color: '#1e293b',
											fontWeight: 600,
										}}
									>
										{ele.writer}
									</TableCell>

									<TableCell
										align="center"
										sx={{
											padding: '16px 20px',
											fontSize: '14px',
											color: '#1e293b',
											fontWeight: 600,
										}}
									>
										{ele.date}
									</TableCell>

									{/* Agent Column */}
									<TableCell
										align="center"
										sx={{
											padding: '16px 20px',
											fontSize: '14px',
											color: '#64748b',
										}}
									>
										{ele.status}
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
