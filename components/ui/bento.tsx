"use client";

import React from "react";
import { clsx } from "clsx";
import { motion } from "framer-motion";

import matchingBoardroomImg from "@/src/assets/images/bento_matching_boardroom_1794679452133.jpg";
import verifiedVaultImg from "@/src/assets/images/bento_verified_vault_1794679452190.jpg";
import founderSprintImg from "@/src/assets/images/bento_founder_sprint_1794679452825.jpg";
import partnerAtriumImg from "@/src/assets/images/bento_partner_atrium_1794679452671.jpg";
import globalSkylineImg from "@/src/assets/images/bento_global_skyline_1794679453191.jpg";

export interface BentoCardItem {
  eyebrow: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
  imageSrc: string;
  imageAlt: string;
  className?: string;
}

const DEFAULT_CARDS: BentoCardItem[] = [
  {
    eyebrow: "01 · Smart Matching",
    title: "Matched by stage and sector",
    description:
      "Connect directly with active VCs, investors, and angels looking for what you build.",
    imageSrc: matchingBoardroomImg,
    imageAlt: "Executive boardroom overlooking twilight city skyline",
    className: "max-lg:rounded-t-4xl lg:col-span-3 lg:rounded-tl-4xl",
  },
  {
    eyebrow: "02 · Verified Dealrooms",
    title: "Share everything in one room",
    description:
      "Keep your pitch, metrics, and updates organized for investors and angels.",
    imageSrc: verifiedVaultImg,
    imageAlt: "Illuminated archival vault drawers for audited venture records",
    className: "lg:col-span-3 lg:rounded-tr-4xl",
  },
  {
    eyebrow: "03 · Fast Intros",
    title: "Go from intro to call fast",
    description:
      "Skip cold emails and book calls with venture partners and angel investors directly.",
    imageSrc: founderSprintImg,
    imageAlt: "Founders collaborating over pitch notes at golden hour",
    className: "lg:col-span-2 lg:rounded-bl-4xl",
  },
  {
    eyebrow: "04 · Direct Access",
    title: "Reach real decision makers",
    description:
      "Talk straight to venture partners and active angel investors backing new ideas.",
    imageSrc: partnerAtriumImg,
    imageAlt: "Venture partners meeting inside a modern stone and glass atrium",
    className: "lg:col-span-2",
  },
  {
    eyebrow: "05 · Global Reach",
    title: "Backers around the world",
    description:
      "Meet investors and angel networks across San Francisco, London, Lagos, and Singapore.",
    imageSrc: globalSkylineImg,
    imageAlt: "Global financial skyline illuminated at twilight",
    className: "max-lg:rounded-b-4xl lg:col-span-2 lg:rounded-br-4xl",
  },
];

export interface FUIBentoGridDarkProps {
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  cards?: BentoCardItem[];
}

export default function FUIBentoGridDark({
  eyebrow = "Why Choose ConnectUp",
  heading = "Connect with venture firms, investors, and angels.",
  subheading = "One simple place to share your idea and meet the right backers.",
  cards = DEFAULT_CARDS,
}: FUIBentoGridDarkProps) {
  return (
    <div className="relative w-full py-20 sm:py-28 px-4 sm:px-8 lg:px-16 bg-zinc-950/55 backdrop-blur-2xl border-y border-white/10 text-white overflow-hidden">
      {/* Ambient refraction glows behind frosted glass cards */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/4 w-[420px] h-[420px] rounded-full bg-amber-400/12 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 right-1/5 w-[460px] h-[460px] rounded-full bg-indigo-400/10 blur-[130px]"
      />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col">
        <span className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[#FACC15] mb-3">
          {eyebrow}
        </span>
        <h2 className="font-sans tracking-tight text-3xl sm:text-4xl md:text-5xl font-bold text-white max-w-3xl leading-[1.12] [text-wrap:balance]">
          {heading}
        </h2>
        <p className="max-w-2xl text-base sm:text-lg leading-relaxed tracking-tight mt-4 text-zinc-300/90">
          {subheading}
        </p>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:mt-14 lg:grid-cols-6 lg:grid-rows-2">
          {cards.map((card, index) => (
            <BentoCard
              key={index}
              dark
              eyebrow={card.eyebrow}
              title={card.title}
              description={card.description}
              fade={["bottom"]}
              graphic={
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/80 via-zinc-950/80 to-amber-950/30">
                  <img
                    src={card.imageSrc}
                    alt={card.imageAlt}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-85 transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/85 via-zinc-950/35 to-white/[0.04]" />
                </div>
              }
              className={card.className}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function BentoCard({
  dark = false,
  className = "",
  eyebrow,
  title,
  description,
  graphic,
  fade = [],
}: {
  dark?: boolean;
  className?: string;
  eyebrow: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
  graphic?: React.ReactNode;
  fade?: ("top" | "bottom")[];
}) {
  return (
    <motion.div
      initial="idle"
      whileHover="active"
      variants={{
        idle: { y: 0 },
        active: { y: -2 },
      }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      data-dark={dark ? "true" : undefined}
      className={clsx(
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl",
        "bg-white/[0.04] backdrop-blur-2xl backdrop-saturate-150 transform-gpu",
        "border border-white/15 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.18),0_20px_50px_-15px_rgba(0,0,0,0.65)]",
        "hover:border-white/30 hover:bg-white/[0.07] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.28),0_24px_60px_-12px_rgba(250,204,21,0.14)]",
        "transition-all duration-200",
        className
      )}
    >
      {/* Subtle diagonal specular glass sheen */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-br from-white/[0.10] via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"
      />

      <div className="relative h-[22rem] sm:h-[24rem] shrink-0 overflow-hidden">
        {graphic}
        {fade.includes("top") && (
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/70 via-transparent to-transparent opacity-60 pointer-events-none" />
        )}
        {fade.includes("bottom") && (
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/30 to-transparent opacity-90 pointer-events-none" />
        )}
      </div>

      <div className="relative p-7 sm:p-8 z-20 isolate mt-[-128px] bg-zinc-950/45 backdrop-blur-2xl backdrop-saturate-150 border-t border-white/15 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)] text-white">
        <div className="text-xs font-mono font-semibold uppercase tracking-wider text-[#FACC15]">
          {eyebrow}
        </div>
        <h3 className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-white">
          {title}
        </h3>
        <p className="mt-2 max-w-[540px] text-sm leading-relaxed text-zinc-200/90">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
