import React from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, FileText, CheckCircle2, AlertTriangle, HelpCircle, Eye } from 'lucide-react';
import { Product, Language } from '../types';
import { DICTIONARY } from '../data';

interface ProductCatalogProps {
  products: Product[];
  currentLanguage: Language;
  selectedCategory: 'power' | 'transformer' | 'led' | 'automation' | 'all';
  onCategoryChange: (cat: 'power' | 'transformer' | 'led' | 'automation' | 'all') => void;
  searchTerm: string;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onQuoteProduct: (product: Product) => void;
}

export default function ProductCatalog({
  products,
  currentLanguage,
  selectedCategory,
  onCategoryChange,
  searchTerm,
  onSelectProduct,
  onAddToCart,
  onQuoteProduct,
}: ProductCatalogProps) {
  const t = DICTIONARY[currentLanguage];

  // Filter products by category and search term
  const filteredProducts = products.filter((prod) => {
    const matchesCategory = selectedCategory === 'all' || prod.category === selectedCategory;
    const searchLower = searchTerm.toLowerCase();
    const name = currentLanguage === 'es' ? prod.name_es : prod.name_en;
    const desc = currentLanguage === 'es' ? prod.desc_es : prod.desc_en;
    
    const matchesSearch =
      prod.sku.toLowerCase().includes(searchLower) ||
      name.toLowerCase().includes(searchLower) ||
      desc.toLowerCase().includes(searchLower) ||
      prod.category.toLowerCase().includes(searchLower);
      
    return matchesCategory && matchesSearch;
  });

  const categories = [
    { id: 'all' as const, label_es: 'Todos', label_en: 'All' },
    { id: 'power' as const, label_es: t.catPower, label_en: 'Power Cabling' },
    { id: 'transformer' as const, label_es: t.catTransformers, label_en: 'Transformers' },
    { id: 'led' as const, label_es: t.catLed, label_en: 'LED Lighting' },
    { id: 'automation' as const, label_es: t.catAutomation, label_en: 'Automation' },
  ];

  return (
    <section id="catalog-section" className="bg-surface-container-low py-16 px-4 sm:px-6 lg:px-8 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        
        {/* Title and Category Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <h2 className="font-sans font-extrabold text-2xl lg:text-3xl text-oxford-blue">
              {t.featuredTitle}
            </h2>
            <p className="text-industrial-gray font-sans text-sm mt-1">
              {t.featuredSub}
            </p>
          </div>

          {/* Styled Filter Tabs */}
          <div className="flex flex-wrap gap-2 bg-white p-1 rounded-lg border border-border-subtle self-start md:self-end">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`px-3 py-1.5 font-sans text-xs font-bold rounded-md transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-oxford-blue text-white shadow'
                    : 'text-industrial-gray hover:text-oxford-blue hover:bg-surface-container-low'
                }`}
              >
                {currentLanguage === 'es' ? cat.label_es : cat.label_en}
              </button>
            ))}
          </div>
        </div>

        {/* Promotion Banner */}
        <div className="mb-8 bg-gradient-to-r from-oxford-blue to-[#1e2d4a] text-white p-4 sm:p-5 rounded border border-white/5 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-electric-yellow/15 text-electric-yellow rounded-full flex items-center justify-center">
              <span className="text-sm">🔥</span>
            </div>
            <div>
              <h4 className="font-sans font-bold text-sm text-electric-yellow">
                {currentLanguage === 'es' ? '¡Oferta de Temporada Industrial!' : 'Seasonal Industrial Promotion!'}
              </h4>
              <p className="text-xs text-white/80 mt-0.5 leading-normal font-sans">
                {currentLanguage === 'es'
                  ? 'Agrega productos al carrito y cotiza/compra al instante con despacho directo a tu obra.'
                  : 'Add products to your cart and quote/purchase instantly with direct shipping to your jobsite.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] uppercase font-bold tracking-wider bg-white/10 text-white/95 px-2 py-1 rounded">
              {currentLanguage === 'es' ? 'En Stock Real' : 'In Real Stock'}
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider bg-electric-yellow text-oxford-blue px-2 py-1 rounded">
              {currentLanguage === 'es' ? 'Garantía EIG' : 'EIG Certified'}
            </span>
          </div>
        </div>

        {/* Catalog Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-md border border-border-subtle p-12 text-center">
            <HelpCircle size={48} className="text-industrial-gray/40 mx-auto mb-4" />
            <p className="text-industrial-gray font-sans font-medium text-sm">
              {currentLanguage === 'es'
                ? 'No se encontraron componentes que coincidan con los filtros.'
                : 'No components found matching your search filters.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((prod) => {
              const name = currentLanguage === 'es' ? prod.name_es : prod.name_en;
              const desc = currentLanguage === 'es' ? prod.desc_es : prod.desc_en;

              return (
                <motion.div
                  key={prod.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white border border-border-subtle rounded-md p-4 flex flex-col justify-between hover:shadow-md transition-all"
                >
                  {/* Image wrapper */}
                  <div 
                    onClick={() => onSelectProduct(prod)}
                    className="relative h-44 bg-surface-container-high rounded-sm mb-4 overflow-hidden flex items-center justify-center cursor-pointer group"
                  >
                    <img
                      src={prod.image}
                      alt={name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-oxford-blue/10 group-hover:bg-oxford-blue/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 duration-200">
                      <span className="bg-white/90 text-oxford-blue px-3 py-1.5 rounded-sm font-sans text-xs font-bold shadow flex items-center gap-1.5">
                        <Eye size={14} />
                        {currentLanguage === 'es' ? 'Ficha Técnica' : 'Technical Data'}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div>
                    <span className="text-[10px] font-mono font-semibold text-industrial-gray bg-surface-container-low px-2 py-0.5 rounded border border-border-subtle mb-2 inline-block">
                      SKU: {prod.sku}
                    </span>
                    <h4 
                      onClick={() => onSelectProduct(prod)}
                      className="font-sans font-bold text-sm text-oxford-blue mb-1 line-clamp-2 hover:text-industrial-gray cursor-pointer"
                    >
                      {name}
                    </h4>
                    <p className="text-industrial-gray/80 font-sans text-xs line-clamp-2 mb-4 leading-relaxed">
                      {desc}
                    </p>
                  </div>

                  {/* Actions & Price */}
                  <div className="mt-auto pt-3 border-t border-border-subtle">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-oxford-blue font-sans font-extrabold text-lg">
                        {t.currency}{prod.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        <span className="text-[10px] text-industrial-gray font-normal ml-0.5">
                          {prod.category === 'power' && prod.sku.includes('CB') ? '/m' : ''}
                        </span>
                      </span>

                      {/* Stock Badges */}
                      {prod.status === 'in_stock' && (
                        <span className="bg-green-50 text-green-700 text-[10px] px-2 py-0.5 rounded-sm font-bold border border-green-200 flex items-center gap-1">
                          <CheckCircle2 size={10} />
                          {t.inStock}
                        </span>
                      )}
                      {prod.status === 'low_stock' && (
                        <span className="bg-amber-50 text-amber-700 text-[10px] px-2 py-0.5 rounded-sm font-bold border border-amber-200 flex items-center gap-1">
                          <AlertTriangle size={10} />
                          {t.lowStock} ({prod.stock})
                        </span>
                      )}
                      {prod.status === 'on_order' && (
                        <span className="bg-blue-50 text-blue-700 text-[10px] px-2 py-0.5 rounded-sm font-bold border border-blue-200 flex items-center gap-1">
                          {t.onOrder}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onAddToCart(prod)}
                        disabled={prod.status === 'on_order'}
                        className={`py-2 px-3 rounded-sm font-sans text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
                          prod.status === 'on_order'
                            ? 'bg-surface-container-high text-industrial-gray/40 cursor-not-allowed border border-border-subtle'
                            : 'bg-oxford-blue text-white hover:bg-industrial-gray hover:text-white'
                        }`}
                      >
                        <ShoppingCart size={13} />
                        {t.addToCart}
                      </button>
                      <button
                        onClick={() => onQuoteProduct(prod)}
                        className="border border-industrial-gray text-industrial-gray py-2 px-3 rounded-sm font-sans text-xs font-bold flex items-center justify-center gap-1 hover:bg-surface-container-low transition-all active:scale-95"
                      >
                        <FileText size={13} />
                        {t.quoteBtn}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
