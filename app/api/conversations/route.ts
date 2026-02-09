import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function GET(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyToken(token);
        if (!payload || !payload.userId) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const userId = payload.userId as string;

        // Fetch distinct conversation partners
        // This is hard with Prisma's distinct on multiple columns.
        // simpler: fetch all messages involved, then group in JS.
        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: userId },
                    { receiverId: userId }
                ]
            },
            orderBy: { createdAt: 'desc' },
            include: {
                sender: { select: { id: true, nickname: true, profileImage: true } as any },
                receiver: { select: { id: true, nickname: true, profileImage: true } as any },
            }
        });

        const partners = new Map();
        messages.forEach((msg: any) => {
            const partner = msg.senderId === userId ? msg.receiver : msg.sender;
            if (!partners.has(partner.id)) {
                partners.set(partner.id, {
                    user: partner,
                    lastMessage: msg.content,
                    timestamp: msg.createdAt,
                });
            }
        });

        return NextResponse.json({ conversations: Array.from(partners.values()) });

    } catch (error) {
        console.error('Error fetching conversations:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
