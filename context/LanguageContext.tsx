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
        'post.create_title': '새 게시물 작성',
        'post.category': '카테고리',
        'post.title': '제목',
        'post.content': '내용',
        'post.image': '사진 첨부 (대표 이미지)',
        'post.location': '위치 (선택)',
        'post.tags': '태그 (콤마로 구분)',
        'post.submit': '작성 완료',
        'post.submitting': '작성 중...',
        'post.placeholder_loc': '예: 홍대입구',
        'post.placeholder_tags': '예: 여행, 서울, 맛집',
        'post.alert_login': '로그인이 필요합니다.',
        'post.alert_success': '게시물이 작성되었습니다.',
        'post.alert_fail': '게시물 작성 실패',
        'mypage.title': '마이 페이지',
        'mypage.posts': '내가 쓴 게시물',
        'mypage.no_posts': '작성한 게시물이 없습니다.',
        'mypage.edit_profile': '정보 수정',
        'mypage.messages': '쪽지함',
    },
    en: {
        'header.title': 'TEMAN',
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
        'post.create_title': 'Create New Post',
        'post.category': 'Category',
        'post.title': 'Title',
        'post.content': 'Content',
        'post.image': 'Attach Image (Thumbnail)',
        'post.location': 'Location (Optional)',
        'post.tags': 'Tags (comma separated)',
        'post.submit': 'Submit',
        'post.submitting': 'Submitting...',
        'post.placeholder_loc': 'e.g. Hongdae Station',
        'post.placeholder_tags': 'e.g. Travel, Seoul, Food',
        'post.alert_login': 'Login required.',
        'post.alert_success': 'Post created successfully.',
        'post.alert_fail': 'Failed to create post.',
        'mypage.title': 'My Page',
        'mypage.posts': 'My Posts',
        'mypage.no_posts': 'No posts yet.',
        'mypage.edit_profile': 'Edit Profile',
        'mypage.messages': 'Messages',
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
