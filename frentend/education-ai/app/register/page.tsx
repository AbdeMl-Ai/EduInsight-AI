'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { ArrowLeft, GraduationCap, LoaderCircle } from 'lucide-react';

import { ApiRequestError, api } from '@/lib/api';

function registrationErrorDetails(data: unknown): unknown {
  if (!data || typeof data !== 'object' || !('detail' in data)) return data;
  const detail = data.detail;
  if (!Array.isArray(detail)) return { detail };

  return {
    detail: detail.map((item: unknown) => {
      if (!item || typeof item !== 'object') return item;
      const { input: _input, ...safeItem } = item as Record<string, unknown>;
      return safeItem;
    }),
  };
}

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setMessage('');
    setSubmitting(true);

    try {
      const result = await api.registerAccount({
        full_name: fullName.trim(),
        email: email.trim(),
        phone_number: phoneNumber.trim(),
        password,
      });
      setMessage(result.message);
      setFullName('');
      setEmail('');
      setPhoneNumber('');
      setPassword('');
    } catch (submissionError) {
      if (submissionError instanceof ApiRequestError) {
        console.error('Registration API response:', {
          status: submissionError.status,
          data: registrationErrorDetails(submissionError.data),
        });
      } else {
        console.error('Registration request failed before receiving a response:', submissionError);
      }
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : 'Unable to create your account. Please try again.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#0a0a0a] px-4 py-10 text-[#f5f2e9]">
      <section className="w-full max-w-md">
        <Link
          href="/login"
          className="mb-7 inline-flex items-center gap-2 text-sm text-white/55 transition-colors hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to sign in
        </Link>

        <div className="rounded-2xl border border-white/10 bg-[#111111] p-6 shadow-2xl sm:p-8">
          <div className="mb-7">
            <span className="mb-5 flex size-11 items-center justify-center rounded-xl border border-[#d2b778]/35 bg-[#c6a96b]/10 text-[#dfc27e]">
              <GraduationCap size={22} />
            </span>
            <p className="mb-2 text-[10px] font-semibold tracking-[0.2em] text-[#c6a96b]">
              EDUINSIGHT AI
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Create your account
            </h1>
            <p className="mt-2 text-sm leading-6 text-white/50">
              Sign up with your details or continue with Google.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-xs font-medium text-white/70">Full name</span>
              <input
                name="full_name"
                type="text"
                autoComplete="name"
                maxLength={120}
                required
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Your full name"
                className="h-12 w-full rounded-lg border border-white/10 bg-white/[0.035] px-3.5 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-[#c6a96b]/70"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-medium text-white/70">Email</span>
              <input
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                maxLength={254}
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="h-12 w-full rounded-lg border border-white/10 bg-white/[0.035] px-3.5 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-[#c6a96b]/70"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-medium text-white/70">Phone number</span>
              <input
                name="phone_number"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                maxLength={30}
                required
                value={phoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value)}
                placeholder="+1 555 123 4567"
                className="h-12 w-full rounded-lg border border-white/10 bg-white/[0.035] px-3.5 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-[#c6a96b]/70"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-medium text-white/70">Password</span>
              <input
                name="password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                maxLength={72}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 8 characters"
                className="h-12 w-full rounded-lg border border-white/10 bg-white/[0.035] px-3.5 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-[#c6a96b]/70"
              />
            </label>

            {error && (
              <p role="alert" className="rounded-md border border-rose-300/20 bg-rose-300/[0.05] px-3 py-2.5 text-xs leading-5 text-rose-200">
                {error}
              </p>
            )}
            {message && (
              <p role="status" className="rounded-md border border-emerald-300/20 bg-emerald-300/[0.05] px-3 py-2.5 text-xs leading-5 text-emerald-100">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#c6a96b] px-4 text-sm font-semibold text-[#17130b] transition-colors hover:bg-[#d8bd83] disabled:cursor-wait disabled:opacity-65"
            >
              {submitting && <LoaderCircle size={17} className="animate-spin" />}
              {submitting ? 'Creating account' : 'Create account'}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3" aria-hidden="true">
            <span className="h-px flex-1 bg-white/10" />
            <span className="text-[10px] font-medium tracking-[0.15em] text-white/35">OR</span>
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <button
            type="button"
            onClick={api.startGoogleSignIn}
            className="flex h-12 w-full items-center justify-center gap-2.5 rounded-lg border border-white/12 bg-white/[0.025] px-3 text-sm font-medium text-white/85 transition-colors hover:border-white/25 hover:bg-white/[0.05]"
          >
            <span aria-hidden="true" className="font-semibold text-base text-[#dfc27e]">G</span>
            Continue with Google
          </button>

          <p className="mt-6 text-center text-xs leading-5 text-white/45">
            New accounts need administrator approval before workspace access.
          </p>
        </div>
      </section>
    </main>
  );
}
