import { PrismaClient } from '@prisma/client';
import { NLPEngine } from '../lib/nlp-engine';
import { AuthService } from '../lib/auth';

const prisma = new PrismaClient();

async function runTests() {
  console.log('🧪 Starting SkillAlign Comprehensive Automated Test Suite...\n');
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
    // TEST 1: NLP Skill Extraction & Synonym Normalization
    // ----------------------------------------------------
    console.log('🔹 Test Suite 1: AI / NLP Skill Intelligence');
    const sampleInput =
      'Looking for an EV Technician experienced in battery diagnostics, BMS calibration, DC fast charging infrastructure, and high-voltage EV safety protocols.';

    const extracted = NLPEngine.extractSkills(sampleInput);
    assert(extracted.length >= 4, 'Extracts at least 4 standardized competencies');

    const bms = extracted.find((s) => s.name === 'Battery Management Systems');
    assert(!!bms, 'Normalizes acronym "BMS" to "Battery Management Systems"');
    assert(bms ? bms.confidence >= 90 : false, 'Assigns high confidence score (>=90%) to BMS');

    const evSafety = extracted.find((s) => s.name === 'EV Safety Protocols');
    assert(!!evSafety, 'Extracts multi-word entity "EV Safety Protocols"');

    // ----------------------------------------------------
    // TEST 2: Deterministic Skill Gap Computation
    // ----------------------------------------------------
    console.log('\n🔹 Test Suite 2: Mathematical Skill Gap Formula');
    // High Demand (94), Low Coverage (10%)
    const res1 = NLPEngine.computeGapSeverity(94, 10);
    assert(res1.gapScore === 85, `Gap score computed correctly as 85 (got ${res1.gapScore})`);
    assert(res1.severity === 'CRITICAL', 'Classifies 85pt deficit as CRITICAL');

    // High Demand (88), High Coverage (85%)
    const res2 = NLPEngine.computeGapSeverity(88, 85);
    assert(res2.gapScore <= 15, `Gap score correctly low for high coverage (got ${res2.gapScore})`);
    assert(res2.severity === 'COVERED', 'Classifies high coverage as COVERED');

    // ----------------------------------------------------
    // TEST 3: Explainable Recommendation Synthesizer
    // ----------------------------------------------------
    console.log('\n🔹 Test Suite 3: Explainable AI Recommendation Rationale');
    const rec = NLPEngine.generateExplainableRecommendation({
      skillName: 'Battery Management Systems',
      category: 'EV & Clean Mobility',
      demandScore: 94,
      coverageScore: 10,
      gapScore: 85,
      courseTitle: 'Diploma in Automobile Engineering (AE-EV-302)',
      district: 'Pune',
    });

    assert(rec.whyReason.includes('Pune'), 'Explanation cites regional district signal (Pune)');
    assert(rec.whyReason.includes('94/100'), 'Explanation cites quantitative demand score (94/100)');
    assert(rec.evidence.industryDemandScore === 94, 'Contains quantitative evidence signals');
    assert(rec.confidenceScore >= 80, 'Produces credible confidence metric');
    assert(rec.recommendedAction.includes('module'), 'Recommends concrete curriculum revision action');

    // ----------------------------------------------------
    // TEST 4: Database Schema & Seed Integrity
    // ----------------------------------------------------
    console.log('\n🔹 Test Suite 4: Database Models & Relational Integrity');
    const userCount = await prisma.user.count();
    assert(userCount >= 5, `Database seeded with all 5 stakeholder accounts (found ${userCount})`);

    const studentUser = await prisma.user.findFirst({
      where: { role: 'STUDENT' },
      include: { profile: { include: { targetRole: true } }, roadmaps: true },
    });
    assert(!!studentUser, 'Student user (Aarav Deshmukh) exists');
    assert(
      Boolean(studentUser?.profile?.targetRole?.title?.includes('EV')),
      'Student profile linked to target role "EV Technician"'
    );
    assert((studentUser?.roadmaps?.length || 0) > 0, 'Student has learning roadmap attached');

    const pwMatch = await AuthService.verifyPassword('Demo@123', studentUser!.passwordHash);
    assert(pwMatch, 'Password hashing & bcrypt validation verified');

    const evCourse = await prisma.course.findFirst({
      where: { code: 'AE-EV-302' },
      include: { modules: true, recommendations: true },
    });
    assert(!!evCourse, 'MSBTE Course AE-EV-302 exists');
    assert((evCourse?.modules?.length || 0) >= 4, 'Course contains syllabus modules');
    assert(
      (evCourse?.recommendations?.length || 0) >= 1,
      'Course contains AI curriculum recommendations'
    );

    const activeConnections = await prisma.connection.count();
    assert(activeConnections >= 1, 'Connection system records verified in database');

    const messagesCount = await prisma.message.count();
    assert(messagesCount >= 2, 'Direct messaging conversation records verified in database');

    const districtMetricsCount = await prisma.districtDemandMetric.count();
    assert(districtMetricsCount >= 5, 'District demand telemetry metrics populated in database');

    // ----------------------------------------------------
    // SUMMARY
    // ----------------------------------------------------
    console.log('\n========================================');
    console.log(`TOTAL TESTS RUN: ${passed + failed}`);
    console.log(`PASSED: ${passed}`);
    console.log(`FAILED: ${failed}`);
    console.log('========================================');

    if (failed > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error('Test execution exception:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runTests();
