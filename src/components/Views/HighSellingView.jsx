import React from 'react';
import {
  Flame,
  Star,
  ArrowRight,
  Palette,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export function HighSellingView() {
  const {
    products,
    categories = [],
    selectProduct,
    highSellingTimeRange,
    setHighSellingTimeRange,
    highSellingCategory,
    setHighSellingCategory,
    navigateTo,
    currentTheme,
    themeMode,
  } = useStore();

  const isLight = themeMode === 'light';

  const timeRangeOptions = [
    { id: '7days', label: 'Last 7 Days' },
    { id: '14days', label: 'Last 14 Days' },
    { id: '30days', label: 'Last 1 Month' },
    { id: 'all', label: 'All Time' },
  ];

  const categoryOptions = [
    { id: 'all', label: 'All Categories' },
    ...categories.map((c) => ({
      id: c.name.toLowerCase(),
      label: c.name,
    })),
  ];

  const getSalesCount = (product) => {
    if (!product.sales) return 100;
    if (highSellingTimeRange === '7days') return product.sales.days7 || 0;
    if (highSellingTimeRange === '14days') return product.sales.days14 || 0;
    if (highSellingTimeRange === '30days') return product.sales.days30 || 0;
    return product.sales.allTime || 0;
  };

  const filteredProducts = products
    .filter((p) => {
      if (highSellingCategory === 'all') return true;
      const catLower = highSellingCategory.toLowerCase();
      const pCat = (p.category || '').toLowerCase();
      const pCatKey = (p.categoryKey || '').toLowerCase();
      return pCat === catLower || pCatKey === catLower || pCat.includes(catLower);
    })
    .sort((a, b) => getSalesCount(b) - getSalesCount(a));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 select-none bg-white text-[#12002E]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#DA0090] uppercase tracking-wider">
            <Flame className="w-4 h-4" />
            <span>Real-Time Sales Velocity</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-black text-[#2C0E63] mt-1">
            High Selling Products Leaderboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Live leaderboard showing most ordered customized merchandise by date range.
          </p>
        </div>

        {/* Time Range Filter Bar */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-100 border border-slate-200 self-start md:self-auto">
          {timeRangeOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setHighSellingTimeRange(opt.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                highSellingTimeRange === opt.id
                  ? 'bg-[#2C0E63] text-white shadow-sm'
                  : 'text-slate-600 hover:text-[#2C0E63]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {categoryOptions.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setHighSellingCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              highSellingCategory === cat.id
                ? 'bg-[#2C0E63] text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:border-[#2C0E63] hover:text-[#2C0E63]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredProducts.slice(0, 3).map((prod, idx) => {
          const sales = getSalesCount(prod);
          return (
            <div
              key={prod.id}
              className="rounded-3xl p-5 bg-white border border-slate-200 shadow-sm hover:border-[#2C0E63] relative overflow-hidden flex flex-col justify-between space-y-4 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-full bg-[#2C0E63] text-sm font-black flex items-center justify-center text-white">
                  #{idx + 1}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#DA0090]/15 text-[#DA0090] border border-[#DA0090]/30">
                  🔥 {sales.toLocaleString()} Units Sold
                </span>
              </div>

              <div className="flex items-center gap-4">
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="w-20 h-20 object-cover rounded-2xl border border-slate-100 shadow-sm shrink-0"
                />
                <div>
                  <h3 className="text-sm font-bold text-[#2C0E63] line-clamp-1">{prod.name}</h3>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{prod.subtitle}</p>
                  <div className="text-xs font-black text-[#12002E] mt-1">₹{prod.basePrice}</div>
                </div>
              </div>

              <button
                onClick={() => {
                  if (selectProduct) selectProduct(prod);
                  navigateTo('design-by-customer');
                }}
                className="w-full py-2.5 rounded-xl bg-[#F2CB30] hover:bg-[#DA0090] hover:text-white text-[#12002E] text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Customize this Best Seller in 3D</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Complete Rankings */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-[#2C0E63] uppercase tracking-wider">
          Complete Popularity Ranking ({filteredProducts.length} Items)
        </h3>

        <div className="space-y-2.5">
          {filteredProducts.map((prod, index) => {
            const sales = getSalesCount(prod);
            return (
              <div
                key={prod.id}
                className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#2C0E63] transition-all group"
              >
                <div className="flex items-center gap-4">
                  <span className="w-7 h-7 rounded-xl bg-slate-100 text-xs font-black text-slate-700 group-hover:text-[#2C0E63] flex items-center justify-center border border-slate-200">
                    {index + 1}
                  </span>

                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-12 h-12 object-cover rounded-xl shrink-0 border border-slate-100"
                  />

                  <div>
                    <h4 className="text-xs font-bold text-[#2C0E63] group-hover:text-[#DA0090] transition-colors">
                      {prod.name}
                    </h4>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-0.5">
                      <span>Category: {prod.category}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1 text-[#F2CB30] font-bold">
                        <Star className="w-3 h-3 fill-[#F2CB30] text-[#F2CB30]" />
                        <span>{prod.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-5">
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#DA0090] block">
                      {sales.toLocaleString()} Orders
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Starting ₹{prod.basePrice}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      if (selectProduct) selectProduct(prod);
                      navigateTo('design-by-customer');
                    }}
                    className="px-4 py-2 rounded-xl bg-[#F2CB30] hover:bg-[#DA0090] hover:text-white text-[#12002E] text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <span>Customize</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
