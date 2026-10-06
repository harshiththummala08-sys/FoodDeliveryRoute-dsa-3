import React from 'react';
import { Rider } from '../../types';

interface RiderBikeMarkerProps {
  rider: Rider;
  isSelected?: boolean;
  onClick?: () => void;
}

export const RiderBikeMarker: React.FC<RiderBikeMarkerProps> = ({
  rider,
  isSelected = false,
  onClick
}) => {
  const isMoving = rider.status !== 'AVAILABLE';
  const bearing = rider.bearing ?? 0;

  return (
    <div
      onClick={onClick}
      className={`group relative cursor-pointer select-none transition-transform duration-200 ${
        isSelected ? 'scale-125 z-50' : 'hover:scale-110 z-30'
      }`}
      title={`${rider.name} (${rider.id}) - ${rider.status}`}
    >
      {/* Outer Pulse Ring if Moving */}
      {isMoving && (
        <span
          className="absolute -inset-2 rounded-full animate-ping opacity-60 pointer-events-none"
          style={{ backgroundColor: rider.color }}
        />
      )}

      {/* Main Container */}
      <div
        className="relative flex items-center justify-center p-1.5 rounded-full shadow-2xl backdrop-blur-md transition-all duration-300 border"
        style={{
          backgroundColor: '#0b0f19',
          borderColor: isSelected ? '#ffffff' : rider.color,
          boxShadow: isSelected
            ? `0 0 25px ${rider.color}, 0 0 10px rgba(255,255,255,0.8)`
            : `0 0 12px ${rider.color}66`
        }}
      >
        {/* Rotating Motorcycle SVG */}
        <div
          className="transition-transform duration-150 ease-out"
          style={{ transform: `rotate(${bearing}deg)` }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-md"
          >
            {/* Front & Rear Wheels */}
            <circle cx="9" cy="22" r="4.5" stroke={rider.color} strokeWidth="2.5" fill="#111827" />
            <circle cx="23" cy="22" r="4.5" stroke={rider.color} strokeWidth="2.5" fill="#111827" />
            <circle cx="9" cy="22" r="1.5" fill="#ffffff" />
            <circle cx="23" cy="22" r="1.5" fill="#ffffff" />

            {/* Chassis / Frame */}
            <path
              d="M9 22L14 16H20L23 22"
              stroke="#cbd5e1"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Handlebar & Front Fork */}
            <path
              d="M20 16L22 11H24"
              stroke="#f8fafc"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Headlight Beam */}
            {isMoving && (
              <path
                d="M24 11L29 9L29 13Z"
                fill="#38bdf8"
                opacity="0.8"
              />
            )}

            {/* Delivery Backpack / Cargo Box */}
            <rect
              x="8"
              y="11"
              width="6.5"
              height="7"
              rx="1.5"
              fill={rider.color}
              stroke="#ffffff"
              strokeWidth="1"
            />
            {/* Delivery Box Logo symbol */}
            <path
              d="M10 14.5L11.5 16L13.5 13"
              stroke="#ffffff"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Rider Helmet */}
            <circle cx="16" cy="11" r="3" fill="#f1f5f9" stroke="#0f172a" strokeWidth="1" />
          </svg>
        </div>

        {/* Rider Badge Pill */}
        <div
          className="absolute -bottom-4 px-1.5 py-0.2 text-[9px] font-black rounded tracking-wider shadow text-white whitespace-nowrap"
          style={{ backgroundColor: rider.color }}
        >
          {rider.id}
        </div>
      </div>

      {/* Floating Status Tooltip on hover */}
      <div className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:flex items-center gap-1 px-2 py-0.5 rounded bg-black/90 border border-white/20 text-[10px] text-white whitespace-nowrap z-50 shadow-lg">
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: rider.color }} />
        <span>{rider.name}</span>
        <span className="text-gray-400 font-mono">({rider.currentOrders}/{rider.capacity})</span>
      </div>
    </div>
  );
};
