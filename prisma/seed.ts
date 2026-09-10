import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { MAHARASHTRA_SKILL_TAXONOMY, MAHARASHTRA_DISTRICTS } from '../lib/taxonomy';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding SkillAlign database for SIH26134 (Government of Maharashtra)...');

  // Clear existing records safely
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.message.deleteMany();
  await prisma.connection.deleteMany();
  await prisma.learningRoadmap.deleteMany();
  await prisma.studentSkill.deleteMany();
  await prisma.curriculumRecommendation.deleteMany();
  await prisma.skillGapAnalysis.deleteMany();
  await prisma.moduleSkill.deleteMany();
  await prisma.curriculumModule.deleteMany();
  await prisma.course.deleteMany();
  await prisma.requirementSkill.deleteMany();
  await prisma.industryRequirement.deleteMany();
  await prisma.roleRequiredSkill.deleteMany();
  await prisma.jobRole.deleteMany();
  await prisma.skillAlias.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.institute.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.districtDemandMetric.deleteMany();

  // Common password hash for demo accounts: Demo@123
  const passwordHash = await bcrypt.hash('Demo@123', 10);

  // 1. Create Skills & Aliases from Maharashtra Taxonomy
  console.log('Inserting skills and aliases...');
  const skillMap = new Map<string, any>();

  for (const def of MAHARASHTRA_SKILL_TAXONOMY) {
    const skill = await prisma.skill.create({
      data: {
        name: def.name,
        category: def.category,
        description: def.description,
        isEmerging: def.isEmerging,
        demandIndex: def.demandIndex,
        aliases: {
          create: def.aliases.map((alias) => ({ alias })),
        },
      },
    });
    skillMap.set(def.name, skill);
  }

  // 2. Create Job Roles
  console.log('Inserting job roles...');
  const evRole = await prisma.jobRole.create({
    data: {
      title: 'EV Technician & Diagnostic Specialist',
      sector: 'Automotive & Clean Mobility',
      description: 'Specializes in high-voltage EV battery maintenance, BMS calibration, inverter troubleshooting, and charging infrastructure.',
      typicalDemand: 94,
      avgSalaryLpa: 5.5,
    },
  });

  const automationRole = await prisma.jobRole.create({
    data: {
      title: 'Industry 4.0 Automation Engineer',
      sector: 'Advanced Manufacturing',
      description: 'Designs and manages PLC, SCADA, industrial robotics, and IIoT sensor telemetry on smart shop floors.',
      typicalDemand: 88,
      avgSalaryLpa: 6.5,
    },
  });

  const softwareRole = await prisma.jobRole.create({
    data: {
      title: 'Full-Stack Software Engineer',
      sector: 'Information Technology',
      description: 'Architects scalable web platforms, backend APIs, microservices, and database layers.',
      typicalDemand: 90,
      avgSalaryLpa: 7.8,
    },
  });

  // Map EV Role Required Skills
  const bmsSkill = skillMap.get('Battery Management Systems');
  const diagnosticsSkill = skillMap.get('Battery Diagnostics');
  const evSafetySkill = skillMap.get('EV Safety Protocols');
  const chargingSkill = skillMap.get('Charging Infrastructure');
  const motorSkill = skillMap.get('Traction Motor & Inverter Control');

  if (bmsSkill && diagnosticsSkill && evSafetySkill && chargingSkill) {
    await prisma.roleRequiredSkill.createMany({
      data: [
        { jobRoleId: evRole.id, skillId: bmsSkill.id, importance: 'URGENT', minWeight: 90 },
        { jobRoleId: evRole.id, skillId: diagnosticsSkill.id, importance: 'HIGH', minWeight: 85 },
        { jobRoleId: evRole.id, skillId: evSafetySkill.id, importance: 'HIGH', minWeight: 85 },
        { jobRoleId: evRole.id, skillId: chargingSkill.id, importance: 'MEDIUM', minWeight: 75 },
        { jobRoleId: evRole.id, skillId: motorSkill.id, importance: 'MEDIUM', minWeight: 70 },
      ],
    });
  }

  // 3. Create Users for 5 Stakeholder Roles
  console.log('Creating demo users...');

  // Student User
  const studentUser = await prisma.user.create({
    data: {
      email: 'student@skillalign.gov.in',
      name: 'Aarav Deshmukh',
      passwordHash,
      role: 'STUDENT',
      phone: '+91 98230 11223',
      isVerified: true,
      profile: {
        create: {
          headline: 'Diploma Automotive Engineering Student | EV Enthusiast',
          bio: 'Final year diploma student at Government Polytechnic Pune aiming for an EV Diagnostic Specialist career.',
          district: 'Pune',
          location: 'Pune, Maharashtra',
          targetRoleId: evRole.id,
          readinessScore: 68,
          education: 'Diploma in Automobile Engineering (2023 - 2026)',
        },
      },
    },
  });

  // Peer Student (for networking / connection requests)
  const peerUser = await prisma.user.create({
    data: {
      email: 'priya.sharma@skillnova.gov.in',
      name: 'Priya Sharma',
      passwordHash,
      role: 'STUDENT',
      phone: '+91 98230 44556',
      isVerified: true,
      profile: {
        create: {
          headline: 'Mechatronics Graduate & IoT Researcher',
          bio: 'Passionate about industrial automation, PLC programming, and smart mobility solutions.',
          district: 'Mumbai Suburban',
          location: 'Mumbai, Maharashtra',
          targetRoleId: automationRole.id,
          readinessScore: 78,
        },
      },
    },
  });

  // Industry User & Org
  const industryUser = await prisma.user.create({
    data: {
      email: 'industry@tatamotors.com',
      name: 'Tata Motors EV Systems Division',
      passwordHash,
      role: 'INDUSTRY',
      phone: '+91 20 6613 0000',
      isVerified: true,
      organization: {
        create: {
          name: 'Tata Motors Passenger Vehicles EV Unit',
          sector: 'Automotive & Clean Mobility',
          district: 'Pune',
          website: 'https://ev.tatamotors.com',
          description: 'Pioneering electric mobility ecosystem in India with state-of-the-art battery and powertrain development in Pune.',
          verificationStatus: 'VERIFIED',
        },
      },
    },
    include: { organization: true },
  });

  // Institute User & Institute
  const instituteUser = await prisma.user.create({
    data: {
      email: 'institute@msbte.ac.in',
      name: 'Government Polytechnic Pune',
      passwordHash,
      role: 'INSTITUTE',
      phone: '+91 20 2567 6817',
      isVerified: true,
      institute: {
        create: {
          name: 'Government Polytechnic Pune (MSBTE Affiliated)',
          type: 'POLYTECHNIC',
          district: 'Pune',
          code: 'MSBTE-6002',
          website: 'https://gppune.ac.in',
          verificationStatus: 'VERIFIED',
        },
      },
    },
    include: { institute: true },
  });

  // Government User
  const govtUser = await prisma.user.create({
    data: {
      email: 'government@maharashtra.gov.in',
      name: 'Directorate of Technical Education (DTE)',
      passwordHash,
      role: 'GOVERNMENT',
      phone: '+91 22 2262 0601',
      isVerified: true,
      profile: {
        create: {
          headline: 'State Skill Development & Technical Education Monitoring Desk',
          bio: 'Government of Maharashtra monitoring committee for state industrial-curriculum alignment.',
          district: 'Mumbai City',
          location: 'Mantralaya, Mumbai',
        },
      },
    },
  });

  // Admin User
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@skillalign.gov.in',
      name: 'SkillAlign Administrator',
      passwordHash,
      role: 'ADMIN',
      phone: '+91 22 2200 9999',
      isVerified: true,
    },
  });

  // 4. Create Industry Requirement for EV Technician
  console.log('Creating industry requirements...');
  const evRequirement = await prisma.industryRequirement.create({
    data: {
      orgId: industryUser.organization!.id,
      jobRoleId: evRole.id,
      title: 'Electric Vehicle Service & Battery Diagnostics Specialist',
      sector: 'Automotive & Clean Mobility',
      district: 'Pune',
      experienceYears: 1,
      positions: 25,
      urgency: 'HIGH',
      description:
        'Seeking skilled EV Technicians proficient in Battery Management Systems (BMS) testing, cell degradation analysis, high-voltage EV safety protocols, and DC fast charging infrastructure for our Pune manufacturing and service hub.',
      status: 'ACTIVE',
      skills: {
        create: [
          { skillId: bmsSkill.id, weight: 95 },
          { skillId: diagnosticsSkill.id, weight: 90 },
          { skillId: evSafetySkill.id, weight: 88 },
          { skillId: chargingSkill.id, weight: 80 },
        ],
      },
    },
  });

  // 5. Create Course & Modules for Institute
  console.log('Creating course & curriculum modules...');
  const evCourse = await prisma.course.create({
    data: {
      instituteId: instituteUser.institute!.id,
      title: 'Diploma in Automobile Engineering (EV Specialization)',
      code: 'AE-EV-302',
      department: 'Automobile Engineering',
      durationWeeks: 48,
      level: 'Diploma / Polytechnic',
      alignmentScore: 64, // 64% aligned, showing a clear gap in BMS!
      isStateApproved: true,
    },
  });

  // Modules
  const mod1 = await prisma.curriculumModule.create({
    data: {
      courseId: evCourse.id,
      title: 'Module 1: Vehicle Dynamics & Chassis Inspection',
      hours: 40,
      orderNumber: 1,
      description: 'Chassis alignment, suspension geometry, steering mechanisms.',
    },
  });

  const mod2 = await prisma.curriculumModule.create({
    data: {
      courseId: evCourse.id,
      title: 'Module 2: High Voltage Safety Protocols & AIS Compliance',
      hours: 35,
      orderNumber: 2,
      description: 'Safety protocols, personal protective equipment, HV interlocks.',
      skills: {
        create: [{ skillId: evSafetySkill.id, coverageLevel: 'ADVANCED' }],
      },
    },
  });

  const mod3 = await prisma.curriculumModule.create({
    data: {
      courseId: evCourse.id,
      title: 'Module 3: Electric Powertrain & Traction Motor Tuning',
      hours: 45,
      orderNumber: 3,
      description: 'BLDC/PMSM motor operations, inverter switching, regeneration.',
      skills: {
        create: [{ skillId: motorSkill.id, coverageLevel: 'INTERMEDIATE' }],
      },
    },
  });

  const mod4 = await prisma.curriculumModule.create({
    data: {
      courseId: evCourse.id,
      title: 'Module 4: EV Charging Stations & Grid Interfaces',
      hours: 30,
      orderNumber: 4,
      description: 'AC Slow Charging and introductory DC fast charging stations.',
      skills: {
        create: [{ skillId: chargingSkill.id, coverageLevel: 'BASIC' }],
      },
    },
  });

  // 6. Precomputed Skill Gap Analysis
  console.log('Creating skill gap analysis entries...');
  await prisma.skillGapAnalysis.createMany({
    data: [
      {
        jobRoleId: evRole.id,
        district: 'Pune',
        skillId: bmsSkill.id,
        demandScore: 94,
        coverageScore: 10,
        gapScore: 85,
        gapSeverity: 'CRITICAL',
      },
      {
        jobRoleId: evRole.id,
        district: 'Pune',
        skillId: diagnosticsSkill.id,
        demandScore: 91,
        coverageScore: 15,
        gapScore: 77,
        gapSeverity: 'CRITICAL',
      },
      {
        jobRoleId: evRole.id,
        district: 'Pune',
        skillId: chargingSkill.id,
        demandScore: 85,
        coverageScore: 45,
        gapScore: 47,
        gapSeverity: 'MISSING',
      },
      {
        jobRoleId: evRole.id,
        district: 'Pune',
        skillId: evSafetySkill.id,
        demandScore: 88,
        coverageScore: 85,
        gapScore: 13,
        gapSeverity: 'COVERED',
      },
    ],
  });

  // 7. Explainable Curriculum Recommendation
  console.log('Creating explainable AI recommendation...');
  await prisma.curriculumRecommendation.create({
    data: {
      courseId: evCourse.id,
      skillId: bmsSkill.id,
      actionType: 'ADD_MODULE',
      title: 'Add 36-Hour Dedicated Module: Battery Management Systems & Cell Balancing Diagnostics',
      whyReason:
        'Industry signals from Tata Motors, Mahindra Electric, and regional EV clusters in Pune show 94/100 demand for BMS engineering, whereas the current MSBTE diploma curriculum provides only 10% direct coverage.',
      evidenceJson: JSON.stringify({
        industryDemandScore: 94,
        curriculumCoverageScore: 10,
        openJobPositions: 180,
        stateShortageIndex: 88,
        recentPostingsSnippet: 'Verified from 25 active openings at Tata Motors EV and 4 tier-1 suppliers in Chakan & Talegaon.',
        recommendedLabHours: 20,
        recommendedTheoryHours: 16,
      }),
      confidenceScore: 91,
      priority: 'HIGH',
      status: 'PENDING',
    },
  });

  // 8. Student Learning Roadmap for Aarav
  console.log('Creating student learning roadmap...');
  const roadmapSteps = [
    {
      step: 1,
      title: 'High Voltage EV Safety Certification (AIS-038/156)',
      skill: 'EV Safety Protocols',
      type: 'CERTIFICATION',
      durationWeeks: 3,
      completed: true,
      provider: 'MSBTE / ASDC Certified',
    },
    {
      step: 2,
      title: 'Electric Powertrain & Inverter Calibration',
      skill: 'Traction Motor & Inverter Control',
      type: 'COURSE',
      durationWeeks: 4,
      completed: true,
      provider: 'Government Polytechnic Pune',
    },
    {
      step: 3,
      title: 'Battery Management Systems (BMS) Architecture & State Estimation',
      skill: 'Battery Management Systems',
      type: 'LAB',
      durationWeeks: 5,
      completed: false,
      provider: 'SkillAlign Recommended Lab (In Progress)',
    },
    {
      step: 4,
      title: 'Battery Health & Electrochemical Impedance Diagnostics',
      skill: 'Battery Diagnostics',
      type: 'LAB',
      durationWeeks: 4,
      completed: false,
      provider: 'Industrial Workshop Partner (Tata Motors Hub)',
    },
    {
      step: 5,
      title: 'Commercial Fast Charging (CCS2/OCPP) Capstone Project',
      skill: 'Charging Infrastructure',
      type: 'PROJECT',
      durationWeeks: 3,
      completed: false,
      provider: 'Industry Capstone',
    },
  ];

  await prisma.learningRoadmap.create({
    data: {
      userId: studentUser.id,
      jobRoleId: evRole.id,
      currentStep: 3,
      totalSteps: 5,
      readinessScore: 68,
      stepsJson: JSON.stringify(roadmapSteps),
    },
  });

  // Student Skills
  await prisma.studentSkill.createMany({
    data: [
      { userId: studentUser.id, skillId: evSafetySkill.id, proficiency: 'ADVANCED' },
      { userId: studentUser.id, skillId: motorSkill.id, proficiency: 'INTERMEDIATE' },
    ],
  });

  // 9. Connections and Messages
  console.log('Creating sample connection and direct messages...');
  await prisma.connection.create({
    data: {
      requesterId: studentUser.id,
      addresseeId: peerUser.id,
      status: 'ACCEPTED',
    },
  });

  await prisma.message.createMany({
    data: [
      {
        senderId: peerUser.id,
        receiverId: studentUser.id,
        content: 'Hi Aarav! Are you attending the upcoming EV Battery Testing lab workshop in Pune?',
        isRead: true,
      },
      {
        senderId: studentUser.id,
        receiverId: peerUser.id,
        content: 'Yes Priya! Just completed the EV Safety certification. Looking forward to the BMS hands-on sessions!',
        isRead: true,
      },
    ],
  });

  // 10. District Demand Metrics for Maharashtra
  console.log('Seeding district demand metrics...');
  const sampleDistrictData = [
    {
      district: 'Pune',
      sector: 'Automotive & Clean Mobility',
      highDemandSkill: 'Battery Management Systems',
      shortageSkill: 'BMS Calibration & Diagnostics',
      indexScore: 92,
      employmentDemand: 1850,
      trainingCapacity: 640,
    },
    {
      district: 'Mumbai Suburban',
      sector: 'Information Technology & Data',
      highDemandSkill: 'Cloud Computing & DevOps',
      shortageSkill: 'AI / Machine Learning Engineering',
      indexScore: 89,
      employmentDemand: 3200,
      trainingCapacity: 1400,
    },
    {
      district: 'Nagpur',
      sector: 'Logistics & Clean Energy',
      highDemandSkill: 'Solar PV System Design',
      shortageSkill: 'Green Hydrogen Electrolysis',
      indexScore: 78,
      employmentDemand: 950,
      trainingCapacity: 420,
    },
    {
      district: 'Nashik',
      sector: 'Automotive & Precision Engineering',
      highDemandSkill: 'PLC Programming',
      shortageSkill: 'Industrial Robotics',
      indexScore: 82,
      employmentDemand: 1100,
      trainingCapacity: 510,
    },
    {
      district: 'Chhatrapati Sambhaji Nagar',
      sector: 'Auto Components & Heavy Engineering',
      highDemandSkill: 'Industrial Robotics',
      shortageSkill: 'Digital Twin Modeling',
      indexScore: 84,
      employmentDemand: 1250,
      trainingCapacity: 480,
    },
    {
      district: 'Kolhapur',
      sector: 'Foundry & Agricultural Automation',
      highDemandSkill: 'IoT Sensors & Edge Gateway',
      shortageSkill: 'Embedded C & Microcontrollers',
      indexScore: 74,
      employmentDemand: 680,
      trainingCapacity: 310,
    },
    {
      district: 'Thane',
      sector: 'Chemical & Clean Mobility',
      highDemandSkill: 'EV Safety Protocols',
      shortageSkill: 'High Voltage Safety Compliance',
      indexScore: 86,
      employmentDemand: 1400,
      trainingCapacity: 600,
    },
  ];

  for (const item of sampleDistrictData) {
    await prisma.districtDemandMetric.create({
      data: item,
    });
  }

  // 11. Initial Notifications
  console.log('Seeding notifications...');
  await prisma.notification.createMany({
    data: [
      {
        userId: govtUser.id,
        title: 'Critical Skill Shortage Alert',
        message: 'Critical gap (85pt) detected in Battery Management Systems in Pune automotive corridor.',
        type: 'ALERT',
        link: '/dashboard/government',
      },
      {
        userId: instituteUser.id,
        title: 'New Curriculum Recommendation',
        message: 'AI generated 1 high-priority curriculum update recommendation for AE-EV-302.',
        type: 'RECOMMENDATION',
        link: '/curriculum',
      },
      {
        userId: studentUser.id,
        title: 'Skill Gap Computed',
        message: 'Your EV Technician role readiness is 68%. Step 3: BMS Lab is recommended next.',
        type: 'GAP',
        link: '/dashboard/student',
      },
    ],
  });

  // 12. Audit Log
  await prisma.auditLog.create({
    data: {
      userId: govtUser.id,
      action: 'SYSTEM_INITIALIZATION',
      resource: 'PLATFORM_TAXONOMY',
      metadataJson: JSON.stringify({ state: 'Maharashtra', version: '2026.1', status: 'SUCCESS' }),
    },
  });

  console.log('✅ SkillAlign database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
