'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge, EmergingBadge, SyntheticDataNotice } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import {
  Building2,
  PlusCircle,
  Sparkles,
  CheckCircle2,
  Users,
  MapPin,
  TrendingUp,
  FileCheck,
  Zap,
} from 'lucide-react';
import { ExtractedSkill } from '@/types';

export default function IndustryDashboard() {
  const toast = useToast();
  const [requirements, setRequirements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState('Electric Vehicle Service & Battery Diagnostics Specialist');
  const [sector, setSector] = useState('Automotive & Clean Mobility');
  const [district, setDistrict] = useState('Pune');
  const [positions, setPositions] = useState(25);
  const [experienceYears, setExperienceYears] = useState(1);
  const [description, setDescription] = useState(
    'Seeking EV Technicians skilled in Battery Management Systems (BMS) testing, cell degradation analysis, high-voltage EV safety protocols, and DC fast charging infrastructure for our Pune manufacturing hub.'
  );

  const fetchRequirements = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/industry/requirements');
      const data = await res.json();
      if (data.requirements) {
        setRequirements(data.requirements);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequirements();
  }, []);

  const handleSubmitRequirement = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/industry/requirements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          sector,
          district,
          positions,
          experienceYears,
          description,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(
          'Requirement Published & Extracted!',
          `AI extracted ${data.extractedCount} technical competencies mapped to Maharashtra curriculum.`
        );
        fetchRequirements();
      } else {
        toast.error('Submission failed', data.error || 'Please check the form fields.');
      }
    } catch (err) {
      toast.error('Network error submitting requirement');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-4 h-4" />
              Tata Motors Passenger Vehicles EV Unit • Pune Hub
            </span>
            <Badge variant="emerald">Verified Industry Partner</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Industry Demand Desk & Talent Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Submit hiring requirements to signal emerging technical demands directly to Maharashtra vocational institutes and MSBTE.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs">
            <span className="text-slate-500 block">Regional Alignment</span>
            <span className="font-bold text-blue-600 dark:text-blue-400 text-base">64% Aligned</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs">
            <span className="text-slate-500 block">Active Signals</span>
            <span className="font-bold text-slate-900 dark:text-slate-100 text-base">
              {requirements.length} Posted
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Submit New Requirement Form */}
        <div className="lg:col-span-6 space-y-6">
          <Card className="border-slate-200 dark:border-slate-800 shadow-md">
            <CardHeader className="bg-slate-50/60 dark:bg-slate-950/40">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-blue-600" />
                  Post Industrial Skill Requirement
                </CardTitle>
                <Badge variant="blue">Automated NLP Extraction</Badge>
              </div>
              <CardDescription>
                Live signals will recompute district skill shortages and generate curriculum update recommendations.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-5">
              <form onSubmit={handleSubmitRequirement} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Job Role / Position Title
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Sector
                    </label>
                    <input
                      type="text"
                      required
                      value={sector}
                      onChange={(e) => setSector(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      District Hub
                    </label>
                    <input
                      type="text"
                      required
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Open Positions
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={positions}
                      onChange={(e) => setPositions(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Min. Exp (Years)
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Technical Job Description & Skill Requirements
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-3 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Include competencies (e.g. BMS calibration, high-voltage safety, cell balancing). The NLP engine normalizes them automatically.
                  </p>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isSubmitting}
                  className="w-full gap-2"
                >
                  <Zap className="w-4 h-4 text-amber-400" />
                  Publish & Signal Curriculum Desk
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Active Industry Demand Signals */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Active Industry Demands ({requirements.length})
            </h3>
            <span className="text-xs text-slate-500">Live signals fed to state model</span>
          </div>

          <div className="space-y-3">
            {requirements.map((req) => (
              <Card key={req.id} className="border-slate-200 dark:border-slate-800">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">{req.title}</h4>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          {req.org?.name || 'Tata Motors EV'}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {req.district}
                        </span>
                        <span>•</span>
                        <span>{req.positions} Openings</span>
                      </div>
                    </div>
                    <Badge variant="blue">{req.status}</Badge>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {req.description}
                  </p>

                  {req.skills && req.skills.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                        AI Normalized Competencies:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {req.skills.map((s: any, idx: number) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900"
                          >
                            <CheckCircle2 className="w-3 h-3 text-blue-500" />
                            {s.skill.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <SyntheticDataNotice />
        </div>
      </div>
    </div>
  );
}
