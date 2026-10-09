"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CalendarDays, Check, CheckCircle2, ClipboardCheck, LoaderCircle, X } from "lucide-react";
import { api, type AttendanceRecord, type AttendanceStudent, type TeacherScheduleSession } from "@/lib/api";

function localDateISO() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function initials(name: string) {
  return name.trim().split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

export default function TeacherAttendancePage() {
  const reduceMotion = useReducedMotion();
  const today = localDateISO();
  const todayName = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(new Date());
  const [schedule, setSchedule] = useState<TeacherScheduleSession[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [studentsByClass, setStudentsByClass] = useState<Record<string, AttendanceStudent[]>>({});
  const [teacherName, setTeacherName] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [statuses, setStatuses] = useState<Record<string, "present" | "absent">>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([api.getTeacherSchedule(), api.getTeacherAttendance(), api.getTeacher()])
      .then(async ([sessions, records, profile]) => {
        const todaysSessions = sessions
          .filter((item) => item.day === todayName)
          .sort((a, b) => b.start_time.localeCompare(a.start_time));
        const entries = await Promise.all(
          [...new Set(todaysSessions.map((item) => item.class_id))].map(async (classId) => [
            classId,
            await api.getAttendanceStudents(classId),
          ] as const),
        );
        if (cancelled) return;
        setSchedule(todaysSessions);
        setAttendance(records);
        setTeacherName(profile.full_name);
        setStudentsByClass(Object.fromEntries(entries));
        setSessionId((current) => todaysSessions.some((item) => item.id === current) ? current : todaysSessions[0]?.id ?? "");
      })
      .catch((loadError: unknown) => {
        if (!cancelled) setError(loadError instanceof Error ? loadError.message : "Unable to load today’s attendance.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [todayName]);

  const selectedSession = schedule.find((item) => item.id === sessionId);
  const students = useMemo(
    () => selectedSession ? studentsByClass[selectedSession.class_id] ?? [] : [],
    [selectedSession, studentsByClass],
  );

  useEffect(() => {
    if (!selectedSession) {
      setStatuses({});
      return;
    }
    const current: Record<string, "present" | "absent"> = Object.fromEntries(
      students.map((student) => [String(student.student_id), "absent"] as const),
    );
    attendance
      .filter((record) => record.date === today && record.class_id === selectedSession.class_id)
      .forEach((record) => {
        current[record.student_id] = record.status;
      });
    setStatuses(current);
  }, [attendance, selectedSession, students, today]);

  useEffect(() => {
    if (!saved) return;
    const timeout = window.setTimeout(() => setSaved(false), 3200);
    return () => window.clearTimeout(timeout);
  }, [saved]);

  async function saveAttendance() {
    if (!selectedSession || !students.length) return;
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      await api.saveAttendance(
        selectedSession.class_id,
        selectedSession.id,
        today,
        students.map((student) => ({
          student_id: String(student.student_id),
          status: statuses[String(student.student_id)] ?? "absent",
        })),
      );
      setAttendance(await api.getTeacherAttendance());
      setSaved(true);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save attendance.");
    } finally {
      setSaving(false);
    }
  }

  const present = students.filter((student) => statuses[String(student.student_id)] === "present");
  const absent = students.filter((student) => statuses[String(student.student_id)] !== "present");

  function attendanceColumn(title: string, status: "present" | "absent", listed: AttendanceStudent[]) {
    return (
      <motion.section layout className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]">
        <h2 className="border-b border-white/[0.08] px-4 py-4 text-sm font-semibold text-white">
          {title} <span className="ms-1 text-white/40">({listed.length})</span>
        </h2>
        {listed.length ? (
          <ul className="divide-y divide-white/[0.06]">
            <AnimatePresence initial={false} mode="popLayout">
              {listed.map((student) => {
                const nextStatus = status === "present" ? "absent" : "present";
                return (
                  <motion.li
                    key={student.student_id}
                    layout
                    layoutId={`attendance-${student.student_id}`}
                    initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                    transition={reduceMotion ? { duration: 0 } : { layout: { type: "spring", stiffness: 460, damping: 34 }, opacity: { duration: 0.18 } }}
                    className="flex items-center gap-3 px-4 py-3"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-[11px] font-semibold text-white/65">
                      {initials(student.full_name)}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-xs font-medium text-white/80">{student.full_name}</span>
                    <button
                      type="button"
                      aria-label={`Mark ${student.full_name} ${nextStatus}`}
                      onClick={() => setStatuses((current) => ({ ...current, [String(student.student_id)]: nextStatus }))}
                      className={`inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-lg px-3 text-[10px] font-semibold transition-colors ${
                        nextStatus === "present"
                          ? "bg-emerald-300/10 text-emerald-200 hover:bg-emerald-300/15"
                          : "bg-rose-300/10 text-rose-200 hover:bg-rose-300/15"
                      }`}
                    >
                      {nextStatus === "present" ? <Check size={13} /> : <X size={13} />}
                      Mark {nextStatus}
                    </button>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        ) : (
          <p className="px-4 py-8 text-center text-xs text-white/40">No students in this column.</p>
        )}
      </motion.section>
    );
  }

  if (loading) {
    return <div className="flex min-h-48 items-center justify-center gap-3 text-sm text-white/50"><LoaderCircle size={18} className="animate-spin" />Loading today’s attendance…</div>;
  }

  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <header>
        <p className="text-[10px] font-semibold tracking-[0.18em] text-[#dfc27e]">TODAY&apos;S CLASS</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">Attendance</h1>
        <p className="mt-2 text-xs text-white/45">Select a scheduled session and mark who attended.</p>
      </header>

      {error && <p role="alert" className="rounded-xl border border-rose-300/20 bg-rose-300/[0.05] p-3 text-xs text-rose-200">{error}</p>}

      {schedule.length ? (
        <>
          <label className="block max-w-xl space-y-2 text-xs font-medium text-white/60">
            Select today&apos;s class
            <select
              value={sessionId}
              onChange={(event) => {
                setSessionId(event.target.value);
                setError("");
              }}
              className="min-h-11 w-full rounded-xl border border-white/10 bg-[#151515] px-3 text-sm text-white outline-none focus:border-[#c6a96b]/50"
            >
              {schedule.map((item) => (
                <option key={item.id} value={item.id}>{item.class_name} · {item.start_time}–{item.end_time}</option>
              ))}
            </select>
          </label>

          <AnimatePresence mode="wait">
            {selectedSession && (
              <motion.section
                key={selectedSession.id}
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                transition={{ duration: reduceMotion ? 0 : 0.22 }}
                className="grid gap-3 rounded-2xl border border-[#c6a96b]/20 bg-[#c6a96b]/[0.045] p-4 sm:grid-cols-2 lg:grid-cols-4"
              >
                {[
                  ["Session Name", selectedSession.class_name],
                  ["Subject (Mada)", selectedSession.subject],
                  ["Level", selectedSession.level],
                  ["Teacher Name", selectedSession.teacher_name || teacherName],
                ].map(([label, value], index) => (
                  <motion.div
                    key={label}
                    initial={reduceMotion ? false : { opacity: 0, y: 7 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: reduceMotion ? 0 : 0.2, delay: reduceMotion ? 0 : index * 0.06 }}
                  >
                    <p className="text-[9px] font-semibold tracking-[0.12em] text-white/40">{label}</p>
                    <p className="mt-1 text-xs font-semibold text-white">{value || "—"}</p>
                  </motion.div>
                ))}
                <p className="text-[10px] text-white/40 sm:col-span-2 lg:col-span-4">
                  {today} · {selectedSession.start_time}–{selectedSession.end_time}
                </p>
              </motion.section>
            )}
          </AnimatePresence>

          {selectedSession && (
            <>
              <div className="grid items-start gap-4 md:grid-cols-2">
                {attendanceColumn("Li 7dro (Present)", "present", present)}
                {attendanceColumn("Li ma 7drox (Absent)", "absent", absent)}
              </div>
              <div className="flex items-center justify-between gap-3">
                <p className="text-[10px] text-white/40">{students.length} students · {today}</p>
                <motion.button
                  type="button"
                  onClick={saveAttendance}
                  disabled={saving || !students.length}
                  whileHover={reduceMotion ? undefined : { y: -1 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#c6a96b] px-4 text-xs font-semibold text-[#17130b] transition-shadow hover:shadow-lg hover:shadow-[#c6a96b]/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? <LoaderCircle size={15} className="animate-spin" /> : <ClipboardCheck size={15} />}
                  {saving ? "Saving…" : "Save attendance"}
                </motion.button>
              </div>
            </>
          )}
        </>
      ) : (
        <div className="rounded-2xl border border-white/10 px-5 py-12 text-center">
          <CalendarDays className="mx-auto mb-3 text-[#c6a96b]" size={23} />
          <p className="text-sm font-medium text-white">No sessions scheduled for today</p>
          <p className="mt-1 text-xs text-white/40">Your attendance sheet will be available on a scheduled class day.</p>
        </div>
      )}

      <AnimatePresence>
        {saved && (
          <motion.div
            role="status"
            aria-live="polite"
            initial={reduceMotion ? false : { opacity: 0, y: 14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            className="fixed bottom-20 end-5 z-[80] flex items-center gap-2 rounded-xl border border-emerald-300/20 bg-[#111] px-4 py-3 text-xs font-semibold text-emerald-200 shadow-xl md:bottom-6"
          >
            <CheckCircle2 size={17} />
            Attendance saved successfully
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
