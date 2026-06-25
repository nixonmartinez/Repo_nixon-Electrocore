import React, { useState } from 'react';
import { Search, Languages, ShoppingCart, User, Menu, ShieldAlert, X } from 'lucide-react';
import { Language } from '../types';
import { DICTIONARY } from '../data';
import companyLogo from '../../assets/logo/electrocable.jpg';

interface NavbarProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  currentScreen: 'catalog' | 'details' | 'admin' | 'delivery' | 'bom' | 'compliance';
  onScreenChange: (screen: 'catalog' | 'details' | 'admin' | 'delivery' | 'bom' | 'compliance') => void;
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
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-20 flex justify-between items-center gap-2 sm:gap-4">
        
        {/* 1. Logo (Izquierda - Fijo) */}
        <button 
          onClick={() => onScreenChange('catalog')}
          className="flex items-center gap-1.5 sm:gap-2 text-left shrink-0"
        >
          <img 
            src={companyLogo} 
            alt="ElectroCable Logo" 
            className="h-9 w-9 sm:h-10 sm:w-10 object-contain rounded-md"
          />
          <div className="flex flex-col">
            <span className="font-sans font-extrabold tracking-tight text-lg sm:text-xl xl:text-2xl text-oxford-blue">
              ELECTRO<span className="text-electric-yellow font-black">CORE</span>
            </span>
            <span className="hidden sm:block text-[8px] xl:text-[9px] uppercase tracking-[0.2em] text-industrial-gray font-semibold -mt-1">
              International Group
            </span>
          </div>
        </button>
        
        {/* 2. Menú de Navegación (Centro - Centrado y Responsivo) */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-6 mx-auto justify-center">
          <button
            onClick={() => onScreenChange('catalog')}
            className={`font-sans text-xs xl:text-sm font-bold pb-1 border-b-2 transition-all hover:text-oxford-blue ${
              currentScreen === 'catalog' || currentScreen === 'details'
                ? 'text-oxford-blue border-oxford-blue font-extrabold'
                : 'text-industrial-gray border-transparent'
            }`}
          >
            {currentLanguage === 'es' ? 'Productos' : 'Products'}
          </button>
          <button
            onClick={() => onScreenChange('bom')}
            className={`font-sans text-xs xl:text-sm font-bold pb-1 border-b-2 transition-all hover:text-oxford-blue ${
              currentScreen === 'bom'
                ? 'text-oxford-blue border-oxford-blue font-extrabold'
                : 'text-industrial-gray border-transparent'
            }`}
          >
            {currentLanguage === 'es' ? 'Subir BOM' : 'BOM'}
          </button>
          <button
            onClick={() => onScreenChange('compliance')}
            className={`font-sans text-xs xl:text-sm font-bold pb-1 border-b-2 transition-all hover:text-oxford-blue ${
              currentScreen === 'compliance'
                ? 'text-oxford-blue border-oxford-blue font-extrabold'
                : 'text-industrial-gray border-transparent'
            }`}
          >
            {currentLanguage === 'es' ? 'Homologaciones' : 'EDE'}
          </button>
          <button
            onClick={() => onScreenChange('delivery')}
            className={`font-sans text-xs xl:text-sm font-bold pb-1 border-b-2 transition-all hover:text-oxford-blue ${
              currentScreen === 'delivery'
                ? 'text-oxford-blue border-oxford-blue font-extrabold'
                : 'text-industrial-gray border-transparent'
            }`}
          >
            {currentLanguage === 'es' ? 'Entregas' : 'Deliveries'}
          </button>
          <button
            onClick={() => onScreenChange('admin')}
            className={`font-sans text-xs xl:text-sm font-bold pb-1 border-b-2 transition-all hover:text-oxford-blue flex items-center gap-1 ${
              currentScreen === 'admin'
                ? 'text-oxford-blue border-oxford-blue font-extrabold'
                : 'text-industrial-gray border-transparent'
            }`}
          >
            <span>{t.admin}</span>
            <span className="bg-oxford-blue text-white text-[9px] px-1.5 py-0.1 rounded font-bold">CRM</span>
          </button>
        </nav>

        {/* 3. Acciones del Sistema (Derecha - Fijo) */}
        <div className="flex items-center gap-1.5 sm:gap-3 lg:gap-4 shrink-0">
          
          {/* Technical Search Bar - compact to give space */}
          <div className="hidden lg:flex items-center bg-surface-container-low border border-border-subtle rounded-md px-2 py-1 lg:w-36 xl:w-56 focus-within:border-oxford-blue transition-colors">
            <Search className="text-industrial-gray mr-2 shrink-0" size={14} />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={handleSearchChange}
              className="bg-transparent border-none text-[11px] w-full focus:outline-none placeholder-industrial-gray/60 text-text-main"
            />
          </div>

          {/* Language Selector */}
          <button
            onClick={handleLangToggle}
            className="hidden lg:flex items-center gap-1 text-industrial-gray hover:text-oxford-blue transition-colors py-1 px-1.5 rounded-md hover:bg-surface-container-low"
            title={currentLanguage === 'es' ? 'Switch to English' : 'Cambiar a Español'}
          >
            <Languages size={16} />
            <span className="font-mono text-[10px] font-bold uppercase">{currentLanguage}</span>
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
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-electric-yellow text-oxford-blue font-black text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center border border-oxford-blue">
                {cartCount}
              </span>
            )}
          </button>

          {/* Admin profile shortcut */}
          <button
            onClick={() => onScreenChange('admin')}
            className="hidden lg:block p-2 text-industrial-gray hover:text-oxford-blue hover:bg-surface-container-low rounded-md transition-colors"
            title="System Administration & CRM"
          >
            <User size={18} />
          </button>

          {/* Mobile menu trigger - changes visibility breakpoint from md:hidden to lg:hidden */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-industrial-gray hover:text-oxford-blue transition-colors"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel - responsive under lg: breakpoint */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border-subtle bg-white px-4 py-4 space-y-3 animate-fadeIn">
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
              {currentLanguage === 'es' ? 'Productos' : 'Products'}
            </button>
            <button
              onClick={() => {
                onScreenChange('bom');
                setMobileMenuOpen(false);
              }}
              className={`text-left px-3 py-2 rounded text-sm font-semibold ${
                currentScreen === 'bom'
                  ? 'bg-oxford-blue text-white'
                  : 'text-industrial-gray hover:bg-surface-container-low'
              }`}
            >
              {currentLanguage === 'es' ? 'Subir BOM' : 'BOM'}
            </button>
            <button
              onClick={() => {
                onScreenChange('compliance');
                setMobileMenuOpen(false);
              }}
              className={`text-left px-3 py-2 rounded text-sm font-semibold ${
                currentScreen === 'compliance'
                  ? 'bg-oxford-blue text-white'
                  : 'text-industrial-gray hover:bg-surface-container-low'
              }`}
            >
              {currentLanguage === 'es' ? 'Homologaciones' : 'EDE Compliance'}
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
              {currentLanguage === 'es' ? 'Entregas' : 'Deliveries'}
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

            {/* Mobile Language Selector */}
            <div className="border-t border-border-subtle/50 pt-4 mt-2 flex items-center justify-between">
              <span className="text-xs font-bold text-oxford-blue flex items-center gap-1.5 uppercase tracking-wider">
                <Languages size={15} />
                {currentLanguage === 'es' ? 'Idioma:' : 'Language:'}
              </span>
              <button
                onClick={handleLangToggle}
                className="flex items-center gap-1.5 text-oxford-blue bg-surface-container-low py-1.5 px-3 rounded-md hover:bg-surface-container-high transition-colors"
              >
                <span className="font-mono text-xs font-black uppercase">{currentLanguage === 'es' ? 'Español (ES)' : 'English (EN)'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
