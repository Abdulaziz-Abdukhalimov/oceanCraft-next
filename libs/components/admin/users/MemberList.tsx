import React, { useState } from 'react';
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
	Select,
	Box,
	Stack,
	Typography,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Member } from '../../../types/member/member';
import { REACT_APP_API_URL } from '../../../config';
import { MemberStatus, MemberType } from '../../../enums/member.enum';

interface Data {
	id: string;
	nickname: string;
	fullname: string;
	phone: string;
	type: string;
	state: string;
	warning: string;
	block: string;
}

interface HeadCell {
	disablePadding: boolean;
	id: keyof Data;
	label: string;
	numeric: boolean;
}

const headCells: readonly HeadCell[] = [
	{
		id: 'id',
		numeric: true,
		disablePadding: false,
		label: 'MB ID',
	},
	{
		id: 'nickname',
		numeric: true,
		disablePadding: false,
		label: 'NAME',
	},
	{
		id: 'phone',
		numeric: true,
		disablePadding: false,
		label: 'PHONE NUM',
	},
	{
		id: 'type',
		numeric: false,
		disablePadding: false,
		label: 'MEMBER TYPE',
	},
	{
		id: 'warning',
		numeric: false,
		disablePadding: false,
		label: 'WARNING',
	},
	{
		id: 'block',
		numeric: false,
		disablePadding: false,
		label: 'BLOCK CRIMES',
	},
	{
		id: 'state',
		numeric: false,
		disablePadding: false,
		label: 'STATE',
	},
];

