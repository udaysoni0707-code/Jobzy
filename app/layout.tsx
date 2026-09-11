import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/ui/toast';
import { CommandPalette } from '@/components/ui/command-palette';
import { DemoBar } from '@/components/demo/demo-bar';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
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
      <body className="font-sans min-h-screen w-full overflow-x-hidden flex flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 antialiased">
        <ToastProvider>
          <Navbar currentUser={currentUser} />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
          <CommandPalette />
          <DemoBar />
        </ToastProvider>
      </body>
    </html>
  );
}
