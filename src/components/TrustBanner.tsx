import React from 'react';
import { Truck, ShieldCheck, Coins, Percent, CheckCircle } from 'lucide-react';
import { Language } from '../types';

interface TrustBannerProps {
  currentLanguage: Language;
}

export default function TrustBanner({ currentLanguage }: TrustBannerProps) {
  const isEs = currentLanguage === 'es';

  const benefits = [
    {
      icon: <Truck className="text-electric-yellow" size={24} />,
      title_es: "Envío Exprés a Obra",
      title_en: "Express Jobsite Shipping",
      desc_es: "Entrega programada en Santo Domingo y Haina con tarifas integradas.",
      desc_en: "Scheduled delivery across Santo Domingo & Haina with flat fees.",
      badge_es: "Rápido & Seguro",
      badge_en: "Fast & Secure",
    },
    {
      icon: <Coins className="text-electric-yellow" size={24} />,
      title_es: "Precios Fijos en RD$",
      title_en: "Fixed Prices in RD$",
      desc_es: "Evita sorpresas de tipo de cambio. Compra o cotiza con total transparencia.",
      desc_en: "Avoid exchange rate surprises. Shop or quote with full transparency.",
      badge_es: "Sin Cargos Ocultos",
      badge_en: "No Hidden Fees",
    },
    {
      icon: <Percent className="text-electric-yellow" size={24} />,
      title_es: "Descuentos por Volumen",
      title_en: "Volume Pricing",
      desc_es: "Ahorra hasta un 25% en compras por lote o proyectos de gran escala.",
      desc_en: "Save up to 25% on bulk purchases or large-scale project materials.",
      badge_es: "Ahorro Asegurado",
      badge_en: "Guaranteed Savings",
    },
    {
      icon: <ShieldCheck className="text-electric-yellow" size={24} />,
      title_es: "Garantía de Fábrica EIG",
      title_en: "Factory EIG Warranty",
      desc_es: "Componentes 100% certificados bajo estándares IEC, UL y ANSI.",
      desc_en: "Components 100% certified under IEC, UL, and ANSI standards.",
      badge_es: "Calidad Certificada",
      badge_en: "Certified Quality",
    }
  ];

  return (
    <section className="bg-white border-b border-border-subtle py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner header: Why buy from us */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <span className="text-[10px] font-bold text-oxford-blue tracking-wider uppercase bg-electric-yellow/25 px-2.5 py-1 rounded">
            {isEs ? "COMPRA DIRECTA SEGURA" : "SECURE DIRECT PURCHASE"}
          </span>
          <h3 className="font-sans font-black text-xl sm:text-2xl text-oxford-blue mt-3">
            {isEs ? "Adquiere Suministros Eléctricos de Forma Ágil y Segura" : "Acquire Electrical Supplies Quickly and Securely"}
          </h3>
          <p className="text-xs text-industrial-gray mt-1 font-sans">
            {isEs 
              ? "Diseñado para ingenieros, contratistas y gestores de compras con despachos rápidos." 
              : "Designed for engineers, contractors, and procurement managers with rapid delivery."}
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b, index) => (
            <div 
              key={index} 
              className="bg-surface-container-low border border-border-subtle/70 rounded p-4 flex flex-col justify-between hover:border-oxford-blue/30 hover:shadow-sm transition-all duration-200"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-oxford-blue rounded">
                    {b.icon}
                  </div>
                  <span className="text-[9px] font-bold uppercase text-oxford-blue/70 bg-white border border-border-subtle px-1.5 py-0.5 rounded">
                    {isEs ? b.badge_es : b.badge_en}
                  </span>
                </div>
                <h4 className="font-sans font-bold text-sm text-oxford-blue mb-1">
                  {isEs ? b.title_es : b.title_en}
                </h4>
                <p className="text-xs text-industrial-gray leading-relaxed font-sans">
                  {isEs ? b.desc_es : b.desc_en}
                </p>
              </div>
              
              {/* Trust validation checkmark */}
              <div className="mt-3 pt-2.5 border-t border-border-subtle/40 flex items-center gap-1.5 text-[10px] text-green-700 font-bold">
                <CheckCircle size={10} className="text-green-600" />
                <span>{isEs ? "Garantía de Compra" : "Purchase Guarantee"}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
