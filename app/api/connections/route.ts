import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { AuthService } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    let currentUser = await AuthService.getCurrentUser();
    let userId = searchParams.get('userId') || currentUser?.id;

    if (!userId) {
      const fallbackUser = await db.user.findFirst({
        where: { role: 'STUDENT' },
      });
      if (fallbackUser) {
        userId = fallbackUser.id;
      }
    }

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const [sent, received, allUsers] = await Promise.all([
      db.connection.findMany({
        where: { requesterId: userId },
        include: {
          addressee: {
            include: { profile: true },
          },
        },
      }),
      db.connection.findMany({
        where: { addresseeId: userId },
        include: {
          requester: {
            include: { profile: true },
          },
        },
      }),
      db.user.findMany({
        where: { id: { not: userId } },
        include: { profile: true },
        take: 10,
      }),
    ]);

    const activeConnections = [
      ...sent
        .filter((c) => c.status === 'ACCEPTED')
        .map((c) => ({
          connectionId: c.id,
          status: c.status,
          user: c.addressee,
        })),
      ...received
        .filter((c) => c.status === 'ACCEPTED')
        .map((c) => ({
          connectionId: c.id,
          status: c.status,
          user: c.requester,
        })),
    ];

    const pendingRequests = received
      .filter((c) => c.status === 'PENDING')
      .map((c) => ({
        connectionId: c.id,
        user: c.requester,
      }));

    const connectedUserIds = new Set([
      ...sent.map((c) => c.addresseeId),
      ...received.map((c) => c.requesterId),
    ]);

    const discoverable = allUsers
      .filter((u) => !connectedUserIds.has(u.id))
      .map((u) => ({
        id: u.id,
        name: u.name,
        role: u.role,
        headline:
          u.profile?.headline ||
          (u.role === 'INDUSTRY'
            ? 'Industry Partner • Maharashtra Tech Ecosystem'
            : u.role === 'INSTITUTE'
            ? 'Faculty & Curriculum Expert • Technical Education'
            : u.role === 'GOVERNMENT'
            ? 'State Administrator • Directorate of Technical Education'
            : 'Student Researcher • Automotive & EV'),
        mutuals: 2,
      }));

    return NextResponse.json({
      success: true,
      activeCount: activeConnections.length,
      pendingCount: pendingRequests.length,
      connections: activeConnections,
      pendingRequests,
      discoverable,
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch connections' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { action, targetUserId, connectionId } = await req.json();
    let currentUser = await AuthService.getCurrentUser();

    if (!currentUser) {
      const fallbackUser = await db.user.findFirst({
        where: { role: 'STUDENT' },
      });
      if (fallbackUser) {
        currentUser = fallbackUser as any;
      }
    }

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (action === 'REQUEST') {
      if (!targetUserId) {
        return NextResponse.json({ error: 'Target user ID required' }, { status: 400 });
      }

      // Check if connection already exists
      const existing = await db.connection.findFirst({
        where: {
          OR: [
            { requesterId: currentUser.id, addresseeId: targetUserId },
            { requesterId: targetUserId, addresseeId: currentUser.id },
          ],
        },
      });

      if (existing) {
        return NextResponse.json({ error: 'Connection already exists or pending' }, { status: 409 });
      }

      const connection = await db.connection.create({
        data: {
          requesterId: currentUser.id,
          addresseeId: targetUserId,
          status: 'PENDING',
        },
      });

      // Notification
      await db.notification.create({
        data: {
          userId: targetUserId,
          title: 'New Connection Request',
          message: `${currentUser.name} sent you a connection request.`,
          type: 'REQUEST',
          link: '/connections',
        },
      });

      return NextResponse.json({ success: true, connection });
    }

    if (action === 'ACCEPT' || action === 'REJECT') {
      if (!connectionId) {
        return NextResponse.json({ error: 'Connection ID required' }, { status: 400 });
      }

      const updated = await db.connection.update({
        where: { id: connectionId },
        data: {
          status: action === 'ACCEPT' ? 'ACCEPTED' : 'REJECTED',
        },
        include: { requester: true },
      });

      if (action === 'ACCEPT') {
        await db.notification.create({
          data: {
            userId: updated.requesterId,
            title: 'Connection Accepted',
            message: `${currentUser.name} accepted your connection request.`,
            type: 'INFO',
            link: '/connections',
          },
        });
      }

      return NextResponse.json({ success: true, connection: updated });
    }

    return NextResponse.json({ error: 'Invalid connection action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Connection operation failed' }, { status: 500 });
  }
}
