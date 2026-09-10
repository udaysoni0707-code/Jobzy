import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { AuthService } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const currentUser = await AuthService.getCurrentUser();
    const userId = searchParams.get('userId') || currentUser?.id;

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const [sent, received] = await Promise.all([
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

    return NextResponse.json({
      success: true,
      activeCount: activeConnections.length,
      pendingCount: pendingRequests.length,
      connections: activeConnections,
      pendingRequests,
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch connections' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { action, targetUserId, connectionId } = await req.json();
    const currentUser = await AuthService.getCurrentUser();

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
