import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { BatteryVisual } from './BatteryVisual';
import { X, ShieldCheck, Truck, Wrench, CheckCircle, ArrowRight, Zap, RefreshCw } from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const { selectedProductForDetail, setSelectedProductForDetail, addToCart, setIsCartOpen } = useStore();
  const [withExchange, setWithExchange] = useState(true);
  const [oldBrand, setOldBrand] = useState('Exide');

  if (!selectedProductForDetail) return null;

  const battery = selectedProductForDetail;
  const currentPrice = withExchange ? battery.priceWithExchange : battery.priceWithoutExchange;

  const handleAddToCart = () => {
    addToCart(battery, withExchange, withExchange ? oldBrand : undefined);
    setSelectedProductForDetail(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden my-8">
        {/* Close Button */}
        <button
          onClick={() => setSelectedProductForDetail(null)}
          aria-label="Close dialog"
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[90vh] overflow-y-auto">
          {/* Left Column: Visual & Brand Focus */}
          <div className="md:col-span-6 bg-neutral-100/90 p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-neutral-200">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                <span>Authorized Wagholi Inventory</span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-700 font-bold">100% Genuine</span>
              </div>

              <h2 className="text-2xl font-black font-display text-neutral-900 leading-tight">
                {battery.name}
              </h2>

              <p className="mt-1 text-sm font-semibold text-amber-700">
                {battery.brand} · {battery.category === 'inverter-machine' ? 'HOME UPS & INVERTER' : `${battery.category.toUpperCase()} BATTERY`}
              </p>
            </div>

            {/* Main Visual */}
            <div className="my-6 py-4">
              <BatteryVisual
                brand={battery.brand}
                category={battery.category}
                name={battery.name}
                capacityAh={battery.capacityAh}
                voltage={battery.voltage}
                imageUrl={battery.imageUrl}
                size="lg"
              />
            </div>

            {/* Quick trust strip */}
            <div className="bg-white/80 rounded-xl p-3 border border-neutral-200/80 space-y-2 text-xs text-neutral-700">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Free delivery in Wagholi & Pune East within 2 hours</span>
              </div>
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Free doorstep {battery.category === 'inverter-machine' ? 'wiring setup & testing' : 'fitment with terminal cleaning'}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{battery.warrantyType}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Scrap Exchange Selection Box */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-800 flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
                    <span>{battery.category === 'inverter-machine' ? 'Old Inverter / Scrap Exchange' : 'Old Battery Scrap Exchange'}</span>
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    Save ₹{battery.exchangeDiscount.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setWithExchange(true)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      withExchange
                        ? 'border-amber-500 bg-amber-50/70 text-neutral-900 font-semibold ring-2 ring-amber-500/20'
                        : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
                    }`}
                  >
                    <div className="font-bold">{battery.category === 'inverter-machine' ? 'With Old Inverter' : 'With Old Battery'}</div>
                    <div className="text-[11px] text-neutral-500 mt-0.5">Technician takes scrap</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setWithExchange(false)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      !withExchange
                        ? 'border-amber-500 bg-amber-50/70 text-neutral-900 font-semibold ring-2 ring-amber-500/20'
                        : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
                    }`}
                  >
                    <div className="font-bold">Without Exchange</div>
                    <div className="text-[11px] text-neutral-500 mt-0.5">Fresh purchase only</div>
                  </button>
                </div>

                {withExchange && (
                  <div className="mt-3 pt-3 border-t border-neutral-200">
                    <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                      Select Old {battery.category === 'inverter-machine' ? 'Inverter' : 'Battery'} Brand for Rebate:
                    </label>
                    <select
                      value={oldBrand}
                      onChange={(e) => setOldBrand(e.target.value)}
                      className="w-full bg-white border border-neutral-200 rounded-lg px-3 py-1.5 text-xs text-neutral-800"
                    >
                      <option value="Luminous">Luminous (Any Model)</option>
                      <option value="Microtek">Microtek (Any Model)</option>
                      <option value="Livfast">Livfast (Any Model)</option>
                      <option value="Exide">Exide (Any Model)</option>
                      <option value="Amaron">Amaron (Any Model)</option>
                      <option value="Power Zone">Power Zone (Any Model)</option>
                      <option value="Other">Other Indian / Local Brand</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Technical Specifications Matrix */}
              <div className="mt-5 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Engineering Specifications
                </h4>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {battery.category === 'inverter-machine' ? (
                    <>
                      <div className="bg-neutral-100/70 p-2.5 rounded-lg">
                        <span className="text-neutral-500 block text-[10px]">VA Rating</span>
                        <span className="font-bold font-mono text-neutral-900">{battery.vaRating || 900} VA</span>
                      </div>
                      <div className="bg-neutral-100/70 p-2.5 rounded-lg">
                        <span className="text-neutral-500 block text-[10px]">Peak Load Capacity</span>
                        <span className="font-bold font-mono text-neutral-900">{battery.outputWatts || 756} Watts</span>
                      </div>
                    </>
                  ) : (
                    <div className="bg-neutral-100/70 p-2.5 rounded-lg">
                      <span className="text-neutral-500 block text-[10px]">Rated Capacity</span>
                      <span className="font-bold font-mono text-neutral-900">{battery.capacityAh} Ah</span>
                    </div>
                  )}
                  <div className="bg-neutral-100/70 p-2.5 rounded-lg">
                    <span className="text-neutral-500 block text-[10px]">System Voltage</span>
                    <span className="font-bold font-mono text-neutral-900">{battery.voltage} Volts</span>
                  </div>
                  <div className="bg-neutral-100/70 p-2.5 rounded-lg">
                    <span className="text-neutral-500 block text-[10px]">Technology Profile</span>
                    <span className="font-bold text-neutral-900 truncate block">{battery.technology}</span>
                  </div>
                  <div className="bg-neutral-100/70 p-2.5 rounded-lg">
                    <span className="text-neutral-500 block text-[10px]">Warranty Coverage</span>
                    <span className="font-bold font-mono text-neutral-900">{battery.warrantyMonths} Months</span>
                  </div>
                  {battery.dimensions && (
                    <div className="bg-neutral-100/70 p-2.5 rounded-lg col-span-2">
                      <span className="text-neutral-500 block text-[10px]">Dimensions</span>
                      <span className="font-semibold font-mono text-neutral-900">{battery.dimensions}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Recommended Application / Fits */}
              <div className="mt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                  Recommended For
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {battery.recommendedFor.map((app, idx) => (
                    <span key={idx} className="bg-neutral-100 text-neutral-800 text-[11px] font-medium px-2 py-0.5 rounded-md border border-neutral-200">
                      {app}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bullet Features */}
              <div className="mt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                  Key Advantages
                </h4>
                <ul className="space-y-1 text-xs text-neutral-600">
                  {battery.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Contiguous Action Bar */}
            <div className="mt-6 pt-4 border-t border-neutral-200">
              <div className="flex items-baseline justify-between mb-3">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black font-mono text-neutral-900 tabular-nums">
                      ₹{currentPrice.toLocaleString('en-IN')}
                    </span>
                    {withExchange && (
                      <span className="text-sm text-neutral-400 line-through font-mono tabular-nums">
                        ₹{battery.priceWithoutExchange.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-neutral-500 block">
                    Inclusive of all taxes & free Wagholi installation
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                    Ready for Delivery
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedProductForDetail(null)}
                  className="py-3 px-4 text-xs font-bold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors cursor-pointer text-center"
                >
                  Continue Browsing
                </button>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="py-3 px-4 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-xl transition-colors shadow-md shadow-amber-500/20 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Order Now (Add to Cart)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
