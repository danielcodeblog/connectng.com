import React, { useState, useMemo, useEffect, useCallback, memo } from 'react';
import { motion } from 'motion/react';
import {
  Target,
  RotateCcw,
  Check,
  AlertCircle,
  ChevronRight,
  ArrowLeft,
  Crown,
  Info,
  Sun,
  Moon,
  Lightbulb,
  LayoutGrid,
  Type,
  Delete,
  ArrowRight,
  ArrowUpDown,
  X,
} from 'lucide-react';
import { CommunityThemeConfig, getStoredCommunityTheme } from './community/communityTheme';

// ==========================================
// TYPES & CONSTANTS
// ==========================================

interface PuzzleState {
  pinpoint: 'unplayed' | 'completed';
  crossclimb: 'unplayed' | 'completed';
  queens: 'unplayed' | 'completed';
  connections: 'unplayed' | 'completed';
  tango: 'unplayed' | 'completed';
  wordle: 'unplayed' | 'completed';
}

type GameKey = keyof PuzzleState;

interface VentureConnectionsProps {
  theme?: CommunityThemeConfig;
}

// ------------------------------------------
// PINPOINT GAME DATA
// ------------------------------------------
interface PinpointPuzzle {
  id: number;
  correctCategory: string;
  clues: string[];
  options: string[];
}

const PINPOINT_PUZZLES: PinpointPuzzle[] = [
  {
    id: 1,
    correctCategory: 'Silicon Valley Titans',
    clues: [
      "Known for 'move fast and break things'",
      'Acquired Instagram and WhatsApp',
      'Rebranded to a metaverse-focused name in 2021',
      'Founded in a Harvard dorm room',
      'Meta (formerly Facebook)',
    ],
    options: ['Silicon Valley Titans', 'Hardware Manufacturers', 'Venture Capitalists', 'E-commerce Giants'],
  },
  {
    id: 2,
    correctCategory: 'Startup Exits',
    clues: [
      'Process of offering shares to the public for the first time',
      'Requires a prospectus and SEC approval',
      "Often involves a 'roadshow' to pitch to investors",
      'Examples include SnowFlake and Airbnb in 2020',
      'Initial Public Offering (IPO)',
    ],
    options: ['Startup Exits', 'Bootstrapping Strategies', 'Agile Methodologies', 'Marketing Funnels'],
  },
  {
    id: 3,
    correctCategory: 'Term Sheet Clauses',
    clues: [
      'Protects investors from dilution in future down rounds',
      "Can be 'full ratchet' or 'weighted average'",
      'Adjusts the conversion price of preferred stock',
      'A heavily negotiated term in venture deals',
      'Anti-Dilution Provision',
    ],
    options: ['Term Sheet Clauses', 'SaaS Pricing Models', 'Cloud Security Protocols', 'Employee Perks'],
  },
  {
    id: 4,
    correctCategory: 'Famous Tech Hubs',
    clues: [
      'Located in the southern part of the San Francisco Bay Area',
      'Home to Stanford University and Sand Hill Road',
      'Birthplace of companies like HP, Intel, and Apple',
      'Synonymous with the global tech industry',
      'Silicon Valley',
    ],
    options: ['Famous Tech Hubs', 'Financial Districts', 'Crypto Valleys', 'Manufacturing Centers'],
  },
];

// ------------------------------------------
// QUEENS GAME DATA
// ------------------------------------------
interface QueensPuzzle {
  id: number;
  board: number[][];
  solution: Set<string>;
}

const QUEENS_PUZZLES: QueensPuzzle[] = [
  {
    id: 1,
    board: [
      [0, 0, 1, 1, 1],
      [0, 3, 2, 1, 1],
      [0, 2, 2, 2, 4],
      [3, 3, 2, 4, 4],
      [3, 3, 3, 4, 4],
    ],
    solution: new Set(['0,3', '1,0', '2,2', '3,4', '4,1']),
  },
  {
    id: 2,
    board: [
      [0, 0, 0, 1, 1],
      [2, 0, 1, 1, 1],
      [2, 2, 3, 3, 1],
      [2, 2, 4, 3, 3],
      [4, 4, 4, 4, 3],
    ],
    solution: new Set(['0,4', '1,1', '2,3', '3,0', '4,2']),
  },
];

const QUEENS_REGION_COLORS = [
  'bg-amber-500/15 dark:bg-amber-500/20 border-amber-500/35 text-amber-700 dark:text-amber-300',
  'bg-sky-500/15 dark:bg-sky-500/20 border-sky-500/35 text-sky-700 dark:text-sky-300',
  'bg-emerald-500/15 dark:bg-emerald-500/20 border-emerald-500/35 text-emerald-700 dark:text-emerald-300',
  'bg-teal-500/15 dark:bg-teal-500/20 border-teal-500/35 text-teal-700 dark:text-teal-300',
  'bg-rose-500/15 dark:bg-rose-500/20 border-rose-500/35 text-rose-700 dark:text-rose-300',
];

// ------------------------------------------
// CROSSCLIMB GAME DATA
// ------------------------------------------
interface WordLadderStep {
  word: string;
  clue: string;
}

interface CrossclimbPuzzle {
  id: number;
  name: string;
  steps: WordLadderStep[];
  startingScramble: string[];
}

const CROSSCLIMB_PUZZLES: CrossclimbPuzzle[] = [
  {
    id: 1,
    name: "The Founder's Journey",
    steps: [
      { word: 'SEED', clue: 'The earliest stage of venture funding' },
      { word: 'SEND', clue: 'What a founder does with a pitch deck email' },
      { word: 'SAND', clue: "A material heavily associated with Silicon Valley's Sand Hill Road" },
      { word: 'BAND', clue: 'A group of co-founders working closely together' },
    ],
    startingScramble: ['SAND', 'SEED', 'BAND', 'SEND'],
  },
  {
    id: 2,
    name: 'Code and Capital',
    steps: [
      { word: 'CODE', clue: 'The foundational building blocks of software' },
      { word: 'CORE', clue: 'The central, most important feature of a product' },
      { word: 'CURE', clue: 'What a disruptive health-tech startup aims to find' },
      { word: 'PURE', clue: 'A company that focuses solely on one specific product is a ___ play' },
    ],
    startingScramble: ['CURE', 'CODE', 'PURE', 'CORE'],
  },
  {
    id: 3,
    name: 'The Scaling Loop',
    steps: [
      { word: 'BURN', clue: 'The rate at which a startup spends its venture capital' },
      { word: 'TURN', clue: 'When a startup decides to pivot its business model' },
      { word: 'TORN', clue: 'How a founder feels when choosing between two term sheets' },
      { word: 'HORN', clue: 'What a startup unicorn has on its head' },
    ],
    startingScramble: ['TORN', 'BURN', 'HORN', 'TURN'],
  },
];

// ------------------------------------------
// VENTURE CONNECTIONS GAME DATA
// ------------------------------------------
interface Category {
  title: string;
  words: string[];
  color: string;
  bgColor: string;
  textColor: string;
}

interface Puzzle {
  id: number;
  name: string;
  categories: Category[];
}

const CONNECTIONS_PUZZLES: Puzzle[] = [
  {
    id: 1,
    name: 'The Cap Table',
    categories: [
      {
        title: 'STARTUP ROLES',
        words: ['FOUNDER', 'INVESTOR', 'ADVISOR', 'EMPLOYEE'],
        color: 'border-amber-500/40',
        bgColor: 'bg-amber-500/12 dark:bg-amber-500/20',
        textColor: 'text-amber-700 dark:text-amber-300',
      },
      {
        title: 'VALUATION TERMS',
        words: ['PRE-MONEY', 'POST-MONEY', 'CAP', 'DISCOUNT'],
        color: 'border-emerald-500/40',
        bgColor: 'bg-emerald-500/12 dark:bg-emerald-500/20',
        textColor: 'text-emerald-700 dark:text-emerald-300',
      },
      {
        title: 'TYPES OF ROUNDS',
        words: ['ANGEL', 'PRE-SEED', 'SERIES A', 'MEZZANINE'],
        color: 'border-sky-500/40',
        bgColor: 'bg-sky-500/12 dark:bg-sky-500/20',
        textColor: 'text-sky-700 dark:text-sky-300',
      },
      {
        title: 'EQUITY INSTRUMENTS',
        words: ['OPTIONS', 'WARRANTS', 'SAFE', 'RSU'],
        color: 'border-rose-500/40',
        bgColor: 'bg-rose-500/12 dark:bg-rose-500/20',
        textColor: 'text-rose-700 dark:text-rose-300',
      },
    ],
  },
  {
    id: 2,
    name: 'Growth & Marketing',
    categories: [
      {
        title: 'GROWTH TACTICS',
        words: ['VIRAL', 'REFERRAL', 'ORGANIC', 'PAID'],
        color: 'border-amber-500/40',
        bgColor: 'bg-amber-500/12 dark:bg-amber-500/20',
        textColor: 'text-amber-700 dark:text-amber-300',
      },
      {
        title: 'USER METRICS',
        words: ['MAU', 'DAU', 'ARPU', 'NPS'],
        color: 'border-emerald-500/40',
        bgColor: 'bg-emerald-500/12 dark:bg-emerald-500/20',
        textColor: 'text-emerald-700 dark:text-emerald-300',
      },
      {
        title: 'GO-TO-MARKET',
        words: ['INBOUND', 'OUTBOUND', 'CHANNEL', 'DIRECT'],
        color: 'border-sky-500/40',
        bgColor: 'bg-sky-500/12 dark:bg-sky-500/20',
        textColor: 'text-sky-700 dark:text-sky-300',
      },
      {
        title: 'FUNNEL STAGES',
        words: ['AWARENESS', 'INTEREST', 'DECISION', 'ACTION'],
        color: 'border-rose-500/40',
        bgColor: 'bg-rose-500/12 dark:bg-rose-500/20',
        textColor: 'text-rose-700 dark:text-rose-300',
      },
    ],
  },
  {
    id: 3,
    name: 'Product & Engineering',
    categories: [
      {
        title: 'DEV METHODOLOGIES',
        words: ['AGILE', 'SCRUM', 'KANBAN', 'WATERFALL'],
        color: 'border-amber-500/40',
        bgColor: 'bg-amber-500/12 dark:bg-amber-500/20',
        textColor: 'text-amber-700 dark:text-amber-300',
      },
      {
        title: 'PRODUCT MILESTONES',
        words: ['MVP', 'BETA', 'LAUNCH', 'V2'],
        color: 'border-emerald-500/40',
        bgColor: 'bg-emerald-500/12 dark:bg-emerald-500/20',
        textColor: 'text-emerald-700 dark:text-emerald-300',
      },
      {
        title: 'TECH INFRASTRUCTURE',
        words: ['CLOUD', 'SERVER', 'DATABASE', 'API'],
        color: 'border-sky-500/40',
        bgColor: 'bg-sky-500/12 dark:bg-sky-500/20',
        textColor: 'text-sky-700 dark:text-sky-300',
      },
      {
        title: 'DESIGN ELEMENTS',
        words: ['WIREFRAME', 'MOCKUP', 'PROTOTYPE', 'UI/UX'],
        color: 'border-rose-500/40',
        bgColor: 'bg-rose-500/12 dark:bg-rose-500/20',
        textColor: 'text-rose-700 dark:text-rose-300',
      },
    ],
  },
];

