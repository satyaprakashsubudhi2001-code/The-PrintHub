import React, { useState, useMemo } from 'react';
import {
  Plus,
  Trash2,
  DollarSign,
  User,
  Phone,
  Mail,
  MapPin,
  ShoppingBag,
  CheckCircle2,
  AlertCircle,
  FileText,
  Calculator,
  Truck,
  CreditCard,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export function AdminManualOrderTab({ onOrderCreated }) {
  const {
    products = [],
    inventory = [],
    createManualOrder,
    adminRole,
  } = useStore();

  // Form State
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    pincode: '',
    source: 'WhatsApp', // WhatsApp, Phone, Walk-in, Bulk, Offline
  });

  const [items, setItems] = useState([
    {
      id: 'item-1',
      productId: products[0]?.id || '',
      productName: products[0]?.name || 'Custom Apparel',
      sku: products[0]?.sku || 'SKU-001',
      size: 'L',
      color: 'Black',
      quantity: 1,
      unitPrice: products[0]?.price || 599,
      unitCost: products[0]?.cost || 280,
    },
  ]);

  const [pricing, setPricing] = useState({
    discountType: 'flat', // 'flat' | 'percent'
    discountValue: 0,
    shippingFee: 0,
    taxRate: 18, // 18% GST
    isTaxIncluded: false,
  });

  const [payment, setPayment] = useState({
    status: 'PAID', // PAID, PENDING, PARTIAL, COD
    method: 'UPI', // UPI, Cash, Bank Transfer, Card
    transactionRef: '',
    notes: '',
  });

  const [fulfillmentStatus, setFulfillmentStatus] = useState('CONFIRMED');
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Financial Calculations
  const calculations = useMemo(() => {
    const rawSubtotal = items.reduce((sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0), 0);
    const totalCost = items.reduce((sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unitCost) || 0), 0);

    let discountAmount = 0;
    if (pricing.discountType === 'percent') {
      discountAmount = (rawSubtotal * (Number(pricing.discountValue) || 0)) / 100;
    } else {
      discountAmount = Number(pricing.discountValue) || 0;
    }
    discountAmount = Math.min(rawSubtotal, Math.max(0, discountAmount));

    const discountedSubtotal = Math.max(0, rawSubtotal - discountAmount);
    const shipping = Number(pricing.shippingFee) || 0;

    let taxAmount = 0;
    if (pricing.isTaxIncluded) {
      taxAmount = discountedSubtotal - (discountedSubtotal / (1 + (Number(pricing.taxRate) || 0) / 100));
    } else {
      taxAmount = (discountedSubtotal * (Number(pricing.taxRate) || 0)) / 100;
    }

    const grandTotal = pricing.isTaxIncluded
      ? discountedSubtotal + shipping
      : discountedSubtotal + shipping + taxAmount;

    const netProfit = grandTotal - totalCost - shipping;
    const margin = grandTotal > 0 ? (netProfit / grandTotal) * 100 : 0;

    return {
      rawSubtotal,
      totalCost,
      discountAmount,
      discountedSubtotal,
      shipping,
      taxAmount,
      grandTotal: Math.round(grandTotal),
      netProfit: Math.round(netProfit),
      margin: Math.round(margin * 10) / 10,
    };
  }, [items, pricing]);

  // Handle Add Item
  const handleAddItem = () => {
    const defaultProd = products[0] || {};
    setItems((prev) => [
      ...prev,
      {
        id: `item-${Date.now()}`,
        productId: defaultProd.id || '',
        productName: defaultProd.name || 'Custom Item',
        sku: defaultProd.sku || `SKU-${Date.now().toString().slice(-4)}`,
        size: 'L',
        color: 'Black',
        quantity: 1,
        unitPrice: defaultProd.price || 499,
        unitCost: defaultProd.cost || 220,
      },
    ]);
  };

  // Handle Remove Item
  const handleRemoveItem = (id) => {
    if (items.length <= 1) {
      setErrorMsg('An order must contain at least 1 line item.');
      setTimeout(() => setErrorMsg(null), 3000);
      return;
    }
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  // Handle Item Field Change
  const handleItemChange = (id, field, value) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        if (field === 'productId') {
          const selected = products.find((p) => p.id === value);
          if (selected) {
            return {
              ...item,
              productId: selected.id,
              productName: selected.name,
              sku: selected.sku || item.sku,
              unitPrice: selected.price || item.unitPrice,
              unitCost: selected.cost || 250,
            };
          }
        }
        return { ...item, [field]: value };
      })
    );
  };

  // Submit Order
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!customer.name.trim()) {
      setErrorMsg('Please specify customer name.');
      return;
    }
    if (!customer.phone.trim()) {
      setErrorMsg('Please specify customer phone / WhatsApp number.');
      return;
    }

    const orderPayload = {
      source: customer.source,
      customer: {
        name: customer.name.trim(),
        phone: customer.phone.trim(),
        email: customer.email.trim() || `${customer.name.toLowerCase().replace(/\s+/g, '')}@offline.order`,
        address: customer.address.trim(),
        city: customer.city.trim(),
        pincode: customer.pincode.trim(),
      },
      items: items.map((it) => ({
        productId: it.productId,
        name: it.productName,
        sku: it.sku,
        size: it.size,
        color: it.color,
        quantity: Number(it.quantity) || 1,
        unitPrice: Number(it.unitPrice) || 0,
        unitCost: Number(it.unitCost) || 0,
        totalPrice: (Number(it.quantity) || 1) * (Number(it.unitPrice) || 0),
        totalCost: (Number(it.quantity) || 1) * (Number(it.unitCost) || 0),
      })),
      subtotal: calculations.discountedSubtotal,
      discount: calculations.discountAmount,
      shipping: calculations.shipping,
      tax: calculations.taxAmount,
      total: calculations.grandTotal,
      totalCost: calculations.totalCost,
      estimatedProfit: calculations.netProfit,
      marginPercent: calculations.margin,
      paymentStatus: payment.status,
      paymentMethod: payment.method,
      transactionRef: payment.transactionRef,
      orderStatus: fulfillmentStatus,
      internalNotes: payment.notes,
      orderType: 'MANUAL',
    };

    const newOrder = createManualOrder(orderPayload);
    setSuccessMsg(`Order #${newOrder.id} successfully created and booked! Stock has been adjusted.`);
    setErrorMsg(null);

    // Reset Form
    setCustomer({
      name: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      pincode: '',
      source: 'WhatsApp',
    });
    setPricing({
      discountType: 'flat',
      discountValue: 0,
      shippingFee: 0,
      taxRate: 18,
      isTaxIncluded: false,
    });
    setPayment({
      status: 'PAID',
      method: 'UPI',
      transactionRef: '',
      notes: '',
    });

    if (onOrderCreated) {
      setTimeout(() => onOrderCreated(newOrder), 1500);
    }
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-[#E5C690] border border-[#B8A98F] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#183630] uppercase font-display tracking-tight">
              Manual Order Entry & POS Dispatch
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#183630] text-[#E5DAC9] text-[10px] font-bold">
              [ OFFLINE & DIRECT SALES ]
            </span>
          </div>
          <p className="text-[#183630]/75 text-xs font-sans mt-1">
            Record direct phone orders, WhatsApp inquiries, walk-in studio clients, or bulk transactions without customer storefront login. Automatically deducts inventory and feeds live P&L.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-[#183630] text-[#E5DAC9] border border-[#B8A98F] text-[11px] font-bold">
            Role: {adminRole?.name || adminRole?.id || 'Super Administrator'}
          </span>
        </div>
      </div>

      {/* Toast Feedback */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-[#183630] text-[#E5DAC9] border border-[#B8A98F] flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-[#E5C690] shrink-0" />
          <span className="font-bold flex-1">{successMsg}</span>
          <button
            type="button"
            onClick={() => setSuccessMsg(null)}
            className="px-2 py-1 rounded bg-[#E5C690] text-[#183630] font-bold"
          >
            DISMISS
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-900/30 text-red-900 border border-red-500/50 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span className="font-bold flex-1">{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Customer Info & Line Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Section 1: Customer Details */}
            <div className="p-6 rounded-3xl bg-[#E5DAC9] border border-[#B8A98F] shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#B8A98F]/40 pb-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#183630]" />
                  <h3 className="text-xs font-bold text-[#183630] uppercase">1. Customer Identification</h3>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-[#183630]/70 uppercase">Order Source:</span>
                  <select
                    value={customer.source}
                    onChange={(e) => setCustomer({ ...customer, source: e.target.value })}
                    className="px-2 py-1 rounded-lg bg-[#E5DAC9] border border-[#183630] text-[#183630] font-bold text-[11px]"
                  >
                    <option value="WhatsApp">WhatsApp Chat</option>
                    <option value="Phone">Phone Order</option>
                    <option value="Walk-in">Walk-in Studio Client</option>
                    <option value="Bulk Inquiry">Corporate / Bulk B2B</option>
                    <option value="Offline">Trade Expo / Event</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#183630] font-bold mb-1">Customer Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikramaditya Sharma"
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-[#183630] placeholder:text-[#183630]/40 focus:border-[#183630] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#183630] font-bold mb-1">Mobile / WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-[#183630] placeholder:text-[#183630]/40 focus:border-[#183630] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#183630] font-bold mb-1">Email Address (Optional)</label>
                  <input
                    type="email"
                    placeholder="vikram@example.com"
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-[#183630] placeholder:text-[#183630]/40 focus:border-[#183630] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#183630] font-bold mb-1">City / Region</label>
                  <input
                    type="text"
                    placeholder="e.g. Mumbai, Maharashtra"
                    value={customer.city}
                    onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-[#183630] placeholder:text-[#183630]/40 focus:border-[#183630] outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[#183630] font-bold mb-1">Shipping / Delivery Address</label>
                  <textarea
                    rows="2"
                    placeholder="Flat / Studio / Street Address with Landmarks..."
                    value={customer.address}
                    onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-[#183630] placeholder:text-[#183630]/40 focus:border-[#183630] outline-none resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Line Items */}
            <div className="p-6 rounded-3xl bg-[#E5DAC9] border border-[#B8A98F] shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#B8A98F]/40 pb-3">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#183630]" />
                  <h3 className="text-xs font-bold text-[#183630] uppercase">
                    2. Order Line Items ({items.length})
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="px-3 py-1.5 rounded-xl bg-[#183630] text-[#E5DAC9] hover:text-[#E5C690] text-[11px] font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>[ ADD ITEM ]</span>
                </button>
              </div>

              <div className="space-y-3">
                {items.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-[#E5DAC9] border border-[#B8A98F] hover:border-[#183630] transition-colors space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-[#183630] text-xs">
                        Item #{idx + 1}:
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-1 rounded text-red-700 hover:bg-red-200/50 transition-colors"
                        title="Remove Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                      {/* Product Selector */}
                      <div className="sm:col-span-4">
                        <label className="text-[10px] text-[#183630]/70 font-bold block mb-1">Catalog Product</label>
                        <select
                          value={item.productId}
                          onChange={(e) => handleItemChange(item.id, 'productId', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-[#183630] font-bold text-xs"
                        >
                          <option value="">-- Custom Manual Blank --</option>
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} (₹{p.price})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Product Name (Editable if custom) */}
                      <div className="sm:col-span-3">
                        <label className="text-[10px] text-[#183630]/70 font-bold block mb-1">Item Title / Spec</label>
                        <input
                          type="text"
                          value={item.productName}
                          onChange={(e) => handleItemChange(item.id, 'productName', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-[#183630] text-xs"
                        />
                      </div>

                      {/* SKU */}
                      <div className="sm:col-span-2">
                        <label className="text-[10px] text-[#183630]/70 font-bold block mb-1">SKU Code</label>
                        <input
                          type="text"
                          value={item.sku}
                          onChange={(e) => handleItemChange(item.id, 'sku', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-[#183630] text-xs"
                        />
                      </div>

                      {/* Size */}
                      <div className="sm:col-span-1">
                        <label className="text-[10px] text-[#183630]/70 font-bold block mb-1">Size</label>
                        <input
                          type="text"
                          value={item.size}
                          onChange={(e) => handleItemChange(item.id, 'size', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-[#183630] text-xs text-center uppercase"
                        />
                      </div>

                      {/* Color */}
                      <div className="sm:col-span-2">
                        <label className="text-[10px] text-[#183630]/70 font-bold block mb-1">Color</label>
                        <input
                          type="text"
                          value={item.color}
                          onChange={(e) => handleItemChange(item.id, 'color', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-[#183630] text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-[#B8A98F]/30">
                      <div>
                        <label className="text-[10px] text-[#183630]/70 font-bold block mb-1">Quantity</label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(item.id, 'quantity', Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-full px-2.5 py-1.5 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-[#183630] font-bold text-xs"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-[#183630]/70 font-bold block mb-1">Unit Sell Price (₹)</label>
                        <input
                          type="number"
                          min="0"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="w-full px-2.5 py-1.5 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-[#183630] font-bold text-xs"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-[#183630]/70 font-bold block mb-1">Unit Cost (COGS ₹)</label>
                        <input
                          type="number"
                          min="0"
                          value={item.unitCost}
                          onChange={(e) => handleItemChange(item.id, 'unitCost', parseFloat(e.target.value) || 0)}
                          className="w-full px-2.5 py-1.5 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-[#183630] text-xs"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-[#183630]/70 font-bold block mb-1">Subtotal Line (₹)</label>
                        <div className="px-2.5 py-1.5 rounded-xl bg-[#E5C690] border border-[#B8A98F] text-[#183630] font-black text-xs">
                          ₹{((item.quantity || 1) * (item.unitPrice || 0)).toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right 1 Col: Billing, Payment & P&L Summary */}
          <div className="space-y-6">
            {/* Pricing Adjustments */}
            <div className="p-6 rounded-3xl bg-[#E5DAC9] border border-[#B8A98F] shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-[#B8A98F]/40 pb-3">
                <Calculator className="w-4 h-4 text-[#183630]" />
                <h3 className="text-xs font-bold text-[#183630] uppercase">3. Adjustments & Tax</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] text-[#183630] font-bold">Discount Applied</label>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setPricing({ ...pricing, discountType: 'flat' })}
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                          pricing.discountType === 'flat' ? 'bg-[#183630] text-[#E5DAC9]' : 'bg-[#E5DAC9] border border-[#B8A98F]'
                        }`}
                      >
                        FLAT ₹
                      </button>
                      <button
                        type="button"
                        onClick={() => setPricing({ ...pricing, discountType: 'percent' })}
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                          pricing.discountType === 'percent' ? 'bg-[#183630] text-[#E5DAC9]' : 'bg-[#E5DAC9] border border-[#B8A98F]'
                        }`}
                      >
                        % OFF
                      </button>
                    </div>
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={pricing.discountValue}
                    onChange={(e) => setPricing({ ...pricing, discountValue: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-[#183630] text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-[#183630] font-bold block mb-1">Shipping / Courier Charge (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={pricing.shippingFee}
                    onChange={(e) => setPricing({ ...pricing, shippingFee: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-[#183630] text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-[#183630] font-bold block mb-1">GST Tax Rate (%)</label>
                  <select
                    value={pricing.taxRate}
                    onChange={(e) => setPricing({ ...pricing, taxRate: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-[#183630] text-xs font-bold"
                  >
                    <option value="0">0% (Nil / Exempted)</option>
                    <option value="5">5% (Apparel ≤ ₹1000)</option>
                    <option value="12">12% (Standard)</option>
                    <option value="18">18% (Custom Printing / High Value)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payment & Fulfillment */}
            <div className="p-6 rounded-3xl bg-[#E5DAC9] border border-[#B8A98F] shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-[#B8A98F]/40 pb-3">
                <CreditCard className="w-4 h-4 text-[#183630]" />
                <h3 className="text-xs font-bold text-[#183630] uppercase">4. Payment & Status</h3>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-[#183630] font-bold block mb-1">Payment Status</label>
                    <select
                      value={payment.status}
                      onChange={(e) => setPayment({ ...payment, status: e.target.value })}
                      className="w-full px-2 py-1.5 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-[#183630] font-bold text-xs"
                    >
                      <option value="PAID">PAID</option>
                      <option value="PENDING">PENDING</option>
                      <option value="PARTIAL">PARTIAL</option>
                      <option value="COD">CASH ON DELIVERY</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-[#183630] font-bold block mb-1">Payment Method</label>
                    <select
                      value={payment.method}
                      onChange={(e) => setPayment({ ...payment, method: e.target.value })}
                      className="w-full px-2 py-1.5 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-[#183630] font-bold text-xs"
                    >
                      <option value="UPI">UPI / GPay / PhonePe</option>
                      <option value="Cash">Direct Cash</option>
                      <option value="Bank Transfer">NEFT / RTGS</option>
                      <option value="Card">POS Card Swipe</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-[#183630] font-bold block mb-1">Transaction Ref / UTR (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. UTR-309482710492"
                    value={payment.transactionRef}
                    onChange={(e) => setPayment({ ...payment, transactionRef: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-[#183630] text-xs"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-[#183630] font-bold block mb-1">Fulfillment Initial Stage</label>
                  <select
                    value={fulfillmentStatus}
                    onChange={(e) => setFulfillmentStatus(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-[#183630] font-bold text-xs"
                  >
                    <option value="CONFIRMED">CONFIRMED (Awaiting Production)</option>
                    <option value="IN_PRODUCTION">IN PRODUCTION (Printing Now)</option>
                    <option value="READY_TO_SHIP">READY TO SHIP (Packed)</option>
                    <option value="DELIVERED">DELIVERED (Handed to Customer)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-[#183630] font-bold block mb-1">Internal Atelier Notes</label>
                  <textarea
                    rows="2"
                    placeholder="e.g. Rush delivery, print front 300dpi, client picked up sample"
                    value={payment.notes}
                    onChange={(e) => setPayment({ ...payment, notes: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-[#183630] text-xs resize-none"
                  />
                </div>
              </div>
            </div>

            {/* P&L Live Margin Preview Card (#E5C690) */}
            <div className="p-6 rounded-3xl bg-[#E5C690] border border-[#B8A98F] shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-[#183630] uppercase border-b border-[#B8A98F]/40 pb-2">
                Order P&L Financial Summary
              </h3>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#183630]/80">
                  <span>Gross Line Total:</span>
                  <span>₹{calculations.rawSubtotal.toLocaleString('en-IN')}</span>
                </div>
                {calculations.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-800 font-bold">
                    <span>Discount:</span>
                    <span>- ₹{calculations.discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#183630]/80">
                  <span>Shipping:</span>
                  <span>₹{calculations.shipping.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[#183630]/80">
                  <span>GST ({pricing.taxRate}%):</span>
                  <span>₹{calculations.taxAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="pt-2 border-t border-[#183630]/20 flex justify-between font-black text-sm text-[#183630]">
                  <span>Total Order Value:</span>
                  <span>₹{calculations.grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Profitability Pill */}
              <div className="p-3 rounded-2xl bg-[#183630] text-[#E5DAC9] space-y-1 mt-3">
                <div className="flex justify-between text-[11px]">
                  <span>Estimated Direct COGS:</span>
                  <span className="font-mono">₹{calculations.totalCost.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[11px] font-bold text-[#E5C690]">
                  <span>Net Estimated Profit:</span>
                  <span className="font-mono font-black">₹{calculations.netProfit.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[10px] text-[#E5DAC9]/70 pt-1 border-t border-[#B8A98F]/20">
                  <span>Gross Profit Margin:</span>
                  <span className="font-bold text-[#E5C690]">{calculations.margin}%</span>
                </div>
              </div>

              {/* Final Submit Button */}
              <button
                type="submit"
                className="w-full mt-4 py-3 rounded-2xl bg-[#183630] hover:bg-[#183630]/90 text-[#E5C690] border border-[#B8A98F] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all hover:shadow-lg"
              >
                <span>[ CREATE & BOOK MANUAL ORDER ]</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
