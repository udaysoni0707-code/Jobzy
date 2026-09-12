import { redirect } from 'next/navigation';
import { AuthService } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function DashboardRootPage() {
  const currentUser = await AuthService.getCurrentUser();

  if (!currentUser) {
    redirect('/login');
  }

  const role = (currentUser.role || 'STUDENT').toLowerCase();
  redirect(`/dashboard/${role}`);
}
