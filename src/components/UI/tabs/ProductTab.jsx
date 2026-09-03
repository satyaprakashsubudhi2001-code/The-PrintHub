import React from 'react';
import { Check, Star, Sparkles, Box } from 'lucide-react';
import { useCustomizer } from '../../../context/CustomizerContext';
import { PRODUCTS } from '../../../constants/products';

export function ProductTab() {
  const { selectedProduct, selectProduct } = useCustomizer();

  const getIconForProduct = (id) => {
    switch (id) {
      case 'tshirt':
      case 'oversized-tshirt':
        return '👕';
      case 'jersey':
        return '🎽';
      case 'hoodie':
        return '🧥';
      case 'sweatshirt':
        return '🥋';
      case 'cap':
        return '🧢';
      case 'mug':
        return '☕';
      default:
        return '👕';
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <span>Select 3D Product</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-brand-400 font-semibold">
            {PRODUCTS.length} Models
          </span>
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Choose a physical garment or drinkware to customize in 3D.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {PRODUCTS.map((product) => {
          const isSelected = selectedProduct.id === product.id;
          return (
            <button
              key={product.id}
              onClick={() => selectProduct(product)}
              className={`w-full text-left p-3.5 rounded-2xl transition-all relative flex items-start gap-3.5 border ${
                isSelected
                  ? 'bg-slate-800/90 border-brand-500 shadow-glow-orange ring-1 ring-brand-500'
                  : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/70 hover:border-slate-600'
              }`}
            >
              {/* Product Avatar Icon */}
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                {getIconForProduct(product.id)}
              </div>

              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold text-white truncate">
                    {product.name}
                  </span>
                  <span className="text-xs font-black text-brand-400 shrink-0">
                    ₹{product.basePrice}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                  {product.subtitle}
                </p>

                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-0.5 rounded-md bg-slate-900/80 text-[10px] font-semibold text-slate-300 border border-slate-700/60">
                    {product.category}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-amber-400 font-semibold">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{product.rating}</span>
                    <span className="text-slate-500">({product.reviewsCount})</span>
                  </div>
                  <span className="text-[10px] text-slate-500 ml-auto">
                    {product.printAreas.length} Print Zones
                  </span>
                </div>
              </div>

              {/* Selected Check Badge */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-brand-500 text-white flex items-center justify-center shadow-md">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
