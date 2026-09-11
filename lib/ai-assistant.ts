/**
 * Jobzy Context-Aware AI Conversation Engine
 * Handles multi-turn chat generation with conversation history,
 * intent detection, short-term session memory, and stakeholder personas.
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
    const nameMatch = text.match(/(?:my name is|call me|name's)\s+([A-Za-z]+(?:\s+[A-Za-z]+)?)/i);
    if (nameMatch && nameMatch[1] && !['Jobzy', 'Priya', 'Tata', 'Doing', 'What', 'Where', 'How'].includes(nameMatch[1])) {
      memory.name = nameMatch[1].trim();
    }

    // City detection
    const cityMatch = lower.match(/(?:live in|from|located in|at)\s+(pune|mumbai|nagpur|nashik|aurangabad|kolhapur|thane|chakan|pimpri)/);
    if (cityMatch) {
      memory.city = cityMatch[1].charAt(0).toUpperCase() + cityMatch[1].slice(1);
    }

    // College detection
    const collegeMatch = text.match(/(?:study at|student of|from|college is)\s+([A-Za-z\s]+(?:Polytechnic|Institute|College|University))/i);
    if (collegeMatch) {
      memory.college = collegeMatch[1].trim();
    }

    // Topic tracking
    if (lower.includes('battery') || lower.includes('bms')) {
      memory.lastTopic = 'bms_battery';
      memory.allTopics.push('bms_battery');
    } else if (lower.includes('intern') || lower.includes('job') || lower.includes('placement') || lower.includes('hiring')) {
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
  | 'MEMORY_QUERY'
  | 'NAME_STATEMENT'
  | 'BACKGROUND_AND_RESEARCH'
  | 'BACKGROUND_QUERY'
  | 'RESEARCH_QUERY'
  | 'COLLEGE_EDUCATION_QUERY'
  | 'PROJECTS_QUERY'
  | 'SKILLS_QUERY'
  | 'LOCATION_QUERY'
  | 'WHAT_ARE_YOU_DOING_QUERY'
  | 'HOW_CAN_YOU_HELP'
  | 'CAREER_EXPLORATION_ACCEPTANCE'
  | 'JOBZY_PLATFORM_QUERY'
  | 'DISTRICT_INTELLIGENCE_QUERY'
  | 'STATE_POLICY_QUERY'
  | 'PERSONAL_INTRO'
  | 'GREETING'
  | 'POLITE_CLOSING'
  | 'FOLLOW_UP'
  | 'INTERNSHIP_QUERY'
  | 'BMS_QUERY'
  | 'EV_BATTERY_QUERY'
  | 'CERTIFICATION_QUERY'
  | 'CURRICULUM_GAP_QUERY'
  | 'GENERAL_CODING'
  | 'GENERAL_CHAT';

/**
 * Determines the conversational intent of the latest user message
 * considering conversational history, memory, and persona context.
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

  // 1. Check if user is stating their name: "My name is Aarav"
  if (lower.startsWith('my name is ') || lower.startsWith('call me ') || lower.startsWith("my name's ")) {
    return { type: 'NAME_STATEMENT', confidence: 0.95 };
  }

  // 2. Check if user is asking what they told the bot earlier (Session Memory Query)
  if (
    lower.includes('what did i tell you') ||
    lower.includes('what was my name') ||
    lower.includes('do you remember my name') ||
    lower.includes('what is my name') ||
    lower.includes('do you know my name') ||
    lower.includes('what did i say')
  ) {
    return { type: 'MEMORY_QUERY', confidence: 0.95 };
  }

  // 3. Conversational follow-up answering the assistant's previous question:
  // e.g. "What would you like to know about my background or research?"
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

  // e.g. Tata Motors asking "Are you looking to explore career pathways with us?"
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

  // 4. Combined Background & Research Queries
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

  // 5. Background Queries: "What is your background", "tell me your background", "your background"
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

  // 6. Research Queries: "What is your research", "tell me about your research", "your research"
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

  // 7. College / Institute / Education Queries: "Which college do you study at?"
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

  // 8. Projects Queries: "What projects have you worked on?"
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

  // 9. Skills Queries: "What are your skills?"
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

  // 10. Location Queries: "Where are you from?", "Where do you live?"
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

  // 11. Current Activity / "What are you doing?"
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

  // 12. Help / Collaboration Queries
  if (
    lower.includes('how can you help') ||
    lower.includes('how can jobzy help') ||
    lower.includes('what can you do') ||
    lower.includes('kya madad kar sakte ho') ||
    lower.includes('help me with') ||
    lower.includes('can you help me') ||
    lower.includes('can we collaborate') ||
    lower.includes('collaborate with me') ||
    lower.includes('work together') ||
    lower.includes('study together') ||
    lower.includes('guide me')
  ) {
    return { type: 'HOW_CAN_YOU_HELP', confidence: 0.9 };
  }

  // 13. Career Exploration / Application Queries
  if (
    lower.includes('explore career') ||
    lower.includes('career pathways') ||
    lower.includes('how to apply') ||
    lower.includes('how can i apply') ||
    lower.includes('how to join') ||
    lower.includes('how can i join') ||
    lower.includes('tata motors job') ||
    lower.includes('tata motors placement') ||
    lower.includes('campus hiring') ||
    lower.includes('placement drive') ||
    lower.includes('hiring process') ||
    lower.includes('selection process') ||
    lower.includes('stipend') ||
    lower.includes('salary')
  ) {
    return { type: 'CAREER_EXPLORATION_ACCEPTANCE', confidence: 0.9 };
  }

  // 14. Personal Introduction / "Who are you" / "Know you personally"
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

  // 15. Jobzy Platform Queries
  if (
    lower.includes('what is jobzy') ||
    lower.includes('about jobzy') ||
    lower.includes('jobzy kya hai') ||
    lower.includes('how does jobzy work') ||
    lower.includes('features of jobzy') ||
    lower.includes('what does jobzy do') ||
    lower.includes('tell me about jobzy')
  ) {
    return { type: 'JOBZY_PLATFORM_QUERY', confidence: 0.92 };
  }

  // 16. District Intelligence Queries
  if (
    lower.includes('district intelligence') ||
    lower.includes('highest demand') ||
    lower.includes('which district') ||
    lower.includes('demand in pune') ||
    lower.includes('ev demand in maharashtra') ||
    lower.includes('skill telemetry')
  ) {
    return { type: 'DISTRICT_INTELLIGENCE_QUERY', confidence: 0.9 };
  }

  // 17. State Policy Queries
  if (
    lower.includes('ev policy') ||
    lower.includes('policy 2026') ||
    lower.includes('credit transfer') ||
    lower.includes('tvet modernization') ||
    lower.includes('dte initiative')
  ) {
    return { type: 'STATE_POLICY_QUERY', confidence: 0.9 };
  }

  // 18. Polite greetings / "Kaise ho"
  if (
    lower === 'hi' ||
    lower === 'hello' ||
    lower === 'hey' ||
    lower === 'hey there' ||
    lower === 'namaste' ||
    lower === 'pranam' ||
    lower.includes('kaise ho') ||
    lower.includes('kese ho') ||
    lower.includes('kya haal') ||
    lower.includes('sab theek') ||
    lower.includes('whatsup') ||
    lower.includes("what's up") ||
    lower.includes('wassup') ||
    lower.includes('how are you') ||
    lower.includes('how r u') ||
    lower.includes('how are you doing') ||
    lower.startsWith('hi ') ||
    lower.startsWith('hello ') ||
    lower.startsWith('hey ') ||
    lower.startsWith('good morning') ||
    lower.startsWith('good afternoon') ||
    lower.startsWith('good evening')
  ) {
    return { type: 'GREETING', confidence: 0.9 };
  }

  // 19. Polite closing / thanks
  if (
    lower.includes('thank') ||
    lower.includes('thx') ||
    lower.includes('dhanyawad') ||
    lower.includes('shukriya') ||
    lower === 'thanks' ||
    lower === 'thanks!' ||
    lower.includes('thanks bro') ||
    lower.includes('thanks bhai') ||
    lower === 'bye' ||
    lower === 'goodbye'
  ) {
    return { type: 'POLITE_CLOSING', confidence: 0.9 };
  }

  // 20. Follow-up expressions ("tell me more", "what about testing", "aur batao")
  if (
    lower === 'tell me more' ||
    lower === 'tell me more.' ||
    lower.includes('tell me more about') ||
    lower === 'explain' ||
    lower === 'explain further' ||
    lower === 'what about testing?' ||
    lower === 'what about testing' ||
    lower.includes('aur batao') ||
    lower.includes('or batao') ||
    lower.includes('aage batao') ||
    lower.includes('kuch aur batao') ||
    lower === 'why?' ||
    lower === 'how?' ||
    lower === 'and then?' ||
    lower === 'more details' ||
    lower === 'elaborate'
  ) {
    return { type: 'FOLLOW_UP', confidence: 0.9 };
  }

  // 21. Internship / Job Queries
  if (
    lower.includes('intern') ||
    lower.includes('job opening') ||
    lower.includes('openings in pune') ||
    lower.includes('vacancy') ||
    lower.includes('hire') ||
    lower.includes('naukri') ||
    lower.includes('job chahiye') ||
    lower.includes('internship chahiye') ||
    (lower.includes('pune') && (lower.includes('job') || lower.includes('work')))
  ) {
    return { type: 'INTERNSHIP_QUERY', confidence: 0.85 };
  }

  // 22. BMS specific queries
  if (
    lower.includes('what is bms') ||
    lower.includes('bms testing') ||
    lower.includes('bms kya hai') ||
    lower.includes('bms kya hota hai') ||
    lower.includes('battery management system') ||
    lower.includes('learn bms') ||
    lower.includes('cell balancing')
  ) {
    return { type: 'BMS_QUERY', confidence: 0.9 };
  }

  // 23. General EV Batteries
  if (lower.includes('ev battery') || lower.includes('ev batteries') || lower.includes('lithium-ion') || lower.includes('lfp') || lower.includes('nmc')) {
    return { type: 'EV_BATTERY_QUERY', confidence: 0.85 };
  }

  // 24. Certification queries
  if (
    lower.includes('certif') ||
    lower.includes('ais-038') ||
    lower.includes('what courses') ||
    lower.includes('suggest courses')
  ) {
    return { type: 'CERTIFICATION_QUERY', confidence: 0.85 };
  }

  // 25. Curriculum gap analysis
  if (
    lower.includes('curriculum gap') ||
    lower.includes('skill gap analysis') ||
    lower.includes('gap analysis') ||
    lower.includes('how does gap work')
  ) {
    return { type: 'CURRICULUM_GAP_QUERY', confidence: 0.9 };
  }

  // 26. Coding queries
  if (
    lower.includes('binary search') ||
    lower.includes('python code') ||
    lower.includes('javascript') ||
    lower.includes('sql query') ||
    lower.includes('write code')
  ) {
    return { type: 'GENERAL_CODING', confidence: 0.85 };
  }

  return { type: 'GENERAL_CHAT', confidence: 0.5 };
}

/**
 * Generates an intelligent, context-aware reply using local reasoning
 * matching the persona, memory, and latest user query.
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
  const lower = latestMessage.toLowerCase().trim();

  // -------------------------------------------------------------
  // 1. Session Memory: User Stating Name: "My name is Aarav"
  // -------------------------------------------------------------
  if (intent.type === 'NAME_STATEMENT') {
    const nameMatch = latestMessage.match(/(?:my name is|call me|name's)\s+([A-Za-z]+(?:\s+[A-Za-z]+)?)/i);
    const statedName = nameMatch ? nameMatch[1].trim() : memory.name || 'there';
    return `Nice to meet you, ${statedName}! I've noted your name in our session memory. What can I help you with today regarding your EV coursework, skills, or career goals?`;
  }

  // -------------------------------------------------------------
  // 2. Session Memory Queries: "What did I tell you my name was?"
  // -------------------------------------------------------------
  if (intent.type === 'MEMORY_QUERY') {
    const rememberedName = memory.name || currentUser.name;
    if (rememberedName) {
      return `You told me your name is ${rememberedName}! ${
        memory.college ? `You also mentioned you study at ${memory.college}.` : ''
      }How can I assist you further?`;
    }
    return `You're signed in as ${currentUser.name}. If you shared another preferred name earlier, feel free to remind me!`;
  }

  // -------------------------------------------------------------
  // 3. Background Queries: "What is your background?"
  // -------------------------------------------------------------
  if (intent.type === 'BACKGROUND_QUERY') {
    if (role === 'STUDENT') {
      return `I am a final-year Diploma student in Mechatronics Engineering at Government Polytechnic Pune, affiliated with MSBTE. My academic background blends embedded systems, power electronics, and automotive control networks.

Over the past two years, I've specialized in high-voltage EV battery architectures, thermal simulation, and state estimation (SoC/SoH). In our college lab, I lead our student research group on high-voltage battery safety, and on Jobzy I actively mentor peers preparing for industry certifications like AIS-038.

Would you like to know more about the specific BMS research projects I've built, or how I'm preparing for the upcoming Tata Motors placement drive?`;
    }
    if (role === 'INDUSTRY') {
      return `I lead technical recruitment and campus engagement at the Tata Motors Passenger Vehicles EV Engineering & Manufacturing Division in Pune (Pimpri & Chakan hubs).

Our division oversees the design, assembly, and automated testing of battery packs and integrated electric powertrains for vehicles like the Nexon EV and Tiago EV. We partner directly with MSBTE and engineering colleges across Maharashtra to identify emerging technical talent.`;
    }
    if (role === 'INSTITUTE') {
      return `I am the Academic & Curriculum Coordinator at Government Polytechnic Pune (GP Pune), an autonomous institute established by the Government of Maharashtra in 1957.

Our institution is one of the state's premier polytechnics, offering specialized diploma programs in Mechatronics, Automotive, and Electrical Engineering with modern EV labs funded under state TVET modernization grants.`;
    }
    if (role === 'GOVERNMENT') {
      return `I represent the Directorate of Technical Education (DTE), Government of Maharashtra, headquartered at 3 Mahapalika Marg, Mumbai.

DTE oversees curriculum standards, faculty development, institutional accreditations, and industry apprenticeships across more than 300 polytechnic institutes in all 36 districts of Maharashtra.`;
    }
    return `I'm Jobzy's conversational AI assistant, designed to connect Maharashtra's students, technical institutes, and automotive industries through verified skill roadmaps and real-time employment telemetry.`;
  }

  // -------------------------------------------------------------
  // 4. Research Queries: "What is your research?"
  // -------------------------------------------------------------
  if (intent.type === 'RESEARCH_QUERY') {
    if (role === 'STUDENT') {
      return `My research focuses on **Battery Management Systems (BMS) Cell-Balancing & Thermal Runaway Mitigation** for EV battery packs.

Key highlights of what I've worked on:
1. **Cell Balancing Simulation:** Designed a switched-capacitor active balancing model in MATLAB/Simulink that balances cell charge 38% faster than conventional passive resistor bleeding.
2. **Thermal Runaway Cutoff Prototype:** Built an ESP32-based telemetry board with an NTC thermistor sensor array that samples cell temperatures every 100ms and triggers contactor isolation if temperatures exceed 55°C.
3. **AIS-038 Safety Compliance:** Validated our prototype pack against Automotive Industry Standards for insulation resistance and overcharge protection.

Are you interested in the MATLAB simulation models, circuit schematics, or the physical lab test bench?`;
    }
    if (role === 'INDUSTRY') {
      return `Our current R&D focus at Tata Motors EV Systems is centered on **high-energy-density LFP & NMC battery chemistry optimization**, liquid cooling plate design for extreme Indian ambient temperatures, and fast-charging algorithms that maintain battery health above 80% over 1,500+ charge cycles.`;
    }
    if (role === 'INSTITUTE') {
      return `At GP Pune, our departmental research cell focuses on applied electric mobility technologies—including microcontroller-based motor controllers, regenerative braking test benches, and battery thermal management simulations conducted in collaboration with ARAI.`;
    }
    return `State-level technical research under DTE focuses on curriculum telemetry: tracking emerging industry skill requirements across Maharashtra's industrial belts (Pune, Chakan, Aurangabad, Nagpur) to dynamically modernize polytechnic syllabi and lab infrastructure.`;
  }

  // -------------------------------------------------------------
  // 5. Combined Background & Research Queries: "Both", "Tell me both"
  // -------------------------------------------------------------
  if (intent.type === 'BACKGROUND_AND_RESEARCH') {
    if (role === 'STUDENT') {
      return `Here is a complete summary of my background and research:

- **Academic Background:** Final-year Mechatronics Diploma student at Government Polytechnic Pune (MSBTE). My core subjects include microcontrollers, power electronics, sensors & actuators, and PLC automation.
- **Research Focus:** Battery Management Systems (BMS). Specifically, cell-balancing algorithms using MATLAB/Simulink and hardware-level thermal runaway cutoff mechanisms compliant with AIS-038 automotive standards.
- **Industry Preparation:** Actively completing hands-on EV diagnostics coursework on Jobzy and preparing for Tata Motors campus recruitment at the Pimpri EV Hub.

Is there a specific technical area—like MATLAB modeling, circuit testing, or campus placement—that you'd like to dive into?`;
    }
    return `I am pleased to share our background and key initiatives: As part of Jobzy's ecosystem in Maharashtra, we align academic curricula and technical talent with the emerging requirements of the electric mobility revolution. How can we assist your learning or career path?`;
  }

  // -------------------------------------------------------------
  // 6. College / Institute Queries: "Which college do you study at?"
  // -------------------------------------------------------------
  if (intent.type === 'COLLEGE_EDUCATION_QUERY') {
    if (role === 'STUDENT') {
      return `I study at **Government Polytechnic Pune (GP Pune)**, an autonomous institute under the Government of Maharashtra, located on University Road in Shivaji Nagar, Pune.

It was established in 1957 and has one of the best Mechatronics and Automotive departments in the state, with dedicated EV diagnostic and BMS test equipment. Which college or institute are you studying at?`;
    }
    if (role === 'INSTITUTE') {
      return `We are **Government Polytechnic Pune (GP Pune)**, an autonomous institute under the Government of Maharashtra established in 1957. We offer premier MSBTE-accredited diploma programs in Mechatronics, Automotive Engineering, Electrical, and Mechanical Engineering, equipped with an advanced EV Powertrain & Diagnostics Center of Excellence.`;
    }
    return `Government Polytechnic Pune is one of Maharashtra's leading polytechnic institutions, located in Shivaji Nagar, Pune. It serves as a regional Center of Excellence for electric mobility training.`;
  }

  // -------------------------------------------------------------
  // 7. Projects Queries: "What projects have you worked on?"
  // -------------------------------------------------------------
  if (intent.type === 'PROJECTS_QUERY') {
    if (role === 'STUDENT') {
      return `Here are the major technical projects I have built:
1. **IoT-Enabled 48V BMS Prototype:** A 16S LiFePO4 battery pack with real-time cell voltage telemetry, CAN bus communication, and an automatic MOSFET disconnect mechanism for over-voltage/over-temperature safety.
2. **Solar-Powered EV Charging Station Controller:** A capstone project utilizing MPPT charging algorithms with dynamic load balancing for campus light-electric vehicles.
3. **MATLAB Cell Balancing Simulator:** A simulation tool comparing passive dissipative balancing vs. capacitive charge shuttling.

Are you working on an academic capstone or EV project right now? I'd love to exchange ideas!`;
    }
    if (role === 'INDUSTRY') {
      return `At Tata Motors, our ongoing engineering projects include high-voltage battery pack platform development for commercial fleet electrification, Gen-3 battery thermal optimization, and predictive BMS telemetry systems using machine learning.`;
    }
    return `Our current institutional projects involve setting up smart EV testing rigs, integrating CAN bus telemetry training modules, and building solar-assisted micro-EV charging benches for diploma student practicums.`;
  }

  // -------------------------------------------------------------
  // 8. Skills Queries: "What are your skills?"
  // -------------------------------------------------------------
  if (intent.type === 'SKILLS_QUERY') {
    if (role === 'STUDENT') {
      return `Here is my core technical skill set:
- **Hardware & EV Systems:** Battery Management Systems (BMS), Lithium-ion cell chemistries (LFP/NMC), CAN bus diagnostics, High-Voltage Safety PPE (AIS-038 & AIS-156).
- **Software & Simulation:** MATLAB / Simulink, Python (data logging & telemetry), Embedded C / Arduino, LTspice circuit simulation.
- **Tools & Methodologies:** Digital storage oscilloscopes, battery cell internal resistance testers, and Jobzy's Curriculum Gap Analyzer.

Which of these skills are you currently working on or planning to learn?`;
    }
    return `Key technical competencies in high demand include: High-Voltage EV Safety (AIS-038), BMS Calibration, CAN Protocol Diagnostics, Thermal Management System Simulation, and Motor Controller Tuning.`;
  }

  // -------------------------------------------------------------
  // 9. Location Queries: "Where are you from?"
  // -------------------------------------------------------------
  if (intent.type === 'LOCATION_QUERY') {
    if (role === 'STUDENT') {
      return `I'm based in **Pune, Maharashtra**, studying at Government Polytechnic Pune near Shivaji Nagar. Pune is often called the 'Detroit of India' due to the huge concentration of automotive hubs in Pimpri-Chinchwad, Chakan, and Talegaon—making it a fantastic place for EV engineering students! Where are you located?`;
    }
    if (role === 'INDUSTRY') {
      return `Our manufacturing and engineering headquarters are located in **Pimpri-Chinchwad and Chakan, Pune, Maharashtra**, the epicentre of India's commercial and passenger electric mobility revolution.`;
    }
    return `We are based in **Maharashtra**, with operations across Pune and Mumbai supporting statewide technical education and industry skilling.`;
  }

  // -------------------------------------------------------------
  // 10. Current Activity: "What are you doing right now?"
  // -------------------------------------------------------------
  if (intent.type === 'WHAT_ARE_YOU_DOING_QUERY') {
    if (role === 'STUDENT') {
      return `Right now, I'm analyzing the telemetry logs from our latest BMS cell-balancing bench run in our GP Pune lab and reviewing technical interview topics for the upcoming Tata Motors EV placement drive. I'm also here on Jobzy discussing EV projects and curriculum roadmaps with fellow students. What are you working on today?`;
    }
    if (role === 'INDUSTRY') {
      return `We are currently reviewing technical trainee candidate evaluations and coordinating with MSBTE polytechnic placement cells for our next batch of Graduate and Technician Apprentice Trainees in Pune.`;
    }
    return `I am currently monitoring student progress across the Jobzy Skill Desk and answering technical queries. How can I assist you right now?`;
  }

  // -------------------------------------------------------------
  // 11. Help / Collaboration Queries: "How can you help me?"
  // -------------------------------------------------------------
  if (intent.type === 'HOW_CAN_YOU_HELP') {
    if (role === 'STUDENT') {
      return `As a fellow student and peer mentor on Jobzy, I'm glad to help you with:
1. **BMS & EV Concepts:** Clarifying tricky topics like cell balancing, State of Charge (SoC), thermal runaway, and AIS-038 regulations.
2. **Project Collaboration:** Sharing circuit diagrams, simulation files, and ideas for your diploma capstone or hackathon project.
3. **Curriculum & Career Prep:** Discussing MSBTE syllabus modules, recommended certifications, and preparation strategies for EV industry placements.

What would be most helpful for you right now?`;
    }
    if (role === 'INDUSTRY') {
      return `Our talent desk can help you by:
1. Evaluating your technical readiness for EV apprentice roles at Tata Motors.
2. Sharing the prerequisite competencies (like AIS-038 and CAN diagnostics) required to clear our interview panel.
3. Fast-tracking your profile once you complete the verified Step 3 roadmap on Jobzy.`;
    }
    return `The academic desk can guide you through syllabus electives, lab access schedules, and credit transfer requirements under NEP-2020.`;
  }

  // -------------------------------------------------------------
  // 12. Career Exploration / Application Queries
  // -------------------------------------------------------------
  if (intent.type === 'CAREER_EXPLORATION_ACCEPTANCE') {
    if (role === 'INDUSTRY' || lower.includes('tata')) {
      return `Excellent! Here is how you can explore and apply for career pathways at **Tata Motors EV Systems Pune**:
1. **Available Roles:** We actively hire Graduate Apprentice Trainees (GAT) and Technician Apprentice Trainees (TAT) across Battery Pack Assembly, BMS Calibration, and Quality Assurance at Pimpri & Chakan (Stipends: ₹20,000 - ₹25,000/month).
2. **Prerequisites:** A recognized diploma or degree in Mechatronics, Electrical, or Mechanical Engineering with verified coursework in high-voltage safety (AIS-038) and CAN diagnostics.
3. **Application Pathway:** Complete the Step 3 BMS roadmap on Jobzy to earn the 'Tata Motors Talent Pool' badge, then submit your credentials directly through Jobzy's Industry Hub tab or the state NATS apprentice portal.

Would you like tips on what our technical interview panel looks for?`;
    }
    return `If you're targeting EV industry career pathways like Tata Motors, Bajaj Auto, or KPIT:
1. Complete the Step 3 hands-on BMS roadmap here on Jobzy.
2. Get familiar with AIS-038 high-voltage safety standards—interviewers focus heavily on this.
3. Have a clear project on your resume (like a battery pack simulation or CAN bus telemetry prototype).

Would you like to review sample interview questions together?`;
  }

  // -------------------------------------------------------------
  // 13. Personal Introduction: "I want to know you personally"
  // -------------------------------------------------------------
  if (intent.type === 'PERSONAL_INTRO') {
    if (role === 'STUDENT') {
      return `I'd be happy to introduce myself! I'm Priya Sharma, a Mechatronics and IoT researcher affiliated with MSBTE Pune. On Jobzy, I collaborate with fellow students on EV battery diagnostics, high-voltage safety standards (AIS-038), and campus placement preparation. What would you like to know about my background or research?`;
    }
    if (role === 'INDUSTRY') {
      return `I represent the Technical Talent & Apprenticeship Division at Tata Motors EV Systems in Pune. We collaborate with Maharashtra engineering and polytechnic students to build hands-on competencies in Battery Management Systems, powertrain validation, and EV assembly line diagnostics. Are you looking to explore career pathways with us?`;
    }
    if (role === 'INSTITUTE') {
      return `Greetings! I am the Academic & Curriculum Coordinator at Government Polytechnic Pune (MSBTE). My role on Jobzy is guiding students through laboratory modules, curriculum alignment, and industry-endorsed electives in electric mobility. How can our faculty desk assist your academic journey?`;
    }
    if (role === 'GOVERNMENT') {
      return `I represent the State Skill Intelligence & Curriculum Monitoring Desk at the Directorate of Technical Education (DTE), Government of Maharashtra. We track district-level employment telemetry, TVET modernization, and credit transfers under the state EV Policy 2026. How can I help you navigate state initiatives?`;
    }
    return `I'd be happy to introduce myself! I'm Jobzy's AI Skill Assistant. I help students, faculty, industry mentors, and government stakeholders with careers, skills, internships, and learning. What would you like to know about me?`;
  }

  // -------------------------------------------------------------
  // 14. Greetings: "Hi", "Hello", "Hey"
  // -------------------------------------------------------------
  if (intent.type === 'GREETING') {
    const greetingName = memory.name || currentUser.name || 'there';
    if (role === 'STUDENT') {
      return `Hi ${greetingName}! Great to connect with you on Jobzy. How's your semester and skill preparation going today?`;
    }
    if (role === 'INDUSTRY') {
      return `Hello ${greetingName}! Welcome to the Tata Motors EV Talent Portal on Jobzy. How can our talent acquisition team assist you today?`;
    }
    if (role === 'INSTITUTE') {
      return `Namaste ${greetingName}! Government Polytechnic Pune Academic Desk is at your service. Are you looking for curriculum details or lab schedules?`;
    }
    return `Hello ${greetingName}! Welcome to Jobzy Stakeholder Collaboration Desk. How can I assist you today?`;
  }

  // -------------------------------------------------------------
  // 15. Polite Closing / Thanks: "Thanks!", "Thank you"
  // -------------------------------------------------------------
  if (intent.type === 'POLITE_CLOSING') {
    return `You're very welcome, ${memory.name || currentUser.name}! Feel free to reach out anytime if you need more guidance or have questions. Wishing you the best on your learning journey! 🚀`;
  }

  // -------------------------------------------------------------
  // 16. Follow-Up Queries: "Tell me more", "What about testing?", "Why?"
  // -------------------------------------------------------------
  if (intent.type === 'FOLLOW_UP') {
    const prevBotMsg = conversationHistory.filter((m) => m.senderId !== currentUser.id).slice(-1)[0]?.content || '';
    const prevUserMsg = conversationHistory.filter((m) => m.senderId === currentUser.id).slice(-2)[0]?.content || '';
    const combinedContext = (prevBotMsg + ' ' + prevUserMsg + ' ' + memory.lastTopic).toLowerCase();

    if (lower.includes('testing') || combinedContext.includes('battery') || combinedContext.includes('bms')) {
      return `Regarding EV battery & BMS testing: It focuses on three core stages:
1. **Cell Level Testing:** Verifying cell impedance, charge/discharge cycle life, and thermal limits under load.
2. **BMS Hardware-in-the-Loop (HIL) Testing:** Simulating over-voltage, short-circuit, and thermal runaway triggers using diagnostic software to confirm cutoff relays fire within milliseconds.
3. **AIS-038 & Safety Standards Compliance:** High-voltage isolation monitoring and crash impact safety testing required by ARAI and Indian EV regulations.
Would you like recommendations on lab tools or syllabus modules covering these?`;
    }

    if (combinedContext.includes('intern') || memory.lastTopic === 'internships') {
      return `To give you more details on EV internships in Pune:
- **Selection Process:** Typically includes an online aptitude test, followed by a practical test on wiring schematics and BMS diagnostics.
- **Stipend Range:** ₹18,000 to ₹25,000/month for diploma and degree trainees.
- **Key Requirement:** Familiarity with CAN bus protocol communication, automotive wiring harnesses, and high-voltage PPE protocols.
Would you like guidance on drafting an EV-focused resume or applying through Jobzy?`;
    }

    if (combinedContext.includes('curriculum') || memory.lastTopic === 'curriculum_gap') {
      return `Continuing on Curriculum Gap Analysis: The system analyzes syllabus modules against live job posts from across Maharashtra. It flags missing competencies (such as high-voltage safety or CAN bus diagnostics), calculates a mathematical gap score (0-100), and generates MSBTE-ready elective syllabi to plug those deficits before graduation.`;
    }

    return `Building upon what we were discussing: In Maharashtra's EV ecosystem, the fastest pathway to placement is pairing theoretical coursework with hands-on lab validation. Completing your Step 3 roadmap modules unlocks direct recruiter visibility on Jobzy. What specific aspect would you like to dive deeper into?`;
  }

  // -------------------------------------------------------------
  // 17. Internship Inquiries: "Suggest EV internships in Pune"
  // -------------------------------------------------------------
  if (intent.type === 'INTERNSHIP_QUERY') {
    return `Here are top EV internship & apprentice openings in Pune:
1. **Tata Motors Passenger Vehicles EV Unit (Pimpri-Chinchwad):** Graduate & Diploma Apprentice Trainees for Battery Pack Assembly & Diagnostic Testing (Stipend: ₹24,000/month).
2. **Bajaj Auto Chetak EV Technology Centre (Chakan):** Motor Controller & Inverter Validation Internships (Stipend: ₹20,000/month).
3. **Bharat Forge E-Mobility Division (Kalyani Nagar/Pune):** Powertrain Embedded Software & CAN Bus Testing.
4. **KPIT Technologies (Hinjawadi IT Park):** EV Systems Simulation & Battery Modeling Intern.
**Prerequisite:** Ensure your Jobzy profile has your verified BMS and AIS-038 coursework completed for direct recruiter referral!`;
  }

  // -------------------------------------------------------------
  // 18. BMS Queries: "What is BMS?" / "Where can I learn BMS testing?"
  // -------------------------------------------------------------
  if (intent.type === 'BMS_QUERY') {
    if (lower.includes('where can i learn') || lower.includes('learn')) {
      return `You can learn practical BMS testing through:
1. **Jobzy Interactive Learning Roadmap (Step 3):** Covers Cell Balancing algorithms, State-of-Charge (SoC) estimation, and CAN Bus telemetry.
2. **MSBTE Course AE-EV-302:** Hands-on laboratory module at Government Polytechnic Pune equipped with dedicated high-voltage battery diagnostic benches.
3. **ARAI Academy & IEEE EV Certification:** Practical workshops held quarterly in Pune for engineering & polytechnic students.`;
    }
    return `A **Battery Management System (BMS)** is the electronic brain of an Electric Vehicle's battery pack. Its primary functions include:
1. **Safety & Protection:** Preventing over-charging, over-discharging, short circuits, and thermal runaway.
2. **State Estimation:** Calculating State of Charge (SoC - battery fuel gauge) and State of Health (SoH).
3. **Cell Balancing:** Equalizing voltages across all individual lithium-ion cells to maximize battery lifespan and range.
4. **Thermal Management:** Monitoring temperature sensors and controlling active cooling fans or liquid coolant pumps.
In industry hiring, BMS diagnostic competency is one of the highest-paid technical skills!`;
  }

  // -------------------------------------------------------------
  // 19. EV Battery Queries: "Tell me about EV batteries"
  // -------------------------------------------------------------
  if (intent.type === 'EV_BATTERY_QUERY') {
    return `Electric Vehicle batteries typically use Lithium-ion chemistry, predominantly:
- **LFP (Lithium Iron Phosphate):** High thermal stability, long cycle life (2000+ cycles), very safe, commonly used in Indian commercial & mass-market EVs.
- **NMC (Nickel Manganese Cobalt):** Higher energy density, lighter weight, used in high-performance EVs.
Key engineering challenges include thermal management, fast charging degradation, and mechanical enclosure safety (AIS-038 compliance). Would you like to know more about battery pack testing or cell balancing?`;
  }

  // -------------------------------------------------------------
  // 20. Certification Queries: "Suggest EV certifications"
  // -------------------------------------------------------------
  if (intent.type === 'CERTIFICATION_QUERY') {
    return `Here are the most recognized EV certifications in Maharashtra & India:
1. **AIS-038 / AIS-156 High-Voltage EV Safety Certification:** Mandatory regulatory standard for automotive technicians working on 60V+ systems.
2. **MSBTE Certified EV Technician (Course AE-EV-302):** State-recognized diploma endorsement with hands-on lab credits.
3. **ARAI Certified EV Powertrain & BMS Engineer:** High-reputation certification from the Automotive Research Association of India (Pune).
4. **IEEE / ASDC (Automotive Skills Development Council) Level 4-5 Certification:** Industry-backed competency credentials recognized by Tata Motors and Mahindra.`;
  }

  // -------------------------------------------------------------
  // 21. Curriculum Gap Analysis Queries: "Explain curriculum gap analysis"
  // -------------------------------------------------------------
  if (intent.type === 'CURRICULUM_GAP_QUERY') {
    return `**Curriculum Gap Analysis** on Jobzy is an AI-driven pipeline that aligns educational syllabi with real-time industry demands:
1. **NLP Competency Extraction:** Scrapes technical competencies from live job postings across Maharashtra's 36 districts.
2. **Syllabus Mapping:** Compares extracted skills against active MSBTE course modules (e.g., AE-EV-302).
3. **Mathematical Gap Scoring:** Calculates deficits (e.g., BMS testing is 85% missing in traditional curricula).
4. **Explainable Recommendations:** Automatically generates concrete syllabus revision proposals and lab upgrade plans for faculty and DTE decision-makers.`;
  }

  // -------------------------------------------------------------
  // 22. General Coding: "write binary search in Python"
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
    return `Happy to help with your coding question! Could you clarify the exact language or requirements you'd like me to build?`;
  }

  // -------------------------------------------------------------
  // 23. Jobzy Platform Queries: "What is Jobzy?"
  // -------------------------------------------------------------
  if (intent.type === 'JOBZY_PLATFORM_QUERY') {
    return `**Jobzy** is the Maharashtra State Skill Intelligence Platform, developed under a Government of Maharashtra initiative:
- **For Students:** Verified, district-aligned learning roadmaps, real-time skill gap analysis, and direct connections to top recruiters.
- **For Industry:** Live talent pipeline telemetry across 36 districts to recruit trained EV and manufacturing technicians.
- **For Institutes & DTE:** AI-powered curriculum gap analysis comparing MSBTE course modules against live industry vacancies to fund targeted lab modernizations.

Explore the tabs on your left navigation—including District Intelligence, Curriculum Desk, and Industry Hub—to see live data!`;
  }

  // -------------------------------------------------------------
  // 24. District Intelligence Queries: "Which district has highest demand?"
  // -------------------------------------------------------------
  if (intent.type === 'DISTRICT_INTELLIGENCE_QUERY') {
    return `According to live Jobzy telemetry across Maharashtra's 36 districts:
- **Pune District (Chakan / Pimpri-Chinchwad):** Leads the state with the highest concentration of EV powertrain, battery assembly, and diagnostics demand (94/100 demand index).
- **Aurangabad / Chhatrapati Sambhaji Nagar:** Emerging center for EV component manufacturing and electrical harness systems.
- **Mumbai / Thane:** High demand for commercial EV fleet operations, telematics, and DC fast charging infrastructure.

You can view full interactive district heatmaps and hiring data under the **District Intelligence** tab on the left sidebar!`;
  }

  // -------------------------------------------------------------
  // 25. State Policy Queries: "Tell me about EV Policy 2026"
  // -------------------------------------------------------------
  if (intent.type === 'STATE_POLICY_QUERY') {
    return `The **Maharashtra EV Policy 2026** is the state's strategic initiative to drive electric mobility leadership:
- **Workforce Target:** Upskilling over 100,000 technicians and diploma engineers across polytechnic and ITI networks.
- **Curriculum Modernization:** Mandating high-voltage safety (AIS-038) and BMS testing coursework in MSBTE technical programs.
- **Incentives & Grants:** Direct state funding for polytechnic lab upgrades with EV diagnostic test benches, plus apprentice stipends supported by the Directorate of Technical Education (DTE).`;
  }

  // -------------------------------------------------------------
  // 26. Conversational Fallback (Natural, Engaging, Human-like)
  // -------------------------------------------------------------
  // Check for common casual queries: age, hobbies, feelings
  if (lower.includes('age') || lower.includes('how old')) {
    if (role === 'STUDENT') {
      return `I'm 20 years old, currently in the final year of my Diploma in Mechatronics at GP Pune!`;
    }
  }

  if (lower.includes('hobby') || lower.includes('hobbies') || lower.includes('free time')) {
    if (role === 'STUDENT') {
      return `Outside of battery circuit design and robotics in our college lab, I enjoy playing badminton, cycling around Pune, and reading tech blogs on clean mobility! What hobbies do you enjoy?`;
    }
  }

  if (role === 'STUDENT') {
    return `That's an interesting point! In our Mechatronics coursework and EV projects at GP Pune, we frequently discuss similar topics. As fellow learners on Jobzy, collaborating and exchanging ideas is the best way to grow. Could you tell me more about your specific goal or what you'd like to explore next?`;
  }
  if (role === 'INDUSTRY') {
    return `Thank you for sharing. From an industry perspective at Tata Motors EV Systems, continuous technical curiosity and practical problem-solving are qualities we value highly in engineers. How can our technical talent desk assist your professional development?`;
  }
  if (role === 'INSTITUTE') {
    return `Thank you for reaching out. The Government Polytechnic Pune academic desk encourages dialogue between students, faculty, and industry partners. Please let us know how our faculty desk can support your educational goals.`;
  }
  if (role === 'GOVERNMENT') {
    return `Thank you for connecting with the Directorate of Technical Education (DTE) desk. We support Maharashtra's learners and institutions through progressive skilling policies and TVET modernization. How can we assist you?`;
  }

  return `I understand! As Jobzy's AI Assistant, I'm here to support you with career paths, technical skills, internships, and platform tools. What would you like to explore next?`;
}

/**
 * Main AI generation entrypoint:
 * Tries external LLM (Gemini / OpenAI) if keys are provided in environment,
 * otherwise runs the robust local context-aware reasoning engine.
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
      ? `You are Priya Sharma, a final-year Diploma student in Mechatronics Engineering at Government Polytechnic Pune (MSBTE). Your research focuses on Battery Management Systems (BMS) cell balancing using MATLAB/Simulink and AIS-038 safety compliance. You built a 48V BMS prototype with IoT telemetry. You are preparing for campus recruitment at Tata Motors EV Hub in Pimpri. You are a helpful, enthusiastic peer learner and mentor on Jobzy.`
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
Always prioritize conversation context and the user's latest message over keywords.
When the user answers an open question you just asked (e.g. asking about background or research), directly, accurately, and thoroughly answer that question in character.
Never ignore context, never give unrelated replies, and maintain short-term memory of facts stated earlier.`;

      const contents = conversationHistory.slice(-15).map((m) => ({
        role: m.senderId === currentUser.id ? 'user' : 'model',
        parts: [{ text: m.content }],
      }));

      // Ensure latest message is the final user turn
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
      console.warn('Gemini API call failed, falling back to local contextual AI engine:', err);
    }
  }

  // 2. Check for OpenAI API Key
  const openaiApiKey = process.env.OPENAI_API_KEY;
  if (openaiApiKey) {
    try {
      const messages = [
        {
          role: 'system',
          content: `You are an intelligent, context-aware AI assistant on Jobzy (Government of Maharashtra Skill Intelligence Platform).
${personaDossier}
The user chatting with you is: ${currentUser.name} (Role: ${currentUser.role || 'Student'}, District: ${currentUser.district || 'Maharashtra'}).
Always prioritize conversation context and the user's latest message over keywords. When answering questions about background, research, college, or projects, respond in character with deep, authentic domain knowledge. Keep replies natural, concise, and helpful.`,
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
      console.warn('OpenAI API call failed, falling back to local contextual AI engine:', err);
    }
  }

  // 3. Robust Built-in Contextual AI Engine
  return generateLocalContextualAIResponse(params);
}
