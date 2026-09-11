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
    // Only inspect user messages for user-stated facts
    const isUserMsg = msg.role === 'user' || (currentUser.name && msg.senderName === currentUser.name);
    if (!isUserMsg) continue;

    const text = msg.content;
    const lower = text.toLowerCase();

    // Name detection from user statements
    const nameMatch = text.match(/(?:my name is|call me|name's)\s+([A-Za-z]+(?:\s+[A-Za-z]+)?)/i);
    if (nameMatch && nameMatch[1] && !['Jobzy', 'Priya', 'Tata', 'Doing'].includes(nameMatch[1])) {
      memory.name = nameMatch[1].trim();
    }

    // City detection
    const cityMatch = lower.match(/(?:live in|from|located in|at)\s+(pune|mumbai|nagpur|nashik|aurangabad|kolhapur|thane)/);
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
    } else if (lower.includes('intern') || lower.includes('job') || lower.includes('placement')) {
      memory.lastTopic = 'internships';
      memory.allTopics.push('internships');
    } else if (lower.includes('curriculum') || lower.includes('gap') || lower.includes('syllabus')) {
      memory.lastTopic = 'curriculum_gap';
      memory.allTopics.push('curriculum_gap');
    } else if (lower.includes('certif') || lower.includes('ais-038') || lower.includes('course')) {
      memory.lastTopic = 'certifications';
      memory.allTopics.push('certifications');
    }
  }

  return memory;
}

/**
 * Determines the conversational intent of the latest user message
 */
