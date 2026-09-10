import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { NLPEngine } from '@/lib/nlp-engine';
import { AuthService } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const district = searchParams.get('district');
    const sector = searchParams.get('sector');

    const requirements = await db.industryRequirement.findMany({
      where: {
        district: district ? district : undefined,
        sector: sector ? sector : undefined,
      },
      include: {
        org: true,
        jobRole: true,
        skills: {
          include: { skill: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      count: requirements.length,
      requirements,
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch requirements' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, sector, district, positions, experienceYears, description, orgId } = body;

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    // Resolve or find organization
    let organization = orgId ? await db.organization.findUnique({ where: { id: orgId } }) : null;
    if (!organization) {
      organization = await db.organization.findFirst();
      if (!organization) {
        organization = await db.organization.create({
          data: {
            name: 'Maharashtra Automotive Manufacturers Consortium',
            sector: sector || 'Automotive & Clean Mobility',
            district: district || 'Pune',
            verificationStatus: 'VERIFIED',
          },
        });
      }
    }

    // 1. Run NLP Skill Extraction on description
    const extractedSkills = NLPEngine.extractSkills(description);

    // 2. Link or create skills in DB
    const skillLinks = [];
    for (const item of extractedSkills) {
      let dbSkill = await db.skill.findUnique({ where: { name: item.name } });
      if (!dbSkill) {
        dbSkill = await db.skill.create({
          data: {
            name: item.name,
            category: item.category,
            isEmerging: item.isEmerging || false,
            demandIndex: Math.min(95, item.confidence),
          },
        });
      }
      skillLinks.push({
        skillId: dbSkill.id,
        weight: Math.min(100, item.confidence),
      });
    }

    // 3. Find matching JobRole
    const jobRole = await db.jobRole.findFirst({
      where: {
        OR: [
          { title: { contains: 'EV' } },
          { title: { contains: 'Automobile' } },
          { sector: { contains: sector || 'Automotive' } },
        ],
      },
    });

    // 4. Save IndustryRequirement
    const createdReq = await db.industryRequirement.create({
      data: {
        orgId: organization.id,
        jobRoleId: jobRole?.id,
        title,
        sector: sector || 'Automotive & Clean Mobility',
        district: district || 'Pune',
        positions: Number(positions) || 10,
        experienceYears: Number(experienceYears) || 1,
        description,
        status: 'ACTIVE',
        skills: {
          create: skillLinks,
        },
      },
      include: {
        skills: { include: { skill: true } },
        org: true,
      },
    });

    // 5. Create Notification for Government desk
    const govtUser = await db.user.findFirst({ where: { role: 'GOVERNMENT' } });
    if (govtUser) {
      await db.notification.create({
        data: {
          userId: govtUser.id,
          title: `New Industry Demand Posted: ${title}`,
          message: `${organization.name} posted ${positions} openings in ${district} with ${skillLinks.length} extracted technical skills.`,
          type: 'INFO',
          link: '/dashboard/government',
        },
      });
    }

    return NextResponse.json({
      success: true,
      requirement: createdReq,
      extractedCount: extractedSkills.length,
      extractedSkills,
    });
  } catch (error: any) {
    console.error('Industry requirement submission error:', error);
    return NextResponse.json({ error: 'Failed to submit requirement' }, { status: 500 });
  }
}
