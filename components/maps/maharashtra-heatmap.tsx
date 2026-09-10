'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge, SeverityBadge, SyntheticDataNotice } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, TrendingUp, AlertTriangle, Users, BookOpen, ChevronRight, Filter } from 'lucide-react';
import { DistrictInsight } from '@/types';

interface DistrictMetric {
  name: string;
  region: string;
  demandScore: number;
  shortageSeverity: 'CRITICAL' | 'MISSING' | 'PARTIAL' | 'COVERED';
  keySector: string;
  highDemandSkill: string;
  shortageSkill: string;
  openPositions: number;
  institutesCount: number;
  curriculumGaps: string[];
  recommendations: string[];
}

const DISTRICT_DATA: DistrictMetric[] = [
  {
    name: 'Pune',
    region: 'Western Maharashtra',
    demandScore: 94,
    shortageSeverity: 'CRITICAL',
    keySector: 'Automotive & Clean Mobility (EV)',
    highDemandSkill: 'Battery Management Systems (BMS)',
    shortageSkill: 'BMS Testing & Cell Balancing',
    openPositions: 1850,
    institutesCount: 42,
    curriculumGaps: ['BMS Diagnostics missing from standard diploma', 'Lack of EV high-voltage test-benches'],
    recommendations: ['Establish COE for EV battery diagnostics at GP Pune', 'Roll out 36-hour BMS curriculum update'],
  },
  {
    name: 'Mumbai Suburban',
    region: 'Konkan',
    demandScore: 89,
    shortageSeverity: 'MISSING',
    keySector: 'Information Technology & Data',
    highDemandSkill: 'Cloud Computing & DevOps',
    shortageSkill: 'Machine Learning Engineering',
    openPositions: 3200,
    institutesCount: 58,
    curriculumGaps: ['Outdated server-management syllabus', 'Limited hands-on containerization labs'],
    recommendations: ['Integrate Docker & Kubernetes into University CS syllabus', 'Faculty industry sabbatical program'],
  },
  {
    name: 'Chhatrapati Sambhaji Nagar',
    region: 'Marathwada',
    demandScore: 84,
    shortageSeverity: 'CRITICAL',
    keySector: 'Auto Components & Heavy Engineering',
    highDemandSkill: 'Industrial Robotics',
    shortageSkill: 'Digital Twin Simulation',
    openPositions: 1250,
    institutesCount: 28,
    curriculumGaps: ['Theory-heavy robotics with minimal robot arm hours', 'Virtual commissioning absent'],
    recommendations: ['Procure 6-axis articulated robot arm for ITI cluster', 'Introduce Siemens Tecnomatix electives'],
  },
  {
    name: 'Nashik',
    region: 'North Maharashtra',
    demandScore: 82,
    shortageSeverity: 'PARTIAL',
    keySector: 'Precision Engineering & Electricals',
    highDemandSkill: 'PLC Programming',
    shortageSkill: 'SCADA & Industrial IoT',
    openPositions: 1100,
    institutesCount: 31,
    curriculumGaps: ['Legacy relay logic over-emphasized vs modern PLCs', 'Lack of IoT edge protocols'],
    recommendations: ['Modernize 8 ITI electrical labs with Allen-Bradley & Siemens PLCs', 'Industry-led trainer upskilling'],
  },
  {
    name: 'Nagpur',
    region: 'Vidarbha',
    demandScore: 78,
    shortageSeverity: 'MISSING',
    keySector: 'Logistics, Aerospace & Clean Energy',
    highDemandSkill: 'Solar PV System Design',
    shortageSkill: 'Green Hydrogen Electrolysis',
    openPositions: 950,
    institutesCount: 35,
    curriculumGaps: ['No green hydrogen or electrolyzer modules', 'Solar PV course lacks utility-scale design'],
    recommendations: ['Partner with MIHAN aerospace and solar parks for apprenticeships', 'Add hydrogen safety fundamentals'],
  },
  {
    name: 'Kolhapur',
    region: 'Western Maharashtra',
    demandScore: 76,
    shortageSeverity: 'PARTIAL',
    keySector: 'Foundry, Metallurgy & Agri-Tech',
    highDemandSkill: 'IoT Sensors & Edge Gateway',
    shortageSkill: 'Embedded C & Microcontrollers',
    openPositions: 680,
    institutesCount: 24,
    curriculumGaps: ['Microprocessor 8085 still taught instead of ARM Cortex', 'No agri-IoT sensor calibration'],
    recommendations: ['Upgrade embedded curriculum to STM32/ESP32 platforms', 'Agri-automation applied project grants'],
  },
  {
    name: 'Thane',
    region: 'Konkan',
    demandScore: 86,
    shortageSeverity: 'MISSING',
    keySector: 'Specialty Chemicals & EV Infrastructure',
    highDemandSkill: 'EV Safety Protocols',
    shortageSkill: 'AIS-156 Battery Safety Compliance',
    openPositions: 1400,
    institutesCount: 33,
    curriculumGaps: ['General safety taught; high-voltage battery safety missing', 'Thermal runaway hazard training lacking'],
    recommendations: ['Mandate AIS-156 module for all automobile and electrical diploma students'],
  },
  {
    name: 'Solapur',
    region: 'Western Maharashtra',
    demandScore: 71,
    shortageSeverity: 'PARTIAL',
    keySector: 'Textiles & Renewable Energy',
    highDemandSkill: 'Solar PV System Design',
    shortageSkill: 'Power Electronics Inverter Maintenance',
    openPositions: 520,
    institutesCount: 20,
    curriculumGaps: ['Solar panel maintenance covered; inverter power electronics absent'],
    recommendations: ['Short-term certification with National Institute of Solar Energy (NISE)'],
  },
];

