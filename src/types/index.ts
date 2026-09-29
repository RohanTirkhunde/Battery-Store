export type BatteryCategory = 'inverter' | 'inverter-machine' | 'car' | 'two-wheeler' | 'commercial';

export type BatteryBrand = 'Exide' | 'Amaron' | 'Luminous' | 'Microtek' | 'Power Zone' | 'Livfast';

export interface BatteryModel {
  id: string;
  name: string;
  brand: BatteryBrand;
  category: BatteryCategory;
  capacityAh: number;
  voltage: number;
  warrantyMonths: number;
  warrantyType: string; // e.g. "36 Months Replacement + 30 Months Pro-rata"
  priceWithoutExchange: number;
  priceWithExchange: number;
  exchangeDiscount: number;
  inStock: boolean;
  stockCount: number;
  technology: 'Tall Tubular' | 'Short Tubular' | 'Maintenance Free (SMF)' | 'Flooded Lead Acid' | 'VRLA' | 'Pure Sine Wave' | 'Digital UPS' | 'Solar Hybrid' | 'Inverter + Battery Combo';
  vaRating?: number; // e.g. 900, 1100, 1400, 2000 VA for Inverter / Home UPS
  outputWatts?: number; // e.g. 756W, 924W, 1680W
  isCombo?: boolean;
  dimensions?: string; // e.g. "502 x 191 x 440 mm"
  weightKg?: number;
  recommendedFor: string[]; // e.g. ["Maruti Suzuki Swift", "Dzire", "Baleno", "Hyundai i20"]
  features: string[];
  imageUrl?: string;
  isPopular?: boolean;
}

export type InverterPointStatus = 'already_exists' | 'not_done';

export interface CartItem {
  battery: BatteryModel;
  quantity: number;
  withExchange: boolean;
  oldBatteryBrand?: string;
  oldBatteryCapacity?: string;
  inverterPointStatus?: InverterPointStatus; // 'already_exists' (free installment) or 'not_done' (needs electrician charges)
  electricianCharge?: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address: string;
  landmark?: string;
  pincode: string;
  area: string; // "Wagholi", "Bakori Road", "Kharadi", "Kesnand Road", "Lohegaon", etc.
  items: CartItem[];
  subtotal: number;
  exchangeSavings: number;
  deliveryFee: number;
  installationFee: number;
  electricianWiringFee?: number;
  inverterPointStatus?: InverterPointStatus;
  totalAmount: number;
  advanceAmount: number; // ₹1000 advance payment
  remainingAmount: number; // Remaining balance to pay on delivery
  paymentMethod: 'upi_advance_cod' | 'cod' | 'full_upi';
  upiTransactionRef?: string;
  paymentStatus: 'advance_received' | 'pending' | 'paid_on_delivery' | 'completed';
  orderStatus: 'received' | 'confirmed' | 'out_for_delivery' | 'installed' | 'cancelled';
  deliverySlot: string;
  isReplacementOrder?: boolean;
  replacementNotes?: string;
  technicianNotes?: string;
  assignedTechnician?: string;
}

export interface BreakdownRequest {
  id: string;
  requestNumber: string;
  date: string;
  customerName: string;
  phone: string;
  vehicleModel: string;
  vehicleNumber?: string;
  location: string; // Wagholi landmark or street
  issueDescription: string;
  urgency: 'high' | 'immediate';
  status: 'pending' | 'dispatched' | 'resolved';
  technicianName?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  address?: string;
  pincode?: string;
}

export interface RegisteredWarranty {
  id: string;
  batteryName: string;
  serialNumber: string;
  brand: BatteryBrand;
  purchaseDate: string;
  warrantyPeriodMonths: number;
  customerName: string;
  customerPhone: string;
  invoiceNumber: string;
}
