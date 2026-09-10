'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Command,
  LayoutDashboard,
  Building2,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  MapPin,
  Sparkles,
  Users,
  MessageSquare,
  BookOpen,
  Sun,
  Moon,
  X,
} from 'lucide-react';

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
    setIsOpen(false);
  };

  const navigateTo = (path: string) => {
    router.push(path);
    setIsOpen(false);
  };

  const actions = [
    {
      title: 'Government Dashboard (Statewide Maharashtra)',
      subtitle: '36 Districts, Heatmap, Skill Shortages, Policy Intelligence',
      icon: LayoutDashboard,
      role: 'Government',
      action: () => navigateTo('/dashboard/government'),
    },
    {
      title: 'Industry Demand Portal',
      subtitle: 'Submit Job Requirements, Talent Availability, Market Signals',
      icon: Building2,
      role: 'Industry',
      action: () => navigateTo('/dashboard/industry'),
    },
    {
      title: 'Institute Curriculum Alignment Desk',
      subtitle: 'MSBTE/ITI Course Mapping, Gap Detection, Module Approvals',
      icon: GraduationCap,
      role: 'Institute',
      action: () => navigateTo('/dashboard/institute'),
    },
    {
      title: 'Student Learning & Career Roadmap',
      subtitle: 'Target Role (EV Technician), Readiness Score, Skill Progression',
      icon: Briefcase,
      role: 'Student',
      action: () => navigateTo('/dashboard/student'),
    },
    {
      title: 'Interactive District Skill Heatmap',
      subtitle: 'Statewide Geo-Intelligence across Maharashtra Districts',
      icon: MapPin,
      role: 'Analytics',
      action: () => navigateTo('/district-intelligence'),
    },
    {
      title: 'AI Skill Extraction & Normalizer',
      subtitle: 'Live Natural Language Processing & Synonym Taxonomy Engine',
      icon: Sparkles,
      role: 'AI / NLP',
      action: () => navigateTo('/curriculum'),
    },
    {
      title: 'Connections & Professional Networking',
      subtitle: 'Mutuals, Connect Requests, State Skill Network',
      icon: Users,
      role: 'Social',
      action: () => navigateTo('/connections'),
    },
    {
      title: 'Collaboration Messages',
      subtitle: 'Direct Messaging with Industry Mentors and Peers',
      icon: MessageSquare,
      role: 'Collaboration',
      action: () => navigateTo('/messages'),
    },
    {
      title: 'System Admin & Moderation Panel',
      subtitle: 'User Verification, Taxonomy Registry, Audit Logs',
      icon: ShieldCheck,
      role: 'Admin',
      action: () => navigateTo('/dashboard/admin'),
    },
    {
      title: 'Toggle Dark / Light Theme',
      subtitle: 'Switch application color mode',
      icon: Moon,
      role: 'System',
      action: toggleDarkMode,
    },
  ];

  const filtered = actions.filter(
    (a) =>
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.subtitle.toLowerCase().includes(query.toLowerCase()) ||
      a.role.toLowerCase().includes(query.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-10 animate-slide-up">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Type a command, dashboard, or feature (e.g. EV, Government, Heatmap)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
              No matching commands found.
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={item.action}
                  className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/60 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center justify-center text-slate-600 dark:text-slate-400 transition-colors shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                        {item.title}
                      </span>
                      <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                        {item.role}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{item.subtitle}</p>
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Navigate with mouse or keyboard</span>
          <span>Press Ctrl+K anytime</span>
        </div>
      </div>
    </div>
  );
}
