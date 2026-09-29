import React from 'react';
import { BatteryModel } from '../types';
import { useStore } from '../context/StoreContext';
import { BatteryVisual } from './BatteryVisual';
import { Check, Shield, Zap } from 'lucide-react';

interface BatteryCardProps {
  battery: BatteryModel;
}

export const BatteryCard: React.FC<BatteryCardProps> = ({ battery }) => {
  const { addToCart, setSelectedProductForDetail, priceMode } = useStore();
  const [exchangeSelected, setExchangeSelected] = React.useState(true);

  // Synchronize with global priceMode if user toggled global switch
  React.useEffect(() => {
    setExchangeSelected(priceMode === 'with-exchange');
  }, [priceMode]);

  const activePrice = exchangeSelected ? battery.priceWithExchange : battery.priceWithoutExchange;

  return (
    <div className="group relative bg-white rounded-2xl border border-neutral-200/80 shadow-xs hover:shadow-lg hover:border-neutral-300 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Visual Product Stage */}
      <div
        onClick={() => setSelectedProductForDetail(battery)}
        className="cursor-pointer relative overflow-hidden bg-neutral-100 p-4 transition-colors group-hover:bg-neutral-100/90"
      >
        <BatteryVisual
          brand={battery.brand}
          category={battery.category}
          name={battery.name}
          capacityAh={battery.capacityAh}
          voltage={battery.voltage}
          imageUrl={battery.imageUrl}
          size="md"
        />

        {/* Quiet warranty tag top-right */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md text-[11px] font-bold text-neutral-800 border border-neutral-200 shadow-2xs">
          <Shield className="w-3.5 h-3.5 text-amber-600" />
          <span>{battery.warrantyMonths}m Warranty</span>
        </div>

        {/* Stock status indicator */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded text-[11px] font-semibold border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
          <span>In Stock · Wagholi</span>
        </div>
      </div>

      {/* Card Content & Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Unboxed clean metadata (Zero-Pill Discipline) */}
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            <span className="text-amber-700 font-bold">{battery.brand}</span>
            <span aria-hidden="true" className="text-neutral-300">·</span>
            <span>{battery.technology}</span>
            <span aria-hidden="true" className="text-neutral-300">·</span>
            <span>
              {battery.category === 'inverter-machine'
                ? battery.vaRating ? `${battery.vaRating} VA` : `${battery.capacityAh || 150} Ah`
                : `${battery.capacityAh} Ah`}
            </span>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => setSelectedProductForDetail(battery)}
            className="mt-1.5 text-base font-bold text-neutral-900 group-hover:text-amber-600 transition-colors cursor-pointer line-clamp-1"
          >
            {battery.name}
          </h3>

          {/* Key Compatibility Snippet */}
          <p className="mt-1 text-xs text-neutral-500 line-clamp-1">
            {battery.category === 'inverter-machine' ? 'Ideal for: ' : 'Fits: '}
            {battery.recommendedFor.slice(0, 3).join(', ')}
          </p>

          {/* Scrap Exchange Selection Toggle */}
          <div className="mt-3.5 pt-3 border-t border-neutral-100">
            <div className="flex items-center justify-between p-1.5 bg-neutral-100 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setExchangeSelected(true)}
                className={`flex-1 py-1 px-2 rounded-md font-medium text-center transition-all cursor-pointer whitespace-nowrap ${
                  exchangeSelected
                    ? 'bg-white text-neutral-900 shadow-2xs font-semibold'
                    : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                {battery.category === 'inverter-machine' ? 'With Old Unit' : 'With Old Battery'}
              </button>
              <button
                type="button"
                onClick={() => setExchangeSelected(false)}
                className={`flex-1 py-1 px-2 rounded-md font-medium text-center transition-all cursor-pointer whitespace-nowrap ${
                  !exchangeSelected
                    ? 'bg-white text-neutral-900 shadow-2xs font-semibold'
                    : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                Without Exchange
              </button>
            </div>
          </div>
        </div>

        {/* Pricing & CTA Module */}
        <div className="mt-4 pt-3 border-t border-neutral-100">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-extrabold text-neutral-900 font-mono tabular-nums">
                  ₹{activePrice.toLocaleString('en-IN')}
                </span>
                {exchangeSelected && (
                  <span className="text-xs text-neutral-400 line-through font-mono tabular-nums">
                    ₹{battery.priceWithoutExchange.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-neutral-500 block">
                {exchangeSelected ? (
                  <span className="text-emerald-700 font-semibold">
                    Includes ₹{battery.exchangeDiscount.toLocaleString('en-IN')} scrap rebate
                  </span>
                ) : (
                  'Price for new purchase without return'
                )}
              </span>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                Free Fitment
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-3.5 grid grid-cols-2 gap-2">
            <button
              onClick={() => setSelectedProductForDetail(battery)}
              className="py-2 px-3 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors text-center cursor-pointer whitespace-nowrap"
            >
              Specifications
            </button>
            <button
              onClick={() => addToCart(battery, exchangeSelected)}
              className="py-2 px-3 text-xs font-bold text-white bg-neutral-900 hover:bg-amber-600 rounded-lg transition-colors shadow-2xs text-center flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Order Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
