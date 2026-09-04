import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Star,
  Eye,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

/**
 * ProductCard Component — The PrintHub Custom Merch Blanks
 * Displays indicative starting prices, realistic imagery, rating metadata, and direct "START DESIGNING" action.
 */
export function ProductCard({ product }) {
  const { selectProduct, navigateTo, themeMode } = useStore();
  const isLight = themeMode === 'light';
  const [isHovered, setIsHovered] = useState(false);

  const handleStartDesigning = (e) => {
    e.stopPropagation();
    selectProduct(product);
    navigateTo('design-by-customer');
  };

  const startingPrice = product.basePrice || product.price || 399;
  const rating = product.rating || 4.9;
  const reviews = product.reviewsCount || product.sales?.days30 || 420;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleStartDesigning}
      className={`group relative rounded-2xl sm:rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden select-none cursor-pointer ${
        isLight
          ? 'bg-white border-slate-200/90 hover:border-slate-400 hover:shadow-xl'
          : 'bg-[#0c101d] border-slate-800 hover:border-lime-400/60 shadow-xl'
      }`}
    >
      {/* Product Image Container */}
      <div className={`relative aspect-square sm:aspect-[4/4.1] overflow-hidden flex items-center justify-center p-4 sm:p-6 transition-colors ${
        isLight ? 'bg-slate-50' : 'bg-slate-950'
      }`}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {product.badge && (
            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase font-mono tracking-wider border shadow-sm ${
              isLight
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-lime-400 text-slate-950 border-lime-400'
            }`}>
              {product.badge}
            </span>
          )}
        </div>

        {/* Floating Quick Action Preview on Hover */}
        <div className="absolute inset-x-3 bottom-3 z-10 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200 hidden sm:block">
          <div className="w-full py-2 rounded-xl bg-slate-950/90 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg">
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>Launch 3D Customizer</span>
          </div>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3 sm:space-y-4">
        <div className="space-y-1 sm:space-y-1.5">
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className={`uppercase tracking-wider font-semibold ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
              {product.category || 'Apparel'}
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className={`font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{rating}</span>
              <span className={`text-[10px] ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>({reviews})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className={`font-display text-sm sm:text-base font-bold line-clamp-1 transition-colors ${
            isLight ? 'text-slate-900 group-hover:text-cyan-700' : 'text-white group-hover:text-lime-400'
          }`}>
            {product.name}
          </h3>

          {/* Subtitle description */}
          <p className={`text-[11px] sm:text-xs line-clamp-1 leading-relaxed ${
            isLight ? 'text-slate-500' : 'text-slate-400'
          }`}>
            {product.subtitle || '100% Combed Cotton • Bio-Washed • 300 DPI DTF'}
          </p>
        </div>

        {/* Price & Action Button */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
          <div>
            <span className={`text-[9px] uppercase font-mono block ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>Starting from</span>
            <span className={`font-display text-base sm:text-lg font-black ${isLight ? 'text-slate-950' : 'text-white'}`}>
              ₹{startingPrice}
            </span>
          </div>

          <button
            type="button"
            onClick={handleStartDesigning}
            className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-[10px] sm:text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm font-display transition-all active:scale-95 shrink-0"
          >
            <Sparkles className="w-3 h-3 text-slate-950" />
            <span>Customize</span>
            <ArrowRight className="w-3 h-3 text-slate-950" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
