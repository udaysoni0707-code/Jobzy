import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        {/* Column 1: Brand & Initiative */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-900 dark:bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              JZ
            </div>
            <div>
              <span className="text-base font-extrabold text-slate-900 dark:text-slate-100 block leading-tight">
                JOBZY
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">
                Govt. of Maharashtra Initiative
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
            Continuous skill intelligence platform bridging technical education, vocational curricula, and live industrial hiring demand across 36 districts of Maharashtra.
          </p>
        </div>

        {/* Column 2: Platform */}
        <div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-3">
            Platform
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/dashboard/government" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Government Desk
              </Link>
            </li>
            <li>
              <Link href="/dashboard/industry" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Industry Hub
              </Link>
            </li>
            <li>
              <Link href="/curriculum" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Curriculum Desk
              </Link>
            </li>
            <li>
              <Link href="/district-intelligence" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                District Intelligence
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Stakeholders */}
        <div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-3">
            Stakeholders
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/dashboard/government" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Government & DTE
              </Link>
            </li>
            <li>
              <Link href="/dashboard/industry" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Industry Employers
              </Link>
            </li>
            <li>
              <Link href="/dashboard/institute" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Vocational Institutions
              </Link>
            </li>
            <li>
              <Link href="/dashboard/student" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Learners & Students
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Platform & Support */}
        <div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-3">
            Platform & Support
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                About Jobzy
              </Link>
            </li>
            <li>
              <Link href="/connections" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Contact & Support
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Terms of Governance
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 dark:text-slate-500">
        <p>© 2026 JOBZY — Govt. of Maharashtra Initiative</p>
        <p className="text-[11px]">Empowering State TVET, MSBTE & Industrial Clusters</p>
      </div>
    </footer>
  );
}
