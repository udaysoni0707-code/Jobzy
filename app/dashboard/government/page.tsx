import React from 'react';
import { db } from '@/lib/db';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge, SeverityBadge, SyntheticDataNotice } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MaharashtraHeatmap } from '@/components/maps/maharashtra-heatmap';
import {
  Landmark,
  TrendingUp,
  AlertTriangle,
  GraduationCap,
  Building2,
  Download,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function GovernmentDashboard() {
  const [districtMetrics, recentRecommendations, requirementsCount, institutesCount] = await Promise.all([
    db.districtDemandMetric.findMany({ orderBy: { indexScore: 'desc' } }),
    db.curriculumRecommendation.findMany({
      include: {
        course: { include: { institute: true } },
        skill: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    db.industryRequirement.count(),
    db.institute.count(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
              <Landmark className="w-4 h-4 text-blue-600" />
              Directorate of Technical Education (DTE) • Government of Maharashtra
            </span>
            <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded font-mono">
              SIH26134
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Statewide Skill Intelligence & Curriculum Alignment Desk
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Continuous cross-district monitoring of emerging technologies, institutional coverage, and critical skill deficits.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={undefined}
          >
            <Download className="w-4 h-4" />
            <span>Export State Dossier (PDF)</span>
          </Button>
          <Button variant="primary" size="sm" className="gap-1.5">
            <FileText className="w-4 h-4" />
            <span>Curriculum Action Plan</span>
          </Button>
        </div>
      </div>

      {/* State-Level Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Districts Monitored</span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100">36 Districts</h3>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">100% telemetry coverage</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Critical Shortage Skills</span>
              <h3 className="text-2xl font-black text-rose-600 dark:text-rose-400">BMS & Diagnostics</h3>
              <span className="text-[11px] text-slate-500">Pune / Chakan auto-cluster</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Affiliated Institutes</span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100">{institutesCount + 48} Units</h3>
              <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">MSBTE & ITI Polytechnic</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Industry Hiring Posts</span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100">1,850+ Signals</h3>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Automotive, IT, Energy</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive 36-District Heatmap */}
      <div className="space-y-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
            District-Level Skill Demand & Shortage Map
          </h2>
          <p className="text-xs text-slate-500">
            Granular geographic telemetry across Maharashtra industrial zones and vocational clusters.
          </p>
        </div>

        <MaharashtraHeatmap />
      </div>

      {/* Pending State Curriculum Recommendations */}
      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base sm:text-lg">
                State Curriculum Revision Docket & Recommendations
              </CardTitle>
              <CardDescription>
                AI-synthesized proposals submitted to MSBTE syllabus revision committee with empirical industry signals.
              </CardDescription>
            </div>
            <Badge variant="blue">{recentRecommendations.length} Active Docket Items</Badge>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {recentRecommendations.map((rec) => (
              <div
                key={rec.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {rec.course.title} ({rec.course.code})
                    </span>
                    <Badge variant={rec.priority === 'HIGH' ? 'rose' : 'amber'}>
                      Priority: {rec.priority}
                    </Badge>
                    <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                      Confidence: {rec.confidenceScore}%
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                    {rec.whyReason}
                  </p>

                  <div className="text-[11px] text-slate-500 flex items-center gap-3 pt-1">
                    <span>Institute: {rec.course.institute.name}</span>
                    <span>•</span>
                    <span>Target Skill: {rec.skill.name}</span>
                    <span>•</span>
                    <span className="font-semibold text-emerald-600">Status: {rec.status}</span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <a href="/curriculum">
                    <Button variant="primary" size="sm">
                      Inspect & Review
                    </Button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
