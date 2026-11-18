import React, { useState, useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Share2,
  Check,
  BookOpen,
  Search,
  Clock,
  ChevronRight,
  Award,
} from 'lucide-react';
import { LandingNavbar } from './LandingNavbar';
import FooterSection5 from './ui/footer-section-5';

import blogHeroFounders from '@/src/assets/images/blog_hero_founders_1794780560973.jpg';
import blogSeedFundraising from '@/src/assets/images/blog_seed_fundraising_1794780560365.jpg';
import blogAngelPitch from '@/src/assets/images/blog_angel_pitch_1794780561658.jpg';
import blogTermSheet from '@/src/assets/images/blog_term_sheet_1794780561194.jpg';
import blogPitchStory from '@/src/assets/images/blog_pitch_story_1794780562622.jpg';
import blogInvestorReview from '@/src/assets/images/blog_investor_review_1794780562560.jpg';
import blogGlobalFounders from '@/src/assets/images/blog_global_founders_1794780561935.jpg';

export interface BlogPost {
  id: number | string;
  company: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  badge: string;
  author: string;
  authorRole: string;
  authorAvatar?: string;
  date: string;
  readTime: string;
  image: string;
  featured?: boolean;
  takeaways?: string[];
  views?: string;
}

export const ConnectUpLogoIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={`${className} select-none shrink-0`} aria-hidden="true">
    <defs>
      <radialGradient id="culogo-left" cx="32%" cy="32%" r="68%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="65%" stopColor="#E4E4E7" />
        <stop offset="100%" stopColor="#A1A1AA" />
      </radialGradient>
      <radialGradient id="culogo-right" cx="32%" cy="32%" r="68%">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="55%" stopColor="#EAB308" />
        <stop offset="100%" stopColor="#854D0E" />
      </radialGradient>
      <linearGradient id="culogo-conn" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#E4E4E7" />
        <stop offset="25%" stopColor="#FFFFFF" />
        <stop offset="70%" stopColor="#FDE047" />
        <stop offset="100%" stopColor="#EAB308" />
      </linearGradient>
    </defs>
    <path d="M 60 140 Q 100 60 140 60" fill="none" stroke="url(#culogo-conn)" strokeWidth="18" strokeLinecap="round" />
    <circle cx="60" cy="140" r="36" fill="url(#culogo-left)" />
    <circle cx="140" cy="60" r="36" fill="url(#culogo-right)" />
  </svg>
);

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    company: 'FOUNDER PLAYBOOK',
    title: 'How First-Time Founders Close Seed Rounds Without Warm Intros',
    excerpt: 'Why verified traction profiles and thesis-based matching are replacing months of cold emails for early-stage teams.',
    takeaways: [
      'Lead with real customer traction, retention cohorts, and clear unit economics from slide one.',
      'Target investors whose active stage, sector focus, and check size match your exact round.',
      'Replace scattered email attachments with a single structured pitch and diligence room.'
    ],
    content: `
      <h2>Breaking Out of the Warm-Intro Bottleneck</h2>
      <p>For decades, raising an early-stage round depended almost entirely on who you already knew. Talented builders outside legacy networks spent months chasing cold introductions instead of shipping product for customers.</p>
      <p>On ConnectUp, founders bypass the gatekeeping by presenting verified metrics, crisp product demos, and clear round terms directly to investors actively looking in their space.</p>
      <blockquote>"When founders can demonstrate real customer pull and clarity of thought upfront, geography and personal networks stop being barriers."</blockquote>
      <h3>Three Steps to Faster Seed Momentum</h3>
      <ul>
        <li><strong>Sharpen Your Thesis Fit:</strong> Filter for angels and funds writing checks at your exact stage and ticket size.</li>
        <li><strong>Show Proof Before Polish:</strong> Real revenue growth, active users, and retention beat 40 slides of market theory.</li>
        <li><strong>Keep Updates Consistent:</strong> Monthly momentum snapshots turn cautious observers into committed backers.</li>
      </ul>
      <p>Raising capital should be a focused sprint, not a year-long distraction from building your company.</p>
    `,
    category: 'Fundraising',
    badge: 'FUNDRAISING',
    author: 'Sarah Chen',
    authorRole: 'Head of Founder Community',
    date: 'Oct 22, 2026',
    readTime: '4 min read',
    image: blogSeedFundraising,
    featured: true,
    views: '14.2k',
  },
  {
    id: 2,
    company: 'INVESTOR LENS',
    title: 'What Active Angel Investors Look For in a 3-Minute Product Pitch',
    excerpt: 'Experienced angels share the exact signals—problem urgency, founder speed, and customer love—that earn a second meeting.',
    takeaways: [
      'Explain who experiences the pain daily and why existing workarounds fail within the first 45 seconds.',
      'Demonstrate live product velocity rather than static mockups whenever possible.',
      'Be candid about early bottlenecks and the specific milestones your next round unlocks.'
    ],
    content: `
      <h2>Signal Over Theatrics in Early Pitches</h2>
      <p>Active angel investors review dozens of startups every week. The founders who stand out rarely have the flashiest animations—they have unmistakable clarity about the customer problem they solve.</p>
      <p>In a concise three-minute pitch, investors listen for how deeply you understand your users, how quickly your team ships, and why you are uniquely suited to win this market.</p>
      <blockquote>"We back founders who know their customers so well they can answer tough questions in plain language without hiding behind buzzwords."</blockquote>
      <h3>What Sparks Immediate Conviction</h3>
      <ul>
        <li><strong>Urgent Customer Pain:</strong> Evidence that users would be genuinely upset if your product disappeared tomorrow.</li>
        <li><strong>Founder-Market Fit:</strong> Lived insight into the workflow or industry you are rebuilding.</li>
        <li><strong>Capital Clarity:</strong> A concrete plan showing how every dollar raised extends runway and proves the next milestone.</li>
      </ul>
      <p>A crisp pitch respects an investor’s time and turns introductory calls into productive working sessions.</p>
    `,
    category: 'Pitching',
    badge: 'PITCHING',
    author: 'Marcus Vance',
    authorRole: 'Angel Investor & Advisor',
    date: 'Oct 14, 2026',
    readTime: '6 min read',
    image: blogAngelPitch,
    featured: true,
    views: '22.8k',
  },
  {
    id: 3,
    company: 'MATCHING ENGINE',
    title: 'From First Swipe to Signed Term Sheet: Building Trust Between Founders and Backers',
    excerpt: 'How structured discovery, transparent founder profiles, and aligned expectations accelerate early-stage partnerships.',
    takeaways: [
      'Mutual opt-in matching ensures every conversation starts with genuine interest on both sides.',
      'Clear check-size and stage visibility eliminates mismatched meetings before they reach your calendar.',
      'Shared diligence workspaces keep founders and investors aligned from first chat to close.'
    ],
    content: `
      <h2>Why Mutual Alignment Changes Every Conversation</h2>
      <p>Traditional fundraising often feels adversarial because both sides spend hours in low-probability meetings. Founders pitch investors who stopped investing in their sector a year ago, while investors wade through irrelevant cold decks.</p>
      <p>Structured matching changes the dynamic. When both founder and investor opt in based on verified stage, sector, and round goals, the very first call starts from mutual respect.</p>
      <blockquote>"The best founder-investor relationships begin with transparency—knowing what each side brings to the table before the first handshake."</blockquote>
      <h3>Making Every Match Count</h3>
      <ul>
        <li><strong>Aligned Check Sizes:</strong> Match lead investors and strategic angels to the exact allocation you need.</li>
        <li><strong>Transparent Timelines:</strong> Signal when your round opens, target close dates, and key milestones.</li>
        <li><strong>Direct Messaging:</strong> Move seamlessly from profile discovery to scheduled calls and document sharing.</li>
      </ul>
      <p>When friction drops out of matching, founders get back to building and investors back stronger companies.</p>
    `,
    category: 'Matching',
    badge: 'MATCHING',
    author: 'Elena Rostova',
    authorRole: 'Product Lead, Founder Experience',
    date: 'Sep 29, 2026',
    readTime: '5 min read',
    image: blogTermSheet,
    views: '18.5k',
  },
  {
    id: 4,
    company: 'FOUNDER STORIES',
    title: 'Why Clarity in Storytelling Beats Overstuffed 30-Slide Pitch Decks',
    excerpt: 'Founders who raised oversubscribed pre-seed rounds explain how trimming their narrative doubled investor reply rates.',
    takeaways: [
      'Keep your core narrative to 10–12 sharp slides where every headline tells the story on its own.',
      'Put your strongest traction metric or customer quote in the opening third of the deck.',
      'Use an appendix for detailed financial projections and technical architecture.'
    ],
    content: `
      <h2>Editing Your Story Until Only Signal Remains</h2>
      <p>Most early-stage pitch decks fail not because the startup lacks potential, but because the core insight gets buried under dense paragraphs and crowded charts.</p>
      <p>Founders who consistently earn investor follow-ups treat their deck like product design: every word earns its place, and the narrative flows effortlessly in under four minutes.</p>
      <blockquote>"If an investor remembers one crystal-clear sentence about why your startup wins, your deck did its job."</blockquote>
      <h3>Practical Ways to Tighten Your Deck</h3>
      <ul>
        <li><strong>One Idea Per Slide:</strong> Pair a bold takeaway headline with one supporting visual or metric.</li>
        <li><strong>Real Customer Language:</strong> Quote actual users instead of generic industry adjectives.</li>
        <li><strong>Crisp Ask Slide:</strong> State how much you are raising, what milestones it buys, and who is on the team.</li>
      </ul>
      <p>Clear storytelling doesn’t oversimplify your vision—it proves you understand what matters most.</p>
    `,
    category: 'Founder Stories',
    badge: 'PITCH CRAFT',
    author: 'Arthur Pendelton',
    authorRole: 'Founder & Two-Time Operator',
    date: 'Sep 18, 2026',
    readTime: '7 min read',
    image: blogPitchStory,
    views: '11.1k',
  },
  {
    id: 5,
    company: 'INVESTOR INSIGHTS',
    title: 'How Early-Stage Investors Evaluate Startup Traction Before Series A',
    excerpt: 'Beyond top-line revenue: the retention, payback, and customer engagement metrics investors examine in diligence.',
    takeaways: [
      'Cohort retention and repeat usage matter more than one-time launch spikes.',
      'Investors test how efficiently customer acquisition translates into durable gross margin.',
      'Clean, organized financial notes signal operational maturity far beyond company age.'
    ],
    content: `
      <h2>Reading Between the Lines of Early Traction</h2>
      <p>At pre-seed and seed, investors don’t expect perfect spreadsheets—they expect honesty and a clear grasp of what drives growth.</p>
      <p>Rather than chasing vanity totals, seasoned investors look closely at whether early customers stick around, refer others, and expand usage over time.</p>
      <blockquote>"Small numbers with steep retention curves beat big numbers built on unsustainable discounting every single time."</blockquote>
      <h3>Metrics Worth Highlighting Early</h3>
      <ul>
        <li><strong>Cohort Retention:</strong> Do users acquired three months ago still rely on your product weekly?</li>
        <li><strong>Sales Cycle Velocity:</strong> How fast does a qualified prospect turn into a paying customer?</li>
        <li><strong>Burn & Runway Discipline:</strong> How thoughtfully are you pacing spend relative to product milestones?</li>
      </ul>
      <p>Preparing clean metrics early builds immediate confidence when investors open your profile.</p>
    `,
    category: 'Investor Insights',
    badge: 'DILIGENCE',
    author: 'Claire Bennett',
    authorRole: 'Early-Stage Investor',
    date: 'Sep 04, 2026',
    readTime: '8 min read',
    image: blogInvestorReview,
    views: '9.4k',
  },
  {
    id: 6,
    company: 'GLOBAL COMMUNITY',
    title: 'Connecting Local Founders With Global Investors Beyond Traditional Tech Hubs',
    excerpt: 'How founders outside San Francisco and London are building international investor networks right from day one.',
    takeaways: [
      'Remote discovery tools let standout startups meet relevant angels regardless of time zone.',
      'Local market expertise paired with global investor backing creates resilient category leaders.',
      'Async video pitches help bridge geographic and scheduling gaps effortlessly.'
    ],
    content: `
      <h2>Great Builders Are Everywhere—Now Capital Meets Them There</h2>
      <p>Innovation has never belonged to just one zip code. Today, ambitious founders in Lagos, Nairobi, Toronto, Berlin, and Austin are solving massive real-world problems with lean teams.</p>
      <p>By giving founders a direct channel to showcase their traction and vision, ConnectUp helps international investors discover high-conviction startups long before they make headlines.</p>
      <blockquote>"When founders and investors can connect directly based on merit and shared ambition, geography becomes a strength instead of a ceiling."</blockquote>
      <h3>Tips for Cross-Border Fundraising</h3>
      <ul>
        <li><strong>Use Async Video Pitches:</strong> Let investors hear your energy and product story on their own schedule.</li>
        <li><strong>Highlight Market Context:</strong> Give international backers a clear snapshot of local unit economics and customer demand.</li>
        <li><strong>Build Relationships Early:</strong> Share progress updates months before formally opening your round.</li>
      </ul>
      <p>ConnectUp brings founders and investors into one shared room—wherever they are building from.</p>
    `,
    category: 'Fundraising',
    badge: 'COMMUNITY',
    author: 'David Okafor',
    authorRole: 'Ecosystem Partnerships',
    date: 'Aug 26, 2026',
    readTime: '5 min read',
    image: blogGlobalFounders,
    views: '12.6k',
  },
];

