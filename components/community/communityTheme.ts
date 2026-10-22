export type CommunityThemeId = 'slate' | 'navy' | 'emerald' | 'amber' | 'cyan' | 'crimson' | 'monochrome';

export interface CommunityThemeConfig {
  id: CommunityThemeId;
  name: string;
  tagline: string;
  description: string;
  primaryHex: string;
  secondaryHex: string;
  // Background atmosphere tokens
  bgPageClass: string;
  bgPageInlineLight: string;
  bgPageInlineDark: string;
  bgMainLaneClass: string;
  bgSurfaceClass: string;
  bgSurfaceHoverClass: string;
  bgHeaderClass: string;
  bgComposerClass: string;
  ambientGradientDark: string;
  ambientGradientLight: string;
  // Accent & Action tokens
  primaryBg: string;
  primaryBgHover: string;
  primaryText: string;
  accentText: string;
  accentTextDark: string;
  accentBgSubtle: string;
  accentBorder: string;
  accentBorderSubtle: string;
  buttonClass: string;
  glowClass: string;
  ringFocus: string;
  badgeClass: string;
}

export const COMMUNITY_THEMES: Record<CommunityThemeId, CommunityThemeConfig> = {
  slate: {
    id: 'slate',
    name: 'Stealth Slate',
    tagline: 'Refined Carbon & Titanium',
    description: 'Clean charcoal and deep graphite background with crisp precision titanium accents.',
    primaryHex: '#475569',
    secondaryHex: '#0EA5E9',
    bgPageClass: 'bg-zinc-100/70 dark:bg-[#090A0E]',
    bgPageInlineLight: '#F4F4F6',
    bgPageInlineDark: '#090A0E',
    bgMainLaneClass: 'bg-white dark:bg-[#0D0E14] border-zinc-200/80 dark:border-zinc-800/80',
    bgSurfaceClass: 'bg-white dark:bg-[#12131A] border-zinc-200/80 dark:border-zinc-800/80',
    bgSurfaceHoverClass: 'hover:bg-zinc-50 dark:hover:bg-[#171822]',
    bgHeaderClass: 'bg-white/95 dark:bg-[#0D0E14]/95 border-zinc-200/80 dark:border-zinc-800/80',
    bgComposerClass: 'bg-zinc-50/70 dark:bg-[#12131A]/70',
    ambientGradientDark: 'radial-gradient(circle at 50% 0%, rgba(14, 165, 233, 0.08) 0%, rgba(9, 10, 14, 0) 70%)',
    ambientGradientLight: 'radial-gradient(circle at 50% 0%, rgba(14, 165, 233, 0.05) 0%, rgba(244, 244, 246, 0) 70%)',
    primaryBg: 'bg-zinc-900 dark:bg-zinc-100',
    primaryBgHover: 'hover:bg-zinc-800 dark:hover:bg-white',
    primaryText: 'text-white dark:text-zinc-950',
    accentText: 'text-zinc-900 dark:text-zinc-100',
    accentTextDark: 'text-zinc-300',
    accentBgSubtle: 'bg-zinc-500/10 dark:bg-zinc-500/20',
    accentBorder: 'border-zinc-400/30 dark:border-zinc-600/40',
    accentBorderSubtle: 'border-zinc-500/20',
    buttonClass: 'bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 shadow-md active:scale-95 font-bold',
    glowClass: 'bg-zinc-500/15',
    ringFocus: 'focus:ring-zinc-500/20 focus:border-zinc-500',
    badgeClass: 'bg-zinc-500/10 text-zinc-900 dark:text-zinc-100 border border-zinc-500/20',
  },

  navy: {
    id: 'navy',
    name: 'Midnight Navy',
    tagline: 'Deep Ocean & Royal Azure',
    description: 'Deep midnight nautical background with executive royal blue and cobalt highlights.',
    primaryHex: '#2563EB',
    secondaryHex: '#0284C7',
    bgPageClass: 'bg-slate-100/80 dark:bg-[#060D1A]',
    bgPageInlineLight: '#F0F4FA',
    bgPageInlineDark: '#060D1A',
    bgMainLaneClass: 'bg-white dark:bg-[#0A1326] border-slate-200/80 dark:border-blue-950/80',
    bgSurfaceClass: 'bg-white dark:bg-[#0E1B36] border-slate-200/80 dark:border-blue-900/40',
    bgSurfaceHoverClass: 'hover:bg-blue-50/40 dark:hover:bg-[#132448]',
    bgHeaderClass: 'bg-white/95 dark:bg-[#0A1326]/95 border-slate-200/80 dark:border-blue-950/80',
    bgComposerClass: 'bg-blue-50/40 dark:bg-[#0B172E]/70',
    ambientGradientDark: 'radial-gradient(circle at 50% 0%, rgba(37, 99, 235, 0.12) 0%, rgba(6, 13, 26, 0) 70%)',
    ambientGradientLight: 'radial-gradient(circle at 50% 0%, rgba(37, 99, 235, 0.06) 0%, rgba(240, 244, 250, 0) 70%)',
    primaryBg: 'bg-blue-600 dark:bg-blue-500',
    primaryBgHover: 'hover:bg-blue-500 dark:hover:bg-blue-400',
    primaryText: 'text-white',
    accentText: 'text-blue-600 dark:text-blue-400',
    accentTextDark: 'text-blue-400',
    accentBgSubtle: 'bg-blue-500/10 dark:bg-blue-500/15',
    accentBorder: 'border-blue-500/30 dark:border-blue-500/40',
    accentBorderSubtle: 'border-blue-500/20',
    buttonClass: 'bg-blue-600 hover:bg-blue-500 text-white shadow-md active:scale-95 font-bold',
    glowClass: 'bg-blue-500/15',
    ringFocus: 'focus:ring-blue-500/20 focus:border-blue-500',
    badgeClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20',
  },

  emerald: {
    id: 'emerald',
    name: 'Venture Emerald',
    tagline: 'Forest Noir & High Conviction',
    description: 'Deep forest obsidian background with high-conviction growth green and mint radiance.',
    primaryHex: '#10B981',
    secondaryHex: '#059669',
    bgPageClass: 'bg-emerald-50/50 dark:bg-[#05130E]',
    bgPageInlineLight: '#F0F9F5',
    bgPageInlineDark: '#05130E',
    bgMainLaneClass: 'bg-white dark:bg-[#091D16] border-emerald-950/20 dark:border-emerald-950/80',
    bgSurfaceClass: 'bg-white dark:bg-[#0E2A20] border-emerald-950/15 dark:border-emerald-900/40',
    bgSurfaceHoverClass: 'hover:bg-emerald-50/50 dark:hover:bg-[#13382B]',
    bgHeaderClass: 'bg-white/95 dark:bg-[#091D16]/95 border-emerald-950/20 dark:border-emerald-950/80',
    bgComposerClass: 'bg-emerald-50/40 dark:bg-[#0A221A]/70',
    ambientGradientDark: 'radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.12) 0%, rgba(5, 19, 14, 0) 70%)',
    ambientGradientLight: 'radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.06) 0%, rgba(240, 249, 245, 0) 70%)',
    primaryBg: 'bg-emerald-600 dark:bg-emerald-500',
    primaryBgHover: 'hover:bg-emerald-500 dark:hover:bg-emerald-400',
    primaryText: 'text-white',
    accentText: 'text-emerald-600 dark:text-emerald-400',
    accentTextDark: 'text-emerald-400',
    accentBgSubtle: 'bg-emerald-500/10 dark:bg-emerald-500/15',
    accentBorder: 'border-emerald-500/30 dark:border-emerald-500/40',
    accentBorderSubtle: 'border-emerald-500/20',
    buttonClass: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md active:scale-95 font-bold',
    glowClass: 'bg-emerald-500/15',
    ringFocus: 'focus:ring-emerald-500/20 focus:border-emerald-500',
    badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
  },

  amber: {
    id: 'amber',
    name: 'Venture Gold',
    tagline: 'Warm Obsidian & Prestige Editorial',
    description: 'Warm obsidian and dark espresso background with radiant amber and gilded bronze.',
    primaryHex: '#F59E0B',
    secondaryHex: '#D97706',
    bgPageClass: 'bg-amber-50/50 dark:bg-[#110D07]',
    bgPageInlineLight: '#FDFBF5',
    bgPageInlineDark: '#110D07',
    bgMainLaneClass: 'bg-white dark:bg-[#18130B] border-amber-950/20 dark:border-amber-950/80',
    bgSurfaceClass: 'bg-white dark:bg-[#221A0F] border-amber-950/15 dark:border-amber-900/40',
    bgSurfaceHoverClass: 'hover:bg-amber-50/50 dark:hover:bg-[#2D2315]',
    bgHeaderClass: 'bg-white/95 dark:bg-[#18130B]/95 border-amber-950/20 dark:border-amber-950/80',
    bgComposerClass: 'bg-amber-50/40 dark:bg-[#1A140C]/70',
    ambientGradientDark: 'radial-gradient(circle at 50% 0%, rgba(245, 158, 11, 0.12) 0%, rgba(17, 13, 7, 0) 70%)',
    ambientGradientLight: 'radial-gradient(circle at 50% 0%, rgba(245, 158, 11, 0.06) 0%, rgba(253, 251, 245, 0) 70%)',
    primaryBg: 'bg-amber-400 dark:bg-amber-400',
    primaryBgHover: 'hover:bg-amber-300 dark:hover:bg-amber-300',
    primaryText: 'text-zinc-950',
    accentText: 'text-amber-600 dark:text-amber-400',
    accentTextDark: 'text-amber-400',
    accentBgSubtle: 'bg-amber-400/10 dark:bg-amber-400/15',
    accentBorder: 'border-amber-400/30 dark:border-amber-400/40',
    accentBorderSubtle: 'border-amber-400/20',
    buttonClass: 'bg-amber-400 hover:bg-amber-300 text-zinc-950 shadow-md active:scale-95 font-bold',
    glowClass: 'bg-amber-500/15',
    ringFocus: 'focus:ring-amber-400/20 focus:border-amber-400',
    badgeClass: 'bg-amber-400/10 text-amber-600 dark:text-amber-400 border border-amber-400/30',
  },

  cyan: {
    id: 'cyan',
    name: 'Hyper Cyan',
    tagline: 'Deep Marine & Neo Teal',
    description: 'Deep oceanic dark background with vibrant high-contrast aqua and teal illumination.',
    primaryHex: '#06B6D4',
    secondaryHex: '#0284C7',
    bgPageClass: 'bg-cyan-50/50 dark:bg-[#041014]',
    bgPageInlineLight: '#F0FAFC',
    bgPageInlineDark: '#041014',
    bgMainLaneClass: 'bg-white dark:bg-[#081B22] border-cyan-950/20 dark:border-cyan-950/80',
    bgSurfaceClass: 'bg-white dark:bg-[#0D2833] border-cyan-950/15 dark:border-cyan-900/40',
    bgSurfaceHoverClass: 'hover:bg-cyan-50/50 dark:hover:bg-[#123644]',
    bgHeaderClass: 'bg-white/95 dark:bg-[#081B22]/95 border-cyan-950/20 dark:border-cyan-950/80',
    bgComposerClass: 'bg-cyan-50/40 dark:bg-[#092029]/70',
    ambientGradientDark: 'radial-gradient(circle at 50% 0%, rgba(6, 182, 212, 0.12) 0%, rgba(4, 16, 20, 0) 70%)',
    ambientGradientLight: 'radial-gradient(circle at 50% 0%, rgba(6, 182, 212, 0.06) 0%, rgba(240, 250, 252, 0) 70%)',
    primaryBg: 'bg-cyan-600 dark:bg-cyan-500',
    primaryBgHover: 'hover:bg-cyan-500 dark:hover:bg-cyan-400',
    primaryText: 'text-white',
    accentText: 'text-cyan-600 dark:text-cyan-400',
    accentTextDark: 'text-cyan-400',
    accentBgSubtle: 'bg-cyan-500/10 dark:bg-cyan-500/15',
    accentBorder: 'border-cyan-500/30 dark:border-cyan-500/40',
    accentBorderSubtle: 'border-cyan-500/20',
    buttonClass: 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md active:scale-95 font-bold',
    glowClass: 'bg-cyan-500/15',
    ringFocus: 'focus:ring-cyan-500/20 focus:border-cyan-500',
    badgeClass: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20',
  },

  crimson: {
    id: 'crimson',
    name: 'Crimson Noir',
    tagline: 'Carbon Graphite & Bold Ruby',
    description: 'Deep carbon noir background with bold ruby red and crimson syndicate convinction.',
    primaryHex: '#E11D48',
    secondaryHex: '#BE123C',
    bgPageClass: 'bg-rose-50/50 dark:bg-[#12070A]',
    bgPageInlineLight: '#FDF2F4',
    bgPageInlineDark: '#12070A',
    bgMainLaneClass: 'bg-white dark:bg-[#1C0D12] border-rose-950/20 dark:border-rose-950/80',
    bgSurfaceClass: 'bg-white dark:bg-[#28131B] border-rose-950/15 dark:border-rose-900/40',
    bgSurfaceHoverClass: 'hover:bg-rose-50/50 dark:hover:bg-[#341A24]',
    bgHeaderClass: 'bg-white/95 dark:bg-[#1C0D12]/95 border-rose-950/20 dark:border-rose-950/80',
    bgComposerClass: 'bg-rose-50/40 dark:bg-[#1E0E14]/70',
    ambientGradientDark: 'radial-gradient(circle at 50% 0%, rgba(225, 29, 72, 0.12) 0%, rgba(18, 7, 10, 0) 70%)',
    ambientGradientLight: 'radial-gradient(circle at 50% 0%, rgba(225, 29, 72, 0.06) 0%, rgba(253, 242, 244, 0) 70%)',
    primaryBg: 'bg-rose-600 dark:bg-rose-500',
    primaryBgHover: 'hover:bg-rose-500 dark:hover:bg-rose-400',
    primaryText: 'text-white',
    accentText: 'text-rose-600 dark:text-rose-400',
    accentTextDark: 'text-rose-400',
    accentBgSubtle: 'bg-rose-500/10 dark:bg-rose-500/15',
    accentBorder: 'border-rose-500/30 dark:border-rose-500/40',
    accentBorderSubtle: 'border-rose-500/20',
    buttonClass: 'bg-rose-600 hover:bg-rose-500 text-white shadow-md active:scale-95 font-bold',
    glowClass: 'bg-rose-500/15',
    ringFocus: 'focus:ring-rose-500/20 focus:border-rose-500',
    badgeClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20',
  },

  monochrome: {
    id: 'monochrome',
    name: 'Onyx Monochrome',
    tagline: 'Pure Contrast & Minimalist Void',
    description: 'Pure obsidian void background with ultra-clean monochrome typography.',
    primaryHex: '#18181B',
    secondaryHex: '#52525B',
    bgPageClass: 'bg-zinc-100 dark:bg-[#000000]',
    bgPageInlineLight: '#FAFAFA',
    bgPageInlineDark: '#000000',
    bgMainLaneClass: 'bg-white dark:bg-[#0A0A0A] border-zinc-200 dark:border-zinc-800',
    bgSurfaceClass: 'bg-white dark:bg-[#111111] border-zinc-200 dark:border-zinc-800',
    bgSurfaceHoverClass: 'hover:bg-zinc-50 dark:hover:bg-[#181818]',
    bgHeaderClass: 'bg-white/95 dark:bg-[#0A0A0A]/95 border-zinc-200 dark:border-zinc-800',
    bgComposerClass: 'bg-zinc-50 dark:bg-[#111111]/80',
    ambientGradientDark: 'radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.04) 0%, rgba(0, 0, 0, 0) 70%)',
    ambientGradientLight: 'radial-gradient(circle at 50% 0%, rgba(0, 0, 0, 0.03) 0%, rgba(250, 250, 250, 0) 70%)',
    primaryBg: 'bg-zinc-950 dark:bg-zinc-100',
    primaryBgHover: 'hover:bg-zinc-800 dark:hover:bg-white',
    primaryText: 'text-white dark:text-zinc-950',
    accentText: 'text-zinc-900 dark:text-zinc-100',
    accentTextDark: 'text-zinc-300',
    accentBgSubtle: 'bg-zinc-500/10 dark:bg-zinc-500/20',
    accentBorder: 'border-zinc-400/30 dark:border-zinc-600/40',
    accentBorderSubtle: 'border-zinc-500/20',
    buttonClass: 'bg-zinc-950 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-950 shadow-md active:scale-95 font-bold',
    glowClass: 'bg-zinc-500/15',
    ringFocus: 'focus:ring-zinc-500/20 focus:border-zinc-500',
    badgeClass: 'bg-zinc-500/10 text-zinc-900 dark:text-zinc-100 border border-zinc-500/20',
  },
};

export const getStoredCommunityTheme = (): CommunityThemeConfig => {
  try {
    const savedId = localStorage.getItem('connectup_community_theme_id') as CommunityThemeId;
    // Auto-migrate any legacy purple / indigo / violet settings to clean Slate Obsidian
    if (savedId === ('indigo' as any) || savedId === ('violet' as any)) {
      localStorage.setItem('connectup_community_theme_id', 'slate');
      return COMMUNITY_THEMES.slate;
    }
    if (savedId && COMMUNITY_THEMES[savedId]) {
      return COMMUNITY_THEMES[savedId];
    }
  } catch {}
  // Default is clean Stealth Slate (NO purple)
  return COMMUNITY_THEMES.slate;
};

export const saveCommunityTheme = (themeId: CommunityThemeId) => {
  try {
    // If somehow purple was requested, fallback to slate
    if (themeId === ('indigo' as any) || themeId === ('violet' as any)) {
      themeId = 'slate';
    }
    localStorage.setItem('connectup_community_theme_id', themeId);
  } catch {}
};
