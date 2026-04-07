'use client';

import { SessionProvider } from 'next-auth/react';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="flex min-h-screen -mt-16 pt-16">
        <AdminSidebar />
        <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {children}
        </div>
      </div>
    </SessionProvider>
  );
}
