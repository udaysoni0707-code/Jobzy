'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge, SeverityBadge, SyntheticDataNotice } from '@/components/ui/badge';
import { WhyRecommendationModal } from '@/components/ai/why-recommendation-modal';
import { useToast } from '@/components/ui/toast';
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Clock,
  Wrench,
  Sparkles,
  PlusCircle,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';

export default function InstituteDashboard() {
  const toast = useToast();
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [selectedRec, setSelectedRec] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // New module modal state
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [newModuleHours, setNewModuleHours] = useState(30);

  const fetchCurriculumData = async () => {
    try {
      const [coursesRes, recsRes] = await Promise.all([
        fetch('/api/curriculum'),
        fetch('/api/recommendations'),
      ]);
      const coursesData = await coursesRes.json();
      const recsData = await recsRes.json();

      if (coursesData.courses) setCourses(coursesData.courses);
      if (recsData.recommendations) setRecommendations(recsData.recommendations);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchCurriculumData();
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => {
        if (d?.user) setCurrentUser(d.user);
      })
      .catch(() => {});
  }, []);

  const handleApprove = async (recommendationId: string) => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'APPROVE',
          recommendationId,
          reviewerName: 'MSBTE Regional Academic Board',
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(
          'Curriculum Update Approved!',
          'New laboratory module added to syllabus. Course alignment boosted!'
        );
        fetchCurriculumData();
      } else {
        toast.error('Approval failed', data.error);
      }
    } catch (err) {
      toast.error('Network error during approval');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (recommendationId: string) => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'REJECT',
          recommendationId,
          reviewerName: 'MSBTE Regional Academic Board',
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.info('Recommendation Rejected', 'Proposal marked as rejected by committee.');
        fetchCurriculumData();
      }
    } catch (err) {
      toast.error('Network error during rejection');
    } finally {
      setIsProcessing(false);
    }
  };

  const currentCourse = courses[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4" />
              {currentUser?.institute?.name || (currentUser?.role === 'INSTITUTE' ? currentUser.name : 'Government Polytechnic Pune')} • MSBTE Affiliated (Code: {currentUser?.institute?.code || 'MSBTE-6002'})
            </span>
            <Badge variant="emerald">State Approved Institute</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Curriculum Alignment & Module Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Map vocational courses to live industrial signals, review AI-synthesized syllabus updates, and eliminate skill deficits.
          </p>
        </div>

        {currentCourse && (
          <div className="flex items-center gap-3">
            <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-left">
              <span className="text-xs text-blue-700 dark:text-blue-300 font-semibold block">
                Industry Alignment
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-black text-blue-700 dark:text-blue-300">
                  {currentCourse.alignmentScore}%
                </span>
                <span className="text-xs text-slate-500">Target: 85%+</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Course Structure & Modules */}
        <div className="lg:col-span-7 space-y-6">
          {currentCourse && (
            <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader className="bg-slate-50/60 dark:bg-slate-950/40">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Active Syllabus Under Review
                    </span>
                    <CardTitle className="text-lg mt-0.5">
                      {currentCourse.title} ({currentCourse.code})
                    </CardTitle>
                    <CardDescription>{currentCourse.department} • 48 Weeks Duration</CardDescription>
                  </div>
                  <Badge variant="blue">Level: Diploma / Polytechnic</Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 pt-5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Syllabus Modules ({currentCourse.modules?.length || 0})
                  </h4>
                  <span className="text-xs text-slate-500">Ordered sequence</span>
                </div>

                <div className="space-y-3">
                  {currentCourse.modules?.map((mod: any, index: number) => (
                    <div
                      key={mod.id}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                              #{index + 1}
                            </span>
                            <h5 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                              {mod.title}
                            </h5>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {mod.description}
                          </p>
                        </div>
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                          {mod.hours} Hours
                        </span>
                      </div>

                      {mod.skills && mod.skills.length > 0 && (
                        <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] text-slate-400 uppercase font-semibold">
                            Mapped Skills:
                          </span>
                          {mod.skills.map((ms: any, i: number) => (
                            <span
                              key={i}
                              className="text-xs px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-medium"
                            >
                              {ms.skill.name} ({ms.coverageLevel})
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <SyntheticDataNotice />
        </div>

        {/* Right Side: AI Curriculum Recommendations & Gaps */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-slate-200 dark:border-slate-800 shadow-md">
            <CardHeader className="bg-slate-50/60 dark:bg-slate-950/40">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  AI Curriculum Recommendations
                </CardTitle>
                <Badge variant="blue">{recommendations.length} Detected</Badge>
              </div>
              <CardDescription>
                Empirical updates based on live industry demand vs MSBTE course vacancy.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pt-4">
              {recommendations.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">
                  No pending recommendations. Curriculum is well-aligned.
                </p>
              ) : (
                recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                            {rec.skill.name}
                          </span>
                          <SeverityBadge severity="CRITICAL" />
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {rec.whyReason}
                        </p>
                      </div>
                      <Badge variant={rec.status === 'APPROVED' ? 'emerald' : 'amber'}>
                        {rec.status}
                      </Badge>
                    </div>

                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <button
                        onClick={() => {
                          setSelectedRec({
                            ...rec,
                            courseTitle: rec.course?.title || currentCourse?.title,
                            skillName: rec.skill?.name,
                          });
                          setIsModalOpen(true);
                        }}
                        className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline cursor-pointer"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>Why this recommendation?</span>
                      </button>

                      {rec.status === 'PENDING' && (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="emerald"
                            size="sm"
                            isLoading={isProcessing}
                            onClick={() => handleApprove(rec.id)}
                          >
                            Approve
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Trainer and Equipment Readiness Card */}
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Wrench className="w-4 h-4 text-emerald-600" />
                Laboratory & Trainer Readiness Index
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400">EV High Voltage Safety Lab</span>
                <span className="text-emerald-600 font-bold">Operational (AIS-038 Compliant)</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400">BMS Diagnostic Test Benches</span>
                <span className="text-rose-600 font-bold">Shortage (4 Units Needed)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-400">Certified Master Faculty</span>
                <span className="text-amber-600 font-bold">2 of 5 Certified</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Explainable AI Modal */}
      <WhyRecommendationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        recommendation={selectedRec}
        onApprove={handleApprove}
        onReject={handleReject}
        isReviewing={isProcessing}
      />
    </div>
  );
}
