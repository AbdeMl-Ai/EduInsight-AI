'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarDays, Clock3, LoaderCircle, Plus, Trash2, Users } from 'lucide-react';
import {
  ACADEMIC_LEVELS,
  createAdminScheduleSession,
  deleteAdminScheduleSession,
  getAdminClasses,
  getAdminErrorMessage,
  getAdminSchedule,
  getAdminTeachers,
  type AdminClass,
  type AdminScheduleSession,
  type AdminTeacher,
} from '@/lib/admin-api';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;
type Day = (typeof DAYS)[number];

type ScheduleSession = {
  id: string;
  teacherId: string;
  teacherName: string;
  classId: string;
  className: string;
  level: string;
  day: Day;
  startTime: string;
  endTime: string;
};

function fromApiSession(session: AdminScheduleSession): ScheduleSession {
  return {
    id: session.id,
    teacherId: session.teacher_id,
    teacherName: session.teacher_name,
    classId: session.class_id,
    className: session.class_name,
    level: session.level,
    day: session.day,
    startTime: session.start_time,
    endTime: session.end_time,
  };
}

const TEACHER_COLORS = [
  { background: '#c6a96b', border: '#f0d89d', text: '#17130b' },
  { background: '#1e5747', border: '#64a88c', text: '#f2fbf6' },
  { background: '#263f61', border: '#7298c4', text: '#f2f7ff' },
  { background: '#632e3b', border: '#bd7886', text: '#fff4f5' },
  { background: '#79502e', border: '#c99862', text: '#fff8ed' },
] as const;

function formatTime(minutes: number) {
  const hours = Math.floor(minutes / 60).toString().padStart(2, '0');
  const remainder = (minutes % 60).toString().padStart(2, '0');
  return `${hours}:${remainder}`;
}

function minutesOf(time: string) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function teacherColor(teacherId: string, teacherName: string) {
  const identity = teacherId || teacherName;
  let hash = 0;
  for (let index = 0; index < identity.length; index += 1) {
    hash = (hash * 31 + identity.charCodeAt(index)) | 0;
  }
  return TEACHER_COLORS[Math.abs(hash) % TEACHER_COLORS.length];
}

function layoutSessions(sessions: ScheduleSession[]) {
  const positions = new Map<string, { lane: number; laneCount: number }>();
  const maxLanesByDay: Record<Day, number> = {
    Monday: 1,
    Tuesday: 1,
    Wednesday: 1,
    Thursday: 1,
    Friday: 1,
    Saturday: 1,
    Sunday: 1,
  };

  for (const day of DAYS) {
    const ordered = sessions
      .filter((session) => session.day === day)
      .sort((left, right) => minutesOf(left.startTime) - minutesOf(right.startTime));
    let group: ScheduleSession[] = [];
    let groupEnd = -1;

    const commitGroup = () => {
      if (!group.length) return;
      const laneEnds: number[] = [];
      const assigned = group.map((session) => {
        const start = minutesOf(session.startTime);
        const end = minutesOf(session.endTime);
        let lane = laneEnds.findIndex((laneEnd) => laneEnd <= start);
        if (lane < 0) lane = laneEnds.length;
        laneEnds[lane] = end;
        return { session, lane };
      });
      const laneCount = laneEnds.length;
      maxLanesByDay[day] = Math.max(maxLanesByDay[day], laneCount);
      assigned.forEach(({ session, lane }) => positions.set(session.id, { lane, laneCount }));
    };

    for (const session of ordered) {
      const start = minutesOf(session.startTime);
      const end = minutesOf(session.endTime);
      if (group.length && start >= groupEnd) {
        commitGroup();
        group = [];
        groupEnd = -1;
      }
      group.push(session);
      groupEnd = Math.max(groupEnd, end);
    }
    commitGroup();
  }

  return { positions, maxLanesByDay };
}

const TIME_OPTIONS = Array.from({ length: 49 }, (_, index) => formatTime(index * 30));
const START_TIME_OPTIONS = TIME_OPTIONS.slice(0, -1);

function SelectField({
  label,
  value,
  onChange,
  children,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <label className="min-w-0 space-y-1.5">
      <span className="block text-[10px] font-medium text-white/50">{label}</span>
      <select
        required
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        className="min-h-11 w-full rounded-lg border border-white/10 bg-[#151515] px-3 text-xs text-white outline-none transition-colors focus:border-[#c6a96b]/55 disabled:opacity-45"
      >
        {children}
      </select>
    </label>
  );
}

