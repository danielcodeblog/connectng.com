import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { NavHeader } from './ui/nav-header';
import { ConnectUpIcon } from './ui/ConnectUpLogo';

export const AnimatedHamburger = ({ isOpen, toggle, lightMode = false }: { isOpen: boolean; toggle: () => void; lightMode?: boolean }) => (
  <button
    onClick={toggle}
    className={`flex flex-col gap-1.5 transition-all p-3 rounded-full hover:bg-white/5 active:scale-95 relative z-[1100] cursor-pointer ${
      isOpen ? "text-[#FFBF00]" : lightMode ? "text-zinc-900" : "text-white"
    }`}
    aria-label="Toggle Menu"
  >
    {/* Top Line */}
    <div
      className={`h-[2px] bg-current transition-all duration-500 ${
        isOpen ? "w-6 rotate-45 translate-y-[8px]" : "w-6"
      }`}
    />
    {/* Middle Line */}
    <div
      className={`h-[2px] bg-current transition-all duration-500 ${
        isOpen ? "opacity-0 w-0" : "w-4 ml-auto"
      }`}
    />
    {/* Bottom Line */}
    <div
      className={`h-[2px] bg-current transition-all duration-500 ${
        isOpen ? "w-6 -rotate-45 -translate-y-[8px]" : "w-6"
      }`}
    />
  </button>
);

export type NavPage = 'home' | 'about' | 'why' | 'founders' | 'pricing' | 'blog' | 'contact';

