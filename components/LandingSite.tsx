import React, { useState, useEffect } from 'react';
import { 
  Play, Check, Plus, Minus, ArrowRight, ExternalLink, X, 
  Clock, TrendingUp, Users, Shield, DollarSign, Calendar,
  BarChart3, Layers, Send, ChevronRight, Sparkles, Building2,
  Lock, Share2, Mail, CheckCircle2, Search, Flame, Award
} from 'lucide-react';
import { ConnectUpIcon } from './ui/ConnectUpLogo';

interface LandingSiteProps {
  onLoginClick: () => void;
  onAdminLoginClick?: () => void;
  onLegalView?: (view: 'privacy' | 'terms') => void;
  onNavigateToBlog?: () => void;
  onNavigateToContact?: () => void;
}

export default function LandingSite({
  onLoginClick,
  onAdminLoginClick,
  onLegalView,
  onNavigateToBlog,
  onNavigateToContact
}: LandingSiteProps) {
  // Navigation & Interactive states
  const [activeAccordion, setActiveAccordion] = useState<number>(0);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [emailSubscription, setEmailSubscription] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Live Swipes / Match Velocity Mock in Hero Dashboard
  const [liveMatches, setLiveMatches] = useState(4892);
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveMatches(prev => prev + 1);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Syndicate & Founder Invites interactive mockup
  const [invites, setInvites] = useState([
    { id: 1, name: 'Olugbenga Agboola', role: 'Flutterwave', status: 'Verified', avatar: 'https://www.lagoonhospitals.com/wp-content/uploads/2022/11/GB.jpg' },
    { id: 2, name: 'Shola Akinlade', role: 'Paystack', status: 'Pending', avatar: 'https://fastly.restofworld.org/uploads/2022/05/Africa-SholaAkinladePressKit-EDITED.png?width=300&dpr=2&crop=1:1' },
    { id: 3, name: 'Iyinoluwa Aboyeji', role: 'Future Africa', status: 'Verified', avatar: 'https://fastly.restofworld.org/uploads/2022/05/Africa-IyinoluwaAboyejiCourtesy-EDITED.png?width=300&dpr=2&crop=1:1' },
    { id: 4, name: 'Sarah Jenkins', role: 'Venture Partner', status: 'Pending', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80' },
  ]);
  const [newInviteEmail, setNewInviteEmail] = useState('');

  const handleSendInvite = (id: number) => {
    setInvites(prev => prev.map(inv => inv.id === id ? { ...inv, status: 'Sent' } : inv));
  };

  const handleAddInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInviteEmail.trim()) return;
    setInvites(prev => [
      ...prev,
      {
        id: Date.now(),
        name: newInviteEmail.split('@')[0],
        role: 'Startup Scout',
        status: 'Pending',
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${newInviteEmail}`
      }
    ]);
    setNewInviteEmail('');
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans antialiased selection:bg-amber-400 selection:text-zinc-950 overflow-x-hidden">
      
      {/* ========================================================= */}
      {/* 1. HERO SECTION (ATMOSPHERIC SKY GRADIENT + STORYLINE) */}
      {/* ========================================================= */}
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#0284C7] via-[#38BDF8] to-[#E0F2FE] pt-4 pb-20 sm:pb-28">
        
        {/* Soft atmospheric cloud overlay at base */}
        <div className="absolute bottom-0 left-0 right-0 h-44 sm:h-56 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none z-10" />

        {/* Floating Navbar */}
        <nav className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2.5 cursor-pointer select-none group"
            >
              <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-xs group-hover:scale-105 transition-transform">
                <ConnectUpIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Connect<span className="text-amber-300">Up</span>
              </span>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-white/90">
              <button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors cursor-pointer">
                Features
              </button>
              <button onClick={() => scrollToSection('storyline')} className="hover:text-white transition-colors cursor-pointer">
                Storyline
              </button>
              <button onClick={() => scrollToSection('how-it-works')} className="hover:text-white transition-colors cursor-pointer">
                How It Works
              </button>
              {onNavigateToBlog && (
                <button onClick={onNavigateToBlog} className="hover:text-white transition-colors cursor-pointer">
                  Blog
                </button>
              )}
              {onNavigateToContact && (
                <button onClick={onNavigateToContact} className="hover:text-white transition-colors cursor-pointer">
                  Contact
                </button>
              )}
            </div>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={onLoginClick}
                className="hidden sm:inline-flex px-5 py-2 rounded-full bg-zinc-950 text-white text-xs sm:text-sm font-bold shadow-md hover:bg-zinc-800 transition-all cursor-pointer active:scale-95"
              >
                Get Started Free
              </button>
              <button
                onClick={onLoginClick}
                className="text-white hover:text-white/80 text-xs sm:text-sm font-semibold transition-colors cursor-pointer px-2 py-1"
              >
                Log In
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 pb-12 sm:pb-20 text-center">
          
          {/* Unboxed Monospace Category Kicker */}
          <div className="mb-4 inline-flex items-center gap-2 text-white/90 font-mono text-[11px] uppercase tracking-widest font-semibold bg-white/15 backdrop-blur-md px-3.5 py-1 rounded-md border border-white/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-ping" />
            <span>Venture Capital &middot; High-Conviction Match Engine</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] max-w-4xl mx-auto drop-shadow-xs">
            Where Visionary Founders Meet High-Conviction Capital.
          </h1>

          <p className="mt-4 sm:mt-5 text-sm sm:text-base text-white/95 max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-2xs">
            Cold emails and spray-and-pray decks are broken. ConnectUp replaces pitch-deck noise with algorithmic thesis matching, interactive diligence data rooms, and live syndicate salon rooms.
          </p>

          {/* Dual CTAs */}
          <div className="mt-7 sm:mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <button
              onClick={onLoginClick}
              className="px-6 sm:px-7 py-3 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white text-xs sm:text-sm font-bold shadow-lg hover:shadow-xl transition-all active:scale-95 cursor-pointer"
            >
              Get Started for Free
            </button>
            <button
              onClick={() => setIsVideoModalOpen(true)}
              className="px-6 sm:px-7 py-3 rounded-full bg-white hover:bg-zinc-50 text-zinc-950 text-xs sm:text-sm font-bold shadow-md border border-white/80 transition-all active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <Play size={14} className="fill-zinc-950" />
              <span>Watch Pitch Tour</span>
            </button>
          </div>

          {/* Hero Floating Dashboard Mockup */}
          <div className="mt-12 sm:mt-16 max-w-4xl mx-auto">
            <div className="rounded-2xl sm:rounded-3xl p-3 sm:p-4 bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_30px_90px_rgba(2,132,199,0.35)] transition-all">
              <div className="rounded-xl sm:rounded-2xl bg-white border border-zinc-200/90 shadow-sm overflow-hidden text-left">
                
                {/* Mockup Window Header */}
                <div className="px-4 py-3 bg-zinc-50/80 border-b border-zinc-200/80 flex items-center justify-between text-xs text-zinc-500">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    </div>
                    <span className="font-bold text-zinc-900 text-xs flex items-center gap-1.5">
                      <ConnectUpIcon className="w-3.5 h-3.5" />
                      <span>ConnectUp Deal Engine</span>
                    </span>
                    <span className="text-zinc-400 hidden sm:inline">| High-Conviction Match Deck</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-mono text-[11px] font-bold border border-emerald-500/20">
                      <Flame size={12} className="text-amber-500 animate-pulse" />
                      <span>{liveMatches.toLocaleString()} Verified Introductions</span>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-zinc-200 overflow-hidden border border-zinc-300">
                      <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64&q=80" alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>

                {/* Mockup Dashboard Content Grid */}
                <div className="p-4 sm:p-6 space-y-4">
                  {/* Top Bar inside mockup */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-zinc-950">Next-Gen FinTech &amp; AI Venture Pipeline</h4>
                      <p className="text-[11px] text-zinc-400 font-mono">Direct Founder-to-VC Allocation Matrix &middot; Series A Diligence</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-100 text-zinc-600 font-mono">Active Round</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FACC15] text-zinc-950 font-mono">Term Sheet Open</span>
                    </div>
                  </div>

                  {/* Deal Metric Columns */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center sm:text-left">
                    <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                      <div className="text-[10px] text-zinc-400 uppercase font-mono">Thesis Match</div>
                      <div className="text-base sm:text-lg font-bold font-mono text-zinc-900 mt-0.5">98.4%</div>
                      <div className="text-[10px] text-emerald-600 font-semibold mt-1">High Institutional Fit</div>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                      <div className="text-[10px] text-zinc-400 uppercase font-mono">Pitch Deck Views</div>
                      <div className="text-base sm:text-lg font-bold font-mono text-zinc-900 mt-0.5">1,480</div>
                      <div className="text-[10px] text-sky-600 font-semibold mt-1">Top 5% Engagement</div>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                      <div className="text-[10px] text-zinc-400 uppercase font-mono">Match Velocity</div>
                      <div className="text-base sm:text-lg font-bold font-mono text-zinc-900 mt-0.5">48h 56m</div>
                      <div className="text-[10px] text-purple-600 font-semibold mt-1">First Term Sheet</div>
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                      <div className="text-[10px] text-zinc-400 uppercase font-mono">Syndicate Allocation</div>
                      <div className="text-base sm:text-lg font-bold font-mono text-zinc-900 mt-0.5">$1.5M</div>
                      <div className="text-[10px] text-amber-600 font-semibold mt-1">Over-Subscribed</div>
                    </div>
                  </div>

                  {/* Mini Activity Heatmap Strip */}
                  <div className="p-3 rounded-xl bg-zinc-50/70 border border-zinc-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-zinc-900 text-xs">Deal Activity</span>
                      <span className="text-[11px] text-zinc-400">Live investor requests this week</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-1">
                          <span className="text-[9px] text-zinc-400 font-mono">{day[0]}</span>
                          <div className={`w-3 h-3 rounded ${idx === 2 || idx === 3 ? 'bg-amber-400' : idx === 4 ? 'bg-amber-300' : idx === 1 ? 'bg-amber-200' : 'bg-zinc-200'}`} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>

        {/* Social Proof Marquee Strip */}
        <div className="relative z-20 max-w-5xl mx-auto px-4 mt-6 text-center">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest font-mono">
            Trusted by top founders, angels &amp; venture leaders
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-zinc-400 font-bold text-sm tracking-wider opacity-85">
            <span className="flex items-center gap-1.5 hover:text-zinc-700 transition-colors">
              <span className="w-2 h-2 rounded-full bg-zinc-400" />
              Flutterwave
            </span>
            <span className="flex items-center gap-1.5 hover:text-zinc-700 transition-colors">
              <span className="w-2 h-2 rounded-full bg-zinc-400" />
              Paystack
            </span>
            <span className="flex items-center gap-1.5 hover:text-zinc-700 transition-colors">
              <span className="w-2 h-2 rounded-full bg-zinc-400" />
              Future Africa
            </span>
            <span className="flex items-center gap-1.5 hover:text-zinc-700 transition-colors">
              <span className="w-2 h-2 rounded-full bg-zinc-400" />
              Y Combinator Alumni
            </span>
            <span className="flex items-center gap-1.5 hover:text-zinc-700 transition-colors">
              <span className="w-2 h-2 rounded-full bg-zinc-400" />
              Ventures Platform
            </span>
            <span className="flex items-center gap-1.5 hover:text-zinc-700 transition-colors">
              <span className="w-2 h-2 rounded-full bg-zinc-400" />
              Techstars
            </span>
          </div>
        </div>

      </section>

      {/* ========================================================= */}
      {/* 2. THE STORYLINE / NARRATIVE SECTION */}
      {/* ========================================================= */}
      <section id="storyline" className="py-20 sm:py-28 bg-[#FAFAFA] border-b border-zinc-200/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 font-semibold mb-2">
              The Narrative &middot; Storyline
            </p>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-zinc-950 tracking-tight leading-tight">
              From Spray-and-Pray Decks<br className="hidden sm:block" /> to High-Conviction Closes
            </h2>
            <p className="mt-3 text-sm sm:text-base text-zinc-500 leading-relaxed">
              Fundraising has been stuck in the 2010s: cold LinkedIn messages, generic pitch templates, and months in purgatory. Here is how ConnectUp re-engineers the journey.
            </p>
          </div>

          {/* 3-Chapter Narrative Grid */}
          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            
            {/* Chapter 01 */}
            <div className="p-7 rounded-2xl bg-white border border-zinc-200 shadow-2xs relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-rose-500">
                    Chapter 01 &middot; The Bottleneck
                  </span>
                  <span className="text-zinc-300 font-mono text-xs">01/03</span>
                </div>
                <h3 className="text-lg font-bold text-zinc-950">
                  98% of Cold Pitch Outbound Vanishes into Noise
                </h3>
                <p className="mt-2.5 text-xs sm:text-sm text-zinc-500 leading-relaxed">
                  Founders burn critical runway sending hundreds of cold emails. Simultaneously, tier-1 investors are overwhelmed by deck spam and miss out on non-consensus breakout teams.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center gap-2 text-[11px] font-mono text-rose-600 font-semibold">
                <span>✕ 150+ Cold Emails</span>
                <span>&middot;</span>
                <span>4-6 Months Purgatory</span>
              </div>
            </div>

            {/* Chapter 02 */}
            <div className="p-7 rounded-2xl bg-white border-2 border-indigo-200 shadow-xs relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-indigo-600">
                    Chapter 02 &middot; The Match Engine
                  </span>
                  <span className="text-indigo-400 font-mono text-xs">02/03</span>
                </div>
                <h3 className="text-lg font-bold text-zinc-950">
                  Traction-Verified Algorithmic Alignment
                </h3>
                <p className="mt-2.5 text-xs sm:text-sm text-zinc-500 leading-relaxed">
                  ConnectUp evaluates verified traction signals—MRR trajectory, unit economics, market geography—and maps them directly to active LP &amp; VC fund mandates.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center gap-2 text-[11px] font-mono text-indigo-600 font-semibold">
                <span>⚡ 98.4% Thesis Precision</span>
                <span>&middot;</span>
                <span>Zero Cold Spam</span>
              </div>
            </div>

            {/* Chapter 03 */}
            <div className="p-7 rounded-2xl bg-white border border-zinc-200 shadow-2xs relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-emerald-600">
                    Chapter 03 &middot; The Velocity Close
                  </span>
                  <span className="text-zinc-300 font-mono text-xs">03/03</span>
                </div>
                <h3 className="text-lg font-bold text-zinc-950">
                  Collaborative Due Diligence &amp; Term Sheet Commit
                </h3>
                <p className="mt-2.5 text-xs sm:text-sm text-zinc-500 leading-relaxed">
                  Investors review interactive data rooms, participate in live Town Hall pitch salons, and execute SAFE note allocations with automated settlement in days, not quarters.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center gap-2 text-[11px] font-mono text-emerald-600 font-semibold">
                <span>✓ 48h to First Term Sheet</span>
                <span>&middot;</span>
                <span>Syndicate Ready</span>
              </div>
            </div>

          </div>

          {/* Quick Comparison Strip */}
          <div className="mt-8 p-4 rounded-xl bg-white border border-zinc-200/90 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2 text-zinc-500">
              <span className="font-bold text-zinc-900 font-mono">Benchmark Difference:</span>
              <span>Traditional cycle takes 120+ days vs. ConnectUp average velocity of 48 hours to syndicate allocation.</span>
            </div>
            <button 
              onClick={onLoginClick}
              className="px-4 py-1.5 rounded-lg bg-zinc-950 text-white font-bold text-xs hover:bg-zinc-800 transition-colors shrink-0 cursor-pointer"
            >
              Experience the Pipeline &rarr;
            </button>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. BENTO FEATURES GRID ("Powerful features built for modern visionaries") */}
      {/* ========================================================= */}
      <section id="features" className="py-20 sm:py-28 bg-white relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Unboxed Monospace Category Kicker */}
          <p className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 font-semibold mb-2">
            Deal Infrastructure &middot; Core Features
          </p>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-zinc-950 tracking-tight">
            Powerful features built<br className="hidden sm:block" /> for modern visionaries
          </h2>

          <p className="mt-3 text-sm sm:text-base text-zinc-500 max-w-xl mx-auto">
            Everything founders and investors need to discover, evaluate, and scale together without endless cold emails.
          </p>

          {/* 3-Column Top Bento Row */}
          <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
            
            {/* Card 1: Deal Velocity & Matching */}
            <div className="p-6 rounded-2xl bg-zinc-50/70 border border-zinc-200/80 shadow-2xs flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-zinc-950">High-Signal Matching</h3>
                <p className="mt-1 text-xs text-zinc-500 leading-relaxed">
                  Smart deal flow filtering pairs founders directly with thesis-aligned VCs, eliminating cold pitch noise and speeding up rounds.
                </p>
              </div>

              {/* Mini UI Widget */}
              <div className="mt-6 p-4 rounded-xl bg-white border border-zinc-200/90 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-7 h-7 rounded-lg bg-amber-400 text-zinc-950 flex items-center justify-center font-bold text-xs">
                    <Sparkles size={14} />
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-100 text-zinc-600">Active Deals ▾</span>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-400 uppercase font-mono">Average Round Velocity</div>
                  <div className="text-xl font-extrabold font-mono text-zinc-950 mt-0.5">48h 56m</div>
                  <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                    <span>↗ +14.2% faster than industry standard</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2 (HERO ACCENT CARD IN ROYAL INDIGO #5B63EE) */}
            <div className="p-6 rounded-2xl bg-[#5B63EE] text-white shadow-md flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Pitch Deck Evaluation &amp; Diligence</h3>
                <p className="mt-1 text-xs text-white/80 leading-relaxed">
                  Institutional-grade pitch rooms with interactive deck reviews, cap table clarity, and live founder commentary.
                </p>
              </div>

              {/* Mini UI Widget in Card 2 */}
              <div className="mt-6 p-4 rounded-xl bg-white text-zinc-950 shadow-sm space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-rose-50 text-rose-600 border border-rose-100">
                    High Conviction
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">Q3 Venture Syndicate</span>
                </div>
                <h4 className="text-xs font-bold text-zinc-950">Series A FinTech Due Diligence</h4>
                <p className="text-[11px] text-zinc-500">
                  Lead investor terms, vetted data room files, and real-time founder Q&amp;A salon board.
                </p>
                <div className="pt-2 flex items-center justify-between border-t border-zinc-100 text-[10px] text-zinc-400">
                  <div className="flex -space-x-1.5">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=48&h=48&q=80" alt="VC" className="w-5 h-5 rounded-full border border-white object-cover" />
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=48&h=48&q=80" alt="VC" className="w-5 h-5 rounded-full border border-white object-cover" />
                    <div className="w-5 h-5 rounded-full bg-zinc-200 text-zinc-600 font-bold flex items-center justify-center text-[9px] border border-white">+3</div>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span>📄 Pitch Deck</span>
                    <span>🔒 SAFE Note</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Term Sheet & Capital Ledger */}
            <div className="p-6 rounded-2xl bg-zinc-50/70 border border-zinc-200/80 shadow-2xs flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-zinc-950">Term Sheet &amp; Capital Ledger</h3>
                <p className="mt-1 text-xs text-zinc-500 leading-relaxed">
                  Convert verbal interest into transparent term sheet commits and manage settlement rounds seamlessly.
                </p>
              </div>

              {/* Mini UI Widget */}
              <div className="mt-6 p-4 rounded-xl bg-white border border-zinc-200/90 shadow-2xs space-y-2 text-xs">
                <div className="flex justify-between items-center text-zinc-700">
                  <span>Pre-Seed Syndicate Check</span>
                  <span className="font-mono font-bold text-zinc-950">$250,000</span>
                </div>
                <div className="flex justify-between items-center text-zinc-700">
                  <span>Institutional Angel Allocation</span>
                  <span className="font-mono font-bold text-zinc-950">$500,000</span>
                </div>
                <div className="flex justify-between items-center text-zinc-700">
                  <span>Lead VC Tranche (Series Seed)</span>
                  <span className="font-mono font-bold text-zinc-950">$1,250,000</span>
                </div>
                <div className="pt-2 border-t border-zinc-150 flex justify-between items-center font-bold text-zinc-950">
                  <span>Total Capital Facilitated</span>
                  <span className="font-mono text-emerald-600">$5,025,000</span>
                </div>
              </div>
            </div>

          </div>

          {/* 2-Column Bottom Bento Row */}
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
            
            {/* Card 4: Ecosystem & Integration Flexibility */}
            <div className="p-6 rounded-2xl bg-zinc-50/70 border border-zinc-200/80 shadow-2xs flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-zinc-950">Ecosystem Integrations</h3>
                <p className="mt-1 text-xs text-zinc-500 leading-relaxed">
                  Seamlessly connect with Paystack for automated pro billing, Supabase for enterprise database scale, Google Workspace for calendar pitches, and Slack for instant match notifications.
                </p>
              </div>

              {/* Node diagram representation */}
              <div className="mt-8 py-6 flex items-center justify-center">
                <div className="relative flex items-center justify-center">
                  {/* Central ConnectUp Node */}
                  <div className="w-14 h-14 rounded-2xl bg-[#5B63EE] text-white flex items-center justify-center font-bold text-xl shadow-lg ring-8 ring-indigo-50 z-10">
                    <ConnectUpIcon className="w-8 h-8 text-white" />
                  </div>
                  
                  {/* Satellite Partner Icons */}
                  <div className="absolute -left-16 -top-2 w-9 h-9 rounded-xl bg-white border border-zinc-200/90 shadow-xs flex items-center justify-center text-xs font-bold text-emerald-600">
                    Paystack
                  </div>
                  <div className="absolute -left-12 -bottom-6 w-9 h-9 rounded-xl bg-white border border-zinc-200/90 shadow-xs flex items-center justify-center text-xs font-bold text-sky-600">
                    Slack
                  </div>
                  <div className="absolute -right-16 -top-4 w-9 h-9 rounded-xl bg-white border border-zinc-200/90 shadow-xs flex items-center justify-center text-xs font-bold text-emerald-500">
                    Supabase
                  </div>
                  <div className="absolute -right-10 -bottom-6 w-9 h-9 rounded-xl bg-white border border-zinc-200/90 shadow-xs flex items-center justify-center text-xs font-bold text-amber-500">
                    Google
                  </div>
                </div>
              </div>
            </div>

            {/* Card 5: Smart Deal Flow Reports & Exports */}
            <div className="p-6 rounded-2xl bg-zinc-50/70 border border-zinc-200/80 shadow-2xs flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-zinc-950">Real-Time Venture Analytics</h3>
                <p className="mt-1 text-xs text-zinc-500 leading-relaxed">
                  Generate comprehensive pitch traction reports in seconds. Track deck views, investor drop-off rates, sector interest, and geographic liquidity effortlessly.
                </p>
              </div>

              {/* Weekly bar chart widget */}
              <div className="mt-6 p-4 rounded-xl bg-white border border-zinc-200/90 shadow-2xs space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-zinc-950">Investor Engagement Index</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-zinc-100 text-zinc-600 font-mono">Live Sync ▾</span>
                </div>
                
                <div className="h-24 flex items-end justify-between gap-3 pt-3 border-b border-zinc-100 pb-2">
                  {[
                    { day: 'Sun', val: 35, active: false },
                    { day: 'Mon', val: 75, active: false },
                    { day: 'Tue', val: 95, active: false },
                    { day: 'Wed', val: 120, active: true },
                    { day: 'Thu', val: 85, active: false },
                    { day: 'Fri', val: 110, active: true },
                    { day: 'Sat', val: 65, active: false }
                  ].map((bar, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                      <div 
                        className={`w-full rounded-t-sm transition-all ${bar.active ? 'bg-[#5B63EE]' : 'bg-amber-300'}`}
                        style={{ height: `${(bar.val / 120) * 100}%` }}
                      />
                      <span className="text-[10px] text-zinc-400 font-mono">{bar.day}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. "HOW IT WORKS" (INTERACTIVE ACCORDION + LIVE SYNDICATE MOCKUP) */}
      {/* ========================================================= */}
      <section id="how-it-works" className="py-20 sm:py-28 bg-[#FAFAFA] border-y border-zinc-200/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Accordion */}
            <div>
              {/* Unboxed Monospace Category Kicker */}
              <p className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 font-semibold mb-2">
                Workflow &middot; Step-by-Step
              </p>

              <h2 className="text-3xl sm:text-5xl font-extrabold text-zinc-950 tracking-tight leading-tight">
                Where Vision Meets<br />Instant Alignment
              </h2>

              <p className="mt-4 text-sm sm:text-base text-zinc-500 leading-relaxed max-w-lg">
                We believe the strongest partnerships start with instant alignment, not endless cold emails. ConnectUp is redefining how founders tell their stories and how investors deploy capital.
              </p>

              {/* Accordion List */}
              <div className="mt-8 space-y-4 divide-y divide-zinc-200/80">
                {[
                  {
                    title: 'Create Your Founder or Investor Workspace',
                    desc: 'Build your verified venture profile in minutes. Upload pitch videos, showcase key metrics, and declare investment theses.'
                  },
                  {
                    title: 'Discover & Swipe Deals Automatically',
                    desc: 'Our algorithmic engine surfaces curated startups and active capital allocators based on stage, sector, and check size.'
                  },
                  {
                    title: 'Evaluate Pitches with Real-Time Analytics',
                    desc: 'Dive into interactive deck viewers, review traction milestones, and engage directly in moderated Town Hall salons.'
                  },
                  {
                    title: 'Close Funding & Syndicate Smarter',
                    desc: 'Sign SAFE agreements, coordinate lead investor term sheets, and manage syndicate allocations with zero friction.'
                  }
                ].map((item, index) => {
                  const isOpen = activeAccordion === index;
                  return (
                    <div key={index} className="pt-4">
                      <button
                        onClick={() => setActiveAccordion(isOpen ? -1 : index)}
                        className="w-full flex items-center justify-between text-left font-bold text-sm sm:text-base text-zinc-950 hover:text-indigo-600 transition-colors cursor-pointer py-1"
                      >
                        <span>{item.title}</span>
                        <span className="text-zinc-400 font-mono text-base">
                          {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                        </span>
                      </button>
                      {isOpen && (
                        <p className="mt-2 text-xs sm:text-sm text-zinc-500 leading-relaxed pr-6">
                          {item.desc}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Live Interactive "Syndicate Room" Card Mockup */}
            <div className="rounded-3xl p-5 sm:p-7 bg-white border border-zinc-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-150">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-zinc-950">Syndicate Room &amp; Deal Partners</span>
                </div>
                <span className="text-[11px] font-mono text-zinc-400">{invites.length} verified members</span>
              </div>

              {/* Add email input */}
              <form onSubmit={handleAddInvite} className="mt-4 flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="email"
                    placeholder="Invite Founder or Co-Investor..."
                    value={newInviteEmail}
                    onChange={(e) => setNewInviteEmail(e.target.value)}
                    className="w-full h-9 pl-3 pr-8 text-xs rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-indigo-500"
                  />
                  <button type="submit" className="absolute right-2 top-2 text-zinc-400 hover:text-indigo-600">
                    <Plus size={14} />
                  </button>
                </div>
              </form>

              {/* Invites Table List */}
              <div className="mt-4 divide-y divide-zinc-100">
                {invites.map((inv) => (
                  <div key={inv.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img src={inv.avatar} alt={inv.name} className="w-8 h-8 rounded-full object-cover border border-zinc-200 shrink-0" />
                      <div className="min-w-0">
                        <div className="font-semibold text-zinc-950 truncate">{inv.name}</div>
                        <div className="text-[10px] text-zinc-400 truncate">{inv.role}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        inv.status === 'Verified' ? 'bg-emerald-100 text-emerald-700' :
                        inv.status === 'Sent' ? 'bg-blue-100 text-blue-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {inv.status}
                      </span>
                      <button
                        onClick={() => handleSendInvite(inv.id)}
                        className="px-2.5 py-1 rounded-lg bg-[#5B63EE] hover:bg-indigo-600 text-white text-[10px] font-bold transition-colors cursor-pointer"
                      >
                        {inv.status === 'Sent' ? 'Resend' : 'Send Invite'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Create Syndicate Link Button */}
              <button
                onClick={() => alert("Syndicate deal room link copied: https://connectupng.com/syndicate/venture-room")}
                className="mt-6 w-full py-2.5 rounded-xl bg-[#5B63EE] hover:bg-indigo-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer text-center"
              >
                Generate Deal Room Passcode
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. ATMOSPHERIC SKY BANNER ("Why ConnectUp / Benefits") */}
      {/* ========================================================= */}
      <section id="why-us" className="relative py-24 sm:py-32 overflow-hidden bg-gradient-to-b from-[#0284C7] via-[#38BDF8] to-[#BAE6FD] text-center">
        
        {/* Soft cloud backdrop */}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent pointer-events-none opacity-80" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Unboxed Monospace Category Kicker */}
          <p className="text-[11px] font-mono uppercase tracking-widest text-sky-100 font-semibold mb-2">
            Venture Velocity &middot; Why ConnectUp
          </p>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-3xl mx-auto drop-shadow-xs">
            Connecting Visionary Founders With Strategic Capital
          </h2>

          {/* 4 Glass Cards Grid */}
          <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            
            {/* Benefit 1 */}
            <div className="p-5 rounded-2xl bg-white/85 backdrop-blur-md border border-white/60 shadow-md">
              <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center font-bold text-sm mb-3">
                <TrendingUp size={16} />
              </div>
              <h4 className="text-sm font-bold text-zinc-950">High-Signal Matching</h4>
              <p className="mt-1 text-xs text-zinc-600 leading-relaxed">
                Smart deal flow filtering pairs founders directly with thesis-aligned VCs, eliminating cold pitch noise.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="p-5 rounded-2xl bg-white/85 backdrop-blur-md border border-white/60 shadow-md">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm mb-3">
                <Users size={16} />
              </div>
              <h4 className="text-sm font-bold text-zinc-950">Direct Founder Visibility</h4>
              <p className="mt-1 text-xs text-zinc-600 leading-relaxed">
                Put your company in front of partners writing $50k to $5M checks across pre-seed to Series B.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="p-5 rounded-2xl bg-white/85 backdrop-blur-md border border-white/60 shadow-md">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm mb-3">
                <Layers size={16} />
              </div>
              <h4 className="text-sm font-bold text-zinc-950">Global Tech Ecosystem</h4>
              <p className="mt-1 text-xs text-zinc-600 leading-relaxed">
                Connecting innovation hubs from Lagos, Nairobi, and Cairo to London, San Francisco, and New York.
              </p>
            </div>

            {/* Benefit 4 */}
            <div className="p-5 rounded-2xl bg-white/85 backdrop-blur-md border border-white/60 shadow-md">
              <div className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-600 flex items-center justify-center font-bold text-sm mb-3">
                <Shield size={16} />
              </div>
              <h4 className="text-sm font-bold text-zinc-950">Bank-Grade Due Diligence</h4>
              <p className="mt-1 text-xs text-zinc-600 leading-relaxed">
                Your pitch decks, term sheets, and investor dossiers are protected with industry-standard encryption.
              </p>
            </div>

          </div>

          {/* Centered CTA */}
          <div className="mt-10">
            <button
              onClick={onLoginClick}
              className="px-8 py-3.5 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs sm:text-sm shadow-xl transition-all active:scale-95 cursor-pointer"
            >
              Get Started for Free
            </button>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. TESTIMONIALS BENTO GRID ("Loved by Teams that Value Their Time") */}
      {/* ========================================================= */}
      <section id="testimonials" className="py-20 sm:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Unboxed Monospace Category Kicker */}
          <p className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 font-semibold mb-2">
            Track Record &middot; Voices of Conviction
          </p>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-zinc-950 tracking-tight">
            Loved by Founders &amp; Investors<br />Worldwide
          </h2>

          {/* 5-Card Bento Grid (2 top, 3 bottom) */}
          <div className="mt-12 sm:mt-16 space-y-4 text-left">
            
            {/* Top Row: 2 Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200/80 shadow-2xs flex flex-col justify-between">
                <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed font-medium">
                  "Build something investors can already see customers using. ConnectUp streamlines this narrative better than any standard deck."
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <img src="https://www.lagoonhospitals.com/wp-content/uploads/2022/11/GB.jpg" alt="GB" className="w-10 h-10 rounded-full object-cover border border-zinc-200" />
                  <div>
                    <div className="font-bold text-xs text-zinc-950">Olugbenga Agboola</div>
                    <div className="text-[10px] text-zinc-500">Founder &amp; CEO, Flutterwave</div>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200/80 shadow-2xs flex flex-col justify-between">
                <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed font-medium">
                  "Clarity in storytelling matters. ConnectUp eliminates the noise of endless cold emails and brings founders and VCs into high-conviction alignment."
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <img src="https://fastly.restofworld.org/uploads/2022/05/Africa-SholaAkinladePressKit-EDITED.png?width=300&dpr=2&crop=1:1" alt="Shola" className="w-10 h-10 rounded-full object-cover border border-zinc-200" />
                  <div>
                    <div className="font-bold text-xs text-zinc-950">Shola Akinlade</div>
                    <div className="text-[10px] text-zinc-500">Founder &amp; CEO, Paystack</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row: 3 Cards (middle card features soft lavender/indigo wash) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200/80 shadow-2xs flex flex-col justify-between">
                <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed font-medium">
                  "Investors invest in people first before products. This platform elevates founder authenticity and execution proof."
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <img src="https://fastly.restofworld.org/uploads/2022/05/Africa-IyinoluwaAboyejiCourtesy-EDITED.png?width=300&dpr=2&crop=1:1" alt="Iyinoluwa" className="w-10 h-10 rounded-full object-cover border border-zinc-200" />
                  <div>
                    <div className="font-bold text-xs text-zinc-950">Iyinoluwa Aboyeji</div>
                    <div className="text-[10px] text-zinc-500">Founder, Future Africa</div>
                  </div>
                </div>
              </div>

              {/* Accent Lavender/Indigo Wash Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50/80 to-purple-100/50 border border-indigo-100 shadow-2xs flex flex-col justify-between">
                <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed font-medium">
                  "We discovered two of our most promising portfolio founders through ConnectUp's curated swipe queue within 48 hours."
                </p>
                <div className="mt-6">
                  <div className="font-bold text-xs text-zinc-950">Managing Partner</div>
                  <div className="text-[10px] text-zinc-500">Early-Stage Seed Fund</div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200/80 shadow-2xs flex flex-col justify-between">
                <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed font-medium">
                  "The interactive pitch deck analytics showed us exactly what slides angels were spending time on, helping us iterate to close our round."
                </p>
                <div className="mt-6">
                  <div className="font-bold text-xs text-zinc-950">Tech Founder</div>
                  <div className="text-[10px] text-zinc-500">AI Health Startup</div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. PRICING SECTION (CONNECTUP PLANS: FREE & PRO) */}
      {/* ========================================================= */}
      <section id="pricing" className="py-20 sm:py-28 bg-[#FAFAFA] border-y border-zinc-200/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Unboxed Monospace Category Kicker */}
          <p className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 font-semibold mb-2">
            Membership &middot; Transparent Terms
          </p>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-zinc-950 tracking-tight">
            Simple Pricing that<br />Scales with Your Ambition
          </h2>

          <p className="mt-3 text-xs sm:text-sm text-zinc-500 max-w-md mx-auto">
            Choose the membership that accelerates your capital raise or syndicate pipeline.
          </p>

          {/* Monthly / Yearly Toggle */}
          <div className="mt-8 inline-flex items-center gap-2 p-1 rounded-full bg-zinc-200/80 border border-zinc-300/50">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                billingCycle === 'monthly' ? 'bg-zinc-950 text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                billingCycle === 'yearly' ? 'bg-zinc-950 text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              <span>Yearly</span>
              <span className="px-1.5 py-0.2 rounded-full bg-blue-500 text-white text-[9px] font-mono">20% off</span>
            </button>
          </div>

          {/* 3-Column Pricing Cards */}
          <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
            
            {/* Starter (Free) */}
            <div className="p-6 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold text-zinc-400 uppercase font-mono">Free Access</div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-zinc-950">$0</span>
                  <span className="text-xs text-zinc-400">/month</span>
                </div>
                <p className="mt-1 text-xs text-zinc-500">Standard networking and active deal exploration</p>

                <button
                  onClick={onLoginClick}
                  className="mt-6 w-full py-2.5 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-zinc-900 font-bold text-xs transition-colors cursor-pointer text-center"
                >
                  Get Started Free
                </button>

                <div className="mt-6 space-y-2.5 pt-6 border-t border-zinc-150 text-xs text-zinc-600 font-medium">
                  <div className="text-[10px] font-mono uppercase text-zinc-400 mb-1">Features Included</div>
                  <div className="flex items-center gap-2"><span>✓ 1 Pitch / Startup Listing</span></div>
                  <div className="flex items-center gap-2"><span>✓ Standard Profile Listing</span></div>
                  <div className="flex items-center gap-2"><span>✓ Limited direct messaging</span></div>
                  <div className="flex items-center gap-2"><span>✓ Basic matching &amp; swipe deck</span></div>
                  <div className="flex items-center gap-2 text-zinc-400"><span>✕ Verified Pro badge</span></div>
                </div>
              </div>
            </div>

            {/* Pro Connect ($5/month or $29/year) - POPULAR */}
            <div className="p-6 rounded-2xl bg-white border-2 border-amber-400 shadow-md flex flex-col justify-between relative">
              <div className="absolute -top-3 right-6 px-2.5 py-0.5 rounded-full bg-amber-400 text-zinc-950 text-[9px] font-black uppercase tracking-wider">
                Popular
              </div>

              <div>
                <div className="text-xs font-bold text-amber-600 uppercase font-mono">Pro Connect</div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-zinc-950">
                    {billingCycle === 'yearly' ? '$29' : '$5'}
                  </span>
                  <span className="text-xs text-zinc-400">
                    {billingCycle === 'yearly' ? '/year' : '/month'}
                  </span>
                </div>
                <p className="mt-1 text-xs text-zinc-500">Unleash elite matchmaking and priority partner discovery</p>

                <button
                  onClick={onLoginClick}
                  className="mt-6 w-full py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs shadow-md transition-colors cursor-pointer text-center"
                >
                  Upgrade to Pro
                </button>

                <div className="mt-6 space-y-2.5 pt-6 border-t border-zinc-150 text-xs text-zinc-700 font-medium">
                  <div className="text-[10px] font-mono uppercase text-zinc-400 mb-1">Everything in Free, plus:</div>
                  <div className="flex items-center gap-2"><span>✓ Up to 2 Pitches / Startup Listings</span></div>
                  <div className="flex items-center gap-2"><span>✓ Full Community Feed &amp; Posting</span></div>
                  <div className="flex items-center gap-2"><span>✓ Verified Pro Founder/Investor Badge</span></div>
                  <div className="flex items-center gap-2"><span>✓ Interactive strategy &amp; pitch simulator</span></div>
                  <div className="flex items-center gap-2"><span>✓ Priority algorithmic matchmaking</span></div>
                </div>
              </div>
            </div>

            {/* Enterprise / Syndicate Tier ($29/month) */}
            <div className="p-6 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold text-zinc-400 uppercase font-mono">Syndicate &amp; Funds</div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-zinc-950">$29</span>
                  <span className="text-xs text-zinc-400">/month</span>
                </div>
                <p className="mt-1 text-xs text-zinc-500">For active venture funds, angels, and syndicate leads</p>

                <button
                  onClick={onLoginClick}
                  className="mt-6 w-full py-2.5 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-zinc-900 font-bold text-xs transition-colors cursor-pointer text-center"
                >
                  Contact Syndicate Sales
                </button>

                <div className="mt-6 space-y-2.5 pt-6 border-t border-zinc-150 text-xs text-zinc-600 font-medium">
                  <div className="text-[10px] font-mono uppercase text-zinc-400 mb-1">Institutional Features</div>
                  <div className="flex items-center gap-2"><span>✓ Unlimited Pitch Data Rooms</span></div>
                  <div className="flex items-center gap-2"><span>✓ Dedicated VC scout liaison</span></div>
                  <div className="flex items-center gap-2"><span>✓ Custom SAFE &amp; Term Sheet integrations</span></div>
                  <div className="flex items-center gap-2"><span>✓ Town Hall Salon Priority Hosting</span></div>
                  <div className="flex items-center gap-2"><span>✓ Multi-Seat Analyst logins</span></div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 7. FAQ ACCORDION SECTION (CONNECTUP FORMER FAQ DETAILS) */}
      {/* ========================================================= */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* Left Column: Heading and Contact Us */}
            <div className="lg:col-span-5 text-left">
              {/* Unboxed Monospace Category Kicker */}
              <p className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 font-semibold mb-2">
                Common Inquiries &middot; Clarity
              </p>

              <h2 className="text-3xl sm:text-5xl font-extrabold text-zinc-950 tracking-tight leading-tight">
                Answers to Your Most Common Questions
              </h2>

              <p className="mt-4 text-xs sm:text-sm text-zinc-500 leading-relaxed max-w-sm">
                Learn more about how ConnectUp matches founders and VCs, safeguards pitch materials, and accelerates capital deployment.
              </p>

              <button
                onClick={onNavigateToContact || onLoginClick}
                className="mt-8 px-6 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                Contact Concierge
              </button>
            </div>

            {/* Right Column: Accordion Questions */}
            <div className="lg:col-span-7 divide-y divide-zinc-200/80 text-left">
              {[
                {
                  q: 'What makes ConnectUp different from other matching solutions?',
                  a: 'ConnectUp integrates algorithmic matching with verified founder and investor credentials, ensuring every connection satisfies stage, thesis, and sector demands. We eliminate cold email spam with high-conviction deal signals.'
                },
                {
                  q: 'What stages and cheque sizes are supported on the platform?',
                  a: 'ConnectUp supports pre-seed through Series B funding rounds, connecting startups with angel syndicates, family offices, and institutional VCs deploying $50k to $5M+ per ticket.'
                },
                {
                  q: 'How quickly can founders start connecting with active investors?',
                  a: 'Once your profile and pitch room are completed, our matching engine activates immediately, surfacing high-intent investor introductions within 24 to 48 hours.'
                },
                {
                  q: 'How does ConnectUp safeguard pitch decks and cap tables?',
                  a: 'We prioritize bank-grade encryption, authenticated investor profiles, and customizable NDA or permission gates to protect proprietary IP and financials.'
                },
                {
                  q: 'Can I cancel or upgrade my subscription anytime?',
                  a: 'Yes. There are no lock-in contracts. You can seamlessly switch between Free Access, Pro Connect, or cancel anytime from your settings panel.'
                }
              ].map((faq, index) => {
                const isOpen = activeFaq === index;
                return (
                  <div key={index} className="py-4">
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : index)}
                      className="w-full flex items-center justify-between font-bold text-sm sm:text-base text-zinc-950 hover:text-indigo-600 transition-colors cursor-pointer py-1"
                    >
                      <span>{faq.q}</span>
                      <span className="text-zinc-400 font-mono text-base">
                        {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                      </span>
                    </button>
                    {isOpen && (
                      <p className="mt-2 text-xs sm:text-sm text-zinc-500 leading-relaxed pr-6">
                        {faq.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 8. BOTTOM ATMOSPHERIC CLOUD CTA BANNER */}
      {/* ========================================================= */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto rounded-3xl p-8 sm:p-16 text-center relative overflow-hidden bg-gradient-to-b from-[#0284C7] via-[#38BDF8] to-[#BAE6FD] shadow-xl">
          
          {/* Subtle cloud mist at base */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight drop-shadow-xs">
              Empower Your Startup With Smarter Venture Matching.
            </h2>
            <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-white/90 leading-relaxed font-medium">
              Start meeting thesis-aligned capital allocators, analyzing pitch engagement, and closing rounds on a platform built for modern founders.
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={onLoginClick}
                className="px-6 sm:px-7 py-3 rounded-full bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
              >
                Get Started for Free
              </button>
              <button
                onClick={() => setIsVideoModalOpen(true)}
                className="px-6 sm:px-7 py-3 rounded-full bg-white hover:bg-zinc-50 text-zinc-950 font-bold text-xs sm:text-sm shadow-sm border border-white/80 transition-all active:scale-95 cursor-pointer"
              >
                Watch Pitch Tour
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 9. EXECUTIVE DARK FOOTER WITH WATERMARK BRANDING */}
      {/* ========================================================= */}
      <footer className="w-full bg-[#0B0C10] text-zinc-400 pt-16 pb-8 overflow-hidden relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-16 border-b border-zinc-800/80">
            
            {/* Left Column: Newsletter & Tagline */}
            <div className="md:col-span-5 space-y-4 text-left">
              <div className="flex items-center gap-2 text-white">
                <ConnectUpIcon className="w-5 h-5" />
                <span className="font-black text-xl tracking-tight">Connect<span className="text-amber-400">Up</span></span>
              </div>
              <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
                The fluid ecosystem for visionaries. Raise faster, evaluate pitch decks with algorithmic precision, and connect with global venture capital.
              </p>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (emailSubscription.trim()) {
                    setIsSubscribed(true);
                  }
                }}
                className="pt-2"
              >
                <div className="text-[11px] font-mono text-zinc-400 mb-1.5">Join Our Venture Dispatch</div>
                <div className="flex items-center max-w-sm rounded-xl bg-zinc-900 border border-zinc-800 p-1">
                  <input
                    type="email"
                    placeholder="founder@startup.com"
                    value={emailSubscription}
                    onChange={(e) => setEmailSubscription(e.target.value)}
                    className="flex-1 bg-transparent px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    {isSubscribed ? 'Subscribed!' : 'Subscribe'}
                  </button>
                </div>
              </form>

              <div className="pt-2 text-[11px] text-zinc-500 font-mono">
                © {new Date().getFullYear()} ConnectUp. All rights reserved.
              </div>

              {/* Social icons */}
              <div className="flex items-center gap-3 pt-2 text-xs text-zinc-400">
                <span>Follow Ecosystem:</span>
                <span className="w-6 h-6 rounded-full bg-zinc-900 flex items-center justify-center hover:text-white cursor-pointer transition-colors">🌐</span>
                <span className="w-6 h-6 rounded-full bg-zinc-900 flex items-center justify-center hover:text-white cursor-pointer transition-colors">𝕏</span>
                <span className="w-6 h-6 rounded-full bg-zinc-900 flex items-center justify-center hover:text-white cursor-pointer transition-colors">💼</span>
              </div>
            </div>

            {/* Right Column: 3 Link Columns */}
            <div className="md:col-span-7 grid grid-cols-3 gap-6 text-xs text-left">
              <div>
                <h5 className="font-bold text-white mb-3">Ecosystem</h5>
                <ul className="space-y-2">
                  <li><a href="#features" className="hover:text-white transition-colors">Founders</a></li>
                  <li><a href="#features" className="hover:text-white transition-colors">Angel Investors</a></li>
                  <li><a href="#features" className="hover:text-white transition-colors">Venture Funds</a></li>
                  <li><a href="#features" className="hover:text-white transition-colors">Syndicate Rooms</a></li>
                  <li><a href="#how-it-works" className="hover:text-white transition-colors">Town Hall Stage</a></li>
                </ul>
              </div>

              <div>
                <h5 className="font-bold text-white mb-3">Product</h5>
                <ul className="space-y-2">
                  <li><a href="#features" className="hover:text-white transition-colors">Deal Engine</a></li>
                  <li><a href="#features" className="hover:text-white transition-colors">Pitch Simulator</a></li>
                  <li><a href="#pricing" className="hover:text-white transition-colors">Pro Membership</a></li>
                  <li><a href="#features" className="hover:text-white transition-colors">Paystack Checkout</a></li>
                  <li><a href="#why-us" className="hover:text-white transition-colors">Security &amp; SAFE</a></li>
                </ul>
              </div>

              <div>
                <h5 className="font-bold text-white mb-3">Company</h5>
                <ul className="space-y-2">
                  <li><a href="#why-us" className="hover:text-white transition-colors">About ConnectUp</a></li>
                  <li><a href="#testimonials" className="hover:text-white transition-colors">Portfolio Stories</a></li>
                  {onNavigateToBlog && (
                    <li>
                      <button onClick={onNavigateToBlog} className="hover:text-white transition-colors cursor-pointer">
                        Editorial Blog
                      </button>
                    </li>
                  )}
                  <li>
                    <button 
                      onClick={onNavigateToContact || onLoginClick}
                      className="hover:text-white transition-colors cursor-pointer"
                    >
                      Contact Support
                    </button>
                  </li>
                  {onAdminLoginClick && (
                    <li className="pt-2">
                      <button 
                        onClick={onAdminLoginClick}
                        className="text-amber-400 hover:text-amber-300 transition-colors cursor-pointer font-mono text-[10px] flex items-center gap-1"
                      >
                        <span>Admin Portal</span>
                        <ChevronRight size={10} />
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            </div>

          </div>

          {/* MASSIVE GLOWING WATERMARK BRANDING */}
          <div className="pt-12 select-none pointer-events-none text-center">
            <h1 className="text-6xl sm:text-8xl md:text-[12rem] font-black tracking-tighter text-white/[0.04] leading-none drop-shadow-sm">
              ConnectUp
            </h1>
          </div>

        </div>
      </footer>

      {/* Interactive Video Demo Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-3xl rounded-3xl bg-zinc-950 border border-zinc-800 p-6 text-white shadow-2xl">
            <button
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs font-mono font-bold text-amber-400 uppercase">ConnectUp Deal Flow Tour</span>
            </div>
            <h3 className="text-xl font-bold">Connecting Founders &amp; VCs in High-Conviction Flow</h3>
            <p className="text-xs text-zinc-400 mt-1 mb-6">
              Watch how modern founders showcase pitch decks and receive direct investor allocations in under 48 hours.
            </p>
            <div className="aspect-video w-full rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center relative overflow-hidden">
              <div className="text-center space-y-3">
                <div 
                  onClick={onLoginClick}
                  className="w-16 h-16 rounded-full bg-[#FACC15] text-zinc-950 flex items-center justify-center mx-auto shadow-xl cursor-pointer hover:scale-105 transition-transform"
                >
                  <Play size={24} className="ml-1 fill-zinc-950" />
                </div>
                <p className="text-xs text-zinc-400 font-mono">Click to launch interactive walkthrough</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}