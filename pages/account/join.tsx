import React, { useCallback, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutHome from '../../libs/components/layout/LayoutHome';
import { Box, Button, Checkbox, FormControlLabel, FormGroup, Stack } from '@mui/material';
import { useRouter } from 'next/router';
import { logIn, signUp } from '../../libs/auth';
import { sweetMixinErrorAlert } from '../../libs/sweetAlert';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import CloseIcon from '@mui/icons-material/Close';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Join: NextPage = () => {
	const router = useRouter();
	const device = useDeviceDetect();
	const [input, setInput] = useState({ nick: '', password: '', phone: '', type: 'USER' });
	const [loginView, setLoginView] = useState<boolean>(true);

	/** HANDLERS **/
	const viewChangeHandler = (state: boolean) => {
		setLoginView(state);
	};

	const checkUserTypeHandler = (e: any) => {
		const checked = e.target.checked;
		if (checked) {
			const value = e.target.name;
			handleInput('type', value);
		} else {
			handleInput('type', 'USER');
		}
	};

	const handleInput = useCallback((name: any, value: any) => {
		setInput((prev) => {
			return { ...prev, [name]: value };
		});
	}, []);

	const doLogin = useCallback(async () => {
		console.warn(input);
		try {
			await logIn(input.nick, input.password);
			await router.push(`${router.query.referrer ?? '/'}`);
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		}
	}, [input]);

	const doSignUp = useCallback(async () => {
		console.warn(input);
		try {
			await signUp(input.nick, input.password, input.phone, input.type);
			await router.push(`${router.query.referrer ?? '/'}`);
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		}
	}, [input]);

	console.log('+input: ', input);

	if (device === 'mobile') {
		return <div>LOGIN MOBILE</div>;
	} else {
		return (
			<Stack id="pc-wrap">
				<Box className={'back-btn'} onClick={() => router.push('/')}>
					<CloseIcon />
				</Box>
				<Stack className={'join-page'}>
					<Stack className={'container'}>
						<Stack className={'main'}>
							{/* Left Side - Image */}
							<Stack className={'left'}>
								<Box className={'logo'}>
									<img src="/img/logo/logo.png" alt="OceanCraft" />
								</Box>
								<Box className={'visual-image'}>
									<img src="/img/banner/singupYacht.jpg" alt="Luxury Yacht" />
								</Box>
							</Stack>

							{/* Right Side - Form */}
							<Stack className={'right'}>
								{/* Info */}
								<Box className={'info'}>
									<span>{loginView ? 'Welcome Back' : 'Create an Account'}</span>
									<p>
										{loginView ? 'Dont have an account yet? ' : 'Already have an account? '}
										<b onClick={() => viewChangeHandler(!loginView)}>{loginView ? 'Sign Up' : 'Log In'}</b>
									</p>
								</Box>

								{/* Input Wrap */}
								<Box className={'input-wrap'}>
									<div className={'input-box'}>
										<span>Nickname</span>
										<input
											type="text"
											placeholder={'Enter Nickname'}
											onChange={(e) => handleInput('nick', e.target.value)}
											value={input.nick}
											required={true}
											onKeyDown={(event) => {
												if (event.key == 'Enter' && loginView) doLogin();
												if (event.key == 'Enter' && !loginView) doSignUp();
											}}
										/>
									</div>

									{!loginView && (
										<div className={'input-box'}>
											<span>Phone</span>
											<input
												type="text"
												placeholder={'Enter Phone'}
												onChange={(e) => handleInput('phone', e.target.value)}
												value={input.phone}
												required={true}
												onKeyDown={(event) => {
													if (event.key == 'Enter') doSignUp();
												}}
											/>
										</div>
									)}

									<div className={'input-box'}>
										<span>Password</span>
										<input
											type="password"
											placeholder={'Enter Password'}
											onChange={(e) => handleInput('password', e.target.value)}
											value={input.password}
											required={true}
											onKeyDown={(event) => {
												if (event.key == 'Enter' && loginView) doLogin();
												if (event.key == 'Enter' && !loginView) doSignUp();
											}}
										/>
									</div>
								</Box>

								{/* Register */}
								<Box className={'register'}>
									{!loginView && (
										<div className={'type-option'}>
											<span className={'text'}>I want to be registered as:</span>
											<div className={'type-cards'}>
												<div
													className={`type-card ${input.type === 'USER' ? 'active' : ''}`}
													onClick={() => handleInput('type', 'USER')}
												>
													<div className={'card-icon'}>👤</div>
													<div className={'card-title'}>User</div>
												</div>
												<div
													className={`type-card ${input.type === 'AGENT' ? 'active' : ''}`}
													onClick={() => handleInput('type', 'AGENT')}
												>
													<div className={'card-icon'}>🏢</div>
													<div className={'card-title'}>Business</div>
												</div>
											</div>
										</div>
									)}

									{loginView && (
										<div className={'remember-info'}>
											<FormGroup>
												<FormControlLabel control={<Checkbox defaultChecked size="small" />} label="Remember me" />
											</FormGroup>
										</div>
									)}

									{loginView ? (
										<Button variant="contained" disabled={input.nick == '' || input.password == ''} onClick={doLogin}>
											Log In
										</Button>
									) : (
										<Button
											variant="contained"
											disabled={input.nick == '' || input.password == '' || input.phone == '' || input.type == ''}
											onClick={doSignUp}
										>
											Create Account
										</Button>
									)}

									{!loginView && (
										<div className={'terms-info'}>
											<Checkbox size="small" defaultChecked />
											<span>
												I agree to the <b>Terms & Condition</b>
											</span>
										</div>
									)}
								</Box>

								{/* Ask Info - Social Login */}
								<Box className={'ask-info'}>
									<div className={'divider'}>
										<span>or</span>
									</div>

									<div className={'social-buttons'}>
										<button className={'social-btn google'}>
											<GoogleIcon />
											<span> Continue with Google </span>
										</button>
										<button className={'social-btn facebook'}>
											<FacebookIcon />
											<span>Continue with Facebook</span>
										</button>
									</div>
								</Box>
							</Stack>
						</Stack>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default Join;
