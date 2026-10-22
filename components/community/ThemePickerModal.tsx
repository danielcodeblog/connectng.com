import React from 'react';
import { X, Check, Palette } from 'lucide-react';
import { COMMUNITY_THEMES, CommunityThemeId, CommunityThemeConfig } from './communityTheme';

interface ThemePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentThemeId: CommunityThemeId;
  onSelectTheme: (themeId: CommunityThemeId) => void;
}

export const ThemePickerModal: React.FC<ThemePickerModalProps> = ({
  isOpen,
  onClose,
  currentThemeId,
  onSelectTheme,
}) => {
  if (!isOpen) return null;
  const activeTheme = COMMUNITY_THEMES[currentThemeId] || COMMUNITY_THEMES.slate;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl bg-white dark:bg-[#0D0E14] border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div 
              className="w-7 h-7 rounded-xl flex items-center justify-center text-white shadow-xs"
              style={{ background: `linear-gradient(135deg, ${activeTheme.primaryHex}, ${activeTheme.secondaryHex})` }}
            >
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-950 dark:text-white leading-none">
                Community Color Theme & Atmosphere
              </h2>
              <span className="text-[11px] text-zinc-500 font-mono">
                Active Theme: {activeTheme.name} · {activeTheme.tagline}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Theme List */}
        <div className="p-6 space-y-3 overflow-y-auto">
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">
            Select a tailored environment theme. The background atmosphere, feed lane, cards, and accent highlights all synchronize to your selected mood.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.values(COMMUNITY_THEMES).map((theme: CommunityThemeConfig) => {
              const isSelected = currentThemeId === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => {
                    onSelectTheme(theme.id);
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-3 cursor-pointer group relative overflow-hidden ${
                    isSelected
                      ? 'border-zinc-950 dark:border-white shadow-md ring-2 ring-zinc-950/20 dark:ring-white/20'
                      : 'border-zinc-200/90 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900/40'
                  }`}
                  style={{
                    backgroundColor: isSelected ? `${theme.primaryHex}12` : undefined,
                  }}
                >
                  <div className="flex items-center justify-between gap-2 w-full">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div 
                        className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center shadow-xs border border-white/20 text-white font-bold"
                        style={{ 
                          background: `linear-gradient(135deg, ${theme.primaryHex}, ${theme.secondaryHex})` 
                        }}
                      >
                        {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-zinc-950 dark:text-white block truncate">
                          {theme.name}
                        </span>
                        <span className="text-[10px] text-zinc-400 block truncate">
                          {theme.tagline}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Background Tone Indicator Pill */}
                      <span 
                        className="w-4 h-4 rounded-md border border-black/15 dark:border-white/15 shadow-2xs"
                        style={{ backgroundColor: theme.bgPageInlineDark }}
                        title="Dark mode background tone"
                      />
                      <span 
                        className="w-3 h-3 rounded-full border border-black/10 dark:border-white/10"
                        style={{ backgroundColor: theme.primaryHex }}
                        title="Primary accent"
                      />
                    </div>
                  </div>

                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                    {theme.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-end bg-zinc-50 dark:bg-zinc-900/50">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white shadow-xs cursor-pointer transition-all active:scale-95"
            style={{ 
              background: `linear-gradient(135deg, ${activeTheme.primaryHex}, ${activeTheme.secondaryHex})` 
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
