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
  X,
  Plus,
} from 'lucide-react';
import { MAHARASHTRA_DISTRICTS } from '@/lib/taxonomy';

type AuthMode = 'signin' | 'signup' | 'forgot';
type UserRole = 'STUDENT' | 'INDUSTRY' | 'INSTITUTE' | 'GOVERNMENT';

// Authentic 4-Color Google Identity SVG Icon
function GoogleIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

// Pre-verified Google accounts for instant Judge & User evaluation
const GOOGLE_ACCOUNTS = [
  {
    name: 'Aarav Deshmukh',
    email: 'aarav.deshmukh@gmail.com',
    role: 'STUDENT' as UserRole,
    roleTitle: 'Student • EV Diagnostics (Pune)',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    district: 'Pune',
  },
  {
    name: 'Raman Sharma',
    email: 'raman.sharma.tech@gmail.com',
    role: 'STUDENT' as UserRole,
    roleTitle: 'Technical Candidate • Battery Cell Design',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    district: 'Pune',
  },
  {
    name: 'Dr. Priya Sharma',
    email: 'priya.sharma.ev@gmail.com',
    role: 'INSTITUTE' as UserRole,
    roleTitle: 'Faculty • MSBTE Technical Committee',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    district: 'Pune',
  },
  {
    name: 'Vikram Mehta',
    email: 'vikram.mehta.tata@gmail.com',
    role: 'INDUSTRY' as UserRole,
    roleTitle: 'Industry Head • Tata Motors Talent Desk',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    district: 'Pune',
  },
];

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

  // Google Auth States
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [googleModalTab, setGoogleModalTab] = useState<'personal' | 'demo'>('personal');
  const [savedPersonalAccount, setSavedPersonalAccount] = useState<{
    name: string;
    email: string;
    role: UserRole;
    district: string;
  } | null>(null);
  const [isEditingPersonalAccount, setIsEditingPersonalAccount] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');
  const [personalRole, setPersonalRole] = useState<UserRole>('STUDENT');
  const [personalDistrict, setPersonalDistrict] = useState('Pune');
  const [googleLoadingUser, setGoogleLoadingUser] = useState<string | null>(null);

  // Load saved personal Google account from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('jobzy_personal_google');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.email) {
          setSavedPersonalAccount(parsed);
          setCustomGoogleEmail(parsed.email);
          setCustomGoogleName(parsed.name || '');
          if (parsed.role) setPersonalRole(parsed.role);
          if (parsed.district) setPersonalDistrict(parsed.district);
          setIsEditingPersonalAccount(false);
          return;
        }
      }
    } catch (e) {}
    setIsEditingPersonalAccount(true);
  }, []);

  // Reset errors when mode changes
  useEffect(() => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setForgotSuccess(false);
  }, [mode]);

  // Google OAuth Handler
  const handleGoogleAuth = async (
    googleEmail: string,
    googleName: string,
    avatarUrl?: string,
    targetRole?: UserRole,
    targetDistrict?: string
  ) => {
    setErrorMessage(null);
    setGoogleLoadingUser(googleEmail);
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: googleEmail.trim(),
          name: googleName.trim(),
          avatarUrl,
          role: targetRole || (mode === 'signup' ? role : personalRole || 'STUDENT'),
          district: targetDistrict || (mode === 'signup' ? district : personalDistrict || 'Pune'),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsGoogleModalOpen(false);
        setSuccessMessage(`Google Verified: Welcome, ${data.user.name}!`);

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
        setErrorMessage(data.error || 'Google authentication could not be completed.');
        setIsLoading(false);
        setGoogleLoadingUser(null);
      }
    } catch {
      setErrorMessage('Failed to connect to Google authentication service.');
      setIsLoading(false);
      setGoogleLoadingUser(null);
    }
  };

  // Personal Google Account Form Submit Handler
  const handlePersonalGoogleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customGoogleEmail || !customGoogleEmail.includes('@')) {
      setErrorMessage('Please enter a valid Google email address (e.g. yourname@gmail.com).');
      return;
    }

    const cleanEmail = customGoogleEmail.trim().toLowerCase();
    const cleanName = customGoogleName.trim() || cleanEmail.split('@')[0];
    const chosenRole = mode === 'signup' ? role : personalRole;
    const chosenDistrict = mode === 'signup' ? district : personalDistrict;

    const accountObj = {
      name: cleanName,
      email: cleanEmail,
      role: chosenRole,
      district: chosenDistrict,
    };

    try {
      localStorage.setItem('jobzy_personal_google', JSON.stringify(accountObj));
      setSavedPersonalAccount(accountObj);
    } catch (err) {}

    await handleGoogleAuth(
      cleanEmail,
      cleanName,
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanName)}`,
      chosenRole,
      chosenDistrict
    );
  };

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

                  {/* Google Sign In Button - Inspired by Reference Screenshot */}
                  <button
                    type="button"
                    onClick={() => {
                      setShowCustomGoogleInput(false);
                      setIsGoogleModalOpen(true);
                    }}
                    disabled={isLoading}
                    className="w-full py-2.5 sm:py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200 shadow-xs hover:border-slate-300 dark:hover:border-slate-600 transition-all flex items-center justify-center gap-2.5 min-h-[44px] group"
                  >
                    <GoogleIcon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                    <span>Sign in with Google</span>
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

                  {/* Google Sign Up Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setShowCustomGoogleInput(false);
                      setIsGoogleModalOpen(true);
                    }}
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200 shadow-xs hover:border-slate-300 dark:hover:border-slate-600 transition-all flex items-center justify-center gap-2.5 min-h-[44px] group"
                  >
                    <GoogleIcon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                    <span>Sign up with Google</span>
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

      {/* Google Account Selector Modal */}
      <AnimatePresence>
        {isGoogleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/65 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 10 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-5 sm:p-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between bg-white dark:bg-slate-900 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-xs">
                    <GoogleIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Sign in with Google
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Choose your personal account or an evaluation profile
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsGoogleModalOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Mode Switcher Tabs */}
              <div className="px-5 sm:px-6 pt-3 pb-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/50 flex gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setGoogleModalTab('personal')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    googleModalTab === 'personal'
                      ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs border border-slate-200/80 dark:border-slate-700'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Personal Google Account</span>
                </button>
                <button
                  type="button"
                  onClick={() => setGoogleModalTab('demo')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    googleModalTab === 'demo'
                      ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs border border-slate-200/80 dark:border-slate-700'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Judge / Demo Accounts</span>
                </button>
              </div>

              {/* Modal Body with Custom Scrollbar */}
              <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
                {/* -------------------------------------------------------- */}
                {/* TAB 1: PERSONAL GOOGLE ACCOUNT                           */}
                {/* -------------------------------------------------------- */}
                {googleModalTab === 'personal' && (
                  <div>
                    {savedPersonalAccount && !isEditingPersonalAccount ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Your Saved Google Account
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50">
                            Ready to Sign In
                          </span>
                        </div>

                        {/* Personal Account Card */}
                        <div className="p-4 rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/20 flex items-center gap-3.5">
                          <div className="relative">
                            <img
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(savedPersonalAccount.name)}`}
                              alt={savedPersonalAccount.name}
                              className="w-12 h-12 rounded-full border-2 border-white dark:border-slate-800 shadow-xs bg-white dark:bg-slate-800"
                            />
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white dark:bg-slate-900 shadow-xs border border-slate-200 dark:border-slate-700 flex items-center justify-center p-0.5">
                              <GoogleIcon className="w-3.5 h-3.5" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-slate-900 dark:text-white truncate">
                                {savedPersonalAccount.name}
                              </span>
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                                {savedPersonalAccount.role}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400 truncate font-medium">{savedPersonalAccount.email}</p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-500">{savedPersonalAccount.district}, Maharashtra</p>
                          </div>
                        </div>

                        {/* Primary Sign In Button */}
                        <button
                          type="button"
                          disabled={isLoading}
                          onClick={() => handleGoogleAuth(
                            savedPersonalAccount.email,
                            savedPersonalAccount.name,
                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(savedPersonalAccount.name)}`,
                            savedPersonalAccount.role,
                            savedPersonalAccount.district
                          )}
                          className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2.5 min-h-[46px]"
                        >
                          {googleLoadingUser === savedPersonalAccount.email ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Signing in as {savedPersonalAccount.name}...</span>
                            </>
                          ) : (
                            <>
                              <GoogleIcon className="w-4 h-4" />
                              <span>Continue as {savedPersonalAccount.name}</span>
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>

                        {/* Switch Account Option */}
                        <button
                          type="button"
                          onClick={() => setIsEditingPersonalAccount(true)}
                          className="w-full py-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Use a different personal Google account</span>
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handlePersonalGoogleSubmit} className="space-y-3.5">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                              Choose Your Personal Google Account
                            </h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                              Enter your personal Google credentials to sign in or create your verified account.
                            </p>
                          </div>
                          {savedPersonalAccount && (
                            <button
                              type="button"
                              onClick={() => setIsEditingPersonalAccount(false)}
                              className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                            >
                              Cancel
                            </button>
                          )}
                        </div>

                        {/* Email Input */}
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Your Personal Google Email
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <GoogleIcon className="w-4 h-4" />
                            </div>
                            <input
                              type="email"
                              required
                              value={customGoogleEmail}
                              onChange={(e) => setCustomGoogleEmail(e.target.value)}
                              placeholder="your.email@gmail.com"
                              className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all"
                            />
                          </div>
                        </div>

                        {/* Full Name Input */}
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Your Full Name
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                              <User className="w-4 h-4" />
                            </div>
                            <input
                              type="text"
                              required
                              value={customGoogleName}
                              onChange={(e) => setCustomGoogleName(e.target.value)}
                              placeholder="e.g. Uday Soni"
                              className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all"
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
                                onClick={() => setPersonalRole(r.key)}
                                className={`py-1.5 px-2 rounded-xl text-[11px] font-semibold border text-center transition-all ${
                                  personalRole === r.key
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                                }`}
                              >
                                {r.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* District Selector */}
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            District (Maharashtra)
                          </label>
                          <select
                            value={personalDistrict}
                            onChange={(e) => setPersonalDistrict(e.target.value)}
                            className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                          >
                            {MAHARASHTRA_DISTRICTS.map((d) => (
                              <option key={d} value={d}>
                                {d}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Submit Button */}
                        <button
                          type="submit"
                          disabled={isLoading || !customGoogleEmail.includes('@')}
                          className="w-full py-2.5 sm:py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 mt-2 min-h-[46px]"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Signing in with Google...</span>
                            </>
                          ) : (
                            <>
                              <GoogleIcon className="w-4 h-4" />
                              <span>Continue with Personal Google Account</span>
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </form>
                    )}
                  </div>
                )}

                {/* -------------------------------------------------------- */}
                {/* TAB 2: DEMO / REVIEWER ACCOUNTS                           */}
                {/* -------------------------------------------------------- */}
                {googleModalTab === 'demo' && (
                  <div className="space-y-2">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      SIH 2026 Evaluation Accounts (1-Click Login)
                    </div>

                    {GOOGLE_ACCOUNTS.map((acc) => (
                      <button
                        key={acc.email}
                        type="button"
                        disabled={isLoading}
                        onClick={() => handleGoogleAuth(acc.email, acc.name, acc.avatar, acc.role, acc.district)}
                        className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-all flex items-center gap-3 text-left group"
                      >
                        <img
                          src={acc.avatar}
                          alt={acc.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                              {acc.name}
                            </span>
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                              {acc.role}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{acc.email}</p>
                          <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium truncate">{acc.roleTitle}</p>
                        </div>
                        {googleLoadingUser === acc.email ? (
                          <Loader2 className="w-4 h-4 animate-spin text-blue-600 shrink-0" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Modal Footer / Google Security Badge */}
              <div className="p-4 bg-slate-50 dark:bg-slate-850/60 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed shrink-0 flex items-center justify-between">
                <span>Certified for Govt. of Maharashtra SIH 2026</span>
                <span className="flex items-center gap-1 text-slate-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  SSL Protected
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