// ------------------------------------------
// TANGO GAME DATA
// ------------------------------------------
interface TangoPuzzle {
  id: number;
  name: string;
  size: number;
  givens: [number, number, 'S' | 'M'][];
  equalPairs: [number, number, number, number][];
  oppositePairs: [number, number, number, number][];
  solution: ('S' | 'M')[][];
}

const TANGO_PUZZLES: TangoPuzzle[] = [
  {
    id: 1,
    name: 'Solar Flare',
    size: 4,
    givens: [
      [0, 0, 'S'],
      [1, 3, 'S'],
      [3, 1, 'M'],
    ],
    equalPairs: [
      [2, 0, 2, 1],
      [2, 2, 2, 3],
      [3, 0, 3, 1],
      [3, 2, 3, 3],
    ],
    oppositePairs: [
      [0, 1, 1, 1],
      [0, 2, 1, 2],
    ],
    solution: [
      ['S', 'M', 'S', 'M'],
      ['M', 'S', 'M', 'S'],
      ['S', 'S', 'M', 'M'],
      ['M', 'M', 'S', 'S'],
    ],
  },
  {
    id: 2,
    name: 'Eclipse',
    size: 4,
    givens: [
      [0, 0, 'M'],
      [1, 3, 'S'],
      [3, 2, 'S'],
    ],
    equalPairs: [
      [0, 1, 0, 2],
      [1, 1, 1, 2],
    ],
    oppositePairs: [
      [2, 0, 3, 0],
      [2, 3, 3, 3],
    ],
    solution: [
      ['M', 'S', 'S', 'M'],
      ['S', 'M', 'M', 'S'],
      ['M', 'S', 'M', 'S'],
      ['S', 'M', 'S', 'M'],
    ],
  },
  {
    id: 3,
    name: 'Equinox',
    size: 4,
    givens: [
      [0, 3, 'S'],
      [1, 0, 'M'],
      [3, 3, 'S'],
    ],
    equalPairs: [
      [0, 1, 0, 2],
      [1, 1, 1, 2],
      [2, 0, 2, 1],
      [3, 0, 3, 1],
    ],
    oppositePairs: [[1, 0, 2, 0]],
    solution: [
      ['S', 'M', 'M', 'S'],
      ['M', 'S', 'S', 'M'],
      ['S', 'S', 'M', 'M'],
      ['M', 'M', 'S', 'S'],
    ],
  },
];

// ------------------------------------------
// WORDLE GAME DATA
// ------------------------------------------
interface WordlePuzzle {
  id: number;
  word: string;
  hint: string;
  category: string;
}

const WORDLE_PUZZLES: WordlePuzzle[] = [
  {
    id: 1,
    word: 'PIVOT',
    hint: 'A strategic shift in business direction or product vision to capture market opportunity',
    category: 'Startup Strategy',
  },
  {
    id: 2,
    word: 'ANGEL',
    hint: 'An early-stage accredited investor who backs founders before major venture rounds',
    category: 'Venture Capital',
  },
  {
    id: 3,
    word: 'SCALE',
    hint: 'Rapidly expanding product reach, team, and revenue while improving unit economics',
    category: 'Growth & Traction',
  },
  {
    id: 4,
    word: 'PITCH',
    hint: 'A presentation where founders showcase problem, product, and metrics to secure capital',
    category: 'Fundraising',
  },
  {
    id: 5,
    word: 'FUNDS',
    hint: 'Pooled venture capital vehicles deployed by general partners into high-growth bets',
    category: 'Financing',
  },
  {
    id: 6,
    word: 'YIELD',
    hint: 'The financial return or productivity generated from deployed capital and operational efforts',
    category: 'Unit Economics',
  },
];

// ==========================================
// MAIN MASTER EXPORT
// ==========================================

