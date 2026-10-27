"use client"; 

import React, { useRef, useState } from "react";
import { motion } from "motion/react";

export function NavHeader({
  pages,
  currentPage,
  onNavigate,
  lightMode = false,
}: {
  pages: string[];
  currentPage: string;
  onNavigate: (page: string) => void;
  lightMode?: boolean;
}) {
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  return (
    <ul
      className="relative mx-auto hidden lg:flex items-center gap-1 w-fit p-1"
      onMouseLeave={() => setPosition((pv) => ({ ...pv, opacity: 0 }))}
    >
      {pages.map((page) => (
        <Tab 
          key={page} 
          setPosition={setPosition} 
          isActive={currentPage === page}
          onClick={() => onNavigate(page)}
          lightMode={lightMode}
        >
          {page}
        </Tab>
      ))}

      <Cursor position={position} lightMode={lightMode} />
    </ul>
  );
}

const Tab = ({
  children,
  setPosition,
  isActive,
  onClick,
  lightMode,
}: {
  children: React.ReactNode;
  setPosition: any;
  isActive: boolean;
  onClick: () => void;
  lightMode?: boolean;
}) => {
  const ref = useRef<HTMLLIElement>(null);
  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref.current) return;

        const { width } = ref.current.getBoundingClientRect();
        setPosition({
          width,
          opacity: 1,
          left: ref.current.offsetLeft,
        });
      }}
      onClick={onClick}
      className={`relative z-10 flex items-center gap-1.5 cursor-pointer px-4 py-1.5 text-xs uppercase tracking-wider font-bold transition-colors select-none ${
        isActive 
          ? lightMode 
            ? "text-zinc-950 font-extrabold" 
            : "text-[#FFBF00] font-extrabold"
          : lightMode 
            ? "text-zinc-500 hover:text-zinc-950" 
            : "text-zinc-400 hover:text-white"
      }`}
    >
      <span>{children}</span>
      {isActive && (
        <span className={`w-1 h-1 rounded-full ${lightMode ? 'bg-zinc-950' : 'bg-[#FFBF00] shadow-[0_0_8px_#FFBF00]'}`} />
      )}
    </li>
  );
};

const Cursor = ({ position, lightMode }: { position: any; lightMode?: boolean }) => {
  return (
    <motion.li
      animate={position}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={`absolute z-0 h-7 rounded-full pointer-events-none ${
        lightMode 
          ? "bg-zinc-100 border border-zinc-200/80 shadow-xs" 
          : "bg-white/10 border border-white/10 shadow-xs backdrop-blur-md"
      }`}
    />
  );
};
