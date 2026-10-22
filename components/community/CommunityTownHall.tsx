import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, Clock, Users, ArrowRight, ThumbsUp, MessageSquare, 
  Check, Mic, Plus, Radio, Play, ChevronRight, Share2, Shield,
  ExternalLink, Sparkles, AlertCircle
} from 'lucide-react';
import { TownHallBoard } from '../../types';
import summitImg from '../../src/assets/images/community_summit_stage_1791197947528.jpg';
import { getStoredCommunityTheme, CommunityThemeConfig } from './communityTheme';

interface TownHallQuestion {
  id: string;
  author: string;
  authorTitle: string;
  question: string;
  votes: number;
  hasVoted: boolean;
}

interface CommunityTownHallProps {
  userProfile?: any;
  theme?: CommunityThemeConfig;
}

export const CommunityTownHall: React.FC<CommunityTownHallProps> = ({ userProfile, theme: propTheme }) => {
  const theme = propTheme || getStoredCommunityTheme();
  // Town Hall Boards (Created solely by Admin through Admin Dashboard)
  const [boards, setBoards] = useState<TownHallBoard[]>(() => {
    try {
      const saved = localStorage.getItem('connectup_townhall_boards');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

  // Questions state
  const [questions, setQuestions] = useState<TownHallQuestion[]>(() => {
    try {
      const saved = localStorage.getItem('connectup_townhall_questions');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((q: any) => 
            !q.id?.startsWith('q-1') && 
            !q.id?.startsWith('q-2') && 
            !q.id?.startsWith('q-3') &&
            q.author !== 'Samir Patel' &&
            q.author !== 'Hannah Meier' &&
            q.author !== 'Daniel Vance'
          );
        }
      }
    } catch {}
    return [];
  });

  const [newQuestionText, setNewQuestionText] = useState('');
  const [showQuestionInput, setShowQuestionInput] = useState(false);
  
  // Active board selection
  const activeBoard = boards.find(b => b.isActiveStage && b.status !== 'completed') || 
                      boards.find(b => b.status === 'live') || 
                      boards.find(b => b.status === 'upcoming') || 
                      boards[0] || null;

  // Track RSVPs per board
  const [rsvpdBoards, setRsvpdBoards] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('connectup_townhall_user_rsvps');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('connectup_townhall_questions', JSON.stringify(questions));
    } catch {}
  }, [questions]);

  useEffect(() => {
    try {
      localStorage.setItem('connectup_townhall_user_rsvps', JSON.stringify(rsvpdBoards));
    } catch {}
  }, [rsvpdBoards]);

  // Sync boards if updated in another tab/admin action
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'connectup_townhall_boards' && e.newValue) {
        try {
          setBoards(JSON.parse(e.newValue));
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleRsvp = (boardId: string) => {
    const isCurrentlyRsvpd = !!rsvpdBoards[boardId];
    const newRsvpState = !isCurrentlyRsvpd;

    setRsvpdBoards(prev => ({
      ...prev,
      [boardId]: newRsvpState,
    }));

    // Update board RSVP tally
    setBoards(prev => {
      const updated = prev.map(b => {
        if (b.id === boardId) {
          return {
            ...b,
            rsvpCount: Math.max(0, (b.rsvpCount || 0) + (newRsvpState ? 1 : -1))
          };
        }
        return b;
      });
      try {
        localStorage.setItem('connectup_townhall_boards', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleVote = (id: string) => {
    setQuestions(prev =>
      prev.map(q => {
        if (q.id === id) {
          return {
            ...q,
            votes: q.hasVoted ? q.votes - 1 : q.votes + 1,
            hasVoted: !q.hasVoted,
          };
        }
        return q;
      })
    );
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    const newQ: TownHallQuestion = {
      id: `q-${Date.now()}`,
      author: userProfile?.name || 'Fellow Founder',
      authorTitle: userProfile?.title || 'Ecosystem Operator',
      question: newQuestionText.trim(),
      votes: 1,
      hasVoted: true,
    };

    setQuestions([newQ, ...questions]);
    setNewQuestionText('');
    setShowQuestionInput(false);
  };

  const isAdmin = userProfile?.role === 'ADMIN' || userProfile?.role === 'admin';

  return (
    <div className="space-y-6">
      
      {/* Admin Privilege Banner notice */}
      {isAdmin && (
        <div className={`p-3.5 rounded-2xl ${theme.badgeClass} flex items-center justify-between gap-3 text-xs`}>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 shrink-0" />
            <span>
              <strong>Admin Mode:</strong> Town Hall boards are managed exclusively via the <strong>Admin Dashboard &gt; Town Hall Boards</strong>.
            </span>
          </div>
          <span className="text-[11px] font-mono font-bold bg-zinc-950 text-white px-2 py-0.5 rounded">
            Admin Controlled
          </span>
        </div>
      )}

      {/* Featured Live Stage Hero or Inactive Stage state */}
      {activeBoard ? (
        <div className="relative rounded-3xl overflow-hidden bg-zinc-950 border border-zinc-800 text-white shadow-2xl">
          <div className="relative min-h-[260px] sm:min-h-[300px] w-full overflow-hidden flex flex-col justify-end p-6 sm:p-8">
            <img
              src={activeBoard.imageUrl || summitImg}
              alt={activeBoard.title}
              className="absolute inset-0 w-full h-full object-cover opacity-50 hover:scale-105 transition-transform duration-700 pointer-events-none"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent" />

            {/* Status & RSVP badges */}
            <div className="absolute top-5 left-5 right-5 flex items-center justify-between gap-2 z-10">
              <div className="flex items-center gap-2">
                {activeBoard.status === 'live' ? (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-600 text-white text-[11px] font-mono font-bold uppercase tracking-wider backdrop-blur-md shadow-lg">
                    <Radio className="w-3.5 h-3.5 animate-pulse" />
                    <span>Broadcasting Live</span>
                  </div>
                ) : activeBoard.status === 'completed' ? (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-800/90 text-zinc-300 text-[11px] font-mono font-bold uppercase tracking-wider backdrop-blur-md">
                    <span>Archived Salon</span>
                  </div>
                ) : (
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${theme.primaryBg} ${theme.primaryText} text-[11px] font-mono font-bold uppercase tracking-wider backdrop-blur-md`}>
                    <Radio className="w-3.5 h-3.5" />
                    <span>Upcoming Town Hall</span>
                  </div>
                )}
              </div>

              <div className="text-xs text-zinc-300 font-mono bg-zinc-950/60 backdrop-blur-md px-3 py-1 rounded-full border border-zinc-800">
                <span>{activeBoard.rsvpCount || 0} Registered</span>
              </div>
            </div>

            {/* Hero text */}
            <div className="relative z-10 space-y-2 max-w-3xl pt-12">
              <p className={`font-mono text-xs uppercase tracking-wider font-semibold ${theme.accentText}`}>
                {activeBoard.episodeTag || 'The Venture Commons Salon'}
              </p>
              <h2 className="text-xl sm:text-3xl font-serif font-bold text-white tracking-tight leading-tight">
                {activeBoard.title}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed line-clamp-3">
                {activeBoard.description}
              </p>
              {activeBoard.speakers && (
                <p className="text-xs text-zinc-400 font-mono pt-1">
                  <span className={theme.accentText}>Featuring:</span> {activeBoard.speakers}
                </p>
              )}
            </div>
          </div>

          {/* Schedule & RSVP Action Bar */}
          <div className="p-5 sm:p-6 bg-zinc-900/90 border-t border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-zinc-300 font-sans">
              {activeBoard.date && (
                <div className="flex items-center gap-2">
                  <Calendar className={`w-4 h-4 ${theme.accentText}`} />
                  <span>{activeBoard.date}</span>
                </div>
              )}
              {activeBoard.time && (
                <div className="flex items-center gap-2">
                  <Clock className={`w-4 h-4 ${theme.accentText}`} />
                  <span>{activeBoard.time}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              {activeBoard.meetingLink && activeBoard.status === 'live' && (
                <a
                  href={activeBoard.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Join Live Stream</span>
                </a>
              )}

              <button
                onClick={() => handleRsvp(activeBoard.id)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-md active:scale-95 ${
                  rsvpdBoards[activeBoard.id]
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : theme.buttonClass
                }`}
              >
                {rsvpdBoards[activeBoard.id] ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>RSVP Confirmed</span>
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4" />
                    <span>Reserve Seat (RSVP)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 sm:p-12 rounded-3xl bg-zinc-950 text-white border border-zinc-800 text-center space-y-4 shadow-xl relative overflow-hidden">
          <div className={`w-14 h-14 rounded-2xl ${theme.accentBgSubtle} ${theme.accentBorderSubtle} ${theme.accentText} border flex items-center justify-center mx-auto`}>
            <Radio className="w-7 h-7" />
          </div>
          <div className="space-y-1.5 max-w-lg mx-auto">
            <h3 className="font-serif font-bold text-xl text-white">
              Town Hall Stage Staging in Progress
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              No live town hall sessions are currently active. Scheduled broadcasts, keynote teardowns, and AMA salons are managed and published exclusively by administrators.
            </p>
          </div>
          <p className="text-[11px] font-mono text-zinc-500">
            Submit or upvote questions below for upcoming broadcast agendas.
          </p>
        </div>
      )}

      {/* Secondary list of other scheduled boards (if more than 1 board exists) */}
      {boards.length > 1 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 font-mono">
            Upcoming &amp; Past Salons ({boards.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {boards.filter(b => b.id !== activeBoard?.id).map(board => (
              <div
                key={board.id}
                className={`p-4 rounded-2xl ${theme.bgSurfaceClass} ${theme.bgSurfaceHoverClass} shadow-xs space-y-2 flex flex-col justify-between`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className={`font-mono font-semibold ${theme.accentText}`}>
                      {board.episodeTag}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                      board.status === 'live'
                        ? 'bg-red-500/10 text-red-500'
                        : board.status === 'completed'
                          ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
                          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    }`}>
                      {board.status}
                    </span>
                  </div>
                  <h5 className="font-display font-bold text-sm text-zinc-950 dark:text-white line-clamp-1">
                    {board.title}
                  </h5>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                    {board.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                  <span className="text-zinc-400 text-[11px] font-mono">{board.date} · {board.time}</span>
                  <button
                    onClick={() => handleRsvp(board.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                      rsvpdBoards[board.id]
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200'
                    }`}
                  >
                    {rsvpdBoards[board.id] ? 'RSVP’d' : 'RSVP'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Town Hall Submissions Section */}
      <div className={`p-6 rounded-3xl ${theme.bgSurfaceClass} shadow-xs space-y-5`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif font-bold text-lg text-zinc-950 dark:text-white">
              Town Hall Question Board
            </h3>
            <p className="text-xs text-zinc-400">
              Vote on pressing dilemmas or submit questions for guest speakers to dissect live on stage.
            </p>
          </div>

          <button
            onClick={() => setShowQuestionInput(!showQuestionInput)}
            className="px-3.5 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ask Question</span>
          </button>
        </div>

        {/* Submit Question Form */}
        <AnimatePresence>
          {showQuestionInput && (
            <motion.form
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              onSubmit={handleAddQuestion}
              className="space-y-3 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
            >
              <textarea
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                placeholder="What is your most pressing operational, cap table, or fundraising challenge?"
                rows={2}
                className={`w-full p-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none ${theme.ringFocus} text-zinc-950 dark:text-white`}
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowQuestionInput(false)}
                  className="px-3 py-1.5 text-xs text-zinc-500 hover:text-zinc-900 cursor-pointer font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newQuestionText.trim()}
                  className={`px-4 py-1.5 font-bold text-xs rounded-xl shadow-xs disabled:opacity-50 cursor-pointer ${theme.buttonClass}`}
                >
                  Submit for Review
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Questions list */}
        {questions.length > 0 ? (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
            {questions.map((q) => (
              <div key={q.id} className="py-4 first:pt-0 last:pb-0 flex items-start gap-4">
                <button
                  onClick={() => handleVote(q.id)}
                  className={`flex flex-col items-center justify-center w-12 h-14 rounded-2xl border transition-all cursor-pointer shrink-0 ${
                    q.hasVoted
                      ? `${theme.accentBgSubtle} ${theme.accentBorder} ${theme.accentText}`
                      : 'bg-zinc-50 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-300'
                  }`}
                >
                  <ThumbsUp className={`w-4 h-4 ${q.hasVoted ? 'fill-current' : ''}`} />
                  <span className="text-xs font-mono font-bold tabular-nums mt-0.5">{q.votes}</span>
                </button>

                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-zinc-900 dark:text-zinc-100 leading-snug">
                    {q.question}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5 text-[11px] text-zinc-400">
                    <span className="font-bold text-zinc-700 dark:text-zinc-300">{q.author}</span>
                    <span aria-hidden="true">·</span>
                    <span>{q.authorTitle}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center space-y-2 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl p-4">
            <MessageSquare className="w-7 h-7 text-zinc-400 mx-auto" />
            <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">No questions queued yet</p>
            <p className="text-[11px] text-zinc-400 max-w-sm mx-auto">
              Be the first to submit a strategic dilemma or provocation for the upcoming Town Hall discussion.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
