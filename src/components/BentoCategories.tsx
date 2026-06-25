import React from 'react';
import { motion } from 'motion/react';
import { Language } from '../types';
import { DICTIONARY } from '../data';

interface BentoCategoriesProps {
  currentLanguage: Language;
  onSelectCategory: (category: 'power' | 'transformer' | 'led' | 'automation' | 'all') => void;
}

export default function BentoCategories({ currentLanguage, onSelectCategory }: BentoCategoriesProps) {
  const t = DICTIONARY[currentLanguage];

  const categories = [
    {
      id: 'power' as const,
      title: t.catPower,
      subtitle: t.catPowerSub,
      bgImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCW7HDBy37BOokgu7sgUJ4s5hFtaBDNHpA_s-TVzcQ_cGZxADHoLuZBjfWERZ-s1LX3hQ1r13Ecn2siH4ERTcaORVc1KXe7MC7gj0E7r079Ca-pKIc3-SRZ2dHRUOFR2GZ3YXjQY01FRfnciJaDuOooO8e8P5vRfo2Sc6MtLwiCCqCsn_EffnxdmMIYHYUu2sYfj_opW1VjVg4SWinwc6mzmZgRquqbt_GEyLg0kdgl-4Cy2ibPNoAb8j9ozNiOocN9au3UK-jEkHXN',
      className: 'md:col-span-2 md:row-span-2 min-h-[260px]',
      badgeColor: 'bg-electric-yellow text-oxford-blue',
    },
    {
      id: 'transformer' as const,
      title: t.catTransformers,
      subtitle: '50-5000 kVA',
      bgImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB23d7TLoOv1yFRnSioYWJbAKhxSr5GVDfG-BhUYOg3vEbCvu5YpYba5u3MDPm6OpmY84_-lbSfXerFqRLJj9SGgOq57gEgWo_LugGQ82yo41juu4Yi4_eOSWaVMN2hn9tUfPHzf7AD9SdRCNAqOF16l4OhazUsF42AO2bUvjrS1rvHfA6Wq_zhNrPGvP2DGJZZ2lPaQgVL9hGEgewIwgr9L-wHX9w-B4yTooQ5J_G3uZA8aWpcR0qkhOlIjazVHGtnVKIrMeUSetyF',
      className: 'min-h-[160px]',
      badgeColor: 'bg-white/20 text-white',
    },
    {
      id: 'led' as const,
      title: t.catLed,
      subtitle: 'IP65 HIGH BAY',
      bgImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDG2_eyOHZqleShsAwtp4Pm4KoblUJyMmi2dVdl6NcSedb__NEIL1htJd8xH5V3IjkbicCVO17RJJsg0vOzXFTLfciKwLj4an46w2f53VAOdAUEgcD0Cq_qBx_qmyuX6mv9bmkIdekFOl5Oi-etriOZUuiLJr7ycumFVJxyq9FgSlVuApUCpBcYfLie3HYqXpLfP8-wPxYKHRk4rLVvm0C1NLGVB6FA-H3Fwtsju2YF7Ty7DiFbus0RxfI8YTa9F-zuF962O0IKPcH',
      className: 'min-h-[160px]',
      badgeColor: 'bg-white/20 text-white',
    },
    {
      id: 'automation' as const,
      title: t.catAutomation,
      subtitle: t.catAutomationSub,
      bgImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2-ugy1JlgtOICL4qWjPCCPAf5M96ewWcr38ahgLphOUeBz8MHPx8k1msVSSW64ZZbhN6RPAZiS6gdG94a_iYftxoAS-0r7TprGze9VtaqWyFo6thaJfQ3cA6vY28ghhP65qTo6B1h5wpFa5Uy1oIZgkub17bg5qwvcs6TmG2Xrbl3TwgkqyWuCu1jMDlbYr2qOzqVuWS-iquu4C8e5v6KvzQYWYnQTYU13Gr_i1RJYHTIV05ozYgq_YGENtpcpoF2DnxNKRTyHkNS',
      className: 'md:col-span-2 min-h-[180px]',
      badgeColor: 'bg-white/20 text-white',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h2 className="font-sans font-bold text-2xl lg:text-3xl text-oxford-blue">
            {t.categoriesTitle}
          </h2>
          <div className="h-1 w-12 bg-electric-yellow mt-2 rounded" />
        </div>
        <button
          onClick={() => onSelectCategory('all')}
          className="text-xs font-bold text-industrial-gray hover:text-oxford-blue tracking-wider uppercase flex items-center gap-1 group transition-colors"
        >
          {currentLanguage === 'es' ? 'Mostrar Todo' : 'View All'}
          <span className="text-sm font-semibold transition-transform group-hover:translate-x-1">→</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            whileHover={{ y: -4 }}
            className={`group relative overflow-hidden rounded-md border border-border-subtle cursor-pointer transition-shadow hover:shadow-lg ${cat.className}`}
          >
            {/* Background image zoom on hover */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url('${cat.bgImage}')` }}
            />
            {/* Dark technical gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-oxford-blue/90 via-oxford-blue/40 to-transparent" />
            <div className="absolute inset-0 bg-oxford-blue/10 group-hover:bg-transparent transition-colors duration-300" />

            <div className="absolute bottom-6 left-6 right-6">
              {cat.subtitle && (
                <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm mb-2 ${cat.badgeColor}`}>
                  {cat.subtitle}
                </span>
              )}
              <h3 className="text-white font-sans font-bold text-xl lg:text-2xl tracking-tight leading-tight group-hover:text-electric-yellow transition-colors">
                {cat.title}
              </h3>
            </div>

            {/* Micro aesthetic indicator */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-electric-yellow text-oxford-blue p-1.5 rounded-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
