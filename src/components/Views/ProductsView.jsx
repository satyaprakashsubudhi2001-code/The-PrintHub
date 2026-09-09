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
  Check,
  ChevronDown,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../Products/ProductCard';

/**
 * ProductsView — The PrintHub Catalog & Discovery Hub
 * Strictly compliant 4-Color Luxury System:
 * - #183630 (Primary Dark Green)
 * - #E5DAC9 (Primary Beige)
 * - #E5C690 (Primary Soft Gold)
 * - #B8A98F (Highlight Taupe)
 *
 * Ambient [ Bracket ] selectors on active filters and tabs.
 */
export function ProductsView() {
  const {
    products = [],
    readyToBuyProducts = [],
    adminUser,
    navigateTo,
    categories = [],
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    wishlist = [],
    showWishlistOnly,
    setShowWishlistOnly,
  } = useStore();

  // Local filter states
  const [productType, setProductType] = useState('all'); // 'all' | 'customizable' | 'ready'
  const [sortBy, setSortBy] = useState('recommended');
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

    // Filter by Wishlist
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
  }, [allCustomProducts, allReadyProducts, productType, selectedCategory, searchQuery, sortBy, showWishlistOnly, wishlist, categories]);

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
    <div className="w-full min-h-screen pb-24 transition-colors duration-300 bg-[#E5DAC9] text-[#183630]">
      {/* 
        =======================================================================
        TOP HEADER & BREADCRUMB BANNER
        ======================================================================= 
      */}
      <div className="border-b border-[#B8A98F]/30 bg-[#E5DAC9]">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#183630]/60">
                <button
                  onClick={() => navigateTo('home')}
                  className="hover:text-[#183630] transition-colors cursor-pointer"
                >
                  Home
                </button>
                <span>/</span>
                <span className="text-[#183630]/80">Catalog</span>
                {selectedCategory !== 'all' && (
                  <>
                    <span>/</span>
                    <span className="text-[#183630] capitalize font-bold">{selectedCategory}</span>
                  </>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#183630]">
                Custom Merchandise & Ready Products
              </h1>
              <p className="text-xs sm:text-sm text-[#183630]/80 max-w-2xl leading-relaxed">
                Discover high-grade customizable blanks ready for 3D live preview and instant WhatsApp order placement. High-definition thermal DTF & sublimation with zero MOQ.
              </p>
            </div>

            {/* Quick 3D Studio Entry Button */}
            <div className="shrink-0 flex items-center gap-3">
              <button
                onClick={() => navigateTo('design-by-customer')}
                className="px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black shadow-md transition-all flex items-center gap-2 cursor-pointer bg-[#183630] text-[#E5DAC9] hover:text-[#E5C690] border border-[#B8A98F]/40"
              >
                <Sparkles className="w-4 h-4 text-[#E5C690]" />
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
        <div className="p-4 rounded-3xl border border-[#B8A98F] bg-[#E5DAC9] shadow-sm transition-all">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Product Type Tabs with [ Bracket ] treatment */}
            <div className="flex items-center p-1 rounded-2xl border border-[#B8A98F]/50 bg-[#E5DAC9] text-xs font-semibold gap-1">
              <button
                type="button"
                onClick={() => setProductType('all')}
                className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl transition-all duration-250 flex items-center justify-center gap-1.5 cursor-pointer ${
                  productType === 'all'
                    ? 'bracket-selected-dark text-[#E5C690] font-black'
                    : 'text-[#183630]/80 hover:text-[#183630] hover:bg-[#183630]/5'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{productType === 'all' ? '[ All Products ]' : 'All Products'}</span>
                <span className="text-[10px] opacity-75">
                  ({allCustomProducts.length + allReadyProducts.length})
                </span>
              </button>

              <button
                type="button"
                onClick={() => setProductType('customizable')}
                className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl transition-all duration-250 flex items-center justify-center gap-1.5 cursor-pointer ${
                  productType === 'customizable'
                    ? 'bracket-selected-dark text-[#E5C690] font-black'
                    : 'text-[#183630]/80 hover:text-[#183630] hover:bg-[#183630]/5'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{productType === 'customizable' ? '[ 3D Customizer Blanks ]' : '3D Customizer Blanks'}</span>
                <span className="text-[10px] opacity-75">({allCustomProducts.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setProductType('ready')}
                className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl transition-all duration-250 flex items-center justify-center gap-1.5 cursor-pointer ${
                  productType === 'ready'
                    ? 'bracket-selected-dark text-[#E5C690] font-black'
                    : 'text-[#183630]/80 hover:text-[#183630] hover:bg-[#183630]/5'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{productType === 'ready' ? '[ Ready to Order ]' : 'Ready to Order'}</span>
                <span className="text-[10px] opacity-75">({allReadyProducts.length})</span>
              </button>
            </div>

            {/* Search Input & Sort Dropdown */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#183630]/60 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Filter by keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 rounded-xl text-xs font-medium focus:outline-none transition-all bg-[#E5DAC9] border border-[#B8A98F] text-[#183630] placeholder:text-[#183630]/60 focus:border-[#183630] focus:ring-1 focus:ring-[#183630]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#183630]/60 hover:text-[#183630]"
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
                  className="w-full sm:w-auto px-3.5 py-2 rounded-xl border border-[#B8A98F] bg-[#E5DAC9] text-[#183630] hover:bg-[#183630]/5 text-xs font-semibold flex items-center justify-between gap-2 transition-all cursor-pointer"
                >
                  <ArrowUpDown className="w-3.5 h-3.5 text-[#183630]/60" />
                  <span>
                    {sortBy === 'recommended' && 'Featured'}
                    {sortBy === 'price-asc' && 'Price: Low to High'}
                    {sortBy === 'price-desc' && 'Price: High to Low'}
                    {sortBy === 'rating-desc' && 'Top Rated'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#183630]/60" />
                </button>

                {isSortOpen && (
                  <div className="absolute right-0 mt-1.5 w-48 rounded-xl border border-[#B8A98F] bg-[#E5DAC9] shadow-xl z-30 py-1 text-xs overflow-hidden text-[#183630]">
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
                            ? 'bg-[#183630] text-[#E5C690] font-bold'
                            : 'hover:bg-[#183630]/10'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {sortBy === opt.id && <Check className="w-3.5 h-3.5 text-[#E5C690]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Category Pill Filters with Ambient [ Bracket ] Treatment */}
          <div className="pt-3.5 mt-3.5 border-t border-dashed border-[#B8A98F]/40 flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
            <span className="text-[11px] font-bold text-[#183630]/60 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
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
                  className={`px-3 py-1 rounded-xl text-xs font-semibold shrink-0 transition-all duration-250 cursor-pointer ${
                    isSelected
                      ? 'bracket-selected font-black shadow-xs'
                      : 'bg-[#E5DAC9] border border-[#B8A98F]/50 hover:border-[#183630] text-[#183630]/80'
                  }`}
                >
                  {isSelected ? `[ ${cat.label} ]` : cat.label}
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
            <span className="font-semibold text-[#183630]/75">
              Showing <strong className="text-[#183630]">{filteredProducts.length}</strong> products
            </span>

            {/* Active Filter Badges */}
            {selectedCategory && selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border bg-[#E5C690]/30 text-[#183630] border-[#B8A98F]">
                <span>Category: {selectedCategory}</span>
                <button onClick={() => setSelectedCategory('all')} className="hover:opacity-75">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border bg-[#E5C690]/30 text-[#183630] border-[#B8A98F]">
                <span>Keyword: "{searchQuery}"</span>
                <button onClick={() => setSearchQuery('')} className="hover:opacity-75">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {showWishlistOnly && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border bg-[#E5C690]/30 text-[#183630] border-[#B8A98F]">
                <span>Wishlist ({wishlist.length} saved)</span>
                <button onClick={() => setShowWishlistOnly(false)} className="hover:opacity-75">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {productType !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border bg-[#E5C690]/30 text-[#183630] border-[#B8A98F]">
                <span>Type: {productType === 'customizable' ? '3D Studio Blanks' : 'Ready to Order'}</span>
                <button onClick={() => setProductType('all')} className="hover:opacity-75">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-xs text-[#183630] hover:underline font-semibold ml-1 cursor-pointer"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* 
          =======================================================================
          PRODUCTS GRID (4-Columns Desktop, 2-Columns Mobile)
          ======================================================================= 
        */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 px-4 rounded-3xl border border-[#B8A98F] bg-[#E5DAC9]">
            <Box className="w-12 h-12 text-[#183630]/50 mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#183630]">
              {products.length === 0 ? 'No Products in Catalog Yet' : 'No matching products found'}
            </h3>
            <p className="text-xs max-w-md mx-auto text-[#183630]/75 mt-1 mb-6">
              {products.length === 0
                ? 'Your merchandise catalog is currently empty. Configure products from the Admin Command Center to start receiving orders.'
                : "We couldn't find any products matching your current filters. Try resetting the filters or searching for another keyword."}
            </p>
            {products.length === 0 && adminUser ? (
              <button
                onClick={() => navigateTo('admin')}
                className="px-6 py-2.5 rounded-xl text-xs font-mono font-black transition-all cursor-pointer bg-[#183630] text-[#E5C690] border border-[#B8A98F] shadow-md"
              >
                + Add Product in Admin
              </button>
            ) : hasActiveFilters ? (
              <button
                onClick={resetFilters}
                className="px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer bg-[#183630] text-[#E5DAC9] hover:text-[#E5C690]"
              >
                Reset Filters
              </button>
            ) : null}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductsView;
