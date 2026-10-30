import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';

interface LandingWhyProps {
  onLoginClick?: () => void;
}

export const LandingWhy = ({ onLoginClick }: LandingWhyProps) => {
  const svg1 = useRef<SVGSVGElement>(null);
  const svg2 = useRef<SVGSVGElement>(null);
  const svg3 = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const targets = [svg1.current, svg2.current, svg3.current];
    const tweens: gsap.core.Tween[] = [];

    targets.forEach((target, i) => {
      if (!target) return;
      // Gentle, elegant floating motion with organic stagger
      const tween = gsap.to(target, {
        y: -6,
        duration: 2.8 + i * 0.4,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        delay: i * 0.3,
      });
      tweens.push(tween);
    });

    return () => {
      tweens.forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className="w-full bg-white text-zinc-900 font-sans py-12 sm:py-20 px-4 sm:px-8 lg:px-16 border-y border-zinc-200/80">
      <div className="max-w-7xl mx-auto border border-zinc-200 bg-[#FAFAFA] shadow-sm rounded-2xl overflow-hidden">
        
        {/* Header Section */}
        <div className="p-8 sm:p-12 md:p-16 flex flex-col md:flex-row md:items-center justify-between gap-8 bg-white border-b border-zinc-200">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#D97706] mb-2 block">
              Why Choose ConnectUp
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-zinc-950 max-w-2xl leading-[1.15]">
              Connecting visionary founders with strategic venture capital
            </h2>
          </div>
          <div>
            <button 
              onClick={onLoginClick}
              className="inline-flex items-center gap-2.5 bg-[#FACC15] hover:bg-amber-400 text-zinc-950 px-6 py-3 rounded-full text-sm sm:text-base font-bold transition-all shadow-xs cursor-pointer group whitespace-nowrap"
            >
              <span>Log In</span>
              <div className="w-6 h-6 rounded-full bg-zinc-950/10 flex items-center justify-center transition-transform group-hover:translate-x-0.5">
                <ArrowRight className="w-3.5 h-3.5 text-zinc-950" />
              </div>
            </button>
          </div>
        </div>

        {/* 3-Column Grid with Hairline Dividers */}
        <div className="grid grid-cols-1 md:grid-cols-3">
          
          {/* COLUMN 1 */}
          <div className="flex flex-col border-b md:border-b-0 md:border-r border-zinc-200 group">
            {/* Top Text Block */}
            <div className="p-8 sm:p-10 flex flex-col gap-3 min-h-[220px] bg-white">
              <span className="text-[#D97706] font-mono text-base font-bold">01</span>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950">
                High-Signal Matching
              </h3>
              <p className="text-zinc-600 text-sm sm:text-base leading-relaxed">
                Smart deal flow filtering pairs founders directly with thesis-aligned VCs, eliminating cold pitch noise and speeding up rounds.
              </p>
            </div>

            {/* Bottom Illustration Block */}
            <div className="p-6 sm:p-10 flex-1 flex items-center justify-center border-t border-zinc-200 bg-[#F9FAFB] min-h-[300px]">
              <div className="relative w-full max-w-[320px] aspect-4/3 flex items-center justify-center">
                {/* SVG 1: High-Signal Matching Matrix */}
                <svg
                  ref={svg1}
                  viewBox="0 0 360 260"
                  fill="none"
                  className="w-full h-auto drop-shadow-sm select-none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="radarSweep" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="matchLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="50%" stopColor="#F59E0B" />
                      <stop offset="100%" stopColor="#10B981" />
                    </linearGradient>
                    <filter id="cardShadow1" x="-10%" y="-10%" width="120%" height="130%" filterUnits="userSpaceOnUse">
                      <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#0F172A" floodOpacity="0.06" />
                    </filter>
                  </defs>

                  {/* Concentric Radar Circles */}
                  <circle cx="180" cy="120" r="100" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />
                  <circle cx="180" cy="120" r="65" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />
                  <circle cx="180" cy="120" r="30" stroke="#FDE68A" strokeWidth="1.5" />
                  
                  {/* Subtle Radar Sweep Sector */}
                  <path d="M180 120 L180 20 A100 100 0 0 1 275 85 Z" fill="url(#radarSweep)" />

                  {/* Cross-hair Axes */}
                  <line x1="80" y1="120" x2="280" y2="120" stroke="#F1F5F9" strokeWidth="1.5" />
                  <line x1="180" y1="20" x2="180" y2="220" stroke="#F1F5F9" strokeWidth="1.5" />

                  {/* Connection Curve between Founder & Investor */}
                  <path
                    d="M95 105 C 130 60, 230 60, 265 105"
                    stroke="url(#matchLineGrad)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeDasharray="4 4"
                  />

                  {/* Founder Profile Mini-Card (Left) */}
                  <g filter="url(#cardShadow1)">
                    <rect x="24" y="85" width="105" height="58" rx="8" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
                    <circle cx="44" cy="106" r="10" fill="#EEF2FF" stroke="#6366F1" strokeWidth="1.5" />
                    {/* Founder icon inside */}
                    <path d="M41 109 C41 106 47 106 47 109" stroke="#6366F1" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                    <circle cx="44" cy="103" r="2.5" fill="#6366F1" />
                    <text x="60" y="103" fill="#0F172A" fontSize="9" fontWeight="700" fontFamily="sans-serif">Founders</text>
                    <text x="60" y="115" fill="#64748B" fontSize="7.5" fontFamily="sans-serif">Seed • $2M Ask</text>
                    <rect x="34" y="125" width="46" height="11" rx="3" fill="#F1F5F9" />
                    <text x="38" y="133" fill="#475569" fontSize="6.5" fontWeight="600" fontFamily="sans-serif">AI / SaaS</text>
                  </g>

                  {/* Investor Profile Mini-Card (Right) */}
                  <g filter="url(#cardShadow1)">
                    <rect x="231" y="85" width="105" height="58" rx="8" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
                    <circle cx="251" cy="106" r="10" fill="#ECFDF5" stroke="#10B981" strokeWidth="1.5" />
                    {/* Investor briefcase / diamond icon */}
                    <path d="M247 104 L251 101 L255 104 L251 110 Z" fill="#10B981" />
                    <text x="267" y="103" fill="#0F172A" fontSize="9" fontWeight="700" fontFamily="sans-serif">Tier-1 VC</text>
                    <text x="267" y="115" fill="#64748B" fontSize="7.5" fontFamily="sans-serif">$1M-$5M Check</text>
                    <rect x="241" y="125" width="54" height="11" rx="3" fill="#FEF3C7" />
                    <text x="245" y="133" fill="#B45309" fontSize="6.5" fontWeight="600" fontFamily="sans-serif">Thesis: AI B2B</text>
                  </g>

                  {/* Central Match Score Pill (Center Floating Badge) */}
                  <g filter="url(#cardShadow1)">
                    <rect x="126" y="100" width="108" height="38" rx="19" fill="#0F172A" stroke="#F59E0B" strokeWidth="1.5" />
                    <circle cx="145" cy="119" r="8" fill="#F59E0B" />
                    <path d="M142 119 L144.5 121.5 L148.5 116.5" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <text x="160" y="116" fill="#F8FAFC" fontSize="9" fontWeight="800" fontFamily="sans-serif">98% FIT</text>
                    <text x="160" y="128" fill="#CBD5E1" fontSize="7" fontWeight="500" fontFamily="sans-serif">High-Signal</text>
                  </g>

                  {/* Floating Tags at Bottom */}
                  <g filter="url(#cardShadow1)">
                    <rect x="70" y="195" width="100" height="26" rx="6" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.2" />
                    <circle cx="82" cy="208" r="3.5" fill="#10B981" />
                    <text x="91" y="211" fill="#334155" fontSize="8" fontWeight="600" fontFamily="sans-serif">Verified Traction</text>

                    <rect x="190" y="195" width="100" height="26" rx="6" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.2" />
                    <circle cx="202" cy="208" r="3.5" fill="#F59E0B" />
                    <text x="211" y="211" fill="#334155" fontSize="8" fontWeight="600" fontFamily="sans-serif">Direct Partner Intro</text>
                  </g>
                </svg>
              </div>
            </div>
          </div>

          {/* COLUMN 2 */}
          <div className="flex flex-col border-b md:border-b-0 md:border-r border-zinc-200 group">
            {/* Top Text Block */}
            <div className="p-8 sm:p-10 flex flex-col gap-3 min-h-[220px] bg-white">
              <span className="text-[#D97706] font-mono text-base font-bold">02</span>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950">
                Verified Dealrooms
              </h3>
              <p className="text-zinc-600 text-sm sm:text-base leading-relaxed">
                Streamlined due diligence with verified traction metrics, pitch decks, and investor updates in one secure space.
              </p>
            </div>

            {/* Bottom Illustration Block */}
            <div className="p-6 sm:p-10 flex-1 flex items-center justify-center border-t border-zinc-200 bg-[#F9FAFB] min-h-[300px]">
              <div className="relative w-full max-w-[320px] aspect-4/3 flex items-center justify-center">
                {/* SVG 2: Verified Diligence Vault Card */}
                <svg
                  ref={svg2}
                  viewBox="0 0 360 260"
                  fill="none"
                  className="w-full h-auto drop-shadow-sm select-none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="chartFill" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="cardHeaderGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#F8FAFC" />
                      <stop offset="100%" stopColor="#FFFFFF" />
                    </linearGradient>
                    <filter id="cardShadow2" x="-10%" y="-10%" width="120%" height="130%" filterUnits="userSpaceOnUse">
                      <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#0F172A" floodOpacity="0.08" />
                    </filter>
                  </defs>

                  {/* Background Soft Glow Plate */}
                  <rect x="40" y="25" width="280" height="205" rx="14" fill="#F1F5F9" />

                  {/* Main Elevated Dealroom Vault Card */}
                  <g filter="url(#cardShadow2)">
                    <rect x="32" y="18" width="296" height="212" rx="12" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />

                    {/* Card Header */}
                    <path d="M33 30 C33 23.37 38.37 19 45 19 L315 19 C321.63 19 327 23.37 327 30 L327 54 L33 54 Z" fill="url(#cardHeaderGrad)" />
                    <line x1="33" y1="54" x2="327" y2="54" stroke="#E2E8F0" strokeWidth="1" />

                    {/* Header Shield & Dealroom Title */}
                    <circle cx="54" cy="36" r="10" fill="#ECFDF5" stroke="#10B981" strokeWidth="1.2" />
                    <path d="M51 36 L53.5 38.5 L57.5 33.5" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <text x="72" y="35" fill="#0F172A" fontSize="9.5" fontWeight="700" fontFamily="sans-serif">Secure Dealroom</text>
                    <text x="72" y="45" fill="#64748B" fontSize="7.5" fontFamily="sans-serif">Audited Metrics & Cap Table</text>

                    {/* Status Pill Badge */}
                    <rect x="245" y="28" width="68" height="17" rx="8.5" fill="#DCFCE7" stroke="#86EFAC" strokeWidth="1" />
                    <circle cx="254" cy="36.5" r="3" fill="#16A34A" />
                    <text x="261" y="40" fill="#15803D" fontSize="7.5" fontWeight="700" fontFamily="sans-serif">VERIFIED</text>

                    {/* Left Panel: MRR Growth Trajectory Chart */}
                    <rect x="48" y="70" width="132" height="96" rx="8" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
                    <text x="58" y="86" fill="#64748B" fontSize="7.5" fontWeight="600" fontFamily="sans-serif">ARR GROWTH</text>
                    <text x="58" y="101" fill="#0F172A" fontSize="13" fontWeight="800" fontFamily="sans-serif">+142%</text>
                    <text x="110" y="100" fill="#10B981" fontSize="7.5" fontWeight="700" fontFamily="sans-serif">YoY</text>

                    {/* Mini Grid in Chart */}
                    <line x1="58" y1="115" x2="168" y2="115" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="2 2" />
                    <line x1="58" y1="135" x2="168" y2="135" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="2 2" />

                    {/* Area under curve */}
                    <path d="M58 152 Q 90 148 115 130 T 168 110 L168 155 L58 155 Z" fill="url(#chartFill)" />
                    {/* Trajectory Stroke */}
                    <path d="M58 152 Q 90 148 115 130 T 168 110" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="168" cy="110" r="3.5" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.5" />

                    {/* Right Panel: Diligence Checklist Items */}
                    <g>
                      {/* Item 1 */}
                      <rect x="190" y="70" width="124" height="28" rx="6" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
                      <circle cx="204" cy="84" r="6" fill="#DCFCE7" />
                      <path d="M202 84 L203.5 85.5 L206.5 82.5" stroke="#15803D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                      <text x="216" y="86" fill="#1E293B" fontSize="8" fontWeight="600" fontFamily="sans-serif">Cap Table Synced</text>

                      {/* Item 2 */}
                      <rect x="190" y="104" width="124" height="28" rx="6" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
                      <circle cx="204" cy="118" r="6" fill="#DCFCE7" />
                      <path d="M202 118 L203.5 119.5 L206.5 116.5" stroke="#15803D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                      <text x="216" y="120" fill="#1E293B" fontSize="8" fontWeight="600" fontFamily="sans-serif">P&L & Bank Audited</text>

                      {/* Item 3 */}
                      <rect x="190" y="138" width="124" height="28" rx="6" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
                      <circle cx="204" cy="152" r="6" fill="#DCFCE7" />
                      <path d="M202 152 L203.5 153.5 L206.5 150.5" stroke="#15803D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                      <text x="216" y="154" fill="#1E293B" fontSize="8" fontWeight="600" fontFamily="sans-serif">IP & Corporate Clean</text>
                    </g>

                    {/* Bottom Security Footer */}
                    <line x1="33" y1="180" x2="327" y2="180" stroke="#F1F5F9" strokeWidth="1" />
                    <rect x="48" y="190" width="14" height="14" rx="3" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1" />
                    {/* Padlock icon */}
                    <path d="M52 195 L52 194 C52 192.5 54 192.5 55 192.5 C56 192.5 58 192.5 58 194 L58 195" stroke="#B45309" strokeWidth="1" fill="none" />
                    <rect x="52" y="195" width="6" height="5" rx="1" fill="#B45309" />
                    <text x="68" y="200" fill="#475569" fontSize="7.5" fontWeight="500" fontFamily="sans-serif">
                      SOC-2 Type II Certified • 256-bit Encrypted Vault
                    </text>
                  </g>
                </svg>
              </div>
            </div>
          </div>

          {/* COLUMN 3 */}
          <div className="flex flex-col group">
            {/* Top Text Block */}
            <div className="p-8 sm:p-10 flex flex-col gap-3 min-h-[220px] bg-white">
              <span className="text-[#D97706] font-mono text-base font-bold">03</span>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950">
                Global Venture Network
              </h3>
              <p className="text-zinc-600 text-sm sm:text-base leading-relaxed">
                Connect across top global startup hubs to build international investor syndicates and expand into new markets.
              </p>
            </div>

            {/* Bottom Illustration Block */}
            <div className="p-6 sm:p-10 flex-1 flex items-center justify-center border-t border-zinc-200 bg-[#F9FAFB] min-h-[300px]">
              <div className="relative w-full max-w-[320px] aspect-4/3 flex items-center justify-center">
                {/* SVG 3: Global Venture Constellation Hub */}
                <svg
                  ref={svg3}
                  viewBox="0 0 360 260"
                  fill="none"
                  className="w-full h-auto drop-shadow-sm select-none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="globalGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FACC15" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#EA580C" stopOpacity="0.05" />
                    </linearGradient>
                    <linearGradient id="orbitArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#F59E0B" />
                      <stop offset="50%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#10B981" />
                    </linearGradient>
                    <filter id="cardShadow3" x="-10%" y="-10%" width="120%" height="130%" filterUnits="userSpaceOnUse">
                      <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#0F172A" floodOpacity="0.07" />
                    </filter>
                  </defs>

                  {/* Stylized Globe Coordinate Grid Lines */}
                  <ellipse cx="180" cy="115" rx="140" ry="75" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />
                  <ellipse cx="180" cy="115" rx="95" ry="50" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3 3" />
                  <ellipse cx="180" cy="115" rx="50" ry="25" stroke="#FDE68A" strokeWidth="1.2" />

                  {/* Connecting Syndicate Arcs between Cities */}
                  {/* SF to NYC */}
                  <path d="M75 110 Q 115 50 155 75" stroke="url(#orbitArcGrad)" strokeWidth="2" fill="none" strokeDasharray="4 4" />
                  {/* NYC to London */}
                  <path d="M155 75 Q 195 40 235 70" stroke="url(#orbitArcGrad)" strokeWidth="2" fill="none" strokeDasharray="4 4" />
                  {/* London to Singapore */}
                  <path d="M235 70 Q 275 90 295 130" stroke="url(#orbitArcGrad)" strokeWidth="2" fill="none" strokeDasharray="4 4" />
                  {/* Global return loop */}
                  <path d="M295 130 Q 180 185 75 110" stroke="#CBD5E1" strokeWidth="1.5" fill="none" strokeDasharray="3 3" />

                  {/* Node 1: Silicon Valley (SF) */}
                  <g filter="url(#cardShadow3)">
                    <circle cx="75" cy="110" r="14" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="2" />
                    <circle cx="75" cy="110" r="6" fill="#F59E0B" />
                    <rect x="42" y="130" width="66" height="18" rx="4" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
                    <text x="75" y="142" fill="#0F172A" fontSize="7.5" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">SF Bay Area</text>
                  </g>

                  {/* Node 2: New York City (NYC) */}
                  <g filter="url(#cardShadow3)">
                    <circle cx="155" cy="75" r="13" fill="#FFFFFF" stroke="#3B82F6" strokeWidth="2" />
                    <circle cx="155" cy="75" r="5" fill="#3B82F6" />
                    <rect x="130" y="44" width="50" height="18" rx="4" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
                    <text x="155" y="56" fill="#0F172A" fontSize="7.5" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">New York</text>
                  </g>

                  {/* Node 3: London */}
                  <g filter="url(#cardShadow3)">
                    <circle cx="235" cy="70" r="13" fill="#FFFFFF" stroke="#6366F1" strokeWidth="2" />
                    <circle cx="235" cy="70" r="5" fill="#6366F1" />
                    <rect x="214" y="38" width="44" height="18" rx="4" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
                    <text x="236" y="50" fill="#0F172A" fontSize="7.5" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">London</text>
                  </g>

                  {/* Node 4: Singapore */}
                  <g filter="url(#cardShadow3)">
                    <circle cx="295" cy="130" r="13" fill="#FFFFFF" stroke="#10B981" strokeWidth="2" />
                    <circle cx="295" cy="130" r="5" fill="#10B981" />
                    <rect x="268" y="150" width="54" height="18" rx="4" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
                    <text x="295" y="162" fill="#0F172A" fontSize="7.5" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">Singapore</text>
                  </g>

                  {/* Center Energy Core / Pulse */}
                  <circle cx="180" cy="115" r="24" fill="url(#globalGlow)" />
                  <circle cx="180" cy="115" r="9" fill="#0F172A" stroke="#F59E0B" strokeWidth="2" />
                  <circle cx="180" cy="115" r="3" fill="#FACC15" />

                  {/* Floating Syndicate Activity Card at Bottom */}
                  <g filter="url(#cardShadow3)">
                    <rect x="65" y="186" width="230" height="42" rx="10" fill="#0F172A" stroke="#334155" strokeWidth="1" />
                    
                    {/* Small Globe or Sparkle Badge */}
                    <circle cx="86" cy="207" r="11" fill="#1E293B" stroke="#F59E0B" strokeWidth="1.2" />
                    <path d="M86 201 L88 205 L92 207 L88 209 L86 213 L84 209 L80 207 L84 205 Z" fill="#FACC15" />

                    {/* Text Details */}
                    <text x="105" y="202" fill="#FFFFFF" fontSize="8.5" fontWeight="700" fontFamily="sans-serif">
                      Global Syndicate Active
                    </text>
                    <text x="105" y="214" fill="#94A3B8" fontSize="7.5" fontFamily="sans-serif">
                      $4.2M Co-investment • 12 Global Funds
                    </text>

                    {/* Live Dot */}
                    <circle cx="276" cy="207" r="3" fill="#10B981" />
                    <circle cx="276" cy="207" r="6" fill="#10B981" fillOpacity="0.3" />
                  </g>
                </svg>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};