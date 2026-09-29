import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { BatteryModel, CartItem, Order, BreakdownRequest, RegisteredWarranty, BatteryBrand, BatteryCategory, InverterPointStatus } from '../types';
import { INITIAL_BATTERIES } from '../data/batteryCatalog';
import { useAuth } from './AuthContext';

interface StoreContextType {
  batteries: BatteryModel[];
  cart: CartItem[];
  orders: Order[];
  breakdowns: BreakdownRequest[];
  warranties: RegisteredWarranty[];
  toastMessage: string | null;
  activeView: 'store' | 'customer-dashboard' | 'admin-dashboard' | 'cart';
  setActiveView: (view: 'store' | 'customer-dashboard' | 'admin-dashboard' | 'cart') => void;
  showToast: (msg: string) => void;
  // Cart Actions
  addToCart: (battery: BatteryModel, withExchange?: boolean, oldBrand?: string) => void;
  removeFromCart: (batteryId: string) => void;
  updateCartQuantity: (batteryId: string, quantity: number) => void;
  toggleExchange: (batteryId: string, withExchange: boolean) => void;
  toggleInverterPointStatus: (batteryId: string, status: InverterPointStatus) => void;
  clearCart: () => void;
  cartTotal: number;
  cartProductsTotal: number;
  cartElectricianFee: number;
  cartSavings: number;
  cartItemCount: number;
  // Order Actions
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'date'>) => Order;
  updateOrderStatus: (orderId: string, status: Order['orderStatus'], notes?: string) => void;
  // Breakdown Service Actions
  requestBreakdownService: (data: Omit<BreakdownRequest, 'id' | 'requestNumber' | 'date' | 'status'>) => BreakdownRequest;
  updateBreakdownStatus: (id: string, status: BreakdownRequest['status'], technicianName?: string) => void;
  // Warranty Actions
  registerWarranty: (data: Omit<RegisteredWarranty, 'id'>) => RegisteredWarranty;
  // Admin Inventory Actions
  updateBattery: (id: string, updates: Partial<BatteryModel>) => void;
  addBattery: (battery: Omit<BatteryModel, 'id'>) => BatteryModel;
  deleteBattery: (id: string) => void;
  deleteOrder: (orderId: string) => void;
  deleteBreakdown: (id: string) => void;
  // Filters
  selectedCategory: BatteryCategory | 'all';
  setSelectedCategory: (cat: BatteryCategory | 'all') => void;
  selectedBrand: BatteryBrand | 'all';
  setSelectedBrand: (brand: BatteryBrand | 'all') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  priceMode: 'with-exchange' | 'without-exchange';
  setPriceMode: (mode: 'with-exchange' | 'without-exchange') => void;
  selectedProductForDetail: BatteryModel | null;
  setSelectedProductForDetail: (b: BatteryModel | null) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isBreakdownModalOpen: boolean;
  setIsBreakdownModalOpen: (open: boolean) => void;
  isReplacementModalOpen: boolean;
  setIsReplacementModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isAdminLoginModalOpen: boolean;
  setIsAdminLoginModalOpen: (open: boolean) => void;
  ownerPhone: string;
  ownerEmail: string;
  ownerUpiId: string;
  sendOrderToOwnerWhatsApp: (order: Order) => void;
  getOrderWhatsAppUrl: (order: Order) => string;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const OWNER_PHONE = '8329838314';
const OWNER_EMAIL = 'rohanofficial512@gmail.com';
const OWNER_UPI = '8329838314@ybl';
export const ELECTRICIAN_POINT_FEE = 600; // Extra wiring charges if inverter point not done

