import React from 'react';
import { cn, getSeverityBadgeColor } from '@/lib/utils';
import { Info, Sparkles, AlertTriangle } from 'lucide-react';

export function Badge({
  className,
  variant = 'default',
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  variant?: 'default' | 'outline' | 'emerald' | 'blue' | 'amber' | 'rose';
}) {
  const variants = {
    default: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700',
    outline: 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 bg-transparent',
    emerald: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    blue: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    amber: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    rose: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function SeverityBadge({ severity }: { severity: string }) {
  const colors = getSeverityBadgeColor(severity);
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold border',
        colors.bg,
        colors.text,
        colors.border
      )}
    >
      {severity.toUpperCase() === 'CRITICAL' && <AlertTriangle className="w-3 h-3 text-rose-600 dark:text-rose-400" />}
      {severity}
    </span>
  );
}

export function EmergingBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
      <Sparkles className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
      Emerging
    </span>
  );
}

export function SyntheticDataNotice({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 p-2.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400',
        className
      )}
    >
      <Info className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
      <span>
        <strong>Prototype Visualization:</strong> Synthetic demo metrics demonstrating proposed architecture for Maharashtra skill intelligence.
      </span>
    </div>
  );
}
