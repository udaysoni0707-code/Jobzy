'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  X,
  Landmark,
  Building2,
  BookOpen,
  GraduationCap,
  School,
  ShieldCheck,
  BarChart3,
  Users,
  MessageSquare,
  Search,
  LogOut,
  ChevronRight,
  Sparkles,
  Command,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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

  // Close sidebar on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when sidebar drawer is open
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
      router.push('/');
      router.refresh();
    } catch {
      router.push('/');
    }
  };

  const openSearch = () => {
    onClose();
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
  };

  const deskLinks = [
    {
      label: 'Government Desk',
      description: 'DTE & State Shortage Monitoring',
      href: '/dashboard/government',
      icon: Landmark,
      color: 'text-blue-600 dark:text-blue-400',
      badge: 'DTE',
    },
    {
      label: 'Industry Hub',
      description: 'Hiring Signals & Open Requisitions',
      href: '/dashboard/industry',
      icon: Building2,
      color: 'text-indigo-600 dark:text-indigo-400',
      badge: 'OEM',
    },
    {
      label: 'Curriculum Desk',
      description: 'Syllabi & AI Revision Directives',
      href: '/curriculum',
      icon: BookOpen,
      color: 'text-amber-600 dark:text-amber-400',
      badge: 'MSBTE',
    },
    {
      label: 'Student Portal',
      description: 'EV Technician Roadmap & Gaps',
      href: '/dashboard/student',
      icon: GraduationCap,
      color: 'text-emerald-600 dark:text-emerald-400',
      badge: 'Learner',
    },
    {
      label: 'Institute Desk',
      description: 'Polytechnics & ITI Infrastructure',
      href: '/dashboard/institute',
      icon: School,
      color: 'text-purple-600 dark:text-purple-400',
      badge: 'Polytechnic',
    },
    {
      label: 'Admin Governance',
      description: 'Taxonomy Registry & Audit Logs',
      href: '/dashboard/admin',
      icon: ShieldCheck,
      color: 'text-rose-600 dark:text-rose-400',
      badge: 'Master',
    },
  ];

  const intelligenceLinks = [
    {
      label: 'District Intelligence',
      description: '36-District Demand Heatmap',
      href: '/district-intelligence',
      icon: BarChart3,
      color: 'text-cyan-600 dark:text-cyan-400',
    },
  ];

  const communityLinks = [
    {
      label: 'State Skill Network',
      description: 'Peer Mentorship & Connections',
      href: '/connections',
      icon: Users,
      color: 'text-teal-600 dark:text-teal-400',
    },
    {
      label: 'Direct Messages',
      description: 'Stakeholder Communication',
      href: '/messages',
      icon: MessageSquare,
      color: 'text-violet-600 dark:text-violet-400',
    },
  ];

  return (
    <>
      {/* Backdrop overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />

      {/* Slide-out Sidebar Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-80 max-w-[85vw] bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 z-50 flex flex-col shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Jobzy Main Navigation Sidebar"
      >
        {/* Sidebar Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/40">
          <Link href="/" onClick={onClose} className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-blue-600 text-white flex items-center justify-center font-black text-base shadow-sm group-hover:scale-105 transition-transform shrink-0">
              <span className="text-white">JZ</span>
            </div>
            <div>
              <span className="font-extrabold text-lg text-slate-900 dark:text-slate-100 tracking-tight block">
                JOBZY
              </span>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 -mt-0.5">
                Govt. of Maharashtra Initiative
              </p>
            </div>
          </Link>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
            title="Close sidebar (Esc)"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Search Button */}
        <div className="p-3 border-b border-slate-100 dark:border-slate-800/80">
          <button
            onClick={openSearch}
            className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-800 transition-colors group"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 transition-colors" />
              <span>Quick Search / Actions</span>
            </div>
            <span className="font-mono text-[10px] bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
              Ctrl+K
            </span>
          </button>
        </div>

        {/* Scrollable Navigation Items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-5 scrollbar-thin">
          {/* Section: Stakeholder Desks */}
          <div>
            <span className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Stakeholder Desks
            </span>
            <div className="space-y-1">
              {deskLinks.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center justify-between p-2 rounded-xl transition-all ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold shadow-xs'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          isActive
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 ' + item.color
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <span className="text-xs block truncate">{item.label}</span>
                        <span className="text-[10px] text-slate-400 block truncate">
                          {item.description}
                        </span>
                      </div>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-semibold px-1.5 py-0.2 rounded shrink-0 ${
                          isActive
                            ? 'bg-blue-200 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Section: Regional Intelligence */}
          <div>
            <span className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Regional Intelligence
            </span>
            <div className="space-y-1">
              {intelligenceLinks.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center justify-between p-2 rounded-xl transition-all ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold shadow-xs'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          isActive
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 ' + item.color
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <span className="text-xs block truncate">{item.label}</span>
                        <span className="text-[10px] text-slate-400 block truncate">
                          {item.description}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Section: Community & Messages */}
          <div>
            <span className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Network & Collaboration
            </span>
            <div className="space-y-1">
              {communityLinks.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center justify-between p-2 rounded-xl transition-all ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold shadow-xs'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          isActive
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 ' + item.color
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <span className="text-xs block truncate">{item.label}</span>
                        <span className="text-[10px] text-slate-400 block truncate">
                          {item.description}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar Footer: User / Authentication */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
          {currentUser ? (
            <div className="space-y-3">
              <Link
                href={`/dashboard/${currentUser.role.toLowerCase()}`}
                onClick={onClose}
                className="flex items-center gap-3 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-400 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="truncate min-w-0 flex-1">
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
                className="w-full flex items-center justify-center gap-2 py-2 text-xs font-medium text-rose-600 hover:text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out of Session</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <Link href="/login" onClick={onClose} className="block w-full">
                <Button variant="outline" size="sm" className="w-full text-xs">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup" onClick={onClose} className="block w-full">
                <Button variant="primary" size="sm" className="w-full text-xs">
                  Register Account
                </Button>
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
