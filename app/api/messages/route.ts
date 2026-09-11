import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { AuthService } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    let currentUser = await AuthService.getCurrentUser();

    // Fallback to default student if browsing without active session
    if (!currentUser) {
      const defaultUser = await db.user.findFirst({
        where: { role: 'STUDENT' },
      });
      if (defaultUser) {
        currentUser = {
          id: defaultUser.id,
          name: defaultUser.name,
          email: defaultUser.email,
          role: defaultUser.role as any,
          district: 'Pune',
          isVerified: true,
        };
      }
    }

    if (!currentUser) {
      return NextResponse.json({ error: 'No active user found' }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const targetUserId = searchParams.get('targetUserId');

    // 1. Fetch thread between currentUser and targetUserId
    if (targetUserId) {
      const targetUser = await db.user.findUnique({
        where: { id: targetUserId },
        include: { profile: true, organization: true, institute: true },
      });

      if (!targetUser) {
        return NextResponse.json({ error: 'Target user not found' }, { status: 404 });
      }

      const messages = await db.message.findMany({
        where: {
          OR: [
            { senderId: currentUser.id, receiverId: targetUserId },
            { senderId: targetUserId, receiverId: currentUser.id },
          ],
        },
        orderBy: { createdAt: 'asc' },
      });

      // Mark received messages as read
      await db.message.updateMany({
        where: {
          senderId: targetUserId,
          receiverId: currentUser.id,
          isRead: false,
        },
        data: { isRead: true },
      });

      return NextResponse.json({
        success: true,
        messages,
        currentUserId: currentUser.id,
        targetUser: {
          id: targetUser.id,
          name: targetUser.name,
          role: targetUser.role,
          headline:
            targetUser.profile?.headline ||
            (targetUser.role === 'INDUSTRY'
              ? `${targetUser.organization?.name || 'Tata Motors EV'} • Pune Hub`
              : targetUser.role === 'INSTITUTE'
              ? `${targetUser.institute?.name || 'Govt. Polytechnic Pune'} • MSBTE`
              : targetUser.role === 'GOVERNMENT'
              ? 'Directorate of Technical Education • Maharashtra'
              : 'Skill Intelligence Network'),
        },
      });
    }

    // 2. Fetch list of all real platform contacts from DB
    const allUsers = await db.user.findMany({
      where: {
        id: { not: currentUser.id },
      },
      include: {
        profile: true,
        organization: true,
        institute: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    const contactsWithMeta = await Promise.all(
      allUsers.map(async (u) => {
        const lastMsg = await db.message.findFirst({
          where: {
            OR: [
              { senderId: currentUser!.id, receiverId: u.id },
              { senderId: u.id, receiverId: currentUser!.id },
            ],
          },
          orderBy: { createdAt: 'desc' },
        });

        let headline = u.profile?.headline;
        if (!headline) {
          if (u.role === 'INDUSTRY') {
            headline = `${u.organization?.name || 'Automotive Talent Desk'} • Pune Hub`;
          } else if (u.role === 'INSTITUTE') {
            headline = `${u.institute?.name || 'Govt. Polytechnic Pune'} • MSBTE`;
          } else if (u.role === 'GOVERNMENT') {
            headline = 'Directorate of Technical Education (DTE) • Mantralaya';
          } else if (u.role === 'STUDENT') {
            headline = 'Mechatronics & EV Research • Maharashtra';
          } else {
            headline = 'State Skill Registry';
          }
        }

        return {
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          headline,
          lastMessage: lastMsg?.content || null,
          lastMessageTime: lastMsg?.createdAt || null,
        };
      })
    );

    return NextResponse.json({
      success: true,
      contacts: contactsWithMeta,
      currentUserId: currentUser.id,
    });
  } catch (error: any) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    let currentUser = await AuthService.getCurrentUser();

    // Fallback to default student if not logged in
    if (!currentUser) {
      const defaultUser = await db.user.findFirst({
        where: { role: 'STUDENT' },
      });
      if (defaultUser) {
        currentUser = {
          id: defaultUser.id,
          name: defaultUser.name,
          email: defaultUser.email,
          role: defaultUser.role as any,
          district: 'Pune',
          isVerified: true,
        };
      }
    }

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized: No active session' }, { status: 401 });
    }

    const { receiverId, content } = await req.json();

    if (!receiverId || !content?.trim()) {
      return NextResponse.json({ error: 'Receiver ID and content are required' }, { status: 400 });
    }

    // Verify receiver exists in database
    let receiver = await db.user.findUnique({
      where: { id: receiverId },
      include: { profile: true, organization: true },
    });

    if (!receiver) {
      // Fallback to another valid user in DB
      receiver = await db.user.findFirst({
        where: { id: { not: currentUser.id } },
        include: { profile: true, organization: true },
      });
    }

    if (!receiver) {
      return NextResponse.json({ error: 'Recipient user not found' }, { status: 404 });
    }

    // Create user's message in database
    const message = await db.message.create({
      data: {
        senderId: currentUser.id,
        receiverId: receiver.id,
        content: content.trim(),
      },
    });

    // Notify receiver
    try {
      await db.notification.create({
        data: {
          userId: receiver.id,
          title: `New message from ${currentUser.name}`,
          message: content.length > 60 ? `${content.slice(0, 60)}...` : content,
          type: 'INFO',
          link: '/messages',
        },
      });
    } catch {
      // Silent error handling for notifications
    }

    // Smart interactive auto-reply for live demo simulation
    let replyMessage = null;
    const lower = content.toLowerCase().trim();

    // Fetch conversation history between these two users to provide dynamic context
    const previousMessages = await db.message.findMany({
      where: {
        OR: [
          { senderId: currentUser.id, receiverId: receiver.id },
          { senderId: receiver.id, receiverId: currentUser.id },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: 8,
    });

    const lastBotMsg = previousMessages.find((m) => m.senderId === receiver.id)?.content || '';
    const userMsgCount = previousMessages.filter((m) => m.senderId === currentUser.id).length;

    let replyText = '';

    // Helpers to detect intent
    const isGreeting =
      lower.includes('hi') ||
      lower.includes('hello') ||
      lower.includes('hey') ||
      lower.includes('whatsup') ||
      lower.includes("what's up") ||
      lower.includes('sup') ||
      lower.includes('namaste');

    const isAffirmative =
      lower === 'yes' ||
      lower === 'yeah' ||
      lower === 'yep' ||
      lower === 'yup' ||
      lower === 'sure' ||
      lower === 'ha' ||
      lower === 'haan' ||
      lower === 'definitely' ||
      lower.startsWith('yes ');

    const isNegative =
      lower === 'no' ||
      lower === 'nope' ||
      lower === 'nah' ||
      lower === 'nahi' ||
      lower.includes('not yet');

    const isThanks =
      lower.includes('thank') ||
      lower.includes('thx') ||
      lower.includes('dhanyawad') ||
      lower === 'ok' ||
      lower === 'okay' ||
      lower === 'great';

    if (receiver.role === 'STUDENT') {
      if (isGreeting && userMsgCount <= 1) {
        replyText = `Hey! All good here, just going through the new EV Powertrain & BMS syllabus modules on Jobzy. Are you preparing for the campus placement drive in Pune?`;
      } else if (isAffirmative) {
        if (lastBotMsg.includes('placement') || lastBotMsg.includes('drive')) {
          replyText = `Awesome! Are you focusing more on Battery Management Systems (BMS) diagnostics or motor controller testing? I found the BMS lab in Step 3 super helpful!`;
        } else if (lastBotMsg.includes('BMS') || lastBotMsg.includes('notes')) {
          replyText = `Great! I've uploaded my circuit diagram summary to the shared repository. Let me know if you want to cross-check AIS-038 safety notes too.`;
        } else {
          replyText = `Sounds great! Collaborative study makes tackling the MSBTE curriculum a lot smoother. Have you tried the Skill Gap tool yet?`;
        }
      } else if (isNegative) {
        replyText = `No worries at all! There is still time before the drive. If you want, we can practice the AIS-038 high-voltage safety questions together.`;
      } else if (lower.includes('roadmap') || lower.includes('lab') || lower.includes('step') || lower.includes('cert')) {
        replyText = `I just completed the AIS-038 high-voltage safety certification! The BMS practical lab in Step 3 really helped solidify the diagnostics concepts.`;
      } else if (lower.includes('how are you') || lower.includes('kaise ho') || lower.includes('kya chal raha')) {
        replyText = `I'm doing well! Working on a mechatronics mini-project on regenerative braking telemetry. How about your coursework?`;
      } else if (isThanks) {
        replyText = `Anytime! Glad to connect on Jobzy. Let's keep in touch and all the best with your prep! 🚀`;
      } else {
        const studentPool = [
          `That's interesting! Have you checked the District Intelligence tab on Jobzy? Pune has the highest demand for EV Diagnostics right now.`,
          `Totally agree. Make sure to complete Step 3 on your learning roadmap to earn your certified digital badge!`,
          `Got it! Let's stay connected as the placement rounds draw closer. Good luck with your studies!`,
          `Agreed! Let me know if you come across any good mock test papers for high-voltage EV safety.`,
        ];
        replyText = studentPool[userMsgCount % studentPool.length];
      }
    } else if (receiver.role === 'INDUSTRY') {
      if (isGreeting && userMsgCount <= 1) {
        replyText = `Hello ${currentUser.name}! Welcome to the Tata Motors EV Talent Portal. Are you currently exploring diploma or graduate apprentice openings in Pune?`;
      } else if (isAffirmative) {
        replyText = `Excellent! Please ensure your Jobzy profile has your verified MSBTE scorecard and BMS lab certification. We are shortlisting candidates for our next assessment round.`;
      } else if (isNegative) {
        replyText = `Understood. You can bookmark our opening on Jobzy and apply whenever you complete the prerequisite EV Safety and BMS modules.`;
      } else if (lower.includes('intern') || lower.includes('job') || lower.includes('hire') || lower.includes('opening') || lower.includes('vacancy')) {
        replyText = `We currently have 25 active apprentice openings for EV Battery Diagnostics in our Pimpri Pune facility. Stipend starts at ₹24,000/month during training.`;
      } else if (lower.includes('stipend') || lower.includes('salary') || lower.includes('pay') || lower.includes('package')) {
        replyText = `Apprentice stipends start at ₹24,000/month during the 1-year training period, with conversion opportunities to permanent Junior EV Engineer based on performance evaluation.`;
      } else if (lower.includes('bms') || lower.includes('battery') || lower.includes('skill') || lower.includes('training')) {
        replyText = `Candidates demonstrating practical Battery Management System (BMS) testing and AIS-038 compliance get top priority in our technical evaluation rounds.`;
      } else if (isThanks) {
        replyText = `Thank you for your interest in Tata Motors EV Systems Division. Feel free to ping here anytime regarding your application status.`;
      } else {
        const industryPool = [
          `Thank you for the update. Our talent acquisition desk continuously monitors candidate readiness scores on Jobzy.`,
          `We value proactive learners. Keep building your competencies and make sure your verified credentials are up to date.`,
          `Your profile activity has been noted. We look forward to seeing your completed roadmap milestones in the talent pipeline.`,
        ];
        replyText = industryPool[userMsgCount % industryPool.length];
      }
    } else if (receiver.role === 'INSTITUTE') {
      if (isGreeting && userMsgCount <= 1) {
        replyText = `Namaste ${currentUser.name}! Government Polytechnic Pune Academic Guidance Desk is active. Are you seeking MSBTE curriculum guidelines or lab schedule details?`;
      } else if (isAffirmative) {
        replyText = `The EV Diagnostic Laboratory is open Monday through Friday for registered students. Faculty consultation hours are 2 PM to 5 PM.`;
      } else if (isNegative) {
        replyText = `Understood. Please let the department desk know if you require access to lab hardware or simulation software.`;
      } else if (lower.includes('syllabus') || lower.includes('course') || lower.includes('curriculum')) {
        replyText = `Course AE-EV-302 has been updated with 20 hours of industry-aligned BMS diagnostic coursework approved by MSBTE.`;
      } else {
        replyText = `Academic records and lab rubrics are synchronized weekly with the Maharashtra State Board of Technical Education.`;
      }
    } else if (receiver.role === 'GOVERNMENT') {
      if (isGreeting) {
        replyText = `Directorate of Technical Education (DTE) State Skill Desk online. We monitor district-level skill telemetry across 36 Maharashtra districts.`;
      } else if (isAffirmative) {
        replyText = `State scholarship and industry internship credits under the Maharashtra EV Policy 2026 are tracked automatically via Jobzy.`;
      } else {
        replyText = `Transmission recorded in the state workforce intelligence registry. District skill deficits are updated in live state telemetry.`;
      }
    }

    // Safety check: ensure reply is never identical to immediate previous bot message
    if (replyText && replyText === lastBotMsg) {
      replyText = `Got it! Let me know if there's anything else you'd like to collaborate on.`;
    }

    if (replyText) {
      replyMessage = await db.message.create({
        data: {
          senderId: receiver.id,
          receiverId: currentUser.id,
          content: replyText,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message,
      replyMessage,
    });
  } catch (error: any) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: error?.message || 'Failed to send message' }, { status: 500 });
  }
}
