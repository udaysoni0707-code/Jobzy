'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge, EmergingBadge, SyntheticDataNotice } from '@/components/ui/badge';
import { SkillExtractorWidget } from '@/components/ai/skill-extractor-widget';
import {
  ArrowRight,
  TrendingUp,
  Cpu,
  Building2,
  GraduationCap,
  Landmark,
  User,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Activity,
  Layers,
  ChevronRight,
  HelpCircle,
  BarChart3,
  MapPin,
  Sparkles,
} from 'lucide-react';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<'GOVERNMENT' | 'INDUSTRY' | 'INSTITUTE' | 'STUDENT'>('GOVERNMENT');

  const faqs = [
    {
      q: 'How does Jobzy differ from standard job or course portals?',
      a: 'Jobzy is an intelligence platform, not a classifieds board. It ingests industrial hiring signals, extracts standardized competencies through NLP, maps them against institutional curricula (MSBTE/ITI/Universities), computes granular skill gaps, and issues explainable recommendations to revise training programs.',
    },
    {
      q: 'Does the AI automatically overwrite official curricula?',
      a: 'No. In alignment with AI Safety principles, Jobzy provides transparent, explainable recommendations backed by empirical data signals. Curriculum decisions remain entirely under the authority of MSBTE, DTE, and certified institutional committees.',
    },
    {
      q: 'How is the EV Technician scenario evaluated?',
      a: 'When an automotive OEM posts a requirement for EV diagnostics and BMS calibration, the system automatically checks regional diploma syllabi, identifies a critical 85pt shortage in BMS, proposes a 36-hour laboratory module, alerts the Government desk, and updates students’ career readiness scores.',
    },
    {
      q: 'Is the district data real or synthetic?',
      a: 'The platform architecture is designed to ingest real job board feeds, EPFO data, and DTE databases. Synthetic prototype datasets representing Maharashtra districts are utilized and clearly badged.',
    },
  ];

  return (
    <div className="flex flex-col gap-16 sm:gap-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 sm:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[600px] h-[350px] bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 mb-6 animate-fade-in max-w-full text-center">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span className="truncate sm:whitespace-normal">AI-Powered Skill Intelligence Platform</span>
        </div>

        <h1 className="text-2xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight max-w-4xl mx-auto leading-[1.2] sm:leading-[1.15] break-words">
          Bridge the Gap Between <span className="text-blue-600 dark:text-blue-400">Industry Demand</span> and Skill Development
        </h1>

        <p className="mt-4 sm:mt-6 text-sm sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Jobzy uses industry signals, skill intelligence, and curriculum analysis to identify emerging skill gaps and convert them into actionable training and career recommendations across Maharashtra.
        </p>

        {/* Hero CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
          <Link href="/dashboard/government" className="w-full sm:w-auto">
            <Button size="lg" variant="primary" className="w-full sm:w-auto shadow-lg shadow-blue-500/10 gap-2">
              <span>Explore Skill Intelligence</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <a href="#pipeline" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2">
              <span>See How It Works</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </a>
        </div>

        {/* State Trust Metric Badges */}
        <div className="mt-10 sm:mt-14 pt-8 border-t border-slate-200/80 dark:border-slate-800/80 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 text-left">
          <div className="p-3 sm:p-4 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 backdrop-blur-xs">
            <span className="text-xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400 block">36</span>
            <span className="text-[11px] sm:text-xs font-medium text-slate-600 dark:text-slate-400 leading-tight block mt-0.5">Maharashtra Districts Covered</span>
          </div>
          <div className="p-3 sm:p-4 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 backdrop-blur-xs">
            <span className="text-xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 block">94%</span>
            <span className="text-[11px] sm:text-xs font-medium text-slate-600 dark:text-slate-400 leading-tight block mt-0.5">EV & Automation Accuracy</span>
          </div>
          <div className="p-3 sm:p-4 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 backdrop-blur-xs">
            <span className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 block">1,850+</span>
            <span className="text-[11px] sm:text-xs font-medium text-slate-600 dark:text-slate-400 leading-tight block mt-0.5">Active Industry Signals</span>
          </div>
          <div className="p-3 sm:p-4 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 backdrop-blur-xs">
            <span className="text-xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400 block">Closed-Loop</span>
            <span className="text-[11px] sm:text-xs font-medium text-slate-600 dark:text-slate-400 leading-tight block mt-0.5">Curriculum Feedback System</span>
          </div>
        </div>
      </section>

      {/* 2. THE CORE PROBLEM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-xl">
          <div className="max-w-3xl">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">The Systemic Challenge</span>
            <h2 className="text-2xl sm:text-3xl font-bold mt-2">
              Why Traditional Vocational Education Lags Behind Industrial Realities
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
              Industrial technology cycles (such as Electric Vehicles, PLC automation, and Green Hydrogen) transform in 12–18 months. However, state polytechnic and ITI curricula typically update on 4–5 year intervals. This creates an acute skill mismatch where companies suffer severe technical shortages while graduates struggle with unemployability.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-slate-800">
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-rose-400 font-bold text-lg block mb-1">Delayed Signals</span>
              <p className="text-xs text-slate-300">
                Job vacancies remain unfilled while universities continue teaching outdated legacy modules without direct market feedback.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-amber-400 font-bold text-lg block mb-1">Syllabus Inertia</span>
              <p className="text-xs text-slate-300">
                Curriculum revision committees lack real-time quantitative evidence on which specific competencies are missing.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-emerald-400 font-bold text-lg block mb-1">Jobzy Solution</span>
              <p className="text-xs text-slate-300">
                Continuous automated feedback loop converting live OEM requirements into validated curriculum recommendations and student roadmaps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CONTINUOUS INTELLIGENCE PIPELINE */}
      <section id="pipeline" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Architecture
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">
            The Continuous Intelligence Feedback Loop
          </h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            From industrial hiring posts to state policy actions, every layer operates with mathematical transparency.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative group hover:border-blue-500 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center font-bold mb-4">
              1
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Industry Demand Signals</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              OEMs (e.g. Tata Motors, Mahindra) submit technical job specs or portal feeds across Maharashtra auto corridors.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative group hover:border-blue-500 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center font-bold mb-4">
              2
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">AI Skill Extraction & Normalization</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              NLP tokenizes technical terms, normalizes synonyms (e.g. BMS $\rightarrow$ Battery Management Systems), and computes weights.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative group hover:border-blue-500 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center font-bold mb-4">
              3
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Curriculum Gap Scoring</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Compares required competencies against MSBTE course modules using deterministic mathematical gap formulas.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative group hover:border-blue-500 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-bold mb-4">
              4
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Actionable Upskilling</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Generates explainable module recommendations for institutes, district heatmaps for Government, and roadmaps for students.
            </p>
          </div>
        </div>
      </section>

      {/* 4. LIVE INTERACTIVE NLP WIDGET */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="mb-6">
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Interactive Test Bench
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
            Test the AI Skill Extraction Pipeline Live
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Paste any technical job requirement or click one of the presets to watch real-time taxonomy normalization.
          </p>
        </div>

        <SkillExtractorWidget />
      </section>

      {/* 5. FOUR STAKEHOLDER DASHBOARDS PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Multi-Stakeholder Ecosystem
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">
            Tailored Desks for Every Decision Maker
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Select a role to preview how Jobzy equips each stakeholder with dedicated intelligence:
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveTab('GOVERNMENT')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'GOVERNMENT'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            <Landmark className="w-4 h-4" />
            <span>Government Desk</span>
          </button>
          <button
            onClick={() => setActiveTab('INDUSTRY')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'INDUSTRY'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Industry & Employers</span>
          </button>
          <button
            onClick={() => setActiveTab('INSTITUTE')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'INSTITUTE'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Vocational Institutes</span>
          </button>
          <button
            onClick={() => setActiveTab('STUDENT')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'STUDENT'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Students & Learners</span>
          </button>
        </div>

        {/* Dynamic Stakeholder Preview Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-lg">
          {activeTab === 'GOVERNMENT' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <Badge variant="blue">State Policy & Resource Planning</Badge>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  Statewide Maharashtra Skill Heatmap & Shortage Monitoring
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Enables the Directorate of Technical Education and Government of Maharashtra to pinpoint which districts (e.g. Pune, Chhatrapati Sambhaji Nagar, Nashik) face critical industrial shortages, allocate lab modernization grants, and monitor vocational training capacity.
                </p>
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>36-district interactive shortage index</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Curriculum mismatch alerts before graduation cycles</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Exportable State Skill Dossier reports</span>
                  </div>
                </div>
                <div className="pt-4">
                  <Link href="/dashboard/government">
                    <Button variant="primary" size="md">
                      Open Government Portal
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span>Pune District - High Shortage Alert</span>
                  <span className="text-rose-600 dark:text-rose-400 font-bold">CRITICAL (85pt Gap)</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full w-[85%]" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Skill: Battery Management Systems (BMS) • 180+ Unfilled positions across Chakan OEM cluster.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'INDUSTRY' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <Badge variant="blue">Employer & Cluster Demand</Badge>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  Direct Pipeline to Maharashtra Technical Institutes
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Employers submit immediate and emerging technical competencies. Instead of waiting for unaligned graduates, the system automatically translates their hiring specs into institutional curriculum upgrades.
                </p>
                <div className="pt-4">
                  <Link href="/dashboard/industry">
                    <Button variant="primary" size="md">
                      Open Industry Desk
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Tata Motors EV Systems - Pune
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 italic">
                  &quot;Hiring 25 EV Technicians skilled in BMS cell diagnostics and high-voltage safety.&quot;
                </p>
                <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300">
                  ✓ 4 competencies mapped to MSBTE curriculum update recommendation.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'INSTITUTE' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <Badge variant="emerald">Curriculum Alignment</Badge>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  Real-time Syllabus Gap Auditing & Module Approvals
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Vocational faculties and MSBTE committees inspect course alignment percentages, receive AI-assisted module recommendations, and approve syllabus revisions with full evidence and transparent rationale.
                </p>
                <div className="pt-4">
                  <Link href="/dashboard/institute">
                    <Button variant="emerald" size="md">
                      Open Institute Desk
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  AE-EV-302: Diploma Automobile (EV Specialization)
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Industry Alignment:</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">64%</span>
                </div>
                <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-blue-800 dark:text-blue-300">
                  Proposed: Add 36-hr module &quot;BMS Architecture & Diagnostics&quot;
                </div>
              </div>
            </div>
          )}

          {activeTab === 'STUDENT' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <Badge variant="blue">Career Roadmap & Readiness</Badge>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  Target Role Readiness & Verified Skill Roadmap
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Students select their target industrial position (e.g. EV Technician, Robotics Automation Engineer), view their dynamic readiness score, identify exact missing competencies, and follow guided learning roadmaps.
                </p>
                <div className="pt-4">
                  <Link href="/dashboard/student">
                    <Button variant="primary" size="md">
                      Open Student Roadmap
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span>Aarav Deshmukh • EV Technician</span>
                  <span className="text-blue-600 dark:text-blue-400 font-bold">68% Ready</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full w-[68%]" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Next Step: Complete Step 3 — Battery Management Systems Practical Lab.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 6. FAQ SECTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Evaluation & Credibility
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs"
            >
              <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-600 shrink-0" />
                {faq.q}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed pl-6">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. FINAL CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white text-center relative overflow-hidden border border-slate-800 shadow-2xl">
          <h2 className="text-2xl sm:text-4xl font-black max-w-2xl mx-auto">
            Ready to Align Technical Education with Maharashtra&apos;s Industrial Future?
          </h2>
          <p className="mt-4 text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Experience the complete end-to-end demo scenario or jump straight into the state dashboard.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/dashboard/government">
              <Button size="lg" variant="secondary" className="gap-2">
                Launch Government Desk
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/curriculum">
              <Button size="lg" variant="outline" className="text-white border-white/20 hover:bg-white/10">
                Explore Curriculum Gaps
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
