import React from 'react';
import { BatteryBrand, BatteryCategory } from '../types';

interface BatteryVisualProps {
  brand: BatteryBrand;
  category: BatteryCategory;
  name: string;
  capacityAh: number;
  voltage?: number;
  imageUrl?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const BatteryVisual: React.FC<BatteryVisualProps> = ({
  brand,
  category,
  name,
  capacityAh,
  voltage = 12,
  imageUrl,
  className = '',
  size = 'md'
}) => {
  const [imgError, setImgError] = React.useState(false);

  // If a valid image URL is supplied and hasn't errored
  if (imageUrl && !imgError) {
    return (
      <div className={`relative overflow-hidden rounded-xl bg-neutral-100 flex items-center justify-center p-4 ${className}`}>
        <img
          src={imageUrl}
          alt={`${brand} ${name}`}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="w-full h-full object-contain filter drop-shadow-md transition-transform duration-300 hover:scale-105"
        />
      </div>
    );
  }

  // Brand-specific colors & styling parameters
  const getBrandDetails = () => {
    switch (brand) {
      case 'Exide':
        return {
          brandColor: '#E11D48', // Exide bold red
          brandBg: 'from-red-600 to-rose-700',
          lidColor: '#DC2626',
          bodyColor: '#F3F4F6',
          textColor: '#BE123C',
          accent: '#991B1B',
          badgeText: 'EXIDE',
          badgeSub: category === 'inverter' ? 'INVA TUBULAR' : 'MILEAGE / EPIQ'
        };
      case 'Amaron':
        return {
          brandColor: '#16A34A', // Amaron signature pitstop green
          brandBg: 'from-emerald-600 to-green-700',
          lidColor: '#15803D',
          bodyColor: '#166534',
          textColor: '#15803D',
          accent: '#14532D',
          badgeText: 'AMARON',
          badgeSub: category === 'inverter' ? 'CURRENT TT' : 'LASTS LONG, REALLY LONG'
        };
      case 'Luminous':
        return {
          brandColor: '#2563EB', // Luminous royal blue
          brandBg: 'from-blue-600 to-indigo-700',
          lidColor: '#1D4ED8',
          bodyColor: '#F1F5F9',
          textColor: '#1E40AF',
          accent: '#FBBF24', // yellow highlight
          badgeText: 'LUMINOUS',
          badgeSub: 'RED CHARGE / INVERLAST'
        };
      case 'Microtek':
        return {
          brandColor: '#B91C1C', // Microtek deep red
          brandBg: 'from-red-700 to-amber-700',
          lidColor: '#991B1B',
          bodyColor: '#1E293B',
          textColor: '#DC2626',
          accent: '#EA580C',
          badgeText: 'MICROTEK',
          badgeSub: 'M-TEK POWER'
        };
      case 'Power Zone':
        return {
          brandColor: '#DC2626', // Power Zone Red & Charcoal
          brandBg: 'from-red-600 to-neutral-800',
          lidColor: '#EF4444',
          bodyColor: '#262626',
          textColor: '#EF4444',
          accent: '#F97316',
          badgeText: 'POWER ZONE',
          badgeSub: 'AMARA RAJA TECH'
        };
      case 'Livfast':
        return {
          brandColor: '#EA580C', // Livfast signature orange
          brandBg: 'from-orange-600 to-amber-700',
          lidColor: '#C2410C',
          bodyColor: '#0F172A',
          textColor: '#F97316',
          accent: '#FBBF24',
          badgeText: 'LIVFAST',
          badgeSub: category === 'inverter' ? 'MAX TUFF TUBULAR' : 'DUROLIFE / DUROEDGE'
        };
    }
  };

  const details = getBrandDetails();
  const isInverterMachine = category === 'inverter-machine';
  const isInverter = category === 'inverter';
  const isTwoWheeler = category === 'two-wheeler';

  const sizeClasses = {
    sm: 'h-40',
    md: 'h-56',
    lg: 'h-72'
  }[size];

  return (
    <div
      className={`relative w-full ${sizeClasses} rounded-xl bg-gradient-to-b from-neutral-100 to-neutral-200/80 p-4 flex flex-col items-center justify-center overflow-hidden border border-neutral-200/60 shadow-inner group ${className}`}
    >
      {/* Subtle floor grid reflection */}
      <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-neutral-300/40 to-transparent pointer-events-none" />

      {/* SVG Battery / Inverter Representation */}
      <div className="relative w-full h-full max-w-[280px] max-h-[200px] flex items-center justify-center transition-transform duration-300 group-hover:scale-[1.03]">
        <svg
          viewBox="0 0 320 220"
          className="w-full h-full drop-shadow-xl select-none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Floor Shadow */}
          <ellipse cx="160" cy="208" rx="125" ry="8" fill="#000000" fillOpacity="0.25" />

          {isInverterMachine ? (
            /* --- INVERTER / HOME UPS MACHINE UNIT --- */
            <g>
              {/* Rubber Base Feet */}
              <rect x="50" y="196" width="24" height="6" rx="2" fill="#1F2937" />
              <rect x="246" y="196" width="24" height="6" rx="2" fill="#1F2937" />

              {/* Main Inverter Cabinet Shell */}
              <rect
                x="36"
                y="52"
                width="248"
                height="146"
                rx="10"
                fill="#18181B"
                stroke="#3F3F46"
                strokeWidth="2"
              />

              {/* Top Accent Bezel strip */}
              <path
                d="M36 62 C36 56.4772 40.4772 52 46 52 H274 C279.523 52 284 56.4772 284 62 V72 H36 V62 Z"
                fill={details.brandColor}
              />

              {/* Top Brand Stripe */}
              <text
                x="48"
                y="66"
                fill="#FFFFFF"
                fontFamily="Cabinet Grotesk, sans-serif"
                fontWeight="900"
                fontSize="11"
                letterSpacing="1"
              >
                {details.badgeText}
              </text>
              <text
                x="272"
                y="66"
                textAnchor="end"
                fill="#FEF08A"
                fontFamily="JetBrains Mono, monospace"
                fontWeight="bold"
                fontSize="9"
              >
                PURE SINE WAVE
              </text>

              {/* Glossy Front Faceplate / Display Panel */}
              <rect
                x="50"
                y="80"
                width="220"
                height="80"
                rx="6"
                fill="#09090B"
                stroke="#27272A"
                strokeWidth="1.5"
              />

              {/* Digital LCD / LED Status Screen */}
              <rect
                x="62"
                y="90"
                width="114"
                height="60"
                rx="4"
                fill="#022C22"
                stroke="#059669"
                strokeWidth="1"
              />

              {/* Screen Glow */}
              <rect x="64" y="92" width="110" height="24" rx="2" fill="#047857" fillOpacity="0.25" />

              {/* Digital Readout */}
              <text
                x="70"
                y="106"
                fill="#34D399"
                fontFamily="JetBrains Mono, monospace"
                fontWeight="bold"
                fontSize="11"
              >
                230V · MAINS ON
              </text>
              <text
                x="70"
                y="120"
                fill="#A7F3D0"
                fontFamily="JetBrains Mono, monospace"
                fontWeight="600"
                fontSize="8"
              >
                BATTERY: 100% READY
              </text>

              {/* Battery Graphic / Signal Bars on LCD */}
              {[70, 78, 86, 94, 102].map((bx, i) => (
                <rect key={i} x={bx} y="128" width="6" height="14" rx="1" fill="#10B981" />
              ))}
              <text
                x="116"
                y="140"
                fill="#34D399"
                fontFamily="JetBrains Mono, monospace"
                fontWeight="bold"
                fontSize="9"
              >
                ECO MODE
              </text>

              {/* Right Side: Power Button & Status LEDs */}
              <g>
                {/* Illuminated Soft Touch Power Button */}
                <circle cx="230" cy="118" r="18" fill="#27272A" stroke="#3F3F46" strokeWidth="2" />
                <circle cx="230" cy="118" r="14" fill="#18181B" />
                <circle cx="230" cy="118" r="10" stroke="#10B981" strokeWidth="2" fill="none" strokeDasharray="14 4" />
                <line x1="230" y1="112" x2="230" y2="118" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />

                {/* Status Indicator LEDs */}
                <circle cx="192" cy="98" r="3.5" fill="#10B981" />
                <text x="200" y="101" fill="#9CA3AF" fontSize="6.5" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="bold">MAINS</text>

                <circle cx="192" cy="112" r="3.5" fill="#3B82F6" />
                <text x="200" y="115" fill="#9CA3AF" fontSize="6.5" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="bold">CHARGING</text>

                <circle cx="192" cy="126" r="3.5" fill="#F59E0B" />
                <text x="200" y="129" fill="#9CA3AF" fontSize="6.5" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="bold">UPS / SINE</text>

                <circle cx="192" cy="140" r="3.5" fill="#EF4444" fillOpacity="0.4" />
                <text x="200" y="143" fill="#6B7280" fontSize="6.5" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="bold">FAULT</text>
              </g>

              {/* Lower Section: Ventilation Airflow Louvers */}
              {[168, 173, 178, 183].map((vy, vi) => (
                <line key={vi} x1="52" y1={vy} x2="268" y2={vy} stroke="#27272A" strokeWidth="2" strokeLinecap="round" />
              ))}

              {/* Bottom Inverter Spec Tag */}
              <text
                x="160"
                y="192"
                textAnchor="middle"
                fill="#71717A"
                fontFamily="JetBrains Mono, monospace"
                fontWeight="bold"
                fontSize="8"
                letterSpacing="1"
              >
                MICROCONTROLLER BASED DIGITAL SINE WAVE HOME UPS
              </text>
            </g>
          ) : isInverter ? (
            /* --- TALL TUBULAR INVERTER BATTERY --- */
            <g>
              {/* Battery Handle Top */}
              <rect x="90" y="24" width="140" height="8" rx="4" fill="#374151" />
              <rect x="80" y="28" width="12" height="24" rx="2" fill="#4B5563" />
              <rect x="228" y="28" width="12" height="24" rx="2" fill="#4B5563" />

              {/* 6 Float Indicators for Tubular */}
              {[62, 101, 140, 179, 218, 257].map((cx, idx) => (
                <g key={idx}>
                  {/* Stem */}
                  <rect x={cx - 3} y="32" width="6" height="20" rx="1" fill="#E5E7EB" />
                  {/* Float cap */}
                  <circle cx={cx} cy="32" r="5" fill="#EF4444" />
                  {/* Green float level indicator */}
                  <circle cx={cx} cy="42" r="3.5" fill="#22C55E" />
                </g>
              ))}

              {/* Red & Black Terminals */}
              <rect x="42" y="44" width="16" height="12" rx="2" fill="#EF4444" />
              <circle cx="50" cy="40" r="4" fill="#B91C1C" />
              <text x="47" y="49" fill="#FFFFFF" fontSize="8" fontWeight="bold">+</text>

              <rect x="262" y="44" width="16" height="12" rx="2" fill="#1F2937" />
              <circle cx="270" cy="40" r="4" fill="#111827" />
              <text x="268" y="48" fill="#FFFFFF" fontSize="9" fontWeight="bold">-</text>

              {/* Top Lid */}
              <path
                d="M35 52 H285 C288 52 291 55 291 58 V70 H29 V58 C29 55 32 52 35 52 Z"
                fill={details.lidColor}
              />
              <line x1="30" y1="62" x2="290" y2="62" stroke="#FFFFFF" strokeOpacity="0.2" strokeWidth="1" />

              {/* Tall Battery Body */}
              <rect
                x="32"
                y="70"
                width="256"
                height="134"
                rx="4"
                fill={brand === 'Amaron' ? '#14532D' : brand === 'Microtek' ? '#0F172A' : '#FAFAFA'}
                stroke="#E5E7EB"
                strokeWidth="1.5"
              />

              {/* Vertical Tubular Ribs */}
              {[60, 85, 110, 135, 160, 185, 210, 235, 260].map((x, i) => (
                <line
                  key={i}
                  x1={x}
                  y1="72"
                  x2={x}
                  y2="200"
                  stroke={brand === 'Amaron' ? '#166534' : brand === 'Microtek' ? '#1E293B' : '#E2E8F0'}
                  strokeWidth="2"
                />
              ))}

              {/* Center Brand Plate */}
              <rect
                x="65"
                y="95"
                width="190"
                height="75"
                rx="6"
                fill={brand === 'Amaron' ? '#052E16' : '#FFFFFF'}
                stroke={details.brandColor}
                strokeWidth="2"
                filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.1))"
              />

              {/* Brand Name Text */}
              <text
                x="160"
                y="126"
                textAnchor="middle"
                fill={brand === 'Amaron' ? '#4ADE80' : details.brandColor}
                fontFamily="Cabinet Grotesk, sans-serif"
                fontWeight="900"
                fontSize="22"
                letterSpacing="1.5"
              >
                {details.badgeText}
              </text>

              {/* Model Subtext */}
              <text
                x="160"
                y="142"
                textAnchor="middle"
                fill={brand === 'Amaron' ? '#86EFAC' : '#475569'}
                fontFamily="Plus Jakarta Sans, sans-serif"
                fontWeight="700"
                fontSize="9"
                letterSpacing="1"
              >
                {details.badgeSub}
              </text>

              {/* Capacity Stamp */}
              <rect
                x="115"
                y="149"
                width="90"
                height="15"
                rx="3"
                fill={details.brandColor}
              />
              <text
                x="160"
                y="160"
                textAnchor="middle"
                fill="#FFFFFF"
                fontFamily="JetBrains Mono, monospace"
                fontWeight="bold"
                fontSize="10"
              >
                {capacityAh} Ah · {voltage}V
              </text>

              {/* Wagholi Authorized stamp */}
              <text
                x="160"
                y="190"
                textAnchor="middle"
                fill={brand === 'Amaron' ? '#A7F3D0' : '#64748B'}
                fontFamily="Plus Jakarta Sans, sans-serif"
                fontWeight="600"
                fontSize="7.5"
                letterSpacing="0.5"
              >
                GENUINE TALL TUBULAR · SEALED FACTORY FRESH
              </text>
            </g>
          ) : isTwoWheeler ? (
            /* --- COMPACT TWO-WHEELER / BIKE BATTERY --- */
            <g>
              {/* Terminals */}
              <rect x="70" y="55" width="22" height="15" rx="2" fill="#DC2626" />
              <text x="77" y="66" fill="#FFFFFF" fontSize="10" fontWeight="bold">+</text>

              <rect x="228" y="55" width="22" height="15" rx="2" fill="#1F2937" />
              <text x="236" y="66" fill="#FFFFFF" fontSize="12" fontWeight="bold">-</text>

              {/* Main Compact Body */}
              <rect
                x="60"
                y="68"
                width="200"
                height="136"
                rx="6"
                fill={brand === 'Amaron' ? '#14532D' : '#171717'}
                stroke="#374151"
                strokeWidth="2"
              />

              {/* Top Cap */}
              <rect
                x="60"
                y="68"
                width="200"
                height="28"
                rx="4"
                fill={details.lidColor}
              />

              {/* Brand Label */}
              <rect
                x="75"
                y="108"
                width="170"
                height="68"
                rx="4"
                fill="#000000"
                stroke={details.brandColor}
                strokeWidth="1.5"
              />

              <text
                x="160"
                y="136"
                textAnchor="middle"
                fill={brand === 'Amaron' ? '#4ADE80' : '#FFFFFF'}
                fontFamily="Cabinet Grotesk, sans-serif"
                fontWeight="900"
                fontSize="18"
                letterSpacing="1"
              >
                {details.badgeText}
              </text>

              <text
                x="160"
                y="152"
                textAnchor="middle"
                fill="#E2E8F0"
                fontFamily="Plus Jakarta Sans, sans-serif"
                fontWeight="600"
                fontSize="8"
              >
                VRLA MOTORCYCLE BATTERY
              </text>

              <rect
                x="120"
                y="158"
                width="80"
                height="13"
                rx="2"
                fill={details.brandColor}
              />
              <text
                x="160"
                y="168"
                textAnchor="middle"
                fill="#FFFFFF"
                fontFamily="JetBrains Mono, monospace"
                fontWeight="bold"
                fontSize="9"
              >
                {capacityAh} Ah · {voltage}V
              </text>
            </g>
          ) : (
            /* --- AUTOMOTIVE CAR / TRUCK / COMMERCIAL BATTERY --- */
            <g>
              {/* Carry Handle */}
              <path
                d="M100 48 C100 32, 220 32, 220 48"
                stroke="#1F2937"
                strokeWidth="8"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M100 48 C100 34, 220 34, 220 48"
                stroke="#4B5563"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
              />

              {/* Terminals (Heavy Duty Brass / Lead Posts) */}
              <circle cx="58" cy="62" r="10" fill="#B91C1C" />
              <rect x="52" y="52" width="12" height="14" rx="2" fill="#DC2626" />
              <text x="55" y="63" fill="#FFFFFF" fontSize="10" fontWeight="bold">+</text>

              <circle cx="262" cy="62" r="10" fill="#111827" />
              <rect x="256" y="52" width="12" height="14" rx="2" fill="#1F2937" />
              <text x="260" y="63" fill="#FFFFFF" fontSize="12" fontWeight="bold">-</text>

              {/* Magic Eye Indicator (Green when charged) */}
              <circle cx="105" cy="64" r="6" fill="#111827" stroke="#9CA3AF" strokeWidth="1" />
              <circle cx="105" cy="64" r="3.5" fill="#22C55E" />

              {/* Battery Top Cover */}
              <rect
                x="35"
                y="68"
                width="250"
                height="34"
                rx="5"
                fill={details.lidColor}
              />
              <line x1="35" y1="84" x2="285" y2="84" stroke="#000000" strokeOpacity="0.15" strokeWidth="2" />

              {/* Lower Sturdy Body */}
              <rect
                x="37"
                y="98"
                width="246"
                height="106"
                rx="3"
                fill={brand === 'Amaron' ? '#14532D' : brand === 'Power Zone' ? '#1C1917' : '#18181B'}
                stroke="#374151"
                strokeWidth="1.5"
              />

              {/* Side Grip Ridges */}
              {[46, 52, 268, 274].map((rx, idx) => (
                <line key={idx} x1={rx} y1="102" x2={rx} y2="198" stroke="#334155" strokeWidth="2" />
              ))}

              {/* Front Label Plate */}
              <rect
                x="68"
                y="110"
                width="184"
                height="78"
                rx="6"
                fill={brand === 'Amaron' ? '#022C22' : '#0F172A'}
                stroke={details.brandColor}
                strokeWidth="2"
              />

              {/* Brand Logo Text */}
              <text
                x="160"
                y="136"
                textAnchor="middle"
                fill={brand === 'Amaron' ? '#4ADE80' : brand === 'Exide' ? '#EF4444' : '#F97316'}
                fontFamily="Cabinet Grotesk, sans-serif"
                fontWeight="900"
                fontSize="22"
                letterSpacing="1.5"
              >
                {details.badgeText}
              </text>

              {/* Secondary Subtitle */}
              <text
                x="160"
                y="152"
                textAnchor="middle"
                fill="#CBD5E1"
                fontFamily="Plus Jakarta Sans, sans-serif"
                fontWeight="700"
                fontSize="8.5"
                letterSpacing="1"
              >
                {details.badgeSub}
              </text>

              {/* Spec Pill */}
              <rect
                x="108"
                y="158"
                width="104"
                height="16"
                rx="3"
                fill={details.brandColor}
              />
              <text
                x="160"
                y="170"
                textAnchor="middle"
                fill="#FFFFFF"
                fontFamily="JetBrains Mono, monospace"
                fontWeight="bold"
                fontSize="10"
              >
                {capacityAh} Ah · 12V SMF
              </text>

              {/* Bottom Trust Tag */}
              <text
                x="160"
                y="196"
                textAnchor="middle"
                fill="#94A3B8"
                fontFamily="Plus Jakarta Sans, sans-serif"
                fontWeight="600"
                fontSize="7"
                letterSpacing="0.8"
              >
                HIGH CRANKING AMPS · 100% MAINTENANCE FREE
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Floating Brand Label at Bottom */}
      <div className="mt-2 text-center select-none">
        <span className="text-[11px] font-mono font-semibold tracking-wider text-neutral-500 uppercase">
          {isInverterMachine
            ? `${brand} · Pure Sine Wave Home UPS · ${voltage}V`
            : `${brand} · ${capacityAh} Ah · ${voltage}V`}
        </span>
      </div>
    </div>
  );
};
