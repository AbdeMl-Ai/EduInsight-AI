'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LoaderCircle, Mail, UserRound } from 'lucide-react';
import LogoutButton from '@/components/app/LogoutButton';
import {
  getApiErrorMessage,
  getStudentProfile,
  type StudentProfile,
} from '@/lib/student-api';

export default function StudentProfilePage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    getStudentProfile(controller.signal)
      .then(setProfile)
      .catch((requestError: unknown) => {
        if (!controller.signal.aborted) {
          setError(getApiErrorMessage(requestError, 'Profile could not be loaded.'));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [attempt]);

  return (
    <section>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="mb-2 text-[10px] font-semibold tracking-[0.2em] text-[#c6a96b]">ACCOUNT</p>
        <div className="mb-7">
          <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">Your profile</h1>
          <p className="mt-2 text-sm text-white/50">Personal details connected to your student account.</p>
        </div>
      </motion.div>

      {loading && <div role="status" className="flex min-h-48 items-center justify-center gap-3 text-sm text-white/50"><LoaderCircle className="animate-spin text-[#c6a96b]" size={18} />Loading profile</div>}
      {!loading && error && (
        <div role="alert" className="rounded-lg border border-rose-300/20 bg-rose-300/[0.05] p-5">
          <p className="text-sm text-rose-200">{error}</p>
          <button onClick={() => setAttempt((value) => value + 1)} className="mt-4 min-h-10 text-sm font-medium text-[#dfc27e] underline underline-offset-4">Try again</button>
        </div>
      )}
      {!loading && !error && profile && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.025]">
          <div className="flex items-center gap-4 border-b border-white/[0.08] p-5 sm:p-7">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-full border border-[#c6a96b]/35 bg-[#c6a96b]/[0.08] text-[#dfc27e]">
              <UserRound size={23} strokeWidth={1.5} />
            </span>
            <div className="min-w-0">
              <h2 className="break-words text-lg font-semibold text-white">{profile.full_name}</h2>
              <p className="mt-1 break-all text-sm text-white/50">{profile.email}</p>
            </div>
          </div>
          <dl className="divide-y divide-white/[0.08] px-5 sm:px-7">
            <div className="flex min-h-[62px] items-center justify-between gap-4 py-3">
              <dt className="flex items-center gap-2 text-xs text-white/45"><Mail size={15} />Email</dt>
              <dd className="max-w-[65%] break-all text-right text-sm text-white/85">{profile.email}</dd>
            </div>
            <div className="flex min-h-[62px] items-center justify-between gap-4 py-3">
              <dt className="text-xs text-white/45">Academic level</dt>
              <dd className="max-w-[65%] break-words text-right text-sm text-white/85">{profile.level_academy || 'Not provided'}</dd>
            </div>
            <div className="flex min-h-[62px] items-center justify-between gap-4 py-3">
              <dt className="text-xs text-white/45">Age</dt>
              <dd className="text-right text-sm tabular-nums text-white/85">{profile.age}</dd>
            </div>
          </dl>
        </motion.div>
      )}
      <LogoutButton />
    </section>
  );
}