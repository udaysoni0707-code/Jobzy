import { NextResponse } from 'next/server';
import { isGoogleOAuthConfigured } from '@/lib/google-auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    configured: isGoogleOAuthConfigured(),
  });
}
