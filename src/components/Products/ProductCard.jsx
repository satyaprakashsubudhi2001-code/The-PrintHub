import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Eye,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

/**
 * ProductCard Component — The PrintHub Custom Merch Blanks
 * Displays indicative starting prices, realistic imagery, and direct "START DESIGNING" action.
 */
export function ProductCard({ product }) {
  const { selectProduct, navigateTo } = useStore();
  const [isHovered, setIsHovered] = useState(false);

  const handleStartDesigning = (e) => {
    e.stopPropagation();
    selectProduct(product);
    navigateTo('design-by-customer');
  };

  const startingPrice = product.basePrice || product.price || 399;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleStartDesigning}
      className="group relative rounded-3xl bg-[#0c101d] border border-slate-800 hover:border-lime-400/60 transition-all duration-300 flex flex-col overflow-hidden shadow-xl hover:-translate-y-1.5 select-none cursor-pointer"
    >
      {/* Product Image Container */}
      <div className="relative aspect-[4/4.2] bg-slate-950 overflow-hidden flex items-center justify-center p-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {product.badge && (
            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase font-mono tracking-wider bg-slate-950/90 text-lime-400 border border-lime-400/30 shadow-md backdrop-blur-md">
              {product.badge}
            </span>
          )}
        </div>
      </div>

      {/* Product Information */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="uppercase tracking-wider">{product.category || 'Apparel'}</span>
            <span className="text-lime-400 font-bold">Starting from ₹{startingPrice}</span>
          </div>

          <h3 className="font-display text-base font-bold text-white group-hover:text-lime-400 transition-colors">
            {product.name}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {product.subtitle || '100% Cotton • Bio-Washed • 300 DPI High-Density DTF Ready'}
          </p>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleStartDesigning}
          className="w-full py-3 rounded-2xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(163,230,53,0.3)] font-display transition-all"
        >
          <Sparkles className="w-4 h-4 text-slate-950" />
          <span>START DESIGNING</span>
          <ArrowRight className="w-4 h-4 text-slate-950" />
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
