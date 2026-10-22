import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  HeartHandshake, Plus, ArrowUpRight, Search, Check, 
  MessageCircle, Filter, Briefcase, Zap, Shield, X, Send, Layers, TrendingUp
} from 'lucide-react';
import { getStoredCommunityTheme, CommunityThemeConfig } from './communityTheme';

export interface ExchangeItem {
  id: string;
  type: 'need' | 'give';
  category: 'Warm Intro' | 'Deck Audit' | 'Enterprise Lead' | 'Technical Advisory' | 'Beta Testers' | 'Talent';
  title: string;
  description: string;
  author: string;
  authorTitle: string;
  authorAvatar?: string;
  authorId: string;
  timestamp: string;
  responsesCount: number;
  tags: string[];
  status: 'active' | 'fulfilled';
}

interface CommunityExchangeProps {
  userProfile: any;
  theme?: CommunityThemeConfig;
  onMessage?: (authorId: string) => void;
  onViewProfile?: (userId: string) => void;
  onModalStateChange?: (isOpen: boolean) => void;
}

export const CommunityExchange: React.FC<CommunityExchangeProps> = ({
  userProfile,
  theme: propTheme,
  onMessage,
  onViewProfile,
  onModalStateChange,
}) => {
  const theme = propTheme || getStoredCommunityTheme();
  const [items, setItems] = useState<ExchangeItem[]>(() => {
    try {
      const saved = localStorage.getItem('connectup_community_exchange_items');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Explicitly strip any legacy mock records that may be cached from older versions
          const cleanItems = parsed.filter((item: any) => 
            !item.id?.startsWith('ex-1') && 
            !item.id?.startsWith('ex-2') && 
            !item.id?.startsWith('ex-3') && 
            !item.id?.startsWith('ex-4') && 
            !item.id?.startsWith('ex-5') && 
            !item.id?.startsWith('ex-6') &&
            item.author !== 'Elena Rostova' &&
            item.author !== 'Marcus Vance' &&
            item.author !== 'Kofi Mensah' &&
            item.author !== 'Devon Hayes' &&
            item.author !== 'Sarah Lin' &&
            item.author !== 'Alistair Sterling'
          );
          return cleanItems;
        }
      }
    } catch {}
    return [];
  });

  const [filterType, setFilterType] = useState<'all' | 'need' | 'give'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    onModalStateChange?.(showCreateModal);
  }, [showCreateModal, onModalStateChange]);

  // New item modal form state
  const [newType, setNewType] = useState<'need' | 'give'>('need');
  const [newCategory, setNewCategory] = useState<ExchangeItem['category']>('Warm Intro');
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newTags, setNewTags] = useState('');
  const [helpedItems, setHelpedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      localStorage.setItem('connectup_community_exchange_items', JSON.stringify(items));
    } catch {}
  }, [items]);

  const categories = ['All', 'Warm Intro', 'Deck Audit', 'Enterprise Lead', 'Technical Advisory', 'Beta Testers', 'Talent'];

  const filteredItems = items.filter(item => {
    if (filterType !== 'all' && item.type !== filterType) return false;
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchAuthor = item.author.toLowerCase().includes(q);
      const matchTags = item.tags.some(t => t.toLowerCase().includes(q));
      return matchTitle || matchDesc || matchAuthor || matchTags;
    }
    return true;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) return;

    const parsedTags = newTags
      .split(',')
      .map(t => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const newItem: ExchangeItem = {
      id: `ex-${Date.now()}`,
      type: newType,
      category: newCategory,
      title: newTitle.trim(),
      description: newDescription.trim(),
      author: userProfile?.name || 'Fellow Founder',
      authorTitle: userProfile?.title || 'Ecosystem Builder',
      authorAvatar: userProfile?.avatarUrl,
      authorId: userProfile?.id || 'me',
      timestamp: 'Just now',
      responsesCount: 0,
      tags: parsedTags.length > 0 ? parsedTags : ['Fellowship'],
      status: 'active',
    };

    setItems([newItem, ...items]);
    setShowCreateModal(false);
    setNewTitle('');
    setNewDescription('');
    setNewTags('');
  };

  const handleConnectClick = (item: ExchangeItem) => {
    setHelpedItems(prev => ({ ...prev, [item.id]: true }));
    if (onMessage) {
      onMessage(item.authorId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Editorial Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-zinc-950 text-white border border-zinc-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-1.5 max-w-xl">
          <div className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-widest ${theme.accentText}`}>
            <HeartHandshake className="w-4 h-4" />
            <span>Community Reciprocity Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold tracking-tight">
            The Founder Exchange
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
            Ask for what your venture needs. Offer what your journey has taught you. No cold pitches—only high-conviction mutual aid.
          </p>
        </div>

        <div className="relative z-10 shrink-0">
          <button
            onClick={() => setShowCreateModal(true)}
            className={`w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${theme.buttonClass}`}
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Post Request / Offer</span>
          </button>
        </div>

        {/* Ambient background glow */}
        <div className={`absolute -top-12 -right-12 w-64 h-64 rounded-full blur-3xl pointer-events-none ${theme.glowClass}`} />
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Segmented Controls for Need / Give */}
          <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-800/80 rounded-xl border border-zinc-200/60 dark:border-zinc-700/60 shrink-0">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                filterType === 'all'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white shadow-xs font-bold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
              }`}
            >
              All Signals ({items.length})
            </button>
            <button
              onClick={() => setFilterType('need')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                filterType === 'need'
                  ? `bg-white dark:bg-zinc-900 ${theme.accentText} shadow-xs font-bold`
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
              }`}
            >
              <span>Seeking Intros &amp; Needs</span>
              <span className="text-[10px] opacity-75 font-mono">
                {items.filter(i => i.type === 'need').length}
              </span>
            </button>
            <button
              onClick={() => setFilterType('give')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                filterType === 'give'
                  ? 'bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-xs font-bold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
              }`}
            >
              <span>Offering Help &amp; Gives</span>
              <span className="text-[10px] opacity-75 font-mono">
                {items.filter(i => i.type === 'give').length}
              </span>
            </button>
          </div>

          {/* Search box */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search asks, sectors, leads..."
              className={`w-full pl-9 pr-3.5 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-950 dark:text-white placeholder-zinc-400 focus:outline-none ${theme.ringFocus} font-sans`}
            />
          </div>
        </div>

        {/* Categories horizontal strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium shrink-0 cursor-pointer transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-bold'
                  : 'bg-zinc-100 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Mutual Aid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map(item => {
          const isNeed = item.type === 'need';
          const hasHelped = helpedItems[item.id];

          return (
            <div
              key={item.id}
              className={`flex flex-col justify-between p-5 rounded-2xl ${theme.bgSurfaceClass} ${theme.bgSurfaceHoverClass} transition-all shadow-xs hover:shadow-md`}
            >
              <div className="space-y-3">
                {/* Clean unboxed metadata header */}
                <div className="flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`font-mono text-[11px] font-bold uppercase tracking-wider ${
                      isNeed ? theme.accentText : 'text-emerald-600 dark:text-emerald-400'
                    }`}>
                      {isNeed ? 'Seeking' : 'Offering'}
                    </span>
                    <span className="text-zinc-300 dark:text-zinc-600" aria-hidden="true">·</span>
                    <span className="text-zinc-500 font-medium">{item.category}</span>
                  </div>
                  <span className="text-zinc-400 text-[11px] font-mono tabular-nums">{item.timestamp}</span>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="font-display font-bold text-sm sm:text-base text-zinc-950 dark:text-white leading-snug line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-1.5 leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>

                {/* Clean inline tags */}
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400 font-medium pt-1">
                  {item.tags.map(tag => (
                    <span key={tag} className="text-zinc-500 dark:text-zinc-400 hover:opacity-80 cursor-pointer">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Author & Action footer */}
              <div className="pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800/70 flex items-center justify-between gap-3">
                <div 
                  className="flex items-center gap-2.5 min-w-0 cursor-pointer group"
                  onClick={() => onViewProfile && onViewProfile(item.authorId)}
                >
                  <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden shrink-0 border border-zinc-200 dark:border-zinc-700">
                    {item.authorAvatar ? (
                      <img src={item.authorAvatar} alt={item.author} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-xs text-zinc-500">
                        {item.author[0]}
                      </div>
                    )}
                  </div>
                  <div className="truncate">
                    <p className={`text-xs font-bold text-zinc-950 dark:text-white group-hover:${theme.accentText} transition-colors truncate`}>
                      {item.author}
                    </p>
                    <p className="text-[10px] text-zinc-400 truncate">{item.authorTitle}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleConnectClick(item)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                    hasHelped
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      : isNeed
                        ? theme.buttonClass
                        : 'bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 shadow-xs active:scale-95'
                  }`}
                >
                  {hasHelped ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Connected</span>
                    </>
                  ) : isNeed ? (
                    <>
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      <span>I Can Help</span>
                    </>
                  ) : (
                    <>
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Connect</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {items.length === 0 ? (
        <div className={`py-20 text-center space-y-4 ${theme.bgSurfaceClass} rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 p-8 shadow-xs`}>
          <HeartHandshake className="w-12 h-12 text-zinc-400 mx-auto" />
          <div className="space-y-1">
            <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">The Founder Exchange is Ready</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
              No asks or gives have been posted yet. Kickstart mutual aid across the venture commons by requesting an enterprise intro or offering advisory teardowns.
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className={`px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold transition-all inline-flex items-center gap-2 cursor-pointer ${theme.buttonClass}`}
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Post First Request / Offer</span>
          </button>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className={`py-16 text-center space-y-2 ${theme.bgSurfaceClass} rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 p-6`}>
          <HeartHandshake className="w-10 h-10 text-zinc-400 mx-auto" />
          <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">No signals match your filter</h4>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Try selecting another category or clear your search term.
          </p>
          <button
            onClick={() => {
              setFilterType('all');
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className={`text-xs font-bold ${theme.accentText} hover:underline pt-2 cursor-pointer`}
          >
            Reset Filters
          </button>
        </div>
      ) : null}

      {/* Create Mutual Aid Request Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[120] bg-zinc-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="fixed inset-0" onClick={() => setShowCreateModal(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-lg bg-white dark:bg-[#111114] border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl z-10 space-y-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-serif font-bold text-zinc-950 dark:text-white">
                  Post to The Founder Exchange
                </h3>
                <p className="text-xs text-zinc-400">Signal an ask or offer assistance to fellow operators</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-950 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              {/* Type Switch */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-100 dark:bg-zinc-800/80 rounded-xl">
                <button
                  type="button"
                  onClick={() => setNewType('need')}
                  className={`py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    newType === 'need'
                      ? 'bg-white dark:bg-zinc-900 text-amber-600 dark:text-amber-400 shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  I Need Something (Ask)
                </button>
                <button
                  type="button"
                  onClick={() => setNewType('give')}
                  className={`py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    newType === 'give'
                      ? 'bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  I'm Offering (Give)
                </button>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-medium text-zinc-950 dark:text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option value="Warm Intro">Warm Intro (Customer or Investor)</option>
                  <option value="Deck Audit">Deck Audit & Pitch Review</option>
                  <option value="Enterprise Lead">Enterprise Pilot / Referral</option>
                  <option value="Technical Advisory">Technical Architecture Advisory</option>
                  <option value="Beta Testers">Beta Testers & Feedback</option>
                  <option value="Talent">Founding Team / Talent Referral</option>
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Headline (What exactly is the request/offer?)
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Intro to VP of Infrastructure at Fintechs with >$10M volume"
                  className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-medium text-zinc-950 dark:text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Context & Details
                </label>
                <textarea
                  rows={3}
                  required
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Provide background, traction, and what kind of partner would be ideal..."
                  className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-medium text-zinc-950 dark:text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="e.g. AI, SeriesA, FinTech"
                  className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-medium text-zinc-950 dark:text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 font-bold text-xs uppercase tracking-wider text-zinc-700 dark:text-zinc-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 font-bold text-xs uppercase tracking-wider text-zinc-950 shadow-md cursor-pointer active:scale-95"
                >
                  Publish Signal
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
