import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<meta name="robots" content="index,follow" />
				<link rel="icon" type="image/png" href="/img/logo/logo.png" />

				{/* SEO */}
				<meta
					name="description"
					content="Buy and sell or rent yachts, jetskis, boats worldwide. Live your luxury dream life with Oceancraft."
				/>

				{/* Open Graph (Facebook, WhatsApp, LinkedIn) */}
				<meta property="og:type" content="website" />
				<meta property="og:title" content="Oceancraft | Luxury Yachts & Jetski Rentals" />
				<meta
					property="og:description"
					content="Buy and rent yachts, jetskis, boats anywhere anytime internationally."
				/>
				<meta property="og:url" content="https://ocean-marinecraft.com/" />
				<meta property="og:image" content="https://ocean-marinecraft.com/img/logo/logo.png" />
				<meta property="og:image:width" content="1200" />
				<meta property="og:image:height" content="630" />

				{/* Twitter */}
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content="Oceancraft | Luxury Yacht Rentals" />
				<meta name="twitter:description" content="Best yacht and jetski rental services worldwide." />
				<meta name="twitter:image" content="https://ocean-marinecraft.com/img/logo/logo.png" />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
