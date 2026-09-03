import React, { useState } from 'react';
import {
  X,
  Star,
  ShoppingBag,
  Zap,
  ArrowRight,
  Heart,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export function ProductQuickViewModal({ product, onClose, onOpenDetail }) {
  const {
    currentTheme,
    toggleWishlist,
    isWishlisted,
    addReadyToBuyToCart,
  } = useStore();

  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || { name: 'Standard', hex: '#000000' });
  const [selectedSize, setSelectedSize] = useState(product?.defaultSize || product?.sizes?.[0] || 'L');
  const [selectedImage, setSelectedImage] = useState(product?.images?.[0] || product?.image);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  if (!product) return null;

  const wishlisted = isWishlisted(product.id);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm select-none animate-in fade-in">
      <div className="w-full max-w-3xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 max-h-[90vh] text-slate-900">
        {/* Left: Gallery Column */}
        <div className="md:w-1/2 p-6 bg-slate-50 flex flex-col justify-between space-y-4 border-r border-slate-100">
          <div className="relative aspect-square rounded-2xl bg-white overflow-hidden border border-slate-200">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.badge && (
              <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase font-mono bg-white text-[#6C4DF6] border border-slate-200 shadow-sm">
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
                  className={`w-14 h-14 rounded-xl border-2 overflow-hidden shrink-0 transition-all ${
                    selectedImage === img ? 'border-[#6C4DF6] ring-2 ring-[#6C4DF6]/20' : 'border-slate-200 opacity-60 hover:opacity-100'
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
              <span className="text-[10px] font-bold text-[#6C4DF6] uppercase tracking-wider font-mono">
                {product.category} • {product.printMethod}
              </span>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h2 className="text-base sm:text-lg font-black text-slate-900 font-display leading-snug">
              {product.name}
            </h2>

            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1 text-amber-500 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{product.rating}</span>
              </div>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500">({product.reviewCount} reviews)</span>
              <span className="text-slate-300">•</span>
              <span className="text-emerald-600 font-mono font-bold">In Stock</span>
            </div>

            {/* Price Row */}
            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-xl font-black text-slate-900 font-mono">
                ₹{product.price.toLocaleString()}
              </span>
              {product.compareAtPrice && (
                <span className="text-xs text-slate-400 line-through font-mono">
                  ₹{product.compareAtPrice}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-black font-mono border border-emerald-200">
                  {discountPercent}% OFF
                </span>
              )}
            </div>
          </div>

          {/* Color Selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-600 flex items-center justify-between">
              <span>Color: <strong className="text-slate-900">{selectedColor.name}</strong></span>
            </label>
            <div className="flex items-center gap-2">
              {product.colors && product.colors.map((c, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  className={`w-6 h-6 rounded-full border transition-transform ${
                    selectedColor.name === c.name ? 'scale-125 border-slate-900 ring-2 ring-[#6C4DF6]' : 'border-slate-300 opacity-80'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Size Selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-600 flex items-center justify-between">
              <span>Size: <strong className="text-slate-900">{selectedSize}</strong></span>
            </label>
            <div className="flex items-center gap-1.5 flex-wrap">
              {product.sizes && product.sizes.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setSelectedSize(sz)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    selectedSize === sz
                      ? 'bg-[#6C4DF6] border-[#6C4DF6] text-white shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Actions */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              {/* Stepper */}
              <div className="flex items-center rounded-xl bg-slate-100 border border-slate-200 p-0.5">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 rounded-lg text-slate-600 hover:text-slate-900 flex items-center justify-center font-bold text-xs"
                >
                  −
                </button>
                <span className="w-7 text-center font-mono font-bold text-slate-900 text-xs">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-7 h-7 rounded-lg text-slate-600 hover:text-slate-900 flex items-center justify-center font-bold text-xs"
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 flex items-center justify-center gap-1.5 transition-all"
              >
                {isAdded ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <ShoppingBag className="w-3.5 h-3.5 text-[#6C4DF6]" />}
                <span>{isAdded ? 'Added to Cart' : 'Add to Cart'}</span>
              </button>

              {/* Buy Now */}
              <button
                type="button"
                onClick={handleBuyNow}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#6C4DF6] to-[#06B6D4] text-white font-black text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all hover:scale-102"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Buy Now</span>
              </button>
            </div>

            {/* View Full Details link */}
            <button
              type="button"
              onClick={() => onOpenDetail(product)}
              className="w-full text-center text-xs text-[#6C4DF6] hover:underline font-bold pt-1 flex items-center justify-center gap-1"
            >
              <span>View Full Details & Specs</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
