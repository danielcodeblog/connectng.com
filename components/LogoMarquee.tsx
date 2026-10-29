import React from 'react';
import { motion } from 'motion/react';
import { 
  PaystackIcon, 
  FlutterwaveIcon, 
  FutureAfricaIcon, 
  YCombinatorIcon, 
  TechstarsIcon, 
  VenturesPlatformIcon, 
  ChowdeckIcon, 
  AndelaIcon, 
  MoniepointIcon, 
  PiggyVestIcon,
  EdenLifeIcon,
  KudaIcon,
  GoogleStartupsIcon 
} from './CompanyLogos';

const logos = [
  { name: 'Flutterwave', icon: <FlutterwaveIcon className="w-5 h-5 shrink-0" /> },
  { name: 'Chowdeck', icon: <ChowdeckIcon className="w-5 h-5 shrink-0" /> },
  { name: 'Paystack', icon: <PaystackIcon className="w-5 h-5 shrink-0" /> },
  { name: 'Moniepoint', icon: <MoniepointIcon className="w-5 h-5 shrink-0" /> },
  { name: 'PiggyVest', icon: <PiggyVestIcon className="w-5 h-5 shrink-0" /> },
  { name: 'Eden Life', icon: <EdenLifeIcon className="w-5 h-5 shrink-0" /> },
  { name: 'Kuda Bank', icon: <KudaIcon className="w-5 h-5 shrink-0" /> },
  { name: 'Andela', icon: <AndelaIcon className="w-5 h-5 shrink-0" /> },
  { name: 'Y Combinator', icon: <YCombinatorIcon className="w-5 h-5 shrink-0" /> },
  { name: 'Techstars', icon: <TechstarsIcon className="w-5 h-5 shrink-0" /> },
  { name: 'Future Africa', icon: <FutureAfricaIcon className="w-5 h-5 shrink-0" /> },
  { name: 'Ventures Platform', icon: <VenturesPlatformIcon className="w-5 h-5 shrink-0" /> },
  { name: 'Google for Startups', icon: <GoogleStartupsIcon className="w-5 h-5 shrink-0" /> },
];

export const LogoMarquee = () => {
  return (
    <div className="w-full py-6 bg-[#0D0D10] border-y border-white/[0.08] relative z-10 flex flex-col gap-4 overflow-hidden">
      {/* Moving Row */}
      <div className="w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
        <motion.div
          className="flex gap-16 sm:gap-24 whitespace-nowrap min-w-max items-center py-2"
          animate={{ x: [0, "-50%"] }}
          transition={{ repeat: Infinity, duration: 32, ease: "linear" }}
        >
          {/* Duplicate to create a seamless infinite loop */}
          {[...logos, ...logos].map((logo, index) => (
            <div 
              key={`logo-${index}`} 
              className="flex items-center gap-3 text-zinc-400 hover:text-white transition-all duration-300 hover:scale-105 cursor-default select-none group"
            >
              <span className="w-8 h-8 rounded-xl bg-white/[0.08] border border-white/10 flex items-center justify-center group-hover:bg-white/[0.15] transition-colors shrink-0 p-1 shadow-xs">
                {logo.icon}
              </span>
              <span className="font-bold text-base sm:text-lg tracking-tight text-zinc-300 group-hover:text-white transition-colors">
                {logo.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

