'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { Activity, Banknote, LoaderCircle } from 'lucide-react';
import {
  CartesianGrid,
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  createStudentPayment,
  getAdminStudents,
  getAdminErrorMessage,
  getRevenueAttendance,
  type AdminStudent,
  type RevenueAttendance,
} from '@/lib/admin-api';
import { useAdminToast } from '@/components/admin/AdminToastProvider';
import { useLandingLanguage } from '@/components/app/LandingLanguageProvider';

function monthValue(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function dateValue(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function formatMad(amount: number, language: 'en' | 'ar') {
  return new Intl.NumberFormat(language === 'ar' ? 'ar-MA' : 'en-MA', {
    style: 'currency',
    currency: 'MAD',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatMonth(month: string, language: 'en' | 'ar') {
  const [year, monthNumber] = month.split('-').map(Number);
  return new Intl.DateTimeFormat(language === 'ar' ? 'ar-MA' : 'en-MA', { month: 'long', year: 'numeric' })
    .format(new Date(year, monthNumber - 1, 1));
}

export default function AdminRevenueAttendance() {
  const { showSuccessToast } = useAdminToast();
  const { language, messages } = useLandingLanguage();
  const [month] = useState(() => monthValue(new Date()));
  const [analytics, setAnalytics] = useState<RevenueAttendance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [students, setStudents] = useState<AdminStudent[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(true);
  const [studentError, setStudentError] = useState('');
  const [studentId, setStudentId] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(() => dateValue(new Date()));
  const [paymentSaving, setPaymentSaving] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    getRevenueAttendance(month, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setAnalytics(data);
      })
      .catch((requestError: unknown) => {
        if (!controller.signal.aborted) {
          setError(getAdminErrorMessage(requestError, messages.revenueLoadError));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [month, refreshKey]);

  useEffect(() => {
    const controller = new AbortController();
    setStudentsLoading(true);
    setStudentError('');
    getAdminStudents(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setStudents(data);
          setStudentId((current) => current || data[0]?.student_id || '');
        }
      })
      .catch((requestError: unknown) => {
        if (!controller.signal.aborted) {
          setStudentError(getAdminErrorMessage(requestError, messages.studentsLoadError));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setStudentsLoading(false);
      });
    return () => controller.abort();
  }, []);

  async function savePayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!studentId || !amount || !paymentDate) return;

    setPaymentSaving(true);
    setPaymentError('');
    try {
      await createStudentPayment({
        student_id: studentId,
        amount: Number(amount),
        payment_date: paymentDate,
        month: paymentDate.slice(0, 7),
      });
      setAmount('');
      setRefreshKey((current) => current + 1);
      showSuccessToast(messages.paymentSavedSuccessfully, messages.paymentSaved);
    } catch (requestError) {
      setPaymentError(getAdminErrorMessage(requestError, messages.paymentSaveError));
    } finally {
      setPaymentSaving(false);
    }
  }

  return (
    <section aria-labelledby="revenue-attendance-heading" className="space-y-4 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm transition-colors duration-300 dark:border-white/10 dark:bg-white/[0.025] sm:p-5">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-800 dark:text-amber-200"><Activity size={13} /> {messages.financialOverview}</p>
          <h2 id="revenue-attendance-heading" className="mt-1 text-lg font-semibold tracking-tight text-slate-900 dark:text-white">{messages.revenue}</h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-white/45">{messages.dailyRevenuePeriod.replace('{month}', formatMonth(month, language))}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-2">
        <div className="w-full rounded-xl border border-amber-300/60 bg-amber-50/60 p-3 dark:border-amber-200/15 dark:bg-amber-300/[0.04]">
          <p className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500 dark:text-white/45"><Banknote size={13} /> {messages.revenueCollectedMad}</p>
          <p className="mt-1.5 text-xl font-semibold tabular-nums text-slate-900 dark:text-white">{loading ? '—' : formatMad(analytics?.total_revenue ?? 0, language)}</p>
        </div>
      </div>

      <div className="h-64 w-full rounded-xl border border-slate-200/80 bg-white/50 p-2 dark:border-white/[0.07] dark:bg-black/10 sm:h-72 sm:p-3">
        {loading ? (
          <div role="status" className="flex h-full items-center justify-center text-xs text-slate-500 dark:text-white/45"><LoaderCircle size={16} className="me-2 animate-spin" />{messages.loadingAnalytics}</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analytics?.days ?? []} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="currentColor" strokeDasharray="3 5" className="text-slate-200 dark:text-white/10" vertical={false} />
              <XAxis dataKey="date" tickFormatter={(value: string) => value.slice(-2)} tickLine={false} axisLine={false} tick={{ fill: 'currentColor', fontSize: 10 }} className="text-slate-500 dark:text-slate-400" minTickGap={18} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: 'currentColor', fontSize: 10 }} tickFormatter={(value: number) => value >= 1000 ? `${value / 1000}k` : String(value)} className="text-amber-700 dark:text-amber-200" />
              <Tooltip
                labelFormatter={(value) => value}
                formatter={(value) => [formatMad(Number(value), language), messages.revenue]}
                contentStyle={{ borderRadius: 12, border: '1px solid rgba(148,163,184,.28)', background: 'var(--background)', color: 'var(--foreground)', fontSize: 12 }}
              />
              <Area type="monotone" dataKey="revenue" name={messages.revenue} stroke="#d6a943" fill="#d6a943" fillOpacity={0.12} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
      <p className="text-[10px] text-slate-500 dark:text-white/40">
        {messages.revenuePaymentRecordsNote}
      </p>
      <form onSubmit={savePayment} className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3 transition-colors dark:border-white/10 dark:bg-black/10 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.4fr)_minmax(8rem,.8fr)_minmax(9rem,.9fr)_auto]">
        <label className="block space-y-1.5">
          <span className="text-[10px] font-medium text-slate-500 dark:text-white/50">{messages.student}</span>
          <select
            required
            value={studentId}
            onChange={(event) => setStudentId(event.target.value)}
            disabled={studentsLoading || students.length === 0 || paymentSaving}
            className="min-h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-800 outline-none transition-colors focus:border-amber-500 disabled:opacity-60 dark:border-white/10 dark:bg-slate-900 dark:text-white"
          >
            {studentsLoading && <option value="">{messages.loadingStudents}</option>}
            {!studentsLoading && students.length === 0 && <option value="">{messages.noStudentsAvailable}</option>}
            {students.map((student) => (
              <option key={student.student_id} value={student.student_id}>{student.full_name}</option>
            ))}
          </select>
        </label>
        <label className="block space-y-1.5">
          <span className="text-[10px] font-medium text-slate-500 dark:text-white/50">{messages.amountMad}</span>
          <input
            required
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            disabled={paymentSaving}
            placeholder={messages.exampleAmount}
            className="min-h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-amber-500 disabled:opacity-60 dark:border-white/10 dark:bg-slate-900 dark:text-white dark:placeholder:text-white/30"
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-[10px] font-medium text-slate-500 dark:text-white/50">{messages.paymentDate}</span>
          <input
            required
            type="date"
            value={paymentDate}
            onChange={(event) => setPaymentDate(event.target.value)}
            disabled={paymentSaving}
            className="min-h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-800 outline-none transition-colors focus:border-amber-500 disabled:opacity-60 dark:border-white/10 dark:bg-slate-900 dark:text-white"
          />
        </label>
        <button
          type="submit"
          disabled={paymentSaving || studentsLoading || students.length === 0}
          className="inline-flex min-h-10 items-center justify-center gap-2 self-end rounded-lg bg-amber-300 px-4 text-xs font-semibold text-slate-950 transition-colors hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-55 dark:bg-amber-200 dark:hover:bg-amber-100"
        >
          {paymentSaving && <LoaderCircle size={14} className="animate-spin" />}
          {messages.savePayment}
        </button>
      </form>
      {(studentError || paymentError) && (
        <p role="alert" className="rounded-lg border border-rose-300/30 bg-rose-50 p-3 text-xs text-rose-800 dark:border-rose-300/15 dark:bg-rose-300/[0.04] dark:text-rose-200">
          {studentError || paymentError}
        </p>
      )}
      {error && <p role="alert" className="rounded-lg border border-rose-300/30 bg-rose-50 p-3 text-xs text-rose-800 dark:border-rose-300/15 dark:bg-rose-300/[0.04] dark:text-rose-200">{error}</p>}
    </section>
  );
}
