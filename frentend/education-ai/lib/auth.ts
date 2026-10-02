export function handleLogout() {
  if (typeof window === 'undefined') return;

  localStorage.clear();
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `eduinsight_access_token=; Path=/; Max-Age=0; SameSite=Lax${secure}`;
  window.location.replace('/login');
}
