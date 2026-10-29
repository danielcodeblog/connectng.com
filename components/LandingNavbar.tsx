import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NavHeader } from './ui/nav-header';
import { ConnectUpIcon } from './ui/ConnectUpLogo';
import { ArrowRight, ChevronRight, Sparkles, X, Mail, Globe, Shield } from 'lucide-react';

export const AnimatedHamburger = ({ 
  isOpen, 
  toggle, 
  lightMode = false 
}: { 
  isOpen: boolean; 
  toggle: () => void; 
  lightMode?: boolean;
}) => (
  <button
    onClick={toggle}
    aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
    aria-expanded={isOpen}
    className={`flex flex-col justify-center items-center w-10 h-10 rounded-full transition-all duration-200 hover:bg-white/10 active:scale-95 cursor-pointer relative z-[1100] ${
      isOpen ? "text-[#FFBF00]" : lightMode ? "text-zinc-900" : "text-white"
    }`}
  >
    <span className="sr-only">Toggle Menu</span>
    {/* Top Line */}
    <span
      className={`h-[2px] bg-current rounded-full transition-all duration-300 origin-center ${
        isOpen ? "w-5 rotate-45 translate-y-[6px]" : "w-5 mb-1.5"
      }`}
    />
    {/* Middle Line */}
    <span
      className={`h-[2px] bg-current rounded-full transition-all duration-200 ${
        isOpen ? "opacity-0 w-0" : "w-3.5 ml-auto mr-2.5 mb-1.5"
      }`}
    />
    {/* Bottom Line */}
    <span
      className={`h-[2px] bg-current rounded-full transition-all duration-300 origin-center ${
        isOpen ? "w-5 -rotate-45 -translate-y-[6px]" : "w-5"
      }`}
    />
  </button>
);

export type NavPage = 'home' | 'about' | 'why' | 'founders' | 'pricing' | 'blog' | 'contact';

