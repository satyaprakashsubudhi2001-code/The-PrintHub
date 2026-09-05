import React, { useState } from 'react';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Sparkles,
  ShoppingBag,
  Gift,
  QrCode,
  Smartphone,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStore } from '../../context/StoreContext';
import { shippingService } from '../../services/shippingService';
import { paymentService } from '../../services/paymentService';

export function CheckoutView() {
  const {
    cartItems,
    currentUser,
    currentTheme,
    navigateTo,
    createCustomerOrder,
    setActiveTrackingOrder,
    openAuthModal,
  } = useStore();

  // Checkout Form State
  const [address, setAddress] = useState({
    fullName: currentUser?.name || 'Satya Kumar',
    phone: currentUser?.mobile || '+91 98765 43210',
    email: currentUser?.email || 'satya.designer@gmail.com',
    addressLine1: 'Villa 14, Lotus Boulevard, Sector 100',
    city: 'Noida',
    state: 'Uttar Pradesh',
    pinCode: '201304',
    country: 'India',
    addressType: 'Home',
  });

  const [shippingMethod, setShippingMethod] = useState('express'); // 'standard' | 'express'
  const [paymentMethod, setPaymentMethod] = useState('razorpay'); // 'razorpay' | 'upi' | 'card' | 'wallet' | 'cod'
  const [useWallet, setUseWallet] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [serviceability, setServiceability] = useState({
    checked: true,
    serviceable: true,
    estimatedDays: '2–4 Days',
    city: 'Delhi NCR',
  });
  const [orderConfirmed, setOrderConfirmed] = useState(null);
  const [checkoutError, setCheckoutError] = useState('');

  // Cart Price Calculations
  const subtotal = cartItems.reduce((sum, it) => sum + (it.totalPrice || it.unitPrice * it.quantity), 0);
  const isFreeShipping = subtotal >= 999;
  const shippingFee = isFreeShipping ? 0 : shippingMethod === 'express' ? 150 : 80;
  const grandSubtotal = subtotal + shippingFee;

  const walletBalance = currentUser?.walletBalance || 0;
  const walletDeduction = useWallet && currentUser ? Math.min(walletBalance, grandSubtotal) : 0;
  const finalPayable = Math.max(0, grandSubtotal - walletDeduction);

  // Handle PIN Code Validation
  const handlePinChange = async (newPin) => {
    setAddress((prev) => ({ ...prev, pinCode: newPin }));
    if (newPin.replace(/\D/g, '').length === 6) {
      const res = await shippingService.checkServiceability(newPin);
      setServiceability({
        checked: true,
        serviceable: res.serviceable,
        estimatedDays: res.couriers[0]?.estimatedDelivery || '3–5 Days',
        city: res.city,
      });
    }
  };

  // Submit Order & Process Payment
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setCheckoutError('');

    if (cartItems.length === 0) {
      setCheckoutError('Your cart is empty. Please add customized products to proceed.');
      return;
    }

    if (!address.fullName || !address.phone || !address.addressLine1 || !address.pinCode) {
      setCheckoutError('Please fill in all mandatory delivery address fields.');
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Process Payment via Abstracted Payment Hub
      const paymentResult = await paymentService.initiatePayment({
        method: paymentMethod,
        amount: grandSubtotal,
        walletDeduction,
        orderId: `TMP_${Date.now()}`,
        customer: {
          name: address.fullName,
          email: address.email,
          phone: address.phone,
        },
      });

      if (!paymentResult.success) {
        setCheckoutError(paymentResult.message || 'Payment processing failed. Please try again.');
        setIsProcessing(false);
        return;
      }

      // 2. Create Immutable Order Snapshot
      const newOrder = createCustomerOrder({
        items: cartItems,
        shippingAddress: address,
        shippingMethod: {
          id: shippingMethod,
          name: shippingMethod === 'express' ? 'Express Doorstep Delivery (2–4 Days)' : 'Standard Delivery (4–7 Days)',
          cost: shippingFee,
        },
        paymentMethod,
        paymentResult,
        walletDeducted: walletDeduction,
        subtotal,
        printingFee: 0,
        shippingCost: shippingFee,
        discount: 0,
        tax: 0,
        total: grandSubtotal,
      });

      // 3. Trigger Victory Confetti & Show Confirmation
      setIsProcessing(false);
      setOrderConfirmed(newOrder);

      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'],
      });
    } catch (err) {
      setIsProcessing(false);
      setCheckoutError('An unexpected error occurred during order confirmation.');
    }
  };

  // If order is placed, show instant luxury confirmation screen
  if (orderConfirmed) {
    return (
      <div className="min-h-screen bg-[#12002E] text-slate-100 flex items-center justify-center p-4 sm:p-8 select-none">
        <div className="max-w-xl w-full p-6 sm:p-8 rounded-3xl bg-[#2C0E63] border border-[#F2CB30]/40 shadow-2xl space-y-6 text-center animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-3xl bg-[#F2CB30]/20 text-[#F2CB30] border border-[#F2CB30]/40 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <span className="px-3 py-1 rounded-full bg-[#F2CB30]/20 text-[#F2CB30] border border-[#F2CB30]/30 text-xs font-bold font-mono uppercase">
              ORDER CONFIRMED #{orderConfirmed.id}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-display mt-3">
              Your Custom Order is in Production! 🚀
            </h1>
            <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto">
              We have received your custom 3D design specs. Our industrial DTF printing technicians are preparing your artwork for high-density curing.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#12002E] border border-[#E5E5E5]/15 text-left space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Order Number:</span>
              <span className="text-white font-mono font-bold">{orderConfirmed.orderNumber}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Delivery Address:</span>
              <span className="text-white truncate max-w-[240px]">{orderConfirmed.shippingAddress.addressLine1}, {orderConfirmed.shippingAddress.city}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Payment Status:</span>
              <span className="text-emerald-400 font-bold">{orderConfirmed.paymentStatus} ({orderConfirmed.paymentMethod?.toUpperCase()})</span>
            </div>
            <div className="flex justify-between text-slate-400 border-t border-[#E5E5E5]/15 pt-2">
              <span className="font-bold text-white">Grand Total:</span>
              <span className="text-[#F2CB30] font-mono font-black text-sm">₹{orderConfirmed.total.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => {
                setActiveTrackingOrder(orderConfirmed);
                navigateTo('account');
              }}
              className="flex-1 py-3.5 rounded-2xl bg-[#F2CB30] hover:bg-[#DA0090] text-[#12002E] font-black text-xs shadow-xl flex items-center justify-center gap-2 hover:scale-102 transition-all"
            >
              <Truck className="w-4 h-4" />
              <span>Track Live Production</span>
            </button>

            <button
              onClick={() => navigateTo('home')}
              className="py-3.5 px-6 rounded-2xl bg-[#12002E] hover:bg-[#2C0E63] text-slate-300 hover:text-white font-bold text-xs transition-colors"
            >
              Back to Store
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#12002E] text-slate-100 py-8 px-4 sm:px-8 select-none">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Breadcrumb */}
        <div className="flex items-center justify-between border-b border-[#E5E5E5]/15 pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateTo('design-by-customer')}
              className="p-2 rounded-xl bg-[#2C0E63] border border-[#E5E5E5]/15 text-slate-400 hover:text-white transition-colors"
              title="Back to Studio"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white font-display flex items-center gap-2">
                <span>Secure Checkout</span>
                <span className="px-2 py-0.5 rounded-md bg-[#F2CB30]/20 text-[#F2CB30] border border-[#F2CB30]/30 text-[10px] font-mono uppercase">
                  256-Bit Encrypted
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Direct-to-Film industrial printing • Express door delivery with real-time AWB tracking
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Razorpay & UPI Verified</span>
          </div>
        </div>

        {checkoutError && (
          <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{checkoutError}</span>
          </div>
        )}

        {/* 2-Column Split Checkout Layout */}
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* =================================================================
             LEFT COLUMN (7 COLS): ADDRESS + SHIPPING + PAYMENT SELECTOR
             ================================================================= */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. DELIVERY ADDRESS FORM */}
            <div className="p-6 rounded-3xl bg-[#12002E] border border-[#E5E5E5]/15 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#E5E5E5]/15 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#F2CB30]/20 text-[#F2CB30]">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-white font-display">1. Shipping & Delivery Address</h2>
                    <p className="text-[11px] text-slate-400">Enter where you'd like your custom order delivered</p>
                  </div>
                </div>

                {!currentUser && (
                  <button
                    type="button"
                    onClick={() => openAuthModal('login')}
                    className="text-xs text-[#F2CB30] hover:underline font-bold"
                  >
                    Login to auto-fill
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    placeholder="Recipient Full Name"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#12002E] border border-[#E5E5E5]/20 text-white focus:outline-none focus:border-[#F2CB30]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Mobile Contact (+91) *</label>
                  <input
                    type="tel"
                    required
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#12002E] border border-[#E5E5E5]/20 text-white font-mono focus:outline-none focus:border-[#F2CB30]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-semibold mb-1">Street Address & Flat / House / Landmark *</label>
                  <input
                    type="text"
                    required
                    value={address.addressLine1}
                    onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                    placeholder="House No, Apartment Name, Street Area"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#12002E] border border-[#E5E5E5]/20 text-white focus:outline-none focus:border-[#F2CB30]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">PIN Code (6 Digits) *</label>
                  <input
                    type="text"
                    required
                    maxLength="6"
                    value={address.pinCode}
                    onChange={(e) => handlePinChange(e.target.value)}
                    placeholder="e.g. 110001"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#12002E] border border-[#E5E5E5]/20 text-white font-mono focus:outline-none focus:border-[#F2CB30]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">City / Region *</label>
                  <input
                    type="text"
                    required
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    placeholder="City"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#12002E] border border-[#E5E5E5]/20 text-white focus:outline-none focus:border-[#F2CB30]"
                  />
                </div>
              </div>
            </div>

            {/* 2. SHIPPING METHOD */}
            <div className="p-6 rounded-3xl bg-[#12002E] border border-[#E5E5E5]/15 shadow-xl space-y-4">
              <div className="flex items-center gap-2.5 border-b border-[#E5E5E5]/15 pb-3">
                <div className="p-2 rounded-xl bg-[#F2CB30]/20 text-[#F2CB30]">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-white font-display">2. Delivery Speed & Carrier</h2>
                  <p className="text-[11px] text-slate-400">Fulfilled by Shiprocket multi-carrier express network</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => setShippingMethod('express')}
                  className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                    shippingMethod === 'express'
                      ? 'bg-[#2C0E63] border-[#F2CB30] ring-2 ring-[#F2CB30]/30'
                      : 'bg-[#12002E] border-[#E5E5E5]/15 hover:bg-[#2C0E63]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <span>⚡ Express Air Shipping</span>
                    </span>
                    <span className="text-xs font-black text-emerald-400">
                      {isFreeShipping ? 'FREE' : '₹150'}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">Estimated Delivery: 2–4 Days (Air Cargo)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShippingMethod('standard')}
                  className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                    shippingMethod === 'standard'
                      ? 'bg-[#2C0E63] border-[#F2CB30] ring-2 ring-[#F2CB30]/30'
                      : 'bg-[#12002E] border-[#E5E5E5]/15 hover:bg-[#2C0E63]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">🚚 Standard Surface Delivery</span>
                    <span className="text-xs font-black text-emerald-400">
                      {isFreeShipping ? 'FREE' : '₹80'}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">Estimated Delivery: 4–7 Days</span>
                </button>
              </div>
            </div>

            {/* 3. PAYMENT METHOD GATEWAY */}
            <div className="p-6 rounded-3xl bg-[#12002E] border border-[#E5E5E5]/15 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#E5E5E5]/15 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#F2CB30]/20 text-[#F2CB30]">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-white font-display">3. Payment Gateway & Options</h2>
                    <p className="text-[11px] text-slate-400">Instant Razorpay UPI, Cards, NetBanking, or COD</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                  <Lock className="w-3 h-3" />
                  <span>Secure SSL</span>
                </div>
              </div>

              {/* Wallet Deduction Option */}
              {currentUser && walletBalance > 0 && (
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      id="walletCheck"
                      checked={useWallet}
                      onChange={(e) => setUseWallet(e.target.checked)}
                      className="w-4 h-4 text-emerald-500 rounded bg-[#12002E] border-slate-700 cursor-pointer"
                    />
                    <label htmlFor="walletCheck" className="text-slate-200 font-semibold cursor-pointer">
                      Use PrintHub Wallet Credits (₹{walletBalance.toLocaleString()})
                    </label>
                  </div>
                  <span className="font-mono font-bold text-emerald-400">
                    -₹{walletDeduction.toLocaleString()}
                  </span>
                </div>
              )}

              {/* Payment Methods Grid */}
              <div className="space-y-2.5 text-xs">
                {[
                  {
                    id: 'razorpay',
                    title: 'Razorpay Online Gateway',
                    desc: 'UPI, Google Pay, PhonePe, Cards, NetBanking',
                    icon: QrCode,
                    badge: 'Recommended',
                  },
                  {
                    id: 'upi',
                    title: 'Instant UPI Dynamic QR',
                    desc: 'Scan QR using any UPI app (GPay, Paytm, BHIM)',
                    icon: Smartphone,
                  },
                  {
                    id: 'card',
                    title: 'Credit / Debit Card',
                    desc: 'Visa, MasterCard, RuPay, Amex',
                    icon: CreditCard,
                  },
                  {
                    id: 'cod',
                    title: 'Cash on Delivery (COD)',
                    desc: 'Pay cash to the delivery agent upon receiving parcel',
                    icon: Truck,
                  },
                ].map((pm) => (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setPaymentMethod(pm.id)}
                    className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      paymentMethod === pm.id
                        ? 'bg-[#2C0E63] border-[#F2CB30] ring-2 ring-[#F2CB30]/30 shadow-md'
                        : 'bg-[#12002E] border-[#E5E5E5]/15 hover:bg-[#2C0E63]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${paymentMethod === pm.id ? 'bg-[#F2CB30]/20 text-[#F2CB30]' : 'bg-[#12002E] text-slate-400'}`}>
                        <pm.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{pm.title}</span>
                          {pm.badge && (
                            <span className="px-1.5 py-0.5 rounded-full bg-[#F2CB30]/20 text-[#F2CB30] text-[9px] font-black uppercase">
                              {pm.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400">{pm.desc}</span>
                      </div>
                    </div>

                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === pm.id ? 'border-[#F2CB30] bg-[#F2CB30]' : 'border-[#E5E5E5]/20'}`}>
                      {paymentMethod === pm.id && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* =================================================================
             RIGHT COLUMN (5 COLS): STICKY ORDER SUMMARY & PAYMENT TRIGGER
             ================================================================= */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28 sm:lg:top-32">
            <div className="p-6 rounded-3xl bg-[#12002E] border border-[#E5E5E5]/15 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-[#E5E5E5]/15 pb-3">
                <h2 className="text-sm font-black text-white font-display">
                  Order Summary ({cartItems.length} Custom {cartItems.length === 1 ? 'Item' : 'Items'})
                </h2>
                <span className="text-[11px] text-slate-400">DTF Ready</span>
              </div>

              {/* Items Mini-List */}
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1 no-scrollbar">
                {cartItems.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-3 rounded-2xl bg-[#12002E] border border-[#E5E5E5]/15 flex items-center gap-3"
                  >
                    <img
                      src={item.previewImage || item.image}
                      alt={item.productName}
                      className="w-12 h-12 object-cover rounded-xl border border-[#E5E5E5]/15 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-white truncate">{item.productName}</h4>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {item.colorName} • Size {item.size} • Qty {item.quantity}
                      </p>
                      <span className="text-[10px] text-[#F2CB30] font-bold block">
                        {item.printingMethodName || 'DTF Print'}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-white font-mono">
                      ₹{item.totalPrice?.toLocaleString() || item.unitPrice * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 border-t border-[#E5E5E5]/15 pt-3 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Custom Products Subtotal:</span>
                  <span className="text-white font-mono">₹{subtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>Shipping Fee:</span>
                  <span className="text-white font-mono">
                    {isFreeShipping ? <span className="text-emerald-400 font-bold">FREE</span> : `₹${shippingFee}`}
                  </span>
                </div>

                {walletDeduction > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>PrintHub Wallet Applied:</span>
                    <span className="font-mono">-₹{walletDeduction.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-400">
                  <span>GST Taxes (5% Included):</span>
                  <span className="text-slate-300 font-mono">₹{Math.round(subtotal * 0.05)}</span>
                </div>

                <div className="flex justify-between items-center border-t border-[#E5E5E5]/15 pt-3">
                  <div>
                    <span className="text-sm font-black text-white block font-display">Grand Total Payable</span>
                    <span className="text-[10px] text-slate-400 font-mono">Guaranteed print fidelity</span>
                  </div>
                  <span className="text-xl font-black text-[#F2CB30] font-display">
                    ₹{finalPayable.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Pay & Confirm Order CTA */}
              <button
                type="submit"
                disabled={isProcessing || cartItems.length === 0}
                className="w-full py-4 rounded-2xl bg-[#F2CB30] hover:bg-[#DA0090] text-[#12002E] font-black text-sm shadow-xl shadow-[#F2CB30]/20 flex items-center justify-center gap-2 transition-all hover:scale-102 active:scale-98 disabled:opacity-50"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Verifying with Payment Gateway...</span>
                  </div>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>
                      {paymentMethod === 'cod' ? 'Place Cash on Delivery Order' : `Pay ₹${finalPayable.toLocaleString()} & Confirm Order`}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
