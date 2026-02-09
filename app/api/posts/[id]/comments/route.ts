import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const comments = await prisma.comment.findMany({
            where: { postId: id },
            include: {
                author: {
                    select: { nickname: true, profileImage: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ comments });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
    }
}

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyToken(token);
        if (!payload || !payload.userId) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const { content } = await request.json();
        if (!content) {
            return NextResponse.json({ error: 'Content required' }, { status: 400 });
        }

        const comment = await prisma.comment.create({
            data: {
                content,
                postId: id,
                authorId: payload.userId as string,
            },
            include: {
                author: {
                    select: { nickname: true, profileImage: true },
                },
            },
        });

        return NextResponse.json({ comment }, { status: 201 });
    } catch (error) {
        console.error('Error creating comment:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
