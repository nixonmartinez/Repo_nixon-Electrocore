import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileSpreadsheet, Upload, Download, Check, AlertCircle, ShoppingCart } from 'lucide-react';
import { Language, Product } from '../types';

interface BOMUploadProps {
  currentLanguage: Language;
  productsList: Product[];
  onAddToCart: (product: Product, quantity: number) => void;
  onOpenCart: () => void;
}

interface BOMItem {
  product: Product;
  quantity: number;
}

export default function BOMUpload({
  currentLanguage,
  productsList,
  onAddToCart,
  onOpenCart,
}: BOMUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<'piantini' | 'monte-plata' | null>(null);
  const [bomItems, setBomItems] = useState<BOMItem[]>([]);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Mock template definitions matching catalog products
  const loadTemplate = (type: 'piantini' | 'monte-plata') => {
    setSelectedTemplate(type);
    
    // Find products in lists to build BOM
    const cable = productsList.find(p => p.sku.includes('CB')) || productsList[2]; // Cable blindado
    const insulator = productsList.find(p => p.sku.includes('XL')) || productsList[0]; // Aislador
    const breaker = productsList.find(p => p.sku.includes('TX')) || productsList[1]; // Disyuntor
    const transformer = productsList.find(p => p.sku.includes('440V')) || productsList[5]; // Transformador
    const led = productsList.find(p => p.sku.includes('LED')) || productsList[3]; // Luminaria

    if (type === 'piantini') {
      // Substation Expansion in SD
      setBomItems([
        { product: cable, quantity: 450 }, // 450 meters
        { product: insulator, quantity: 6 },
        { product: breaker, quantity: 4 },
        { product: transformer, quantity: 1 }
      ]);
    } else {
      // Solar Park Lighting and Grid automation
      setBomItems([
        { product: led, quantity: 24 }, // 24 high bays
        { product: cable, quantity: 200 },
        { product: insulator, quantity: 12 },
        { product: breaker, quantity: 8 }
      ]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Simulate reading file - auto load Piantini template as fallback demo
      loadTemplate('piantini');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      loadTemplate('piantini');
    }
  };

  const handleInjectCart = () => {
    if (bomItems.length === 0) return;

    // Inject all items to parent state
    bomItems.forEach(item => {
      onAddToCart(item.product, item.quantity);
    });

    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
      onOpenCart(); // Automatically slides over the cart to show items
    }, 1500);
  };

  const handleClear = () => {
    setSelectedTemplate(null);
    setBomItems([]);
  };

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 font-sans">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 20 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-0 left-1/2 -translate-x-1/2 z-50 bg-[#101b30] border border-electric-yellow/30 text-white px-6 py-4 rounded-md shadow-2xl flex items-center gap-3"
          >
            <div className="bg-green-500 text-white rounded-full p-1 shrink-0">
              <Check size={16} />
            </div>
            <div className="text-xs">
              <p className="font-extrabold uppercase text-electric-yellow tracking-wider">
                {currentLanguage === 'es' ? '¡Lista BOM Inyectada!' : 'BOM List Injected!'}
              </p>
              <p className="text-white/80 mt-0.5">
                {currentLanguage === 'es' 
                  ? 'Todos los materiales han sido agregados al carrito.' 
                  : 'All materials successfully added to your shopping cart.'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Title */}
      <div className="border-b border-border-subtle pb-4">
        <h2 className="text-oxford-blue text-2xl font-black tracking-tight uppercase">
          {currentLanguage === 'es' ? 'Carga Rápida de Planos (BOM)' : 'BOM Project Upload'}
        </h2>
        <p className="text-xs text-industrial-gray mt-1">
          {currentLanguage === 'es'
            ? 'Optimice su proceso de adquisición industrial. Suba la lista de materiales (Bill of Materials) de su obra en formato Excel o CSV.'
            : 'Accelerate industrial procurement. Drag and drop your project bill of materials (BOM) Excel sheet or text file.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Upload box and templates */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Drag & Drop File Zone */}
          <div 
            className={`border-2 border-dashed rounded-lg p-10 text-center transition-all ${
              dragActive 
                ? 'border-oxford-blue bg-surface-container-low scale-[0.99]' 
                : 'border-border-subtle bg-white hover:border-industrial-gray/60'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload size={40} className="mx-auto text-industrial-gray/60 mb-4 animate-bounce" />
            <p className="text-sm font-extrabold text-oxford-blue uppercase tracking-wider">
              {currentLanguage === 'es' ? 'Arrastre su archivo Excel/CSV aquí' : 'Drag & Drop your Excel/CSV sheet here'}
            </p>
            <p className="text-xs text-industrial-gray mt-1 mb-6">
              {currentLanguage === 'es' ? 'O busque en sus archivos locales.' : 'Or browse local files on your computer.'}
            </p>

            <label className="bg-oxford-blue text-white hover:bg-industrial-gray cursor-pointer text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-sm shadow transition-colors inline-block">
              {currentLanguage === 'es' ? 'Seleccionar Archivo' : 'Browse File'}
              <input 
                type="file" 
                accept=".xlsx,.xls,.csv" 
                className="hidden" 
                onChange={handleFileChange} 
              />
            </label>
          </div>

          {/* Quick-load Preconfigured Demo Projects */}
          <div className="bg-white border border-border-subtle rounded-md p-6 space-y-4">
            <div>
              <h3 className="font-sans font-bold text-sm text-oxford-blue">
                {currentLanguage === 'es' ? 'Simular Cargas de Ejemplo (Proyectos Dominicanos)' : 'Simulate Demo Uploads (DR Projects)'}
              </h3>
              <p className="text-[11px] text-industrial-gray mt-0.5">
                {currentLanguage === 'es'
                  ? 'Seleccione una de las plantillas para ver cómo el sistema decodifica una planilla de ingeniería eléctrica.'
                  : 'Pick one of our preconfigured project sheets to simulate how our engine parses bills of materials.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Template 1 */}
              <button
                onClick={() => loadTemplate('piantini')}
                className={`text-left p-4 rounded border transition-all ${
                  selectedTemplate === 'piantini'
                    ? 'border-oxford-blue bg-surface-container-low ring-1 ring-oxford-blue/30'
                    : 'border-border-subtle hover:border-industrial-gray/40 bg-surface-container-lowest'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black text-oxford-blue uppercase tracking-widest bg-electric-yellow/30 px-2 py-0.5 rounded">
                    SUBESTACIÓN LTL
                  </span>
                  <FileSpreadsheet size={16} className="text-industrial-gray" />
                </div>
                <h4 className="font-bold text-xs text-oxford-blue mt-2 truncate">
                  {currentLanguage === 'es' ? 'Expansión Piantini SD' : 'Piantini SD Expansion'}
                </h4>
                <p className="text-[10px] text-industrial-gray leading-normal mt-1">
                  {currentLanguage === 'es'
                    ? '4 partidas de cableado, aisladores y transformador trifásico seco.'
                    : '4 line items including cabling, heavy transformer, and fittings.'}
                </p>
              </button>

              {/* Template 2 */}
              <button
                onClick={() => loadTemplate('monte-plata')}
                className={`text-left p-4 rounded border transition-all ${
                  selectedTemplate === 'monte-plata'
                    ? 'border-oxford-blue bg-surface-container-low ring-1 ring-oxford-blue/30'
                    : 'border-border-subtle hover:border-industrial-gray/40 bg-surface-container-lowest'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black text-green-800 uppercase tracking-widest bg-green-100 px-2 py-0.5 rounded">
                    FOTOVOLTAICA
                  </span>
                  <FileSpreadsheet size={16} className="text-industrial-gray" />
                </div>
                <h4 className="font-bold text-xs text-oxford-blue mt-2 truncate">
                  {currentLanguage === 'es' ? 'Parque Solar Monte Plata' : 'Monte Plata Solar Park'}
                </h4>
                <p className="text-[10px] text-industrial-gray leading-normal mt-1">
                  {currentLanguage === 'es'
                    ? '4 partidas de iluminación perimetral y automatización de red.'
                    : '4 line items including high-bay industrial LED lights and automation.'}
                </p>
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Decoded items table preview */}
        <div className="lg:col-span-5">
          
          <div className="bg-white border border-border-subtle rounded-md p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-border-subtle pb-3">
              <div>
                <h3 className="font-sans font-bold text-sm text-oxford-blue uppercase tracking-wider">
                  {currentLanguage === 'es' ? 'Fichas Decodificadas' : 'Parsed BOM Sheet'}
                </h3>
                <p className="text-[10px] text-industrial-gray">
                  {bomItems.length > 0 
                    ? (currentLanguage === 'es' ? `${bomItems.length} materiales encontrados` : `${bomItems.length} components parsed`)
                    : (currentLanguage === 'es' ? 'Esperando carga de lista' : 'Waiting for file load')}
                </p>
              </div>

              {bomItems.length > 0 && (
                <button
                  onClick={handleClear}
                  className="text-[10px] font-bold text-red-600 hover:text-red-800 uppercase"
                >
                  {currentLanguage === 'es' ? 'Limpiar' : 'Clear'}
                </button>
              )}
            </div>

            {bomItems.length > 0 ? (
              <div className="space-y-4">
                
                {/* List preview items */}
                <div className="divide-y divide-border-subtle max-h-80 overflow-y-auto pr-1">
                  {bomItems.map((item) => {
                    const name = currentLanguage === 'es' ? item.product.name_es : item.product.name_en;
                    return (
                      <div key={item.product.id} className="py-3 flex justify-between items-center gap-3">
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-oxford-blue truncate" title={name}>{name}</h4>
                          <span className="text-[9px] text-industrial-gray font-mono block">SKU: {item.product.sku}</span>
                          <span className="text-xs text-text-main font-semibold mt-0.5 block">
                            Cant: {item.quantity} {item.product.category === 'power' ? 'm' : 'uds'}
                          </span>
                        </div>
                        
                        <div className="text-right shrink-0">
                          <span className="text-[10px] text-industrial-gray block">Unit: RD${item.product.price.toFixed(2)}</span>
                          <span className="font-mono text-xs font-extrabold text-oxford-blue">
                            RD${(item.product.price * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Subtotal summary card */}
                <div className="border-t border-border-subtle pt-4 space-y-2 text-xs font-sans">
                  <div className="flex justify-between items-center text-industrial-gray">
                    <span>{currentLanguage === 'es' ? 'Subtotal Materiales' : 'Materials Subtotal'}</span>
                    <span className="font-mono font-bold">
                      RD${bomItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="bg-[#101b30] text-white p-3.5 rounded border border-white/5 flex gap-2 items-start mt-2">
                    <AlertCircle size={15} className="text-electric-yellow shrink-0 mt-0.5" />
                    <p className="text-[10px] text-white/80 leading-normal">
                      {currentLanguage === 'es'
                        ? 'La cotización por volumen califica para tarifas especiales de flete y seguros LTL. Al inyectar al carrito, podrá verificar el costo de transporte consolidado.'
                        : 'Bulk orders qualify for priority LTL cargo dispatch rates. Once items are loaded in the cart, calculate freight coverage.'}
                    </p>
                  </div>
                </div>

                {/* Inject button */}
                <button
                  onClick={handleInjectCart}
                  className="w-full bg-electric-yellow text-oxford-blue hover:opacity-95 py-4 rounded-sm font-sans text-xs font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 shadow active:scale-[0.98] transition-all cursor-pointer"
                >
                  <ShoppingCart size={15} />
                  <span>{currentLanguage === 'es' ? 'Inyectar al Carrito' : 'Inject to Shopping Cart'}</span>
                </button>

              </div>
            ) : (
              /* Empty state right card */
              <div className="text-center py-20 text-industrial-gray space-y-3">
                <FileSpreadsheet size={32} className="mx-auto text-industrial-gray/40" />
                <p className="text-xs italic max-w-[240px] mx-auto leading-normal">
                  {currentLanguage === 'es'
                    ? 'Suba su lista de materiales o cargue una de nuestras plantillas de prueba a la izquierda.'
                    : 'Upload your BOM sheet or pick one of our preconfigured demo projects on the left.'}
                </p>
              </div>
            )}

            <div className="border-t border-border-subtle/50 pt-3 flex items-center justify-between text-[10px] text-industrial-gray">
              <span className="flex items-center gap-1">
                <Check size={12} className="text-green-600" />
                {currentLanguage === 'es' ? 'Validación Excel v4' : 'Excel Schema v4 OK'}
              </span>
              <a 
                href="#download-template" 
                onClick={(e) => { e.preventDefault(); alert(currentLanguage === 'es' ? 'Descargando plantilla de ejemplo ElectroCore_BOM_Template.xlsx...' : 'Downloading sample BOM template ElectroCore_BOM_Template.xlsx...'); }}
                className="hover:underline flex items-center gap-1"
              >
                <Download size={11} />
                {currentLanguage === 'es' ? 'Descargar Plantilla' : 'Download Template'}
              </a>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
