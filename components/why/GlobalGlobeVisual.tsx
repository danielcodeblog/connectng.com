import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import NumberFlow from '@number-flow/react';

interface HubNode {
  code: string;
  city: string;
  funds: string;
  volumeValue: number;
  lat: number;
  lon: number;
}

const GLOBAL_HUBS: HubNode[] = [
  { code: 'SF', city: 'San Francisco', funds: '4 Lead Funds', volumeValue: 1.8, lat: 37.77, lon: -122.42 },
  { code: 'NYC', city: 'New York', funds: '3 Syndicate Partners', volumeValue: 1.1, lat: 40.71, lon: -74.01 },
  { code: 'LDN', city: 'London', funds: '3 Cross-Border VCs', volumeValue: 0.8, lat: 51.51, lon: -0.13 },
  { code: 'SGP', city: 'Singapore', funds: '2 APAC Funds', volumeValue: 0.5, lat: 1.35, lon: 103.82 },
];

const AMBIENT_CITIES = [
  { lat: 52.52, lon: 13.4 }, // Berlin
  { lat: 35.68, lon: 139.69 }, // Tokyo
  { lat: 6.52, lon: 3.38 }, // Lagos
  { lat: 32.08, lon: 34.78 }, // Tel Aviv
  { lat: 43.65, lon: -79.38 }, // Toronto
  { lat: -23.55, lon: -46.63 }, // Sao Paulo
  { lat: 25.2, lon: 55.27 }, // Dubai
  { lat: 48.85, lon: 2.35 }, // Paris
];

const DEG2RAD = Math.PI / 180;
const GLOBE_CX = 170;
const GLOBE_CY = 72;
const GLOBE_R = 58;

interface ProjectedPoint {
  x: number;
  y: number;
  z: number;
}

function projectPoint(latDeg: number, lonDeg: number, rotLonDeg: number, tiltLatDeg: number): ProjectedPoint {
  const lat = latDeg * DEG2RAD;
  const lon = (lonDeg - rotLonDeg) * DEG2RAD;
  const tilt = tiltLatDeg * DEG2RAD;

  const cosLat = Math.cos(lat);
  const x0 = cosLat * Math.sin(lon);
  const y0 = Math.sin(lat);
  const z0 = cosLat * Math.cos(lon);

  const y1 = y0 * Math.cos(tilt) - z0 * Math.sin(tilt);
  const z1 = y0 * Math.sin(tilt) + z0 * Math.cos(tilt);

  return {
    x: GLOBE_CX + x0 * GLOBE_R,
    y: GLOBE_CY - y1 * GLOBE_R,
    z: z1,
  };
}

