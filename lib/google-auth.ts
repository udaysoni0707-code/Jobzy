import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'skillalign-sih26134-secure-production-secret-key-2026';

export interface GoogleUserProfile {
  googleId: string;
  email: string;
  name: string;
  picture?: string;
  emailVerified: boolean;
}

export interface OAuthStatePayload {
  token: string;
  redirect?: string;
  role?: string;
  district?: string;
  timestamp: number;
}

/**
 * Checks whether Google OAuth credentials are fully configured in the environment.
 */
export function isGoogleOAuthConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_ID.trim() !== '' &&
      process.env.GOOGLE_CLIENT_SECRET &&
      process.env.GOOGLE_CLIENT_SECRET.trim() !== ''
  );
}

/**
 * Resolves the OAuth callback URL with fallback hierarchy:
 * 1. Explicitly passed callbackUrl
 * 2. GOOGLE_CALLBACK_URL from env
 * 3. Derived from NEXT_PUBLIC_APP_URL
 * 4. Fallback default to http://localhost:3000/api/auth/google/callback
 */
export function resolveGoogleCallbackUrl(customBaseUrl?: string): string {
  if (process.env.GOOGLE_CALLBACK_URL && process.env.GOOGLE_CALLBACK_URL.trim() !== '') {
    return process.env.GOOGLE_CALLBACK_URL.trim();
  }

  if (customBaseUrl) {
    const cleanBase = customBaseUrl.replace(/\/+$/, '');
    return `${cleanBase}/api/auth/google/callback`;
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const cleanAppUrl = appUrl.replace(/\/+$/, '');
  return `${cleanAppUrl}/api/auth/google/callback`;
}

/**
 * Creates and returns an instance of Google OAuth2Client.
 */
export function getGoogleOAuthClient(callbackUrl?: string): OAuth2Client {
  const resolvedRedirect = callbackUrl || resolveGoogleCallbackUrl();
  return new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    resolvedRedirect
  );
}

/**
 * Generates an HMAC-signed CSRF state token that prevents cross-site request forgery.
 */
export function generateSignedOAuthState(metadata: {
  redirect?: string;
  role?: string;
  district?: string;
}): string {
  const payload: OAuthStatePayload = {
    token: crypto.randomBytes(24).toString('hex'),
    redirect: metadata.redirect,
    role: metadata.role,
    district: metadata.district,
    timestamp: Date.now(),
  };

  const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(payloadStr)
    .digest('base64url');

  return `${payloadStr}.${signature}`;
}

/**
 * Verifies and decodes an HMAC-signed state token. Returns null if invalid or expired (10m TTL).
 */
export function verifySignedOAuthState(signedState: string): OAuthStatePayload | null {
  try {
    if (!signedState || !signedState.includes('.')) return null;

    const [payloadStr, signature] = signedState.split('.');
    if (!payloadStr || !signature) return null;

    const expectedSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(payloadStr)
      .digest('base64url');

    const sigBuffer = Buffer.from(signature);
    const expBuffer = Buffer.from(expectedSignature);

    if (sigBuffer.length !== expBuffer.length || !crypto.timingSafeEqual(sigBuffer, expBuffer)) {
      return null;
    }

    const jsonStr = Buffer.from(payloadStr, 'base64url').toString('utf-8');
    const payload: OAuthStatePayload = JSON.parse(jsonStr);

    // State expires after 10 minutes (600,000 ms)
    const MAX_AGE_MS = 10 * 60 * 1000;
    if (!payload.timestamp || Date.now() - payload.timestamp > MAX_AGE_MS) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Generates Google's OAuth 2.0 Authorization URL with requested scopes.
 */
export function generateGoogleAuthorizationUrl(options: {
  state: string;
  callbackUrl?: string;
}): string {
  const client = getGoogleOAuthClient(options.callbackUrl);

  return client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'openid',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
    state: options.state,
    prompt: 'select_account',
    include_granted_scopes: true,
  });
}

/**
 * Exchanges authorization code with Google for tokens, verifies the cryptographic signature
 * of the ID token using Google's public certificates, and returns the verified user profile.
 */
export async function verifyGoogleAuthorizationCode(
  code: string,
  callbackUrl?: string
): Promise<GoogleUserProfile> {
  const client = getGoogleOAuthClient(callbackUrl);

  const { tokens } = await client.getToken(code);
  if (!tokens.id_token) {
    throw new Error('Google OAuth response did not contain an id_token');
  }

  client.setCredentials(tokens);

  const ticket = await client.verifyIdToken({
    idToken: tokens.id_token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload) {
    throw new Error('Failed to verify and parse Google ID token payload');
  }

  if (!payload.sub) {
    throw new Error('Google ID token is missing unique subject identifier (sub)');
  }

  if (!payload.email) {
    throw new Error('Google ID token is missing an email address');
  }

  return {
    googleId: payload.sub,
    email: payload.email.toLowerCase().trim(),
    name: payload.name || payload.email.split('@')[0],
    picture: payload.picture,
    emailVerified: Boolean(payload.email_verified),
  };
}
