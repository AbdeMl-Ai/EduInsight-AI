'use client';

import { Suspense, useEffect, useRef, useState, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Apple, Eye, EyeOff, GraduationCap, LoaderCircle, LockKeyhole, Mail } from 'lucide-react';
import axios from 'axios';
import client from '@/lib/axios';
import { api as sessionApi, type LoginResponse } from '@/lib/api';
import { getRoleFromToken } from '@/lib/auth-token';
import { getDashboardPath, useAuth } from '@/components/app/AuthProvider';
import LoadingScreen from '@/components/app/LoadingScreen';
import ThemeToggle from '@/components/app/ThemeToggle';

function LoginPageContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { session, isReady } = useAuth();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState('');
	const [notice, setNotice] = useState('');
	const [redirectTarget, setRedirectTarget] = useState<{
		path: string;
		token: string;
	} | null>(null);
	const callbackHandledRef = useRef(false);
	const completingLoginRef = useRef(false);
	const navigationStartedRef = useRef(false);

	useEffect(() => {
		if (callbackHandledRef.current) return;
		const queryToken = searchParams.get('access_token');
		const authFragment = new URLSearchParams(window.location.hash.slice(1));
		const accessToken = queryToken ?? authFragment.get('access_token');
		if (!accessToken) return;
		callbackHandledRef.current = true;

		const role = getRoleFromToken(accessToken);
		const suppliedRole =
			searchParams.get('role') ?? authFragment.get('role');
		const tokenType =
			searchParams.get('token_type') ??
			authFragment.get('token_type') ??
			'bearer';

		if (!role || (suppliedRole && suppliedRole !== role)) {
			sessionApi.logout();
			window.history.replaceState(null, '', window.location.pathname);
			setError('We could not verify the role for this sign-in. Please try again.');
			return;
		}

		const session = {
			access_token: accessToken,
			token_type: tokenType,
			role: role as LoginResponse['role'],
		};
		sessionApi.saveSession(session);
		completingLoginRef.current = true;
		setRedirectTarget({ path: getDashboardPath(role), token: accessToken });
	}, [searchParams]);

	useEffect(() => {
		const hasOAuthCallback =
			searchParams.has('access_token') ||
			new URLSearchParams(window.location.hash.slice(1)).has('access_token');
		if (
			isReady &&
			session &&
			!hasOAuthCallback &&
			!completingLoginRef.current &&
			!navigationStartedRef.current
		) {
			navigationStartedRef.current = true;
			router.replace(getDashboardPath(session.role));
		}
	}, [isReady, router, searchParams, session]);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError('');
		setNotice('');
		setSubmitting(true);
		try {
			const form = new URLSearchParams({ username: email.trim(), password });
			const { data } = await client.post<LoginResponse>('/auth/login', form, {
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			});
			const verifiedRole = getRoleFromToken(data.access_token);
			if (
				!['student', 'user', 'teacher', 'admin'].includes(data.role) ||
				verifiedRole !== data.role
			) {
				setError('This account does not have a supported dashboard role. Contact your administrator.');
				return;
			}
			sessionApi.saveSession(data);
			completingLoginRef.current = true;
			setRedirectTarget({
				path: getDashboardPath(verifiedRole),
				token: data.access_token,
			});
		} catch (requestError) {
			if (axios.isAxiosError(requestError)) {
				const detail = requestError.response?.data?.detail;
				setError(typeof detail === 'string' ? detail : 'We could not sign you in. Check your details and try again.');
			} else {
				setError('We could not sign you in. Please try again.');
			}
		} finally {
			setSubmitting(false);
		}
	}

	function startGoogleSignIn() {
		sessionApi.startGoogleSignIn();
	}

	return (
		<>
			<main className="login-shell min-h-dvh bg-[#0a0a0a] text-[#f5f2e9] md:grid md:grid-cols-[1.05fr_0.95fr]">
			<div className="fixed right-4 top-4 z-50 md:right-8 md:top-8"><ThemeToggle /></div>
			<section className="login-hero relative isolate h-[190px] overflow-hidden md:sticky md:top-0 md:h-dvh">
				<img
					src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1800&q=85"
					alt="Student studying at a desk"
					className="absolute inset-0 size-full object-cover object-center"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/45 to-black/20 md:bg-gradient-to-r md:from-black/25 md:via-black/35 md:to-[#0a0a0a]" />
				<div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 px-5 pb-5 md:inset-y-0 md:flex-col md:items-start md:justify-between md:px-12 md:py-12 lg:px-16">
					<div className="flex items-center gap-3">
						<span className="flex size-10 items-center justify-center rounded-lg border border-[#d2b778]/45 bg-black/35 text-[#e0c783] backdrop-blur-sm">
							<GraduationCap size={21} strokeWidth={1.7} />
						</span>
						<span className="text-xs font-semibold tracking-[0.16em] text-white">EDUINSIGHT AI</span>
					</div>
					<p className="hidden max-w-md text-3xl font-medium leading-tight text-white md:block lg:text-4xl">
						Make room for the work that moves you forward.
					</p>
					<p className="hidden text-[10px] font-medium tracking-[0.2em] text-white/45 md:block">LEARN WITH INTENTION</p>
				</div>
			</section>

			<section className="login-panel mx-auto flex w-full max-w-[520px] flex-col justify-center px-5 pb-9 pt-4 sm:px-10 md:min-h-dvh md:px-12 lg:px-16">
				<div className="mb-7 md:mb-9">
					<p className="mb-2 text-[10px] font-semibold tracking-[0.2em] text-[#c6a96b]">STUDENT ACCESS</p>
					<h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Welcome back</h1>
					<p className="mt-2 text-sm text-white/50">Sign in to continue your learning journey.</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					<label className="block">
						<span className="mb-2 block text-xs font-medium text-white/70">Email</span>
						<span className="flex h-12 items-center gap-3 rounded-lg border border-white/10 bg-white/[0.035] px-3.5 transition-colors focus-within:border-[#c6a96b]/70">
							<Mail size={17} className="shrink-0 text-white/40" />
							<input
								type="email"
								name="email"
								autoComplete="username"
								inputMode="email"
								required
								value={email}
								onChange={(event) => setEmail(event.target.value)}
								placeholder="you@example.com"
								className="h-full min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/25"
							/>
						</span>
					</label>

					<label className="block">
						<span className="mb-2 block text-xs font-medium text-white/70">Password</span>
						<span className="flex h-12 items-center gap-3 rounded-lg border border-white/10 bg-white/[0.035] px-3.5 transition-colors focus-within:border-[#c6a96b]/70">
							<LockKeyhole size={17} className="shrink-0 text-white/40" />
							<input
								type={showPassword ? 'text' : 'password'}
								name="password"
								autoComplete="current-password"
								required
								value={password}
								onChange={(event) => setPassword(event.target.value)}
								placeholder="Enter your password"
								className="h-full min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/25"
							/>
							<button
								type="button"
								onClick={() => setShowPassword((visible) => !visible)}
								aria-label={showPassword ? 'Hide password' : 'Show password'}
								className="flex size-9 shrink-0 items-center justify-center rounded-md text-white/45 hover:bg-white/5 hover:text-white"
							>
								{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
							</button>
						</span>
					</label>

					{error && <p role="alert" className="rounded-md border border-rose-300/20 bg-rose-300/[0.05] px-3 py-2.5 text-xs leading-5 text-rose-200">{error}</p>}

					<button
						type="submit"
						disabled={submitting}
						className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#c6a96b] px-4 text-sm font-semibold text-[#17130b] transition-colors hover:bg-[#d8bd83] disabled:cursor-wait disabled:opacity-65"
					>
						{submitting && <LoaderCircle size={17} className="animate-spin" />}
						{submitting ? 'Signing in' : 'Log In'}
					</button>
				</form>

				<div className="my-5 flex items-center gap-3" aria-hidden="true">
					<span className="h-px flex-1 bg-white/10" />
					<span className="text-[10px] font-medium tracking-[0.15em] text-white/35">OR</span>
					<span className="h-px flex-1 bg-white/10" />
				</div>

				<div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
					<button
						type="button"
						onClick={startGoogleSignIn}
						className="flex h-11 items-center justify-center gap-2.5 rounded-lg border border-white/12 bg-white/[0.025] px-3 text-xs font-medium text-white/85 transition-colors hover:border-white/25 hover:bg-white/[0.05]"
					>
						<span aria-hidden="true" className="font-semibold text-sm text-[#dfc27e]">G</span>
						Continue with Google
					</button>
					<button
						type="button"
						onClick={() => setNotice('Apple sign-in is not enabled for this service yet.')}
						className="flex h-11 items-center justify-center gap-2.5 rounded-lg border border-white/12 bg-white/[0.025] px-3 text-xs font-medium text-white/85 transition-colors hover:border-white/25 hover:bg-white/[0.05]"
					>
						<Apple size={16} />
						Continue with Apple
					</button>
				</div>
				{notice && <p role="status" className="mt-3 text-center text-xs text-white/55">{notice}</p>}

				<div className="mt-7 text-center">
					<span className="text-xs text-white/45">Don't have an account? </span>
					<Link
						href="/register"
						className="text-xs font-semibold text-[#dfc27e] underline decoration-[#dfc27e]/35 underline-offset-4 hover:text-[#f0d89d]"
					>
						Create Account
					</Link>
				</div>
			</section>
			</main>
			{redirectTarget && session?.token === redirectTarget.token && (
				<LoadingScreen
					onComplete={() => {
						if (navigationStartedRef.current) return;
						navigationStartedRef.current = true;
						router.replace(redirectTarget.path);
					}}
				/>
			)}
		</>
	);
}

export default function LoginPage() {
	return (
		<Suspense
			fallback={
				<div
					role="status"
					aria-label="Loading sign in"
					className="flex min-h-dvh items-center justify-center bg-[#0a0a0a] text-[#c6a96b]"
				>
					<LoaderCircle className="animate-spin" size={24} />
				</div>
			}
		>
			<LoginPageContent />
		</Suspense>
	);
}
