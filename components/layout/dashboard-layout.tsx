"use client";

import { ReactNode } from 'react';
import { useAuthGuard } from '@/lib/utils/auth-guard';
import { PageHeader } from './page-header';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  actions?: ReactNode;
}

export function DashboardLayout({ children, title, actions }: DashboardLayoutProps) {
  useAuthGuard();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <PageHeader title={title}>
          {actions}
        </PageHeader>
        {children}
      </div>
    </div>
  );
}