export default function AdminWeeklySchedule() {
  const [teachers, setTeachers] = useState<AdminTeacher[]>([]);
  const [classes, setClasses] = useState<AdminClass[]>([]);
  const [sessions, setSessions] = useState<ScheduleSession[]>([]);
  const [teacherId, setTeacherId] = useState('');
  const [classId, setClassId] = useState('');
  const [level, setLevel] = useState('');
  const [day, setDay] = useState<Day | ''>('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingIds, setDeletingIds] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    Promise.all([
      getAdminTeachers(controller.signal),
      getAdminClasses(controller.signal),
      getAdminSchedule(controller.signal),
    ])
      .then(([teacherData, classData, scheduleData]) => {
        if (controller.signal.aborted) return;
        setTeachers(teacherData);
        setClasses(classData);
        setSessions(scheduleData.map(fromApiSession));
      })
      .catch((requestError: unknown) => {
        if (!controller.signal.aborted) {
          setError(getAdminErrorMessage(requestError, 'Schedule options could not be loaded.'));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [attempt]);

  const endOptions = TIME_OPTIONS.filter((time) => time > startTime);
  const { positions, maxLanesByDay } = layoutSessions(sessions);
  const firstVisibleTime = sessions.length
    ? Math.min(...sessions.map((session) => minutesOf(session.startTime)))
    : null;
  const lastVisibleTime = sessions.length
    ? Math.max(...sessions.map((session) => minutesOf(session.endTime)))
    : null;
  const timeSlots = firstVisibleTime !== null && lastVisibleTime !== null
    ? Array.from(
        { length: Math.ceil((lastVisibleTime - firstVisibleTime) / 30) },
        (_, index) => formatTime(firstVisibleTime + index * 30),
      )
    : [];
  const gridColumns = `66px ${DAYS.map((item) => `minmax(${maxLanesByDay[item] * 148}px, 1fr)`).join(' ')}`;

  function handleStartChange(value: string) {
    setStartTime(value);
    if (endTime <= value) {
      const nextEnd = TIME_OPTIONS.find((time) => time > value);
      if (nextEnd) setEndTime(nextEnd);
    }
  }

  async function addSession(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError('');
    const teacher = teachers.find((item) => item.teacher_id === teacherId);
    const selectedClass = classes.find((item) => item.id === classId);
    if (!teacher || !selectedClass || !day || !level) {
      setFormError('Choose a teacher, class, level, and day.');
      return;
    }
    if (endTime <= startTime) {
      setFormError('End time must be later than start time.');
      return;
    }
    const teacherConflict = sessions.find((session) =>
      session.teacherId === teacherId &&
      session.day === day &&
      startTime < session.endTime &&
      endTime > session.startTime,
    );
    if (teacherConflict) {
      setFormError(`${teacher.full_name} already has a lesson on ${day} from ${teacherConflict.startTime} to ${teacherConflict.endTime}.`);
      return;
    }
    setSaving(true);
    try {
      const saved = await createAdminScheduleSession({
        teacher_id: teacherId,
        class_id: classId,
        level,
        day,
        start_time: startTime,
        end_time: endTime,
      });
      setSessions((current) => [...current, fromApiSession(saved)]);
      setFormError('');
    } catch (requestError) {
      setFormError(getAdminErrorMessage(requestError, 'The schedule session could not be saved.'));
    } finally {
      setSaving(false);
    }
  }

  async function removeSession(session: ScheduleSession) {
    setFormError('');
    setDeletingIds((current) => [...current, session.id]);
    try {
      await deleteAdminScheduleSession(session.id);
      setSessions((current) => current.filter((item) => item.id !== session.id));
    } catch (requestError) {
      setFormError(getAdminErrorMessage(requestError, 'The schedule session could not be removed.'));
    } finally {
      setDeletingIds((current) => current.filter((id) => id !== session.id));
    }
  }

  return (
    <section aria-labelledby="weekly-schedule-title" className="space-y-4">
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.17em] text-[#dfc27e]">WEEKLY PLANNING</p>
          <h2 id="weekly-schedule-title" className="mt-1 text-base font-semibold text-white">Weekly schedule</h2>
          <p className="mt-1 text-[11px] text-white/40">Build the teaching week by class and teacher.</p>
        </div>
        <span className="inline-flex min-h-7 shrink-0 items-center gap-1.5 rounded-full border border-[#c6a96b]/20 bg-[#c6a96b]/[0.05] px-2.5 text-[9px] font-medium tracking-[0.08em] text-[#dfc27e]">
          <span className="size-1.5 rounded-full bg-[#c6a96b]" />DRAFT
        </span>
      </header>

      <form onSubmit={addSession} className="rounded-lg border border-white/10 bg-white/[0.025] p-3 sm:p-4">
        <div className="mb-3 flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg border border-[#c6a96b]/20 bg-[#c6a96b]/[0.06] text-[#dfc27e]"><CalendarDays size={15} /></span>
          <div>
            <h3 className="text-xs font-semibold text-white">Add a session</h3>
            <p className="text-[10px] text-white/40">Choose the people, class, day, and time.</p>
          </div>
        </div>

        {error ? (
          <div role="alert" className="rounded-lg border border-rose-300/15 bg-rose-300/[0.04] p-3">
            <p className="text-xs text-rose-200">{error}</p>
            <button type="button" onClick={() => setAttempt((value) => value + 1)} className="mt-2 min-h-8 text-xs font-semibold text-[#dfc27e] underline underline-offset-4">Retry loading options</button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              <SelectField label="Teacher" value={teacherId} onChange={setTeacherId} disabled={loading || !teachers.length}>
                <option value="">{loading ? 'Loading teachers…' : 'Select teacher'}</option>
                {teachers.map((teacher) => <option key={teacher.teacher_id} value={teacher.teacher_id}>{teacher.full_name}</option>)}
              </SelectField>
              <SelectField label="Class" value={classId} onChange={(value) => {
                setClassId(value);
                const selected = classes.find((item) => item.id === value);
                if (selected && ACADEMIC_LEVELS.includes(selected.class_level as (typeof ACADEMIC_LEVELS)[number])) {
                  setLevel(selected.class_level);
                }
              }} disabled={loading || !classes.length}>
                <option value="">{loading ? 'Loading classes…' : 'Select class'}</option>
                {classes.map((item) => <option key={item.id} value={item.id}>{item.class_name}</option>)}
              </SelectField>
              <SelectField label="Level" value={level} onChange={setLevel}>
                <option value="">Select level</option>
                {ACADEMIC_LEVELS.map((item) => <option key={item} value={item}>{item}</option>)}
              </SelectField>
              <SelectField label="Day" value={day} onChange={(value) => setDay(value as Day)}>
                <option value="">Select day</option>
                {DAYS.map((item) => <option key={item} value={item}>{item}</option>)}
              </SelectField>
              <SelectField label="Start time" value={startTime} onChange={handleStartChange}>
                {START_TIME_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}
              </SelectField>
              <SelectField label="End time" value={endTime} onChange={setEndTime}>
                {endOptions.map((item) => <option key={item} value={item}>{item}</option>)}
              </SelectField>
            </div>
            {formError && <p role="alert" className="mt-3 rounded-lg border border-rose-300/15 bg-rose-300/[0.04] p-3 text-xs text-rose-200">{formError}</p>}
            <div className="mt-3 flex items-center justify-between gap-3 border-t border-white/[0.07] pt-3">
              <p className="flex min-w-0 items-center gap-1.5 text-[10px] text-white/35"><Clock3 size={13} className="shrink-0" />30-minute increments · full-day scheduling</p>
              <button type="submit" disabled={loading || saving || !teachers.length || !classes.length} className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-lg bg-[#c6a96b] px-3.5 text-xs font-semibold text-[#17130b] transition-colors hover:bg-[#d8bd83] disabled:cursor-not-allowed disabled:opacity-45">{saving ? <LoaderCircle size={15} className="animate-spin" /> : <Plus size={15} />}{saving ? 'Saving' : 'Execute'}</button>
            </div>
          </>
        )}
      </form>

      <div
        className="overflow-x-auto rounded-lg border border-white/10 bg-white/[0.015]"
        aria-label={firstVisibleTime !== null && lastVisibleTime !== null
          ? `Weekly timetable, ${formatTime(firstVisibleTime)} to ${formatTime(lastVisibleTime)}`
          : 'Weekly timetable, no sessions scheduled'}
      >
        <div className="grid min-w-[850px]" style={{ gridTemplateColumns: gridColumns, gridTemplateRows: `42px repeat(${Math.max(timeSlots.length, 1)}, 44px)` }}>
          {timeSlots.map((time, row) => (
            <div key={time} className="sticky left-0 z-10 flex items-start justify-end border-b border-white/[0.055] bg-[#0d0d0d] px-2 pt-1 text-[9px] tabular-nums text-white/35" style={{ gridColumn: 1, gridRow: row + 2 }}>{time}</div>
          ))}
          <div className="sticky left-0 z-20 flex items-center border-b border-white/10 bg-[#101010] px-2 text-[9px] font-semibold tracking-[0.1em] text-white/35" style={{ gridColumn: 1, gridRow: 1 }}>TIME</div>
          {DAYS.map((item, index) => <div key={item} className="flex items-center justify-center border-b border-l border-white/10 bg-[#101010] px-1 text-[10px] font-semibold text-white/65" style={{ gridColumn: index + 2, gridRow: 1 }}>{item}</div>)}

          {timeSlots.flatMap((time, row) => DAYS.map((item, column) => (
            <div key={`${item}-${time}`} className="border-b border-l border-white/[0.055]" style={{ gridColumn: column + 2, gridRow: row + 2 }} />
          )))}

          {timeSlots.length === 0 && (
            <div className="flex items-center justify-center border-b border-l border-white/[0.055] text-xs text-white/35" style={{ gridColumn: '2 / 9', gridRow: 2 }}>
              {loading ? <span role="status" className="inline-flex items-center gap-2"><LoaderCircle size={14} className="animate-spin text-[#c6a96b]" />Loading saved schedule…</span> : 'Add a session to set this week’s visible hours.'}
            </div>
          )}

          <AnimatePresence>
            {sessions.map((session) => {
              const dayIndex = DAYS.indexOf(session.day);
              const position = positions.get(session.id) ?? { lane: 0, laneCount: 1 };
              const color = teacherColor(session.teacherId, session.teacherName);
              const laneWidth = 100 / position.laneCount;
              return (
                <motion.article
                  key={session.id}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.18 }}
                  className="z-10 m-0.5 min-h-0 overflow-hidden rounded-md border p-1.5 shadow-[0_0_16px_rgba(0,0,0,0.14)]"
                  style={{
                    gridColumn: dayIndex + 2,
                    gridRow: `${(minutesOf(session.startTime) - (firstVisibleTime ?? 0)) / 30 + 2} / ${(minutesOf(session.endTime) - (firstVisibleTime ?? 0)) / 30 + 2}`,
                    width: `${laneWidth}%`,
                    marginLeft: `${laneWidth * position.lane}%`,
                    backgroundColor: color.background,
                    borderColor: color.border,
                    color: color.text,
                  }}
                  title={`${session.level} · ${session.teacherName} · ${session.className} · ${session.startTime}–${session.endTime}`}
                >
                  <div className="flex h-full min-h-0 flex-col overflow-hidden">
                    <div className="flex min-w-0 items-start justify-between gap-1">
                      <span className="truncate text-[9px] font-bold leading-3">{session.level}</span>
                      <button type="button" onClick={() => removeSession(session)} disabled={deletingIds.includes(session.id)} aria-label={`Remove ${session.className} session`} title="Remove session" className="flex size-5 shrink-0 items-center justify-center rounded text-current/65 hover:bg-black/10 hover:text-black disabled:opacity-45">{deletingIds.includes(session.id) ? <LoaderCircle size={11} className="animate-spin" /> : <Trash2 size={11} />}</button>
                    </div>
                    <span className="truncate text-[9px] font-semibold leading-3">{session.teacherName}</span>
                    <span className="truncate text-[8px] leading-3 opacity-75">{session.className}</span>
                    <span className="mt-auto truncate text-[8px] leading-3 opacity-70">{session.startTime}–{session.endTime}</span>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 text-[10px] text-white/35">
        <span className="flex items-center gap-1.5"><Users size={13} />{sessions.length} {sessions.length === 1 ? 'session' : 'sessions'}</span>
        <span>Draft only · schedule API not available</span>
      </div>
    </section>
  );
}