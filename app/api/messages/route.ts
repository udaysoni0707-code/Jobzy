import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { AuthService } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const currentUser = await AuthService.getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const targetUserId = searchParams.get('targetUserId');

    if (targetUserId) {
      // Fetch thread between currentUser and targetUserId
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

      return NextResponse.json({ success: true, messages });
    }

    // List recent conversation contacts
    const [sent, received] = await Promise.all([
      db.message.findMany({
        where: { senderId: currentUser.id },
        select: { receiverId: true },
        distinct: ['receiverId'],
      }),
      db.message.findMany({
        where: { receiverId: currentUser.id },
        select: { senderId: true },
        distinct: ['senderId'],
      }),
    ]);

    const contactIds = Array.from(
      new Set([...sent.map((s) => s.receiverId), ...received.map((r) => r.senderId)])
    );

    const contacts = await db.user.findMany({
      where: { id: { in: contactIds } },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
      },
    });

    return NextResponse.json({ success: true, contacts });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const currentUser = await AuthService.getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { receiverId, content } = await req.json();

    if (!receiverId || !content?.trim()) {
      return NextResponse.json({ error: 'Receiver ID and content are required' }, { status: 400 });
    }

    const message = await db.message.create({
      data: {
        senderId: currentUser.id,
        receiverId,
        content: content.trim(),
      },
    });

    // Notify receiver
    await db.notification.create({
      data: {
        userId: receiverId,
        title: `New message from ${currentUser.name}`,
        message: content.length > 50 ? `${content.slice(0, 50)}...` : content,
        type: 'INFO',
        link: '/messages',
      },
    });

    return NextResponse.json({ success: true, message });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
