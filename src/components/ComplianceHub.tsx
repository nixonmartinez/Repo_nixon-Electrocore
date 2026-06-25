import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, FileText, Download, Check, HelpCircle, Layers, Search, Filter } from 'lucide-react';
import { Language } from '../types';

interface ComplianceHubProps {
  currentLanguage: Language;
}

interface Certificate {
  id: string;
  title_es: string;
  title_en: string;
  category: 'power' | 'transformer' | 'led' | 'automation';
  code: string;
  authority: 'EDESUR' | 'EDEESTE' | 'EDENORTE' | 'ETED' | 'CNE';
  voltage_es: string;
  voltage_en: string;
  status: 'active' | 'pending';
  desc_es: string;
  desc_en: string;
}

export default function ComplianceHub({ currentLanguage }: ComplianceHubProps) {
  const [selectedAuthority, setSelectedAuthority] = useState<string>('ALL');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const certificates: Certificate[] = [
    {
      id: 'cert-1',
      title_es: 'Conductor Multipolar XLPE Aislado',
      title_en: 'Multipolar Shielded XLPE Cabling',
      category: 'power',
      code: 'EDE-2025-CABLE-094',
      authority: 'EDESUR',
      voltage_es: 'Media Tensión up to 15kV',
      voltage_en: 'Medium Voltage up to 15kV',
      status: 'active',
      desc_es: 'Homologación aprobada para distribución subterránea en el Distrito Nacional y subestaciones urbanas.',
      desc_en: 'Approved for underground grid distribution in Santo Domingo and metro substations.'
    },
    {
      id: 'cert-2',
      title_es: 'Transformador Seco Encapsulado 50 kVA',
      title_en: 'Epoxy Resin Dry Transformer 50 kVA',
      category: 'transformer',
      code: 'EDE-2025-TRANS-182',
      authority: 'EDENORTE',
      voltage_es: 'Distribución 12.47kV / 220V',
      voltage_en: 'Distribution 12.47kV / 220V',
      status: 'active',
      desc_es: 'Aprobación oficial para montaje en cámaras interiores y subestaciones comerciales en la Región Norte.',
      desc_en: 'Approved for indoor facilities and shopping center utility rooms in northern regions.'
    },
    {
      id: 'cert-3',
      title_es: 'Aislador EC-900 Ultra-Load Porcelana',
      title_en: 'EC-900 Ultra-Load Insulator',
      category: 'power',
      code: 'ETED-AIS-500KV-02',
      authority: 'ETED',
      voltage_es: 'Alta Tensión 345kV / 500kV',
      voltage_en: 'Transmission 345kV / 500kV',
      status: 'active',
      desc_es: 'Homologación para redes de transmisión nacional y torres de suspensión eléctrica interconectadas.',
      desc_en: 'Certified for high-voltage transmission lines and national electrical suspension towers.'
    },
    {
      id: 'cert-4',
      title_es: 'Disyuntor Termomagnético Gabinete 50A',
      title_en: 'Thermo-Magnetic Industrial Breaker 50A',
      category: 'automation',
      code: 'EDE-2024-DISY-400V',
      authority: 'EDEESTE',
      voltage_es: 'Baja Tensión 400V / 220V',
      voltage_en: 'Low Voltage 400V / 220V',
      status: 'active',
      desc_es: 'Homologado para tableros generales de distribución y celdas de automatización en industrias del Este.',
      desc_en: 'Approved for industrial main distribution panels in free zones and eastern factories.'
    },
    {
      id: 'cert-5',
      title_es: 'Luminaria LED High Bay IP65 200W',
      title_en: 'Industrial LED High Bay Light 200W',
      category: 'led',
      code: 'EDE-2025-LUM-LED200',
      authority: 'EDESUR',
      voltage_es: 'Baja Tensión 100V - 277V',
      voltage_en: 'Low Voltage 100V - 277V',
      status: 'active',
      desc_es: 'Certificado de eficiencia energética homologado para alumbrado vial privado y almacenes de acopio.',
      desc_en: 'Certified energy efficiency fixture for warehouses and commercial highway lighting.'
    },
    {
      id: 'cert-6',
      title_es: 'Módulo PLC S7 Industrial CPU',
      title_en: 'Siemens S7 Industrial PLC Unit',
      category: 'automation',
      code: 'CNE-2025-AUTO-INTEG',
      authority: 'CNE',
      voltage_es: 'Control / Señal 24V DC',
      voltage_en: 'Control / Signal 24V DC',
      status: 'active',
      desc_es: 'Aprobación especial de la Comisión Nacional de Energía para integración en sistemas solares netos.',
      desc_en: 'Approved for telemetry integration in net-metered commercial solar plants.'
    }
  ];

  const filteredCertificates = selectedAuthority === 'ALL'
    ? certificates
    : certificates.filter(c => c.authority === selectedAuthority);

  const triggerDownload = (id: string, filename: string) => {
    setDownloadingId(id);
    setTimeout(() => {
      setDownloadingId(null);
      alert(currentLanguage === 'es' 
        ? `Descargando Certificado Oficial de Homologación: ${filename}.pdf` 
        : `Downloading Official Compliance Certificate: ${filename}.pdf`);
    }, 1200);
  };

  const getAuthorityBadgeColor = (auth: string) => {
    switch (auth) {
      case 'EDESUR': return 'bg-blue-600 text-white';
      case 'EDEESTE': return 'bg-sky-500 text-white';
      case 'EDENORTE': return 'bg-emerald-600 text-white';
      case 'ETED': return 'bg-slate-800 text-white';
      case 'CNE': return 'bg-amber-600 text-white';
      default: return 'bg-industrial-gray text-white';
    }
  };

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 font-sans">
      
      {/* Title */}
      <div className="border-b border-border-subtle pb-4">
        <h2 className="text-oxford-blue text-2xl font-black tracking-tight uppercase">
          {currentLanguage === 'es' ? 'Hub de Homologaciones EDE / ETED' : 'EDE & ETED Compliance Hub'}
        </h2>
        <p className="text-xs text-industrial-gray mt-1">
          {currentLanguage === 'es'
            ? 'Acceda a los certificados oficiales de homologación requeridos por las distribuidoras dominicanas para la conexión a red.'
            : 'Access official utility-compliance approval letters required by Dominican power grid distributors.'}
        </p>
      </div>

      {/* Filter panel */}
      <div className="flex flex-wrap items-center gap-3 bg-white border border-border-subtle p-4 rounded-md">
        <span className="text-xs font-bold text-oxford-blue flex items-center gap-1.5 uppercase tracking-wider mr-2">
          <Filter size={14} />
          {currentLanguage === 'es' ? 'Distribuidora:' : 'Utility Provider:'}
        </span>
        
        {['ALL', 'EDESUR', 'EDEESTE', 'EDENORTE', 'ETED', 'CNE'].map((auth) => (
          <button
            key={auth}
            onClick={() => setSelectedAuthority(auth)}
            className={`px-3 py-1.5 rounded-sm font-sans text-xs font-bold uppercase tracking-wider transition-all ${
              selectedAuthority === auth
                ? 'bg-oxford-blue text-white shadow'
                : 'bg-surface-container-low text-industrial-gray hover:text-oxford-blue hover:bg-surface-container-high'
            }`}
          >
            {auth === 'ALL' ? (currentLanguage === 'es' ? 'Ver Todas' : 'Show All') : auth}
          </button>
        ))}
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredCertificates.map((cert) => {
            const title = currentLanguage === 'es' ? cert.title_es : cert.title_en;
            const voltage = currentLanguage === 'es' ? cert.voltage_es : cert.voltage_en;
            const desc = currentLanguage === 'es' ? cert.desc_es : cert.desc_en;
            const isDownloading = downloadingId === cert.id;

            return (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                key={cert.id}
                className="bg-white border border-border-subtle rounded-md p-5 flex flex-col justify-between hover:border-industrial-gray/50 hover:shadow-md transition-all"
              >
                <div className="space-y-4">
                  {/* Top card bar */}
                  <div className="flex justify-between items-start gap-2">
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${getAuthorityBadgeColor(cert.authority)}`}>
                      {cert.authority}
                    </span>
                    <span className="font-mono text-[10px] font-bold text-industrial-gray bg-surface-container-low px-1.5 py-0.5 rounded border border-border-subtle/50">
                      {cert.code}
                    </span>
                  </div>

                  {/* Info block */}
                  <div className="space-y-2">
                    <h3 className="font-sans font-black text-sm text-oxford-blue leading-snug">{title}</h3>
                    <div className="text-[10px] text-industrial-gray font-semibold flex items-center gap-1 font-mono uppercase">
                      <Layers size={10} />
                      <span>{voltage}</span>
                    </div>
                    <p className="text-xs text-industrial-gray/90 leading-relaxed pt-1">
                      {desc}
                    </p>
                  </div>
                </div>

                {/* Bottom CTA */}
                <div className="border-t border-border-subtle/50 pt-4 mt-6">
                  <button
                    onClick={() => triggerDownload(cert.id, cert.code)}
                    disabled={isDownloading}
                    className={`w-full py-2.5 rounded-sm font-sans text-[10px] font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                      isDownloading
                        ? 'bg-surface-container-high text-industrial-gray/40 border-border-subtle'
                        : 'border-oxford-blue text-oxford-blue hover:bg-oxford-blue hover:text-white'
                    }`}
                  >
                    {isDownloading ? (
                      <>
                        <span className="w-3 h-3 rounded-full border border-industrial-gray border-t-transparent animate-spin inline-block" />
                        <span>{currentLanguage === 'es' ? 'Preparando...' : 'Preparing...'}</span>
                      </>
                    ) : (
                      <>
                        <Download size={12} />
                        <span>{currentLanguage === 'es' ? 'Descargar Aprobación' : 'Download Approval'}</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Informational Guidelines Section */}
      <div className="bg-surface-container-low border border-border-subtle rounded-md p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-3">
          <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-oxford-blue flex items-center gap-2">
            <ShieldCheck size={16} className="text-green-600" />
            {currentLanguage === 'es' ? 'Normativa de Interconexión en República Dominicana' : 'Interconnection Standards in Dominican Republic'}
          </h4>
          <p className="text-xs text-industrial-gray leading-relaxed">
            {currentLanguage === 'es'
              ? 'Todos los equipos eléctricos de potencia interconectados a la red del SENI (Sistema Eléctrico Nacional Interconectado) deben contar con la aprobación del departamento de homologación de la distribuidora correspondiente. Esto aplica para transformadores industriales (norma de cortocircuito y pérdidas en vacío) y conductores de media tensión (ensayos dieléctricos homologados).'
              : 'All electrical power equipment interconnected to the national SENI grid must have official approval certificates issued by the regional distributor. This applies to dry and wet transformers (short-circuit testing standards) and medium-voltage power cables (dielectric test approval standards).'}
          </p>
          <div className="pt-2">
            <span className="text-[10px] font-bold text-oxford-blue bg-electric-yellow/20 border border-electric-yellow/40 rounded px-2.5 py-1 uppercase tracking-wider inline-block">
              {currentLanguage === 'es' ? 'Garantía Técnica 100% Homologado' : '100% Utility Pre-Approved Guarantee'}
            </span>
          </div>
        </div>

        <div className="border-t md:border-t-0 md:border-l border-border-subtle/80 pt-6 md:pt-0 md:pl-6 space-y-3 flex flex-col justify-center">
          <h5 className="font-sans font-bold text-xs text-oxford-blue">
            {currentLanguage === 'es' ? '¿Necesita Homologación Especial?' : 'Need Custom Compliance Docs?'}
          </h5>
          <p className="text-[11px] text-industrial-gray leading-relaxed">
            {currentLanguage === 'es'
              ? 'Si su proyecto requiere planos visados o protocolos de prueba en fábrica (FAT) homologados por una EDE específica, solicítelo al cotizar.'
              : 'If your engineering project requires factory witness testing (FAT) or signed drawings for a specific utility grid, contact pre-sales.'}
          </p>
          <a 
            href="#technical-contact" 
            onClick={(e) => { e.preventDefault(); alert(currentLanguage === 'es' ? 'Abriendo canal de soporte técnico de ingeniería...' : 'Opening engineering technical support ticket channel...'); }}
            className="text-[10px] font-bold text-oxford-blue hover:underline uppercase tracking-wider block"
          >
            {currentLanguage === 'es' ? 'Contacto Técnico ➔' : 'Technical Support ➔'}
          </a>
        </div>
      </div>

    </section>
  );
}
