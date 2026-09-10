import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const instituteId = searchParams.get('instituteId');

    const courses = await db.course.findMany({
      where: instituteId ? { instituteId } : undefined,
      include: {
        institute: true,
        modules: {
          include: {
            skills: {
              include: { skill: true },
            },
          },
          orderBy: { orderNumber: 'asc' },
        },
        recommendations: {
          include: { skill: true },
        },
      },
      orderBy: { alignmentScore: 'desc' },
    });

    return NextResponse.json({ success: true, count: courses.length, courses });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch curriculum' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { courseId, title, description, hours, skillIds } = body;

    if (!courseId || !title) {
      return NextResponse.json({ error: 'Course ID and module title are required' }, { status: 400 });
    }

    const currentCount = await db.curriculumModule.count({ where: { courseId } });

    const newModule = await db.curriculumModule.create({
      data: {
        courseId,
        title,
        description,
        hours: Number(hours) || 30,
        orderNumber: currentCount + 1,
        skills: skillIds && Array.isArray(skillIds)
          ? {
              create: skillIds.map((sid: string) => ({
                skillId: sid,
                coverageLevel: 'INTERMEDIATE',
              })),
            }
          : undefined,
      },
      include: {
        skills: { include: { skill: true } },
      },
    });

    // Update course alignment score slightly
    await db.course.update({
      where: { id: courseId },
      data: {
        alignmentScore: { increment: 8 },
      },
    });

    return NextResponse.json({ success: true, module: newModule });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add curriculum module' }, { status: 500 });
  }
}
