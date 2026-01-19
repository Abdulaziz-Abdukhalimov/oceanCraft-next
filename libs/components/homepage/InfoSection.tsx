import { Stack, Box, Typography } from '@mui/material';

const InfoSection = () => {
	return (
		<Stack className="footer-info">
			<Stack className="footer-grid" direction="row">
				{/* Notices */}
				<Stack className="footer-col">
					<Typography className="col-title">공지사항</Typography>
					<Typography className="col-item">리플렉스 X 삼성카드 24개월 무이자</Typography>
					<Typography className="col-item">2025 리플렉스보트 보상판매</Typography>
					<Typography className="col-item">2024 쭈갑대전 특별패키지</Typography>
					<Typography className="col-item">SNS 이벤트 안내</Typography>
				</Stack>

				{/* Customer Center */}
				<Stack className="footer-col">
					<Typography className="col-title">고객센터</Typography>
					<Typography className="highlight">001-000-0101</Typography>
					<Typography className="col-desc">영업시간: 08:30 ~ 18:30</Typography>
					<Typography className="col-desc">월~금 (공휴일 휴무)</Typography>
				</Stack>

				{/* Bank Info */}
				<Stack className="footer-col">
					<Typography className="col-title">입금계좌안내</Typography>
					<Typography className="highlight">777-0707-0707-07</Typography>
					<Typography className="col-desc">부산</Typography>
					<Typography className="col-desc">예금주: 주식회사 오션크래프트</Typography>
				</Stack>

				{/* Delivery */}
				<Stack className="footer-col promo">
					<Typography className="promo-title">5만원 이상 구매시</Typography>
					<Stack
						style={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'space-evenly',
							paddingTop: '10px',
							paddingBottom: '8px',
						}}
					>
						<Typography className="promo-highlight">무료배송</Typography>
						<img src="/img/icons/ft_icon03.png" style={{ width: '74px', height: '43px' }} />
					</Stack>
					<Typography className="promo-desc">일부품목 / 도서산간 제외</Typography>
				</Stack>
			</Stack>

			{/* Bottom Links */}
			<Stack className="footer-bottom" direction="row" spacing={2}>
				<Typography>회사소개</Typography>
				<Typography>이용안내</Typography>
				<Typography className="bold">개인정보처리방침</Typography>
				<Typography>이용약관</Typography>
				<Typography>고객센터</Typography>
			</Stack>
		</Stack>
	);
};

export default InfoSection;
