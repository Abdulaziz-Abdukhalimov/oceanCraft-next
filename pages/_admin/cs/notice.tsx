import React, { useState } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { Box, Button, InputAdornment, Stack } from '@mui/material';
import { List, ListItem } from '@mui/material';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { TabContext } from '@mui/lab';
import OutlinedInput from '@mui/material/OutlinedInput';
import TablePagination from '@mui/material/TablePagination';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { NoticeList } from '../../../libs/components/admin/cs/NoticeList';

const AdminNotice: NextPage = (props: any) => {
	const [anchorEl, setAnchorEl] = useState<[] | HTMLElement[]>([]);

	/** APOLLO REQUESTS **/
	/** LIFECYCLES **/
	/** HANDLERS **/

	return (
		// @ts-ignore
		<Box component={'div'} className={'content'}>
			<Box component={'div'} className={'title flex_space'}>
				<Typography variant={'h2'}>Notice Management</Typography>
			</Box>
			<Box component={'div'} className={'table-wrap'}>
				<Box component={'div'} sx={{ width: '100%', typography: 'body1' }}>
					<TabContext value={'value'}>
						<Box component={'div'}>
							<Select
								size="small"
								displayEmpty
								sx={{
									minWidth: 160,
									borderRadius: '8px',
									marginTop: '40px',
									marginBottom: '20px',
									fontSize: '14px',
									'& .MuiOutlinedInput-notchedOutline': {
										borderColor: '#e8ebed',
									},
								}}
							>
								<MenuItem value="all"> Filter by</MenuItem>

								<MenuItem>Active</MenuItem>
								<MenuItem>Published</MenuItem>
								<MenuItem>Draft</MenuItem>
							</Select>
							<Divider />
						</Box>
						<NoticeList
							// dense={dense}
							// membersData={membersData}
							// searchMembers={searchMembers}
							anchorEl={anchorEl}
							// handleMenuIconClick={handleMenuIconClick}
							// handleMenuIconClose={handleMenuIconClose}
							// generateMentorTypeHandle={generateMentorTypeHandle}
						/>

						<TablePagination
							rowsPerPageOptions={[20, 40, 60]}
							component="div"
							count={4}
							rowsPerPage={10}
							page={1}
							onPageChange={() => {}}
							onRowsPerPageChange={() => {}}
						/>
					</TabContext>
				</Box>
			</Box>
		</Box>
	);
};

export default withAdminLayout(AdminNotice);
