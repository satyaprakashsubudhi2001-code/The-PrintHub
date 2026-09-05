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
    products = [],
    readyToBuyProducts = [],
    adminUser,
    navigateTo,
    themeMode,
    categories = [],
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    wishlist = [],
    showWishlistOnly,
    setShowWishlistOnly,
  } = useStore();

  const isLight = themeMode === 'light';

  // Local filter states
  const [productType, setProductType] = useState('all'); // 'all' | 'customizable' | 'ready'
  const [sortBy, setSortBy] = useState('recommended'); // 'recommended' | 'price-asc' | 'price-desc' | 'rating-desc'
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Dynamic Category Options
  const categoryOptions = useMemo(() => {
    return [
      { id: 'all', label: 'All Categories' },
      ...categories.map((c) => ({
        id: c.name,
        slug: c.slug,
        label: c.name,
        icon: c.icon,
      })),
    ];
  }, [categories]);

  // Combine customizable blanks and ready-to-order catalog
  const allCustomProducts = (products || [])
    .filter((p) => p.isCustomizable !== false)
    .map((p) => ({
      ...p,
      isCustomizable: true,
    }));

  const allReadyProducts = [
    ...(products || []).filter((p) => p.isReadyToBuy),
    ...(readyToBuyProducts || []),
  ].map((p) => ({
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

    // Filter by Wishlist only if requested
    if (showWishlistOnly) {
      pool = pool.filter((product) => wishlist.includes(product.id));
    }

    // Filter by Category
    if (selectedCategory && selectedCategory !== 'all') {
      const targetCat = categories.find(
        (c) =>
          c.id === selectedCategory ||
          c.name.toLowerCase() === selectedCategory.toLowerCase() ||
          (c.slug && c.slug.toLowerCase() === selectedCategory.toLowerCase())
      );
      const catLower = (targetCat ? targetCat.name : selectedCategory).toLowerCase();
      const slugLower = (targetCat?.slug || '').toLowerCase();

      pool = pool.filter((product) => {
        const pCat = (product.category || '').toLowerCase();
        const pCatKey = (product.categoryKey || '').toLowerCase();
        const pSub = (product.subtitle || '').toLowerCase();
        const pName = (product.name || '').toLowerCase();

        return (
          pCat === catLower ||
          pCatKey === catLower ||
          (slugLower && (pCat === slugLower || pCatKey === slugLower)) ||
          pCat.includes(catLower) ||
          pName.includes(catLower) ||
          pSub.includes(catLower)
        );
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
  }, [allCustomProducts, allReadyProducts, productType, selectedCategory, searchQuery, sortBy, showWishlistOnly, wishlist]);

  const hasActiveFilters =
    (selectedCategory && selectedCategory !== 'all') ||
    (searchQuery && searchQuery.trim()) ||
    productType !== 'all' ||
    showWishlistOnly;

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setProductType('all');
    setSortBy('recommended');
    if (setShowWishlistOnly) setShowWishlistOnly(false);
  };

  return (
    <div className={`w-full min-h-screen pb-24 transition-colors duration-300 ${
      isLight ? 'bg-[#FFFFFF] text-[#000000]' : 'bg-[#12002E] text-white'
    }`}>
      {/* 
        =======================================================================
        TOP HEADER & BREADCRUMB BANNER
        ======================================================================= 
      */}
      <div className="border-b bg-white border-slate-200 transition-colors">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                <button
                  onClick={() => navigateTo('home')}
                  className="hover:text-[#DA0090] transition-colors cursor-pointer"
                >
                  Home
                </button>
                <span>/</span>
                <span className="text-slate-700">Catalog</span>
                {selectedCategory !== 'all' && (
                  <>
                    <span>/</span>
                    <span className="text-[#2C0E63] capitalize font-bold">{selectedCategory}</span>
                  </>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#2C0E63]">
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
                className="px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black shadow-md transition-all flex items-center gap-2 cursor-pointer bg-[#F2CB30] hover:bg-[#DA0090] hover:text-white text-[#12002E]"
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
        <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-sm transition-all">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Product Type Tabs (All / Customizable / Ready to Order) */}
            <div className="flex items-center p-1 rounded-xl border border-slate-200 bg-slate-100 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setProductType('all')}
                className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  productType === 'all'
                    ? 'bg-[#2C0E63] text-white font-extrabold shadow-sm'
                    : 'text-slate-600 hover:text-[#2C0E63]'
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
                    ? 'bg-[#2C0E63] text-white font-extrabold shadow-sm'
                    : 'text-slate-600 hover:text-[#2C0E63]'
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
                    ? 'bg-[#2C0E63] text-white font-extrabold shadow-sm'
                    : 'text-slate-600 hover:text-[#2C0E63]'
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
                  className="w-full pl-9 pr-8 py-2 rounded-xl text-xs font-medium focus:outline-none transition-all bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:border-[#2C0E63]"
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
                  className="w-full sm:w-auto px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 text-xs font-semibold flex items-center justify-between gap-2 transition-all cursor-pointer"
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
                  <div className="absolute right-0 mt-1.5 w-48 rounded-xl border border-slate-200 bg-white shadow-xl z-30 py-1 text-xs overflow-hidden text-slate-800">
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
                            ? 'bg-[#DA0090]/10 text-[#DA0090] font-bold'
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {sortBy === opt.id && <Check className="w-3.5 h-3.5 text-[#DA0090]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Category Pill Filters */}
          <div className="pt-3.5 mt-3.5 border-t border-dashed border-slate-200 flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
              <SlidersHorizontal className="w-3 h-3" />
              Category:
            </span>
            {categoryOptions.map((cat) => {
              const isSelected = (selectedCategory || 'all').toLowerCase() === cat.id.toLowerCase();
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#2C0E63] text-white font-bold shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
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
              Showing <strong className="text-[#2C0E63]">{filteredProducts.length}</strong> products
            </span>

            {/* Active Badges */}
            {selectedCategory && selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border bg-[#DA0090]/15 text-[#DA0090] border-[#DA0090]/30">
                <span>Category: {selectedCategory}</span>
                <button onClick={() => setSelectedCategory('all')} className="hover:opacity-75">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border bg-[#DA0090]/15 text-[#DA0090] border-[#DA0090]/30">
                <span>Keyword: "{searchQuery}"</span>
                <button onClick={() => setSearchQuery('')} className="hover:opacity-75">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {showWishlistOnly && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border bg-rose-500/10 text-rose-500 border-rose-500/30">
                <span>Wishlist ({wishlist.length} saved)</span>
                <button onClick={() => setShowWishlistOnly(false)} className="hover:opacity-75">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {productType !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border bg-[#DA0090]/15 text-[#DA0090] border-[#DA0090]/30">
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
          <div className="text-center py-20 px-4 rounded-3xl border border-slate-200 bg-white">
            <Box className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#2C0E63]">
              {products.length === 0 ? 'No Products in Catalog Yet' : 'No matching products found'}
            </h3>
            <p className="text-xs max-w-md mx-auto text-slate-500 mt-1 mb-6">
              {products.length === 0
                ? 'Your merchandise catalog is currently empty. Configure products from the Admin Command Center to start receiving orders.'
                : "We couldn't find any products matching your current filters. Try resetting the filters or searching for another keyword."}
            </p>
            {products.length === 0 && adminUser ? (
              <button
                onClick={() => navigateTo('admin')}
                className="px-6 py-2.5 rounded-xl text-xs font-mono font-black transition-all cursor-pointer bg-lime-400 hover:bg-lime-300 text-slate-950 shadow-md"
              >
                + Add Product in Admin
              </button>
            ) : hasActiveFilters ? (
              <button
                onClick={resetFilters}
                className="px-5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer bg-[#F2CB30] hover:bg-[#DA0090] hover:text-white text-[#12002E]"
              >
                Reset All Filters
              </button>
            ) : null}
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
          BULK ENQUIRY / WHATSAPP BANNER (Deep Plum #12002E Promotional Section)
          ======================================================================= 
        */}
        <div className="mt-14 rounded-2xl border border-[#2C0E63]/30 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 transition-all bg-[#12002E] text-white shadow-xl">
          <div className="space-y-1.5 text-center md:text-left">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#DA0090]/20 text-[#DA0090] border border-[#DA0090]/40">
              <span className="w-1.5 h-1.5 rounded-full bg-[#DA0090] animate-pulse" />
              BULK WHOLESALE RATES
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white">
              Looking for Custom Corporate Merchandise or 50+ Units?
            </h3>
            <p className="text-xs text-slate-300 max-w-xl">
              Get direct tiered wholesale pricing, free physical sample swatches, and priority design proofing via WhatsApp.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="https://wa.me/917992801158?text=Hello%20The%20PrintHub%2C%20I%20am%20looking%20for%20bulk%20custom%20merchandise%20pricing."
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-[#F2CB30] hover:bg-[#DA0090] hover:text-white text-[#12002E] font-black text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all hover:scale-102 active:scale-98 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-current/20" />
              <span>WhatsApp Bulk Enquiry</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductsView;
