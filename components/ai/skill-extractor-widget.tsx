'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge, EmergingBadge } from '@/components/ui/badge';
import { Sparkles, CheckCircle2, Zap, BookOpen, Layers } from 'lucide-react';
import { ExtractedSkill } from '@/types';

export function SkillExtractorWidget() {
  const [inputText, setInputText] = useState(
    'Looking for a cybersecurity analyst with experience in cloud security, threat detection, SIEM architecture, AWS, and incident response protocols for banking infrastructure.'
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [skills, setSkills] = useState<ExtractedSkill[]>([
    {
      name: 'Cybersecurity & Threat Detection',
      category: 'Information Technology',
      matchedAlias: 'threat detection',
      confidence: 96,
      isEmerging: true,
      frequency: 1,
    },
    {
      name: 'Cloud Security Architecture',
      category: 'Information Technology',
      matchedAlias: 'cloud security',
      confidence: 94,
      isEmerging: true,
      frequency: 1,
    },
    {
      name: 'SIEM & SOC Operations',
      category: 'Information Technology',
      matchedAlias: 'SIEM',
      confidence: 92,
      isEmerging: true,
      frequency: 1,
    },
    {
      name: 'Incident Response Protocols',
      category: 'Information Technology',
      matchedAlias: 'incident response',
      confidence: 90,
      isEmerging: false,
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
      if (data.skills && data.skills.length > 0) {
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
      label: 'Cybersecurity Analyst (BFSI Sector)',
      text: 'Looking for a cybersecurity analyst with experience in cloud security, threat detection, SIEM architecture, AWS, and incident response protocols for banking infrastructure.',
    },
    {
      label: 'EV Technician (Pune Auto Cluster)',
      text: 'Seeking an EV Technician experienced in Battery Management Systems (BMS) testing, cell degradation diagnostics, high-voltage EV safety protocols, and DC fast charging infrastructure.',
    },
    {
      label: 'Smart Factory Automation',
      text: 'Hiring Senior Automation Engineer proficient in PLC programming (Siemens S7), SCADA telemetry, industrial robotics (KUKA), and IoT sensor gateways.',
    },
  ];

  return (
    <Card className="border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950 shadow-xl rounded-2xl overflow-hidden">
      <CardHeader className="bg-slate-50/70 dark:bg-slate-900/60 border-b border-slate-200/60 dark:border-slate-800/60 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
                Live NLP Skill Extraction & Taxonomy Normalizer
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-0.5">
                Extracts standardized skills, normalizes industry acronyms, and matches vocational curricula.
              </CardDescription>
            </div>
          </div>
          <Badge variant="blue" className="self-start sm:self-auto shrink-0 font-semibold">
            Govt. Taxonomy Engine
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-5 sm:p-6 space-y-5">
        {/* Preset Chips */}
        <div className="flex flex-wrap gap-2 items-center text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-semibold">Sample Requisitions:</span>
          {samplePresets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => setInputText(p.text)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 hover:text-blue-600 dark:hover:text-blue-400 text-slate-700 dark:text-slate-300 transition-colors border border-slate-200/80 dark:border-slate-700 text-xs font-medium cursor-pointer"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Input Box */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
            Raw Industry Requisition (Input)
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={3}
            className="w-full p-3.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all leading-relaxed"
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
            className="w-full sm:w-auto gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-xl shadow-xs font-semibold px-5"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            Run Skill Extraction
          </Button>
        </div>

        {/* Results Section */}
        <div className="space-y-4 pt-4 border-t border-slate-200/80 dark:border-slate-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              Normalized Skills Detected ({skills.length})
            </h4>
            <span className="text-[11px] text-slate-400 font-medium">
              Mapped against Maharashtra Skill Registry
            </span>
          </div>

          {skills.length === 0 ? (
            <p className="text-sm text-slate-500 py-4 text-center">
              No technical competencies recognized. Try clicking a preset above.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {skills.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 hover:border-blue-300 dark:hover:border-blue-700 transition-colors shadow-2xs"
                >
                  <div className="min-w-0 pr-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                        {skill.name}
                      </span>
                      {skill.isEmerging && <EmergingBadge />}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                      <span>{skill.category}</span>
                      {skill.matchedAlias &&
                        skill.matchedAlias.toLowerCase() !== skill.name.toLowerCase() && (
                          <span className="text-blue-600 dark:text-blue-400 font-medium">
                            (via &quot;{skill.matchedAlias}&quot;)
                          </span>
                        )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                      {skill.confidence}% conf
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Matched Curriculum Card */}
          <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-blue-900 dark:text-blue-200 block">
                  Matched Curriculum Revision Directive
                </span>
                <p className="text-[11px] text-blue-700 dark:text-blue-300">
                  State Syllabus Alignment: <strong>MSBTE AE-EV-302 / CS-SEC-401</strong> • +36-Hour Dedicated Laboratory Module Recommended
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-blue-700 dark:text-blue-300 bg-white/80 dark:bg-blue-900/80 px-2.5 py-1 rounded-lg shrink-0">
              Direct DTE Pipeline
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
