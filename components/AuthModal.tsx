'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const { login } = useAuth();
    const { t } = useLanguage();
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        nickname: '',
        nationality: 'Korea',
        age: '',
        gender: 'Other',
    });
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            let res;
            if (isLoginMode) {
                res = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: formData.email, password: formData.password }),
                });
            } else {
                const data = new FormData();
                data.append('email', formData.email);
                data.append('password', formData.password);
                data.append('nickname', formData.nickname);
                data.append('nationality', formData.nationality);
                data.append('age', formData.age);
                data.append('gender', formData.gender);
                if (file) {
                    data.append('profileImage', file);
                }

                res = await fetch('/api/auth/signup', {
                    method: 'POST',
                    body: data,
                });
            }

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Something went wrong');
                return;
            }

            if (isLoginMode) {
                await login();
                onClose();
            } else {
                alert('회원가입 성공! 로그인해주세요.');
                setIsLoginMode(true);
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred');
        }
    };

    return (
        <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal">
                <button className="modal-close" onClick={onClose}>&times;</button>
                <h3 className="modal-title">{isLoginMode ? t('auth.login') : t('auth.signup')}</h3>

                {error && <p style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="input-label">{t('auth.email')}</label>
                        <input
                            type="email"
                            name="email"
                            className="text-input"
                            placeholder="example@email.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">{t('auth.password')}</label>
                        <input
                            type="password"
                            name="password"
                            className="text-input"
                            placeholder="********"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {!isLoginMode && (
                        <>
                            <div className="input-group">
                                <label className="input-label">{t('auth.photo')}</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="text-input"
                                    onChange={handleFileChange}
                                />
                            </div>
                            <div className="input-group">
                                <label className="input-label">{t('auth.nickname')}</label>
                                <input
                                    type="text"
                                    name="nickname"
                                    className="text-input"
                                    placeholder="Nickname"
                                    value={formData.nickname}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label className="input-label">{t('auth.nationality')}</label>
                                <input
                                    type="text"
                                    name="nationality"
                                    className="text-input"
                                    placeholder="USA, Korea, etc."
                                    value={formData.nationality}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label className="input-label">{t('auth.age')}</label>
                                <input
                                    type="number"
                                    name="age"
                                    className="text-input"
                                    placeholder="Age"
                                    value={formData.age}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="input-group">
                                <label className="input-label">{t('auth.gender')}</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="text-input"
                                    style={{ backgroundColor: 'white' }}
                                >
                                    <option value="Male">{t('auth.male')}</option>
                                    <option value="Female">{t('auth.female')}</option>
                                    <option value="Other">{t('auth.other')}</option>
                                </select>
                            </div>
                        </>
                    )}

                    <button type="submit" className="btn btn-primary full-width">
                        {isLoginMode ? t('auth.submit_login') : t('auth.submit')}
                    </button>
                </form>

                <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.875rem' }}>
                    {isLoginMode ? (
                        <p>
                            {t('auth.no_account')}{' '}
                            <span
                                style={{ color: 'var(--primary-color)', cursor: 'pointer', fontWeight: 'bold' }}
                                onClick={() => setIsLoginMode(false)}
                            >
                                {t('auth.signup')}
                            </span>
                        </p>
                    ) : (
                        <p>
                            {t('auth.has_account')}{' '}
                            <span
                                style={{ color: 'var(--primary-color)', cursor: 'pointer', fontWeight: 'bold' }}
                                onClick={() => setIsLoginMode(true)}
                            >
                                {t('auth.login')}
                            </span>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
