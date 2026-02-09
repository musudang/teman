'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import RichTextEditor from './RichTextEditor';

interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
    const { user } = useAuth();
    const { t } = useLanguage();
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
            alert(t('post.alert_login'));
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
                alert(t('post.alert_success'));
                onClose();
                setFormData({ title: '', content: '', category: 'meetup', location: '', tags: '' });
                setFile(null);
                // Trigger feed refresh
                if ((window as any).refreshFeed) (window as any).refreshFeed();
            } else {
                alert(t('post.alert_fail'));
            }
        } catch (error) {
            console.error(error);
            alert(t('post.alert_fail'));
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal" style={{ maxWidth: '800px', width: '90%' }}>
                <button className="modal-close" onClick={onClose}>&times;</button>
                <h3 className="modal-title">{t('post.create_title')}</h3>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="input-label">{t('post.category')}</label>
                        <select name="category" value={formData.category} onChange={handleChange} className="text-input" style={{ backgroundColor: 'white' }}>
                            <option value="meetup">{t('nav.meetup')}</option>
                            <option value="qna">{t('nav.qna')}</option>
                            <option value="event">{t('nav.event')}</option>
                            <option value="job">{t('nav.job')}</option>
                            <option value="gallery">{t('nav.gallery')}</option>
                        </select>
                    </div>

                    <div className="input-group">
                        <label className="input-label">{t('post.title')}</label>
                        <input type="text" name="title" className="text-input" value={formData.title} onChange={handleChange} required />
                    </div>

                    <div className="input-group">
                        <label className="input-label">{t('post.content')}</label>
                        {/* <textarea name="content" className="text-input" style={{ height: '100px' }} value={formData.content} onChange={handleChange} required></textarea> */}
                        <RichTextEditor value={formData.content} onChange={handleContentChange} />
                    </div>

                    <div className="input-group" style={{ marginTop: '20px' }}>
                        <label className="input-label">{t('post.image')}</label>
                        <input type="file" accept="image/*" className="text-input" onChange={handleFileChange} />
                    </div>

                    <div className="input-group">
                        <label className="input-label">{t('post.location')}</label>
                        <input type="text" name="location" className="text-input" placeholder={t('post.placeholder_loc')} value={formData.location} onChange={handleChange} />
                    </div>

                    <div className="input-group">
                        <label className="input-label">{t('post.tags')}</label>
                        <input type="text" name="tags" className="text-input" placeholder={t('post.placeholder_tags')} value={formData.tags} onChange={handleChange} />
                    </div>

                    <button type="submit" className="btn btn-primary full-width" disabled={loading}>
                        {loading ? t('post.submitting') : t('post.submit')}
                    </button>
                </form>
            </div>
        </div>
    );
}
