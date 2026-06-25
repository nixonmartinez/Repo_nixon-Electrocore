import { Product, CRMClient, DeliveryZone } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    sku: 'EC-900-XL-2024',
    name_es: 'Aislador EC-900 Ultra-Load',
    name_en: 'EC-900 Ultra-Load Insulator',
    category: 'power',
    price: 74700.00,
    stock: 42,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCW7HDBy37BOokgu7sgUJ4s5hFtaBDNHpA_s-TVzcQ_cGZxADHoLuZBjfWERZ-s1LX3hQ1r13Ecn2siH4ERTcaORVc1KXe7MC7gj0E7r079Ca-pKIc3-SRZ2dHRUOFR2GZ3YXjQY01FRfnciJaDuOooO8e8P5vRfo2Sc6MtLwiCCqCsn_EffnxdmMIYHYUu2sYfj_opW1VjVg4SWinwc6mzmZgRquqbt_GEyLg0kdgl-4Cy2ibPNoAb8j9ozNiOocN9au3UK-jEkHXN', // placeholder high quality cable or electrical component
    status: 'in_stock',
    desc_es: 'Aislador de porcelana de ingeniería de precisión diseñado para distribución de alta tensión en entornos extremos. Presenta una distancia de fuga mejorada y una resistencia mecánica en voladizo superior.',
    desc_en: 'Precision-engineered porcelain insulator designed for extreme environment high-voltage distribution. Features an enhanced creepage distance and superior mechanical cantilever strength.',
    specs: [
      { key_es: 'Tensión Nominal', key_en: 'Rated Voltage', value_es: '500kV AC / 600kV DC', value_en: '500kV AC / 600kV DC' },
      { key_es: 'Material del Núcleo', key_en: 'Core Material', value_es: 'Porcelana de Alúmina de Alta Densidad', value_en: 'High-Density Alumina Porcelain' },
      { key_es: 'Certificación', key_en: 'Certification', value_es: 'IEC 60672, IEEE Std 100', value_en: 'IEC 60672, IEEE Std 100' },
      { key_es: 'Temp. Operación', key_en: 'Operating Temp', value_es: '-40°C a +85°C', value_en: '-40°C to +85°C' }
    ],
    thumbnails: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCW7HDBy37BOokgu7sgUJ4s5hFtaBDNHpA_s-TVzcQ_cGZxADHoLuZBjfWERZ-s1LX3hQ1r13Ecn2siH4ERTcaORVc1KXe7MC7gj0E7r079Ca-pKIc3-SRZ2dHRUOFR2GZ3YXjQY01FRfnciJaDuOooO8e8P5vRfo2Sc6MtLwiCCqCsn_EffnxdmMIYHYUu2sYfj_opW1VjVg4SWinwc6mzmZgRquqbt_GEyLg0kdgl-4Cy2ibPNoAb8j9ozNiOocN9au3UK-jEkHXN',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuApLEVWmAcjeoc5qEg4uX5cECmYrQoIXuqowmZLm4qnurDsy2sO9fhYLT1kA5WY0sJyOGKl3Fem5NjBKeHdhxT6zE_eyM6txbBL9xvIKaK7uFwoD3ZNAlUAI6dOBDSIcgdsX_4EN2Ksw4l8OC6OW8Da-O8JB4BmyGTFjBRESo5z_pKLpH_6P72h-dYY7NV23iaZWJ5I5LA5wLSV3sOEn2KEWSbCA_RmEB1W6WRTX1L214ZOBwML72z_hpqYLit7vQzVJbEOeP1t0VTe',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDK2Kc1BjIdCCVqYNXHFT63pw_rSWPXuE3f5qAS8N5r1mWmvkIFZRE5ote_sYBwBi7lqHHbH1AafNh45jprSb8uQsRhb-0MDsHa7M_e9TWyMRqMOd_XmIt8VWi_ev_cYBf60ePGudV0YG_NuJeszGtQHAGR8WQcavaaWnfs6yJAtXmfBLSiRDj-OexEimCyjdsMaVGWKjNjV7YaY_PmTRif6btY8KMi5VNby9ZlXA3owaA9rIfENO0m5qCeoUrJS6bZCOPLfpXZkJfY'
    ]
  },
  {
    id: 'prod-2',
    sku: 'EC-4450-TX',
    name_es: 'Disyuntor Industrial 400V 50A',
    name_en: 'Industrial Circuit Breaker 400V 50A',
    category: 'automation',
    price: 8520.00,
    stock: 128,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuApLEVWmAcjeoc5qEg4uX5cECmYrQoIXuqowmZLm4qnurDsy2sO9fhYLT1kA5WY0sJyOGKl3Fem5NjBKeHdhxT6zE_eyM6txbBL9xvIKaK7uFwoD3ZNAlUAI6dOBDSIcgdsX_4EN2Ksw4l8OC6OW8Da-O8JB4BmyGTFjBRESo5z_pKLpH_6P72h-dYY7NV23iaZWJ5I5LA5wLSV3sOEn2KEWSbCA_RmEB1W6WRTX1L214ZOBwML72z_hpqYLit7vQzVJbEOeP1t0VTe',
    status: 'in_stock',
    desc_es: 'Interruptor termo-magnético de alta resistencia para gabinetes de control centralizado. Protección contra sobrecargas severas y cortocircuitos.',
    desc_en: 'Heavy-duty thermo-magnetic circuit breaker for centralized control cabinets. Features robust protection against severe overloads and short circuits.',
    specs: [
      { key_es: 'Tensión de Red', key_en: 'Grid Voltage', value_es: '400V AC', value_en: '400V AC' },
      { key_es: 'Corriente Nominal', key_en: 'Rated Current', value_es: '50A', value_en: '50A' },
      { key_es: 'Polos', key_en: 'Poles', value_es: '3 Polos (Trifásico)', value_en: '3 Poles (Three-phase)' },
      { key_es: 'Capacidad de Ruptura', key_en: 'Breaking Capacity', value_es: '25 kA', value_en: '25 kA' }
    ],
    thumbnails: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuApLEVWmAcjeoc5qEg4uX5cECmYrQoIXuqowmZLm4qnurDsy2sO9fhYLT1kA5WY0sJyOGKl3Fem5NjBKeHdhxT6zE_eyM6txbBL9xvIKaK7uFwoD3ZNAlUAI6dOBDSIcgdsX_4EN2Ksw4l8OC6OW8Da-O8JB4BmyGTFjBRESo5z_pKLpH_6P72h-dYY7NV23iaZWJ5I5LA5wLSV3sOEn2KEWSbCA_RmEB1W6WRTX1L214ZOBwML72z_hpqYLit7vQzVJbEOeP1t0VTe'
    ]
  },
  {
    id: 'prod-3',
    sku: 'EC-9912-CB',
    name_es: 'Cable Multipolar Blindado 12 AWG',
    name_en: 'Shielded Multipolar Cable 12 AWG',
    category: 'power',
    price: 270.00, // Per meter
    stock: 240, // meters
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDK2Kc1BjIdCCVqYNXHFT63pw_rSWPXuE3f5qAS8N5r1mWmvkIFZRE5ote_sYBwBi7lqHHbH1AafNh45jprSb8uQsRhb-0MDsHa7M_e9TWyMRqMOd_XmIt8VWi_ev_cYBf60ePGudV0YG_NuJeszGtQHAGR8WQcavaaWnfs6yJAtXmfBLSiRDj-OexEimCyjdsMaVGWKjNjV7YaY_PmTRif6btY8KMi5VNby9ZlXA3owaA9rIfENO0m5qCeoUrJS6bZCOPLfpXZkJfY',
    status: 'in_stock',
    desc_es: 'Protección superior contra interferencias electromagnéticas para entornos de manufactura pesada y automatización robótica. Alta flexibilidad y vaina exterior resistente a aceites.',
    desc_en: 'Superior protection against electromagnetic interference for heavy manufacturing and robotic automation. Highly flexible and features oil-resistant outer jacketing.',
    specs: [
      { key_es: 'Calibre', key_en: 'Gauge', value_es: '12 AWG', value_en: '12 AWG' },
      { key_es: 'Conductores', key_en: 'Conductors', value_es: '4 hilos + Tierra', value_en: '4 cores + Ground' },
      { key_es: 'Aislamiento', key_en: 'Insulation', value_es: 'XLPE Termorresistente', value_en: 'Heat-resistant XLPE' },
      { key_es: 'Blindaje', key_en: 'Shielding', value_es: 'Malla de cobre estañado 85%', value_en: '85% Tinned copper braid' }
    ],
    thumbnails: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDK2Kc1BjIdCCVqYNXHFT63pw_rSWPXuE3f5qAS8N5r1mWmvkIFZRE5ote_sYBwBi7lqHHbH1AafNh45jprSb8uQsRhb-0MDsHa7M_e9TWyMRqMOd_XmIt8VWi_ev_cYBf60ePGudV0YG_NuJeszGtQHAGR8WQcavaaWnfs6yJAtXmfBLSiRDj-OexEimCyjdsMaVGWKjNjV7YaY_PmTRif6btY8KMi5VNby9ZlXA3owaA9rIfENO0m5qCeoUrJS6bZCOPLfpXZkJfY'
    ]
  },
  {
    id: 'prod-4',
    sku: 'EC-LED-200W',
    name_es: 'Luminaria LED High Bay 200W IP65',
    name_en: 'LED High Bay Luminaire 200W IP65',
    category: 'led',
    price: 17340.00,
    stock: 0,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGPPxLap1wQtKvbQmCsV3MY3LSH3NuY-qFlqt1HesLHLRlbfLWW53UpTTGC9eDuINnp7cWSmCJh__eCcj_Aqc-wXO3M6Yjoyd9h3ZnjGu01GkdKWnameFe1dBoXYIcnxr0lc5wvH5U4aheNFSYf9XhlVuUSAWApkamJTtUnDJQzp7SZzliGjz5M1iP1JwzzSbT6X4O30yPrtO8Afa5gHnyhf_J5aSkmMMY5xnGRrOT58AfXcZesbHksd72EFHvfcwS1H8eMCsWTXcE',
    status: 'on_order',
    desc_es: 'Iluminación de alto rendimiento para naves industriales de gran altura. IP65 Resistente a polvo y humedad con cuerpo disipador de calor de aluminio fundido.',
    desc_en: 'High-performance lighting engineered for high-ceiling industrial facilities. IP65 dust and waterproof rating with die-cast aluminum heat sink.',
    specs: [
      { key_es: 'Potencia', key_en: 'Power', value_es: '200W', value_en: '200W' },
      { key_es: 'Flujo Luminoso', key_en: 'Luminous Flux', value_es: '28,000 lm', value_en: '28,000 lm' },
      { key_es: 'Eficiencia', key_en: 'Efficiency', value_es: '140 lm/W', value_en: '140 lm/W' },
      { key_es: 'Temperatura de Color', key_en: 'Color Temperature', value_es: '5000K (Luz Fría)', value_en: '5000K (Cold White)' }
    ],
    thumbnails: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAGPPxLap1wQtKvbQmCsV3MY3LSH3NuY-qFlqt1HesLHLRlbfLWW53UpTTGC9eDuINnp7cWSmCJh__eCcj_Aqc-wXO3M6Yjoyd9h3ZnjGu01GkdKWnameFe1dBoXYIcnxr0lc5wvH5U4aheNFSYf9XhlVuUSAWApkamJTtUnDJQzp7SZzliGjz5M1iP1JwzzSbT6X4O30yPrtO8Afa5gHnyhf_J5aSkmMMY5xnGRrOT58AfXcZesbHksd72EFHvfcwS1H8eMCsWTXcE'
    ]
  },
  {
    id: 'prod-5',
    sku: 'EC-PLC-S7',
    name_es: 'Módulo PLC Siemens S7-1200 CPU',
    name_en: 'Siemens S7-1200 CPU PLC Module',
    category: 'automation',
    price: 30720.00,
    stock: 8,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlipM0A2DBPTcDjAacbAvbczHdMPl-MAp-iQoKY7BvZadw5AK5WbuykXJChkkz5UFoLQFQuP20xtgY6oq-OB8HBv-XI94ginH_afU0bV53aKpGM4WjsIyaXs8jCBuhxLEHUUVDSZHtxFXOdEoSWlnAu0vQRi8mQjQsMg2-btwbXtBCk_q2l1RhbUaD3Mvr796vD573LWsXX_Mz6nXSRuEt957ZEt6LgQGGQvrvD-uQ4rytZDjTUQoW-5JP_ti79nNgRffwpGCklZ72',
    status: 'low_stock',
    desc_es: 'Unidad central de procesamiento compacta para automatización industrial y lógica de control secuencial. Soporta múltiples protocolos de red integrados como PROFINET.',
    desc_en: 'Compact CPU unit for versatile automation tasks and sequential control. Built-in comprehensive interfaces supporting industrial communication like PROFINET.',
    specs: [
      { key_es: 'Alimentación', key_en: 'Power Supply', value_es: '24V DC', value_en: '24V DC' },
      { key_es: 'Entradas Integradas', key_en: 'Integrated Inputs', value_es: '14 Entradas Digitales (24V)', value_en: '14 Digital Inputs (24V)' },
      { key_es: 'Salidas Integradas', key_en: 'Integrated Outputs', value_es: '10 Salidas de Transistor', value_en: '10 Transistor Outputs' },
      { key_es: 'Memoria de Trabajo', key_en: 'Work Memory', value_es: '100 KB', value_en: '100 KB' }
    ],
    thumbnails: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBlipM0A2DBPTcDjAacbAvbczHdMPl-MAp-iQoKY7BvZadw5AK5WbuykXJChkkz5UFoLQFQuP20xtgY6oq-OB8HBv-XI94ginH_afU0bV53aKpGM4WjsIyaXs8jCBuhxLEHUUVDSZHtxFXOdEoSWlnAu0vQRi8mQjQsMg2-btwbXtBCk_q2l1RhbUaD3Mvr796vD573LWsXX_Mz6nXSRuEt957ZEt6LgQGGQvrvD-uQ4rytZDjTUQoW-5JP_ti79nNgRffwpGCklZ72'
    ]
  },
  {
    id: 'prod-6',
    sku: 'EC-TRA-440V',
    name_es: 'Transformador Trifásico de Potencia Seco',
    name_en: 'Dry Type Three-Phase Power Transformer',
    category: 'transformer',
    price: 231000.00,
    stock: 3,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB23d7TLoOv1yFRnSioYWJbAKhxSr5GVDfG-BhUYOg3vEbCvu5YpYba5u3MDPm6OpmY84_-lbSfXerFqRLJj9SGgOq57gEgWo_LugGQ82yo41juu4Yi4_eOSWaVMN2hn9tUfPHzf7AD9SdRCNAqOF16l4OhazUsF42AO2bUvjrS1rvHfA6Wq_zhNrPGvP2DGJZZ2lPaQgVL9hGEgewIwgr9L-wHX9w-B4yTooQ5J_G3uZA8aWpcR0qkhOlIjazVHGtnVKIrMeUSetyF',
    status: 'in_stock',
    desc_es: 'Transformador trifásico tipo seco encapsulado en resina. Excelente resistencia a cortocircuitos e ideal para subestaciones interiores de fábricas y edificios.',
    desc_en: 'Dry-type three-phase transformer cast in epoxy resin. High short-circuit resistance, ideal for indoor utility substations in industrial facilities and commercial buildings.',
    specs: [
      { key_es: 'Potencia Nominal', key_en: 'Power Rating', value_es: '50 kVA', value_en: '50 kVA' },
      { key_es: 'Tensión Primaria', key_en: 'Primary Voltage', value_es: '440 V', value_en: '440 V' },
      { key_es: 'Tensión Secundaria', key_en: 'Secondary Voltage', value_es: '220 V / 127 V', value_en: '220 V / 127 V' },
      { key_es: 'Clase de Aislamiento', key_en: 'Insulation Class', value_es: 'Clase H (180°C)', value_en: 'Class H (180°C)' }
    ],
    thumbnails: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB23d7TLoOv1yFRnSioYWJbAKhxSr5GVDfG-BhUYOg3vEbCvu5YpYba5u3MDPm6OpmY84_-lbSfXerFqRLJj9SGgOq57gEgWo_LugGQ82yo41juu4Yi4_eOSWaVMN2hn9tUfPHzf7AD9SdRCNAqOF16l4OhazUsF42AO2bUvjrS1rvHfA6Wq_zhNrPGvP2DGJZZ2lPaQgVL9hGEgewIwgr9L-wHX9w-B4yTooQ5J_G3uZA8aWpcR0qkhOlIjazVHGtnVKIrMeUSetyF'
    ]
  }
];

