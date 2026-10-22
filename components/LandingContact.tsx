import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Copy, Check } from 'lucide-react';
import { LandingContactForm } from './LandingContactForm';

export const LandingContact = () => {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => {
      setCopiedText(null);
    }, 2000);
  };

  const contactEmail = 'hello@connectupng.com';

  return (
    <section id="contact" className="w-full py-24 bg-zinc-50 relative overflow-hidden">
      {/* Decorative subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
      
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
                {/* Contact Information Badge */}
                <div className="inline-flex items-center px-4 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase bg-[#FFBF00]/20 text-zinc-900 border border-zinc-950/10 mb-5 shadow-sm">
                CONTACT US
                </div>

                {/* Title */}
                <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-950 leading-tight mb-8">
                Get in touch with our team
                </h2>
                <p className="text-zinc-600 mb-10 text-lg">
                    Have questions or need assistance? Reach out to us, and we'll get back to you shortly.
                </p>
                
                <div className="bg-white border border-zinc-200 rounded-2xl p-6 flex items-center justify-between shadow-sm">
                    <div className='flex items-center gap-4'>
                        <div className='w-12 h-12 rounded-full bg-[#FFBF00]/10 flex items-center justify-center'>
                             <Mail className="w-6 h-6 text-[#FFBF00]" />
                        </div>
                        <div>
                            <p className='text-sm text-zinc-500'>Email us at</p>
                            <a href={`mailto:${contactEmail}`} className='font-bold text-zinc-950 hover:text-[#FFBF00] transition-colors'>{contactEmail}</a>
                        </div>
                    </div>
                    <button
                        onClick={() => handleCopy(contactEmail, 'Email')}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100 transition-all cursor-pointer"
                    >
                        {copiedText === 'Email' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                </div>
            </div>
            
            <div className='bg-white p-8 md:p-10 rounded-3xl border border-zinc-200 shadow-xl'>
                <LandingContactForm lightMode={true} />
            </div>
        </div>
      </div>
    </section>
  );
};
