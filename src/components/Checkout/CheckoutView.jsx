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

  // Place and Execute Order
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setCheckoutError('');

    if (cartItems.length === 0) {
      setCheckoutError('Your shopping cart is currently empty.');
      return;
    }

    if (!address.fullName || !address.phone || !address.addressLine1 || !address.pinCode) {
      setCheckoutError('Please complete all mandatory delivery address fields.');
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Process payment if online
      let paymentResult = { status: 'SUCCESS', paymentId: `PAY-${Date.now()}` };

      if (paymentMethod === 'razorpay' && finalPayable > 0) {
        paymentResult = await paymentService.processRazorpayCheckout({
          amount: finalPayable,
          customerName: address.fullName,
          customerEmail: address.email,
          customerPhone: address.phone,
          orderNote: `Custom Printing Order (${cartItems.length} items)`,
        });
      }

      // 2. Persist order in Store Context
      const newOrder = createCustomerOrder({
        customer: {
          name: address.fullName,
          email: address.email,
          phone: address.phone,
        },
        shippingAddress: address,
        items: cartItems,
        shippingInfo: {
          method: shippingMethod,
          cost: shippingFee,
          carrier: shippingMethod === 'express' ? 'BlueDart Express Air' : 'Delhivery Surface',
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
        colors: ['#183630', '#E5DAC9', '#E5C690', '#B8A98F'],
      });
    } catch (err) {
      setIsProcessing(false);
      setCheckoutError('An unexpected error occurred during order confirmation.');
    }
  };

  // If order is placed, show instant luxury confirmation screen
  if (orderConfirmed) {
    return (
      <div className="min-h-screen bg-[#E5DAC9] text-[#183630] flex items-center justify-center p-4 sm:p-8 select-none">
        <div className="max-w-xl w-full p-6 sm:p-8 rounded-3xl bg-[#E5DAC9] border-2 border-[#B8A98F] shadow-2xl space-y-6 text-center animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-3xl bg-[#183630] text-[#E5C690] border border-[#B8A98F] flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <span className="px-3 py-1 rounded-full bg-[#183630] text-[#E5C690] border border-[#B8A98F] text-xs font-bold font-mono uppercase">
              ORDER CONFIRMED #{orderConfirmed.id}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#183630] font-display mt-3">
              Your Custom Order is in Production! 🚀
            </h1>
            <p className="text-xs text-[#183630]/80 mt-2 max-w-md mx-auto">
              We have received your custom 3D design specs. Our industrial DTF printing technicians are preparing your artwork for high-density curing.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#183630] border border-[#B8A98F]/40 text-left space-y-2 text-xs text-[#E5DAC9]">
            <div className="flex justify-between text-[#E5DAC9]/70">
              <span>Order Number:</span>
              <span className="text-[#E5DAC9] font-mono font-bold">{orderConfirmed.orderNumber}</span>
            </div>
            <div className="flex justify-between text-[#E5DAC9]/70">
              <span>Delivery Address:</span>
              <span className="text-[#E5DAC9] truncate max-w-[240px]">{orderConfirmed.shippingAddress.addressLine1}, {orderConfirmed.shippingAddress.city}</span>
            </div>
            <div className="flex justify-between text-[#E5DAC9]/70">
              <span>Payment Status:</span>
              <span className="text-[#E5C690] font-bold">{orderConfirmed.paymentStatus} ({orderConfirmed.paymentMethod?.toUpperCase()})</span>
            </div>
            <div className="flex justify-between text-[#E5DAC9]/70 border-t border-[#B8A98F]/30 pt-2">
              <span className="font-bold text-[#E5DAC9]">Grand Total:</span>
              <span className="text-[#E5C690] font-mono font-black text-sm">₹{orderConfirmed.total.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => {
                setActiveTrackingOrder(orderConfirmed);
              }}
              className="flex-1 py-3 rounded-2xl bg-[#183630] hover:bg-[#183630]/90 text-[#E5DAC9] border border-[#B8A98F] font-black text-xs transition-all shadow-md cursor-pointer"
            >
              Track Live Production (AWB)
            </button>
            <button
              onClick={() => navigateTo('home')}
              className="flex-1 py-3 rounded-2xl bg-[#E5C690] hover:bg-[#d9b87c] text-[#183630] font-black text-xs transition-all cursor-pointer"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E5DAC9] text-[#183630] py-8 px-4 sm:px-8 select-none">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Breadcrumb */}
        <div className="flex items-center justify-between border-b border-[#B8A98F]/40 pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateTo('design-by-customer')}
              className="p-2 rounded-xl bg-[#183630] border border-[#B8A98F] text-[#E5DAC9] hover:bg-[#183630]/80 transition-colors cursor-pointer"
              title="Back to Studio"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[#183630] font-display flex items-center gap-2">
                <span>Secure Checkout</span>
                <span className="px-2 py-0.5 rounded-md bg-[#183630] text-[#E5C690] border border-[#B8A98F] text-[10px] font-mono uppercase">
                  256-Bit Encrypted
                </span>
              </h1>
              <p className="text-xs text-[#183630]/70">
                Direct-to-Film industrial printing • Express door delivery with real-time AWB tracking
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#183630]/80">
            <ShieldCheck className="w-4 h-4 text-[#183630]" />
            <span>100% Razorpay & UPI Verified</span>
          </div>
        </div>

        {checkoutError && (
          <div className="p-4 rounded-2xl bg-[#183630] border border-[#B8A98F] text-[#E5C690] text-xs font-bold flex items-center gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-[#E5C690] shrink-0" />
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
            <div className="p-6 rounded-3xl bg-[#E5DAC9] border-2 border-[#B8A98F] shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-[#B8A98F]/40 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#183630] text-[#E5C690]">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-[#183630] font-display">1. Shipping & Delivery Address</h2>
                    <p className="text-[11px] text-[#183630]/70">Enter where you'd like your custom order delivered</p>
                  </div>
                </div>

                {!currentUser && (
                  <button
                    type="button"
                    onClick={() => openAuthModal('login')}
                    className="text-xs text-[#183630] hover:underline font-bold cursor-pointer"
                  >
                    Login to auto-fill
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div>
                  <label className="block text-[#183630] font-semibold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    placeholder="Recipient Full Name"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-[#183630] focus:outline-none focus:border-[#183630]"
                  />
                </div>

                <div>
                  <label className="block text-[#183630] font-semibold mb-1">Mobile Contact (+91) *</label>
                  <input
                    type="tel"
                    required
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-[#183630] font-mono focus:outline-none focus:border-[#183630]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[#183630] font-semibold mb-1">Street Address & Flat / House / Landmark *</label>
                  <input
                    type="text"
                    required
                    value={address.addressLine1}
                    onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                    placeholder="House No, Apartment Name, Street Area"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-[#183630] focus:outline-none focus:border-[#183630]"
                  />
                </div>

                <div>
                  <label className="block text-[#183630] font-semibold mb-1">PIN Code (6 Digits) *</label>
                  <input
                    type="text"
                    required
                    maxLength="6"
                    value={address.pinCode}
                    onChange={(e) => handlePinChange(e.target.value)}
                    placeholder="e.g. 110001"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-[#183630] font-mono focus:outline-none focus:border-[#183630]"
                  />
                </div>

                <div>
                  <label className="block text-[#183630] font-semibold mb-1">City / Region *</label>
                  <input
                    type="text"
                    required
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    placeholder="City"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-[#183630] focus:outline-none focus:border-[#183630]"
                  />
                </div>
              </div>
            </div>

            {/* 2. SHIPPING METHOD */}
            <div className="p-6 rounded-3xl bg-[#E5DAC9] border-2 border-[#B8A98F] shadow-md space-y-4">
              <div className="flex items-center gap-2.5 border-b border-[#B8A98F]/40 pb-3">
                <div className="p-2 rounded-xl bg-[#183630] text-[#E5C690]">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-[#183630] font-display">2. Delivery Speed & Carrier</h2>
                  <p className="text-[11px] text-[#183630]/70">Fulfilled by Shiprocket multi-carrier express network</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => setShippingMethod('express')}
                  className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 cursor-pointer ${
                    shippingMethod === 'express'
                      ? 'bg-[#183630] border-[#183630] text-[#E5DAC9] shadow-md'
                      : 'bg-[#E5DAC9] border-[#B8A98F] text-[#183630] hover:border-[#183630]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold flex items-center gap-1.5">
                      <span>⚡ Express Air Shipping</span>
                    </span>
                    <span className="text-xs font-black">
                      {isFreeShipping ? 'FREE' : '₹150'}
                    </span>
                  </div>
                  <span className={`text-[11px] ${shippingMethod === 'express' ? 'text-[#E5DAC9]/80' : 'text-[#183630]/70'}`}>
                    Estimated Delivery: 2–4 Days (Air Cargo)
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setShippingMethod('standard')}
                  className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 cursor-pointer ${
                    shippingMethod === 'standard'
                      ? 'bg-[#183630] border-[#183630] text-[#E5DAC9] shadow-md'
                      : 'bg-[#E5DAC9] border-[#B8A98F] text-[#183630] hover:border-[#183630]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold">🚚 Standard Surface Delivery</span>
                    <span className="text-xs font-black">
                      {isFreeShipping ? 'FREE' : '₹80'}
                    </span>
                  </div>
                  <span className={`text-[11px] ${shippingMethod === 'standard' ? 'text-[#E5DAC9]/80' : 'text-[#183630]/70'}`}>
                    Estimated Delivery: 4–7 Days
                  </span>
                </button>
              </div>
            </div>

            {/* 3. PAYMENT METHOD GATEWAY */}
            <div className="p-6 rounded-3xl bg-[#E5DAC9] border-2 border-[#B8A98F] shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-[#B8A98F]/40 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#183630] text-[#E5C690]">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-[#183630] font-display">3. Payment Gateway & Options</h2>
                    <p className="text-[11px] text-[#183630]/70">Instant Razorpay UPI, Cards, NetBanking, or COD</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[10px] text-[#183630] font-mono">
                  <Lock className="w-3 h-3" />
                  <span>Secure SSL</span>
                </div>
              </div>

              {/* Wallet Deduction Option */}
              {currentUser && walletBalance > 0 && (
                <div className="p-3.5 rounded-2xl bg-[#183630] border border-[#B8A98F] text-[#E5DAC9] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      id="walletCheck"
                      checked={useWallet}
                      onChange={(e) => setUseWallet(e.target.checked)}
                      className="w-4 h-4 text-[#183630] rounded bg-[#E5DAC9] border-[#B8A98F] cursor-pointer"
                    />
                    <label htmlFor="walletCheck" className="text-[#E5DAC9] font-semibold cursor-pointer">
                      Use PrintHub Wallet Credits (₹{walletBalance.toLocaleString()})
                    </label>
                  </div>
                  <span className="font-mono font-bold text-[#E5C690]">
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
                    className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      paymentMethod === pm.id
                        ? 'bg-[#183630] text-[#E5DAC9] border-[#183630] shadow-md'
                        : 'bg-[#E5DAC9] text-[#183630] border-[#B8A98F] hover:border-[#183630]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${paymentMethod === pm.id ? 'bg-[#E5C690] text-[#183630]' : 'bg-[#183630]/10 text-[#183630]'}`}>
                        <pm.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{pm.title}</span>
                          {pm.badge && (
                            <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase ${
                              paymentMethod === pm.id ? 'bg-[#E5C690] text-[#183630]' : 'bg-[#183630] text-[#E5DAC9]'
                            }`}>
                              {pm.badge}
                            </span>
                          )}
                        </div>
                        <span className={`text-[11px] ${paymentMethod === pm.id ? 'text-[#E5DAC9]/70' : 'text-[#183630]/70'}`}>{pm.desc}</span>
                      </div>
                    </div>

                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === pm.id ? 'border-[#E5C690] bg-[#E5C690]' : 'border-[#B8A98F]'}`}>
                      {paymentMethod === pm.id && <div className="w-1.5 h-1.5 rounded-full bg-[#183630]" />}
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
            <div className="p-6 rounded-3xl bg-[#E5DAC9] border-2 border-[#B8A98F] shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-[#B8A98F]/40 pb-3">
                <h2 className="text-sm font-black text-[#183630] font-display">
                  Order Summary ({cartItems.length} Custom {cartItems.length === 1 ? 'Item' : 'Items'})
                </h2>
                <span className="text-[11px] text-[#183630]/70">DTF Ready</span>
              </div>

              {/* Items Mini-List */}
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1 no-scrollbar">
                {cartItems.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-3 rounded-2xl bg-[#183630]/5 border border-[#B8A98F] flex items-center gap-3"
                  >
                    <img
                      src={item.previewImage || item.image}
                      alt={item.productName}
                      className="w-12 h-12 object-cover rounded-xl border border-[#B8A98F]/50 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-[#183630] truncate">{item.productName}</h4>
                      <p className="text-[10px] text-[#183630]/70 font-mono">
                        {item.colorName} • Size {item.size} • Qty {item.quantity}
                      </p>
                      <span className="text-[10px] text-[#183630] font-bold block">
                        {item.printingMethodName || 'DTF Print'}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-[#183630] font-mono">
                      ₹{item.totalPrice?.toLocaleString() || item.unitPrice * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 border-t border-[#B8A98F]/40 pt-3 text-xs">
                <div className="flex justify-between text-[#183630]/70">
                  <span>Custom Products Subtotal:</span>
                  <span className="text-[#183630] font-mono">₹{subtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-[#183630]/70">
                  <span>Shipping Fee:</span>
                  <span className="text-[#183630] font-mono">
                    {isFreeShipping ? <span className="text-[#183630] font-bold">FREE</span> : `₹${shippingFee}`}
                  </span>
                </div>

                {walletDeduction > 0 && (
                  <div className="flex justify-between text-[#183630] font-semibold">
                    <span>PrintHub Wallet Applied:</span>
                    <span className="font-mono">-₹{walletDeduction.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#183630]/70">
                  <span>GST Taxes (5% Included):</span>
                  <span className="text-[#183630]/80 font-mono">₹{Math.round(subtotal * 0.05)}</span>
                </div>

                <div className="flex justify-between items-center border-t border-[#B8A98F]/40 pt-3">
                  <div>
                    <span className="text-sm font-black text-[#183630] block font-display">Grand Total Payable</span>
                    <span className="text-[10px] text-[#183630]/60 font-mono">Guaranteed print fidelity</span>
                  </div>
                  <span className="text-xl font-black text-[#183630] font-display">
                    ₹{finalPayable.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Pay & Confirm Order CTA */}
              <button
                type="submit"
                disabled={isProcessing || cartItems.length === 0}
                className="w-full py-4 rounded-2xl bg-[#183630] hover:bg-[#183630]/90 text-[#E5DAC9] border border-[#B8A98F] font-black text-sm shadow-xl flex items-center justify-center gap-2 transition-all hover:scale-102 active:scale-98 disabled:opacity-50 cursor-pointer"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-[#E5DAC9] border-t-transparent rounded-full animate-spin" />
                    <span>Verifying with Payment Gateway...</span>
                  </div>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-[#E5C690]" />
                    <span>
                      {paymentMethod === 'cod' ? 'Place Cash on Delivery Order' : `Pay ₹${finalPayable.toLocaleString()} & Confirm Order`}
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#E5C690]" />
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
