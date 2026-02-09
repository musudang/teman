'use client';

import { useEffect, useState } from 'react';
import PostCard from './PostCard';
import { useLanguage } from '@/context/LanguageContext';

interface FeedProps {
    category: string;
}

export default function Feed({ category }: FeedProps) {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { t } = useLanguage();

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/posts?category=${category}`);
            const data = await res.json();
            if (data.posts) {
                setPosts(data.posts);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [category]);

    useEffect(() => {
        (window as any).refreshFeed = fetchPosts;
    }, [category]);

    if (loading) return <div>Loading...</div>;

    if (posts.length === 0) return <div>{t('feed.empty')}</div>;

    return (
        <>
            <div className="content-header">
                <h2>{posts.length} {t('feed.count')}</h2>
                <button className="btn btn-primary" onClick={() => (window as any).openCreatePostModal?.()}>
                    <i className="fas fa-plus"></i> {t('feed.create')}
                </button>
            </div>

            {posts.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}
        </>
    );
}
