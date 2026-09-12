'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Search,
  Sun,
  Moon,
  Menu,
  X,
  LogOut,
  Bell,
  Landmark,
  Building2,
  BookOpen,
  BarChart3,
  Users,
  MessageSquare,
  GraduationCap,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';

interface TopHeaderProps {
  onOpenMobileMenu: () => void;
  currentUser?: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
}

export function TopHeader({ onOpenMobileMenu, currentUser }: TopHeaderProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(2);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const toast = useToast();

  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains('dark'));
  }, []);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDarkMode = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    setIsDarkMode(isDark);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      toast.info('Logged out successfully', 'You have ended your active session.');
      router.push('/login');
      router.refresh();
    } catch {
      router.push('/login');
    }
  };

  // Breadcrumb generation based on route
  const getBreadcrumb = () => {
    if (pathname === '/') return { section: 'Platform', page: 'Skill Intelligence Overview' };
    if (pathname.includes('/government')) return { section: 'Workspace', page: 'Government Desk' };
    if (pathname.includes('/industry')) return { section: 'Workspace', page: 'Industry Hub' };
    if (pathname.includes('/curriculum')) return { section: 'Workspace', page: 'Curriculum Desk' };
    if (pathname.includes('/district-intelligence')) return { section: 'Insights', page: 'District Intelligence' };
    if (pathname.includes('/connections')) return { section: 'Network', page: 'Connections' };
    if (pathname.includes('/messages')) return { section: 'Network', page: 'Messages' };
    if (pathname.includes('/student')) return { section: 'Portals', page: 'Student Roadmap' };
    if (pathname.includes('/institute')) return { section: 'Portals', page: 'Institute Desk' };
    if (pathname.includes('/admin')) return { section: 'Portals', page: 'Admin Governance' };
    return { section: 'Jobzy', page: 'Dashboard' };
  };

  const breadcrumb = getBreadcrumb();

  // Search catalog for interactive search
  const searchableItems = [
    {
      title: 'Government Desk',
      description: 'DTE & State Shortage Monitoring for 36 Districts',
      href: '/dashboard/government',
      icon: Landmark,
      category: 'Workspace',
    },
    {
      title: 'Industry Hub',
      description: 'Hiring signals, employer requisitions & talent pipeline',
      href: '/dashboard/industry',
      icon: Building2,
      category: 'Workspace',
    },
    {
      title: 'Curriculum Desk',
      description: 'MSBTE syllabus modules & AI adaptation directives',
      href: '/curriculum',
      icon: BookOpen,
      category: 'Workspace',
    },
    {
      title: 'District Intelligence',
      description: '36-District telemetry heatmap & deficit scoring',
      href: '/district-intelligence',
      icon: BarChart3,
      category: 'Insights',
    },
    {
      title: 'State Skill Network',
      description: 'Professional networking with peer learners & mentors',
      href: '/connections',
      icon: Users,
      category: 'Network',
    },
    {
      title: 'Direct Messages',
      description: 'Direct messaging with faculty, industry & alumni',
      href: '/messages',
      icon: MessageSquare,
      category: 'Network',
    },
    {
      title: 'EV Technician & Diagnostic Specialist',
      description: 'Auto sector: BMS, high-voltage safety & fast charging',
      href: '/dashboard/student',
      icon: Sparkles,
      category: 'Careers',
    },
    {
      title: 'Pune Automotive & Clean Mobility Corridor',
      description: 'Chakan & Talegaon EV cluster hiring demand',
      href: '/district-intelligence',
      icon: BarChart3,
      category: 'Districts',
    },
    {
      title: 'Mumbai IT & Cybersecurity Zone',
      description: 'Cloud computing, threat detection & DevOps telemetry',
      href: '/district-intelligence',
      icon: BarChart3,
      category: 'Districts',
    },
  ];

  const filteredResults = searchQuery.trim()
    ? searchableItems.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSelectResult = (href: string) => {
    router.push(href);
    setSearchQuery('');
    setIsDropdownOpen(false);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && filteredResults.length > 0) {
      e.preventDefault();
      handleSelectResult(filteredResults[0].href);
    }
    if (e.key === 'Escape') {
      setIsDropdownOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-20 w-full h-16 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-3 sm:gap-6 transition-colors shadow-2xs">
      {/* Left Section: Breadcrumb / Mobile Menu Toggle */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 -ml-1 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Open Sidebar Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop Breadcrumb */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-medium text-slate-400 dark:text-slate-500">{breadcrumb.section}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">{breadcrumb.page}</span>
        </div>
      </div>

      {/* Center Section: Large Search Bar (NO Ctrl+K) */}
      <div ref={searchContainerRef} className="relative flex-1 max-w-xl min-w-0">
        <div className="relative flex items-center w-full">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 pointer-events-none shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsDropdownOpen(true);
            }}
            onFocus={() => {
              if (searchQuery.trim().length > 0) setIsDropdownOpen(true);
            }}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search jobs, skills, districts, industries..."
            className="w-full h-10 pl-10 pr-8 text-xs sm:text-sm bg-slate-100/90 dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-xl border border-slate-200/80 dark:border-slate-800/80 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setIsDropdownOpen(false);
              }}
              className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Live Search Dropdown */}
        {isDropdownOpen && searchQuery.trim().length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 max-h-80 overflow-y-auto space-y-1 animate-in fade-in-50 duration-150">
            {filteredResults.length > 0 ? (
              filteredResults.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectResult(item.href)}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 block truncate">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {item.description}
                      </p>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="p-4 text-center text-xs text-slate-400">
                No matching results found for &ldquo;{searchQuery}&rdquo;
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Section: Notification + Theme Toggle + Auth Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Notification Icon with Badge */}
        <Link
          href="/messages"
          className="relative p-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Notifications & Alerts"
        >
          <Bell className="w-4 h-4" />
          {unreadNotifications > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white dark:ring-slate-950" />
          )}
        </Link>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleDarkMode}
          className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Toggle Theme"
          title="Toggle Dark/Light Mode"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Auth controls */}
        {currentUser ? (
          <div className="flex items-center gap-1 sm:gap-2 pl-1 sm:pl-2 border-l border-slate-200 dark:border-slate-800">
            <Link
              href={`/dashboard/${currentUser.role.toLowerCase()}`}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-xs shrink-0">
                {currentUser.name.charAt(0)}
              </div>
              <div className="hidden lg:block text-left">
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 block truncate max-w-[110px]">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                  {currentUser.role}
                </span>
              </div>
            </Link>
            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs font-medium text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <button className="px-3.5 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-xl shadow-xs transition-colors cursor-pointer">
                Register
              </button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