export const INITIAL_CRM_CLIENTS: CRMClient[] = [
  {
    id: 'client-1',
    name: 'Ing. Alejandro Ruiz',
    company: 'Proyectos Industriales S.A.',
    email: 'a.ruiz@proyectosind.com',
    phone: '+1 809 555 0199',
    lastInquiryDate: '2026-06-24',
    status: 'new',
    avatar: 'AR',
    recentInquiry_es: '"Solicito cotización para 500 metros de cable blindado multipolar para instalación en la nueva planta de tratamiento..."',
    recentInquiry_en: '"Requesting quotation for 500 meters of multipolar shielded cable to install in the new treatment facility..."',
    recentActivity_es: 'Esperando respuesta de cotización técnica',
    recentActivity_en: 'Awaiting technical quote response',
    orderHistory: [
      { id: 'ord-101', date: '2026-04-12', items_es: '2x Disyuntor 400V 50A', items_en: '2x Circuit Breaker 400V 50A', total: 17040.00, status_es: 'Entregado', status_en: 'Delivered' }
    ]
  },
  {
    id: 'client-2',
    name: 'Marta Gómez',
    company: 'Logística Global S.R.L.',
    email: 'marta.gomez@logisticaglobal.com.do',
    phone: '+1 829 444 0234',
    lastInquiryDate: '2026-06-23',
    status: 'negotiating',
    avatar: 'MG',
    recentInquiry_es: '"Consultando plazos de entrega para la compra por lote de 15 Luminarias High Bay de 200W para almacén central."',
    recentInquiry_en: '"Inquiring on delivery times for a bulk purchase of 15 LED High Bay 200W lights for central warehouse."',
    recentActivity_es: 'Negociación de descuento por volumen (Lote de luminarias)',
    recentActivity_en: 'Negotiating volume discount (Lights batch)',
    orderHistory: [
      { id: 'ord-098', date: '2026-03-05', items_es: '1x Transformador Seco 50 kVA', items_en: '1x Dry Transformer 50 kVA', total: 231000.00, status_es: 'Entregado', status_en: 'Delivered' }
    ]
  },
  {
    id: 'client-3',
    name: 'Ing. Roberto Sánchez',
    company: 'Instalaciones Eléctricas Santo Domingo',
    email: 'roberto.sanchez@bcninstal.es',
    phone: '+1 849 333 9876',
    lastInquiryDate: '2026-06-15',
    status: 'contacted',
    avatar: 'RS',
    recentInquiry_es: '"¿El aislador EC-900 viene con certificado homologado para la red local de alta tensión?"',
    recentInquiry_en: '"Does the EC-900 insulator come with an approved certificate for the local high-voltage grid?"',
    recentActivity_es: 'Ficha técnica y certificados enviados por email',
    recentActivity_en: 'Datasheet and certificates sent via email',
    orderHistory: []
  },
  {
    id: 'client-4',
    name: 'Ing. Elena Rostova',
    company: 'Siberian Power Grid',
    email: 'e.rostova@sibpower.net',
    phone: '+7 495 789 1234',
    lastInquiryDate: '2026-06-10',
    status: 'converted',
    avatar: 'ER',
    recentInquiry_es: '"Pedido urgente de 3 Aisladores EC-900 para subestación en área de frío extremo."',
    recentInquiry_en: '"Urgent order of 3 EC-900 Insulators for substation in extreme cold region."',
    recentActivity_es: 'Contrato firmado, entrega coordinada',
    recentActivity_en: 'Contract signed, delivery dispatched',
    orderHistory: [
      { id: 'ord-102', date: '2026-06-12', items_es: '3x Aislador EC-900 Ultra-Load', items_en: '3x EC-900 Ultra-Load Insulator', total: 224100.00, status_es: 'En Tránsito', status_en: 'In Transit' }
    ]
  }
];

