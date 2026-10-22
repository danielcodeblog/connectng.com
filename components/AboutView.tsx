import React from 'react';
import { LandingAbout } from './LandingAbout';
import { NavHeader } from './ui/nav-header';

export const AboutView = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="min-h-screen bg-[#FAF6E8] pt-24">
        <nav className="fixed top-0 left-0 right-0 z-50 p-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between bg-white/50 backdrop-blur-md rounded-full px-6 py-4 border border-white/20">
                <button onClick={onBack} className="text-zinc-900 font-bold hover:text-[#FFBF00]">← Back</button>
                <span className="font-bold">About Us</span>
                <div />
            </div>
        </nav>
        <LandingAbout />
    </div>
  );
};
