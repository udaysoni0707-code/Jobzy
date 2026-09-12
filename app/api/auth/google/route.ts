import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { AuthService } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { email, name, avatarUrl, role, district } = await req.json();

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'A valid Google email address is required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const displayName = name?.trim() || cleanEmail.split('@')[0];

    // Check if user already exists with this email
    let user = await db.user.findUnique({
      where: { email: cleanEmail },
      include: { profile: true },
    });

    // If user does not exist, auto-create a verified Google profile
    if (!user) {
      const generatedPassword = `GoogleAuth_${Date.now()}_${Math.random().toString(36).slice(-8)}`;
      const passwordHash = await AuthService.hashPassword(generatedPassword);

      const assignedRole = role && ['STUDENT', 'INDUSTRY', 'INSTITUTE', 'GOVERNMENT', 'ADMIN'].includes(role)
        ? role
        : 'STUDENT';

      user = await db.user.create({
        data: {
          name: displayName,
          email: cleanEmail,
          passwordHash,
          role: assignedRole as any,
          avatarUrl: avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`,
          isVerified: true,
          status: 'ACTIVE',
          profile: {
            create: {
              district: district || 'Pune',
              location: `${district || 'Pune'}, Maharashtra`,
              headline: 'Google Verified Candidate • Jobzy Learner',
            },
          },
        },
        include: { profile: true },
      });
    }

    // Generate 7-day session token
    const sessionToken = AuthService.encodeSession({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as any,
      avatarUrl: user.avatarUrl,
      district: user.profile?.district || 'Pune',
      isVerified: user.isVerified,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Google authentication successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
    });

    response.cookies.set('skillnova_session', sessionToken, {
      httpOnly: true,
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
      sameSite: 'lax',
    });

    return response;
  } catch (error: any) {
    console.error('Google authentication API error:', error);
    return NextResponse.json(
      { error: 'Google sign-in could not be completed. Please try again.' },
      { status: 500 }
    );
  }
}
