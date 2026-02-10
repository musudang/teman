import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const nickname = formData.get('nickname') as string;
        const nationality = formData.get('nationality') as string;
        const age = formData.get('age') as string;
        const gender = formData.get('gender') as string;
        const file = formData.get('profileImage') as File | null;

        if (!email || !password || !nickname || !nationality) {
            return NextResponse.json(
                { error: 'Email, password, nickname, and nationality are required' },
                { status: 400 }
            );
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 409 }
            );
        }

        let profileImageUrl = null;
        if (file) {
            try {
                const buffer = await file.arrayBuffer();
                const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
                const filename = `profiles/${Date.now()}_${sanitizedFileName}`;
                console.log(`[API] Uploading profile image: ${filename}`);

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
                    profileImageUrl = publicUrl;
                    console.log(`[API] Generated Public URL: ${profileImageUrl}`);
                }
            } catch (error) {
                console.error('[API] Error saving file:', error);
            }
        }

        const hashedPassword = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                nickname,
                nationality,
                age: age ? parseInt(age) : null,
                gender: gender || null,
                profileImage: profileImageUrl,
            },
        });

        return NextResponse.json(
            { message: 'User created successfully', userId: user.id },
            { status: 201 }
        );
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
