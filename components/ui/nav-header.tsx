"use client"; 

import React, { useRef, useState } from "react";
import { motion } from "motion/react";

export interface NavItemDef {
  id: string;
  label: string;
}

export function NavHeader({
  pages,
  currentPage,
  onNavigate,
  lightMode = false,
}: {
  pages: (string | NavItemDef)[];
  currentPage: string;
  onNavigate: (page: string) => void;
  lightMode?: boolean;
}) {
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  const normalizedPages = pages.map((p) => {
    if (typeof p === "string") {
      const labelMap: Record<string, string> = {
        home: "Home",
        about: "About",
        why: "Why Us",
        founders: "Founders",
        pricing: "Pricing",
        blog: "Blog",
        contact: "Contact",
      };
      return {
        id: p,
        label: labelMap[p] || (p.charAt(0).toUpperCase() + p.slice(1)),
      };
    }
    return p;
  });

  const activeId = currentPage === "founders" ? "about" : currentPage;

  return (
    <ul
      className="relative mx-auto hidden lg:flex w-fit items-center"
      onMouseLeave={() => setPosition((pv) => ({ ...pv, opacity: 0 }))}
    >
      {normalizedPages.map((item) => (
        <Tab 
          key={item.id} 
          setPosition={setPosition} 
          isActive={activeId === item.id}
          onClick={() => onNavigate(item.id)}
          lightMode={lightMode}
        >
          {item.label}
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
      className={`relative z-10 block cursor-pointer px-3 py-1.5 text-xs uppercase tracking-wider transition-colors md:px-4 md:py-2 md:text-xs font-bold ${
        lightMode
          ? isActive ? "text-zinc-950 font-extrabold" : "text-zinc-700 hover:text-zinc-950"
          : isActive ? "text-[#FFBF00] font-extrabold" : "text-white hover:text-white/80"
      }`}
    >
      {children}
    </li>
  );
};

const Cursor = ({ position, lightMode }: { position: any; lightMode?: boolean }) => {
  return (
    <motion.li
      animate={position}
      className={`absolute z-0 h-8 md:h-8 rounded-full ${
        lightMode ? "bg-zinc-900/10" : "bg-white/10"
      }`}
    />
  );
};
