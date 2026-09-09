import React, { useState } from 'react';
import {
  X,
  Star,
  ShoppingBag,
  Zap,
  ArrowRight,
  Check,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export function ProductQuickViewModal({ product, onClose, onOpenDetail }) {
  const {
    isWishlisted,
    addReadyToBuyToCart,
  } = useStore();

  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || { name: 'Dark Green', hex: '#183630' });
  const [selectedSize, setSelectedSize] = useState(product?.defaultSize || product?.sizes?.[0] || 'L');
  const [selectedImage, setSelectedImage] = useState(product?.images?.[0] || product?.image);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  if (!product) return null;

  const discountPercent = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addReadyToBuyToCart({
      product,
      selectedColor,
      selectedSize,
      quantity,
      buyNow: false,
    });
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1200);
  };

  const handleBuyNow = () => {
    addReadyToBuyToCart({
      product,
      selectedColor,
      selectedSize,
      quantity,
      buyNow: true,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#183630]/70 backdrop-blur-sm select-none animate-in fade-in">
      <div className="w-full max-w-3xl bg-[#E5DAC9] border-2 border-[#B8A98F] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 max-h-[90vh] text-[#183630]">
        {/* Left: Gallery Column */}
        <div className="md:w-1/2 p-6 bg-[#183630]/10 flex flex-col justify-between space-y-4 border-r border-[#B8A98F]/40">
          <div className="relative aspect-square rounded-2xl bg-[#E5DAC9] overflow-hidden border border-[#B8A98F]">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.badge && (
              <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase font-mono bg-[#183630] text-[#E5DAC9] border border-[#B8A98F] shadow-sm">
                {product.badge}
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={`w-14 h-14 rounded-xl border-2 overflow-hidden shrink-0 transition-all cursor-pointer ${
                    selectedImage === img ? 'border-[#183630] ring-2 ring-[#E5C690]' : 'border-[#B8A98F] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info & Selectors */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between space-y-4 overflow-y-auto">
          {/* Header & Close */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#183630] uppercase tracking-wider font-mono">
                {product.category} • {product.printMethod}
              </span>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-xl text-[#183630]/70 hover:text-[#183630] hover:bg-[#183630]/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h2 className="text-base sm:text-lg font-black text-[#183630] font-display leading-snug">
              {product.name}
            </h2>

            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1 text-[#183630] font-bold">
                <Star className="w-3.5 h-3.5 fill-[#E5C690] text-[#183630]" />
                <span>{product.rating}</span>
              </div>
              <span className="text-[#B8A98F]">•</span>
              <span className="text-[#183630]/70">({product.reviewCount} reviews)</span>
              <span className="text-[#B8A98F]">•</span>
              <span className="text-[#183630] font-mono font-bold">In Stock</span>
            </div>

            {/* Price Row */}
            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-xl font-black text-[#183630] font-mono">
                ₹{product.price.toLocaleString()}
              </span>
              {product.compareAtPrice && (
                <span className="text-xs text-[#183630]/50 line-through font-mono">
                  ₹{product.compareAtPrice}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="px-2 py-0.5 rounded-md bg-[#E5C690]/40 text-[#183630] text-[10px] font-black font-mono border border-[#B8A98F]">
                  {discountPercent}% OFF
                </span>
              )}
            </div>
          </div>

          {/* Color Selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#183630]/80 flex items-center justify-between">
              <span>Color: <strong className="text-[#183630]">{selectedColor.name}</strong></span>
            </label>
            <div className="flex items-center gap-2">
              {product.colors && product.colors.map((c, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  className={`w-6 h-6 rounded-full border transition-transform cursor-pointer ${
                    selectedColor.name === c.name ? 'scale-125 border-[#183630] ring-2 ring-[#E5C690]' : 'border-[#B8A98F]'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Size Selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#183630]/80 flex items-center justify-between">
              <span>Size: <strong className="text-[#183630]">{selectedSize}</strong></span>
            </label>
            <div className="flex items-center gap-1.5 flex-wrap">
              {product.sizes && product.sizes.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setSelectedSize(sz)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    selectedSize === sz
                      ? 'bg-[#183630] border-[#183630] text-[#E5DAC9] font-extrabold shadow-sm'
                      : 'bg-[#E5DAC9] border-[#B8A98F] text-[#183630] hover:border-[#183630]'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Actions */}
          <div className="space-y-2.5 pt-2 border-t border-[#B8A98F]/40">
            <div className="flex items-center gap-2">
              {/* Stepper */}
              <div className="flex items-center rounded-xl bg-[#183630]/10 border border-[#B8A98F] p-0.5">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 rounded-lg text-[#183630] hover:bg-[#183630]/20 flex items-center justify-center font-bold text-xs cursor-pointer"
                >
                  −
                </button>
                <span className="w-7 text-center font-mono font-bold text-[#183630] text-xs">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-7 h-7 rounded-lg text-[#183630] hover:bg-[#183630]/20 flex items-center justify-center font-bold text-xs cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 py-2.5 rounded-xl bg-[#183630]/15 hover:bg-[#183630]/25 text-[#183630] font-bold text-xs border border-[#B8A98F] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                {isAdded ? <Check className="w-3.5 h-3.5 text-[#183630]" /> : <ShoppingBag className="w-3.5 h-3.5 text-[#183630]" />}
                <span>{isAdded ? 'Added to Cart' : 'Add to Cart'}</span>
              </button>

              {/* Buy Now */}
              <button
                type="button"
                onClick={handleBuyNow}
                className="flex-1 py-2.5 rounded-xl bg-[#E5C690] hover:bg-[#d9b87c] text-[#183630] font-black text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Buy Now</span>
              </button>
            </div>

            {/* View Full Details link */}
            <button
              type="button"
              onClick={() => onOpenDetail(product)}
              className="w-full text-center text-xs text-[#183630] hover:underline font-bold pt-1 flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>View Full Details & Specs</span>
              <ArrowRight className="w-3 h-3 text-[#183630]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