function buildArcPath(p1: ProjectedPoint, p2: ProjectedPoint): string {
  const mx = (p1.x + p2.x) / 2;
  const my = (p1.y + p2.y) / 2;
  const dx = mx - GLOBE_CX;
  const dy = my - GLOBE_CY;
  const dist = Math.hypot(dx, dy) || 1;
  const span = Math.hypot(p2.x - p1.x, p2.y - p1.y);
  const lift = Math.min(26, 8 + span * 0.24);
  const cx = mx + (dx / dist) * lift;
  const cy = my + (dy / dist) * lift - 6;
  return `M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
}

export const GlobalGlobeVisual: React.FC = () => {
  const [activeHub, setActiveHub] = useState<string>('SF');
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [rotation, setRotation] = useState<{ lon: number; lat: number }>({ lon: -95, lat: 24 });
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisibleRef = useRef<boolean>(true);
  const rotRef = useRef<{ lon: number; lat: number }>({ lon: -95, lat: 24 });
  const targetRef = useRef<{ lon: number; lat: number }>({ lon: -95, lat: 24 });
  const autoRotateRef = useRef<boolean>(true);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;
    let rafId = 0;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      if (isVisibleRef.current) {
        if (autoRotateRef.current) {
          targetRef.current.lon += dt * 11;
        }
        const lerp = 1 - Math.exp(-dt * 5.5);
        const nextLon = rotRef.current.lon + (targetRef.current.lon - rotRef.current.lon) * lerp;
        const nextLat = rotRef.current.lat + (targetRef.current.lat - rotRef.current.lat) * lerp;
        rotRef.current = { lon: nextLon, lat: nextLat };
        setRotation({ lon: nextLon, lat: nextLat });
      }
      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [prefersReducedMotion]);

  const handleSelectHub = (hub: HubNode) => {
    setActiveHub(hub.code);
    setAutoRotate(false);
    // Normalize longitude difference so globe takes shortest smooth rotation path
    const currentLon = rotRef.current.lon;
    const mod = ((hub.lon - currentLon + 540) % 360) - 180;
    targetRef.current = {
      lon: currentLon + mod,
      lat: Math.max(-18, Math.min(34, hub.lat * 0.55)),
    };
    if (prefersReducedMotion) {
      rotRef.current = { ...targetRef.current };
      setRotation({ ...targetRef.current });
    }
  };

  const selectedHub = GLOBAL_HUBS.find((h) => h.code === activeHub) || GLOBAL_HUBS[0];

  // Build wireframe latitude rings
  const latRings = [-45, -18, 12, 42].map((lat) => {
    const pts: string[] = [];
    for (let lon = -180; lon <= 180; lon += 15) {
      const p = projectPoint(lat, lon, rotation.lon, rotation.lat);
      if (p.z >= -0.05) {
        pts.push(`${pts.length === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`);
      } else if (pts.length > 0 && !pts[pts.length - 1].startsWith('M')) {
        // break path at horizon
        pts.push('');
      }
    }
    return pts.filter(Boolean).join(' ');
  });

  // Build wireframe longitude meridians
  const lonMeridians = [0, 45, 90, 135, 180, -45, -90, -135].map((lon) => {
    const segments: string[] = [];
    let drawing = false;
    for (let lat = -80; lat <= 80; lat += 10) {
      const p = projectPoint(lat, lon, rotation.lon, rotation.lat);
      if (p.z >= -0.05) {
        segments.push(`${!drawing ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`);
        drawing = true;
      } else {
        drawing = false;
      }
    }
    return segments.join(' ');
  });

  const projectedHubs = GLOBAL_HUBS.map((hub) => ({
    ...hub,
    pos: projectPoint(hub.lat, hub.lon, rotation.lon, rotation.lat),
  }));

  const corridorPairs: [number, number][] = [
    [0, 1],
    [1, 2],
    [2, 3],
    [0, 3],
  ];

  return (
    <div
      ref={containerRef}
      className="w-full max-w-[356px] bg-zinc-950 text-white border border-zinc-800 rounded-xl shadow-[0_18px_40px_-14px_rgba(9,9,11,0.45)] overflow-hidden transition-transform duration-200 ease-out group-hover:-translate-y-0.5"
      onMouseEnter={() => setAutoRotate(false)}
      onMouseLeave={() => setAutoRotate(true)}
    >
      {/* Syndicate Corridor Header */}
      <div className="px-4 py-3.5 border-b border-zinc-800/90 flex items-baseline justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[11px] font-medium text-zinc-400">Syndicate Corridor</div>
          <div className="text-xs font-semibold text-white mt-0.5 truncate">
            12 Active Cross-Border Funds
          </div>
        </div>
        <div className="text-right shrink-0">
          <span className="text-lg font-bold tracking-tight text-[#FBBF24] tabular-nums">$4.2M</span>
          <span className="block text-[10px] text-zinc-400">Committed</span>
        </div>
      </div>

      {/* Real-Time 3D Orthographic Geodesic Globe */}
      <div className="px-3 pt-2 pb-1.5 border-b border-zinc-800/90 bg-zinc-900/35 relative">
        <svg
          viewBox="0 0 340 144"
          fill="none"
          className="w-full h-[136px] select-none"
          role="img"
          aria-label="Interactive 3D venture hub globe"
        >
          <defs>
            <radialGradient id="why-globe-sphere" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#27272A" stopOpacity="0.65" />
              <stop offset="70%" stopColor="#18181B" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#09090B" stopOpacity="1" />
            </radialGradient>
            <radialGradient id="why-globe-atmo" cx="50%" cy="50%" r="50%">
              <stop offset="75%" stopColor="#F59E0B" stopOpacity="0" />
              <stop offset="95%" stopColor="#F59E0B" stopOpacity="0.16" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="why-globe-arc-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="50%" stopColor="#FDE68A" />
              <stop offset="100%" stopColor="#34D399" />
            </linearGradient>
            <filter id="why-globe-glow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="2.2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Subtle Atmospheric Outer Halo */}
          <circle cx={GLOBE_CX} cy={GLOBE_CY} r={GLOBE_R + 12} fill="url(#why-globe-atmo)" />

          {/* Sphere Base */}
          <circle
            cx={GLOBE_CX}
            cy={GLOBE_CY}
            r={GLOBE_R}
            fill="url(#why-globe-sphere)"
            stroke="#27272A"
            strokeWidth="1.2"
          />

          {/* 3D Latitude & Meridian Wireframe */}
          {latRings.map((d, i) =>
            d ? <path key={`lat-${i}`} d={d} stroke="#27272A" strokeWidth="0.9" fill="none" /> : null
          )}
          {lonMeridians.map((d, i) =>
            d ? <path key={`lon-${i}`} d={d} stroke="#27272A" strokeWidth="0.9" fill="none" /> : null
          )}

          {/* Ambient Global Venture Hubs */}
          {AMBIENT_CITIES.map((city, i) => {
            const p = projectPoint(city.lat, city.lon, rotation.lon, rotation.lat);
            if (p.z < -0.1) return null;
            return (
              <circle
                key={`amb-${i}`}
                cx={p.x}
                cy={p.y}
                r="1.5"
                fill="#71717A"
                opacity={Math.max(0.15, p.z * 0.7)}
              />
            );
          })}

          {/* Great-Circle Syndicate Arcs */}
          {corridorPairs.map(([iA, iB], idx) => {
            const hubA = projectedHubs[iA];
            const hubB = projectedHubs[iB];
            const isHighlighted = hubA.code === activeHub || hubB.code === activeHub;
            const pathD = buildArcPath(hubA.pos, hubB.pos);
            const avgZ = (hubA.pos.z + hubB.pos.z) / 2;
            const arcOpacity = isHighlighted ? 0.92 : Math.max(0.22, (avgZ + 0.6) * 0.4);

            return (
              <g key={`arc-${idx}`} opacity={arcOpacity}>
                <path
                  d={pathD}
                  stroke={isHighlighted ? 'url(#why-globe-arc-grad)' : '#3F3F46'}
                  strokeWidth={isHighlighted ? 1.8 : 1}
                  strokeDasharray={isHighlighted ? undefined : '2.5 3'}
                  fill="none"
                />
                {isHighlighted && !prefersReducedMotion && (
                  <circle r="2.2" fill="#FDE68A" filter="url(#why-globe-glow)">
                    <animateMotion
                      dur={`${2.2 + idx * 0.35}s`}
                      repeatCount="indefinite"
                      path={pathD}
                    />
                  </circle>
                )}
              </g>
            );
          })}

          {/* Primary Interactive Syndicate Hubs */}
          {projectedHubs.map((hub) => {
            const isCurrent = hub.code === activeHub;
            const isFront = hub.pos.z >= -0.08;
            const nodeOpacity = isFront ? 1 : 0.25;
            return (
              <g
                key={hub.code}
                opacity={nodeOpacity}
                className="cursor-pointer"
                onClick={() => handleSelectHub(hub)}
              >
                {isCurrent && isFront && (
                  <circle
                    cx={hub.pos.x}
                    cy={hub.pos.y}
                    r="10"
                    stroke="#F59E0B"
                    strokeOpacity="0.45"
                    strokeWidth="1.25"
                  />
                )}
                <circle
                  cx={hub.pos.x}
                  cy={hub.pos.y}
                  r={isCurrent ? 4.5 : 3.2}
                  fill={isCurrent ? '#FBBF24' : '#FAFAFA'}
                  stroke="#09090B"
                  strokeWidth="1.4"
                />
                {isFront && (
                  <text
                    x={hub.pos.x}
                    y={hub.pos.y - 10}
                    textAnchor="middle"
                    fill={isCurrent ? '#FDE68A' : '#D4D4D8'}
                    fontSize="8.5"
                    fontWeight="700"
                    fontFamily="monospace"
                  >
                    {hub.code}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Interactive Hub Selector Strip */}
      <div className="grid grid-cols-4 divide-x divide-zinc-800 border-b border-zinc-800">
        {GLOBAL_HUBS.map((hub) => {
          const isCurrent = hub.code === activeHub;
          return (
            <button
              key={hub.code}
              type="button"
              onClick={() => handleSelectHub(hub)}
              aria-pressed={isCurrent}
              className={`relative py-2.5 text-center text-xs font-mono font-semibold transition-colors duration-150 cursor-pointer whitespace-nowrap ${
                isCurrent
                  ? 'bg-zinc-900 text-[#FBBF24]'
                  : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
              }`}
            >
              {isCurrent && (
                <motion.span
                  layoutId="why-globe-hub-tab"
                  className="absolute inset-x-2 bottom-0 h-0.5 bg-[#FBBF24]"
                  transition={{ type: 'spring', stiffness: 460, damping: 34 }}
                />
              )}
              {hub.code}
            </button>
          );
        })}
      </div>

      {/* Selected Hub Summary Footer with NumberFlow */}
      <div className="px-4 py-3 flex items-center justify-between gap-2 bg-zinc-950">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedHub.code}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.16 }}
            className="min-w-0"
          >
            <div className="text-xs font-semibold text-white truncate">{selectedHub.city}</div>
            <div className="text-[11px] text-zinc-400 truncate">{selectedHub.funds}</div>
          </motion.div>
        </AnimatePresence>

        <div className="text-right shrink-0">
          <span className="text-xs font-semibold text-white tabular-nums">
            <NumberFlow
              value={selectedHub.volumeValue}
              prefix="$"
              suffix="M"
              format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
            />
          </span>
          <span className="block text-[10px] text-zinc-400">Allocation</span>
        </div>
      </div>
    </div>
  );
};
