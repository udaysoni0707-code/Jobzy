'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge, EmergingBadge, SyntheticDataNotice } from '@/components/ui/badge';
import { SkillExtractorWidget } from '@/components/ai/skill-extractor-widget';
import { MaharashtraHeatmap } from '@/components/maps/maharashtra-heatmap';
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
  ChevronDown,
  HelpCircle,
  BarChart3,
  MapPin,
  Sparkles,
  RefreshCw,
  Clock,
  Briefcase,
  AlertTriangle,
  FileCheck,
} from 'lucide-react';

export default function LandingPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqs = [
    {
      q: 'How does Jobzy differ from standard job portals?',
      a: 'Jobzy is an intelligence platform, not a classifieds job board. It continuously ingests industrial hiring signals, extracts standardized competencies through NLP, maps them against institutional curricula (MSBTE/ITI/Universities), computes granular skill gaps, and issues explainable recommendations to revise training programs.',
    },
    {
      q: 'Does the AI automatically identify official curriculum gaps?',
      a: 'Yes. Jobzy compares real-time employer requisitions with registered syllabus modules, calculating quantitative coverage and deficit scores to alert MSBTE, DTE, and institutional academic boards for formal review.',
    },
    {
      q: 'How is the TVET ecosystem evaluated?',
      a: 'The platform models technical readiness across automotive, electronics, IT, clean mobility, and manufacturing sectors, providing students with tailored learning roadmaps and vocational institutes with lab modernization directives.',
    },
    {
      q: 'Is the platform data-driven and dynamic?',
      a: 'Yes. Every new hiring requisition or syllabus update re-indexes district shortages and adjusts career readiness scores across 36 districts of Maharashtra in real time.',
    },
  ];

  return (
    <div className="flex flex-col gap-16 sm:gap-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
      {/* ========================================================================= */}
      {/* 4. HERO SECTION — TWO-COLUMN LAYOUT ON DESKTOP */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden pt-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* LEFT COLUMN: Hero Copy & Actions */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Small Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span>MAHARASHTRA SKILL INTELLIGENCE PLATFORM</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.12] break-words">
              Bridge the Gap Between{' '}
              <span className="text-blue-600 dark:text-blue-400">Industry Demand</span> and{' '}
              <span className="text-blue-600 dark:text-blue-400">Skill Supply</span>
            </h1>

            {/* Supporting Text */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl font-normal">
              Jobzy uses industry signals, skill intelligence, and curriculum analysis to identify emerging skill gaps and convert them into actionable training and career recommendations across Maharashtra.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <Link href="/dashboard/government">
                <Button
                  size="lg"
                  variant="primary"
                  className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold shadow-lg shadow-slate-900/10 dark:shadow-blue-500/20 gap-2 h-12 px-6 rounded-xl"
                >
                  <span>Explore Skill Intelligence</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <a href="#intelligence-loop">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto gap-2 h-12 px-6 rounded-xl border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
                >
                  <span>See How It Works</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </a>
            </div>

            {/* Government Mandate Citation */}
            <div className="pt-3 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-[10px]">
                ✓
              </div>
              <span>Aligned with Directorate of Technical Education (DTE) Maharashtra & MSBTE</span>
            </div>
          </div>

          {/* RIGHT COLUMN: Premium "Skill Intelligence Snapshot" Dashboard Card */}
          <div className="lg:col-span-5">
            <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl space-y-5 relative overflow-hidden">
              {/* Background ambient glow */}
              <div className="absolute -top-24 -right-24 w-60 h-60 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                    Skill Intelligence Snapshot
                  </span>
                </div>
                <span className="text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-full">
                  Live Telemetry
                </span>
              </div>

              {/* 4 Metric Data Elements */}
              <div className="grid grid-cols-2 gap-3 relative z-10">
                {/* Metric 1 */}
                <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    Industry Demand
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xl sm:text-2xl font-black text-white">+24%</span>
                    <span className="text-[10px] font-bold text-emerald-400 flex items-center">
                      <TrendingUp className="w-3 h-3 mr-0.5" /> YoY
                    </span>
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    Emerging Skills
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xl sm:text-2xl font-black text-blue-400">128</span>
                    <span className="text-[10px] text-slate-400">Categorized</span>
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    Districts Analyzed
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xl sm:text-2xl font-black text-white">36</span>
                    <span className="text-[10px] text-slate-400">Statewide</span>
                  </div>
                </div>

                {/* Metric 4 */}
                <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    Curriculum Alignment
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xl sm:text-2xl font-black text-emerald-400">94%</span>
                    <span className="text-[10px] text-slate-400">Target Read</span>
                  </div>
                </div>
              </div>

              {/* Animated Mini-Chart (Skill Demand Curve) */}
              <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/50 space-y-2 relative z-10">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[11px] font-semibold text-slate-300">
                    Industrial Skill Demand Index
                  </span>
                  <span className="text-[10px] text-blue-400 font-mono">Q1–Q4 Telemetry</span>
                </div>

                {/* SVG Sparkline */}
                <div className="w-full h-16 relative">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 320 60" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {/* Area fill */}
                    <path
                      d="M0,48 Q40,35 80,42 T160,28 T240,18 T320,8 L320,60 L0,60 Z"
                      fill="url(#chartGlow)"
                    />
                    {/* Glowing stroke */}
                    <path
                      d="M0,48 Q40,35 80,42 T160,28 T240,18 T320,8"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    {/* Data dots */}
                    <circle cx="80" cy="42" r="3" fill="#60a5fa" />
                    <circle cx="160" cy="28" r="3" fill="#60a5fa" />
                    <circle cx="240" cy="18" r="3" fill="#60a5fa" />
                    <circle cx="320" cy="8" r="4" fill="#3b82f6" className="animate-ping" />
                    <circle cx="320" cy="8" r="3.5" fill="#ffffff" />
                  </svg>
                </div>

                <div className="flex justify-between text-[9px] text-slate-500 font-mono uppercase">
                  <span>Q1 Ingestion</span>
                  <span>Q2 NLP Parse</span>
                  <span>Q3 MSBTE Audit</span>
                  <span>Q4 Live Match</span>
                </div>
              </div>

              {/* Real-time Ticker */}
              <div className="space-y-1.5 text-[11px] pt-1">
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                  <span className="truncate">
                    <strong>Tata Motors:</strong> 25 BMS Technicians required (Pune Corridor)
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span className="truncate">
                    <strong>MSBTE AE-EV-302:</strong> +36-Hour Dedicated Lab Module verified
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. TRUST / IMPACT METRICS */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Metric 1 */}
        <Card className="border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950 hover:shadow-md transition-shadow rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Coverage</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 block tracking-tight">
            36
          </span>
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1 block">
            Districts Covered
          </span>
        </Card>

        {/* Metric 2 */}
        <Card className="border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950 hover:shadow-md transition-shadow rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Alignment</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 block tracking-tight">
            94%
          </span>
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1 block">
            Skill-Curriculum Alignment
          </span>
        </Card>

        {/* Metric 3 */}
        <Card className="border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950 hover:shadow-md transition-shadow rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Taxonomy</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 block tracking-tight">
            1,850+
          </span>
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1 block">
            Industry Skills Mapped
          </span>
        </Card>

        {/* Metric 4 */}
        <Card className="border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950 hover:shadow-md transition-shadow rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Architecture</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 block tracking-tight">
            Closed-Loop
          </span>
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1 block">
            Feedback System
          </span>
        </Card>
      </section>

      {/* ========================================================================= */}
      {/* 6. "WHY JOBZY" SECTION — 3-COLUMN VISUAL COMPARISON & CLOSED-LOOP FLOW */}
      {/* ========================================================================= */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-800 shadow-xl space-y-10">
        <div className="max-w-3xl space-y-2">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
            Systemic Gap vs. Continuous Intelligence
          </span>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
            Why Traditional Vocational Education Lags Behind Industrial Realities
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Industrial technologies transform in 12–18 months, while state syllabi historically revised every 4–5 years. Jobzy closes this structural lag with live data pipelines.
          </p>
        </div>

        {/* 3 Columns Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Column 1: Current System */}
          <div className="p-6 rounded-2xl bg-slate-800/70 border border-rose-500/30 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs">
                ✕
              </div>
              <h3 className="text-base font-bold text-rose-300 uppercase tracking-wider text-xs sm:text-sm">
                Current System
              </h3>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span><strong>Delayed signals:</strong> 18–36 month lag between factory floor shifts and board awareness.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span><strong>Static curriculum:</strong> Multi-year revision cycles disconnected from emerging regional demand.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span><strong>Limited industry feedback:</strong> Ad-hoc hiring interactions without standardized skill taxonomy.</span>
              </li>
            </ul>
          </div>

          {/* Column 2: Jobzy Intelligence */}
          <div className="p-6 rounded-2xl bg-blue-950/50 border border-blue-500/50 space-y-4 shadow-lg ring-1 ring-blue-500/30">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                ⚡
              </div>
              <h3 className="text-base font-bold text-blue-300 uppercase tracking-wider text-xs sm:text-sm">
                Jobzy Intelligence
              </h3>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-200">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">•</span>
                <span><strong>Live industry signals:</strong> Automated ingestion of OEM & supplier technical requirements.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">•</span>
                <span><strong>Skill-level intelligence:</strong> Granular NLP normalizes aliases, acronyms, and weights.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">•</span>
                <span><strong>Continuous feedback:</strong> Direct channel between industry demand and academic decision makers.</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Outcome */}
          <div className="p-6 rounded-2xl bg-slate-800/70 border border-emerald-500/30 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                ✓
              </div>
              <h3 className="text-base font-bold text-emerald-300 uppercase tracking-wider text-xs sm:text-sm">
                Outcome
              </h3>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>Faster curriculum updates:</strong> Target lab and module injections executed in weeks, not years.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>Better employability:</strong> 94%+ correlation between student competency and hiring specifications.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong>Industry-ready workforce:</strong> Students trained on verified high-voltage & automation tools.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Visual Flow Representation */}
        <div className="pt-6 border-t border-slate-800">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-4 text-center">
            Closed-Loop Flow Model
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-semibold">
            <span className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-blue-300">
              Industry Signals
            </span>
            <span className="text-slate-500">→</span>
            <span className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-white">
              Skill Intelligence
            </span>
            <span className="text-slate-500">→</span>
            <span className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-amber-300">
              Curriculum Recommendations
            </span>
            <span className="text-slate-500">→</span>
            <span className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-white">
              Training
            </span>
            <span className="text-slate-500">→</span>
            <span className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-emerald-300">
              Employment
            </span>
            <span className="text-slate-500">→</span>
            <span className="px-3 py-1.5 rounded-xl bg-blue-600 text-white shadow-xs">
              Continuous Feedback ↺
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. CONTINUOUS INTELLIGENCE SECTION — CONNECTED WORKFLOW NODES */}
      {/* ========================================================================= */}
      <section id="intelligence-loop" className="space-y-8 text-center">
        <div className="max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Architecture
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            The Continuous Intelligence Feedback Loop
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            A state-level closed-loop system connecting employers, AI normalization, MSBTE curriculum boards, and learner roadmaps.
          </p>
        </div>

        {/* Connected Step Cards (01 to 05) */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-left">
          {/* Node 01 */}
          <Card className="border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950 p-4 rounded-2xl space-y-2 relative shadow-2xs">
            <span className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono block">01</span>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
              Industry Demand Signals
            </h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Ingestion of live requisitions, job specs, and hiring volumes from Maharashtra industrial corridors.
            </p>
          </Card>

          {/* Node 02 */}
          <Card className="border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950 p-4 rounded-2xl space-y-2 relative shadow-2xs">
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono block">02</span>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
              AI Skill Extraction & Normalization
            </h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Domain NLP engine parses acronyms (BMS, PLC), normalizes aliases, and scores demand intensity.
            </p>
          </Card>

          {/* Node 03 */}
          <Card className="border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950 p-4 rounded-2xl space-y-2 relative shadow-2xs">
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono block">03</span>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
              Curriculum Gap Scoring
            </h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Calculates coverage deficits against registered syllabi to classify critical shortages.
            </p>
          </Card>

          {/* Node 04 */}
          <Card className="border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950 p-4 rounded-2xl space-y-2 relative shadow-2xs">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono block">04</span>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
              Actionable Upskilling
            </h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Generates explainable module recommendations for MSBTE and personalized roadmap steps for students.
            </p>
          </Card>

          {/* Node 05 */}
          <Card className="border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950 p-4 rounded-2xl space-y-2 relative shadow-2xs">
            <span className="text-2xl font-black text-rose-600 dark:text-rose-400 font-mono block">05</span>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
              Industry Feedback
            </h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Employers validate hiring outcomes, completing the loop and re-indexing statewide telemetry.
            </p>
          </Card>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. AI SKILL EXTRACTION SECTION — INTERACTIVE LIVE DEMO */}
      {/* ========================================================================= */}
      <section id="pipeline" className="space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Live AI Pipeline
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Test the AI Skill Extraction Pipeline Live
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
            Experience our deterministic NLP engine extracting technical competencies, calculating confidence scores, and mapping syllabus modules in real time.
          </p>
        </div>

        {/* Real Interactive Widget */}
        <SkillExtractorWidget />
      </section>

      {/* ========================================================================= */}
      {/* 9. DISTRICT INTELLIGENCE / HEATMAP SECTION */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Regional Telemetry
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Statewide Maharashtra Skill Heatmap & Shortage Monitoring
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
              Cross-district deficit tracking across 36 districts to guide lab investments, technical teacher training, and localized syllabus electives.
            </p>
          </div>

          <Link href="/district-intelligence">
            <Button variant="outline" size="sm" className="gap-2 shrink-0 font-semibold">
              <span>View Full 36-District Report</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Interactive District Heatmap Component */}
        <MaharashtraHeatmap />
      </section>

      {/* ========================================================================= */}
      {/* 10. DECISION MAKER SECTION — 3 PERSONA CARDS */}
      {/* ========================================================================= */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Multi-Stakeholder Architecture
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Tailored Dashboards for Every Decision Maker
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Role-based governance interfaces designed specifically for government authorities, industrial partners, and educational institutions.
          </p>
        </div>

        {/* 3 Persona Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1. GOVERNMENT */}
          <Card className="border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950 p-6 rounded-2xl flex flex-col justify-between space-y-6 hover:shadow-lg transition-all">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center font-bold">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">GOVERNMENT</h3>
                <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                  Policy & Planning Desk
                </span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                  <span>District skill gaps & telemetry across all 36 Maharashtra districts.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                  <span>Statewide workforce supply-demand trends and critical shortage indices.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                  <span>Data-driven budget & laboratory funding allocation directives.</span>
                </li>
              </ul>
            </div>

            <Link href="/dashboard/government" className="pt-2">
              <Button variant="outline" size="sm" className="w-full justify-between group font-semibold">
                <span>Open Government Desk</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </Card>

          {/* 2. INDUSTRY */}
          <Card className="border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950 p-6 rounded-2xl flex flex-col justify-between space-y-6 hover:shadow-lg transition-all">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">INDUSTRY</h3>
                <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                  Hiring & Workforce Pipeline
                </span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 mt-0.5 shrink-0" />
                  <span>Broadcast live emerging skill requisitions directly to polytechnics.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 mt-0.5 shrink-0" />
                  <span>Access pre-assessed, verified student talent pool ready for placement.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 mt-0.5 shrink-0" />
                  <span>Signal regional deficits (BMS, PLC, Hydrogen) straight to DTE.</span>
                </li>
              </ul>
            </div>

            <Link href="/dashboard/industry" className="pt-2">
              <Button variant="outline" size="sm" className="w-full justify-between group font-semibold">
                <span>Open Industry Hub</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </Card>

          {/* 3. INSTITUTIONS */}
          <Card className="border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950 p-6 rounded-2xl flex flex-col justify-between space-y-6 hover:shadow-lg transition-all">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">INSTITUTIONS</h3>
                <span className="text-xs text-purple-600 dark:text-purple-400 font-semibold">
                  Training & Curriculum Desk
                </span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 mt-0.5 shrink-0" />
                  <span>Automated curriculum gap audits against live industrial demand.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 mt-0.5 shrink-0" />
                  <span>AI-synthesized syllabus revisions with explicit industrial evidence.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 mt-0.5 shrink-0" />
                  <span>Boost student placement rates with aligned technical courses.</span>
                </li>
              </ul>
            </div>

            <Link href="/curriculum" className="pt-2">
              <Button variant="outline" size="sm" className="w-full justify-between group font-semibold">
                <span>Open Curriculum Desk</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11. FAQ SECTION — MODERN ACCORDION */}
      {/* ========================================================================= */}
      <section className="max-w-3xl mx-auto w-full space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Governance & Clarity
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Understanding Jobzy&apos;s role in Maharashtra&apos;s technical and vocational education transformation.
          </p>
        </div>

        {/* Accordion List (Only one open at a time) */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200/80 dark:border-slate-800/80 rounded-2xl bg-white dark:bg-slate-950 overflow-hidden transition-all shadow-2xs"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-3 ${
                      isOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-3 animate-in fade-in-50 duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 12. FINAL CTA SECTION — WIDE NAVY ENTERPRISE CTA */}
      {/* ========================================================================= */}
      <section className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white rounded-3xl p-8 sm:p-14 text-center space-y-6 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-60 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl mx-auto space-y-3 relative z-10">
          <span className="text-xs font-bold text-blue-300 uppercase tracking-widest block">
            Official State Initiative
          </span>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Ready to Align Technical Education with Maharashtra&apos;s Industrial Future?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Transform industry signals into actionable skill intelligence, curriculum insights, and workforce outcomes.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 relative z-10">
          <Link href="/dashboard/government" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/30 transition-all cursor-pointer">
              Launch Government Desk
            </button>
          </Link>
          <Link href="/curriculum" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20 backdrop-blur-xs transition-all cursor-pointer">
              Explore Curriculum Gaps
            </button>
          </Link>
        </div>

        <p className="text-[11px] text-slate-400 relative z-10">
          Industry → Skills → Curriculum → Employment • Closed-Loop Telemetry
        </p>
      </section>
    </div>
  );
}
