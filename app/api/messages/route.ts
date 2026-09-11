import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { AuthService } from '@/lib/auth';
import { generateAIResponse } from '@/lib/ai-assistant';

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

    // Context-Aware AI Conversation Generation (History + Memory + Persona)
    let replyMessage = null;

    try {
      // Fetch chronological conversation history between these two users (last 20 messages)
      const rawHistory = await db.message.findMany({
        where: {
          OR: [
            { senderId: currentUser.id, receiverId: receiver.id },
            { senderId: receiver.id, receiverId: currentUser.id },
          ],
        },
        orderBy: { createdAt: 'asc' },
        take: 20,
      });

      const formattedHistory = rawHistory.map((m) => ({
        id: m.id,
        senderId: m.senderId,
        receiverId: m.receiverId,
        role: (m.senderId === currentUser.id ? 'user' : 'assistant') as 'user' | 'assistant',
        content: m.content,
        createdAt: m.createdAt,
      }));

      const replyText = await generateAIResponse({
        currentUser: {
          id: currentUser.id,
          name: currentUser.name,
          role: currentUser.role,
          district: currentUser.district || 'Pune',
        },
        stakeholder: {
          name: receiver.name,
          role: receiver.role as any,
          headline: receiver.profile?.headline || undefined,
          organization: receiver.organization?.name || undefined,
        },
        conversationHistory: formattedHistory,
        latestMessage: content.trim(),
      });

      if (replyText && replyText.trim()) {
        replyMessage = await db.message.create({
          data: {
            senderId: receiver.id,
            receiverId: currentUser.id,
            content: replyText.trim(),
          },
        });
      }
    } catch (aiErr) {
      console.error('Error generating AI reply:', aiErr);
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

export async function DELETE(req: NextRequest) {
  try {
    let currentUser = await AuthService.getCurrentUser();
    if (!currentUser) {
      const defaultUser = await db.user.findFirst({ where: { role: 'STUDENT' } });
      if (defaultUser) currentUser = defaultUser as any;
    }
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const targetUserId = searchParams.get('targetUserId');

    if (!targetUserId) {
      return NextResponse.json({ error: 'targetUserId is required' }, { status: 400 });
    }

    await db.message.deleteMany({
      where: {
        OR: [
          { senderId: currentUser.id, receiverId: targetUserId },
          { senderId: targetUserId, receiverId: currentUser.id },
        ],
      },
    });

    return NextResponse.json({ success: true, message: 'Conversation cleared' });
  } catch (error: any) {
    console.error('Error clearing conversation:', error);
    return NextResponse.json({ error: 'Failed to clear conversation' }, { status: 500 });
  }
}
