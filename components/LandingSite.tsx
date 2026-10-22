import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Heart, ThumbsDown, Flame, Users, Briefcase, ChevronRight, Menu, X, ArrowRight, TrendingUp, Sparkles, Building2, Shield, Rocket, Mail, LogIn, User, Play, Pause } from 'lucide-react';
import { ShaderBackground } from './ui/hero-shader';
import { FounderSlider } from './ui/founder-slider-1';
import { NavHeader } from './ui/nav-header';
import ImageMask from './ui/image-mask';
import { FAQSection } from './FAQSection';
import { LandingNavbar } from './LandingNavbar';

import { LandingHome } from './LandingHome';
import { LogoMarquee } from './LogoMarquee';
import { LandingAbout } from './LandingAbout';
import { LandingWhy } from './LandingWhy';
import { Pricing } from './Pricing';
import FooterSection5 from './ui/footer-section-5';
import foundersBg from '../src/assets/images/founders.png';
import goldenGateBg from '../src/assets/images/golden_gate_bridge_1785141940553.jpg';

const reviews = [
  {
    id: 1,
    name: "Olugbenga Agboola",
    affiliation: "Founder, Flutterwave",
    quote: "Build something investors can already see customers using.",
    imageSrc: "https://www.lagoonhospitals.com/wp-content/uploads/2022/11/GB.jpg",
    thumbnailSrc: "https://www.lagoonhospitals.com/wp-content/uploads/2022/11/GB.jpg",
  },
  {
    id: 2,
    name: "Shola Akinlade",
    affiliation: "Founder, Paystack",
    quote: "Clarity in storytelling matters.",
    imageSrc: "https://fastly.restofworld.org/uploads/2022/05/Africa-SholaAkinladePressKit-EDITED.png?width=300&dpr=2&crop=1:1",
    thumbnailSrc: "https://fastly.restofworld.org/uploads/2022/05/Africa-SholaAkinladePressKit-EDITED.png?width=300&dpr=2&crop=1:1",
  },
  {
    id: 3,
    name: "Iyinoluwa Aboyeji",
    affiliation: "Founder, Future Africa",
    quote: "Investors invest in people first before products.",
    imageSrc: "https://fastly.restofworld.org/uploads/2022/05/Africa-IyinoluwaAboyejiCourtesy-EDITED.png?width=300&dpr=2&crop=1:1",
    thumbnailSrc: "https://fastly.restofworld.org/uploads/2022/05/Africa-IyinoluwaAboyejiCourtesy-EDITED.png?width=300&dpr=2&crop=1:1",
  },
];

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
    const [currentPage, setCurrentPage] = useState<'home' | 'about' | 'why' | 'founders' | 'pricing'>('home');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    const contentRef = useRef<HTMLDivElement>(null);
    const [showVideo, setShowVideo] = useState(false);
  
    useEffect(() => {
      // Check if we are on mobile/tablet to disable heavy features
      setShowVideo(true);
    }, []);
  
    const [isScrolled, setIsScrolled] = useState(false);
  
    useEffect(() => {
      const handleScroll = () => {
        const scrollPos = window.scrollY;
        setIsScrolled(scrollPos > 50);
      };
  
      window.addEventListener('scroll', handleScroll, { passive: true });
      
      // Use IntersectionObserver for active section tracking
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            if (sectionId && sectionId !== currentPage) {
                setCurrentPage(sectionId as any);
            }
          }
        });
      }, {
        rootMargin: '-30% 0px -70% 0px' // Adjust to trigger when section reaches top part of screen
      });
  
      const sections = ['home', 'about', 'why', 'founders', 'pricing'];
      sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
      
      return () => {
        window.removeEventListener('scroll', handleScroll);
        observer.disconnect();
      };
    }, [currentPage]);
  
    useEffect(() => {
      if (isMobileMenuOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
      return () => {
        document.body.style.overflow = '';
      };
    }, [isMobileMenuOpen]);

    const navigateTo = (page: 'home' | 'about' | 'why' | 'founders' | 'pricing' | 'blog' | 'contact') => {
      if (page === 'blog') {
        setIsMobileMenuOpen(false);
        if (onNavigateToBlog) {
          onNavigateToBlog();
        } else {
          try {
            window.history.pushState({}, '', '/blog');
          } catch {
            window.location.hash = '#blog';
          }
        }
        return;
      }
      if (page === 'contact') {
        setIsMobileMenuOpen(false);
        if (onNavigateToContact) {
          onNavigateToContact();
        } else {
          try {
            window.history.pushState({}, '', '/contact');
          } catch {
            window.location.hash = '#contact';
          }
        }
        return;
      }

      setCurrentPage(page);
      setIsMobileMenuOpen(false);
      const element = document.getElementById(page);
      if (element) {
        if (page === 'home') {
          window.scrollTo({ top: 0, behavior: 'instant' });
        } else {
          const offset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "instant",
          });
        }
      }
    };

  const handleButtonHover = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    // scale effect removed for "no slow loading"
  };
  
  const handleButtonLeave = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    // scale effect removed for "no slow loading"
  };

  return (
    <ShaderBackground paused={isMobileMenuOpen} className="font-poppins bg-[#0D0D0F] text-white min-h-screen flex flex-col relative selection:bg-[#FFBF00] selection:text-black overflow-x-hidden max-w-full">
      {/* Shared Landing Navbar */}
      <LandingNavbar 
        currentPage={currentPage}
        onNavigate={navigateTo}
        onLoginClick={onLoginClick}
        isScrolled={isScrolled}
        onMobileMenuToggle={setIsMobileMenuOpen}
      />

      {/* Main Content Area */}
      <main ref={contentRef} className="flex-1 w-full flex flex-col overflow-x-hidden max-w-full">
        <section id="home" className="w-full">
            <LandingHome onNavigate={navigateTo} onLoginClick={onLoginClick} showVideo={showVideo} />
        </section>
        <LogoMarquee />
        <section id="about" className="w-full">
            <LandingAbout />
        </section>
        <section id="why" className="w-full">
            <LandingWhy />
        </section>
        <section id="founders" className="w-full relative py-12 md:py-24 bg-zinc-950 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 pointer-events-none"
            style={{ backgroundImage: `url(${foundersBg})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/40 to-zinc-950/90 pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <FounderSlider founders={reviews} className="rounded-3xl" />
          </div>
        </section>
        <section id="pricing" className="w-full relative z-10 overflow-hidden max-w-full bg-white">
          <Pricing onPlanSelect={onLoginClick} />
        </section>
        <FAQSection />

        {/* Partnering CTA Banner Section */}
        <section className="w-full relative py-28 md:py-36 flex items-center justify-center overflow-hidden bg-zinc-900 border-t border-white/10">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80 scale-105 transition-transform duration-1000"
            style={{ 
              backgroundImage: `url(${goldenGateBg})` 
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/60" />

          <div className="max-w-5xl mx-auto px-6 text-center relative z-10 space-y-8">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-medium text-white tracking-tight leading-tight drop-shadow-md">
              Build what's next.
            </h2>
            
            <div className="max-w-2xl mx-auto pt-4 flex items-center justify-center">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const target = e.target as HTMLFormElement;
                  const input = target.querySelector('input') as HTMLInputElement;
                  const text = input?.value.trim();
                  if (text) {
                    const mailtoUrl = `mailto:support@connectupng.com?subject=${encodeURIComponent("Concern Submission")}&body=${encodeURIComponent(text)}`;
                    window.location.href = mailtoUrl;
                    input.value = '';
                  } else {
                    window.location.href = "mailto:support@connectupng.com";
                  }
                }} 
                className="w-full flex flex-col sm:flex-row items-center gap-2 bg-white/10 backdrop-blur-md p-2 rounded-2xl sm:rounded-full border border-white/30 shadow-2xl"
              >
                <input
                  type="text"
                  placeholder="Send a concern..."
                  className="w-full sm:flex-1 bg-transparent text-white placeholder-white/70 px-5 py-3 outline-none text-sm font-medium"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 bg-white text-zinc-900 hover:bg-zinc-100 font-bold rounded-xl sm:rounded-full shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap cursor-pointer text-sm"
                >
                  Send concern
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <FooterSection5 onNavigate={navigateTo} onLegalView={onLegalView} />

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scaleX {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `}} />
    </ShaderBackground>
  );
}