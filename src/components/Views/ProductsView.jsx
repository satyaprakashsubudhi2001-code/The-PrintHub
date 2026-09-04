import React, { useState, useMemo } from 'react';
import {
  Search,
  Sparkles,
  Box,
  X,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { INITIAL_PRODUCTS } from '../../constants/products';
import { ProductCard } from '../Products/ProductCard';

/**
 * ProductsView — Custom Product Exploration Hub (Fear of God & Myntra Luxe Inspired)
 * Showcases all customizable blanks (T-Shirts, Polos, Hoodies, Aprons, Mugs, Caps, Badges)
 * with minimalist category filtering, live search, and direct entry into the 3D/2D Design Studio.
 */
export function ProductsView() {
  const { products, navigateTo, themeMode } = useStore();
  const isLight = themeMode === 'light';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const allProducts = products && products.length > 0 ? products : INITIAL_PRODUCTS;

  const categories = [
    { id: 'all', label: 'All Silhouettes' },
    { id: 'Apparel', label: 'Heavyweight Apparel' },
    { id: 'Drinkware', label: 'Vessels & Drinkware' },
    { id: 'Headwear', label: 'Architectural Headwear' },
    { id: 'Accessories', label: 'Atelier Accessories' },
  ];

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = product.name?.toLowerCase().includes(q);
        const matchSubtitle = product.subtitle?.toLowerCase().includes(q);
        const matchCategory = product.category?.toLowerCase().includes(q);
        if (!matchName && !matchSubtitle && !matchCategory) return false;
      }
      return true;
    });
  }, [allProducts, selectedCategory, searchQuery]);

  return (
    <div className={`max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12 select-none pb-32 transition-colors duration-300 ${
      isLight ? 'text-fog-950 bg-fog-bone' : 'text-fog-stone bg-fog-950'
    }`}>
      {/* Editorial Header Banner */}
      <div className={`rounded-3xl border p-8 sm:p-14 relative overflow-hidden transition-all ${
        isLight
          ? 'bg-white border-fog-sand shadow-[0_20px_50px_rgba(0,0,0,0.04)]'
          : 'bg-fog-900 border-fog-800 shadow-[0_25px_60px_rgba(0,0,0,0.4)]'
      }`}>
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className={`inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border text-[10px] font-mono tracking-[0.2em] uppercase ${
            isLight
              ? 'bg-fog-stone border-fog-sand text-fog-800'
              : 'bg-fog-950 border-fog-800 text-fog-gold'
          }`}>
            <Sparkles className="w-3 h-3 text-fog-gold" />
            <span>THE ARCHIVE // CALIBRATED BLANKS</span>
          </div>

          <h1 className={`text-3xl sm:text-5xl font-light font-display uppercase tracking-[0.14em] leading-[1.1] ${
            isLight ? 'text-fog-950' : 'text-fog-bone'
          }`}>
            ARCHITECTURAL <br />
            <span className="font-semibold">SILHOUETTES</span>
          </h1>

          <p className="text-xs sm:text-sm leading-relaxed font-sans text-stone-500 font-light max-w-xl">
            Select any engineered blank below to launch our interactive 3D and 2D atelier. Upload graphics, configure front and back print zones in true physical inches, and proceed with bespoke production.
          </p>
        </div>
      </div>

      {/* Search & Category Filter Controls */}
      <div className={`p-4 sm:p-6 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-4 transition-all ${
        isLight ? 'bg-white border-fog-sand shadow-sm' : 'bg-fog-900/90 border-fog-800'
      }`}>
        {/* Minimalist Category Pills (Myntra Luxe & Fear of God inspired) */}
        <div className="flex items-center gap-2.5 overflow-x-auto w-full md:w-auto no-scrollbar pb-1 md:pb-0">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-mono tracking-[0.16em] uppercase shrink-0 transition-all ${
                  isSelected
                    ? isLight
                      ? 'bg-fog-950 text-white shadow-sm font-bold'
                      : 'bg-white text-fog-950 shadow-sm font-bold'
                    : isLight
                    ? 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                    : 'bg-fog-950 border border-fog-800 text-stone-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Minimalist Frosted Search Bar */}
        <div className="relative w-full md:w-80 shrink-0">
          <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="SEARCH SILHOUETTES..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-9 pr-9 py-2.5 rounded-full text-xs font-mono tracking-wider focus:outline-none transition-all ${
              isLight
                ? 'bg-stone-100 border border-stone-200 text-fog-950 focus:bg-white focus:border-fog-950 placeholder:text-stone-400'
                : 'bg-fog-950 border border-fog-800 text-fog-stone focus:border-fog-gold placeholder:text-stone-500'
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between text-xs font-mono tracking-wider text-stone-500 px-1">
        <span>ARCHIVE: <strong className={isLight ? 'text-fog-950' : 'text-white'}>{filteredProducts.length}</strong> CUSTOMIZABLE SILHOUETTES</span>
        {selectedCategory !== 'all' && (
          <button
            onClick={() => setSelectedCategory('all')}
            className="text-stone-600 dark:text-fog-gold hover:underline flex items-center gap-1 font-bold"
          >
            Clear Filter
          </button>
        )}
      </div>

      {/* Products Grid: 4-cols desktop, 3-cols tablet, 2-cols mobile */}
      {filteredProducts.length === 0 ? (
        <div className={`text-center py-24 space-y-4 rounded-3xl border ${
          isLight
            ? 'bg-white border-fog-sand shadow-sm'
            : 'bg-fog-900 border-fog-800'
        }`}>
          <Box className="w-12 h-12 text-stone-400 mx-auto" />
          <h3 className={`text-base font-bold font-display uppercase tracking-wider ${isLight ? 'text-fog-950' : 'text-white'}`}>
            {allProducts.length === 0 ? 'Archive is Currently Empty' : 'No matching silhouettes found'}
          </h3>
          <p className="text-xs max-w-sm mx-auto text-stone-500">
            {allProducts.length === 0
              ? 'All products have been removed. You can add new custom merchandise blanks anytime from the Admin Atelier Panel.'
              : `We couldn't find anything matching "${searchQuery}". Try searching for another keyword or reset filters.`}
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            {allProducts.length === 0 ? (
              <button
                onClick={() => navigateTo('admin')}
                className="btn-luxury-primary px-6 py-2.5 rounded-full text-xs font-mono uppercase tracking-widest"
              >
                Open Admin Panel
              </button>
            ) : (
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="btn-luxury-ghost px-6 py-2.5 rounded-full text-xs font-mono uppercase tracking-widest"
              >
                Reset All Filters
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductsView;

