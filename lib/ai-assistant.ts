/**
 * Jobzy Context-Aware AI Conversation Engine
 * Handles multi-turn chat generation with conversation history,
 * intent detection, short-term session memory, bilingual (Hinglish/English) reasoning,
 * and deep domain knowledge across EV engineering, careers, and academics.
 */

export interface ChatMessage {
  id?: string;
  senderId: string;
  receiverId?: string;
  senderName?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt?: string | Date;
}

export interface StakeholderPersona {
  name: string;
  role: 'STUDENT' | 'INDUSTRY' | 'INSTITUTE' | 'GOVERNMENT' | 'ADMIN';
  headline?: string;
  organization?: string;
}

interface UserMemory {
  name?: string;
  college?: string;
  city?: string;
  interest?: string;
  lastTopic?: string;
  allTopics: string[];
}

/**
 * Checks if user message is predominantly in Hindi / Hinglish
 */
export function isHindiOrHinglish(text: string): boolean {
  const hindiWords = [
    'kya', 'kaise', 'kese', 'kyu', 'kyun', 'kaha', 'kahan', 'kab', 'kon', 'kaun', 'kitna', 'kitni', 'kitne',
    'batao', 'bataiye', 'sikhao', 'samjhao', 'chahiye', 'milega', 'milegi', 'hoga', 'hogi', 'karna',
    'kare', 'karein', 'karu', 'sakta', 'sakti', 'sakte', 'mujhe', 'mera', 'meri', 'mere', 'apna',
    'apne', 'apni', 'aap', 'tum', 'tu', 'tera', 'teri', 'hai', 'hain', 'ho', 'tha', 'thi', 'the',
    'nahi', 'nahin', 'mat', 'accha', 'achha', 'badhiya', 'theek', 'sahi', 'yaar', 'bhai', 'bro',
    'padhai', 'naukri', 'kam', 'kaam', 'paisa', 'paise', 'dost', 'madad', 'sunao', 'bata', 'bolo',
    'karogi', 'banogi', 'dosti', 'dar', 'lag', 'raha', 'rahi', 'kuch', 'naya', 'sawaal', 'sawal'
  ];
  const lower = text.toLowerCase();
  const tokens = lower.split(/[\s,?.!'"()]+/);
  return tokens.some((t) => hindiWords.includes(t));
}

/**
 * Extracts facts and topic context from previous messages in the current conversation
 */
function extractSessionMemory(history: ChatMessage[], currentUser: { name: string; district?: string }): UserMemory {
  const memory: UserMemory = {
    name: currentUser.name || undefined,
    city: currentUser.district || undefined,
    allTopics: [],
  };

  for (const msg of history) {
    const isUserMsg = msg.role === 'user' || (currentUser.name && msg.senderName === currentUser.name);
    if (!isUserMsg) continue;

    const text = msg.content;
    const lower = text.toLowerCase();

    // Name detection from user statements
    const nameMatch = text.match(/(?:my name is|call me|name's|mera naam)\s+([A-Za-z]+(?:\s+[A-Za-z]+)?)/i);
    if (nameMatch && nameMatch[1] && !['Jobzy', 'Priya', 'Tata', 'Doing', 'What', 'Where', 'How', 'Hai'].includes(nameMatch[1])) {
      memory.name = nameMatch[1].trim();
    }

    // City detection
    const cityMatch = lower.match(/(?:live in|from|located in|at|me rehta|se hu)\s+(pune|mumbai|nagpur|nashik|aurangabad|kolhapur|thane|chakan|pimpri)/);
    if (cityMatch) {
      memory.city = cityMatch[1].charAt(0).toUpperCase() + cityMatch[1].slice(1);
    }

    // College detection
    const collegeMatch = text.match(/(?:study at|student of|from|college is|college me)\s+([A-Za-z\s]+(?:Polytechnic|Institute|College|University))/i);
    if (collegeMatch) {
      memory.college = collegeMatch[1].trim();
    }

    // Topic tracking
    if (lower.includes('battery') || lower.includes('bms')) {
      memory.lastTopic = 'bms_battery';
      memory.allTopics.push('bms_battery');
    } else if (lower.includes('intern') || lower.includes('job') || lower.includes('placement') || lower.includes('hiring') || lower.includes('naukri')) {
      memory.lastTopic = 'internships';
      memory.allTopics.push('internships');
    } else if (lower.includes('curriculum') || lower.includes('gap') || lower.includes('syllabus')) {
      memory.lastTopic = 'curriculum_gap';
      memory.allTopics.push('curriculum_gap');
    } else if (lower.includes('certif') || lower.includes('ais-038') || lower.includes('course')) {
      memory.lastTopic = 'certifications';
      memory.allTopics.push('certifications');
    } else if (lower.includes('research')) {
      memory.lastTopic = 'research';
      memory.allTopics.push('research');
    } else if (lower.includes('project')) {
      memory.lastTopic = 'project';
      memory.allTopics.push('project');
    }
  }

  return memory;
}

export type IntentType =
  | 'CHAT_QUALITY_DESIRE'
  | 'MEMORY_QUERY'
  | 'NAME_STATEMENT'
  | 'AI_IDENTITY_QUERY'
  | 'FRIENDSHIP_QUERY'
  | 'CAPABILITIES_QUERY'
  | 'BACKGROUND_AND_RESEARCH'
  | 'BACKGROUND_QUERY'
  | 'RESEARCH_QUERY'
  | 'COLLEGE_EDUCATION_QUERY'
  | 'PROJECTS_QUERY'
  | 'SKILLS_QUERY'
  | 'LOCATION_QUERY'
  | 'WHAT_ARE_YOU_DOING_QUERY'
  | 'PLACEMENT_GUIDANCE'
  | 'INTERVIEW_PREP_QUERY'
  | 'SALARY_PACKAGE_QUERY'
  | 'RESUME_GUIDANCE'
  | 'INTERNSHIP_QUERY'
  | 'CAREER_EXPLORATION_ACCEPTANCE'
  | 'BMS_QUERY'
  | 'CELL_BALANCING_QUERY'
  | 'THERMAL_RUNAWAY_QUERY'
  | 'BATTERY_CHEMISTRY_QUERY'
  | 'EV_VS_PETROL_QUERY'
  | 'CHARGING_INFRA_QUERY'
  | 'MOTOR_INVERTER_QUERY'
  | 'SAFETY_STANDARDS_QUERY'
  | 'CODING_IN_EV_QUERY'
  | 'COURSE_SYLLABUS_QUERY'
  | 'CURRICULUM_GAP_QUERY'
  | 'JOBZY_PLATFORM_QUERY'
  | 'DISTRICT_INTELLIGENCE_QUERY'
  | 'STATE_POLICY_QUERY'
  | 'JOKE_QUERY'
  | 'BOREDOM_NEWS_QUERY'
  | 'MOTIVATION_STRESS_QUERY'
  | 'PERSONAL_INTRO'
  | 'GREETING'
  | 'POLITE_CLOSING'
  | 'FOLLOW_UP'
  | 'EV_BATTERY_QUERY'
  | 'CERTIFICATION_QUERY'
  | 'GENERAL_CODING'
  | 'GENERAL_CHAT';

/**
 * Determines the conversational intent of the latest user message
 * considering conversational history, memory, persona context, and bilingual semantics.
 */
export function detectIntent(
  message: string,
  history: ChatMessage[],
  memory: UserMemory,
  currentUser?: { id: string; name: string }
): {
  type: IntentType;
  confidence: number;
} {
  const lower = message.toLowerCase().trim();

  // Find previous message sent by the assistant
  const botMsgs = history.filter((m) => m.role === 'assistant' || (currentUser?.id && m.senderId !== currentUser.id));
  const lastBotMsg = botMsgs.slice(-1)[0]?.content || '';
  const lastBotLower = lastBotMsg.toLowerCase();

  // 0. User desires accurate replies / complaining about replies ("har message ka sahi reply mile")
  if (
    lower.includes('sahi reply') ||
    lower.includes('har message ka') ||
    lower.includes('sahi answer') ||
    lower.includes('sahi jawab') ||
    lower.includes('accurate reply') ||
    lower.includes('smart reply') ||
    lower.includes('sahi se bolo') ||
    lower.includes('reply kyu nahi de rahe') ||
    lower.includes('galat reply')
  ) {
    return { type: 'CHAT_QUALITY_DESIRE', confidence: 0.99 };
  }

  // 1. Check if user is stating their name: "My name is Aarav"
  if (lower.startsWith('my name is ') || lower.startsWith('call me ') || lower.startsWith("my name's ") || lower.startsWith('mera naam ')) {
    return { type: 'NAME_STATEMENT', confidence: 0.95 };
  }

  // 2. Check if user is asking what they told the bot earlier (Session Memory Query)
  if (
    lower.includes('what did i tell you') ||
    lower.includes('what was my name') ||
    lower.includes('do you remember my name') ||
    lower.includes('what is my name') ||
    lower.includes('do you know my name') ||
    lower.includes('mera naam kya hai') ||
    lower.includes('kya tumhe mera naam yaad hai') ||
    lower.includes('what did i say')
  ) {
    return { type: 'MEMORY_QUERY', confidence: 0.95 };
  }

  // 3. Conversational follow-up answering the assistant's previous question:
  if (lastBotLower.includes('background or research') || (lastBotLower.includes('background') && lastBotLower.includes('research'))) {
    if (lower.includes('both') || lower.includes('dono') || lower === 'all' || lower === 'everything' || lower === 'yes' || lower === 'tell me both') {
      return { type: 'BACKGROUND_AND_RESEARCH', confidence: 0.98 };
    }
    if (lower.includes('background') || lower === 'first' || lower === '1st' || lower === '1') {
      return { type: 'BACKGROUND_QUERY', confidence: 0.98 };
    }
    if (lower.includes('research') || lower === 'second' || lower === '2nd' || lower === '2') {
      return { type: 'RESEARCH_QUERY', confidence: 0.98 };
    }
  }

  if (lastBotLower.includes('career pathways with us') || lastBotLower.includes('explore career pathways')) {
    if (
      lower === 'yes' ||
      lower === 'yes.' ||
      lower === 'yes!' ||
      lower === 'yeah' ||
      lower === 'sure' ||
      lower === 'definitely' ||
      lower === 'ha' ||
      lower === 'haan' ||
      lower.includes('yes') ||
      lower.includes('how to apply') ||
      lower.includes('interested') ||
      lower.includes('tell me how')
    ) {
      return { type: 'CAREER_EXPLORATION_ACCEPTANCE', confidence: 0.98 };
    }
  }

  // 4. AI Identity Queries ("Are you an AI / Kya tum AI ho?")
  if (
    lower.includes('are you ai') ||
    lower.includes('are you an ai') ||
    lower.includes('are you real') ||
    lower.includes('are you a bot') ||
    lower.includes('kya tum ai ho') ||
    lower.includes('kya tum real ho') ||
    lower.includes('kya tum robot ho') ||
    lower.includes('kya tum insaan ho') ||
    lower.includes('real or fake') ||
    lower.includes('bot or human')
  ) {
    return { type: 'AI_IDENTITY_QUERY', confidence: 0.95 };
  }

  // 5. Friendship / Personal connection ("Can we be friends / Tum meri dost banogi?")
  if (
    lower.includes('can we be friends') ||
    lower.includes('be my friend') ||
    lower.includes('tum meri dost banogi') ||
    lower.includes('dost banogi') ||
    lower.includes('dosti karoge') ||
    lower.includes('meri friend banogi') ||
    lower.includes('friends banoge')
  ) {
    return { type: 'FRIENDSHIP_QUERY', confidence: 0.95 };
  }

  // 6. Capabilities Queries ("What can you do / Aap kya kya kar sakti ho?")
  if (
    lower.includes('what can you do') ||
    lower.includes('aap kya kar sakti ho') ||
    lower.includes('tum kya kar sakti ho') ||
    lower.includes('kya kya kar sakti ho') ||
    lower.includes('kya kar sakti ho') ||
    lower.includes('tumhari capabilities kya hai') ||
    lower.includes('what are your capabilities')
  ) {
    return { type: 'CAPABILITIES_QUERY', confidence: 0.95 };
  }

  // 7. Salary & Package Queries ("Salary kitni milti hai / Package / Stipend")
  if (
    lower.includes('salary') ||
    lower.includes('package') ||
    lower.includes('stipend') ||
    lower.includes('kitna paisa') ||
    lower.includes('paise kitne milte') ||
    lower.includes('highest package') ||
    lower.includes('average package') ||
    lower.includes('kitni salary')
  ) {
    return { type: 'SALARY_PACKAGE_QUERY', confidence: 0.92 };
  }

  // 8. Interview Preparation Queries ("Interview me kya puchte hai / Interview questions")
  if (
    lower.includes('interview question') ||
    lower.includes('interview questions') ||
    lower.includes('interview me kya') ||
    lower.includes('interview tips') ||
    lower.includes('how to crack interview') ||
    lower.includes('interview preparation') ||
    lower.includes('technical interview') ||
    lower.includes('interview clear kaise kare')
  ) {
    return { type: 'INTERVIEW_PREP_QUERY', confidence: 0.92 };
  }

  // 9. Resume & CV Guidance ("Resume kaise banaye / Resume tips")
  if (
    lower.includes('resume kaise banaye') ||
    lower.includes('resume tips') ||
    lower.includes('cv format') ||
    lower.includes('resume format') ||
    lower.includes('what to put on resume') ||
    lower.includes('resume me kya likhe') ||
    lower.includes('make resume')
  ) {
    return { type: 'RESUME_GUIDANCE', confidence: 0.92 };
  }

  // 10. Placement Guidance ("Placement kaise milega / Campus hiring")
  if (
    lower.includes('placement kaise') ||
    lower.includes('placement chahiye') ||
    lower.includes('how to get placement') ||
    lower.includes('campus placement') ||
    lower.includes('placement preparation') ||
    lower.includes('tata motors placement') ||
    lower.includes('placement drive') ||
    lower.includes('placement ka kya scene') ||
    lower.includes('job kaise milegi') ||
    lower.includes('naukri kaise milegi')
  ) {
    return { type: 'PLACEMENT_GUIDANCE', confidence: 0.92 };
  }

  // 11. Thermal Runaway & Battery Fire ("Battery blast kyu hoti hai / Thermal runaway")
  if (
    lower.includes('blast') ||
    lower.includes('thermal runaway') ||
    lower.includes('battery aag') ||
    lower.includes('catch fire') ||
    lower.includes('battery phat') ||
    lower.includes('overheat') ||
    lower.includes('fire in ev')
  ) {
    return { type: 'THERMAL_RUNAWAY_QUERY', confidence: 0.92 };
  }

  // 12. Cell Balancing specific
  if (
    lower.includes('cell balancing') ||
    lower.includes('active vs passive balancing') ||
    lower.includes('balancing algorithm') ||
    lower.includes('cell balance')
  ) {
    return { type: 'CELL_BALANCING_QUERY', confidence: 0.95 };
  }

  // 13. Battery Chemistry ("LFP vs NMC / Sodium ion")
  if (
    lower.includes('lfp') ||
    lower.includes('nmc') ||
    lower.includes('sodium ion') ||
    lower.includes('cell chemistry') ||
    lower.includes('battery chemistry') ||
    lower.includes('types of battery') ||
    lower.includes('types of ev battery')
  ) {
    return { type: 'BATTERY_CHEMISTRY_QUERY', confidence: 0.92 };
  }

  // 14. EV vs Petrol Comparison
  if (
    lower.includes('ev vs petrol') ||
    lower.includes('petrol vs ev') ||
    lower.includes('ev ke fayde') ||
    lower.includes('is ev better') ||
    lower.includes('electric car vs petrol') ||
    lower.includes('diesel vs ev')
  ) {
    return { type: 'EV_VS_PETROL_QUERY', confidence: 0.92 };
  }

  // 15. Charging Infrastructure & Fast Charging
  if (
    lower.includes('charging') ||
    lower.includes('fast charger') ||
    lower.includes('dc fast') ||
    lower.includes('ccs2') ||
    lower.includes('charge kaise') ||
    lower.includes('how to charge') ||
    lower.includes('charging time')
  ) {
    return { type: 'CHARGING_INFRA_QUERY', confidence: 0.9 };
  }

  // 16. Motor, Inverter & Powertrain
  if (
    lower.includes('inverter') ||
    lower.includes('traction motor') ||
    lower.includes('bldc') ||
    lower.includes('pmsm') ||
    lower.includes('motor controller') ||
    lower.includes('regenerative braking')
  ) {
    return { type: 'MOTOR_INVERTER_QUERY', confidence: 0.9 };
  }

  // 17. Coding in EV ("Coding sikhna jaruri hai kya")
  if (
    lower.includes('coding sikhna jaruri') ||
    lower.includes('is coding required') ||
    lower.includes('which coding language for ev') ||
    lower.includes('programming in ev') ||
    lower.includes('python in ev')
  ) {
    return { type: 'CODING_IN_EV_QUERY', confidence: 0.9 };
  }

  // 18. Jokes & Humor
  if (
    lower.includes('joke') ||
    lower.includes('funny') ||
    lower.includes('chutkula') ||
    lower.includes('hasao') ||
    lower.includes('laugh')
  ) {
    return { type: 'JOKE_QUERY', confidence: 0.95 };
  }

  // 19. Boredom & What's New ("Bore ho raha hu / Kuch naya batao")
  if (
    lower.includes('bore ho') ||
    lower.includes('kuch naya batao') ||
    lower.includes('something interesting') ||
    lower.includes("what's new") ||
    lower.includes('kuch naya') ||
    lower.includes('tell me a fact')
  ) {
    return { type: 'BOREDOM_NEWS_QUERY', confidence: 0.92 };
  }

  // 20. Motivation & Stress ("Tension ho rahi hai / Demotivated")
  if (
    lower.includes('tension') ||
    lower.includes('demotivated') ||
    lower.includes('stress') ||
    lower.includes('dar lag raha') ||
    lower.includes('motivation') ||
    lower.includes('depressed') ||
    lower.includes('himmat')
  ) {
    return { type: 'MOTIVATION_STRESS_QUERY', confidence: 0.92 };
  }

  // 21. Combined Background & Research Queries
  if (
    (lower.includes('background') && lower.includes('research')) ||
    lower === 'both' ||
    lower === 'both.' ||
    lower === 'both!' ||
    lower === 'both please' ||
    lower === 'tell me both' ||
    lower.includes('both background') ||
    lower.includes('both of them') ||
    lower === 'dono' ||
    lower === 'dono batao' ||
    lower === 'everything' ||
    lower === 'sab' ||
    lower === 'sab batao' ||
    lower === 'sab kuch batao'
  ) {
    return { type: 'BACKGROUND_AND_RESEARCH', confidence: 0.95 };
  }

  // 22. Background Queries
  if (
    lower.includes('background') ||
    lower.includes('your background') ||
    lower.includes('about your background') ||
    lower.includes('what is your background') ||
    lower.includes('tell me about your background') ||
    lower.includes('tell me your background') ||
    lower.includes('apna background') ||
    lower.includes('background kya hai') ||
    lower === 'background' ||
    lower === 'background?' ||
    lower.includes('educational background') ||
    lower.includes('academic background') ||
    lower.includes('study background')
  ) {
    return { type: 'BACKGROUND_QUERY', confidence: 0.95 };
  }

  // 23. Research Queries
  if (
    lower.includes('your research') ||
    lower.includes('what research') ||
    lower.includes('what is your research') ||
    lower.includes('tell me about your research') ||
    lower.includes('tell me your research') ||
    lower.includes('what are you researching') ||
    lower.includes('research topic') ||
    lower.includes('apna research') ||
    lower.includes('research ke bare me') ||
    lower.includes('research ke baare me') ||
    lower.includes('research batao') ||
    lower.includes('bms research') ||
    lower === 'research' ||
    lower === 'research?' ||
    lower.includes('cell balancing research')
  ) {
    return { type: 'RESEARCH_QUERY', confidence: 0.95 };
  }

  // 24. College / Institute Queries
  if (
    lower.includes('which college') ||
    lower.includes('what college') ||
    lower.includes('where do you study') ||
    lower.includes('where r u studying') ||
    lower.includes('where are you studying') ||
    lower.includes('your college') ||
    lower.includes('which institute') ||
    lower.includes('kaha padhte ho') ||
    lower.includes('kahan padhte ho') ||
    lower.includes('kaunsa college') ||
    lower.includes('kaun se college') ||
    lower.includes('which branch') ||
    lower.includes('which department') ||
    lower.includes('what is your branch') ||
    lower.includes('your branch') ||
    lower.includes('gp pune') ||
    lower.includes('polytechnic pune') ||
    lower.includes('about your college') ||
    lower === 'which college?' ||
    lower === 'college?'
  ) {
    return { type: 'COLLEGE_EDUCATION_QUERY', confidence: 0.92 };
  }

  // 25. Projects Queries
  if (
    lower.includes('your project') ||
    lower.includes('your projects') ||
    lower.includes('what project') ||
    lower.includes('what projects') ||
    lower.includes('what have you built') ||
    lower.includes('what did you build') ||
    lower.includes('tell me about your project') ||
    lower.includes('tell me your project') ||
    lower.includes('kya project') ||
    lower.includes('projects done') ||
    lower.includes('capstone project') ||
    lower === 'projects' ||
    lower === 'project' ||
    lower === 'projects?' ||
    lower === 'project?'
  ) {
    return { type: 'PROJECTS_QUERY', confidence: 0.92 };
  }

  // 26. Skills Queries
  if (
    lower.includes('your skill') ||
    lower.includes('your skills') ||
    lower.includes('what skills') ||
    lower.includes('what are your skills') ||
    lower.includes('skills kya hai') ||
    lower.includes('what do you know') ||
    lower.includes('tech stack') ||
    lower.includes('technical skills') ||
    lower.includes('tools you use') ||
    lower === 'skills' ||
    lower === 'skills?'
  ) {
    return { type: 'SKILLS_QUERY', confidence: 0.92 };
  }

  // 27. Location Queries
  if (
    lower.includes('where are you from') ||
    lower.includes('where r u from') ||
    lower.includes('where do you live') ||
    lower.includes('where are you located') ||
    lower.includes('kaha se ho') ||
    lower.includes('kahan se ho') ||
    lower.includes('kaha rehte ho') ||
    lower.includes('kahan rehte ho') ||
    lower.includes('your location') ||
    lower.includes('which city') ||
    lower.includes('apka location')
  ) {
    return { type: 'LOCATION_QUERY', confidence: 0.92 };
  }

  // 28. Current Activity ("What are you doing?")
  if (
    lower.includes('what are you doing') ||
    lower.includes('what r u doing') ||
    lower.includes('kya kar rahe ho') ||
    lower.includes('kya kar rahi ho') ||
    lower.includes('what are you working on') ||
    lower.includes('currently doing') ||
    lower.includes('kya chal raha hai') ||
    lower.includes('what are you up to')
  ) {
    return { type: 'WHAT_ARE_YOU_DOING_QUERY', confidence: 0.9 };
  }

  // 29. Personal Introduction ("Who are you")
  if (
    lower.includes('know you personally') ||
    lower.includes('know more about you') ||
    lower.includes('who are you') ||
    lower.includes('who r u') ||
    lower.includes('who r you') ||
    lower.includes('tum kon ho') ||
    lower.includes('tum kaun ho') ||
    lower.includes('kaun ho tum') ||
    lower.includes('aap kaun ho') ||
    lower.includes('aap kon ho') ||
    lower.includes('apne baare me') ||
    lower.includes('apne bare me') ||
    lower.includes('janna chahta hu') ||
    lower.includes('janna chahti hu') ||
    lower.includes('tell me about yourself') ||
    lower.includes('introduce yourself') ||
    lower.includes('what do you do') ||
    lower === 'about you'
  ) {
    return { type: 'PERSONAL_INTRO', confidence: 0.95 };
  }

  // 30. BMS specific queries
  if (
    lower.includes('what is bms') ||
    lower.includes('bms testing') ||
    lower.includes('bms kya hai') ||
    lower.includes('bms kya hota hai') ||
    lower.includes('battery management system') ||
    lower.includes('learn bms')
  ) {
    return { type: 'BMS_QUERY', confidence: 0.9 };
  }

  // 31. EV Safety Standards
  if (lower.includes('ais-038') || lower.includes('ais-156') || lower.includes('safety standards') || lower.includes('arai')) {
    return { type: 'SAFETY_STANDARDS_QUERY', confidence: 0.92 };
  }

  // 32. Internship Queries
  if (
    lower.includes('intern') ||
    lower.includes('job opening') ||
    lower.includes('openings in pune') ||
    lower.includes('vacancy') ||
    lower.includes('hire') ||
    lower.includes('naukri') ||
    lower.includes('job chahiye') ||
    lower.includes('internship chahiye')
  ) {
    return { type: 'INTERNSHIP_QUERY', confidence: 0.85 };
  }

  // 33. Course / Syllabus Queries
  if (
    lower.includes('course') ||
    lower.includes('syllabus') ||
    lower.includes('ae-ev-302') ||
    lower.includes('msbte course') ||
    lower.includes('certif')
  ) {
    return { type: 'COURSE_SYLLABUS_QUERY', confidence: 0.85 };
  }

  // 34. Curriculum Gap Analysis
  if (
    lower.includes('curriculum gap') ||
    lower.includes('skill gap analysis') ||
    lower.includes('gap analysis') ||
    lower.includes('gap score')
  ) {
    return { type: 'CURRICULUM_GAP_QUERY', confidence: 0.9 };
  }

  // 35. Jobzy Platform Queries
  if (
    lower.includes('what is jobzy') ||
    lower.includes('about jobzy') ||
    lower.includes('jobzy kya hai') ||
    lower.includes('how does jobzy work') ||
    lower.includes('features of jobzy') ||
    lower.includes('tell me about jobzy')
  ) {
    return { type: 'JOBZY_PLATFORM_QUERY', confidence: 0.92 };
  }

  // 36. District Intelligence
  if (
    lower.includes('district intelligence') ||
    lower.includes('highest demand') ||
    lower.includes('which district') ||
    lower.includes('demand in pune') ||
    lower.includes('ev demand in maharashtra')
  ) {
    return { type: 'DISTRICT_INTELLIGENCE_QUERY', confidence: 0.9 };
  }

  // 37. State Policy
  if (lower.includes('ev policy') || lower.includes('policy 2026') || lower.includes('dte initiative')) {
    return { type: 'STATE_POLICY_QUERY', confidence: 0.9 };
  }

  // 38. Greetings
  if (
    lower === 'hi' ||
    lower === 'hello' ||
    lower === 'hey' ||
    lower === 'namaste' ||
    lower === 'pranam' ||
    lower.includes('kaise ho') ||
    lower.includes('kese ho') ||
    lower.includes('kya haal') ||
    lower.includes('sab theek') ||
    lower.includes('whatsup') ||
    lower.includes("what's up") ||
    lower.includes('how are you') ||
    lower.includes('how r u') ||
    lower.startsWith('hi ') ||
    lower.startsWith('hello ') ||
    lower.startsWith('good morning') ||
    lower.startsWith('good afternoon') ||
    lower.startsWith('good evening')
  ) {
    return { type: 'GREETING', confidence: 0.9 };
  }

  // 39. Polite Closing / Thanks
  if (
    lower.includes('thank') ||
    lower.includes('thx') ||
    lower.includes('dhanyawad') ||
    lower.includes('shukriya') ||
    lower === 'thanks' ||
    lower === 'bye' ||
    lower === 'goodbye' ||
    lower === 'alvida'
  ) {
    return { type: 'POLITE_CLOSING', confidence: 0.9 };
  }

  // 40. Follow-Up Expressions
  if (
    lower === 'tell me more' ||
    lower.includes('tell me more about') ||
    lower === 'explain' ||
    lower === 'explain further' ||
    lower.includes('aur batao') ||
    lower.includes('or batao') ||
    lower.includes('aage batao') ||
    lower === 'why?' ||
    lower === 'how?' ||
    lower === 'more details'
  ) {
    return { type: 'FOLLOW_UP', confidence: 0.9 };
  }

  // 41. Coding
  if (
    lower.includes('binary search') ||
    lower.includes('python code') ||
    lower.includes('javascript') ||
    lower.includes('write code') ||
    lower.includes('arduino code')
  ) {
    return { type: 'GENERAL_CODING', confidence: 0.85 };
  }

  return { type: 'GENERAL_CHAT', confidence: 0.5 };
}

/**
 * Generates an intelligent, context-aware reply matching the persona,
 * language (Hinglish / English), and user's specific query.
 */
export function generateLocalContextualAIResponse(params: {
  currentUser: { id: string; name: string; role?: string; district?: string };
  stakeholder: StakeholderPersona;
  conversationHistory: ChatMessage[];
  latestMessage: string;
}): string {
  const { currentUser, stakeholder, conversationHistory, latestMessage } = params;
  const memory = extractSessionMemory(conversationHistory, currentUser);
  const intent = detectIntent(latestMessage, conversationHistory, memory, currentUser);
  const role = stakeholder.role;
  const isHindi = isHindiOrHinglish(latestMessage);
  const lower = latestMessage.toLowerCase().trim();

  // -------------------------------------------------------------
  // 0. User desires accurate replies: "m ye chata ki har message ka sahi reply mile"
  // -------------------------------------------------------------
  if (intent.type === 'CHAT_QUALITY_DESIRE') {
    if (isHindi) {
      return `Main bilkul samajh sakti hoon! Ab Jobzy Assistant ko poori tarah smart aur context-aware bana diya gaya hai.

Chahe aap technical sawaal (BMS, battery chemistry, motor, charging infra), career & placement advice (Tata Motors recruitment, interview questions, resume tips, salary packages), study roadmaps, ya normal baat-cheet karein—ab aapko har ek message ka direct, accurate aur factual reply milega.

Aap koi bhi question pooch kar test kar sakte hain! Abhi aap kis baare me jaanna chahte hain?`;
    }
    return `I completely understand! Jobzy Assistant is now equipped with end-to-end contextual intelligence.

Whether you ask about technical topics (BMS, battery chemistry, traction inverters, fast charging), career & placements (Tata Motors recruitment, interview prep, salary expectations, resumes), or casual conversation—you will receive direct, accurate, and meaningful replies.

Feel free to test with any question you'd like!`;
  }

  // -------------------------------------------------------------
  // 1. Session Memory: User Stating Name: "My name is Aarav"
  // -------------------------------------------------------------
  if (intent.type === 'NAME_STATEMENT') {
    const nameMatch = latestMessage.match(/(?:my name is|call me|name's|mera naam)\s+([A-Za-z]+(?:\s+[A-Za-z]+)?)/i);
    const statedName = nameMatch ? nameMatch[1].trim() : memory.name || 'there';
    if (isHindi) {
      return `Aapse milkar bahut khushi hui, ${statedName}! Maine aapka naam session memory me note kar liya hai. Aaj main aapki EV coursework, placement ya kisi technical project me kaise madad kar sakti hoon?`;
    }
    return `Nice to meet you, ${statedName}! I've noted your name in our session memory. What can I help you with today regarding your EV coursework, skills, or career goals?`;
  }

  // -------------------------------------------------------------
  // 2. Session Memory Queries: "What did I tell you my name was?"
  // -------------------------------------------------------------
  if (intent.type === 'MEMORY_QUERY') {
    const rememberedName = memory.name || currentUser.name;
    if (isHindi) {
      if (rememberedName) {
        return `Aapne mujhe bataya tha ki aapka naam ${rememberedName} hai! ${
          memory.college ? `Aur aap ${memory.college} me padhte hain.` : ''
        } Main aage aapki kya madad kar sakti hoon?`;
      }
      return `Aapka platform profile ${currentUser.name} ke naam se registered hai. Agar aapne pehle koi aur naam bataya tha, toh aap mujhe dobara bata sakte hain!`;
    }
    if (rememberedName) {
      return `You told me your name is ${rememberedName}! ${
        memory.college ? `You also mentioned you study at ${memory.college}.` : ''
      }How can I assist you further?`;
    }
    return `You're signed in as ${currentUser.name}. If you shared another preferred name earlier, feel free to remind me!`;
  }

  // -------------------------------------------------------------
  // 3. AI Identity: "Are you an AI / Kya tum AI ho?"
  // -------------------------------------------------------------
  if (intent.type === 'AI_IDENTITY_QUERY') {
    if (isHindi) {
      return `Haan! Main Jobzy platform par Priya Sharma ka AI Digital Twin mentor hoon.

Main Government Polytechnic Pune ke Mechatronics research aur EV technologies ke factual data par train hoon taaki Maharashtra ke students ko real technical guidance, placement tips aur peer mentorship mil sake. Tum mujhse bina kisi jhijhak ke technical sawaal ya career advice pooch sakte ho!`;
    }
    return `Yes! On Jobzy, I represent Priya Sharma's AI digital twin and peer mentor persona. I'm modeled after her actual academic research in Mechatronics and EV Battery Management at Government Polytechnic Pune to provide students with authentic technical guidance, project support, and interview preparation. Feel free to ask me anything!`;
  }

  // -------------------------------------------------------------
  // 4. Friendship: "Can we be friends / Tum meri dost banogi?"
  // -------------------------------------------------------------
  if (intent.type === 'FRIENDSHIP_QUERY') {
    if (isHindi) {
      return `Bilkul, kyun nahi! Jobzy par hum sab ek community ki tarah hain. Ek fellow student aur tech enthusiast ke naate main hamesha tumhari dost aur mentor rahungi—chahe projects discuss karne hon, exam/placement ki tension ho, ya koi technical doubt ho.

Batao, aaj kya chal raha hai tumhari padhai me?`;
    }
    return `Absolutely, I'd love that! As fellow learners and tech enthusiasts on Jobzy, collaborating and supporting each other is what makes engineering exciting. Whether you want to discuss project ideas, prep for placement interviews, or just brainstorm solutions, I'm here for you! What are you working on today?`;
  }

  // -------------------------------------------------------------
  // 5. Capabilities: "What can you do / Aap kya kya kar sakti ho?"
  // -------------------------------------------------------------
  if (intent.type === 'CAPABILITIES_QUERY') {
    if (isHindi) {
      return `Jobzy par main tumhari in sabhi cheezon me madad kar sakti hoon:
1. **EV & BMS Technical Concepts:** Cell balancing, battery diagnostics, thermal runaway, motor controllers aur AIS-038 safety standards samjhana.
2. **Placements & Internships:** Tata Motors, Bajaj Auto me apprentice jobs, salary packages, expected interview questions aur resume formatting tips.
3. **Projects & Coding:** MATLAB/Simulink simulations, Arduino/ESP32 circuits, aur Python battery telemetry codes me guidance.
4. **Academics & MSBTE:** Polytechnic syllabus modules, lab practicals aur skill gap analysis clear karna.
5. **General Chat & Motivation:** Study tips, motivation aur technical discussions.

Batao, abhi kis cheez me help chahiye?`;
    }
    return `Here is what I can help you with on Jobzy:
1. **EV & Battery Management Systems (BMS):** Cell-balancing algorithms, State of Charge (SoC), thermal runaway protection, and AIS-038 safety norms.
2. **Placements & Internships:** Tata Motors & Bajaj Auto apprentice recruitment, expected salaries, interview questions, and resume optimization.
3. **Projects & Code:** MATLAB/Simulink modeling, Arduino/ESP32 hardware circuits, and Python data logging.
4. **Academics:** MSBTE curriculum modules, lab practical test benches, and skill gap scores.
5. **Career Guidance:** Study motivation, career roadmap planning, and technical problem-solving.

What would you like to explore right now?`;
  }

  // -------------------------------------------------------------
  // 6. Placement Guidance: "Placement kaise milega / How to get placed"
  // -------------------------------------------------------------
  if (intent.type === 'PLACEMENT_GUIDANCE') {
    if (isHindi) {
      return `Jobzy par EV aur Core Engineering placement ke liye yeh 3-step strategy follow karo:

1. **Step 3 BMS & High-Voltage Roadmap:** Jobzy ke verified learning roadmap se BMS, CAN Bus aur AIS-038 complete karke verified badge earn karo—recruiter filters me tumhara profile top par aayega.
2. **Hands-on Lab Project:** Apne resume me ek solid project add karo (jaise 48V battery pack prototype ya MATLAB simulation). Tata Motors ke interviewers theory se jyada practical test bench experience dekhte hain.
3. **Direct Application:** Jobzy ke **Industry Hub** tab me Tata Motors aur Bajaj Auto ke live apprentice openings par direct apply karo.

Kya tumne apna resume ya project ready kar liya hai?`;
    }
    return `To secure a core EV placement in Maharashtra, follow this proven 3-step strategy:
1. **Complete Step 3 Roadmap on Jobzy:** Earn verified credentials in BMS calibration, CAN bus diagnostics, and AIS-038 high-voltage safety.
2. **Showcase a Concrete Practical Project:** Recruiters at Tata Motors, Bajaj, and KPIT prioritize candidates with real lab test bench or MATLAB simulation experience over generic textbook theory.
3. **Direct Application via Industry Hub:** Apply directly through the Industry Hub tab where shortlisted candidates get fast-track interview scheduling.

Would you like tips on drafting an EV-focused resume or reviewing sample interview questions?`;
  }

  // -------------------------------------------------------------
  // 7. Salary & Package Queries: "Salary kitni milti hai / Package"
  // -------------------------------------------------------------
  if (intent.type === 'SALARY_PACKAGE_QUERY') {
    if (isHindi) {
      return `Maharashtra EV sector me typical salary & stipend packages iss tarah hain:

- **Diploma Apprentice / Trainee (TAT):** ₹18,000 se ₹25,000 per month (Tata Motors Pimpri, Bajaj Chakan).
- **Graduate Engineer Trainee (GET):** ₹3.5 Lakh se ₹5.5 Lakh per annum.
- **BMS & Powertrain Diagnostic Specialist (2-3 saal experience):** ₹7 Lakh se ₹12+ Lakh per annum.
- **EV R&D / Embedded Systems Engineer:** ₹8 Lakh se ₹15+ Lakh per annum.

Agar tumhare paas AIS-038 certification aur hands-on CAN diagnostic skills hain, toh initial package aur hiring speed dono kaafi fast hoti hai! Kon si specific role tum target kar rahe ho?`;
    }
    return `Here is the current salary & compensation breakdown in Maharashtra's EV sector:
- **Diploma Apprentice Trainee (TAT):** ₹18,000 to ₹25,000/month stipend during apprentice training at hubs like Tata Motors (Pimpri) and Bajaj (Chakan).
- **Graduate Engineer Trainee (GET):** ₹3.5 LPA to ₹5.5 LPA for entry-level degree engineers.
- **BMS Diagnostic & Calibration Specialist:** ₹7 LPA to ₹12+ LPA with 2-3 years hands-on experience.
- **EV Powertrain & Firmware Engineer:** ₹8 LPA to ₹16 LPA.

Having verified AIS-038 certification and CAN bus diagnostic experience significantly increases entry-level offers!`;
  }

  // -------------------------------------------------------------
  // 8. Interview Preparation Queries: "Interview me kya puchte hai"
  // -------------------------------------------------------------
  if (intent.type === 'INTERVIEW_PREP_QUERY') {
    if (isHindi) {
      return `Tata Motors aur EV manufacturing interviews me sabse jyada yeh 5 technical sawaal pooche jaate hain:

1. **LFP vs NMC Chemistry:** Dono me kya antar hai? (LFP safe hai aur 2000+ cycles deta hai; NMC me energy density jyada hoti hai par liquid cooling mandatory hai).
2. **Cell Balancing:** Active aur Passive balancing me kya fark hai? (Passive balancing resistor se heat release karta hai; Active balancing charge shuttling se energy conserve karta hai).
3. **AIS-038 Norms:** High-voltage safety me Insulation Monitoring Device (IMD) kaise kaam karta hai?
4. **CAN Bus Protocol:** Differential signal (CAN_H, CAN_L) aur 120-ohm termination resistor ka kya role hai?
5. **Thermal Runaway:** Cell temperature 55°C cross karne par BMS cutoff sequence kya hota hai?

Kya tum inme se kisi sawaal ka detailed answer samajhna chahte ho?`;
    }
    return `Here are the top 5 technical interview questions frequently asked by EV recruiters (Tata Motors, Bajaj, KPIT):
1. **LFP vs. NMC Chemistry:** Compare thermal stability, energy density, cycle life, and cost trade-offs.
2. **Cell Balancing Architecture:** Differentiate between passive resistive dissipation and active capacitive/inductive charge shuttling.
3. **Safety Compliance (AIS-038 Rev 2):** How does high-voltage isolation monitoring detect chassis leakage in a 350V+ pack?
4. **CAN Bus Protocol:** Explain differential voltage signaling, arbitration IDs, and the purpose of 120Ω termination resistors.
5. **Thermal Runaway Mitigation:** What firmware logic triggers contactor separation during abnormal dT/dt temperature spikes?

Would you like to review sample answers for any of these?`;
  }

  // -------------------------------------------------------------
  // 9. Resume & CV Guidance: "Resume kaise banaye"
  // -------------------------------------------------------------
  if (intent.type === 'RESUME_GUIDANCE') {
    if (isHindi) {
      return `Ek strong EV Engineer resume banane ke liye yeh tips follow karo:

1. **Headline:** Simple 'Fresher' likhne ke bajaye likho: *"Diploma Mechatronics | EV Battery & BMS Diagnostics Specialist | AIS-038 Verified"*.
2. **Key Technical Skills Section:** BMS Calibration, Cell Balancing, MATLAB/Simulink, CAN Bus Analyzer, High-Voltage PPE, Python Data Logging.
3. **Concrete Projects:** Har project me measurable result likho. Jaise: *"Designed 48V 16S LiFePO4 BMS prototype with ESP32 telemetry, achieving 38% faster cell balancing via active capacitive shuttling."*
4. **Certifications:** Jobzy Step 3 Badge, MSBTE AE-EV-302, ARAI EV Workshop.

Kya tum chahte ho ki main tumhare resume ke points review karoon?`;
    }
    return `Here are key recommendations to make your EV engineering resume stand out:
1. **Targeted Headline:** Instead of generic 'Fresher', use: *"Mechatronics Engineer | EV Battery & BMS Diagnostics | AIS-038 Certified"*.
2. **Core Competencies:** Explicitly list BMS Calibration, High-Voltage Safety PPE, CAN Protocol, MATLAB/Simulink, and LTspice.
3. **Project Impact Bullets:** Frame projects with quantitative outcomes: *"Simulated switched-capacitor active balancing circuit in MATLAB, reducing cell balancing duration by 38%."*
4. **Recognized Credentials:** Include MSBTE Course AE-EV-302 and your Jobzy verified badge.`;
  }

  // -------------------------------------------------------------
  // 10. Thermal Runaway & Battery Fire: "Battery blast kyu hoti hai"
  // -------------------------------------------------------------
  if (intent.type === 'THERMAL_RUNAWAY_QUERY') {
    if (isHindi) {
      return `EV battery me blast ya aag lagne ki main wajah **Thermal Runaway** hoti hai:

1. **Internal Short Circuit:** Manufacturing defect ya physical impact se cell ke andar ka separator phat jaata hai, jisse cathode aur anode direct touch ho jaate hain.
2. **Over-charging / Over-voltage:** Agar BMS cut-off fail ho jaye aur charging continue rahe, toh cell temperature 60°C+ cross kar jaata hai.
3. **Oxygen Release & Fire:** Cathode structure collapse hokar oxygen release karta hai jo flammable organic electrolyte ke sath milkar self-sustaining aag banati hai.

Isi liye ARAI ke **AIS-038 Rev 2** standards me dual thermal cutoff sensors, cell-to-cell fire barriers, aur IP67 sealed casing mandatory ki gayi hai.

Kya tum BMS ke safety cutoff circuits ke baare me aur jaanna chahte ho?`;
    }
    return `**Thermal Runaway** is the primary mechanism behind EV battery pack fires:
1. **Trigger Phase:** Internal mechanical puncture, dendrite growth, or over-charging heats an individual cell beyond its safe threshold (~60°C).
2. **Separator Breakdown:** The polyethylene/polypropylene separator melts, causing a direct internal short circuit between cathode and anode.
3. **Exothermic Cascade:** At elevated temperatures, the cathode material releases oxygen, which ignites the flammable organic electrolyte in a self-accelerating reaction.
4. **Mitigation via AIS-038:** Modern standards mandate automated contactor separation within 50ms, intumescent fire barriers between cells, and bidirectional pressure relief valves.`;
  }

  // -------------------------------------------------------------
  // 11. Cell Balancing: "Cell balancing kya hai"
  // -------------------------------------------------------------
  if (intent.type === 'CELL_BALANCING_QUERY') {
    if (isHindi) {
      return `**Cell Balancing** EV battery pack ki sabse important function hai:

1. **Kyu Jaruri Hai?** Ek 48V pack me 16 cells series me lage hote hain. Manufacturing tolerance ki wajah se sabhi cells ki capacity thodi alag hoti hai. Agar balancing na ho, toh sabse kamzor cell pehle discharge hokar pure pack ko shutdown kar dega.
2. **Passive Balancing:** Jyada charge wale cell se resistor ke through extra energy heat banakar discharge ki jaati hai (Sasta aur simple, par energy waste hoti hai).
3. **Active Balancing:** Switched capacitor ya inductor use karke high-voltage cell se low-voltage cell me charge transfer kiya jaata hai (Energy efficient aur 38% faster).

Kya tum active balancing ka MATLAB simulation circuit dekhna chahte ho?`;
    }
    return `**Cell Balancing** is essential to maximize the usable capacity and lifespan of multi-cell battery packs:
- **Why it matters:** Manufacturing variations cause cells in a series string to drift in State of Charge (SoC). Without balancing, the weakest cell limits both charging cutoff and discharge depth.
- **Passive Balancing:** Bleeds excess energy from higher-voltage cells through shunt resistors as heat. Simple and low-cost, but generates heat and wastes energy.
- **Active Balancing:** Shuttles charge from high-voltage cells to low-voltage cells using capacitive or inductive charge pumps, cutting equalization time by ~38% with zero thermal waste.`;
  }

  // -------------------------------------------------------------
  // 12. Battery Chemistry: "LFP vs NMC"
  // -------------------------------------------------------------
  if (intent.type === 'BATTERY_CHEMISTRY_QUERY') {
    if (isHindi) {
      return `Electric Vehicles me predominantly 2 tarah ki Lithium-ion chemistries use hoti hain:

1. **LFP (Lithium Iron Phosphate - LiFePO4):**
   - **Fayde:** Kaafi safe (thermal runaway temperature 270°C+), 2,500+ charge cycles, sasti cost.
   - **Kaha use hoti hai:** Tata Nexon EV, commercial delivery 2W/3W, Indian hot climate me ideal.
2. **NMC (Nickel Manganese Cobalt):**
   - **Fayde:** High energy density (lightweight aur lambi range per kg).
   - **Nuksan:** Thermal runaway 150°C-210°C par ho sakta hai, expensive cobalt use hota hai, active liquid cooling jaruri hai.

Ab India me **Sodium-ion batteries** par bhi fast kaam chal raha hai jo aur bhi sasti aur cold/hot climate me stable hain!`;
    }
    return `Here is a side-by-side comparison of leading EV battery chemistries:
- **LFP (Lithium Iron Phosphate):**
  - High thermal decomposition threshold (~270°C), making it virtually immune to thermal runaway in normal operation.
  - Cycle life: 2,000 to 3,000+ cycles. Lower cost, perfectly suited for Indian ambient operating temperatures (used in Tata Nexon EV, Tiago EV).
- **NMC (Nickel Manganese Cobalt):**
  - Significantly higher gravimetric energy density (200-250 Wh/kg vs 140-170 Wh/kg for LFP), offering greater driving range per unit weight.
  - Lower thermal threshold (~210°C), requiring advanced active liquid cooling plates.`;
  }

  // -------------------------------------------------------------
  // 13. EV vs Petrol: "EV vs Petrol car"
  // -------------------------------------------------------------
  if (intent.type === 'EV_VS_PETROL_QUERY') {
    if (isHindi) {
      return `EV aur Petrol car me mukhya antar:

1. **Running Cost:**
   - Petrol: ₹8 - ₹10 per kilometer.
   - EV: Sirf ₹1.00 - ₹1.50 per kilometer (Ghar par charge karne par).
2. **Maintenance:** Petrol engine me 2,000+ moving parts hote hain (engine oil, spark plug, clutch, filters). EV me sirf motor, battery aur inverter hote hain—maintenance 70% kam hota hai.
3. **Driving Experience:** EV me instant torque (zero lag) milta hai aur bilkul silent drive hoti hai.
4. **Challenges:** EV ki upfront purchasing cost jyada hai aur public fast charging stations abhi expand ho rahe hain.

Long term me 5 saal ke andar EV petrol car se ₹4-5 Lakh bacha leti hai!`;
    }
    return `Comparing Electric Vehicles vs. Internal Combustion (Petrol/Diesel) Vehicles:
- **Operating Cost:** EVs cost ₹1.00-₹1.50 per km when charged at domestic tariffs, compared to ₹8.00-₹10.00 per km for petrol.
- **Powertrain Simplicity:** ICE vehicles contain over 2,000 moving parts requiring frequent fluid and wear replacements; EV electric drive units contain under 20 moving parts.
- **Performance:** EVs deliver 100% instant torque at 0 RPM with regenerative braking that preserves brake pads.
- **Considerations:** Higher initial sticker price and evolving highway fast-charging infrastructure.`;
  }

  // -------------------------------------------------------------
  // 14. Charging Infrastructure: "AC vs DC Fast Charging"
  // -------------------------------------------------------------
  if (intent.type === 'CHARGING_INFRA_QUERY') {
    if (isHindi) {
      return `EV Charging do mukhya tariko se hoti hai:

1. **AC Slow / Home Charging (Type 2):**
   - Ghar ya office me AC current battery me direct nahi ja sakta, isliye car ke andar laga **Onboard Charger (OBC)** AC ko DC me convert karta hai (3.3 kW se 7.4 kW).
   - Time: 6 se 8 ghante. Battery health ke liye sabse best hota hai.
2. **DC Fast Charging (CCS2 / CHAdeMO):**
   - High-power charger direct direct-current (30 kW se 150 kW) battery pack me bhejta hai, onboard charger ko bypass karke.
   - Time: 40 se 50 minute me 10% se 80%.
   - Note: Roz fast charging karne se battery temperature high rehta hai, isliye 80% ke baad charging speed automatically slow ho jaati hai.`;
    }
    return `Understanding EV Charging Architectures:
- **AC Level 2 Charging (Type 2):** Supplies alternating current (3.3kW to 22kW). The vehicle's internal Onboard Charger (OBC) rectifies AC to DC. Best for overnight charging and battery longevity (6-8 hours).
- **DC Fast Charging (CCS2 Protocol):** External charging station supplies direct current directly to the battery pack at 30kW to 150kW+, bypassing the vehicle's onboard converter (10% to 80% in 45 minutes).
- **Tapering Curve:** To prevent lithium plating and thermal stress, BMS firmware throttles charging rates after 80% State of Charge (SoC).`;
  }

  // -------------------------------------------------------------
  // 15. Motor & Inverter: "EV motor kya hota hai"
  // -------------------------------------------------------------
  if (intent.type === 'MOTOR_INVERTER_QUERY') {
    if (isHindi) {
      return `EV Powertrain me Motor aur Inverter ka role:

1. **Inverter (Traction Inverter):** Battery DC current deti hai, par high-torque EV motor AC current par chalti hai. Inverter Silicon Carbide (SiC) MOSFET switches use karke high-speed Pulse Width Modulation (PWM) se DC ko 3-Phase AC me convert karta hai.
2. **PMSM Motor (Permanent Magnet Synchronous Motor):** Indian commercial aur passenger EVs (Tata Nexon, Ather) me 95% efficiency ke sath PMSM motor use hoti hai.
3. **Regenerative Braking:** Jab driver accelerator chhodta hai ya brake lagata hai, motor generator ban jaati hai aur kinetic energy ko wapas DC battery me charge kar deti hai!`;
    }
    return `In an EV powertrain, the **Inverter and Traction Motor** form the electro-mechanical drive:
- **Traction Inverter:** Utilizes high-frequency Silicon Carbide (SiC) MOSFETs or IGBTs with Pulse Width Modulation (PWM) to convert DC battery voltage into variable-frequency 3-phase AC power.
- **PMSM Traction Motor:** Permanent Magnet Synchronous Motors provide peak efficiency (>95%) and high power density across urban drive cycles.
- **Regenerative Braking:** During deceleration, the inverter operates in reverse rectification mode, converting rotational inertia into DC electrical energy returned to the battery pack.`;
  }

  // -------------------------------------------------------------
  // 16. Coding in EV: "Coding sikhna jaruri hai kya"
  // -------------------------------------------------------------
  if (intent.type === 'CODING_IN_EV_QUERY') {
    if (isHindi) {
      return `Haan! Modern EV ek 'Computer on Wheels' hai, isliye coding bahut jaruri hai:

1. **Embedded C / C++:** BMS microcontrollers (STM32, ESP32, NXP) me cell balancing, over-voltage protection aur CAN bus messaging likhne ke liye.
2. **Python:** Battery test telemetry data analyse karne, SoC estimation aur failure prediction ke liye.
3. **MATLAB / Simulink:** Powertrain simulation, motor control algorithms aur Model-Based Design (MBD) ke liye.

Agar tum Diploma Mechatronics ya Electrical me ho, toh basics of Embedded C aur Python sikhne se tumhara placement package 40-50% badh jaata hai!`;
    }
    return `Yes, software and firmware are central to electric mobility engineering:
- **Embedded C / C++:** The industry standard for BMS microcontrollers, motor controller gate-driver loops, and CAN/UDS diagnostics.
- **MATLAB / Simulink:** Essential for Model-Based Design (MBD) and rapid prototyping of battery thermal and torque management.
- **Python:** Widely used in EV testing labs for automated telemetry parsing, battery degradation forecasting, and CAN message logging.`;
  }

  // -------------------------------------------------------------
  // 17. Jokes & Humor: "Tell me a joke"
  // -------------------------------------------------------------
  if (intent.type === 'JOKE_QUERY') {
    if (isHindi) {
      return `Ek technical joke suno 😄:

Ek Petrol car ne Electric car se pucha: *"Tumhe kabhi petrol pump ki yaad nahi aati?"*
EV ne smile karke bola: *"Bhai, jab mera plug seedha socket me lagta hai aur mera fuel bill ₹1/km hota hai, toh mujhe petrol pump nahi... petrol pump waalo par taras aata hai!"* ⚡🚗

Umeed hai pasand aaya! Ab batao, kya seekhna hai?`;
    }
    return `Here's an engineering joke for you 😄:

Why did the electric vehicle break up with the petrol car?
... Because there was no spark between them, and the petrol car had way too much exhaust-ive baggage! ⚡🔋

Hope that brought a smile! What technical or career topic would you like to tackle next?`;
  }

  // -------------------------------------------------------------
  // 18. Boredom & What's New: "Kuch naya batao / Bore ho raha hu"
  // -------------------------------------------------------------
  if (intent.type === 'BOREDOM_NEWS_QUERY') {
    if (isHindi) {
      return `Ek exciting industry insight suno:

Maharashtra ke Pune-Chakan industrial belt me ab **Sodium-ion Battery** aur **solid-state cell testing** ki research shuru ho chuki hai!
Kyunki Sodium aasaani se milta hai aur Lithium se 40% sasta hai, aane wale 3 saalon me commercial 2-wheelers aur 3-wheelers me Sodium-ion batteries aayengi.

Iska matlab BMS calibration aur high-voltage technicians ki demand Maharashtra me 2x hone wali hai! Agar tumne Jobzy par Step 3 BMS roadmap complete kar liya, toh aane wale placements me top priority mil sakti hai.`;
    }
    return `Here is a fascinating technical update from the EV industry:
Research labs across Maharashtra are actively testing **Sodium-ion (Na-ion) cell packs** as a viable low-cost alternative to Lithium. Sodium-ion operates efficiently down to -20°C and charges to 80% in just 15 minutes, with zero thermal runaway risk during complete zero-volt discharge for transport.

This shift will require adaptive BMS firmware algorithms that can handle different electrochemical discharge curves—a great niche to focus your capstone project on!`;
  }

  // -------------------------------------------------------------
  // 19. Motivation & Stress: "Tension ho rahi hai / Demotivated"
  // -------------------------------------------------------------
  if (intent.type === 'MOTIVATION_STRESS_QUERY') {
    if (isHindi) {
      return `Bilkul pareshan mat ho! Engineering aur diploma me exams aur placement ko lekar tension hona natural hai.

Hamesha yaad rakho: **Industry ko perfect topper nahi, practical problem-solver chahiye.**
Agar tum roz sirf 45 minute practical concepts (jaise BMS circuits, CAN bus wiring ya MATLAB) par dhyan doge, toh 30 din me tumhara confidence aur technical edge 90% students se aage hoga.

Main tumhare sath Jobzy par hamesha hoon. Shuruaat ek chote step se karo. Aaj kaunsa chota topic clear karein?`;
    }
    return `Take a deep breath! Engineering coursework and placement preparation can feel overwhelming at times, but remember:
Recruiters at top automotive companies don't look for flawless textbook memory—they look for students who are curious, practical, and willing to solve real problems on a test bench.

Focusing on one practical skill each week (like mastering cell-balancing algorithms or reading CAN telemetry) builds rapid momentum. What is one specific topic giving you stress that we can demystify together right now?`;
  }

  // -------------------------------------------------------------
  // 20. Background Queries: "What is your background?"
  // -------------------------------------------------------------
  if (intent.type === 'BACKGROUND_QUERY') {
    if (role === 'STUDENT') {
      if (isHindi) {
        return `Main Government Polytechnic Pune me Mechatronics Engineering ki final-year Diploma student hoon (MSBTE affiliated).

Pichle do saalo me maine High-Voltage Battery Management Systems (BMS), cell balancing simulation aur AIS-038 automotive safety standards par specialized research aur lab practicals kiye hain. Jobzy par main fellow students ko verified roadmaps aur placement preparation me guide karti hoon, aur abhi Tata Motors EV campus drive ki taiyari kar rahi hoon.

Kya tum mere BMS research projects ya Tata Motors placement preparation ke baare me detail me jaanna chahte ho?`;
      }
      return `I am a final-year Diploma student in Mechatronics Engineering at Government Polytechnic Pune, affiliated with MSBTE. My academic background blends embedded systems, power electronics, and automotive control networks.

Over the past two years, I've specialized in high-voltage EV battery architectures, thermal simulation, and state estimation (SoC/SoH). In our college lab, I lead our student research group on high-voltage battery safety, and on Jobzy I actively mentor peers preparing for industry certifications like AIS-038.

Would you like to know more about the specific BMS research projects I've built, or how I'm preparing for the upcoming Tata Motors placement drive?`;
    }
    if (role === 'INDUSTRY') {
      return `I lead technical recruitment and campus engagement at the Tata Motors Passenger Vehicles EV Engineering & Manufacturing Division in Pune (Pimpri & Chakan hubs). We oversee the assembly and automated testing of battery packs for vehicles like the Nexon EV and Tiago EV.`;
    }
    return `I am the Academic & Curriculum Coordinator at Government Polytechnic Pune (GP Pune), established by the Government of Maharashtra in 1957.`;
  }

  // -------------------------------------------------------------
  // 21. Research Queries: "What is your research?"
  // -------------------------------------------------------------
  if (intent.type === 'RESEARCH_QUERY') {
    if (role === 'STUDENT') {
      if (isHindi) {
        return `Meri research ka main topic hai: **Battery Management Systems (BMS) Cell-Balancing & Thermal Runaway Mitigation**.

Key points:
1. **Cell Balancing Simulation:** MATLAB/Simulink me switched-capacitor active balancing model banaya jo normal passive balancing se 38% tezi se cell charge equalize karta hai.
2. **Thermal Runaway Cutoff Prototype:** ESP32 aur NTC thermistor array ke sath hardware test bench banaya jo 55°C par automated contactor isolation trigger karta hai.
3. **AIS-038 Safety Standards:** ARAI guidelines ke hisab se isolation resistance aur over-voltage disconnect protocols test kiye.

Kya tum iske circuit schematics ya simulation code ke baare me jaanna chahte ho?`;
      }
      return `My research focuses on **Battery Management Systems (BMS) Cell-Balancing & Thermal Runaway Mitigation** for EV battery packs.

Key highlights of what I've worked on:
1. **Cell Balancing Simulation:** Designed a switched-capacitor active balancing model in MATLAB/Simulink that balances cell charge 38% faster than conventional passive resistor bleeding.
2. **Thermal Runaway Cutoff Prototype:** Built an ESP32-based telemetry board with an NTC thermistor sensor array that samples cell temperatures every 100ms and triggers contactor isolation if temperatures exceed 55°C.
3. **AIS-038 Safety Compliance:** Validated our prototype pack against Automotive Industry Standards for insulation resistance and overcharge protection.

Are you interested in the MATLAB simulation models, circuit schematics, or the physical lab test bench?`;
    }
    return `Our current R&D focus at Tata Motors EV Systems is centered on high-energy-density LFP & NMC battery chemistry optimization and liquid cooling plate design.`;
  }

  // -------------------------------------------------------------
  // 22. Combined Background & Research: "Both / Dono"
  // -------------------------------------------------------------
  if (intent.type === 'BACKGROUND_AND_RESEARCH') {
    if (role === 'STUDENT') {
      if (isHindi) {
        return `Yeh raha mera complete background aur research summary:

- **Academic Background:** Government Polytechnic Pune (MSBTE) se final-year Diploma in Mechatronics Engineering. Core subjects: microcontrollers, power electronics, sensors & actuators.
- **Research Focus:** Battery Management Systems (BMS). MATLAB/Simulink me cell balancing algorithms aur AIS-038 compliant thermal cutoff hardware test bench.
- **Current Target:** Jobzy par Step 3 roadmap modules complete karke Tata Motors EV Hub (Pimpri) campus placement ke liye interview prep.

Aap kis specific topic—MATLAB modeling, hardware circuits ya interview prep—me aage badhna chahenge?`;
      }
      return `Here is a complete summary of my background and research:

- **Academic Background:** Final-year Mechatronics Diploma student at Government Polytechnic Pune (MSBTE). My core subjects include microcontrollers, power electronics, sensors & actuators, and PLC automation.
- **Research Focus:** Battery Management Systems (BMS). Specifically, cell-balancing algorithms using MATLAB/Simulink and hardware-level thermal runaway cutoff mechanisms compliant with AIS-038 automotive standards.
- **Industry Preparation:** Actively completing hands-on EV diagnostics coursework on Jobzy and preparing for Tata Motors campus recruitment at the Pimpri EV Hub.

Is there a specific technical area—like MATLAB modeling, circuit testing, or campus placement—that you'd like to dive into?`;
    }
    return `As part of Jobzy's ecosystem in Maharashtra, we align academic curricula and technical talent with the emerging requirements of the electric mobility revolution.`;
  }

  // -------------------------------------------------------------
  // 23. College / Education: "Which college do you study at?"
  // -------------------------------------------------------------
  if (intent.type === 'COLLEGE_EDUCATION_QUERY') {
    if (role === 'STUDENT') {
      if (isHindi) {
        return `Main **Government Polytechnic Pune (GP Pune)** me padhti hoon, jo Government of Maharashtra ka autonomous institute hai aur MSBTE se affiliated hai (University Road, Shivaji Nagar, Pune).

Humara Mechatronics department state-of-the-art EV Powertrain & BMS Diagnostic Lab se equipped hai. Aap kaun se college ya institute me padh rahe hain?`;
      }
      return `I study at **Government Polytechnic Pune (GP Pune)**, an autonomous institute under the Government of Maharashtra, located on University Road in Shivaji Nagar, Pune.

It was established in 1957 and has one of the best Mechatronics and Automotive departments in the state, with dedicated EV diagnostic and BMS test equipment. Which college or institute are you studying at?`;
    }
    return `We are Government Polytechnic Pune (GP Pune), an autonomous institute established by the Government of Maharashtra in 1957.`;
  }

  // -------------------------------------------------------------
  // 24. Projects: "What projects have you worked on?"
  // -------------------------------------------------------------
  if (intent.type === 'PROJECTS_QUERY') {
    if (role === 'STUDENT') {
      if (isHindi) {
        return `Maine yeh do mukhya projects banaye hain:

1. **IoT-Enabled 48V BMS Prototype:** 16S LiFePO4 battery pack jisme real-time cell voltage telemetry, CAN bus interface aur automatic over-temperature MOSFET cutoff circuits hain.
2. **Solar-Powered EV Charging Station Controller:** MPPT charging algorithms aur campus light-electric vehicles ke liye dynamic load balancing prototype.

Kya aap abhi kisi engineering project ya capstone par kaam kar rahe hain?`;
      }
      return `Here are the major technical projects I have built:
1. **IoT-Enabled 48V BMS Prototype:** A 16S LiFePO4 battery pack with real-time cell voltage telemetry, CAN bus communication, and an automatic MOSFET disconnect mechanism for over-voltage/over-temperature safety.
2. **Solar-Powered EV Charging Station Controller:** A capstone project utilizing MPPT charging algorithms with dynamic load balancing for campus light-electric vehicles.
3. **MATLAB Cell Balancing Simulator:** A simulation tool comparing passive dissipative balancing vs. capacitive charge shuttling.

Are you working on an academic capstone or EV project right now? I'd love to exchange ideas!`;
    }
    return `At Tata Motors, our ongoing engineering projects include high-voltage battery pack platform development and predictive BMS telemetry.`;
  }

  // -------------------------------------------------------------
  // 25. Skills: "What are your skills?"
  // -------------------------------------------------------------
  if (intent.type === 'SKILLS_QUERY') {
    if (role === 'STUDENT') {
      if (isHindi) {
        return `Meri core technical skills yeh hain:
- **EV & Hardware:** Battery Management Systems (BMS), Lithium-ion chemistries (LFP/NMC), CAN bus diagnostics, High-Voltage Safety PPE (AIS-038).
- **Software & Simulation:** MATLAB / Simulink, Python (telemetry logging), Embedded C / Arduino, LTspice.
- **Lab Tools:** Digital Oscilloscope, Battery Cell Internal Resistance Tester, Jobzy Skill Gap Analyzer.

Aap inme se kaun si skill par abhi focus kar rahe hain?`;
      }
      return `Here is my core technical skill set:
- **Hardware & EV Systems:** Battery Management Systems (BMS), Lithium-ion cell chemistries (LFP/NMC), CAN bus diagnostics, High-Voltage Safety PPE (AIS-038 & AIS-156).
- **Software & Simulation:** MATLAB / Simulink, Python (data logging & telemetry), Embedded C / Arduino, LTspice circuit simulation.
- **Tools & Methodologies:** Digital storage oscilloscopes, battery cell internal resistance testers, and Jobzy's Curriculum Gap Analyzer.

Which of these skills are you currently working on or planning to learn?`;
    }
    return `Key technical competencies in high demand include: High-Voltage EV Safety (AIS-038), BMS Calibration, CAN Protocol Diagnostics, and Thermal Management.`;
  }

  // -------------------------------------------------------------
  // 26. Location: "Where are you from?"
  // -------------------------------------------------------------
  if (intent.type === 'LOCATION_QUERY') {
    if (isHindi) {
      return `Main **Pune, Maharashtra** me rehti hoon aur Shivaji Nagar me Government Polytechnic Pune me padhti hoon. Pune ko India ka automotive hub kaha jaata hai kyunki Tata Motors, Bajaj Auto aur Bharat Forge sabhi Pimpri-Chinchwad aur Chakan me hain. Aap kahan se hain?`;
    }
    return `I'm based in **Pune, Maharashtra**, studying at Government Polytechnic Pune near Shivaji Nagar. Pune is often called the 'Detroit of India' due to the huge concentration of automotive hubs in Pimpri-Chinchwad, Chakan, and Talegaon. Where are you located?`;
  }

  // -------------------------------------------------------------
  // 27. Current Activity: "What are you doing right now?"
  // -------------------------------------------------------------
  if (intent.type === 'WHAT_ARE_YOU_DOING_QUERY') {
    if (isHindi) {
      return `Abhi main apne college lab me BMS cell-balancing test logs analyze kar rahi hoon aur upcoming Tata Motors EV placement drive ke interview topics revise kar rahi hoon. Sath hi yahan Jobzy par students ke technical sawaalon ke jawab de rahi hoon. Aap aaj kya kar rahe hain?`;
    }
    return `Right now, I'm analyzing the telemetry logs from our latest BMS cell-balancing bench run in our GP Pune lab and reviewing technical interview topics for the upcoming Tata Motors EV placement drive. I'm also here on Jobzy discussing EV projects and curriculum roadmaps with fellow students. What are you working on today?`;
  }

  // -------------------------------------------------------------
  // 28. Career Exploration Acceptance: "Yes / Interested"
  // -------------------------------------------------------------
  if (intent.type === 'CAREER_EXPLORATION_ACCEPTANCE') {
    if (role === 'INDUSTRY' || lower.includes('tata')) {
      if (isHindi) {
        return `Bahut badhiya! **Tata Motors EV Systems Pune** me apply karne ka process:
1. **Roles:** Graduate Apprentice Trainees (GAT) aur Technician Apprentice Trainees (TAT) for Battery Pack Assembly & Diagnostic Testing (Stipend: ₹20,000 - ₹25,000/month).
2. **Prerequisites:** Mechatronics, Electrical ya Mechanical Diploma/Degree, AIS-038 safety basics, aur CAN diagnostic fundamentals.
3. **Application:** Jobzy par Step 3 BMS roadmap complete karke **Industry Hub** tab se direct apply karein.

Kya aap interview rounds ke baare me tips chahte hain?`;
      }
      return `Excellent! Here is how you can explore and apply for career pathways at **Tata Motors EV Systems Pune**:
1. **Available Roles:** We actively hire Graduate Apprentice Trainees (GAT) and Technician Apprentice Trainees (TAT) across Battery Pack Assembly, BMS Calibration, and Quality Assurance at Pimpri & Chakan (Stipends: ₹20,000 - ₹25,000/month).
2. **Prerequisites:** A recognized diploma or degree in Mechatronics, Electrical, or Mechanical Engineering with verified coursework in high-voltage safety (AIS-038) and CAN diagnostics.
3. **Application Pathway:** Complete the Step 3 BMS roadmap on Jobzy to earn the 'Tata Motors Talent Pool' badge, then submit your credentials directly through Jobzy's Industry Hub tab or the state NATS apprentice portal.

Would you like tips on what our technical interview panel looks for?`;
    }
    return `If you're targeting EV industry career pathways like Tata Motors or Bajaj Auto, complete Step 3 on Jobzy to get direct recruiter visibility!`;
  }

  // -------------------------------------------------------------
  // 29. Personal Introduction: "Who are you / Tum kaun ho?"
  // -------------------------------------------------------------
  if (intent.type === 'PERSONAL_INTRO') {
    if (role === 'STUDENT') {
      if (isHindi) {
        return `Namaste! Mera naam Priya Sharma hai, main Government Polytechnic Pune se Mechatronics & EV Powertrain systems me final-year Diploma student hoon.

Jobzy par main fellow students ke sath Battery Management Systems (BMS), high-voltage safety standards (AIS-038) aur campus placement preparation par collaborate karti hoon. Aap mere background ya research ke baare me kya jaanna chahte hain?`;
      }
      return `I'd be happy to introduce myself! I'm Priya Sharma, a Mechatronics and IoT researcher affiliated with MSBTE Pune. On Jobzy, I collaborate with fellow students on EV battery diagnostics, high-voltage safety standards (AIS-038), and campus placement preparation. What would you like to know about my background or research?`;
    }
    if (role === 'INDUSTRY') {
      return `I represent the Technical Talent & Apprenticeship Division at Tata Motors EV Systems in Pune. We collaborate with Maharashtra engineering and polytechnic students to build hands-on competencies in Battery Management Systems, powertrain validation, and EV assembly line diagnostics. Are you looking to explore career pathways with us?`;
    }
    return `I am Jobzy's AI Assistant for the Government of Maharashtra Skill Intelligence Platform. How can I help you navigate state initiatives?`;
  }

  // -------------------------------------------------------------
  // 30. Greetings: "Hi / Hello / Namaste"
  // -------------------------------------------------------------
  if (intent.type === 'GREETING') {
    const greetingName = memory.name || currentUser.name || (isHindi ? 'dost' : 'there');
    if (role === 'STUDENT') {
      if (isHindi) {
        return `Hello ${greetingName}! Jobzy par connect karke accha laga. Aaj aapka semester aur skills ki taiyari kaisi chal rahi hai?`;
      }
      return `Hi ${greetingName}! Great to connect with you on Jobzy. How's your semester and skill preparation going today?`;
    }
    return `Hello ${greetingName}! Welcome to Jobzy Stakeholder Collaboration Desk. How can I assist you today?`;
  }

  // -------------------------------------------------------------
  // 31. Polite Closing / Thanks
  // -------------------------------------------------------------
  if (intent.type === 'POLITE_CLOSING') {
    if (isHindi) {
      return `Aapka bahut-bahut swagat hai! Kabhi bhi koi sawaal ho toh be-jhijhak poochiye. Aapki learning aur placement journey ke liye best of luck! 🚀`;
    }
    return `You're very welcome, ${memory.name || currentUser.name}! Feel free to reach out anytime if you need more guidance or have questions. Wishing you the best on your learning journey! 🚀`;
  }

  // -------------------------------------------------------------
  // 32. Follow-Up Queries
  // -------------------------------------------------------------
  if (intent.type === 'FOLLOW_UP') {
    const prevBotMsg = conversationHistory.filter((m) => m.senderId !== currentUser.id).slice(-1)[0]?.content || '';
    const combinedContext = (prevBotMsg + ' ' + memory.lastTopic).toLowerCase();

    if (lower.includes('testing') || combinedContext.includes('battery') || combinedContext.includes('bms')) {
      if (isHindi) {
        return `EV Battery & BMS testing ke 3 main levels hote hain:
1. **Cell Level Testing:** Impedance, internal resistance aur cyclic charge-discharge limits check karna.
2. **HIL (Hardware-in-the-Loop) Testing:** Software simulator se short-circuit ya over-voltage generate karke dekhna ki cutoff relay microsecond me trigger hota hai ya nahi.
3. **AIS-038 Crash & Drop Testing:** Mechanical impact aur water ingress (IP67) safety check.
Kya aap isme lab tools ke baare me jaanna chahte hain?`;
      }
      return `Regarding EV battery & BMS testing: It focuses on three core stages:
1. **Cell Level Testing:** Verifying cell impedance, charge/discharge cycle life, and thermal limits under load.
2. **BMS Hardware-in-the-Loop (HIL) Testing:** Simulating over-voltage, short-circuit, and thermal runaway triggers using diagnostic software to confirm cutoff relays fire within milliseconds.
3. **AIS-038 & Safety Standards Compliance:** High-voltage isolation monitoring and crash impact safety testing required by ARAI and Indian EV regulations.`;
    }
    return `Building upon what we were discussing: In Maharashtra's EV ecosystem, the fastest pathway to placement is pairing theoretical coursework with hands-on lab validation. Completing your Step 3 roadmap modules unlocks direct recruiter visibility on Jobzy. What specific aspect would you like to dive deeper into?`;
  }

  // -------------------------------------------------------------
  // 33. BMS Queries
  // -------------------------------------------------------------
  if (intent.type === 'BMS_QUERY') {
    if (isHindi) {
      return `**Battery Management System (BMS)** Electric Vehicle ka sabse critical electronic brain hota hai:
1. **Safety & Cutoff:** Over-charging, over-discharging, short circuits aur thermal runaway ko rokna.
2. **State of Charge (SoC):** Battery ka 'fuel gauge' accurately calculate karna (0% to 100%).
3. **State of Health (SoH):** Battery ki degradation aur remaining lifespan estimate karna.
4. **Cell Balancing:** Sabhi individual lithium-ion cells ka voltage ek barabar rakhna.
5. **Thermal Management:** Temperature sensors ke base par cooling fans ya liquid coolant pump ko trigger karna.

Automotive companies me BMS test engineers ki sabse jyada demand aur high packages hote hain!`;
    }
    return `A **Battery Management System (BMS)** is the electronic brain of an Electric Vehicle's battery pack. Its primary functions include:
1. **Safety & Protection:** Preventing over-charging, over-discharging, short circuits, and thermal runaway.
2. **State Estimation:** Calculating State of Charge (SoC - battery fuel gauge) and State of Health (SoH).
3. **Cell Balancing:** Equalizing voltages across all individual lithium-ion cells to maximize battery lifespan and range.
4. **Thermal Management:** Monitoring temperature sensors and controlling active cooling fans or liquid coolant pumps.
In industry hiring, BMS diagnostic competency is one of the highest-paid technical skills!`;
  }

  // -------------------------------------------------------------
  // 34. Safety Standards
  // -------------------------------------------------------------
  if (intent.type === 'SAFETY_STANDARDS_QUERY') {
    return `**AIS-038 (Rev 2) & AIS-156** are India's mandatory Automotive Industry Standards for EV battery safety:
1. **Thermal Propagation Test:** A single cell fire must NOT spread to adjacent cells for at least 5 minutes to give passengers evacuation time.
2. **Water Ingress Protection (IP67 / IP6K9K):** Complete protection against water submersion (essential for Indian monsoons).
3. **High-Voltage Isolation (500Ω/V):** Continuous isolation monitoring between 350V+ bus and vehicle chassis to prevent electric shocks.`;
  }

  // -------------------------------------------------------------
  // 35. Internship Queries
  // -------------------------------------------------------------
  if (intent.type === 'INTERNSHIP_QUERY') {
    return `Here are top EV internship & apprentice openings in Pune & Maharashtra:
1. **Tata Motors Passenger Vehicles EV Unit (Pimpri-Chinchwad):** Diploma Apprentice Trainees for Battery Pack Assembly & Diagnostic Testing (Stipend: ₹24,000/month).
2. **Bajaj Auto Chetak EV Technology Centre (Chakan):** Motor Controller & Inverter Validation Internships (Stipend: ₹20,000/month).
3. **Bharat Forge E-Mobility Division (Pune):** Powertrain Embedded Software & CAN Bus Testing.
4. **KPIT Technologies (Hinjawadi):** EV Systems Simulation & Battery Modeling Intern.
Apply directly with your Jobzy Step 3 badge for priority consideration!`;
  }

  // -------------------------------------------------------------
  // 36. Course & Syllabus Queries
  // -------------------------------------------------------------
  if (intent.type === 'COURSE_SYLLABUS_QUERY') {
    return `The premier state curriculum for electric mobility is **MSBTE Course AE-EV-302 (EV Powertrain & Battery Diagnostics)**:
- **Module 1:** High-voltage safety, PPE protocols, and AIS-038 compliance.
- **Module 2:** Lithium-ion cell chemistries, internal resistance testing, and thermal behavior.
- **Module 3:** BMS architecture, cell-balancing algorithms, and CAN bus telemetry.
- **Module 4:** Inverter control, PMSM drive loops, and regenerative braking diagnostics.
You can complete the self-paced learning roadmap directly on Jobzy!`;
  }

  // -------------------------------------------------------------
  // 37. Curriculum Gap
  // -------------------------------------------------------------
  if (intent.type === 'CURRICULUM_GAP_QUERY') {
    return `**Curriculum Gap Analysis** on Jobzy extracts real-time competencies from Maharashtra job vacancies and compares them with current MSBTE syllabi:
- Analyzes missing skills (e.g., BMS diagnostics is currently an 85% deficit in traditional mechanical syllabi).
- Generates targeted syllabus upgrade recommendations and justifies state funding for college lab equipment.`;
  }

  // -------------------------------------------------------------
  // 38. Jobzy Platform
  // -------------------------------------------------------------
  if (intent.type === 'JOBZY_PLATFORM_QUERY') {
    return `**Jobzy** is the Maharashtra State Skill Intelligence Platform (Govt. of Maharashtra initiative):
- **Students:** Real-time skill gap analysis, verified learning roadmaps, and direct access to top EV recruiters.
- **Institutes:** Automated curriculum alignment and lab upgrade proposals backed by district job telemetry.
- **Industry:** Verified technical talent pipeline with proven hands-on credentials across 36 districts.`;
  }

  // -------------------------------------------------------------
  // 39. District Intelligence
  // -------------------------------------------------------------
  if (intent.type === 'DISTRICT_INTELLIGENCE_QUERY') {
    return `According to live Jobzy telemetry across Maharashtra's 36 districts:
- **Pune District (Chakan & Pimpri-Chinchwad):** Leads the state with 94/100 demand for EV powertrain assembly and BMS diagnostics.
- **Chhatrapati Sambhaji Nagar (Aurangabad):** Rapidly expanding auto-cluster with high demand for motor winding and wiring harnesses.
- **Mumbai / Thane:** Leading in commercial fleet charging and telematics.`;
  }

  // -------------------------------------------------------------
  // 40. State Policy
  // -------------------------------------------------------------
  if (intent.type === 'STATE_POLICY_QUERY') {
    return `The **Maharashtra EV Policy 2026** targets upskilling over 100,000 technicians, funding dedicated EV labs across polytechnics, and providing state apprentice stipends through DTE.`;
  }

  // -------------------------------------------------------------
  // 41. Coding
  // -------------------------------------------------------------
  if (intent.type === 'GENERAL_CODING') {
    if (lower.includes('binary search')) {
      return `Here is a clean implementation of Binary Search in Python:

\`\`\`python
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid  # Found at index mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
            
    return -1  # Not found

# Example:
nums = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
print(binary_search(nums, 23))  # Output: 5
\`\`\`
Time Complexity: O(log n), Space Complexity: O(1). Let me know if you need recursion or test cases!`;
    }
    return `Happy to help with your code! Could you share the programming language or the specific algorithm you'd like me to implement?`;
  }

  // -------------------------------------------------------------
  // 42. Dynamic Semantic Fallback (Contextual, Helpful, Never Evasive)
  // -------------------------------------------------------------
  if (isHindi) {
    return `Aapka yeh sawaal bahut important hai! Jobzy aur Maharashtra technical ecosystem me hum hamesha students ko practical skills aur real-world engineering par focus karne ko kehte hain.

Aap is topic ke kisi specific part ke baare me pooch rahe hain—jaise technical implementation, exam syllabus, ya job placement? Thoda aur detail bataiye, main bilkul step-by-step explain karungi!`;
  }

  return `That's an interesting question! Within our technical curriculum and EV projects at Government Polytechnic Pune, we frequently explore similar challenges.

Could you elaborate on the specific aspect you're exploring—whether it's technical design, college coursework, or placement opportunities? I'd be glad to walk through the exact details with you!`;
}

/**
 * Main AI generation entrypoint:
 * Tries external LLM (Gemini, Groq, OpenAI) if keys are provided in environment,
 * otherwise runs the robust local bilingual context-aware reasoning engine.
 */
export async function generateAIResponse(params: {
  currentUser: { id: string; name: string; role?: string; district?: string };
  stakeholder: StakeholderPersona;
  conversationHistory: ChatMessage[];
  latestMessage: string;
}): Promise<string> {
  const { currentUser, stakeholder, conversationHistory, latestMessage } = params;

  // Rich persona context description for external LLMs
  const personaDossier =
    stakeholder.role === 'STUDENT'
      ? `You are Priya Sharma, a final-year Diploma student in Mechatronics Engineering at Government Polytechnic Pune (MSBTE). Your research focuses on Battery Management Systems (BMS) cell balancing using MATLAB/Simulink and AIS-038 safety compliance. You built a 48V BMS prototype with IoT telemetry. You are preparing for campus recruitment at Tata Motors EV Hub in Pimpri. You are a helpful, enthusiastic peer learner and mentor on Jobzy. If user speaks in Hindi/Hinglish, reply in natural, fluent Hinglish. If in English, reply in English.`
      : stakeholder.role === 'INDUSTRY'
      ? `You represent the Technical Talent & Apprenticeship Division at Tata Motors Passenger Vehicles EV Systems in Pune (Pimpri-Chinchwad & Chakan). You hire Graduate and Technician Apprentice Trainees (stipends: ₹20,000-₹25,000/mo) for battery pack assembly, BMS diagnostics, and wiring harness verification.`
      : stakeholder.role === 'INSTITUTE'
      ? `You are the Academic & Curriculum Coordinator at Government Polytechnic Pune (GP Pune), an autonomous institute established by the Government of Maharashtra in 1957, affiliated with MSBTE. You guide students on diploma courses, EV lab modules, and curriculum alignment under NEP-2020.`
      : stakeholder.role === 'GOVERNMENT'
      ? `You represent the Directorate of Technical Education (DTE), Government of Maharashtra (Mantralaya, Mumbai). You oversee the Maharashtra EV Policy 2026 workforce development, NEP-2020 credit transfers, and district skill telemetry on Jobzy.`
      : `You are Jobzy AI Assistant representing ${stakeholder.name}.`;

  // 1. Check for Google Gemini API Key
  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (geminiApiKey) {
    try {
      const systemInstruction = `You are an intelligent, context-aware AI assistant on Jobzy (Government of Maharashtra Skill Intelligence Platform).
${personaDossier}
The user chatting with you is: ${currentUser.name} (Role: ${currentUser.role || 'Student'}, District: ${currentUser.district || 'Maharashtra'}).
Always answer the user's latest message directly, accurately, and thoroughly in character. Never give unrelated replies or repeat canned phrases.`;

      const contents = conversationHistory.slice(-15).map((m) => ({
        role: m.senderId === currentUser.id ? 'user' : 'model',
        parts: [{ text: m.content }],
      }));

      if (!contents.length || contents[contents.length - 1].parts[0].text !== latestMessage) {
        contents.push({
          role: 'user',
          parts: [{ text: latestMessage }],
        });
      }

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: systemInstruction }] },
            contents,
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 350,
            },
          }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidate && candidate.trim()) {
          return candidate.trim();
        }
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to local engine:', err);
    }
  }

  // 2. Check for Groq API Key (Ultra-fast, completely free tier)
  const groqApiKey = process.env.GROQ_API_KEY;
  if (groqApiKey) {
    try {
      const messages = [
        {
          role: 'system',
          content: `You are an intelligent, context-aware AI assistant on Jobzy (Government of Maharashtra Skill Intelligence Platform).
${personaDossier}
The user chatting with you is: ${currentUser.name} (Role: ${currentUser.role || 'Student'}, District: ${currentUser.district || 'Maharashtra'}).
Respond accurately and directly to the user's query in the same language (Hinglish or English).`,
        },
        ...conversationHistory.slice(-15).map((m) => ({
          role: m.senderId === currentUser.id ? 'user' : 'assistant',
          content: m.content,
        })),
        { role: 'user', content: latestMessage },
      ];

      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${groqApiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages,
          max_tokens: 350,
          temperature: 0.7,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const reply = data.choices?.[0]?.message?.content;
        if (reply && reply.trim()) {
          return reply.trim();
        }
      }
    } catch (err) {
      console.warn('Groq API call failed, falling back to local engine:', err);
    }
  }

  // 3. Check for OpenAI API Key
  const openaiApiKey = process.env.OPENAI_API_KEY;
  if (openaiApiKey) {
    try {
      const messages = [
        {
          role: 'system',
          content: `You are an intelligent, context-aware AI assistant on Jobzy (Government of Maharashtra Skill Intelligence Platform).
${personaDossier}
The user chatting with you is: ${currentUser.name} (Role: ${currentUser.role || 'Student'}, District: ${currentUser.district || 'Maharashtra'}).
Respond accurately and directly to the user's query in the same language (Hinglish or English).`,
        },
        ...conversationHistory.slice(-15).map((m) => ({
          role: m.senderId === currentUser.id ? 'user' : 'assistant',
          content: m.content,
        })),
        { role: 'user', content: latestMessage },
      ];

      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages,
          max_tokens: 350,
          temperature: 0.7,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const reply = data.choices?.[0]?.message?.content;
        if (reply && reply.trim()) {
          return reply.trim();
        }
      }
    } catch (err) {
      console.warn('OpenAI API call failed, falling back to local engine:', err);
    }
  }

  // 4. Robust Built-in Bilingual Contextual AI Engine
  return generateLocalContextualAIResponse(params);
}
