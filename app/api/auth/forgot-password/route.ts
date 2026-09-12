import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await db.user.findUnique({
      where: { email: cleanEmail },
    });

    // We do not leak whether user exists for security, but acknowledge receipt
    return NextResponse.json({
      success: true,
      message: user
        ? `Password recovery instructions have been sent to ${cleanEmail}.`
        : 'If an account exists with this email address, verification instructions have been dispatched.',
    });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'We couldn’t process this request right now. Please try again later.' },
      { status: 500 }
    );
  }
}
