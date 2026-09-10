'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  ChevronUp,
  ChevronDown,
  User,
  Building2,
  GraduationCap,
  Landmark,
  ShieldCheck,
  Moon,
  Sun,
  Zap,
} from 'lucide-react';
import { useToast } from '@/components/ui/toast';

export function DemoBar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const demoRoles = [
    {
      role: 'STUDENT',
      name: 'Aarav Deshmukh (Student)',
      email: 'student@skillalign.gov.in',
      icon: User,
      targetPath: '/dashboard/student',
      badge: 'EV Technician Focus',
    },
    {
      role: 'INDUSTRY',
      name: 'Tata Motors EV Systems',
      email: 'industry@tatamotors.com',
      icon: Building2,
      targetPath: '/dashboard/industry',
      badge: 'Automotive Cluster',
    },
    {
      role: 'INSTITUTE',
      name: 'Govt Polytechnic Pune',
      email: 'institute@msbte.ac.in',
      icon: GraduationCap,
      targetPath: '/dashboard/institute',
      badge: 'MSBTE Affiliated',
    },
    {
      role: 'GOVERNMENT',
      name: 'DTE Maharashtra Desk',
      email: 'government@maharashtra.gov.in',
      icon: Landmark,
      targetPath: '/dashboard/government',
      badge: '36 Districts',
    },
    {
      role: 'ADMIN',
      name: 'Platform Administrator',
      email: 'admin@skillalign.gov.in',
      icon: ShieldCheck,
      targetPath: '/dashboard/admin',
      badge: 'Full Access',
    },
  ];

  const switchRole = async (item: typeof demoRoles[0]) => {
    setIsSwitching(true);
    try {
      const res = await fetch('/api/auth/demo-switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: item.email }),
      });

      if (res.ok) {
        toast.success(`Switched perspective to ${item.name}`, `Loaded ${item.role} dashboard view.`);
        router.push(item.targetPath);
        router.refresh();
      } else {
        toast.error('Failed to switch role');
      }
    } catch (e) {
      toast.error('Network error switching role');
    } finally {
      setIsSwitching(false);
    }
  };

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
  };

  return (
    <aside aria-label="SIH 2026 Judge Demo Controller" className="fixed bottom-4 left-4 z-40">
      <div className="bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700/80 p-2 backdrop-blur-md">
        {isExpanded && (
          <div className="p-3 mb-2 border-b border-slate-800 space-y-2 w-72 animate-slide-up">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                SIH 2026 Judge Controller
              </span>
              <span className="text-[10px] bg-blue-600 px-1.5 py-0.5 rounded font-mono">SIH26134</span>
            </div>

            <p className="text-[11px] text-slate-400">
              1-Click Stakeholder Switching for evaluation:
            </p>

            <div className="space-y-1">
              {demoRoles.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.role}
                    disabled={isSwitching}
                    onClick={() => switchRole(item)}
                    className="w-full flex items-center justify-between p-2 rounded-lg text-left text-xs hover:bg-slate-800 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 text-blue-400" />
                      <span className="font-medium text-slate-200 group-hover:text-white">{item.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                      {item.role}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <button
                onClick={toggleTheme}
                className="flex items-center gap-1.5 text-slate-400 hover:text-white p-1 rounded transition-colors"
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Toggle Dark Theme</span>
              </button>
              <button
                onClick={() => {
                  const ev = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true });
                  window.dispatchEvent(ev);
                }}
                className="text-[11px] text-blue-400 hover:underline"
              >
                Ctrl+K Menu
              </button>
            </div>
          </div>
        )}

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:text-white transition-colors cursor-pointer"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Demo Controller</span>
          {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronUp className="w-3.5 h-3.5 text-slate-400" />}
        </button>
      </div>
    </aside>
  );
}
