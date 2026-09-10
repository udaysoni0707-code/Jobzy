import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { NLPEngine } from '@/lib/nlp-engine';
import { AuthService } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const courseId = searchParams.get('courseId');

    const recommendations = await db.curriculumRecommendation.findMany({
      where: {
        status: status ? status : undefined,
        courseId: courseId ? courseId : undefined,
      },
      include: {
        course: {
          include: { institute: true },
        },
        skill: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      count: recommendations.length,
      recommendations,
    });
  } catch (error: any) {
    console.error('Fetch recommendations error:', error);
    return NextResponse.json({ error: 'Failed to fetch recommendations' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, recommendationId, courseId, skillId, reviewerName } = body;

    // Handle review / approval action
    if (action === 'APPROVE' || action === 'REJECT') {
      if (!recommendationId) {
        return NextResponse.json({ error: 'recommendationId is required for review' }, { status: 400 });
      }

      const rec = await db.curriculumRecommendation.findUnique({
        where: { id: recommendationId },
        include: { course: true, skill: true },
      });

      if (!rec) {
        return NextResponse.json({ error: 'Recommendation not found' }, { status: 404 });
      }

      const updated = await db.curriculumRecommendation.update({
        where: { id: recommendationId },
        data: {
          status: action === 'APPROVE' ? 'APPROVED' : 'REJECTED',
          reviewedBy: reviewerName || 'Authorized MSBTE / DTE Committee Member',
          reviewedAt: new Date(),
        },
      });

      // If approved, dynamically inject new curriculum module into course to close the feedback loop!
      if (action === 'APPROVE') {
        const existingModulesCount = await db.curriculumModule.count({
          where: { courseId: rec.courseId },
        });

        const newMod = await db.curriculumModule.create({
          data: {
            courseId: rec.courseId,
            title: `Module ${existingModulesCount + 1}: ${rec.skill.name} Applied Lab & Diagnostics`,
            description: `State-approved updated module to address regional shortage in ${rec.skill.name}.`,
            hours: 36,
            orderNumber: existingModulesCount + 1,
            skills: {
              create: {
                skillId: rec.skillId,
                coverageLevel: 'ADVANCED',
              },
            },
          },
        });

        // Boost course alignment score
        await db.course.update({
          where: { id: rec.courseId },
          data: {
            alignmentScore: Math.min(95, rec.course.alignmentScore + 18),
          },
        });

        // Log audit event
        await db.auditLog.create({
          data: {
            action: 'CURRICULUM_RECOMMENDATION_APPROVED',
            resource: `Course: ${rec.course.code}`,
            metadataJson: JSON.stringify({
              recommendationId,
              skill: rec.skill.name,
              newModuleId: newMod.id,
            }),
          },
        });
      }

      return NextResponse.json({
        success: true,
        message: `Recommendation successfully ${action.toLowerCase()}d`,
        recommendation: updated,
      });
    }

    // Generate new explainable recommendation from scratch
    if (courseId && skillId) {
      const course = await db.course.findUnique({ where: { id: courseId } });
      const skill = await db.skill.findUnique({ where: { id: skillId } });

      if (!course || !skill) {
        return NextResponse.json({ error: 'Course or skill not found' }, { status: 404 });
      }

      const explanation = NLPEngine.generateExplainableRecommendation({
        skillName: skill.name,
        category: skill.category,
        demandScore: skill.demandIndex || 90,
        coverageScore: 12,
        gapScore: 78,
        courseTitle: course.title,
      });

      const newRec = await db.curriculumRecommendation.create({
        data: {
          courseId,
          skillId,
          actionType: 'ADD_MODULE',
          title: `Add Module: ${explanation.suggestedModuleTitle}`,
          whyReason: explanation.whyReason,
          evidenceJson: JSON.stringify(explanation.evidence),
          confidenceScore: explanation.confidenceScore,
          priority: 'HIGH',
          status: 'PENDING',
        },
      });

      return NextResponse.json({
        success: true,
        recommendation: newRec,
        explanation,
      });
    }

    return NextResponse.json({ error: 'Invalid recommendation request parameters' }, { status: 400 });
  } catch (error: any) {
    console.error('Recommendation API error:', error);
    return NextResponse.json({ error: 'Failed to process recommendation' }, { status: 500 });
  }
}