export interface LandingNavbarProps {
  currentPage?: NavPage | string;
  onNavigate: (page: NavPage) => void;
  onLoginClick: () => void;
  isScrolled?: boolean;
  onMobileMenuToggle?: (isOpen: boolean) => void;
  lightMode?: boolean;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({
  currentPage = 'home',
  onNavigate,
  onLoginClick,
  isScrolled: externalScrolled,
  onMobileMenuToggle,
  lightMode: explicitLightMode,
}) => {
  const isLight = explicitLightMode !== undefined ? explicitLightMode : (currentPage === 'blog' || currentPage === 'contact');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [internalScrolled, setInternalScrolled] = useState(false);

  useEffect(() => {
    if (externalScrolled !== undefined) return;
    const handleScroll = () => {
      setInternalScrolled(window.scrollY > 40);
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

  const navPages: NavPage[] = ['home', 'about', 'why', 'founders', 'pricing', 'blog', 'contact'];

  return (
    <>
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[100] bg-[#0D0D0F] flex flex-col pt-4 px-4 md:px-16 md:pt-8 pb-8 overflow-y-auto lg:hidden">
            {/* Header in mobile menu */}
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5 md:mb-12 md:pb-8">
              <div 
                className="flex items-center gap-2.5 cursor-pointer p-0 select-none group"
                onClick={() => handlePageSelect('home')}
              >
                <ConnectUpIcon className="w-8 h-8" />
                <span className="font-[800] text-2xl md:text-3xl tracking-tighter">
                  <span className="text-white inline">connect</span>
                  <span className="text-[#FFBF00]">up</span>
                </span>
              </div>
              <AnimatedHamburger isOpen={isMobileMenuOpen} toggle={() => setIsMobileMenuOpen(false)} />
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col items-center justify-center flex-1 gap-3 sm:gap-6 my-4 px-2 md:gap-8 md:px-12">
              {navPages.map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageSelect(page)}
                  className={`block w-full text-center text-3xl sm:text-5xl md:text-7xl font-sans font-black transition-colors tracking-tighter leading-none uppercase cursor-pointer py-1 ${
                    currentPage === page ? 'text-[#FFBF00]' : 'text-white hover:text-[#FFBF00]'
                  }`}
                >
                  {page}.
                </button>
              ))}
            </nav>

            {/* Action Button at bottom */}
            <div className="pt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full pb-12">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onLoginClick();
                }}
                className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-[#FFBF00] to-[#CFB53B] text-black rounded-full font-black uppercase tracking-[0.2em] text-sm transition-transform hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(255,191,0,0.3)] cursor-pointer"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Sticky / Fixed Navbar */}
      {!isMobileMenuOpen && (
        <nav className="fixed top-0 left-0 right-0 z-[90] px-4 py-4 sm:px-6 pointer-events-none">
          {/* Desktop Navbar */}
          <div
            className={`hidden lg:flex max-w-7xl mx-auto h-20 transition-all duration-500 ease-out items-center justify-between px-6 pointer-events-auto ${
              isLight
                ? scrolled
                  ? 'rounded-full border border-zinc-200/90 bg-white/95 backdrop-blur-xl shadow-lg'
                  : 'rounded-full border border-zinc-200/80 bg-white/80 backdrop-blur-md shadow-sm'
                : scrolled
                  ? 'rounded-full border border-white/10 bg-[#0D0D0F]/85 backdrop-blur-xl shadow-2xl'
                  : 'rounded-[2rem] border border-transparent bg-transparent'
            }`}
          >
            {/* Logo */}
            <div 
              className="flex items-center gap-2.5 cursor-pointer relative z-10 select-none group"
              onClick={() => handlePageSelect('home')}
            >
              <ConnectUpIcon className="w-7 h-7" />
              <span className="font-[800] text-2xl tracking-tighter transition-colors">
                <span className={isLight ? "text-zinc-950 inline transition-colors group-hover:text-zinc-700" : "text-white inline transition-colors group-hover:text-white/80"}>connect</span>
                <span className="text-[#FFBF00] transition-colors">up</span>
              </span>
            </div>

            {/* Desktop Nav Tabs */}
            <div className="hidden lg:flex items-center gap-1">
              <NavHeader 
                pages={navPages}
                currentPage={currentPage}
                onNavigate={(page) => handlePageSelect(page as NavPage)}
                lightMode={isLight}
              />
            </div>

            {/* Right Action */}
            <div className="hidden lg:flex items-center gap-3 text-nowrap">
              <button 
                onClick={onLoginClick}
                className={`px-7 py-2.5 rounded-full font-black text-xs transition-all hover:scale-105 active:scale-95 shadow-xl cursor-pointer ${
                  isLight
                    ? 'bg-zinc-950 text-white hover:bg-zinc-800 shadow-md'
                    : 'bg-zinc-900 text-white hover:bg-[#FFBF00] hover:text-black'
                }`}
              >
                Login
              </button>
            </div>
          </div>

          {/* Mobile Navbar */}
          <div 
            id="landing-mobile-navbar"
            className={`lg:hidden flex items-center justify-between pointer-events-auto transition-all duration-300 ease-out ${
              isLight
                ? scrolled 
                ? 'rounded-full border border-zinc-200 bg-white/95 backdrop-blur-xl shadow-md px-2' 
                : 'rounded-full border border-zinc-200/70 bg-white/85 backdrop-blur-md shadow-xs px-2'
                : scrolled 
                ? 'rounded-full border border-white/10 bg-[#0D0D0F]/85 backdrop-blur-xl shadow-2xl px-2' 
                : 'rounded-none border border-transparent bg-transparent px-0'
            }`}
          >
            <div 
              className="flex items-center gap-2 cursor-pointer p-4 select-none group"
              onClick={() => handlePageSelect('home')}
            >
              <ConnectUpIcon className="w-6 h-6" />
              <span className="font-[800] text-2xl tracking-tighter">
                <span className={isLight ? "text-zinc-950 inline transition-colors group-hover:text-zinc-700" : "text-white inline transition-colors group-hover:text-white/80"}>connect</span>
                <span className="text-[#FFBF00] transition-colors">up</span>
              </span>
            </div>

            <div className="flex items-center gap-4 pr-4">
              <AnimatedHamburger isOpen={isMobileMenuOpen} toggle={() => setIsMobileMenuOpen(true)} lightMode={isLight} />
            </div>
          </div>
        </nav>
      )}
    </>
  );
};

export default LandingNavbar;
