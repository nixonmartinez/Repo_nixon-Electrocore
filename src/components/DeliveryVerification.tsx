import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle, XCircle, MapPin, ZoomIn, ZoomOut, Anchor, Landmark, Factory, 
  ShieldCheck, Truck, ArrowRight, ShoppingBag, Info 
} from 'lucide-react';
import { Language, CartItem, DeliveryDetails, DeliveryZone } from '../types';
import { DICTIONARY, DELIVERY_ZONES } from '../data';

interface DeliveryVerificationProps {
  currentLanguage: Language;
  cartItems: CartItem[];
  deliveryDetails: DeliveryDetails;
  onUpdateDetails: (details: Partial<DeliveryDetails>) => void;
  onProceedToPayment: () => void;
  onLeave: () => void;
}

export default function DeliveryVerification({
  currentLanguage,
  cartItems,
  deliveryDetails,
  onUpdateDetails,
  onProceedToPayment,
  onLeave,
}: DeliveryVerificationProps) {
  const t = DICTIONARY[currentLanguage];

  // Map configuration & zoom
  const [zoomLevel, setZoomLevel] = useState(1);
  const zones: DeliveryZone[] = DELIVERY_ZONES;

  // Active hover zone indicator
  const [hoveredZoneId, setHoveredZoneId] = useState<string | null>(null);

  // Calculate cart subtotal
  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  }, [cartItems]);

  const taxes = useMemo(() => subtotal * 0.08, [subtotal]); // 8% estimated taxes

  const orderTotal = useMemo(() => {
    return subtotal + deliveryDetails.calculatedFee + taxes;
  }, [subtotal, deliveryDetails.calculatedFee, taxes]);

  // Handle clicking on map to place marker
  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    // Get click percentages (0 - 100)
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    // Check if clicked point falls within any covered zone
    let foundZone: DeliveryZone | null = null;

    for (const zone of zones) {
      // Euclidean distance formula
      const dx = clickX - zone.x;
      const dy = clickY - zone.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance <= zone.radius) {
        foundZone = zone;
        break;
      }
    }

    if (foundZone) {
      onUpdateDetails({
        latitude: parseFloat((18.40 + (clickY / 100) * 0.20).toFixed(4)), // Santo Domingo metropolitan area
        longitude: parseFloat((-70.05 + (clickX / 100) * 0.25).toFixed(4)), 
        isVerified: foundZone.isCovered,
        calculatedFee: foundZone.isCovered ? foundZone.baseFee : 0,
        zoneName_es: foundZone.name_es,
        zoneName_en: foundZone.name_en,
      });
    } else {
      // Clicked outside any defined zones
      onUpdateDetails({
        latitude: parseFloat((18.40 + (clickY / 100) * 0.20).toFixed(4)),
        longitude: parseFloat((-70.05 + (clickX / 100) * 0.25).toFixed(4)),
        isVerified: false,
        calculatedFee: 0,
        zoneName_es: 'Área sin cobertura',
        zoneName_en: 'Uncovered Outer Area',
      });
    }
  };

  // Helper to trigger auto pinpointing to Distrito Nacional
  const handleSetQuickLocation = () => {
    const mainZone = zones[0]; // Distrito Nacional
    onUpdateDetails({
      projectName: 'Proyecto de Expansión de Subestación Piantini',
      attentionTo: 'Ing. Manuel Tejeda',
      address: 'Av. Winston Churchill Esq. Roberto Pastoriza',
      city: 'Santo Domingo',
      state: 'Distrito Nacional',
      zipCode: '10112',
      specialInstructions: 'Entrada por rampa de carga trasera. Coordinar con seguridad del sitio.',
      latitude: 18.4722,
      longitude: -69.9392,
      isVerified: true,
      calculatedFee: mainZone.baseFee,
      zoneName_es: mainZone.name_es,
      zoneName_en: mainZone.name_en,
    });
  };

  const handleZoomIn = () => {
    if (zoomLevel < 1.8) setZoomLevel(prev => prev + 0.15);
  };

  const handleZoomOut = () => {
    if (zoomLevel > 0.8) setZoomLevel(prev => prev - 0.15);
  };

  return (
    <section className="bg-surface py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Step process bar */}
        <div className="flex items-center justify-between border-b border-border-subtle pb-6">
          <div className="flex items-center gap-6 sm:gap-10 font-sans text-xs font-extrabold uppercase tracking-widest text-industrial-gray">
            <span className="flex items-center gap-2">
              <span className="bg-oxford-blue text-white w-5 h-5 rounded-full flex items-center justify-center text-[9px]">1</span>
              <span>{t.stepCart}</span>
            </span>
            <span className="flex items-center gap-2 text-oxford-blue">
              <span className="bg-electric-yellow text-oxford-blue w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black">2</span>
              <span>{t.stepVerify}</span>
            </span>
            <span className="flex items-center gap-2 text-industrial-gray/40">
              <span className="bg-surface-container-high text-industrial-gray/50 w-5 h-5 rounded-full flex items-center justify-center text-[9px]">3</span>
              <span>{t.stepPayment}</span>
            </span>
          </div>
          
          <button
            onClick={onLeave}
            className="text-xs font-bold text-red-600 hover:text-red-800 uppercase tracking-wider"
          >
            {t.stepLeave}
          </button>
        </div>

        {/* Layout: Form + Map (Left) and Invoice Summary (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Logistics Verification Block */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Interactive blueprint map segment */}
            <div className="bg-white border border-border-subtle rounded-md p-6 space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="font-sans font-extrabold text-lg text-oxford-blue">
                      {t.deliveryVerification}
                    </h2>
                    
                    {/* Real-time status indicator badge */}
                    {deliveryDetails.isVerified ? (
                      <span className="bg-green-50 text-green-700 border border-green-200 text-[10px] font-extrabold px-2.5 py-1 rounded flex items-center gap-1.5 uppercase">
                        <CheckCircle size={12} />
                        {t.locationVerified}
                      </span>
                    ) : (
                      <span className="bg-red-50 text-red-700 border border-red-200 text-[10px] font-extrabold px-2.5 py-1 rounded flex items-center gap-1.5 uppercase">
                        <XCircle size={12} />
                        {t.outOfCoverage}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-industrial-gray mt-1">
                    {t.deliveryVerificationDesc}
                  </p>
                </div>

                <button
                  onClick={handleSetQuickLocation}
                  className="bg-oxford-blue hover:bg-industrial-gray text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-sm flex items-center justify-center gap-1.5 shadow"
                >
                  <MapPin size={14} className="text-electric-yellow" />
                  {t.setPointBtn}
                </button>
              </div>

              {/* Stylyzed Grid SVG Map */}
              <div className="relative border border-border-subtle rounded-md overflow-hidden bg-surface-container-low h-80 sm:h-96 select-none cursor-crosshair">
                
                {/* Telemetry coordinate HUD indicator */}
                <div className="absolute top-3 left-3 bg-[#101b30]/85 text-white p-2.5 rounded font-mono text-[9px] z-10 leading-normal space-y-0.5 border border-white/5">
                  <div className="text-electric-yellow uppercase font-bold tracking-wider">HUD LOGISTICS CORE</div>
                  <div>CURSOR X: {deliveryDetails.longitude}° W</div>
                  <div>CURSOR Y: {deliveryDetails.latitude}° N</div>
                  <div>SHIPPING ROUTE: <span className={deliveryDetails.isVerified ? "text-green-400 font-bold" : "text-red-400 font-bold"}>
                    {deliveryDetails.isVerified ? "ACTIVE_FEASIBLE" : "RESTRICTED"}
                  </span></div>
                </div>

                {/* Zoom buttons HUD */}
                <div className="absolute bottom-3 right-3 flex flex-col gap-1.5 z-10">
                  <button 
                    onClick={handleZoomIn}
                    className="w-8 h-8 rounded bg-white text-oxford-blue border border-border-subtle flex items-center justify-center hover:bg-surface-container-low shadow"
                  >
                    <ZoomIn size={14} />
                  </button>
                  <button 
                    onClick={handleZoomOut}
                    className="w-8 h-8 rounded bg-white text-oxford-blue border border-border-subtle flex items-center justify-center hover:bg-surface-container-low shadow"
                  >
                    <ZoomOut size={14} />
                  </button>
                </div>

                {/* SVG Blueprint Canvas */}
                <svg
                  className="w-full h-full text-industrial-gray"
                  onClick={handleMapClick}
                  style={{
                    transform: `scale(${zoomLevel})`,
                    transformOrigin: 'center',
                    transition: 'transform 0.2s ease-out'
                  }}
                >
                  {/* Blueprint Grid Lines */}
                  <defs>
                    <pattern id="grid-lines" width="30" height="30" patternUnits="userSpaceOnUse">
                      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#E0E4E8" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid-lines)" />

                  {/* Regional simulated roads, rivers, and features */}
                  <path d="M 0,150 Q 300,160 500,240 T 1000,300" fill="none" stroke="#bbc6e2" strokeWidth="3" strokeDasharray="5,5" />
                  <path d="M 120,0 L 150,500" fill="none" stroke="#bbc6e2" strokeWidth="1.5" />
                  <path d="M 400,0 C 380,200 450,300 480,500" fill="none" stroke="#bbc6e2" strokeWidth="2" />

                  {/* Draw Coverage Circles */}
                  {zones.map((zone) => {
                    const isHovered = hoveredZoneId === zone.id;
                    return (
                      <g 
                        key={zone.id}
                        onMouseEnter={() => setHoveredZoneId(zone.id)}
                        onMouseLeave={() => setHoveredZoneId(null)}
                      >
                        {/* Coverage circle area */}
                        <circle
                          cx={`${zone.x}%`}
                          cy={`${zone.y}%`}
                          r={`${zone.radius}%`}
                          fill={zone.isCovered ? '#47607e' : '#ba1a1a'}
                          fillOpacity={isHovered ? 0.25 : 0.12}
                          stroke={zone.isCovered ? '#1B263B' : '#ba1a1a'}
                          strokeWidth="1.5"
                          strokeDasharray={zone.isCovered ? 'none' : '4,4'}
                          className="transition-all duration-300"
                        />

                        {/* Anchor hub marker icon */}
                        <g transform={`translate(${(zone.x * 5).toFixed(0)}, ${(zone.y * 3.5).toFixed(0)})`}>
                          <circle cx="0" cy="0" r="4" fill={zone.isCovered ? '#1B263B' : '#ba1a1a'} />
                        </g>

                        {/* text indicator of the zone center */}
                        <text
                          x={`${zone.x}%`}
                          y={`${zone.y - 3}%`}
                          textAnchor="middle"
                          className="font-sans font-bold text-[8px] fill-oxford-blue tracking-wider"
                        >
                          {currentLanguage === 'es' ? zone.name_es.split(' (')[0] : zone.name_en.split(' (')[0]}
                        </text>
                      </g>
                    );
                  })}

                  {/* Draw pin location marker placed by user */}
                  <g transform={`translate(${(deliveryDetails.longitude ? (deliveryDetails.longitude + 70.05) * 2000 : 220).toFixed(0)}, ${(deliveryDetails.latitude ? (deliveryDetails.latitude - 18.40) * 1750 : 125).toFixed(0)})`}>
                    <g className="animate-bounce">
                      <circle cx="0" cy="0" r="16" fill="#F4D03F" fillOpacity="0.4" />
                      <circle cx="0" cy="0" r="8" fill="#F4D03F" fillOpacity="0.8" />
                      {/* Red/Yellow Pin center point */}
                      <circle cx="0" cy="0" r="4" fill="#1B263B" />
                    </g>
                  </g>
                </svg>

                {/* Cover status bar HUD */}
                <div className="absolute bottom-3 left-3 right-12 bg-white/95 border border-border-subtle p-3 rounded-md z-10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {deliveryDetails.isVerified ? (
                      <Truck size={18} className="text-green-600" />
                    ) : (
                      <XCircle size={18} className="text-red-600" />
                    )}
                    <div>
                      <span className="text-[9px] font-bold uppercase block text-industrial-gray">
                        {currentLanguage === 'es' ? 'COBERTURA LOGÍSTICA DE CARGA' : 'HEAVY LOGISTICS STATUS'}
                      </span>
                      <p className="text-xs font-bold text-oxford-blue">
                        {currentLanguage === 'es' ? deliveryDetails.zoneName_es : deliveryDetails.zoneName_en}
                      </p>
                    </div>
                  </div>
                  
                  {deliveryDetails.isVerified && (
                    <div className="text-right">
                      <span className="text-[9px] font-bold uppercase block text-industrial-gray">FREIGHT FEE</span>
                      <p className="text-xs font-mono font-black text-oxford-blue">{t.currency}{deliveryDetails.calculatedFee.toFixed(2)}</p>
                    </div>
                  )}
                </div>

              </div>

              {/* Address details input form */}
              <div className="space-y-4">
                <h3 className="font-sans font-bold text-sm text-oxford-blue border-b border-border-subtle pb-2">
                  {t.addressSpecs}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-industrial-gray mb-1">{t.projectName}</label>
                    <input
                      type="text"
                      placeholder="ej. Expansión de Subestación North Basin"
                      value={deliveryDetails.projectName}
                      onChange={(e) => onUpdateDetails({ projectName: e.target.value })}
                      className="w-full bg-white border border-border-subtle rounded p-2.5 text-xs text-text-main focus:outline-none focus:border-oxford-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-industrial-gray mb-1">{t.attentionTo}</label>
                    <input
                      type="text"
                      placeholder="Juan Pérez"
                      value={deliveryDetails.attentionTo}
                      onChange={(e) => onUpdateDetails({ attentionTo: e.target.value })}
                      className="w-full bg-white border border-border-subtle rounded p-2.5 text-xs text-text-main focus:outline-none focus:border-oxford-blue"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-industrial-gray mb-1">{t.streetAddress}</label>
                  <input
                    type="text"
                    placeholder="Av. Industrial 1200, Puerta 4"
                    value={deliveryDetails.address}
                    onChange={(e) => onUpdateDetails({ address: e.target.value })}
                    className="w-full bg-white border border-border-subtle rounded p-2.5 text-xs text-text-main focus:outline-none focus:border-oxford-blue"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-industrial-gray mb-1">{t.city}</label>
                    <input
                      type="text"
                      placeholder="Santo Domingo"
                      value={deliveryDetails.city}
                      onChange={(e) => onUpdateDetails({ city: e.target.value })}
                      className="w-full bg-white border border-border-subtle rounded p-2.5 text-xs text-text-main focus:outline-none focus:border-oxford-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-industrial-gray mb-1">{t.state}</label>
                    <input
                      type="text"
                      placeholder="Distrito Nacional"
                      value={deliveryDetails.state}
                      onChange={(e) => onUpdateDetails({ state: e.target.value })}
                      className="w-full bg-white border border-border-subtle rounded p-2.5 text-xs text-text-main focus:outline-none focus:border-oxford-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-industrial-gray mb-1">{t.zipCode}</label>
                    <input
                      type="text"
                      placeholder="10112"
                      value={deliveryDetails.zipCode}
                      onChange={(e) => onUpdateDetails({ zipCode: e.target.value })}
                      className="w-full bg-white border border-border-subtle rounded p-2.5 text-xs text-text-main focus:outline-none focus:border-oxford-blue"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-industrial-gray mb-1">{t.specialInstructions}</label>
                  <textarea
                    rows={3}
                    placeholder="Requiere rampa. Llamar 30 min antes de la llegada para acceso a puerta."
                    value={deliveryDetails.specialInstructions}
                    onChange={(e) => onUpdateDetails({ specialInstructions: e.target.value })}
                    className="w-full bg-white border border-border-subtle rounded p-2.5 text-xs text-text-main focus:outline-none focus:border-oxford-blue"
                  />
                </div>
              </div>

            </div>

          </div>

          {/* Checkout Invoice summary sidebar (Right Column) */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-white border border-border-subtle rounded-md p-6">
              <h3 className="font-sans font-bold text-sm text-oxford-blue border-b border-border-subtle pb-3 mb-4 uppercase tracking-wider">
                {t.orderSummary}
              </h3>

              {/* Items listing */}
              <div className="divide-y divide-border-subtle max-h-60 overflow-y-auto mb-4 pr-1">
                {cartItems.length === 0 ? (
                  <p className="text-xs text-industrial-gray italic py-6 text-center">
                    {currentLanguage === 'es' ? 'Su carrito de compras está vacío.' : 'Your shopping cart is empty.'}
                  </p>
                ) : (
                  cartItems.map((item) => {
                    const name = currentLanguage === 'es' ? item.product.name_es : item.product.name_en;
                    return (
                      <div key={item.product.id} className="py-3 flex gap-3">
                        <img
                          src={item.product.image}
                          alt={name}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 bg-surface-container-low rounded object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-oxford-blue truncate" title={name}>{name}</h4>
                          <span className="text-[10px] text-industrial-gray font-mono block">SKU: {item.product.sku}</span>
                          <span className="text-xs text-text-main font-semibold mt-0.5 block">
                            {item.quantity} x {t.currency}{item.product.price.toFixed(2)}
                          </span>
                        </div>
                        <span className="font-mono text-xs font-extrabold text-oxford-blue self-center">
                          {t.currency}{(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Calculations block */}
              <div className="border-t border-border-subtle pt-4 space-y-2 font-sans text-xs">
                <div className="flex justify-between items-center text-industrial-gray">
                  <span>{t.subtotal}</span>
                  <span className="font-mono font-semibold">{t.currency}{subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                
                <div className="flex justify-between items-center text-industrial-gray">
                  <span className="flex items-center gap-1">
                    {t.freightShipping}
                    <Info size={12} className="text-industrial-gray" title="Calculated from physical map coverage test" />
                  </span>
                  <span className="font-mono font-semibold">
                    {deliveryDetails.calculatedFee > 0 ? (
                      `${t.currency}${deliveryDetails.calculatedFee.toFixed(2)}`
                    ) : (
                      <span className="text-red-600 font-bold uppercase text-[10px]">{t.outOfCoverage}</span>
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-center text-industrial-gray">
                  <span>{t.estimatedTaxes} (8%)</span>
                  <span className="font-mono font-semibold">{t.currency}{taxes.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>

                <div className="border-t border-border-subtle pt-3 mt-1 flex justify-between items-baseline">
                  <span className="font-bold text-oxford-blue uppercase">{t.total}</span>
                  <span className="font-mono font-black text-xl text-oxford-blue">
                    {t.currency}{orderTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Proceed yellow checkout button */}
              <button
                onClick={onProceedToPayment}
                disabled={cartItems.length === 0 || !deliveryDetails.isVerified}
                className={`w-full mt-6 py-4 rounded-sm font-sans text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 ${
                  cartItems.length === 0 || !deliveryDetails.isVerified
                    ? 'bg-surface-container-high text-industrial-gray/40 border border-border-subtle cursor-not-allowed'
                    : 'bg-electric-yellow text-oxford-blue hover:opacity-95 shadow'
                }`}
              >
                <span>{t.continuePayment}</span>
                <ArrowRight size={14} />
              </button>

              <p className="text-[10px] text-industrial-gray/80 text-center mt-3">
                {t.pricesDisclaimer}
              </p>
            </div>

            {/* Support info trust cards */}
            <div className="bg-surface-container-low border border-border-subtle rounded-md p-4 space-y-3">
              <div className="flex gap-2.5 items-start">
                <ShieldCheck size={18} className="text-oxford-blue shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-sans font-bold text-xs text-oxford-blue leading-tight">{t.securedAcquisition}</h5>
                  <p className="text-[10px] text-industrial-gray leading-normal mt-0.5">
                    {currentLanguage === 'es' ? 'Transacciones protegidas con encriptación militar y validación IEC.' : 'All high-voltage procurement runs through military encryption.'}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2.5 items-start pt-3 border-t border-border-subtle/50">
                <Truck size={18} className="text-oxford-blue shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-sans font-bold text-xs text-oxford-blue leading-tight">{t.securedDelivery}</h5>
                  <p className="text-[10px] text-industrial-gray leading-normal mt-0.5">
                    {currentLanguage === 'es' ? 'Seguro completo de carga pesada incluido en rutas autorizadas.' : 'Freight LTL cargo is 100% insured under official transit pathways.'}
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
