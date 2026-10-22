import React from 'react';
import { BlogSection } from './BlogSection';

export const BlogView = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="min-h-screen bg-white pt-24">
        <nav className="fixed top-0 left-0 right-0 z-50 p-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between bg-white/50 backdrop-blur-md rounded-full px-6 py-4 border border-zinc-200">
                <button onClick={onBack} className="text-zinc-900 font-bold hover:text-[#FFBF00]">← Back</button>
                <span className="font-bold">Our Blog</span>
                <div />
            </div>
        </nav>
        <div className="pt-8">
            <BlogSection />
        </div>
    </div>
  );
};
