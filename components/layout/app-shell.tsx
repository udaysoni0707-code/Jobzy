'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './sidebar';
import { TopHeader } from './top-header';
import { Footer } from './footer';

interface AppShellProps {
  children: React.ReactNode;
  currentUser?: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
}

export function AppShell({ children, currentUser }: AppShellProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const pathname = usePathname() || '';

  // Check if current route is an authentication portal route
  const isAuthRoute =
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/forgot-password');

  // If on authentication pages or no authenticated session, render clean standalone view without dashboard navigation
  if (isAuthRoute || !currentUser) {
    return (
      <main className="min-h-screen w-full bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 antialiased overflow-x-hidden">
        {children}
      </main>
    );
  }

  return (
    <div className="min-h-screen flex w-full bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 antialiased overflow-x-hidden">
      {/* 1. Left Sidebar (Fixed on desktop, drawer on mobile) */}
      <Sidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        currentUser={currentUser}
      />

      {/* 2. Main Content Area (Offset by 256px on desktop: md:pl-64) */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen w-full min-w-0 transition-all duration-200">
        {/* Top Header with prominent Search Bar & Auth controls */}
        <TopHeader
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
          currentUser={currentUser}
        />

        {/* Scrollable Page Content */}
        <main className="flex-1 w-full">{children}</main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