export const VentureConnections: React.FC<VentureConnectionsProps> = ({ theme: propTheme }) => {
  const theme = propTheme || getStoredCommunityTheme();
  const [activeGame, setActiveGame] = useState<null | GameKey>(null);
  const [, setCompletedGames] = useState<PuzzleState>({
    pinpoint: 'unplayed',
    crossclimb: 'unplayed',
    queens: 'unplayed',
    connections: 'unplayed',
    tango: 'unplayed',
    wordle: 'unplayed',
  });

  const [completedPuzzles, setCompletedPuzzles] = useState<Record<string, number[]>>({
    pinpoint: [],
    crossclimb: [],
    queens: [],
    connections: [],
    tango: [],
    wordle: [],
  });

  useEffect(() => {
    const saved = localStorage.getItem('connectup_puzzles_completed');
    if (saved) {
      try {
        setCompletedGames(JSON.parse(saved));
      } catch {
        // ignore
      }
    }
    const savedSubs = localStorage.getItem('connectup_sub_puzzles_completed');
    if (savedSubs) {
      try {
        setCompletedPuzzles(JSON.parse(savedSubs));
      } catch {
        // ignore
      }
    }
  }, []);

  const handleSolvePuzzle = useCallback((game: GameKey, id: number) => {
    setCompletedPuzzles((prev) => {
      const alreadySolved = prev[game] || [];
      if (alreadySolved.includes(id)) return prev;
      const updatedList = [...alreadySolved, id];
      const updated = { ...prev, [game]: updatedList };
      localStorage.setItem('connectup_sub_puzzles_completed', JSON.stringify(updated));

      let total = 1;
      if (game === 'pinpoint') total = PINPOINT_PUZZLES.length;
      else if (game === 'crossclimb') total = CROSSCLIMB_PUZZLES.length;
      else if (game === 'queens') total = QUEENS_PUZZLES.length;
      else if (game === 'connections') total = CONNECTIONS_PUZZLES.length;
      else if (game === 'tango') total = TANGO_PUZZLES.length;
      else if (game === 'wordle') total = WORDLE_PUZZLES.length;

      if (updatedList.length >= total) {
        setCompletedGames((prevGames) => {
          const updatedGames = { ...prevGames, [game]: 'completed' as const };
          localStorage.setItem('connectup_puzzles_completed', JSON.stringify(updatedGames));
          return updatedGames;
        });
      }

      return updated;
    });
  }, []);

  const handleSolvePinpoint = useCallback((id: number) => handleSolvePuzzle('pinpoint', id), [handleSolvePuzzle]);
  const handleSolveCrossclimb = useCallback((id: number) => handleSolvePuzzle('crossclimb', id), [handleSolvePuzzle]);
  const handleSolveQueens = useCallback((id: number) => handleSolvePuzzle('queens', id), [handleSolvePuzzle]);
  const handleSolveConnections = useCallback((id: number) => handleSolvePuzzle('connections', id), [handleSolvePuzzle]);
  const handleSolveTango = useCallback((id: number) => handleSolvePuzzle('tango', id), [handleSolvePuzzle]);
  const handleSolveWordle = useCallback((id: number) => handleSolvePuzzle('wordle', id), [handleSolvePuzzle]);

  const gameSummaries = useMemo(
    () => [
      {
        key: 'pinpoint' as GameKey,
        title: 'Pinpoint',
        subtitle: '5-clue category deduction',
        solved: completedPuzzles.pinpoint?.length || 0,
        total: PINPOINT_PUZZLES.length,
        icon: Target,
        iconBg: 'bg-sky-500/12 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400',
      },
      {
        key: 'crossclimb' as GameKey,
        title: 'Crossclimb',
        subtitle: 'One-letter word ladder',
        solved: completedPuzzles.crossclimb?.length || 0,
        total: CROSSCLIMB_PUZZLES.length,
        icon: ArrowUpDown,
        iconBg: 'bg-cyan-500/12 text-cyan-600 dark:bg-cyan-500/15 dark:text-cyan-400',
      },
      {
        key: 'queens' as GameKey,
        title: 'Queens',
        subtitle: 'Region & adjacency logic',
        solved: completedPuzzles.queens?.length || 0,
        total: QUEENS_PUZZLES.length,
        icon: Crown,
        iconBg: 'bg-amber-500/12 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400',
      },
      {
        key: 'connections' as GameKey,
        title: 'Connections',
        subtitle: 'Group 4 startup terms',
        solved: completedPuzzles.connections?.length || 0,
        total: CONNECTIONS_PUZZLES.length,
        icon: LayoutGrid,
        iconBg: 'bg-rose-500/12 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400',
      },
      {
        key: 'tango' as GameKey,
        title: 'Tango',
        subtitle: 'Balanced sun & moon grid',
        solved: completedPuzzles.tango?.length || 0,
        total: TANGO_PUZZLES.length,
        icon: Sun,
        iconBg: 'bg-orange-500/12 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400',
      },
      {
        key: 'wordle' as GameKey,
        title: 'Wordle',
        subtitle: '5-letter venture vocabulary',
        solved: completedPuzzles.wordle?.length || 0,
        total: WORDLE_PUZZLES.length,
        icon: Type,
        iconBg: 'bg-emerald-500/12 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400',
      },
    ],
    [completedPuzzles]
  );

  const totalSolved = useMemo(
    () => gameSummaries.reduce((acc, item) => acc + Math.min(item.solved, item.total), 0),
    [gameSummaries]
  );
  const totalPuzzles = useMemo(
    () => gameSummaries.reduce((acc, item) => acc + item.total, 0),
    [gameSummaries]
  );
  const progressPercent = totalPuzzles > 0 ? Math.round((totalSolved / totalPuzzles) * 100) : 0;

  const activeMeta = gameSummaries.find((g) => g.key === activeGame);

  // ==========================================
  // DIRECTORY VIEW
  // ==========================================
  if (activeGame === null) {
    return (
      <section
        aria-label="Founder Mind Gym"
        className={`rounded-3xl border ${theme.bgSurfaceClass} shadow-[0_4px_24px_rgba(0,0,0,0.03)] overflow-hidden transition-colors duration-300`}
      >
        {/* Clean Editorial Header */}
        <div className="px-5 pt-5 pb-4 border-b border-zinc-100 dark:border-zinc-800/80 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-serif font-bold text-lg text-zinc-950 dark:text-white leading-tight">
                Founder Mind Gym
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Daily logic and strategy warmups
              </p>
            </div>
            <span className="text-xs font-mono font-semibold tabular-nums text-zinc-500 dark:text-zinc-400 shrink-0 pt-0.5">
              {totalSolved}/{totalPuzzles} solved
            </span>
          </div>

          {/* Hairline Overall Progress Bar */}
          <div
            className="w-full h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden"
            role="progressbar"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Overall puzzle completion"
          >
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${progressPercent}%`,
                background: `linear-gradient(90deg, ${theme.primaryHex}, ${theme.secondaryHex})`,
              }}
            />
          </div>
        </div>

        {/* Hairline-Separated Puzzle List */}
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800/70">
          {gameSummaries.map((game) => {
            const IconComp = game.icon;
            const isAllSolved = game.solved >= game.total;

            return (
              <button
                key={game.key}
                type="button"
                onClick={() => setActiveGame(game.key)}
                className="w-full px-5 py-3.5 flex items-center justify-between gap-3 text-left hover:bg-zinc-50/90 dark:hover:bg-white/[0.03] transition-colors cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-500"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${game.iconBg}`}>
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                        {game.title}
                      </span>
                      {isAllSolved && (
                        <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                          <Check className="w-3 h-3 stroke-[2.75]" />
                          Done
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                      {game.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-mono tabular-nums text-zinc-400 dark:text-zinc-500">
                    {game.solved}/{game.total}
                  </span>
                  <ChevronRight className="w-4 h-4 text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 group-hover:translate-x-0.5 transition-all" />
                </div>
              </button>
            );
          })}
        </div>
      </section>
    );
  }

  // ==========================================
  // ACTIVE GAME VIEW
  // ==========================================
  return (
    <section
      aria-label={activeMeta?.title || 'Puzzle'}
      className={`rounded-3xl border ${theme.bgSurfaceClass} shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-5 flex flex-col max-h-[calc(100vh-32px)] overflow-y-auto custom-scrollbar transition-colors duration-300`}
    >
      {/* Top Back Navigation */}
      <div className="flex items-center justify-between gap-3 pb-3.5 mb-4 border-b border-zinc-100 dark:border-zinc-800/80">
        <button
          type="button"
          onClick={() => setActiveGame(null)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Puzzles</span>
        </button>

        {activeMeta && (
          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 min-w-0">
            <span className="font-semibold text-zinc-900 dark:text-white truncate">
              {activeMeta.title}
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums shrink-0">
              {activeMeta.solved}/{activeMeta.total}
            </span>
          </div>
        )}
      </div>

      {activeGame === 'pinpoint' && (
        <PinpointGame completedList={completedPuzzles.pinpoint} onSolve={handleSolvePinpoint} />
      )}

      {activeGame === 'crossclimb' && (
        <CrossclimbGame completedList={completedPuzzles.crossclimb} onSolve={handleSolveCrossclimb} />
      )}

      {activeGame === 'queens' && (
        <QueensGame completedList={completedPuzzles.queens} onSolve={handleSolveQueens} />
      )}

      {activeGame === 'connections' && (
        <ConnectionsGame completedList={completedPuzzles.connections} onSolve={handleSolveConnections} />
      )}

      {activeGame === 'tango' && (
        <TangoGame completedList={completedPuzzles.tango || []} onSolve={handleSolveTango} />
      )}

      {activeGame === 'wordle' && (
        <WordleGame completedList={completedPuzzles.wordle || []} onSolve={handleSolveWordle} />
      )}
    </section>
  );
};

// ==========================================
// 1. PINPOINT SUB-GAME COMPONENT
// ==========================================