function detectIntent(
  message: string,
  history: ChatMessage[],
  memory: UserMemory
): {
  type:
    | 'MEMORY_QUERY'
    | 'NAME_STATEMENT'
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
    | 'GENERAL_KNOWLEDGE'
    | 'GENERAL_CHAT';
  confidence: number;
} {
  const lower = message.toLowerCase().trim();

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

  // 2. Personal Introduction / "Know you personally"
  if (
    lower.includes('know you personally') ||
    lower.includes('know more about you') ||
    lower.includes('who are you') ||
    lower.includes('tell me about yourself') ||
    lower.includes('introduce yourself') ||
    lower.includes('what do you do') ||
    lower === 'about you'
  ) {
    return { type: 'PERSONAL_INTRO', confidence: 0.95 };
  }

  // 3. Polite greetings
  if (
    lower === 'hi' ||
    lower === 'hello' ||
    lower === 'hey' ||
    lower === 'hey there' ||
    lower === 'namaste' ||
    lower.startsWith('hi ') ||
    lower.startsWith('hello ') ||
    lower.startsWith('hey ')
  ) {
    return { type: 'GREETING', confidence: 0.9 };
  }

  // 4. Polite closing / thanks
  if (
    lower.includes('thank') ||
    lower.includes('thx') ||
    lower.includes('dhanyawad') ||
    lower === 'thanks' ||
    lower === 'thanks!' ||
    lower === 'bye' ||
    lower === 'goodbye'
  ) {
    return { type: 'POLITE_CLOSING', confidence: 0.9 };
  }

  // 5. Follow-up expressions ("tell me more", "what about testing", "why?", "explain", "how?")
  if (
    lower === 'tell me more' ||
    lower === 'tell me more.' ||
    lower.includes('tell me more about') ||
    lower === 'explain' ||
    lower === 'explain further' ||
    lower === 'what about testing?' ||
    lower === 'what about testing' ||
    lower === 'why?' ||
    lower === 'how?' ||
    lower === 'and then?' ||
    lower === 'more details' ||
    lower === 'elaborate'
  ) {
    return { type: 'FOLLOW_UP', confidence: 0.9 };
  }

  // 6. Internship / Job Queries
  if (
    lower.includes('intern') ||
    lower.includes('job opening') ||
    lower.includes('openings in pune') ||
    lower.includes('placement drive') ||
    lower.includes('vacancy') ||
    lower.includes('hire') ||
    (lower.includes('pune') && (lower.includes('job') || lower.includes('work')))
  ) {
    return { type: 'INTERNSHIP_QUERY', confidence: 0.85 };
  }

  // 7. BMS specific queries
  if (
    lower.includes('what is bms') ||
    lower.includes('bms testing') ||
    lower.includes('battery management system') ||
    lower.includes('learn bms')
  ) {
    return { type: 'BMS_QUERY', confidence: 0.9 };
  }

  // 8. General EV Batteries
  if (lower.includes('ev battery') || lower.includes('ev batteries') || lower.includes('lithium-ion')) {
    return { type: 'EV_BATTERY_QUERY', confidence: 0.85 };
  }

  // 9. Certification queries
  if (
    lower.includes('certif') ||
    lower.includes('ais-038') ||
    lower.includes('what courses') ||
    lower.includes('suggest courses')
  ) {
    return { type: 'CERTIFICATION_QUERY', confidence: 0.85 };
  }

  // 10. Curriculum gap analysis
  if (
    lower.includes('curriculum gap') ||
    lower.includes('skill gap analysis') ||
    lower.includes('gap analysis') ||
    lower.includes('how does gap work')
  ) {
    return { type: 'CURRICULUM_GAP_QUERY', confidence: 0.9 };
  }

  // 11. Coding queries
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
function generateLocalContextualAIResponse(params: {
  currentUser: { id: string; name: string; role?: string; district?: string };
  stakeholder: StakeholderPersona;
  conversationHistory: ChatMessage[];
  latestMessage: string;
}): string {
  const { currentUser, stakeholder, conversationHistory, latestMessage } = params;
  const memory = extractSessionMemory(conversationHistory, currentUser);
  const intent = detectIntent(latestMessage, conversationHistory, memory);
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
  // 2. Personal Introduction: "I want to know you personally"
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
    // Default AI Assistant introduction (as specified in user prompt)
    return `I'd be happy to introduce myself! I'm Jobzy's AI Skill Assistant. I help students, faculty, industry mentors, and government stakeholders with careers, skills, internships, and learning. What would you like to know about me?`;
  }

  // -------------------------------------------------------------
  // 3. Greetings: "Hi", "Hello", "Hey"
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
  // 4. Polite Closing / Thanks: "Thanks!", "Thank you"
  // -------------------------------------------------------------
  if (intent.type === 'POLITE_CLOSING') {
    return `You're very welcome, ${memory.name || currentUser.name}! Feel free to reach out anytime if you need more guidance or have questions. Wishing you the best on your learning journey! 🚀`;
  }

  // -------------------------------------------------------------
  // 5. Follow-Up Queries: "Tell me more", "What about testing?", "Why?"
  // -------------------------------------------------------------
  if (intent.type === 'FOLLOW_UP') {
    // Check what the previous message or topic was
    const prevBotMsg = conversationHistory.filter((m) => m.senderId !== currentUser.id).slice(-1)[0]?.content || '';
    const prevUserMsg = conversationHistory.filter((m) => m.senderId === currentUser.id).slice(-2)[0]?.content || '';
    const combinedContext = (prevBotMsg + ' ' + prevUserMsg + ' ' + memory.lastTopic).toLowerCase();

    // If follow up is about testing in context of batteries / BMS
    if (lower.includes('testing') || combinedContext.includes('battery') || combinedContext.includes('bms')) {
      return `Regarding EV battery & BMS testing: It focuses on three core stages:
1. **Cell Level Testing:** Verifying cell impedance, charge/discharge cycle life, and thermal limits under load.
2. **BMS Hardware-in-the-Loop (HIL) Testing:** Simulating over-voltage, short-circuit, and thermal runaway triggers using diagnostic software to confirm cutoff relays fire within milliseconds.
3. **AIS-038 & Safety Standards Compliance:** High-voltage isolation monitoring and crash impact safety testing required by ARAI and Indian EV regulations.
Would you like recommendations on lab tools or syllabus modules covering these?`;
    }

    // If follow up is about internships
    if (combinedContext.includes('intern') || memory.lastTopic === 'internships') {
      return `To give you more details on EV internships in Pune:
- **Selection Process:** Typically includes an online aptitude test, followed by a practical test on wiring schematics and BMS diagnostics.
- **Stipend Range:** ₹18,000 to ₹25,000/month for diploma and degree trainees.
- **Key Requirement:** Familiarity with CAN bus protocol communication, automotive wiring harnesses, and high-voltage PPE protocols.
Would you like guidance on drafting an EV-focused resume or applying through Jobzy?`;
    }

    // If follow up is about curriculum gap
    if (combinedContext.includes('curriculum') || memory.lastTopic === 'curriculum_gap') {
      return `Continuing on Curriculum Gap Analysis: The system analyzes syllabus modules against live job posts from across Maharashtra. It flags missing competencies (such as high-voltage safety or CAN bus diagnostics), calculates a mathematical gap score (0-100), and generates MSBTE-ready elective syllabi to plug those deficits before graduation.`;
    }

    // General "tell me more" continuation
    return `Building upon what we were discussing: In Maharashtra's EV ecosystem, the fastest pathway to placement is pairing theoretical coursework with hands-on lab validation. Completing your Step 3 roadmap modules unlocks direct recruiter visibility on Jobzy. What specific aspect would you like to dive deeper into?`;
  }

  // -------------------------------------------------------------
  // 6. Internship Inquiries: "Suggest EV internships in Pune"
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
  // 7. BMS Queries: "What is BMS?" / "Where can I learn BMS testing?"
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
  // 8. EV Battery Queries: "Tell me about EV batteries"
  // -------------------------------------------------------------
  if (intent.type === 'EV_BATTERY_QUERY') {
    return `Electric Vehicle batteries typically use Lithium-ion chemistry, predominantly:
- **LFP (Lithium Iron Phosphate):** High thermal stability, long cycle life (2000+ cycles), very safe, commonly used in Indian commercial & mass-market EVs.
- **NMC (Nickel Manganese Cobalt):** Higher energy density, lighter weight, used in high-performance EVs.
Key engineering challenges include thermal management, fast charging degradation, and mechanical enclosure safety (AIS-038 compliance). Would you like to know more about battery pack testing or cell balancing?`;
  }

  // -------------------------------------------------------------
  // 9. Certification Queries: "Suggest EV certifications"
  // -------------------------------------------------------------
  if (intent.type === 'CERTIFICATION_QUERY') {
    return `Here are the most recognized EV certifications in Maharashtra & India:
1. **AIS-038 / AIS-156 High-Voltage EV Safety Certification:** Mandatory regulatory standard for automotive technicians working on 60V+ systems.
2. **MSBTE Certified EV Technician (Course AE-EV-302):** State-recognized diploma endorsement with hands-on lab credits.
3. **ARAI Certified EV Powertrain & BMS Engineer:** High-reputation certification from the Automotive Research Association of India (Pune).
4. **IEEE / ASDC (Automotive Skills Development Council) Level 4-5 Certification:** Industry-backed competency credentials recognized by Tata Motors and Mahindra.`;
  }

  // -------------------------------------------------------------
  // 10. Curriculum Gap Analysis Queries: "Explain curriculum gap analysis"
  // -------------------------------------------------------------
  if (intent.type === 'CURRICULUM_GAP_QUERY') {
    return `**Curriculum Gap Analysis** on Jobzy is an AI-driven pipeline that aligns educational syllabi with real-time industry demands:
1. **NLP Competency Extraction:** Scrapes technical competencies from live job postings across Maharashtra's 36 districts.
2. **Syllabus Mapping:** Compares extracted skills against active MSBTE course modules (e.g., AE-EV-302).
3. **Mathematical Gap Scoring:** Calculates deficits (e.g., BMS testing is 85% missing in traditional curricula).
4. **Explainable Recommendations:** Automatically generates concrete syllabus revision proposals and lab upgrade plans for faculty and DTE decision-makers.`;
  }

  // -------------------------------------------------------------
  // 11. General Coding: "write binary search in Python"
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
  // 12. General Conversational Fallback (Natural, Engaging, Human-like)
  // -------------------------------------------------------------
  if (role === 'STUDENT') {
    return `That's a thoughtful point! As fellow learners on Jobzy, collaborating and exchanging ideas is the best way to stay ahead. Are you working on a particular project or technical topic right now that I can help with?`;
  }
  if (role === 'INDUSTRY') {
    return `Thank you for sharing your thoughts. From an industry perspective at Tata Motors, continuous technical curiosity and practical problem-solving are key qualities we look for in engineers. How can we assist your professional development?`;
  }
  if (role === 'INSTITUTE') {
    return `Thank you for reaching out. The Government Polytechnic Pune academic desk encourages open dialogue between students, faculty, and industry partners. Please let us know how we can support your educational goals.`;
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

  // 1. Check for Google Gemini API Key
  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (geminiApiKey) {
    try {
      const systemInstruction = `You are Jobzy AI Assistant, an intelligent career and skill guidance assistant for the Government of Maharashtra Skill Intelligence Platform.
You are currently interacting as or on behalf of: ${stakeholder.name} (${stakeholder.role} - ${stakeholder.headline || stakeholder.organization || 'Ecosystem Partner'}).
The user chatting with you is: ${currentUser.name} (Role: ${currentUser.role || 'Student'}, District: ${currentUser.district || 'Maharashtra'}).
Always prioritize conversation context and the user's latest message over keywords. Maintain short-term memory of facts stated in the conversation. Respond naturally, accurately, and politely. Never generate unrelated or hardcoded replies.`;

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
          content: `You are Jobzy AI Assistant, an intelligent career and skill guidance assistant for the Government of Maharashtra Skill Intelligence Platform. You are representing ${stakeholder.name} (${stakeholder.role}). User is ${currentUser.name}. Respond with context awareness, short-term memory, and helpful concise domain expertise.`,
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
