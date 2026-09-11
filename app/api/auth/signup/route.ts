import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { AuthService } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const {
      name,
      email,
      password,
      role,
      district,
      organizationName,
      instituteType,
      cinOrGstin,
      education,
      skills,
    } = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: 'Name, email, password, and role are required' }, { status: 400 });
    }

    const validRoles = ['STUDENT', 'INDUSTRY', 'INSTITUTE', 'GOVERNMENT', 'ADMIN'];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: 'Invalid role specified' }, { status: 400 });
    }

    // Check existing email
    const existing = await db.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      return NextResponse.json({ error: 'Account with this email already exists' }, { status: 409 });
    }

    // Government and Admin roles require verification
    const isPrivileged = role === 'GOVERNMENT' || role === 'ADMIN';
    const isVerified = !isPrivileged; // Students, industry pending or verified

    const passwordHash = await AuthService.hashPassword(password);

    const user = await db.user.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        passwordHash,
        role,
        isVerified,
        status: isPrivileged ? 'PENDING_VERIFICATION' : 'ACTIVE',
        profile: {
          create: {
            district: district || 'Pune',
            location: `${district || 'Pune'}, Maharashtra`,
            headline: role === 'STUDENT' ? (education ? `${education} Candidate` : 'SkillAlign Learner') : undefined,
            education: role === 'STUDENT' && education ? education : undefined,
          },
        },
        organization:
          role === 'INDUSTRY'
            ? {
                create: {
                  name: organizationName || `${name}'s Organization`,
                  district: district || 'Pune',
                  cinOrGstin: cinOrGstin ? cinOrGstin.trim() : undefined,
                  verificationStatus: 'PENDING',
                },
              }
            : undefined,
        institute:
          role === 'INSTITUTE'
            ? {
                create: {
                  name: organizationName || `${name} Technical Institute`,
                  type: instituteType || 'POLYTECHNIC',
                  district: district || 'Pune',
                  code: `INST-${Math.floor(1000 + Math.random() * 9000)}`,
                  verificationStatus: 'PENDING',
                },
              }
            : undefined,
      },
    });

    // Save student skills if provided
    if (role === 'STUDENT' && Array.isArray(skills) && skills.length > 0) {
      for (const skillItem of skills) {
        const trimmed = typeof skillItem === 'string' ? skillItem.trim() : '';
        if (!trimmed) continue;

        try {
          let skillRecord = await db.skill.findFirst({
            where: { name: { equals: trimmed } },
          });

          if (!skillRecord) {
            skillRecord = await db.skill.create({
              data: {
                name: trimmed,
                category: 'Technical & Core Skills',
                demandIndex: 65,
              },
            });
          }

          await db.studentSkill.create({
            data: {
              userId: user.id,
              skillId: skillRecord.id,
              proficiency: 'INTERMEDIATE',
            },
          });
        } catch (skillErr) {
          // Ignore unique constraint or conflict errors silently
          console.warn('Failed to associate skill during signup:', trimmed, skillErr);
        }
      }
    }

    const sessionToken = AuthService.encodeSession({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as any,
      district: district || 'Pune',
      isVerified: user.isVerified,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
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
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Internal server error creating account' }, { status: 500 });
  }
}
