
import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import gsap from 'gsap';
import { ArrowRight, Play, Pause, ChevronRight, Sparkles } from 'lucide-react';
import { ParallaxComponent } from './ui/component';

interface HomeViewProps {
  onNavigate: (page: 'home' | 'about' | 'blog' | 'founders' | 'contact') => void;
  onLoginClick: () => void;
  showVideo: boolean;
}

export const LandingHome = ({ onNavigate, onLoginClick, showVideo }: HomeViewProps) => {
  const homeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(homeRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.65, ease: "power2.out", clearProps: "opacity" }
      );
    }, homeRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={homeRef} className="w-full relative bg-[#0A0A0C]">
      <ParallaxComponent />
    </div>
  );
};