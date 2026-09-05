import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  CheckCircle2,
  Wallet,
  Sparkles,
  CreditCard,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStore } from '../../context/StoreContext';

export function CartDrawer() {
  const {
    cartItems,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    isCartOpen,
    setIsCartOpen,
    navigateTo,
    currentUser,
    deductWalletMoney,
    openAuthModal,
    currentTheme,
    loadCustomization,
  } = useStore();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [useWallet, setUseWallet] = useState(true);

  if (!isCartOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const shipping = subtotal > 999 ? 0 : 99;
  const grandTotal = subtotal + shipping;

  const walletBalance = currentUser?.walletBalance || 0;
  const walletDeduction = useWallet && currentUser ? Math.min(walletBalance, grandTotal) : 0;
  const finalPayable = grandTotal - walletDeduction;

  const handleCheckout = () => {
    setIsCheckingOut(true);

    if (walletDeduction > 0) {
      deductWalletMoney(walletDeduction, `Order Checkout (${cartItems.length} items)`);
    }

    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderPlaced(true);
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f97316', '#06b6d4', '#eab308', '#ec4899', '#10b981'],
      });
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-md animate-in fade-in select-none">
      <div className="w-full max-w-md h-full bg-[#12002E] border-l border-white/10 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#DA0090]/20 text-[#DA0090]">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Your Custom Cart</h3>
              <p className="text-[11px] text-slate-400">
                {cartItems.length} custom {cartItems.length === 1 ? 'item' : 'items'} ready for production
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsCartOpen(false);
              setOrderPlaced(false);
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#2C0E63] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {orderPlaced ? (
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3 my-auto">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-white">Order Confirmed!</h4>
              <p className="text-xs text-slate-300">
                Thank you for ordering with <span className="text-[#F2CB30] font-bold">The PrintHub</span>.
                Your custom 3D model configurations and print files have been transferred to our direct-to-garment DTF queue.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    clearCart();
                    setOrderPlaced(false);
                    setIsCartOpen(false);
                    navigateTo('home');
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#F2CB30] hover:bg-[#DA0090] hover:text-white text-[#12002E] text-xs font-bold transition-all"
                >
                  Return to Home
                </button>
              </div>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-3 p-6">
              <div className="w-16 h-16 rounded-2xl bg-[#2C0E63]/40 border border-white/10 flex items-center justify-center text-2xl text-slate-400">
                🛒
              </div>
              <h4 className="text-sm font-bold text-slate-300">Your Cart is Empty</h4>
              <p className="text-xs text-slate-500 max-w-xs">
                Upload your graphics, choose your product colors and click "Add to Cart" to see items here.
              </p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-[#2C0E63]/30 border border-white/10 space-y-3 relative group"
              >
                <div className="flex gap-3">
                  <div className="w-16 h-16 rounded-xl bg-[#12002E] border border-white/10 flex items-center justify-center shrink-0 p-1.5 overflow-hidden">
                    <img
                      src={item.previewImage}
                      alt={item.productName}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-xs font-bold text-white truncate">
                        {item.productName}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-400">
                      <span
                        className="w-2.5 h-2.5 rounded-full inline-block border border-white/20"
                        style={{ backgroundColor: item.color }}
                      />
                      <span>{item.colorName}</span>
                      <span>•</span>
                      <span className="font-bold text-slate-300">Size: {item.size}</span>
                    </div>

                    <div className="text-[10px] text-[#DA0090] font-semibold mt-1">
                      {item.printingMethodName}
                    </div>

                    {item.config && (
                      <button
                        onClick={() => {
                          setIsCartOpen(false);
                          loadCustomization(item.config);
                        }}
                        className="mt-1.5 px-2.5 py-1 rounded-lg bg-[#DA0090]/15 border border-[#DA0090]/30 text-[#DA0090] hover:bg-[#DA0090]/25 hover:text-white text-[10px] font-bold transition-all flex items-center gap-1"
                      >
                        <span>✏️</span>
                        <span>Edit Design</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <div className="flex items-center gap-1 p-0.5 rounded-xl bg-[#12002E] border border-white/10">
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-400 hover:text-white"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-400 hover:text-white"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-white">
                      ₹{item.totalPrice.toLocaleString()}
                    </span>
                    <p className="text-[10px] text-slate-500">₹{item.unitPrice}/pc</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout Summary */}
        {!orderPlaced && cartItems.length > 0 && (
          <div className="p-4 border-t border-white/10 bg-[#12002E] space-y-3">
            {/* Wallet Balance Payment Card */}
            {currentUser ? (
              <div
                onClick={() => setUseWallet(!useWallet)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  useWallet && walletBalance > 0
                    ? 'bg-emerald-500/10 border-emerald-500/40'
                    : 'bg-[#2C0E63]/40 border-white/10'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-xl ${useWallet && walletBalance > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-[#2C0E63] text-slate-400'}`}>
                    <Wallet className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Use PrintHub Wallet Balance
                    </span>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      Available: <span className="text-emerald-400 font-bold">₹{walletBalance.toLocaleString()}</span>
                    </span>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={useWallet && walletBalance > 0}
                  onChange={() => setUseWallet(!useWallet)}
                  disabled={walletBalance <= 0}
                  className="w-4 h-4 rounded text-emerald-500 bg-[#12002E] border-slate-700 cursor-pointer"
                />
              </div>
            ) : (
              <div
                onClick={() => openAuthModal('login')}
                className="p-3 rounded-2xl bg-[#2C0E63] border border-[#F2CB30]/30 flex items-center justify-between cursor-pointer hover:border-[#F2CB30]/60 transition-all"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#F2CB30]" />
                  <span className="text-xs font-bold text-white">Login & Use ₹500 Bonus</span>
                </div>
                <span className="text-[10px] font-bold text-[#F2CB30] underline">Login Now</span>
              </div>
            )}

            {/* Pricing Summary */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="font-semibold text-white font-mono">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Express Shipping</span>
                <span className="font-semibold text-emerald-400">
                  {shipping === 0 ? 'FREE' : `₹${shipping}`}
                </span>
              </div>

              {walletDeduction > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span className="flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>Wallet Balance Applied</span>
                  </span>
                  <span className="font-mono">-₹{walletDeduction.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/10">
                <span>Final Payable Amount</span>
                <span className={`font-display text-base font-black ${finalPayable === 0 ? 'text-emerald-400' : 'text-[#F2CB30]'}`}>
                  {finalPayable === 0 ? '₹0 (Paid via Wallet)' : `₹${finalPayable.toLocaleString()}`}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsCartOpen(false);
                navigateTo('checkout');
              }}
              className="w-full py-3.5 rounded-2xl bg-[#F2CB30] hover:bg-[#DA0090] hover:text-white text-[#12002E] text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-[#F2CB30]/20 transition-all hover:scale-102 active:scale-98"
            >
              <CreditCard className="w-4 h-4" />
              <span>Proceed to Secure Checkout →</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
