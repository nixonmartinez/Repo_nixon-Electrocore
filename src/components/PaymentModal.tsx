import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, CreditCard, ShieldCheck, Download, Calendar, Truck, ArrowRight } from 'lucide-react';
import { Language, CartItem, DeliveryDetails } from '../types';
import { DICTIONARY } from '../data';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  deliveryDetails: DeliveryDetails;
  currentLanguage: Language;
  onClearCart: () => void;
}

export default function PaymentModal({
  isOpen,
  onClose,
  cartItems,
  deliveryDetails,
  currentLanguage,
  onClearCart,
}: PaymentModalProps) {
  const t = DICTIONARY[currentLanguage];

  const [paymentDone, setPaymentDone] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [holderName, setHolderName] = useState('');

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const taxes = subtotal * 0.08;
  const grandTotal = subtotal + taxes + deliveryDetails.calculatedFee;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !expiry || !cvv || !holderName) return;

    setPaymentDone(true);
  };

  const handleFinish = () => {
    onClearCart();
    setPaymentDone(false);
    setCardNumber('');
    setExpiry('');
    setCvv('');
    setHolderName('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleFinish}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white border border-border-subtle rounded-md max-w-md w-full relative z-10 overflow-hidden shadow-2xl font-sans"
          >
            {/* Header */}
            <div className="bg-oxford-blue text-white px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-electric-yellow" />
                <h3 className="font-sans font-extrabold text-xs uppercase tracking-wider">
                  {currentLanguage === 'es' ? 'PASARELA DE ADQUISICIÓN SEGURA' : 'SECURE PROCUREMENT GATEWAY'}
                </h3>
              </div>
              <button
                onClick={handleFinish}
                className="text-white/80 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {paymentDone ? (
              /* Success screen state */
              <div className="p-8 text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto border border-green-200">
                  <CheckCircle size={32} />
                </div>

                <div className="space-y-2">
                  <h4 className="font-sans font-extrabold text-lg text-oxford-blue">
                    {currentLanguage === 'es' ? '¡Adquisición Confirmada!' : 'Procurement Confirmed!'}
                  </h4>
                  <p className="text-xs text-industrial-gray leading-relaxed max-w-sm mx-auto">
                    {currentLanguage === 'es'
                      ? 'El pago se procesó de forma segura. El despacho y envío de carga pesada LTL ha sido programado.'
                      : 'Payment processed successfully. LTL heavy freight shipment dispatch has been queued.'}
                  </p>
                </div>

                <div className="border border-border-subtle rounded bg-surface-container-low p-4 text-left font-mono text-[10px] text-industrial-gray space-y-1">
                  <div className="font-sans font-bold text-oxford-blue border-b border-border-subtle/50 pb-1 mb-2 uppercase">
                    {currentLanguage === 'es' ? 'Ticket de Transacción' : 'Transaction Ticket'}
                  </div>
                  <div>ID: TX-{(500000 + Math.floor(Math.random() * 500000))}</div>
                  <div>{currentLanguage === 'es' ? 'PROYECTO' : 'PROJECT'}: {deliveryDetails.projectName.toUpperCase() || 'STANDARD'}</div>
                  <div>{currentLanguage === 'es' ? 'ENTREGA' : 'DELIVERY'}: {deliveryDetails.address.toUpperCase()}, {deliveryDetails.city.toUpperCase()}</div>
                  <div className="font-bold text-oxford-blue pt-1.5 border-t border-border-subtle/30 flex justify-between">
                    <span>{currentLanguage === 'es' ? 'CARGO TOTAL' : 'TOTAL CHARGE'}:</span>
                    <span>{t.currency}{grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => {
                      alert(currentLanguage === 'es' ? 'Imprimiendo Factura XML/PDF e instructivo de despacho...' : 'Downloading PDF/XML Invoice and freight dispatch guidelines...');
                    }}
                    className="flex-1 border border-border-subtle text-industrial-gray hover:bg-surface-container-low py-3 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Download size={13} />
                    <span>PDF</span>
                  </button>
                  <button
                    onClick={handleFinish}
                    className="flex-1 bg-oxford-blue text-white hover:bg-industrial-gray py-3 rounded-sm text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    {currentLanguage === 'es' ? 'Listo' : 'Done'}
                  </button>
                </div>
              </div>
            ) : (
              /* Payment form state */
              <form onSubmit={handlePay} className="p-6 space-y-4">
                
                {/* Total box HUD */}
                <div className="bg-surface-container-low border border-border-subtle rounded p-4 flex justify-between items-center mb-2">
                  <div>
                    <span className="text-[10px] text-industrial-gray font-bold block uppercase">{t.total}</span>
                    <span className="text-xs text-oxford-blue font-semibold">{deliveryDetails.projectName || 'Standard Client'}</span>
                  </div>
                  <span className="font-mono font-black text-xl text-oxford-blue">{t.currency}{grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>

                {/* Card holder */}
                <div>
                  <label className="block text-xs font-bold text-industrial-gray mb-1">
                    {currentLanguage === 'es' ? 'Nombre del Tarjetahabiente / Empresa' : 'Card Holder Name / Corp'} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ING. ALEJANDRO RUIZ"
                    value={holderName}
                    onChange={(e) => setHolderName(e.target.value.toUpperCase())}
                    className="w-full bg-white border border-border-subtle rounded p-2.5 text-xs text-text-main focus:outline-none focus:border-oxford-blue font-sans"
                  />
                </div>

                {/* Card number */}
                <div>
                  <label className="block text-xs font-bold text-industrial-gray mb-1">
                    {currentLanguage === 'es' ? 'Número de Tarjeta de Crédito Corporativa' : 'Corporate Credit Card Number'} *
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-2.5 text-industrial-gray" size={16} />
                    <input
                      type="text"
                      required
                      maxLength={19}
                      placeholder="4000 1234 5678 9010"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-white border border-border-subtle rounded py-2.5 pl-10 pr-3 text-xs text-text-main focus:outline-none focus:border-oxford-blue font-mono"
                    />
                  </div>
                </div>

                {/* Expiry & CVV */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-industrial-gray mb-1">
                      {currentLanguage === 'es' ? 'Fecha Expiración' : 'Expiration Date'} *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={5}
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      className="w-full bg-white border border-border-subtle rounded p-2.5 text-xs text-text-main focus:outline-none focus:border-oxford-blue font-mono text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-industrial-gray mb-1">CVV / CVN *</label>
                    <input
                      type="password"
                      required
                      maxLength={4}
                      placeholder="***"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      className="w-full bg-white border border-border-subtle rounded p-2.5 text-xs text-text-main focus:outline-none focus:border-oxford-blue font-mono text-center"
                    />
                  </div>
                </div>

                <div className="flex gap-2 items-start text-[10px] text-industrial-gray leading-normal pt-2 border-t border-border-subtle/50">
                  <ShieldCheck size={16} className="text-green-600 shrink-0" />
                  <span>
                    {currentLanguage === 'es'
                      ? 'Los pagos se procesan bajo los estándares PCI-DSS v4 y cumplimiento ISO 27001.'
                      : 'All credit acquisitions are protected by PCI-DSS v4 standards & ISO 27001 logs.'}
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full mt-4 bg-oxford-blue text-white hover:bg-industrial-gray py-4 rounded-sm font-sans text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow"
                >
                  <span>{currentLanguage === 'es' ? 'PROCESAR ADQUISICIÓN' : 'PROCESS ACQUISITION'}</span>
                  <ArrowRight size={14} className="text-electric-yellow" />
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
