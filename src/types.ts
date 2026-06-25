export type Language = 'es' | 'en';

export interface TechnicalSpec {
  key_es: string;
  key_en: string;
  value_es: string;
  value_en: string;
}

export interface Product {
  id: string;
  sku: string;
  name_es: string;
  name_en: string;
  category: 'power' | 'transformer' | 'led' | 'automation';
  price: number;
  stock: number;
  image: string;
  status: 'in_stock' | 'low_stock' | 'on_order';
  desc_es: string;
  desc_en: string;
  specs: TechnicalSpec[];
  thumbnails: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CRMClient {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  lastInquiryDate: string;
  status: 'new' | 'contacted' | 'negotiating' | 'converted';
  avatar?: string;
  recentInquiry_es: string;
  recentInquiry_en: string;
  recentActivity_es: string;
  recentActivity_en: string;
  orderHistory: {
    id: string;
    date: string;
    items_es: string;
    items_en: string;
    total: number;
    status_es: string;
    status_en: string;
  }[];
}

export interface DeliveryZone {
  id: string;
  name_es: string;
  name_en: string;
  x: number; // Percentage coordinate on map (0-100)
  y: number; // Percentage coordinate on map (0-100)
  radius: number; // Percentage radius
  isCovered: boolean;
  baseFee: number;
}

export interface DeliveryDetails {
  projectName: string;
  attentionTo: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  specialInstructions: string;
  latitude: number;
  longitude: number;
  isVerified: boolean;
  calculatedFee: number;
  zoneName_es: string;
  zoneName_en: string;
}


