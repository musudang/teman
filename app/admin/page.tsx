'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';

export default function AdminPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [posts, setPosts] = useState<any[]>([]);
    const [isLoadingPosts, setIsLoadingPosts] = useState(true);

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/');
            } else if (user.role !== 'ADMIN') {
                alert('Access Denied: Admins Only');
                router.push('/');
            }
        }
    }, [user, loading, router]);

    useEffect(() => {
        if (user && user.role === 'ADMIN') {
            fetchPosts();
        }
    }, [user]);

    const fetchPosts = async () => {
        try {
            const res = await fetch('/api/posts?category=all');
            const data = await res.json();
            if (data.posts) {
                setPosts(data.posts);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingPosts(false);
        }
    };

    const handleDelete = async (postId: string) => {
        if (!confirm('Are you sure you want to delete this post?')) return;

        try {
            const res = await fetch(`/api/posts/${postId}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setPosts(posts.filter(p => p.id !== postId));
                alert('Post deleted');
            } else {
                alert('Failed to delete post');
            }
        } catch (error) {
            console.error(error);
            alert('Error deleting post');
        }
    };

    if (loading || !user || user.role !== 'ADMIN') return <div>Loading Admin Dashboard...</div>;

    return (
        <>
            <Header />
            <Navigation />

            <main className="container">
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Admin Dashboard</h1>

                <div className="card">
                    <h2>Manage Posts</h2>
                    <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Total Posts: {posts.length}</p>

                    {isLoadingPosts ? (
                        <div>Loading posts...</div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                                        <th style={{ padding: '0.5rem' }}>Title</th>
                                        <th style={{ padding: '0.5rem' }}>Author</th>
                                        <th style={{ padding: '0.5rem' }}>Category</th>
                                        <th style={{ padding: '0.5rem' }}>Date</th>
                                        <th style={{ padding: '0.5rem' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {posts.map(post => (
                                        <tr key={post.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                            <td style={{ padding: '0.5rem' }}>{post.title}</td>
                                            <td style={{ padding: '0.5rem' }}>{post.author.nickname}</td>
                                            <td style={{ padding: '0.5rem' }}>{post.category}</td>
                                            <td style={{ padding: '0.5rem' }}>{new Date(post.createdAt).toLocaleDateString()}</td>
                                            <td style={{ padding: '0.5rem' }}>
                                                <button
                                                    onClick={() => handleDelete(post.id)}
                                                    style={{
                                                        backgroundColor: '#ff4444',
                                                        color: 'white',
                                                        border: 'none',
                                                        padding: '0.25rem 0.5rem',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}
