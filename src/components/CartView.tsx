import React from 'react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { BatteryVisual } from './BatteryVisual';
import {
  CheckCircle2,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  Wrench,
  Zap,
  RefreshCw,
  ShoppingBag,
  ArrowLeft,
  Info,
  Check,
  Share2,
  Bookmark,
  Lock
} from 'lucide-react';

export const CartView: React.FC = () => {
  const { currentUser } = useAuth();
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    toggleExchange,
    toggleInverterPointStatus,
    cartTotal,
    cartProductsTotal,
    cartElectricianFee,
    cartSavings,
    cartItemCount,
    setIsCheckoutOpen,
    setIsAuthModalOpen,
    setActiveView,
    setSelectedProductForDetail,
    showToast,
    ownerPhone,
    ownerUpiId
  } = useStore();

  const handleProceedToCheckout = () => {
    if (!currentUser) {
      showToast('Please sign in with your mobile number to proceed to checkout');
      setIsAuthModalOpen(true);
      return;
    }
    setIsCheckoutOpen(true);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#EAEDED] py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm border border-neutral-300 p-8 sm:p-12 text-center max-w-3xl mx-auto">
            <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-200">
              <ShoppingBag className="w-12 h-12 text-amber-500" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 font-display">
              Your Shopping Cart is empty
            </h2>
            <p className="mt-2 text-sm text-neutral-600 max-w-md mx-auto">
              Your shopping cart is waiting. Explore genuine inverters, tubular batteries, and automotive batteries with free Wagholi doorstep delivery.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setActiveView('store')}
                className="w-full sm:w-auto px-8 py-3 bg-[#FFD814] hover:bg-[#F7CA00] text-neutral-950 font-bold rounded-full shadow-sm transition-colors text-sm cursor-pointer border border-[#FCD200]"
              >
                Continue Shopping
              </button>
              <a
                href={`tel:+91${ownerPhone}`}
                className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-neutral-50 text-neutral-800 font-semibold rounded-full shadow-sm transition-colors text-sm cursor-pointer border border-neutral-300"
              >
                Call Shop: +91 {ownerPhone}
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EAEDED] py-6 sm:py-8 text-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <div className="mb-4">
          <button
            onClick={() => setActiveView('store')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-700 hover:text-amber-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Inverter & Battery Catalog</span>
          </button>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Left Column: Cart Items */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-neutral-300 p-4 sm:p-6">
              {/* Header strip */}
              <div className="flex items-baseline justify-between border-b border-neutral-200 pb-3">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-neutral-900">
                    Shopping Cart
                  </h1>
                  <span className="text-xs text-[#007185] hover:underline cursor-pointer">
                    Deselect all items
                  </span>
                </div>
                <div className="text-xs text-neutral-500 font-medium hidden sm:block">
                  Price
                </div>
              </div>

              {/* Items List */}
              <div className="divide-y divide-neutral-200">
                {cart.map((item) => {
                  const unitProductPrice = item.withExchange
                    ? item.battery.priceWithExchange
                    : item.battery.priceWithoutExchange;
                  const itemElectricianCharge =
                    item.inverterPointStatus === 'not_done' ? item.electricianCharge || 600 : 0;
                  const itemTotalWithServices = (unitProductPrice + itemElectricianCharge) * item.quantity;
                  const isInverterProduct =
                    item.battery.category === 'inverter-machine' ||
                    item.battery.category === 'inverter' ||
                    item.battery.isCombo;

                  return (
                    <div key={item.battery.id} className="py-5 flex flex-col sm:flex-row gap-4 sm:gap-6">
                      {/* Product Thumbnail visual */}
                      <div
                        onClick={() => setSelectedProductForDetail(item.battery)}
                        className="w-28 h-28 sm:w-36 sm:h-36 shrink-0 bg-neutral-50 rounded-lg p-2 border border-neutral-200 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
                      >
                        <BatteryVisual
                          brand={item.battery.brand}
                          category={item.battery.category}
                          name={item.battery.name}
                          capacityAh={item.battery.capacityAh}
                          voltage={item.battery.voltage}
                          imageUrl={item.battery.imageUrl}
                          size="md"
                        />
                      </div>

                      {/* Product Details & Options */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h2
                                onClick={() => setSelectedProductForDetail(item.battery)}
                                className="text-base sm:text-lg font-medium text-neutral-900 hover:text-[#C7511F] cursor-pointer leading-snug line-clamp-2"
                              >
                                {item.battery.name} — {item.battery.brand} {item.battery.category === 'inverter-machine' ? `${item.battery.vaRating || 900}VA Home UPS` : `${item.battery.capacityAh}Ah`}
                              </h2>
                              <div className="text-xs text-neutral-500 mt-0.5">
                                by <span className="font-semibold text-neutral-700">{item.battery.brand}</span> · Sold by <span className="text-[#007185]">NEW Bharat Battery Wagholi</span>
                              </div>
                            </div>

                            {/* Price on mobile or desktop */}
                            <div className="text-right sm:hidden">
                              <span className="text-lg font-bold font-mono text-neutral-900">
                                ₹{itemTotalWithServices.toLocaleString('en-IN')}
                              </span>
                            </div>
                          </div>

                          {/* In Stock & Free delivery strip */}
                          <div className="mt-1 space-y-0.5">
                            <div className="text-xs font-bold text-[#007600] flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" />
                              <span>In stock · Ready for 2-Hour Wagholi Dispatch</span>
                            </div>
                            <div className="text-xs text-neutral-600">
                              Eligible for <strong>FREE Delivery & Standard Doorstep Fitment</strong> in Wagholi
                            </div>
                          </div>

                          {/* Scrap Exchange selection */}
                          <div className="mt-3 p-2.5 bg-neutral-50 rounded-md border border-neutral-200/90 text-xs">
                            <div className="font-semibold text-neutral-800 flex items-center justify-between mb-1.5">
                              <span className="flex items-center gap-1.5">
                                <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
                                <span>Old Battery Scrap Exchange:</span>
                              </span>
                              {item.withExchange && (
                                <span className="text-emerald-700 font-bold text-[11px] bg-emerald-100 px-1.5 py-0.5 rounded">
                                  ₹{item.battery.exchangeDiscount.toLocaleString('en-IN')} Saved
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <label className="flex items-center gap-1.5 cursor-pointer">
                                <input
                                  type="radio"
                                  name={`exchange-${item.battery.id}`}
                                  checked={item.withExchange}
                                  onChange={() => toggleExchange(item.battery.id, true)}
                                  className="text-amber-600 focus:ring-amber-500"
                                />
                                <span className={item.withExchange ? 'font-bold text-neutral-900' : 'text-neutral-600'}>
                                  With Old Scrap Battery (Rebate: ₹{item.battery.exchangeDiscount.toLocaleString('en-IN')})
                                </span>
                              </label>
                              <label className="flex items-center gap-1.5 cursor-pointer ml-3">
                                <input
                                  type="radio"
                                  name={`exchange-${item.battery.id}`}
                                  checked={!item.withExchange}
                                  onChange={() => toggleExchange(item.battery.id, false)}
                                  className="text-amber-600 focus:ring-amber-500"
                                />
                                <span className={!item.withExchange ? 'font-bold text-neutral-900' : 'text-neutral-600'}>
                                  Without Exchange (New Purchase)
                                </span>
                              </label>
                            </div>
                          </div>

                          {/* USER REQUIREMENT: Inverter Point Wiring / Installation Status */}
                          {isInverterProduct && (
                            <div className="mt-3 p-3 bg-amber-50/60 rounded-md border border-amber-200 text-xs">
                              <div className="font-bold text-neutral-900 flex items-center gap-1.5 mb-2">
                                <Zap className="w-4 h-4 text-amber-600" />
                                <span>Inverter Point & Wiring Status:</span>
                              </div>
                              <div className="space-y-2">
                                <label className="flex items-start gap-2 cursor-pointer p-1.5 rounded hover:bg-white/80 transition-colors">
                                  <input
                                    type="radio"
                                    name={`inverter-point-${item.battery.id}`}
                                    checked={item.inverterPointStatus === 'already_exists'}
                                    onChange={() => toggleInverterPointStatus(item.battery.id, 'already_exists')}
                                    className="mt-0.5 text-amber-600 focus:ring-amber-500"
                                  />
                                  <div>
                                    <div className="font-bold text-neutral-900">
                                      Inverter point already exists (Standard installment/connection included — FREE)
                                    </div>
                                    <div className="text-[11px] text-neutral-500">
                                      Technician will connect the inverter and battery to your existing AC point socket at zero extra charge.
                                    </div>
                                  </div>
                                </label>

                                <label className="flex items-start gap-2 cursor-pointer p-1.5 rounded hover:bg-white/80 transition-colors">
                                  <input
                                    type="radio"
                                    name={`inverter-point-${item.battery.id}`}
                                    checked={item.inverterPointStatus === 'not_done'}
                                    onChange={() => toggleInverterPointStatus(item.battery.id, 'not_done')}
                                    className="mt-0.5 text-amber-600 focus:ring-amber-500"
                                  />
                                  <div>
                                    <div className="font-bold text-amber-950 flex items-center gap-2">
                                      <span>Inverter point is NOT done (Needs electrician charges for inverter point)</span>
                                      <span className="bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded font-mono font-bold text-[11px]">
                                        +₹600
                                      </span>
                                    </div>
                                    <div className="text-[11px] text-neutral-600">
                                      Our certified electrician will bring wire, 16A modular socket board, and connect the inverter line to your main switchboard/MCB.
                                    </div>
                                  </div>
                                </label>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Action Links Row */}
                        <div className="mt-4 flex flex-wrap items-center gap-3 pt-3 border-t border-neutral-100 text-xs text-[#007185]">
                          {/* Quantity Stepper */}
                          <div className="flex items-center border border-neutral-300 rounded-md bg-neutral-50 shadow-2xs">
                            <span className="px-2 text-neutral-500 text-[11px]">Qty:</span>
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(item.battery.id, item.quantity - 1)}
                              className="px-2 py-1 text-neutral-700 hover:bg-neutral-200 transition-colors"
                              title="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 py-1 font-bold text-neutral-900 bg-white font-mono min-w-6 text-center">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(item.battery.id, item.quantity + 1)}
                              className="px-2 py-1 text-neutral-700 hover:bg-neutral-200 transition-colors"
                              title="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="text-neutral-300">|</span>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.battery.id)}
                            className="hover:underline hover:text-[#C7511F] cursor-pointer flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>

                          <span className="text-neutral-300">|</span>

                          {/* Save for later */}
                          <button
                            type="button"
                            onClick={() => alert(`Saved ${item.battery.name} for later`)}
                            className="hover:underline cursor-pointer flex items-center gap-1"
                          >
                            <Bookmark className="w-3.5 h-3.5" />
                            <span>Save for later</span>
                          </button>

                          <span className="text-neutral-300">|</span>

                          {/* View specs */}
                          <button
                            type="button"
                            onClick={() => setSelectedProductForDetail(item.battery)}
                            className="hover:underline cursor-pointer flex items-center gap-1"
                          >
                            <Info className="w-3.5 h-3.5" />
                            <span>Specifications</span>
                          </button>
                        </div>
                      </div>

                      {/* Desktop Price Column */}
                      <div className="hidden sm:block text-right shrink-0">
                        <div className="text-xl font-bold font-mono text-neutral-900 tabular-nums">
                          ₹{itemTotalWithServices.toLocaleString('en-IN')}
                        </div>
                        {item.withExchange && (
                          <div className="text-xs text-neutral-400 line-through font-mono tabular-nums">
                            ₹{(item.battery.priceWithoutExchange * item.quantity).toLocaleString('en-IN')}
                          </div>
                        )}
                        {item.inverterPointStatus === 'not_done' && (
                          <div className="text-[11px] text-amber-700 font-semibold mt-1">
                            Incl. ₹600 electrician wiring
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Subtotal row at bottom of items list */}
              <div className="text-right pt-4 border-t border-neutral-200">
                <span className="text-lg">
                  Subtotal ({cartItemCount} item{cartItemCount === 1 ? '' : 's'}):{' '}
                  <strong className="text-xl font-mono text-neutral-950">
                    ₹{cartTotal.toLocaleString('en-IN')}.00
                  </strong>
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Checkout Card */}
          <div className="lg:col-span-4 sticky top-6 space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-neutral-300 p-5">
              {/* Free delivery banner */}
              <div className="flex items-start gap-2 text-xs text-[#007600] pb-3 border-b border-neutral-200">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[#007600]" />
                <span>
                  Your order qualifies for <strong>FREE Doorstep Delivery & Fitting</strong> anywhere in Wagholi & Pune East.
                </span>
              </div>

              {/* Subtotal & summary */}
              <div className="mt-4 space-y-2">
                <div className="text-lg font-medium text-neutral-900">
                  Subtotal ({cartItemCount} item{cartItemCount === 1 ? '' : 's'}):
                  <div className="text-2xl font-black font-mono text-neutral-950 mt-0.5">
                    ₹{cartTotal.toLocaleString('en-IN')}.00
                  </div>
                </div>

                {/* Itemized summary breakdown */}
                <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-200/80 space-y-1.5 text-xs text-neutral-600 mt-2">
                  <div className="flex justify-between">
                    <span>Products Subtotal:</span>
                    <span className="font-mono text-neutral-900 font-semibold">
                      ₹{cartProductsTotal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {cartSavings > 0 && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Old Scrap Battery Rebate:</span>
                      <span className="font-mono">-₹{cartSavings.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  {cartElectricianFee > 0 && (
                    <div className="flex justify-between text-amber-800 font-medium">
                      <span>Inverter Point Electrician Wiring:</span>
                      <span className="font-mono">+₹{cartElectricianFee.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-[#007600]">
                    <span>Wagholi Delivery & Fitting:</span>
                    <span className="font-bold">FREE (₹0)</span>
                  </div>
                </div>

                {/* Advance payment notice */}
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-950 mt-2">
                  <div className="font-bold flex items-center gap-1.5 text-amber-900 mb-1">
                    <Zap className="w-3.5 h-3.5 text-amber-600" />
                    <span>Advance Payment Requirement:</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-amber-900">
                    A fixed <strong>₹1,000 advance payment</strong> via UPI Scanner to <strong>{ownerUpiId}</strong> is required at checkout to confirm technician dispatch. The remaining balance (<strong>₹{(Math.max(0, cartTotal - 1000)).toLocaleString('en-IN')}</strong>) is payable at doorstep after installation.
                  </p>
                </div>

                {/* Yellow "Proceed to Buy" CTA Button */}
                <button
                  type="button"
                  onClick={handleProceedToCheckout}
                  className="w-full mt-4 py-3 px-4 bg-[#FFD814] hover:bg-[#F7CA00] text-neutral-950 font-bold rounded-full shadow-sm hover:shadow transition-all text-sm cursor-pointer border border-[#FCD200] flex items-center justify-center gap-2"
                >
                  {currentUser ? (
                    <>
                      <span>Proceed to Buy ({cartItemCount} item{cartItemCount === 1 ? '' : 's'})</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-neutral-800" />
                      <span>Sign In to Proceed to Buy</span>
                    </>
                  )}
                </button>
                {!currentUser && (
                  <p className="text-[11px] text-center text-neutral-500 mt-1.5 flex items-center justify-center gap-1">
                    <Lock className="w-3 h-3 text-neutral-400" />
                    <span>Customer login required to access Wagholi checkout</span>
                  </p>
                )}
              </div>

              {/* Trust badges */}
              <div className="mt-5 pt-4 border-t border-neutral-200 space-y-2 text-xs text-neutral-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% Genuine with Official Warranty Card</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Doorstep installation in 2 hours in Wagholi</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-neutral-600 shrink-0" />
                  <span>Expert battery fitment & electrical testing</span>
                </div>
              </div>
            </div>

            {/* Need Help Box */}
            <div className="bg-white rounded-lg shadow-sm border border-neutral-300 p-4 text-xs text-neutral-700">
              <div className="font-bold text-neutral-900 mb-1">Need help choosing the right Inverter?</div>
              <p className="text-neutral-500 mb-2">Speak directly with our Wagholi shop engineer:</p>
              <a
                href={`tel:+91${ownerPhone}`}
                className="inline-flex items-center gap-1.5 font-bold text-[#007185] hover:underline"
              >
                <span>Call +91 {ownerPhone}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
