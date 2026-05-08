import { AppTopNav } from '@/components/AppTopNav';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { QuickActionDock } from '@/components/QuickActionDock';
import React from 'react';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full">
      <AppTopNav />
      <main className="min-h-[calc(100vh-57px)] overflow-auto p-4 pb-24 md:p-6 lg:pb-6">
        {children}
      </main>
      <MobileBottomNav />
      <QuickActionDock />
    </div>
  );
}
