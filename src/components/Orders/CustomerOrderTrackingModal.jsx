import React from 'react';
import {
  X,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Download,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ORDER_STATUSES } from '../../constants/orderWorkflow';

export function CustomerOrderTrackingModal() {
  const {
    activeTrackingOrder,
    setActiveTrackingOrder,
    storeSettings,
    currentTheme,
  } = useStore();

  if (!activeTrackingOrder) return null;

  const order = activeTrackingOrder;
  const currentStatusObj = ORDER_STATUSES[order.orderStatus] || { label: order.orderStatus, step: 1 };

  const trackingSteps = [
    { id: 'NEW', label: 'Order Placed', desc: 'Custom design specs received' },
    { id: 'CONFIRMED', label: 'Pre-Press Approved', desc: 'RIP vector file verified' },
    { id: 'PRINTING', label: 'DTF Printing', desc: '8-Head pigment curing' },
    { id: 'QUALITY_CHECK', label: 'Quality Passed', desc: 'Color fidelity check passed' },
    { id: 'SHIPPED', label: 'Dispatched / In Transit', desc: 'Shipped via express courier' },
    { id: 'DELIVERED', label: 'Delivered', desc: 'Delivered to your doorstep' },
  ];

  // WhatsApp Support deep-link
  const whatsappNumber = storeSettings?.whatsapp?.replace(/\D/g, '') || '919876543210';
  const whatsappMessage = encodeURIComponent(
    `Hi The PrintHub, I need assistance regarding my Order #${order.id}.${
      order.shipment?.awbNumber ? ` AWB Number: ${order.shipment.awbNumber}.` : ''
    }`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md select-none animate-in fade-in">
      <div className="w-full max-w-3xl max-h-[90vh] bg-[#12002E] border border-white/15 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-[#2C0E63] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#DA0090]/20 text-[#DA0090] border border-[#DA0090]/30 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white font-display">
                  Track Order #{order.id}
                </h2>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase font-mono border ${currentStatusObj.badge || 'bg-[#DA0090]/20 text-[#DA0090] border-[#DA0090]/30'}`}>
                  {currentStatusObj.label}
                </span>
              </div>
              <span className="text-[11px] text-slate-300 font-mono">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

          <button
            onClick={() => setActiveTrackingOrder(null)}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* =================================================================
             1. SHIPMENT DISPATCH STATUS BANNER
             ================================================================= */}
          {order.shipment?.awbNumber ? (
            <div className="p-4 rounded-2xl bg-[#2C0E63]/30 border border-[#DA0090]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Carrier & Tracking AWB
                </span>
                <span className="text-sm font-black text-white flex items-center gap-1.5 mt-0.5">
                  <span>{order.shipment.courierName}</span>
                  <span className="text-slate-500">•</span>
                  <code className="text-[#F2CB30] font-mono">{order.shipment.awbNumber}</code>
                </span>
                {order.shipment.estimatedDelivery && (
                  <span className="text-[11px] text-emerald-400 block mt-0.5">
                    Estimated Delivery: {order.shipment.estimatedDelivery}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={order.shipment.trackingUrl || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-[#DA0090]/20 hover:bg-[#DA0090]/30 text-[#DA0090] text-xs font-bold border border-[#DA0090]/40 flex items-center gap-1.5 transition-all"
                >
                  <span>Live Courier Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-[#2C0E63]/30 border border-white/10 flex items-center gap-3">
              <Clock className="w-5 h-5 text-amber-400 shrink-0" />
              <div className="text-xs">
                <span className="text-slate-200 font-bold block">Production Queue Active</span>
                <span className="text-slate-400 text-[11px]">
                  AWB and courier tracking will be generated once printing and quality check are complete.
                </span>
              </div>
            </div>
          )}

          {/* =================================================================
             2. STEP-BY-STEP PROGRESS STEPPER
             ================================================================= */}
          <div className="p-5 rounded-3xl bg-[#2C0E63]/25 border border-white/10 space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Industrial Production & Delivery Progress
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#2C0E63]">
              {trackingSteps.map((step, idx) => {
                const isPassed = currentStatusObj.step >= (idx + 1) || order.orderStatus === 'DELIVERED';
                const isCurrent = order.orderStatus === step.id;

                return (
                  <div key={step.id} className="relative flex items-start gap-3">
                    <div
                      className={`absolute -left-6 w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-black ${
                        isPassed
                          ? 'bg-[#F2CB30] border-[#F2CB30] text-[#12002E]'
                          : 'bg-[#2C0E63] border-white/20 text-slate-400'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                    </div>

                    <div className="min-w-0">
                      <span className={`text-xs font-bold block ${isCurrent ? 'text-[#F2CB30]' : isPassed ? 'text-white' : 'text-slate-500'}`}>
                        {step.label}
                      </span>
                      <span className="text-[11px] text-slate-400 block">{step.desc}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* =================================================================
             3. CUSTOMIZED PRODUCTS SUMMARY
             ================================================================= */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Customized Merchandise in this Package
            </h3>

            <div className="space-y-2.5">
              {order.items.map((it) => (
                <div
                  key={it.id}
                  className="p-3.5 rounded-2xl bg-[#2C0E63]/30 border border-white/10 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={it.mockupImage || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=300&q=80'}
                      alt={it.productName}
                      className="w-14 h-14 object-cover rounded-xl border border-white/10 bg-[#12002E] shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{it.productName}</h4>
                      <p className="text-[10px] text-slate-400 font-mono">
                        Color: {it.colorName} • Size: {it.size} • Qty: x{it.quantity}
                      </p>
                      <span className="text-[10px] text-[#DA0090] font-bold block mt-0.5">
                        {it.printingMethodName} • {it.designSpecs?.front ? 'Front Artwork Loaded' : 'Single Sided'}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-black text-white font-mono">
                    ₹{(it.unitPrice * it.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* =================================================================
             4. DELIVERY ADDRESS & PAYMENT
             ================================================================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#2C0E63]/30 border border-white/10 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Delivery Address:</span>
              <span className="font-bold text-white block">{order.shippingAddress?.fullName}</span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {order.shippingAddress?.addressLine1}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pinCode}
              </p>
              <span className="text-slate-400 font-mono text-[10px] block">📞 {order.shippingAddress?.phone}</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#2C0E63]/30 border border-white/10 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Payment & Invoice:</span>
              <div className="flex justify-between text-slate-300">
                <span>Method:</span>
                <span className="font-bold uppercase text-[#F2CB30]">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Status:</span>
                <span className="text-emerald-400 font-bold">{order.paymentStatus}</span>
              </div>
              <div className="flex justify-between text-slate-300 border-t border-white/10 pt-1">
                <span className="font-bold text-white">Grand Total:</span>
                <span className="text-[#F2CB30] font-bold font-mono">₹{order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-[#2C0E63] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#F2CB30] hover:bg-[#DA0090] hover:text-white text-[#12002E] text-xs font-black flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <MessageSquare className="w-4 h-4 fill-current/20" />
            <span>Chat on WhatsApp regarding Order #{order.id}</span>
          </a>

          <button
            onClick={() => setActiveTrackingOrder(null)}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#12002E] hover:bg-[#1a0540] text-white text-xs font-bold border border-white/10 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
