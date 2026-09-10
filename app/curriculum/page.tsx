'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge, SeverityBadge, SyntheticDataNotice } from '@/components/ui/badge';
import { SkillExtractorWidget } from '@/components/ai/skill-extractor-widget';
import { WhyRecommendationModal } from '@/components/ai/why-recommendation-modal';
import { useToast } from '@/components/ui/toast';
import {
  BookOpen,
  Sparkles,
  GraduationCap,
  Layers,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';

export default function CurriculumPage() {
  const toast = useToast();
  const [courses, setCourses] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [selectedRec, setSelectedRec] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchCurriculum = async () => {
    try {
      const [coursesRes, recsRes] = await Promise.all([
        fetch('/api/curriculum'),
        fetch('/api/recommendations'),
      ]);
      const cData = await coursesRes.json();
      const rData = await recsRes.json();
      if (cData.courses) setCourses(cData.courses);
      if (rData.recommendations) setRecommendations(rData.recommendations);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchCurriculum();
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
          reviewerName: 'State Board of Technical Education',
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Approved!', 'Module added to syllabus and course score boosted.');
        fetchCurriculum();
      }
    } catch (err) {
      toast.error('Approval failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const currentCourse = courses[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" />
            Curriculum Intelligence & AI Recommendation Engine
          </span>
          <Badge variant="blue">Closed-Loop Alignment</Badge>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          Syllabus-to-Industry Mapping & Gap Rectification
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
          Automated comparison between vocational training modules (MSBTE/ITI) and active industrial hiring requirements. Approve AI recommendations with transparent evidence.
        </p>
      </div>

      {/* Live AI Extractor Bench */}
      <div>
        <SkillExtractorWidget />
      </div>

      {/* Course Alignment & Recommendations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Active Vocational Syllabi ({courses.length})
          </h3>

          {courses.map((course) => (
            <Card key={course.id} className="border-slate-200 dark:border-slate-800">
              <CardHeader className="bg-slate-50/60 dark:bg-slate-950/40">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-base">
                      {course.title} ({course.code})
                    </CardTitle>
                    <CardDescription>{course.institute?.name} • {course.level}</CardDescription>
                  </div>
                  <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950 text-center">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Alignment</span>
                    <span className="text-base font-black text-blue-600 dark:text-blue-400">
                      {course.alignmentScore}%
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-5 space-y-3">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                  Curriculum Modules ({course.modules?.length || 0}):
                </span>

                <div className="space-y-2">
                  {course.modules?.map((m: any, idx: number) => (
                    <div
                      key={m.id}
                      className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs flex items-start justify-between gap-2"
                    >
                      <div>
                        <span className="font-bold text-slate-900 dark:text-slate-100 block">
                          #{idx + 1} {m.title}
                        </span>
                        <p className="text-slate-500 text-[11px] mt-0.5">{m.description}</p>
                      </div>
                      <span className="text-slate-400 font-mono text-[11px] shrink-0">
                        {m.hours} hrs
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Recommendations */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Explainable Recommendations ({recommendations.length})
          </h3>

          <div className="space-y-3">
            {recommendations.map((rec) => (
              <Card key={rec.id} className="border-slate-200 dark:border-slate-800">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                        {rec.title}
                      </span>
                      <span className="text-[11px] text-slate-500">{rec.course?.title}</span>
                    </div>
                    <Badge variant={rec.status === 'APPROVED' ? 'emerald' : 'amber'}>
                      {rec.status}
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {rec.whyReason}
                  </p>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setSelectedRec({
                          ...rec,
                          courseTitle: rec.course?.title,
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
                      <Button
                        variant="emerald"
                        size="sm"
                        isLoading={isProcessing}
                        onClick={() => handleApprove(rec.id)}
                      >
                        Approve Update
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <SyntheticDataNotice />
        </div>
      </div>

      <WhyRecommendationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        recommendation={selectedRec}
        onApprove={handleApprove}
        isReviewing={isProcessing}
      />
    </div>
  );
}
