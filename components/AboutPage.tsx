import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, ArrowUpRight, Sparkles, Target, Zap, Shield, 
  Users, Globe, Award, TrendingUp, Heart, CheckCircle2,
  Building2, Rocket, Play, Layers, Compass, BarChart3, Quote
} from 'lucide-react';
import { LandingNavbar, NavPage } from './LandingNavbar';
import FooterSection5 from './ui/footer-section-5';
import { ConnectUpLogo, ConnectUpIcon } from './ui/ConnectUpLogo';

import investorsAndFounders from '@/src/assets/images/investors_and_founders_1_1785147760772.jpg';
import ventureTech from '@/src/assets/images/venture_connection_tech_1784549043938.jpg';
import smartMatching from '@/src/assets/images/smart_matching_investment_1784549068657.jpg';
import goldenGate from '@/src/assets/images/golden_gate_bridge_1785141940553.jpg';
import foundersSummit from '@/src/assets/images/founders_summit_2_1785147774377.jpg';
import worldModelAi from '@/src/assets/images/world_model_ai_1785704586218.jpg';

interface AboutPageProps {
  onBackHome?: () => void;
  onLoginClick?: () => void;
  onNavigateToBlog?: () => void;
  onNavigateToContact?: () => void;
  onNavigateToSection?: (section: NavPage) => void;
  onLegalView?: (view: 'privacy' | 'terms') => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onBackHome,
  onLoginClick,
  onNavigateToBlog,
  onNavigateToContact,
  onNavigateToSection,
  onLegalView
}) => {
  const [activeTab, setActiveTab] = useState<'mission' | 'vision' | 'story'>('mission');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const handleNavigate = (page: NavPage) => {
    if (page === 'about') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (page === 'blog') {
      if (onNavigateToBlog) {
        onNavigateToBlog();
      } else {
        try {
          window.history.pushState({}, '', '/blog');
        } catch {
          window.location.hash = '#blog';
        }
        window.location.reload();
      }
      return;
    }
    if (page === 'contact') {
      if (onNavigateToContact) {
        onNavigateToContact();
      } else {
        try {
          window.history.pushState({}, '', '/contact');
        } catch {
          window.location.hash = '#contact';
        }
        window.location.reload();
      }
      return;
    }

    if (onNavigateToSection) {
      onNavigateToSection(page);
    } else if (onBackHome) {
      onBackHome();
    } else {
      try {
        window.history.pushState({}, '', page === 'home' ? '/home' : `/home#${page}`);
      } catch {
        window.location.hash = `#${page}`;
      }
      window.location.reload();
    }
  };

  const stats = [
    { label: "Direct Venture Matches", value: "14,800+", change: "+148% QoQ", desc: "Algorithmic precision matching" },
    { label: "Syndicate Capital Deployed", value: "$420M+", change: "Over 68 funds", desc: "Verified institutional tickets" },
    { label: "Average Time to Term Sheet", value: "19 Days", change: "vs 4.2 mo. average", desc: "Eliminating dead-end wait times" },
    { label: "Global Founder Community", value: "32,000+", change: "Across 44 countries", desc: "Top 1% elite builders" }
  ];

  const leadership = [
    {
      name: "Tariq Vance",
      role: "Co-Founder & CEO",
      bio: "Ex-general partner & 2x founder. Scaled early-stage venture syndicates across North America and Europe.",
      image: investorsAndFounders
    },
    {
      name: "Elena Rostova",
      role: "Head of AI & Matching Architecture",
      bio: "Former ML lead specializing in algorithmic venture matching, graph semantics, and real-time deal discovery.",
      image: worldModelAi
    },
    {
      name: "Marcus Sterling",
      role: "Head of Investor Relations",
      bio: "Built tier-1 LP relations across institutional sovereign wealth funds and sovereign angel networks.",
      image: foundersSummit
    }
  ];

  const milestones = [
    {
      year: "2023",
      title: "The Friction Point",
      desc: "ConnectUp was born out of frustration with 6-month opaque cold email marathons. We built the first high-conviction micro-pitch deck format."
    },
    {
      year: "2024",
      title: "Algorithmic Deal Syndication",
      desc: "Launched our real-time matching engine, cutting the founder-investor discovery cycle from 120 days down to under 3 weeks."
    },
    {
      year: "2025",
      title: "Global Venture Network",
      desc: "Expanded into 44+ countries, with institutional syndicates and top angel networks actively deploying daily."
    },
    {
      year: "2026",
      title: "The Next Era of Capital",
      desc: "Introducing real-time pitch live-simulation, automated RLS database sync, and high-velocity founder town halls."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-zinc-100 flex flex-col font-sans selection:bg-[#FFBF00] selection:text-black relative overflow-x-hidden">
      
      {/* Immersive Glow Backgrounds */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] opacity-25 blur-[150px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 20%, rgba(255, 191, 0, 0.35) 0%, rgba(245, 158, 11, 0.1) 50%, transparent 75%)'
          }}
        />
        <div className="absolute top-[900px] right-[-200px] w-[600px] h-[600px] bg-purple-600/15 blur-[160px] rounded-full pointer-events-none" />
        <div className="absolute top-[1800px] left-[-200px] w-[600px] h-[600px] bg-amber-500/10 blur-[160px] rounded-full pointer-events-none" />
      </div>

      {/* Landing Navbar in Dark Mode */}
      <LandingNavbar
        currentPage="about"
        onNavigate={handleNavigate}
        onLoginClick={onLoginClick || (() => {})}
        lightMode={false}
      />

      {/* Hero Section */}
      <section className="relative z-10 pt-36 sm:pt-44 pb-20 sm:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[#FFBF00] text-xs font-bold uppercase tracking-[0.2em] mb-6 shadow-lg shadow-amber-500/5 backdrop-blur-md"
          >
            <Sparkles size={14} className="text-[#FFBF00] fill-[#FFBF00]" />
            About ConnectUp • The Sovereign Capital Protocol
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-7xl md:text-8xl font-black text-white tracking-tight leading-[1.04] mb-8"
          >
            Accelerating <br />
            <span className="bg-gradient-to-r from-amber-200 via-[#FFBF00] to-amber-500 bg-clip-text text-transparent italic font-serif font-light">Human Ambition.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-2xl text-zinc-400 font-light max-w-3xl leading-relaxed mb-10"
          >
            We are replacing obsolete cold outreach and backchannel bias with instant, thesis-aligned venture connections — empowering the best founders to meet the right capital at lightning speed.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <button
              onClick={onLoginClick}
              className="px-8 py-4 bg-[#FFBF00] hover:bg-amber-400 text-zinc-950 rounded-full font-black uppercase tracking-[0.15em] text-xs transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,191,0,0.3)] flex items-center gap-2 cursor-pointer"
            >
              <span>Join ConnectUp</span>
              <ArrowRight size={16} className="text-zinc-950" />
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('our-story');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-4 bg-zinc-900/80 hover:bg-zinc-800 text-white border border-zinc-800 rounded-full font-bold text-xs uppercase tracking-wider transition-all backdrop-blur-md cursor-pointer"
            >
              Explore Our Story
            </button>
          </motion.div>
        </div>

        {/* Feature Collage Banner */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 sm:mt-24 relative rounded-[2.5rem] overflow-hidden border border-zinc-800 shadow-[0_30px_100px_rgba(0,0,0,0.8)] bg-zinc-950"
        >
          <div className="relative aspect-[21/9] min-h-[320px] sm:min-h-[480px] w-full overflow-hidden">
            <img
              src={goldenGate}
              alt="ConnectUp Headquarters & Global Reach"
              className="w-full h-full object-cover object-center filter brightness-[0.85] contrast-[1.05]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-[#0A0A0C]/40 to-transparent" />
            
            <div className="absolute bottom-6 sm:bottom-12 left-6 sm:left-12 right-6 sm:right-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6 text-white">
              <div className="max-w-xl">
                <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#FFBF00] mb-2 block">
                  Built For Builders
                </span>
                <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                  Where high-conviction founders and top-decile investors meet.
                </h3>
              </div>
              <div className="flex items-center gap-3 shrink-0 bg-zinc-900/80 backdrop-blur-md px-5 py-3 rounded-2xl border border-zinc-800">
                <div className="flex -space-x-2">
                  <span className="w-10 h-10 rounded-full border-2 border-zinc-900 bg-[#FFBF00] flex items-center justify-center font-black text-xs text-black">CU</span>
                  <span className="w-10 h-10 rounded-full border-2 border-zinc-900 bg-zinc-800 flex items-center justify-center font-bold text-xs text-white">VC</span>
                  <span className="w-10 h-10 rounded-full border-2 border-zinc-900 bg-purple-600 flex items-center justify-center font-bold text-xs text-white">LP</span>
                </div>
                <div className="text-left text-xs">
                  <p className="font-extrabold text-white">Active Deal Flow</p>
                  <p className="text-zinc-400">Verified Capital Only</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Metrics Row */}
      <section className="relative z-10 py-16 bg-zinc-950/60 border-y border-zinc-800/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 rounded-3xl bg-zinc-900/50 border border-zinc-800/80 hover:border-amber-500/40 transition-all group"
              >
                <div className="text-3xl sm:text-5xl font-black text-white tracking-tight font-sans mb-1 group-hover:text-[#FFBF00] transition-colors">
                  {stat.value}
                </div>
                <div className="text-sm font-bold text-zinc-300 mb-2">
                  {stat.label}
                </div>
                <div className="flex items-center justify-between text-xs pt-3 border-t border-zinc-800">
                  <span className="text-[#FFBF00] font-bold">{stat.change}</span>
                  <span className="text-zinc-500">{stat.desc}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Tabs Section (Mission / Vision / Story) */}
      <section id="our-story" className="relative z-10 py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs tracking-[0.25em] font-bold uppercase text-[#FFBF00] bg-amber-500/10 border border-amber-500/20 px-4 py-1.5 rounded-full inline-block mb-4">
            Core Architecture
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-6">
            Engineered for High-Velocity Venture Success
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg font-light">
            Explore the foundational pillars that drive our protocol and separate ConnectUp from legacy fundraising networks.
          </p>

          <div className="flex items-center gap-2 p-1.5 rounded-full bg-zinc-900 border border-zinc-800 mt-8">
            {(['mission', 'vision', 'story'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'bg-[#FFBF00] text-zinc-950 shadow-md shadow-amber-500/20'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <AnimatePresence mode="wait">
              {activeTab === 'mission' && (
                <motion.div
                  key="mission"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6 p-8 rounded-[2.5rem] bg-zinc-900/60 border border-zinc-800 backdrop-blur-xl"
                >
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-[#FFBF00]">
                    <Target size={24} />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white">Our Mission: Zero Friction Capital Discovery</h3>
                  <p className="text-zinc-300 font-light leading-relaxed">
                    We believe brilliant founders should spend 95% of their time building world-class products and 5% securing capital — not the other way around. By pairing algorithmic matching with direct investor mandates, we collapse months of tedious networking into days of high-conviction meetings.
                  </p>
                  <ul className="space-y-3 pt-4 border-t border-zinc-800 text-sm text-zinc-300">
                    <li className="flex items-center gap-3">
                      <CheckCircle2 size={18} className="text-[#FFBF00] shrink-0" />
                      <span>Verified angel syndicates and tier-1 VC funds only</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 size={18} className="text-[#FFBF00] shrink-0" />
                      <span>Instant feedback loops and transparent term-sheet tracking</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 size={18} className="text-[#FFBF00] shrink-0" />
                      <span>Autonomous micro-pitch review with real-time deal scoring</span>
                    </li>
                  </ul>
                </motion.div>
              )}

              {activeTab === 'vision' && (
                <motion.div
                  key="vision"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6 p-8 rounded-[2.5rem] bg-zinc-900/60 border border-zinc-800 backdrop-blur-xl"
                >
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <Compass size={24} />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white">Our Vision: The Global Liquidity Layer for Venture</h3>
                  <p className="text-zinc-300 font-light leading-relaxed">
                    Geographic borders and elite alumni networks should never dictate which startups get funded. We are building the sovereign global protocol where capital flows instantly to high-impact founders anywhere on Earth, powered by transparent data and real-time verification.
                  </p>
                  <ul className="space-y-3 pt-4 border-t border-zinc-800 text-sm text-zinc-300">
                    <li className="flex items-center gap-3">
                      <CheckCircle2 size={18} className="text-purple-400 shrink-0" />
                      <span>Border-agnostic syndicate syndication across 44+ countries</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 size={18} className="text-purple-400 shrink-0" />
                      <span>Encrypted data rooms with institutional-grade security</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 size={18} className="text-purple-400 shrink-0" />
                      <span>Decentralized sovereign angel syndicates and family offices</span>
                    </li>
                  </ul>
                </motion.div>
              )}

              {activeTab === 'story' && (
                <motion.div
                  key="story"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6 p-8 rounded-[2.5rem] bg-zinc-900/60 border border-zinc-800 backdrop-blur-xl"
                >
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-[#FFBF00]">
                    <Rocket size={24} />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white">Our Story: From Frustration to Protocol</h3>
                  <p className="text-zinc-300 font-light leading-relaxed">
                    Founded in San Francisco by repeat founders and venture investors who experienced firsthand the endless loop of lukewarm intros and ignored emails. We set out to build the tool we always wished existed: precise, fast, and uncompromisingly direct.
                  </p>
                  <ul className="space-y-3 pt-4 border-t border-zinc-800 text-sm text-zinc-300">
                    <li className="flex items-center gap-3">
                      <CheckCircle2 size={18} className="text-[#FFBF00] shrink-0" />
                      <span>Launched in 2023 with 50 elite founders and 10 angel syndicates</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 size={18} className="text-[#FFBF00] shrink-0" />
                      <span>Scaled to over $420M+ in deployment volume across 68 partner funds</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 size={18} className="text-[#FFBF00] shrink-0" />
                      <span>Backed by top-tier venture partners and global angel syndicates</span>
                    </li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative rounded-[2.5rem] overflow-hidden border border-zinc-800 shadow-2xl bg-zinc-950 aspect-[4/3]">
              <img
                src={ventureTech}
                alt="ConnectUp Platform Architecture"
                className="w-full h-full object-cover filter brightness-[0.85]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 p-6 rounded-2xl bg-zinc-900/90 backdrop-blur-md border border-zinc-800">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-3 h-3 rounded-full bg-[#FFBF00] animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-widest text-[#FFBF00]">Live Protocol Active</span>
                </div>
                <p className="text-sm text-zinc-300 font-light">
                  "ConnectUp changed our seed round trajectory in 14 days. We met 3 tier-1 lead investors with zero warm intros required."
                </p>
                <div className="mt-3 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
                  <span>— Sarah Jenkins, CEO @ Lumina AI</span>
                  <span className="text-[#FFBF00] font-bold">Raised $4.2M</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="relative z-10 py-24 bg-zinc-950/40 border-y border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs tracking-[0.25em] font-bold uppercase text-[#FFBF00] bg-amber-500/10 border border-amber-500/20 px-4 py-1.5 rounded-full inline-block mb-4">
              Evolution & Growth
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Milestones on the Road Ahead
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {milestones.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-8 rounded-[2rem] bg-zinc-900/60 border border-zinc-800 hover:border-amber-500/40 transition-all relative flex flex-col justify-between group"
              >
                <div>
                  <span className="text-3xl font-black text-[#FFBF00] font-serif mb-4 block">
                    {m.year}
                  </span>
                  <h4 className="text-xl font-bold text-white mb-3 group-hover:text-amber-300 transition-colors">
                    {m.title}
                  </h4>
                  <p className="text-sm text-zinc-400 font-light leading-relaxed">
                    {m.desc}
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-zinc-800 flex items-center text-xs text-zinc-500 font-bold">
                  <span>Phase 0{i + 1} Complete</span>
                  <CheckCircle2 size={14} className="text-[#FFBF00] ml-auto" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="relative z-10 py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs tracking-[0.25em] font-bold uppercase text-[#FFBF00] bg-amber-500/10 border border-amber-500/20 px-4 py-1.5 rounded-full inline-block mb-4">
            Leadership
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Backed by Veterans of Venture
          </h2>
          <p className="text-zinc-400 text-base">
            Our team combines decades of venture capital experience, machine learning architecture, and startup scaling.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {leadership.map((leader, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-[2.5rem] bg-zinc-900/60 border border-zinc-800 overflow-hidden group hover:border-amber-500/40 transition-all flex flex-col"
            >
              <div className="aspect-[4/3] w-full overflow-hidden relative">
                <img
                  src={leader.image}
                  alt={leader.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-[0.9]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
              </div>
              <div className="p-8 flex flex-col flex-grow justify-between space-y-4">
                <div>
                  <h3 className="text-2xl font-black text-white">{leader.name}</h3>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#FFBF00] mt-1 block">
                    {leader.role}
                  </span>
                  <p className="text-sm text-zinc-400 font-light mt-4 leading-relaxed">
                    {leader.bio}
                  </p>
                </div>
                <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                  <span className="text-xs text-zinc-500 font-bold">ConnectUp Founders</span>
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-[#FFBF00] group-hover:bg-[#FFBF00] group-hover:text-black transition-colors">
                    <ArrowUpRight size={16} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="rounded-[3rem] bg-gradient-to-r from-amber-500 via-amber-400 to-[#FFBF00] p-10 sm:p-16 text-zinc-950 relative overflow-hidden shadow-[0_20px_80px_rgba(255,191,0,0.3)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4)_0%,transparent_60%)] pointer-events-none" />
          <div className="relative z-10 max-w-2xl space-y-6">
            <span className="text-xs font-black uppercase tracking-[0.25em] bg-zinc-950 text-[#FFBF00] px-4 py-1.5 rounded-full inline-block">
              Ready to Accelerate?
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Join the future of high-velocity venture syndication.
            </h2>
            <p className="text-zinc-900 font-medium text-base sm:text-lg">
              Create your founder profile or investor mandate in under 3 minutes. No warm intros required.
            </p>
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={onLoginClick}
                className="px-8 py-4 bg-zinc-950 text-white rounded-full font-black uppercase tracking-[0.15em] text-xs transition-all hover:bg-zinc-800 hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <span>Get Started Now</span>
                <ArrowRight size={16} className="text-[#FFBF00]" />
              </button>
              <button
                onClick={() => {
                  if (onNavigateToContact) {
                    onNavigateToContact();
                  } else {
                    window.location.hash = '#contact';
                    window.location.reload();
                  }
                }}
                className="px-8 py-4 bg-white/80 hover:bg-white text-zinc-950 rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-sm cursor-pointer"
              >
                Contact Our Team
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <FooterSection5
        onLegalView={onLegalView || (() => {})}
        onNavigate={handleNavigate}
      />
    </div>
  );
};
