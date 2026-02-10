'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import PostCard from '@/components/PostCard';
import EditProfileModal from '@/components/EditProfileModal';

export default function MyPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [myPosts, setMyPosts] = useState<any[]>([]);
    const [isLoadingPosts, setIsLoadingPosts] = useState(true);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/');
        }
    }, [user, loading, router]);

    useEffect(() => {
        if (user) {
            fetchMyPosts();
        }
    }, [user]);

    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

    const fetchMyPosts = async () => {
        try {
            // We can reuse the posts API with a filter, or create a new endpoint.
            // For now, let's filter on client or add authorId param to GET /api/posts
            // Adding authorId param to API would be cleaner.
            // But for speed, let's just create a specific fetch.
            // Actually, GET /api/posts doesn't support authorId filtering yet.
            // I'll update GET /api/posts to support ?authorId=...

            // Let's assumme I will update API.
            const res = await fetch(`/api/posts?authorId=${user?.id}`);
            const data = await res.json();
            if (data.posts) {
                setMyPosts(data.posts);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingPosts(false);
        }
    };

    if (loading || !user) return <div>Loading...</div>;

    return (
        <>
            <Header />
            <Navigation />

            <main className="container">
                <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid var(--border-color)', padding: '2rem', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                        {user.profileImage ? ( // This property might not be in the User interface in AuthContext yet
                            <img src={user.profileImage || ''} alt={user.nickname} style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }} />
                        ) : (
                            <i className="fas fa-user-circle" style={{ fontSize: '6rem', color: 'var(--border-color)' }}></i>
                        )}

                        <div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{user.nickname}</h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>{user.email}</p>
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                <span className="tag">{user.nationality}</span>
                                {user.age && <span className="tag">{user.age}세</span>}
                                {user.gender && <span className="tag">{user.gender}</span>}
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                        <button className="btn btn-outline" onClick={() => setIsEditProfileOpen(true)}>정보 수정</button>
                        <button className="btn btn-outline" onClick={() => router.push('/messages')}>쪽지함</button>
                    </div>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>내가 쓴 게시물</h3>

                {isLoadingPosts ? (
                    <div>Loading posts...</div>
                ) : myPosts.length === 0 ? (
                    <div>작성한 게시물이 없습니다.</div>
                ) : (
                    myPosts.map(post => <PostCard key={post.id} post={post} />)
                )}
            </main>
            <EditProfileModal isOpen={isEditProfileOpen} onClose={() => setIsEditProfileOpen(false)} user={user} onUpdate={() => window.location.reload()} />
        </>
    );
}