const SEED_ORDERS: Order[] = [
  {
    id: 'ord_101',
    orderNumber: 'NBB-2026-8812',
    date: '2026-09-25T14:30:00Z',
    customerName: 'Sanjay Deshmukh',
    customerPhone: '+91 98223 44551',
    customerEmail: 'sanjay.wagholi@gmail.com',
    address: 'Flat 402, B-Wing, Neo City Phase 2',
    landmark: 'Near Lexicon International School',
    area: 'Bakori Road, Wagholi',
    pincode: '412207',
    items: [
      {
        battery: INITIAL_BATTERIES[0], // Exide IT 500
        quantity: 1,
        withExchange: true,
        oldBatteryBrand: 'Luminous',
        oldBatteryCapacity: '150Ah'
      }
    ],
    subtotal: 15400,
    exchangeSavings: 2600,
    deliveryFee: 0,
    installationFee: 0,
    totalAmount: 12800,
    advanceAmount: 1000,
    remainingAmount: 11800,
    paymentMethod: 'upi_advance_cod',
    upiTransactionRef: 'UPI202609258812',
    paymentStatus: 'advance_received',
    orderStatus: 'out_for_delivery',
    deliverySlot: 'Same Day Express (2-3 Hours)',
    technicianNotes: 'Technician Santosh assigned. Delivering with clamp set.',
    assignedTechnician: 'Santosh K.'
  },
  {
    id: 'ord_102',
    orderNumber: 'NBB-2026-8809',
    date: '2026-09-24T18:15:00Z',
    customerName: 'Priya Kulkarni',
    customerPhone: '+91 97654 32190',
    customerEmail: 'priya.kulkarni@gmail.com',
    address: 'Bungalow 14, Marvel Ganga Silver',
    landmark: 'Behind BJS College',
    area: 'Baif Road, Wagholi',
    pincode: '412207',
    items: [
      {
        battery: INITIAL_BATTERIES[9], // Amaron Flo 35Ah
        quantity: 1,
        withExchange: true,
        oldBatteryBrand: 'Exide',
        oldBatteryCapacity: '35Ah'
      }
    ],
    subtotal: 4650,
    exchangeSavings: 1000,
    deliveryFee: 0,
    installationFee: 0,
    totalAmount: 3650,
    advanceAmount: 1000,
    remainingAmount: 2650,
    paymentMethod: 'upi_advance_cod',
    upiTransactionRef: 'UPI202609241042',
    paymentStatus: 'completed',
    orderStatus: 'installed',
    deliverySlot: 'Delivered Yesterday',
    technicianNotes: 'Installed in Maruti Swift 2021. Battery voltage 14.2V tested.',
    assignedTechnician: 'Ramesh Pawar'
  }
];

const SEED_BREAKDOWNS: BreakdownRequest[] = [
  {
    id: 'brk_201',
    requestNumber: 'JUMP-9941',
    date: '2026-09-25T20:10:00Z',
    customerName: 'Amit Sharma',
    phone: '+91 94220 11984',
    vehicleModel: 'Hyundai Creta Petrol (2022)',
    vehicleNumber: 'MH 12 TS 4410',
    location: 'Wagholi Pune-Nagar Road near Reliance Digital',
    issueDescription: 'Car clicked and will not crank. Completely dead battery.',
    urgency: 'immediate',
    status: 'dispatched',
    technicianName: 'Sachin (Mobile Jumpstart Unit)'
  }
];

