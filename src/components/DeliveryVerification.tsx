import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle, XCircle, MapPin, ZoomIn, ZoomOut, Anchor, Landmark, Factory, 
  ShieldCheck, Truck, ArrowRight, ShoppingBag, Info, Search, HelpCircle, Navigation
} from 'lucide-react';
import { Language, CartItem, DeliveryDetails, DeliveryZone, CRMClient } from '../types';
import { DICTIONARY, DELIVERY_ZONES } from '../data';

interface DeliveryVerificationProps {
  currentLanguage: Language;
  cartItems: CartItem[];
  deliveryDetails: DeliveryDetails;
  clients: CRMClient[];
  onUpdateDetails: (details: Partial<DeliveryDetails>) => void;
  onProceedToPayment: () => void;
  onLeave: () => void;
}

export default function DeliveryVerification({
  currentLanguage,
  cartItems,
  deliveryDetails,
  clients,
  onUpdateDetails,
  onProceedToPayment,
  onLeave,
}: DeliveryVerificationProps) {
  const t = DICTIONARY[currentLanguage];

  // Sub-tab view: checkout configuration OR active LTL tracking
  const [activeSubTab, setActiveSubTab] = useState<'checkout' | 'tracking'>('checkout');

  // Tracking engine states
  const [searchTrackId, setSearchTrackId] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<any | null>(null);
  const [trackingStatus, setTrackingStatus] = useState<'preparing' | 'transit' | 'delivery' | 'delivered'>('preparing');
  const [truckPosition, setTruckPosition] = useState<{ x: number; y: number }>({ x: 18, y: 78 }); // Start at Almacén Haina
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [trackingError, setTrackingError] = useState('');

  // Map configuration & zoom
  const [zoomLevel, setZoomLevel] = useState(1);
  const zones: DeliveryZone[] = DELIVERY_ZONES;

  // Active hover zone indicator
  const [hoveredZoneId, setHoveredZoneId] = useState<string | null>(null);

  // Helper to map addresses/descriptions to SVG percentage coordinate hubs
  const getZoneCoordinates = (text: string): { x: number; y: number } => {
    const nameLower = text.toLowerCase();
    if (nameLower.includes('distrito') || nameLower.includes('piantini') || nameLower.includes('churchill') || nameLower.includes('santo domingo (cobertura total)')) return { x: 48, y: 52 };
    if (nameLower.includes('este') || nameLower.includes('hainamosa') || nameLower.includes('zona franca')) return { x: 72, y: 48 };
    if (nameLower.includes('oeste') || nameLower.includes('industrial') || nameLower.includes('herrera')) return { x: 26, y: 55 };
    if (nameLower.includes('norte') || nameLower.includes('mella') || nameLower.includes('villa mella')) return { x: 45, y: 22 };
    if (nameLower.includes('haina') || nameLower.includes('portuaria')) return { x: 18, y: 78 };
    return { x: 55, y: 35 }; // Default centered grid node
  };

  // Search inside CRM records for tracking id
  const handleSearchTracking = (e: React.FormEvent) => {
    e.preventDefault();
    setTrackingError('');
    setTrackedOrder(null);
    setIsSimulating(false);

    if (!searchTrackId.trim()) return;

    let foundOrder: any = null;
    let foundClient: CRMClient | null = null;

    for (const client of clients) {
      const order = client.orderHistory.find(
        (o) => o.id.toLowerCase() === searchTrackId.trim().toLowerCase()
      );
      if (order) {
        foundOrder = order;
        foundClient = client;
        break;
      }
    }

    if (foundOrder && foundClient) {
      const destCoords = getZoneCoordinates(foundClient.recentInquiry_es + " " + foundClient.company + " " + foundOrder.items_es);
      
      setTrackedOrder({
        orderId: foundOrder.id,
        clientName: foundClient.name,
        company: foundClient.company,
        items: currentLanguage === 'es' ? foundOrder.items_es : foundOrder.items_en,
        total: foundOrder.total,
        status: foundOrder.status_es,
        date: foundOrder.date,
        destCoords,
        address: foundClient.recentInquiry_es.includes('Destino:')
          ? foundClient.recentInquiry_es.split('Destino:')[1].split('.')[0].trim()
          : 'Santo Domingo Centro, RD',
      });
      
      // Reset truck position to central warehouse (Haina)
      setTruckPosition({ x: 18, y: 78 });
      setTrackingStatus('preparing');
      setSimulationProgress(0);
    } else {
      setTrackingError(
        currentLanguage === 'es'
          ? 'No se encontró ningún pedido con ese ID de Transacción. Verifique el formato (ej. TX-583293, ord-101, ord-102).'
          : 'No order found with that Transaction ID. Check the format (e.g., TX-583293, ord-101, ord-102).'
      );
    }
  };

  // Run the animated transit simulation on the SVG map
  const runTrackingSimulation = () => {
    if (!trackedOrder || isSimulating) return;

    setIsSimulating(true);
    setTrackingStatus('preparing');
    setSimulationProgress(0);

    const startX = 18; // Almacén Central Haina
    const startY = 78;
    const endX = trackedOrder.destCoords.x;
    const endY = trackedOrder.destCoords.y;

    const steps = 100;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep += 1;
      setSimulationProgress(currentStep);

      const ratio = currentStep / steps;
      const curX = startX + (endX - startX) * ratio;
      const curY = startY + (endY - startY) * ratio;

      setTruckPosition({ x: curX, y: curY });

      if (currentStep < 20) {
        setTrackingStatus('preparing');
      } else if (currentStep < 80) {
        setTrackingStatus('transit');
      } else if (currentStep < 95) {
        setTrackingStatus('delivery');
      } else {
        setTrackingStatus('delivered');
      }

      if (currentStep >= steps) {
        clearInterval(interval);
        setIsSimulating(false);
      }
    }, 60); // 6-second total trip
  };

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
    if (activeSubTab === 'tracking') return; // Read-only during tracking simulation

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    let foundZone: DeliveryZone | null = null;

    for (const zone of zones) {
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
        latitude: parseFloat((18.40 + (clickY / 100) * 0.20).toFixed(4)),
        longitude: parseFloat((-70.05 + (clickX / 100) * 0.25).toFixed(4)), 
        isVerified: foundZone.isCovered,
        calculatedFee: foundZone.isCovered ? foundZone.baseFee : 0,
        zoneName_es: foundZone.name_es,
        zoneName_en: foundZone.name_en,
      });
    } else {
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
      <div className="max-w-7xl mx-auto space-y-8">
        
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
            className="text-xs font-bold text-red-600 hover:text-red-800 uppercase tracking-wider animate-pulse"
          >
            {t.stepLeave}
          </button>
        </div>

        {/* Sub-tab view buttons */}
        <div className="flex flex-col sm:flex-row border-b border-border-subtle gap-1">
          <button
            onClick={() => setActiveSubTab('checkout')}
            className={`py-3.5 px-6 text-xs font-extrabold uppercase tracking-wider border-b-2 text-left sm:text-center transition-all ${
              activeSubTab === 'checkout'
                ? 'border-oxford-blue text-oxford-blue font-black'
                : 'border-transparent text-industrial-gray hover:text-oxford-blue hover:bg-surface-container-low/40'
            }`}
          >
            {currentLanguage === 'es' ? '1. Configurar Envío y Flete' : '1. Configure Shipping & Freight'}
          </button>
          <button
            onClick={() => setActiveSubTab('tracking')}
            className={`py-3.5 px-6 text-xs font-extrabold uppercase tracking-wider border-b-2 text-left sm:text-center transition-all flex items-center justify-between sm:justify-start gap-2 ${
              activeSubTab === 'tracking'
                ? 'border-oxford-blue text-oxford-blue font-black'
                : 'border-transparent text-industrial-gray hover:text-oxford-blue hover:bg-surface-container-low/40'
            }`}
          >
            <span>{currentLanguage === 'es' ? '2. Rastrear Despacho LTL' : '2. Track LTL Dispatch'}</span>
            <span className="bg-electric-yellow text-oxford-blue text-[9px] px-1.5 py-0.5 rounded font-black uppercase tracking-widest animate-pulse shrink-0">En Vivo</span>
          </button>
        </div>

        {/* Layout: Form + Map (Left) and Invoice Summary (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Logistics Verification Block */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Interactive blueprint map segment */}
            <div className="bg-white border border-border-subtle rounded-md p-6 space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="font-sans font-extrabold text-lg text-oxford-blue">
                      {activeSubTab === 'checkout' 
                        ? t.deliveryVerification 
                        : (currentLanguage === 'es' ? 'Localizador Satelital de Flota LTL' : 'LTL Fleet Satellite Tracker')}
                    </h2>
                    
                    {activeSubTab === 'checkout' ? (
                      deliveryDetails.isVerified ? (
                        <span className="bg-green-50 text-green-700 border border-green-200 text-[10px] font-extrabold px-2.5 py-1 rounded flex items-center gap-1.5 uppercase">
                          <CheckCircle size={12} />
                          {t.locationVerified}
                        </span>
                      ) : (
                        <span className="bg-red-50 text-red-700 border border-red-200 text-[10px] font-extrabold px-2.5 py-1 rounded flex items-center gap-1.5 uppercase">
                          <XCircle size={12} />
                          {t.outOfCoverage}
                        </span>
                      )
                    ) : (
                      trackedOrder && (
                        <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded flex items-center gap-1.5 uppercase border ${
                          trackingStatus === 'delivered'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'
                        }`}>
                          <Navigation size={12} className={trackingStatus !== 'delivered' ? 'animate-spin' : ''} />
                          {trackingStatus === 'preparing' && (currentLanguage === 'es' ? 'Preparando Carga' : 'Preparing Cargo')}
                          {trackingStatus === 'transit' && (currentLanguage === 'es' ? 'En Ruta LTL' : 'In Transit LTL')}
                          {trackingStatus === 'delivery' && (currentLanguage === 'es' ? 'Llegando a Obra' : 'Arriving at Site')}
                          {trackingStatus === 'delivered' && (currentLanguage === 'es' ? 'Entregado y Firmado' : 'Delivered & Signed')}
                        </span>
                      )
                    )}
                  </div>
                  <p className="text-xs text-industrial-gray mt-1">
                    {activeSubTab === 'checkout' 
                      ? t.deliveryVerificationDesc 
                      : (currentLanguage === 'es' ? 'Monitoreo en tiempo real de fletes pesados por la infraestructura vial nacional.' : 'Real-time monitoring of heavy freight through national road networks.')}
                  </p>
                </div>

                {activeSubTab === 'checkout' && (
                  <button
                    onClick={handleSetQuickLocation}
                    className="bg-oxford-blue hover:bg-industrial-gray text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-sm flex items-center justify-center gap-1.5 shadow"
                  >
                    <MapPin size={14} className="text-electric-yellow" />
                    {t.setPointBtn}
                  </button>
                )}
              </div>

              {/* Stylyzed Grid SVG Map */}
              <div className="relative border border-border-subtle rounded-md overflow-hidden bg-surface-container-low h-80 sm:h-96 select-none cursor-crosshair">
                
                {/* Telemetry coordinate HUD indicator */}
                <div className="absolute top-3 left-3 bg-[#101b30]/85 text-white p-2.5 rounded font-mono text-[9px] z-10 leading-normal space-y-0.5 border border-white/5 shadow-md">
                  <div className="text-electric-yellow uppercase font-bold tracking-wider">HUD LOGISTICS CORE</div>
                  {activeSubTab === 'checkout' ? (
                    <>
                      <div>CURSOR X: {deliveryDetails.longitude}° W</div>
                      <div>CURSOR Y: {deliveryDetails.latitude}° N</div>
                      <div>SHIPPING ROUTE: <span className={deliveryDetails.isVerified ? "text-green-400 font-bold" : "text-red-400 font-bold"}>
                        {deliveryDetails.isVerified ? "ACTIVE_FEASIBLE" : "RESTRICTED"}
                      </span></div>
                    </>
                  ) : (
                    <>
                      <div>TRACKING: {trackedOrder ? trackedOrder.orderId : 'WAITING_INPUT'}</div>
                      <div>FLEET COORDS: {truckPosition.x.toFixed(2)}% W / {truckPosition.y.toFixed(2)}% N</div>
                      <div>ROUTE STATUS: <span className="text-electric-yellow font-bold">
                        {isSimulating ? "IN_TRANSIT_SIMULATING" : (trackedOrder ? "STANDBY" : "OFFLINE")}
                      </span></div>
                    </>
                  )}
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

                  {/* Draw Coverage Circles - styled differently based on Tab */}
                  {zones.map((zone) => {
                    const isHovered = hoveredZoneId === zone.id;
                    const isCheckout = activeSubTab === 'checkout';
                    return (
                      <g 
                        key={zone.id}
                        onMouseEnter={() => isCheckout && setHoveredZoneId(zone.id)}
                        onMouseLeave={() => isCheckout && setHoveredZoneId(null)}
                      >
                        {/* Coverage circle area */}
                        <circle
                          cx={`${zone.x}%`}
                          cy={`${zone.y}%`}
                          r={`${zone.radius}%`}
                          fill={zone.isCovered ? '#47607e' : '#ba1a1a'}
                          fillOpacity={isCheckout ? (isHovered ? 0.25 : 0.12) : 0.04}
                          stroke={zone.isCovered ? '#1B263B' : '#ba1a1a'}
                          strokeWidth="1.5"
                          strokeOpacity={isCheckout ? 1 : 0.2}
                          strokeDasharray={zone.isCovered ? 'none' : '4,4'}
                          className="transition-all duration-300"
                        />

                        {/* Anchor hub marker icon */}
                        <g transform={`translate(${(zone.x * 5).toFixed(0)}, ${(zone.y * 3.5).toFixed(0)})`}>
                          <circle cx="0" cy="0" r="3.5" fill={zone.isCovered ? '#1B263B' : '#ba1a1a'} fillOpacity={isCheckout ? 1 : 0.3} />
                        </g>

                        {/* text indicator of the zone center */}
                        <text
                          x={`${zone.x}%`}
                          y={`${zone.y - 3}%`}
                          textAnchor="middle"
                          fillOpacity={isCheckout ? 1 : 0.25}
                          className="font-sans font-bold text-[8px] fill-oxford-blue tracking-wider"
                        >
                          {currentLanguage === 'es' ? zone.name_es.split(' (')[0] : zone.name_en.split(' (')[0]}
                        </text>
                      </g>
                    );
                  })}

                  {/* Render overlays for ACTIVE CHECKOUT SELECTOR */}
                  {activeSubTab === 'checkout' && (
                    <g transform={`translate(${(deliveryDetails.longitude ? (deliveryDetails.longitude + 70.05) * 2000 : 220).toFixed(0)}, ${(deliveryDetails.latitude ? (deliveryDetails.latitude - 18.40) * 1750 : 125).toFixed(0)})`}>
                      <g className="animate-bounce">
                        <circle cx="0" cy="0" r="16" fill="#F4D03F" fillOpacity="0.4" />
                        <circle cx="0" cy="0" r="8" fill="#F4D03F" fillOpacity="0.8" />
                        <circle cx="0" cy="0" r="4" fill="#1B263B" />
                      </g>
                    </g>
                  )}

                  {/* Render overlays for LIVE FREIGHT TRACKING */}
                  {activeSubTab === 'tracking' && trackedOrder && (
                    <>
                      {/* Despatch central base (Haina Port) */}
                      <g transform="translate(90, 273)">
                        <circle cx="0" cy="0" r="10" fill="#1b263b" />
                        <circle cx="0" cy="0" r="5" fill="#f4d03f" className="animate-pulse" />
                        <text x="12" y="3" className="font-sans font-extrabold text-[8px] fill-oxford-blue uppercase tracking-wider">
                          {currentLanguage === 'es' ? 'ALMACÉN HAINA (DESPACHO)' : 'HAINA HUB (ORIGIN)'}
                        </text>
                      </g>

                      {/* Route Path Line */}
                      <line 
                        x1="90" 
                        y1="273" 
                        x2={trackedOrder.destCoords.x * 5} 
                        y2={trackedOrder.destCoords.y * 3.5} 
                        stroke="#1b263b" 
                        strokeWidth="2.5" 
                        strokeDasharray="5,5" 
                        strokeOpacity="0.75"
                      />

                      {/* Delivery target site */}
                      <g transform={`translate(${trackedOrder.destCoords.x * 5}, ${trackedOrder.destCoords.y * 3.5})`}>
                        <circle cx="0" cy="0" r="16" fill="#22c55e" fillOpacity="0.25" className="animate-ping" />
                        <circle cx="0" cy="0" r="8" fill="#22c55e" />
                        <circle cx="0" cy="0" r="4" fill="#ffffff" />
                        <text x="12" y="3" className="font-sans font-black text-[8px] fill-green-800 uppercase tracking-wider bg-white/80 px-1 rounded border border-green-200">
                          {trackedOrder.company}
                        </text>
                      </g>

                      {/* Animated truck icon */}
                      <g transform={`translate(${truckPosition.x * 5}, ${truckPosition.y * 3.5})`}>
                        <circle cx="0" cy="0" r="13" fill="#F4D03F" className="shadow-lg border border-oxford-blue" />
                        <text x="0" y="3.5" textAnchor="middle" className="text-[10px]">🚚</text>
                      </g>
                    </>
                  )}
                </svg>

                {/* Cover status bar HUD */}
                <div className="absolute bottom-3 left-3 right-12 bg-white/95 border border-border-subtle p-3 rounded-md z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  {activeSubTab === 'checkout' ? (
                    <>
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        {deliveryDetails.isVerified ? (
                          <Truck size={18} className="text-green-600 shrink-0" />
                        ) : (
                          <XCircle size={18} className="text-red-600 shrink-0" />
                        )}
                        <div>
                          <span className="text-[9px] font-bold uppercase block text-industrial-gray">
                            {currentLanguage === 'es' ? 'COBERTURA LOGÍSTICA DE CARGA' : 'HEAVY LOGISTICS STATUS'}
                          </span>
                          <p className="text-xs font-bold text-oxford-blue leading-tight">
                            {currentLanguage === 'es' ? deliveryDetails.zoneName_es : deliveryDetails.zoneName_en}
                          </p>
                        </div>
                      </div>
                      
                      {deliveryDetails.isVerified && (
                        <div className="text-left sm:text-right w-full sm:w-auto pl-7 sm:pl-0">
                          <span className="text-[9px] font-bold uppercase block text-industrial-gray">FREIGHT FEE</span>
                          <p className="text-xs font-mono font-black text-oxford-blue">{t.currency}{deliveryDetails.calculatedFee.toFixed(2)}</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 w-full sm:w-auto">
                        <Truck size={18} className="text-oxford-blue animate-bounce shrink-0" />
                        <div>
                          <span className="text-[9px] font-bold uppercase block text-industrial-gray">
                            {currentLanguage === 'es' ? 'UBICACIÓN DE DESPACHO LTL' : 'LTL FREIGHT TRANSIT'}
                          </span>
                          <p className="text-xs font-bold text-oxford-blue leading-tight">
                            {trackedOrder 
                              ? (currentLanguage === 'es' 
                                ? `Ruta: Haina ➔ ${trackedOrder.address}` 
                                : `Route: Haina Hub ➔ ${trackedOrder.address}`)
                              : (currentLanguage === 'es' ? 'Esperando ingreso de ID' : 'Waiting for ID input')}
                          </p>
                        </div>
                      </div>
                      
                      {trackedOrder && (
                        <div className="text-left sm:text-right font-mono w-full sm:w-auto pl-7 sm:pl-0">
                          <span className="text-[9px] font-bold uppercase block text-industrial-gray">PROGRESO</span>
                          <p className="text-xs font-black text-oxford-blue">{simulationProgress}%</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

              </div>

              {/* Toggle view content panels (Checkout Form OR Tracking Console) */}
              {activeSubTab === 'checkout' ? (
                /* Address details input form */
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

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                        className="w-full bg-white border border-border-subtle rounded p-2.5 text-xs text-text-main focus:outline-none focus:border-oxford-blue font-mono"
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
              ) : (
                /* Tracking search and console logs */
                <div className="space-y-6">
                  {/* Search box Form */}
                  <form onSubmit={handleSearchTracking} className="bg-surface-container-low border border-border-subtle rounded p-4">
                    <label className="block text-xs font-extrabold text-oxford-blue uppercase tracking-wider mb-2">
                      {currentLanguage === 'es' ? 'Buscar Carga LTL por ID de Transacción' : 'Search LTL Freight by Transaction ID'}
                    </label>
                    
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 text-industrial-gray" size={16} />
                        <input
                          type="text"
                          placeholder="e.g. TX-583293, ord-101..."
                          value={searchTrackId}
                          onChange={(e) => setSearchTrackId(e.target.value)}
                          className="w-full bg-white border border-border-subtle rounded py-2 pl-10 pr-3 text-xs text-text-main focus:outline-none focus:border-oxford-blue font-mono uppercase font-bold"
                        />
                      </div>
                      <button
                        type="submit"
                        className="bg-oxford-blue text-white px-5 rounded text-xs font-bold uppercase tracking-wider hover:bg-industrial-gray transition-colors"
                      >
                        {currentLanguage === 'es' ? 'Consultar' : 'Query'}
                      </button>
                    </div>

                    {trackingError && (
                      <p className="text-red-600 text-[11px] font-semibold mt-2 leading-relaxed flex items-center gap-1.5">
                        <XCircle size={12} />
                        {trackingError}
                      </p>
                    )}
                  </form>

                  {/* Dispatch timeline log */}
                  {trackedOrder && (
                    <div className="space-y-4">
                      <h4 className="font-sans font-bold text-xs uppercase text-oxford-blue tracking-widest border-b border-border-subtle pb-2">
                        {currentLanguage === 'es' ? 'Bitácora Logística de Despacho' : 'Logistics Dispatch Timeline'}
                      </h4>

                      <div className="relative pl-6 space-y-5 border-l-2 border-border-subtle ml-3 font-sans text-xs">
                        
                        {/* Step 1: Picking */}
                        <div className="relative">
                          <span className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border border-white flex items-center justify-center ${
                            trackingStatus === 'preparing' || trackingStatus === 'transit' || trackingStatus === 'delivery' || trackingStatus === 'delivered'
                              ? 'bg-oxford-blue text-white' : 'bg-surface-container-high text-industrial-gray'
                          }`}>
                            {trackingStatus !== 'preparing' ? <CheckCircle size={10} /> : <span className="text-[8px] font-bold">1</span>}
                          </span>
                          <h5 className="font-bold text-oxford-blue leading-tight">
                            {currentLanguage === 'es' ? 'Confirmación & Picking (Haina)' : 'Acquisition Confirmed & Picking'}
                          </h5>
                          <p className="text-[10px] text-industrial-gray leading-relaxed mt-0.5">
                            {currentLanguage === 'es' 
                              ? 'Orden procesada y verificada bajo IEC. Preparación y embalaje de conductores de media tensión y componentes.'
                              : 'Order verified under IEC. High voltage power conductors and equipment packages prepared for shipping.'}
                          </p>
                        </div>

                        {/* Step 2: Transit */}
                        <div className="relative">
                          <span className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border border-white flex items-center justify-center ${
                            trackingStatus === 'transit' || trackingStatus === 'delivery' || trackingStatus === 'delivered'
                              ? 'bg-oxford-blue text-white' : 'bg-surface-container-high text-industrial-gray'
                          }`}>
                            {trackingStatus === 'delivery' || trackingStatus === 'delivered' ? <CheckCircle size={10} /> : <span className="text-[8px] font-bold">2</span>}
                          </span>
                          <h5 className={`font-bold leading-tight ${
                            trackingStatus === 'transit' ? 'text-oxford-blue' : 'text-industrial-gray'
                          }`}>
                            {currentLanguage === 'es' ? 'Carga Despachada (En Tránsito LTL)' : 'Freight Dispatched (In Transit)'}
                          </h5>
                          <p className="text-[10px] text-industrial-gray leading-relaxed mt-0.5">
                            {currentLanguage === 'es'
                              ? 'El camión pesado LTL salió del terminal logístico de Haina y avanza hacia la ruta del proyecto por la red nacional.'
                              : 'LTL heavy cargo vehicle departed Haina port terminal, advancing toward destination via primary roads.'}
                          </p>
                        </div>

                        {/* Step 3: Arriving */}
                        <div className="relative">
                          <span className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border border-white flex items-center justify-center ${
                            trackingStatus === 'delivery' || trackingStatus === 'delivered'
                              ? 'bg-oxford-blue text-white' : 'bg-surface-container-high text-industrial-gray'
                          }`}>
                            {trackingStatus === 'delivered' ? <CheckCircle size={10} /> : <span className="text-[8px] font-bold">3</span>}
                          </span>
                          <h5 className={`font-bold leading-tight ${
                            trackingStatus === 'delivery' ? 'text-oxford-blue' : 'text-industrial-gray'
                          }`}>
                            {currentLanguage === 'es' ? 'Llegando a Obra / Acceso al Sitio' : 'Approaching Project Jobsite'}
                          </h5>
                          <p className="text-[10px] text-industrial-gray leading-relaxed mt-0.5">
                            {currentLanguage === 'es'
                              ? `Camión ingresando en la zona de entrega en ${trackedOrder.address}. Maniobra y aproximación a la rampa de descarga.`
                              : `Freight truck entering target zone in ${trackedOrder.address}. Approaching designated loading dock.`}
                          </p>
                        </div>

                        {/* Step 4: Delivered */}
                        <div className="relative">
                          <span className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border border-white flex items-center justify-center ${
                            trackingStatus === 'delivered'
                              ? 'bg-green-600 text-white' : 'bg-surface-container-high text-industrial-gray'
                          }`}>
                            {trackingStatus === 'delivered' ? <CheckCircle size={10} /> : <span className="text-[8px] font-bold">4</span>}
                          </span>
                          <h5 className={`font-bold leading-tight ${
                            trackingStatus === 'delivered' ? 'text-green-700' : 'text-industrial-gray'
                          }`}>
                            {currentLanguage === 'es' ? 'Cargamento Entregado con Éxito' : 'Cargo Successfully Delivered'}
                          </h5>
                          <p className="text-[10px] text-industrial-gray leading-relaxed mt-0.5">
                            {currentLanguage === 'es'
                              ? 'Material de obra verificado y recibido conforme por el gerente de sitio. Firma digital de entrega registrada.'
                              : 'Project cargo verified, inspected, and received by site manager. Digital POD signature archived.'}
                          </p>
                        </div>

                      </div>
                    </div>
                  )}

                  {!trackedOrder && (
                    <div className="text-center py-10 border border-dashed border-border-subtle rounded-md text-industrial-gray font-sans text-xs">
                      <HelpCircle size={32} className="mx-auto text-industrial-gray/60 mb-2" />
                      <p className="font-bold">
                        {currentLanguage === 'es' ? 'Esperando consulta de rastreo' : 'Awaiting tracking query'}
                      </p>
                      <p className="text-[10px] text-industrial-gray/80 mt-1 max-w-xs mx-auto">
                        {currentLanguage === 'es'
                          ? 'Ingrese un código de ticket válido (como TX-102 del historial o uno generado en su compra) para visualizar el flete.'
                          : 'Enter a valid ticket ID (like TX-102 from history or a generated receipt ID) to render the cargo path.'}
                      </p>
                    </div>
                  )}
                </div>
              )}

            </div>

          </div>

          {/* Checkout Invoice summary sidebar OR Active Tracking Details (Right Column) */}
          <div className="lg:col-span-4 space-y-6">
            
            {activeSubTab === 'checkout' ? (
              /* Summary Sidebar for Checkout */
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
                      : 'bg-electric-yellow text-oxford-blue hover:opacity-95 shadow cursor-pointer'
                  }`}
                >
                  <span>{t.continuePayment}</span>
                  <ArrowRight size={14} />
                </button>

                <p className="text-[10px] text-industrial-gray/80 text-center mt-3">
                  {t.pricesDisclaimer}
                </p>
              </div>
            ) : (
              /* Summary Sidebar for active tracking */
              <div className="bg-white border border-border-subtle rounded-md p-6 space-y-6">
                <h3 className="font-sans font-bold text-sm text-oxford-blue border-b border-border-subtle pb-3 uppercase tracking-wider">
                  {currentLanguage === 'es' ? 'Ficha de Cargamento LTL' : 'LTL Cargo Details'}
                </h3>

                {trackedOrder ? (
                  <div className="space-y-4 text-xs font-sans">
                    <div className="space-y-1">
                      <span className="text-[10px] text-industrial-gray uppercase font-bold block">TICKET ID</span>
                      <span className="font-mono font-extrabold text-oxford-blue text-sm">{trackedOrder.orderId}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-[10px] text-industrial-gray uppercase font-bold block">CLIENTE</span>
                        <span className="font-semibold text-text-main">{trackedOrder.clientName}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-industrial-gray uppercase font-bold block">PROYECTO</span>
                        <span className="font-semibold text-text-main">{trackedOrder.company}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-industrial-gray uppercase font-bold block">DIRECCIÓN DE ENTREGA</span>
                      <span className="font-medium text-text-main">{trackedOrder.address}</span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-industrial-gray uppercase font-bold block">MATERIAL DE OBRA</span>
                      <span className="font-mono text-[11px] text-oxford-blue block bg-surface-container-low p-2 rounded border border-border-subtle max-h-24 overflow-y-auto">
                        {trackedOrder.items}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 border-t border-border-subtle pt-3 mt-2">
                      <div>
                        <span className="text-[10px] text-industrial-gray uppercase font-bold block">FECHA DESPACHO</span>
                        <span className="font-semibold font-mono text-text-main">{trackedOrder.date}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-industrial-gray uppercase font-bold block">CARGO TOTAL</span>
                        <span className="font-black font-mono text-oxford-blue">{t.currency}{trackedOrder.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>

                    {/* Run Simulation Trigger */}
                    <button
                      onClick={runTrackingSimulation}
                      disabled={isSimulating}
                      className={`w-full mt-4 py-4 rounded-sm font-sans text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 ${
                        isSimulating
                          ? 'bg-surface-container-high text-industrial-gray/40 border border-border-subtle cursor-not-allowed'
                          : 'bg-electric-yellow text-oxford-blue hover:opacity-95 shadow cursor-pointer'
                      }`}
                    >
                      <Navigation size={14} className={isSimulating ? "animate-spin" : ""} />
                      <span>{isSimulating ? (currentLanguage === 'es' ? 'Simulando Ruta...' : 'Simulating Route...') : (currentLanguage === 'es' ? 'Simular Tránsito LTL' : 'Simulate LTL Transit')}</span>
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-8 text-industrial-gray text-xs italic">
                    {currentLanguage === 'es' 
                      ? 'Consulte un ID de transacción a la izquierda para cargar los detalles del flete.' 
                      : 'Query a Transaction ID on the left to load freight specifications.'}
                  </div>
                )}

                <p className="text-[10px] text-industrial-gray/60 leading-normal border-t border-border-subtle/50 pt-3">
                  {currentLanguage === 'es'
                    ? 'Nota: La simulación ilustra el recorrido estimado utilizando las principales autopistas nacionales en el prototipo.'
                    : 'Note: The simulation illustrates the estimated route using key national highways within the prototype.'}
                </p>
              </div>
            )}

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

