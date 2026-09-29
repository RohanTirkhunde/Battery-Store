import React from 'react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, RefreshCw, ShoppingBag, Zap, ExternalLink, Lock } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { currentUser } = useAuth();
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    toggleExchange,
    toggleInverterPointStatus,
    cartTotal,
    cartElectricianFee,
    cartSavings,
    setIsCheckoutOpen,
    setIsAuthModalOpen,
    setActiveView,
    showToast
  } = useStore();

  const handleProceedToBuy = () => {
    setIsCartOpen(false);
    if (!currentUser) {
      showToast('Please sign in with your mobile number to proceed to checkout');
      setIsAuthModalOpen(true);
      return;
    }
    setIsCheckoutOpen(true);
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-600" />
              <h2 className="text-base font-bold font-display text-neutral-900">Your Cart</h2>
              <span className="text-xs font-mono bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full">
                {cart.length} item{cart.length === 1 ? '' : 's'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setActiveView('cart');
                }}
                className="text-xs text-[#007185] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                title="Open Full Cart View"
              >
                <span>Full Cart</span>
                <ExternalLink className="w-3 h-3" />
              </button>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-400">
                <ShoppingBag className="w-12 h-12 stroke-1 mb-3 text-neutral-300" />
                <p className="text-sm font-semibold text-neutral-700">Your cart is currently empty</p>
                <p className="text-xs text-neutral-400 mt-1 max-w-xs">
                  Browse our genuine inverters and automotive batteries from Luminous, Microtek, Livfast, Exide, Amaron & Power Zone.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-4 px-4 py-2 bg-neutral-900 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const itemPrice = item.withExchange
                  ? item.battery.priceWithExchange
                  : item.battery.priceWithoutExchange;
                const isInverterProduct =
                  item.battery.category === 'inverter-machine' ||
                  item.battery.category === 'inverter' ||
                  item.battery.isCombo;

                return (
                  <div
                    key={`${item.battery.id}-${item.withExchange}`}
                    className="bg-neutral-50 border border-neutral-200/80 rounded-xl p-3.5 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-700 uppercase">
                          <span>{item.battery.brand}</span>
                          <span aria-hidden="true" className="text-neutral-300">·</span>
                          <span className="text-neutral-500 font-mono">
                            {item.battery.category === 'inverter-machine'
                              ? (item.battery.vaRating ? `${item.battery.vaRating} VA` : `${item.battery.capacityAh || 900} VA`)
                              : `${item.battery.capacityAh} Ah`}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-neutral-900 leading-snug">
                          {item.battery.name}
                        </h4>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.battery.id)}
                        className="text-neutral-400 hover:text-red-600 p-1 cursor-pointer transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Old Battery / Inverter Exchange Toggle */}
                    <div className="bg-white rounded-lg p-2 border border-neutral-200 text-xs">
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={item.withExchange}
                            onChange={(e) => toggleExchange(item.battery.id, e.target.checked)}
                            className="rounded border-neutral-300 text-amber-600 focus:ring-amber-500"
                          />
                          <span className="font-semibold text-neutral-800 text-[11px]">
                            {item.battery.category === 'inverter-machine' ? 'With Old Inverter Scrap' : 'With Old Battery Return'}
                          </span>
                        </label>
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                          Save ₹{item.battery.exchangeDiscount.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Inverter Point Selection */}
                    {isInverterProduct && (
                      <div className="bg-amber-50/80 rounded-lg p-2 border border-amber-200/80 text-[11px]">
                        <div className="font-bold text-amber-900 flex items-center gap-1 mb-1">
                          <Zap className="w-3 h-3 text-amber-600" />
                          <span>Inverter Point Status:</span>
                        </div>
                        <div className="space-y-1">
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="radio"
                              name={`drawer-pt-${item.battery.id}`}
                              checked={item.inverterPointStatus === 'already_exists'}
                              onChange={() => toggleInverterPointStatus(item.battery.id, 'already_exists')}
                              className="text-amber-600 focus:ring-amber-500 text-xs"
                            />
                            <span className={item.inverterPointStatus === 'already_exists' ? 'font-bold text-neutral-900' : 'text-neutral-600'}>
                              Point already exists (Free installment)
                            </span>
                          </label>
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="radio"
                              name={`drawer-pt-${item.battery.id}`}
                              checked={item.inverterPointStatus === 'not_done'}
                              onChange={() => toggleInverterPointStatus(item.battery.id, 'not_done')}
                              className="text-amber-600 focus:ring-amber-500 text-xs"
                            />
                            <span className={item.inverterPointStatus === 'not_done' ? 'font-bold text-neutral-900' : 'text-neutral-600'}>
                              Point not done (Electrician: +₹600)
                            </span>
                          </label>
                        </div>
                      </div>
                    )}

                    {/* Quantity & Item Subtotal */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center border border-neutral-300 rounded-lg bg-white">
                        <button
                          onClick={() => updateCartQuantity(item.battery.id, item.quantity - 1)}
                          className="p-1 text-neutral-600 hover:text-neutral-900 cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-mono font-bold text-neutral-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.battery.id, item.quantity + 1)}
                          className="p-1 text-neutral-600 hover:text-neutral-900 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-black font-mono text-neutral-900 tabular-nums">
                          ₹{((itemPrice + (item.inverterPointStatus === 'not_done' ? 600 : 0)) * item.quantity).toLocaleString('en-IN')}
                        </span>
                        {item.withExchange && (
                          <span className="text-[10px] text-neutral-400 line-through block font-mono">
                            ₹{(item.battery.priceWithoutExchange * item.quantity).toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout Trigger */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-neutral-200 bg-neutral-50 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums">₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                {cartSavings > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span className="flex items-center gap-1">
                      <RefreshCw className="w-3 h-3" />
                      Old Battery Scrap Rebate
                    </span>
                    <span className="font-mono tabular-nums">-₹{cartSavings.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {cartElectricianFee > 0 && (
                  <div className="flex justify-between text-amber-800 font-medium">
                    <span>Inverter Point Electrician Wiring</span>
                    <span className="font-mono tabular-nums">+₹{cartElectricianFee.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-600">
                  <span>Wagholi Doorstep Delivery</span>
                  <span className="text-emerald-700 font-bold uppercase text-[10px]">FREE</span>
                </div>
                <div className="pt-2 border-t border-neutral-200 flex justify-between text-base font-extrabold text-neutral-900">
                  <span>Total Amount</span>
                  <span className="font-mono text-lg text-neutral-900 tabular-nums">
                    ₹{cartTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCartOpen(false);
                    setActiveView('cart');
                  }}
                  className="py-3 px-3 bg-white hover:bg-neutral-100 text-neutral-800 font-bold rounded-xl transition-colors border border-neutral-300 text-xs text-center cursor-pointer shadow-2xs"
                >
                  View Full Cart
                </button>
                <button
                  type="button"
                  onClick={handleProceedToBuy}
                  className="py-3 px-3 bg-[#FFD814] hover:bg-[#F7CA00] text-neutral-950 font-extrabold rounded-xl transition-colors border border-[#FCD200] shadow-sm flex items-center justify-center gap-1.5 cursor-pointer text-xs"
                >
                  {currentUser ? (
                    <>
                      <span>Proceed to Buy</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5 text-neutral-900" />
                      <span>Sign In to Buy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-[11px] text-center text-neutral-500 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>₹1,000 UPI advance to 8329838314@ybl · Balance on delivery</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

