import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const postId = id;
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

        const existingLike = await prisma.like.findUnique({
            where: {
                postId_userId: {
                    postId,
                    userId,
                },
            },
        });

        if (existingLike) {
            // Unlike
            await prisma.like.delete({
                where: {
                    id: existingLike.id,
                },
            });
            return NextResponse.json({ message: 'Unliked', liked: false });
        } else {
            // Like
            await prisma.like.create({
                data: {
                    postId,
                    userId,
                },
            });
            return NextResponse.json({ message: 'Liked', liked: true });
        }
    } catch (error) {
        console.error('Error toggling like:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