const PinpointGame = memo(
  ({ completedList, onSolve }: { completedList: number[]; onSolve: (id: number) => void }) => {
    const [puzzleIndex, setPuzzleIndex] = useState(0);
    const [currentClueCount, setCurrentClueCount] = useState(1);
    const [attemptsRemaining, setAttemptsRemaining] = useState(4);
    const [isWon, setIsWon] = useState(false);
    const [isLost, setIsLost] = useState(false);
    const [selectedGuess, setSelectedGuess] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<string | null>(null);

    const puzzle = PINPOINT_PUZZLES[puzzleIndex];

    useEffect(() => {
      const isCompleted = completedList.includes(puzzle.id);
      if (isCompleted) {
        setCurrentClueCount(5);
        setIsWon(true);
        setIsLost(false);
        setSelectedGuess(puzzle.correctCategory);
        setFeedback('Solved. You identified the linking category.');
      } else {
        setCurrentClueCount(1);
        setIsWon(false);
        setIsLost(false);
        setSelectedGuess(null);
        setFeedback(null);
        setAttemptsRemaining(4);
      }
    }, [puzzleIndex, completedList, puzzle.id, puzzle.correctCategory]);

    const handleNextClue = () => {
      if (currentClueCount < 5) {
        setCurrentClueCount((prev) => prev + 1);
      }
    };

    const handleGuessSubmit = () => {
      if (!selectedGuess) return;

      if (selectedGuess === puzzle.correctCategory) {
        setIsWon(true);
        setFeedback('Solved. That is the correct category.');
        onSolve(puzzle.id);
      } else {
        setAttemptsRemaining((prev) => {
          const next = prev - 1;
          if (next === 0) {
            setIsLost(true);
            setFeedback(`Out of attempts. Answer: "${puzzle.correctCategory}".`);
          } else {
            setFeedback('Not quite. Try another option or reveal the next clue.');
          }
          return next;
        });
      }
    };

    const handleReset = () => {
      setCurrentClueCount(1);
      setAttemptsRemaining(4);
      setIsWon(false);
      setIsLost(false);
      setSelectedGuess(null);
      setFeedback(null);
    };

    return (
      <div className="space-y-4">
        {/* Puzzle Tabs */}
        <div className="flex gap-1.5 pb-2 overflow-x-auto no-scrollbar border-b border-zinc-100 dark:border-zinc-800/80">
          {PINPOINT_PUZZLES.map((p, idx) => {
            const isCompleted = completedList.includes(p.id);
            const isActive = puzzleIndex === idx;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setPuzzleIndex(idx)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950'
                    : 'bg-zinc-100 dark:bg-zinc-800/70 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                }`}
              >
                <span>Puzzle {idx + 1}</span>
                {isCompleted && <Check className="w-3 h-3 text-emerald-500 stroke-[2.75]" />}
              </button>
            );
          })}
        </div>

        <div>
          <h4 className="font-semibold text-sm text-zinc-950 dark:text-white">
            Guess the shared category
          </h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Find the theme linking all five clues.
          </p>
        </div>

        {/* Clues list */}
        <div className="bg-zinc-50 dark:bg-zinc-900/60 rounded-2xl p-3.5 border border-zinc-200/70 dark:border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span className="font-medium">Clues revealed</span>
            <span className="font-mono tabular-nums">{currentClueCount}/5</span>
          </div>
          <div className="space-y-1.5">
            {Array.from({ length: currentClueCount }).map((_, i) => (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.16 }}
                key={i}
                className="flex items-start gap-2.5 text-xs font-medium text-zinc-800 dark:text-zinc-200 bg-white dark:bg-zinc-900/90 px-3 py-2 rounded-xl border border-zinc-200/70 dark:border-zinc-800"
              >
                <span className="font-mono tabular-nums text-[11px] font-bold text-sky-600 dark:text-sky-400 pt-0.5">
                  0{i + 1}
                </span>
                <span className="leading-snug">{puzzle.clues[i]}</span>
              </motion.div>
            ))}
          </div>

          {currentClueCount < 5 && !isWon && !isLost && (
            <button
              type="button"
              onClick={handleNextClue}
              className="w-full py-2 mt-1 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Reveal Next Clue
            </button>
          )}
        </div>

        {/* Category Options */}
        {!isWon && !isLost && (
          <div className="space-y-2">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 block">
              Select a category
            </span>
            <div className="grid grid-cols-1 gap-1.5">
              {puzzle.options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setSelectedGuess(opt)}
                  className={`py-2.5 px-3 rounded-xl border text-left text-xs font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                    selectedGuess === opt
                      ? 'bg-zinc-950 border-zinc-950 text-white dark:bg-zinc-100 dark:border-zinc-100 dark:text-zinc-950'
                      : 'bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200/80 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <span>{opt}</span>
                  <div
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                      selectedGuess === opt
                        ? 'border-current'
                        : 'border-zinc-300 dark:border-zinc-600'
                    }`}
                  >
                    {selectedGuess === opt && <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Feedback */}
        {feedback && (
          <div
            className={`p-3 rounded-xl text-xs font-medium border flex items-center gap-2 ${
              isWon
                ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-700 dark:text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/25 text-rose-700 dark:text-rose-300'
            }`}
          >
            {isWon ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{feedback}</span>
          </div>
        )}

        {/* Action footer */}
        <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-zinc-500 dark:text-zinc-400">Attempts</span>
            <span className="text-xs font-mono tabular-nums font-semibold text-zinc-700 dark:text-zinc-300">
              {attemptsRemaining}/4
            </span>
          </div>

          <div className="flex gap-2">
            {isWon || isLost ? (
              <button
                type="button"
                onClick={handleReset}
                disabled={completedList.includes(puzzle.id)}
                className="py-1.5 px-3 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-xs font-semibold text-zinc-800 dark:text-zinc-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGuessSubmit}
                disabled={!selectedGuess}
                className="py-1.5 px-4 bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-white disabled:opacity-40 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Submit Guess
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
);

// ==========================================
// 2. CROSSCLIMB SUB-GAME COMPONENT
// ==========================================

const CrossclimbGame = memo(
  ({ completedList, onSolve }: { completedList: number[]; onSolve: (id: number) => void }) => {
    const [puzzleIndex, setPuzzleIndex] = useState(0);
    const [words, setWords] = useState<string[]>([]);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [isSolved, setIsSolved] = useState(false);
    const [feedback, setFeedback] = useState<string | null>(null);

    const puzzle = CROSSCLIMB_PUZZLES[puzzleIndex];

    useEffect(() => {
      const isCompleted = completedList.includes(puzzle.id);
      if (isCompleted) {
        setWords(puzzle.steps.map((step) => step.word));
        setIsSolved(true);
        setFeedback('Ladder solved. Each rung changes by one letter.');
      } else {
        setWords([...puzzle.startingScramble]);
        setIsSolved(false);
        setFeedback(null);
      }
      setSelectedIndex(null);
    }, [puzzleIndex, completedList, puzzle.id, puzzle.startingScramble, puzzle.steps]);

    const handleWordSwap = (index: number) => {
      if (isSolved) return;

      if (selectedIndex === null) {
        setSelectedIndex(index);
      } else {
        if (selectedIndex === index) {
          setSelectedIndex(null);
          return;
        }
        const newWords = [...words];
        const temp = newWords[selectedIndex];
        newWords[selectedIndex] = newWords[index];
        newWords[index] = temp;
        setWords(newWords);
        setSelectedIndex(null);

        const solved = puzzle.steps.every((step, idx) => step.word === newWords[idx]);
        if (solved) {
          setIsSolved(true);
          setFeedback('Ladder solved. Each rung changes by one letter.');
          onSolve(puzzle.id);
        }
      }
    };

    const handleReset = () => {
      setWords([...puzzle.startingScramble]);
      setSelectedIndex(null);
      setIsSolved(false);
      setFeedback(null);
    };

    return (
      <div className="space-y-4">
        <div className="flex gap-1.5 pb-2 overflow-x-auto no-scrollbar border-b border-zinc-100 dark:border-zinc-800/80">
          {CROSSCLIMB_PUZZLES.map((p, idx) => {
            const isCompleted = completedList.includes(p.id);
            const isActive = puzzleIndex === idx;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setPuzzleIndex(idx)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950'
                    : 'bg-zinc-100 dark:bg-zinc-800/70 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                }`}
              >
                <span>Ladder {idx + 1}</span>
                {isCompleted && <Check className="w-3 h-3 text-emerald-500 stroke-[2.75]" />}
              </button>
            );
          })}
        </div>

        <div>
          <h4 className="font-semibold text-sm text-zinc-950 dark:text-white">{puzzle.name}</h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Swap two words so each step changes one letter and matches its clue.
          </p>
        </div>

        {/* Ladder Rows */}
        <div className="space-y-2.5 relative">
          <div className="absolute left-[46px] top-6 bottom-6 w-px bg-zinc-200 dark:bg-zinc-700 z-0" />

          {words.map((word, i) => {
            const matchingClue = puzzle.steps[i];
            const isSelected = selectedIndex === i;

            return (
              <motion.div key={i} layout className="relative z-10 flex items-stretch gap-3">
                <button
                  type="button"
                  onClick={() => handleWordSwap(i)}
                  className={`w-24 py-2.5 rounded-xl border font-mono font-bold text-xs tracking-widest text-center cursor-pointer transition-colors shrink-0 ${
                    isSolved
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300'
                      : isSelected
                      ? 'bg-cyan-600 border-cyan-500 text-white'
                      : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  {word}
                </button>

                <div className="flex-1 text-xs text-zinc-600 dark:text-zinc-300 leading-snug bg-zinc-50/80 dark:bg-zinc-900/50 border border-zinc-200/70 dark:border-zinc-800 px-3 py-2 rounded-xl flex flex-col justify-center">
                  <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 mb-0.5">
                    Clue {i + 1}
                  </span>
                  <span>{matchingClue ? matchingClue.clue : ''}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {feedback && (
          <div className="p-3 rounded-xl text-xs font-medium border flex items-center gap-2 bg-emerald-500/10 border-emerald-500/25 text-emerald-700 dark:text-emerald-300">
            <Check className="w-4 h-4 shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs">
          <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            Tap two words to swap
          </span>
          <button
            type="button"
            onClick={handleReset}
            disabled={completedList.includes(puzzle.id)}
            className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white font-semibold disabled:opacity-40 cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>
    );
  }
);

// ==========================================
// 3. QUEENS SUB-GAME COMPONENT
// ==========================================

const QueensGame = memo(
  ({ completedList, onSolve }: { completedList: number[]; onSolve: (id: number) => void }) => {
    const [puzzleIndex, setPuzzleIndex] = useState(0);
    const [grid, setGrid] = useState<(null | 'X' | 'Q')[][]>(
      Array(5)
        .fill(null)
        .map(() => Array(5).fill(null))
    );
    const [feedback, setFeedback] = useState<string | null>(null);
    const [errorStatus, setErrorStatus] = useState<string | null>(null);
    const [isSolved, setIsSolved] = useState(false);

    const puzzle = QUEENS_PUZZLES[puzzleIndex];

    useEffect(() => {
      const isCompleted = completedList.includes(puzzle.id);
      if (isCompleted) {
        const solvedGrid = Array(5)
          .fill(null)
          .map((_, r) =>
            Array(5)
              .fill(null)
              .map((__, c) => (puzzle.solution.has(`${r},${c}`) ? 'Q' : 'X'))
          );
        setGrid(solvedGrid);
        setIsSolved(true);
        setFeedback('Solved. All five crowns satisfy row, column, and region rules.');
        setErrorStatus(null);
      } else {
        setGrid(
          Array(5)
            .fill(null)
            .map(() => Array(5).fill(null))
        );
        setIsSolved(false);
        setFeedback(null);
        setErrorStatus(null);
      }
    }, [puzzleIndex, completedList, puzzle.id, puzzle.solution]);

    const handleCellClick = (r: number, c: number) => {
      if (isSolved) return;

      setGrid((prev) => {
        const next = prev.map((row) => [...row]);
        const current = next[r][c];
        if (current === null) next[r][c] = 'Q';
        else if (current === 'Q') next[r][c] = 'X';
        else next[r][c] = null;
        return next;
      });
      setFeedback(null);
      setErrorStatus(null);
    };

    const violations = useMemo(() => {
      const queenPositions: [number, number][] = [];
      grid.forEach((row, r) => {
        row.forEach((cell, c) => {
          if (cell === 'Q') queenPositions.push([r, c]);
        });
      });

      const rowCounts: Record<number, number> = {};
      const colCounts: Record<number, number> = {};
      const regionCounts: Record<number, number> = {};
      const touchingPairs: Set<string> = new Set();

      queenPositions.forEach(([r, c]) => {
        rowCounts[r] = (rowCounts[r] || 0) + 1;
        colCounts[c] = (colCounts[c] || 0) + 1;
        const region = puzzle.board[r][c];
        regionCounts[region] = (regionCounts[region] || 0) + 1;
      });

      for (let i = 0; i < queenPositions.length; i++) {
        for (let j = i + 1; j < queenPositions.length; j++) {
          const [r1, c1] = queenPositions[i];
          const [r2, c2] = queenPositions[j];
          if (Math.abs(r1 - r2) <= 1 && Math.abs(c1 - c2) <= 1) {
            touchingPairs.add(`${r1},${c1}`);
            touchingPairs.add(`${r2},${c2}`);
          }
        }
      }

      return {
        rowCounts,
        colCounts,
        regionCounts,
        touchingPairs,
        totalQueens: queenPositions.length,
      };
    }, [grid, puzzle.board]);

    const handleVerify = () => {
      const { rowCounts, colCounts, regionCounts, touchingPairs, totalQueens } = violations;

      if (totalQueens !== 5) {
        setErrorStatus(`Place exactly 5 crowns (${totalQueens}/5 placed).`);
        return;
      }

      const badRow = Object.values(rowCounts).some((v) => v > 1);
      const badCol = Object.values(colCounts).some((v) => v > 1);
      const badRegion = Object.values(regionCounts).some((v) => v > 1);
      const hasTouch = touchingPairs.size > 0;

      if (badRow || badCol || badRegion || hasTouch) {
        setErrorStatus('Check rows, columns, colored regions, and adjacent crowns.');
        return;
      }

      const isCorrect = Array.from(puzzle.solution).every((coord) => {
        const [r, c] = coord.split(',').map(Number);
        return grid[r][c] === 'Q';
      });

      if (!isCorrect) {
        setErrorStatus('Placement does not match the valid solution. Try adjusting.');
        return;
      }

      setIsSolved(true);
      setFeedback('Solved. All five crowns satisfy row, column, and region rules.');
      setErrorStatus(null);
      onSolve(puzzle.id);
    };

    const handleReset = () => {
      setGrid(
        Array(5)
          .fill(null)
          .map(() => Array(5).fill(null))
      );
      setFeedback(null);
      setErrorStatus(null);
      setIsSolved(false);
    };

    return (
      <div className="space-y-4">
        <div className="flex gap-1.5 pb-2 overflow-x-auto no-scrollbar border-b border-zinc-100 dark:border-zinc-800/80">
          {QUEENS_PUZZLES.map((p, idx) => {
            const isCompleted = completedList.includes(p.id);
            const isActive = puzzleIndex === idx;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setPuzzleIndex(idx)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950'
                    : 'bg-zinc-100 dark:bg-zinc-800/70 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                }`}
              >
                <span>Board {idx + 1}</span>
                {isCompleted && <Check className="w-3 h-3 text-emerald-500 stroke-[2.75]" />}
              </button>
            );
          })}
        </div>

        <div>
          <h4 className="font-semibold text-sm text-zinc-950 dark:text-white">
            Crown Matrix — Board {puzzleIndex + 1}
          </h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Place 1 crown per row, column, and color region. Crowns cannot touch, even diagonally.
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900/50 py-2 px-3 rounded-xl border border-zinc-200/70 dark:border-zinc-800">
          <span className="inline-flex items-center gap-1">
            <Crown className="w-3.5 h-3.5 text-amber-500" /> Tap once: Crown
          </span>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1">
            <X className="w-3.5 h-3.5 text-zinc-400" /> Tap twice: Mark empty
          </span>
        </div>

        {/* 5x5 Board */}
        <div className="flex justify-center py-1">
          <div className="grid grid-cols-5 gap-1.5 p-2 bg-zinc-100/80 dark:bg-zinc-900/80 rounded-2xl border border-zinc-200/80 dark:border-zinc-800">
            {grid.map((row, r) =>
              row.map((cell, c) => {
                const region = puzzle.board[r][c];
                const regionColorClass = QUEENS_REGION_COLORS[region];

                const { rowCounts, colCounts, regionCounts, touchingPairs } = violations;
                const hasRowViol = (rowCounts[r] || 0) > 1;
                const hasColViol = (colCounts[c] || 0) > 1;
                const hasRegViol = (regionCounts[region] || 0) > 1;
                const isTouching = touchingPairs.has(`${r},${c}`);

                const isViolated =
                  cell === 'Q' && (hasRowViol || hasColViol || hasRegViol || isTouching);

                return (
                  <button
                    id={`queens-cell-${r}-${c}`}
                    key={`${r}-${c}`}
                    type="button"
                    onClick={() => handleCellClick(r, c)}
                    aria-label={`Row ${r + 1} Column ${c + 1}`}
                    className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-bold transition-transform relative border cursor-pointer select-none active:scale-95 ${regionColorClass} ${
                      isViolated ? '!border-rose-500 !bg-rose-500/20' : ''
                    }`}
                  >
                    {cell === 'Q' && (
                      <motion.div
                        initial={{ scale: 0.6 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.15 }}
                        className={
                          isViolated
                            ? 'text-rose-600 dark:text-rose-400'
                            : 'text-amber-600 dark:text-amber-400'
                        }
                      >
                        <Crown className="w-5 h-5 fill-current" />
                      </motion.div>
                    )}
                    {cell === 'X' && <X className="w-3.5 h-3.5 text-zinc-500/60 dark:text-white/35" />}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {errorStatus && (
          <div className="p-2.5 rounded-xl text-xs font-medium bg-rose-500/10 border border-rose-500/25 text-rose-700 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorStatus}</span>
          </div>
        )}

        {feedback && (
          <div className="p-3 rounded-xl text-xs font-medium bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
          <button
            type="button"
            onClick={handleReset}
            disabled={completedList.includes(puzzle.id)}
            className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white text-xs font-semibold disabled:opacity-40 cursor-pointer"
          >
            Reset Board
          </button>

          {!isSolved && (
            <button
              type="button"
              onClick={handleVerify}
              className="py-1.5 px-4 bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
            >
              Verify Solution
            </button>
          )}
        </div>
      </div>
    );
  }
);

// ==========================================
// 4. CONNECTIONS SUB-GAME COMPONENT
// ==========================================

const ConnectionsGame = memo(
  ({ completedList, onSolve }: { completedList: number[]; onSolve: (id: number) => void }) => {
    const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
    const [selectedWords, setSelectedWords] = useState<string[]>([]);
    const [solvedCategories, setSolvedCategories] = useState<Category[]>([]);
    const [mistakesRemaining, setMistakesRemaining] = useState(4);
    const [feedback, setFeedback] = useState<{ message: string; isError: boolean } | null>(null);
    const [shake, setShake] = useState(false);

    const currentPuzzle = CONNECTIONS_PUZZLES[currentPuzzleIndex];

    useEffect(() => {
      const isCompleted = completedList.includes(currentPuzzle.id);
      if (isCompleted) {
        setSolvedCategories([...currentPuzzle.categories]);
        setSelectedWords([]);
        setMistakesRemaining(4);
        setFeedback({ message: 'Solved. All four groups matched.', isError: false });
      } else {
        setSolvedCategories([]);
        setSelectedWords([]);
        setMistakesRemaining(4);
        setFeedback(null);
      }
    }, [currentPuzzleIndex, completedList, currentPuzzle.id, currentPuzzle.categories]);

    const activeWords = useMemo(() => {
      const solvedWordSet = new Set(solvedCategories.flatMap((c) => c.words));
      const remaining = currentPuzzle.categories
        .flatMap((c) => c.words)
        .filter((word) => !solvedWordSet.has(word));

      return [...remaining].sort((a, b) => a.localeCompare(b));
    }, [currentPuzzle, solvedCategories]);

    const handleWordClick = (word: string) => {
      if (feedback) setFeedback(null);
      if (selectedWords.includes(word)) {
        setSelectedWords((prev) => prev.filter((w) => w !== word));
      } else {
        if (selectedWords.length >= 4) {
          setFeedback({ message: 'Select up to 4 words at a time.', isError: true });
          return;
        }
        setSelectedWords((prev) => [...prev, word]);
      }
    };

    const handleSubmit = () => {
      if (selectedWords.length !== 4) {
        setFeedback({ message: 'Select 4 words to check a group.', isError: true });
        return;
      }

      const matchingCategory = currentPuzzle.categories.find((category) =>
        category.words.every((word) => selectedWords.includes(word))
      );

      if (matchingCategory) {
        const nextSolved = [...solvedCategories, matchingCategory];
        setSolvedCategories(nextSolved);
        setSelectedWords([]);
        setFeedback({ message: `Matched: ${matchingCategory.title}`, isError: false });

        if (nextSolved.length === currentPuzzle.categories.length) {
          onSolve(currentPuzzle.id);
        }
      } else {
        let maxMatch = 0;
        currentPuzzle.categories.forEach((cat) => {
          const matchCount = cat.words.filter((w) => selectedWords.includes(w)).length;
          if (matchCount > maxMatch) maxMatch = matchCount;
        });

        setMistakesRemaining((prev) => {
          const next = prev - 1;
          if (next === 0) {
            setFeedback({ message: 'Out of mistakes. Reset to try again.', isError: true });
          } else if (maxMatch === 3) {
            setFeedback({ message: 'One word away.', isError: true });
          } else {
            setFeedback({ message: 'Not a matching group.', isError: true });
          }
          return next;
        });

        setShake(true);
        setTimeout(() => setShake(false), 450);
      }
    };

    const handleReset = () => {
      setSelectedWords([]);
      setSolvedCategories([]);
      setMistakesRemaining(4);
      setFeedback(null);
    };

    const gameWon = solvedCategories.length === currentPuzzle.categories.length;
    const gameLost = mistakesRemaining <= 0;

    return (
      <div className="space-y-4">
        <div className="flex gap-1.5 pb-2 overflow-x-auto no-scrollbar border-b border-zinc-100 dark:border-zinc-800/80">
          {CONNECTIONS_PUZZLES.map((p, idx) => {
            const isCompleted = completedList.includes(p.id);
            const isActive = currentPuzzleIndex === idx;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setCurrentPuzzleIndex(idx)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950'
                    : 'bg-zinc-100 dark:bg-zinc-800/70 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                }`}
              >
                <span>Set {idx + 1}</span>
                {isCompleted && <Check className="w-3 h-3 text-emerald-500 stroke-[2.75]" />}
              </button>
            );
          })}
        </div>

        <div>
          <h4 className="font-semibold text-sm text-zinc-950 dark:text-white">
            {currentPuzzle.name}
          </h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Group the terms into four connected categories of four.
          </p>
        </div>

        {/* Solved groups */}
        {solvedCategories.length > 0 && (
          <div className="space-y-2">
            {solvedCategories.map((category) => (
              <motion.div
                key={category.title}
                initial={{ scale: 0.97, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.16 }}
                className={`w-full py-2.5 px-3 rounded-xl border ${category.color} ${category.bgColor} flex flex-col items-center justify-center text-center`}
              >
                <span className={`text-[11px] font-bold tracking-wider uppercase ${category.textColor}`}>
                  {category.title}
                </span>
                <span className="text-xs font-semibold text-zinc-900 dark:text-white mt-0.5">
                  {category.words.join(' · ')}
                </span>
              </motion.div>
            ))}
          </div>
        )}

        {/* Word Grid */}
        {!gameWon && !gameLost && (
          <motion.div
            animate={shake ? { x: [-5, 5, -5, 5, -3, 3, 0] } : {}}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-2 gap-2"
          >
            {activeWords.map((word) => {
              const isSelected = selectedWords.includes(word);
              return (
                <button
                  key={word}
                  type="button"
                  onClick={() => handleWordClick(word)}
                  className={`py-3 px-2 rounded-xl border font-semibold text-xs tracking-tight transition-colors text-center flex items-center justify-center cursor-pointer min-h-[44px] select-none ${
                    isSelected
                      ? 'bg-zinc-950 border-zinc-950 text-white dark:bg-amber-400 dark:border-amber-400 dark:text-zinc-950'
                      : 'bg-zinc-50 dark:bg-zinc-900/60 border-zinc-200/80 dark:border-zinc-800 text-zinc-800 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  {word}
                </button>
              );
            })}
          </motion.div>
        )}

        {feedback && (
          <div
            className={`p-2.5 rounded-xl text-xs font-medium border flex items-center gap-2 ${
              feedback.isError
                ? 'bg-rose-500/10 border-rose-500/25 text-rose-700 dark:text-rose-300'
                : 'bg-emerald-500/10 border-emerald-500/25 text-emerald-700 dark:text-emerald-300'
            }`}
          >
            {feedback.isError ? (
              <AlertCircle className="w-4 h-4 shrink-0" />
            ) : (
              <Check className="w-4 h-4 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-zinc-500 dark:text-zinc-400">Mistakes left</span>
            <span className="text-xs font-mono tabular-nums font-semibold text-zinc-700 dark:text-zinc-300">
              {mistakesRemaining}/4
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              disabled={completedList.includes(currentPuzzle.id)}
              className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white text-xs font-semibold disabled:opacity-40 cursor-pointer"
            >
              Reset
            </button>

            {!gameWon && !gameLost && (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={selectedWords.length !== 4}
                className="py-1.5 px-4 bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-white font-semibold text-xs rounded-lg disabled:opacity-40 transition-colors cursor-pointer"
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
);

// ==========================================
// 5. TANGO SUB-GAME COMPONENT
// ==========================================

const TangoGame = memo(
  ({ completedList, onSolve }: { completedList: number[]; onSolve: (id: number) => void }) => {
    const [puzzleIndex, setPuzzleIndex] = useState(0);
    const puzzle = TANGO_PUZZLES[puzzleIndex];

    const [grid, setGrid] = useState<('S' | 'M' | null)[][]>(() =>
      Array(4)
        .fill(null)
        .map(() => Array(4).fill(null))
    );
    const [isSolved, setIsSolved] = useState(false);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [errorStatus, setErrorStatus] = useState<string | null>(null);
    const [showRules, setShowRules] = useState(false);

    const givensMap = useMemo(() => {
      const map = new Map<string, 'S' | 'M'>();
      puzzle.givens.forEach(([r, c, s]) => map.set(`${r},${c}`, s));
      return map;
    }, [puzzle.givens]);

    useEffect(() => {
      const isCompleted = completedList.includes(puzzle.id);
      if (isCompleted) {
        setGrid(puzzle.solution.map((row) => [...row]));
        setIsSolved(true);
        setFeedback('Solved. Every row, column, and constraint is balanced.');
        setErrorStatus(null);
      } else {
        const initialGrid: ('S' | 'M' | null)[][] = Array(4)
          .fill(null)
          .map(() => Array(4).fill(null));
        puzzle.givens.forEach(([r, c, s]) => {
          initialGrid[r][c] = s;
        });
        setGrid(initialGrid);
        setIsSolved(false);
        setFeedback(null);
        setErrorStatus(null);
      }
    }, [puzzleIndex, completedList, puzzle.id, puzzle.givens, puzzle.solution]);

    const handleCellClick = (r: number, c: number) => {
      if (isSolved || givensMap.has(`${r},${c}`)) return;

      setGrid((prev) => {
        const next = prev.map((row) => [...row]);
        const current = next[r][c];
        if (current === null) next[r][c] = 'S';
        else if (current === 'S') next[r][c] = 'M';
        else next[r][c] = null;
        return next;
      });
      setFeedback(null);
      setErrorStatus(null);
    };

    const handleVerify = () => {
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          if (!grid[r][c]) {
            setErrorStatus('Fill every cell with a Sun or Moon before verifying.');
            return;
          }
        }
      }

      for (let r = 0; r < 4; r++) {
        for (let c = 0; c <= 1; c++) {
          if (grid[r][c] && grid[r][c] === grid[r][c + 1] && grid[r][c] === grid[r][c + 2]) {
            setErrorStatus(`Row ${r + 1} has 3 matching symbols in a row.`);
            return;
          }
        }
      }

      for (let c = 0; c < 4; c++) {
        for (let r = 0; r <= 1; r++) {
          if (grid[r][c] && grid[r][c] === grid[r + 1][c] && grid[r][c] === grid[r + 2][c]) {
            setErrorStatus(`Column ${c + 1} has 3 matching symbols in a row.`);
            return;
          }
        }
      }

      for (let r = 0; r < 4; r++) {
        const suns = grid[r].filter((v) => v === 'S').length;
        const moons = grid[r].filter((v) => v === 'M').length;
        if (suns !== 2 || moons !== 2) {
          setErrorStatus(`Row ${r + 1} needs 2 Suns and 2 Moons.`);
          return;
        }
      }

      for (let c = 0; c < 4; c++) {
        let suns = 0;
        let moons = 0;
        for (let r = 0; r < 4; r++) {
          if (grid[r][c] === 'S') suns++;
          if (grid[r][c] === 'M') moons++;
        }
        if (suns !== 2 || moons !== 2) {
          setErrorStatus(`Column ${c + 1} needs 2 Suns and 2 Moons.`);
          return;
        }
      }

      for (const [r1, c1, r2, c2] of puzzle.equalPairs) {
        if (grid[r1][c1] !== grid[r2][c2]) {
          setErrorStatus('Cells linked by = must hold the same symbol.');
          return;
        }
      }

      for (const [r1, c1, r2, c2] of puzzle.oppositePairs) {
        if (grid[r1][c1] === grid[r2][c2]) {
          setErrorStatus('Cells linked by × must hold opposite symbols.');
          return;
        }
      }

      setIsSolved(true);
      setFeedback('Solved. Every row, column, and constraint is balanced.');
      setErrorStatus(null);
      onSolve(puzzle.id);
    };

    const handleReset = () => {
      const initialGrid: ('S' | 'M' | null)[][] = Array(4)
        .fill(null)
        .map(() => Array(4).fill(null));
      puzzle.givens.forEach(([r, c, s]) => {
        initialGrid[r][c] = s;
      });
      setGrid(initialGrid);
      setIsSolved(false);
      setFeedback(null);
      setErrorStatus(null);
    };

    const getRelation = (r1: number, c1: number, r2: number, c2: number) => {
      const isEqual = puzzle.equalPairs.some(
        ([ar1, ac1, ar2, ac2]) =>
          (ar1 === r1 && ac1 === c1 && ar2 === r2 && ac2 === c2) ||
          (ar1 === r2 && ac1 === c2 && ar2 === r1 && ac2 === c1)
      );
      if (isEqual) return '=';

      const isOpposite = puzzle.oppositePairs.some(
        ([ar1, ac1, ar2, ac2]) =>
          (ar1 === r1 && ac1 === c1 && ar2 === r2 && ac2 === c2) ||
          (ar1 === r2 && ac1 === c2 && ar2 === r1 && ac2 === c1)
      );
      if (isOpposite) return '×';

      return null;
    };

    return (
      <div className="space-y-4">
        <div className="flex gap-1.5 pb-2 overflow-x-auto no-scrollbar border-b border-zinc-100 dark:border-zinc-800/80">
          {TANGO_PUZZLES.map((p, idx) => {
            const isCompleted = completedList.includes(p.id);
            const isActive = puzzleIndex === idx;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setPuzzleIndex(idx)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950'
                    : 'bg-zinc-100 dark:bg-zinc-800/70 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                }`}
              >
                <span>{p.name}</span>
                {isCompleted && <Check className="w-3 h-3 text-emerald-500 stroke-[2.75]" />}
              </button>
            );
          })}
        </div>

        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="font-semibold text-sm text-zinc-950 dark:text-white">{puzzle.name}</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Balance each row and column with 2 Suns and 2 Moons.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowRules((prev) => !prev)}
            className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white text-xs font-semibold flex items-center gap-1 cursor-pointer shrink-0"
          >
            <Info className="w-3.5 h-3.5" />
            <span>{showRules ? 'Hide Rules' : 'Rules'}</span>
          </button>
        </div>

        {showRules && (
          <div className="bg-zinc-50 dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800 rounded-xl p-3 text-xs text-zinc-600 dark:text-zinc-300 space-y-1">
            <p className="font-semibold text-zinc-900 dark:text-white">How to play</p>
            <ul className="list-disc list-inside space-y-0.5 text-xs">
              <li>Fill each cell with a Sun or a Moon.</li>
              <li>No 3 identical symbols adjacent in any row or column.</li>
              <li>Each row and column must have 2 Suns and 2 Moons.</li>
              <li>= means matching neighbors; × means opposite neighbors.</li>
            </ul>
          </div>
        )}

        {/* 4x4 Tango Board */}
        <div className="flex flex-col items-center justify-center p-3 bg-zinc-50 dark:bg-zinc-900/60 rounded-2xl border border-zinc-200/70 dark:border-zinc-800">
          <div className="relative inline-block">
            {Array.from({ length: 4 }).map((_, r) => (
              <div key={r} className="flex flex-col">
                <div className="flex items-center">
                  {Array.from({ length: 4 }).map((_, c) => {
                    const val = grid[r][c];
                    const isGiven = givensMap.has(`${r},${c}`);
                    const hRel = c < 3 ? getRelation(r, c, r, c + 1) : null;

                    return (
                      <React.Fragment key={c}>
                        <button
                          type="button"
                          onClick={() => handleCellClick(r, c)}
                          disabled={isGiven || isSolved}
                          aria-label={`Row ${r + 1} Column ${c + 1}`}
                          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl border flex items-center justify-center transition-colors relative select-none ${
                            isGiven ? 'cursor-default' : 'cursor-pointer active:scale-95'
                          } ${
                            val === 'S'
                              ? 'bg-amber-500/15 dark:bg-amber-500/20 border-amber-500/50'
                              : val === 'M'
                              ? 'bg-sky-500/15 dark:bg-sky-500/20 border-sky-500/50'
                              : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500'
                          }`}
                        >
                          {val === 'S' && <Sun className="w-5 h-5 text-amber-500 dark:text-amber-400" />}
                          {val === 'M' && <Moon className="w-5 h-5 text-sky-600 dark:text-sky-300" />}
                          {isGiven && (
                            <span className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-zinc-400/70 dark:bg-white/40" />
                          )}
                        </button>

                        {c < 3 && (
                          <div className="w-5 flex items-center justify-center">
                            {hRel === '=' && (
                              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                =
                              </span>
                            )}
                            {hRel === '×' && (
                              <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">
                                ×
                              </span>
                            )}
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>

                {r < 3 && (
                  <div className="flex items-center h-5">
                    {Array.from({ length: 4 }).map((_, c) => {
                      const vRel = getRelation(r, c, r + 1, c);
                      return (
                        <React.Fragment key={c}>
                          <div className="w-11 sm:w-12 flex items-center justify-center">
                            {vRel === '=' && (
                              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                =
                              </span>
                            )}
                            {vRel === '×' && (
                              <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">
                                ×
                              </span>
                            )}
                          </div>
                          {c < 3 && <div className="w-5" />}
                        </React.Fragment>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {feedback && (
          <div className="p-3 rounded-xl text-xs font-medium border flex items-center gap-2 bg-emerald-500/10 border-emerald-500/25 text-emerald-700 dark:text-emerald-300">
            <Check className="w-4 h-4 shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        {errorStatus && (
          <div className="p-3 rounded-xl text-xs font-medium border flex items-center gap-2 bg-rose-500/10 border-rose-500/25 text-rose-700 dark:text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorStatus}</span>
          </div>
        )}

        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
          <span className="text-xs text-zinc-500 dark:text-zinc-400 inline-flex items-center gap-1.5">
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span>/</span>
            <Moon className="w-3.5 h-3.5 text-sky-500" />
            <span>Tap cell to cycle</span>
          </span>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              disabled={completedList.includes(puzzle.id)}
              className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white text-xs font-semibold disabled:opacity-40 cursor-pointer"
            >
              Reset
            </button>

            {!isSolved && (
              <button
                type="button"
                onClick={handleVerify}
                className="py-1.5 px-4 bg-zinc-950 dark:bg-zinc-100 text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-white font-semibold text-xs rounded-lg cursor-pointer transition-colors"
              >
                Verify
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
);

// ==========================================
// 6. WORDLE SUB-GAME COMPONENT
// ==========================================

const WordleGame = memo(
  ({ completedList, onSolve }: { completedList: number[]; onSolve: (id: number) => void }) => {
    const [puzzleIndex, setPuzzleIndex] = useState(0);
    const puzzle = WORDLE_PUZZLES[puzzleIndex];

    const [savedAttempts, setSavedAttempts] = useState<Record<number, string[]>>(() => {
      try {
        const stored = localStorage.getItem('connectup_wordle_saved_attempts');
        return stored ? JSON.parse(stored) : {};
      } catch {
        return {};
      }
    });

    const [guesses, setGuesses] = useState<string[]>([]);
    const [currentGuess, setCurrentGuess] = useState('');
    const [isWon, setIsWon] = useState(false);
    const [isLost, setIsLost] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [shakeRow, setShakeRow] = useState(false);

    useEffect(() => {
      const attempts = savedAttempts[puzzle.id];
      if (attempts && attempts.length > 0) {
        setGuesses(attempts);
        const won = attempts.includes(puzzle.word);
        const lost = attempts.length >= 6 && !won;
        setIsWon(won);
        setIsLost(lost);
        setCurrentGuess('');
        if (won) {
          setFeedback(
            `Solved in ${attempts.length} ${attempts.length === 1 ? 'guess' : 'guesses'}.`
          );
        } else if (lost) {
          setFeedback(`Out of tries. Word was "${puzzle.word}".`);
        } else {
          setFeedback(null);
        }
      } else if (completedList.includes(puzzle.id)) {
        setGuesses([puzzle.word]);
        setCurrentGuess('');
        setIsWon(true);
        setIsLost(false);
        setFeedback(`Solved: "${puzzle.word}".`);
      } else {
        setGuesses([]);
        setCurrentGuess('');
        setIsWon(false);
        setIsLost(false);
        setShowHint(false);
        setFeedback(null);
      }
    }, [puzzleIndex, puzzle.id, puzzle.word, completedList, savedAttempts]);

    const evaluateGuess = useCallback((guess: string, target: string) => {
      const res: ('correct' | 'present' | 'absent')[] = Array(5).fill('absent');
      const targetArr = target.split('');
      const guessArr = guess.split('');
      const letterPool: Record<string, number> = {};

      for (let i = 0; i < 5; i++) {
        if (guessArr[i] === targetArr[i]) {
          res[i] = 'correct';
          targetArr[i] = '#';
        }
      }

      for (let i = 0; i < 5; i++) {
        if (targetArr[i] !== '#') {
          letterPool[targetArr[i]] = (letterPool[targetArr[i]] || 0) + 1;
        }
      }

      for (let i = 0; i < 5; i++) {
        if (res[i] !== 'correct') {
          const char = guessArr[i];
          if (letterPool[char] && letterPool[char] > 0) {
            res[i] = 'present';
            letterPool[char]--;
          }
        }
      }

      return res;
    }, []);

    const keyStatuses = useMemo(() => {
      const map: Record<string, 'correct' | 'present' | 'absent'> = {};

      guesses.forEach((g) => {
        const evaluation = evaluateGuess(g, puzzle.word);
        g.split('').forEach((char, idx) => {
          const status = evaluation[idx];
          const prev = map[char];
          if (prev === 'correct') return;
          if (status === 'correct') {
            map[char] = 'correct';
          } else if (status === 'present') {
            map[char] = 'present';
          } else if (!prev) {
            map[char] = 'absent';
          }
        });
      });

      return map;
    }, [guesses, puzzle.word, evaluateGuess]);

    const handleCharInput = useCallback(
      (char: string) => {
        if (isWon || isLost) return;
        setFeedback(null);
        setCurrentGuess((prev) => (prev.length < 5 ? prev + char.toUpperCase() : prev));
      },
      [isWon, isLost]
    );

    const handleBackspace = useCallback(() => {
      if (isWon || isLost) return;
      setFeedback(null);
      setCurrentGuess((prev) => prev.slice(0, -1));
    }, [isWon, isLost]);

    const handleSubmit = useCallback(() => {
      if (isWon || isLost) return;
      if (currentGuess.length !== 5) {
        setFeedback('Enter a 5-letter word.');
        setShakeRow(true);
        setTimeout(() => setShakeRow(false), 450);
        return;
      }

      const nextGuesses = [...guesses, currentGuess];
      setGuesses(nextGuesses);

      const updatedMap = { ...savedAttempts, [puzzle.id]: nextGuesses };
      setSavedAttempts(updatedMap);
      try {
        localStorage.setItem('connectup_wordle_saved_attempts', JSON.stringify(updatedMap));
      } catch {
        // ignore
      }

      if (currentGuess === puzzle.word) {
        setIsWon(true);
        setFeedback(
          `Solved "${puzzle.word}" in ${nextGuesses.length} ${
            nextGuesses.length === 1 ? 'try' : 'tries'
          }.`
        );
        onSolve(puzzle.id);
      } else if (nextGuesses.length >= 6) {
        setIsLost(true);
        setFeedback(`Out of tries. Word was "${puzzle.word}".`);
      } else {
        setFeedback(null);
      }

      setCurrentGuess('');
    }, [currentGuess, guesses, isWon, isLost, onSolve, puzzle.id, puzzle.word, savedAttempts]);

    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        const target = e.target as HTMLElement | null;
        if (
          target &&
          (target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.isContentEditable)
        ) {
          return;
        }
        if (e.ctrlKey || e.metaKey || e.altKey) return;

        if (e.key === 'Enter') {
          e.preventDefault();
          handleSubmit();
        } else if (e.key === 'Backspace' || e.key === 'Delete') {
          e.preventDefault();
          handleBackspace();
        } else if (/^[a-zA-Z]$/.test(e.key)) {
          e.preventDefault();
          handleCharInput(e.key);
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleCharInput, handleBackspace, handleSubmit]);

    const handleReset = () => {
      setGuesses([]);
      setCurrentGuess('');
      setIsWon(false);
      setIsLost(false);
      setShowHint(false);
      setFeedback(null);

      const updated = { ...savedAttempts };
      delete updated[puzzle.id];
      setSavedAttempts(updated);
      try {
        localStorage.setItem('connectup_wordle_saved_attempts', JSON.stringify(updated));
      } catch {
        // ignore
      }
    };

    const handleNextWord = () => {
      if (puzzleIndex < WORDLE_PUZZLES.length - 1) {
        setPuzzleIndex((prev) => prev + 1);
      }
    };

    const KEYBOARD_ROWS = [
      ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
      ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
      ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'],
    ];

    return (
      <div className="space-y-4">
        <div className="flex gap-1.5 pb-2 overflow-x-auto no-scrollbar border-b border-zinc-100 dark:border-zinc-800/80">
          {WORDLE_PUZZLES.map((p, idx) => {
            const isCompleted = completedList.includes(p.id);
            const isActive = puzzleIndex === idx;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setPuzzleIndex(idx)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950'
                    : 'bg-zinc-100 dark:bg-zinc-800/70 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                }`}
              >
                <span>Word {idx + 1}</span>
                {isCompleted && <Check className="w-3 h-3 text-emerald-500 stroke-[2.75]" />}
              </button>
            );
          })}
        </div>

        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="font-semibold text-sm text-zinc-950 dark:text-white">
              Venture Wordle #{puzzle.id}
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              {puzzle.category} · 5 letters, 6 tries
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowHint((prev) => !prev)}
            className="text-emerald-600 dark:text-emerald-400 hover:underline text-xs font-semibold flex items-center gap-1 cursor-pointer shrink-0"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>{showHint ? 'Hide Clue' : 'Hint'}</span>
          </button>
        </div>

        {showHint && (
          <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-xl p-3 text-xs text-emerald-800 dark:text-emerald-200 flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Clue: </span>
              <span>{puzzle.hint}</span>
            </div>
          </div>
        )}

        {/* 6x5 Letter Grid */}
        <div className="flex flex-col items-center gap-1.5 py-1">
          {Array.from({ length: 6 }).map((_, rowIdx) => {
            const isSubmitted = rowIdx < guesses.length;
            const isCurrent = rowIdx === guesses.length && !isWon && !isLost;
            const submittedWord = isSubmitted ? guesses[rowIdx] : '';
            const evaluation = isSubmitted ? evaluateGuess(submittedWord, puzzle.word) : [];

            return (
              <div
                key={rowIdx}
                className={`flex gap-1.5 transition-transform ${
                  isCurrent && shakeRow ? 'translate-x-1' : ''
                }`}
              >
                {Array.from({ length: 5 }).map((_, colIdx) => {
                  let char = '';
                  let status: 'correct' | 'present' | 'absent' | 'typing' | 'empty' = 'empty';

                  if (isSubmitted) {
                    char = submittedWord[colIdx];
                    status = evaluation[colIdx];
                  } else if (isCurrent) {
                    char = currentGuess[colIdx] || '';
                    status = char ? 'typing' : 'empty';
                  }

                  return (
                    <div
                      key={colIdx}
                      className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl border flex items-center justify-center font-mono font-bold text-base uppercase transition-colors select-none ${
                        status === 'correct'
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : status === 'present'
                          ? 'bg-amber-500 border-amber-500 text-zinc-950'
                          : status === 'absent'
                          ? 'bg-zinc-200 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400'
                          : status === 'typing'
                          ? 'bg-white dark:bg-zinc-900 border-zinc-900 dark:border-zinc-200 text-zinc-950 dark:text-white'
                          : 'bg-zinc-50 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800 text-transparent'
                      }`}
                    >
                      {char}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {feedback && (
          <div
            className={`p-2.5 rounded-xl text-xs font-medium border flex items-center justify-between gap-2 ${
              isLost
                ? 'bg-rose-500/10 border-rose-500/25 text-rose-700 dark:text-rose-300'
                : isWon
                ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-700 dark:text-emerald-300'
                : 'bg-amber-500/10 border-amber-500/25 text-amber-800 dark:text-amber-300'
            }`}
          >
            <div className="flex items-center gap-1.5">
              {isLost ? (
                <AlertCircle className="w-4 h-4 shrink-0" />
              ) : (
                <Check className="w-4 h-4 shrink-0" />
              )}
              <span>{feedback}</span>
            </div>

            {(isWon || isLost) && puzzleIndex < WORDLE_PUZZLES.length - 1 && (
              <button
                type="button"
                onClick={handleNextWord}
                className="py-1 px-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg flex items-center gap-1 cursor-pointer transition-colors shrink-0"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* On-screen Keyboard */}
        <div className="flex flex-col items-center gap-1 pt-1 touch-manipulation">
          {KEYBOARD_ROWS.map((row, rIdx) => (
            <div key={rIdx} className="flex gap-1 justify-center w-full max-w-sm">
              {row.map((key) => {
                const status = keyStatuses[key];
                const isEnter = key === 'ENTER';
                const isBackspace = key === 'BACKSPACE';

                let keyStyle =
                  'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700';
                if (status === 'correct') {
                  keyStyle = 'bg-emerald-600 border-emerald-600 text-white';
                } else if (status === 'present') {
                  keyStyle = 'bg-amber-500 border-amber-500 text-zinc-950';
                } else if (status === 'absent') {
                  keyStyle =
                    'bg-zinc-200/70 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-600';
                }

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      if (isEnter) handleSubmit();
                      else if (isBackspace) handleBackspace();
                      else handleCharInput(key);
                    }}
                    className={`h-9 rounded-lg border text-[11px] font-semibold transition-colors cursor-pointer select-none active:scale-95 flex items-center justify-center ${
                      isEnter
                        ? 'px-2.5 bg-zinc-950 dark:bg-zinc-200 text-white dark:text-zinc-950 border-zinc-950 dark:border-zinc-200'
                        : isBackspace
                        ? 'px-2.5'
                        : 'flex-1 max-w-[34px]'
                    } ${isEnter ? '' : keyStyle}`}
                  >
                    {isBackspace ? <Delete className="w-4 h-4" /> : key}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs">
          <span className="text-zinc-500 dark:text-zinc-400">Type or tap letters</span>
          <button
            type="button"
            onClick={handleReset}
            className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white font-semibold cursor-pointer"
          >
            {isWon || isLost ? 'Play Again' : 'Reset Word'}
          </button>
        </div>
      </div>
    );
  }
);
