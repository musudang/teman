'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/context/LanguageContext';

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: any;
    onUpdate: () => void;
}

export default function EditProfileModal({ isOpen, onClose, user, onUpdate }: EditProfileModalProps) {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        nickname: user.nickname || '',
        nationality: user.nationality || '',
        age: user.age || '',
        gender: user.gender || '',
    });
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                nickname: user.nickname || '',
                nationality: user.nationality || '',
                age: user.age || '',
                gender: user.gender || '',
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            // Preview logic could reside here
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let profileImageUrl = user.profileImage;

            if (file) {
                try {
                    const buffer = await file.arrayBuffer();
                    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
                    const filename = `profiles/${Date.now()}_${sanitizedFileName}`;
                    console.log(`[Client] Uploading profile image: ${filename}`);

                    const { data, error } = await supabase.storage
                        .from('uploads')
                        .upload(filename, buffer, {
                            contentType: file.type,
                            upsert: false
                        });

                    if (error) {
                        console.error('[Client] Supabase upload error:', error);
                        throw error;
                    } else {
                        const { data: { publicUrl } } = supabase.storage
                            .from('uploads')
                            .getPublicUrl(filename);
                        profileImageUrl = publicUrl;
                        console.log(`[Client] Generated Public URL: ${profileImageUrl}`);
                    }
                } catch (error) {
                    console.error('[Client] Error saving file:', error);
                    alert('이미지 업로드 실패');
                    setLoading(false);
                    return;
                }
            }

            const res = await fetch('/api/auth/me', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nickname: formData.nickname,
                    nationality: formData.nationality,
                    age: formData.age ? parseInt(formData.age as string) : null,
                    gender: formData.gender,
                    profileImage: profileImageUrl,
                }),
            });

            if (res.ok) {
                alert('프로필이 수정되었습니다.');
                onUpdate();
                onClose();
                // Optionally reload window to refresh auth context if needed immediately
                window.location.reload();
            } else {
                const data = await res.json();
                alert(data.error || '수정 실패');
            }
        } catch (error) {
            console.error(error);
            alert('수정 중 오류 발생');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal">
                <button className="modal-close" onClick={onClose}>&times;</button>
                <h3 className="modal-title">정보 수정</h3>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="input-label">닉네임</label>
                        <input
                            type="text"
                            name="nickname"
                            className="text-input"
                            value={formData.nickname}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">국적</label>
                        <input
                            type="text"
                            name="nationality"
                            className="text-input"
                            value={formData.nationality}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">나이</label>
                        <input
                            type="number"
                            name="age"
                            className="text-input"
                            value={formData.age}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">성별</label>
                        <select name="gender" value={formData.gender} onChange={handleChange} className="text-input" style={{ backgroundColor: 'white' }}>
                            <option value="">선택 안함</option>
                            <option value="male">남성</option>
                            <option value="female">여성</option>
                            <option value="other">기타</option>
                        </select>
                    </div>

                    <div className="input-group">
                        <label className="input-label">프로필 이미지</label>
                        <input type="file" accept="image/*" className="text-input" onChange={handleFileChange} />
                    </div>

                    <button type="submit" className="btn btn-primary full-width" disabled={loading}>
                        {loading ? '수정 중...' : '수정 완료'}
                    </button>
                </form>
            </div>
        </div>
    );
}
