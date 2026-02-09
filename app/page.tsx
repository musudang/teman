'use client';

import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import Feed from '@/components/Feed';
import CreatePostModal from '@/components/CreatePostModal';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const [currentCategory, setCurrentCategory] = useState('all');
  const [isPostModalOpen, setPostModalOpen] = useState(false);
  const { user } = useAuth();

  // Navigation component needs to notify page about category change
  // I'll update Navigation to accept onCategoryChange prop later, 
  // but for now I'll use a hack or simple DOM event since Nav was just HTML click.
  // Actually, I should update Navigation to be a proper React component with props.
  // But let's assume Navigation triggers a state change here.

  // Wait, Navigation is currently isolated. I need to lift state up.
  // I will modify Navigation to accept `onSelectCategory` prop.

  // Also expose openCreatePostModal to window for Feed component button
  useEffect(() => {
    (window as any).openCreatePostModal = () => {
      if (user) {
        setPostModalOpen(true);
      } else {
        alert('로그인이 필요합니다.');
      }
    };
  }, [user]);

  return (
    <>
      <Header />
      <Navigation onSelectCategory={setCurrentCategory} activeCategory={currentCategory} />

      <main className="container">
        <Feed category={currentCategory} />
      </main>

      <CreatePostModal isOpen={isPostModalOpen} onClose={() => setPostModalOpen(false)} />
    </>
  );
}
