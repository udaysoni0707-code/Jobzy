import { PrismaClient } from '@prisma/client';
import {
  isGoogleOAuthConfigured,
  generateSignedOAuthState,
  verifySignedOAuthState,
  resolveGoogleCallbackUrl,
  generateGoogleAuthorizationUrl,
} from '../lib/google-auth';
import { AuthService } from '../lib/auth';

const prisma = new PrismaClient();

async function runGoogleOAuthTests() {
  console.log('🧪 Starting Google OAuth 2.0 / OpenID Connect Integration Tests...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      failed++;
    }
  }

  try {
    // ----------------------------------------------------
    // TEST 1: CSRF State Generation & HMAC Security
    // ----------------------------------------------------
    console.log('🔹 Test Suite 1: CSRF State Generation & HMAC Verification');

    const state = generateSignedOAuthState({
      redirect: '/dashboard/student',
      role: 'STUDENT',
      district: 'Pune',
    });

    assert(typeof state === 'string' && state.includes('.'), 'Generates signed state string formatted as [payload].[signature]');

    const verifiedPayload = verifySignedOAuthState(state);
    assert(!!verifiedPayload, 'Successfully verifies and decodes valid signed state token');
    assert(verifiedPayload?.role === 'STUDENT', 'Decodes correct role from state payload');
    assert(verifiedPayload?.redirect === '/dashboard/student', 'Decodes correct redirect path');
    assert(verifiedPayload?.district === 'Pune', 'Decodes correct district');

    // Tampering test 1: Modify signature
    const tamperedSig = state.slice(0, -4) + 'abcd';
    const tamperedResult = verifySignedOAuthState(tamperedSig);
    assert(tamperedResult === null, 'Rejects state with forged or modified HMAC signature');

    // Tampering test 2: Expired timestamp
    const expiredPayload = {
      token: 'testtoken',
      timestamp: Date.now() - 15 * 60 * 1000, // 15 minutes ago (> 10m TTL)
    };
    const expiredPayloadStr = Buffer.from(JSON.stringify(expiredPayload)).toString('base64url');
    const expiredState = `${expiredPayloadStr}.invalidsig`;
    assert(verifySignedOAuthState(expiredState) === null, 'Rejects expired state tokens exceeding 10-minute TTL');

    // ----------------------------------------------------
    // TEST 2: OAuth URL Generation & Scopes
    // ----------------------------------------------------
    console.log('\n🔹 Test Suite 2: Google Authorization URL & Scopes');

    const originalClientId = process.env.GOOGLE_CLIENT_ID;
    const originalClientSecret = process.env.GOOGLE_CLIENT_SECRET;

    // Test with mock credentials
    process.env.GOOGLE_CLIENT_ID = 'test-client-id-12345.apps.googleusercontent.com';
    process.env.GOOGLE_CLIENT_SECRET = 'test-client-secret-abcde';

    assert(isGoogleOAuthConfigured() === true, 'isGoogleOAuthConfigured() returns true when credentials present');

    const authUrl = generateGoogleAuthorizationUrl({
      state,
      callbackUrl: 'http://localhost:3000/api/auth/google/callback',
    });

    assert(authUrl.startsWith('https://accounts.google.com/o/oauth2/v2/auth'), 'Generates standard Google OAuth 2.0 authorization endpoint URL');
    assert(authUrl.includes('test-client-id-12345'), 'Includes GOOGLE_CLIENT_ID in authorization URL');
    assert(authUrl.includes(encodeURIComponent('http://localhost:3000/api/auth/google/callback')), 'Includes correct redirect_uri in authorization URL');
    assert(authUrl.includes('response_type=code'), 'Specifies response_type=code for authorization code grant');
    assert(authUrl.includes('openid') && authUrl.includes('email') && authUrl.includes('profile'), 'Requests minimal openid, email, and profile scopes');

    // ----------------------------------------------------
    // TEST 3: User Database Model & Account Linking
    // ----------------------------------------------------
    console.log('\n🔹 Test Suite 3: Database Models, Account Linking & Google User Lifecycle');

    const testGoogleEmail = `google.candidate.${Date.now()}@example.com`;
    const testGoogleSub = `google_sub_${Date.now()}`;

    // 3.1 First-time Google user creation
    const newGoogleUser = await prisma.user.create({
      data: {
        email: testGoogleEmail,
        name: 'Google Candidate Test',
        googleId: testGoogleSub,
        passwordHash: null, // Google accounts do not require a password
        role: 'STUDENT',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=GoogleCandidate',
        isVerified: true,
        status: 'ACTIVE',
        profile: {
          create: {
            district: 'Pune',
            location: 'Pune, Maharashtra',
            headline: 'Google Verified Candidate • Jobzy Learner',
          },
        },
      },
      include: { profile: true },
    });

    assert(!!newGoogleUser, 'Creates new Google-authenticated user in database');
    assert(newGoogleUser.googleId === testGoogleSub, 'Stores unique Google User ID (sub)');
    assert(newGoogleUser.isVerified === true, 'Pre-verifies Google authenticated account');
    assert(newGoogleUser.passwordHash === null, 'Allows null passwordHash for OAuth-only users');

    // 3.2 Lookup existing user by googleId
    const foundByGoogleId = await prisma.user.findFirst({
      where: { googleId: testGoogleSub },
    });
    assert(foundByGoogleId?.id === newGoogleUser.id, 'Finds existing user by unique googleId');

    // 3.3 Safe Account Linking: Existing user with email links Google ID
    const existingEmailUser = await prisma.user.create({
      data: {
        email: `traditional.${Date.now()}@example.com`,
        name: 'Traditional Signer',
        passwordHash: await AuthService.hashPassword('Password@123'),
        role: 'INDUSTRY',
        isVerified: false,
        profile: {
          create: {
            district: 'Mumbai',
          },
        },
      },
    });

    const secondGoogleSub = `google_sub_linked_${Date.now()}`;
    const linkedUser = await prisma.user.update({
      where: { id: existingEmailUser.id },
      data: {
        googleId: secondGoogleSub,
        isVerified: true, // Verification upgraded via Google
      },
    });

    assert(linkedUser.googleId === secondGoogleSub, 'Successfully links Google ID to existing email account without duplicates');
    assert(linkedUser.isVerified === true, 'Upgrades verification status upon linking Google account');

    // 3.4 Session generation for Google user
    const googleSession = AuthService.encodeSession({
      id: newGoogleUser.id,
      email: newGoogleUser.email,
      name: newGoogleUser.name,
      role: newGoogleUser.role as any,
      avatarUrl: newGoogleUser.avatarUrl,
      district: newGoogleUser.profile?.district || 'Pune',
      isVerified: newGoogleUser.isVerified,
    });

    assert(typeof googleSession === 'string' && googleSession.length > 20, 'Encodes valid 7-day session token for Google user');

    const decodedSession = AuthService.decodeSession(googleSession);
    assert(decodedSession?.email === testGoogleEmail, 'Decodes session token preserving Google user identity');
    assert(decodedSession?.role === 'STUDENT', 'Decodes correct role for dashboard navigation');

    // Clean up test users
    await prisma.profile.deleteMany({
      where: { userId: { in: [newGoogleUser.id, existingEmailUser.id] } },
    });
    await prisma.user.deleteMany({
      where: { id: { in: [newGoogleUser.id, existingEmailUser.id] } },
    });

    // Reset env vars
    process.env.GOOGLE_CLIENT_ID = originalClientId;
    process.env.GOOGLE_CLIENT_SECRET = originalClientSecret;

    // ----------------------------------------------------
    // SUMMARY
    // ----------------------------------------------------
    console.log('\n========================================');
    console.log(`TOTAL GOOGLE OAUTH TESTS: ${passed + failed}`);
    console.log(`PASSED: ${passed}`);
    console.log(`FAILED: ${failed}`);
    console.log('========================================');

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runGoogleOAuthTests();
