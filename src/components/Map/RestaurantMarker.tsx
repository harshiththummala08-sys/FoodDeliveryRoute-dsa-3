import React from 'react';
import { Restaurant } from '../../types';
import { Store, Utensils } from 'lucide-react';

interface RestaurantMarkerProps {
  restaurant: Restaurant;
  onClick?: () => void;
}

export const RestaurantMarker: React.FC<RestaurantMarkerProps> = ({
  restaurant,
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className="group relative cursor-pointer select-none transition-transform hover:scale-115 z-20"
      title={`${restaurant.name} (${restaurant.cuisine})`}
    >
      <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-[#1e1b4b] border border-amber-500/80 shadow-[0_0_15px_rgba(245,158,11,0.35)] text-amber-400">
        <Utensils className="w-4 h-4" />
      </div>

      {/* Floating Mini Label */}
      <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 px-1 py-0.2 rounded bg-amber-950/80 border border-amber-500/40 text-[8px] font-bold text-amber-300 whitespace-nowrap shadow">
        PICKUP
      </div>

      {/* Hover Info Tooltip */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:flex items-center gap-1.5 px-2 py-1 rounded-lg bg-gray-950/95 border border-amber-500/40 text-[11px] text-white whitespace-nowrap z-50 shadow-xl pointer-events-none">
        <Store className="w-3.5 h-3.5 text-amber-400" />
        <span className="font-semibold text-amber-300">{restaurant.name}</span>
        <span className="text-gray-400">~{restaurant.prepTimeMin}m prep</span>
      </div>
    </div>
  );
};
