import React from 'react';
import { db } from '@/lib/db';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge, SeverityBadge, SyntheticDataNotice } from '@/components/ui/badge';
import Link from 'next/link';
import {
  User,
  Briefcase,
  CheckCircle2,
  Clock,
  AlertTriangle,
  BookOpen,
  Award,
  ArrowRight,
  TrendingUp,
  Building2,
  Users,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function StudentDashboard() {
  const student = await db.user.findFirst({
    where: { role: 'STUDENT' },
    include: {
      profile: {
        include: { targetRole: true },
      },
      studentSkills: {
        include: { skill: true },
      },
      roadmaps: {
        include: { jobRole: true },
      },
    },
  });

  const roadmap = student?.roadmaps[0];
  let roadmapSteps: any[] = [];
  try {
    if (roadmap?.stepsJson) {
      roadmapSteps = JSON.parse(roadmap.stepsJson);
    }
  } catch (e) {
    roadmapSteps = [];
  }

  const evOpportunities = await db.industryRequirement.findMany({
    where: { sector: { contains: 'Automotive' } },
    include: { org: true, skills: { include: { skill: true } } },
    take: 3,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold bg-blue-500/30 text-blue-200 border border-blue-400/30 px-2.5 py-0.5 rounded-full">
              Verified Student • Government Polytechnic Pune
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, {student?.name || 'Aarav Deshmukh'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Target Career:{' '}
            <strong className="text-white">
              {student?.profile?.targetRole?.title || 'EV Technician & Diagnostic Specialist'}
            </strong>
          </p>
        </div>

        {/* Readiness Score dial */}
        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center gap-4 shrink-0">
          <div>
            <span className="text-xs text-slate-300 block">Job-Role Readiness</span>
            <span className="text-3xl font-black text-white">
              {student?.profile?.readinessScore || 68}%
            </span>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-emerald-400 flex items-center justify-center font-bold text-sm text-emerald-300">
            {student?.profile?.readinessScore || 68}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 Cols: Skill Profile & Roadmap */}
        <div className="lg:col-span-8 space-y-6">
          {/* Skill Gap Matrix */}
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="bg-slate-50/60 dark:bg-slate-950/40">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Role Competency & Skill Gap Analysis</CardTitle>
                  <CardDescription>
                    Comparison against live hiring requirements in Pune automotive cluster.
                  </CardDescription>
                </div>
                <Badge variant="blue">Updated Today</Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Mastered Skills */}
                <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Verified Competencies (2)</span>
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    <div className="flex justify-between">
                      <span>EV Safety Protocols (AIS-038)</span>
                      <span className="font-semibold text-emerald-600">85% Match</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Traction Motor & Inverter Control</span>
                      <span className="font-semibold text-emerald-600">70% Match</span>
                    </div>
                  </div>
                </div>

                {/* Critical Gaps */}
                <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50/40 dark:bg-rose-950/20 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Critical Skill Deficits (2)</span>
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    <div className="flex justify-between">
                      <span>Battery Management Systems (BMS)</span>
                      <SeverityBadge severity="CRITICAL" />
                    </div>
                    <div className="flex justify-between">
                      <span>Battery Degradation Diagnostics</span>
                      <SeverityBadge severity="CRITICAL" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interactive 5-Step Learning Roadmap */}
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="bg-slate-50/60 dark:bg-slate-950/40">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    Personalized EV Technician Learning Roadmap
                  </CardTitle>
                  <CardDescription>
                    Curated step-by-step path to close detected deficits and achieve 90%+ job readiness.
                  </CardDescription>
                </div>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-1 rounded">
                  Step 3 of 5 In Progress
                </span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-5">
              <div className="space-y-3">
                {roadmapSteps.map((step) => (
                  <div
                    key={step.step}
                    className={`p-4 rounded-xl border transition-all ${
                      step.completed
                        ? 'bg-slate-50/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800'
                        : step.step === 3
                        ? 'bg-blue-50/60 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 ring-1 ring-blue-500 shadow-xs'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                            step.completed
                              ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300'
                              : step.step === 3
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                          }`}
                        >
                          {step.completed ? '✓' : step.step}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                              {step.title}
                            </h4>
                            <span className="text-[10px] uppercase font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.2 rounded">
                              {step.type}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Focus Skill: <strong>{step.skill}</strong> • Provider: {step.provider}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        {step.completed ? (
                          <Badge variant="emerald">Completed</Badge>
                        ) : step.step === 3 ? (
                          <div className="space-y-1">
                            <Badge variant="blue">Active Next Step</Badge>
                            <span className="text-[10px] text-blue-600 font-semibold block">5 Weeks</span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">Locked</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right 4 Cols: Industry Openings & Connections */}
        <div className="lg:col-span-4 space-y-6">
          {/* Matched Opportunities */}
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                Regional Industry Opportunities
              </CardTitle>
              <CardDescription>Direct openings in Pune automotive corridor.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {evOpportunities.map((op) => (
                <div
                  key={op.id}
                  className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2 text-xs"
                >
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-slate-900 dark:text-slate-100">{op.title}</span>
                    <Badge variant="blue">{op.positions} open</Badge>
                  </div>
                  <p className="text-slate-500">{op.org.name} • {op.district}</p>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] text-blue-600 font-medium">Readiness: 68%</span>
                    <Button variant="primary" size="sm" className="h-7 text-xs px-2.5">
                      View Spec
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Networking & Peer Connections */}
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600" />
                  State Skill Network
                </CardTitle>
                <Link href="/connections" className="text-xs text-blue-600 hover:underline">
                  Manage
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                    P
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-slate-100 block">Priya Sharma</span>
                    <span className="text-slate-500 text-[10px]">Mechatronics Researcher</span>
                  </div>
                </div>
                <Link href="/messages">
                  <Button variant="outline" size="sm" className="h-7 text-xs">
                    Chat
                  </Button>
                </Link>
              </div>

              <div className="pt-2">
                <Link href="/connections">
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    Discover More Peers & Mentors
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <SyntheticDataNotice />
        </div>
      </div>
    </div>
  );
}
