'use client';

import React from 'react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Badge, SeverityBadge, SyntheticDataNotice } from '@/components/ui/badge';
import {
  HelpCircle,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Wrench,
  GraduationCap,
  ShieldAlert,
  Percent,
} from 'lucide-react';

interface WhyRecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
  recommendation: {
    id: string;
    courseTitle: string;
    skillName: string;
    actionType: string;
    title: string;
    whyReason: string;
    confidenceScore: number;
    priority: string;
    evidenceJson?: string;
  } | null;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  isReviewing?: boolean;
}

export function WhyRecommendationModal({
  isOpen,
  onClose,
  recommendation,
  onApprove,
  onReject,
  isReviewing = false,
}: WhyRecommendationModalProps) {
  if (!recommendation) return null;

  let evidence: any = {};
  try {
    if (recommendation.evidenceJson) {
      evidence = JSON.parse(recommendation.evidenceJson);
    }
  } catch (e) {
    evidence = {};
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Explainable Recommendation Details"
      description="Transparent AI-assisted rationale backed by Maharashtra industrial signals."
      maxWidth="xl"
    >
      <div className="space-y-5">
        {/* Header summary banner */}
        <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wider">
              {recommendation.actionType.replace('_', ' ')}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500 dark:text-slate-400">Confidence:</span>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/80 px-2 py-0.5 rounded">
                {recommendation.confidenceScore}%
              </span>
            </div>
          </div>
          <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">{recommendation.title}</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Course: {recommendation.courseTitle}</p>
        </div>

        {/* 1. WHY? */}
        <div>
          <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
            <HelpCircle className="w-4 h-4 text-blue-600" />
            <span>Why is this recommended?</span>
          </div>
          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {recommendation.whyReason}
          </div>
        </div>

        {/* 2. EVIDENCE BREAKDOWN */}
        <div>
          <div className="flex items-center gap-2 mb-2.5 text-sm font-semibold text-slate-900 dark:text-slate-100">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>Data Signals & Evidence</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Industry Demand</span>
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {evidence.industryDemandScore || 94}/100
              </span>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Curriculum Coverage</span>
              <span className="text-lg font-bold text-rose-600 dark:text-rose-400">
                {evidence.curriculumCoverageScore || 10}%
              </span>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Open Positions</span>
              <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {evidence.openJobPositions || 180}+
              </span>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Shortage Severity</span>
              <span className="text-lg font-bold text-amber-600 dark:text-amber-400">CRITICAL</span>
            </div>
          </div>

          {evidence.recentPostingsSnippet && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 italic px-1">
              Source signal: {evidence.recentPostingsSnippet}
            </p>
          )}
        </div>

        {/* 3. IMPLEMENTATION REQUIREMENTS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
              <span>Trainer Upskilling</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              NABET/ASDC certified master trainer in high-voltage battery safety & diagnostics.
            </p>
          </div>

          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
              <Wrench className="w-3.5 h-3.5 text-emerald-600" />
              <span>Equipment / Lab Upgrade</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              4x Modular BMS test benches, CAN bus analyzers, and cell charge/discharge cyclers.
            </p>
          </div>
        </div>

        <SyntheticDataNotice />

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          {onReject && (
            <Button
              variant="danger"
              size="sm"
              isLoading={isReviewing}
              onClick={() => {
                onReject(recommendation.id);
                onClose();
              }}
            >
              Reject Proposal
            </Button>
          )}
          {onApprove && (
            <Button
              variant="emerald"
              size="sm"
              isLoading={isReviewing}
              onClick={() => {
                onApprove(recommendation.id);
                onClose();
              }}
            >
              Approve Curriculum Update
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