const SEED_WARRANTIES: RegisteredWarranty[] = [
  {
    id: 'war_301',
    batteryName: 'Exide Inva Tubular IT 500',
    serialNumber: 'EXT-500-2498711',
    brand: 'Exide',
    purchaseDate: '2026-08-10',
    warrantyPeriodMonths: 66,
    customerName: 'Sanjay Deshmukh',
    customerPhone: '+91 98223 44551',
    invoiceNumber: 'INV-NBB-7742'
  }
];

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [batteries, setBatteries] = useState<BatteryModel[]>(() => {
    try {
      const deletedIds = new Set<string>(JSON.parse(localStorage.getItem('nbb_deleted_battery_ids') || '[]'));
      const saved = localStorage.getItem('nbb_batteries');
      if (!saved) return INITIAL_BATTERIES.filter(b => !deletedIds.has(b.id));
      const parsed: BatteryModel[] = JSON.parse(saved);
      // Ensure catalog models (such as Livfast) are present, unless explicitly deleted by owner
      const existingIds = new Set(parsed.map(b => b.id));
      const missing = INITIAL_BATTERIES.filter(b => !existingIds.has(b.id) && !deletedIds.has(b.id));
      const merged = missing.length > 0 ? [...parsed, ...missing] : parsed;
      return merged.filter(b => !deletedIds.has(b.id));
    } catch {
      return INITIAL_BATTERIES;
    }
  });

  const { currentUser } = useAuth();

  // Helper to obtain an isolated session key for the active visit
  const getVisitorSessionCartKey = () => {
    try {
      let visitToken = sessionStorage.getItem('nbb_visit_token');
      if (!visitToken) {
        visitToken = 'visit_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
        sessionStorage.setItem('nbb_visit_token', visitToken);
      }
      return `nbb_cart_${visitToken}`;
    } catch {
      return 'nbb_cart_session';
    }
  };

  const prevUserIdRef = useRef<string | null>(currentUser?.id || null);

  // Keep cart NEW for each and every user that visits the website
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      // Purge any stale legacy shared carts from previous visits
      localStorage.removeItem('nbb_cart');
      localStorage.removeItem('nbb_cart_guest');

      if (currentUser?.id) {
        // Authenticated customer: load their private cart
        const saved = localStorage.getItem(`nbb_cart_user_${currentUser.id}`);
        return saved ? JSON.parse(saved) : [];
      } else {
        // New visitor: check if they have items in this specific active session; otherwise start completely fresh with 0 items
        const sessionKey = getVisitorSessionCartKey();
        const sessionSaved = sessionStorage.getItem(sessionKey);
        return sessionSaved ? JSON.parse(sessionSaved) : [];
      }
    } catch {
      return [];
    }
  });

  // Handle customer login and logout transitions
  useEffect(() => {
    const currentUserId = currentUser?.id || null;
    const prevUserId = prevUserIdRef.current;

    if (prevUserId !== currentUserId) {
      if (prevUserId && !currentUserId) {
        // Customer just logged out:
        // Automatically clear active cart for privacy & security
        setCart([]);
        try {
          sessionStorage.clear();
          localStorage.removeItem('nbb_cart_guest');
        } catch {}
      } else if (currentUserId) {
        // Customer logged in or switched account:
        // Seamlessly carry over and merge any products added prior to login into this customer's account cart
        const customerKey = `nbb_cart_user_${currentUserId}`;
        setCart(currentCart => {
          try {
            const rawSaved = localStorage.getItem(customerKey);
            const savedCart: CartItem[] = rawSaved ? JSON.parse(rawSaved) : [];

            // Retrieve any products that were in guest session storage
            let sessionItems: CartItem[] = [];
            try {
              const sessionKey = getVisitorSessionCartKey();
              const sessionRaw = sessionStorage.getItem(sessionKey);
              if (sessionRaw) sessionItems = JSON.parse(sessionRaw);
            } catch {}

            // Prioritize items in active state, fall back to session storage
            const pendingGuestItems = (currentCart && currentCart.length > 0)
              ? currentCart
              : sessionItems;

            if (pendingGuestItems.length > 0) {
              const merged = [...savedCart];
              pendingGuestItems.forEach(guestItem => {
                const existingIdx = merged.findIndex(i => i.battery.id === guestItem.battery.id);
                if (existingIdx > -1) {
                  merged[existingIdx] = {
                    ...merged[existingIdx],
                    quantity: Math.max(merged[existingIdx].quantity, guestItem.quantity),
                    withExchange: guestItem.withExchange ?? merged[existingIdx].withExchange,
                    inverterPointStatus: guestItem.inverterPointStatus ?? merged[existingIdx].inverterPointStatus
                  };
                } else {
                  merged.push(guestItem);
                }
              });
              localStorage.setItem(customerKey, JSON.stringify(merged));
              try {
                const sessionKey = getVisitorSessionCartKey();
                sessionStorage.removeItem(sessionKey);
              } catch {}
              return merged;
            } else {
              return savedCart;
            }
          } catch {
            return currentCart;
          }
        });
      }
      prevUserIdRef.current = currentUserId;
    }
  }, [currentUser]);

  // Persist cart to the current customer's specific storage key or visitor session
  useEffect(() => {
    try {
      if (currentUser?.id) {
        localStorage.setItem(`nbb_cart_user_${currentUser.id}`, JSON.stringify(cart));
      } else {
        const sessionKey = getVisitorSessionCartKey();
        sessionStorage.setItem(sessionKey, JSON.stringify(cart));
      }
    } catch {}
  }, [cart, currentUser]);

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('nbb_orders');
      return saved ? JSON.parse(saved) : SEED_ORDERS;
    } catch {
      return SEED_ORDERS;
    }
  });

  const [breakdowns, setBreakdowns] = useState<BreakdownRequest[]>(() => {
    try {
      const saved = localStorage.getItem('nbb_breakdowns');
      return saved ? JSON.parse(saved) : SEED_BREAKDOWNS;
    } catch {
      return SEED_BREAKDOWNS;
    }
  });

  const [warranties, setWarranties] = useState<RegisteredWarranty[]>(() => {
    try {
      const saved = localStorage.getItem('nbb_warranties');
      return saved ? JSON.parse(saved) : SEED_WARRANTIES;
    } catch {
      return SEED_WARRANTIES;
    }
  });

  const [activeView, setActiveView] = useState<'store' | 'customer-dashboard' | 'admin-dashboard' | 'cart'>('store');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<BatteryCategory | 'all'>('all');
  const [selectedBrand, setSelectedBrand] = useState<BatteryBrand | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceMode, setPriceMode] = useState<'with-exchange' | 'without-exchange'>('with-exchange');

  // Modals & Drawers
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<BatteryModel | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isBreakdownModalOpen, setIsBreakdownModalOpen] = useState(false);
  const [isReplacementModalOpen, setIsReplacementModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('nbb_batteries', JSON.stringify(batteries));
  }, [batteries]);

  useEffect(() => {
    localStorage.setItem('nbb_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('nbb_breakdowns', JSON.stringify(breakdowns));
  }, [breakdowns]);

  useEffect(() => {
    localStorage.setItem('nbb_warranties', JSON.stringify(warranties));
  }, [warranties]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };

  const getOrderWhatsAppUrl = (order: Order) => {
    const itemsList = order.items
      .map(it => {
        let line = `• ${it.quantity}x ${it.battery.name} (${it.battery.brand} ${it.battery.capacityAh || it.battery.vaRating || ''}) ${it.withExchange ? '[OLD SCRAP RETURN]' : '[NEW ONLY]'}`;
        if (it.inverterPointStatus === 'already_exists') {
          line += `\n   ↳ Inverter Point: [ALREADY EXISTS - Standard installation included]`;
        } else if (it.inverterPointStatus === 'not_done') {
          line += `\n   ↳ Inverter Point: [NOT DONE - Needs Electrician Wiring (₹${it.electricianCharge || ELECTRICIAN_POINT_FEE} added)]`;
        }
        return line;
      })
      .join('\n');

    const msg = `⚡ *NEW BHARAT BATTERY - NEW ORDER RECEIVED* ⚡
-----------------------------------------
📋 *Order ID:* ${order.orderNumber}
👤 *Customer Name:* ${order.customerName}
📞 *Mobile:* ${order.customerPhone}
📍 *Address:* ${order.address}
🏢 *Wagholi Area:* ${order.area} ${order.landmark ? `(Near: ${order.landmark})` : ''}

🛒 *Ordered Items:*
${itemsList}

💰 *Payment Details:*
• *Products Subtotal:* ₹${order.subtotal.toLocaleString('en-IN')}
${order.electricianWiringFee ? `• *Electrician Inverter Point Charges:* ₹${order.electricianWiringFee.toLocaleString('en-IN')}\n` : ''}• *Total Bill:* ₹${order.totalAmount.toLocaleString('en-IN')}
• *Advance Paid (UPI to 8329838314@ybl):* ₹${order.advanceAmount.toLocaleString('en-IN')} ${order.upiTransactionRef ? `[UTR/Ref: ${order.upiTransactionRef}]` : ''}
• *Balance Due on Delivery:* ₹${order.remainingAmount.toLocaleString('en-IN')} (Cash/UPI at doorstep)

⏰ *Delivery Slot:* ${order.deliverySlot}
${order.isReplacementOrder ? `🔄 *Old Battery Scrap Rebate:* ₹${order.exchangeSavings} saved\n` : ''}-----------------------------------------
_Please dispatch technician from NEW Bharat Battery Wagholi (+91 8329838314)_`;

    const encoded = encodeURIComponent(msg);
    return `https://wa.me/918329838314?text=${encoded}`;
  };

  const sendOrderToOwnerWhatsApp = (order: Order) => {
    const waUrl = getOrderWhatsAppUrl(order);
    try {
      window.open(waUrl, '_blank');
    } catch {
      // Ignored if browser blocks popup
    }
  };

  // Cart logic
  const addToCart = (battery: BatteryModel, withExchange: boolean = true, oldBrand?: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.battery.id === battery.id && item.withExchange === withExchange);
      if (existing) {
        return prev.map(item =>
          item.battery.id === battery.id && item.withExchange === withExchange
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      const isInverterRelated = battery.category === 'inverter-machine' || battery.category === 'inverter' || battery.isCombo;
      return [
        ...prev,
        {
          battery,
          quantity: 1,
          withExchange,
          oldBatteryBrand: oldBrand || 'Same as new',
          inverterPointStatus: isInverterRelated ? 'already_exists' : undefined,
          electricianCharge: 0
        }
      ];
    });
    showToast(`Added ${battery.brand} ${battery.name} to cart`);
  };

  const removeFromCart = (batteryId: string) => {
    setCart(prev => prev.filter(item => item.battery.id !== batteryId));
  };

  const updateCartQuantity = (batteryId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(batteryId);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.battery.id === batteryId ? { ...item, quantity } : item))
    );
  };

  const toggleExchange = (batteryId: string, withExchange: boolean) => {
    setCart(prev =>
      prev.map(item => (item.battery.id === batteryId ? { ...item, withExchange } : item))
    );
  };

  const toggleInverterPointStatus = (batteryId: string, status: InverterPointStatus) => {
    setCart(prev =>
      prev.map(item =>
        item.battery.id === batteryId
          ? {
              ...item,
              inverterPointStatus: status,
              electricianCharge: status === 'not_done' ? ELECTRICIAN_POINT_FEE : 0
            }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const cartProductsTotal = cart.reduce((sum, item) => {
    const unitPrice = item.withExchange ? item.battery.priceWithExchange : item.battery.priceWithoutExchange;
    return sum + unitPrice * item.quantity;
  }, 0);

  const cartElectricianFee = cart.reduce((sum, item) => {
    if (item.inverterPointStatus === 'not_done') {
      return sum + (item.electricianCharge ?? ELECTRICIAN_POINT_FEE) * item.quantity;
    }
    return sum;
  }, 0);

  const cartTotal = cartProductsTotal + cartElectricianFee;

  const cartSavings = cart.reduce((sum, item) => {
    if (item.withExchange) {
      return sum + item.battery.exchangeDiscount * item.quantity;
    }
    return sum;
  }, 0);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Orders logic
  const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'date'>): Order => {
    const newOrder: Order = {
      ...orderData,
      id: 'ord_' + Date.now(),
      orderNumber: `NBB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString()
    };
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    showToast(`Order #${newOrder.orderNumber} placed! Free Wagholi doorstep installation scheduled.`);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['orderStatus'], notes?: string) => {
    setOrders(prev =>
      prev.map(ord =>
        ord.id === orderId
          ? {
              ...ord,
              orderStatus: status,
              technicianNotes: notes || ord.technicianNotes,
              paymentStatus: status === 'installed' ? 'completed' : ord.paymentStatus
            }
          : ord
      )
    );
    showToast(`Order status updated to ${status}`);
  };

  // Breakdown requests
  const requestBreakdownService = (data: Omit<BreakdownRequest, 'id' | 'requestNumber' | 'date' | 'status'>) => {
    const newReq: BreakdownRequest = {
      ...data,
      id: 'brk_' + Date.now(),
      requestNumber: `JUMP-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString(),
      status: 'pending'
    };
    setBreakdowns(prev => [newReq, ...prev]);
    showToast(`Emergency assistance requested! New Bharat Battery technician dispatched to ${data.location}.`);
    return newReq;
  };

  const updateBreakdownStatus = (id: string, status: BreakdownRequest['status'], technicianName?: string) => {
    setBreakdowns(prev =>
      prev.map(b => (b.id === id ? { ...b, status, technicianName: technicianName || b.technicianName } : b))
    );
    showToast(`Breakdown request marked as ${status}`);
  };

  // Warranty
  const registerWarranty = (data: Omit<RegisteredWarranty, 'id'>) => {
    const newWarranty: RegisteredWarranty = {
      ...data,
      id: 'war_' + Date.now()
    };
    setWarranties(prev => [newWarranty, ...prev]);
    showToast(`Warranty registered for ${data.batteryName} (${data.serialNumber})`);
    return newWarranty;
  };

  // Admin inventory
  const updateBattery = (id: string, updates: Partial<BatteryModel>) => {
    setBatteries(prev =>
      prev.map(b => {
        if (b.id === id) {
          const updated = { ...b, ...updates };
          // Keep exchange discount consistent
          if (updates.priceWithoutExchange !== undefined || updates.priceWithExchange !== undefined) {
            const pNo = updates.priceWithoutExchange ?? b.priceWithoutExchange;
            const pWith = updates.priceWithExchange ?? b.priceWithExchange;
            updated.exchangeDiscount = Math.max(0, pNo - pWith);
          }
          return updated;
        }
        return b;
      })
    );
    showToast('Battery specifications & pricing updated');
  };

  const addBattery = (battery: Omit<BatteryModel, 'id'>) => {
    const newBattery: BatteryModel = {
      ...battery,
      id: 'bat_' + Date.now(),
      exchangeDiscount: Math.max(0, battery.priceWithoutExchange - battery.priceWithExchange)
    };
    setBatteries(prev => [newBattery, ...prev]);
    showToast(`Added new battery model: ${battery.name}`);
    return newBattery;
  };

  const deleteBattery = (id: string) => {
    setBatteries(prev => prev.filter(b => b.id !== id));
    try {
      const savedDeleted = JSON.parse(localStorage.getItem('nbb_deleted_battery_ids') || '[]');
      if (!savedDeleted.includes(id)) {
        localStorage.setItem('nbb_deleted_battery_ids', JSON.stringify([...savedDeleted, id]));
      }
    } catch {
      // ignore
    }
    showToast('Battery removed from catalog');
  };

  const deleteOrder = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
    showToast('Order record removed from owner panel');
  };

  const deleteBreakdown = (id: string) => {
    setBreakdowns(prev => prev.filter(b => b.id !== id));
    showToast('Jumpstart request removed');
  };

  return (
    <StoreContext.Provider
      value={{
        batteries,
        cart,
        orders,
        breakdowns,
        warranties,
        toastMessage,
        activeView,
        setActiveView,
        showToast,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        toggleExchange,
        toggleInverterPointStatus,
        clearCart,
        cartTotal,
        cartProductsTotal,
        cartElectricianFee,
        cartSavings,
        cartItemCount,
        createOrder,
        updateOrderStatus,
        deleteOrder,
        requestBreakdownService,
        updateBreakdownStatus,
        deleteBreakdown,
        registerWarranty,
        updateBattery,
        addBattery,
        deleteBattery,
        selectedCategory,
        setSelectedCategory,
        selectedBrand,
        setSelectedBrand,
        searchQuery,
        setSearchQuery,
        priceMode,
        setPriceMode,
        selectedProductForDetail,
        setSelectedProductForDetail,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isBreakdownModalOpen,
        setIsBreakdownModalOpen,
        isReplacementModalOpen,
        setIsReplacementModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isAdminLoginModalOpen,
        setIsAdminLoginModalOpen,
        ownerPhone: OWNER_PHONE,
        ownerEmail: OWNER_EMAIL,
        ownerUpiId: OWNER_UPI,
        sendOrderToOwnerWhatsApp,
        getOrderWhatsAppUrl
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
