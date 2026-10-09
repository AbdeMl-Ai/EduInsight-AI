import axios from 'axios';
import { AUTH_SESSION_CHANGED_EVENT } from '@/lib/api';

const backendUrl = (
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'http://127.0.0.1:8000'
).replace(/\/+$/, '');

const api = axios.create({
  baseURL: typeof window === 'undefined' ? backendUrl : '/api-proxy',
  headers: {
    Accept: 'application/json',
  },
});

function readCookie(name: string) {
  if (typeof document === 'undefined') return null;
  const prefix = `${name}=`;
  const value = document.cookie.split('; ').find((item) => item.startsWith(prefix))?.slice(prefix.length);
  return value ? decodeURIComponent(value) : null;
}

api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined'
      ? readCookie('eduinsight_access_token') || localStorage.getItem('eduinsight_access_token')
      : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('eduinsight_access_token');
      localStorage.removeItem('eduinsight_role');
      document.cookie = 'eduinsight_access_token=; Path=/; Max-Age=0; SameSite=Lax';
      window.dispatchEvent(new Event(AUTH_SESSION_CHANGED_EVENT));
      if (window.location.pathname !== '/login') {
        window.location.replace('/login');
      }
    }
    return Promise.reject(error);
  },
);

export default api;
