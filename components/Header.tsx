'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import AuthModal from './AuthModal';

export default function Header() {
    const { user, login, logout, loading } = useAuth();
    const { language, setLanguage, t } = useLanguage();
    const [isModalOpen, setModalOpen] = useState(false);

    return (
        <>
            <header>
                <div className="container header-content">
                    <div className="logo">
                        <a href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <h1>TEMAN</h1>
                        </a>
                        <span>{t('header.subtitle')}</span>
                    </div>
                    <div className="header-actions">
                        <div className="lang-switch">
                            <button
                                className={`lang-btn ${language === 'ko' ? 'active' : ''}`}
                                onClick={() => setLanguage('ko')}
                            >
                                한국어
                            </button>
                            <button
                                className={`lang-btn ${language === 'en' ? 'active' : ''}`}
                                onClick={() => setLanguage('en')}
                            >
                                English
                            </button>
                        </div>

                        {loading ? (
                            <div>Loading...</div>
                        ) : user ? (
                            <div id="userDisplay" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                {user.role === 'ADMIN' && (
                                    <a href="/admin" className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', marginRight: '0.5rem' }}>
                                        Admin
                                    </a>
                                )}
                                <a href="/mypage" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <i className="fas fa-user-circle" style={{ fontSize: '1.5rem', color: 'var(--primary-color)' }}></i>
                                    <span style={{ fontWeight: 600 }}>{user.nickname}</span>
                                </a>
                                <button onClick={logout} className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>
                                    {t('header.logout')}
                                </button>
                            </div>
                        ) : (
                            <div id="loginButtons">
                                <button className="btn btn-outline" onClick={() => setModalOpen(true)}>
                                    <i className="fas fa-sign-in-alt"></i> {t('header.login')}
                                </button>
                                <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
                                    <i className="fas fa-user-plus"></i> {t('header.signup')}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <AuthModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
        </>
    );
}
