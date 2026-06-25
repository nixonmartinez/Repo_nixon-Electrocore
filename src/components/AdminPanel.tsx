import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, Layers, FileSpreadsheet, Users, AlertCircle, Plus, 
  ChevronRight, Building, Mail, Phone, Calendar, ArrowRight, Check, Trash2, Edit3 
} from 'lucide-react';
import { Product, CRMClient, Language } from '../types';
import { DICTIONARY } from '../data';

interface AdminPanelProps {
  products: Product[];
  clients: CRMClient[];
  currentLanguage: Language;
  onAddProduct: (newProd: Product) => void;
  onUpdateProductStock: (id: string, newStock: number) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateClientStatus: (id: string, newStatus: 'new' | 'contacted' | 'negotiating' | 'converted') => void;
}

export default function AdminPanel({
  products,
  clients,
  currentLanguage,
  onAddProduct,
  onUpdateProductStock,
  onDeleteProduct,
  onUpdateClientStatus,
}: AdminPanelProps) {
  const t = DICTIONARY[currentLanguage];

  // Active Admin Sidebar tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory' | 'prospects'>('dashboard');
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedClientForView, setSelectedClientForView] = useState<CRMClient | null>(null);
  const [selectedClientForQuote, setSelectedClientForQuote] = useState<CRMClient | null>(null);

  // Quote form state
  const [quotePrice, setQuotePrice] = useState('');
  const [quoteNotes, setQuoteNotes] = useState('');

  // Add SKU form state
  const [newSKU, setNewSKU] = useState('');
  const [newNameEs, setNewNameEs] = useState('');
  const [newNameEn, setNewNameEn] = useState('');
  const [newCategory, setNewCategory] = useState<'power' | 'transformer' | 'led' | 'automation'>('power');
  const [newPrice, setNewPrice] = useState('');
  const [newStock, setNewStock] = useState('');
  const [newDescEs, setNewDescEs] = useState('');
  const [newDescEn, setNewDescEn] = useState('');
  const [newSpecKeyEs, setNewSpecKeyEs] = useState('');
  const [newSpecValEs, setNewSpecValEs] = useState('');

  // Computations
  const totalStockItems = useMemo(() => products.reduce((acc, p) => acc + p.stock, 0), [products]);
  const stockLevelPercentage = useMemo(() => {
    // Arbitrary base total of 500 units as system cap
    const cap = 500;
    return Math.min(Math.round((totalStockItems / cap) * 100), 100);
  }, [totalStockItems]);

  const activeQuotesCount = 24; // Static match with Screen 3 mockup

  const pendingReviewCRMCount = useMemo(() => {
    return clients.filter(c => c.status === 'new' || c.status === 'negotiating').length;
  }, [clients]);

  const stockAlertsCount = useMemo(() => {
    return products.filter(p => p.stock <= 10).length;
  }, [products]);

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSKU || !newNameEs || !newNameEn || !newPrice || !newStock) return;

    const added: Product = {
      id: `prod-${Date.now()}`,
      sku: newSKU,
      name_es: newNameEs,
      name_en: newNameEn,
      category: newCategory,
      price: parseFloat(newPrice) || 0,
      stock: parseInt(newStock) || 0,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuApLEVWmAcjeoc5qEg4uX5cECmYrQoIXuqowmZLm4qnurDsy2sO9fhYLT1kA5WY0sJyOGKl3Fem5NjBKeHdhxT6zE_eyM6txbBL9xvIKaK7uFwoD3ZNAlUAI6dOBDSIcgdsX_4EN2Ksw4l8OC6OW8Da-O8JB4BmyGTFjBRESo5z_pKLpH_6P72h-dYY7NV23iaZWJ5I5LA5wLSV3sOEn2KEWSbCA_RmEB1W6WRTX1L214ZOBwML72z_hpqYLit7vQzVJbEOeP1t0VTe', // fallbacks to default
      status: parseInt(newStock) > 10 ? 'in_stock' : parseInt(newStock) > 0 ? 'low_stock' : 'on_order',
      desc_es: newDescEs || newNameEs,
      desc_en: newDescEn || newNameEn,
      specs: [
        {
          key_es: newSpecKeyEs || 'Normativa',
          key_en: 'Standard',
          value_es: newSpecValEs || 'IEC / UL',
          value_en: newSpecValEs || 'IEC / UL'
        }
      ],
      thumbnails: []
    };

    onAddProduct(added);
    setIsAddModalOpen(false);

    // Reset fields
    setNewSKU('');
    setNewNameEs('');
    setNewNameEn('');
    setNewPrice('');
    setNewStock('');
    setNewDescEs('');
    setNewDescEn('');
    setNewSpecKeyEs('');
    setNewSpecValEs('');
  };

  const handleSendQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientForQuote) return;
    
    // Upgrade client state in memory
    onUpdateClientStatus(selectedClientForQuote.id, 'contacted');
    setSelectedClientForQuote(null);
    setQuotePrice('');
    setQuoteNotes('');
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Side Navigation Rail */}
        <aside className="w-full lg:w-60 shrink-0 bg-white border border-border-subtle rounded-md p-4 self-start">
          <div className="mb-6 px-2">
            <span className="text-[10px] text-industrial-gray uppercase font-bold tracking-widest">{t.mgmtTitle}</span>
            <h2 className="text-oxford-blue font-sans font-bold text-lg">{t.mgmtSub}</h2>
          </div>

          <nav className="flex flex-row overflow-x-auto lg:flex-col gap-2 lg:gap-1 lg:space-y-1 pb-2 lg:pb-0 scrollbar-none">
            <button
              onClick={() => { setActiveTab('dashboard'); }}
              className={`w-auto shrink-0 lg:w-full lg:shrink-0 flex items-center gap-3 px-3 py-2.5 rounded-sm font-sans text-xs font-bold uppercase tracking-wider transition-colors border-b-2 lg:border-b-0 lg:border-l-4 ${
                activeTab === 'dashboard'
                  ? 'bg-surface-container-low text-oxford-blue border-oxford-blue pl-3 lg:pl-2 font-extrabold'
                  : 'text-industrial-gray border-transparent hover:bg-surface-container-low hover:text-oxford-blue'
              }`}
            >
              <BarChart3 size={16} />
              {t.dashboard}
            </button>
            <button
              onClick={() => { setActiveTab('inventory'); }}
              className={`w-auto shrink-0 lg:w-full lg:shrink-0 flex items-center gap-3 px-3 py-2.5 rounded-sm font-sans text-xs font-bold uppercase tracking-wider transition-colors border-b-2 lg:border-b-0 lg:border-l-4 ${
                activeTab === 'inventory'
                  ? 'bg-surface-container-low text-oxford-blue border-oxford-blue pl-3 lg:pl-2 font-extrabold'
                  : 'text-industrial-gray border-transparent hover:bg-surface-container-low hover:text-oxford-blue'
              }`}
            >
              <Layers size={16} />
              {t.inventoryControl}
            </button>
            <button
              onClick={() => { setActiveTab('prospects'); }}
              className={`w-auto shrink-0 lg:w-full lg:shrink-0 flex items-center gap-3 px-3 py-2.5 rounded-sm font-sans text-xs font-bold uppercase tracking-wider transition-colors border-b-2 lg:border-b-0 lg:border-l-4 ${
                activeTab === 'prospects'
                  ? 'bg-surface-container-low text-oxford-blue border-oxford-blue pl-3 lg:pl-2 font-extrabold'
                  : 'text-industrial-gray border-transparent hover:bg-surface-container-low hover:text-oxford-blue'
              }`}
            >
              <Users size={16} />
              {t.prospectsCRM}
            </button>
          </nav>

          <div className="mt-12 pt-6 border-t border-border-subtle px-2">
            <span className="text-[10px] uppercase font-bold text-industrial-gray block mb-1">
              {t.activeSystem}
            </span>
            <span className="font-mono text-xs font-bold text-oxford-blue">
              v2.4.0-PRO
            </span>
          </div>
        </aside>

        {/* Main Central Content Panel */}
        <main className="flex-1 space-y-8">
          
          {/* Top Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Stock Level metric */}
            <div className="bg-white border border-border-subtle rounded-md p-4 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-industrial-gray uppercase tracking-wider">{t.stockLevel}</span>
              <div className="my-3">
                <span className="text-3xl font-sans font-black text-oxford-blue">{stockLevelPercentage}%</span>
                <div className="w-full bg-surface-container-high h-2 rounded-full mt-2 overflow-hidden">
                  <div className="bg-oxford-blue h-full rounded-full transition-all duration-500" style={{ width: `${stockLevelPercentage}%` }} />
                </div>
              </div>
              <span className="text-[10px] text-industrial-gray font-semibold">
                {currentLanguage === 'es' ? 'Capacidad total estimada' : 'Estimated current ceiling'}
              </span>
            </div>

            {/* Active Quotes metric */}
            <div className="bg-white border border-border-subtle rounded-md p-4 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-industrial-gray uppercase tracking-wider">{t.activeQuotes}</span>
              <div className="my-3 flex items-baseline gap-2">
                <span className="text-3xl font-sans font-black text-oxford-blue">{activeQuotesCount}</span>
                <span className="text-xs text-green-600 font-bold font-mono">+5 {currentLanguage === 'es' ? 'desde ayer' : 'from yesterday'}</span>
              </div>
              <span className="text-[10px] text-industrial-gray font-semibold">
                {currentLanguage === 'es' ? 'Sujeto a validación LTL' : 'Pending LTL freight review'}
              </span>
            </div>

            {/* CRM Prospects metric */}
            <div className="bg-white border border-border-subtle rounded-md p-4 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-industrial-gray uppercase tracking-wider">{t.newProspects}</span>
              <div className="my-3">
                <span className="text-3xl font-sans font-black text-oxford-blue">{pendingReviewCRMCount}</span>
              </div>
              <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-100 rounded px-1.5 py-0.5 font-bold self-start inline-block">
                {currentLanguage === 'es' ? 'Pendientes de revisión' : 'Requires reviews'}
              </span>
            </div>

            {/* Stock Alerts (Red highlight styling) */}
            <div className="bg-[#101b30] text-white rounded-md p-4 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-electric-yellow uppercase tracking-widest">{t.stockAlerts}</span>
              <div className="my-3">
                <span className="text-3xl font-sans font-black text-electric-yellow">{stockAlertsCount.toString().padStart(2, '0')}</span>
              </div>
              <span className="text-[10px] text-white/80 font-bold flex items-center gap-1">
                <AlertCircle size={12} className="text-electric-yellow" />
                {t.stockAlertsDesc}
              </span>
            </div>

          </div>

          {/* Conditional View Rendering */}
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              
              {/* Inventory Summary subsegment (Left 2/3) */}
              <div className="xl:col-span-2 space-y-6">
                <div className="bg-white border border-border-subtle rounded-md p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-oxford-blue font-sans font-bold text-base">{t.inventoryControl}</h3>
                      <p className="text-xs text-industrial-gray">{t.inventorySub}</p>
                    </div>
                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className="bg-oxford-blue text-white px-4 py-2 rounded-sm font-sans text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-industrial-gray transition-colors"
                    >
                      <Plus size={14} />
                      {t.addSKU}
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse font-sans text-xs">
                      <thead>
                        <tr className="bg-surface-container-low border-b border-border-subtle text-industrial-gray">
                          <th className="p-3 font-bold">SKU</th>
                          <th className="p-3 font-bold">{currentLanguage === 'es' ? 'Componente' : 'Component'}</th>
                          <th className="p-3 font-bold">{currentLanguage === 'es' ? 'Stock' : 'Stock'}</th>
                          <th className="p-3 font-bold">{currentLanguage === 'es' ? 'Estado' : 'Status'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-subtle">
                        {products.map((prod) => {
                          const name = currentLanguage === 'es' ? prod.name_es : prod.name_en;
                          return (
                            <tr key={prod.id} className="hover:bg-surface-container-low/50">
                              <td className="p-3 font-mono font-bold text-oxford-blue">{prod.sku}</td>
                              <td className="p-3 font-medium text-text-main max-w-[180px] truncate">{name}</td>
                              <td className="p-3 font-mono">
                                <div className="flex items-center gap-2">
                                  <input
                                    type="number"
                                    value={prod.stock}
                                    onChange={(e) => onUpdateProductStock(prod.id, parseInt(e.target.value) || 0)}
                                    className="w-12 border border-border-subtle rounded px-1 text-center py-0.5 font-mono text-xs focus:outline-none focus:border-oxford-blue"
                                  />
                                  <span className="text-[10px] text-industrial-gray">uds</span>
                                </div>
                              </td>
                              <td className="p-3">
                                {prod.stock > 10 ? (
                                  <span className="text-green-700 bg-green-50 border border-green-100 rounded px-1.5 py-0.5 font-bold text-[10px]">OPTIMO</span>
                                ) : prod.stock > 0 ? (
                                  <span className="text-amber-700 bg-amber-50 border border-amber-100 rounded px-1.5 py-0.5 font-bold text-[10px]">BAJO</span>
                                ) : (
                                  <span className="text-red-700 bg-red-50 border border-red-100 rounded px-1.5 py-0.5 font-bold text-[10px]">RE-PEDIDO</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Bottom Global supply vision analytics section */}
                <div className="relative bg-cover bg-center rounded-md border border-border-subtle overflow-hidden text-white p-8"
                     style={{ backgroundImage: `linear-gradient(to right, rgba(5,17,37,0.95), rgba(27,38,59,0.85)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuBJQLtsAwsB9Dnt5lwxdbC4kxtL-AuFJWCptyxJ4dsiCDrlfYu58frSTQGufouXwQBXaiPw_73dSh4Uy9QBlUoJ6-nukuPqkL9dwBnjHupkpiPsN2aY3vhjBejisEtu5n19mq88wFdYj8hJ6qgnNg5ee-RaUKYqMMJ2d6o18Q0ju7qJU53aA8WZVHxAbVO8EXQBF5U2h4W69McVmcvwdCpjuvOxzsBA-qgcM2jN9YoWRprEvjbUdeLXqgNuQD_UNRkrsXsC68zCOxuQ')` }}>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-electric-yellow mb-2 inline-block">
                    {t.globalSupplyVision}
                  </span>
                  <h3 className="font-sans font-extrabold text-lg sm:text-xl mb-3 tracking-tight leading-snug">
                    {currentLanguage === 'es' ? 'Monitoreo de Red de Carga Pesada' : 'Heavy Logistics Fleet Monitoring'}
                  </h3>
                  <p className="font-sans text-xs text-white/80 max-w-2xl leading-relaxed mb-6">
                    {t.globalSupplyDesc}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button className="bg-electric-yellow text-oxford-blue px-4 py-2 rounded-sm font-sans text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all">
                      {t.viewFullReport}
                    </button>
                    <button className="border border-white/30 text-white px-4 py-2 rounded-sm font-sans text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-all">
                      {t.networkAlerts}
                    </button>
                  </div>
                </div>

              </div>

              {/* Right Side CRM Widget Column (Right 1/3) */}
              <div className="space-y-6">
                <div className="bg-white border border-border-subtle rounded-md p-6">
                  <div className="border-b border-border-subtle pb-4 mb-4">
                    <h3 className="text-oxford-blue font-sans font-bold text-base">{t.crmTitle}</h3>
                    <p className="text-xs text-industrial-gray">{t.crmSub}</p>
                  </div>

                  {/* Leads List */}
                  <div className="space-y-4">
                    {clients.map((client) => {
                      const inquiryText = currentLanguage === 'es' ? client.recentInquiry_es : client.recentInquiry_en;
                      const activityText = currentLanguage === 'es' ? client.recentActivity_es : client.recentActivity_en;

                      return (
                        <div 
                          key={client.id}
                          className="border border-border-subtle rounded p-3.5 space-y-3 bg-surface-container-lowest hover:border-industrial-gray/50 transition-colors"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-oxford-blue text-white font-bold text-xs flex items-center justify-center font-mono">
                                {client.avatar || 'C'}
                              </div>
                              <div>
                                <h4 className="font-sans font-extrabold text-xs text-oxford-blue leading-tight">{client.name}</h4>
                                <span className="text-[10px] text-industrial-gray font-medium block">{client.company}</span>
                              </div>
                            </div>

                            {/* Status tags */}
                            {client.status === 'new' && (
                              <span className="text-blue-700 bg-blue-50 border border-blue-200 text-[9px] font-extrabold px-2 py-0.5 rounded-sm uppercase tracking-wider">NEW</span>
                            )}
                            {client.status === 'negotiating' && (
                              <span className="text-amber-700 bg-amber-50 border border-amber-200 text-[9px] font-extrabold px-2 py-0.5 rounded-sm uppercase tracking-wider">NEGOCIACION</span>
                            )}
                            {client.status === 'contacted' && (
                              <span className="text-purple-700 bg-purple-50 border border-purple-200 text-[9px] font-extrabold px-2 py-0.5 rounded-sm uppercase tracking-wider">CONTACTADO</span>
                            )}
                            {client.status === 'converted' && (
                              <span className="text-green-700 bg-green-50 border border-green-200 text-[9px] font-extrabold px-2 py-0.5 rounded-sm uppercase tracking-wider">CONVERTIDO</span>
                            )}
                          </div>

                          <div className="bg-surface-container-low p-2.5 rounded border border-border-subtle/50">
                            <span className="text-[10px] text-industrial-gray font-bold uppercase tracking-wider block mb-1">
                              {t.latestConsultation}
                            </span>
                            <p className="text-[11px] text-text-main italic line-clamp-2 leading-relaxed">
                              {inquiryText}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-2 pt-1">
                            <button
                              onClick={() => setSelectedClientForView(client)}
                              className="border border-border-subtle text-industrial-gray hover:bg-surface-container-low py-1.5 rounded-sm text-[10px] font-extrabold uppercase tracking-wider transition-colors"
                            >
                              {t.viewProfile}
                            </button>
                            <button
                              onClick={() => setSelectedClientForQuote(client)}
                              disabled={client.status === 'converted'}
                              className="bg-oxford-blue text-white hover:bg-industrial-gray disabled:bg-surface-container-high disabled:text-industrial-gray/40 py-1.5 rounded-sm text-[10px] font-extrabold uppercase tracking-wider transition-colors"
                            >
                              {t.sendQuote}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Detailed inventory view list */}
          {activeTab === 'inventory' && (
            <div className="bg-white border border-border-subtle rounded-md p-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-border-subtle pb-4 mb-6 gap-4">
                <div>
                  <h3 className="text-oxford-blue font-sans font-bold text-lg">{t.inventoryControl}</h3>
                  <p className="text-xs text-industrial-gray">{t.inventorySub}</p>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-oxford-blue text-white px-5 py-2.5 rounded-sm font-sans text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-industrial-gray transition-colors"
                >
                  <Plus size={16} />
                  {t.addSKU}
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-sans text-xs">
                  <thead>
                    <tr className="bg-surface-container-low border-b border-border-subtle text-industrial-gray uppercase tracking-wider">
                      <th className="p-3.5 font-bold">SKU</th>
                      <th className="p-3.5 font-bold">{currentLanguage === 'es' ? 'Componente' : 'Component Name'}</th>
                      <th className="p-3.5 font-bold">{currentLanguage === 'es' ? 'Categoría' : 'Category'}</th>
                      <th className="p-3.5 font-bold">{currentLanguage === 'es' ? 'Precio' : 'Price'}</th>
                      <th className="p-3.5 font-bold">{currentLanguage === 'es' ? 'Stock Real' : 'Real Stock'}</th>
                      <th className="p-3.5 font-bold text-center">{currentLanguage === 'es' ? 'Acciones' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    {products.map((prod) => {
                      const name = currentLanguage === 'es' ? prod.name_es : prod.name_en;
                      return (
                        <tr key={prod.id} className="hover:bg-surface-container-low/30 transition-colors">
                          <td className="p-3.5 font-mono font-bold text-oxford-blue">{prod.sku}</td>
                          <td className="p-3.5 font-semibold text-text-main text-sm">{name}</td>
                          <td className="p-3.5 capitalize font-medium text-industrial-gray">{prod.category}</td>
                          <td className="p-3.5 font-mono font-semibold">{t.currency}{prod.price.toFixed(2)}</td>
                          <td className="p-3.5">
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => onUpdateProductStock(prod.id, Math.max(0, prod.stock - 1))}
                                className="w-6 h-6 rounded bg-surface-container-high flex items-center justify-center font-bold"
                              >
                                -
                              </button>
                              <span className="font-mono font-extrabold text-sm w-8 text-center">{prod.stock}</span>
                              <button 
                                onClick={() => onUpdateProductStock(prod.id, prod.stock + 1)}
                                className="w-6 h-6 rounded bg-surface-container-high flex items-center justify-center font-bold"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="p-3.5 text-center">
                            <button
                              onClick={() => onDeleteProduct(prod.id)}
                              className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded transition-colors inline-block"
                              title="Delete Item"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CRM Prospects leads page */}
          {activeTab === 'prospects' && (
            <div className="bg-white border border-border-subtle rounded-md p-6">
              <div className="border-b border-border-subtle pb-4 mb-6">
                <h3 className="text-oxford-blue font-sans font-bold text-lg">{t.prospectsCRM}</h3>
                <p className="text-xs text-industrial-gray">{t.crmSub}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {clients.map((client) => {
                  const inquiry = currentLanguage === 'es' ? client.recentInquiry_es : client.recentInquiry_en;
                  const activity = currentLanguage === 'es' ? client.recentActivity_es : client.recentActivity_en;

                  return (
                    <div key={client.id} className="border border-border-subtle rounded-md p-5 bg-surface-container-low/40 space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-oxford-blue text-white font-bold flex items-center justify-center">
                            {client.avatar}
                          </div>
                          <div>
                            <h4 className="font-sans font-bold text-sm text-oxford-blue">{client.name}</h4>
                            <p className="text-xs text-industrial-gray">{client.company}</p>
                          </div>
                        </div>

                        {/* Status badge */}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                          client.status === 'new' 
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : client.status === 'negotiating'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : client.status === 'contacted'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : 'bg-green-50 text-green-700 border-green-200'
                        }`}>
                          {client.status}
                        </span>
                      </div>

                      <div className="bg-white p-3 rounded border border-border-subtle/50">
                        <span className="text-[10px] font-bold text-industrial-gray uppercase tracking-wider block mb-1">
                          {t.latestConsultation}
                        </span>
                        <p className="text-xs italic text-text-main leading-relaxed">
                          {inquiry}
                        </p>
                      </div>

                      <div className="text-xs font-semibold text-industrial-gray flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-oxford-blue inline-block" />
                        <span>{activity}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border-subtle">
                        <button
                          onClick={() => setSelectedClientForView(client)}
                          className="border border-border-subtle text-industrial-gray hover:bg-surface-container-low py-2 rounded font-sans text-xs font-bold uppercase tracking-wider transition-colors"
                        >
                          {t.viewProfile}
                        </button>
                        <button
                          onClick={() => setSelectedClientForQuote(client)}
                          disabled={client.status === 'converted'}
                          className="bg-oxford-blue text-white hover:bg-industrial-gray disabled:opacity-40 py-2 rounded font-sans text-xs font-bold uppercase tracking-wider transition-colors"
                        >
                          {t.sendQuote}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Add SKU Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-md border border-border-subtle p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
            >
              <h3 className="font-sans font-extrabold text-lg text-oxford-blue mb-4">
                {t.addSKUTitle}
              </h3>

              <form onSubmit={handleAddProductSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-industrial-gray mb-1">{t.skuLabel} *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., EC-900-XL"
                      value={newSKU}
                      onChange={(e) => setNewSKU(e.target.value)}
                      className="w-full bg-white border border-border-subtle rounded p-2 text-xs focus:outline-none focus:border-oxford-blue font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-industrial-gray mb-1">{t.categoryLabel} *</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full bg-white border border-border-subtle rounded p-2 text-xs focus:outline-none focus:border-oxford-blue"
                    >
                      <option value="power">{t.catPower}</option>
                      <option value="transformer">{t.catTransformers}</option>
                      <option value="led">{t.catLed}</option>
                      <option value="automation">{t.catAutomation}</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-industrial-gray mb-1">{t.nameEsLabel} *</label>
                    <input
                      type="text"
                      required
                      placeholder="Nombre en Español"
                      value={newNameEs}
                      onChange={(e) => setNewNameEs(e.target.value)}
                      className="w-full bg-white border border-border-subtle rounded p-2 text-xs focus:outline-none focus:border-oxford-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-industrial-gray mb-1">{t.nameEnLabel} *</label>
                    <input
                      type="text"
                      required
                      placeholder="Name in English"
                      value={newNameEn}
                      onChange={(e) => setNewNameEn(e.target.value)}
                      className="w-full bg-white border border-border-subtle rounded p-2 text-xs focus:outline-none focus:border-oxford-blue"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-industrial-gray mb-1">{t.priceLabel} *</label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      placeholder="1245.00"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      className="w-full bg-white border border-border-subtle rounded p-2 text-xs focus:outline-none focus:border-oxford-blue font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-industrial-gray mb-1">{t.stockLabel} *</label>
                    <input
                      type="number"
                      required
                      placeholder="42"
                      value={newStock}
                      onChange={(e) => setNewStock(e.target.value)}
                      className="w-full bg-white border border-border-subtle rounded p-2 text-xs focus:outline-none focus:border-oxford-blue font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-industrial-gray mb-1">{t.descEsLabel}</label>
                  <textarea
                    rows={2}
                    placeholder="Descripción técnica del componente para el catálogo en Español"
                    value={newDescEs}
                    onChange={(e) => setNewDescEs(e.target.value)}
                    className="w-full bg-white border border-border-subtle rounded p-2 text-xs focus:outline-none focus:border-oxford-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-industrial-gray mb-1">{t.descEnLabel}</label>
                  <textarea
                    rows={2}
                    placeholder="Technical description of the component for the English catalog"
                    value={newDescEn}
                    onChange={(e) => setNewDescEn(e.target.value)}
                    className="w-full bg-white border border-border-subtle rounded p-2 text-xs focus:outline-none focus:border-oxford-blue"
                  />
                </div>

                <div className="bg-surface-container-low p-3 rounded border border-border-subtle space-y-3">
                  <span className="block text-xs font-bold text-oxford-blue uppercase tracking-wider">
                    {currentLanguage === 'es' ? 'Especificación Técnica Inicial' : 'Initial Technical Spec'}
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="e.g., Tensión Nominal / Rated Voltage"
                      value={newSpecKeyEs}
                      onChange={(e) => setNewSpecKeyEs(e.target.value)}
                      className="bg-white border border-border-subtle rounded p-1.5 text-xs focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="e.g., 500kV AC"
                      value={newSpecValEs}
                      onChange={(e) => setNewSpecValEs(e.target.value)}
                      className="bg-white border border-border-subtle rounded p-1.5 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 border border-border-subtle text-industrial-gray rounded text-xs font-bold uppercase tracking-wider hover:bg-surface-container-low"
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-oxford-blue text-white rounded text-xs font-bold uppercase tracking-wider hover:bg-industrial-gray"
                  >
                    {t.save}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View CRM Profile Modal */}
      <AnimatePresence>
        {selectedClientForView && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white rounded-md border border-border-subtle p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-oxford-blue text-white font-bold text-lg flex items-center justify-center">
                    {selectedClientForView.avatar}
                  </div>
                  <div>
                    <h3 className="font-sans font-extrabold text-base text-oxford-blue">{selectedClientForView.name}</h3>
                    <p className="text-xs text-industrial-gray font-semibold flex items-center gap-1">
                      <Building size={12} />
                      {selectedClientForView.company}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedClientForView(null)}
                  className="bg-surface-container-low text-oxford-blue px-2.5 py-1 text-xs font-bold rounded-full hover:bg-surface-container-high"
                >
                  {currentLanguage === 'es' ? 'Cerrar' : 'Close'}
                </button>
              </div>

              <div className="space-y-6 font-sans text-xs">
                {/* Contact info */}
                <div className="grid grid-cols-2 gap-4 bg-surface-container-low p-4 rounded border border-border-subtle">
                  <div className="space-y-1">
                    <span className="text-industrial-gray font-bold block">EMAIL</span>
                    <a href={`mailto:${selectedClientForView.email}`} className="text-oxford-blue font-mono font-semibold hover:underline">
                      {selectedClientForView.email}
                    </a>
                  </div>
                  <div className="space-y-1">
                    <span className="text-industrial-gray font-bold block">TELEFONO</span>
                    <span className="font-mono font-semibold text-text-main">{selectedClientForView.phone}</span>
                  </div>
                </div>

                {/* Inquiry detail */}
                <div className="space-y-2">
                  <span className="font-bold text-oxford-blue uppercase tracking-wider block">
                    {currentLanguage === 'es' ? 'Detalles de Consulta Reciente' : 'Recent Lead Consultation'}
                  </span>
                  <div className="bg-white p-4 rounded border border-border-subtle/80 italic text-text-main leading-relaxed">
                    {currentLanguage === 'es' ? selectedClientForView.recentInquiry_es : selectedClientForView.recentInquiry_en}
                  </div>
                </div>

                {/* Order History */}
                <div className="space-y-3">
                  <span className="font-bold text-oxford-blue uppercase tracking-wider block">
                    {currentLanguage === 'es' ? 'Historial de Pedidos Logísticos' : 'Logistics Orders History'}
                  </span>
                  {selectedClientForView.orderHistory.length === 0 ? (
                    <p className="text-industrial-gray italic text-center py-4 bg-surface-container-low/40 rounded">
                      {currentLanguage === 'es' ? 'No se registran compras previas.' : 'No previous purchases recorded.'}
                    </p>
                  ) : (
                    <div className="space-y-2.5">
                      {selectedClientForView.orderHistory.map((ord) => (
                        <div key={ord.id} className="border border-border-subtle rounded p-3 bg-white flex justify-between items-center">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-oxford-blue">{ord.id}</span>
                              <span className="text-[10px] text-industrial-gray flex items-center gap-1">
                                <Calendar size={10} />
                                {ord.date}
                              </span>
                            </div>
                            <p className="font-semibold text-text-main mt-1 text-xs">
                              {currentLanguage === 'es' ? ord.items_es : ord.items_en}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="font-mono font-black text-oxford-blue block">{t.currency}{ord.total.toFixed(2)}</span>
                            <span className="text-[9px] bg-green-50 text-green-700 font-bold border border-green-200 px-1.5 py-0.2 rounded-sm uppercase mt-0.5 inline-block">
                              {currentLanguage === 'es' ? ord.status_es : ord.status_en}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Compile CRM Quote Modal */}
      <AnimatePresence>
        {selectedClientForQuote && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-md border border-border-subtle p-6 max-w-md w-full"
            >
              <h3 className="font-sans font-extrabold text-base text-oxford-blue mb-2">
                {currentLanguage === 'es' ? 'Compilar Cotización Técnica' : 'Compile Technical Quote'}
              </h3>
              <p className="text-xs text-industrial-gray mb-4">
                {currentLanguage === 'es' ? 'Enviando presupuesto directo para:' : 'Sending direct project quote proposal to:'}{' '}
                <strong className="text-oxford-blue">{selectedClientForQuote.name}</strong> ({selectedClientForQuote.company})
              </p>

              <form onSubmit={handleSendQuoteSubmit} className="space-y-4 font-sans text-xs">
                <div>
                  <label className="block text-xs font-bold text-industrial-gray mb-1">
                    {currentLanguage === 'es' ? `Precio Propuesto (${t.currency})` : `Proposed Pricing (${t.currency})`}
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g., 3450.00"
                    value={quotePrice}
                    onChange={(e) => setQuotePrice(e.target.value)}
                    className="w-full bg-white border border-border-subtle rounded p-2 text-xs focus:outline-none focus:border-oxford-blue font-mono font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-industrial-gray mb-1">
                    {currentLanguage === 'es' ? 'Términos y Notas de Envío' : 'Shipping Terms & Notes'}
                  </label>
                  <textarea
                    rows={3}
                    placeholder={
                      currentLanguage === 'es'
                        ? 'e.g., Entrega Freight LTL incluida en 5-7 días hábiles bajo aprobación.'
                        : 'e.g., LTL Freight shipping included. Lead-time is 5-7 business days.'
                    }
                    value={quoteNotes}
                    onChange={(e) => setQuoteNotes(e.target.value)}
                    className="w-full bg-white border border-border-subtle rounded p-2 text-xs focus:outline-none focus:border-oxford-blue"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedClientForQuote(null)}
                    className="px-4 py-2 border border-border-subtle text-industrial-gray rounded text-xs font-bold uppercase tracking-wider hover:bg-surface-container-low"
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-oxford-blue text-white rounded text-xs font-bold uppercase tracking-wider hover:bg-industrial-gray flex items-center gap-1.5"
                  >
                    <Check size={14} />
                    {currentLanguage === 'es' ? 'Enviar Propuesta' : 'Send Proposal'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
