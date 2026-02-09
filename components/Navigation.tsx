'use client';

import { useLanguage } from '@/context/LanguageContext';

interface NavigationProps {
    onSelectCategory?: (category: string) => void;
    activeCategory?: string;
}

export default function Navigation({ onSelectCategory, activeCategory = 'all' }: NavigationProps) {
    const { t } = useLanguage();

    const categories = [
        { id: 'all', name: t('nav.all'), icon: 'fas fa-users' },
        { id: 'meetup', name: t('nav.meetup'), icon: 'fas fa-user-friends' },
        { id: 'qna', name: t('nav.qna'), icon: 'fas fa-question-circle' },
        { id: 'event', name: t('nav.event'), icon: 'fas fa-calendar-alt' },
        { id: 'job', name: t('nav.job'), icon: 'fas fa-briefcase' },
        { id: 'gallery', name: t('nav.gallery'), icon: 'fas fa-camera' },
    ];

    return (
        <nav className="nav-bar">
            <div className="container nav-list">
                {categories.map((cat) => (
                    <div
                        key={cat.id}
                        className={`nav-item ${activeCategory === cat.id ? 'active' : ''}`}
                        onClick={() => onSelectCategory?.(cat.id)}
                    >
                        <i className={cat.icon}></i> {cat.name}
                    </div>
                ))}
            </div>
        </nav>
    );
}
