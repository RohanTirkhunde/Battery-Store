import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { DETAILED_VEHICLE_DATABASE, VehicleMatchItem } from '../data/batteryCatalog';
import { BatteryModel } from '../types';
import { BatteryVisual } from './BatteryVisual';
import {
  Search,
  Car,
  Bike,
  Home,
  Truck,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Info,
  Sparkles,
  ShoppingBag,
  MessageSquare
} from 'lucide-react';

export const BatteryFinder: React.FC = () => {
  const {
    batteries,
    setSelectedProductForDetail,
    addToCart,
    setIsCartOpen,
    ownerPhone
  } = useStore();

  const [activeCategory, setActiveCategory] = useState<'car' | 'two-wheeler' | 'commercial' | 'inverter'>('car');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('maruti-swift-petrol');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [brandFilter, setBrandFilter] = useState<string>('all');

  // Filter vehicle list based on category and search query
  const categoryVehicles = useMemo(() => {
    return DETAILED_VEHICLE_DATABASE.filter(v => v.category === activeCategory);
  }, [activeCategory]);

  const searchFilteredVehicles = useMemo(() => {
    if (!searchFilter.trim()) return categoryVehicles;
    const q = searchFilter.toLowerCase().trim();
    return DETAILED_VEHICLE_DATABASE.filter(v =>
      v.model.toLowerCase().includes(q) ||
      v.make.toLowerCase().includes(q) ||
      v.variant.toLowerCase().includes(q) ||
      v.oemSpec.toLowerCase().includes(q)
    );
  }, [categoryVehicles, searchFilter]);

  // Current active selected vehicle match
  const currentVehicle: VehicleMatchItem = useMemo(() => {
    const found = DETAILED_VEHICLE_DATABASE.find(v => v.id === selectedVehicleId);
    if (found) return found;
    return searchFilteredVehicles[0] || DETAILED_VEHICLE_DATABASE[0];
  }, [selectedVehicleId, searchFilteredVehicles]);

  // Find exact matching batteries for this vehicle
  const matchedBatteries: BatteryModel[] = useMemo(() => {
    const matchingByIds = batteries.filter(b => currentVehicle.recommendedBatteryIds.includes(b.id));

    // Also include other authorized batteries that match capacity and category
    const matchingBySpec = batteries.filter(b => {
      if (matchingByIds.some(m => m.id === b.id)) return false;
      const sameCategory = b.category === currentVehicle.category ||
        (currentVehicle.category === 'commercial' && b.category === 'car') ||
        (currentVehicle.category === 'inverter' && b.category === 'inverter-machine');
      const capacityDiff = Math.abs(b.capacityAh - currentVehicle.capacityAh);
      return sameCategory && (b.category === 'inverter-machine' || capacityDiff <= 10);
    });

    const combined = [...matchingByIds, ...matchingBySpec];

    if (brandFilter === 'all') return combined;
    return combined.filter(b => b.brand.toLowerCase() === brandFilter.toLowerCase());
  }, [batteries, currentVehicle, brandFilter]);

  const handleCategorySwitch = (cat: 'car' | 'two-wheeler' | 'commercial' | 'inverter') => {
    setActiveCategory(cat);
    setSearchFilter('');
    const firstInCat = DETAILED_VEHICLE_DATABASE.find(v => v.category === cat);
    if (firstInCat) {
      setSelectedVehicleId(firstInCat.id);
    }
  };

  const handleBookAdvance = (battery: BatteryModel) => {
    addToCart(battery, true);
    setIsCartOpen(true);
  };

  const handleWhatsAppInquiry = (battery: BatteryModel) => {
    const text = `Hello New Bharat Battery Wagholi,\nI am looking for a replacement battery for my ${currentVehicle.make} ${currentVehicle.model}.\n• Recommended Model: ${battery.name} (${battery.brand} ${battery.capacityAh}Ah)\n• Price with Exchange: ₹${battery.priceWithExchange}\n• OEM Spec: ${currentVehicle.oemSpec}\nPlease confirm availability for 2-hour doorstep installation in Wagholi.`;
    window.open(`https://wa.me/91${ownerPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section id="battery-finder-section" className="py-12 bg-neutral-900 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 my-10 px-4 sm:px-8 lg:px-10 relative overflow-hidden shadow-2xl border border-neutral-800">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold tracking-wider uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Battery Fitment Engine · Wagholi Specialist</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-display tracking-tight text-white">
              Find the Exact Battery for Your Vehicle or Home Inverter
            </h2>
            <p className="mt-2 text-sm text-neutral-400 max-w-2xl leading-relaxed">
              Zero guesswork. We match your vehicle’s factory engine specification, cold cranking amps (CCA), terminal polarity (Left/Right DIN), and bracket dimensions across <strong>Exide</strong>, <strong>Amaron</strong>, <strong>Livfast</strong>, <strong>Power Zone</strong>, and <strong>Luminous</strong>.
            </p>
          </div>

          <div className="hidden lg:flex items-center gap-3 bg-neutral-800/80 px-4 py-3 rounded-2xl border border-neutral-700 text-xs text-neutral-300">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <div className="font-bold text-white">100% Fitment Guarantee</div>
              <div className="text-[11px] text-neutral-400">Free alternator check & 2-hr Wagholi fitting</div>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-6">
          <button
            onClick={() => handleCategorySwitch('car')}
            className={`py-3 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer border ${
              activeCategory === 'car'
                ? 'bg-amber-500 text-neutral-950 border-amber-400 shadow-lg shadow-amber-500/20'
                : 'bg-neutral-800/80 text-neutral-300 border-neutral-700 hover:bg-neutral-800'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>Cars & SUVs</span>
          </button>

          <button
            onClick={() => handleCategorySwitch('two-wheeler')}
            className={`py-3 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer border ${
              activeCategory === 'two-wheeler'
                ? 'bg-amber-500 text-neutral-950 border-amber-400 shadow-lg shadow-amber-500/20'
                : 'bg-neutral-800/80 text-neutral-300 border-neutral-700 hover:bg-neutral-800'
            }`}
          >
            <Bike className="w-4 h-4" />
            <span>Bikes & Scooters</span>
          </button>

          <button
            onClick={() => handleCategorySwitch('commercial')}
            className={`py-3 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer border ${
              activeCategory === 'commercial'
                ? 'bg-amber-500 text-neutral-950 border-amber-400 shadow-lg shadow-amber-500/20'
                : 'bg-neutral-800/80 text-neutral-300 border-neutral-700 hover:bg-neutral-800'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Commercial & Bolero</span>
          </button>

          <button
            onClick={() => handleCategorySwitch('inverter')}
            className={`py-3 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer border ${
              activeCategory === 'inverter'
                ? 'bg-amber-500 text-neutral-950 border-amber-400 shadow-lg shadow-amber-500/20'
                : 'bg-neutral-800/80 text-neutral-300 border-neutral-700 hover:bg-neutral-800'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Inverters & UPS</span>
          </button>
        </div>

        {/* Finder Selector & Results Layout */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Form Box */}
          <div className="lg:col-span-5 bg-neutral-800/90 border border-neutral-700 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
            {/* Quick search input */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                Quick Model Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="e.g. Swift, Creta, Nexon, Activa, 150Ah..."
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-amber-500 font-medium"
                />
              </div>
            </div>

            {/* Select Vehicle / Inverter dropdown */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                Select Vehicle or Application
              </label>
              <select
                value={currentVehicle.id}
                onChange={(e) => setSelectedVehicleId(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3.5 py-3 text-xs sm:text-sm text-white focus:outline-hidden focus:border-amber-500 font-semibold"
              >
                {searchFilteredVehicles.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.make} — {v.model} ({v.fuelType})
                  </option>
                ))}
              </select>
            </div>

            {/* OEM Technical Spec Card */}
            <div className="bg-neutral-900/90 border border-neutral-700/80 rounded-xl p-4 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Factory OEM Battery Specification</span>
                </span>
                <span className="text-[10px] font-mono bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded">
                  {currentVehicle.capacityAh} Ah Rating
                </span>
              </div>

              <div className="text-sm font-black text-white font-display">
                {currentVehicle.oemSpec}
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-neutral-800">
                <div>
                  <span className="text-neutral-500 block">Terminal Layout:</span>
                  <span className="font-semibold text-neutral-300">{currentVehicle.terminalType}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Recommended Fuel:</span>
                  <span className="font-semibold text-neutral-300">{currentVehicle.fuelType}</span>
                </div>
              </div>

              <div className="text-[11px] text-neutral-400 bg-neutral-800/60 p-2.5 rounded-lg border border-neutral-700/50 flex items-start gap-1.5 leading-relaxed">
                <Info className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>{currentVehicle.notes}</span>
              </div>
            </div>

            {/* Wagholi Local Fitment Assurance */}
            <div className="pt-2 border-t border-neutral-700/60 space-y-2 text-xs text-neutral-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Guaranteed tray, clamp & polarity match</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Free doorstep fitting & old battery pickup</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Pay only ₹1,000 advance online, rest on delivery</span>
              </div>
            </div>
          </div>

          {/* Right Recommended Results */}
          <div className="lg:col-span-7 space-y-4">
            {/* Top Bar for Results & Brand Filtering */}
            <div className="flex flex-wrap items-center justify-between gap-2 bg-neutral-800/80 p-3 rounded-xl border border-neutral-700 text-xs">
              <div className="font-bold text-white flex items-center gap-1.5">
                <span>Authorized Options for:</span>
                <span className="text-amber-400 font-extrabold">{currentVehicle.model}</span>
              </div>

              {/* Brand filter chips inside finder */}
              <div className="flex items-center gap-1.5">
                <span className="text-neutral-400 text-[11px] mr-1 hidden sm:inline">Brand:</span>
                {(['all', 'Exide', 'Amaron', 'Livfast', 'Power Zone'] as const).map(br => (
                  <button
                    key={br}
                    onClick={() => setBrandFilter(br)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                      brandFilter.toLowerCase() === br.toLowerCase()
                        ? 'bg-amber-500 text-neutral-950 font-black'
                        : 'bg-neutral-700/80 text-neutral-300 hover:bg-neutral-700'
                    }`}
                  >
                    {br === 'all' ? 'All' : br}
                  </button>
                ))}
              </div>
            </div>

            {/* Matched Batteries Cards Grid */}
            {matchedBatteries.length === 0 ? (
              <div className="bg-neutral-800/60 border border-neutral-700 rounded-2xl p-8 text-center space-y-3">
                <Info className="w-8 h-8 text-amber-400 mx-auto" />
                <h4 className="text-base font-bold text-white">No batteries match brand filter "{brandFilter}"</h4>
                <p className="text-xs text-neutral-400">
                  Switch back to 'All' brands to view all verified options for this application.
                </p>
                <button
                  onClick={() => setBrandFilter('all')}
                  className="py-1.5 px-4 bg-amber-500 text-neutral-950 font-bold rounded-lg text-xs"
                >
                  View All Brands
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {matchedBatteries.map((battery) => (
                  <div
                    key={battery.id}
                    className="bg-neutral-800 border border-neutral-700 hover:border-amber-500/80 rounded-2xl p-4 flex flex-col justify-between transition-all group shadow-md hover:shadow-xl"
                  >
                    <div>
                      {/* Top Brand & Warranty Badges */}
                      <div className="flex items-center justify-between text-xs font-bold mb-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            battery.brand === 'Exide'
                              ? 'bg-red-500 text-white'
                              : battery.brand === 'Amaron'
                              ? 'bg-emerald-500 text-neutral-950'
                              : battery.brand === 'Livfast'
                              ? 'bg-orange-600 text-white'
                              : battery.brand === 'Power Zone'
                              ? 'bg-red-600 text-white'
                              : battery.brand === 'Luminous'
                              ? 'bg-blue-600 text-white'
                              : 'bg-amber-600 text-white'
                          }`}
                        >
                          {battery.brand}
                        </span>
                        <span className="text-neutral-400 font-mono text-[11px] font-bold">
                          {battery.warrantyMonths}M Warranty
                        </span>
                      </div>

                      {/* Visual Graphic */}
                      <div
                        className="cursor-pointer mb-2"
                        onClick={() => setSelectedProductForDetail(battery)}
                      >
                        <BatteryVisual
                          brand={battery.brand}
                          category={battery.category}
                          name={battery.name}
                          capacityAh={battery.capacityAh}
                          voltage={battery.voltage}
                          imageUrl={battery.imageUrl}
                          size="sm"
                          className="h-28 bg-neutral-900/60 rounded-xl"
                        />
                      </div>

                      {/* Battery Name */}
                      <h4
                        onClick={() => setSelectedProductForDetail(battery)}
                        className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1 cursor-pointer"
                        title={battery.name}
                      >
                        {battery.name}
                      </h4>

                      {/* Specs */}
                      <div className="mt-1 text-[11px] text-neutral-400 font-mono flex items-center justify-between">
                        <span>{battery.capacityAh} Ah · {battery.voltage}V</span>
                        <span className="text-[10px] text-emerald-400 font-medium">In Stock Wagholi</span>
                      </div>
                    </div>

                    {/* Price and Action Buttons */}
                    <div className="mt-3 pt-3 border-t border-neutral-700/80 space-y-2">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <div className="text-[10px] text-neutral-400">With Old Exchange:</div>
                          <div className="text-base font-black font-mono text-amber-400 tabular-nums">
                            ₹{battery.priceWithExchange.toLocaleString('en-IN')}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] text-neutral-500">Without Old:</div>
                          <div className="text-xs text-neutral-400 font-mono line-through tabular-nums">
                            ₹{battery.priceWithoutExchange.toLocaleString('en-IN')}
                          </div>
                        </div>
                      </div>

                      <div className="text-[10px] text-amber-300/90 font-medium bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 text-center">
                        ₹1,000 Advance · Rest on Delivery
                      </div>

                      <div className="grid grid-cols-2 gap-1.5 pt-1">
                        <button
                          type="button"
                          onClick={() => handleBookAdvance(battery)}
                          className="py-1.5 px-2 bg-amber-500 hover:bg-amber-600 text-neutral-950 rounded-lg text-[11px] font-black transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>Book (₹1000)</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleWhatsAppInquiry(battery)}
                          className="py-1.5 px-2 bg-neutral-700 hover:bg-emerald-600 text-white rounded-lg text-[11px] font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                          title="WhatsApp Inquiry"
                        >
                          <MessageSquare className="w-3 h-3 text-emerald-400" />
                          <span>WhatsApp</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
