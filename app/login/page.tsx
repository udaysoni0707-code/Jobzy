'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Lock, Mail, ShieldCheck, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(`Welcome back, ${data.user.name}`, `Signed in as ${data.user.role}.`);
        router.push(`/dashboard/${data.user.role.toLowerCase()}`);
        router.refresh();
      } else {
        toast.error('Authentication failed', data.error || 'Please check your credentials.');
      }
    } catch (err) {
      toast.error('Network error', 'Unable to reach the server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoAccount = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Demo@123');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">
        {/* Left Side: Brand Context */}
        <div className="p-8 sm:p-10 bg-slate-900 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -z-10" />

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 border border-blue-400/30 text-blue-300 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Smart India Hackathon 2026</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Jobzy
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
              Industry–Skill Intelligence & Curriculum Alignment Platform for the Government of Maharashtra.
            </p>

            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Statewide 36-district shortage analytics</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Explainable AI curriculum recommendation engine</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Multi-role access control for students, institutes & OEMs</span>
              </div>
            </div>
          </div>

          {/* Quick Demo Pre-fill for Judges */}
          <div className="mt-8 pt-6 border-t border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Judge Evaluation Accounts (1-Click Fill):
            </span>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => fillDemoAccount('student@skillalign.gov.in')}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-left text-slate-200 transition-colors"
              >
                Student (Aarav)
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('industry@tatamotors.com')}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-left text-slate-200 transition-colors"
              >
                Industry (Tata Motors)
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('institute@msbte.ac.in')}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-left text-slate-200 transition-colors"
              >
                Institute (GP Pune)
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('government@maharashtra.gov.in')}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-left text-slate-200 transition-colors"
              >
                Govt (DTE Maharashtra)
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-8 sm:p-10 flex flex-col justify-center">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Sign In</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Enter your credentials to access your stakeholder desk.
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@organization.gov.in"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <span className="text-[11px] text-slate-400">Demo pwd: Demo@123</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isLoading}
              className="w-full mt-2"
            >
              Sign In to Platform
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
