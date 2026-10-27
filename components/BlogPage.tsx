import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, ArrowRight, Share2, Check, Bookmark, BookOpen, 
  Search, Calendar, User, Clock, ChevronRight, Mail, Award, ThumbsUp, Zap, TrendingUp
} from 'lucide-react';
import { LandingNavbar } from './LandingNavbar';
import FooterSection5 from './ui/footer-section-5';

import investorsAndFounders from '@/src/assets/images/investors_and_founders_1_1785147760772.jpg';
import ventureTech from '@/src/assets/images/venture_connection_tech_1784549043938.jpg';
import smartMatching from '@/src/assets/images/smart_matching_investment_1784549068657.jpg';
import goldenGate from '@/src/assets/images/golden_gate_bridge_1785141940553.jpg';
import worldModelAi from '@/src/assets/images/world_model_ai_1785704586218.jpg';

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

export const ConnectUpLogoIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
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
    company: 'OMMAX x SINGULIER',
    title: 'OMMAX x Singulier join forces to create Europe’s leading AI management consulting platform',
    excerpt: 'A landmark transaction uniting 600+ AI practitioners to accelerate enterprise digital transformation across European markets.',
    takeaways: [
      'Unites over 600 specialized AI engineers and management consultants across London, Munich, Paris, and Zurich.',
      'Positions the joint entity as the primary digital execution partner for Tier-1 European private equity sponsors.',
      'Expands proprietary ML workflows that reduce enterprise deployment cycles from months to days.'
    ],
    content: `
      <h2>A Landmark European AI Consolidation</h2>
      <p>We are thrilled to announce that portfolio company OMMAX has joined forces with Singulier to establish Europe's premier AI-first management consulting platform. This strategic union combines deep digital execution expertise with world-class advisory capabilities.</p>
      <p>Since our early-stage backing, OMMAX has scaled revenues significantly, partnering with premier private equity sponsors and global enterprises to unlock value through artificial intelligence and automation strategies.</p>
      <blockquote>"This transaction marks a pivotal moment for European tech leadership, proving that specialized AI consulting can scale rapidly across international borders."</blockquote>
      <h3>Key Highlights of the Transaction</h3>
      <ul>
        <li><strong>Expanded Reach:</strong> Over 600 AI specialists across London, Munich, Paris, and Zurich.</li>
        <li><strong>Comprehensive AI Suite:</strong> End-to-end capabilities from generative AI roadmap design to proprietary data pipeline engineering.</li>
        <li><strong>Sustained Value Creation:</strong> Deep integration with European sponsors to optimize portfolio company operations.</li>
      </ul>
      <p>We congratulate the leadership teams at both companies as they pioneer the next era of European enterprise tech transformation.</p>
    `,
    category: 'Portfolio Exit',
    badge: 'PORTFOLIO EXIT',
    author: 'Sarah Chen',
    authorRole: 'Managing Partner, Enterprise Tech',
    date: 'Oct 22, 2026',
    readTime: '4 min read',
    image: investorsAndFounders,
    featured: true,
    views: '14.2k'
  },
  {
    id: 2,
    company: 'SARONIC x NVIDIA',
    title: 'Saronic x NVIDIA collaborate to power autonomous surface vessel artificial intelligence',
    excerpt: 'Integrating real-time edge computing on autonomous naval vessels to enable tactical autonomy and swarm synchronization at sea.',
    takeaways: [
      'Zero-latency multi-modal neural network processing directly onboard autonomous naval surface vessels.',
      'Eliminates reliance on fragile satellite downlinks in contested maritime electronic warfare zones.',
      'Modular edge hardware architecture allows full software and payload swap in under 15 minutes.'
    ],
    content: `
      <h2>Powering Next-Gen Maritime Autonomy</h2>
      <p>Saronic Technologies has officially announced a multi-year strategic partnership with NVIDIA to bring accelerated computing and real-time sensor fusion to autonomous maritime defense vessels.</p>
      <p>By embedding advanced robotics edge platforms directly into Saronic's surface vessels, defense units can process terabytes of sonar, radar, and optical imagery at zero latency directly at sea.</p>
      <blockquote>"Modern naval defense cannot rely on high-latency satellite feeds. Autonomous assets must think, adapt, and coordinate at the tactical edge."</blockquote>
      <h3>Strategic Impact & Innovation</h3>
      <ul>
        <li><strong>Edge AI at Scale:</strong> Onboard multi-modal neural network processing without relying on high-latency satellite feeds.</li>
        <li><strong>Swarm Intelligence:</strong> Coordinated fleet navigation permitting multi-vessel tactical maneuvers.</li>
        <li><strong>Rapid Deployment:</strong> Modular hardware integration allowing field upgrades in under 15 minutes.</li>
      </ul>
      <p>As early backers of Saronic, we are immensely proud to see their vision of modern maritime sovereignty become reality alongside world-class technology partners.</p>
    `,
    category: 'Defense Tech',
    badge: 'PORTFOLIO NEWS',
    author: 'Marcus Vance',
    authorRole: 'Head of DeepTech Capital',
    date: 'Oct 14, 2026',
    readTime: '6 min read',
    image: ventureTech,
    featured: true,
    views: '22.8k'
  },
  {
    id: 3,
    company: 'AMI LABS',
    title: 'AMI Labs raises $1B Series A to develop world-model AI architecture beyond LLMs',
    excerpt: 'Pioneering causal AI models beyond traditional autoregressive token prediction, backed by premier venture syndicates worldwide.',
    takeaways: [
      'Architectures learn spatial commonsense, intuitive physics, and temporal causality rather than next-token guessing.',
      'Up to 80% decrease in compute requirements for complex logical simulations and robotics control tasks.',
      'Syndicated by ConnectUp members alongside Tier-1 institutional research funds.'
    ],
    content: `
      <h2>Building World Models Beyond Token Prediction</h2>
      <p>AMI Labs has closed a landmark $1 Billion Series A round to pioneer a new paradigm in artificial intelligence: World-Model Architecture. Moving beyond token prediction, AMI Labs' architectures learn physical commonsense and causal reasoning.</p>
      <p>Led by world-renowned researchers, AMI Labs is building foundation models capable of planning, spatial reasoning, and real-time physical interaction.</p>
      <blockquote>"True intelligence requires understanding how the physical world works, not just predicting the next word in a sentence."</blockquote>
      <h3>Why World Models Matter</h3>
      <ul>
        <li><strong>Causal Reasoning:</strong> Enables AI agents to predict consequences before taking actions in robotics and complex industrial settings.</li>
        <li><strong>Energy Efficiency:</strong> Requires up to 80% fewer compute resources for complex logical planning compared to standard auto-regressive models.</li>
        <li><strong>Universal Application:</strong> From autonomous manufacturing to breakthrough drug discovery simulations.</li>
      </ul>
      <p>We are proud to support AMI Labs as they redefine the boundaries of artificial intelligence.</p>
    `,
    category: 'AI Research',
    badge: 'SERIES A',
    author: 'Elena Rostova',
    authorRole: 'Partner, AI Infrastructure',
    date: 'Sep 29, 2026',
    readTime: '5 min read',
    image: worldModelAi,
    views: '18.5k'
  },
  {
    id: 4,
    company: 'CONNECTUP SYNDICATE',
    title: 'The Art of the Swipe: How algorithmic matching is transforming angel syndicates',
    excerpt: 'Analyzing the mechanics behind high-velocity term sheet generation and why asynchronous founder discovery outperforms traditional demo days.',
    takeaways: [
      'Data-driven investor-founder alignment reduces deal cycle times by over 70%.',
      'Asynchronous pitch rooms allow global angels to diligence deals on their own schedule.',
      'Transparent cap-table syndication ensures aligned governance from day one.'
    ],
    content: `
      <h2>Reinventing Early-Stage Venture Discovery</h2>
      <p>Traditional venture capital has long relied on warm introductions and crowded demo days. Today, algorithmic matching and swipe-based syndicate curation are revolutionizing how early-stage capital finds exceptional founders.</p>
      <p>By indexing traction signals, founder velocity, and sector thesis preferences, platforms like ConnectUp enable instant, frictionless syndicate formation.</p>
      <blockquote>"Founders shouldn't spend six months cold-emailing investors. The right match should happen with algorithmic precision."</blockquote>
      <h3>The Pillars of Modern Syndication</h3>
      <ul>
        <li><strong>Instant Diligence:</strong> Verified metrics and secure data rooms accessible in one tap.</li>
        <li><strong>Global Angel Networks:</strong> Cross-border syndicate allocation without geographic friction.</li>
        <li><strong>Aligned Governance:</strong> Automated SPV formation and streamlined closing documents.</li>
      </ul>
      <p>Explore how our platform continues to streamline early-stage fundraising for top-tier founders.</p>
    `,
    category: 'Venture Insights',
    badge: 'PLAYBOOK',
    author: 'Arthur Pendelton',
    authorRole: 'Founding General Partner',
    date: 'Sep 18, 2026',
    readTime: '7 min read',
    image: smartMatching,
    views: '11.1k'
  },
  {
    id: 5,
    company: 'SILICON VALLEY ROUNDTABLE',
    title: 'Navigating macro liquidity shifts in Series B and C deeptech investments',
    excerpt: 'Key takeaways from our Q3 San Francisco founder roundtable on valuation discipline, burn rate optimization, and runway extension.',
    takeaways: [
      'Prioritizing 24+ months of runway over speculative growth at all costs.',
      'Leveraging non-dilutive government grants and defense dual-use pathways.',
      'Strategic M&A trends across enterprise SaaS and defense tech.'
    ],
    content: `
      <h2>Discipline & Resilience in Modern Tech</h2>
      <p>Last week, ConnectUp hosted fifty leading founders and tier-one investors in San Francisco for our quarterly macro roundtable. The consensus was clear: capital efficiency is the ultimate competitive advantage.</p>
      <p>Startups maintaining strict unit economics and clear paths to profitability are commanding premium valuations even in volatile markets.</p>
      <blockquote>"Cash is oxygen. Founders who master burn discipline while maintaining product velocity will dominate the next decade."</blockquote>
      <p>Read the full briefing for proprietary benchmarking data and valuation multiples across deeptech and AI sectors.</p>
    `,
    category: 'Market Trends',
    badge: 'REPORT',
    author: 'Sarah Chen',
    authorRole: 'Managing Partner',
    date: 'Sep 04, 2026',
    readTime: '8 min read',
    image: goldenGate,
    views: '9.4k'
  }
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
  onLegalView
}) => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [bookmarkedIds, setBookmarkedIds] = useState<(number | string)[]>([]);
  const [copiedLink, setCopiedLink] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

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
      if (!selectedPost) return;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setReadingProgress(progress);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [selectedPost]);

  const toggleBookmark = (id: number | string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const categories = ['All', 'Portfolio Exit', 'Defense Tech', 'AI Research', 'Venture Insights', 'Market Trends'];

  const filteredPosts = BLOG_POSTS.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.company.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredList = BLOG_POSTS.filter(p => p.featured);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-zinc-900 flex flex-col font-sans selection:bg-[#FFBF00] selection:text-black relative">
      {/* Reading Progress Bar */}
      {selectedPost && (
        <div 
          className="fixed top-0 left-0 h-1.5 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 z-50 transition-all duration-100"
          style={{ width: `${readingProgress}%` }}
        />
      )}

      {/* Landing Navbar */}
      <LandingNavbar 
        currentPage="blog" 
        onNavigate={handleNav} 
        onLoginClick={onLoginClick || (() => {})} 
        lightMode={true}
      />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-24">
        <AnimatePresence mode="wait">
          {selectedPost ? (
            /* =========================================================================
               ARTICLE READER VIEW (EXACTLY MATCHING RIGHT SIDE OF INSP IMAGE)
               ========================================================================= */
            <motion.article 
              key={`reader-${selectedPost.id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              {/* Back button */}
              <div className="mb-8">
                <button 
                  onClick={() => setSelectedPost(null)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-zinc-100 text-xs font-bold text-zinc-800 transition-all cursor-pointer border border-zinc-200 shadow-xs group"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-amber-600 group-hover:-translate-x-1 transition-transform" />
                  <span>Back to Blog Feed</span>
                </button>
              </div>

              {/* Main 2-Column Reader Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                
                {/* Left Sidebar: Author & Share */}
                <div className="lg:col-span-3 space-y-8">
                  <div className="sticky top-28 space-y-6">
                    <div>
                      <p className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">Author</p>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-zinc-950 p-2 flex items-center justify-center shadow-xs shrink-0 border border-zinc-900/10">
                          {selectedPost.authorAvatar ? (
                            <img src={selectedPost.authorAvatar} alt={selectedPost.author} className="w-full h-full object-cover rounded-full" />
                          ) : (
                            <ConnectUpLogoIcon className="w-full h-full" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-zinc-950 text-sm">{selectedPost.author}</p>
                          <p className="text-[11px] text-zinc-500">{selectedPost.authorRole}</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-zinc-200">
                      <p className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">Read Time</p>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-800">
                        <Clock className="w-4 h-4 text-amber-600" />
                        <span>{selectedPost.readTime}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-zinc-200 space-y-3">
                      <p className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Share This Story</p>
                      <div className="flex flex-col gap-2">
                        <button 
                          onClick={handleCopyLink}
                          className="w-full text-left px-3.5 py-2 rounded-xl bg-white hover:bg-zinc-100 border border-zinc-200 text-xs font-semibold text-zinc-800 transition-colors flex items-center justify-between cursor-pointer shadow-xs"
                        >
                          <span>Copy Link</span>
                          {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-zinc-400" />}
                        </button>
                        <a 
                          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="w-full text-left px-3.5 py-2 rounded-xl bg-white hover:bg-zinc-100 border border-zinc-200 text-xs font-semibold text-zinc-800 transition-colors flex items-center justify-between cursor-pointer shadow-xs"
                        >
                          <span>LinkedIn</span>
                          <span className="text-[10px] text-zinc-400 font-mono">IN</span>
                        </a>
                        <a 
                          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(selectedPost.title)}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="w-full text-left px-3.5 py-2 rounded-xl bg-white hover:bg-zinc-100 border border-zinc-200 text-xs font-semibold text-zinc-800 transition-colors flex items-center justify-between cursor-pointer shadow-xs"
                        >
                          <span>X (Twitter)</span>
                          <span className="text-[10px] text-zinc-400 font-mono">X</span>
                        </a>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-zinc-200">
                      <button
                        onClick={(e) => toggleBookmark(selectedPost.id, e)}
                        className={`w-full py-2.5 px-4 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                          bookmarkedIds.includes(selectedPost.id)
                            ? 'bg-amber-400 text-black border-amber-400'
                            : 'bg-white text-zinc-800 border-zinc-200 hover:bg-zinc-50'
                        }`}
                      >
                        <Bookmark className="w-3.5 h-3.5 fill-current" />
                        <span>{bookmarkedIds.includes(selectedPost.id) ? 'Saved to Bookmarks' : 'Bookmark Story'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Content Area */}
                <div className="lg:col-span-9 space-y-8 bg-white p-6 sm:p-12 rounded-3xl border border-zinc-200 shadow-sm">
                  
                  {/* Metadata Header */}
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                      <span className="text-amber-700 font-bold uppercase tracking-wider">
                        {selectedPost.badge}
                      </span>
                      <span className="text-zinc-300">·</span>
                      <span className="text-zinc-500 uppercase">
                        {selectedPost.date}
                      </span>
                      <span className="text-zinc-300">·</span>
                      <span className="text-zinc-500">
                        {selectedPost.readTime}
                      </span>
                      {selectedPost.views && (
                        <>
                          <span className="text-zinc-300">·</span>
                          <span className="text-zinc-400">
                            {selectedPost.views} views
                          </span>
                        </>
                      )}
                    </div>

                    <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-zinc-950 tracking-tight leading-tight">
                      {selectedPost.title}
                    </h1>

                    {/* Editorial Lead-In */}
                    <p className="text-base sm:text-lg text-zinc-600 font-medium leading-relaxed border-l-2 border-amber-400 pl-4 py-1 italic">
                      {selectedPost.excerpt}
                    </p>
                  </div>

                  {/* Hero Cover Image */}
                  <div className="w-full h-[360px] sm:h-[480px] rounded-2xl overflow-hidden shadow-md border border-zinc-200 relative group">
                    <img 
                      src={selectedPost.image} 
                      alt={selectedPost.title} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-3 left-3 px-3 py-1 rounded bg-zinc-950/75 backdrop-blur-md text-white font-mono text-[10px] uppercase tracking-wider">
                      {selectedPost.company}
                    </div>
                  </div>

                  {/* Executive Takeaways */}
                  {selectedPost.takeaways && selectedPost.takeaways.length > 0 && (
                    <div className="p-6 rounded-2xl bg-amber-50/70 border-l-4 border-l-amber-500 border border-amber-200/60 space-y-3">
                      <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider font-mono">
                        <Award className="w-4 h-4 text-amber-600" />
                        <span>Key Executive Takeaways</span>
                      </div>
                      <ul className="space-y-2 text-sm text-zinc-700">
                        {selectedPost.takeaways.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-amber-600 font-bold mt-0.5">•</span>
                            <span className="leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Article HTML Content */}
                  <div 
                    className="prose prose-zinc max-w-none text-zinc-800 space-y-6 leading-relaxed font-sans text-base sm:text-lg [&>h2]:font-serif [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-zinc-950 [&>h2]:mt-8 [&>h2]:mb-4 [&>h3]:font-serif [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-zinc-950 [&>h3]:mt-6 [&>h3]:mb-3 [&>blockquote]:border-l-4 [&>blockquote]:border-amber-400 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-zinc-700 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-2"
                    dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                  />

                  {/* Bottom Author Box */}
                  <div className="pt-10 border-t border-zinc-200 flex flex-col sm:flex-row items-center sm:items-start gap-5">
                    <div className="w-16 h-16 rounded-full bg-zinc-950 p-3.5 flex items-center justify-center shadow-xs shrink-0 border border-zinc-900/10">
                      <ConnectUpLogoIcon className="w-full h-full" />
                    </div>
                    <div className="text-center sm:text-left space-y-1">
                      <p className="font-bold text-zinc-950 text-base">{selectedPost.author}</p>
                      <p className="text-xs text-amber-700 font-semibold">{selectedPost.authorRole}</p>
                      <p className="text-xs text-zinc-600 leading-relaxed pt-1">
                        Authoring frontier venture dispatches at ConnectUp. Regularly advising syndicate leads on early-stage allocations and technical diligence.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </motion.article>
          ) : (
            /* =========================================================================
               BLOG INDEX / FEED VIEW (EXACTLY MATCHING LEFT SIDE OF INSP IMAGE)
               ========================================================================= */
            <div className="space-y-16">
              
              {/* TOP HEADER SECTION */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-8 border-b border-zinc-200">
                <div>
                  <p className="text-[11px] font-mono uppercase tracking-widest text-amber-700 font-bold mb-2">
                    ConnectUp Venture Intelligence &middot; Editorial Dispatches
                  </p>
                  <h1 className="font-serif text-3xl sm:text-5xl font-black text-zinc-950 tracking-tight">
                    Insights &amp; Perspectives
                  </h1>
                  <p className="text-zinc-500 text-sm sm:text-base mt-2 font-normal">
                    Curated dispatch notes, deeptech venture analysis, and syndicate strategies.
                  </p>
                </div>
              </div>

              {/* FEATURED HERO CARDS (2-COLUMN GRID FROM INSP IMAGE) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {featuredList.slice(0, 2).map((post) => (
                  <div 
                    key={post.id}
                    onClick={() => setSelectedPost(post)}
                    className="group cursor-pointer rounded-3xl overflow-hidden bg-white border border-zinc-200 hover:border-amber-400 transition-all duration-500 shadow-sm hover:shadow-xl flex flex-col justify-between"
                  >
                    <div className="h-[280px] sm:h-[340px] relative overflow-hidden">
                      <img 
                        src={post.image} 
                        alt={post.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                      
                      {/* Top Unboxed Badge */}
                      <span className="absolute top-4 left-4 px-2.5 py-1 rounded-md bg-zinc-950/85 backdrop-blur-md text-amber-300 text-[10px] font-mono font-bold uppercase tracking-wider border border-white/10 shadow-xs">
                        {post.category}
                      </span>

                      {/* Bookmark button */}
                      <button
                        onClick={(e) => toggleBookmark(post.id, e)}
                        className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md border transition-all cursor-pointer ${
                          bookmarkedIds.includes(post.id)
                            ? 'bg-amber-400 text-black border-amber-400 shadow-md'
                            : 'bg-white/80 text-zinc-800 hover:bg-white border-zinc-200 shadow-xs'
                        }`}
                      >
                        <Bookmark className="w-3.5 h-3.5 fill-current" />
                      </button>

                      {/* Overlay Title */}
                      <div className="absolute bottom-6 left-6 right-6 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-mono text-white/80">
                          <span className="text-amber-300 font-bold">{post.company}</span>
                          <span>&middot;</span>
                          <span>{post.date}</span>
                          <span>&middot;</span>
                          <span>{post.readTime}</span>
                        </div>
                        <h3 className="font-serif text-xl sm:text-2xl font-bold text-white group-hover:text-amber-300 transition-colors leading-snug line-clamp-2">
                          {post.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* SEARCH & CATEGORY FILTER BAR */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-6">
                {/* Segmented Category Filter */}
                <div className="flex flex-wrap items-center gap-1.5 p-1 bg-zinc-100 rounded-xl border border-zinc-200">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-zinc-950 text-white shadow-xs font-bold'
                          : 'text-zinc-600 hover:text-zinc-950 hover:bg-white/60'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Search Box */}
                <div className="relative min-w-[260px]">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search articles &amp; portfolio news..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-zinc-200 text-zinc-900 placeholder-zinc-400 text-xs focus:outline-none focus:border-zinc-400 shadow-xs"
                  />
                </div>
              </div>

              {/* LATEST BLOGS SECTION (EXACTLY MATCHING 3-COLUMN GRID FROM INSP IMAGE) */}
              <div className="space-y-8">
                <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
                  <h2 className="text-2xl sm:text-3xl font-serif font-black text-zinc-950 uppercase tracking-tight">
                    Latest Blogs
                  </h2>
                  <span className="text-xs font-mono text-zinc-500">
                    Showing {filteredPosts.length} dispatches
                  </span>
                </div>

                {filteredPosts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {filteredPosts.map((post) => {
                      const isBookmarked = bookmarkedIds.includes(post.id);
                      return (
                        <div 
                          key={post.id}
                          onClick={() => setSelectedPost(post)}
                          className="group cursor-pointer rounded-2xl bg-white border border-zinc-200 hover:border-amber-400/80 transition-all duration-300 p-6 flex flex-col justify-between shadow-xs hover:shadow-md relative overflow-hidden"
                        >
                          <div className="space-y-3.5">
                            {/* Metadata & Bookmark */}
                            <div className="flex items-center justify-between text-xs font-mono text-zinc-500">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-amber-700 font-bold uppercase tracking-wider text-[11px]">{post.category}</span>
                                <span className="text-zinc-300">&middot;</span>
                                <span className="text-[11px]">{post.date}</span>
                              </div>
                              <button
                                onClick={(e) => toggleBookmark(post.id, e)}
                                className={`p-1.5 rounded-full border transition-all cursor-pointer ${
                                  isBookmarked 
                                    ? 'bg-amber-400 text-black border-amber-400' 
                                    : 'bg-zinc-50 text-zinc-600 hover:text-zinc-950 border-zinc-200'
                                }`}
                              >
                                <Bookmark className="w-3.5 h-3.5 fill-current" />
                              </button>
                            </div>

                            {/* Company Monospace Kicker */}
                            <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-semibold">
                              {post.company}
                            </p>

                            {/* Title */}
                            <h3 className="font-serif text-lg font-bold text-zinc-950 group-hover:text-amber-600 transition-colors line-clamp-2 leading-snug">
                              {post.title}
                            </h3>

                            {/* Excerpt */}
                            <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed">
                              {post.excerpt}
                            </p>
                          </div>

                          {/* Bottom Row: Thumbnail + Read More */}
                          <div className="pt-5 mt-5 border-t border-zinc-100 flex items-center justify-between">
                            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-zinc-200 shadow-2xs">
                              <img 
                                src={post.image} 
                                alt={post.title} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div className="text-right">
                              <div className="text-[10px] font-mono text-zinc-400">{post.readTime}</div>
                              <span className="flex items-center gap-1 font-bold text-xs text-zinc-950 group-hover:text-amber-600 transition-colors mt-0.5">
                                Read dispatch <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-20 border border-dashed border-zinc-200 rounded-3xl bg-white">
                    <BookOpen className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-zinc-950 mb-2 font-serif">No dispatches found</h3>
                    <p className="text-sm text-zinc-600 mb-6 max-w-sm mx-auto">
                      We couldn't find any articles matching &ldquo;{searchQuery || selectedCategory}&rdquo;. Try another filter.
                    </p>
                    <button 
                      onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                      className="px-6 py-2.5 rounded-full bg-zinc-950 text-white font-bold text-xs hover:bg-zinc-800 transition-colors cursor-pointer"
                    >
                      Reset Filters
                    </button>
                  </div>
                )}
              </div>

              {/* NEWSLETTER SUBSCRIBE BANNER */}
              <section className="relative rounded-3xl overflow-hidden p-8 sm:p-12 bg-gradient-to-r from-amber-50 via-zinc-50 to-amber-50 border border-amber-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-3 max-w-xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
                    <Mail className="w-3.5 h-3.5 text-amber-600" /> Weekly Dispatch
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-950 tracking-tight">
                    Stay ahead of European venture capital and AI syndicates.
                  </h3>
                  <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed">
                    Join over 15,000 active founders and certified angels receiving our curated Sunday night breakdown. Zero noise, high signal.
                  </p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); alert('Successfully subscribed to weekly dispatches!'); }} className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <input 
                    type="email" 
                    placeholder="Enter your work email" 
                    required
                    className="px-5 py-3 rounded-full bg-white border border-zinc-300 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-500 shadow-xs sm:w-72"
                  />
                  <button 
                    type="submit"
                    className="px-6 py-3 rounded-full bg-zinc-950 text-white font-black text-xs hover:bg-zinc-800 transition-all cursor-pointer shadow-md shrink-0"
                  >
                    Subscribe Now
                  </button>
                </form>
              </section>

            </div>
          )}
        </AnimatePresence>
      </main>

      <FooterSection5 onNavigate={handleNav} onLegalView={onLegalView} />
    </div>
  );
};
