"use client";

import React from "react";
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
      role="menubar"
      aria-label="Main Navigation"
      className="relative mx-auto hidden lg:flex items-center gap-1 w-fit p-1 select-none"
    >
      {normalizedPages.map((item) => {
        const isActive = activeId === item.id;
        return (
          <li
            key={item.id}
            role="menuitem"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onNavigate(item.id);
              }
            }}
            onClick={() => onNavigate(item.id)}
            className={`relative flex items-center gap-1.5 cursor-pointer px-4 py-2 text-xs tracking-wider uppercase font-bold transition-colors duration-150 select-none rounded-full outline-none focus-visible:ring-2 focus-visible:ring-amber-400 text-black ${
              isActive
                ? "text-black font-extrabold"
                : "text-black hover:text-black/80 hover:bg-black/5 font-medium"
            }`}
          >
            {/* Active Pill using motion layoutId for zero-glitch transition */}
            {isActive && (
              <motion.div
                layoutId="nav-active-indicator"
                transition={{
                  type: "spring",
                  stiffness: 420,
                  damping: 32,
                  mass: 0.7,
                }}
                className="absolute inset-0 rounded-full z-0 pointer-events-none bg-black/10 border border-black/15 shadow-xs"
              />
            )}

            <span className="relative z-10 text-black">{item.label}</span>
            {isActive && (
              <span className="relative z-10 w-1.5 h-1.5 rounded-full bg-black" />
            )}
          </li>
        );
      })}
    </ul>
  );
}
