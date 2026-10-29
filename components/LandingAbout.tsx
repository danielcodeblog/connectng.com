import React, { useRef } from 'react';
import { ArrowRight, Sparkles, Target, Zap, Shield, CheckCircle2 } from 'lucide-react';
import { TypewriterSequence } from './TypewriterSequence';
import connectImg from '../src/assets/images/connect.png';

export const LandingAbout = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="w-full py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-white text-zinc-900 relative overflow-hidden border-b border-zinc-200" ref={containerRef}>
      {/* Subtle Background Glow */}
      <div className="absolute top-1/4 -right-48 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-48 w-96 h-96 bg-[#FFBF00]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* Story Chapter Heading (Paragraph removed per request) */}
        <div className="mb-14 sm:mb-20 flex flex-col items-center text-center">
          <span className="text-xs tracking-[0.25em] font-mono font-bold uppercase text-amber-800 bg-amber-100 border border-amber-200 px-4 py-1.5 rounded-full mb-4 shadow-xs">
            The Story & Mission
          </span>
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-black text-zinc-950 leading-tight tracking-tight">
            Pitching, <span className="italic font-serif font-light text-amber-600">Evolved.</span>
          </h2>
        </div>

        {/* Narrative Bento Grid */}
        <div className="grid lg:grid-cols-12 gap-6 items-stretch">
          {/* Main Statement */}
          <div className="lg:col-span-7 p-8 sm:p-12 md:p-14 bg-zinc-50 border border-zinc-200/80 rounded-[2.5rem] flex flex-col justify-between shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-700 mb-4 block">
                01 / THE PHILOSOPHY
              </span>
              <TypewriterSequence 
                className="font-serif text-2xl sm:text-3xl md:text-4xl font-light text-zinc-900 leading-snug tracking-tight mb-8 block"
                disableAnimation
                segments={[
                  { text: "We believe the strongest venture partnerships start with " },
                  { text: "instant alignment", className: "text-amber-600 font-normal italic" },
                  { text: ", not endless cold outreach. We are redefining how founders tell their stories and how capital is deployed." }
                ]}
              />
            </div>
          </div>

          {/* Side Visual Card */}
          <div className="lg:col-span-5 relative bg-zinc-900 text-white border border-zinc-800 rounded-[2.5rem] overflow-hidden min-h-[320px] p-8 flex flex-col justify-between group shadow-xl">
            <div className="absolute inset-0 z-0">
              <img 
                src={connectImg} 
                alt="ConnectUp Network" 
                className="w-full h-full object-cover opacity-35 group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent" />
            </div>

            <div className="relative z-10 flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                02 / THE ECOSYSTEM
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <div className="relative z-10 space-y-3">
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Direct Deal Channels
              </h3>
              <p className="text-zinc-300 text-sm leading-relaxed">
                Skip the gatekeepers. Verified founders connect directly with thesis-aligned angel syndicates and venture partners.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-bold text-[#FFBF00]">
                <span>No broker fees. Zero warm intro loops.</span>
              </div>
            </div>
          </div>

          {/* Lower Story Comparison Grid: Old Way vs ConnectUp Way */}
          <div className="lg:col-span-12 grid md:grid-cols-2 gap-6 pt-2">
            <div className="p-8 sm:p-10 rounded-[2rem] bg-red-50 border border-red-200">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-black">✕</span>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-700">The Outdated Fundraising Playbook</span>
              </div>
              <ul className="space-y-3 text-sm text-zinc-700 font-light">
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span>200+ cold emails with static PDF decks yielding less than 2% response rate</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span>Months of radio silence while burning through crucial startup runway</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span>Unvetted terms, opaque investor feedback, and heavy broker cuts</span>
                </li>
              </ul>
            </div>

            <div className="p-8 sm:p-10 rounded-[2rem] bg-amber-50 border border-amber-200">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-black">✓</span>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-800">The ConnectUp Platform Way</span>
              </div>
              <ul className="space-y-3 text-sm text-zinc-800 font-light">
                <li className="flex items-start gap-2.5">
                  <span className="text-amber-600 mt-0.5">•</span>
                  <span>Stage & thesis match engine guarantees every conversation has active mandate</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-amber-600 mt-0.5">•</span>
                  <span>Interactive pitch rooms showcase verified traction, cap tables, and live metrics</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-amber-600 mt-0.5">•</span>
                  <span>Private direct messaging with lead syndicates and zero platform cut on your round</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
