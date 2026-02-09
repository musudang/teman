'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

// Helper for relative time
function timeAgo(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return `${seconds}초 전`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}분 전`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}시간 전`;
    const days = Math.floor(hours / 24);
    return `${days}일 전`;
}

interface PostProps {
    post: {
        id: string;
        title: string;
        content: string;
        category: string;
        location: string | null;
        imageUrl: string | null;
        tags: string | null;
        createdAt: string;
        likedByMe?: boolean;
        author: {
            id: string;
            nickname: string;
            profileImage: string | null;
        };
        _count: {
            likes: number;
            comments: number;
        };
    };
}

export default function PostCard({ post }: PostProps) {
    const { user } = useAuth();
    const [liked, setLiked] = useState(post.likedByMe || false);
    const [likesCount, setLikesCount] = useState(post._count.likes);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState<any[]>([]);
    const [commentText, setCommentText] = useState('');
    const [loadingComments, setLoadingComments] = useState(false);

    const handleLike = async () => {
        if (!user) {
            alert('로그인이 필요합니다.');
            return;
        }

        // Optimistic update
        const newLiked = !liked;
        setLiked(newLiked);
        setLikesCount(prev => newLiked ? prev + 1 : prev - 1);

        try {
            const res = await fetch(`/api/posts/${post.id}/like`, { method: 'POST' });
            if (!res.ok) {
                // Revert
                setLiked(!newLiked);
                setLikesCount(prev => !newLiked ? prev + 1 : prev - 1);
            }
        } catch (error) {
            setLiked(!newLiked);
            setLikesCount(prev => !newLiked ? prev + 1 : prev - 1);
        }
    };

    const toggleComments = async () => {
        if (!showComments && comments.length === 0) {
            setLoadingComments(true);
            try {
                const res = await fetch(`/api/posts/${post.id}/comments`);
                const data = await res.json();
                if (data.comments) setComments(data.comments);
            } catch (error) {
                console.error(error);
            } finally {
                setLoadingComments(false);
            }
        }
        setShowComments(!showComments);
    };

    const submitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            alert('로그인이 필요합니다.');
            return;
        }
        if (!commentText.trim()) return;

        try {
            const res = await fetch(`/api/posts/${post.id}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: commentText }),
            });
            const data = await res.json();
            if (res.ok) {
                setComments([data.comment, ...comments]);
                setCommentText('');
            } else {
                alert('댓글 작성 실패');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <article className="post-card" data-category={post.category}>
            <div className="post-header">
                <span className="tag">{post.category}</span>
                {post.location && (
                    <span className="location">
                        <i className="fas fa-map-marker-alt"></i> {post.location}
                    </span>
                )}
            </div>
            <h3 className="post-title">{post.title}</h3>
            {post.imageUrl && (
                <div style={{ backgroundColor: '#e5e7eb', height: '200px', borderRadius: '0.5rem', marginBottom: '1rem', overflow: 'hidden' }}>
                    <img src={post.imageUrl} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
            )}
            <p className="post-excerpt">{post.content}</p>
            {post.tags && (
                <div className="post-tags">
                    {post.tags.split(',').map((tag, index) => (
                        <span key={index} className="hashtag">
                            #{tag.trim()}
                        </span>
                    ))}
                </div>
            )}
            <div className="post-footer">
                <div className="author-info">
                    {post.author.profileImage ? (
                        <img src={post.author.profileImage} alt={post.author.nickname} style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                        <i className="far fa-user-circle"></i>
                    )}
                    <span className="author-name">{post.author.nickname}</span>
                    <span style={{ marginLeft: '0.5rem' }}><i className="far fa-clock"></i> {timeAgo(post.createdAt)}</span>
                    {/* Link to message using window location or router. Since PostCard is client component, we can use Link or router */}
                    {user && user.nickname !== post.author.nickname && (
                        <a href={`/messages?partnerId=${post.author.id}`} className="btn btn-outline" style={{ marginLeft: '1rem', padding: '0.1rem 0.5rem', fontSize: '0.75rem', textDecoration: 'none' }}>
                            쪽지 보내기
                        </a>
                    )}
                </div>
                <div className="post-stats">
                    <span onClick={handleLike} style={{ cursor: 'pointer', color: liked ? 'red' : 'inherit' }}>
                        <i className={`${liked ? 'fas' : 'far'} fa-heart`}></i> {likesCount}
                    </span>
                    <span onClick={toggleComments} style={{ cursor: 'pointer' }}>
                        <i className="far fa-comment"></i> {comments.length || post._count.comments}
                    </span>
                </div>
            </div>

            {showComments && (
                <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                    {user && (
                        <form onSubmit={submitComment} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                            <input
                                type="text"
                                className="text-input"
                                placeholder="댓글을 입력하세요..."
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                            />
                            <button type="submit" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>등록</button>
                        </form>
                    )}

                    {loadingComments ? (
                        <div>Loading comments...</div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {comments.map((comment: any) => (
                                <div key={comment.id} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.875rem' }}>
                                    {comment.author.profileImage ? (
                                        <img src={comment.author.profileImage} alt="avatar" style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
                                    ) : (
                                        <i className="far fa-user-circle" style={{ fontSize: '1.5rem', color: '#ccc' }}></i>
                                    )}
                                    <div>
                                        <div>
                                            <span style={{ fontWeight: 'bold' }}>{comment.author.nickname}</span>
                                            <span style={{ color: '#aaa', marginLeft: '0.5rem', fontSize: '0.75rem' }}>{timeAgo(comment.createdAt)}</span>
                                        </div>
                                        <p>{comment.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </article>
    );
}
