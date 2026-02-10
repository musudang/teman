import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        return NextResponse.json(
            { error: 'Not authenticated' },
            { status: 401 }
        );
    }

    const payload = await verifyToken(token);

    if (!payload || !payload.userId) {
        return NextResponse.json(
            { error: 'Invalid token' },
            { status: 401 }
        );
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: payload.userId as string },
            select: {
                id: true,
                email: true,
                nickname: true,
                nationality: true,
                age: true,
                gender: true,
                profileImage: true,
                role: true,
            } as any,
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ user }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
    export async function PUT(request: Request) {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const payload = await verifyToken(token);

        if (!payload || !payload.userId) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        try {
            const body = await request.json();
            const { nickname, nationality, age, gender, profileImage } = body;

            const updatedUser = await prisma.user.update({
                where: { id: payload.userId as string },
                data: {
                    nickname,
                    nationality,
                    age,
                    gender,
                    profileImage,
                },
                select: {
                    id: true,
                    email: true,
                    nickname: true,
                    nationality: true,
                    age: true,
                    gender: true,
                    profileImage: true,
                    role: true,
                },
            });

            return NextResponse.json({ user: updatedUser }, { status: 200 });
        } catch (error) {
            console.error('Profile update error:', error);
            return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
        }
    }
