import { PrismaClient } from '@prisma/client';
import { NLPEngine } from '../lib/nlp-engine';
import { AuthService } from '../lib/auth';
import { generateLocalContextualAIResponse } from '../lib/ai-assistant';

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
    // TEST 5: Context-Aware Multi-Turn AI Messaging
    // ----------------------------------------------------
    console.log('\n🔹 Test Suite 5: Context-Aware Multi-Turn AI Messaging');

    const priyaPersona = {
      name: 'Priya Sharma',
      role: 'STUDENT' as const,
      headline: 'Mechatronics & EV Research • GP Pune',
      organization: 'Government Polytechnic Pune',
    };

    // Test 5.1: Background inquiry directly answers with diploma, Mechatronics, GP Pune
    const bgReply = generateLocalContextualAIResponse({
      currentUser: { id: 'u1', name: 'Raman', district: 'Pune' },
      stakeholder: priyaPersona,
      conversationHistory: [
        {
          senderId: 'u2',
          role: 'assistant',
          content: "I'd be happy to introduce myself! I'm Priya Sharma... What would you like to know about my background or research?",
        },
      ],
      latestMessage: 'what is your background',
    });
    assert(
      bgReply.includes('Mechatronics') && (bgReply.includes('Government Polytechnic Pune') || bgReply.includes('GP Pune')),
      'Answers "what is your background" directly with Mechatronics & GP Pune details'
    );
    assert(
      !bgReply.includes("That's a thoughtful point! As fellow learners"),
      'Does NOT fall back to generic conversational evasion on background query'
    );

    // Test 5.2: Research inquiry answers with BMS, cell balancing, MATLAB, AIS-038
    const researchReply = generateLocalContextualAIResponse({
      currentUser: { id: 'u1', name: 'Raman', district: 'Pune' },
      stakeholder: priyaPersona,
      conversationHistory: [],
      latestMessage: 'tell me about your research',
    });
    assert(
      researchReply.includes('Battery Management Systems') && researchReply.includes('Cell-Balancing'),
      'Answers "tell me about your research" with Battery Management Systems & Cell-Balancing'
    );

    // Test 5.3: Follow-up answering Priya\'s "What would you like to know about my background or research?" with "both"
    const bothReply = generateLocalContextualAIResponse({
      currentUser: { id: 'u1', name: 'Raman', district: 'Pune' },
      stakeholder: priyaPersona,
      conversationHistory: [
        {
          senderId: 'u2',
          role: 'assistant',
          content: 'What would you like to know about my background or research?',
        },
      ],
      latestMessage: 'both',
    });
    assert(
      bothReply.includes('Academic Background') && bothReply.includes('Research Focus'),
      'Understands "both" in context of previous question and provides background & research'
    );

    // Test 5.4: College inquiry
    const collegeReply = generateLocalContextualAIResponse({
      currentUser: { id: 'u1', name: 'Raman', district: 'Pune' },
      stakeholder: priyaPersona,
      conversationHistory: [],
      latestMessage: 'which college do you study at?',
    });
    assert(
      collegeReply.includes('Government Polytechnic Pune') && collegeReply.includes('Shivaji Nagar'),
      'Answers "which college" with Government Polytechnic Pune & Shivaji Nagar'
    );

    // Test 5.5: Projects inquiry
    const projReply = generateLocalContextualAIResponse({
      currentUser: { id: 'u1', name: 'Raman', district: 'Pune' },
      stakeholder: priyaPersona,
      conversationHistory: [],
      latestMessage: 'what projects have you worked on?',
    });
    assert(
      projReply.includes('Smart BMS Prototype') || projReply.includes('48V BMS Prototype'),
      'Answers "what projects have you worked on" with Smart BMS Prototype details'
    );

    // Test 5.6: Tata Motors Industry Career acceptance
    const tataPersona = {
      name: 'Tata Motors EV Systems',
      role: 'INDUSTRY' as const,
      headline: 'Technical Talent & Apprenticeship Division • Pune Hub',
      organization: 'Tata Motors',
    };
    const tataReply = generateLocalContextualAIResponse({
      currentUser: { id: 'u1', name: 'Raman', district: 'Pune' },
      stakeholder: tataPersona,
      conversationHistory: [
        {
          senderId: 'u3',
          role: 'assistant',
          content: 'Are you looking to explore career pathways with us?',
        },
      ],
      latestMessage: 'yes',
    });
    assert(
      tataReply.includes('Tata Motors EV Systems Pune') && tataReply.includes('Apprentice Trainees'),
      'Understands "yes" to career pathways and provides Tata Motors apprentice role details'
    );

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
