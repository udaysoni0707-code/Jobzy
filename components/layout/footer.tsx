import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
              SA
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-slate-100">SKILLALIGN</span>
          </div>
          <p className="text-xs text-slate-500 max-w-md leading-relaxed">
            From Industry Demand to Future-Ready Skills. Developed for Smart India Hackathon 2026 (Problem Statement SIH26134) under the auspices of the Government of Maharashtra.
          </p>
          <div className="text-[11px] text-slate-400">
            Continuous feedback loop between industrial demand signals, AI skill extraction, curriculum alignment, and student readiness.
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-3">
            Stakeholder Desks
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/dashboard/government" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Government of Maharashtra Portal
              </Link>
            </li>
            <li>
              <Link href="/dashboard/industry" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Industry & Employers Desk
              </Link>
            </li>
            <li>
              <Link href="/dashboard/institute" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Vocational Institutes & MSBTE
              </Link>
            </li>
            <li>
              <Link href="/dashboard/student" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Student & Learner Roadmap
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-3">
            Platform & Governance
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/district-intelligence" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                36-District Skill Heatmap
              </Link>
            </li>
            <li>
              <Link href="/curriculum" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Curriculum Recommendation Engine
              </Link>
            </li>
            <li>
              <Link href="/connections" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                State Skill Network
              </Link>
            </li>
            <li>
              <Link href="/dashboard/admin" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                System Audit & Verification
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
        <div>
          © 2026 SkillAlign • Built for SIH 2026 • Government of Maharashtra
        </div>
        <div className="italic">
          * Prototype visualization — synthetic demo data. Demonstrates proposed system architecture.
        </div>
      </div>
    </footer>
  );
}
