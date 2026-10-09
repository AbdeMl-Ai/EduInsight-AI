import axios from 'axios';
import api from '@/lib/axios';

export const ACADEMIC_LEVELS = ['1AC', '2AC', '3AC', 'TRC', '1BAC', '2BAC'] as const;
export const SUBJECTS = ['Math', 'PC', 'SVT', 'English', 'French'] as const;

export type AdminProfile = {
  admin_id: string;
  full_name: string;
  email: string;
  phone_number?: string | null;
};

export type AdminStats = {
  total_students: number;
  teaching_staff: number;
  active_classes: number;
};

export type AdminStudent = {
  student_id: string;
  full_name: string;
  email: string;
  phone_number: string;
  level: string;
  level_academy: string;
  class_id: string | null;
  class_ids: string[];
};

export type AdminTeacher = {
  teacher_id: string;
  full_name: string;
  email: string;
  phone_number: string;
  age: number;
  is_state_teacher: boolean;
  specialties: string[];
  classes: Array<{ class_id: string; name: string; academic_year: string }>;
};

export type AdminClass = {
  id: string;
  admin_id: string;
  teacher_id: string;
  teacher_name: string;
  class_name: string;
  subject: string;
  class_level: string;
  center_rent_fee_per_student: number;
  teacher_teaching_fee_per_student: number;
  student_monthly_fee: number;
};

export type AdminNotification = {
  id: string;
  notification_id: string;
  sender_id: string | null;
  sender_name: string;
  notification_type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  reference_link: string | null;
};

export type AdminScheduleSession = {
  id: string;
  teacher_id: string;
  teacher_name: string;
  class_id: string;
  class_name: string;
  level: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  start_time: string;
  end_time: string;
};

export type StudentReport = {
  student_id: string;
  name: string;
  email: string;
  class_info: { class_id: string; name: string; academic_year: string } | null;
  exercises_and_exams: Array<{
    exercise_id: string;
    exercise_name: string;
    subject: string;
    class_id: string;
    score: number | null;
    max_score: number;
    created_at: string | null;
  }>;
};

export type PaymentSummary = {
  user_id: string;
  user_role: 'student' | 'teacher';
  paid_months: number[];
  last_payment_date: string | null;
  monthly_amount: number;
  total_amount: number;
  base_date: string;
  due: boolean;
};

export type RevenueAttendanceDay = {
  date: string;
  attendance: number;
  revenue: number;
};

export type RevenueAttendance = {
  month: string;
  days: RevenueAttendanceDay[];
  total_attendance: number;
  total_revenue: number;
};

export type StudentPaymentCreate = {
  student_id: string;
  amount: number;
  month: string;
  payment_date?: string;
};

export type StudentPayment = {
  id: string;
  student_id: string;
  student_name: string;
  amount: number;
  payment_date: string;
  month: string;
};

const STUDENT_PAYMENT_ENDPOINT = '/admin/payments/transactions';

export type AttendanceRecord = {
  student_id: string;
  student_name: string | null;
  class_id: string;
  date: string;
  status: 'present' | 'absent';
};

export type AttendanceStudentSummary = {
  student_id: string;
  student_name: string;
  present_sessions: number;
  absent_sessions: number;
  total_sessions: number;
  attendance_percentage: number;
};

export type AttendanceClassSummary = {
  class_id: string;
  total_sessions: number;
  students: AttendanceStudentSummary[];
};

export type StudentUpdate = {
  full_name: string;
  email: string;
  phone_number: string;
  level?: string;
  class_id?: string | null;
  class_ids?: string[];
};

export type ClassCreate = Omit<AdminClass, 'id' | 'admin_id' | 'teacher_name'>;
export type ClassUpdate = Partial<ClassCreate>;

export type StudentCreate = {
  full_name: string;
  email: string;
  phone_number: string;
  level: string;
  class_id?: string | null;
  class_ids?: string[];
};

export type TeacherCreate = {
  full_name: string;
  email: string;
  phone_number: string;
  specialties?: string[];
  age?: number;
  is_state_teacher?: boolean;
  class_ids?: string[];
};

export function getAdminErrorMessage(error: unknown, fallback: string) {
  if (!axios.isAxiosError(error)) return fallback;
  const detail = error.response?.data?.detail;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    const messages = detail
      .map((item: { msg?: unknown }) => item?.msg)
      .filter((message): message is string => typeof message === 'string');
    if (messages.length) return messages.join(' ');
  }
  return error.message || fallback;
}

export async function getAdminProfile(signal?: AbortSignal) {
  const { data } = await api.get<AdminProfile>('/admin/me', { signal });
  return data;
}

export async function updateAdminProfile(data: Partial<Pick<AdminProfile, 'full_name' | 'email'>>) {
  const response = await api.put<AdminProfile>('/admin/me', data);
  return response.data;
}

export async function getAdminStats(signal?: AbortSignal) {
  const { data } = await api.get<AdminStats>('/admin/stats', { signal });
  return data;
}

export async function getRevenueAttendance(month: string, signal?: AbortSignal) {
  const { data } = await api.get<RevenueAttendance>('/admin/analytics/revenue-attendance', {
    params: { month },
    signal,
  });
  return data;
}

