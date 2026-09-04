import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Star,
  Eye,
  Heart,
  MessageCircle,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

/**
 * ProductCard Component — The PrintHub Product Card
 * Strict implementation of Controlled Image Rule:
 * - aspect-ratio: 1 / 1
 * - display: flex; align-items: center; justify-content: center;
 * - object-fit: contain; width: 100%; height: 100%;
 * Full product visibility with zero unwanted zooming, stretching, or cropping.
 */
export function ProductCard({ product }) {
  const {
    selectProduct,
    navigateTo,
    themeMode,
    toggleWishlist,
    isWishlisted,
    setQuickViewProduct,
  } = useStore();

  const isLight = themeMode === 'light';
  if (!product) return null;

  const wishlisted = isWishlisted(product.id);

  // Determine product type
  const isCustomizable =
    product.isCustomizable !== false &&
    (Boolean(product.modelPath) || Boolean(product.printAreas));

  const handleCardClick = () => {
    if (isCustomizable) {
      selectProduct(product);
      navigateTo('design-by-customer');
    } else {
      setQuickViewProduct(product);
    }
  };

  const handleActionClick = (e) => {
    e.stopPropagation();
    if (isCustomizable) {
      selectProduct(product);
      navigateTo('design-by-customer');
    } else {
      setQuickViewProduct(product);
    }
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const displayPrice = product.price || product.basePrice || 399;
  const comparePrice = product.compareAtPrice;
  const rating = product.rating || 4.8;
  const reviews = product.reviewsCount || product.reviewCount || 120;
  const imageUrl =
    product.image ||
    (Array.isArray(product.images) && product.images[0]) ||
    product.previewImage ||
    product.thumbnail ||
    '';

  // Controlled subtle image background tint variations across product categories
  const getImageBg = () => {
    if (!isLight) return 'bg-[#161722]';
    const cat = (product.category || '').toLowerCase();
    if (cat.includes('apparel') || cat.includes('shirt') || cat.includes('tee') || cat.includes('hoodie')) {
      return 'bg-[#F0F6FF]'; // soft light blue
    }
    if (cat.includes('drinkware') || cat.includes('mug') || cat.includes('vessel')) {
      return 'bg-[#FAF7F2]'; // soft warm cream
    }
    if (cat.includes('headwear') || cat.includes('cap') || cat.includes('hat')) {
      return 'bg-[#F3F4F6]'; // soft neutral grey
    }
    if (cat.includes('accessories') || cat.includes('badge') || cat.includes('apron')) {
      return 'bg-[#F5F3FF]'; // soft light lavender
    }
    return 'bg-[#F3F6FA]'; // default clean soft slate tint
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group relative rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden select-none cursor-pointer ${
        isLight
          ? 'bg-white border-slate-200/90 hover:border-blue-300 hover:shadow-[0_12px_28px_rgba(37,99,235,0.09)] hover:-translate-y-1'
          : 'bg-[#121318] border-[#22232C] hover:border-cyan-500/40 hover:shadow-[0_12px_28px_rgba(0,0,0,0.5)] hover:-translate-y-1'
      }`}
    >
      {/* 
        =======================================================================
        CONTROLLED PRODUCT IMAGE CONTAINER (Mandatory 1:1 Aspect Ratio + Contain)
        ======================================================================= 
      */}
      <div
        className={`relative aspect-square w-full flex items-center justify-center p-4 sm:p-5 overflow-hidden transition-colors ${getImageBg()}`}
        style={{
          aspectRatio: '1 / 1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-contain transition-transform duration-200 ease-out group-hover:scale-[1.03]"
          style={{
            objectFit: 'contain',
            width: '100%',
            height: '100%',
          }}
          loading="lazy"
        />

        {/* Top-Left Badge */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {product.badge && (
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase shadow-xs ${
                isLight
                  ? 'bg-blue-600 text-white'
                  : 'bg-cyan-500 text-slate-950 font-extrabold'
              }`}
            >
              {product.badge}
            </span>
          )}
          {isCustomizable && !product.badge && (
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase shadow-xs ${
                isLight
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-900 font-extrabold'
              }`}
            >
              3D Custom
            </span>
          )}
        </div>

        {/* Top-Right Wishlist Heart Button */}
        <button
          type="button"
          onClick={handleWishlistClick}
          className={`absolute top-3 right-3 p-2 rounded-full border backdrop-blur-md transition-all z-10 hover:scale-110 active:scale-95 ${
            wishlisted
              ? 'bg-rose-500 border-rose-600 text-white shadow-sm'
              : isLight
              ? 'bg-white/90 border-slate-200 text-slate-500 hover:text-rose-500'
              : 'bg-[#121318]/90 border-slate-700 text-slate-400 hover:text-rose-400'
          }`}
          title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          aria-label="Wishlist"
        >
          <Heart className={`w-3.5 h-3.5 ${wishlisted ? 'fill-white' : ''}`} />
        </button>

        {/* Quick Hover Indicator (Desktop) */}
        <div className="absolute inset-x-3 bottom-3 z-10 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200 hidden sm:block">
          <div
            className={`w-full py-2 rounded-xl text-center text-xs font-bold shadow-md flex items-center justify-center gap-1.5 backdrop-blur-md ${
              isCustomizable
                ? isLight
                  ? 'bg-slate-900/90 text-white'
                  : 'bg-cyan-400 text-slate-950'
                : isLight
                ? 'bg-emerald-600/90 text-white'
                : 'bg-emerald-500 text-slate-950'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isCustomizable ? 'Open 3D Studio' : 'Quick View & Order'}</span>
          </div>
        </div>
      </div>

      {/* 
        =======================================================================
        PRODUCT DETAILS & SPECIFICATIONS
        ======================================================================= 
      */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          {/* Category & Rating Row */}
          <div className="flex items-center justify-between text-xs">
            <span
              className={`font-semibold uppercase tracking-wider text-[11px] ${
                isLight ? 'text-blue-600' : 'text-cyan-400'
              }`}
            >
              {product.category || 'Apparel'}
            </span>

            <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className={`font-bold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                {rating}
              </span>
              <span>({reviews})</span>
            </div>
          </div>

          {/* Title */}
          <h3
            className={`font-semibold text-sm sm:text-base leading-snug line-clamp-1 transition-colors ${
              isLight ? 'text-slate-900 group-hover:text-blue-600' : 'text-white group-hover:text-cyan-400'
            }`}
          >
            {product.name}
          </h3>

          {/* Subtitle / Specifications */}
          <p className="text-xs text-slate-500 line-clamp-1 leading-relaxed">
            {product.subtitle ||
              product.description ||
              'High-definition print on premium grade fabric'}
          </p>
        </div>

        {/* Price & Action Row */}
        <div
          className={`pt-3 border-t flex items-center justify-between gap-2 ${
            isLight ? 'border-slate-100' : 'border-[#1E2028]'
          }`}
        >
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-semibold text-slate-400">
              {isCustomizable ? 'Starting At' : 'Price'}
            </span>
            <div className="flex items-baseline gap-1.5">
              <span
                className={`text-base sm:text-lg font-bold ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                ₹{displayPrice}
              </span>
              {comparePrice && comparePrice > displayPrice && (
                <span className="text-xs text-slate-400 line-through">
                  ₹{comparePrice}
                </span>
              )}
            </div>
          </div>

          {/* Primary Card CTA */}
          <button
            type="button"
            onClick={handleActionClick}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs shrink-0 hover:scale-102 active:scale-98 ${
              isCustomizable
                ? isLight
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold'
                : isLight
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold'
            }`}
          >
            {isCustomizable ? (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Customize</span>
              </>
            ) : (
              <>
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Order Now</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
