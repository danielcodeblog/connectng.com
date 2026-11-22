import React, { useState, useRef, useCallback, useLayoutEffect } from 'react';
import { Heart, ThumbsDown, Briefcase, TrendingUp, Users, RotateCcw } from 'lucide-react';
import { motion, useMotionValue, useTransform, animate, useReducedMotion, AnimatePresence } from 'motion/react';
import { FOUNDERS, FounderData } from '../src/constants';
import { getCompanyLogo } from './CompanyLogos';

export const LandingDiscover = () => {
  const prefersReducedMotion = useReducedMotion();
  const [founders] = useState<FounderData[]>(FOUNDERS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matches, setMatches] = useState(0);
  const [history, setHistory] = useState<Array<{ direction: 'left' | 'right' }>>([]);
  const [isDragging, setIsDragging] = useState(false);

  const x = useMotionValue(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const hasSwipedRef = useRef(false);
  const crossedThresholdRef = useRef(false);

  const rotate = useTransform(x, [-260, 0, 260], prefersReducedMotion ? [0, 0, 0] : [-15, 0, 15]);
  const cardOpacity = useTransform(x, [-460, -280, 0, 280, 460], [0.2, 1, 1, 1, 0.2]);

  const likeOpacity = useTransform(x, [18, 105], [0, 1]);
  const likeScale = useTransform(x, [18, 105], [0.78, 1.06]);
  const passOpacity = useTransform(x, [-105, -18], [1, 0]);
  const passScale = useTransform(x, [-105, -18], [1.06, 0.78]);

  const rightGlowOpacity = useTransform(x, [14, 130], [0, 1]);
  const leftGlowOpacity = useTransform(x, [-130, -14], [1, 0]);

  const nextScale = useTransform(x, [-240, 0, 240], prefersReducedMotion ? [1, 1, 1] : [1, 0.94, 1]);
  const nextY = useTransform(x, [-240, 0, 240], prefersReducedMotion ? [0, 0, 0] : [0, 14, 0]);
  const nextOpacity = useTransform(x, [-240, 0, 240], [1, 0.5, 1]);

  useLayoutEffect(() => {
    hasSwipedRef.current = false;
    crossedThresholdRef.current = false;
    x.jump(0);
  }, [currentIndex, x]);

  const getSwipeThreshold = () => {
    const width = cardRef.current?.offsetWidth || 380;
    return Math.min(Math.max(width * 0.18, 56), 105);
  };

  const commitSwipe = useCallback((direction: 'left' | 'right', velocityX = 0) => {
    if (hasSwipedRef.current || currentIndex >= founders.length) return;
    hasSwipedRef.current = true;
    setIsDragging(false);

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(direction === 'right' ? 16 : 8);
    }

    const width = cardRef.current?.offsetWidth || 420;
    const exitDistance = Math.max(width * 1.25, 480);
    const targetX = direction === 'right' ? exitDistance : -exitDistance;
    const launchVelocity = (direction === 'right' ? 1 : -1) * Math.max(Math.abs(velocityX), 1500);

    if (prefersReducedMotion) {
      x.jump(targetX);
      if (direction === 'right') {
        setMatches(m => m + 1);
      }
      setHistory(prev => [...prev, { direction }]);
      setCurrentIndex(prev => prev + 1);
      return;
    }

    animate(x, targetX, {
      type: 'spring',
      stiffness: 920,
      damping: 36,
      mass: 0.45,
      velocity: launchVelocity,
      restDelta: 28,
      restSpeed: 160,
      onComplete: () => {
        if (direction === 'right') {
          setMatches(m => m + 1);
        }
        setHistory(prev => [...prev, { direction }]);
        setCurrentIndex(prev => prev + 1);
      }
    });
  }, [currentIndex, founders.length, prefersReducedMotion, x]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: { offset: { x: number }; velocity: { x: number } }) => {
    if (hasSwipedRef.current) return;
    setIsDragging(false);

    const threshold = getSwipeThreshold();
    const offsetX = info.offset.x;
    const velocityX = info.velocity.x;

    const isRightFlick = velocityX > 260 && offsetX > 16;
    const isLeftFlick = velocityX < -260 && offsetX < -16;
    const isFastWhipRight = velocityX > 580 && offsetX > 8;
    const isFastWhipLeft = velocityX < -580 && offsetX < -8;

    if (offsetX > threshold || isRightFlick || isFastWhipRight) {
      commitSwipe('right', velocityX);
      return;
    }
    if (offsetX < -threshold || isLeftFlick || isFastWhipLeft) {
      commitSwipe('left', velocityX);
      return;
    }

    animate(x, 0, {
      type: 'spring',
      stiffness: 820,
      damping: 26,
      mass: 0.52,
      velocity: velocityX
    });
  };

  const rewind = () => {
    if (history.length === 0 || hasSwipedRef.current) return;
    const last = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    if (last.direction === 'right') {
      setMatches(m => Math.max(0, m - 1));
    }
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const restartCount = () => {
    setMatches(0);
    setHistory([]);
    setCurrentIndex(0);
  };

  if (currentIndex >= founders.length) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-white min-h-[600px]">
        <div className="w-24 h-24 bg-[#EAB308] rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,215,0,0.4)]">
          <Heart size={40} className="text-black fill-black" />
        </div>
        <h2 className="text-4xl font-[800] mb-4">You&apos;ve Swiped Them All!</h2>
        <p className="text-xl text-white/70 mb-8 font-light">You found {matches} amazing founders.</p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {history.length > 0 && (
            <button
              type="button"
              onClick={rewind}
              className="bg-white/10 border border-white/20 text-white px-6 py-4 rounded-full font-bold text-base hover:bg-white/20 transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw size={18} /> Rewind
            </button>
          )}
          <button
            type="button"
            onClick={restartCount}
            className="bg-white text-black px-8 py-4 rounded-full font-[800] text-lg hover:bg-white/90 shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            Discover More
          </button>
        </div>
      </div>
    );
  }

  const currentFounder = founders[currentIndex];
  const nextFounder = founders[currentIndex + 1];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden min-h-[600px]">
      <div className="w-full max-w-sm sm:max-w-md relative flex flex-col items-center">

        {/* Match Counter */}
        <div className="mb-5 bg-white/10 backdrop-blur-md px-5 sm:px-6 py-1.5 sm:py-2 rounded-full border border-white/20 font-bold text-base sm:text-lg shadow-lg text-white z-20">
          Matches: <span className="text-[#EAB308]">{matches}</span>
        </div>

        {/* Stacked Swipe Stage */}
        <div className="relative w-full h-[460px] sm:h-[490px]">
          {nextFounder && (
            <motion.div
              key={`next-${nextFounder.name}-${currentIndex + 1}`}
              style={{ scale: nextScale, y: nextY, opacity: nextOpacity, willChange: 'transform, opacity' }}
              className="absolute inset-0 w-full bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 overflow-hidden shadow-xl z-0 text-white pointer-events-none select-none"
            >
              <div
                className="h-40 sm:h-48 w-full flex items-center justify-center p-4 relative overflow-hidden"
                style={{ background: nextFounder.image }}
              >
                <div className="p-3 bg-black/25 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl flex items-center justify-center">
                  {getCompanyLogo(nextFounder.title, 'w-12 h-12 sm:w-14 sm:h-14')}
                </div>
              </div>
              <div className="p-6 sm:p-8">
                <h3 className="text-2xl sm:text-3xl font-black mb-1">{nextFounder.name}</h3>
                <div className="text-base sm:text-lg font-bold text-[#EAB308] mb-4 uppercase tracking-wider">{nextFounder.title}</div>
                <p className="text-white/70 font-light line-clamp-3 text-sm sm:text-base leading-relaxed">&quot;{nextFounder.tagline}&quot;</p>
              </div>
            </motion.div>
          )}

          <AnimatePresence initial={false}>
            <motion.div
              key={`active-${currentFounder.name}-${currentIndex}`}
              ref={cardRef}
              style={{
                x,
                rotate,
                opacity: cardOpacity,
                willChange: 'transform, opacity'
              }}
              animate={{
                scale: isDragging && !prefersReducedMotion ? 0.988 : 1,
              }}
              transition={{
                type: 'spring',
                stiffness: 520,
                damping: 34,
                mass: 0.7
              }}
              drag="x"
              dragMomentum={false}
              dragDirectionLock
              onDragStart={() => {
                crossedThresholdRef.current = false;
                setIsDragging(true);
              }}
              onDrag={(_, info) => {
                if (hasSwipedRef.current) return;
                const threshold = getSwipeThreshold();
                const isPastThreshold = Math.abs(info.offset.x) >= threshold;
                if (isPastThreshold && !crossedThresholdRef.current) {
                  crossedThresholdRef.current = true;
                  if (typeof navigator !== 'undefined' && navigator.vibrate) {
                    navigator.vibrate(6);
                  }
                } else if (!isPastThreshold && crossedThresholdRef.current) {
                  crossedThresholdRef.current = false;
                }
              }}
              onDragEnd={handleDragEnd}
              onPointerCancel={() => setIsDragging(false)}
              className="absolute inset-0 w-full bg-zinc-950/90 backdrop-blur-xl rounded-[2.5rem] border border-white/15 overflow-hidden shadow-2xl z-10 text-white cursor-grab active:cursor-grabbing select-none [&_img]:[-webkit-user-drag:none] [&_svg]:pointer-events-none touch-pan-y overscroll-x-contain"
            >
              {/* Live Directional Border Glows */}
              <motion.div
                style={{ opacity: rightGlowOpacity }}
                className="absolute inset-0 rounded-[2.5rem] border-2 border-[#EAB308]/80 bg-[#EAB308]/10 pointer-events-none z-20"
              />
              <motion.div
                style={{ opacity: leftGlowOpacity }}
                className="absolute inset-0 rounded-[2.5rem] border-2 border-red-400/80 bg-red-500/10 pointer-events-none z-20"
              />

              {/* Directional Stamps */}
              <motion.div
                style={{ opacity: likeOpacity, scale: likeScale }}
                className="absolute top-6 left-6 z-30 -rotate-12 pointer-events-none"
              >
                <span className="px-3.5 py-1.5 rounded-xl border-2 border-[#EAB308] bg-black/75 text-[#EAB308] font-black text-sm uppercase tracking-wider shadow-lg">
                  Connect
                </span>
              </motion.div>
              <motion.div
                style={{ opacity: passOpacity, scale: passScale }}
                className="absolute top-6 right-6 z-30 rotate-12 pointer-events-none"
              >
                <span className="px-3.5 py-1.5 rounded-xl border-2 border-red-400 bg-black/75 text-red-400 font-black text-sm uppercase tracking-wider shadow-lg">
                  Pass
                </span>
              </motion.div>

              <div
                className="h-40 sm:h-48 w-full flex items-center justify-center p-4 relative overflow-hidden"
                style={{ background: currentFounder.image }}
              >
                <div className="p-3 bg-black/25 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl flex items-center justify-center">
                  {getCompanyLogo(currentFounder.title, 'w-12 h-12 sm:w-14 sm:h-14')}
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <h3 className="text-2xl sm:text-3xl font-black mb-1">{currentFounder.name}</h3>
                <div className="text-base sm:text-lg font-bold text-[#EAB308] mb-4 uppercase tracking-wider">{currentFounder.title}</div>

                <p className="text-white/70 font-light mb-6 line-clamp-3 text-sm sm:text-base leading-relaxed">&quot;{currentFounder.tagline}&quot;</p>

                <div className="space-y-3 font-ibm-mono text-xs sm:text-sm text-white/50">
                  <div className="flex justify-between pb-2 border-b border-white/5">
                    <span className="flex items-center gap-2"><Briefcase size={14} /> Industry</span>
                    <span className="font-semibold text-white">{currentFounder.industry}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-white/5">
                    <span className="flex items-center gap-2"><TrendingUp size={14} /> Stage</span>
                    <span className="font-semibold text-white">{currentFounder.stage}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-white/5">
                    <span className="flex items-center gap-2"><Users size={14} /> Team</span>
                    <span className="font-semibold text-white">{currentFounder.members} members</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="flex items-center gap-2 font-black text-white/40 text-[10px] uppercase tracking-widest">Seeking</span>
                    <span className="font-black text-[#EAB308] text-base sm:text-lg">{currentFounder.seeking}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-5 sm:gap-7 mt-7 sm:mt-9 z-20">
          <button
            type="button"
            onClick={() => commitSwipe('left', -850)}
            aria-label="Pass on founder"
            className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white shadow-xl hover:bg-white/20 hover:scale-105 transition-all active:scale-95 cursor-pointer"
          >
            <ThumbsDown className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={rewind}
            disabled={history.length === 0}
            aria-label="Rewind previous founder"
            className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={() => commitSwipe('right', 850)}
            aria-label="Connect with founder"
            className="w-16 h-16 sm:w-20 sm:h-20 bg-[#EAB308] border border-[#EAB308] rounded-full flex items-center justify-center text-black shadow-[0_0_30px_rgba(184,134,11,0.4)] hover:bg-[#CA8A04] hover:scale-105 transition-all active:scale-95 cursor-pointer"
          >
            <Heart className="w-7 h-7 sm:w-8 sm:h-8 fill-black text-black" strokeWidth={2} />
          </button>
        </div>

      </div>
    </div>
  );
};
