import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { BatteryBrand, BatteryCategory, BatteryModel } from '../types';
import { BatteryVisual } from './BatteryVisual';
import { RefreshCw, ArrowRight, CheckCircle2, ShieldCheck, Truck, Zap, AlertCircle, Sparkles } from 'lucide-react';

export const BatteryReplacementSection: React.FC = () => {
  const { batteries, addToCart, setIsCartOpen, setSelectedProductForDetail } = useStore();

  const [oldType, setOldType] = useState<BatteryCategory>('inverter');
  const [oldCapacity, setOldCapacity] = useState('150Ah');
  const [oldBrand, setOldBrand] = useState('Exide');
  const [oldCondition, setOldCondition] = useState('Dead / Zero Backup');

  // Calculate estimated scrap exchange value
  const getEstimatedScrapValue = () => {
    if (oldType === 'inverter') {
      if (oldCapacity.includes('220')) return 3700;
      if (oldCapacity.includes('200')) return 3400;
      if (oldCapacity.includes('150')) return 2600;
      if (oldCapacity.includes('135')) return 2400;
      return 2000;
    }
    if (oldType === 'car') {
      if (oldCapacity.includes('65')) return 1500;
      if (oldCapacity.includes('45')) return 1150;
      if (oldCapacity.includes('35')) return 950;
      return 1000;
    }
    if (oldType === 'commercial') {
      return 1750;
    }
    // two-wheeler
    return 240;
  };

  const estimatedScrap = getEstimatedScrapValue();

  // Find recommended replacement batteries
  const recommendedReplacements = batteries.filter(b => b.category === oldType).slice(0, 3);

  const handleSelectReplacement = (battery: BatteryModel) => {
    addToCart(battery, true, `${oldBrand} (${oldCapacity})`);
  };

  return (
    <section id="replacement-section" className="py-14 bg-gradient-to-b from-neutral-900 via-neutral-900 to-neutral-950 text-white border-t border-neutral-800 relative overflow-hidden">
      {/* Background illumination */}
      <div className="absolute top-1/3 -left-32 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-xs font-semibold text-emerald-400 mb-3">
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400 animate-spin-slow" />
            <span>Old Battery Replacement & Doorstep Scrap Buyback</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-display tracking-tight text-white">
            Replace Your Old Battery — Get Instant Scrap Cash Discount
          </h2>

          <p className="mt-2 text-sm text-neutral-300 leading-relaxed">
            Have a dead inverter battery, weak car battery, or swollen motorcycle battery? Don't let it sit idle. New Bharat Battery picks up your old scrap battery from your doorstep in Wagholi and installs a brand-new factory-fresh battery with maximum scrap rebate.
          </p>
        </div>

        {/* 2-Column Module: Estimator Left, Upgraded Replacements Right */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Step 1: Interactive Old Battery Valuation Calculator */}
          <div className="lg:col-span-5 bg-neutral-800/90 border border-neutral-700/80 rounded-3xl p-6 sm:p-7 shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-700">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
                Step 1: Your Existing Old Battery
              </span>
              <span className="text-[11px] text-neutral-400">Guaranteed Wagholi Value</span>
            </div>

            <div className="mt-5 space-y-4">
              {/* Battery Category */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  1. What type of old battery do you have?
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'inverter', label: 'Inverter Battery' },
                    { id: 'car', label: 'Car Battery' },
                    { id: 'two-wheeler', label: 'Bike Battery' },
                    { id: 'commercial', label: 'SUV / Commercial' }
                  ].map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setOldType(cat.id as BatteryCategory);
                        if (cat.id === 'inverter') setOldCapacity('150Ah');
                        else if (cat.id === 'car') setOldCapacity('35Ah');
                        else if (cat.id === 'two-wheeler') setOldCapacity('5Ah');
                        else setOldCapacity('65Ah');
                      }}
                      className={`p-2.5 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                        oldType === cat.id
                          ? 'border-emerald-500 bg-emerald-950/40 text-emerald-400 shadow-sm'
                          : 'border-neutral-700 bg-neutral-900/60 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Approximate Capacity */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  2. Approximate Old Capacity (Ah):
                </label>
                <select
                  value={oldCapacity}
                  onChange={(e) => setOldCapacity(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-emerald-500 font-mono font-medium"
                >
                  {oldType === 'inverter' && (
                    <>
                      <option value="150Ah">150 Ah (Most Common Tall Tubular)</option>
                      <option value="200Ah">200 Ah (Heavy Tubular)</option>
                      <option value="220Ah">220 Ah (Jumbo Capacity)</option>
                      <option value="135Ah">135 Ah / 100 Ah</option>
                    </>
                  )}
                  {oldType === 'car' && (
                    <>
                      <option value="35Ah">35 Ah (Alto, Swift, WagonR, i10)</option>
                      <option value="45Ah">45 Ah (Creta, City, Baleno, Verna)</option>
                      <option value="65Ah">65 Ah (Innova, Scorpio, Harrier)</option>
                    </>
                  )}
                  {oldType === 'two-wheeler' && (
                    <>
                      <option value="5Ah">5 Ah (Activa, Jupiter, Splendor)</option>
                      <option value="3Ah">3 Ah / 4 Ah (Kick start bike)</option>
                    </>
                  )}
                  {oldType === 'commercial' && (
                    <>
                      <option value="65Ah">65 Ah / 80 Ah Pickup / Commercial</option>
                      <option value="88Ah">88 Ah / 100 Ah Heavy Commercial</option>
                    </>
                  )}
                </select>
              </div>

              {/* Old Brand */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  3. Old Battery Brand (Any brand accepted):
                </label>
                <select
                  value={oldBrand}
                  onChange={(e) => setOldBrand(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-emerald-500 font-medium"
                >
                  <option value="Exide">Exide</option>
                  <option value="Amaron">Amaron</option>
                  <option value="Livfast">Livfast</option>
                  <option value="Luminous">Luminous</option>
                  <option value="Microtek">Microtek</option>
                  <option value="Power Zone">Power Zone</option>
                  <option value="SF Sonic">SF Sonic</option>
                  <option value="Tata Green">Tata Green</option>
                  <option value="Other / Local">Any Other Indian Brand</option>
                </select>
              </div>

              {/* Condition */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  4. Current Condition of Old Battery:
                </label>
                <select
                  value={oldCondition}
                  onChange={(e) => setOldCondition(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-emerald-500 font-medium"
                >
                  <option value="Dead / Zero Backup">Dead / Zero Backup (Normal scrap)</option>
                  <option value="Swollen / Bulged">Swollen / Bulged Casing</option>
                  <option value="Terminal Broken / Leaking">Acid Leaking / Terminal Broken</option>
                  <option value="Working but Low Backup">Working but Weak Discharge</option>
                </select>
              </div>
            </div>

            {/* Calculated Scrap Rebate Card */}
            <div className="mt-6 pt-4 border-t border-neutral-700/80 bg-neutral-900/90 rounded-2xl p-4 border border-emerald-900/50">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400">Guaranteed Scrap Rebate:</span>
                <span className="text-2xl font-black font-mono text-emerald-400 tabular-nums">
                  ₹{estimatedScrap.toLocaleString('en-IN')}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
                ✓ Deducted directly from your new battery price. Technician will collect the scrap at your doorstep in Wagholi.
              </p>
            </div>
          </div>

          {/* Step 2: Matching Brand New Replacements */}
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">
                  Step 2: Choose Upgraded New Battery
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  Factory-Fresh Replacements Available in Wagholi
                </h3>
              </div>
              <span className="text-xs text-neutral-400 hidden sm:inline">
                100% Manufacturer Warranty
              </span>
            </div>

            <div className="space-y-4">
              {recommendedReplacements.map((b) => {
                const finalExchangePrice = b.priceWithExchange;
                const savings = b.exchangeDiscount;

                return (
                  <div
                    key={b.id}
                    className="bg-neutral-800/90 border border-neutral-700/90 hover:border-emerald-500/80 rounded-2xl p-4 sm:p-5 transition-all shadow-md group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      {/* Mini Visual */}
                      <div className="w-20 h-20 bg-neutral-900 rounded-xl flex items-center justify-center p-2 shrink-0 border border-neutral-700">
                        <BatteryVisual
                          brand={b.brand}
                          category={b.category}
                          name={b.name}
                          capacityAh={b.capacityAh}
                          size="sm"
                          className="h-16"
                        />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                            b.brand === 'Exide' ? 'bg-red-500 text-white' :
                            b.brand === 'Amaron' ? 'bg-emerald-500 text-neutral-950' :
                            b.brand === 'Luminous' ? 'bg-blue-600 text-white' :
                            b.brand === 'Microtek' ? 'bg-amber-600 text-white' :
                            'bg-orange-600 text-white'
                          }`}>
                            {b.brand}
                          </span>
                          <span className="text-xs text-neutral-400 font-mono">
                            {b.capacityAh} Ah · {b.warrantyMonths}m Warranty
                          </span>
                        </div>

                        <h4
                          onClick={() => setSelectedProductForDetail(b)}
                          className="text-base font-bold text-white mt-1 group-hover:text-emerald-400 transition-colors cursor-pointer"
                        >
                          {b.name}
                        </h4>

                        <p className="text-xs text-neutral-400 mt-0.5 line-clamp-1">
                          Technology: {b.technology} · Free Wagholi fitment
                        </p>
                      </div>
                    </div>

                    {/* Price and Replacement Trigger */}
                    <div className="flex items-center sm:flex-col items-end justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-700">
                      <div className="sm:text-right">
                        <span className="text-[11px] text-neutral-400 block">Replacement Price:</span>
                        <div className="text-xl font-black font-mono text-emerald-400 tabular-nums">
                          ₹{finalExchangePrice.toLocaleString('en-IN')}
                        </div>
                        <span className="text-[10px] text-neutral-500 line-through tabular-nums">
                          ₹{b.priceWithoutExchange.toLocaleString('en-IN')} (Saved ₹{savings})
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSelectReplacement(b)}
                        className="mt-2 py-2 px-4 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black rounded-xl text-xs transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
                      >
                        <Zap className="w-3.5 h-3.5 fill-current" />
                        <span>Replace with This</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Replacement Guarantee Box */}
            <div className="mt-5 bg-neutral-800/50 border border-neutral-700/60 rounded-2xl p-4 flex items-center justify-between text-xs text-neutral-300">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Technician brings the new battery & takes away the old scrap simultaneously</span>
              </div>
              <span className="font-bold text-amber-400 uppercase text-[10px] bg-amber-950/60 px-2 py-1 rounded border border-amber-800">
                Zero Hassle
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
