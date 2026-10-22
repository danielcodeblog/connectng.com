import React, { useState } from 'react';
import { Send, MessageSquare } from 'lucide-react';

interface CommunitySpotlightProps {
  onOpenCharter?: () => void;
  onAnswerDailyPrompt: (promptText: string) => void;
  onMessageFellow?: (authorId: string) => void;
  isPledged?: boolean;
}

export const CommunitySpotlight: React.FC<CommunitySpotlightProps> = ({
  onOpenCharter,
  onAnswerDailyPrompt,
  isPledged,
}) => {
  const [dailyResponse, setDailyResponse] = useState('');
  const [hasAnswered, setHasAnswered] = useState(false);

  const DAILY_PROMPT = "What was an operational belief or pricing assumption you held 6 months ago that you completely reversed after talking to customers?";

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dailyResponse.trim()) return;
    onAnswerDailyPrompt(dailyResponse.trim());
    setDailyResponse('');
    setHasAnswered(true);
    setTimeout(() => setHasAnswered(false), 3000);
  };

  return (
    <div className="space-y-4">
      {/* The Daily Provocation (Prompt) */}
      <div className="p-5 rounded-2xl bg-zinc-900 text-white border border-zinc-800 shadow-xs space-y-3 relative overflow-hidden">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-amber-400 font-mono text-[11px] font-bold uppercase tracking-wider">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>The Daily Provocation</span>
          </div>
          <span className="text-[10px] text-zinc-400 font-mono">Today's Topic</span>
        </div>

        <p className="text-xs sm:text-sm font-serif italic text-zinc-200 leading-relaxed">
          "{DAILY_PROMPT}"
        </p>

        <form onSubmit={handlePromptSubmit} className="space-y-2 pt-1">
          <div className="relative">
            <input
              type="text"
              value={dailyResponse}
              onChange={(e) => setDailyResponse(e.target.value)}
              placeholder="Share your raw lesson..."
              className="w-full pl-3 pr-8 py-2 bg-zinc-800/90 border border-zinc-700 rounded-xl text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              disabled={!dailyResponse.trim()}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 text-amber-400 hover:text-amber-300 disabled:opacity-30 cursor-pointer"
              title="Post your response"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
          {hasAnswered && (
            <p className="text-[11px] text-amber-400 font-medium">Opening composer with your answer...</p>
          )}
        </form>
      </div>
    </div>
  );
};
