'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminAuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 1️⃣ Not logged in → go to login
    if (!loading && !user) {
      router.replace('/login');
      return;
    }

    // 2️⃣ Logged in → role-based redirect (only when needed)
    if (!loading && user) {
      if (pathname === '/admin' || pathname === '/admin/') {
        if (user.role === 'admin') {
          router.replace('/admin/dashboard');
        } else if (user.role === 'client') {
          router.replace('/client/dashboard');
        }
      }
    }
  }, [loading, user, pathname, router]);

  // 3️⃣ Prevent flash
  if (loading) return null;
  if (!user) return null;

  return <>{children}</>;
}