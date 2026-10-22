import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, MessageCircle, Plus, Heart, Share2, Check, TrendingUp, X } from 'lucide-react';
import { getStoredCommunityTheme, CommunityThemeConfig } from './communityTheme';

export interface Milestone {
  id: string;
  author: string;
  authorTitle: string;
  authorAvatar: string;
  authorId: string;
  type: 'Funding' | 'Revenue' | 'Product' | 'Customer' | 'Team';
  title: string;
  story: string;
  metric: string;
  time: string;
  cheers: number;
  hasCheered: boolean;
}

interface CommunityMilestonesProps {
  userProfile: any;
  theme?: CommunityThemeConfig;
  onMessage?: (authorId: string) => void;
  onViewProfile?: (userId: string) => void;
  onModalStateChange?: (isOpen: boolean) => void;
}

export const CommunityMilestones: React.FC<CommunityMilestonesProps> = ({
  userProfile,
  theme: propTheme,
  onMessage,
  onViewProfile,
  onModalStateChange,
}) => {
  const theme = propTheme || getStoredCommunityTheme();
  const [milestones, setMilestones] = useState<Milestone[]>(() => {
    try {
      const saved = localStorage.getItem('connectup_milestones');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((m: any) => 
            !m.id?.startsWith('m-1') && 
            !m.id?.startsWith('m-2') && 
            !m.id?.startsWith('m-3') &&
            m.author !== 'Mateo Silva' &&
            m.author !== 'Nadia Rostam' &&
            m.author !== 'David Okonkwo'
          );
        }
      }
    } catch {}
    return [];
  });
  const [showShareModal, setShowShareModal] = useState(false);

  React.useEffect(() => {
    onModalStateChange?.(showShareModal);
  }, [showShareModal, onModalStateChange]);
  const [newTitle, setNewTitle] = useState('');
  const [newMetric, setNewMetric] = useState('');
  const [newStory, setNewStory] = useState('');
  const [newType, setNewType] = useState<Milestone['type']>('Revenue');

  React.useEffect(() => {
    try {
      localStorage.setItem('connectup_milestones', JSON.stringify(milestones));
    } catch {}
  }, [milestones]);

  const handleCheer = (id: string) => {
    setMilestones(prev =>
      prev.map(m => {
        if (m.id === id) {
          return {
            ...m,
            cheers: m.hasCheered ? m.cheers - 1 : m.cheers + 1,
            hasCheered: !m.hasCheered,
          };
        }
        return m;
      })
    );
  };

  const handleCreateMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newMetric.trim()) return;

    const newM: Milestone = {
      id: `m-${Date.now()}`,
      author: userProfile?.name || 'Fellow Founder',
      authorTitle: userProfile?.title || 'Ecosystem Builder',
      authorAvatar: userProfile?.avatarUrl || '',
      authorId: userProfile?.id || 'me',
      type: newType,
      title: newTitle.trim(),
      metric: newMetric.trim(),
      story: newStory.trim(),
      time: 'Just now',
      cheers: 1,
      hasCheered: true,
    };

    setMilestones([newM, ...milestones]);
    setShowShareModal(false);
    setNewTitle('');
    setNewMetric('');
    setNewStory('');
  };

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="p-6 rounded-3xl bg-zinc-950 text-white border border-zinc-800 shadow-xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative z-10 space-y-1.5 max-w-xl">
          <div className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-widest ${theme.accentText}`}>
            <Award className="w-4 h-4" />
            <span>Hall of Breakthroughs</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold tracking-tight">
            Wins &amp; Milestones
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
            Celebrating the grit and breakthroughs of fellow builders in the arena. Every round closed, contract landed, and milestone crossed lifts the entire community.
          </p>
        </div>

        <button
          onClick={() => setShowShareModal(true)}
          className={`relative z-10 px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 ${theme.buttonClass}`}
        >
          <TrendingUp className="w-4 h-4 stroke-[2.5]" />
          <span>Record Milestone</span>
        </button>
      </div>

      {/* List of Milestones */}
      {milestones.length > 0 ? (
        <div className="space-y-4">
          {milestones.map(m => (
            <div
              key={m.id}
              className={`p-6 rounded-3xl ${theme.bgSurfaceClass} ${theme.bgSurfaceHoverClass} transition-all shadow-xs space-y-4`}
            >
              {/* Header info */}
              <div className="flex items-start justify-between gap-3">
                <div 
                  className="flex items-center gap-3 cursor-pointer group"
                  onClick={() => onViewProfile && onViewProfile(m.authorId)}
                >
                  <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden shrink-0 border border-zinc-200 dark:border-zinc-700">
                    {m.authorAvatar ? (
                      <img src={m.authorAvatar} alt={m.author} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-sm text-zinc-500">
                        {m.author[0]}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold text-zinc-950 dark:text-white group-hover:${theme.accentText} transition-colors`}>
                        {m.author}
                      </span>
                      <span className="text-xs text-zinc-400">·</span>
                      <span className="text-xs text-zinc-400 font-mono tabular-nums">{m.time}</span>
                    </div>
                    <p className="text-xs text-zinc-400">{m.authorTitle}</p>
                  </div>
                </div>

                {/* Metric Callout */}
                <div className={`px-3.5 py-1.5 rounded-xl ${theme.badgeClass} text-xs font-mono font-bold shrink-0`}>
                  {m.metric}
                </div>
              </div>

              {/* Title & Story */}
              <div className="space-y-2">
                <h3 className="font-display font-bold text-base sm:text-lg text-zinc-950 dark:text-white leading-snug">
                  {m.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-sans">
                  {m.story}
                </p>
              </div>

              {/* Actions footer */}
              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
                <button
                  onClick={() => handleCheer(m.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    m.hasCheered
                      ? `${theme.primaryBg} ${theme.primaryText} shadow-xs font-bold`
                      : 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  <Award className={`w-3.5 h-3.5 ${m.hasCheered ? theme.primaryText : theme.accentText}`} />
                  <span>Applaud</span>
                  <span className="font-mono tabular-nums">({m.cheers})</span>
                </button>

                <button
                  onClick={() => onMessage && onMessage(m.authorId)}
                  className={`px-3.5 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:${theme.accentText} flex items-center gap-1.5 cursor-pointer transition-colors`}
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Send Congrats</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={`py-16 text-center space-y-3 ${theme.bgSurfaceClass} rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 p-6`}>
          <Award className="w-10 h-10 text-zinc-400 mx-auto" />
          <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">No milestones recorded yet</h4>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Celebrate raw traction, revenue milestones, funding closes, and customer launches with the ecosystem.
          </p>
          <button
            onClick={() => setShowShareModal(true)}
            className={`px-4 py-2 rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-all active:scale-95 ${theme.buttonClass}`}
          >
            Record First Milestone
          </button>
        </div>
      )}

      {/* Share Win Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-[120] bg-zinc-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="fixed inset-0" onClick={() => setShowShareModal(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`relative w-full max-w-lg ${theme.bgSurfaceClass} rounded-3xl p-6 shadow-2xl z-10 space-y-5`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-serif font-bold text-zinc-950 dark:text-white">
                  Share Your Milestone
                </h3>
                <p className="text-xs text-zinc-400">Celebrate raw traction and encourage fellow builders</p>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-1.5 text-zinc-400 hover:text-zinc-950 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMilestone} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                    Category
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-medium text-zinc-950 dark:text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    <option value="Funding">Funding Round</option>
                    <option value="Revenue">Revenue / Profit Milestone</option>
                    <option value="Customer">Enterprise Customer / Pilot</option>
                    <option value="Product">Product Launch / Open Source</option>
                    <option value="Team">Key Leadership Hire</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                    Metric Highlight
                  </label>
                  <input
                    type="text"
                    required
                    value={newMetric}
                    onChange={(e) => setNewMetric(e.target.value)}
                    placeholder="e.g. $1.5M Seed or $50K MRR"
                    className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-medium text-zinc-950 dark:text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Headline
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Closed our Seed Round led by..."
                  className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-medium text-zinc-950 dark:text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  The Journey & Community Shoutout
                </label>
                <textarea
                  rows={3}
                  value={newStory}
                  onChange={(e) => setNewStory(e.target.value)}
                  placeholder="What was the key inflection point? Any fellow builders you'd like to thank?"
                  className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-medium text-zinc-950 dark:text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowShareModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 font-bold text-xs uppercase tracking-wider text-zinc-700 dark:text-zinc-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 font-bold text-xs uppercase tracking-wider text-zinc-950 shadow-md cursor-pointer active:scale-95"
                >
                  Share With Community
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
