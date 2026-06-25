import React, { useState } from 'react';
import { Search, Languages, ShoppingCart, User, Menu, ShieldAlert, X } from 'lucide-react';
import { Language } from '../types';
import { DICTIONARY } from '../data';

interface NavbarProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  currentScreen: 'catalog' | 'details' | 'admin' | 'delivery';
  onScreenChange: (screen: 'catalog' | 'details' | 'admin' | 'delivery') => void;
  cartCount: number;
  onCartClick: () => void;
  onSearch: (term: string) => void;
}

export default function Navbar({
  currentLanguage,
  onLanguageChange,
  currentScreen,
  onScreenChange,
  cartCount,
  onCartClick,
  onSearch,
}: NavbarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = DICTIONARY[currentLanguage];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    onSearch(val);
  };

  const handleLangToggle = () => {
    onLanguageChange(currentLanguage === 'es' ? 'en' : 'es');
  };

  return (
    <header className="bg-white border-b border-border-subtle fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
        {/* Logo and Main Nav */}
        <div className="flex items-center gap-8 lg:gap-12">
          <button 
            onClick={() => onScreenChange('catalog')}
            className="flex items-center gap-2 text-left"
          >
            <img 
              src="/20.jpeg" 
              alt="ElectroCore Logo" 
              className="h-10 w-10 object-contain rounded-md"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="flex flex-col">
              <span className="font-sans font-extrabold tracking-tight text-2xl text-oxford-blue">
                ELECTRO<span className="text-electric-yellow font-black">CORE</span>
              </span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-industrial-gray font-semibold -mt-1">
                International Group
              </span>
            </div>
          </button>
          
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <button
              onClick={() => onScreenChange('catalog')}
              className={`font-sans text-sm font-semibold pb-1 border-b-2 transition-colors ${
                currentScreen === 'catalog' || currentScreen === 'details'
                  ? 'text-oxford-blue border-oxford-blue'
                  : 'text-industrial-gray border-transparent hover:text-oxford-blue'
              }`}
            >
              {t.catalog}
            </button>
            <button
              onClick={() => onScreenChange('delivery')}
              className={`font-sans text-sm font-semibold pb-1 border-b-2 transition-colors ${
                currentScreen === 'delivery'
                  ? 'text-oxford-blue border-oxford-blue'
                  : 'text-industrial-gray border-transparent hover:text-oxford-blue'
              }`}
            >
              {currentLanguage === 'es' ? 'Verificar Entrega' : 'Verify Delivery'}
            </button>
            <button
              onClick={() => onScreenChange('admin')}
              className={`font-sans text-sm font-semibold pb-1 border-b-2 transition-colors flex items-center gap-1.5 ${
                currentScreen === 'admin'
                  ? 'text-oxford-blue border-oxford-blue'
                  : 'text-industrial-gray border-transparent hover:text-oxford-blue'
              }`}
            >
              <span>{t.admin}</span>
              <span className="bg-oxford-blue text-white text-[10px] px-1.5 py-0.2 rounded font-bold">CRM</span>
            </button>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4 lg:gap-6">
          {/* Technical Search Bar */}
          <div className="hidden lg:flex items-center bg-surface-container-low border border-border-subtle rounded-md px-3 py-2 w-64 focus-within:border-oxford-blue transition-colors">
            <Search className="text-industrial-gray mr-2" size={16} />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={handleSearchChange}
              className="bg-transparent border-none text-xs w-full focus:outline-none placeholder-industrial-gray/60 text-text-main"
            />
          </div>

          {/* Language Selector */}
          <button
            onClick={handleLangToggle}
            className="flex items-center gap-1.5 text-industrial-gray hover:text-oxford-blue transition-colors py-1 px-2 rounded-md hover:bg-surface-container-low"
            title={currentLanguage === 'es' ? 'Switch to English' : 'Cambiar a Español'}
          >
            <Languages size={18} />
            <span className="font-mono text-xs font-bold uppercase">{currentLanguage}</span>
          </button>

          {/* Cart Trigger */}
          <button
            onClick={onCartClick}
            className={`relative p-2 rounded-md transition-all ${
              cartCount > 0 
                ? 'bg-oxford-blue text-white hover:bg-industrial-gray ring-2 ring-electric-yellow/50 scale-105 shadow-sm' 
                : 'text-industrial-gray hover:text-oxford-blue hover:bg-surface-container-low'
            }`}
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-electric-yellow text-oxford-blue font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border border-oxford-blue">
                {cartCount}
              </span>
            )}
          </button>

          {/* Admin profile shortcut */}
          <button
            onClick={() => onScreenChange('admin')}
            className="p-2 text-industrial-gray hover:text-oxford-blue hover:bg-surface-container-low rounded-md transition-colors"
            title="System Administration & CRM"
          >
            <User size={20} />
          </button>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-industrial-gray hover:text-oxford-blue transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border-subtle bg-white px-4 py-4 space-y-3 animate-fadeIn">
          {/* Mobile Search */}
          <div className="flex items-center bg-surface-container-low border border-border-subtle rounded px-3 py-2">
            <Search className="text-industrial-gray mr-2" size={16} />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={handleSearchChange}
              className="bg-transparent border-none text-xs w-full focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                onScreenChange('catalog');
                setMobileMenuOpen(false);
              }}
              className={`text-left px-3 py-2 rounded text-sm font-semibold ${
                currentScreen === 'catalog' || currentScreen === 'details'
                  ? 'bg-oxford-blue text-white'
                  : 'text-industrial-gray hover:bg-surface-container-low'
              }`}
            >
              {t.catalog}
            </button>
            <button
              onClick={() => {
                onScreenChange('delivery');
                setMobileMenuOpen(false);
              }}
              className={`text-left px-3 py-2 rounded text-sm font-semibold ${
                currentScreen === 'delivery'
                  ? 'bg-oxford-blue text-white'
                  : 'text-industrial-gray hover:bg-surface-container-low'
              }`}
            >
              {currentLanguage === 'es' ? 'Verificar Entrega' : 'Verify Delivery'}
            </button>
            <button
              onClick={() => {
                onScreenChange('admin');
                setMobileMenuOpen(false);
              }}
              className={`text-left px-3 py-2 rounded text-sm font-semibold flex items-center justify-between ${
                currentScreen === 'admin'
                  ? 'bg-oxford-blue text-white'
                  : 'text-industrial-gray hover:bg-surface-container-low'
              }`}
            >
              <span>{t.admin} (CRM)</span>
              <span className="bg-electric-yellow text-oxford-blue text-[10px] px-1.5 py-0.5 rounded font-extrabold font-mono">PRO</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
