'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import RichTextEditor from './RichTextEditor';

interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: 'meetup',
        location: '',
        tags: '',
    });
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleContentChange = (content: string) => {
        setFormData({ ...formData, content });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            alert('로그인이 필요합니다.');
            return;
        }
        setLoading(true);

        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('content', formData.content);
            data.append('category', formData.category);
            data.append('location', formData.location);
            data.append('tags', formData.tags);
            if (file) {
                data.append('image', file);
            }

            const res = await fetch('/api/posts', {
                method: 'POST',
                body: data,
            });

            if (res.ok) {
                alert('게시물이 작성되었습니다.');
                onClose();
                setFormData({ title: '', content: '', category: 'meetup', location: '', tags: '' });
                setFile(null);
                // Trigger feed refresh
                if ((window as any).refreshFeed) (window as any).refreshFeed();
            } else {
                alert('게시물 작성 실패');
            }
        } catch (error) {
            console.error(error);
            alert('오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal" style={{ maxWidth: '800px', width: '90%' }}>
                <button className="modal-close" onClick={onClose}>&times;</button>
                <h3 className="modal-title">새 게시물 작성</h3>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="input-label">카테고리</label>
                        <select name="category" value={formData.category} onChange={handleChange} className="text-input" style={{ backgroundColor: 'white' }}>
                            <option value="meetup">만남의 장</option>
                            <option value="qna">지식인</option>
                            <option value="event">행사 정보</option>
                            <option value="job">알바 정보</option>
                            <option value="gallery">여행 갤러리</option>
                        </select>
                    </div>

                    <div className="input-group">
                        <label className="input-label">제목</label>
                        <input type="text" name="title" className="text-input" value={formData.title} onChange={handleChange} required />
                    </div>

                    <div className="input-group">
                        <label className="input-label">내용</label>
                        {/* <textarea name="content" className="text-input" style={{ height: '100px' }} value={formData.content} onChange={handleChange} required></textarea> */}
                        <RichTextEditor value={formData.content} onChange={handleContentChange} />
                    </div>

                    <div className="input-group" style={{ marginTop: '20px' }}>
                        <label className="input-label">대표 이미지 (썸네일)</label>
                        <input type="file" accept="image/*" className="text-input" onChange={handleFileChange} />
                    </div>

                    <div className="input-group">
                        <label className="input-label">위치 (선택)</label>
                        <input type="text" name="location" className="text-input" placeholder="예: 홍대입구" value={formData.location} onChange={handleChange} />
                    </div>

                    <div className="input-group">
                        <label className="input-label">태그 (콤마로 구분)</label>
                        <input type="text" name="tags" className="text-input" placeholder="예: 여행, 서울, 맛집" value={formData.tags} onChange={handleChange} />
                    </div>

                    <button type="submit" className="btn btn-primary full-width" disabled={loading}>
                        {loading ? '작성 중...' : '작성 완료'}
                    </button>
                </form>
            </div>
        </div>
    );
}
