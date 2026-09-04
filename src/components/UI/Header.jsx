import React from 'react';
import {
  ShoppingBag,
  Sparkles,
  Layers,
  Settings,
  RotateCcw,
  Box,
  Sliders,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useCustomizer } from '../../context/CustomizerContext';
import { PRODUCTS } from '../../constants/products';

export function Header() {
  const {
    selectedProduct,
    selectProduct,
    cartItems,
    setIsCartOpen,
    isAdminOpen,
    setIsAdminOpen,
    is2DFallback,
    setIs2DFallback,
    resetCustomization,
  } = useCustomizer();

  const totalCartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <header className="h-16 border-b border-slate-800 bg-studio-900/90 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between z-30 shrink-0 select-none">
      {/* Brand Logo & Tagline */}
      <div className="flex items-center gap-3">
        <img
          src="/brand-dark.png"
          alt="The PrintHub"
          className="h-8 sm:h-9 w-auto object-contain"
        />
        <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-500/20 text-brand-400 border border-brand-500/30 uppercase tracking-wider">
          3D Studio Pro
        </span>
      </div>

      {/* Center Product Quick-Switch Menu */}
      <div className="hidden md:flex items-center gap-1.5 p-1 rounded-2xl glass-panel-subtle border border-slate-700/50">
        {PRODUCTS.map((prod) => (
          <button
            key={prod.id}
            onClick={() => selectProduct(prod)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedProduct.id === prod.id
                ? 'bg-brand-500 text-white shadow-glow-orange'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            {prod.name.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Right Controls: 2D/3D Toggle, Admin UV Manager, Reset, Cart */}
      <div className="flex items-center gap-2.5">
        {/* 2D / 3D Mode Switch */}
        <button
          onClick={() => setIs2DFallback(!is2DFallback)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
            is2DFallback
              ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
              : 'glass-panel text-slate-300 hover:text-white border-slate-700/60'
          }`}
          title="Toggle 2D / 3D Mode"
        >
          <Box className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{is2DFallback ? '2D Mode' : '3D Mode'}</span>
        </button>

        {/* Admin 3D Studio & UV Calibrator */}
        <button
          onClick={() => setIsAdminOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-panel text-slate-300 hover:text-brand-accent hover:border-brand-accent/40 text-xs font-semibold transition-all"
          title="Admin 3D Product & UV Calibration Studio"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Admin Studio</span>
        </button>

        {/* Reset Customization */}
        <button
          onClick={resetCustomization}
          className="p-2 rounded-xl glass-panel text-slate-400 hover:text-rose-400 hover:border-rose-500/40 text-xs transition-all"
          title="Reset Customization"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Cart Trigger */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white text-xs font-bold shadow-glow-orange transition-all"
        >
          <ShoppingBag className="w-4 h-4" />
          <span className="hidden sm:inline">Cart</span>
          {totalCartCount > 0 && (
            <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-white text-brand-600 text-[11px] font-black shadow-md">
              {totalCartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
