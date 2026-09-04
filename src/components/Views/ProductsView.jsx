import React, { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  Sparkles,
  Palette,
  ArrowRight,
  Box,
  X,
  Filter,
  Layers,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { INITIAL_PRODUCTS } from '../../constants/products';
import { ProductCard } from '../Products/ProductCard';

/**
 * ProductsView — Custom Product Exploration Hub
 * Showcases all customizable blanks (T-Shirts, Polos, Hoodies, Aprons, Mugs, Caps, Badges)
 * with category filtering, live search, and direct entry into the 3D/2D Design Studio.
 */
export function ProductsView() {
  const { products, selectProduct, navigateTo, themeMode } = useStore();
  const isLight = themeMode === 'light';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const allProducts = products && products.length > 0 ? products : INITIAL_PRODUCTS;

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'Apparel', label: 'Apparel & Streetwear' },
    { id: 'Drinkware', label: 'Mugs & Drinkware' },
    { id: 'Headwear', label: 'Caps & Headwear' },
    { id: 'Accessories', label: 'Aprons & Badges' },
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
    <div className={`max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 select-none pb-24 transition-colors duration-300 ${
      isLight ? 'text-slate-900 bg-[#F8F9FC]' : 'text-white bg-[#080812]'
    }`}>
      {/* Header Banner */}
      <div className={`rounded-3xl border p-8 sm:p-12 relative overflow-hidden transition-all ${
        isLight
          ? 'bg-white border-slate-200/90 shadow-lg'
          : 'bg-[#0c101d] border-slate-800 shadow-2xl'
      }`}>
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-lime-400 text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-lime-400" />
            <span>Calibrated Product Blanks</span>
          </div>

          <h1 className={`text-3xl sm:text-5xl font-black font-display uppercase tracking-tight leading-tight ${
            isLight ? 'text-slate-950' : 'text-white'
          }`}>
            Explore Product Blanks
          </h1>

          <p className={`text-sm sm:text-base leading-relaxed font-sans ${
            isLight ? 'text-slate-600' : 'text-slate-300'
          }`}>
            Choose any blank below to launch our interactive 3D and 2D design studio. Upload graphics, configure front and back print zones, and submit your request for direct WhatsApp quotation.
          </p>
        </div>
      </div>

      {/* Search & Category Filter Controls */}
      <div className={`p-4 sm:p-6 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-4 transition-all ${
        isLight ? 'bg-white border-slate-200/90 shadow-sm' : 'bg-[#0c101d] border-slate-800'
      }`}>
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto no-scrollbar pb-1 md:pb-0">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2.5 rounded-full text-xs font-bold tracking-wide shrink-0 transition-all font-display uppercase ${
                  isSelected
                    ? isLight
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-lime-400 text-slate-950 shadow-md font-black'
                    : isLight
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80 shrink-0">
          <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${
            isLight ? 'text-slate-400' : 'text-slate-400'
          }`} />
          <input
            type="text"
            placeholder="Search tees, mugs, hoodies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-9 py-2.5 rounded-full text-xs font-medium focus:outline-none transition-all ${
              isLight
                ? 'bg-slate-100 border border-slate-200 text-slate-900 focus:bg-white focus:border-cyan-600 placeholder:text-slate-400'
                : 'bg-slate-900 border border-slate-800 text-white focus:border-cyan-400 placeholder:text-slate-500'
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-500 px-1">
        <span>Showing <strong className={isLight ? 'text-slate-900' : 'text-white'}>{filteredProducts.length}</strong> customizable items</span>
        {selectedCategory !== 'all' && (
          <button
            onClick={() => setSelectedCategory('all')}
            className="text-cyan-600 hover:underline flex items-center gap-1 font-bold"
          >
            Clear Filter
          </button>
        )}
      </div>

      {/* Products Grid: 4-cols desktop, 3-cols tablet, 2-cols mobile */}
      {filteredProducts.length === 0 ? (
        <div className={`text-center py-20 space-y-4 rounded-3xl border ${
          isLight
            ? 'bg-white border-slate-200 shadow-sm'
            : 'bg-[#0c101d] border-slate-800'
        }`}>
          <Box className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className={`text-lg font-bold font-display ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {allProducts.length === 0 ? 'Catalog is Currently Empty' : 'No matching blanks found'}
          </h3>
          <p className={`text-xs max-w-sm mx-auto ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            {allProducts.length === 0
              ? 'All products have been removed. You can add new custom merchandise blanks anytime from the Admin Panel.'
              : `We couldn't find anything matching "${searchQuery}". Try searching for another keyword or reset filters.`}
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            {allProducts.length === 0 ? (
              <button
                onClick={() => navigateTo('admin')}
                className="px-6 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider font-display transition-all shadow-md"
              >
                Open Admin Panel
              </button>
            ) : (
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="px-6 py-2.5 rounded-full bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-xs uppercase tracking-wider font-display transition-all"
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
