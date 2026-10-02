import api from '@/lib/axios';

export type TeacherProfile = {
  teacher_id: string;
  full_name: string;
  email: string;
  phone_number: string;
  specialties: string[];
  classes: TeacherClass[];
  active_classes: number;
  total_students: number;
};

export type TeacherCourse = {
  id: string;
  class_id: string;
  title: string;
  description: string;
  content_url: string;
  created_at: string;
};

export type TeacherClass = {
  class_id: string;
  name: string;
  academic_year: string;
  subject: string;
};

export type TeacherStudent = {
  student_id: string;
  full_name: string;
  email: string;
  class_id: string;
};

export type TeacherExercise = {
  id: string;
  class_id: string;
  course_id: string;
  course_title: string;
  description: string;
  max_score: number;
  due_date: string | null;
  created_at: string;
};

export type TeacherSubmission = {
  id: string;
  student_id: string;
  student_name: string;
  exercise_id: string;
  file_url: string;
  student_note: string;
  score: number | null;
};

export type TeacherSchedule = {
  id: string;
  class_id: string;
  class_name: string;
  level: string;
  day: string;
  start_time: string;
  end_time: string;
  subject: string;
};

export type TeacherNotification = {
  id: string;
  message: string;
  notification_type: string;
  is_read: boolean;
  created_at: string;
};

export async function getTeacherProfile(signal?: AbortSignal) {
  const { data } = await api.get<TeacherProfile>('/teacher/me', { signal });
  return data;
}

export async function getTeacherClasses(signal?: AbortSignal) {
  const { data } = await api.get<TeacherClass[]>('/teacher/classes', { signal });
  return data;
}

export async function getTeacherSchedule(signal?: AbortSignal) {
  const { data } = await api.get<TeacherSchedule[]>('/teacher/schedule', { signal });
  return data;
}

export async function getTeacherNotifications(signal?: AbortSignal) {
  const { data } = await api.get<TeacherNotification[]>('/teacher/notifications', { signal });
  return data;
}

export async function sendTeacherMessage(payload: { target_type: 'admin' | 'class' | 'student'; target_id: string; subject: string; message: string }) {
  const { data } = await api.post<{ message: string }>('/teacher/messages', payload);
  return data;
}

export async function getTeacherStudents(classId: string, signal?: AbortSignal) {
  const { data } = await api.get<TeacherStudent[]>(`/teacher/classes/${classId}/students`, { signal });
  return data;
}

export async function getTeacherExercises(signal?: AbortSignal) {
  const { data } = await api.get<TeacherExercise[]>('/teacher/exercises', { signal });
  return data;
}

export async function getTeacherSubmissions(signal?: AbortSignal) {
  const { data } = await api.get<TeacherSubmission[]>('/teacher/me/submissions', { signal });
  return data;
}

export function getTeacherAssetUrl(path: string) {
  if (/^https?:\/\//i.test(path)) return path;
  const baseUrl = api.defaults.baseURL || '';
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

export async function createTeacherGradedWork(payload: {
  class_id: string;
  course_id?: string;
  title: string;
  description: string;
  max_score: number;
  due_date: string;
  file?: File;
}) {
  const form = new FormData();
  form.append('class_id', payload.class_id);
  if (payload.course_id) form.append('course_id', payload.course_id);
  form.append('title', payload.title);
  form.append('description', payload.description);
  form.append('max_score', String(payload.max_score));
  form.append('due_date', payload.due_date);
  if (payload.file) form.append('file', payload.file);
  const { data } = await api.post<TeacherExercise>('/teacher/exercises', form);
  return data;
}

export async function saveTeacherGrade(exerciseId: string, studentId: string, score: number) {
  const { data } = await api.post<{ message: string }>('/teacher/grades', [{ exercise_id: exerciseId, student_id: studentId, score }]);
  return data;
}

export async function getTeacherCourses(signal?: AbortSignal) {
  const { data } = await api.get<TeacherCourse[]>('/teacher/courses', { signal });
  return data;
}

export async function createTeacherCourse(payload: { class_id: string; title: string; description: string; content_url: string; file?: File }) {
  const form = new FormData();
  form.append('class_id', payload.class_id);
  form.append('title', payload.title);
  form.append('description', payload.description);
  form.append('content_url', payload.content_url);
  if (payload.file) form.append('file', payload.file);
  const { data } = await api.post<TeacherCourse>('/teacher/courses', form);
  return data;
}

export async function updateTeacherCourse(courseId: string, payload: { title: string; description: string; file?: File }) {
  const form = new FormData();
  form.append('title', payload.title);
  form.append('description', payload.description);
  if (payload.file) form.append('file', payload.file);
  const { data } = await api.put<{ message: string }>(`/teacher/courses/${courseId}`, form);
  return data;
}

export async function deleteTeacherCourse(courseId: string) {
  const { data } = await api.delete<{ message: string }>(`/courses/${courseId}`);
  return data;
}

export async function updateTeacherExercise(exerciseId: string, payload: { course_title: string; max_score: number; file?: File }) {
  const form = new FormData();
  form.append('course_title', payload.course_title);
  form.append('max_score', String(payload.max_score));
  if (payload.file) form.append('file', payload.file);
  const { data } = await api.put<{ message: string }>(`/teacher/exercises/${exerciseId}`, form);
  return data;
}

export async function deleteTeacherExercise(exerciseId: string) {
  const { data } = await api.delete<{ message: string }>(`/exercises/${exerciseId}`);
  return data;
}

export function getTeacherErrorMessage(error: unknown, fallback: string) {
  if (error && typeof error === 'object' && 'response' in error) {
    const detail = (error as { response?: { data?: { detail?: unknown } } }).response?.data?.detail;
    if (typeof detail === 'string') return detail;
  }
  return error instanceof Error ? error.message : fallback;
}
