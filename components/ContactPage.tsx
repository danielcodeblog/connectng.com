import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, Phone, MapPin, Copy, Check, ArrowUpRight, 
  HelpCircle, Send, CheckCircle2, MessageSquare 
} from 'lucide-react';
import { LandingNavbar, NavPage } from './LandingNavbar';
import FooterSection5 from './ui/footer-section-5';

interface ContactPageProps {
  onBackHome?: () => void;
  onLoginClick?: () => void;
  onNavigateToBlog?: () => void;
  onNavigateToSection?: (section: NavPage) => void;
  onLegalView?: (view: 'privacy' | 'terms') => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ 
  onBackHome, 
  onLoginClick,
  onNavigateToBlog,
  onNavigateToSection,
  onLegalView
}) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleNavigate = (page: NavPage) => {
    if (page === 'contact') {
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
    // Landing pages ('home', 'about', 'why', 'founders', 'pricing')
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

  const handleCopy = (text: string, key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 700);
  };

  const emailAddress = 'hello@connectupng.com';
  const phoneNumber = '(501) 123-4567';
  const locationAddress = 'Crosby Street, NY, US';

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col font-sans selection:bg-[#FFBF00] selection:text-black relative overflow-x-hidden">
      
      {/* BACKGROUND AMBIENT GLOW & CYBER CIRCUIT LINES (CALIBRATED FOR WHITE THEME) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Soft emerald-teal aura radial glow behind upper content */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] sm:w-[1100px] h-[520px] opacity-25 blur-[120px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 25%, rgba(16, 185, 129, 0.35) 0%, rgba(52, 211, 153, 0.15) 45%, transparent 70%)'
          }}
        />

        {/* Ambient warm amber accent glow */}
        <div 
          className="absolute top-[320px] left-1/4 -translate-x-1/2 w-[450px] h-[400px] opacity-15 blur-[110px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.3) 0%, transparent 70%)'
          }}
        />

        {/* Giant Typographic Architectural Watermark "CONTACT" */}
        <div className="absolute top-28 sm:top-36 left-1/2 -translate-x-1/2 select-none pointer-events-none whitespace-nowrap">
          <span className="text-[90px] sm:text-[160px] md:text-[210px] lg:text-[250px] font-black uppercase tracking-[0.08em] text-zinc-900/[0.035] leading-none font-sans block">
            CONTACT
          </span>
        </div>

        {/* Circuit Cyber Lines - Left Side (Crisp Slate with Emerald Nodes) */}
        <svg 
          className="absolute top-24 left-0 w-[240px] sm:w-[360px] h-[360px] opacity-40 stroke-zinc-300 fill-none pointer-events-none" 
          viewBox="0 0 360 360"
        >
          <path d="M-20,40 L120,40 L180,100 L260,100 L300,140" strokeWidth="1.5" strokeDasharray="3 3" />
          <path d="M-20,120 L90,120 L150,180 L230,180" strokeWidth="1.5" />
          <path d="M-20,200 L60,200 L110,250 L180,250" strokeWidth="1.2" opacity="0.7" />
          <circle cx="300" cy="140" r="4" fill="#059669" />
          <circle cx="230" cy="180" r="3.5" fill="#059669" />
          <circle cx="180" cy="250" r="3" fill="#059669" opacity="0.7" />
        </svg>

        {/* Circuit Cyber Lines - Right Side (Crisp Slate with Emerald Nodes) */}
        <svg 
          className="absolute top-24 right-0 w-[240px] sm:w-[360px] h-[360px] opacity-40 stroke-zinc-300 fill-none pointer-events-none" 
          viewBox="0 0 360 360"
        >
          <path d="M380,40 L240,40 L180,100 L100,100 L60,140" strokeWidth="1.5" strokeDasharray="3 3" />
          <path d="M380,120 L270,120 L210,180 L130,180" strokeWidth="1.5" />
          <path d="M380,200 L300,200 L250,250 L180,250" strokeWidth="1.2" opacity="0.7" />
          <circle cx="60" cy="140" r="4" fill="#059669" />
          <circle cx="130" cy="180" r="3.5" fill="#059669" />
          <circle cx="180" cy="250" r="3" fill="#059669" opacity="0.7" />
        </svg>
      </div>

      {/* Shared Landing Navbar */}
      <LandingNavbar 
        currentPage="contact" 
        onNavigate={handleNavigate} 
        onLoginClick={onLoginClick || (() => {})} 
        lightMode={true}
      />

      {/* Main Content Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-40 pb-20 relative z-10 flex flex-col justify-center">
        
        {/* 2-Column Responsive Contact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center max-w-6xl mx-auto w-full">
          
          {/* =========================================================================
              LEFT COLUMN: Header & Info Cards
             ========================================================================= */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Pill Badge (No star icon) */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100 border border-zinc-200 text-xs text-zinc-700 font-medium shadow-xs">
                <HelpCircle className="w-3.5 h-3.5 text-zinc-500" />
                <span>Contact</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-950 leading-tight">
                Get in touch
              </h1>

              {/* Subheading */}
              <p className="text-sm sm:text-base text-zinc-600 leading-relaxed max-w-md font-normal">
                Have questions or ready to transform your venture and syndicate deal flow?
              </p>
            </div>

            {/* 3 Horizontal Contact Info Cards (White Mode Cards) */}
            <div className="space-y-3.5 pt-2">
              
              {/* Card 1: Email us */}
              <div 
                onClick={(e) => handleCopy(emailAddress, 'email', e)}
                className="group relative rounded-2xl bg-white hover:bg-zinc-50 border border-zinc-200 hover:border-zinc-300 transition-all duration-200 p-4 sm:p-5 flex items-center justify-between cursor-pointer shadow-sm hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-zinc-100 border border-zinc-200/80 flex items-center justify-center text-zinc-700 group-hover:text-zinc-950 transition-colors shrink-0">
                    <Mail className="w-5 h-5 stroke-[1.8]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900 tracking-wide">
                      Email us
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-500 font-mono mt-0.5 group-hover:text-zinc-700 transition-colors">
                      {emailAddress}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {copiedKey === 'email' ? (
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      Copied!
                    </span>
                  ) : null}
                  <a
                    href={`mailto:${emailAddress}`}
                    onClick={(e) => e.stopPropagation()}
                    className="w-9 h-9 rounded-xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-200/60 flex items-center justify-center text-zinc-600 group-hover:text-zinc-900 transition-all"
                    title="Send Email"
                  >
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </div>

              {/* Card 2: Call us */}
              <div 
                onClick={(e) => handleCopy(phoneNumber, 'phone', e)}
                className="group relative rounded-2xl bg-white hover:bg-zinc-50 border border-zinc-200 hover:border-zinc-300 transition-all duration-200 p-4 sm:p-5 flex items-center justify-between cursor-pointer shadow-sm hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-zinc-100 border border-zinc-200/80 flex items-center justify-center text-zinc-700 group-hover:text-zinc-950 transition-colors shrink-0">
                    <Phone className="w-5 h-5 stroke-[1.8]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900 tracking-wide">
                      Call us
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-500 font-mono mt-0.5 group-hover:text-zinc-700 transition-colors">
                      {phoneNumber}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {copiedKey === 'phone' ? (
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      Copied!
                    </span>
                  ) : null}
                  <a
                    href="tel:5011234567"
                    onClick={(e) => e.stopPropagation()}
                    className="w-9 h-9 rounded-xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-200/60 flex items-center justify-center text-zinc-600 group-hover:text-zinc-900 transition-all"
                    title="Call"
                  >
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </div>

              {/* Card 3: Our location */}
              <div 
                onClick={(e) => handleCopy(locationAddress, 'location', e)}
                className="group relative rounded-2xl bg-white hover:bg-zinc-50 border border-zinc-200 hover:border-zinc-300 transition-all duration-200 p-4 sm:p-5 flex items-center justify-between cursor-pointer shadow-sm hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-zinc-100 border border-zinc-200/80 flex items-center justify-center text-zinc-700 group-hover:text-zinc-950 transition-colors shrink-0">
                    <MapPin className="w-5 h-5 stroke-[1.8]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900 tracking-wide">
                      Our location
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-500 font-mono mt-0.5 group-hover:text-zinc-700 transition-colors">
                      {locationAddress}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {copiedKey === 'location' ? (
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      Copied!
                    </span>
                  ) : null}
                  <a
                    href="https://maps.google.com/?q=Crosby+Street,+NY,+US"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="w-9 h-9 rounded-xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-200/60 flex items-center justify-center text-zinc-600 group-hover:text-zinc-900 transition-all"
                    title="View on Map"
                  >
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* =========================================================================
              RIGHT COLUMN: Form Container (Crisp White Form)
             ========================================================================= */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-zinc-50 border border-zinc-200 p-6 sm:p-9 shadow-lg relative overflow-hidden">
              
              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="py-14 sm:py-20 text-center flex flex-col items-center justify-center space-y-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-2">
                      <CheckCircle2 className="w-8 h-8 stroke-[2.2]" />
                    </div>
                    <h3 className="text-2xl font-bold text-zinc-950 tracking-tight">
                      Message Sent Successfully
                    </h3>
                    <p className="text-zinc-600 text-sm max-w-sm leading-relaxed">
                      Thank you, <span className="text-zinc-900 font-semibold">{formData.name}</span>. Our desk team has received your inquiry and will follow up at <span className="text-zinc-800 font-mono font-medium">{formData.email}</span> within 24 hours.
                    </p>
                    <button
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormData({ name: '', email: '', message: '' });
                      }}
                      className="mt-6 px-6 py-2.5 rounded-xl bg-zinc-200 hover:bg-zinc-300 text-zinc-900 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <motion.form 
                    key="form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    {/* Name Input */}
                    <div>
                      <input 
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Name"
                        className="w-full rounded-2xl bg-white hover:bg-white border border-zinc-200 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/5 px-5 py-4 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all duration-200 shadow-xs"
                      />
                    </div>

                    {/* Email Input */}
                    <div>
                      <input 
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Email"
                        className="w-full rounded-2xl bg-white hover:bg-white border border-zinc-200 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/5 px-5 py-4 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all duration-200 shadow-xs"
                      />
                    </div>

                    {/* Message Textarea */}
                    <div>
                      <textarea 
                        required
                        rows={6}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Message"
                        className="w-full rounded-2xl bg-white hover:bg-white border border-zinc-200 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/5 px-5 py-4 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all duration-200 resize-none min-h-[170px] shadow-xs"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-semibold text-sm transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <span>Submit</span>
                        )}
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

            </div>
          </div>

        </div>
      </main>

      {/* Shared Landing Footer */}
      <FooterSection5 onNavigate={handleNavigate} onLegalView={onLegalView} />
    </div>
  );
};
