export function getStoredUser() {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('user');
  return raw ? JSON.parse(raw) : null;
}

export function useAuth() {
  const user = getStoredUser();

  return {
    user,
    isAdmin: user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN',
    isClient: !!user?.id,
  };
}