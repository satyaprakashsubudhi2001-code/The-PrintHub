import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Clock,
  Truck,
  Printer,
  FileText,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  DollarSign,
  Download,
  Eye,
  Plus,
  MessageSquare,
  ShieldCheck,
  Send,
  Lock,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ORDER_STATUSES, ALLOWED_STATUS_TRANSITIONS, PAYMENT_STATUSES, SHIPPING_PROVIDERS } from '../../constants/orderWorkflow';
import { shippingService } from '../../services/shippingService';

export function AdminOrderDetailModal({ order, onClose }) {
  const {
    updateOrderStatus,
    createAdminShipment,
    processAdminRefund,
    addAdminOrderNote,
    adminUser,
    currentTheme,
  } = useStore();

  const [selectedNextStatus, setSelectedNextStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [selectedCourier, setSelectedCourier] = useState('delhivery');
  const [isBookingShipment, setIsBookingShipment] = useState(false);
  const [newNoteInput, setNewNoteInput] = useState('');
  const [showRefundDrawer, setShowRefundDrawer] = useState(false);
  const [refundAmount, setRefundAmount] = useState(order?.total || 0);
  const [refundReason, setRefundReason] = useState('Customer cancellation request');
  const [actionMessage, setActionMessage] = useState(null);
  const [printDocType, setPrintDocType] = useState(null); // 'label' | 'invoice'

  if (!order) return null;

  const currentStatusObj = ORDER_STATUSES[order.orderStatus] || { label: order.orderStatus, badge: 'bg-slate-800 text-slate-300' };
  const allowedTransitions = ALLOWED_STATUS_TRANSITIONS[order.orderStatus] || [];

  // Handle Status Update
  const handleStatusChange = (e) => {
    e.preventDefault();
    if (!selectedNextStatus) return;

    const res = updateOrderStatus(order.id, selectedNextStatus, statusNote, adminUser?.name || 'Administrator');
    if (res.success) {
      setActionMessage({ type: 'success', text: `Order #${order.id} transitioned to ${ORDER_STATUSES[selectedNextStatus]?.label}.` });
      setSelectedNextStatus('');
      setStatusNote('');
      setTimeout(() => setActionMessage(null), 4000);
    } else {
      setActionMessage({ type: 'error', text: res.message });
    }
  };

  // Handle Shipment Creation
  const handleCreateShipment = async () => {
    setIsBookingShipment(true);
    const res = await createAdminShipment(order.id, selectedCourier);
    setIsBookingShipment(false);

    if (res.success) {
      setActionMessage({ type: 'success', text: `Shipment booked with ${res.shipment.courierName}. AWB: ${res.shipment.awbNumber}` });
      setTimeout(() => setActionMessage(null), 4000);
    } else {
      setActionMessage({ type: 'error', text: res.message || 'Failed to book shipment.' });
    }
  };

  // Handle Refund Process
  const handleProcessRefund = async (e) => {
    e.preventDefault();
    const res = await processAdminRefund(order.id, parseInt(refundAmount, 10), refundReason);
    if (res.success) {
      setShowRefundDrawer(false);
      setActionMessage({ type: 'success', text: `Refund of ₹${refundAmount} processed successfully.` });
      setTimeout(() => setActionMessage(null), 4000);
    }
  };

  // Handle Note Submission
  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNoteInput.trim()) return;
    addAdminOrderNote(order.id, newNoteInput.trim());
    setNewNoteInput('');
  };

  const labelData = shippingService.generateShippingLabel(order);
  const invoiceData = shippingService.generateInvoice(order);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md select-none animate-in fade-in">
      <div className="w-full max-w-5xl max-h-[92vh] bg-studio-900 border border-slate-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 bg-studio-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-cyan-500/40 flex items-center justify-center p-1.5 shadow-glow-cyan">
              <img
                src="/logo-mark-white.png"
                alt="The PrintHub"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white font-display">
                  Order #{order.id}
                </h2>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase font-mono border ${currentStatusObj.badge}`}>
                  {currentStatusObj.label}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                Placed: {new Date(order.createdAt).toLocaleString('en-IN')} • Payment: <strong className="text-emerald-400 uppercase">{order.paymentStatus}</strong> ({order.paymentMethod})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPrintDocType('label')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white text-xs font-bold border border-slate-700 transition-colors"
              title="Print Shipping Label"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Label</span>
            </button>

            <button
              onClick={() => setPrintDocType('invoice')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white text-xs font-bold border border-slate-700 transition-colors"
              title="Print GST Invoice"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Invoice</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {actionMessage && (
          <div className={`p-3 text-xs font-bold flex items-center justify-between px-6 ${actionMessage.type === 'success' ? 'bg-emerald-500/20 text-emerald-300 border-b border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border-b border-rose-500/30'}`}>
            <span>{actionMessage.text}</span>
            <button onClick={() => setActionMessage(null)}>✕</button>
          </div>
        )}

        {/* Modal Scroll Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* =================================================================
             1. TOP ACTION CONTROLS: STATUS CHANGER + SHIPPING DISPATCHER
             ================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* A. State Machine Workflow Status Changer */}
            <form onSubmit={handleStatusChange} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Update Production Workflow Status
              </span>

              {allowedTransitions.length === 0 ? (
                <div className="p-3 rounded-xl bg-slate-900 text-slate-500 text-xs italic">
                  Order is in terminal state ({order.orderStatus}). No further transitions allowed.
                </div>
              ) : (
                <div className="space-y-2.5">
                  <div className="flex gap-2">
                    <select
                      value={selectedNextStatus}
                      onChange={(e) => setSelectedNextStatus(e.target.value)}
                      required
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
                    >
                      <option value="">Select Next Status...</option>
                      {allowedTransitions.map((statusKey) => (
                        <option key={statusKey} value={statusKey}>
                          → {ORDER_STATUSES[statusKey]?.label || statusKey}
                        </option>
                      ))}
                    </select>

                    <button
                      type="submit"
                      disabled={!selectedNextStatus}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-black text-xs shadow-glow-cyan disabled:opacity-40 transition-all"
                    >
                      Update
                    </button>
                  </div>

                  <input
                    type="text"
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    placeholder="Status note (e.g. Passed 300 DPI QC check)"
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              )}
            </form>

            {/* B. Shipping & AWB Booking Hub */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Logistics & Courier Dispatch
                </span>
                {order.shipment?.awbNumber && (
                  <span className="text-[10px] font-mono text-cyan-400 font-bold">
                    AWB: {order.shipment.awbNumber}
                  </span>
                )}
              </div>

              {order.shipment?.awbNumber ? (
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-white font-bold block">{order.shipment.courierName}</span>
                    <span className="text-[11px] text-emerald-400 font-mono">
                      Status: {order.shipment.status} • ETA: {order.shipment.estimatedDelivery}
                    </span>
                  </div>

                  <a
                    href={order.shipment.trackingUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 text-[11px] font-bold border border-indigo-500/30 flex items-center gap-1"
                  >
                    <span>Track</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ) : (
                <div className="flex gap-2">
                  <select
                    value={selectedCourier}
                    onChange={(e) => setSelectedCourier(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    {SHIPPING_PROVIDERS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.avgDays})
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={handleCreateShipment}
                    disabled={isBookingShipment}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md disabled:opacity-50 transition-all whitespace-nowrap"
                  >
                    {isBookingShipment ? 'Booking AWB...' : 'Create Shipment'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* =================================================================
             2. CUSTOMIZED PRODUCTS & SIDE-BY-SIDE DESIGN INSPECTOR
             ================================================================= */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
              Ordered Products & Side-by-Side Artwork Verification
            </h3>

            <div className="space-y-4">
              {order.items.map((item) => {
                const isCustom = item.isCustomizable !== false && item.productType !== 'ready_to_buy';
                const frontDesign = item.surfaceDesigns?.front?.dataUrl || item.originalDesignUrl || item.mockupImage;
                const backDesign = item.surfaceDesigns?.back?.dataUrl;
                const activeDesignUrl = frontDesign || backDesign;

                return (
                  <div
                    key={item.id}
                    className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-4 shadow-xl"
                  >
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white">{item.productName}</h4>
                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase font-mono ${isCustom ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'}`}>
                            {isCustom ? '🎨 CUSTOM DTF' : '🛍 READY-TO-BUY'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">
                          Colour: <strong className="text-white">{item.colorName || 'Default'}</strong> • Size: <strong className="text-cyan-400">{item.size || 'L'}</strong> • Qty: x{item.quantity} • Method: <strong className="text-indigo-300">{item.printingMethodName || 'DTF'}</strong>
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-base font-black text-white font-mono">
                          ₹{(item.unitPrice * item.quantity).toLocaleString()}
                        </span>
                        <span className="text-[10px] text-slate-500 block font-mono">
                          (₹{item.unitPrice}/unit)
                        </span>
                      </div>
                    </div>

                    {/* SIDE-BY-SIDE DESIGN INSPECTOR (Left: Final Mockup | Right: Original Uploaded Designs per Placement) */}
                    {isCustom ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* LEFT: FINAL MOCKUP */}
                          <div className="p-4 rounded-2xl bg-[#090d18] border border-slate-800 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-cyan-400 uppercase font-mono tracking-wider">
                                1. FINAL PRODUCT MOCKUP
                              </span>
                              <a
                                href={item.mockupImage || item.previewImage}
                                download={`mockup_${order.id}.jpg`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1 text-[10px] text-cyan-400 hover:underline font-mono"
                              >
                                <Download className="w-3 h-3" />
                                <span>Download Mockup</span>
                              </a>
                            </div>
                            <div className="w-full aspect-square rounded-xl bg-black flex items-center justify-center p-2 overflow-hidden border border-slate-800">
                              <img
                                src={item.mockupImage || item.previewImage || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80'}
                                alt="Final Mockup"
                                className="w-full h-full object-contain"
                              />
                            </div>
                          </div>

                          {/* RIGHT: ORIGINAL UPLOADED ARTWORKS */}
                          <div className="p-4 rounded-2xl bg-[#090d18] border border-slate-800 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-emerald-400 uppercase font-mono tracking-wider">
                                2. ORIGINAL UPLOADED ARTWORK(S)
                              </span>
                            </div>

                            {/* List of placement designs */}
                            {item.designSpecs?.placements?.length ? (
                              <div className="space-y-3">
                                {item.designSpecs.placements.map((plc, pIdx) => {
                                  const plcUrl = plc.designUrl || item.placementDesigns?.[plc.placementId]?.dataUrl || activeDesignUrl;
                                  return (
                                    <div key={pIdx} className="p-3 rounded-xl bg-black/80 border border-slate-800 space-y-2">
                                      <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-bold text-white font-mono">
                                          📍 {plc.placementName || plc.surface?.toUpperCase() || 'CUSTOM PRINT'}
                                        </span>
                                        {plcUrl && (
                                          <a
                                            href={plcUrl}
                                            download={`artwork_${plc.placementId || plc.surface || pIdx}_${order.id}.png`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center gap-1 text-[10px] text-emerald-400 hover:underline font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20"
                                          >
                                            <Download className="w-3 h-3" />
                                            <span>Download ({plc.widthInches}" × {plc.heightInches}")</span>
                                          </a>
                                        )}
                                      </div>
                                      {plcUrl ? (
                                        <div className="w-full h-32 rounded-lg bg-black flex items-center justify-center p-2 border border-slate-800/80">
                                          <img
                                            src={plcUrl}
                                            alt={plc.placementName || 'Artwork'}
                                            className="w-full h-full object-contain filter drop-shadow-md"
                                          />
                                        </div>
                                      ) : (
                                        <span className="text-[10px] text-slate-500 font-mono block py-2">
                                          Plain Blank Zone (No artwork uploaded)
                                        </span>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="w-full aspect-square rounded-xl bg-black/80 flex items-center justify-center p-4 overflow-hidden border border-slate-800 relative group">
                                {activeDesignUrl ? (
                                  <div className="space-y-2 text-center">
                                    <img
                                      src={activeDesignUrl}
                                      alt="Original Artwork"
                                      className="max-h-48 object-contain filter drop-shadow-lg mx-auto"
                                    />
                                    <a
                                      href={activeDesignUrl}
                                      download={`artwork_${order.id}.png`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:underline font-mono"
                                    >
                                      <Download className="w-3.5 h-3.5" />
                                      <span>Download Original File</span>
                                    </a>
                                  </div>
                                ) : (
                                  <span className="text-xs text-slate-500 font-mono">Standard Catalog Master Graphic</span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Print Placements & Inches Specs */}
                        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5 text-xs font-mono">
                          <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block">
                            PHYSICAL PRINT DIMENSIONS & SPECS:
                          </span>
                          {item.designSpecs?.placements?.length ? (
                            item.designSpecs.placements.map((plc, idx) => (
                              <div key={idx} className="flex justify-between text-slate-300">
                                <span>• {plc.placementName || plc.surface?.toUpperCase()}:</span>
                                <span className="text-cyan-400 font-bold">
                                  {plc.widthInches || 10}" × {plc.heightInches || 8}" (Offset X: {plc.xInches || 0}", Y: {plc.yInches || 0}", Rot: {plc.rotation || 0}°)
                                </span>
                              </div>
                            ))
                          ) : (
                            <div className="flex justify-between text-slate-300">
                              <span>• FRONT CHEST PRINT:</span>
                              <span className="text-cyan-400 font-bold">Standard 10.0" × 8.0" (DTF 300 DPI)</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
                        <img
                          src={item.previewImage || item.mockupImage}
                          alt={item.productName}
                          className="w-16 h-16 object-cover rounded-xl border border-slate-700 shrink-0"
                        />
                        <div>
                          <span className="text-xs font-bold text-white block">Ready-to-Buy Standard Graphic</span>
                          <span className="text-[10px] text-slate-400 font-mono">SKU: {item.sku || 'RTB-CATALOG-MASTER'}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* =================================================================
             3. CUSTOMER, PAYMENT & SHIPPING DETAILS
             ================================================================= */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Customer Contact */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Customer Information:</span>
              <span className="font-bold text-white block text-sm">{order.customerName}</span>
              <span className="text-slate-400 block font-mono">📞 {order.customerPhone}</span>
              <span className="text-slate-400 block truncate">{order.customerEmail}</span>
            </div>

            {/* Shipping Address */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Shipping Address:</span>
              <span className="font-bold text-white block">{order.shippingAddress?.fullName}</span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                {order.shippingAddress?.addressLine1}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pinCode}
              </p>
            </div>

            {/* Price & Payment */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Price & Payment:</span>
              <div className="flex justify-between text-slate-400">
                <span>Subtotal:</span>
                <span className="font-mono text-white">₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Shipping:</span>
                <span className="font-mono text-white">₹{order.shippingCost || 0}</span>
              </div>
              <div className="flex justify-between text-slate-400 border-t border-slate-800 pt-1">
                <span className="font-bold text-white">Grand Total:</span>
                <span className="font-mono font-black text-emerald-400 text-sm">₹{order.total}</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono block truncate">
                Ref ID: {order.paymentId}
              </span>
            </div>
          </div>

          {/* =================================================================
             4. INTERNAL ADMIN NOTES & REFUND DRAWER
             ================================================================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Internal Notes (Hidden from Customers) */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Internal Admin Notes (Private)</span>
                </span>
                <span className="text-[10px] text-slate-500">Not visible to customer</span>
              </div>

              <form onSubmit={handleAddNote} className="flex gap-2">
                <input
                  type="text"
                  value={newNoteInput}
                  onChange={(e) => setNewNoteInput(e.target.value)}
                  placeholder="Add private note (e.g. Verified 240 GSM stock)..."
                  className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

              <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                {order.adminNotes && order.adminNotes.length > 0 ? (
                  order.adminNotes.map((note) => (
                    <div key={note.id} className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/80 text-xs space-y-1">
                      <p className="text-slate-200">{note.text}</p>
                      <span className="text-[10px] text-slate-500 block font-mono">
                        By {note.author} • {new Date(note.createdAt).toLocaleTimeString('en-IN')}
                      </span>
                    </div>
                  ))
                ) : (
                  <span className="text-slate-600 text-[11px] italic">No internal notes added yet.</span>
                )}
              </div>
            </div>

            {/* Payment Refund Action Box */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Payment Refund Engine
                </span>
                <span className={`text-[10px] font-bold uppercase font-mono ${order.paymentStatus === 'REFUNDED' ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {order.paymentStatus}
                </span>
              </div>

              {order.paymentStatus === 'REFUNDED' ? (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs space-y-1">
                  <span className="font-bold block">✓ Refund Completed</span>
                  <span className="text-[11px] block">Refund ID: {order.refundInfo?.refundId || 'rfnd_simulated'}</span>
                  <span className="text-[11px] block">Amount: ₹{order.refundInfo?.amount || order.total}</span>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-slate-400">
                    Initiate full or partial refund to original payment source via Razorpay API.
                  </p>
                  <button
                    onClick={() => setShowRefundDrawer(!showRefundDrawer)}
                    className="px-4 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-400 text-xs font-bold transition-all"
                  >
                    {showRefundDrawer ? 'Cancel Refund' : 'Initiate Refund...'}
                  </button>

                  {showRefundDrawer && (
                    <form onSubmit={handleProcessRefund} className="p-3 rounded-xl bg-slate-900 border border-rose-500/30 space-y-2 text-xs">
                      <div>
                        <label className="text-[10px] text-slate-400 block">Refund Amount (₹):</label>
                        <input
                          type="number"
                          max={order.total}
                          min="1"
                          value={refundAmount}
                          onChange={(e) => setRefundAmount(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block">Reason:</label>
                        <input
                          type="text"
                          value={refundReason}
                          onChange={(e) => setRefundReason(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold"
                      >
                        Confirm & Process Refund ₹{refundAmount}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* =================================================================
             5. TIMELINE AUDIT LOG
             ================================================================= */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Audit Trail & Timeline History
            </span>

            <div className="space-y-2">
              {order.timeline && order.timeline.map((event, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{event.title}</span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(event.timestamp).toLocaleTimeString('en-IN')}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px]">{event.description}</p>
                    <span className="text-[10px] text-slate-500 font-mono">Actor: {event.actor}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Printable Popups (Labels & Invoices) */}
        {printDocType === 'label' && (
          <div className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4 select-none">
            <div className="bg-white text-black p-6 rounded-2xl max-w-md w-full space-y-4 font-mono text-xs shadow-2xl">
              <div className="flex justify-between items-center border-b-2 border-black pb-2">
                <span className="font-black text-lg">THE PRINTHUB</span>
                <span className="text-[10px] font-bold">{labelData.courierName}</span>
              </div>
              <div className="text-center py-2 bg-slate-100 rounded-lg">
                <span className="font-black text-sm block">{labelData.awbNumber}</span>
                <span className="text-[9px] block">Routing: {labelData.routingCode}</span>
              </div>
              <div className="border border-black p-2 rounded">
                <span className="text-[9px] font-bold block">SHIP TO:</span>
                <span className="font-bold block">{labelData.recipient.fullName}</span>
                <p className="text-[10px]">{labelData.recipient.addressLine1}, {labelData.recipient.city} - {labelData.recipient.pinCode}</p>
                <span className="text-[9px]">Phone: {labelData.recipient.phone}</span>
              </div>
              <div className="flex justify-between border-t border-black pt-2 text-[10px]">
                <span>PAYMENT: {labelData.paymentType}</span>
                <span className="font-bold">{labelData.collectableAmount}</span>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => window.print()} className="flex-1 py-2 bg-black text-white rounded font-bold">
                  Print Thermal Label
                </button>
                <button onClick={() => setPrintDocType(null)} className="px-4 py-2 border border-black rounded">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {printDocType === 'invoice' && (
          <div className="fixed inset-0 z-60 bg-black/90 flex items-center justify-center p-4 select-none">
            <div className="bg-white text-black p-6 rounded-2xl max-w-lg w-full space-y-4 font-mono text-xs shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b-2 border-black pb-2">
                <div>
                  <span className="font-black text-base block">TAX INVOICE</span>
                  <span className="text-[10px]">THE PRINTHUB MERCHANDISE</span>
                </div>
                <span className="text-[10px] font-bold">{invoiceData.invoiceNumber}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] border-b border-black pb-2">
                <div>
                  <span className="font-bold block">SELLER:</span>
                  <span className="block">{invoiceData.seller.name}</span>
                  <span className="block">GSTIN: {invoiceData.seller.gstin}</span>
                </div>
                <div>
                  <span className="font-bold block">BUYER:</span>
                  <span className="block">{invoiceData.buyer.name}</span>
                  <span className="block">{invoiceData.buyer.phone}</span>
                </div>
              </div>

              <table className="w-full text-left text-[10px]">
                <thead>
                  <tr className="border-b border-black">
                    <th>Item</th>
                    <th>HSN</th>
                    <th>Qty</th>
                    <th className="text-right">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.items.map((it) => (
                    <tr key={it.sNo} className="border-b border-slate-200">
                      <td className="py-1">{it.description}</td>
                      <td>{it.hsnCode}</td>
                      <td>{it.qty}</td>
                      <td className="text-right">₹{it.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="space-y-1 text-[10px] text-right border-t-2 border-black pt-2">
                <div className="flex justify-between"><span>Taxable Value:</span><span>₹{invoiceData.taxableValue}</span></div>
                <div className="flex justify-between"><span>CGST (2.5%):</span><span>₹{invoiceData.cgst}</span></div>
                <div className="flex justify-between"><span>SGST (2.5%):</span><span>₹{invoiceData.sgst}</span></div>
                <div className="flex justify-between font-black text-xs border-t border-black pt-1">
                  <span>Grand Total:</span><span>₹{invoiceData.grandTotal}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button onClick={() => window.print()} className="flex-1 py-2 bg-black text-white rounded font-bold">
                  Print Invoice
                </button>
                <button onClick={() => setPrintDocType(null)} className="px-4 py-2 border border-black rounded">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
