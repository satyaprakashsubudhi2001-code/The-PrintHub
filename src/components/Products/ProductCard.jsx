import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Star,
  Eye,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

/**
 * ProductCard Component — The PrintHub Bespoke Atelier Blanks
 * High-fashion lookbook presentation, architectural typography, material specs & direct 3D Atelier entry.
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
      className={`group relative rounded-3xl border transition-all duration-500 flex flex-col justify-between overflow-hidden select-none cursor-pointer ${
        isLight
          ? 'bg-white border-fog-sand hover:border-fog-800/60 shadow-sm hover:shadow-xl'
          : 'bg-fog-900/90 border-fog-800 hover:border-stone-500 shadow-xl hover:shadow-2xl'
      }`}
    >
      {/* Product Image Container — 4:5 Editorial Lookbook Ratio */}
      <div className={`relative aspect-[4/4.8] overflow-hidden flex items-center justify-center p-6 transition-colors ${
        isLight ? 'bg-fog-stone' : 'bg-fog-950'
      }`}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Minimal Lookbook Capsule Tag */}
        <div className="absolute top-3.5 left-3.5 flex flex-col gap-1 z-10">
          {product.badge && (
            <span className={`px-3 py-1 rounded-full text-[9px] font-mono tracking-[0.2em] uppercase border backdrop-blur-md ${
              isLight
                ? 'bg-fog-950 text-fog-stone border-fog-800'
                : 'bg-fog-950/90 text-fog-gold border-fog-800'
            }`}>
              {product.badge}
            </span>
          )}
        </div>

        {/* Floating Quick Action Preview on Hover */}
        <div className="absolute inset-x-4 bottom-4 z-10 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hidden sm:block">
          <div className="w-full py-2.5 rounded-xl bg-fog-950/90 backdrop-blur-md text-fog-stone text-[10px] font-mono tracking-[0.2em] uppercase flex items-center justify-center gap-2 shadow-xl border border-white/10">
            <Eye className="w-3.5 h-3.5 text-fog-gold" />
            <span>LAUNCH 3D ATELIER</span>
          </div>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-[10px] font-mono tracking-wider">
            <span className={`uppercase font-semibold ${isLight ? 'text-stone-500' : 'text-stone-400'}`}>
              {product.category || 'Apparel'}
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-fog-gold fill-fog-gold" />
              <span className={`font-bold ${isLight ? 'text-stone-700' : 'text-stone-300'}`}>{rating}</span>
              <span className="text-stone-500">({reviews})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className={`font-display text-sm sm:text-base font-bold uppercase tracking-wider line-clamp-1 transition-colors ${
            isLight ? 'text-fog-950 group-hover:text-stone-600' : 'text-fog-bone group-hover:text-fog-gold'
          }`}>
            {product.name}
          </h3>

          {/* Fabric & Silhouette Metadata */}
          <p className="text-[11px] text-stone-500 font-sans line-clamp-1 leading-relaxed">
            {product.subtitle || '240+ GSM Combed Cotton • Bio-Washed • 300 DPI'}
          </p>
        </div>

        {/* Price & Action Button */}
        <div className={`pt-3 border-t flex items-center justify-between gap-2 ${
          isLight ? 'border-fog-sand' : 'border-fog-800'
        }`}>
          <div>
            <span className="text-[9px] uppercase font-mono tracking-widest text-stone-400 block">Atelier Base</span>
            <span className={`font-mono text-sm sm:text-base font-bold ${
              isLight ? 'text-fog-950' : 'text-fog-bone'
            }`}>
              ₹{startingPrice}
            </span>
          </div>

          <button
            type="button"
            onClick={handleStartDesigning}
            className="btn-luxury-primary px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-[11px] font-mono tracking-[0.16em] uppercase flex items-center gap-1.5 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
          >
            <Sparkles className="w-3 h-3 text-fog-gold" />
            <span>Customize</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;