function EnhancedTableHead() {
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

interface MemberPanelListType {
	members: Member[];
	anchorEl: any;
	menuIconClickHandler: any;
	menuIconCloseHandler: any;
	updateMemberHandler: any;
}

export const MemberPanelList = (props: MemberPanelListType) => {
	const { members, anchorEl, menuIconClickHandler, menuIconCloseHandler, updateMemberHandler } = props;

	const [filterDate, setFilterDate] = useState('All Dates');
	const [filterType, setFilterType] = useState('all');
	const [filterStatus, setFilterStatus] = useState('all');

	const handleResetFilter = () => {
		setFilterDate('All Dates');
		setFilterType('all');
		setFilterStatus('all');
	};

	const filteredMembers = members.filter((member) => {
		if (filterType !== 'all' && member.memberType !== filterType) {
			return false;
		}

		if (filterStatus !== 'all' && member.memberStatus !== filterStatus) {
			return false;
		}

		return true;
	});

	const getStatusBadgeClass = (status: string) => {
		switch (status) {
			case MemberStatus.ACTIVE:
				return 'status-badge completed';
			case MemberStatus.BLOCK:
				return 'status-badge rejected';
			case MemberStatus.DELETE:
				return 'status-badge rejected';
			default:
				return 'status-badge processing';
		}
	};

	const getTypeBadgeClass = (type: string) => {
		switch (type) {
			case MemberType.USER:
				return 'status-badge processing';
			case MemberType.AGENT:
				return 'status-badge completed';
			case MemberType.ADMIN:
				return 'status-badge pending';
			default:
				return 'status-badge';
		}
	};

	return (
		<Box className="member-list-container fade-in">
			<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
				<Typography sx={{ color: '#64748b', fontSize: '14px' }}>
					Showing {filteredMembers.length} of {members.length} members
				</Typography>
			</Stack>

			{/* Filter Section */}
			<Box className="filter-section" sx={{ mb: 3 }}>
				<Box className="filter-label">
					<FilterListIcon />
					<Typography sx={{ fontWeight: 600, fontSize: '14px' }}>Filter By</Typography>
				</Box>

				<Select
					value={filterDate}
					onChange={(e) => setFilterDate(e.target.value)}
					size="small"
					sx={{
						minWidth: 160,
						borderRadius: '8px',
						fontSize: '14px',
						'& .MuiOutlinedInput-notchedOutline': {
							borderColor: '#e8ebed',
						},
					}}
				>
					<MenuItem value="All Dates">All Dates</MenuItem>
					<MenuItem value="Today">Today</MenuItem>
					<MenuItem value="This Week">This Week</MenuItem>
					<MenuItem value="This Month">This Month</MenuItem>
				</Select>

				<Select
					value={filterType}
					onChange={(e) => setFilterType(e.target.value)}
					size="small"
					displayEmpty
					sx={{
						minWidth: 160,
						borderRadius: '8px',
						fontSize: '14px',
						'& .MuiOutlinedInput-notchedOutline': {
							borderColor: '#e8ebed',
						},
					}}
				>
					<MenuItem value="all">Member Type</MenuItem>
					<MenuItem value={MemberType.USER}>USER</MenuItem>
					<MenuItem value={MemberType.AGENT}>AGENT</MenuItem>
					<MenuItem value={MemberType.ADMIN}>ADMIN</MenuItem>
				</Select>

				<Select
					value={filterStatus}
					onChange={(e) => setFilterStatus(e.target.value)}
					size="small"
					displayEmpty
					sx={{
						minWidth: 160,
						borderRadius: '8px',
						fontSize: '14px',
						'& .MuiOutlinedInput-notchedOutline': {
							borderColor: '#e8ebed',
						},
					}}
				>
					<MenuItem value="all">Member Status</MenuItem>
					<MenuItem value={MemberStatus.ACTIVE}>ACTIVE</MenuItem>
					<MenuItem value={MemberStatus.BLOCK}>BLOCK</MenuItem>
					<MenuItem value={MemberStatus.DELETE}>DELETE</MenuItem>
				</Select>

				<Box className="reset-filter" onClick={handleResetFilter}>
					<RefreshIcon />
					<Typography sx={{ fontSize: '14px', fontWeight: 500 }}>Reset Filter</Typography>
				</Box>
			</Box>

			{/* Members Table */}
			<TableContainer className="admin-table">
				<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'medium'}>
					<EnhancedTableHead />
					<TableBody>
						{filteredMembers.length === 0 && (
							<TableRow>
								<TableCell align="center" colSpan={7} sx={{ py: 6 }}>
									<Typography sx={{ color: '#94a3b8', fontSize: '14px' }}>No data found!</Typography>
								</TableCell>
							</TableRow>
						)}

						{filteredMembers.length !== 0 &&
							filteredMembers.map((member: Member, index: number) => {
								const member_image = member.memberImage ? `${member.memberImage}` : '/img/profile/defaultUser.svg';
								return (
									<TableRow
										hover
										key={member?._id}
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
											{member._id}
										</TableCell>

										{/* Name Column with Avatar */}
										<TableCell align="left" sx={{ padding: '16px 20px' }}>
											<Stack direction={'row'} alignItems="center" spacing={1.5}>
												<Avatar alt={member.memberNick} src={member_image} sx={{ width: 40, height: 40 }} />
												<Typography
													sx={{
														fontWeight: 500,
														color: '#1e293b',
														fontSize: '14px',
														cursor: 'pointer',
														'&:hover': {
															color: '#4169e1',
														},
													}}
												>
													{member.memberNick}
												</Typography>
											</Stack>
										</TableCell>

										{/* Phone Column */}
										<TableCell
											align="left"
											sx={{
												padding: '16px 20px',
												fontSize: '14px',
												color: '#64748b',
											}}
										>
											{member.memberPhone}
										</TableCell>

										{/* Member Type Column */}
										<TableCell align="center" sx={{ padding: '16px 20px' }}>
											<Button
												onClick={(e: any) => menuIconClickHandler(e, index)}
												className={getTypeBadgeClass(member.memberType)}
												sx={{
													minWidth: '100px',
													textTransform: 'capitalize',
													cursor: 'pointer',
													border: 'none',
													'&:hover': {
														opacity: 0.8,
													},
												}}
											>
												{member.memberType}
											</Button>

											<Menu
												className={'menu-modal'}
												MenuListProps={{
													'aria-labelledby': 'fade-button',
												}}
												anchorEl={anchorEl[index]}
												open={Boolean(anchorEl[index])}
												onClose={menuIconCloseHandler}
												TransitionComponent={Fade}
												PaperProps={{
													sx: {
														boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
														borderRadius: '8px',
														mt: 1,
													},
												}}
											>
												{Object.values(MemberType)
													.filter((ele) => ele !== member?.memberType)
													.map((type: string) => (
														<MenuItem
															onClick={() => updateMemberHandler({ _id: member._id, memberType: type })}
															key={type}
															sx={{ px: 2, py: 1 }}
														>
															<Typography variant={'subtitle1'} component={'span'} sx={{ fontSize: '14px' }}>
																{type}
															</Typography>
														</MenuItem>
													))}
											</Menu>
										</TableCell>

										{/* Warning Column */}
										<TableCell
											align="center"
											sx={{
												padding: '16px 20px',
												fontSize: '14px',
												color: '#1e293b',
												fontWeight: 500,
											}}
										>
											{member.memberWarnings}
										</TableCell>

										{/* Block Crimes Column */}
										<TableCell
											align="center"
											sx={{
												padding: '16px 20px',
												fontSize: '14px',
												color: '#1e293b',
												fontWeight: 500,
											}}
										>
											{member.memberBlocks}
										</TableCell>

										{/* Status Column */}
										<TableCell align="center" sx={{ padding: '16px 20px' }}>
											<Button
												onClick={(e: any) => menuIconClickHandler(e, member._id)}
												className={getStatusBadgeClass(member.memberStatus)}
												sx={{
													minWidth: '100px',
													textTransform: 'capitalize',
													cursor: 'pointer',
													border: 'none',
													'&:hover': {
														opacity: 0.8,
													},
												}}
											>
												{member.memberStatus}
											</Button>

											<Menu
												className={'menu-modal'}
												MenuListProps={{
													'aria-labelledby': 'fade-button',
												}}
												anchorEl={anchorEl[member._id]}
												open={Boolean(anchorEl[member._id])}
												onClose={menuIconCloseHandler}
												TransitionComponent={Fade}
												PaperProps={{
													sx: {
														boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
														borderRadius: '8px',
														mt: 1,
													},
												}}
											>
												{Object.values(MemberStatus)
													.filter((ele: string) => ele !== member?.memberStatus)
													.map((status: string) => (
														<MenuItem
															onClick={() => updateMemberHandler({ _id: member._id, memberStatus: status })}
															key={status}
															sx={{ px: 2, py: 1 }}
														>
															<Typography variant={'subtitle1'} component={'span'} sx={{ fontSize: '14px' }}>
																{status}
															</Typography>
														</MenuItem>
													))}
											</Menu>
										</TableCell>
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	);
};
