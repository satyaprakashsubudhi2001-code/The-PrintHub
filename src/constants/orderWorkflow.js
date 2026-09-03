/**
 * The PrintHub — Order, Payment & Shipping Workflow Constants
 * Enterprise-grade state machine and configuration rules
 */

export const ORDER_STATUSES = {
  NEW: { id: 'NEW', label: 'New Order', color: 'cyan', badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30', step: 1 },
  DESIGN_REVIEW: { id: 'DESIGN_REVIEW', label: 'Design Review', color: 'purple', badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30', step: 2 },
  PAYMENT_PENDING: { id: 'PAYMENT_PENDING', label: 'Payment Pending', color: 'amber', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30', step: 1 },
  PAYMENT_FAILED: { id: 'PAYMENT_FAILED', label: 'Payment Failed', color: 'rose', badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30', step: 1 },
  CONFIRMED: { id: 'CONFIRMED', label: 'Order Confirmed', color: 'indigo', badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30', step: 3 },
  PROCESSING: { id: 'PROCESSING', label: 'In Production / Pre-Press', color: 'blue', badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30', step: 4 },
  PRINTING: { id: 'PRINTING', label: 'DTF Printing & Curing', color: 'purple', badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30', step: 5 },
  QUALITY_CHECK: { id: 'QUALITY_CHECK', label: 'Quality Check & QC Passed', color: 'amber', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30', step: 6 },
  READY_TO_SHIP: { id: 'READY_TO_SHIP', label: 'Ready to Ship', color: 'teal', badge: 'bg-teal-500/20 text-teal-300 border-teal-500/30', step: 7 },
  SHIPPED: { id: 'SHIPPED', label: 'Dispatched / In Transit', color: 'emerald', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', step: 8 },
  OUT_FOR_DELIVERY: { id: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', color: 'emerald', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', step: 9 },
  DELIVERED: { id: 'DELIVERED', label: 'Delivered', color: 'emerald', badge: 'bg-emerald-500/30 text-emerald-300 border-emerald-500/50', step: 10 },
  CANCELLED: { id: 'CANCELLED', label: 'Cancelled', color: 'rose', badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30', step: 0 },
  RETURN_REQUESTED: { id: 'RETURN_REQUESTED', label: 'Return Requested', color: 'amber', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30', step: 0 },
  RETURNED: { id: 'RETURNED', label: 'Returned', color: 'slate', badge: 'bg-slate-500/20 text-slate-300 border-slate-500/30', step: 0 },
  REFUND_PENDING: { id: 'REFUND_PENDING', label: 'Refund Pending', color: 'amber', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30', step: 0 },
  REFUNDED: { id: 'REFUNDED', label: 'Refunded', color: 'rose', badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30', step: 0 },
};

// Strict Order State Machine Transitions
export const ALLOWED_STATUS_TRANSITIONS = {
  NEW: ['DESIGN_REVIEW', 'CONFIRMED', 'PAYMENT_PENDING', 'CANCELLED'],
  DESIGN_REVIEW: ['CONFIRMED', 'PROCESSING', 'CANCELLED'],
  PAYMENT_PENDING: ['CONFIRMED', 'DESIGN_REVIEW', 'PAYMENT_FAILED', 'CANCELLED'],
  PAYMENT_FAILED: ['PAYMENT_PENDING', 'CANCELLED'],
  CONFIRMED: ['PROCESSING', 'PRINTING', 'CANCELLED', 'REFUND_PENDING'],
  PROCESSING: ['PRINTING', 'QUALITY_CHECK', 'CANCELLED', 'REFUND_PENDING'],
  PRINTING: ['QUALITY_CHECK', 'CANCELLED'],
  QUALITY_CHECK: ['READY_TO_SHIP', 'PRINTING'],
  READY_TO_SHIP: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['OUT_FOR_DELIVERY', 'DELIVERED', 'RETURN_REQUESTED'],
  OUT_FOR_DELIVERY: ['DELIVERED', 'SHIPPED', 'RETURN_REQUESTED'],
  DELIVERED: ['RETURN_REQUESTED', 'REFUND_PENDING'],
  CANCELLED: ['REFUND_PENDING', 'REFUNDED'],
  RETURN_REQUESTED: ['RETURNED', 'DELIVERED', 'REFUND_PENDING'],
  RETURNED: ['REFUND_PENDING', 'REFUNDED'],
  REFUND_PENDING: ['REFUNDED'],
  REFUNDED: [],
};

export const PAYMENT_STATUSES = {
  CREATED: { id: 'CREATED', label: 'Created', color: 'slate', icon: '⚪' },
  PENDING: { id: 'PENDING', label: 'Pending Payment', color: 'amber', icon: '🟡' },
  AUTHORIZED: { id: 'AUTHORIZED', label: 'Authorized', color: 'blue', icon: '🔵' },
  CAPTURED: { id: 'CAPTURED', label: 'Paid / Captured', color: 'emerald', icon: '🟢' },
  FAILED: { id: 'FAILED', label: 'Payment Failed', color: 'rose', icon: '🔴' },
  CANCELLED: { id: 'CANCELLED', label: 'Cancelled', color: 'slate', icon: '⚪' },
  REFUNDED: { id: 'REFUNDED', label: 'Refunded', color: 'purple', icon: '🟣' },
  PARTIALLY_REFUNDED: { id: 'PARTIALLY_REFUNDED', label: 'Partially Refunded', color: 'purple', icon: '🟣' },
  COD_PENDING: { id: 'COD_PENDING', label: 'COD - Cash on Delivery Pending', color: 'amber', icon: '🟡' },
  COD_COLLECTED: { id: 'COD_COLLECTED', label: 'COD - Cash Collected', color: 'emerald', icon: '🟢' },
};

export const SHIPPING_PROVIDERS = [
  {
    id: 'shiprocket',
    name: 'Shiprocket Multi-Carrier Hub',
    code: 'SR',
    rating: 4.8,
    status: 'connected',
    codSupported: true,
    avgDays: '3–5 Days',
    baseFee: 80,
    logo: '🚀',
  },
  {
    id: 'delhivery',
    name: 'Delhivery Surface & Express',
    code: 'DELHIVERY',
    rating: 4.7,
    status: 'connected',
    codSupported: true,
    avgDays: '2–4 Days',
    baseFee: 95,
    logo: '📦',
  },
  {
    id: 'bluedart',
    name: 'Blue Dart Aviation Express',
    code: 'BLUEDART',
    rating: 4.9,
    status: 'connected',
    codSupported: true,
    avgDays: '1–3 Days',
    baseFee: 130,
    logo: '✈️',
  },
  {
    id: 'dtdc',
    name: 'DTDC Priority Logistics',
    code: 'DTDC',
    rating: 4.6,
    status: 'connected',
    codSupported: true,
    avgDays: '3–6 Days',
    baseFee: 85,
    logo: '🚚',
  },
];

export const INITIAL_ORDERS = [];