export function MaharashtraHeatmap() {
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictMetric>(DISTRICT_DATA[0]);
  const [selectedSectorFilter, setSelectedSectorFilter] = useState<string>('ALL');

  const sectors = ['ALL', 'Automotive & EV', 'Industry 4.0', 'Information Technology', 'Clean Energy'];

  const filteredDistricts = DISTRICT_DATA.filter((d) => {
    if (selectedSectorFilter === 'ALL') return true;
    if (selectedSectorFilter === 'Automotive & EV') return d.keySector.includes('Automotive') || d.keySector.includes('EV');
    if (selectedSectorFilter === 'Industry 4.0') return d.keySector.includes('Automation') || d.keySector.includes('Engineering');
    if (selectedSectorFilter === 'Information Technology') return d.keySector.includes('Technology') || d.keySector.includes('Data');
    if (selectedSectorFilter === 'Clean Energy') return d.keySector.includes('Energy') || d.keySector.includes('Solar');
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Sector Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <Filter className="w-4 h-4 text-blue-600" />
          <span>Filter by Sector:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {sectors.map((sec) => (
            <button
              key={sec}
              onClick={() => setSelectedSectorFilter(sec)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedSectorFilter === sec
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {sec}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* District Grid / Heatmap Cards */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              Statewide District Intelligence ({filteredDistricts.length} Districts Displayed)
            </h4>
            <span className="text-xs text-slate-500">Click a district for granular gap analysis</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredDistricts.map((d) => {
              const isSelected = selectedDistrict.name === d.name;
              return (
                <div
                  key={d.name}
                  onClick={() => setSelectedDistrict(d)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 shadow-sm ring-1 ring-blue-600'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h5 className="text-base font-bold text-slate-900 dark:text-slate-100">{d.name}</h5>
                      <span className="text-xs text-slate-500 dark:text-slate-400">{d.region}</span>
                    </div>
                    <SeverityBadge severity={d.shortageSeverity} />
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Demand Score:</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">{d.demandScore}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Top Skill Shortage:</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[140px]">
                        {d.shortageSkill}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Open Job Demand:</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{d.openPositions}+</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <SyntheticDataNotice />
        </div>

        {/* Granular District Drill-down Panel */}
        <div className="lg:col-span-5">
          <Card className="border-slate-200 dark:border-slate-800 sticky top-20">
            <CardHeader className="bg-slate-50/60 dark:bg-slate-950/40">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    District Diagnostic Dossier
                  </span>
                  <CardTitle className="text-xl mt-0.5">{selectedDistrict.name}</CardTitle>
                </div>
                <SeverityBadge severity={selectedDistrict.shortageSeverity} />
              </div>
              <CardDescription>{selectedDistrict.keySector}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pt-4">
              {/* Quick stats */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] text-slate-500 block">State Shortage Index</span>
                  <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {selectedDistrict.demandScore}%
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] text-slate-500 block">Vocational Institutes</span>
                  <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {selectedDistrict.institutesCount} Units
                  </span>
                </div>
              </div>

              {/* Identified Curriculum Gaps */}
              <div>
                <h5 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  Detected Curriculum Mismatches
                </h5>
                <div className="space-y-1.5">
                  {selectedDistrict.curriculumGaps.map((gap, i) => (
                    <div
                      key={i}
                      className="p-2 rounded-md bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2"
                    >
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{gap}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Policy Interventions */}
              <div>
                <h5 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                  Proposed Government / MSBTE Action
                </h5>
                <div className="space-y-1.5">
                  {selectedDistrict.recommendations.map((rec, i) => (
                    <div
                      key={i}
                      className="p-2 rounded-md bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-2"
                    >
                      <span className="text-blue-600 font-bold">•</span>
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full justify-between"
                  onClick={() => alert(`Exporting District Dossier for ${selectedDistrict.name} (PDF/CSV ready)`)}
                >
                  <span>Generate District Skill Plan Report</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
