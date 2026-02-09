'use client';

import { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ko' | 'en';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const translations = {
    ko: {
        'header.title': '한국생활 커뮤니티',
        'header.subtitle': '외국인을 위한 한국 생활 정보 공유',
        'header.login': '로그인',
        'header.signup': '회원가입',
        'header.logout': '로그아웃',
        'nav.all': '전체',
        'nav.meetup': '만남의 장',
        'nav.qna': '지식인',
        'nav.event': '행사 정보',
        'nav.job': '알바 정보',
        'nav.gallery': '여행 갤러리',
        'feed.empty': '게시물이 없습니다.',
        'feed.create': '새 게시물 작성',
        'feed.count': '개의 게시물',
        'auth.login': '로그인',
        'auth.signup': '회원가입',
        'auth.email': '이메일',
        'auth.password': '비밀번호',
        'auth.nickname': '닉네임',
        'auth.nationality': '국적',
        'auth.age': '나이',
        'auth.gender': '성별',
        'auth.male': '남자',
        'auth.female': '여자',
        'auth.other': '기타',
        'auth.photo': '프로필 사진',
        'auth.submit': '가입하기',
        'auth.submit_login': '로그인',
        'auth.no_account': '계정이 없으신가요?',
        'auth.has_account': '이미 계정이 있으신가요?',
    },
    en: {
        'header.title': 'Korea Life Community',
        'header.subtitle': 'Sharing information for foreigners in Korea',
        'header.login': 'Login',
        'header.signup': 'Sign Up',
        'header.logout': 'Logout',
        'nav.all': 'All',
        'nav.meetup': 'Meetups',
        'nav.qna': 'Q&A',
        'nav.event': 'Events',
        'nav.job': 'Jobs',
        'nav.gallery': 'Gallery',
        'feed.empty': 'No posts found.',
        'feed.create': 'New Post',
        'feed.count': 'posts',
        'auth.login': 'Login',
        'auth.signup': 'Sign Up',
        'auth.email': 'Email',
        'auth.password': 'Password',
        'auth.nickname': 'Nickname',
        'auth.nationality': 'Nationality',
        'auth.age': 'Age',
        'auth.gender': 'Gender',
        'auth.male': 'Male',
        'auth.female': 'Female',
        'auth.other': 'Other',
        'auth.photo': 'Profile Photo',
        'auth.submit': 'Sign Up',
        'auth.submit_login': 'Login',
        'auth.no_account': "Don't have an account?",
        'auth.has_account': 'Already have an account?',
    },
};

const LanguageContext = createContext<LanguageContextType>({
    language: 'ko',
    setLanguage: () => { },
    t: (key) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>('ko');

    const t = (key: string) => {
        return (translations[language] as any)[key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}
