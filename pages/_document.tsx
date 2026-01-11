import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<meta name="robots" content="index,follow" />
				<link rel="icon" type="image/png" href="/img/logo/favicon.svg" />

				{/* SEO */}
				<meta name="keyword" content={'yacht, yachttour, jetski, mern, mern nestjs fullstack'} />
				<meta
					name={'description'}
					content={
						'Buy and rent yachts, jetskis, boats anywhere anytime Internationally. Live in your luxury dream life. Best Services and Events at Best prices on oceancraft.com | ' +
						'Покупайте и арендуйте яхты, гидроциклы, лодки в любое время и в любом месте по всему миру. Живите роскошной жизнью своей мечты. Лучшие услуги и мероприятия по лучшим ценам на oceancraft.com | ' +
						'요트, 제트스키, 보트를 언제 어디서든 전 세계에서 구매하고 렌트하세요. 꿈꿔왔던 럭셔리한 삶을 누려보세요. oceancraft.com에서 최고의 서비스와 이벤트를 최저가로 만나보세요. | ' +
						'Xalqaro miqyosda istalgan vaqtda istalgan joyda yaxtalar, jetskilar, qayiqlarni sotib oling va ijaraga oling. Hashamatli orzuingizdagi hayotda yashang. Oceancraft.com saytida eng yaxshi narxlarda eng yaxshi xizmatlar va tadbirlar.'
					}
				/>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
