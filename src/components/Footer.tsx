import React from 'react';
import { BatteryCharging, MapPin, Phone, Clock, ShieldCheck, Mail } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const { setSelectedCategory, setSelectedBrand, setActiveView, setIsBreakdownModalOpen, setIsAdminLoginModalOpen } = useStore();

  return (
    <footer className="bg-neutral-950 text-neutral-400 text-xs border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info & Address */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-neutral-950 shadow-md">
                <BatteryCharging className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="font-display font-extrabold text-xl tracking-tight text-white">
                New Bharat Battery
              </span>
            </div>

            <p className="text-neutral-400 text-xs leading-relaxed max-w-sm">
              Wagholi's premier battery store and mobile service station. Authorized dealer for Exide, Amaron, Livfast, Luminous, Microtek, and Power Zone. Providing genuine products, manufacturer warranty, and free 2-hour doorstep delivery with expert fitment.
            </p>

            <div className="space-y-2 text-xs text-neutral-300 pt-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>NEW Bharat Battery, Opposite to sangrilla hotel near honda showroom wagholi pune-412207</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Customer Orders & WhatsApp: <a href="tel:+918329838314" className="text-white font-bold hover:underline">+91 83298 38314</a></span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Store Email: <strong className="text-white">rohanofficial512@gmail.com</strong></span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Store Working Hours: 8:00 AM – 9:30 PM (Open All 7 Days)</span>
              </div>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              Battery Categories
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => {
                    setActiveView('store');
                    setSelectedCategory('inverter');
                    window.scrollTo({ top: 500, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Home Inverter Batteries
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('store');
                    setSelectedCategory('car');
                    window.scrollTo({ top: 500, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Car & Hatchback Batteries
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('store');
                    setSelectedCategory('two-wheeler');
                    window.scrollTo({ top: 500, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Bike & Two-Wheeler Batteries
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('store');
                    setSelectedCategory('commercial');
                    window.scrollTo({ top: 500, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Commercial & SUV Batteries
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsBreakdownModalOpen(true)}
                  className="text-red-400 hover:text-red-300 transition-colors cursor-pointer text-left font-semibold"
                >
                  24/7 Jumpstart Service
                </button>
              </li>
            </ul>
          </div>

          {/* Authorized Brands */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              Authorized Brands
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => {
                    setActiveView('store');
                    setSelectedBrand('Exide');
                    window.scrollTo({ top: 500, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Exide Inverter & Auto Batteries
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('store');
                    setSelectedBrand('Amaron');
                    window.scrollTo({ top: 500, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Amaron Flo & Current Tall Tubular
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('store');
                    setSelectedBrand('Livfast');
                    window.scrollTo({ top: 500, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Livfast Maxximo & DuroElite
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('store');
                    setSelectedBrand('Luminous');
                    window.scrollTo({ top: 500, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Luminous Red Charge & Inverlast
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('store');
                    setSelectedBrand('Microtek');
                    window.scrollTo({ top: 500, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Microtek M-TEK Power Series
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveView('store');
                    setSelectedBrand('Power Zone');
                    window.scrollTo({ top: 500, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Power Zone (By Amara Raja)
                </button>
              </li>
            </ul>
          </div>

          {/* Wagholi Coverage & Portals */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              Service Areas & Access
            </h4>
            <p className="text-neutral-400 mb-3 leading-relaxed">
              Fast 2-hour doorstep delivery across Wagholi, Bakori Road, Kesnand, Baif Road, Ubale Nagar, and Lohegaon.
            </p>
            <div className="pt-2 border-t border-neutral-800 space-y-2">
              <button
                onClick={() => setIsAdminLoginModalOpen(true)}
                className="text-indigo-400 hover:text-indigo-300 font-bold block text-left"
              >
                🛡️ Shop Owner Administration
              </button>
              <span className="text-[11px] text-neutral-500 block">
                Restricted to authorized store manager
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-500 gap-4">
          <p>© {new Date().getFullYear()} New Bharat Battery, Wagholi. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Genuine Batteries Only</span>
            <span>·</span>
            <span>Manufacturer Warranty</span>
            <span>·</span>
            <span>Safe Eco-Friendly Scrap Disposal</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
