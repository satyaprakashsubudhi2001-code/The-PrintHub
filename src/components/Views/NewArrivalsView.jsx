import React, { useState } from 'react';
import { Sparkles, ArrowRight, Star, Zap, Clock, TrendingUp, Filter, Palette, ShoppingBag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

const ARRIVAL_BADGES = ['Just Dropped', 'Fresh Pick', 'New Season', 'Limited Run', 'Exclusive Drop'];

export function NewArrivalsView() {
  const { products, categories = [], selectProduct, navigateTo, setSelectedCategory } = useStore();
  const [selectedCat, setSelectedCat] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const allNew = [...products].reverse();
  const filtered = allNew
    .filter((p) => {
      if (selectedCat === 'all') return true;
      const catLower = selectedCat.toLowerCase();
      return (p.category || '').toLowerCase() === catLower || (p.categoryKey || '').toLowerCase() === catLower;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return (a.basePrice || 0) - (b.basePrice || 0);
      if (sortBy === 'price-desc') return (b.basePrice || 0) - (a.basePrice || 0);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0;
    });

  const categoryOptions = [
    { id: 'all', label: 'All Items' },
    ...categories.map((c) => ({ id: c.name.toLowerCase(), label: c.name })),
  ];
  const getBadge = (index) => ARRIVAL_BADGES[index % ARRIVAL_BADGES.length];

  return (
    <div className="min-h-screen bg-[#12002E] text-white select-none pb-20 lg:pb-0">
      <section className="relative overflow-hidden py-14 sm:py-20 border-b border-[#2C0E63]/60">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#DA0090]/20 blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-[#F2CB30]/10 blur-3xl pointer-events-none" />
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#DA0090]/20 border border-[#DA0090]/40 text-[#DA0090] text-xs font-bold tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#DA0090] animate-ping inline-block" />
                <Sparkles className="w-3.5 h-3.5" />
                <span className="uppercase">Fresh Drops — New Arrivals</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
                What's <span className="text-[#F2CB30]">New</span>
                <br className="hidden sm:block" />
                at The PrintHub?
              </h1>
              <p className="text-sm sm:text-base text-white/70 max-w-xl leading-relaxed">
                The freshest additions to our custom merchandise lineup — from exclusive limited-edition silhouettes to expanded formats. Every piece available for 3D customization with zero MOQ ordering.
              </p>
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <div className="flex items-center gap-2 text-xs font-bold text-white/70"><TrendingUp className="w-4 h-4 text-[#F2CB30]" /><span>{filtered.length} New Products</span></div>
                <div className="flex items-center gap-2 text-xs font-bold text-white/70"><Clock className="w-4 h-4 text-[#DA0090]" /><span>Updated Daily</span></div>
                <div className="flex items-center gap-2 text-xs font-bold text-white/70"><Zap className="w-4 h-4 text-[#F2CB30]" /><span>Zero MOQ • Ship PAN India</span></div>
              </div>
            </div>
            <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3">
              <button onClick={() => { navigateTo('design-by-customer'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="px-6 py-3.5 rounded-xl bg-[#F2CB30] hover:bg-[#e0b925] text-[#12002E] font-black text-sm flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 shadow-lg cursor-pointer">
                <Palette className="w-4 h-4" /><span>Customize in 3D Studio</span><ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={() => { setSelectedCategory('all'); navigateTo('products'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="px-6 py-3.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer">
                <ShoppingBag className="w-4 h-4" /><span>Browse All Products</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="sticky top-0 z-20 border-b border-[#2C0E63]/50 bg-[#12002E]/95 backdrop-blur-md">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
            <Filter className="w-3.5 h-3.5 text-[#DA0090] shrink-0" />
            {categoryOptions.map((cat) => (
              <button key={cat.id} onClick={() => setSelectedCat(cat.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer border ${selectedCat === cat.id ? 'bg-[#DA0090] border-[#DA0090] text-white' : 'bg-white/10 border-white/15 text-white/70 hover:border-[#DA0090]/50 hover:text-white'}`}>
                {cat.label}
              </button>
            ))}
          </div>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="shrink-0 text-xs font-bold bg-white/10 border border-white/15 text-white rounded-xl px-3 py-2 cursor-pointer outline-none">
            <option value="newest" className="bg-[#12002E]">Newest First</option>
            <option value="price-asc" className="bg-[#12002E]">Price: Low to High</option>
            <option value="price-desc" className="bg-[#12002E]">Price: High to Low</option>
            <option value="rating" className="bg-[#12002E]">Top Rated</option>
          </select>
        </div>
      </div>

      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-5 text-center">
            <div className="w-20 h-20 rounded-3xl bg-[#2C0E63] border border-[#DA0090]/30 flex items-center justify-center text-4xl">✨</div>
            <h2 className="text-xl font-bold text-white">No New Arrivals Yet</h2>
            <p className="text-sm text-white/55 max-w-sm leading-relaxed">Products added via the Admin panel will appear here as fresh drops.</p>
            <button onClick={() => { setSelectedCategory('all'); navigateTo('products'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="px-6 py-3 rounded-xl bg-[#F2CB30] text-[#12002E] font-black text-sm hover:bg-[#e0b925] transition-all cursor-pointer">Browse All Products</button>
          </div>
        ) : (
          <>
            {filtered.length >= 1 && (
              <div className="mb-10">
                <div className="flex items-center gap-2 mb-5">
                  <span className="w-3 h-3 rounded-full bg-[#DA0090] animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-widest text-[#DA0090]">Spotlight Drops</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {filtered.slice(0, 2).map((prod, idx) => (
                    <div key={prod.id} className="group relative rounded-3xl border border-[#2C0E63] bg-[#1a0540] overflow-hidden flex flex-col hover:border-[#DA0090]/60 transition-all duration-300 hover:-translate-y-1 shadow-xl shadow-black/40">
                      <div className="relative h-56 sm:h-64 overflow-hidden bg-[#0d001f]">
                        <img src={prod.image} alt={prod.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1a0540] via-[#1a0540]/20 to-transparent" />
                        <div className="absolute top-3 left-3 flex items-center gap-1.5">
                          <span className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#DA0090] text-white">✦ NEW</span>
                          <span className="px-2.5 py-1.5 rounded-full text-[10px] font-bold bg-[#12002E]/80 text-[#F2CB30] border border-[#F2CB30]/30">{getBadge(idx)}</span>
                        </div>
                        {prod.rating && (<div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/50"><Star className="w-3 h-3 fill-[#F2CB30] text-[#F2CB30]" /><span className="text-[10px] font-bold text-white">{prod.rating}</span></div>)}
                      </div>
                      <div className="p-5 sm:p-6 flex flex-col justify-between flex-1 space-y-4">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#DA0090]">{prod.category || 'Merchandise'}</span>
                          <h3 className="text-lg font-black text-white mt-1 line-clamp-1">{prod.name}</h3>
                          <p className="text-xs text-white/55 mt-1 line-clamp-2">{prod.subtitle || prod.description}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-black text-[#F2CB30]">&#8377;{prod.basePrice}<span className="text-xs font-normal text-white/40 ml-1">onwards</span></span>
                          <button onClick={() => { if (selectProduct) selectProduct(prod); navigateTo('design-by-customer'); }} className="px-5 py-2.5 rounded-xl bg-[#DA0090] hover:bg-[#c0007a] text-white text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-lg hover:-translate-y-0.5">
                            <Palette className="w-3.5 h-3.5" />Customize Now
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {filtered.length > 2 && (
              <div>
                <div className="flex items-center gap-2 mb-5">
                  <span className="text-xs font-black uppercase tracking-widest text-white/50">All New Arrivals ({filtered.length - 2} more)</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {filtered.slice(2).map((prod) => (
                    <div key={prod.id} className="group relative rounded-2xl border border-[#2C0E63]/70 bg-[#16033a] overflow-hidden flex flex-col hover:border-[#DA0090]/50 transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-black/30">
                      <div className="relative aspect-square overflow-hidden bg-[#0d001f]">
                        <img src={prod.image} alt={prod.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-85" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#16033a]/90 via-transparent to-transparent" />
                        <span className="absolute top-2 left-2 px-2 py-1 rounded-full text-[9px] font-black uppercase bg-[#DA0090] text-white">NEW</span>
                        {prod.rating && (<div className="absolute top-2 right-2 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-black/60"><Star className="w-2.5 h-2.5 fill-[#F2CB30] text-[#F2CB30]" /><span className="text-[9px] font-bold text-white">{prod.rating}</span></div>)}
                      </div>
                      <div className="p-3.5 flex flex-col flex-1 justify-between gap-3">
                        <div>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-[#DA0090]">{prod.category || 'Merchandise'}</span>
                          <h3 className="text-xs font-bold text-white mt-0.5 line-clamp-2 leading-snug">{prod.name}</h3>
                          <p className="text-[11px] font-black text-[#F2CB30] mt-1.5">&#8377;{prod.basePrice}</p>
                        </div>
                        <button onClick={() => { if (selectProduct) selectProduct(prod); navigateTo('design-by-customer'); }} className="w-full py-2 rounded-xl bg-[#2C0E63] hover:bg-[#DA0090] text-white text-[10px] font-black flex items-center justify-center gap-1 transition-all cursor-pointer">
                          <Palette className="w-3 h-3" />Customize
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="border-t border-[#2C0E63]/50 py-14 sm:py-20">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F2CB30]/15 border border-[#F2CB30]/30 text-[#F2CB30] text-xs font-bold uppercase tracking-wider"><Zap className="w-3.5 h-3.5" />Design Yours Today</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white max-w-2xl mx-auto leading-tight">Don't see what you need? <span className="text-[#DA0090]">We create anything.</span></h2>
          <p className="text-sm text-white/60 max-w-lg mx-auto">Jump into our 3D customizer and build your own design from scratch — no minimums, no waiting.</p>
          <button onClick={() => { navigateTo('design-by-customer'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-[#F2CB30] hover:bg-[#e0b925] text-[#12002E] font-black text-sm transition-all hover:-translate-y-0.5 shadow-xl cursor-pointer">
            <Sparkles className="w-4 h-4" />Open 3D Studio<ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewArrivalsView;
