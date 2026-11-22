import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import { TypewriterSequence } from '../TypewriterSequence';

export function ParallaxComponent() {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const rootEl = parallaxRef.current;
    const triggerElement = rootEl?.querySelector('[data-parallax-layers]');

    if (!rootEl || !triggerElement) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootEl,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
          invalidateOnRefresh: true,
        }
      });

      const layers = [
        { layer: "1", yPercent: 40 },
        { layer: "2", yPercent: 30 },
        { layer: "3", yPercent: 20 },
        { layer: "4", yPercent: 5 }
      ];

      layers.forEach((layerObj, idx) => {
        tl.to(
          triggerElement.querySelectorAll(`[data-parallax-layer="${layerObj.layer}"]`),
          {
            yPercent: layerObj.yPercent,
            ease: "none",
            force3D: true,
          },
          idx === 0 ? 0 : "<"
        );
      });
    }, parallaxRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div className="relative w-full overflow-hidden bg-[#0A0A0C]" ref={parallaxRef}>
      <section className="relative w-full h-screen overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          
          <div data-parallax-layers className="absolute inset-x-0 -top-[20%] h-[140%] w-full">
            <img 
              src="https://cdn.prod.website-files.com/671752cd4027f01b1b8f1c7f/6717795be09b462b2e8ebf71_osmo-parallax-layer-3.webp" 
              loading="eager" 
              decoding="async"
              data-parallax-layer="1" 
              alt="Background Layer" 
              className="absolute inset-0 w-full h-full object-cover object-bottom z-0 pointer-events-none select-none transform-gpu will-change-transform [backface-visibility:hidden]" 
            />
            <img 
              src="https://cdn.prod.website-files.com/671752cd4027f01b1b8f1c7f/6717795b4d5ac529e7d3a562_osmo-parallax-layer-2.webp" 
              loading="eager" 
              decoding="async"
              data-parallax-layer="2" 
              alt="Midground Layer" 
              className="absolute inset-0 w-full h-full object-cover object-bottom z-10 pointer-events-none select-none transform-gpu will-change-transform [backface-visibility:hidden]" 
            />
            
            <div data-parallax-layer="3" className="absolute top-[40%] sm:top-[42%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 flex flex-col items-center justify-center w-full px-4 text-center will-change-transform">
              <h2 className="text-white text-[3.25rem] leading-[0.9] sm:text-7xl md:text-[8rem] lg:text-[10rem] font-black tracking-tighter drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)] opacity-100 text-center">
                Fundraise. <br/>
                <TypewriterSequence 
                  segments={[{ text: "without the", className: "font-display font-light text-[#FFBF00]" }]} 
                  speed={60} 
                  delay={300} 
                /> <br/>friction.
              </h2>
            </div>
            
            <img 
              src="https://cdn.prod.website-files.com/671752cd4027f01b1b8f1c7f/6717795bb5aceca85011ad83_osmo-parallax-layer-1.webp" 
              loading="eager" 
              decoding="async"
              data-parallax-layer="4" 
              alt="Foreground Layer" 
              className="absolute inset-0 w-full h-full object-cover object-bottom z-30 pointer-events-none select-none transform-gpu will-change-transform [backface-visibility:hidden]" 
            />
          </div>
          <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#0A0A0C] via-[#0A0A0C]/80 to-transparent z-40 pointer-events-none"></div>
        </div>
      </section>
    </div>
  );
}