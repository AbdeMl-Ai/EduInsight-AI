'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { LoaderCircle, Mail, ShieldCheck, UserRound } from 'lucide-react';
import LogoutButton from '@/components/app/LogoutButton';
import {
  getAdminErrorMessage,
  getAdminProfile,
  updateAdminProfile,
  type AdminProfile,
} from '@/lib/admin-api';

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    getAdminProfile(controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return;
        setProfile(data);
        setFullName(data.full_name);
        setEmail(data.email);
      })
      .catch((requestError: unknown) => {
        if (!controller.signal.aborted) setError(getAdminErrorMessage(requestError, 'Profile could not be loaded.'));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [attempt]);

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError('');
    setNotice('');
    try {
      const updated = await updateAdminProfile({ full_name: fullName.trim(), email: email.trim() });
      setProfile(updated);
      setFullName(updated.full_name);
      setEmail(updated.email);
      setNotice('Your profile has been updated.');
    } catch (requestError) {
      setError(getAdminErrorMessage(requestError, 'Profile could not be updated.'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="space-y-5">
      <header>
        <p className="text-[10px] font-semibold tracking-[0.18em] text-[#dfc27e]">ACCOUNT</p>
        <h1 className="mt-2 text-2xl font-semibold text-white">Admin profile</h1>
        <p className="mt-1 text-xs text-white/45">Your administrator account details.</p>
      </header>

      {loading ? (
        <div role="status" className="space-y-3"><div className="h-28 animate-pulse rounded-lg border border-white/[0.06] bg-white/[0.025]" /><div className="h-48 animate-pulse rounded-lg border border-white/[0.06] bg-white/[0.025]" /></div>
      ) : error && !profile ? (
        <div role="alert" className="rounded-lg border border-rose-300/20 bg-rose-300/[0.05] p-4">
          <p className="text-xs text-rose-200">{error}</p>
          <button onClick={() => setAttempt((value) => value + 1)} className="mt-3 min-h-9 text-xs font-semibold text-[#dfc27e] underline underline-offset-4">Try again</button>
        </div>
      ) : profile ? (
        <>
          <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 rounded-lg border border-white/10 bg-white/[0.025] p-5">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-full border border-[#c6a96b]/30 bg-[#c6a96b]/[0.07] text-[#dfc27e]"><UserRound size={23} strokeWidth={1.6} /></span>
            <div className="min-w-0"><p className="break-words text-base font-semibold text-white">{profile.full_name}</p><p className="mt-1 break-all text-xs text-white/45">{profile.email}</p></div>
          </motion.section>

          <form onSubmit={saveProfile} className="space-y-4 rounded-lg border border-white/10 bg-white/[0.025] p-4 sm:p-5">
            <div>
              <h2 className="text-sm font-semibold text-white">Personal details</h2>
              <p className="mt-1 text-[11px] text-white/40">Update the name and email associated with this admin account.</p>
            </div>
            <label className="block space-y-1.5">
              <span className="text-[11px] font-medium text-white/55">Full name</span>
              <span className="relative block"><UserRound size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35" /><input value={fullName} onChange={(event) => setFullName(event.target.value)} required autoComplete="name" className="min-h-11 w-full rounded-lg border border-white/10 bg-white/[0.035] pl-9 pr-3 text-sm text-white outline-none focus:border-[#c6a96b]/55" /></span>
            </label>
            <label className="block space-y-1.5">
              <span className="text-[11px] font-medium text-white/55">Email</span>
              <span className="relative block"><Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35" /><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" className="min-h-11 w-full rounded-lg border border-white/10 bg-white/[0.035] pl-9 pr-3 text-sm text-white outline-none focus:border-[#c6a96b]/55" /></span>
            </label>
            {error && <p role="alert" className="rounded-lg border border-rose-300/15 bg-rose-300/[0.04] p-3 text-xs text-rose-200">{error}</p>}
            {notice && <p role="status" className="rounded-lg border border-emerald-300/15 bg-emerald-300/[0.04] p-3 text-xs text-emerald-200">{notice}</p>}
            <button type="submit" disabled={saving || !fullName.trim() || !email.trim()} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#c6a96b] text-xs font-semibold text-[#17130b] disabled:opacity-50">{saving && <LoaderCircle size={15} className="animate-spin" />}{saving ? 'Saving profile' : 'Save changes'}</button>
          </form>

          <section className="rounded-lg border border-white/10 bg-white/[0.025] p-4">
            <div className="flex items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-emerald-300/15 bg-emerald-300/[0.05] text-emerald-200"><ShieldCheck size={17} /></span>
              <div><h2 className="text-xs font-semibold text-white">Administrator access</h2><p className="mt-1 text-[11px] leading-5 text-white/45">Administrative actions are protected by your signed-in account and workspace permissions.</p></div>
            </div>
          </section>

        </>
      ) : null}
      <LogoutButton />
    </section>
  );
}