import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { AuthService } from '@/lib/auth';
import {
  verifySignedOAuthState,
  verifyGoogleAuthorizationCode,
  resolveGoogleCallbackUrl,
} from '@/lib/google-auth';

export const dynamic = 'force-dynamic';

/**
 * GET /api/auth/google/callback
 * Handles OAuth 2.0 callback from Google, validates CSRF state, exchanges code,
 * verifies Google ID token, finds/links/creates user account, and sets session cookie.
 */
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const googleError = searchParams.get('error');

  const origin = req.nextUrl.origin;
  const loginBaseUrl = new URL('/login', origin);

  // 1. Check if user cancelled Google login or Google returned an error
  if (googleError) {
    if (googleError === 'access_denied') {
      loginBaseUrl.searchParams.set('error', 'cancelled');
    } else {
      loginBaseUrl.searchParams.set('error', 'auth_failed');
    }
    const res = NextResponse.redirect(loginBaseUrl);
    res.cookies.set('jobzy_google_oauth_state', '', { path: '/', maxAge: 0 });
    return res;
  }

  // 2. Validate presence of code and state
  if (!code || !state) {
    loginBaseUrl.searchParams.set('error', 'invalid_request');
    return NextResponse.redirect(loginBaseUrl);
  }

  // 3. Verify CSRF State from cookie & HMAC signature
  const stateCookie = req.cookies.get('jobzy_google_oauth_state')?.value;
  if (!stateCookie || stateCookie !== state) {
    loginBaseUrl.searchParams.set('error', 'state_mismatch');
    const res = NextResponse.redirect(loginBaseUrl);
    res.cookies.set('jobzy_google_oauth_state', '', { path: '/', maxAge: 0 });
    return res;
  }

  const statePayload = verifySignedOAuthState(state);
  if (!statePayload) {
    loginBaseUrl.searchParams.set('error', 'state_expired');
    const res = NextResponse.redirect(loginBaseUrl);
    res.cookies.set('jobzy_google_oauth_state', '', { path: '/', maxAge: 0 });
    return res;
  }

  try {
    // 4. Exchange authorization code with Google & verify ID token signature
    const callbackUrl = resolveGoogleCallbackUrl(origin);
    const googleProfile = await verifyGoogleAuthorizationCode(code, callbackUrl);

    // 5. Ensure Google email is verified
    if (!googleProfile.emailVerified) {
      loginBaseUrl.searchParams.set('error', 'unverified_email');
      const res = NextResponse.redirect(loginBaseUrl);
      res.cookies.set('jobzy_google_oauth_state', '', { path: '/', maxAge: 0 });
      return res;
    }

    const cleanEmail = googleProfile.email.toLowerCase().trim();

    // 6. User Lookup & Account Linking
    // Check 1: User exists by Google ID
    let user = await db.user.findFirst({
      where: { googleId: googleProfile.googleId },
      include: { profile: true },
    });

    // Check 2: If not found by googleId, check by verified email
    if (!user) {
      user = await db.user.findUnique({
        where: { email: cleanEmail },
        include: { profile: true },
      });

      if (user) {
        // Safely link Google ID to existing account
        user = await db.user.update({
          where: { id: user.id },
          data: {
            googleId: googleProfile.googleId,
            avatarUrl: user.avatarUrl || googleProfile.picture,
            isVerified: true,
          },
          include: { profile: true },
        });
      } else {
        // Check 3: First-time user -> create new account & profile
        const assignedRole =
          statePayload.role &&
          ['STUDENT', 'INDUSTRY', 'INSTITUTE', 'GOVERNMENT', 'ADMIN'].includes(statePayload.role)
            ? statePayload.role
            : 'STUDENT';

        const district = statePayload.district || 'Pune';

        user = await db.user.create({
          data: {
            email: cleanEmail,
            name: googleProfile.name,
            googleId: googleProfile.googleId,
            role: assignedRole as any,
            avatarUrl: googleProfile.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(googleProfile.name)}`,
            isVerified: true,
            status: 'ACTIVE',
            profile: {
              create: {
                district,
                location: `${district}, Maharashtra`,
                headline: 'Google Verified Candidate • Jobzy Learner',
              },
            },
          },
          include: { profile: true },
        });
      }
    }

    // 7. Create standard 7-day session token
    const sessionToken = AuthService.encodeSession({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as any,
      avatarUrl: user.avatarUrl,
      district: user.profile?.district || 'Pune',
      isVerified: user.isVerified,
    });

    // 8. Determine destination URL
    let destination = `/dashboard/${(user.role || 'STUDENT').toLowerCase()}`;
    if (
      statePayload.redirect &&
      statePayload.redirect.startsWith('/') &&
      !statePayload.redirect.startsWith('/login')
    ) {
      destination = statePayload.redirect;
    }

    const redirectUrl = new URL(destination, origin);
    const response = NextResponse.redirect(redirectUrl);

    // 9. Set secure session cookie
    response.cookies.set('skillnova_session', sessionToken, {
      httpOnly: true,
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    // 10. Clear temporary state cookie
    response.cookies.set('jobzy_google_oauth_state', '', {
      httpOnly: true,
      path: '/',
      maxAge: 0,
    });

    return response;
  } catch (error: any) {
    console.error('Google OAuth callback verification failed:', error.message || error);
    loginBaseUrl.searchParams.set('error', 'auth_failed');
    const response = NextResponse.redirect(loginBaseUrl);
    response.cookies.set('jobzy_google_oauth_state', '', { path: '/', maxAge: 0 });
    return response;
  }
}
