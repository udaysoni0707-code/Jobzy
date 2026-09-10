import { NextRequest, NextResponse } from 'next/server';
import { NLPEngine } from '@/lib/nlp-engine';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text string is required for skill analysis' }, { status: 400 });
    }

    const extracted = NLPEngine.extractSkills(text);

    // Enrich with database IDs if existing
    const skillNames = extracted.map((s) => s.name);
    const dbSkills = await db.skill.findMany({
      where: { name: { in: skillNames } },
    });

    const dbSkillMap = new Map(dbSkills.map((s) => [s.name, s]));

    const enriched = extracted.map((s) => {
      const found = dbSkillMap.get(s.name);
      return {
        ...s,
        id: found?.id,
        description: found?.description,
        demandIndex: found?.demandIndex,
      };
    });

    return NextResponse.json({
      success: true,
      textLength: text.length,
      extractedCount: enriched.length,
      skills: enriched,
    });
  } catch (error: any) {
    console.error('Skill extraction error:', error);
    return NextResponse.json({ error: 'Failed to process skill extraction' }, { status: 500 });
  }
}
