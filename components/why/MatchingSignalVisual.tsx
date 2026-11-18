import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import NumberFlow from '@number-flow/react';

interface Criterion {
  id: string;
  label: string;
  detail: string;
  score: number;
  weight: number;
  path: string;
  anchorY: number;
  partner: string;
  checkRange: string;
}

const MATCH_CRITERIA: Criterion[] = [
  {
    id: 'stage',
    label: 'Stage & Check Size',
    detail: 'Seed · $2.0M Target',
    score: 99.2,
    weight: 0.99,
    path: 'M 22 44 C 82 44, 96 20, 150 20 C 204 20, 218 44, 278 44',
    anchorY: 20,
    partner: 'Apex Ventures',
    checkRange: '$1M–$5M Lead',
  },
  {
    id: 'thesis',
    label: 'Sector Mandate',
    detail: 'Applied AI Infra',
    score: 97.4,
    weight: 0.97,
    path: 'M 22 44 C 95 44, 110 44, 150 44 C 190 44, 205 44, 278 44',
    anchorY: 44,
    partner: 'Horizon Capital',
    checkRange: '$2M–$6M Core',
  },
  {
    id: 'traction',
    label: 'Revenue Velocity',
    detail: 'Stripe Verified · 3.4x',
    score: 98.6,
    weight: 0.985,
    path: 'M 22 44 C 82 44, 96 68, 150 68 C 204 68, 218 44, 278 44',
    anchorY: 68,
    partner: 'Meridian Partners',
    checkRange: '$1.5M–$4M Lead',
  },
];

