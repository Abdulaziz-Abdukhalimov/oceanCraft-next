import React from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack, Box } from '@mui/material';
import Link from 'next/link';

interface AgentCardProps {
	agent: any;
}

const AgentCard = (props: AgentCardProps) => {
	const { agent } = props;
	const device = useDeviceDetect();
	const imagePath: string = agent?.memberImage ? `${agent?.memberImage}` : '/img/profile/defaultUser.svg';

	if (device === 'mobile') {
		return <div>AGENT CARD</div>;
	} else {
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
							Language: <strong>English , Korean </strong>
						</p>
					</Box>

					<Link
						href={{
							pathname: '/agent/detail',
							query: { agentId: agent?._id },
						}}
					>
						<button className={'view-profile-btn'}>View Profile</button>
					</Link>
				</Stack>
			</Stack>
		);
	}
};

export default AgentCard;