export const DELIVERY_ZONES: DeliveryZone[] = [
  {
    id: 'zone-distrito-nacional',
    name_es: 'Distrito Nacional, Santo Domingo (Cobertura Total)',
    name_en: 'Distrito Nacional, Santo Domingo (Full Coverage)',
    x: 48,
    y: 52,
    radius: 15,
    isCovered: true,
    baseFee: 4500.00
  },
  {
    id: 'zone-santo-domingo-este',
    name_es: 'Santo Domingo Este - Zona Franca Hainamosa (Cobertura Total)',
    name_en: 'Santo Domingo Este - Hainamosa Free Zone (Full Coverage)',
    x: 72,
    y: 48,
    radius: 14,
    isCovered: true,
    baseFee: 6000.00
  },
  {
    id: 'zone-santo-domingo-oeste',
    name_es: 'Santo Domingo Oeste - Zona Industrial (Cobertura Total)',
    name_en: 'Santo Domingo Oeste - Industrial Zone (Full Coverage)',
    x: 26,
    y: 55,
    radius: 15,
    isCovered: true,
    baseFee: 5000.00
  },
  {
    id: 'zone-santo-domingo-norte',
    name_es: 'Santo Domingo Norte - Villa Mella (Cobertura Especial)',
    name_en: 'Santo Domingo Norte - Villa Mella (Special Coverage)',
    x: 45,
    y: 22,
    radius: 12,
    isCovered: true,
    baseFee: 5500.00
  },
  {
    id: 'zone-haina',
    name_es: 'Puerto de Haina - Zona Portuaria (Cobertura Especial)',
    name_en: 'Haina Port - Port Substation (Special Coverage)',
    x: 18,
    y: 78,
    radius: 10,
    isCovered: true,
    baseFee: 7500.00
  },
  {
    id: 'zone-interior',
    name_es: 'Cordillera Central / Región Interior (Fuera de Cobertura)',
    name_en: 'Central Mountain Range / Interior Region (Out of Coverage)',
    x: 85,
    y: 15,
    radius: 10,
    isCovered: false,
    baseFee: 0
  }
];