export async function createStudentPayment(payment: StudentPaymentCreate) {
  const { data } = await api.request<StudentPayment>({
    method: 'POST',
    url: STUDENT_PAYMENT_ENDPOINT,
    data: payment,
  });
  return data;
}

export async function getAdminStudents(signal?: AbortSignal) {
  const { data } = await api.get<AdminStudent[]>('/admin/students', { signal });
  return data;
}

export async function getAdminTeachers(signal?: AbortSignal) {
  const { data } = await api.get<AdminTeacher[]>('/admin/teachers', { signal });
  return data;
}

export async function getAdminClasses(signal?: AbortSignal) {
  const { data } = await api.get<AdminClass[]>('/admin/classes', { signal });
  return data;
}

export async function getAdminNotifications(signal?: AbortSignal) {
  const { data } = await api.get<AdminNotification[]>('/admin/notifications', { signal });
  return data;
}

export async function sendAdminNotification(data: { message: string; class_id?: string; student_id?: string; teacher_id?: string }) {
  const { data: response } = await api.post<{ message: string }>('/admin/notifications', data);
  return response;
}

export async function updateAdminStudent(studentId: string, updates: StudentUpdate) {
  const { data } = await api.put<{ message: string }>(`/admin/students/${studentId}`, updates);
  return data;
}

export async function resetAdminStudentPassword(studentId: string, password: string) {
  const { data } = await api.put<{ message: string }>(
    `/admin/students/${studentId}/password`,
    { password },
  );
  return data;
}

export async function deleteAdminStudent(studentId: string) {
  const { data } = await api.delete<{ message: string }>(`/admin/students/${studentId}`);
  return data;
}

export async function getAdminStudentReport(studentId: string) {
  const { data } = await api.get<StudentReport>(`/admin/students/${studentId}/report`);
  return data;
}

export async function createAdminClass(classData: ClassCreate) {
  const { data } = await api.post<AdminClass>('/admin/classes', classData);
  return data;
}

export async function updateAdminClass(classId: string, updates: ClassUpdate) {
  const { data } = await api.put<{ message: string }>(`/admin/classes/${classId}`, updates);
  return data;
}

export async function deleteAdminClass(classId: string) {
  const { data } = await api.delete<{ message: string }>(`/admin/classes/${classId}`);
  return data;
}

export async function getAdminMonthlyAttendance(classId: string, month: string, signal?: AbortSignal) {
  const { data } = await api.get<AttendanceRecord[]>('/admin/attendance/report', {
    params: { class_id: classId, month },
    signal,
  });
  return data;
}

export async function getAdminAttendanceSummary(classId: string, signal?: AbortSignal) {
  const { data } = await api.get<AttendanceClassSummary>('/admin/attendance/report/summary', {
    params: { class_id: classId },
    signal,
  });
  return data;
}

export async function createAdminStudent(student: StudentCreate) {
  const { data } = await api.post<AdminStudent>('/admin/students', student);
  return data;
}

export async function createAdminTeacher(teacher: TeacherCreate) {
  const { data } = await api.post<AdminTeacher>('/admin/teachers', teacher);
  return data;
}

export async function updateAdminTeacher(teacherId: string, updates: Partial<TeacherCreate>) {
  const { data } = await api.put<{ message: string }>(`/admin/teachers/${teacherId}`, updates);
  return data;
}

export async function deleteAdminTeacher(teacherId: string) {
  const { data } = await api.delete<{ message: string }>(`/admin/teachers/${teacherId}`);
  return data;
}

export async function assignAdminTeacherClasses(teacherId: string, classIds: string[]) {
  const { data } = await api.post<{ message: string }>(`/admin/teachers/${teacherId}/classes`, {
    class_ids: classIds,
  });
  return data;
}

export async function getAdminSchedule(signal?: AbortSignal) {
  const { data } = await api.get<AdminScheduleSession[]>('/admin/schedule', { signal });
  return data;
}

export async function createAdminScheduleSession(session: Omit<AdminScheduleSession, 'id' | 'teacher_name' | 'class_name'>) {
  const { data } = await api.post<AdminScheduleSession>('/admin/schedule', session);
  return data;
}

export async function deleteAdminScheduleSession(sessionId: string) {
  const { data } = await api.delete<{ message: string }>(`/admin/schedule/${sessionId}`);
  return data;
}

export async function getAdminClassStudents(classId: string, signal?: AbortSignal) {
  const { data } = await api.get<AdminStudent[]>(`/admin/classes/${classId}/students`, { signal });
  return data;
}

export async function getAdminPaymentSummary(userId: string, userRole: PaymentSummary['user_role']) {
  const { data } = await api.get<PaymentSummary>(`/admin/payments/${userId}`, { params: { user_role: userRole } });
  return data;
}

export async function updateAdminPaymentState(userId: string, userRole: PaymentSummary['user_role'], paidMonths: number[]) {
  const { data } = await api.put<PaymentSummary>(`/admin/payments/${userId}`, {
    user_role: userRole,
    paid_months: paidMonths,
  });
  return data;
}

export async function checkAdminPaymentDue() {
  const { data } = await api.get<{ created: number }>('/admin/payments/check-due');
  return data;
}

export async function resetAdminTeacherPassword(teacherId: string, password: string) {
  const { data } = await api.put<{ message: string }>(
    `/admin/teachers/${teacherId}/password`,
    { password },
  );
  return data;
}