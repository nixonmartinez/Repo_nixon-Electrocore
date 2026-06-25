import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, ShoppingCart, ArrowRight, ShieldCheck } from 'lucide-react';
import { CartItem, Language } from '../types';
import { DICTIONARY } from '../data';

interface CartSlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: Language;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, newQty: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
}

export default function CartSlideOver({
  isOpen,
  onClose,
  currentLanguage,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}: CartSlideOverProps) {
  const t = DICTIONARY[currentLanguage];

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans">
          <div className="absolute inset-0 overflow-hidden">
            
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            />

            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className="pointer-events-auto w-screen max-w-md"
              >
                <div className="flex h-full flex-col bg-white shadow-2xl border-l border-border-subtle">
                  
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-border-subtle px-4 py-6 sm:px-6">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-oxford-blue flex items-center gap-2">
                      <ShoppingCart size={18} />
                      {t.shoppingCart}
                    </h2>
                    <button
                      onClick={onClose}
                      className="rounded-full p-1.5 text-industrial-gray hover:bg-surface-container-low hover:text-oxford-blue transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Body list */}
                  <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 divide-y divide-border-subtle">
                    {cartItems.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center p-8">
                        <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center mb-4 text-industrial-gray/50">
                          <ShoppingCart size={28} />
                        </div>
                        <p className="text-sm font-bold text-oxford-blue mb-1">
                          {currentLanguage === 'es' ? 'Su carrito está vacío' : 'Your cart is empty'}
                        </p>
                        <p className="text-xs text-industrial-gray max-w-xs leading-normal">
                          {currentLanguage === 'es' 
                            ? 'Añada componentes de alta tensión desde nuestro catálogo para cotizar o comprar.'
                            : 'Add high-voltage electrical components from our catalog to request quotes or purchase.'}
                        </p>
                      </div>
                    ) : (
                      cartItems.map((item) => {
                        const name = currentLanguage === 'es' ? item.product.name_es : item.product.name_en;
                        return (
                          <div key={item.product.id} className="flex py-6 gap-4">
                            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded border border-border-subtle bg-surface-container-low p-2 flex items-center justify-center">
                              <img
                                src={item.product.image}
                                alt={name}
                                referrerPolicy="no-referrer"
                                className="max-h-full max-w-full object-contain mix-blend-multiply"
                              />
                            </div>

                            <div className="flex flex-1 flex-col">
                              <div>
                                <div className="flex justify-between text-xs font-bold text-oxford-blue">
                                  <h3 className="line-clamp-2 pr-2">{name}</h3>
                                  <p className="font-mono text-xs font-black ml-4">
                                    {t.currency}{(item.product.price * item.quantity).toFixed(2)}
                                  </p>
                                </div>
                                <p className="mt-1 text-[10px] font-mono font-medium text-industrial-gray">
                                  SKU: {item.product.sku}
                                </p>
                              </div>

                              <div className="flex flex-1 items-end justify-between text-xs mt-3">
                                <div className="flex items-center gap-2 border border-border-subtle rounded px-2 py-1">
                                  <button
                                    onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                                    className="text-industrial-gray hover:text-oxford-blue font-bold px-1"
                                  >
                                    -
                                  </button>
                                  <span className="font-mono font-bold w-4 text-center">{item.quantity}</span>
                                  <button
                                    onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                                    className="text-industrial-gray hover:text-oxford-blue font-bold px-1"
                                  >
                                    +
                                  </button>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => onRemoveItem(item.product.id)}
                                  className="font-bold text-red-600 hover:text-red-800 flex items-center gap-1.5 py-1 px-2 rounded hover:bg-red-50 transition-colors"
                                >
                                  <Trash2 size={13} />
                                  <span>{t.remove}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Footer calculations & checkout actions */}
                  {cartItems.length > 0 && (
                    <div className="border-t border-border-subtle bg-surface-container-lowest px-4 py-6 sm:px-6">
                      <div className="flex justify-between text-xs font-bold text-industrial-gray">
                        <span>{t.subtotal}</span>
                        <span className="font-mono text-sm font-black text-oxford-blue">
                          {t.currency}{subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <p className="mt-1 text-[10px] text-industrial-gray leading-normal">
                        {currentLanguage === 'es' 
                          ? 'Los costos de envío LTL e impuestos se calculan durante la verificación geográfica.' 
                          : 'Heavy freight shipping and taxes calculated at delivery verification step.'}
                      </p>

                      <div className="mt-6 space-y-3">
                        <button
                          onClick={onProceedToCheckout}
                          className="w-full bg-oxford-blue text-white hover:bg-industrial-gray py-4 rounded-sm font-sans text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 shadow"
                        >
                          <span>{t.checkoutBtn}</span>
                          <ArrowRight size={14} className="text-electric-yellow" />
                        </button>
                        <button
                          onClick={onClose}
                          className="w-full text-center py-2 text-xs font-bold text-industrial-gray hover:text-oxford-blue uppercase tracking-wider"
                        >
                          {t.continueShopping}
                        </button>
                      </div>

                      <div className="mt-4 flex items-center justify-center gap-1.5 text-[9px] font-bold text-industrial-gray uppercase tracking-wider">
                        <ShieldCheck size={14} className="text-oxford-blue" />
                        <span>{t.securedAcquisition}</span>
                      </div>
                    </div>
                  )}

                </div>
              </motion.div>
            </div>

          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