export const DICTIONARY = {
  es: {
    // Nav
    catalog: 'Catálogo',
    quotes: 'Cotizaciones',
    inventory: 'Inventario',
    admin: 'Admin',
    searchPlaceholder: 'SKU, especificación, cliente...',
    currency: 'RD$',
    shoppingCart: 'Carrito de Compras',
    remove: 'Eliminar',
    checkoutBtn: 'Proceder con la Compra',
    continueShopping: 'Continuar Comprando',
    requestQuoteTitle: 'Solicitar Cotización Técnica',
    
    // Landing
    heroSub: 'Suministros Eléctricos de Alta Gama',
    heroTitle: 'Compra Equipos Eléctricos Industriales con Entrega Inmediata',
    heroDesc: 'La tienda líder en conductores de potencia, transformadores, luminarias LED industriales y automatización. Precios competitivos en RD$, stock local verificado y envíos rápidos a pie de obra.',
    heroBtnCatalog: 'Comprar y Ver Precios',
    heroBtnQuote: 'Cotización por Lote',
    categoriesTitle: 'Categorías Industriales',
    catPower: 'Cableado de Potencia',
    catTransformers: 'Transformadores',
    catLed: 'Iluminación LED',
    catAutomation: 'Automatización y Control',
    catPowerSub: 'ALTA Y MEDIA TENSIÓN',
    catAutomationSub: 'MÓDULOS PLC Y SENSORES',
    featuredTitle: 'Productos Destacados',
    featuredSub: 'Disponibilidad inmediata para proyectos de gran escala.',
    viewAllCatalog: 'Ver todo el catálogo',
    addToCart: 'Carrito',
    quoteBtn: 'Cotizar',
    inStock: 'En Stock',
    lowStock: 'Stock Bajo',
    onOrder: 'Bajo Pedido',
    outOfStock: 'Sin Stock',
    
    // Certifications
    standardsTitle: 'Estándares Internacionales',
    standardsHeading: 'Certificación y Rigor Técnico en Cada Componente',
    standardsDesc: 'Nuestros productos cumplen con las normativas IEC, UL y ANSI, garantizando la seguridad y eficiencia en infraestructuras críticas de energía y automatización.',
    traceability: 'Trazabilidad Total',
    traceabilityDesc: 'Documentación técnica completa disponible para auditorías.',
    loadTests: 'Pruebas de Carga',
    loadTestsDesc: 'Componentes testeados para condiciones extremas de operación.',
    engineeringAdvice: 'Asesoría de Ingeniería',
    engineeringAdviceDesc: 'Soporte preventa para especificación de proyectos complejos.',
    yearsExperience: 'Años de experiencia en el mercado industrial global.',
    
    // Details
    techSpecs: 'Especificaciones Técnicas',
    partNo: 'No. Parte',
    unitPrice: 'Precio Unitario',
    addCartBtn: 'Añadir al Carrito',
    requestBulkQuote: 'Solicitar Cotización por Lote',
    deliveryEstimation: 'Entrega estimada: 5-7 días hábiles dentro de Norteamérica.',
    certificationBadges: 'Garantía EIG',
    partOfNetwork: 'Parte de la Red de Infraestructura Global de Electrocable International Group.',
    
    // Admin & CRM Dashboard
    mgmtTitle: 'Gestión',
    mgmtSub: 'Control Industrial',
    dashboard: 'Dashboard',
    orders: 'Pedidos',
    prospectsCRM: 'Prospectos (CRM)',
    stockLevel: 'Nivel de Stock',
    activeQuotes: 'Cotizaciones Activas',
    newProspects: 'Nuevos Prospectos (CRM)',
    stockAlerts: 'Alertas de Stock',
    stockAlertsDesc: 'Requieren atención inmediata',
    inventoryControl: 'Control de Inventario',
    inventorySub: 'Monitorización técnica de SKUs y componentes.',
    addSKU: 'Añadir SKU',
    crmTitle: 'Gestión CRM',
    crmSub: 'Prospectos y consultas del e-commerce.',
    latestConsultation: 'Última consulta:',
    viewProfile: 'Ver Perfil',
    sendQuote: 'Enviar Cotización',
    activeSystem: 'Sistema Activo',
    globalSupplyVision: 'Visión Global de Suministros',
    globalSupplyDesc: 'Analítica en tiempo real de importaciones y logística de componentes eléctricos. Los retrasos proyectados en la red portuaria podrían afectar el stock de transformadores en el Q4.',
    viewFullReport: 'Ver Informe Completo',
    networkAlerts: 'Alertas de Red',
    
    // Delivery Verification
    deliveryVerification: 'Verificación de Entrega',
    deliveryVerificationDesc: 'Señale su ubicación exacta de entrega para verificar la accesibilidad logística de carga pesada.',
    setPointBtn: 'Fijar Punto de Entrega',
    locationVerified: 'Ubicación Verificada',
    outOfCoverage: 'Fuera de Cobertura',
    coveredZoneInfo: 'Logística Accesible: Transporte Estándar y Pesado',
    notCoveredZoneInfo: 'Área Restringida: Fuera de la ruta de entrega de carga pesada',
    addressSpecs: 'Especificaciones de Envío',
    projectName: 'Nombre del Proyecto / Empresa',
    attentionTo: 'Atención a (Gerente de Sitio)',
    streetAddress: 'Calle / Entrada al Sitio',
    city: 'Ciudad',
    state: 'Estado',
    zipCode: 'Código Postal',
    specialInstructions: 'Instrucciones Especiales de Entrega',
    orderSummary: 'Desglose del Pedido',
    subtotal: 'Subtotal',
    freightShipping: 'Envío Freight LTL',
    estimatedTaxes: 'Impuestos Estimados',
    total: 'Total',
    continuePayment: 'Continuar al Pago',
    securedAcquisition: 'Adquisición Técnica Segura',
    securedDelivery: 'Envío Industrial Asegurado',
    pricesDisclaimer: 'Precios válidos por 48 horas. Revisión técnica pendiente.',
    stepCart: '1. Carrito',
    stepVerify: '2. Verificación',
    stepPayment: '3. Pago',
    stepLeave: 'Salir',
    
    // Add SKU Modal
    addSKUTitle: 'Registrar Nuevo Componente de Inventario',
    skuLabel: 'SKU Código',
    nameEsLabel: 'Nombre (Español)',
    nameEnLabel: 'Nombre (Inglés)',
    categoryLabel: 'Categoría',
    priceLabel: 'Precio Unitario (RD$)',
    stockLabel: 'Cantidad Inicial en Stock',
    descEsLabel: 'Descripción (Español)',
    descEnLabel: 'Descripción (Inglés)',
    cancel: 'Cancelar',
    save: 'Guardar SKU',
    
    // Footer
    corpTitle: 'Corporativo',
    resources: 'Recursos',
    aboutUs: 'Sobre Nosotros',
    careers: 'Carreras',
    investors: 'Inversionistas',
    sustainability: 'Sostenibilidad',
    techSupport: 'Soporte Técnico',
    pdfDocs: 'Documentación PDF',
    installGuides: 'Guías de Instalación',
    helpCenter: 'Centro de Ayuda',
    directContact: 'Contacto Directo',
    newsletter: 'Newsletter Industrial',
    newsletterDesc: 'Reciba actualizaciones técnicas y nuevos lanzamientos.',
    privacyNotice: 'Aviso de Privacidad',
    termsOfService: 'Términos de Servicio',
    compliance: 'Cumplimiento',
    allRightsReserved: 'Todos los derechos reservados. Electrocable International Group.',
    contact: 'Contacto'
  },
  en: {
    // Nav
    catalog: 'Catalog',
    quotes: 'Quotes',
    inventory: 'Inventory',
    admin: 'Admin',
    searchPlaceholder: 'Search SKU, specification, client...',
    currency: 'RD$',
    shoppingCart: 'Shopping Cart',
    remove: 'Remove',
    checkoutBtn: 'Proceed to Checkout',
    continueShopping: 'Continue Shopping',
    requestQuoteTitle: 'Request Technical Quote',
    
    // Landing
    heroSub: 'Premium Electrical Supplies Store',
    heroTitle: 'Buy Industrial Electrical Equipment with Immediate Delivery',
    heroDesc: 'The leading online shop for power conductors, dry transformers, industrial LED high bay, and PLCs. Competitive RD$ pricing, verified local stock, and express jobsite deliveries.',
    heroBtnCatalog: 'Shop and View Prices',
    heroBtnQuote: 'Bulk Volume Quote',
    categoriesTitle: 'Industrial Categories',
    catPower: 'Power Cabling',
    catTransformers: 'Transformers',
    catLed: 'LED Lighting',
    catAutomation: 'Automation and Control',
    catPowerSub: 'HIGH & MEDIUM VOLTAGE',
    catAutomationSub: 'PLC MODULES & SENSORS',
    featuredTitle: 'Featured Products',
    featuredSub: 'Immediate availability for large-scale engineering projects.',
    viewAllCatalog: 'View full catalog',
    addToCart: 'Cart',
    quoteBtn: 'Quote',
    inStock: 'In Stock',
    lowStock: 'Low Stock',
    onOrder: 'On Order',
    outOfStock: 'Out of Stock',
    
    // Certifications
    standardsTitle: 'International Standards',
    standardsHeading: 'Certification and Technical Rigor in Every Component',
    standardsDesc: 'Our products comply with IEC, UL, and ANSI standards, ensuring security and efficiency in critical energy and automation infrastructures.',
    traceability: 'Full Traceability',
    traceabilityDesc: 'Full technical documentation ready for audits.',
    loadTests: 'Load Testing',
    loadTestsDesc: 'Components fully tested for extreme operation conditions.',
    engineeringAdvice: 'Engineering Advisory',
    engineeringAdviceDesc: 'Pre-sales support for complex project specifications.',
    yearsExperience: 'Years of global industrial market experience.',
    
    // Details
    techSpecs: 'Technical Specifications',
    partNo: 'Part No.',
    unitPrice: 'Unit Price',
    addCartBtn: 'Add to Cart',
    requestBulkQuote: 'Request Bulk Quote',
    deliveryEstimation: 'Estimated delivery: 5-7 business days within North America.',
    certificationBadges: 'EIG Guarantee',
    partOfNetwork: 'Part of the Global Infrastructure Network of Electrocable International Group.',
    
    // Admin & CRM Dashboard
    mgmtTitle: 'Management',
    mgmtSub: 'Industrial Control',
    dashboard: 'Dashboard',
    orders: 'Orders',
    prospectsCRM: 'Prospects (CRM)',
    stockLevel: 'Stock Level',
    activeQuotes: 'Active Quotes',
    newProspects: 'New Prospects (CRM)',
    stockAlerts: 'Stock Alerts',
    stockAlertsDesc: 'Require immediate attention',
    inventoryControl: 'Inventory Control',
    inventorySub: 'Technical monitoring of SKUs and components.',
    addSKU: 'Add SKU',
    crmTitle: 'CRM Management',
    crmSub: 'E-commerce leads and inquiries.',
    latestConsultation: 'Latest inquiry:',
    viewProfile: 'View Profile',
    sendQuote: 'Send Quote',
    activeSystem: 'Active System',
    globalSupplyVision: 'Global Supply Chain Vision',
    globalSupplyDesc: 'Real-time analysis of imports and electrical component logistics. Projected port delays might affect transformer stock in Q4.',
    viewFullReport: 'View Full Report',
    networkAlerts: 'Network Alerts',
    
    // Delivery Verification
    deliveryVerification: 'Delivery Verification',
    deliveryVerificationDesc: 'Pinpoint your exact delivery location on the map to verify logistics and heavy transport accessibility.',
    setPointBtn: 'Set Delivery Point',
    locationVerified: 'Location Verified',
    outOfCoverage: 'Out of Coverage',
    coveredZoneInfo: 'Logistics Accessible: Standard and Heavy Freight',
    notCoveredZoneInfo: 'Restricted Area: Out of heavy cargo freight route',
    addressSpecs: 'Shipping Specifications',
    projectName: 'Project Name / Company',
    attentionTo: 'Attention To (Site Manager)',
    streetAddress: 'Street Address / Site Entrance',
    city: 'City',
    state: 'State',
    zipCode: 'Postal Code',
    specialInstructions: 'Special Delivery Instructions',
    orderSummary: 'Order Details',
    subtotal: 'Subtotal',
    freightShipping: 'Freight Shipping LTL',
    estimatedTaxes: 'Estimated Taxes',
    total: 'Total',
    continuePayment: 'Continue to Payment',
    securedAcquisition: 'Secure Technical Procurement',
    securedDelivery: 'Insured Industrial Shipping',
    pricesDisclaimer: 'Prices valid for 48 hours. Subject to final technical review.',
    stepCart: '1. Cart',
    stepVerify: '2. Verification',
    stepPayment: '3. Payment',
    stepLeave: 'Exit',
    
    // Add SKU Modal
    addSKUTitle: 'Register New Inventory Component',
    skuLabel: 'SKU Code',
    nameEsLabel: 'Name (Spanish)',
    nameEnLabel: 'Name (English)',
    categoryLabel: 'Category',
    priceLabel: 'Unit Price (RD$)',
    stockLabel: 'Initial Stock Quantity',
    descEsLabel: 'Description (Spanish)',
    descEnLabel: 'Description (English)',
    cancel: 'Cancel',
    save: 'Save SKU',
    
    // Footer
    corpTitle: 'Corporate',
    resources: 'Resources',
    aboutUs: 'About Us',
    careers: 'Careers',
    investors: 'Investors',
    sustainability: 'Sustainability',
    techSupport: 'Technical Support',
    pdfDocs: 'PDF Documentation',
    installGuides: 'Installation Guides',
    helpCenter: 'Help Center',
    directContact: 'Direct Contact',
    newsletter: 'Industrial Newsletter',
    newsletterDesc: 'Get the latest technical updates and product launches.',
    privacyNotice: 'Privacy Notice',
    termsOfService: 'Terms of Service',
    compliance: 'Compliance',
    allRightsReserved: 'All rights reserved. Electrocable International Group.',
    contact: 'Contact'
  }
};
