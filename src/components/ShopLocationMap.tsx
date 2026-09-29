import React from 'react';
import { MapPin, Navigation, Phone, Clock, MessageSquare, ShieldCheck, ExternalLink } from 'lucide-react';

export const ShopLocationMap: React.FC = () => {
  const shopAddress = "NEW Bharat Battery, Opposite to sangrilla hotel near honda showroom wagholi pune-412207";
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shopAddress)}`;

  return (
    <section id="shop-location-section" className="py-14 bg-white border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2">
            <MapPin className="w-3.5 h-3.5 text-amber-700" />
            <span>Store Physical Landmark</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-display text-neutral-900 tracking-tight">
            Visit NEW Bharat Battery in Wagholi
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Centrally located on Pune-Nagar Road opposite Sangrilla Hotel. Walk in to test your battery or order free 2-hour doorstep delivery.
          </p>
        </div>

        {/* Map & Location Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Interactive Details */}
          <div className="lg:col-span-5 bg-neutral-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl">
            <div className="space-y-5">
              <div>
                <span className="text-[11px] font-mono font-bold tracking-widest text-amber-400 uppercase">
                  Official Showroom & Service Center
                </span>
                <h3 className="text-xl sm:text-2xl font-black font-display text-white mt-1">
                  NEW Bharat Battery
                </h3>
              </div>

              {/* Exact Address */}
              <div className="bg-neutral-800/90 rounded-2xl p-4 border border-neutral-700 space-y-2">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                      Verified Store Location
                    </h4>
                    <p className="text-sm font-semibold text-white mt-1 leading-snug">
                      Opposite to Sangrilla Hotel, Near Honda Showroom, Pune-Nagar Road, Wagholi, Pune - 412207
                    </p>
                    <span className="text-[11px] text-amber-400 mt-1 block">
                      Landmark: Opp. Sangrilla Hotel / Adjacent to Honda 2-Wheeler Showroom
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-amber-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[10px]">Mobile Helpline & Order Desk:</span>
                    <a href="tel:+918329838314" className="text-sm font-black font-mono text-white hover:text-amber-400 transition-colors">
                      +91 83298 38314
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-amber-400">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[10px]">Working Hours:</span>
                    <span className="font-semibold text-white">8:00 AM – 9:30 PM (Open All 7 Days)</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-amber-400">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[10px]">Authorized Brands Available:</span>
                    <span className="font-medium text-neutral-200">Exide · Amaron · Livfast · Luminous · Microtek · Power Zone</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Action Buttons */}
            <div className="mt-8 pt-4 border-t border-neutral-800 space-y-2.5">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-extrabold rounded-xl transition-colors shadow-md shadow-amber-500/20 text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
              >
                <Navigation className="w-4 h-4" />
                <span>Get Driving Directions in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href="https://wa.me/918329838314?text=Hello%20NEW%20Bharat%20Battery%20Wagholi,%20I%20am%20looking%20for%20a%20battery."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Message Owner on WhatsApp (+91 83298 38314)</span>
              </a>
            </div>
          </div>

          {/* Right Column: Live Google Map Embed */}
          <div className="lg:col-span-7 bg-neutral-100 rounded-3xl overflow-hidden border border-neutral-200 relative min-h-[380px] shadow-sm flex flex-col">
            <div className="bg-white px-4 py-2.5 border-b border-neutral-200 flex items-center justify-between text-xs">
              <span className="font-bold text-neutral-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Live Map View: Pune-Nagar Road, Wagholi
              </span>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-700 font-semibold hover:underline flex items-center gap-1"
              >
                <span>View Fullscreen</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="flex-1 w-full h-full min-h-[340px]">
              <iframe
                title="NEW Bharat Battery Wagholi Location"
                src="https://maps.google.com/maps?q=Sangrilla+Hotel+Wagholi+Pune+Nagar+Road+412207&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '340px' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
            </div>

            {/* Distance Highlights from Key Wagholi Neighborhoods */}
            <div className="bg-neutral-50 p-3 border-t border-neutral-200 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div>
                <span className="text-[10px] text-neutral-400 block">From BJS College</span>
                <span className="font-bold text-neutral-800">800 meters</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 block">From Bakori Road</span>
                <span className="font-bold text-neutral-800">1.4 km</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 block">From Ivy Estate</span>
                <span className="font-bold text-neutral-800">2.2 km</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 block">From Kharadi Bypass</span>
                <span className="font-bold text-neutral-800">4.0 km</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
