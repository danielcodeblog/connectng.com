import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', noPadding = false }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const hover = gsap.to(el, {
      scale: 1.02,
      boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
      duration: 0.3,
      paused: true,
      ease: "power2.out"
    });

    el.addEventListener('mouseenter', () => hover.play());
    el.addEventListener('mouseleave', () => hover.reverse());
  }, []);

  return (
    <div ref={cardRef} className={`bg-white rounded-3xl border border-zinc-100 shadow-sm ${noPadding ? '' : 'p-6'} ${className}`}>
      {children}
    </div>
  );
};
