import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const authorId = searchParams.get('authorId');

        // Check auth for likedByMe
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        let userId: string | null = null;
        if (token) {
            const payload = await verifyToken(token);
            if (payload) userId = payload.userId as string;
        }

        const where: any = {};
        if (category && category !== 'all') where.category = category;
        if (authorId) where.authorId = authorId;

        const posts = await prisma.post.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                author: {
                    select: { id: true, nickname: true, profileImage: true } as any,
                },
                _count: {
                    select: { comments: true, likes: true },
                },
                likes: userId ? {
                    where: { userId },
                    select: { userId: true },
                } : false,
            },
        });

        const formattedPosts = (posts as any[]).map(post => ({
            ...post,
            likedByMe: post.likes ? post.likes.length > 0 : false,
            likes: undefined, // remove likes array to clean up response
        }));

        return NextResponse.json({ posts: formattedPosts });
    } catch (error) {
        console.error('Error fetching posts:', error);
        return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
    }
}

export async function POST(request: Request) {
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

        const formData = await request.formData();
        const title = formData.get('title') as string;
        const content = formData.get('content') as string;
        const category = formData.get('category') as string;
        const location = formData.get('location') as string;
        const tags = formData.get('tags') as string;
        const file = formData.get('image') as File | null;

        if (!title || !content || !category) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        let imageUrl = null;
        if (file) {
            try {
                const buffer = await file.arrayBuffer();
                const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
                const filename = `posts/${Date.now()}_${sanitizedFileName}`;
                console.log(`[API] Uploading file: ${filename}`);

                const { data, error } = await supabase.storage
                    .from('uploads')
                    .upload(filename, buffer, {
                        contentType: file.type,
                        upsert: false
                    });

                if (error) {
                    console.error('[API] Supabase upload error:', error);
                } else {
                    console.log('[API] Upload successful:', data);
                    const { data: { publicUrl } } = supabase.storage
                        .from('uploads')
                        .getPublicUrl(filename);
                    imageUrl = publicUrl;
                    console.log(`[API] Generated Public URL: ${imageUrl}`);
                }
            } catch (error) {
                console.error('[API] Error saving file:', error);
            }
        }

        const post = await prisma.post.create({
            data: {
                title,
                content,
                category,
                location,
                tags,
                imageUrl,
                authorId: payload.userId as string,
            } as any,
        });

        return NextResponse.json({ post }, { status: 201 });
    } catch (error) {
        console.error('Error creating post:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
