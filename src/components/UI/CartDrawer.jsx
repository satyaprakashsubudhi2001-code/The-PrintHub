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
        colors: ['#183630', '#E5DAC9', '#E5C690', '#B8A98F'],
      });
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#183630]/60 backdrop-blur-md animate-in fade-in select-none">
      <div className="w-full max-w-md h-full bg-[#E5DAC9] border-l-2 border-[#B8A98F] flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300 text-[#183630]">
        {/* Header */}
        <div className="p-4 border-b border-[#B8A98F]/40 flex items-center justify-between bg-[#183630] text-[#E5DAC9]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#E5C690]/20 text-[#E5C690]">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#E5DAC9]">Your Custom Cart</h3>
              <p className="text-[11px] text-[#E5DAC9]/70">
                {cartItems.length} custom {cartItems.length === 1 ? 'item' : 'items'} ready for production
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsCartOpen(false);
              setOrderPlaced(false);
            }}
            className="p-2 rounded-xl text-[#E5DAC9]/70 hover:text-[#E5DAC9] hover:bg-[#B8A98F]/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {orderPlaced ? (
            <div className="p-6 rounded-2xl bg-[#183630] border border-[#B8A98F] text-[#E5DAC9] text-center space-y-3 my-auto">
              <div className="w-14 h-14 rounded-full bg-[#183630] border border-[#B8A98F] text-[#E5C690] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-[#E5DAC9]">Order Confirmed!</h4>
              <p className="text-xs text-[#E5DAC9]/80">
                Thank you for ordering with <span className="text-[#E5C690] font-bold">The PrintHub</span>.
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
                  className="w-full py-2.5 rounded-xl bg-[#E5C690] hover:bg-[#d9b87c] text-[#183630] text-xs font-bold transition-all cursor-pointer"
                >
                  Return to Home
                </button>
              </div>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-3 p-6">
              <div className="w-16 h-16 rounded-2xl bg-[#183630]/10 border border-[#B8A98F] flex items-center justify-center text-2xl text-[#183630]">
                🛒
              </div>
              <h4 className="text-sm font-bold text-[#183630]">Your Cart is Empty</h4>
              <p className="text-xs text-[#183630]/70 max-w-xs">
                Upload your graphics, choose your product colors and click "Add to Cart" to see items here.
              </p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-[#E5DAC9] border border-[#B8A98F] space-y-3 relative group"
              >
                <div className="flex gap-3">
                  <div className="w-16 h-16 rounded-xl bg-[#183630]/10 border border-[#B8A98F]/50 flex items-center justify-center shrink-0 p-1.5 overflow-hidden">
                    <img
                      src={item.previewImage}
                      alt={item.productName}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-xs font-bold text-[#183630] truncate">
                        {item.productName}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[#183630]/50 hover:text-[#183630] p-1 transition-colors cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[#183630]/70">
                      <span
                        className="w-2.5 h-2.5 rounded-full inline-block border border-[#B8A98F]"
                        style={{ backgroundColor: item.color }}
                      />
                      <span>{item.colorName}</span>
                      <span>•</span>
                      <span className="font-bold text-[#183630]">Size: {item.size}</span>
                    </div>

                    <div className="text-[10px] text-[#183630] font-semibold mt-1">
                      {item.printingMethodName}
                    </div>

                    {item.config && (
                      <button
                        onClick={() => {
                          setIsCartOpen(false);
                          loadCustomization(item.config);
                        }}
                        className="mt-1.5 px-2.5 py-1 rounded-lg bg-[#183630] text-[#E5DAC9] hover:bg-[#183630]/90 text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <span>✏️</span>
                        <span>Edit Design</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#B8A98F]/40">
                  <div className="flex items-center gap-1 p-0.5 rounded-xl bg-[#183630]/10 border border-[#B8A98F]/50">
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 rounded-lg flex items-center justify-center text-[#183630] hover:bg-[#183630]/20 cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-[#183630]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 rounded-lg flex items-center justify-center text-[#183630] hover:bg-[#183630]/20 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-[#183630]">
                      ₹{item.totalPrice.toLocaleString()}
                    </span>
                    <p className="text-[10px] text-[#183630]/70">₹{item.unitPrice}/pc</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout Summary */}
        {!orderPlaced && cartItems.length > 0 && (
          <div className="p-4 border-t border-[#B8A98F]/50 bg-[#183630] text-[#E5DAC9] space-y-3">
            {/* Wallet Balance Payment Card */}
            {currentUser ? (
              <div
                onClick={() => setUseWallet(!useWallet)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  useWallet && walletBalance > 0
                    ? 'bg-[#183630] border-[#E5C690]'
                    : 'bg-[#183630] border-[#B8A98F]/30'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-xl ${useWallet && walletBalance > 0 ? 'bg-[#E5C690] text-[#183630]' : 'bg-[#B8A98F]/20 text-[#E5DAC9]'}`}>
                    <Wallet className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#E5DAC9] block">
                      Use PrintHub Wallet Balance
                    </span>
                    <span className="text-[10px] text-[#E5DAC9]/70 block font-mono">
                      Available: <span className="text-[#E5C690] font-bold">₹{walletBalance.toLocaleString()}</span>
                    </span>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={useWallet && walletBalance > 0}
                  onChange={() => setUseWallet(!useWallet)}
                  disabled={walletBalance <= 0}
                  className="w-4 h-4 rounded text-[#183630] bg-[#E5DAC9] border-[#B8A98F] cursor-pointer"
                />
              </div>
            ) : (
              <div
                onClick={() => openAuthModal('login')}
                className="p-3 rounded-2xl bg-[#183630] border border-[#E5C690]/40 flex items-center justify-between cursor-pointer hover:border-[#E5C690] transition-all"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#E5C690]" />
                  <span className="text-xs font-bold text-[#E5DAC9]">Login & Use ₹500 Bonus</span>
                </div>
                <span className="text-[10px] font-bold text-[#E5C690] underline">Login Now</span>
              </div>
            )}

            {/* Pricing Summary */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#E5DAC9]/70">
                <span>Subtotal</span>
                <span className="font-semibold text-[#E5DAC9] font-mono">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#E5DAC9]/70">
                <span>Express Shipping</span>
                <span className="font-semibold text-[#E5C690]">
                  {shipping === 0 ? 'FREE' : `₹${shipping}`}
                </span>
              </div>

              {walletDeduction > 0 && (
                <div className="flex justify-between text-[#E5C690] font-semibold">
                  <span className="flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>Wallet Balance Applied</span>
                  </span>
                  <span className="font-mono">-₹{walletDeduction.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between text-sm font-bold text-[#E5DAC9] pt-2 border-t border-[#B8A98F]/30">
                <span>Final Payable Amount</span>
                <span className="font-display text-base font-black text-[#E5C690]">
                  {finalPayable === 0 ? '₹0 (Paid via Wallet)' : `₹${finalPayable.toLocaleString()}`}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsCartOpen(false);
                navigateTo('checkout');
              }}
              className="w-full py-3.5 rounded-2xl bg-[#E5C690] hover:bg-[#d9b87c] text-[#183630] text-xs font-black flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <CreditCard className="w-4 h-4 text-[#183630]" />
              <span>Proceed to Secure Checkout →</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
