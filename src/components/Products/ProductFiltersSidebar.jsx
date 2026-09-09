import React from 'react';
import {
  Filter,
  X,
  RotateCcw,
  Check,
} from 'lucide-react';
import {
  READY_TO_BUY_COLLECTIONS,
  READY_TO_BUY_PRINT_TYPES,
} from '../../constants/readyToBuyProducts';
import { useStore } from '../../context/StoreContext';

export function ProductFiltersSidebar({
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
  selectedSizes,
  setSelectedSizes,
  selectedColors,
  setSelectedColors,
  selectedPrintType,
  setSelectedPrintType,
  selectedCollection,
  setSelectedCollection,
  inStockOnly,
  setInStockOnly,
  onResetFilters,
  totalResultsCount,
  isMobileDrawer = false,
  onCloseMobileDrawer,
}) {
  const { categories = [] } = useStore();

  const categoryItems = [
    { id: 'all', label: 'All Products', icon: '✨' },
    ...categories.map((c) => ({
      id: c.name,
      label: c.name,
      icon: c.icon || '🏷️',
    })),
  ];

  const priceOptions = [
    { id: 'all', label: 'All Prices' },
    { id: 'under_299', label: 'Under ₹299', min: 0, max: 299 },
    { id: '300_499', label: '₹300 – ₹499', min: 300, max: 499 },
    { id: '500_999', label: '₹500 – ₹999', min: 500, max: 999 },
    { id: '1000_plus', label: '₹1,000+', min: 1000, max: 99999 },
  ];

  const sizeOptions = ['S', 'M', 'L', 'XL', '2XL', '3XL'];

  const colorOptions = [
    { name: 'Primary Dark Green', hex: '#183630' },
    { name: 'Primary Beige', hex: '#E5DAC9' },
    { name: 'Soft Gold', hex: '#E5C690' },
    { name: 'Highlight Taupe', hex: '#B8A98F' },
  ];

  const toggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (colorHex) => {
    setSelectedColors((prev) =>
      prev.includes(colorHex) ? prev.filter((c) => c !== colorHex) : [...prev, colorHex]
    );
  };

  return (
    <div className={`space-y-6 select-none ${isMobileDrawer ? 'p-6 bg-[#183630] overflow-y-auto h-full text-[#E5DAC9]' : 'text-[#183630]'}`}>
      {/* Header & Reset */}
      <div className="flex items-center justify-between border-b border-[#B8A98F]/40 pb-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#183630]" />
          <span className="text-xs font-black text-[#183630] font-display uppercase tracking-wider">
            Filters
          </span>
          <span className="text-[10px] text-[#183630]/70 font-mono">({totalResultsCount} items)</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onResetFilters}
            className="text-[11px] text-[#183630] hover:text-[#183630]/70 font-bold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>

          {isMobileDrawer && (
            <button
              type="button"
              onClick={onCloseMobileDrawer}
              className="p-1 rounded-lg text-[#E5DAC9]/70 hover:text-[#E5DAC9] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* 1. Category Filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-[#183630] uppercase tracking-wider block font-mono">
          Category
        </label>
        <div className="space-y-1">
          {categoryItems.map((cat) => {
            const isSelected =
              (selectedCategory || 'all').toLowerCase() === cat.id.toLowerCase();
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`w-full px-3 py-1.5 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#183630] text-[#E5DAC9] font-bold border border-[#183630]'
                    : 'text-[#183630]/80 hover:text-[#183630] hover:bg-[#183630]/10'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#E5C690]" />}
              </button>
            );
          })}
          {categories.length === 0 && (
            <p className="text-[11px] text-[#183630]/70 font-sans italic px-1 pt-0.5">
              Custom categories can be created in Admin.
            </p>
          )}
        </div>
      </div>

      {/* 2. Price Range */}
      <div className="space-y-2 pt-2 border-t border-[#B8A98F]/40">
        <label className="text-xs font-bold text-[#183630] uppercase tracking-wider block font-mono">
          Price Range
        </label>
        <div className="space-y-1">
          {priceOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setPriceRange(opt.id)}
              className={`w-full px-3 py-1.5 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                priceRange === opt.id
                  ? 'bg-[#183630] text-[#E5DAC9] font-bold border border-[#183630]'
                  : 'text-[#183630]/80 hover:text-[#183630] hover:bg-[#183630]/10'
              }`}
            >
              <span>{opt.label}</span>
              {priceRange === opt.id && <Check className="w-3.5 h-3.5 text-[#E5C690]" />}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Sizes */}
      <div className="space-y-2 pt-2 border-t border-[#B8A98F]/40">
        <label className="text-xs font-bold text-[#183630] uppercase tracking-wider block font-mono">
          Size
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {sizeOptions.map((sz) => {
            const isSelected = selectedSizes.includes(sz);
            return (
              <button
                key={sz}
                type="button"
                onClick={() => toggleSize(sz)}
                className={`py-1.5 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                  isSelected
                    ? 'bg-[#183630] border-[#183630] text-[#E5DAC9] font-black shadow-sm'
                    : 'bg-[#E5DAC9] border-[#B8A98F] text-[#183630] hover:border-[#183630]'
                }`}
              >
                {sz}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Colors */}
      <div className="space-y-2 pt-2 border-t border-[#B8A98F]/40">
        <label className="text-xs font-bold text-[#183630] uppercase tracking-wider block font-mono">
          Color
        </label>
        <div className="flex flex-wrap gap-2">
          {colorOptions.map((c) => {
            const isSelected = selectedColors.includes(c.hex);
            return (
              <button
                key={c.name}
                type="button"
                onClick={() => toggleColor(c.hex)}
                className={`relative w-6 h-6 rounded-full border transition-all flex items-center justify-center cursor-pointer ${
                  isSelected ? 'scale-125 border-[#183630] ring-2 ring-[#E5C690]' : 'border-[#B8A98F] hover:scale-110'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              >
                {isSelected && <Check className="w-3.5 h-3.5 text-[#E5C690]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Print Method */}
      <div className="space-y-2 pt-2 border-t border-[#B8A98F]/40">
        <label className="text-xs font-bold text-[#183630] uppercase tracking-wider block font-mono">
          Print Technology
        </label>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => setSelectedPrintType('all')}
            className={`w-full px-3 py-1.5 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
              selectedPrintType === 'all'
                ? 'bg-[#183630] text-[#E5DAC9] font-bold border border-[#183630]'
                : 'text-[#183630]/80 hover:text-[#183630] hover:bg-[#183630]/10'
            }`}
          >
            <span>All Print Types</span>
            {selectedPrintType === 'all' && <Check className="w-3.5 h-3.5 text-[#E5C690]" />}
          </button>
          {READY_TO_BUY_PRINT_TYPES.map((pt) => (
            <button
              key={pt.id}
              type="button"
              onClick={() => setSelectedPrintType(pt.id)}
              className={`w-full px-3 py-1.5 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                selectedPrintType === pt.id
                  ? 'bg-[#183630] text-[#E5DAC9] font-bold border border-[#183630]'
                  : 'text-[#183630]/80 hover:text-[#183630] hover:bg-[#183630]/10'
              }`}
            >
              <span>{pt.name}</span>
              {selectedPrintType === pt.id && <Check className="w-3.5 h-3.5 text-[#E5C690]" />}
            </button>
          ))}
        </div>
      </div>

      {/* 6. Collections */}
      <div className="space-y-2 pt-2 border-t border-[#B8A98F]/40">
        <label className="text-xs font-bold text-[#183630] uppercase tracking-wider block font-mono">
          Collection
        </label>
        <div className="space-y-1">
          {READY_TO_BUY_COLLECTIONS.map((col) => (
            <button
              key={col}
              type="button"
              onClick={() => setSelectedCollection(col)}
              className={`w-full px-3 py-1.5 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                selectedCollection === col
                  ? 'bg-[#183630] text-[#E5DAC9] font-bold border border-[#183630]'
                  : 'text-[#183630]/80 hover:text-[#183630] hover:bg-[#183630]/10'
              }`}
            >
              <span>{col}</span>
              {selectedCollection === col && <Check className="w-3.5 h-3.5 text-[#E5C690]" />}
            </button>
          ))}
        </div>
      </div>

      {/* 7. In-Stock Only Toggle */}
      <div className="pt-2 border-t border-[#B8A98F]/40">
        <label className="flex items-center justify-between cursor-pointer py-1">
          <span className="text-xs font-bold text-[#183630]">In Stock Items Only</span>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="w-4 h-4 rounded bg-[#E5DAC9] border-[#B8A98F] accent-[#183630] cursor-pointer"
          />
        </label>
      </div>
    </div>
  );
}
