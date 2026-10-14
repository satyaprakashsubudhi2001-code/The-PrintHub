import React from 'react';
import {
  X,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ORDER_STATUSES } from '../../constants/orderWorkflow';
import { WhatsAppIcon } from '../UI/WhatsAppIcon';

export function CustomerOrderTrackingModal() {
  const {
    activeTrackingOrder,
    setActiveTrackingOrder,
    storeSettings,
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
  const whatsappNumber = storeSettings?.whatsapp?.replace(/\D/g, '') || '917992801158';
  const whatsappMessage = encodeURIComponent(
    `Hi The PrintHub, I need assistance regarding my Order #${order.id}.${
      order.shipment?.awbNumber ? ` AWB Number: ${order.shipment.awbNumber}.` : ''
    }`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#183630]/70 backdrop-blur-md select-none animate-in fade-in">
      <div className="w-full max-w-3xl max-h-[90vh] bg-[#E5DAC9] border-2 border-[#B8A98F] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 text-[#183630]">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-[#183630] border-b border-[#B8A98F]/40 flex items-center justify-between text-[#E5DAC9]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E5C690]/20 text-[#E5C690] border border-[#B8A98F]/40 flex items-center justify-center">
              <Truck className="w-5 h-5 text-[#E5C690]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-[#E5DAC9] font-display">
                  Track Order #{order.id}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase font-mono bg-[#E5C690] text-[#183630] border border-[#B8A98F]">
                  {currentStatusObj.label}
                </span>
              </div>
              <span className="text-[11px] text-[#E5DAC9]/70 font-mono">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

          <button
            onClick={() => setActiveTrackingOrder(null)}
            className="p-2 rounded-xl text-[#E5DAC9]/70 hover:text-[#E5DAC9] hover:bg-[#B8A98F]/20 transition-colors cursor-pointer"
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
            <div className="p-4 rounded-2xl bg-[#183630]/10 border border-[#B8A98F] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold text-[#183630]/70 uppercase tracking-wider block">
                  Carrier & Tracking AWB
                </span>
                <span className="text-sm font-black text-[#183630] flex items-center gap-1.5 mt-0.5">
                  <span>{order.shipment.courierName}</span>
                  <span className="text-[#B8A98F]">•</span>
                  <code className="text-[#183630] font-mono">{order.shipment.awbNumber}</code>
                </span>
                {order.shipment.estimatedDelivery && (
                  <span className="text-[11px] text-[#183630] block mt-0.5">
                    Estimated Delivery: {order.shipment.estimatedDelivery}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={order.shipment.trackingUrl || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-[#183630] hover:bg-[#183630]/90 text-[#E5DAC9] text-xs font-bold border border-[#B8A98F] flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>Live Courier Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-[#183630]/10 border border-[#B8A98F] flex items-center gap-3">
              <Clock className="w-5 h-5 text-[#183630] shrink-0" />
              <div className="text-xs">
                <span className="text-[#183630] font-bold block">Production Queue Active</span>
                <span className="text-[#183630]/70 text-[11px]">
                  AWB and courier tracking will be generated once printing and quality check are complete.
                </span>
              </div>
            </div>
          )}

          {/* =================================================================
             2. STEP-BY-STEP PROGRESS STEPPER
             ================================================================= */}
          <div className="p-5 rounded-3xl bg-[#183630]/5 border border-[#B8A98F] space-y-4">
            <h3 className="text-xs font-bold text-[#183630] uppercase tracking-wider">
              Industrial Production & Delivery Progress
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#B8A98F]">
              {trackingSteps.map((step, idx) => {
                const isPassed = currentStatusObj.step >= (idx + 1) || order.orderStatus === 'DELIVERED';
                const isCurrent = order.orderStatus === step.id;

                return (
                  <div key={step.id} className="relative flex items-start gap-3">
                    <div
                      className={`absolute -left-6 w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-black ${
                        isPassed
                          ? 'bg-[#183630] border-[#183630] text-[#E5DAC9]'
                          : 'bg-[#E5DAC9] border-[#B8A98F] text-[#183630]/60'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-3.5 h-3.5 text-[#E5C690]" /> : idx + 1}
                    </div>

                    <div className="min-w-0">
                      <span className={`text-xs font-bold block ${isCurrent ? 'text-[#183630]' : isPassed ? 'text-[#183630]' : 'text-[#183630]/50'}`}>
                        {step.label}
                      </span>
                      <span className="text-[11px] text-[#183630]/70 block">{step.desc}</span>
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
            <h3 className="text-xs font-bold text-[#183630] uppercase tracking-wider">
              Customized Merchandise in this Package
            </h3>

            <div className="space-y-2.5">
              {order.items.map((it) => (
                <div
                  key={it.id}
                  className="p-3.5 rounded-2xl bg-[#E5DAC9] border border-[#B8A98F] flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={it.mockupImage || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=300&q=80'}
                      alt={it.productName}
                      className="w-14 h-14 object-cover rounded-xl border border-[#B8A98F]/50 bg-[#183630]/10 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-[#183630] truncate">{it.productName}</h4>
                      <p className="text-[10px] text-[#183630]/70 font-mono">
                        Color: {it.colorName} • Size: {it.size} • Qty: x{it.quantity}
                      </p>
                      <span className="text-[10px] text-[#183630] font-bold block mt-0.5">
                        {it.printingMethodName} • {it.designSpecs?.front ? 'Front Artwork Loaded' : 'Single Sided'}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-black text-[#183630] font-mono">
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
            <div className="p-4 rounded-2xl bg-[#183630]/5 border border-[#B8A98F] space-y-1">
              <span className="text-[10px] font-bold text-[#183630]/70 uppercase block">Delivery Address:</span>
              <span className="font-bold text-[#183630] block">{order.shippingAddress?.fullName}</span>
              <p className="text-[#183630]/80 text-[11px] leading-relaxed">
                {order.shippingAddress?.addressLine1}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pinCode}
              </p>
              <span className="text-[#183630]/70 font-mono text-[10px] block">📞 {order.shippingAddress?.phone}</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#183630]/5 border border-[#B8A98F] space-y-1">
              <span className="text-[10px] font-bold text-[#183630]/70 uppercase block">Payment & Invoice:</span>
              <div className="flex justify-between text-[#183630]/80">
                <span>Method:</span>
                <span className="font-bold uppercase text-[#183630]">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-[#183630]/80">
                <span>Status:</span>
                <span className="text-[#183630] font-bold">{order.paymentStatus}</span>
              </div>
              <div className="flex justify-between text-[#183630]/80 border-t border-[#B8A98F]/40 pt-1">
                <span className="font-bold text-[#183630]">Grand Total:</span>
                <span className="text-[#183630] font-bold font-mono">₹{order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-[#183630] border-t border-[#B8A98F]/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-[#E5DAC9]">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#183630] hover:bg-[#183630]/90 text-[#E5DAC9] border border-[#B8A98F] text-xs font-black flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
          >
            <WhatsAppIcon size={18} className="w-4 h-4 shrink-0" />
            <span>Chat on WhatsApp regarding Order #{order.id}</span>
          </a>

          <button
            onClick={() => setActiveTrackingOrder(null)}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#E5C690] hover:bg-[#d9b87c] text-[#183630] text-xs font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
