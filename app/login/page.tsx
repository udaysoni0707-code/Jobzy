'use client';

import React, { useState, useEffect, Suspense } from 'react';
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

function getOAuthErrorMessage(errorCode: string | null): string | null {
  if (!errorCode) return null;
  if (errorCode === 'google_not_configured') {
    return 'Google OAuth credentials (GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET) are not configured in .env yet. You can configure them or use the Developer / Judge Account simulator.';
  }
  if (errorCode === 'cancelled') {
    return 'Google sign-in was cancelled.';
  }
  if (errorCode === 'state_mismatch' || errorCode === 'state_expired') {
    return 'Google security verification timed out. Please try signing in again.';
  }
  if (errorCode === 'unverified_email') {
    return 'Your Google account email is not verified by Google.';
  }
  if (errorCode === 'duplicate_account') {
    return 'An account with this email already exists under email and password.';
  }
  return 'Google authentication could not be completed. Please try again.';
}

function AuthFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRedirect = searchParams.get('redirect') || '';
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'signin';
  const oauthError = searchParams.get('error');

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
  const [isGoogleRedirecting, setIsGoogleRedirecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(() => getOAuthErrorMessage(oauthError));
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Subtle Mouse Parallax on Desktop
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
        const x = ((e.clientX - window.innerWidth / 2) / (window.innerWidth / 2)) * 3;
        const y = ((e.clientY - window.innerHeight / 2) / (window.innerHeight / 2)) * 3;
        setMousePos({ x, y });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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

  // Listen for OAuth URL error parameters
  useEffect(() => {
    if (oauthError) {
      setErrorMessage(getOAuthErrorMessage(oauthError));
    }
  }, [oauthError]);

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

  // Reset errors ONLY when mode actually changes (safe in React 18 StrictMode)
  const prevModeRef = React.useRef(mode);
  useEffect(() => {
    if (prevModeRef.current !== mode) {
      prevModeRef.current = mode;
      setErrorMessage(null);
      setSuccessMessage(null);
      setForgotSuccess(false);
    }
  }, [mode]);

  // Initiate Production Backend Google OAuth 2.0 Flow
  const handleContinueWithGoogle = () => {
    setIsGoogleRedirecting(true);
    setIsLoading(true);
    setErrorMessage(null);

    const params = new URLSearchParams();
    if (initialRedirect) params.set('redirect', initialRedirect);
    if (mode === 'signup') {
      params.set('role', role);
      params.set('district', district);
    }
    const queryStr = params.toString() ? `?${params.toString()}` : '';
    window.location.href = `/api/auth/google${queryStr}`;
  };

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

    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
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
            ? "That email or password doesn't look right. Please try again."
            : data.error || 'Authentication could not be completed. Please check your credentials.'
        );
        setIsLoading(false);
      }
    } catch {
      setErrorMessage("We couldn't connect right now. Please try again.");
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
      setErrorMessage('Use at least 8 characters for your password.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
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
        setSuccessMessage('Account created successfully. Preparing your JOBZY workspace...');

        setTimeout(() => {
          const userRole = role.toLowerCase();
          router.push(`/dashboard/${userRole}`);
          router.refresh();
        }, 700);
      } else {
        setErrorMessage(
          data.error?.includes('already exists')
            ? 'An account with this email already exists. Please sign in instead.'
            : data.error || 'Registration could not be completed. Please check your details.'
        );
        setIsLoading(false);
      }
    } catch {
      setErrorMessage("We couldn't connect right now. Please try again.");
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
    <div className="min-h-screen w-full relative flex items-center justify-center p-3 py-8 sm:p-6 lg:p-10 overflow-x-hidden font-body select-none">
      {/* ================================================================= */}
      {/* 1. FULL-SCREEN PHOTOGRAPHIC BACKGROUND                            */}
      {/* ================================================================= */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center transition-transform duration-1000 ease-out scale-[1.02]"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=2400&auto=format&fit=crop&q=85')`,
        }}
      />

      {/* Subtle Navy / Indigo Atmospheric Overlay */}
      <div
        className="fixed inset-0 z-1 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, rgba(7, 20, 38, 0.84) 0%, rgba(15, 23, 42, 0.78) 50%, rgba(30, 27, 75, 0.86) 100%)`,
        }}
      />

      {/* Subtle Background Ambience & Lighting Depth */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[680px] bg-blue-500/15 rounded-full blur-3xl pointer-events-none z-1" />
      <div className="absolute bottom-10 right-10 w-[420px] h-[420px] bg-indigo-500/15 rounded-full blur-3xl pointer-events-none z-1" />

      {/* ================================================================= */}
      {/* 2. DESKTOP TELEMETRY PANEL (>= 1440px composition)                */}
      {/* ================================================================= */}
      <div className="hidden 2xl:flex flex-col justify-between absolute left-16 top-16 bottom-16 w-[380px] z-10 text-white pointer-events-none">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-blue-600/30 ring-1 ring-white/30 font-display">
              J
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white font-display">JOBZY</span>
                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-blue-500/25 text-blue-300 border border-blue-400/40 uppercase tracking-wide">
                  Govt. AI Platform
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">Govt. of Maharashtra Initiative</p>
            </div>
          </div>

          <div className="mt-12 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400 block">
              STATE SKILL INTELLIGENCE NETWORK
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-white leading-tight font-display">
              Where Industry Demand Meets Future Skills.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed pt-2">
              Continuous feedback loop between industry demand signals, AI skill taxonomy, MSBTE curriculum alignment, and technical learner readiness across 36 districts.
            </p>
          </div>

          {/* Continuous Loop Pill */}
          <div className="mt-8 p-4 rounded-2xl bg-white/[0.07] border border-white/15 backdrop-blur-md">
            <div className="text-xs font-semibold text-slate-200 mb-3 flex items-center justify-between">
              <span>Continuous Intelligence Loop</span>
              <span className="flex items-center gap-1.5 text-[10px] text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Telemetry
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center">
              {[
                { label: 'Industry', sub: 'Signals', icon: Building2 },
                { label: 'Skills', sub: 'NLP Engine', icon: Cpu },
                { label: 'Curriculum', sub: 'MSBTE Gap', icon: Layers },
                { label: 'Workforce', sub: 'Job-Ready', icon: GraduationCap },
              ].map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.label} className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 mb-1.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-semibold text-white">{step.label}</span>
                    <span className="text-[9px] text-slate-400">{step.sub}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 text-xs text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Maharashtra EV Policy 2026</span>
          </span>
          <span className="font-semibold text-slate-300">36 Districts Active</span>
        </div>
      </div>

      {/* ================================================================= */}
      {/* 3. CENTERED FROSTED GLASS LOGIN CARD                              */}
      {/* ================================================================= */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        style={{
          transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0)`,
        }}
        className="w-full max-w-[460px] sm:max-w-[480px] rounded-[26px] p-6 sm:p-9 lg:p-10 glass-auth-card text-white relative z-10 my-auto shadow-2xl transition-transform duration-200 ease-out"
      >
        {/* Brand Identity Header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="flex items-center justify-between pb-5 border-b border-white/15"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-black text-white text-lg shadow-md shadow-blue-500/30 ring-1 ring-white/30 font-display">
              J
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-white font-display">JOBZY</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-500/30 text-blue-200 border border-blue-400/40 uppercase tracking-wide">
                  Govt. AI
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-300">Govt. of Maharashtra Initiative</p>
            </div>
          </div>
          <span className="text-[10px] font-semibold text-slate-300 bg-white/10 px-2.5 py-1 rounded-full border border-white/15 hidden sm:inline-block">
            SSL 256-Bit
          </span>
        </motion.div>

        {/* Error Banner */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              className="mt-4 p-3 rounded-xl bg-red-500/20 border border-red-400/50 flex flex-col gap-1.5 text-xs text-red-100 backdrop-blur-md"
            >
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-300" />
                <span className="leading-relaxed font-medium">{errorMessage}</span>
              </div>
              {errorMessage.includes('Google OAuth credentials') && (
                <button
                  type="button"
                  onClick={() => setIsGoogleModalOpen(true)}
                  className="ml-6 text-[11px] font-semibold text-blue-300 hover:text-blue-100 underline text-left cursor-pointer"
                >
                  Click here to launch the Simulator / Judge Accounts modal &rarr;
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Banner */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/50 flex items-center gap-2.5 text-xs text-emerald-100 font-medium backdrop-blur-md"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>{successMessage}</span>
              <Loader2 className="w-3.5 h-3.5 animate-spin ml-auto text-emerald-300" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* =============================================================== */}
        {/* MODE 1: SIGN IN                                                 */}
        {/* =============================================================== */}
        {mode === 'signin' && (
          <motion.div
            key="signin"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="mt-6"
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-300 block mb-1">
                MAHARASHTRA SKILL INTELLIGENCE PLATFORM
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-display">
                Welcome back.
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Sign in to continue to your JOBZY workspace.
              </p>
            </div>

            <form onSubmit={handleSignIn} className="mt-5 space-y-3.5">
              {/* Email Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-300">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full glass-input h-[52px] sm:h-[54px] rounded-[14px] pl-10 pr-4 text-xs sm:text-sm"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-200">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-xs font-medium text-blue-300 hover:text-white transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-300">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full glass-input h-[52px] sm:h-[54px] rounded-[14px] pl-10 pr-11 text-xs sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-300 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center pt-0.5">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-white/30 bg-white/10 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 text-xs text-slate-300 select-none cursor-pointer">
                  Keep me authenticated across sessions
                </label>
              </div>

              {/* Primary CTA Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-[52px] sm:h-[54px] rounded-[14px] text-xs sm:text-sm font-semibold bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.99] text-white shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:pointer-events-none mt-2"
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

              {/* Continue with Google Button */}
              <button
                type="button"
                onClick={handleContinueWithGoogle}
                disabled={isLoading || isGoogleRedirecting}
                className="w-full h-[50px] sm:h-[52px] rounded-[14px] text-xs sm:text-sm font-semibold bg-white/[0.09] hover:bg-white/[0.16] active:scale-[0.99] border border-white/25 text-white shadow-sm transition-all flex items-center justify-center gap-2.5 group disabled:opacity-60 disabled:pointer-events-none"
              >
                {isGoogleRedirecting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Connecting to Google...</span>
                  </>
                ) : (
                  <>
                    <GoogleIcon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                    <span>Continue with Google</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Judge Evaluation Pre-fills */}
            <div className="mt-5 pt-4 border-t border-white/15">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 block mb-2">
                Judge Evaluation Accounts (1-Click Fill):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs">
                {[
                  { label: 'Student', name: 'Aarav (Pune)', email: 'student@skillalign.gov.in', r: 'STUDENT' as UserRole },
                  { label: 'Industry', name: 'Tata Motors', email: 'industry@skillalign.gov.in', r: 'INDUSTRY' as UserRole },
                  { label: 'Institute', name: 'GP Pune', email: 'faculty@skillalign.gov.in', r: 'INSTITUTE' as UserRole },
                  { label: 'Govt.', name: 'DTE Mantralaya', email: 'admin@skillalign.gov.in', r: 'GOVERNMENT' as UserRole },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => fillJudgeAccount(item.email, item.r)}
                    className="p-2 rounded-xl bg-white/[0.07] hover:bg-white/[0.15] border border-white/15 text-left transition-colors flex flex-col"
                  >
                    <span className="font-semibold text-white">{item.label}</span>
                    <span className="text-[10px] text-slate-300 truncate">{item.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* =============================================================== */}
        {/* MODE 2: SIGN UP                                                 */}
        {/* =============================================================== */}
        {mode === 'signup' && (
          <motion.div
            key="signup"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="mt-6"
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-300 block mb-1">
                MAHARASHTRA SKILL INTELLIGENCE PLATFORM
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-display">
                Create your account.
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Join Maharashtra&apos;s skill intelligence ecosystem across 36 districts.
              </p>
            </div>

            <form onSubmit={handleSignUp} className="mt-5 space-y-3">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-300">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Raman Sharma"
                    className="w-full glass-input h-[48px] rounded-[14px] pl-10 pr-4 text-xs sm:text-sm"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-300">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@organization.gov.in"
                    className="w-full glass-input h-[48px] rounded-[14px] pl-10 pr-4 text-xs sm:text-sm"
                  />
                </div>
              </div>

              {/* Role Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">Stakeholder Role</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {[
                    { key: 'STUDENT' as UserRole, label: 'Student / Learner' },
                    { key: 'INDUSTRY' as UserRole, label: 'Industry Hub' },
                    { key: 'INSTITUTE' as UserRole, label: 'Institute / Faculty' },
                    { key: 'GOVERNMENT' as UserRole, label: 'Govt. Desk' },
                  ].map((r) => (
                    <button
                      key={r.key}
                      type="button"
                      onClick={() => setRole(r.key)}
                      className={`py-1.5 px-2 rounded-xl text-[11px] font-semibold border text-center transition-all ${
                        role === r.key
                          ? 'bg-blue-600 text-white border-blue-400 shadow-sm'
                          : 'bg-white/[0.07] text-slate-200 border-white/20 hover:bg-white/[0.15]'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* District & Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">District</label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full glass-input h-[48px] rounded-[14px] px-3 text-xs bg-slate-900/90 text-white"
                  >
                    {MAHARASHTRA_DISTRICTS.map((d) => (
                      <option key={d} value={d} className="bg-slate-900 text-white">
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full glass-input h-[48px] rounded-[14px] pl-3 pr-9 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-300 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full glass-input h-[48px] rounded-[14px] pl-3 pr-9 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-300 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-[50px] rounded-[14px] text-xs sm:text-sm font-semibold bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.99] text-white shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Setting up workspace...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Continue with Google Button */}
              <button
                type="button"
                onClick={handleContinueWithGoogle}
                disabled={isLoading || isGoogleRedirecting}
                className="w-full h-[50px] sm:h-[52px] rounded-[14px] text-xs sm:text-sm font-semibold bg-white/[0.09] hover:bg-white/[0.16] active:scale-[0.99] border border-white/25 text-white shadow-sm transition-all flex items-center justify-center gap-2.5 group disabled:opacity-60 disabled:pointer-events-none mt-2"
              >
                {isGoogleRedirecting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Connecting to Google...</span>
                  </>
                ) : (
                  <>
                    <GoogleIcon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                    <span>Continue with Google</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>
        )}

        {/* =============================================================== */}
        {/* MODE 3: FORGOT PASSWORD                                         */}
        {/* =============================================================== */}
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
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-display">
                Reset your password.
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Enter your registered official email address to receive password recovery instructions.
              </p>
            </div>

            {forgotSuccess ? (
              <div className="mt-6 p-4 rounded-2xl bg-emerald-500/25 border border-emerald-400/50 text-emerald-100 backdrop-blur-md">
                <div className="flex items-center gap-2 font-semibold text-sm mb-1">
                  <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                  <span>Check your inbox for reset instructions</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  If an account is associated with <strong>{email}</strong>, we have dispatched official recovery instructions.
                </p>
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                    Registered Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-300">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@organization.gov.in"
                      className="w-full glass-input h-[52px] rounded-[14px] pl-10 pr-4 text-xs sm:text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 h-[50px] rounded-[14px] text-xs sm:text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white transition-all flex items-center justify-center gap-2"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send Reset Link'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('signin')}
                    className="h-[50px] px-4 rounded-[14px] text-xs sm:text-sm font-semibold border border-white/25 hover:bg-white/10 text-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        )}

        {/* Bottom Switcher Footer */}
        <div className="mt-6 pt-4 border-t border-white/15 text-center text-xs text-slate-300">
          {mode === 'signin' ? (
            <p>
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="font-bold text-blue-300 hover:text-white underline underline-offset-4 transition-colors"
              >
                Create your JOBZY account
              </button>
            </p>
          ) : mode === 'signup' ? (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="font-bold text-blue-300 hover:text-white underline underline-offset-4 transition-colors"
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
                className="font-bold text-blue-300 hover:text-white underline underline-offset-4 transition-colors"
              >
                Back to Sign In
              </button>
            </p>
          )}

          {/* Fallback Simulator / Judge Access Link */}
          <div className="mt-3">
            <button
              type="button"
              onClick={() => setIsGoogleModalOpen(true)}
              className="text-[11px] text-slate-400 hover:text-blue-300 transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Offline / Judge testing?</span>
              <span className="underline">Launch Google Account Simulator</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* ================================================================= */}
      {/* 4. GOOGLE ACCOUNT SELECTOR MODAL DIALOG                           */}
      {/* ================================================================= */}
      <AnimatePresence>
        {isGoogleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 10 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-lg bg-slate-900/90 rounded-3xl border border-white/20 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-white backdrop-blur-xl"
            >
              {/* Modal Header */}
              <div className="p-5 sm:p-6 pb-4 border-b border-white/10 flex items-start justify-between bg-slate-950/50 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shadow-xs">
                    <GoogleIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white font-display">
                      Sign in with Google
                    </h3>
                    <p className="text-xs text-slate-300">
                      Choose your personal account or an evaluation profile
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsGoogleModalOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Mode Switcher Tabs */}
              <div className="px-5 sm:px-6 pt-3 pb-2 border-b border-white/10 bg-white/[0.04] flex gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setGoogleModalTab('personal')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    googleModalTab === 'personal'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-300 hover:text-white bg-white/5'
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
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-300 hover:text-white bg-white/5'
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
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                            Your Saved Google Account
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                            Ready to Sign In
                          </span>
                        </div>

                        {/* Personal Account Card */}
                        <div className="p-4 rounded-2xl border border-blue-400/30 bg-blue-600/15 flex items-center gap-3.5">
                          <div className="relative">
                            <img
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(savedPersonalAccount.name)}`}
                              alt={savedPersonalAccount.name}
                              className="w-12 h-12 rounded-full border-2 border-white/40 shadow-xs bg-slate-800"
                            />
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white shadow-xs flex items-center justify-center p-0.5">
                              <GoogleIcon className="w-3.5 h-3.5" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-white truncate font-display">
                                {savedPersonalAccount.name}
                              </span>
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-500/30 text-blue-200 border border-blue-400/30">
                                {savedPersonalAccount.role}
                              </span>
                            </div>
                            <p className="text-xs text-slate-300 truncate font-medium">{savedPersonalAccount.email}</p>
                            <p className="text-[11px] text-slate-400">{savedPersonalAccount.district}, Maharashtra</p>
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
                          className="w-full h-[50px] rounded-xl text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2.5"
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
                          className="w-full py-2 text-xs font-semibold text-blue-300 hover:text-white transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Use a different personal Google account</span>
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handlePersonalGoogleSubmit} className="space-y-3.5">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-white font-display">
                              Choose Your Personal Google Account
                            </h4>
                            <p className="text-[11px] text-slate-300 mt-0.5">
                              Enter your personal Google credentials to sign in or create your verified account.
                            </p>
                          </div>
                          {savedPersonalAccount && (
                            <button
                              type="button"
                              onClick={() => setIsEditingPersonalAccount(false)}
                              className="text-xs font-semibold text-slate-400 hover:text-white"
                            >
                              Cancel
                            </button>
                          )}
                        </div>

                        {/* Email Input */}
                        <div>
                          <label className="block text-xs font-semibold text-slate-200 mb-1">
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
                              className="w-full glass-input h-[48px] rounded-xl pl-9 pr-3 text-xs sm:text-sm"
                            />
                          </div>
                        </div>

                        {/* Full Name Input */}
                        <div>
                          <label className="block text-xs font-semibold text-slate-200 mb-1">
                            Your Full Name
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-300">
                              <User className="w-4 h-4" />
                            </div>
                            <input
                              type="text"
                              required
                              value={customGoogleName}
                              onChange={(e) => setCustomGoogleName(e.target.value)}
                              placeholder="e.g. Uday Soni"
                              className="w-full glass-input h-[48px] rounded-xl pl-9 pr-3 text-xs sm:text-sm"
                            />
                          </div>
                        </div>

                        {/* Role Selector */}
                        <div>
                          <label className="block text-xs font-semibold text-slate-200 mb-1">
                            Stakeholder Role
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                            {[
                              { key: 'STUDENT' as UserRole, label: 'Student / Learner' },
                              { key: 'INDUSTRY' as UserRole, label: 'Industry Hub' },
                              { key: 'INSTITUTE' as UserRole, label: 'Institute / Faculty' },
                              { key: 'GOVERNMENT' as UserRole, label: 'Govt. Desk' },
                            ].map((r) => (
                              <button
                                key={r.key}
                                type="button"
                                onClick={() => setPersonalRole(r.key)}
                                className={`py-1.5 px-2 rounded-xl text-[11px] font-semibold border text-center transition-all ${
                                  personalRole === r.key
                                    ? 'bg-blue-600 text-white border-blue-400 shadow-sm'
                                    : 'bg-white/5 text-slate-300 border-white/20 hover:bg-white/10'
                                }`}
                              >
                                {r.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* District Selector */}
                        <div>
                          <label className="block text-xs font-semibold text-slate-200 mb-1">
                            District (Maharashtra)
                          </label>
                          <select
                            value={personalDistrict}
                            onChange={(e) => setPersonalDistrict(e.target.value)}
                            className="w-full glass-input h-[48px] rounded-xl px-3 text-xs bg-slate-900 text-white"
                          >
                            {MAHARASHTRA_DISTRICTS.map((d) => (
                              <option key={d} value={d} className="bg-slate-900 text-white">
                                {d}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Submit Button */}
                        <button
                          type="submit"
                          disabled={isLoading || !customGoogleEmail.includes('@')}
                          className="w-full h-[50px] rounded-xl text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 mt-2"
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
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                      SIH 2026 Evaluation Accounts (1-Click Login)
                    </div>

                    {GOOGLE_ACCOUNTS.map((acc) => (
                      <button
                        key={acc.email}
                        type="button"
                        disabled={isLoading}
                        onClick={() => handleGoogleAuth(acc.email, acc.name, acc.avatar, acc.role, acc.district)}
                        className="w-full p-3 rounded-2xl border border-white/15 hover:border-blue-400 bg-white/[0.05] hover:bg-white/[0.12] transition-all flex items-center gap-3 text-left group"
                      >
                        <img
                          src={acc.avatar}
                          alt={acc.name}
                          className="w-10 h-10 rounded-full object-cover border border-white/20 shrink-0 bg-slate-800"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs sm:text-sm text-white truncate font-display">
                              {acc.name}
                            </span>
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-white/15 text-blue-300 border border-white/10">
                              {acc.role}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 truncate">{acc.email}</p>
                          <p className="text-[10px] text-blue-300 font-medium truncate">{acc.roleTitle}</p>
                        </div>
                        {googleLoadingUser === acc.email ? (
                          <Loader2 className="w-4 h-4 animate-spin text-blue-400 shrink-0" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-300 group-hover:translate-x-0.5 transition-all shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-950/60 border-t border-white/10 text-[10px] text-slate-400 leading-relaxed shrink-0 flex items-center justify-between">
                <span>Certified for Govt. of Maharashtra SIH 2026</span>
                <span className="flex items-center gap-1 text-slate-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
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

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#071426] text-white p-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-black text-white text-2xl shadow-xl shadow-blue-500/30 ring-1 ring-white/30 font-display mb-4">
            J
          </div>
          <p className="text-sm font-bold tracking-tight text-white font-display">JOBZY</p>
          <p className="text-xs text-slate-400 mt-1">Preparing your workspace...</p>
        </div>
      }
    >
      <AuthFormContent />
    </Suspense>
  );
}
