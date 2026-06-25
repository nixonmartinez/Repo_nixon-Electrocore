import React from 'react';
import { motion } from 'motion/react';
import { Language } from '../types';
import { DICTIONARY } from '../data';

interface HeroProps {
  currentLanguage: Language;
  onViewCatalog: () => void;
  onRequestQuote: () => void;
}

export default function Hero({ currentLanguage, onViewCatalog, onRequestQuote }: HeroProps) {
  const t = DICTIONARY[currentLanguage];

  return (
    <section className="relative bg-oxford-blue text-white py-20 md:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background with Industrial Overlay */}
      <div className="absolute inset-0 opacity-25">
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB1uX4UeQie-7Ngmx4KkIGg5wM0KNtBqgJXw3NxCwmcYaMEJuxZd9t7dwqeQPoZsC_3DyOkNhKxbXj18_g6XYp3ZkfO7lxobJNC_l2rQSP_VsssZc1h72skDjujeBRg3EKULTKnlYZKPgQnIuc60ij9Mq58rnAeSKVo2jpNnHfTgbAaw36ek6OgD2c3jncZWwPrmk6NhJyIoi9fGwMYSlPiHrSp23IxD5pE4XF98ZK8j6jjOL3SAatd33wu4UU4h8aODfpuMmkmXe_0')",
          }}
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-[#051125]/90 via-[#1B263B]/70 to-transparent" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block font-sans text-xs font-bold uppercase tracking-[0.25em] text-electric-yellow bg-electric-yellow/10 px-3 py-1.5 rounded mb-6 border border-electric-yellow/20">
            {t.heroSub}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-sans font-extrabold text-4xl sm:text-5xl lg:text-6xl mb-6 max-w-3xl leading-tight text-white tracking-tight"
        >
          {t.heroTitle}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-sans text-base sm:text-lg text-primary-container bg-[#101b30]/40 backdrop-blur-sm p-4 sm:p-5 rounded-lg border border-white/5 max-w-2xl mb-10 text-white/80 leading-relaxed"
        >
          {t.heroDesc}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap gap-4"
        >
          <button
            onClick={onViewCatalog}
            className="bg-electric-yellow text-oxford-blue px-6 py-3.5 sm:px-8 sm:py-4 font-sans text-xs font-bold uppercase tracking-wider rounded shadow hover:bg-white hover:text-oxford-blue transition-all active:scale-95 duration-200"
          >
            {t.heroBtnCatalog}
          </button>
          
          <button
            onClick={onRequestQuote}
            className="border border-industrial-gray text-white px-6 py-3.5 sm:px-8 sm:py-4 font-sans text-xs font-bold uppercase tracking-wider rounded hover:bg-white/10 hover:border-white transition-all active:scale-95 duration-200"
          >
            {t.heroBtnQuote}
          </button>
        </motion.div>
      </div>

      {/* Aesthetic grid pattern accent */}
      <div className="absolute right-0 bottom-0 top-0 w-1/3 hidden lg:block opacity-10 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
    </section>
  );
}
