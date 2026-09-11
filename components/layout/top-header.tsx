'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Sun,
  Moon,
  Menu,
  X,
  LogOut,
  Landmark,
  Building2,
  BookOpen,
  BarChart3,
  Users,
  MessageSquare,
  GraduationCap,
  Sparkles,
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
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
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
      router.push('/');
      router.refresh();
    } catch {
      router.push('/');
    }
  };

  // Search catalog for interactive quick search
  const searchableItems = [
    {
      title: 'Government Desk',
      description: 'Statewide skill deficit & shortage monitoring',
      href: '/dashboard/government',
      icon: Landmark,
      category: 'Desk',
    },
    {
      title: 'Industry Hub',
      description: 'Hiring signals & live employer requisitions',
      href: '/dashboard/industry',
      icon: Building2,
      category: 'Desk',
    },
    {
      title: 'Curriculum Desk',
      description: 'AI syllabus recommendations & MSBTE revisions',
      href: '/curriculum',
      icon: BookOpen,
      category: 'Desk',
    },
    {
      title: 'District Intelligence',
      description: '36-District telemetry heatmap & regional metrics',
      href: '/district-intelligence',
      icon: BarChart3,
      category: 'Intelligence',
    },
    {
      title: 'State Skill Network',
      description: 'Peer collaboration & professional networking',
      href: '/connections',
      icon: Users,
      category: 'Collaboration',
    },
    {
      title: 'Direct Messages',
      description: 'Direct messaging with industry mentors & faculty',
      href: '/messages',
      icon: MessageSquare,
      category: 'Collaboration',
    },
    {
      title: 'Student Portal & Roadmap',
      description: 'EV Technician career path & personalized skill gaps',
      href: '/dashboard/student',
      icon: GraduationCap,
      category: 'Desk',
    },
    {
      title: 'EV Technician & Battery Diagnostics',
      description: 'High-demand automotive engineering specialization',
      href: '/dashboard/student',
      icon: Sparkles,
      category: 'Specialization',
    },
    {
      title: 'Pune Automotive Corridor',
      description: 'Regional manufacturing & EV hub telemetry',
      href: '/district-intelligence',
      icon: BarChart3,
      category: 'District',
    },
    {
      title: 'Chhatrapati Sambhajinagar Engineering Belt',
      description: 'Industrial cluster skill demand & coverage',
      href: '/district-intelligence',
      icon: BarChart3,
      category: 'District',
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
    <header className="sticky top-0 z-20 w-full h-16 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-slate-950/85 backdrop-blur-md px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-3 sm:gap-6 transition-colors">
      {/* Left Section: Mobile Menu Button + Search Bar */}
      <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
        {/* Mobile Toggle Button (Visible only on mobile/tablet) */}
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 -ml-1 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
          aria-label="Open Sidebar Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mobile Brand Monogram (Visible only on mobile when sidebar is closed) */}
        <Link href="/" className="md:hidden flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-slate-900 dark:bg-blue-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
            JZ
          </div>
          <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100 tracking-tight hidden xs:inline">
            JOBZY
          </span>
        </Link>

        {/* 2. PROMINENT SEARCH BAR (Native style, responsive, NO Ctrl+K) */}
        <div ref={searchContainerRef} className="relative flex-1 max-w-md sm:max-w-lg min-w-0">
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
              placeholder="Search anything..."
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

          {/* Interactive Live Search Dropdown */}
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
                  No matching desks, roles, or districts found for &ldquo;{searchQuery}&rdquo;
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Section: Theme Toggle + Auth Controls */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleDarkMode}
          className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Toggle Theme"
          title="Toggle Dark/Light Mode"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Auth status (matches reference design) */}
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
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 block truncate max-w-[120px]">
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
              <button className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-xl shadow-xs transition-colors cursor-pointer">
                Register
              </button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
