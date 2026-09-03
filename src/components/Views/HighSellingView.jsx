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
    highSellingTimeRange,
    setHighSellingTimeRange,
    highSellingCategory,
    setHighSellingCategory,
    navigateTo,
    currentTheme,
  } = useStore();

  const timeRangeOptions = [
    { id: '7days', label: 'Last 7 Days' },
    { id: '14days', label: 'Last 14 Days' },
    { id: '30days', label: 'Last 1 Month' },
    { id: 'all', label: 'All Time' },
  ];

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'apparel', label: 'Apparel & Tees' },
    { id: 'drinkware', label: 'Cups & Mugs' },
    { id: 'accessories', label: 'Caps & Badges' },
    { id: 'office', label: 'Mouse Pads' },
    { id: 'decor', label: 'Photo Frames' },
  ];

  const getSalesCount = (product) => {
    if (!product.sales) return 100;
    if (highSellingTimeRange === '7days') return product.sales.days7 || 0;
    if (highSellingTimeRange === '14days') return product.sales.days14 || 0;
    if (highSellingTimeRange === '30days') return product.sales.days30 || 0;
    return product.sales.allTime || 0;
  };

  const filteredProducts = products
    .filter((p) => highSellingCategory === 'all' || p.categoryKey === highSellingCategory)
    .sort((a, b) => getSalesCount(b) - getSalesCount(a));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Flame className="w-4 h-4" />
            <span>Real-Time Sales Velocity</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-black text-white mt-1">
            High Selling Products Leaderboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Live leaderboard showing most ordered customized merchandise by date range.
          </p>
        </div>

        {/* Time Range Filter Bar */}
        <div className="flex items-center p-1 rounded-2xl glass-panel border border-slate-700/60 self-start md:self-auto">
          {timeRangeOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setHighSellingTimeRange(opt.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                highSellingTimeRange === opt.id
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setHighSellingCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              highSellingCategory === cat.id
                ? `bg-gradient-to-r ${currentTheme.gradient} text-white ${currentTheme.glow}`
                : 'bg-slate-900/60 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
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
          const podiumColors = [
            'from-amber-500/20 via-amber-500/10 border-amber-500/50 text-amber-400',
            'from-slate-400/20 via-slate-400/10 border-slate-400/50 text-slate-300',
            'from-orange-600/20 via-orange-600/10 border-orange-600/50 text-orange-400',
          ];

          return (
            <div
              key={prod.id}
              className={`rounded-3xl p-5 bg-gradient-to-b ${podiumColors[idx]} border glass-panel relative overflow-hidden flex flex-col justify-between space-y-4`}
            >
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-full bg-slate-950/90 text-sm font-black flex items-center justify-center border border-white/20">
                  #{idx + 1}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  🔥 {sales.toLocaleString()} Units Sold
                </span>
              </div>

              <div className="flex items-center gap-4">
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="w-20 h-20 object-cover rounded-2xl shadow-lg shrink-0"
                />
                <div>
                  <h3 className="text-sm font-bold text-white line-clamp-1">{prod.name}</h3>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{prod.subtitle}</p>
                  <div className="text-xs font-black text-indigo-400 mt-1">₹{prod.basePrice}</div>
                </div>
              </div>

              <button
                onClick={() => navigateTo('design-by-customer', prod.id)}
                className={`w-full py-2.5 rounded-xl bg-gradient-to-r ${currentTheme.gradient} ${currentTheme.glow} text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all`}
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
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Complete Popularity Ranking ({filteredProducts.length} Items)
        </h3>

        <div className="space-y-2.5">
          {filteredProducts.map((prod, index) => {
            const sales = getSalesCount(prod);
            return (
              <div
                key={prod.id}
                className="p-4 rounded-2xl glass-panel border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-indigo-500/60 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <span className="w-7 h-7 rounded-xl bg-slate-900 text-xs font-black text-slate-400 group-hover:text-indigo-400 flex items-center justify-center border border-slate-700">
                    {index + 1}
                  </span>

                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-12 h-12 object-cover rounded-xl shrink-0"
                  />

                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors">
                      {prod.name}
                    </h4>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                      <span>Category: {prod.category}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1 text-amber-400 font-bold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{prod.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-5">
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-400 block">
                      {sales.toLocaleString()} Orders
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Starting ₹{prod.basePrice}
                    </span>
                  </div>

                  <button
                    onClick={() => navigateTo('design-by-customer', prod.id)}
                    className="px-4 py-2 rounded-xl bg-indigo-500/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/40 text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <span>Customize</span>
                    <ArrowRight className="w-3 h-3" />
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