export interface LandingNavbarProps {
  currentPage?: NavPage | string;
  onNavigate: (page: NavPage) => void;
  onLoginClick: () => void;
  onSignUpClick?: () => void;
  isScrolled?: boolean;
  onMobileMenuToggle?: (isOpen: boolean) => void;
  lightMode?: boolean;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({
  currentPage = 'home',
  onNavigate,
  onLoginClick,
  onSignUpClick,
  isScrolled: externalScrolled,
  onMobileMenuToggle,
  lightMode: explicitLightMode,
}) => {
  const isLight = explicitLightMode !== undefined 
    ? explicitLightMode 
    : (currentPage === 'blog' || currentPage === 'contact');
    
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [internalScrolled, setInternalScrolled] = useState(false);

  useEffect(() => {
    if (externalScrolled !== undefined) return;
    const handleScroll = () => {
      setInternalScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [externalScrolled]);

  const scrolled = externalScrolled !== undefined ? externalScrolled : internalScrolled;

  useEffect(() => {
    onMobileMenuToggle?.(isMobileMenuOpen);
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen, onMobileMenuToggle]);

  const handlePageSelect = (page: NavPage) => {
    setIsMobileMenuOpen(false);
    onNavigate(page);
  };

  const navItems: { id: NavPage; label: string; desc: string; index: string }[] = [
    { id: 'home', label: 'Home', desc: 'Overview & micro-pitches', index: '01' },
    { id: 'about', label: 'About', desc: 'Our mission & deal syndication', index: '02' },
    { id: 'why', label: 'Why Us', desc: 'Precision algorithmic matching', index: '03' },
    { id: 'pricing', label: 'Pricing', desc: 'Founder & investor membership', index: '04' },
    { id: 'blog', label: 'Blog', desc: 'Venture insights & playbooks', index: '05' },
    { id: 'contact', label: 'Contact', desc: 'Partnerships & ecosystem', index: '06' },
  ];

  return (
    <>
      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className={`fixed inset-0 z-[100] flex flex-col justify-between overflow-y-auto lg:hidden px-5 py-6 ${
              isLight 
                ? 'bg-[#FDFBF7]/95 backdrop-blur-2xl text-zinc-900' 
                : 'bg-[#0D0D0F]/95 backdrop-blur-2xl text-white'
            }`}
          >
            {/* Mobile Header Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 dark:border-white/10 shrink-0">
              <div 
                className="flex items-center gap-2.5 cursor-pointer select-none group"
                onClick={() => handlePageSelect('home')}
              >
                <div className="p-1 rounded-xl bg-white/5 border border-white/10 group-hover:border-[#FFBF00]/40 transition-colors">
                  <ConnectUpIcon className="w-7 h-7" />
                </div>
              </div>
              <AnimatedHamburger 
                isOpen={isMobileMenuOpen} 
                toggle={() => setIsMobileMenuOpen(false)} 
                lightMode={isLight} 
              />
            </div>

            {/* Navigation Links */}
            <nav className="my-auto py-6 flex flex-col gap-2">
              {navItems.map((item) => {
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handlePageSelect(item.id)}
                    className={`group flex items-center justify-between p-3.5 rounded-2xl transition-all duration-200 text-left w-full cursor-pointer ${
                      isActive 
                        ? isLight
                          ? 'bg-zinc-900/5 text-zinc-950 font-bold'
                          : 'bg-white/10 text-[#FFBF00] font-bold shadow-xs'
                        : isLight
                          ? 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/80'
                          : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span className={`text-[11px] font-mono font-medium tracking-widest ${
                        isActive ? 'text-[#FFBF00]' : 'text-zinc-500'
                      }`}>
                        {item.index}
                      </span>
                      <div>
                        <div className="text-xl sm:text-2xl font-black tracking-tight leading-none">
                          {item.label}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isActive && (
                        <span className="w-2 h-2 rounded-full bg-[#FFBF00] shadow-[0_0_8px_#FFBF00]" />
                      )}
                      <ChevronRight className={`w-5 h-5 transition-transform duration-200 ${
                        isActive 
                          ? 'text-[#FFBF00] translate-x-1' 
                          : 'text-zinc-500 group-hover:translate-x-1 group-hover:text-white'
                      }`} />
                    </div>
                  </button>
                );
              })}
            </nav>

            {/* Bottom Action Area */}
            <div className="pt-4 border-t border-white/10 flex flex-col gap-3 shrink-0">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  (onSignUpClick || onLoginClick)();
                }}
                className="w-full py-4 px-6 bg-gradient-to-r from-[#FFBF00] via-[#FFD000] to-[#E5AC00] text-black font-extrabold text-sm uppercase tracking-wider rounded-2xl transition-all active:scale-[0.98] shadow-[0_12px_30px_rgba(255,191,0,0.3)] flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onLoginClick();
                }}
                className={`w-full py-3.5 px-6 rounded-2xl font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center cursor-pointer border ${
                  isLight
                    ? 'border-zinc-300 text-zinc-800 hover:bg-zinc-100'
                    : 'border-white/15 text-white/90 hover:bg-white/10'
                }`}
              >
                Sign In to Account
              </button>

              <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-2 px-1 font-medium">
                <span>Direct: hello@connectupng.com</span>
                <span>Seed to Series A</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Primary Sticky / Floating Header */}
      <header 
        className={`fixed top-0 left-0 right-0 z-[90] pointer-events-none transition-all duration-500 ease-in-out ${
          scrolled ? 'pt-3 px-3 sm:px-6' : 'pt-0 px-0'
        }`}
      >
        {/* Desktop Navbar Bar */}
        <div
          className={`hidden lg:flex mx-auto transition-all duration-500 ease-in-out items-center justify-between pointer-events-auto ${
            scrolled
              ? isLight
                ? 'max-w-5xl h-14 rounded-full px-6 border border-zinc-200/90 bg-white/90 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.08)]'
                : 'max-w-5xl h-14 rounded-full px-6 border border-white/20 bg-[#0D0D0F]/90 backdrop-blur-2xl shadow-[0_16px_50px_rgba(0,0,0,0.6)]'
              : isLight
                ? 'w-full max-w-7xl h-20 rounded-none px-8 border-b border-zinc-200/60 bg-white/70 backdrop-blur-md shadow-none'
                : 'w-full max-w-7xl h-20 rounded-none px-8 border-b border-white/10 bg-[#0D0D0F]/70 backdrop-blur-md shadow-none'
          }`}
        >
          {/* Brand Logo */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer relative z-10 select-none group py-1"
            onClick={() => handlePageSelect('home')}
            title="ConnectUp - Discover & Fund High-Growth Ventures"
          >
            <div className="flex items-center">
              <span className="font-[800] text-xl tracking-tighter transition-colors">
                <span className={isLight ? "text-zinc-950 inline transition-colors group-hover:text-zinc-700" : "text-white inline transition-colors group-hover:text-white/80"}>
                  connect
                </span>
                <span className="text-[#FFBF00] transition-colors">
                  up
                </span>
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="flex items-center justify-center">
            <NavHeader 
              pages={navItems.map(item => ({ id: item.id, label: item.label }))}
              currentPage={currentPage === 'founders' ? 'about' : currentPage}
              onNavigate={(page) => handlePageSelect(page as NavPage)}
              lightMode={isLight}
            />
          </div>

          {/* Desktop Right Actions */}
          <div className="flex items-center gap-3">
            <button 
              onClick={onLoginClick}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors rounded-full cursor-pointer ${
                isLight
                  ? 'text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100'
                  : 'text-zinc-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Sign In
            </button>

            <button
              onClick={onSignUpClick || onLoginClick}
              className="group relative inline-flex items-center gap-2 px-5 py-2 rounded-full font-black text-xs uppercase tracking-wider text-black bg-gradient-to-r from-[#FFBF00] via-[#FFD000] to-[#E5AC00] shadow-[0_4px_20px_rgba(255,191,0,0.35)] hover:shadow-[0_6px_25px_rgba(255,191,0,0.5)] hover:scale-[1.03] active:scale-[0.97] transition-all duration-200 cursor-pointer overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5] group-hover:translate-x-0.5 transition-transform" />
              </span>
              {/* Subtle hover shimmer */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700" />
            </button>
          </div>
        </div>

        {/* Mobile Navbar Bar */}
        <div 
          id="landing-mobile-navbar"
          className={`lg:hidden mx-auto flex items-center justify-between pointer-events-auto transition-all duration-500 ease-in-out ${
            scrolled
              ? isLight
                ? 'max-w-lg h-13 rounded-full px-4 border border-zinc-200/90 bg-white/95 backdrop-blur-2xl shadow-lg' 
                : 'max-w-lg h-13 rounded-full px-4 border border-white/20 bg-[#0D0D0F]/90 backdrop-blur-2xl shadow-2xl'
              : isLight
                ? 'w-full max-w-full h-16 rounded-none px-5 border-b border-zinc-200/60 bg-white/80 backdrop-blur-md shadow-none' 
                : 'w-full max-w-full h-16 rounded-none px-5 border-b border-white/10 bg-[#0D0D0F]/80 backdrop-blur-md shadow-none'
          }`}
        >
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer select-none group"
            onClick={() => handlePageSelect('home')}
          >
            <div className="p-1 rounded-lg bg-white/5 border border-white/10">
              <ConnectUpIcon className="w-5 h-5" />
            </div>
            <span className="font-[800] text-lg tracking-tighter">
              <span className={isLight ? "text-zinc-950 inline" : "text-white inline"}>connect</span>
              <span className="text-[#FFBF00]">up</span>
            </span>
          </div>

          {/* Quick CTA + Hamburger */}
          <div className="flex items-center gap-2">
            <button
              onClick={onSignUpClick || onLoginClick}
              className="px-3.5 py-1.5 rounded-full bg-[#FFBF00] text-black font-extrabold text-[11px] uppercase tracking-wider shadow-sm active:scale-95 transition-all cursor-pointer flex items-center gap-1"
            >
              <span>Join</span>
              <ArrowRight className="w-3 h-3 stroke-[2.5]" />
            </button>
            <AnimatedHamburger 
              isOpen={isMobileMenuOpen} 
              toggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              lightMode={isLight} 
            />
          </div>
        </div>
      </header>
    </>
  );
};

export default LandingNavbar;
