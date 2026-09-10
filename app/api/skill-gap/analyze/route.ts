import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { NLPEngine } from '@/lib/nlp-engine';

export async function POST(req: NextRequest) {
  try {
    const { jobRoleId, courseId, district = 'Pune' } = await req.json();

    if (!jobRoleId) {
      return NextResponse.json({ error: 'jobRoleId is required' }, { status: 400 });
    }

    const jobRole = await db.jobRole.findUnique({
      where: { id: jobRoleId },
      include: {
        skills: {
          include: { skill: true },
        },
      },
    });

    if (!jobRole) {
      return NextResponse.json({ error: 'Job role not found' }, { status: 404 });
    }

    // Get Course modules if courseId provided, or first affiliated course
    const course = courseId
      ? await db.course.findUnique({
          where: { id: courseId },
          include: {
            modules: {
              include: {
                skills: {
                  include: { skill: true },
                },
              },
            },
          },
        })
      : await db.course.findFirst({
          include: {
            modules: {
              include: {
                skills: {
                  include: { skill: true },
                },
              },
            },
          },
        });

    // Build coverage map from course modules
    const coverageMap = new Map<string, number>();
    if (course) {
      for (const mod of course.modules) {
        for (const ms of mod.skills) {
          const weight = ms.coverageLevel === 'ADVANCED' ? 85 : ms.coverageLevel === 'INTERMEDIATE' ? 60 : 35;
          const current = coverageMap.get(ms.skillId) || 0;
          coverageMap.set(ms.skillId, Math.max(current, weight));
        }
      }
    }

    const gapResults = [];

    for (const reqSkill of jobRole.skills) {
      const demandScore = reqSkill.minWeight || reqSkill.skill.demandIndex || 80;
      const coverageScore = coverageMap.get(reqSkill.skillId) || 10;

      const { gapScore, severity } = NLPEngine.computeGapSeverity(demandScore, coverageScore);

      // Upsert into SkillGapAnalysis table
      const saved = await db.skillGapAnalysis.upsert({
        where: {
          jobRoleId_district_skillId: {
            jobRoleId: jobRole.id,
            district,
            skillId: reqSkill.skillId,
          },
        },
        update: {
          demandScore,
          coverageScore,
          gapScore,
          gapSeverity: severity,
          updatedAt: new Date(),
        },
        create: {
          jobRoleId: jobRole.id,
          district,
          skillId: reqSkill.skillId,
          demandScore,
          coverageScore,
          gapScore,
          gapSeverity: severity,
        },
      });

      gapResults.push({
        id: saved.id,
        skillId: reqSkill.skill.id,
        skillName: reqSkill.skill.name,
        category: reqSkill.skill.category,
        isEmerging: reqSkill.skill.isEmerging,
        demandScore,
        coverageScore,
        gapScore,
        gapSeverity: severity,
      });
    }

    // Sort by gapScore descending (critical gaps first)
    gapResults.sort((a, b) => b.gapScore - a.gapScore);

    return NextResponse.json({
      success: true,
      jobRole: {
        id: jobRole.id,
        title: jobRole.title,
        sector: jobRole.sector,
      },
      course: course
        ? {
            id: course.id,
            title: course.title,
            code: course.code,
          }
        : null,
      district,
      gaps: gapResults,
    });
  } catch (error: any) {
    console.error('Skill gap calculation error:', error);
    return NextResponse.json({ error: 'Failed to compute skill gap' }, { status: 500 });
  }
}
