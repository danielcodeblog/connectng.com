import React, { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import NumberFlow from '@number-flow/react';

interface QuarterPoint {
  label: string;
  value: number;
  formatted: string;
  x: number;
  y: number;
}

interface DiligencePillar {
  id: string;
  title: string;
  source: string;
  status: string;
  metric: string;
  kpiLabel: string;
  kpiValue: number;
  kpiPrefix: string;
  kpiSuffix: string;
  kpiNote: string;
  accentColor: string;
  strokePath: string;
  areaPath: string;
  points: QuarterPoint[];
}

const DILIGENCE_PILLARS: DiligencePillar[] = [
  {
    id: 'cap',
    title: 'Cap Table & SAFE Ledger',
    source: 'Carta Synced',
    status: 'Verified',
    metric: '14 Shareholders',
    kpiLabel: 'Verified ARR Growth',
    kpiValue: 142.8,
    kpiPrefix: '+',
    kpiSuffix: '%',
    kpiNote: 'YoY Audited',
    accentColor: '#059669',
    strokePath: 'M 10 48 C 44 46, 68 38, 96 34 C 128 29, 156 22, 184 18 C 216 14, 244 10, 270 6',
    areaPath: 'M 10 48 C 44 46, 68 38, 96 34 C 128 29, 156 22, 184 18 C 216 14, 244 10, 270 6 L 270 58 L 10 58 Z',
    points: [
      { label: 'Q1', value: 48.2, formatted: '+48.2%', x: 10, y: 48 },
      { label: 'Q2', value: 79.5, formatted: '+79.5%', x: 96, y: 34 },
      { label: 'Q3', value: 112.4, formatted: '+112.4%', x: 184, y: 18 },
      { label: 'Q4', value: 142.8, formatted: '+142.8%', x: 270, y: 6 },
    ],
  },
  {
    id: 'audit',
    title: 'P&L & Treasury Statements',
    source: 'Mercury Direct',
    status: 'Cleared',
    metric: '24.5 Mo. Runway',
    kpiLabel: 'Treasury Runway',
    kpiValue: 24.5,
    kpiPrefix: '',
    kpiSuffix: ' Mo.',
    kpiNote: 'Zero Debt',
    accentColor: '#D97706',
    strokePath: 'M 10 40 C 44 37, 72 34, 96 31 C 130 27, 154 24, 184 19 C 214 14, 244 12, 270 10',
    areaPath: 'M 10 40 C 44 37, 72 34, 96 31 C 130 27, 154 24, 184 19 C 214 14, 244 12, 270 10 L 270 58 L 10 58 Z',
    points: [
      { label: 'Q1', value: 16.0, formatted: '16.0 Mo.', x: 10, y: 40 },
      { label: 'Q2', value: 18.8, formatted: '18.8 Mo.', x: 96, y: 31 },
      { label: 'Q3', value: 21.4, formatted: '21.4 Mo.', x: 184, y: 19 },
      { label: 'Q4', value: 24.5, formatted: '24.5 Mo.', x: 270, y: 10 },
    ],
  },
  {
    id: 'ip',
    title: 'IP Assignment & Charter',
    source: 'Delaware C-Corp',
    status: 'Executed',
    metric: '14/14 Filings',
    kpiLabel: 'Diligence Clearance',
    kpiValue: 100.0,
    kpiPrefix: '',
    kpiSuffix: '%',
    kpiNote: 'Zero Liens',
    accentColor: '#18181B',
    strokePath: 'M 10 46 C 42 40, 72 28, 96 24 C 128 19, 156 15, 184 12 C 216 9, 244 8, 270 7',
    areaPath: 'M 10 46 C 42 40, 72 28, 96 24 C 128 19, 156 15, 184 12 C 216 9, 244 8, 270 7 L 270 58 L 10 58 Z',
    points: [
      { label: 'Q1', value: 64.0, formatted: '64.0%', x: 10, y: 46 },
      { label: 'Q2', value: 82.0, formatted: '82.0%', x: 96, y: 24 },
      { label: 'Q3', value: 94.0, formatted: '94.0%', x: 184, y: 12 },
      { label: 'Q4', value: 100.0, formatted: '100.0%', x: 270, y: 7 },
    ],
  },
];

export const DealroomVaultVisual: React.FC = () => {
  const [activeId, setActiveId] = useState<string>('cap');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const current = DILIGENCE_PILLARS.find((d) => d.id === activeId) || DILIGENCE_PILLARS[0];
  const inspectedPoint = hoveredIdx !== null ? current.points[hoveredIdx] : current.points[3];

  const handleChartPointerMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width) * 280;
    let nearest = 0;
    let minDist = Infinity;
    current.points.forEach((pt, i) => {
      const dist = Math.abs(pt.x - relX);
      if (dist < minDist) {
        minDist = dist;
        nearest = i;
      }
    });
    setHoveredIdx(nearest);
  };

  return (
    <div className="w-full max-w-[356px] bg-white border border-zinc-200/90 rounded-xl shadow-[0_14px_34px_-12px_rgba(9,9,11,0.1)] overflow-hidden transition-transform duration-200 ease-out group-hover:-translate-y-0.5">
      {/* Vault Header with Animated Cryptographic Seal */}
      <div className="px-4 py-3.5 border-b border-zinc-100 flex items-center justify-between gap-2 bg-zinc-50/75">
        <div className="text-xs font-semibold text-zinc-950 truncate">
          Dealroom DR-409 <span className="text-zinc-400 font-normal">·</span>{' '}
          <span className="text-zinc-500 font-normal">SOC-2 Vault</span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" aria-hidden="true">
            <circle cx="8" cy="8" r="7" stroke="#059669" strokeOpacity="0.28" strokeWidth="1.25" />
            <motion.path
              key={current.id}
              d="M 5 8.2 L 7.1 10.3 L 11.2 6.1"
              stroke="#059669"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={prefersReducedMotion ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            />
          </svg>
          <AnimatePresence mode="wait">
            <motion.span
              key={current.status}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              transition={{ duration: 0.16 }}
              className="text-[11px] font-semibold text-[#047857] whitespace-nowrap"
            >
              {current.status}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* Telemetry Chart with Interactive Crosshair Scrubber */}
      <div className="px-4 pt-3.5 pb-2.5 border-b border-zinc-100">
        <div className="flex items-baseline justify-between mb-2">
          <div>
            <span className="text-[11px] font-medium text-zinc-500 block">{current.kpiLabel}</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold tracking-tight text-zinc-950 tabular-nums">
                <NumberFlow
                  value={inspectedPoint.value}
                  prefix={current.kpiPrefix}
                  suffix={current.kpiSuffix}
                  format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
                />
              </span>
              <span className="text-[11px] font-medium text-[#047857]">
                {hoveredIdx !== null ? inspectedPoint.label : current.kpiNote}
              </span>
            </div>
          </div>
          <span className="text-[11px] font-mono text-zinc-500 tabular-nums">
            {hoveredIdx !== null ? `${inspectedPoint.label} Snapshot` : 'Q1–Q4'}
          </span>
        </div>

        <svg
          viewBox="0 0 280 62"
          fill="none"
          className="w-full h-[64px] select-none cursor-crosshair overflow-visible"
          onMouseMove={handleChartPointerMove}
          onMouseLeave={() => setHoveredIdx(null)}
          role="img"
          aria-label={`${current.kpiLabel} quarterly trajectory`}
        >
          <defs>
            <linearGradient id="why-vault-area-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={current.accentColor} stopOpacity="0.22" />
              <stop offset="100%" stopColor={current.accentColor} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Horizontal Hairlines */}
          <line x1="0" y1="16" x2="280" y2="16" stroke="#F4F4F5" strokeWidth="1" />
          <line x1="0" y1="36" x2="280" y2="36" stroke="#F4F4F5" strokeWidth="1" />
          <line x1="0" y1="56" x2="280" y2="56" stroke="#F4F4F5" strokeWidth="1" />

          {/* Area & Animated Trajectory Draw-On */}
          <motion.path
            key={`${current.id}-area`}
            d={current.areaPath}
            fill="url(#why-vault-area-grad)"
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
          />
          <motion.path
            key={`${current.id}-stroke`}
            d={current.strokePath}
            stroke={current.accentColor}
            strokeWidth="2.25"
            strokeLinecap="round"
            initial={prefersReducedMotion ? false : { pathLength: 0.15, opacity: 0.4 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Interactive Scrubber Vertical Hairline */}
          <line
            x1={inspectedPoint.x}
            y1="2"
            x2={inspectedPoint.x}
            y2="58"
            stroke={hoveredIdx !== null ? '#A1A1AA' : 'transparent'}
            strokeWidth="1"
            strokeDasharray="2 2"
          />

          {/* Quarterly Data Nodes */}
          {current.points.map((pt, idx) => {
            const isHot = (hoveredIdx ?? 3) === idx;
            return (
              <g key={pt.label}>
                {isHot && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="7"
                    fill={current.accentColor}
                    fillOpacity="0.16"
                  />
                )}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHot ? 3.8 : 2}
                  fill={isHot ? current.accentColor : '#FFFFFF'}
                  stroke={current.accentColor}
                  strokeWidth="1.5"
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Interactive Diligence Ledger Rows */}
      <div className="divide-y divide-zinc-100">
        {DILIGENCE_PILLARS.map((item) => {
          const isSelected = current.id === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setActiveId(item.id);
                setHoveredIdx(null);
              }}
              aria-pressed={isSelected}
              className={`relative w-full px-4 py-2.5 flex items-center justify-between gap-3 text-left transition-colors duration-150 cursor-pointer ${
                isSelected ? 'bg-zinc-50' : 'bg-white hover:bg-zinc-50/70'
              }`}
            >
              {isSelected && (
                <motion.span
                  layoutId="why-vault-row-indicator"
                  className="absolute inset-y-1.5 left-1.5 w-0.5 rounded-full bg-zinc-900"
                  transition={{ type: 'spring', stiffness: 460, damping: 34 }}
                />
              )}
              <div className="min-w-0 pl-2">
                <div className="text-xs font-medium text-zinc-900 truncate">{item.title}</div>
                <div className="text-[11px] text-zinc-500 truncate">
                  {item.source} · <span className="tabular-nums">{item.metric}</span>
                </div>
              </div>
              <span
                className={`text-[11px] font-semibold whitespace-nowrap shrink-0 ${
                  isSelected ? 'text-zinc-950' : 'text-zinc-500'
                }`}
              >
                {item.status}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
