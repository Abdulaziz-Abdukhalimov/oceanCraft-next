import React, { useState } from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack, Box, Button } from '@mui/material';
import Link from 'next/link';
import { useMutation, useReactiveVar } from '@apollo/client';
import { SUBSCRIBE, UNSUBSCRIBE } from '../../../apollo/user/mutation';
import { userVar } from '../../../apollo/store';
import { sweetErrorHandling, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { Messages } from '../../config';

interface AgentCardProps {
	agent: any;
	refetch?: () => void;
}

const AgentCard = (props: AgentCardProps) => {
	const { agent, refetch } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const imagePath: string = agent?.memberImage ? `${agent?.memberImage}` : '/img/profile/defaultUser.svg';

	const [subscribe] = useMutation(SUBSCRIBE);
	const [unsubscribe] = useMutation(UNSUBSCRIBE);

	const handleFollowToggle = async (e: React.MouseEvent) => {
		e.preventDefault();

		try {
			if (!user._id) throw new Error(Messages.error2);
			if (user._id === agent._id) throw new Error('Cannot follow yourself!');

			const isCurrentlyFollowing = Array.isArray(agent?.meFollowed) && agent.meFollowed.length > 0;

			console.log('🔍 Agent meFollowed:', agent?.meFollowed);
			console.log('🔍 Is currently following?', isCurrentlyFollowing);

			if (isCurrentlyFollowing) {
				// Already following - so UNFOLLOW
				console.log('🔴 Unfollowing...');
				await unsubscribe({ variables: { input: agent._id } });
				await sweetTopSmallSuccessAlert('Unfollowed successfully', 800);
			} else {
				// Not following - so FOLLOW
				console.log('🟢 Following...');
				await subscribe({ variables: { input: agent._id } });
				await sweetTopSmallSuccessAlert('Followed successfully', 800);
			}

			// Force refetch to update UI
			if (refetch) {
				await refetch();
			}
		} catch (err: any) {
			console.error('❌ Follow error:', err);
			sweetErrorHandling(err);
		}
	};

	if (device === 'mobile') {
		return <div>AGENT CARD</div>;
	} else {
		const isFollowing = agent?.meFollowed?.[0]?.followingId === agent._id;

		return (
			<Stack className="agent-card">
				<Link
					href={{
						pathname: '/agent/detail',
						query: { agentId: agent?._id },
					}}
				>
					<Box className={'agent-avatar'}>
						<img src={imagePath} alt={agent?.memberFullName || agent?.memberNick} />
						{agent?.memberRank > 10 && (
							<Box className={'verified-badge'}>
								<img src="/img/profile/agent.png" alt="verified" />
								<span>VERIFIED</span>
							</Box>
						)}
					</Box>
				</Link>

				<Stack className={'agent-info'}>
					<Link
						href={{
							pathname: '/agent/detail',
							query: { agentId: agent?._id },
						}}
					>
						<h3>{agent?.memberFullName ?? agent?.memberNick}</h3>
					</Link>
					<p className={'agent-type'}>{agent?.memberType || 'COMPANY AGENT'}</p>

					<Box className={'agent-stats'}>
						<p>
							Products: <strong>{agent?.memberProducts || 0}</strong>
						</p>
						<p>
							Events: <strong>{agent?.memberEvents || 0}</strong>
						</p>
						<p>
							Language: <strong>English, Korean</strong>
						</p>
					</Box>

					<Stack direction="row" spacing={1} mt={2}>
						<Link
							href={{
								pathname: '/agent/detail',
								query: { agentId: agent?._id },
							}}
							style={{ flex: 1 }}
						>
							<button className={'view-profile-btn'} style={{ width: '100%' }}>
								View Profile
							</button>
						</Link>

						{user._id && user._id !== agent._id && (
							<Button
								variant={isFollowing ? 'outlined' : 'contained'}
								onClick={handleFollowToggle}
								className={isFollowing ? 'unfollow-btn' : 'follow-btn'}
								sx={{ flex: 1 }}
							>
								{isFollowing ? 'Unfollow' : 'Follow'}
							</Button>
						)}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default AgentCard;
