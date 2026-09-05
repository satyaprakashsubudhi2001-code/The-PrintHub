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
    toggleWishlist,
    isWishlisted,
    setQuickViewProduct,
  } = useStore();

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

  const getImageBg = () => {
    const cat = (product.category || '').toLowerCase();
    if (cat.includes('apparel') || cat.includes('shirt') || cat.includes('tee') || cat.includes('hoodie')) {
      return 'bg-[#F8F9FD]';
    }
    if (cat.includes('drinkware') || cat.includes('mug') || cat.includes('vessel')) {
      return 'bg-[#FAF7F2]';
    }
    if (cat.includes('headwear') || cat.includes('cap') || cat.includes('hat')) {
      return 'bg-[#F4F5F8]';
    }
    if (cat.includes('accessories') || cat.includes('badge') || cat.includes('apron')) {
      return 'bg-[#F7F4FD]';
    }
    return 'bg-[#F6F7FA]';
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative rounded-2xl border border-slate-200 bg-white hover:border-[#2C0E63] hover:shadow-[0_12px_28px_rgba(44,14,99,0.08)] transition-all duration-200 flex flex-col justify-between overflow-hidden select-none cursor-pointer hover:-translate-y-1"
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
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase shadow-xs bg-[#DA0090] text-white">
              {product.badge}
            </span>
          )}
          {isCustomizable && !product.badge && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase shadow-xs bg-[#12002E] text-white">
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
              ? 'bg-[#DA0090] border-[#DA0090] text-white shadow-sm'
              : 'bg-white/90 border-slate-200 text-slate-500 hover:text-[#DA0090] hover:border-[#DA0090]'
          }`}
          title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          aria-label="Wishlist"
        >
          <Heart className={`w-3.5 h-3.5 ${wishlisted ? 'fill-white' : ''}`} />
        </button>

        {/* Quick Hover Indicator (Desktop) */}
        <div className="absolute inset-x-3 bottom-3 z-10 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200 hidden sm:block">
          <div className="w-full py-2 rounded-xl text-center text-xs font-bold shadow-md flex items-center justify-center gap-1.5 backdrop-blur-md bg-[#2C0E63] text-white">
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
            <span className="font-bold uppercase tracking-wider text-[11px] text-[#DA0090]">
              {product.category || 'Apparel'}
            </span>

            <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
              <Star className="w-3 h-3 text-[#F2CB30] fill-[#F2CB30]" />
              <span className="font-bold text-slate-800">
                {rating}
              </span>
              <span>({reviews})</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-bold text-sm sm:text-base leading-snug line-clamp-1 transition-colors text-[#2C0E63] group-hover:text-[#DA0090]">
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
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-semibold text-slate-400">
              {isCustomizable ? 'Starting At' : 'Price'}
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-bold text-[#12002E]">
                ₹{displayPrice}
              </span>
              {comparePrice && comparePrice > displayPrice && (
                <span className="text-xs text-slate-400 line-through">
                  ₹{comparePrice}
                </span>
              )}
            </div>
          </div>

          {/* Primary Card CTA (Background: #F2CB30, Text: #12002E) */}
          <button
            type="button"
            onClick={handleActionClick}
            className="px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs shrink-0 hover:scale-102 active:scale-98 bg-[#F2CB30] hover:bg-[#e0b925] text-[#12002E] cursor-pointer"
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
