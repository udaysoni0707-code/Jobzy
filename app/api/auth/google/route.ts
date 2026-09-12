import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { AuthService } from '@/lib/auth';
import {
  isGoogleOAuthConfigured,
  generateSignedOAuthState,
  generateGoogleAuthorizationUrl,
  resolveGoogleCallbackUrl,
} from '@/lib/google-auth';

export const dynamic = 'force-dynamic';

/**
 * GET /api/auth/google
 * Initiates the Google OAuth 2.0 authorization redirect.
 */
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const redirectTarget = searchParams.get('redirect') || '';
  const role = searchParams.get('role') || 'STUDENT';
  const district = searchParams.get('district') || 'Pune';

  // If credentials are not configured in .env, redirect back to login with friendly error
  if (!isGoogleOAuthConfigured()) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('error', 'google_not_configured');
    if (redirectTarget) {
      loginUrl.searchParams.set('redirect', redirectTarget);
    }
    return NextResponse.redirect(loginUrl);
  }

  // Generate cryptographic HMAC-signed CSRF state token
  const signedState = generateSignedOAuthState({
    redirect: redirectTarget,
    role,
    district,
  });

  const origin = req.nextUrl.origin;
  const callbackUrl = resolveGoogleCallbackUrl(origin);

  // Generate Google OAuth authorization URL
  const googleAuthUrl = generateGoogleAuthorizationUrl({
    state: signedState,
    callbackUrl,
  });

  const response = NextResponse.redirect(googleAuthUrl);

  // Store state in HttpOnly secure cookie (10 minutes expiry)
  response.cookies.set('jobzy_google_oauth_state', signedState, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 10 * 60, // 10 minutes
  });

  return response;
}

/**
 * POST /api/auth/google
 * Programmatic Google authentication (used for verification scripts, fallback, and demo modal).
 */
export async function POST(req: NextRequest) {
  try {
    const { email, name, avatarUrl, role, district, googleId } = await req.json();

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'A valid Google email address is required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const displayName = name?.trim() || cleanEmail.split('@')[0];

    // Check if user already exists with this email or googleId
    let user = await db.user.findFirst({
      where: {
        OR: [
          { email: cleanEmail },
          ...(googleId ? [{ googleId }] : []),
        ],
      },
      include: { profile: true },
    });

    // If user exists, link Google ID if not already linked
    if (user) {
      if (googleId && !user.googleId) {
        user = await db.user.update({
          where: { id: user.id },
          data: {
            googleId,
            avatarUrl: user.avatarUrl || avatarUrl,
            isVerified: true,
          },
          include: { profile: true },
        });
      }
    } else {
      // If user does not exist, create a verified Google profile
      const assignedRole =
        role && ['STUDENT', 'INDUSTRY', 'INSTITUTE', 'GOVERNMENT', 'ADMIN'].includes(role)
          ? role
          : 'STUDENT';

      user = await db.user.create({
        data: {
          name: displayName,
          email: cleanEmail,
          googleId: googleId || null,
          role: assignedRole as any,
          avatarUrl:
            avatarUrl ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`,
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
      secure: process.env.NODE_ENV === 'production',
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
