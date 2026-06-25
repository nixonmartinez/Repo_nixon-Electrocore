import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, FileText, Send, Building, User, Mail, Phone, Layers } from 'lucide-react';
import { Product, Language } from '../types';
import { DICTIONARY } from '../data';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  productsList: Product[];
  currentLanguage: Language;
}

export default function QuoteModal({
  isOpen,
  onClose,
  product,
  productsList,
  currentLanguage,
}: QuoteModalProps) {
  const t = DICTIONARY[currentLanguage];

  const [submitted, setSubmitted] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(product?.id || productsList[0]?.id || '');
  const [qty, setQty] = useState('10');
  const [company, setCompany] = useState('');
  const [engineer, setEngineer] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  const activeProduct = productsList.find(p => p.id === selectedProductId) || product;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !engineer || !email || !phone) return;

    // Simulate sending quote to CRM leads pipeline
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setCompany('');
    setEngineer('');
    setEmail('');
    setPhone('');
    setNotes('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Dark transparent overlay background */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleReset}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.3 }}
            className="bg-white border border-border-subtle rounded-md max-w-lg w-full relative z-10 overflow-hidden shadow-2xl font-sans"
          >
            {/* Top design header bar */}
            <div className="bg-oxford-blue text-white px-6 py-5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FileText className="text-electric-yellow" size={18} />
                <h3 className="font-sans font-extrabold text-sm uppercase tracking-wider">
                  {t.requestQuoteTitle}
                </h3>
              </div>
              <button
                onClick={handleReset}
                className="text-white/80 hover:text-white rounded-full p-1 hover:bg-white/10 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {submitted ? (
              /* Success Stage */
              <div className="p-8 text-center space-y-5">
                <div className="w-16 h-16 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto border border-green-200">
                  <CheckCircle size={32} />
                </div>
                <div className="space-y-2">
                  <h4 className="font-sans font-extrabold text-lg text-oxford-blue">
                    {currentLanguage === 'es' ? '¡Cotización Enviada Exitosamente!' : 'Quote Submitted Successfully!'}
                  </h4>
                  <p className="text-xs text-industrial-gray leading-relaxed max-w-sm mx-auto">
                    {currentLanguage === 'es'
                      ? 'Nuestros ingenieros analistas han recibido su pliego de especificaciones. Le contactaremos en menos de 24 horas con la propuesta formal de LTL Freight.'
                      : 'Our engineering analysts have received your technical specifications. We will contact you within 24 hours with a formal LTL Freight pricing proposal.'}
                  </p>
                </div>

                <div className="bg-surface-container-low p-4 rounded border border-border-subtle text-left text-[11px] font-mono text-industrial-gray leading-normal max-w-sm mx-auto">
                  <div className="font-bold text-oxford-blue mb-1 uppercase tracking-wider">
                    {currentLanguage === 'es' ? 'RESUMEN DE TICKET' : 'TICKET SUMMARY'}
                  </div>
                  <div>ID: TCK-{(100000 + Math.floor(Math.random() * 900000))}</div>
                  <div>{currentLanguage === 'es' ? 'COMPAÑÍA' : 'COMPANY'}: {company.toUpperCase()}</div>
                  <div>{currentLanguage === 'es' ? 'INGENIERO' : 'ENGINEER'}: {engineer.toUpperCase()}</div>
                  <div>{currentLanguage === 'es' ? 'COMPONENTE' : 'COMPONENT'}: {activeProduct ? (currentLanguage === 'es' ? activeProduct.name_es : activeProduct.name_en) : 'VARIOS'} ({qty} uds)</div>
                </div>

                <button
                  onClick={handleReset}
                  className="bg-oxford-blue text-white hover:bg-industrial-gray px-6 py-3 rounded-sm font-sans text-xs font-bold uppercase tracking-wider transition-all"
                >
                  {currentLanguage === 'es' ? 'Entendido / Cerrar' : 'Understood / Close'}
                </button>
              </div>
            ) : (
              /* Input Form Stage */
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                
                {/* Product Dropdown selection */}
                <div>
                  <label className="block text-xs font-bold text-industrial-gray mb-1">
                    {currentLanguage === 'es' ? 'Componente Eléctrico Solicitado' : 'Requested Electrical Component'}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <select
                      value={selectedProductId}
                      onChange={(e) => setSelectedProductId(e.target.value)}
                      className="col-span-2 bg-white border border-border-subtle rounded p-2 text-xs focus:outline-none focus:border-oxford-blue text-text-main"
                    >
                      {productsList.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.sku} - {currentLanguage === 'es' ? p.name_es : p.name_en}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="10"
                      value={qty}
                      onChange={(e) => setQty(e.target.value)}
                      className="bg-white border border-border-subtle rounded p-2 text-xs text-center focus:outline-none focus:border-oxford-blue font-mono text-text-main"
                    />
                  </div>
                </div>

                {/* Company Name & Engineer Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-industrial-gray mb-1">
                      {currentLanguage === 'es' ? 'Nombre de la Empresa' : 'Company Name'} *
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-2.5 text-industrial-gray" size={14} />
                      <input
                        type="text"
                        required
                        placeholder="ej. Logística Global S.A."
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="w-full bg-white border border-border-subtle rounded py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-oxford-blue text-text-main"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-industrial-gray mb-1">
                      {currentLanguage === 'es' ? 'Ingeniero Encargado' : 'Lead Engineer'} *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 text-industrial-gray" size={14} />
                      <input
                        type="text"
                        required
                        placeholder="ej. Ing. Alejandro Ruiz"
                        value={engineer}
                        onChange={(e) => setEngineer(e.target.value)}
                        className="w-full bg-white border border-border-subtle rounded py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-oxford-blue text-text-main"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Email & Contact Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-industrial-gray mb-1">
                      {currentLanguage === 'es' ? 'Correo Electrónico' : 'Email Address'} *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 text-industrial-gray" size={14} />
                      <input
                        type="email"
                        required
                        placeholder="ingenieria@empresa.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white border border-border-subtle rounded py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-oxford-blue text-text-main font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-industrial-gray mb-1">
                      {currentLanguage === 'es' ? 'Teléfono Directo' : 'Direct Phone'} *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 text-industrial-gray" size={14} />
                      <input
                        type="text"
                        required
                        placeholder="+52 55 1234 5678"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-white border border-border-subtle rounded py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-oxford-blue text-text-main font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Technical notes & specs requirements */}
                <div>
                  <label className="block text-xs font-bold text-industrial-gray mb-1">
                    {currentLanguage === 'es' ? 'Especificaciones o Notas Especiales' : 'Special Specifications or Notes'}
                  </label>
                  <textarea
                    rows={3}
                    placeholder={
                      currentLanguage === 'es'
                        ? 'ej. Solicito cotización con recubrimiento extra para alta humedad marítima.'
                        : 'e.g., Request quote with custom coating for high marine humidity environments.'
                    }
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-white border border-border-subtle rounded p-2.5 text-xs focus:outline-none focus:border-oxford-blue text-text-main"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-border-subtle">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-4 py-2 border border-border-subtle text-industrial-gray rounded text-xs font-bold uppercase tracking-wider hover:bg-surface-container-low"
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-oxford-blue text-white rounded text-xs font-bold uppercase tracking-wider hover:bg-industrial-gray flex items-center gap-1.5"
                  >
                    <Send size={13} className="text-electric-yellow" />
                    {t.sendQuote}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
