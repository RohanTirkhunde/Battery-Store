import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { WAGHOLI_SERVICE_AREAS } from '../data/batteryCatalog';
import { Order, InverterPointStatus } from '../types';
import {
  X,
  CheckCircle2,
  MapPin,
  Truck,
  Phone,
  User,
  Clock,
  QrCode,
  Copy,
  Check,
  MessageSquare,
  AlertCircle,
  Zap,
  Smartphone,
  Lock,
  ArrowRight
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartTotal,
    cartProductsTotal,
    cartElectricianFee,
    cartSavings,
    clearCart,
    createOrder,
    ownerPhone,
    ownerUpiId,
    sendOrderToOwnerWhatsApp,
    getOrderWhatsAppUrl,
    toggleInverterPointStatus
  } = useStore();
  const { currentUser, loginCustomer } = useAuth();

  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [area, setArea] = useState(WAGHOLI_SERVICE_AREAS[0]);
  const [address, setAddress] = useState(currentUser?.address || '');
  const [landmark, setLandmark] = useState('');
  const [deliverySlot, setDeliverySlot] = useState('Within 2 Hours (Express Wagholi Delivery)');
  const [upiRef, setUpiRef] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [orderConfirmed, setOrderConfirmed] = useState<Order | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  // Inline login state if opened without login
  const [loginPhone, setLoginPhone] = useState('');
  const [loginName, setLoginName] = useState('');
  const [loginAddress, setLoginAddress] = useState('');

  // Synchronize state when user logs in
  useEffect(() => {
    if (currentUser) {
      if (currentUser.name) setName(currentUser.name);
      if (currentUser.phone) setPhone(currentUser.phone);
      if (currentUser.address) setAddress(currentUser.address);
    }
  }, [currentUser]);

  const advanceAmount = Math.min(1000, cartTotal);
  const remainingAmount = Math.max(0, cartTotal - advanceAmount);

  // Check if any item in cart is an Inverter or Inverter Battery or Combo
  const hasInverterProduct = cart.some(
    item =>
      item.battery.category === 'inverter-machine' ||
      item.battery.category === 'inverter' ||
      item.battery.isCombo
  );

  // Inverter point status across items (if any item is marked 'not_done')
  const isAnyInverterPointNotDone = cart.some(
    item =>
      (item.battery.category === 'inverter-machine' ||
        item.battery.category === 'inverter' ||
        item.battery.isCombo) &&
      item.inverterPointStatus === 'not_done'
  );

  // Generate Real UPI Intent URL for ₹1,000 Advance to 8329838314@ybl
  const upiIntentUri = `upi://pay?pa=${encodeURIComponent(ownerUpiId)}&pn=${encodeURIComponent('NEW Bharat Battery Wagholi')}&am=1000&cu=INR&tn=${encodeURIComponent('Advance Payment Wagholi')}`;

  useEffect(() => {
    if (!isCheckoutOpen || !ownerUpiId) return;

    let isMounted = true;
    QRCode.toDataURL(upiIntentUri, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 300,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    })
      .then((url) => {
        if (isMounted) {
          setQrCodeDataUrl(url);
        }
      })
      .catch((err) => {
        console.error('QR code generation error:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [isCheckoutOpen, upiIntentUri, ownerUpiId]);

  if (!isCheckoutOpen) return null;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(ownerUpiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleGlobalInverterPointChange = (status: InverterPointStatus) => {
    cart.forEach(item => {
      if (
        item.battery.category === 'inverter-machine' ||
        item.battery.category === 'inverter' ||
        item.battery.isCombo
      ) {
        toggleInverterPointStatus(item.battery.id, status);
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim()) {
      setErrorMessage('Please fill in your name, contact phone number, and Wagholi delivery address.');
      return;
    }

    if (!upiRef.trim()) {
      setErrorMessage('Please enter your 12-digit UPI Transaction Ref / UTR number after transferring the ₹1,000 advance.');
      return;
    }
    setErrorMessage('');

    // Auto log-in customer if not already logged in
    if (!currentUser) {
      loginCustomer(phone, name, `${address}, ${area}`);
    }

    const newOrder = createOrder({
      customerName: name,
      customerPhone: phone,
      customerEmail: email || `${phone.replace(/\D/g, '')}@customer.nbb`,
      address,
      landmark,
      area,
      pincode: '412207',
      items: cart,
      subtotal: cartProductsTotal,
      exchangeSavings: cartSavings,
      deliveryFee: 0,
      installationFee: 0,
      electricianWiringFee: cartElectricianFee,
      inverterPointStatus: isAnyInverterPointNotDone ? 'not_done' : 'already_exists',
      totalAmount: cartTotal,
      advanceAmount,
      remainingAmount,
      paymentMethod: 'upi_advance_cod',
      upiTransactionRef: upiRef,
      paymentStatus: 'advance_received',
      orderStatus: 'received',
      deliverySlot,
      technicianNotes: `Advance ₹${advanceAmount} paid via UPI (${upiRef}) to ${ownerUpiId}. ${
        cartElectricianFee > 0
          ? 'Needs electrician wiring for inverter point (+₹600).'
          : 'Inverter point already exists (free installation).'
      } Remaining ₹${remainingAmount} to collect on delivery.`
    });

    clearCart();
    setOrderConfirmed(newOrder);

    // Trigger WhatsApp notification to owner mobile 8329838314
    setTimeout(() => {
      sendOrderToOwnerWhatsApp(newOrder);
    }, 600);
  };

  const handleClose = () => {
    setOrderConfirmed(null);
    setIsCheckoutOpen(false);
  };

  const handleInlineLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginPhone.trim() || !loginName.trim() || !loginAddress.trim()) {
      setErrorMessage('All fields are mandatory: Mobile Number, Full Name, and Delivery Area / Society in Wagholi.');
      return;
    }
    setErrorMessage('');
    loginCustomer(loginPhone.trim(), loginName.trim(), loginAddress.trim());
  };

  // DO NOT ALLOW ANY CUSTOMER ACCESS TO CHECKOUT WITHOUT LOGIN
  if (!currentUser) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
        <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden my-8 p-6 sm:p-8">
          <button
            onClick={handleClose}
            aria-label="Close dialog"
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
              <Lock className="w-7 h-7 text-amber-600" />
            </div>
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              Customer Sign In Required
            </span>
            <h2 className="text-2xl font-black font-display text-neutral-900 mt-2">
              Sign In to Access Checkout
            </h2>
            <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
              Please sign in with your mobile number to confirm your Wagholi delivery address, GST invoice, and ₹1,000 advance UPI booking.
            </p>
          </div>

          {cart.length > 0 && (
            <div className="mb-4 p-3 bg-amber-50/80 border border-amber-200 rounded-xl flex items-center justify-between text-xs">
              <span className="font-semibold text-neutral-800">
                Cart Items ({cart.length}):
              </span>
              <span className="font-mono font-bold text-amber-900">
                ₹{cartTotal.toLocaleString('en-IN')}
              </span>
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleInlineLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Mobile Number (For Delivery Confirmation) *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                <input
                  type="tel"
                  required
                  value={loginPhone}
                  onChange={(e) => {
                    setLoginPhone(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="e.g. 98220 12345"
                  className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-hidden focus:border-amber-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  required
                  value={loginName}
                  onChange={(e) => {
                    setLoginName(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="e.g. Rahul Patil"
                  className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-hidden focus:border-amber-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Delivery Area / Society in Wagholi *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  required
                  value={loginAddress}
                  onChange={(e) => {
                    setLoginAddress(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="e.g. Neo City Phase 2, Bakori Road, Wagholi"
                  className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-hidden focus:border-amber-500 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#FFD814] hover:bg-[#F7CA00] text-neutral-950 font-extrabold rounded-xl text-xs uppercase tracking-wider transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-1.5 border border-[#FCD200]"
            >
              <span>Sign In & Continue to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden my-8">
        {/* Close Button */}
        <button
          onClick={handleClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {orderConfirmed ? (
          /* Post-Order Success State */
          <div className="p-8 sm:p-10 text-center space-y-5">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider font-mono bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Order Confirmed · ₹1,000 Advance Received
              </span>
              <h2 className="text-2xl font-black font-display text-neutral-900 mt-2">
                Thank You, {orderConfirmed.customerName}!
              </h2>
              <p className="text-sm text-neutral-600 mt-1 max-w-md mx-auto">
                Your order <strong className="font-mono text-neutral-900 font-bold">{orderConfirmed.orderNumber}</strong> has been received by NEW Bharat Battery, Wagholi.
              </p>
            </div>

            {/* Direct WhatsApp Mobile Notification to Owner */}
            <div className="bg-emerald-50 border-2 border-emerald-500 rounded-2xl p-5 text-left max-w-md mx-auto space-y-3 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                <MessageSquare className="w-5 h-5 text-emerald-600" />
                <span>Instant Mobile Order Notification</span>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Click below to send the full order bill & delivery address directly to the shop owner's mobile on <strong>+91 {ownerPhone}</strong>:
              </p>
              <a
                href={getOrderWhatsAppUrl(orderConfirmed)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl transition-colors shadow-md text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Send Order to Owner WhatsApp ({ownerPhone})</span>
              </a>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-neutral-50 rounded-2xl p-4 text-xs space-y-2 border border-neutral-200 max-w-md mx-auto text-left">
              <div className="flex justify-between text-neutral-600">
                <span>Wagholi Delivery Address:</span>
                <span className="font-semibold text-neutral-800 text-right max-w-xs truncate">
                  {orderConfirmed.address}, {orderConfirmed.area}
                </span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Inverter Point Status:</span>
                <span className="font-semibold text-neutral-800">
                  {orderConfirmed.inverterPointStatus === 'not_done'
                    ? 'Needs Electrician Wiring (+₹600)'
                    : 'Point Already Exists (Free Install)'}
                </span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>UPI Advance Received:</span>
                <span className="font-bold text-emerald-700 font-mono">
                  ₹{orderConfirmed.advanceAmount.toLocaleString('en-IN')} (Ref: {orderConfirmed.upiTransactionRef})
                </span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Balance to Pay on Delivery:</span>
                <span className="font-bold text-amber-700 font-mono">
                  ₹{orderConfirmed.remainingAmount.toLocaleString('en-IN')} (Cash/UPI)
                </span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Delivery Window:</span>
                <span className="font-semibold text-neutral-800">{orderConfirmed.deliverySlot}</span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="py-3 px-8 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-xl transition-colors cursor-pointer text-xs"
            >
              Close & Return to Store
            </button>
          </div>
        ) : (
          /* Checkout Submission Form */
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[88vh] overflow-y-auto">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider">
                <Truck className="w-4 h-4" />
                <span>Doorstep Delivery & Fitment in Wagholi</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-display text-neutral-900 mt-1">
                Wagholi Delivery & UPI Advance Payment
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Pay <strong>₹1,000 in advance via UPI Scanner</strong> to schedule technician dispatch. Pay the remaining balance in Cash on Delivery after installation & testing.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Selected Cart Products & Pricing Summary */}
            <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-neutral-900 border-b border-neutral-200 pb-2">
                <span>Selected Products in Cart ({cart.length} item{cart.length === 1 ? '' : 's'})</span>
                <span className="font-mono text-amber-700 font-extrabold text-sm">
                  Total: ₹{cartTotal.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                {cart.map(item => {
                  const unitPrice = item.withExchange
                    ? item.battery.priceWithExchange
                    : item.battery.priceWithoutExchange;
                  const itemTotal = unitPrice * item.quantity;
                  return (
                    <div
                      key={item.battery.id}
                      className="flex items-center justify-between gap-3 text-xs bg-white p-2.5 rounded-xl border border-neutral-200/70 shadow-2xs"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-neutral-900 truncate">
                          {item.battery.name}
                        </div>
                        <div className="text-[11px] text-neutral-500 flex items-center gap-2 mt-0.5">
                          <span className="font-semibold text-neutral-700">Qty: {item.quantity}</span>
                          <span>•</span>
                          <span className={item.withExchange ? 'text-emerald-700 font-medium' : 'text-neutral-500'}>
                            {item.withExchange ? 'With Old Battery Scrap Rebate' : 'Without Exchange'}
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-mono font-bold text-neutral-900 tabular-nums">
                          ₹{itemTotal.toLocaleString('en-IN')}
                        </div>
                        {item.withExchange && (
                          <div className="text-[10px] text-emerald-700 font-semibold">
                            Rebate Applied
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Customer Contact & Address Form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rohan Sharma"
                    className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-hidden focus:border-amber-500 font-medium"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Mobile Number (For Delivery Call) *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 98220 12345"
                    className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-hidden focus:border-amber-500 font-medium"
                  />
                </div>
              </div>

              {/* Area selector */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Wagholi Area / Locality *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
                  <select
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-hidden focus:border-amber-500 font-medium"
                  >
                    {WAGHOLI_SERVICE_AREAS.map((loc, idx) => (
                      <option key={idx} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Delivery slot */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Preferred Delivery Window
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
                  <select
                    value={deliverySlot}
                    onChange={(e) => setDeliverySlot(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-hidden focus:border-amber-500 font-medium"
                  >
                    <option value="Within 2 Hours (Express Wagholi Delivery)">Within 2 Hours (Express)</option>
                    <option value="Today Afternoon (1:00 PM - 4:00 PM)">Today Afternoon (1 PM - 4 PM)</option>
                    <option value="Today Evening (5:00 PM - 8:30 PM)">Today Evening (5 PM - 8:30 PM)</option>
                    <option value="Tomorrow Morning (9:00 AM - 12:00 PM)">Tomorrow Morning (9 AM - 12 PM)</option>
                  </select>
                </div>
              </div>

              {/* Street Address */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Flat / House No., Society / Building Name & Street in Wagholi *
                </label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Flat 301, Tulip Tower, Ivy Estate, Pune-Nagar Road"
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-hidden focus:border-amber-500 font-medium"
                />
              </div>

              {/* Landmark */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Nearby Landmark (e.g. Near Sangrilla Hotel / BJS College)
                </label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Opposite Sangrilla Hotel / Near Honda Showroom"
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-hidden focus:border-amber-500 font-medium"
                />
              </div>
            </div>

            {/* USER REQUIREMENT 4: Inverter Point & Electrician Charges Selection */}
            {hasInverterProduct && (
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-2.5 text-xs">
                <div className="flex items-center gap-2 font-bold text-amber-950">
                  <Zap className="w-4 h-4 text-amber-600" />
                  <span>Inverter Point & Electrical Installation:</span>
                </div>
                <div className="space-y-2">
                  <label className="flex items-start gap-2.5 p-2 bg-white rounded-xl border border-neutral-200 cursor-pointer hover:border-amber-400 transition-colors">
                    <input
                      type="radio"
                      name="checkout-inverter-pt"
                      checked={!isAnyInverterPointNotDone}
                      onChange={() => handleGlobalInverterPointChange('already_exists')}
                      className="mt-0.5 text-amber-600 focus:ring-amber-500"
                    />
                    <div>
                      <div className="font-bold text-neutral-900">
                        Inverter point already exists (Standard installation included — FREE)
                      </div>
                      <div className="text-[11px] text-neutral-500 mt-0.5">
                        Our technician will connect your new inverter & battery into your pre-existing AC socket & DB point at zero extra fee.
                      </div>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 p-2 bg-white rounded-xl border border-neutral-200 cursor-pointer hover:border-amber-400 transition-colors">
                    <input
                      type="radio"
                      name="checkout-inverter-pt"
                      checked={isAnyInverterPointNotDone}
                      onChange={() => handleGlobalInverterPointChange('not_done')}
                      className="mt-0.5 text-amber-600 focus:ring-amber-500"
                    />
                    <div>
                      <div className="font-bold text-amber-950 flex items-center gap-2">
                        <span>Inverter point is NOT done (Needs electrician charges for inverter point)</span>
                        <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-mono font-bold text-[11px]">
                          +₹600
                        </span>
                      </div>
                      <div className="text-[11px] text-neutral-600 mt-0.5">
                        Includes certified electrician visit, heavy electrical copper wiring from main board/MCB, 16A modular socket, and proper earth connection.
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* USER REQUIREMENT 3: ₹1,000 Advance UPI QR Scanner directly to 8329838314@ybl */}
            <div className="pt-3 border-t border-neutral-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-emerald-600" />
                    <span>Scan & Pay ₹1,000 Advance via UPI</span>
                  </h3>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Scan with any UPI app (GPay, PhonePe, Paytm, BHIM) to confirm technician dispatch.
                  </p>
                </div>
                <span className="text-xs font-mono font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  Fixed Advance: ₹1,000
                </span>
              </div>

              {/* UPI Box with REAL Scannable QR Code of ₹1,000 directly to 8329838314@ybl */}
              <div className="bg-neutral-50 border border-neutral-300/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-5">
                {/* Genuine Scannable QR Code */}
                <div className="bg-white p-3 rounded-2xl border border-neutral-200 shadow-sm flex flex-col items-center shrink-0">
                  <div className="w-36 h-36 bg-white rounded-xl p-1 flex items-center justify-center relative group border border-neutral-200">
                    {qrCodeDataUrl ? (
                      <img
                        src={qrCodeDataUrl}
                        alt={`UPI QR for ₹1,000 to ${ownerUpiId}`}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-50 rounded-lg text-neutral-400">
                        <QrCode className="w-8 h-8 animate-pulse text-amber-500" />
                        <span className="text-[10px] mt-1 font-mono">Generating ₹1,000 QR...</span>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-neutral-800 mt-1.5 uppercase tracking-wider">
                    ₹1,000 UPI Scanner
                  </span>
                  <div className="flex gap-1.5 text-[9px] font-semibold text-neutral-500 mt-0.5">
                    <span>GPay</span> · <span>PhonePe</span> · <span>Paytm</span>
                  </div>

                  {/* Direct Mobile Pay Link */}
                  <a
                    href={upiIntentUri}
                    className="mt-2 text-[10px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded-md border border-emerald-200 flex items-center gap-1 transition-colors"
                  >
                    <Smartphone className="w-3 h-3" />
                    <span>Tap to Pay on Mobile</span>
                  </a>
                </div>

                {/* UPI Details & Copy */}
                <div className="flex-1 space-y-3 w-full text-xs">
                  <div>
                    <span className="text-neutral-500 text-[11px] block">Shop Beneficiary UPI ID (Pay ₹1,000):</span>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="bg-white border border-neutral-300 px-3 py-1.5 rounded-lg font-mono font-bold text-neutral-900 text-sm flex-1 text-emerald-800">
                        {ownerUpiId}
                      </code>
                      <button
                        type="button"
                        onClick={handleCopyUpi}
                        className="py-2 px-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                      >
                        {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedUpi ? 'Copied!' : 'Copy UPI'}</span>
                      </button>
                    </div>
                    <span className="text-[10px] text-neutral-500 mt-1 block">
                      Beneficiary: <strong>NEW Bharat Battery Wagholi (8329838314)</strong>
                    </span>
                  </div>

                  {/* UTR Input */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-800 mb-1">
                      Enter 12-digit UPI Transaction ID / UTR Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={upiRef}
                      onChange={(e) => setUpiRef(e.target.value)}
                      placeholder="e.g. 426811223344 or UPI Ref No."
                      className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl text-xs font-mono font-bold text-neutral-900 focus:outline-hidden focus:border-emerald-600"
                    />
                    <span className="text-[10px] text-neutral-500 mt-0.5 block">
                      Found in your Google Pay, PhonePe, or Paytm receipt after transferring ₹1,000.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Summary Breakdown */}
            <div className="pt-3 border-t border-neutral-200 bg-neutral-50 p-4 rounded-2xl space-y-1.5 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Products Total:</span>
                <span className="font-mono tabular-nums font-bold">₹{cartProductsTotal.toLocaleString('en-IN')}</span>
              </div>
              {cartElectricianFee > 0 && (
                <div className="flex justify-between text-amber-800 font-bold">
                  <span>Inverter Point Electrician Wiring Charges:</span>
                  <span className="font-mono tabular-nums">+₹{cartElectricianFee.toLocaleString('en-IN')}</span>
                </div>
              )}
              {cartSavings > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Old Scrap Battery Return Rebate:</span>
                  <span className="font-mono tabular-nums">-₹{cartSavings.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Advance Paid Now (UPI to {ownerUpiId}):</span>
                <span className="font-mono tabular-nums">-₹{advanceAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Wagholi Doorstep Fitting & Testing:</span>
                <span className="font-bold text-emerald-700 uppercase text-[10px]">FREE</span>
              </div>
              <div className="pt-2 border-t border-neutral-200 flex justify-between text-sm font-black text-neutral-900">
                <span>Balance to Pay on Delivery:</span>
                <span className="font-mono text-base text-amber-700 font-bold tabular-nums">
                  ₹{remainingAmount.toLocaleString('en-IN')} (Cash/UPI at doorstep)
                </span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex items-center justify-between gap-4">
              <span className="text-[11px] text-neutral-500">
                Technician will bring tax invoice & manufacturer warranty card.
              </span>

              <button
                type="submit"
                className="py-3.5 px-6 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-extrabold rounded-xl transition-colors shadow-md shadow-amber-500/20 cursor-pointer text-xs uppercase tracking-wider shrink-0 flex items-center gap-1.5"
              >
                <span>Confirm Order & Send Alert</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
