import React, { useState } from 'react';
import {
  ShoppingBag,
  Sparkles,
  Plus,
  Minus,
  Check,
  ChevronUp,
  ChevronDown,
  Tag,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useCustomizer } from '../../context/CustomizerContext';
import { PRINTING_METHODS } from '../../constants/products';

export function BottomActionBar() {
  const {
    selectedProduct,
    selectedSize,
    setSelectedSize,
    quantity,
    setQuantity,
    printingMethod,
    setPrintingMethod,
    calculatePricing,
    addToCart,
  } = useCustomizer();

  const [showMethodDetails, setShowMethodDetails] = useState(false);
  const pricing = calculatePricing();

  const currentMethod =
    PRINTING_METHODS.find((m) => m.id === printingMethod) ||
    PRINTING_METHODS[0];

  const handleAddToCart = () => {
    // Generate snapshot or fallback SVG for cart
    addToCart(null);
  };

  return (
    <div className="border-t border-slate-800 bg-studio-900/95 backdrop-blur-xl p-3 sm:p-4 z-30 select-none shrink-0 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left Section: Size Selector & Printing Method */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Garment Size Picker */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl glass-panel border border-slate-700/60">
            <span className="text-[11px] font-bold text-slate-400 pl-2 pr-1 uppercase">
              Size:
            </span>
            <div className="flex items-center gap-1">
              {selectedProduct.sizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                    selectedSize === sz
                      ? 'bg-brand-500 text-white shadow-glow-orange'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Printing Technique Dropdown/Pill */}
          <div className="relative">
            <button
              onClick={() => setShowMethodDetails(!showMethodDetails)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-2xl glass-panel border border-slate-700/60 text-xs font-medium text-slate-200 hover:text-white transition-all"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentMethod.name}</span>
              {showMethodDetails ? (
                <ChevronUp className="w-3 h-3 text-slate-400" />
              ) : (
                <ChevronDown className="w-3 h-3 text-slate-400" />
              )}
            </button>

            {showMethodDetails && (
              <div className="absolute bottom-full left-0 mb-2 w-72 rounded-2xl glass-dropdown p-2.5 z-50 border border-slate-700 shadow-2xl animate-in fade-in slide-in-from-bottom-2">
                <div className="text-[10px] font-bold tracking-wider text-slate-400 px-2 py-1 uppercase">
                  Printing Techniques
                </div>
                <div className="space-y-1.5 mt-1">
                  {PRINTING_METHODS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setPrintingMethod(m.id);
                        setShowMethodDetails(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl text-xs transition-all border ${
                        printingMethod === m.id
                          ? 'bg-brand-500/20 border-brand-500/50 text-brand-400 font-semibold'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold">{m.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-amber-400 font-semibold">
                          {m.tag}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                        {m.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Section: Quantity, Pricing Breakdown & Add to Cart */}
        <div className="flex items-center justify-between md:justify-end gap-3 sm:gap-5 w-full md:w-auto">
          {/* Quantity Stepper */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase hidden sm:inline">
              Qty:
            </span>
            <div className="flex items-center p-1 rounded-2xl glass-panel border border-slate-700/60">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-7 h-7 rounded-xl flex items-center justify-center text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <input
                type="number"
                min="1"
                max="9999"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-12 text-center text-xs font-bold bg-transparent text-white focus:outline-none"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-7 h-7 rounded-xl flex items-center justify-center text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Pricing Details */}
          <div className="text-right">
            <div className="flex items-baseline justify-end gap-1.5">
              <span className="text-lg sm:text-xl font-black text-white font-display">
                ₹{pricing.totalPrice.toLocaleString()}
              </span>
              {pricing.discountPercent > 0 && (
                <span className="text-xs text-slate-500 line-through">
                  ₹{(pricing.singleUnitPrice * quantity).toLocaleString()}
                </span>
              )}
            </div>
            <div className="flex items-center justify-end gap-1.5 text-[10px]">
              <span className="text-slate-400">₹{pricing.unitPrice}/pc</span>
              {pricing.discountPercent > 0 && (
                <span className="text-emerald-400 font-bold">
                  ({pricing.discountPercent}% off bulk)
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-brand-500 via-brand-600 to-amber-500 hover:from-brand-600 hover:to-brand-700 text-white text-xs sm:text-sm font-black shadow-glow-orange transition-all hover:scale-105 active:scale-95 shrink-0"
          >
            <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}
