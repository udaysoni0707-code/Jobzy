import React from 'react';
import { MaharashtraHeatmap } from '@/components/maps/maharashtra-heatmap';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge, SyntheticDataNotice } from '@/components/ui/badge';
import { MapPin, Landmark, BarChart3, TrendingUp } from 'lucide-react';

export default function DistrictIntelligencePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            Maharashtra State Skill Geo-Telemetry
          </span>
          <Badge variant="blue">36 Districts Active</Badge>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          District Skill Heatmap & Industrial Shortage Index
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
          Visualizes geographic distribution of emerging technologies (EV, Automation, Renewables, IT), institutional capacity, and critical local deficits across Maharashtra.
        </p>
      </div>

      <MaharashtraHeatmap />
    </div>
  );
}
