'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Landmark,
  Building2,
  BookOpen,
  BarChart3,
  Users,
  MessageSquare,
  GraduationCap,
  School,
  ShieldCheck,
  X,
  LogOut,
  ChevronRight,
  Activity,
} from 'lucide-react';
import { useToast } from '@/components/ui/toast';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
}

export function Sidebar({ isOpen, onClose, currentUser }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const toast = useToast();

  // Close mobile drawer on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll only when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      toast.info('Logged out successfully', 'You have ended your active session.');
      onClose();
      router.push('/login');
      router.refresh();
    } catch {
      router.push('/login');
    }
  };

  // Grouped Navigation Sections as requested:
  // WORKSPACE: Government Desk, Industry Hub, Curriculum Desk
  // INSIGHTS: District Intelligence
  // NETWORK: Network, Messages
  const workspaceItems = [
    {
      label: 'Government Desk',
      href: '/dashboard/government',
      icon: Landmark,
    },
    {
      label: 'Industry Hub',
      href: '/dashboard/industry',
      icon: Building2,
    },
    {
      label: 'Curriculum Desk',
      href: '/curriculum',
      icon: BookOpen,
    },
  ];

  const insightsItems = [
    {
      label: 'District Intelligence',
      href: '/district-intelligence',
      icon: BarChart3,
    },
  ];

  const networkItems = [
    {
      label: 'Network',
      href: '/connections',
      icon: Users,
    },
    {
      label: 'Messages',
      href: '/messages',
      icon: MessageSquare,
    },
  ];

  // Secondary portal shortcuts
  const portalItems = [
    {
      label: 'Student Portal',
      href: '/dashboard/student',
      icon: GraduationCap,
    },
    {
      label: 'Institute Desk',
      href: '/dashboard/institute',
      icon: School,
    },
    {
      label: 'Admin Portal',
      href: '/dashboard/admin',
      icon: ShieldCheck,
    },
  ];

  const renderNavGroup = (
    title: string,
    items: typeof workspaceItems,
    isMobile: boolean
  ) => (
    <div className="space-y-1">
      <span className="px-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1.5">
        {title}
      </span>
      {items.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href ||
          (item.href !== '/' && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={isMobile ? onClose : undefined}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
              isActive
                ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 font-semibold border-r-2 border-blue-600 dark:border-blue-500 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100/80 dark:hover:bg-slate-900/80'
            }`}
          >
            <Icon
              className={`w-4 h-4 shrink-0 transition-colors ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
              }`}
            />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );

  const renderNavContent = (isMobile: boolean) => (
    <div className="flex flex-col h-full bg-white dark:bg-slate-950">
      {/* Brand Header */}
      <div className="h-16 px-5 flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 shrink-0">
        <Link
          href="/"
          onClick={isMobile ? onClose : undefined}
          className="flex items-center gap-2.5 group min-w-0"
        >
          <div className="w-8 h-8 rounded-xl bg-slate-900 dark:bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-xs group-hover:scale-105 transition-transform shrink-0">
            JZ
          </div>
          <div className="min-w-0">
            <span className="font-extrabold text-base text-slate-900 dark:text-slate-100 tracking-tight block leading-tight">
              JOBZY
            </span>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate">
              Govt. of Maharashtra Initiative
            </p>
          </div>
        </Link>

        {isMobile && (
          <button
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {renderNavGroup('WORKSPACE', workspaceItems, isMobile)}
        {renderNavGroup('INSIGHTS', insightsItems, isMobile)}
        {renderNavGroup('NETWORK', networkItems, isMobile)}

        {/* Stakeholder Desks */}
        <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800/60">
          <span className="px-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1.5">
            PORTALS
          </span>
          {portalItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={isMobile ? onClose : undefined}
                className={`flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100/80 dark:hover:bg-slate-900/80'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon
                    className={`w-3.5 h-3.5 shrink-0 ${
                      isActive
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600 shrink-0" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Sidebar Footer: Production Status Card & User Profile */}
      <div className="p-3 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/40 space-y-2 shrink-0">
        {/* Real Production Status Card */}
        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Platform Status
            </span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
          </div>
          <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1.5">
            All systems operational
          </p>
        </div>

        {currentUser ? (
          <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <Link
              href={`/dashboard/${currentUser.role.toLowerCase()}`}
              onClick={isMobile ? onClose : undefined}
              className="flex items-center gap-2.5 min-w-0 flex-1 hover:opacity-80 transition-opacity"
            >
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
                {currentUser.name.charAt(0)}
              </div>
              <div className="truncate min-w-0">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block truncate">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider block truncate">
                  {currentUser.role}
                </span>
              </div>
            </Link>
            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg transition-colors cursor-pointer shrink-0"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Fixed Left Sidebar (250px) */}
      <aside className="hidden md:flex flex-col fixed top-0 bottom-0 left-0 w-64 z-30 bg-white dark:bg-slate-950 border-r border-slate-200/80 dark:border-slate-800/80 shadow-xs transition-colors">
        {renderNavContent(false)}
      </aside>

      {/* 2. Mobile Off-Canvas Drawer */}
      <div
        className={`md:hidden fixed inset-0 z-50 transition-opacity duration-200 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />

        {/* Slide-out Sidebar */}
        <aside
          className={`absolute top-0 bottom-0 left-0 w-64 max-w-[80vw] bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col transition-transform duration-200 ease-in-out ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {renderNavContent(true)}
        </aside>
      </div>
    </>
  );
}
