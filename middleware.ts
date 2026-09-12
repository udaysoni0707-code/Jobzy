import { NextRequest, NextResponse } from 'next/server';

const SESSION_COOKIE_NAME = 'skillnova_session';

/**
 * Public routes that do not require authentication
 */
const PUBLIC_PATHS = [
  '/login',
  '/signup',
  '/forgot-password',
  '/api/auth/login',
  '/api/auth/signup',
  '/api/auth/google',
  '/api/auth/google/callback',
  '/api/auth/google/status',
  '/api/auth/logout',
  '/api/auth/me',
  '/api/auth/forgot-password',
];

/**
 * Validates session token from cookie
 */
function getValidSession(req: NextRequest): { id: string; role: string; name: string } | null {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    // Decode base64 session payload (compatible with Next.js Edge runtime)
    const decoded = atob(token);
    const parsed = JSON.parse(decoded);

    if (parsed.exp && parsed.exp < Date.now()) {
      return null;
    }

    if (!parsed.id || !parsed.role) {
      return null;
    }

    return {
      id: parsed.id,
      role: parsed.role,
      name: parsed.name || 'User',
    };
  } catch {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Ignore static assets, next internal files, and icons
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/') && !pathname.startsWith('/api/auth') && req.cookies.get(SESSION_COOKIE_NAME) || // Allow authenticated API calls
    pathname.includes('.') ||
    pathname === '/favicon.ico' ||
    pathname === '/icon.svg'
  ) {
    return NextResponse.next();
  }

  const session = getValidSession(req);
  const isPublicPath = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  // 1. Unauthenticated User Flow
  if (!session) {
    // If accessing an already public auth page, allow through
    if (isPublicPath) {
      return NextResponse.next();
    }

    // Redirect any protected page (including `/`, `/dashboard`, etc.) to `/login`
    const loginUrl = new URL('/login', req.url);
    if (pathname !== '/') {
      loginUrl.searchParams.set('redirect', pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  // 2. Authenticated User Flow
  if (session) {
    const role = (session.role || 'STUDENT').toLowerCase();
    const roleDashboard = `/dashboard/${role}`;

    // If already authenticated and trying to visit login, signup, or forgot-password:
    if (pathname === '/login' || pathname === '/signup' || pathname === '/forgot-password') {
      const redirectTarget = req.nextUrl.searchParams.get('redirect');
      if (redirectTarget && redirectTarget.startsWith('/') && !redirectTarget.startsWith('/login')) {
        return NextResponse.redirect(new URL(redirectTarget, req.url));
      }
      return NextResponse.redirect(new URL(roleDashboard, req.url));
    }

    // If visiting root `/`: send directly to role dashboard
    if (pathname === '/') {
      return NextResponse.redirect(new URL(roleDashboard, req.url));
    }

    // If visiting `/dashboard`: send to role-specific dashboard
    if (pathname === '/dashboard') {
      return NextResponse.redirect(new URL(roleDashboard, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - icon.svg (icon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|icon.svg).*)',
  ],
};
