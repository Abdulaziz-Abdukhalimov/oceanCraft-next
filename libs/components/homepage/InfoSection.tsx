import { Stack, Box, Typography } from '@mui/material';
import { useTranslation } from 'next-i18next';

const InfoSection = () => {
	const { t, i18n } = useTranslation('common');

	return (
		<Stack className="footer-info">
			<Stack className="footer-grid" direction="row">
				{/* Notices */}
				<Stack className="footer-col">
					<Typography className="col-title">{t('Reflex × Samsung Card 24-month interest-free installment')}</Typography>
					<Typography className="col-item">{t('2025 Reflex Boat trade-in program')}</Typography>
					<Typography className="col-item">{t('2024 Jjuggapdaejeon special package')}</Typography>
					<Typography className="col-item">{t('SNS event announcement')}</Typography>
				</Stack>

				{/* Customer Center */}
				<Stack className="footer-col">
					<Typography className="col-title">{t('Customer Service')}</Typography>
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
