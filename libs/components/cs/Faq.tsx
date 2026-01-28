import React, { SyntheticEvent, useState } from 'react';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import { AccordionDetails, Box, Stack, Typography } from '@mui/material';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import { useRouter } from 'next/router';
import { styled } from '@mui/material/styles';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import HelpIcon from '@mui/icons-material/Help';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';

const Accordion = styled((props: AccordionProps) => <MuiAccordion disableGutters elevation={0} square {...props} />)(
	({ theme }) => ({
		border: `1px solid ${theme.palette.divider}`,
		'&:not(:last-child)': {
			borderBottom: 0,
		},
		'&:before': {
			display: 'none',
		},
	}),
);
const AccordionSummary = styled((props: AccordionSummaryProps) => (
	<MuiAccordionSummary expandIcon={<KeyboardArrowDownRoundedIcon sx={{ fontSize: '1.4rem' }} />} {...props} />
))(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : '#fff',
	'& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
		transform: 'rotate(180deg)',
	},
	'& .MuiAccordionSummary-content': {
		marginLeft: theme.spacing(1),
	},
}));

const Faq = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [category, setCategory] = useState<string>('equipment');
	const [expanded, setExpanded] = useState<string | false>('panel1');

	/** APOLLO REQUESTS **/
	/** LIFECYCLES **/

	/** HANDLERS **/
	const changeCategoryHandler = (category: string) => {
		setCategory(category);
	};

	const handleChange = (panel: string) => (event: SyntheticEvent, newExpanded: boolean) => {
		setExpanded(newExpanded ? panel : false);
	};

	const data: any = {
		equipment: [
			{
				id: '00f5a45ed8897f8090116a01',
				subject: 'Is the equipment listed on the site reliable?',
				content: 'Yes, all our water sports equipment is inspected, tested, and sourced from trusted suppliers.',
			},
			{
				id: '00f5a45ed8897f8090116a22',
				subject: 'What types of water sports equipment do you offer?',
				content: 'We offer jet skis, kayaks, paddle boards, snorkeling gear, wakeboards, and safety equipment.',
			},
			{
				id: '00f5a45ed8897f8090116a21',
				subject: 'How can I find the right equipment for my activity?',
				content: 'Use our filters to select activity type, skill level, duration, and availability.',
			},
			{
				id: '00f5a45ed8897f8090116a23',
				subject: 'Do you assist beginners?',
				content: 'Yes, our team helps beginners choose suitable equipment and provides basic guidance.',
			},
			{
				id: '00f5a45ed8897f8090116a24',
				subject: 'What should I consider before booking equipment?',
				content: 'Consider weather conditions, skill level, safety requirements, and activity duration.',
			},
			{
				id: '00f5a45ed8897f8090116a25',
				subject: 'How long does the booking process take?',
				content: 'Bookings usually take just a few minutes once availability is confirmed.',
			},
			{
				id: '00f5a45ed8897f8090116a29',
				subject: 'What if I face issues with the equipment?',
				content: 'Contact our support team immediately and we will resolve the issue or provide a replacement.',
			},
			{
				id: '00f5a45ed8897f8090116a28',
				subject: 'Do you offer equipment at different locations?',
				content: 'Yes, we offer equipment across multiple beaches and water sports centers.',
			},
			{
				id: '00f5a45ed8897f8090116a27',
				subject: 'Can I list my equipment on your platform?',
				content: 'Yes, approved partners can list their water sports equipment with us.',
			},
			{
				id: '00f5a45ed8897f8090116b99',
				subject: 'Do you provide safety instructions?',
				content: 'Yes, safety guidelines are provided with every booking, and instructors are available if needed.',
			},
		],

		payment: [
			{
				id: '00f5a45ed8897f8090116a02',
				subject: 'How can I make a payment?',
				content: 'Payments can be made online through our secure platform or via an on-site agent.',
			},
			{
				id: '00f5a45ed8897f8090116a91',
				subject: 'Are there any extra charges?',
				content: 'No hidden fees. All costs are clearly shown before you confirm your booking.',
			},
			{
				id: '00f5a45ed8897f8090116a92',
				subject: 'Do you offer installment payments?',
				content: 'Installment options may be available for group bookings or long-term rentals.',
			},
			{
				id: '00f5a45ed8897f8090116a93',
				subject: 'Is my payment information secure?',
				content: 'Yes, we use industry-standard encryption to protect your payment data.',
			},
			{
				id: '00f5a45ed8897f8090116a94',
				subject: 'Can I pay online?',
				content: 'Yes, online payments are fully supported through our secure checkout.',
			},
			{
				id: '00f5a45ed8897f8090116a95',
				subject: 'What if my payment fails?',
				content: 'If a payment issue occurs, please contact our support team for quick assistance.',
			},
			{
				id: '00f5a45ed8897f8090116a96',
				subject: 'Do you offer refunds?',
				content: 'Refunds depend on our cancellation policy and booking conditions.',
			},
			{
				id: '00f5a45ed8897f8090116a97',
				subject: 'Are there discounts or promotions?',
				content: 'Yes, we occasionally offer seasonal discounts and special promotions.',
			},
			{
				id: '00f5a45ed8897f8090116a99',
				subject: 'How long does payment processing take?',
				content: 'Most online payments are processed instantly.',
			},
			{
				id: '00f5a45ed8897f8090116a98',
				subject: 'Are there penalties for late payments?',
				content: 'Late payment penalties may apply depending on the booking terms.',
			},
		],

		participants: [
			{
				id: '00f5a45ed8897f8090116a03',
				subject: 'What should participants pay attention to?',
				content: 'Participants should ensure they meet safety and skill requirements for the activity.',
			},
			{
				id: '00f5a45ed8897f8090116a85',
				subject: 'Do I need prior experience?',
				content: 'Many activities are beginner-friendly, and instructors are available when needed.',
			},
			{
				id: '00f5a45ed8897f8090116a84',
				subject: 'What documents are required?',
				content: 'A valid ID may be required, and a waiver must be signed before participation.',
			},
			{
				id: '00f5a45ed8897f8090116a83',
				subject: 'What should I wear?',
				content: 'Comfortable swimwear is recommended. Safety gear is provided.',
			},
			{
				id: '00f5a45ed8897f8090116a82',
				subject: 'Can I cancel or reschedule?',
				content: 'Yes, cancellations and rescheduling depend on our booking policy.',
			},
			{
				id: '00f5a45ed8897f8090116a81',
				subject: 'Are there age restrictions?',
				content: 'Age restrictions vary by activity. Please check activity details.',
			},
			{
				id: '00f5a45ed8897f8090116a80',
				subject: 'Do you provide instructors?',
				content: 'Yes, certified instructors are available for guided activities.',
			},
			{
				id: '00f5a45ed8897f8090116a79',
				subject: 'How early should I arrive?',
				content: 'We recommend arriving at least 15 minutes before your scheduled time.',
			},
			{
				id: '00f5a45ed8897f8090116a78',
				subject: 'Why book through your platform?',
				content: 'We offer verified providers, competitive pricing, and customer support.',
			},
			{
				id: '00f5a45ed8897f8090116a77',
				subject: 'What if weather conditions are bad?',
				content: 'Activities may be rescheduled or refunded if weather conditions are unsafe.',
			},
		],

		agents: [
			{
				id: '00f5a45ed8897f8090116a04',
				subject: 'How can I become a water sports agent?',
				content: 'Review our terms and contact the admin to start the onboarding process.',
			},
			{
				id: '00f5a45ed8897f8090116a62',
				subject: 'What qualifications are required?',
				content: 'Relevant certifications, safety training, and local licensing may be required.',
			},
			{
				id: '00f5a45ed8897f8090116a63',
				subject: 'How do agents attract customers?',
				content: 'Provide excellent service, maintain equipment quality, and follow safety standards.',
			},
			{
				id: '00f5a45ed8897f8090116a64',
				subject: 'How can agents promote activities?',
				content: 'Use social media, platform listings, and customer reviews.',
			},
			{
				id: '00f5a45ed8897f8090116a65',
				subject: 'How do agents handle bookings?',
				content: 'Manage availability, confirm bookings promptly, and communicate clearly.',
			},
			{
				id: '00f5a45ed8897f8090116a66',
				subject: 'How can agents stay compliant?',
				content: 'Follow local maritime laws and platform safety guidelines.',
			},
			{
				id: '00f5a45ed8897f8090116a67',
				subject: 'How are customer issues handled?',
				content: 'Address concerns professionally and escalate to support when necessary.',
			},
			{
				id: '00f5a45ed8897f8090116a68',
				subject: 'What tools are available for agents?',
				content: 'Booking management, performance analytics, and customer communication tools.',
			},
			{
				id: '00f5a45ed8897f8090116a69',
				subject: 'Are agents required to follow safety protocols?',
				content: 'Yes, strict safety standards must be followed at all times.',
			},
			{
				id: '00f5a45ed8897f8090116a70',
				subject: 'How can agents grow their business?',
				content: 'Deliver great experiences, gain positive reviews, and expand activity offerings.',
			},
		],

		community: [
			{
				id: '00f5a45ed8897f8090116a06',
				subject: 'What if I see unsafe or abusive behavior?',
				content: 'Report it immediately to our admin team.',
			},
			{
				id: '00f5a45ed8897f8090116a44',
				subject: 'How can I join the community?',
				content: 'Create an account and participate in discussions.',
			},
			{
				id: '00f5a45ed8897f8090116a45',
				subject: 'Are there posting guidelines?',
				content: 'Yes, all members must follow our community rules.',
			},
			{
				id: '00f5a45ed8897f8090116a46',
				subject: 'How do I report spam?',
				content: 'Use the report feature or contact an admin.',
			},
			{
				id: '00f5a45ed8897f8090116a47',
				subject: 'Can I connect outside the platform?',
				content: 'Currently, communication is limited to the platform.',
			},
			{
				id: '00f5a45ed8897f8090116a48',
				subject: 'Can I share experiences?',
				content: 'Yes, sharing experiences and tips is encouraged.',
			},
			{
				id: '00f5a45ed8897f8090116a49',
				subject: 'How do I protect my privacy?',
				content: 'Avoid sharing personal or sensitive information.',
			},
			{
				id: '00f5a45ed8897f8090116a50',
				subject: 'How can I contribute positively?',
				content: 'Be respectful and helpful to other members.',
			},
			{
				id: '00f5a45ed8897f8090116a51',
				subject: 'What if I see incorrect information?',
				content: 'Politely correct it or report it.',
			},
			{
				id: '00f5a45ed8897f8090116a52',
				subject: 'Are there moderators?',
				content: 'Yes, our community is actively moderated.',
			},
		],
		membership: [
			{
				id: '00f5a45ed8897f8090116a05',
				subject: 'Do you have a membership service on your site?',
				content: 'membership service is not available on our site yet!',
			},
			{
				id: '00f5a45ed8897f8090116a60',
				subject: 'What are the benefits of becoming a member on your website?',
				content: 'We currently do not offer membership benefits, but stay tuned for updates on any future offerings.',
			},
			{
				id: '00f5a45ed8897f8090116a59',
				subject: 'Is there a fee associated with becoming a member?',
				content: 'As membership services are not available, there are no associated fees at this time.',
			},
			{
				id: '00f5a45ed8897f8090116a58',
				subject: 'Will membership provide access to exclusive content or features?',
				content: "We don't currently have membership-exclusive content or features.",
			},
			{
				id: '00f5a45ed8897f8090116a57',
				subject: 'How can I sign up for a membership on your site?',
				content: 'As of now, we do not have a sign-up process for memberships.',
			},
			{
				id: '00f5a45ed8897f8090116a56',
				subject: 'Do members receive discounts on property listings or services?',
				content: 'Membership discounts are not part of our current offerings.',
			},
			{
				id: '00f5a45ed8897f8090116a55',
				subject: 'Are there plans to introduce a membership program in the future?',
				content:
					"While we can't confirm any plans at this time, we're always exploring ways to enhance our services for users.",
			},
			{
				id: '00f5a45ed8897f8090116a54',
				subject: 'What kind of content or benefits can members expect if a membership program is introduced?',
				content: "We're evaluating potential benefits and features, but specifics are not available yet.",
			},
			{
				id: '00f5a45ed8897f8090116a33',
				subject: 'Do you offer a premium membership option on your platform?',
				content: 'Currently, we do not provide a premium membership option.',
			},
			{
				id: '00f5a45ed8897f8090116a32',
				subject: 'Will membership grant access to exclusive deals or discounts?',
				content: 'Membership perks, including deals or discounts, are not available at this time.',
			},
		],

		other: [
			{
				id: '00f5a45ed8897f8090116a40',
				subject: 'Can I buy this platform?',
				content: 'We currently have no plans to sell the platform.',
			},
			{
				id: '00f5a45ed8897f8090116a39',
				subject: 'Can I advertise my water sports services?',
				content: 'Advertising options are not available at the moment.',
			},
			{
				id: '00f5a45ed8897f8090116a38',
				subject: 'Do you offer sponsorships?',
				content: 'Sponsorship opportunities are not available currently.',
			},
			{
				id: '00f5a45ed8897f8090116a36',
				subject: 'Can I submit articles or blogs?',
				content: 'We are not accepting guest content at this time.',
			},
			{
				id: '00f5a45ed8897f8090116a35',
				subject: 'Do you have a referral program?',
				content: 'A referral program is not available currently.',
			},
			{
				id: '00f5a45ed8897f8090116a34',
				subject: 'Do you offer affiliate partnerships?',
				content: 'Affiliate partnerships are not offered at this time.',
			},
			{
				id: '00f5a45ed8897f8090116a33',
				subject: 'Do you sell merchandise?',
				content: 'Merchandise is not available for purchase.',
			},
			{
				id: '00f5a45ed8897f8090116a32',
				subject: 'Are there job opportunities?',
				content: 'We do not have open positions currently.',
			},
			{
				id: '00f5a45ed8897f8090116a31',
				subject: 'Do you host events or competitions?',
				content: 'Events and competitions are not hosted at this time.',
			},
			{
				id: '00f5a45ed8897f8090116a30',
				subject: 'Can I request custom features?',
				content: 'Custom feature requests are not accepted currently.',
			},
		],
	};

	if (device === 'mobile') {
		return <div>FAQ MOBILE</div>;
	} else {
		return (
			<Stack className={'faq-content'}>
				<Box className={'categories'} component={'div'}>
					<div
						className={category === 'equipment' ? 'active' : ''}
						onClick={() => {
							changeCategoryHandler('equipment');
						}}
					>
						Product
					</div>
					<div
						className={category === 'payment' ? 'active' : ''}
						onClick={() => {
							changeCategoryHandler('payment');
						}}
					>
						Payment
					</div>
					<div
						className={category === 'participants' ? 'active' : ''}
						onClick={() => {
							changeCategoryHandler('participants');
						}}
					>
						For Participantes
					</div>
					<div
						className={category === 'agents' ? 'active' : ''}
						onClick={() => {
							changeCategoryHandler('agents');
						}}
					>
						For Agents
					</div>
					<div
						className={category === 'membership' ? 'active' : ''}
						onClick={() => {
							changeCategoryHandler('membership');
						}}
					>
						Membership
					</div>
					<div
						className={category === 'community' ? 'active' : ''}
						onClick={() => {
							changeCategoryHandler('community');
						}}
					>
						Community
					</div>
					<div
						className={category === 'other' ? 'active' : ''}
						onClick={() => {
							changeCategoryHandler('other');
						}}
					>
						Other
					</div>
				</Box>
				<Box className={'wrap'} component={'div'}>
					{data[category] &&
						data[category].map((ele: any) => (
							<Accordion expanded={expanded === ele?.id} onChange={handleChange(ele?.id)} key={ele?.subject}>
								<AccordionSummary id="panel1d-header" className="question" aria-controls="panel1d-content">
									<HelpIcon className="badge" />
									<Typography> {ele?.subject}</Typography>
								</AccordionSummary>
								<AccordionDetails>
									<Stack className={'answer flex-box'}>
										<QuestionAnswerIcon className="badge" />
										<Typography> {ele?.content}</Typography>
									</Stack>
								</AccordionDetails>
							</Accordion>
						))}
				</Box>
			</Stack>
		);
	}
};

export default Faq;
