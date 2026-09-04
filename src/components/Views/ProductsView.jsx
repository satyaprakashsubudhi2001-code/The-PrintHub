import React, { useState, useMemo } from 'react';
import {
  Search,
  Sparkles,
  Box,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  ShoppingBag,
  Layers,
  MessageCircle,
  Tag,
  Check,
  ChevronDown,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { INITIAL_PRODUCTS } from '../../constants/products';
import { ProductCard } from '../Products/ProductCard';

/**
 * ProductsView — The PrintHub Catalog & Discovery Hub
 * Features:
 * - Direct connection with global search and category context
 * - Filter tabs: All Products, Customizable Blanks (3D Studio), Ready to Order
 * - Category filter pills
 * - Sorting: Featured, Price Low-High, Price High-Low, Highest Rated
 * - 4-column responsive grid with strictly controlled 1:1 image aspect ratio
 * - Direct WhatsApp bulk quote banner
 */
export function ProductsView() {
  const {
    products,
    readyToBuyProducts = [],
    navigateTo,
    themeMode,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
  } = useStore();

  const isLight = themeMode === 'light';

  // Local filter states
  const [productType, setProductType] = useState('all'); // 'all' | 'customizable' | 'ready'
  const [sortBy, setSortBy] = useState('recommended'); // 'recommended' | 'price-asc' | 'price-desc' | 'rating-desc'
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Available Category Taxonomy
  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'Apparel', label: 'T-Shirts & Apparel' },
    { id: 'Drinkware', label: 'Mugs & Drinkware' },
    { id: 'Headwear', label: 'Caps & Headwear' },
    { id: 'Accessories', label: 'Badges & Accessories' },
    { id: 'Corporate', label: 'Corporate Gifts' },
  ];

  // Combine customizable blanks and ready-to-order catalog
  const allCustomProducts = (products && products.length > 0 ? products : INITIAL_PRODUCTS).map((p) => ({
    ...p,
    isCustomizable: true,
  }));

  const allReadyProducts = (readyToBuyProducts || []).map((p) => ({
    ...p,
    isCustomizable: false,
  }));

  // Filtering & Sorting
  const filteredProducts = useMemo(() => {
    let pool = [];

    if (productType === 'all') {
      pool = [...allCustomProducts, ...allReadyProducts];
    } else if (productType === 'customizable') {
      pool = [...allCustomProducts];
    } else {
      pool = [...allReadyProducts];
    }

    // Filter by Category
    if (selectedCategory && selectedCategory !== 'all') {
      const catLower = selectedCategory.toLowerCase();
      pool = pool.filter((product) => {
        const pCat = (product.category || '').toLowerCase();
        const pSub = (product.subtitle || '').toLowerCase();
        const pName = (product.name || '').toLowerCase();

        if (catLower === 'apparel' || catLower === 't-shirts') {
          return pCat.includes('apparel') || pCat.includes('t-shirt') || pCat.includes('clothing') || pSub.includes('cotton') || pSub.includes('tee');
        }
        if (catLower === 'drinkware' || catLower === 'mugs') {
          return pCat.includes('drinkware') || pCat.includes('mug') || pCat.includes('bottle') || pSub.includes('ceramic');
        }
        if (catLower === 'headwear' || catLower === 'caps') {
          return pCat.includes('headwear') || pCat.includes('cap') || pCat.includes('hat') || pSub.includes('snapback');
        }
        if (catLower === 'accessories' || catLower === 'badges') {
          return pCat.includes('accessories') || pCat.includes('badge') || pCat.includes('apron') || pCat.includes('keychain');
        }
        if (catLower === 'corporate') {
          return pCat.includes('corporate') || pCat.includes('gift') || pCat.includes('promo');
        }
        return pCat.includes(catLower) || pName.includes(catLower);
      });
    }

    // Filter by Search Query
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      pool = pool.filter((product) => {
        const matchName = product.name?.toLowerCase().includes(q);
        const matchSubtitle = product.subtitle?.toLowerCase().includes(q);
        const matchDescription = product.description?.toLowerCase().includes(q);
        const matchCategory = product.category?.toLowerCase().includes(q);
        const matchBadge = product.badge?.toLowerCase().includes(q);
        return matchName || matchSubtitle || matchDescription || matchCategory || matchBadge;
      });
    }

    // Sorting
    const sorted = [...pool];
    if (sortBy === 'price-asc') {
      sorted.sort((a, b) => (a.price || a.basePrice || 0) - (b.price || b.basePrice || 0));
    } else if (sortBy === 'price-desc') {
      sorted.sort((a, b) => (b.price || b.basePrice || 0) - (a.price || a.basePrice || 0));
    } else if (sortBy === 'rating-desc') {
      sorted.sort((a, b) => (b.rating || 4.8) - (a.rating || 4.8));
    }

    return sorted;
  }, [allCustomProducts, allReadyProducts, productType, selectedCategory, searchQuery, sortBy]);

  const hasActiveFilters = (selectedCategory && selectedCategory !== 'all') || (searchQuery && searchQuery.trim()) || productType !== 'all';

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setProductType('all');
    setSortBy('recommended');
  };

  return (
    <div className={`w-full min-h-screen pb-24 transition-colors duration-300 ${
      isLight ? 'bg-[#F8F9FC] text-[#0F172A]' : 'bg-[#080812] text-white'
    }`}>
      {/* 
        =======================================================================
        TOP HEADER & BREADCRUMB BANNER
        ======================================================================= 
      */}
      <div className={`border-b transition-colors ${
        isLight ? 'bg-white border-slate-200/80' : 'bg-[#0E0E14] border-[#1E1E24]'
      }`}>
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                <button
                  onClick={() => navigateTo('home')}
                  className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
                >
                  Home
                </button>
                <span>/</span>
                <span className={isLight ? 'text-slate-800' : 'text-slate-200'}>Catalog</span>
                {selectedCategory !== 'all' && (
                  <>
                    <span>/</span>
                    <span className="text-blue-600 dark:text-cyan-400 capitalize">{selectedCategory}</span>
                  </>
                )}
              </div>

              <h1 className={`text-2xl sm:text-4xl font-extrabold tracking-tight ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>
                Custom Merchandise & Print Catalog
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
                Discover high-grade customizable blanks ready for 3D live preview and instant WhatsApp order placement. High-definition thermal DTF & sublimation with zero MOQ.
              </p>
            </div>

            {/* Quick 3D Studio Entry Button */}
            <div className="shrink-0 flex items-center gap-3">
              <button
                onClick={() => navigateTo('design-by-customer')}
                className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer ${
                  isLight
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Open 3D Studio</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 
        =======================================================================
        FILTER & CONTROLS TOOLBAR
        ======================================================================= 
      */}
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-5">
        <div className={`p-4 rounded-2xl border transition-all ${
          isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-[#121318] border-[#22232C]'
        }`}>
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Product Type Tabs (All / Customizable / Ready to Order) */}
            <div className={`flex items-center p-1 rounded-xl border text-xs font-semibold ${
              isLight ? 'bg-slate-100/80 border-slate-200' : 'bg-[#181922] border-[#262734]'
            }`}>
              <button
                type="button"
                onClick={() => setProductType('all')}
                className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  productType === 'all'
                    ? isLight
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'bg-cyan-500 text-slate-950 font-extrabold shadow-xs'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>All Products</span>
                <span className="text-[10px] opacity-70">({allCustomProducts.length + allReadyProducts.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setProductType('customizable')}
                className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  productType === 'customizable'
                    ? isLight
                      ? 'bg-white text-blue-600 shadow-xs font-bold'
                      : 'bg-cyan-500 text-slate-950 font-extrabold shadow-xs'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>3D Customizer Blanks</span>
                <span className="text-[10px] opacity-70">({allCustomProducts.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setProductType('ready')}
                className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  productType === 'ready'
                    ? isLight
                      ? 'bg-white text-emerald-600 shadow-xs font-bold'
                      : 'bg-cyan-500 text-slate-950 font-extrabold shadow-xs'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Ready to Order</span>
                <span className="text-[10px] opacity-70">({allReadyProducts.length})</span>
              </button>
            </div>

            {/* Search Input & Sort Dropdown */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Filter by keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-9 pr-8 py-2 rounded-xl text-xs font-medium focus:outline-none transition-all ${
                    isLight
                      ? 'bg-slate-100 border border-slate-200 text-slate-900 focus:bg-white focus:border-blue-600'
                      : 'bg-[#181922] border border-[#272834] text-white focus:border-cyan-400'
                  }`}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Sort By Dropdown */}
              <div className="relative w-full sm:w-auto shrink-0">
                <button
                  type="button"
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className={`w-full sm:w-auto px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center justify-between gap-2 transition-all cursor-pointer ${
                    isLight
                      ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      : 'bg-[#181922] border-[#272834] text-slate-300 hover:bg-[#20212c]'
                  }`}
                >
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {sortBy === 'recommended' && 'Featured'}
                    {sortBy === 'price-asc' && 'Price: Low to High'}
                    {sortBy === 'price-desc' && 'Price: High to Low'}
                    {sortBy === 'rating-desc' && 'Top Rated'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {isSortOpen && (
                  <div
                    className={`absolute right-0 mt-1.5 w-48 rounded-xl border shadow-xl z-30 py-1 text-xs overflow-hidden ${
                      isLight
                        ? 'bg-white border-slate-200 text-slate-800'
                        : 'bg-[#16171E] border-[#2A2B36] text-slate-200'
                    }`}
                  >
                    {[
                      { id: 'recommended', label: 'Featured & Popular' },
                      { id: 'price-asc', label: 'Price: Low to High' },
                      { id: 'price-desc', label: 'Price: High to Low' },
                      { id: 'rating-desc', label: 'Top Rated' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setSortBy(opt.id);
                          setIsSortOpen(false);
                        }}
                        className={`w-full px-3.5 py-2 text-left flex items-center justify-between transition-colors cursor-pointer ${
                          sortBy === opt.id
                            ? isLight
                              ? 'bg-blue-50 text-blue-600 font-bold'
                              : 'bg-cyan-500/10 text-cyan-400 font-bold'
                            : isLight
                            ? 'hover:bg-slate-50'
                            : 'hover:bg-[#1E1F2A]'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {sortBy === opt.id && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Category Pill Filters */}
          <div className="pt-3.5 mt-3.5 border-t border-dashed flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5 border-slate-200 dark:border-[#22232C]">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
              <SlidersHorizontal className="w-3 h-3" />
              Category:
            </span>
            {categories.map((cat) => {
              const isSelected = (selectedCategory || 'all').toLowerCase() === cat.id.toLowerCase();
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                    isSelected
                      ? isLight
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-white text-slate-950 font-bold shadow-xs'
                      : isLight
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                      : 'bg-[#181922] hover:bg-[#20212C] text-slate-400 hover:text-white border border-[#272834]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 
          =======================================================================
          ACTIVE FILTERS & RESULTS COUNT BAR
          ======================================================================= 
        */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-slate-500">
              Showing <strong className={isLight ? 'text-slate-900' : 'text-white'}>{filteredProducts.length}</strong> products
            </span>

            {/* Active Badges */}
            {selectedCategory && selectedCategory !== 'all' && (
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                isLight ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
              }`}>
                <span>Category: {selectedCategory}</span>
                <button onClick={() => setSelectedCategory('all')} className="hover:opacity-75">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {searchQuery && (
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                isLight ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}>
                <span>Keyword: "{searchQuery}"</span>
                <button onClick={() => setSearchQuery('')} className="hover:opacity-75">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {productType !== 'all' && (
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                isLight ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-purple-500/10 text-purple-400 border-purple-500/30'
              }`}>
                <span>Type: {productType === 'customizable' ? '3D Studio Blanks' : 'Ready to Order'}</span>
                <button onClick={() => setProductType('all')} className="hover:opacity-75">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-xs text-rose-500 hover:text-rose-600 font-semibold underline ml-1 cursor-pointer"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* 
          =======================================================================
          PRODUCTS GRID (4-Columns Desktop, 3-Columns Tablet, 2-Columns Mobile)
          ======================================================================= 
        */}
        {filteredProducts.length === 0 ? (
          <div className={`text-center py-20 px-4 rounded-3xl border ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#121318] border-[#22232C]'
          }`}>
            <Box className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
              No products found
            </h3>
            <p className="text-xs max-w-md mx-auto text-slate-500 mt-1 mb-6">
              We couldn't find any products matching your current filters. Try resetting the filters or searching for another keyword.
            </p>
            <button
              onClick={resetFilters}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isLight ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-white text-slate-950 font-bold hover:bg-slate-200'
              }`}
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* 
          =======================================================================
          BULK ENQUIRY / WHATSAPP BANNER
          ======================================================================= 
        */}
        <div className={`mt-14 rounded-2xl border p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 transition-all ${
          isLight
            ? 'bg-gradient-to-r from-blue-50 to-indigo-50/50 border-blue-100 text-slate-900'
            : 'bg-gradient-to-r from-[#12131E] to-[#151322] border-[#28273A] text-white'
        }`}>
          <div className="space-y-1.5 text-center md:text-left">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              BULK WHOLESALE RATES
            </span>
            <h3 className="text-base sm:text-lg font-bold">
              Looking for Custom Corporate Merchandise or 50+ Units?
            </h3>
            <p className="text-xs text-slate-500 max-w-xl">
              Get direct tiered wholesale pricing, free physical sample swatches, and priority design proofing via WhatsApp.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="https://wa.me/917992801158?text=Hello%20The%20PrintHub%2C%20I%20am%20looking%20for%20bulk%20custom%20merchandise%20pricing."
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all hover:scale-102 active:scale-98"
            >
              <MessageCircle className="w-4 h-4 fill-white/20" />
              <span>WhatsApp Bulk Enquiry</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductsView;
