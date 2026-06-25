import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, FileText, ZoomIn, ChevronRight, Check, Award, ShieldCheck, Heart, ArrowLeft } from 'lucide-react';
import { Product, Language } from '../types';
import { DICTIONARY } from '../data';

interface ProductDetailsProps {
  product: Product;
  currentLanguage: Language;
  onAddToCart: (product: Product, quantity: number) => void;
  onQuoteRequest: (product: Product, quantity: number) => void;
  onBackToCatalog: () => void;
}

export default function ProductDetails({
  product,
  currentLanguage,
  onAddToCart,
  onQuoteRequest,
  onBackToCatalog,
}: ProductDetailsProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const t = DICTIONARY[currentLanguage];

  const name = currentLanguage === 'es' ? product.name_es : product.name_en;
  const desc = currentLanguage === 'es' ? product.desc_es : product.desc_en;

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setSuccessMessage(
      currentLanguage === 'es' 
        ? `¡Añadido al carrito: ${quantity} unidades!` 
        : `Added to cart: ${quantity} units!`
    );
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleQuoteRequest = () => {
    onQuoteRequest(product, quantity);
    setSuccessMessage(
      currentLanguage === 'es'
        ? `¡Cotización técnica enviada por lote de ${quantity} unidades!`
        : `Technical quote sent for bulk of ${quantity} units!`
    );
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <section className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumb & Navigation */}
        <div className="flex flex-wrap items-center gap-2 mb-8 text-xs font-semibold text-industrial-gray">
          <button 
            onClick={onBackToCatalog}
            className="hover:text-oxford-blue flex items-center gap-1"
          >
            <ArrowLeft size={14} />
            {t.catalog}
          </button>
          <ChevronRight size={12} className="text-industrial-gray/40" />
          <span className="capitalize">{product.category === 'power' ? t.catPower : product.category}</span>
          <ChevronRight size={12} className="text-industrial-gray/40" />
          <span className="text-oxford-blue font-bold">{name}</span>
        </div>

        {/* Core Detail Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Images Gallery Column */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Large Active Image Box */}
            <div className="relative aspect-[4/3] bg-surface-container-low border border-border-subtle rounded-md overflow-hidden flex items-center justify-center p-6 group">
              <img
                src={product.thumbnails[activeImageIndex] || product.image}
                alt={name}
                referrerPolicy="no-referrer"
                className="max-h-full max-w-full object-contain mix-blend-multiply"
              />
              
              <button
                onClick={() => setZoomOpen(true)}
                className="absolute bottom-4 right-4 bg-white/95 text-oxford-blue p-2.5 rounded-full shadow hover:bg-white transition-colors border border-border-subtle"
                title="Zoom specs"
              >
                <ZoomIn size={18} />
              </button>
            </div>

            {/* Thumbnail Navigation Row */}
            <div className="flex flex-wrap gap-3">
              {product.thumbnails.map((thumb, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 bg-surface-container-low border rounded-md overflow-hidden p-2 flex items-center justify-center transition-all ${
                    idx === activeImageIndex
                      ? 'border-oxford-blue ring-2 ring-oxford-blue/15'
                      : 'border-border-subtle hover:border-industrial-gray'
                  }`}
                >
                  <img
                    src={thumb}
                    alt={`${name} angle ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="max-h-full max-w-full object-contain mix-blend-multiply"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Technical and Pricing Sidebar Column */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              {/* Product Status & Part Number */}
              <div className="flex items-center justify-between gap-4 mb-4">
                <span className={`text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded border ${
                  product.status === 'in_stock'
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {product.status === 'in_stock' ? t.inStock : t.lowStock}
                </span>
                
                <span className="font-mono text-xs text-industrial-gray font-semibold">
                  {t.partNo}: {product.sku}
                </span>
              </div>

              {/* Title & Description */}
              <h1 className="font-sans font-extrabold text-3xl text-oxford-blue mb-4 tracking-tight leading-tight">
                {name}
              </h1>
              
              <p className="text-industrial-gray font-sans text-sm mb-6 leading-relaxed">
                {desc}
              </p>

              {/* Technical Specifications Table */}
              <div className="mb-8">
                <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-oxford-blue mb-3">
                  {t.techSpecs}
                </h3>
                <div className="border border-border-subtle rounded-md overflow-hidden font-sans text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-container-low border-b border-border-subtle">
                        <th className="p-3 font-bold text-oxford-blue w-2/5">
                          {currentLanguage === 'es' ? 'Especificación' : 'Specification'}
                        </th>
                        <th className="p-3 font-bold text-oxford-blue w-3/5">
                          {currentLanguage === 'es' ? 'Valor' : 'Value'}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                      {product.specs.map((spec, idx) => (
                        <tr 
                          key={idx}
                          className={idx % 2 === 0 ? 'bg-white' : 'bg-surface-container-lowest'}
                        >
                          <td className="p-3 font-semibold text-industrial-gray">
                            {currentLanguage === 'es' ? spec.key_es : spec.key_en}
                          </td>
                          <td className="p-3 text-text-main font-mono">
                            {currentLanguage === 'es' ? spec.value_es : spec.value_en}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Price Box and Action Controls Card */}
            <div className="bg-surface-container-low border border-border-subtle rounded-md p-6">
              
              {/* Unit price listing */}
              <div className="flex justify-between items-baseline mb-6">
                <span className="text-xs font-semibold text-industrial-gray uppercase">
                  {t.unitPrice}
                </span>
                <span className="text-oxford-blue font-sans font-black text-3xl">
                  {t.currency}{product.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              {/* Success Notification Alert */}
              <AnimatePresence>
                {successMessage && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-green-50 border border-green-200 text-green-800 text-xs font-bold rounded-sm p-3 mb-4 flex items-center gap-2"
                  >
                    <Check size={14} />
                    {successMessage}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Actions controls row */}
              <div className="space-y-4">
                
                {/* Quantity adjuster */}
                <div className="flex items-center justify-between gap-4 bg-white border border-border-subtle rounded-sm p-2">
                  <span className="text-xs font-bold text-industrial-gray pl-2">
                    {currentLanguage === 'es' ? 'Cantidad' : 'Quantity'}
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleDecrease}
                      className="w-8 h-8 rounded-full border border-border-subtle flex items-center justify-center font-bold text-industrial-gray hover:bg-surface-container-low hover:text-oxford-blue transition-colors text-sm"
                    >
                      -
                    </button>
                    <span className="font-mono text-sm font-extrabold w-6 text-center text-oxford-blue">
                      {quantity}
                    </span>
                    <button
                      onClick={handleIncrease}
                      className="w-8 h-8 rounded-full border border-border-subtle flex items-center justify-center font-bold text-industrial-gray hover:bg-surface-container-low hover:text-oxford-blue transition-colors text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Primary cart button */}
                <button
                  onClick={handleAddToCart}
                  disabled={product.status === 'on_order'}
                  className={`w-full py-3.5 rounded-sm font-sans text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow transition-all active:scale-95 ${
                    product.status === 'on_order'
                      ? 'bg-surface-container-high text-industrial-gray/40 cursor-not-allowed border border-border-subtle'
                      : 'bg-oxford-blue text-white hover:bg-industrial-gray hover:text-white'
                  }`}
                >
                  <ShoppingCart size={15} />
                  {t.addCartBtn}
                </button>

                {/* Secondary quote button */}
                <button
                  onClick={handleQuoteRequest}
                  className="w-full bg-white border border-industrial-gray text-industrial-gray hover:bg-surface-container-low py-3.5 rounded-sm font-sans text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <FileText size={15} />
                  {t.requestBulkQuote}
                </button>
              </div>

              {/* Delivery estimation disclaimer */}
              <p className="text-[10px] text-industrial-gray text-center mt-4">
                {t.deliveryEstimation}
              </p>
            </div>

            {/* Quality Standard Badges */}
            <div className="grid grid-cols-3 gap-2 mt-6 pt-6 border-t border-border-subtle text-center text-[10px] font-bold text-industrial-gray uppercase tracking-wider">
              <div className="flex flex-col items-center gap-1.5">
                <Award size={18} className="text-oxford-blue" />
                <span>ISO 9001</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <ShieldCheck size={18} className="text-oxford-blue" />
                <span>RoHS Compliant</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <Heart size={18} className="text-oxford-blue" />
                <span>{t.certificationBadges}</span>
              </div>
            </div>

          </div>
        </div>

        {/* Zoom image Modal */}
        {zoomOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-md max-w-3xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setZoomOpen(false)}
                className="absolute top-4 right-4 bg-surface-container-low text-oxford-blue font-bold px-3 py-1.5 rounded-full hover:bg-surface-container-high transition-colors text-xs"
              >
                {currentLanguage === 'es' ? 'Cerrar' : 'Close'}
              </button>
              <h2 className="font-sans font-extrabold text-lg text-oxford-blue mb-4">
                {currentLanguage === 'es' ? 'Ficha de Inspección Detallada' : 'Detailed Inspection View'}
              </h2>
              <div className="flex justify-center bg-surface-container-low p-4 rounded-md">
                <img
                  src={product.thumbnails[activeImageIndex] || product.image}
                  alt={name}
                  referrerPolicy="no-referrer"
                  className="max-h-[50vh] object-contain"
                />
              </div>
              <div className="mt-4 text-xs text-industrial-gray font-mono">
                SKU: {product.sku} | {currentLanguage === 'es' ? 'Resolución Nativa de Componente Certificado' : 'Native High-Voltage Certified Resolution'}
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
