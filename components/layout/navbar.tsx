'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  Command,
  Sun,
  Moon,
  Menu,
  X,
  User,
  LogOut,
  Bell,
  MessageSquare,
  Users,
  Shield,
  ChevronDown,
} from 'lucide-react';
import { useToast } from '@/components/ui/toast';

interface NavbarProps {
  currentUser?: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
}

export function Navbar({ currentUser }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState(3);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains('dark'));
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
    } catch (e) {
      router.push('/');
    }
  };

  const navLinks = [
    { label: 'Government Desk', href: '/dashboard/government', role: 'GOVERNMENT' },
    { label: 'Industry Hub', href: '/dashboard/industry', role: 'INDUSTRY' },
    { label: 'Curriculum Desk', href: '/curriculum', role: 'INSTITUTE' },
    { label: 'District Intelligence', href: '/district-intelligence' },
    { label: 'Network', href: '/connections' },
    { label: 'Messages', href: '/messages' },
  ];

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-900 dark:bg-blue-600 text-white flex items-center justify-center font-black text-base sm:text-lg shadow-sm group-hover:scale-105 transition-transform shrink-0">
              <span className="text-white">JZ</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-slate-100 tracking-tight">
                  JOBZY
                </span>
                <span className="hidden sm:inline-flex text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-1.5 py-0.2 rounded border border-blue-200 dark:border-blue-900">
                  SIH26134
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 -mt-0.5 hidden sm:block">
                Govt. of Maharashtra Initiative
              </p>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Action Icons & Auth */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Quick command palette button */}
          <button
            onClick={() => {
              const ev = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true });
              window.dispatchEvent(ev);
            }}
            className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
            title="Search & Quick Actions (Ctrl+K)"
          >
            <Command className="w-3.5 h-3.5" />
            <span className="font-mono text-[11px]">Ctrl+K</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleDarkMode}
            className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User Session status */}
          {currentUser ? (
            <div className="flex items-center gap-1 sm:gap-2 pl-1 sm:pl-2 border-l border-slate-200 dark:border-slate-800">
              <Link
                href={`/dashboard/${currentUser.role.toLowerCase()}`}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
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
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="primary" size="sm">
                  Register
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {link.label}
            </Link>
          ))}
          {!currentUser && (
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
              <Link href="/login" className="flex-1" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="outline" size="sm" className="w-full">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup" className="flex-1" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="primary" size="sm" className="w-full">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
