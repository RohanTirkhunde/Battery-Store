/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TrustBadges } from './components/TrustBadges';
import { BatteryCard } from './components/BatteryCard';
import { BatteryFinder } from './components/BatteryFinder';
import { BatteryReplacementSection } from './components/BatteryReplacementSection';
import { ShopLocationMap } from './components/ShopLocationMap';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { EmergencyBreakdownModal } from './components/EmergencyBreakdownModal';
import { CustomerAuthModal } from './components/CustomerAuthModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { CustomerDashboard } from './components/CustomerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { CartView } from './components/CartView';
import { BatteryBrand, BatteryCategory } from './types';
import {
  Search,
  Zap,
  Shield,
  Truck,
  Phone,
  RefreshCw,
  Wrench,
  CheckCircle,
  BatteryCharging,
  Flame,
  ArrowRight,
  MessageSquare
} from 'lucide-react';

const StoreContent: React.FC = () => {
  const {
    batteries,
    selectedCategory,
    setSelectedCategory,
    selectedBrand,
    setSelectedBrand,
    searchQuery,
    setSearchQuery,
    priceMode,
    setPriceMode,
    activeView,
    setActiveView,
    toastMessage,
    setIsBreakdownModalOpen
  } = useStore();

  const { isAdmin } = useAuth();

  // Filtered batteries based on category, brand, and search
  const filteredBatteries = batteries.filter(b => {
    const matchesCategory = selectedCategory === 'all' || b.category === selectedCategory;
    const matchesBrand = selectedBrand === 'all' || b.brand === selectedBrand;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      b.name.toLowerCase().includes(q) ||
      b.brand.toLowerCase().includes(q) ||
      b.technology.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q) ||
      (b.vaRating && b.vaRating.toString().includes(q)) ||
      (b.capacityAh && b.capacityAh.toString().includes(q)) ||
      b.recommendedFor.some(r => r.toLowerCase().includes(q));

    return matchesCategory && matchesBrand && matchesSearch;
  });

  const popularBatteries = batteries.filter(b => b.isPopular);

  React.useEffect(() => {
    if (!isAdmin && activeView === 'admin-dashboard') {
      setActiveView('store');
    }
  }, [isAdmin, activeView, setActiveView]);

  if (activeView === 'admin-dashboard' && isAdmin) {
    return <AdminDashboard />;
  }

  if (activeView === 'customer-dashboard') {
    return <CustomerDashboard />;
  }

  if (activeView === 'cart') {
    return (
      <div className="min-h-screen flex flex-col bg-[#EAEDED]">
        {toastMessage && (
          <div className="fixed bottom-5 right-5 z-50 bg-neutral-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-neutral-700 animate-slide-up text-xs font-semibold">
            <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}
        <Header />
        <CartView />
        <ProductDetailModal />
        <CartDrawer />
        <CheckoutModal />
        <EmergencyBreakdownModal />
        <CustomerAuthModal />
        <AdminLoginModal />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-neutral-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-neutral-700 animate-slide-up text-xs font-semibold">
          <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-neutral-900 via-neutral-900 to-neutral-950 text-white py-14 lg:py-20 border-b border-neutral-800">
        {/* Ambient lighting glows */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Editorial Headline & Actions */}
            <div className="lg:col-span-7 space-y-6">
              {/* Trust Pill / Kicker */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-800/80 border border-neutral-700 text-xs font-semibold text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block" />
                <span>Authorized Dealer in Wagholi · 100% Genuine Inverters & Batteries</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight text-white leading-[1.15]">
                Powering Homes & Vehicles with Genuine Inverters & Batteries
              </h1>

              {/* Subtitle */}
              <p className="text-base text-neutral-300 leading-relaxed max-w-xl">
                Authorized showroom for <strong>Luminous</strong>, <strong>Microtek</strong>, <strong>Livfast</strong>, <strong>Exide</strong>, <strong>Amaron</strong>, and <strong>Power Zone</strong>. Buy Home UPS inverters, tubular batteries, and car batteries with <strong>free 2-hour doorstep delivery & installation</strong> in Wagholi plus the <strong>highest scrap exchange value</strong>.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setSelectedCategory('inverter-machine');
                    const el = document.getElementById('catalog-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="py-3 px-5 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-extrabold rounded-xl transition-colors shadow-md shadow-amber-500/20 text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Shop Inverters & UPS</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedCategory('inverter');
                    const el = document.getElementById('catalog-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="py-3 px-5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-xl transition-colors border border-neutral-700 text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                >
                  <span>Inverter Batteries</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedCategory('car');
                    const el = document.getElementById('catalog-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="py-3 px-4 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold rounded-xl transition-colors border border-neutral-700 text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                >
                  <span>Car Batteries</span>
                </button>

                <button
                  onClick={() => setIsBreakdownModalOpen(true)}
                  className="py-3 px-4 bg-red-600/90 hover:bg-red-600 text-white font-bold rounded-xl transition-colors text-xs flex items-center gap-2 cursor-pointer"
                >
                  <Wrench className="w-4 h-4" />
                  <span>24/7 Jumpstart</span>
                </button>
              </div>

              {/* Quick Trust Highlights */}
              <div className="pt-4 border-t border-neutral-800/80 flex flex-wrap items-center gap-6 text-xs text-neutral-400">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-amber-400" />
                  <span>Delivery in 2 Hours</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <RefreshCw className="w-4 h-4 text-emerald-400" />
                  <span>Up to ₹3,700 Scrap Rebate</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-amber-400" />
                  <span>Up to 72 Months Warranty</span>
                </div>
              </div>
            </div>

            {/* Right Column: Authorized Brands Visual Showcase */}
            <div className="lg:col-span-5">
              <div className="bg-neutral-800/80 border border-neutral-700 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl">
                <div className="flex items-center justify-between pb-4 border-b border-neutral-700">
                  <span className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase">
                    Our Authorized Brands
                  </span>
                  <span className="text-[11px] text-neutral-400 font-semibold">
                    Fresh Factory Inventory
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
                  {/* Exide */}
                  <div
                    onClick={() => {
                      setSelectedBrand('Exide');
                      const el = document.getElementById('catalog-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="p-3.5 rounded-2xl bg-neutral-900/90 border border-neutral-700 hover:border-red-500 cursor-pointer transition-colors group"
                  >
                    <div className="text-red-500 font-black font-display text-base tracking-wide group-hover:scale-105 transition-transform">
                      EXIDE
                    </div>
                    <div className="text-neutral-400 text-[11px] mt-0.5 font-medium">Inverter & Car Batteries</div>
                    <div className="text-neutral-500 text-[10px] mt-2 font-mono">IT500 · Mileage · Epiq</div>
                  </div>

                  {/* Amaron */}
                  <div
                    onClick={() => {
                      setSelectedBrand('Amaron');
                      const el = document.getElementById('catalog-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="p-3.5 rounded-2xl bg-neutral-900/90 border border-neutral-700 hover:border-emerald-500 cursor-pointer transition-colors group"
                  >
                    <div className="text-emerald-400 font-black font-display text-base tracking-wide group-hover:scale-105 transition-transform">
                      AMARON
                    </div>
                    <div className="text-neutral-400 text-[11px] mt-0.5 font-medium">Lasts Long, Really Long</div>
                    <div className="text-neutral-500 text-[10px] mt-2 font-mono">Current TT · Flo · Pro</div>
                  </div>

                  {/* Livfast */}
                  <div
                    onClick={() => {
                      setSelectedBrand('Livfast');
                      const el = document.getElementById('catalog-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="p-3.5 rounded-2xl bg-neutral-900/90 border border-neutral-700 hover:border-orange-500 cursor-pointer transition-colors group"
                  >
                    <div className="text-orange-500 font-black font-display text-base tracking-wide group-hover:scale-105 transition-transform">
                      LIVFAST
                    </div>
                    <div className="text-neutral-400 text-[11px] mt-0.5 font-medium">Faster Living Inverters & Auto</div>
                    <div className="text-neutral-500 text-[10px] mt-2 font-mono">Maxximo · DuroElite</div>
                  </div>

                  {/* Luminous */}
                  <div
                    onClick={() => {
                      setSelectedBrand('Luminous');
                      const el = document.getElementById('catalog-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="p-3.5 rounded-2xl bg-neutral-900/90 border border-neutral-700 hover:border-blue-500 cursor-pointer transition-colors group"
                  >
                    <div className="text-blue-400 font-black font-display text-base tracking-wide group-hover:scale-105 transition-transform">
                      LUMINOUS
                    </div>
                    <div className="text-neutral-400 text-[11px] mt-0.5 font-medium">India's Leading Inverters</div>
                    <div className="text-neutral-500 text-[10px] mt-2 font-mono">Red Charge · Inverlast</div>
                  </div>

                  {/* Microtek */}
                  <div
                    onClick={() => {
                      setSelectedBrand('Microtek');
                      const el = document.getElementById('catalog-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="p-3.5 rounded-2xl bg-neutral-900/90 border border-neutral-700 hover:border-amber-500 cursor-pointer transition-colors group"
                  >
                    <div className="text-amber-400 font-black font-display text-base tracking-wide group-hover:scale-105 transition-transform">
                      MICROTEK
                    </div>
                    <div className="text-neutral-400 text-[11px] mt-0.5 font-medium">Technology We Live In</div>
                    <div className="text-neutral-500 text-[10px] mt-2 font-mono">M-TEK · Jumbo Tubular</div>
                  </div>

                  {/* Power Zone */}
                  <div
                    onClick={() => {
                      setSelectedBrand('Power Zone');
                      const el = document.getElementById('catalog-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="p-3.5 rounded-2xl bg-neutral-900/90 border border-neutral-700 hover:border-red-500 cursor-pointer transition-colors group"
                  >
                    <div className="text-red-400 font-black font-display text-base tracking-wide group-hover:scale-105 transition-transform">
                      POWER ZONE
                    </div>
                    <div className="text-neutral-400 text-[11px] mt-0.5 font-medium">Amara Raja Engineering</div>
                    <div className="text-neutral-500 text-[10px] mt-2 font-mono">Best Value Auto</div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-700 text-center">
                  <span className="text-[11px] text-neutral-400">
                    Visit Store: <strong className="text-white">Opp. Sangrilla Hotel, Near Honda Showroom, Wagholi</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <TrustBadges />

      {/* Battery Replacement & Scrap Rebate Section */}
      <BatteryReplacementSection />

      {/* Battery Finder Tool */}
      <BatteryFinder />

      {/* Main E-Commerce Catalog Section */}
      <section id="catalog-section" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 w-full">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-amber-700 uppercase">
              <span>Verified In-Store Catalog</span>
              <span aria-hidden="true">·</span>
              <span>Available for Immediate Delivery</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-neutral-900 tracking-tight mt-1">
              Browse Genuine Inverters & Batteries
            </h2>
            <p className="text-xs text-neutral-500 mt-1 max-w-xl">
              All prices include free doorstep delivery & installation in Wagholi. Exchange your old expired battery or old inverter to unlock huge scrap rebates.
            </p>
          </div>

          {/* Scrap Exchange Mode Selector Switch */}
          <div className="flex items-center gap-2 bg-neutral-200/80 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setPriceMode('with-exchange')}
              className={`py-1.5 px-3 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                priceMode === 'with-exchange'
                  ? 'bg-white text-neutral-900 shadow-2xs font-bold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Prices With Old Scrap Return (Save ₹500–₹3,700)
            </button>
            <button
              onClick={() => setPriceMode('without-exchange')}
              className={`py-1.5 px-3 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                priceMode === 'without-exchange'
                  ? 'bg-white text-neutral-900 shadow-2xs font-bold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Without Exchange
            </button>
          </div>
        </div>

        {/* Filter Bar Controls */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-4 shadow-xs mb-8 space-y-4">
          {/* Category Filter Tabs */}
          <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-neutral-100">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-neutral-500 uppercase mr-1">Category:</span>
              {[
                { id: 'all', label: 'All Products' },
                { id: 'inverter-machine', label: '⚡ Inverters & UPS' },
                { id: 'inverter', label: 'Inverter Batteries' },
                { id: 'car', label: 'Car Batteries' },
                { id: 'two-wheeler', label: 'Bike Batteries' },
                { id: 'commercial', label: 'Commercial & SUV' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-neutral-900 text-white shadow-2xs'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Live Search */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Zelio, Luxe, Swift, IT500, 900VA, 150Ah..."
                className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-hidden focus:border-amber-500 font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-neutral-400 hover:text-neutral-700"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Brand Filter Buttons */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="font-bold text-neutral-500 uppercase mr-1">Brand:</span>
            {(['all', 'Exide', 'Amaron', 'Livfast', 'Luminous', 'Microtek', 'Power Zone'] as const).map(br => (
              <button
                key={br}
                onClick={() => setSelectedBrand(br)}
                className={`px-3 py-1 rounded-md font-bold transition-all cursor-pointer ${
                  selectedBrand === br
                    ? 'bg-amber-500 text-neutral-950 shadow-2xs'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {br === 'all' ? 'All Brands' : br}
              </button>
            ))}

            {(selectedCategory !== 'all' || selectedBrand !== 'all' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedBrand('all');
                  setSearchQuery('');
                }}
                className="text-xs text-amber-700 hover:underline font-semibold ml-auto cursor-pointer"
              >
                Reset All Filters
              </button>
            )}
          </div>
        </div>

        {/* Results Metadata */}
        <div className="flex items-center justify-between text-xs text-neutral-500 mb-4 px-1">
          <span>
            Showing <strong className="text-neutral-900 font-mono">{filteredBatteries.length}</strong> inverter & battery model{filteredBatteries.length === 1 ? '' : 's'} in Wagholi
          </span>
          <span className="hidden sm:inline">
            Free terminal grease & alternator check included
          </span>
        </div>

        {/* Product Cards Grid adhering to 3-column / 2-column e-commerce layout */}
        {filteredBatteries.length === 0 ? (
          <div className="bg-white rounded-3xl border border-neutral-200 p-12 text-center my-6">
            <BatteryCharging className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-neutral-800">No matching battery models found</h3>
            <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
              We carry a complete stock of Exide, Amaron, Livfast, Luminous, Microtek and Power Zone models. Try clearing your search query or switching filters.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedBrand('all');
                setSearchQuery('');
              }}
              className="mt-4 py-2 px-4 bg-neutral-900 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredBatteries.map(battery => (
              <BatteryCard key={battery.id} battery={battery} />
            ))}
          </div>
        )}
      </section>

      {/* Why Choose New Bharat Battery in Wagholi */}
      <section className="bg-white border-t border-neutral-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold text-amber-700 uppercase tracking-widest">
              Wagholi's Trusted Battery Shop
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-neutral-900 tracking-tight mt-1">
              Why Wagholi Chooses New Bharat Battery
            </h2>
            <p className="text-xs text-neutral-500 mt-1.5">
              Locally owned and trusted by thousands of homeowners, car owners, and fleet drivers along Pune-Nagar Road.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-200/80">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-neutral-900">Swift 2-Hour Doorstep Delivery</h3>
              <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                Our technicians are stationed locally in Wagholi. Whether you live in Ivy Estate, Bakori Road, or near Lexicon School, we reach your doorstep within 2 hours.
              </p>
            </div>

            <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-200/80">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <RefreshCw className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-neutral-900">Highest Scrap Value Guaranteed</h3>
              <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                Do not discard your dead battery. We provide top-of-market scrap discounts (up to ₹3,700 on 220Ah and up to ₹1,500 on car batteries) directly adjusted in your final bill.
              </p>
            </div>

            <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-200/80">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-neutral-900">100% Genuine Direct Dealership</h3>
              <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                Direct authorized inventory from Exide, Amaron, Livfast, Luminous, Microtek, and Power Zone. Every battery has a valid manufacturer barcode, warranty card, and fresh manufacturing date.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Store Location & Google Map */}
      <ShopLocationMap />

      {/* Floating WhatsApp Quick Support Button */}
      <a
        href="https://wa.me/918329838314?text=Hello%20NEW%20Bharat%20Battery%20Wagholi,%20I%20want%20to%20inquire%20about%20a%20battery."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp with NEW Bharat Battery Wagholi"
        className="fixed bottom-6 left-6 z-40 bg-emerald-600 hover:bg-emerald-500 text-white p-3.5 rounded-full shadow-2xl flex items-center gap-2 hover:scale-105 transition-all group"
      >
        <MessageSquare className="w-6 h-6" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 text-xs font-bold pr-1">
          WhatsApp 8329838314
        </span>
      </a>

      {/* Modals & Drawers */}
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <EmergencyBreakdownModal />
      <CustomerAuthModal />
      <AdminLoginModal />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <StoreContent />
      </StoreProvider>
    </AuthProvider>
  );
}
