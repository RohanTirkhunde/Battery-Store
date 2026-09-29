import React from 'react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, ShieldCheck, User, Wrench, Menu, X, BatteryCharging, LogOut } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    cartItemCount,
    cartTotal,
    setIsCartOpen,
    setIsBreakdownModalOpen,
    setIsAuthModalOpen,
    setIsAdminLoginModalOpen,
    activeView,
    setActiveView,
    setSelectedCategory,
    showToast
  } = useStore();

  const { currentUser, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      {/* Top micro announcement bar */}
      <div className="bg-neutral-900 text-neutral-300 text-xs py-1.5 px-4 text-center font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-amber-400 font-semibold">⚡ Wagholi Fast Delivery:</span>
            <span>Free doorstep delivery & installation for Inverters & Batteries in Wagholi, Pune</span>
          </div>
          <div className="flex items-center gap-4 mx-auto sm:mx-0">
            <span>Direct WhatsApp / Call: <strong className="text-white">+91 83298 38314</strong></span>
            <span className="hidden md:inline text-neutral-500">|</span>
            <span className="hidden md:inline">Opp. Sangrilla Hotel, Wagholi</span>
          </div>
        </div>
      </div>

      {/* Main Top Bar */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-2.5 sm:py-3 min-h-[4.25rem] sm:min-h-[4.75rem] flex items-center justify-between gap-3 sm:gap-4">
        {/* Zone 1: Premium Brand Wordmark & Emblem */}
        <div className="flex items-center shrink-0 mr-2 lg:mr-4 xl:mr-6">
          <button
            onClick={() => {
              setActiveView('store');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 sm:gap-3 text-left group cursor-pointer shrink-0"
            aria-label="New Bharat Battery Wagholi - Home"
          >
            {/* High-definition emblem */}
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 p-0.5 shadow-md shadow-amber-500/25 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-neutral-950/20 backdrop-blur-xs rounded-[14px] flex items-center justify-center">
                <BatteryCharging className="w-5 h-5 sm:w-6 sm:h-6 text-white stroke-[2.5]" />
              </div>
              <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
              </span>
            </div>

            {/* Brand Title with Perfect Typography Hierarchy */}
            <div className="flex flex-col justify-center shrink-0">
              <div className="flex items-center gap-1.5 leading-none shrink-0">
                <span className="font-display font-black text-base sm:text-xl lg:text-2xl tracking-tight text-neutral-950 uppercase whitespace-nowrap group-hover:text-neutral-800 transition-colors">
                  New Bharat
                </span>
                <span className="font-display font-black text-base sm:text-xl lg:text-2xl tracking-tight text-amber-600 uppercase whitespace-nowrap group-hover:text-amber-500 transition-colors">
                  Battery
                </span>
              </div>
              <div className="flex items-center gap-1.5 leading-none mt-1 shrink-0">
                <span className="text-[10px] sm:text-[11px] font-bold tracking-wider uppercase text-neutral-500 whitespace-nowrap">
                  Wagholi, Pune
                </span>
                <span className="text-[8px] text-amber-500 font-bold">•</span>
                <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase text-neutral-400 whitespace-nowrap hidden min-[400px]:inline">
                  Batteries & Inverters
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Zone 2: Clean desktop navigation links with proper full screen spacing */}
        <nav className="hidden xl:flex items-center gap-3.5 2xl:gap-5 text-xs 2xl:text-sm font-semibold text-neutral-700 shrink min-w-0">
          <button
            onClick={() => {
              setActiveView('store');
              setSelectedCategory('inverter-machine');
              const el = document.getElementById('catalog-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-amber-600 transition-colors cursor-pointer py-1 font-bold text-amber-700 flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
            <span>Inverters & UPS</span>
          </button>

          <button
            onClick={() => {
              setActiveView('store');
              setSelectedCategory('inverter');
              const el = document.getElementById('catalog-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-amber-600 transition-colors cursor-pointer py-1 whitespace-nowrap shrink-0"
          >
            Inverter Batteries
          </button>

          <button
            onClick={() => {
              setActiveView('store');
              setSelectedCategory('car');
              const el = document.getElementById('catalog-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-amber-600 transition-colors cursor-pointer py-1 whitespace-nowrap shrink-0"
          >
            Automotive
          </button>

          <button
            onClick={() => {
              setActiveView('store');
              const el = document.getElementById('replacement-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-emerald-700 font-bold hover:text-emerald-800 transition-colors cursor-pointer py-1 flex items-center gap-1 whitespace-nowrap shrink-0"
          >
            <span>Replace Old Scrap</span>
          </button>

          <button
            onClick={() => {
              setActiveView('store');
              const el = document.getElementById('battery-finder-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-amber-600 transition-colors cursor-pointer py-1 whitespace-nowrap shrink-0 hidden 2xl:inline-block"
          >
            Finder
          </button>

          <button
            onClick={() => {
              setActiveView('store');
              const el = document.getElementById('shop-location-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hover:text-amber-600 transition-colors cursor-pointer py-1 whitespace-nowrap shrink-0 hidden 2xl:inline-block"
          >
            Shop Location
          </button>

          <button
            onClick={() => setIsBreakdownModalOpen(true)}
            className="hover:text-red-600 text-red-600 font-bold transition-colors cursor-pointer flex items-center gap-1.5 py-1 whitespace-nowrap shrink-0"
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block shrink-0" />
            <span>Jumpstart</span>
          </button>

          {currentUser?.role === 'customer' && (
            <button
              onClick={() => setActiveView('customer-dashboard')}
              className={`hover:text-amber-600 transition-colors cursor-pointer py-1 whitespace-nowrap shrink-0 ${
                activeView === 'customer-dashboard' ? 'text-amber-600 font-bold' : ''
              }`}
            >
              My Orders
            </button>
          )}

          {isAdmin && (
            <button
              onClick={() => setActiveView('admin-dashboard')}
              className={`text-indigo-600 font-bold hover:text-indigo-700 transition-colors cursor-pointer py-1 flex items-center gap-1 whitespace-nowrap shrink-0 ${
                activeView === 'admin-dashboard' ? 'border-b-2 border-indigo-600' : ''
              }`}
            >
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Admin</span>
            </button>
          )}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto">
          {/* Customer / Admin Auth triggers */}
          {currentUser ? (
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => {
                  if (isAdmin) {
                    setActiveView('admin-dashboard');
                  } else {
                    setActiveView('customer-dashboard');
                  }
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-xs font-semibold text-neutral-800 transition-colors cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-neutral-600" />
                <span className="max-w-[110px] truncate">{currentUser.name.split(' ')[0]}</span>
                {isAdmin && <span className="bg-indigo-600 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">OWNER</span>}
              </button>

              {isAdmin ? (
                <button
                  onClick={() => {
                    logout();
                    setActiveView('store');
                    showToast('Successfully signed out from Owner Panel');
                  }}
                  title="Sign Out of Owner Panel"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-600 text-red-700 hover:text-white border border-red-200 transition-colors text-xs font-bold cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    logout();
                    setActiveView('store');
                    showToast('Customer logged out. Cart cleared.');
                  }}
                  title="Sign Out of Customer Account"
                  className="flex items-center gap-1 text-xs text-neutral-600 hover:text-red-700 bg-neutral-100 hover:bg-red-50 border border-neutral-200 hover:border-red-200 px-2.5 py-1.5 rounded-lg cursor-pointer font-semibold transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5 text-neutral-500 hover:text-red-600" />
                  <span>Logout</span>
                </button>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                <User className="w-4 h-4" />
                <span className="hidden md:inline">Customer</span> Sign In
              </button>

              <button
                onClick={() => setIsAdminLoginModalOpen(true)}
                className="flex items-center gap-1 px-2.5 py-2 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors cursor-pointer"
                title="Shop Owner Only"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            </div>
          )}

          {/* Shopping Cart Button */}
          <button
            onClick={() => setActiveView('cart')}
            aria-label="View Shopping Cart"
            className={`relative px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer border shadow-2xs shrink-0 ${
              activeView === 'cart'
                ? 'bg-amber-100/90 border-amber-400 text-neutral-950 font-bold ring-2 ring-amber-400/30'
                : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-700 text-white'
            }`}
          >
            <div className="relative">
              <ShoppingBag className={`w-4 h-4 sm:w-5 sm:h-5 ${activeView === 'cart' ? 'text-amber-800' : 'text-amber-400'}`} />
              <span className="absolute -top-2 -right-2.5 min-w-4 h-4 px-1 bg-[#FFD814] text-neutral-950 text-[10px] font-black rounded-full flex items-center justify-center border border-[#FCD200] shadow-xs">
                {cartItemCount}
              </span>
            </div>
            <div className="flex flex-col text-left leading-tight">
              <span className={`text-[9px] sm:text-[10px] uppercase font-bold tracking-wider ${activeView === 'cart' ? 'text-amber-900' : 'text-neutral-400'}`}>
                Cart
              </span>
              <span className={`text-[11px] sm:text-xs font-bold font-mono tabular-nums ${activeView === 'cart' ? 'text-neutral-950' : 'text-amber-300'}`}>
                {cartTotal > 0 ? `₹${cartTotal.toLocaleString('en-IN')}` : '₹0'}
              </span>
            </div>
          </button>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-neutral-700 hover:text-neutral-900 cursor-pointer"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-200 bg-white px-4 pt-3 pb-5 space-y-3">
          <div className="flex flex-col gap-2 text-sm font-medium">
            {/* Mobile Shopping Cart button */}
            <button
              onClick={() => {
                setActiveView('cart');
                setMobileMenuOpen(false);
              }}
              className="text-left px-3.5 py-2.5 rounded-xl bg-[#FFD814] text-neutral-950 font-bold flex items-center justify-between border border-[#FCD200] shadow-xs cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-neutral-900" />
                <span>View Shopping Cart</span>
              </div>
              <span className="font-mono text-xs bg-neutral-900 text-white px-2 py-0.5 rounded-full">
                {cartItemCount} item{cartItemCount === 1 ? '' : 's'} · ₹{cartTotal.toLocaleString('en-IN')}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveView('store');
                setSelectedCategory('inverter-machine');
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 rounded-lg bg-amber-50/70 hover:bg-amber-100 text-amber-900 font-bold flex items-center justify-between"
            >
              <span>⚡ Inverters & Home UPS (Luminous, Microtek, Livfast)</span>
              <span className="text-[10px] uppercase bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded">New</span>
            </button>
            <button
              onClick={() => {
                setActiveView('store');
                setSelectedCategory('inverter');
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 rounded-lg hover:bg-neutral-100 text-neutral-800"
            >
              Inverter Tubular Batteries (Exide, Amaron, Livfast, Luminous)
            </button>
            <button
              onClick={() => {
                setActiveView('store');
                setSelectedCategory('car');
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 rounded-lg hover:bg-neutral-100 text-neutral-800"
            >
              Car Batteries (Exide, Amaron, Livfast, Power Zone)
            </button>
            <button
              onClick={() => {
                setActiveView('store');
                setSelectedCategory('two-wheeler');
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 rounded-lg hover:bg-neutral-100 text-neutral-800"
            >
              Two-Wheeler / Bike Batteries
            </button>
            <button
              onClick={() => {
                setIsBreakdownModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 rounded-lg bg-red-50 text-red-700 font-bold flex items-center justify-between"
            >
              <span>Emergency Jumpstart Service (Wagholi)</span>
              <Wrench className="w-4 h-4" />
            </button>

            {currentUser ? (
              <>
                <button
                  onClick={() => {
                    setActiveView(isAdmin ? 'admin-dashboard' : 'customer-dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left px-3 py-2 rounded-lg bg-neutral-100 font-semibold text-neutral-900"
                >
                  {isAdmin ? '🛡️ Owner Admin Dashboard' : '👤 My Orders & Registered Warranties'}
                </button>
                <button
                  onClick={() => {
                    logout();
                    setActiveView('store');
                    showToast('Successfully signed out');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left px-3 py-2 text-red-600 hover:bg-red-50 font-bold rounded-lg flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <div className="pt-2 border-t border-neutral-100 flex gap-2">
                <button
                  onClick={() => {
                    setIsAuthModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2 text-center rounded-lg bg-neutral-100 text-neutral-900 font-semibold text-xs"
                >
                  Customer Sign In
                </button>
                <button
                  onClick={() => {
                    setIsAdminLoginModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2 text-center rounded-lg bg-indigo-50 text-indigo-700 font-semibold text-xs"
                >
                  Owner Portal
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
