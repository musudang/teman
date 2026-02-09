'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';

interface User {
    id: string;
    nickname: string;
    profileImage: string | null;
}

interface Message {
    id: string;
    senderId: string;
    receiverId: string;
    content: string;
    createdAt: string;
}

interface Conversation {
    user: User;
    lastMessage: string;
    timestamp: string;
}

function MessagesContent() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const partnerId = searchParams.get('partnerId');

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [messageText, setMessageText] = useState('');
    const [partner, setPartner] = useState<User | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!loading && !user) router.push('/');
    }, [user, loading, router]);

    useEffect(() => {
        if (user) fetchConversations();
    }, [user]);

    useEffect(() => {
        if (user && partnerId) {
            fetchMessages(partnerId);
        }
    }, [user, partnerId]);

    const fetchConversations = async () => {
        try {
            const res = await fetch('/api/conversations');
            const data = await res.json();
            if (data.conversations) {
                setConversations(data.conversations);
                if (partnerId) {
                    const conv = data.conversations.find((c: any) => c.user.id === partnerId);
                    if (conv) setPartner(conv.user);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchMessages = async (pid: string) => {
        try {
            const res = await fetch(`/api/messages?partnerId=${pid}`);
            const data = await res.json();
            if (data.messages) {
                setMessages(data.messages);
                scrollToBottom();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageText.trim() || !partnerId) return;

        try {
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ receiverId: partnerId, content: messageText }),
            });
            const data = await res.json();
            if (res.ok) {
                setMessages([...messages, data.message]);
                setMessageText('');
                scrollToBottom();
                fetchConversations();
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (loading || !user) return <div>Loading...</div>;

    return (
        <main className="container" style={{ display: 'flex', gap: '1rem', height: 'calc(100vh - 200px)', minHeight: '500px' }}>
            {/* Sidebar */}
            <div style={{ width: '300px', borderRight: '1px solid var(--border-color)', overflowY: 'auto' }}>
                <h3 style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>대화 목록</h3>
                {conversations.map(conv => (
                    <div
                        key={conv.user.id}
                        onClick={() => {
                            setPartner(conv.user);
                            router.push(`/messages?partnerId=${conv.user.id}`);
                        }}
                        style={{
                            padding: '1rem',
                            borderBottom: '1px solid var(--border-color)',
                            cursor: 'pointer',
                            backgroundColor: partnerId === conv.user.id ? 'var(--bg-color)' : 'white'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {conv.user.profileImage ? (
                                <img src={conv.user.profileImage} alt={conv.user.nickname} style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                            ) : (
                                <i className="fas fa-user-circle" style={{ fontSize: '2rem' }}></i>
                            )}
                            <div>
                                <div style={{ fontWeight: 'bold' }}>{conv.user.nickname}</div>
                                <div style={{ fontSize: '0.8rem', color: 'gray', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>{conv.lastMessage}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Chat Area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {partnerId ? (
                    <>
                        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', fontWeight: 'bold' }}>
                            {partner ? partner.nickname : 'Chat'}
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {messages.map(msg => {
                                const isMe = msg.senderId === user.id;
                                return (
                                    <div key={msg.id} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
                                        <div style={{
                                            backgroundColor: isMe ? 'var(--primary-color)' : '#f3f4f6',
                                            color: isMe ? 'white' : 'black',
                                            padding: '0.5rem 1rem',
                                            borderRadius: '1rem',
                                            borderBottomRightRadius: isMe ? '0' : '1rem',
                                            borderBottomLeftRadius: isMe ? '1rem' : '0'
                                        }}>
                                            {msg.content}
                                        </div>
                                        <div style={{ fontSize: '0.7rem', color: 'gray', textAlign: isMe ? 'right' : 'left', marginTop: '0.2rem' }}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        <form onSubmit={sendMessage} style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.5rem' }}>
                            <input
                                type="text"
                                className="text-input"
                                value={messageText}
                                onChange={e => setMessageText(e.target.value)}
                                placeholder="메시지를 입력하세요..."
                            />
                            <button type="submit" className="btn btn-primary">전송</button>
                        </form>
                    </>
                ) : (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'gray' }}>
                        대화 상대를 선택하세요.
                    </div>
                )}
            </div>
        </main>
    );
}

export default function MessagesPage() {
    return (
        <>
            <Header />
            <Navigation />
            <Suspense fallback={<div>Loading messaging...</div>}>
                <MessagesContent />
            </Suspense>
        </>
    );
}
