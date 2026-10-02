import axios from 'axios';
import api from '@/lib/axios';

export const ACTIVE_STUDENT_CLASS_KEY = 'eduinsight_active_student_class_id';

export type StudentProfile = {
  student_id: string;
  full_name: string;
  email: string;
  level_academy: string;
  age: number;
  class_ids?: string[];
};

export type StudentClass = {
  id: string;
  class_name: string;
  class_level: string;
  subject: string;
};

export type StudentCourse = {
  id: string;
  title: string;
  description: string;
  teacher_id: string;
  class_id: string;
  material_file_path: string | null;
};

export type StudentExercise = {
  id: string;
  course_id: string;
  class_id: string;
  course_title: string;
  file_path: string;
  material_file_path: string | null;
  max_score: number;
  score: number | null;
  submission_status: string | null;
};

export type StudentSubmission = {
  id: string;
  student_id: string;
  exercise_id: string;
  submission_status: string;
  file_path: string;
  student_note: string;
  score: number | null;
  submitted_at: string | null;
  graded_at: string | null;
};

export type StudentGrade = {
  submission_id: string;
  score: number;
  exercise_id: string;
  graded_at: string | null;
};

export type StudentNotification = {
  student_notification_id: string;
  notification_id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  reference_link?: string | null;
};

export function getApiErrorMessage(error: unknown, fallback: string) {
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

export function getStudentAssetUrl(path: string) {
  if (/^https?:\/\//i.test(path)) return path;
  const baseUrl = api.defaults.baseURL || '';
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

export async function getStudentProfile(signal?: AbortSignal) {
  const { data } = await api.get<StudentProfile>('/students/me', { signal });
  return data;
}

export async function getStudentCourses(signal?: AbortSignal) {
  const { data } = await api.get<StudentCourse[]>('/students/me/courses', { signal });
  return data;
}

export async function getStudentExercises(signal?: AbortSignal) {
  const { data } = await api.get<StudentExercise[]>('/students/me/exercises', { signal });
  return data;
}

export async function getStudentSubmissions(signal?: AbortSignal) {
  const { data } = await api.get<StudentSubmission[]>('/students/me/submissions', { signal });
  return data;
}

export async function createStudentSubmission(exerciseId: string, file: File, studentNote = '') {
  const form = new FormData();
  form.append('exercise_id', exerciseId);
  form.append('file', file);
  form.append('student_note', studentNote);
  const { data } = await api.post<StudentSubmission>('/students/me/submissions', form);
  return data;
}

export async function replaceStudentSubmission(submissionId: string, file: File, studentNote = '') {
  const form = new FormData();
  form.append('file', file);
  form.append('student_note', studentNote);
  const { data } = await api.put<StudentSubmission>(
    `/students/me/submissions/${submissionId}`,
    form,
  );
  return data;
}

export async function getStudentGrades(signal?: AbortSignal) {
  const { data } = await api.get<StudentGrade[]>('/students/me/grades', { signal });
  return data;
}

export async function getStudentNotifications(signal?: AbortSignal) {
  const { data } = await api.get<StudentNotification[]>('/students/me/notifications', { signal });
  return data;
}

export async function markStudentNotificationRead(notificationId: string) {
  const { data } = await api.patch<{ message: string }>(`/notifications/${notificationId}/read`);
  return data;
}

export async function getStudentClasses(signal?: AbortSignal) {
  const { data } = await api.get<StudentClass[]>('/students/me/classes', { signal });
  return data;
}