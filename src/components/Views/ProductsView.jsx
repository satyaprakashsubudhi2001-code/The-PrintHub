import React, { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  Sparkles,
  Palette,
  ArrowRight,
  Box,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { INITIAL_PRODUCTS } from '../../constants/products';
import { ProductCard } from '../Products/ProductCard';

/**
 * ProductsView — Custom Product Exploration Hub
 * Showcases all customizable blanks (T-Shirts, Polos, Hoodies, Aprons, Mugs, Caps, Badges)
 * with category filtering, search, and direct entry into the 3D/2D Design Studio.
 */
export function ProductsView() {
  const { products, selectProduct, navigateTo } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const allProducts = products && products.length > 0 ? products : INITIAL_PRODUCTS;

  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'Apparel', label: 'Apparel & T-Shirts' },
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
    <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 select-none pb-20">
      {/* Header Banner */}
      <div className="rounded-3xl bg-[#0c101d] border border-slate-800 p-8 sm:p-12 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="text-xs font-mono font-bold text-lime-400 uppercase tracking-wider block">
            CUSTOM MERCHANDISE BLANKS
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white font-display uppercase tracking-tight leading-tight">
            EXPLORE PRODUCT BLANKS
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            Choose any product below to launch our interactive 3D and 2D design studio. Upload your artwork, adjust physical print dimensions in inches, and receive your quotation over WhatsApp.
          </p>
        </div>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-6">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto no-scrollbar pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wider shrink-0 transition-all ${
                selectedCategory === cat.id
                  ? 'bg-lime-400 text-slate-950 font-black shadow-md'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-lime-400 placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 space-y-3 bg-[#0c101d] rounded-3xl border border-slate-800">
          <Box className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No products found</h3>
          <p className="text-xs text-slate-400">Try changing your search query or category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductsView;
