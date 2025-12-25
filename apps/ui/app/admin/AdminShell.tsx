'use client';

import AdminAuthGuard from './AdminAuthGuard';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthGuard>
      <div className="flex min-h-screen bg-slate-50">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Area */}
        <div className="flex flex-1 flex-col">
          <Header />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </AdminAuthGuard>
  );
}