import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/ui/toast';
import { AppShell } from '@/components/layout/app-shell';
import { AuthService } from '@/lib/auth';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'Jobzy — Industry–Skill Intelligence & Curriculum Alignment Platform',
  description:
    'Government of Maharashtra. Continuous feedback loop between industry demand signals, AI skill extraction, curriculum alignment, and student readiness.',
  keywords: [
    'Jobzy',
    'SkillAlign',
    'Maharashtra Skill Development',
    'Curriculum Alignment',
    'Skill Intelligence',
    'EV Technician',
    'MSBTE',
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await AuthService.getCurrentUser();

  return (
    <html lang="en" suppressHydrationWarning className="overflow-x-hidden">
      <body className="font-sans min-h-screen w-full overflow-x-hidden bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 antialiased">
        <ToastProvider>
          <AppShell currentUser={currentUser}>
            {children}
          </AppShell>
        </ToastProvider>
      </body>
    </html>
  );
}