export const MatchingSignalVisual: React.FC = () => {
  const [activeId, setActiveId] = useState<string>('stage');
  const [isPaused, setIsPaused] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (isPaused || prefersReducedMotion) return;
    const timer = window.setInterval(() => {
      setActiveId((prev) => {
        const idx = MATCH_CRITERIA.findIndex((c) => c.id === prev);
        return MATCH_CRITERIA[(idx + 1) % MATCH_CRITERIA.length].id;
      });
    }, 3800);
    return () => window.clearInterval(timer);
  }, [isPaused, prefersReducedMotion]);

  const active = MATCH_CRITERIA.find((c) => c.id === activeId) || MATCH_CRITERIA[0];
  const gaugeCircumference = 2 * Math.PI * 16;

  return (
    <div
      className="w-full max-w-[356px] bg-white border border-zinc-200/90 rounded-xl shadow-[0_14px_34px_-12px_rgba(9,9,11,0.1)] overflow-hidden transition-transform duration-200 ease-out group-hover:-translate-y-0.5"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Top Alignment Summary with Precision Radial Ring & NumberFlow */}
      <div className="px-4 py-3.5 border-b border-zinc-100 flex items-center justify-between gap-3 bg-zinc-50/75">
        <div className="min-w-0">
          <div className="text-[11px] font-medium text-zinc-500">Thesis Alignment</div>
          <div className="text-xs font-semibold text-zinc-950 mt-0.5 truncate">
            Kestrel AI · {active.partner}
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <div className="text-right">
            <div className="text-xl font-bold tracking-tight text-zinc-950 tabular-nums leading-none">
              <NumberFlow
                value={active.score}
                format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
                suffix="%"
              />
            </div>
            <span className="block text-[10px] font-semibold text-[#B45309] mt-0.5">Match Index</span>
          </div>

          <svg viewBox="0 0 40 40" className="w-9 h-9 -rotate-90 shrink-0" aria-hidden="true">
            <circle cx="20" cy="20" r="16" fill="none" stroke="#E4E4E7" strokeWidth="2.5" />
            <motion.circle
              cx="20"
              cy="20"
              r="16"
              fill="none"
              stroke="#D97706"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={gaugeCircumference}
              initial={false}
              animate={{
                strokeDashoffset: gaugeCircumference * (1 - active.weight),
              }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            />
          </svg>
        </div>
      </div>

      {/* Neural Vector Routing Graph */}
      <div className="px-4 pt-3.5 pb-3 border-b border-zinc-100 bg-white">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <div>
            <div className="font-semibold text-zinc-950">Kestrel AI</div>
            <div className="text-[11px] text-zinc-500 tabular-nums">Seed · $2.0M Ask</div>
          </div>
          <div className="text-right">
            <div className="font-semibold text-zinc-950">{active.partner}</div>
            <div className="text-[11px] text-zinc-500 tabular-nums">{active.checkRange}</div>
          </div>
        </div>

        <svg
          viewBox="0 0 300 88"
          fill="none"
          className="w-full h-[84px] select-none overflow-visible"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="why-match-active-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#18181B" />
              <stop offset="50%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <radialGradient id="why-match-halo" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
            </radialGradient>
            <filter id="why-match-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Precision Coordinate Guides */}
          <line x1="22" y1="20" x2="278" y2="20" stroke="#F4F4F5" strokeWidth="1" />
          <line x1="22" y1="44" x2="278" y2="44" stroke="#F4F4F5" strokeWidth="1" />
          <line x1="22" y1="68" x2="278" y2="68" stroke="#F4F4F5" strokeWidth="1" />
          <line x1="150" y1="8" x2="150" y2="80" stroke="#E4E4E7" strokeWidth="1" strokeDasharray="2 3" />

          {/* Inactive Routing Splines */}
          {MATCH_CRITERIA.map((c) => {
            const isActive = c.id === active.id;
            return (
              <g key={c.id}>
                <path
                  d={c.path}
                  stroke={isActive ? 'url(#why-match-active-grad)' : '#E4E4E7'}
                  strokeWidth={isActive ? 2.25 : 1.25}
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />
                <circle
                  cx="150"
                  cy={c.anchorY}
                  r={isActive ? 5 : 3}
                  fill={isActive ? '#D97706' : '#FFFFFF'}
                  stroke={isActive ? '#FFFFFF' : '#D4D4D8'}
                  strokeWidth="1.5"
                />
              </g>
            );
          })}

          {/* Halo around Active Vector Midpoint */}
          <circle cx="150" cy={active.anchorY} r="15" fill="url(#why-match-halo)" />

          {/* Traveling Signal Packet along Active Path */}
          {!prefersReducedMotion && (
            <g filter="url(#why-match-glow)">
              <circle r="3.5" fill="#F59E0B">
                <animateMotion
                  key={active.id}
                  dur="1.9s"
                  repeatCount="indefinite"
                  path={active.path}
                  calcMode="spline"
                  keySplines="0.4 0 0.2 1"
                  keyTimes="0;1"
                />
              </circle>
              <circle r="2" fill="#FFFFFF">
                <animateMotion
                  key={`${active.id}-core`}
                  dur="1.9s"
                  repeatCount="indefinite"
                  path={active.path}
                  calcMode="spline"
                  keySplines="0.4 0 0.2 1"
                  keyTimes="0;1"
                />
              </circle>
            </g>
          )}

          {/* Endpoint Terminals */}
          <rect x="14" y="36" width="16" height="16" rx="4" fill="#18181B" />
          <path d="M 19 44 H 25 M 22 41 V 47" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round" />

          <rect x="270" y="36" width="16" height="16" rx="4" fill="#059669" />
          <path d="M 274.5 44 L 277 46.5 L 281.5 41.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Interactive Thesis Criteria Rows with Shared Spring Indicator */}
      <div className="divide-y divide-zinc-100">
        {MATCH_CRITERIA.map((row) => {
          const isActive = active.id === row.id;
          return (
            <button
              key={row.id}
              type="button"
              onClick={() => {
                setActiveId(row.id);
                setIsPaused(true);
              }}
              aria-pressed={isActive}
              className={`relative w-full px-4 py-2.5 flex items-center justify-between gap-2 text-left transition-colors duration-150 cursor-pointer ${
                isActive ? 'bg-amber-50/55' : 'bg-white hover:bg-zinc-50'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="why-match-row-indicator"
                  className="absolute inset-y-1.5 left-1.5 w-0.5 rounded-full bg-[#D97706]"
                  transition={{ type: 'spring', stiffness: 460, damping: 34 }}
                />
              )}
              <div className="min-w-0 pl-2">
                <div className="text-xs font-medium text-zinc-900 truncate">{row.label}</div>
                <div className="text-[11px] text-zinc-500 truncate">{row.detail}</div>
              </div>
              <div className="flex items-center gap-2.5 shrink-0">
                <div className="w-12 h-1 bg-zinc-100 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full origin-left ${
                      isActive ? 'bg-[#D97706]' : 'bg-zinc-300'
                    }`}
                    initial={false}
                    animate={{ scaleX: row.weight }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
                <span
                  className={`text-xs font-semibold tabular-nums w-11 text-right ${
                    isActive ? 'text-[#B45309]' : 'text-zinc-700'
                  }`}
                >
                  {row.score.toFixed(1)}%
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
