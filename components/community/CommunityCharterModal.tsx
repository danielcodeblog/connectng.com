import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, HeartHandshake, Check, ArrowRight, Award } from 'lucide-react';
import fellowshipImg from '../../src/assets/images/community_fellowship_circle_1791197936277.jpg';

interface CommunityCharterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPledgeSigned: () => void;
  isPledged: boolean;
}

export const CommunityCharterModal: React.FC<CommunityCharterModalProps> = ({
  isOpen,
  onClose,
  onPledgeSigned,
  isPledged,
}) => {
  const [pledging, setPledging] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleSign = () => {
    setPledging(true);
    setTimeout(() => {
      localStorage.setItem('connectup_community_pledge_signed', 'true');
      onPledgeSigned();
      setPledging(false);
      setShowSuccessToast(true);
      setTimeout(() => {
        setShowSuccessToast(false);
        onClose();
      }, 1400);
    }, 450);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] bg-zinc-950/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="fixed inset-0" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-xl bg-white dark:bg-[#111114] border border-zinc-200/90 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden z-10"
      >
        {/* Banner with generated high-fidelity asset */}
        <div className="relative h-44 w-full overflow-hidden bg-zinc-900">
          <img
            src={fellowshipImg}
            alt="The Founderhood Collective"
            className="w-full h-full object-cover opacity-75"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 text-white hover:bg-black/80 flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold tracking-wider uppercase mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>The Founder & Investor Covenant</span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-white tracking-tight">
              Class, Generosity & High Conviction
            </h2>
          </div>
        </div>

        {/* Content body */}
        <div className="p-6 sm:p-8 space-y-6">
          <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-sans">
            Genuine ecosystemhood is built when daring founders and strategic investors commit to elevate one another without
            keeping score, fostering trust and absolute transparency.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/80">
              <div className="w-8 h-8 rounded-xl bg-amber-400/15 text-amber-500 flex items-center justify-center shrink-0 mt-0.5 font-bold font-mono text-xs">
                01
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Give First & Open Doors</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
                  Founders and investors alike provide thoughtful customer intros, unvarnished feedback, and advice without extracting immediate toll.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/80">
              <div className="w-8 h-8 rounded-xl bg-amber-400/15 text-amber-500 flex items-center justify-center shrink-0 mt-0.5 font-bold font-mono text-xs">
                02
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Radical Candor, Deep Dignity</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
                  Critique ideas with razor precision while fiercely defending the human dignity of every builder and capital partner in the arena.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/80">
              <div className="w-8 h-8 rounded-xl bg-amber-400/15 text-amber-500 flex items-center justify-center shrink-0 mt-0.5 font-bold font-mono text-xs">
                03
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Celebrate Breakthroughs Openly</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
                  A portfolio milestone, funding round, or first enterprise contract is a win for the entire collective ecosystem of founders and investors.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/80">
              <div className="w-8 h-8 rounded-xl bg-amber-400/15 text-amber-500 flex items-center justify-center shrink-0 mt-0.5 font-bold font-mono text-xs">
                04
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Zero Gatekeeping, High Signal</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
                  No empty spam, algorithmic clickbait, or deceptive pitch bait. True craft and honest collaboration between founders and investors only.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between gap-4 border-t border-zinc-100 dark:border-zinc-800/80">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Confers Verified Fellow Insignia</span>
            </div>

            {isPledged ? (
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Pledge Signed & Sealed</span>
              </div>
            ) : (
              <button
                onClick={handleSign}
                disabled={pledging}
                className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {pledging ? (
                  <span>Sealing Pledge...</span>
                ) : (
                  <>
                    <span>Sign the Pledge</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Success confirmation toast */}
        <AnimatePresence>
          {showSuccessToast && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-zinc-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white"
            >
              <div className="w-14 h-14 rounded-full bg-amber-400 text-zinc-950 flex items-center justify-center mb-3 shadow-lg">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold font-serif mb-1">Welcome to the Fellowship</h3>
              <p className="text-xs text-zinc-300 max-w-xs">
                Your pledge is recorded. The Verified Fellow seal is now active on your dispatches.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
