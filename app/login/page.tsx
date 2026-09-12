'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Building2,
  GraduationCap,
  Landmark,
  School,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  Loader2,
  RefreshCw,
  Cpu,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { MAHARASHTRA_DISTRICTS } from '@/lib/taxonomy';

type AuthMode = 'signin' | 'signup' | 'forgot';
type UserRole = 'STUDENT' | 'INDUSTRY' | 'INSTITUTE' | 'GOVERNMENT';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRedirect = searchParams.get('redirect') || '';
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'signin';

  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('STUDENT');
  const [district, setDistrict] = useState('Pune');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Reset errors when mode changes
  useEffect(() => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setForgotSuccess(false);
  }, [mode]);

  // 1-Click Judge Evaluation Pre-fill
  const fillJudgeAccount = (demoEmail: string, demoRole: UserRole) => {
    setEmail(demoEmail);
    setPassword('Demo@123');
    setRole(demoRole);
    setErrorMessage(null);
  };

  // Sign In Handler
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Human-friendly client validations
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid official or institutional email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMessage(`Welcome back, ${data.user.name}`);

        // Short, premium success transition before smooth redirect (600ms)
        setTimeout(() => {
          if (initialRedirect && initialRedirect.startsWith('/') && !initialRedirect.startsWith('/login')) {
            router.push(initialRedirect);
          } else {
            const userRole = (data.user.role || 'STUDENT').toLowerCase();
            router.push(`/dashboard/${userRole}`);
          }
          router.refresh();
        }, 650);
      } else {
        setErrorMessage(
          data.error === 'Invalid email or password'
            ? "Your email or password doesn't look right. Please check and try again."
            : data.error || 'Authentication could not be completed. Please check your credentials.'
        );
        setIsLoading(false);
      }
    } catch {
      setErrorMessage("We couldn't connect right now. Please check your internet connection and try again.");
      setIsLoading(false);
    }
  };

  // Sign Up Handler
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (password.length < 8) {
      setErrorMessage('Password must contain at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter your password.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          role,
          district,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMessage('Account created successfully. Setting up your workspace...');

        setTimeout(() => {
          const userRole = role.toLowerCase();
          router.push(`/dashboard/${userRole}`);
          router.refresh();
        }, 700);
      } else {
        setErrorMessage(
          data.error?.includes('already exists')
            ? 'An account with this email address already exists. Please sign in instead.'
            : data.error || 'Registration could not be completed. Please check your details.'
        );
        setIsLoading(false);
      }
    } catch {
      setErrorMessage("We couldn't connect right now. Please check your internet connection and try again.");
      setIsLoading(false);
    }
  };

  // Forgot Password Handler
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setForgotSuccess(true);
      } else {
        setErrorMessage(data.error || 'Unable to request password reset. Please try again.');
      }
    } catch {
      setErrorMessage("We couldn't connect right now. Please check your internet connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-3 sm:p-6 lg:p-10 bg-[#f4f7fb] dark:bg-[#070b12] relative overflow-hidden">
      {/* Subtle Ambient Background Grid & Glows */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20"
        style={{
          backgroundImage: `radial-gradient(rgba(37, 99, 235, 0.15) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main 2-Column Authentication Card (Inspired by Reference) */}
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-5xl rounded-[28px] border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl shadow-slate-900/10 dark:shadow-black/50 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px] z-10"
      >
        {/* ================================================================= */}
        {/* LEFT COLUMN: JOBZY Brand Intelligence Panel                      */}
        {/* ================================================================= */}
        <div className="lg:col-span-5 bg-[#090d16] text-white p-6 sm:p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800">
          {/* Subtle Background Glows on Brand Panel */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none -z-0" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none -z-0" />

          {/* Top Brand Header */}
          <div className="relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-blue-500/30 ring-1 ring-white/20">
                J
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white">JOBZY</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 uppercase tracking-wide">
                    Govt. AI Platform
                  </span>
                </div>
                <p className="text-[11px] font-medium text-slate-400">
                  Govt. of Maharashtra Initiative
                </p>
              </div>
            </div>

            {/* Main Headline */}
            <div className="mt-8 sm:mt-12">
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400 block mb-2">
                STATE SKILL INTELLIGENCE NETWORK
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
                Connecting Industry Signals with Tomorrow&apos;s Skills.
              </h1>
              <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                AI-powered skill intelligence for government decision-makers, automotive industry, technical institutions, and learners across 36 districts.
              </p>
            </div>

            {/* Interactive Minimal Workflow Flow: Industry -> Skills -> Curriculum -> Workforce */}
            <div className="mt-8 p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm">
              <div className="text-[11px] font-semibold text-slate-300 mb-3 flex items-center justify-between">
                <span>Continuous Intelligence Loop</span>
                <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Telemetry
                </span>
              </div>

              <div className="grid grid-cols-4 gap-1.5 text-center relative">
                {[
                  { label: 'Industry', sub: 'Live Signals', icon: Building2 },
                  { label: 'Skills', sub: 'NLP Engine', icon: Cpu },
                  { label: 'Curriculum', sub: 'MSBTE Gap', icon: Layers },
                  { label: 'Workforce', sub: 'Ready Talent', icon: GraduationCap },
                ].map((step, idx) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.label} className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-400/30 flex items-center justify-center text-blue-400 mb-1">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-semibold text-white leading-tight">{step.label}</span>
                      <span className="text-[9px] text-slate-400">{step.sub}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Telemetry Pill */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 relative z-10 text-xs text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Maharashtra EV Policy 2026</span>
            </span>
            <span className="font-semibold text-slate-300">36 Districts Active</span>
          </div>
        </div>

        {/* ================================================================= */}
        {/* RIGHT COLUMN: Interactive Authentication Form                     */}
        {/* ================================================================= */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between bg-white dark:bg-slate-900">
          <div>
            {/* Top Navigation Tabs: Sign In / Sign Up */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="flex p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    mode === 'signin'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    mode === 'signup'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Create Account
                </button>
              </div>

              <span className="text-[11px] font-medium text-slate-400 hidden sm:inline-block">
                Secure SSL • Official Access
              </span>
            </div>

            {/* Error Banner */}
            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                  <span className="leading-relaxed font-medium">{errorMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success Banner */}
            <AnimatePresence>
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 flex items-center gap-2.5 text-xs text-emerald-700 dark:text-emerald-300 font-medium"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{successMessage}</span>
                  <Loader2 className="w-3.5 h-3.5 animate-spin ml-auto text-emerald-600" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* ------------------------------------------------------------- */}
            {/* MODE 1: SIGN IN FORM                                          */}
            {/* ------------------------------------------------------------- */}
            {mode === 'signin' && (
              <motion.div
                key="signin"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.25 }}
                className="mt-6"
              >
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Welcome back.
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Sign in to access real-time skill intelligence, industry insights, and curriculum recommendations.
                  </p>
                </div>

                <form onSubmit={handleSignIn} className="mt-6 space-y-4">
                  {/* Email Field */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="student@skillalign.gov.in"
                        className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setMode('forgot')}
                        className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="remember-me" className="ml-2 text-xs text-slate-600 dark:text-slate-400 select-none">
                      Keep me authenticated across sessions
                    </label>
                  </div>

                  {/* Primary Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 sm:py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none min-h-[44px]"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Signing you in...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In to JOBZY</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Quick Judge Evaluation Pre-fills */}
                <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Judge Evaluation Accounts (1-Click Fill):
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs">
                    <button
                      type="button"
                      onClick={() => fillJudgeAccount('student@skillalign.gov.in', 'STUDENT')}
                      className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-left transition-colors flex flex-col"
                    >
                      <span className="font-semibold text-slate-900 dark:text-slate-100">Student</span>
                      <span className="text-[10px] text-slate-500">Aarav (Pune)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => fillJudgeAccount('industry@skillalign.gov.in', 'INDUSTRY')}
                      className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-left transition-colors flex flex-col"
                    >
                      <span className="font-semibold text-slate-900 dark:text-slate-100">Industry</span>
                      <span className="text-[10px] text-slate-500">Tata Motors Hub</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => fillJudgeAccount('faculty@skillalign.gov.in', 'INSTITUTE')}
                      className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-left transition-colors flex flex-col"
                    >
                      <span className="font-semibold text-slate-900 dark:text-slate-100">Institute</span>
                      <span className="text-[10px] text-slate-500">GP Pune MSBTE</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => fillJudgeAccount('admin@skillalign.gov.in', 'GOVERNMENT')}
                      className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-left transition-colors flex flex-col"
                    >
                      <span className="font-semibold text-slate-900 dark:text-slate-100">Government</span>
                      <span className="text-[10px] text-slate-500">DTE Mantralaya</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* MODE 2: SIGN UP FORM                                          */}
            {/* ------------------------------------------------------------- */}
            {mode === 'signup' && (
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25 }}
                className="mt-6"
              >
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Create your account.
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Join Maharashtra&apos;s unified skill intelligence and curriculum alignment network.
                  </p>
                </div>

                <form onSubmit={handleSignUp} className="mt-5 space-y-3.5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Raman Sharma"
                        className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="raman@msbte.edu.in"
                        className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all"
                      />
                    </div>
                  </div>

                  {/* Role Selector */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Stakeholder Role
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                      {[
                        { key: 'STUDENT' as UserRole, label: 'Student / Learner' },
                        { key: 'INDUSTRY' as UserRole, label: 'Industry Hub' },
                        { key: 'INSTITUTE' as UserRole, label: 'Faculty / Institute' },
                        { key: 'GOVERNMENT' as UserRole, label: 'Govt. Desk' },
                      ].map((r) => (
                        <button
                          key={r.key}
                          type="button"
                          onClick={() => setRole(r.key)}
                          className={`py-1.5 px-2 rounded-xl text-[11px] font-semibold border text-center transition-all ${
                            role === r.key
                              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                              : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* District & Password Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        District (Maharashtra)
                      </label>
                      <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                      >
                        {MAHARASHTRA_DISTRICTS.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Password (8+ chars)
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none min-h-[44px]"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Setting up your JOBZY workspace...</span>
                      </>
                    ) : (
                      <>
                        <span>Create Account</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* MODE 3: FORGOT PASSWORD                                       */}
            {/* ------------------------------------------------------------- */}
            {mode === 'forgot' && (
              <motion.div
                key="forgot"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25 }}
                className="mt-6"
              >
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Password Recovery
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Enter your registered email address to receive password reset instructions.
                  </p>
                </div>

                {forgotSuccess ? (
                  <div className="mt-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300">
                    <div className="flex items-center gap-2 font-semibold text-sm mb-1">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      <span>Recovery Dispatch Sent</span>
                    </div>
                    <p className="text-xs leading-relaxed">
                      If an account is associated with <strong>{email}</strong>, we have dispatched official recovery instructions.
                    </p>
                    <button
                      type="button"
                      onClick={() => setMode('signin')}
                      className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors"
                    >
                      Return to Sign In
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleForgotPassword} className="mt-6 space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Registered Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@organization.gov.in"
                          className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all flex items-center justify-center gap-2 min-h-[44px]"
                      >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send Reset Link'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setMode('signin')}
                        className="py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors min-h-[44px]"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            )}
          </div>

          {/* Bottom Switcher Footer */}
          <div className="mt-8 pt-5 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
            {mode === 'signin' ? (
              <p>
                New to JOBZY?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Create your account
                </button>
              </p>
            ) : mode === 'signup' ? (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Sign in here
                </button>
              </p>
            ) : (
              <p>
                Remembered your password?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Back to Sign In
                </button>
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
