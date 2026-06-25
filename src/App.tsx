import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Shield, HelpCircle, FileText } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrustBanner from './components/TrustBanner';
import BentoCategories from './components/BentoCategories';
import ProductCatalog from './components/ProductCatalog';
import ProductDetails from './components/ProductDetails';
import AdminPanel from './components/AdminPanel';
import DeliveryVerification from './components/DeliveryVerification';
import CartSlideOver from './components/CartSlideOver';
import QuoteModal from './components/QuoteModal';
import PaymentModal from './components/PaymentModal';

import { Product, CartItem, CRMClient, DeliveryDetails as DeliveryDetailsType, Language } from './types';
import { INITIAL_PRODUCTS, INITIAL_CRM_CLIENTS, DICTIONARY } from './data';

export default function App() {
  // Global Configurations State
  const [currentLanguage, setCurrentLanguage] = useState<Language>('es');
  const [currentScreen, setCurrentScreen] = useState<'catalog' | 'details' | 'admin' | 'delivery'>('catalog');
  
  // Interactive Data Lists State
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [clients, setClients] = useState<CRMClient[]>(INITIAL_CRM_CLIENTS);
  
  // Focus / Selected item states
  const [selectedProduct, setSelectedProduct] = useState<Product>(INITIAL_PRODUCTS[0]); // Aislador default
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedProductForQuote, setSelectedProductForQuote] = useState<Product | null>(null);

  // Delivery details coordinates state
  const [deliveryDetails, setDeliveryDetails] = useState<DeliveryDetailsType>({
    projectName: '',
    attentionTo: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    specialInstructions: '',
    latitude: 35.4000,
    longitude: -99.1000,
    isVerified: false,
    calculatedFee: 0,
    zoneName_es: 'Sin ubicar',
    zoneName_en: 'Not Pinpointed',
  });

  // UI state toggles
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'power' | 'transformer' | 'led' | 'automation' | 'all'>('all');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Scroll restoration or scrolling on view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentScreen]);

  const t = DICTIONARY[currentLanguage];

  // Cart actions
  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.product.id === product.id);
      if (existing) {
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { product, quantity }];
    });
  };

  const handleUpdateCartQuantity = (productId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Inventory actions inside Control Panel
  const handleAddProduct = (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
  };

  const handleUpdateProductStock = (id: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const status = newStock > 10 ? 'in_stock' : newStock > 0 ? 'low_stock' : 'on_order';
          return { ...p, stock: newStock, status };
        }
        return p;
      })
    );
  };

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // CRM action triggers
  const handleUpdateClientStatus = (id: string, newStatus: 'new' | 'contacted' | 'negotiating' | 'converted') => {
    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
  };

  // Screen level action links
  const handleViewCatalog = () => {
    setCurrentScreen('catalog');
    setTimeout(() => {
      const el = document.getElementById('catalog-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSelectProductFromCatalog = (product: Product) => {
    setSelectedProduct(product);
    setCurrentScreen('details');
  };

  const handleTriggerQuote = (product: Product) => {
    setSelectedProductForQuote(product);
    setIsQuoteModalOpen(true);
  };

  const handleTriggerBulkQuote = () => {
    setSelectedProductForQuote(null);
    setIsQuoteModalOpen(true);
  };

  const handleUpdateDetails = (updated: Partial<DeliveryDetailsType>) => {
    setDeliveryDetails((prev) => ({ ...prev, ...updated }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface text-text-main antialiased font-sans">
      
      {/* Universal navigation header */}
      <Navbar
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        currentScreen={currentScreen}
        onScreenChange={setCurrentScreen}
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
        onSearch={setSearchTerm}
      />

      {/* Main Multi-Screen Stage with smooth offset */}
      <main className="flex-grow pt-20">
        {currentScreen === 'catalog' && (
          <div className="animate-fadeIn">
            <Hero
              currentLanguage={currentLanguage}
              onViewCatalog={handleViewCatalog}
              onRequestQuote={handleTriggerBulkQuote}
            />
            
            <TrustBanner currentLanguage={currentLanguage} />
            
            <BentoCategories
              currentLanguage={currentLanguage}
              onSelectCategory={(cat) => {
                setSelectedCategory(cat);
                handleViewCatalog();
              }}
            />
            
            <ProductCatalog
              products={products}
              currentLanguage={currentLanguage}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              searchTerm={searchTerm}
              onSelectProduct={handleSelectProductFromCatalog}
              onAddToCart={(p) => handleAddToCart(p, 1)}
              onQuoteProduct={handleTriggerQuote}
            />
          </div>
        )}

        {currentScreen === 'details' && (
          <div className="animate-fadeIn">
            <ProductDetails
              product={selectedProduct}
              currentLanguage={currentLanguage}
              onAddToCart={handleAddToCart}
              onQuoteRequest={handleTriggerQuote}
              onBackToCatalog={() => setCurrentScreen('catalog')}
            />
          </div>
        )}

        {currentScreen === 'admin' && (
          <div className="animate-fadeIn">
            <AdminPanel
              products={products}
              clients={clients}
              currentLanguage={currentLanguage}
              onAddProduct={handleAddProduct}
              onUpdateProductStock={handleUpdateProductStock}
              onDeleteProduct={handleDeleteProduct}
              onUpdateClientStatus={handleUpdateClientStatus}
            />
          </div>
        )}

        {currentScreen === 'delivery' && (
          <div className="animate-fadeIn">
            <DeliveryVerification
              currentLanguage={currentLanguage}
              cartItems={cartItems}
              deliveryDetails={deliveryDetails}
              onUpdateDetails={handleUpdateDetails}
              onProceedToPayment={() => setIsPaymentModalOpen(true)}
              onLeave={() => setCurrentScreen('catalog')}
            />
          </div>
        )}
      </main>

      {/* Structured Industrial Brand Footer */}
      <footer className="bg-oxford-blue text-white border-t border-white/5 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Logo & corporate slogan */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <img 
                src="/20.jpeg" 
                alt="ElectroCore Logo" 
                className="h-8 w-8 object-contain rounded bg-white p-0.5"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <span className="font-sans font-extrabold tracking-tight text-xl text-white">
                ELECTRO<span className="text-electric-yellow font-black">CORE</span>
              </span>
            </div>
            <p className="text-xs text-white/70 leading-relaxed max-w-sm">
              {currentLanguage === 'es'
                ? 'Suministro estratégico de cables de potencia, transformadores industriales y soluciones de automatización de alta tensión para la infraestructura pesada.'
                : 'Strategic supply of power cables, heavy transformers, and high-voltage automation machinery built for global logistics networks.'}
            </p>
            <div className="text-[10px] text-white/50 font-mono">
              © 2026 ElectroCore International Group. All rights reserved.
            </div>
          </div>

          {/* Quick Category links */}
          <div>
            <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-electric-yellow mb-4">
              {t.categoriesTitle}
            </h4>
            <ul className="space-y-2.5 text-xs text-white/75 font-semibold">
              <li>
                <button onClick={() => { setSelectedCategory('power'); setCurrentScreen('catalog'); }} className="hover:text-electric-yellow transition-colors text-left">
                  {t.catPower}
                </button>
              </li>
              <li>
                <button onClick={() => { setSelectedCategory('transformer'); setCurrentScreen('catalog'); }} className="hover:text-electric-yellow transition-colors text-left">
                  {t.catTransformers}
                </button>
              </li>
              <li>
                <button onClick={() => { setSelectedCategory('led'); setCurrentScreen('catalog'); }} className="hover:text-electric-yellow transition-colors text-left">
                  {t.catLed}
                </button>
              </li>
              <li>
                <button onClick={() => { setSelectedCategory('automation'); setCurrentScreen('catalog'); }} className="hover:text-electric-yellow transition-colors text-left">
                  {t.catAutomation}
                </button>
              </li>
            </ul>
          </div>

          {/* Business & CRM controls */}
          <div>
            <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-electric-yellow mb-4">
              {currentLanguage === 'es' ? 'Portal Corporativo' : 'Corporate Portal'}
            </h4>
            <ul className="space-y-2.5 text-xs text-white/75 font-semibold">
              <li>
                <button onClick={() => setCurrentScreen('admin')} className="hover:text-electric-yellow transition-colors">
                  {t.admin} Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentScreen('delivery')} className="hover:text-electric-yellow transition-colors">
                  {currentLanguage === 'es' ? 'Cobertura de Entrega LTL' : 'LTL Freight Coverage'}
                </button>
              </li>
              <li>
                <button onClick={handleTriggerBulkQuote} className="hover:text-electric-yellow transition-colors">
                  {t.requestQuoteTitle}
                </button>
              </li>
              <li>
                <span className="text-white/40 block">System Hub API (Offline)</span>
              </li>
            </ul>
          </div>

          {/* Contact details */}
          <div className="space-y-4">
            <h4 className="font-sans font-bold text-xs uppercase tracking-wider text-electric-yellow mb-4">
              {currentLanguage === 'es' ? 'Contacto Técnico' : 'Technical Support'}
            </h4>
            <ul className="space-y-3 text-xs text-white/75">
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-electric-yellow" />
                <span className="font-mono">+52 (55) 8956-2030</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-electric-yellow" />
                <a href="mailto:soporte@electrocableig.com" className="hover:underline font-mono">
                  soporte@electrocableig.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={14} className="text-electric-yellow" />
                <span>Corp HQ: Industrial Center Sector IV</span>
              </li>
            </ul>
          </div>

        </div>
      </footer>

      {/* Slide Overs & Modals rendering state */}
      <CartSlideOver
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        currentLanguage={currentLanguage}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setCurrentScreen('delivery');
        }}
      />

      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        product={selectedProductForQuote}
        productsList={products}
        currentLanguage={currentLanguage}
      />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        cartItems={cartItems}
        deliveryDetails={deliveryDetails}
        currentLanguage={currentLanguage}
        onClearCart={handleClearCart}
      />

    </div>
  );
}
