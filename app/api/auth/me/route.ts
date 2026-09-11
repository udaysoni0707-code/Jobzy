import { NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await AuthService.getCurrentUser();
    if (!session) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    const user = await db.user.findUnique({
      where: { id: session.id },
      include: {
        profile: {
          include: { targetRole: true },
        },
        organization: true,
        institute: true,
      },
    });

    if (!user) {
      return NextResponse.json({
        authenticated: true,
        user: {
          id: session.id,
          name: session.name,
          email: session.email,
          role: session.role,
          district: session.district,
          isVerified: session.isVerified,
        },
      });
    }

    const { passwordHash, ...safeUser } = user;

    return NextResponse.json({
      authenticated: true,
      user: safeUser,
    });
  } catch (error: any) {
    console.error('Error fetching current user:', error);
    return NextResponse.json({ authenticated: false, user: null }, { status: 500 });
  }
}
