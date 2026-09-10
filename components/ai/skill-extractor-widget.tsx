'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge, EmergingBadge } from '@/components/ui/badge';
import { Sparkles, ArrowRight, CheckCircle2, Zap } from 'lucide-react';
import { ExtractedSkill } from '@/types';

export function SkillExtractorWidget() {
  const [inputText, setInputText] = useState(
    'Looking for an EV Technician experienced in battery diagnostics, BMS calibration, DC fast charging infrastructure, and high-voltage EV safety protocols.'
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [skills, setSkills] = useState<ExtractedSkill[]>([
    {
      name: 'Battery Management Systems',
      category: 'EV & Clean Mobility',
      matchedAlias: 'BMS',
      confidence: 96,
      isEmerging: true,
      frequency: 1,
    },
    {
      name: 'Battery Diagnostics',
      category: 'EV & Clean Mobility',
      matchedAlias: 'battery diagnostics',
      confidence: 94,
      isEmerging: true,
      frequency: 1,
    },
    {
      name: 'EV Safety Protocols',
      category: 'EV & Clean Mobility',
      matchedAlias: 'ev safety',
      confidence: 95,
      isEmerging: true,
      frequency: 1,
    },
    {
      name: 'Charging Infrastructure',
      category: 'EV & Clean Mobility',
      matchedAlias: 'charging infrastructure',
      confidence: 92,
      isEmerging: true,
      frequency: 1,
    },
  ]);

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/skills/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
      });
      const data = await res.json();
      if (data.skills) {
        setSkills(data.skills);
      }
    } catch (err) {
      console.error('Extraction error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const samplePresets = [
    {
      label: 'EV Technician (Pune Auto Cluster)',
      text: 'Looking for an EV Technician experienced in battery diagnostics, BMS calibration, DC fast charging infrastructure, and high-voltage EV safety protocols.',
    },
    {
      label: 'Smart Factory Automation',
      text: 'Hiring Senior Automation Engineer proficient in PLC programming (Siemens S7), SCADA telemetry, industrial robotics (KUKA), and IoT sensor gateways.',
    },
    {
      label: 'Clean Tech & Green Hydrogen',
      text: 'Seeking Energy Specialist skilled in Solar PV system design, PVsyst simulation, and green hydrogen PEM electrolyzer operations.',
    },
  ];

  return (
    <Card className="border-slate-200 dark:border-slate-800 shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-base">Live NLP Skill Extraction & Taxonomy Normalizer</CardTitle>
              <CardDescription>
                Extracts standardized skills, normalizes industry acronyms, and assigns confidence scores.
              </CardDescription>
            </div>
          </div>
          <Badge variant="blue">Deterministic NLP Pipeline</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Preset chips */}
        <div className="flex flex-wrap gap-2 items-center text-xs">
          <span className="text-slate-500 font-medium">Try Industry Presets:</span>
          {samplePresets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => setInputText(p.text)}
              className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 dark:hover:text-blue-400 text-slate-700 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Input Textarea */}
        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={3}
            className="w-full p-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Paste raw job description, technical curriculum snippet, or training requirements..."
          />
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <Button
            onClick={runAnalysis}
            isLoading={isAnalyzing}
            variant="primary"
            size="md"
            className="gap-2"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            Extract & Normalize Skills
          </Button>
        </div>

        {/* Results view */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Normalized Skills Detected ({skills.length})
            </h4>
            <span className="text-xs text-slate-500">Synonyms mapped to Maharashtra Skill Taxonomy</span>
          </div>

          {skills.length === 0 ? (
            <p className="text-sm text-slate-500 py-4 text-center">No recognized technical skills found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {skills.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{skill.name}</span>
                      {skill.isEmerging && <EmergingBadge />}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                      <span>{skill.category}</span>
                      {skill.matchedAlias && skill.matchedAlias.toLowerCase() !== skill.name.toLowerCase() && (
                        <span className="text-blue-600 dark:text-blue-400">
                          (via &quot;{skill.matchedAlias}&quot;)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                      {skill.confidence}% conf
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
