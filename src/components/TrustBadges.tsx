import React from 'react';
import { Truck, ShieldCheck, RefreshCw, Wrench } from 'lucide-react';

export const TrustBadges: React.FC = () => {
  return (
    <section className="border-y border-neutral-200 bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {/* Badge 1 */}
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 shrink-0">
              <Truck className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-neutral-900 leading-tight">2-Hour Doorstep Delivery</h4>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                Prompt dispatch across Wagholi, Bakori, Kesnand & nearby localities.
              </p>
            </div>
          </div>

          {/* Badge 2 */}
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
              <RefreshCw className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-neutral-900 leading-tight">Old Battery Scrap Rebate</h4>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                Exchange your expired battery and instantly save ₹500 to ₹3,700.
              </p>
            </div>
          </div>

          {/* Badge 3 */}
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 shrink-0">
              <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-neutral-900 leading-tight">100% Genuine Warranty</h4>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                Authorized dealer bill, manufacturer e-warranty, and fresh stock.
              </p>
            </div>
          </div>

          {/* Badge 4 */}
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 shrink-0">
              <Wrench className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-neutral-900 leading-tight">Free Expert Installation</h4>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                Complimentary terminal grease, voltage load test & secure clamping.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