interface BlogPageProps {
  onNavigate?: (page: string) => void;
  onBackHome?: () => void;
  onLoginClick?: () => void;
  onNavigateToContact?: () => void;
  onNavigateToSection?: (page: 'about' | 'founders' | 'home' | 'why' | 'pricing' | 'blog' | 'contact') => void;
  onLegalView?: (view: 'privacy' | 'terms') => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({
  onNavigate,
  onBackHome,
  onLoginClick,
  onNavigateToContact,
  onNavigateToSection,
  onLegalView,
}) => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copiedLink, setCopiedLink] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  const feedSectionRef = useRef<HTMLElement>(null);

  const handleNav = (page: any) => {
    if (page === 'blog') {
      setSelectedPost(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (page === 'home' && onBackHome) {
      onBackHome();
      return;
    }
    if (page === 'contact' && onNavigateToContact) {
      onNavigateToContact();
      return;
    }
    if (onNavigateToSection) {
      onNavigateToSection(page);
      return;
    }
    if (onNavigate) {
      onNavigate(page);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedPost]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 36);
      if (!selectedPost) return;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setReadingProgress(progress);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [selectedPost]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    feedSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const categories = ['All', 'Fundraising', 'Pitching', 'Matching', 'Founder Stories', 'Investor Insights'];

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      post.title.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q) ||
      post.company.toLowerCase().includes(q) ||
      post.category.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col font-sans selection:bg-[#FFBF00] selection:text-black relative">
      {/* Reading Progress Bar */}
      {selectedPost && (
        <div
          className="fixed top-0 left-0 h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 z-[100] transition-all duration-100"
          style={{ width: `${readingProgress}%` }}
        />
      )}

      {/* Landing Navbar: white text over dark photographic hero, light mode on scroll or article view */}
      <LandingNavbar
        currentPage="blog"
        onNavigate={handleNav}
        onLoginClick={onLoginClick || (() => {})}
        isScrolled={isScrolled}
        lightMode={Boolean(selectedPost) || isScrolled}
      />

      <main className="flex-1 w-full">
        <AnimatePresence mode="wait">
          {selectedPost ? (
            /* =========================================================================
               ARTICLE READER VIEW
               ========================================================================= */
            <motion.article
              key={`reader-${selectedPost.id}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-24"
            >
              <div className="mb-8">
                <button
                  onClick={() => setSelectedPost(null)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-50 hover:bg-zinc-100 text-xs font-semibold text-zinc-800 transition-colors cursor-pointer border border-zinc-200 group whitespace-nowrap shrink-0"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-amber-600 group-hover:-translate-x-0.5 transition-transform" />
                  <span>Back to Journal</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Sidebar: Author & Share */}
                <div className="lg:col-span-3 space-y-8">
                  <div className="sticky top-28 space-y-6">
                    <div>
                      <p className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">Author</p>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-zinc-950 p-2 flex items-center justify-center shrink-0 border border-zinc-900/10">
                          {selectedPost.authorAvatar ? (
                            <img src={selectedPost.authorAvatar} alt={selectedPost.author} className="w-full h-full object-cover rounded-full" />
                          ) : (
                            <ConnectUpLogoIcon className="w-full h-full" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-zinc-950 text-sm">{selectedPost.author}</p>
                          <p className="text-xs text-zinc-500">{selectedPost.authorRole}</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-zinc-200">
                      <p className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">Read Time</p>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-800">
                        <Clock className="w-4 h-4 text-amber-600" />
                        <span>{selectedPost.readTime}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-zinc-200 space-y-3">
                      <p className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Share This Story</p>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={handleCopyLink}
                          className="w-full text-left px-3.5 py-2 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-xs font-semibold text-zinc-800 transition-colors flex items-center justify-between cursor-pointer"
                        >
                          <span>{copiedLink ? 'Link Copied' : 'Copy Link'}</span>
                          {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-zinc-400" />}
                        </button>
                        <a
                          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full text-left px-3.5 py-2 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-xs font-semibold text-zinc-800 transition-colors flex items-center justify-between cursor-pointer"
                        >
                          <span>LinkedIn</span>
                          <span className="text-[10px] text-zinc-400 font-mono">IN</span>
                        </a>
                        <a
                          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(selectedPost.title)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full text-left px-3.5 py-2 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-xs font-semibold text-zinc-800 transition-colors flex items-center justify-between cursor-pointer"
                        >
                          <span>X (Twitter)</span>
                          <span className="text-[10px] text-zinc-400 font-mono">X</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Content Area */}
                <div className="lg:col-span-9 space-y-8 bg-white p-6 sm:p-10 rounded-3xl border border-zinc-200">
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                      <span className="text-amber-700 font-bold uppercase tracking-wider">{selectedPost.category}</span>
                      <span className="text-zinc-300">·</span>
                      <span className="text-zinc-500">{selectedPost.date}</span>
                      <span className="text-zinc-300">·</span>
                      <span className="text-zinc-500">{selectedPost.readTime}</span>
                      {selectedPost.views && (
                        <>
                          <span className="text-zinc-300">·</span>
                          <span className="text-zinc-400 tabular-nums">{selectedPost.views} views</span>
                        </>
                      )}
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-zinc-950 tracking-tight leading-[1.12] [text-wrap:balance]">
                      {selectedPost.title}
                    </h1>

                    <p className="text-base sm:text-lg text-zinc-600 leading-relaxed">
                      {selectedPost.excerpt}
                    </p>
                  </div>

                  {/* Hero Cover Image */}
                  <div className="w-full h-[320px] sm:h-[440px] rounded-2xl overflow-hidden border border-zinc-200 relative">
                    <img
                      src={selectedPost.image}
                      alt={selectedPost.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-4 left-4 px-3 py-1 rounded-md bg-zinc-950/75 backdrop-blur-md text-white font-mono text-[11px] uppercase tracking-wider">
                      {selectedPost.company}
                    </div>
                  </div>

                  {/* Key Takeaways */}
                  {selectedPost.takeaways && selectedPost.takeaways.length > 0 && (
                    <div className="p-6 rounded-2xl bg-amber-50/60 border border-amber-200/70 space-y-3">
                      <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider font-mono">
                        <Award className="w-4 h-4 text-amber-600" />
                        <span>Key Takeaways</span>
                      </div>
                      <ul className="space-y-2 text-sm text-zinc-700">
                        {selectedPost.takeaways.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <span className="text-amber-600 font-bold mt-0.5">·</span>
                            <span className="leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Article HTML Content */}
                  <div
                    className="prose prose-zinc max-w-none text-zinc-800 space-y-6 leading-relaxed font-sans text-base sm:text-lg [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-zinc-950 [&>h2]:mt-8 [&>h2]:mb-4 [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-zinc-950 [&>h3]:mt-6 [&>h3]:mb-3 [&>blockquote]:p-5 [&>blockquote]:rounded-2xl [&>blockquote]:bg-zinc-50 [&>blockquote]:border [&>blockquote]:border-zinc-200 [&>blockquote]:italic [&>blockquote]:text-zinc-700 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-2"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedPost.content || '') }}
                  />

                  {/* Bottom Author Box */}
                  <div className="pt-8 border-t border-zinc-200 flex flex-col sm:flex-row items-center sm:items-start gap-5">
                    <div className="w-14 h-14 rounded-full bg-zinc-950 p-3 flex items-center justify-center shrink-0 border border-zinc-900/10">
                      <ConnectUpLogoIcon className="w-full h-full" />
                    </div>
                    <div className="text-center sm:text-left space-y-1">
                      <p className="font-bold text-zinc-950 text-base">{selectedPost.author}</p>
                      <p className="text-xs text-amber-700 font-semibold">{selectedPost.authorRole}</p>
                      <p className="text-xs text-zinc-600 leading-relaxed pt-1">
                        Sharing practical fundraising insights and founder-investor stories on ConnectUp.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>
          ) : (
            /* =========================================================================
               EDITORIAL BLOG FEED
               ========================================================================= */
            <div className="w-full">
              {/* 1. FULL-BLEED PHOTOGRAPHIC HERO BANNER */}
              <section className="relative w-full h-[460px] sm:h-[520px] flex flex-col justify-between overflow-hidden bg-zinc-950">
                <img
                  src={blogHeroFounders}
                  alt="Startup founder and investor in conversation"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover object-center opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-black/75" />

                <div className="h-20 sm:h-24 shrink-0" />

                {/* Hero Copy & Inline Search */}
                <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 my-auto">
                  <div className="max-w-2xl space-y-5">
                    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-medium text-white/80">
                      <button
                        type="button"
                        onClick={() => handleNav('home')}
                        className="hover:text-white transition-colors cursor-pointer"
                      >
                        Home
                      </button>
                      <ChevronRight className="w-3.5 h-3.5 text-white/60" />
                      <span className="text-white">Founders &amp; Investors</span>
                    </nav>

                    <h1 className="text-3xl sm:text-4xl md:text-[44px] font-semibold text-white tracking-tight leading-[1.14] [text-wrap:balance]">
                      Great Startups Deserve the Right Investors. Connect Faster.
                    </h1>

                    <form
                      onSubmit={handleHeroSearchSubmit}
                      className="flex items-center gap-2 max-w-md pt-1"
                    >
                      <div className="relative flex-1">
                        <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search articles..."
                          aria-label="Search blog articles"
                          className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white text-zinc-900 placeholder-zinc-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#FACC15] shadow-sm"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-full bg-[#FACC15] hover:bg-amber-400 text-zinc-950 font-semibold text-xs sm:text-sm transition-colors shadow-sm cursor-pointer whitespace-nowrap shrink-0"
                      >
                        Search
                      </button>
                    </form>
                  </div>
                </div>

                {/* Bottom Hero Corner Captions */}
                <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-5 flex items-center justify-between text-xs font-medium text-white/75">
                  <span>ConnectUp Journal</span>
                  <span>For Founders &amp; Investors</span>
                </div>
              </section>

              {/* 3. LATEST STORIES (3-COLUMN EDITORIAL PHOTO GRID + CATEGORY FILTER) */}
              <section
                ref={feedSectionRef}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20"
              >
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
                  <div>
                    <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-950">
                      Latest Stories
                    </h2>
                  </div>

                  <div className="flex flex-col sm:items-end gap-2 max-w-xs">
                    <BookOpen className="w-5 h-5 text-zinc-700" aria-hidden="true" />
                    <p className="text-xs text-zinc-500 sm:text-right leading-relaxed">
                      Showing {filteredPosts.length} of {BLOG_POSTS.length} articles for founders and investors.
                    </p>
                  </div>
                </div>

                {/* Clean Segmented Filter Row */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
                  <div className="flex flex-wrap items-center gap-1 p-1 bg-zinc-100 rounded-xl">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                          selectedCategory === cat
                            ? 'bg-white text-zinc-950 shadow-xs font-semibold'
                            : 'text-zinc-600 hover:text-zinc-950'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {(searchQuery || selectedCategory !== 'All') && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('All');
                      }}
                      className="text-xs font-semibold text-amber-700 hover:text-amber-800 cursor-pointer whitespace-nowrap shrink-0"
                    >
                      Clear filters
                    </button>
                  )}
                </div>

                {filteredPosts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                    {filteredPosts.map((post) => (
                      <article
                        key={post.id}
                        onClick={() => setSelectedPost(post)}
                        className="group cursor-pointer flex flex-col"
                      >
                        <div className="w-full aspect-square sm:aspect-[5/4] rounded-2xl overflow-hidden bg-zinc-100 mb-4">
                          <img
                            src={post.image}
                            alt={post.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </div>
                        <h3 className="text-base sm:text-lg font-semibold text-zinc-950 tracking-tight leading-snug group-hover:text-amber-700 transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <div className="mt-2.5 flex items-center gap-2 text-xs text-zinc-500">
                          <span>{post.date}</span>
                          <span aria-hidden="true">·</span>
                          <span>{post.category}</span>
                          <span aria-hidden="true">·</span>
                          <span>{post.readTime}</span>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 border border-dashed border-zinc-200 rounded-3xl bg-zinc-50/50">
                    <BookOpen className="w-10 h-10 text-zinc-400 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-zinc-950 mb-1.5">
                      No articles found
                    </h3>
                    <p className="text-sm text-zinc-500 mb-5 max-w-sm mx-auto">
                      We couldn&rsquo;t find any articles matching &ldquo;{searchQuery || selectedCategory}&rdquo;.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory('All');
                        setSearchQuery('');
                      }}
                      className="px-5 py-2.5 rounded-full bg-zinc-950 text-white font-semibold text-xs hover:bg-zinc-800 transition-colors cursor-pointer"
                    >
                      Reset Filters
                    </button>
                  </div>
                )}
              </section>
            </div>
          )}
        </AnimatePresence>
      </main>

      <FooterSection5 onNavigate={handleNav} onLegalView={onLegalView} />
    </div>
  );
};
