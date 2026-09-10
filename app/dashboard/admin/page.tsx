import React from 'react';
import { db } from '@/lib/db';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge, EmergingBadge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import {
  ShieldCheck,
  Users,
  Building2,
  GraduationCap,
  Layers,
  CheckCircle2,
  Clock,
  KeyRound,
  FileCheck,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const [users, organizations, institutes, skills, auditLogs] = await Promise.all([
    db.user.findMany({ include: { profile: true }, orderBy: { createdAt: 'desc' }, take: 10 }),
    db.organization.findMany({ orderBy: { createdAt: 'desc' } }),
    db.institute.findMany({ orderBy: { createdAt: 'desc' } }),
    db.skill.findMany({ include: { aliases: true }, orderBy: { demandIndex: 'desc' }, take: 15 }),
    db.auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: 8 }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              SkillAlign Governance & System Administration Desk
            </span>
            <Badge variant="blue">Master Admin</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Platform Moderation, Taxonomy Registry & Audit Trail
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Supervise multi-role verification, audit platform operations, and manage Maharashtra skill taxonomy definitions.
          </p>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="p-5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500">Registered Users</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{users.length} Active</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="p-5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500">Partner Organizations</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{organizations.length} Verified</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="p-5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500">Technical Institutes</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{institutes.length} Mapped</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="p-5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-500">Taxonomy Competencies</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{skills.length}+ Cataloged</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* User & Organization Moderation */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader className="bg-slate-50/60 dark:bg-slate-950/40">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">User Directory & Verification Status</CardTitle>
                <Badge variant="blue">{users.length} Records</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.map((u) => (
                  <div key={u.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-slate-100 block">{u.name}</span>
                      <span className="text-slate-500">{u.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                        {u.role}
                      </span>
                      {u.isVerified ? (
                        <span className="text-emerald-600 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Verified
                        </span>
                      ) : (
                        <span className="text-amber-600 font-semibold">Pending</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Audit Logs */}
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader className="bg-slate-50/60 dark:bg-slate-950/40">
              <CardTitle className="text-base flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-blue-600" />
                System Audit & Security Trail
              </CardTitle>
              <CardDescription>Immutable record of critical policy events, updates, and reviews.</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-2 text-xs">
                {auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-2.5 rounded-lg bg-slate-50/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">{log.action}</span>
                      <span className="text-slate-500 block text-[11px]">{log.resource}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">{formatDate(log.createdAt)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Skill Taxonomy Registry */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader className="bg-slate-50/60 dark:bg-slate-950/40">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Maharashtra Skill Taxonomy</CardTitle>
                <Badge variant="emerald">Live NLP Dictionary</Badge>
              </div>
              <CardDescription>Standardized competencies & synonym aliases.</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <div className="max-h-[500px] overflow-y-auto space-y-2.5 pr-1">
                {skills.map((s) => (
                  <div
                    key={s.id}
                    className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-slate-900 dark:text-slate-100">{s.name}</span>
                        {s.isEmerging && <EmergingBadge />}
                      </div>
                      <span className="font-semibold text-blue-600 dark:text-blue-400">
                        {s.demandIndex}/100
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 block">{s.category}</span>
                    {s.aliases && s.aliases.length > 0 && (
                      <div className="text-[10px] text-slate-400 pt-1">
                        Aliases: {s.aliases.map((a) => a.alias).join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
