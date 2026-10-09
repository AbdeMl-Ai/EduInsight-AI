'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Activity, Banknote, CalendarDays, LoaderCircle, Save, Users } from 'lucide-react';
import {
  CartesianGrid,
  ComposedChart,
  Area,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useAdminToast } from '@/components/admin/AdminToastProvider';
import {
  createStudentPayment,
  getAdminErrorMessage,
  getAdminStudents,
  getRevenueAttendance,
  type AdminStudent,
  type RevenueAttendance,
} from '@/lib/admin-api';

function monthValue(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function dateValue(date: Date) {
  return `${monthValue(date)}-${String(date.getDate()).padStart(2, '0')}`;
}

function formatMad(amount: number) {
  return new Intl.NumberFormat('fr-MA', {
    style: 'currency',
    currency: 'MAD',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatMonth(month: string) {
  const [year, monthNumber] = month.split('-').map(Number);
  return new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' })
    .format(new Date(year, monthNumber - 1, 1));
}

export default function AdminRevenueAttendance() {
  const { showSuccessToast } = useAdminToast();
  const months = useMemo(() => Array.from({ length: 12 }, (_, offset) => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() - (11 - offset));
    return monthValue(date);
  }), []);
  const [month, setMonth] = useState(() => monthValue(new Date()));
  const [analytics, setAnalytics] = useState<RevenueAttendance | null>(null);
  const [students, setStudents] = useState<AdminStudent[]>([]);
  const [studentId, setStudentId] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(() => dateValue(new Date()));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    getAdminStudents(controller.signal)
      .then((items) => {
        if (!controller.signal.aborted) {
          setStudents(items);
          setStudentId((current) => current || items[0]?.student_id || '');
        }
      })
      .catch((requestError: unknown) => {
        if (!controller.signal.aborted) {
          setError(getAdminErrorMessage(requestError, 'Student list could not be loaded.'));
        }
      });
    return () => controller.abort();
  }, []);

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
          setError(getAdminErrorMessage(requestError, 'Revenue and attendance could not be loaded.'));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [month]);

  async function submitPayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await createStudentPayment({ student_id: studentId, amount: Number(amount), month, payment_date: paymentDate });
      setAmount('');
      showSuccessToast(`Payment recorded for ${formatMonth(month)}.`, 'Payment saved');
      try {
        setAnalytics(await getRevenueAttendance(month));
      } catch (refreshError) {
        setError(getAdminErrorMessage(refreshError, 'Payment was saved, but analytics could not be refreshed.'));
      }
    } catch (requestError) {
      setError(getAdminErrorMessage(requestError, 'Payment could not be saved.'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <section aria-labelledby="revenue-attendance-heading" className="space-y-4 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm transition-colors duration-300 dark:border-white/10 dark:bg-white/[0.025] sm:p-5">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-800 dark:text-amber-200"><Activity size={13} /> Financial overview</p>
          <h2 id="revenue-attendance-heading" className="mt-1 text-lg font-semibold tracking-tight text-slate-900 dark:text-white">Revenue &amp; attendance</h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-white/45">Daily student presence and collected payments.</p>
        </div>
        <div className="flex max-w-full gap-2 self-start overflow-x-auto rounded-lg border border-slate-200 bg-slate-100/70 p-1 dark:border-white/10 dark:bg-black/20">
          {months.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setMonth(item);
                if (!paymentDate.startsWith(item)) setPaymentDate(`${item}-01`);
              }}
              aria-pressed={month === item}
              title={formatMonth(item)}
              className={`min-h-8 min-w-16 shrink-0 rounded-md px-2 text-[9px] font-semibold capitalize transition-colors ${
                month === item
                  ? 'bg-amber-300 text-slate-950 shadow-sm dark:bg-amber-200'
                  : 'text-slate-500 hover:text-slate-900 dark:text-white/45 dark:hover:text-white'
              }`}
            >
              {new Intl.DateTimeFormat('fr-FR', { month: 'short', year: '2-digit' }).format(new Date(Number(item.slice(0, 4)), Number(item.slice(5)) - 1, 1))}
            </button>
          ))}
          <label className="sr-only" htmlFor="revenue-month">Select month</label>
          <input id="revenue-month" type="month" value={month} onChange={(event) => setMonth(event.target.value)} className="max-w-[7.5rem] rounded-md border border-slate-200 bg-white px-2 text-[10px] text-slate-700 outline-none transition-colors focus:border-amber-500 dark:border-white/10 dark:bg-slate-900 dark:text-white" />
        </div>
      </header>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-emerald-300/60 bg-emerald-50/60 p-3 dark:border-emerald-200/15 dark:bg-emerald-300/[0.04]">
          <p className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500 dark:text-white/45"><Users size={13} /> Student attendances</p>
          <p className="mt-1.5 text-xl font-semibold tabular-nums text-slate-900 dark:text-white">{loading ? '—' : analytics?.total_attendance ?? 0}</p>
        </div>
        <div className="rounded-xl border border-amber-300/60 bg-amber-50/60 p-3 dark:border-amber-200/15 dark:bg-amber-300/[0.04]">
          <p className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500 dark:text-white/45"><Banknote size={13} /> Revenue collected</p>
          <p className="mt-1.5 text-xl font-semibold tabular-nums text-slate-900 dark:text-white">{loading ? '—' : formatMad(analytics?.total_revenue ?? 0)}</p>
        </div>
      </div>

      <div className="h-64 w-full rounded-xl border border-slate-200/80 bg-white/50 p-2 dark:border-white/[0.07] dark:bg-black/10 sm:h-72 sm:p-3">
        {loading ? (
          <div role="status" className="flex h-full items-center justify-center text-xs text-slate-500 dark:text-white/45"><LoaderCircle size={16} className="me-2 animate-spin" />Loading analytics…</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={analytics?.days ?? []} margin={{ top: 8, right: 4, left: -18, bottom: 0 }}>
              <CartesianGrid stroke="currentColor" strokeDasharray="3 5" className="text-slate-200 dark:text-white/10" vertical={false} />
              <XAxis dataKey="date" tickFormatter={(value: string) => value.slice(-2)} tickLine={false} axisLine={false} tick={{ fill: 'currentColor', fontSize: 10 }} className="text-slate-500 dark:text-slate-400" minTickGap={18} />
              <YAxis yAxisId="attendance" allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: 'currentColor', fontSize: 10 }} className="text-emerald-700 dark:text-emerald-300" />
              <YAxis yAxisId="revenue" orientation="right" tickLine={false} axisLine={false} tick={{ fill: 'currentColor', fontSize: 10 }} tickFormatter={(value: number) => value >= 1000 ? `${value / 1000}k` : String(value)} className="text-amber-700 dark:text-amber-200" />
              <Tooltip
                labelFormatter={(value) => value}
                formatter={(value, name) => [name === 'Revenue' ? formatMad(Number(value)) : value, name]}
                contentStyle={{ borderRadius: 12, border: '1px solid rgba(148,163,184,.28)', background: 'var(--background)', color: 'var(--foreground)', fontSize: 12 }}
              />
              <Area yAxisId="revenue" type="monotone" dataKey="revenue" name="Revenue" stroke="#d6a943" fill="#d6a943" fillOpacity={0.12} strokeWidth={2} />
              <Line yAxisId="attendance" type="monotone" dataKey="attendance" name="Attendance" stroke="#10b981" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-4 text-[10px] text-slate-600 dark:text-white/55">
        <span className="inline-flex items-center gap-1.5"><span className="h-0.5 w-4 rounded bg-emerald-500" /> Attendance · students</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-4 rounded-sm bg-amber-500/70" /> Revenue · MAD</span>
      </div>

      <form onSubmit={submitPayment} className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-3 dark:border-white/10 dark:bg-white/[0.02] sm:grid-cols-[minmax(0,1.3fr)_minmax(7rem,0.65fr)_minmax(8.5rem,0.85fr)_auto] sm:items-end">
        <label className="min-w-0 space-y-1.5">
          <span className="flex items-center gap-1.5 text-[10px] font-medium text-slate-600 dark:text-white/55"><CalendarDays size={13} /> Student and payment date</span>
          <select required value={studentId} onChange={(event) => setStudentId(event.target.value)} disabled={!students.length} className="min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 outline-none transition-colors focus:border-amber-500 disabled:opacity-50 dark:border-white/10 dark:bg-slate-900 dark:text-white">
            {students.length ? students.map((student) => <option key={student.student_id} value={student.student_id}>{student.full_name}</option>) : <option value="">No students available</option>}
          </select>
        </label>
        <label className="min-w-0 space-y-1.5">
          <span className="text-[10px] font-medium text-slate-600 dark:text-white/55">Amount (MAD)</span>
          <input required type="number" min="0.01" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="300" className="min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm tabular-nums text-slate-900 outline-none transition-colors focus:border-amber-500 dark:border-white/10 dark:bg-slate-900 dark:text-white" />
        </label>
        <label className="min-w-0 space-y-1.5">
          <span className="text-[10px] font-medium text-slate-600 dark:text-white/55">Payment date · {formatMonth(month)}</span>
          <input required type="date" value={paymentDate} onChange={(event) => {
            const nextDate = event.target.value;
            setPaymentDate(nextDate);
            if (nextDate) setMonth(nextDate.slice(0, 7));
          }} className="min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900 outline-none transition-colors focus:border-amber-500 dark:border-white/10 dark:bg-slate-900 dark:text-white" />
        </label>
        <button type="submit" disabled={saving || !studentId || !amount || Number(amount) <= 0} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-amber-300 px-4 text-xs font-semibold text-slate-950 transition-colors hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-amber-200 dark:hover:bg-amber-100">
          {saving ? <LoaderCircle size={15} className="animate-spin" /> : <Save size={15} />}
          {saving ? 'Saving…' : 'Save payment'}
        </button>
      </form>
      {error && <p role="alert" className="rounded-lg border border-rose-300/30 bg-rose-50 p-3 text-xs text-rose-800 dark:border-rose-300/15 dark:bg-rose-300/[0.04] dark:text-rose-200">{error}</p>}
    </section>
  );
}
