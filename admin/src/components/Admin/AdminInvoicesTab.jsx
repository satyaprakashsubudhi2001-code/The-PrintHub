import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  FileText,
  Search,
  Plus,
  Printer,
  Download,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  AlertTriangle,
  Receipt,
  Eye,
  X,
  PlusCircle,
  Building,
  User,
  Calendar,
  CreditCard,
  ShieldAlert,
  ArrowUpDown,
  History,
  Check,
  Ban,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

// Helper to convert number to Indian words
function numberToWords(num) {
  if (!num || isNaN(num)) return 'Zero Rupees Only';
  const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const n = ('000000000' + Math.round(num)).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return '';
  let str = '';
  str += (Number(n[1]) !== 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
  str += (Number(n[2]) !== 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
  str += (Number(n[3]) !== 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
  str += (Number(n[4]) !== 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
  str += (Number(n[5]) !== 0) ? ((str !== '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'Rupees Only' : 'Rupees Only';
  return str.trim();
}

export function AdminInvoicesTab() {
  const {
    invoices = [],
    fetchInvoices,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    orders = [],
    adminOrders = [],
    storeSettings = {},
  } = useStore();

  const allOrders = useMemo(() => {
    return adminOrders.length > 0 ? adminOrders : orders;
  }, [adminOrders, orders]);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL | DRAFT | ISSUED | VOID
  const [paymentFilter, setPaymentFilter] = useState('ALL'); // ALL | PAID | PENDING | OVERDUE

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [activeInvoice, setActiveInvoice] = useState(null);
  const [deleteConfirmInvoice, setDeleteConfirmInvoice] = useState(null);

  // Form State
  const [formMode, setFormMode] = useState('manual'); // 'order' | 'manual'
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [formData, setFormData] = useState({
    id: '',
    invoiceNumber: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    status: 'DRAFT',
    paymentStatus: 'PENDING',
    paymentMethod: 'UPI / NetBanking',
    paymentReference: '',
    orderId: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    billingStreet: '',
    billingCity: '',
    billingState: 'Maharashtra',
    billingPincode: '',
    billingCountry: 'India',
    items: [
      {
        description: 'Custom Apparel Print Order',
        hsnCode: '61091000',
        quantity: 1,
        unitPrice: 499,
      },
    ],
    discount: 0,
    shippingFee: 0,
    applyGst: true,
    notes: 'Thank you for choosing The PrintHub Atelier.',
    terms: 'All custom apparel is verified by QA. In case of manufacturing defects, notify within 48 hours.',
  });

  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Printable ref
  const printContentRef = useRef(null);

  // Auto-fill from Order
  const handleSelectOrder = (orderId) => {
    setSelectedOrderId(orderId);
    if (!orderId) return;

    const matched = allOrders.find((o) => o.id === orderId || o.orderNumber === orderId);
    if (!matched) return;

    const customerName = matched.customerName || matched.customer?.name || '';
    const customerEmail = matched.customerEmail || matched.customer?.email || '';
    const customerPhone = matched.customerPhone || matched.customer?.phone || '';
    const billing = matched.billingAddress || matched.shippingAddress || {};

    const items = (matched.items || []).map((it) => ({
      description: it.product?.name || it.name || `Custom Apparel (${it.size || 'M'}, ${it.color || 'Standard'})`,
      hsnCode: '61091000',
      quantity: it.quantity || 1,
      unitPrice: it.price || it.unitPrice || 499,
    }));

    setFormData((prev) => ({
      ...prev,
      orderId: matched.id,
      customerName,
      customerEmail,
      customerPhone,
      billingStreet: billing.street || billing.address || '',
      billingCity: billing.city || 'Mumbai',
      billingState: billing.state || 'Maharashtra',
      billingPincode: billing.pincode || billing.postalCode || '',
      billingCountry: billing.country || 'India',
      items: items.length > 0 ? items : prev.items,
      paymentStatus: matched.paymentStatus === 'PAID' ? 'PAID' : 'PENDING',
      discount: matched.discount || 0,
      shippingFee: matched.shippingFee || 0,
    }));
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setFormData({
      id: '',
      invoiceNumber: '',
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      status: 'DRAFT',
      paymentStatus: 'PENDING',
      paymentMethod: 'UPI / NetBanking',
      paymentReference: '',
      orderId: '',
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      billingStreet: '',
      billingCity: 'Mumbai',
      billingState: 'Maharashtra',
      billingPincode: '',
      billingCountry: 'India',
      items: [
        {
          description: 'Custom Printed Apparel',
          hsnCode: '61091000',
          quantity: 1,
          unitPrice: 599,
        },
      ],
      discount: 0,
      shippingFee: 0,
      applyGst: true,
      notes: 'Thank you for choosing The PrintHub Atelier.',
      terms: 'All custom apparel is verified by QA. In case of manufacturing defects, notify within 48 hours.',
    });
    setSelectedOrderId('');
    setFormMode('manual');
    setFormError('');
    setIsCreateModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (inv) => {
    const rawItems = Array.isArray(inv.items)
      ? inv.items
      : inv.itemsJson
      ? JSON.parse(inv.itemsJson)
      : [];

    const billing = typeof inv.billingAddress === 'object' && inv.billingAddress !== null
      ? inv.billingAddress
      : {};

    setFormData({
      id: inv.id,
      invoiceNumber: inv.invoiceNumber,
      invoiceDate: inv.invoiceDate ? new Date(inv.invoiceDate).toISOString().split('T')[0] : '',
      dueDate: inv.dueDate ? new Date(inv.dueDate).toISOString().split('T')[0] : '',
      status: inv.status || 'DRAFT',
      paymentStatus: inv.paymentStatus || 'PENDING',
      paymentMethod: inv.paymentMethod || 'UPI / NetBanking',
      paymentReference: inv.paymentReference || '',
      orderId: inv.orderId || '',
      customerName: inv.customerName || '',
      customerEmail: inv.customerEmail || '',
      customerPhone: inv.customerPhone || '',
      billingStreet: billing.street || billing.address || '',
      billingCity: billing.city || 'Mumbai',
      billingState: billing.state || 'Maharashtra',
      billingPincode: billing.pincode || '',
      billingCountry: billing.country || 'India',
      items: rawItems.length > 0 ? rawItems : [{ description: 'Custom Item', hsnCode: '61091000', quantity: 1, unitPrice: inv.grandTotal }],
      discount: inv.discount || 0,
      shippingFee: inv.shippingFee || 0,
      applyGst: inv.totalTax > 0,
      notes: inv.notes || '',
      terms: inv.terms || '',
      history: inv.history || (inv.historyJson ? JSON.parse(inv.historyJson) : []),
    });
    setFormError('');
    setIsEditModalOpen(true);
  };

  // Open Preview Modal
  const handleOpenPreview = (inv) => {
    setActiveInvoice(inv);
    setIsPreviewModalOpen(true);
  };

  // Add line item
  const handleAddLineItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          description: '',
          hsnCode: '61091000',
          quantity: 1,
          unitPrice: 0,
        },
      ],
    }));
  };

  // Remove line item
  const handleRemoveLineItem = (index) => {
    if (formData.items.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, idx) => idx !== index),
    }));
  };

  // Update line item
  const handleUpdateLineItem = (index, field, value) => {
    setFormData((prev) => {
      const nextItems = [...prev.items];
      nextItems[index] = {
        ...nextItems[index],
        [field]: field === 'quantity' || field === 'unitPrice' ? Number(value) : value,
      };
      return { ...prev, items: nextItems };
    });
  };

  // Computed Form Totals
  const formCalculations = useMemo(() => {
    const subtotal = formData.items.reduce(
      (acc, it) => acc + (Number(it.quantity) || 1) * (Number(it.unitPrice) || 0),
      0
    );
    const discount = Math.max(0, Number(formData.discount) || 0);
    const shipping = Math.max(0, Number(formData.shippingFee) || 0);
    const taxable = Math.max(0, subtotal - discount);
    const taxRate = formData.applyGst ? 0.05 : 0;
    const totalTax = Number((taxable * taxRate).toFixed(2));
    const cgst = Number((totalTax / 2).toFixed(2));
    const sgst = Number((totalTax - cgst).toFixed(2));
    const grandTotal = Number((taxable + totalTax + shipping).toFixed(2));

    return {
      subtotal,
      taxable,
      totalTax,
      cgst,
      sgst,
      grandTotal,
    };
  }, [formData.items, formData.discount, formData.shippingFee, formData.applyGst]);

  // Handle Form Submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.customerName.trim()) {
      setFormError('Customer Name is required.');
      return;
    }

    if (formData.items.length === 0 || !formData.items[0].description.trim()) {
      setFormError('At least one item with a valid description is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        invoiceDate: formData.invoiceDate,
        dueDate: formData.dueDate,
        status: formData.status,
        paymentStatus: formData.paymentStatus,
        paymentMethod: formData.paymentMethod,
        paymentReference: formData.paymentReference,
        orderId: formData.orderId || null,
        customerName: formData.customerName.trim(),
        customerEmail: formData.customerEmail.trim(),
        customerPhone: formData.customerPhone.trim(),
        billingAddress: {
          street: formData.billingStreet,
          city: formData.billingCity,
          state: formData.billingState,
          pincode: formData.billingPincode,
          country: formData.billingCountry,
        },
        items: formData.items,
        discount: Number(formData.discount) || 0,
        shippingFee: Number(formData.shippingFee) || 0,
        applyGst: formData.applyGst,
        notes: formData.notes,
        terms: formData.terms,
      };

      if (isEditModalOpen && formData.id) {
        await updateInvoice(formData.id, payload);
        setIsEditModalOpen(false);
      } else {
        await createInvoice(payload);
        setIsCreateModalOpen(false);
      }
      await fetchInvoices();
    } catch (err) {
      setFormError(err.message || 'Failed to save invoice record.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Trigger Print
  const handlePrint = () => {
    window.print();
  };

  // Filtered Invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      if (statusFilter !== 'ALL' && inv.status !== statusFilter) return false;
      if (paymentFilter !== 'ALL' && inv.paymentStatus !== paymentFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const num = (inv.invoiceNumber || '').toLowerCase();
        const name = (inv.customerName || '').toLowerCase();
        const email = (inv.customerEmail || '').toLowerCase();
        const phone = (inv.customerPhone || '').toLowerCase();
        const orderId = (inv.orderId || '').toLowerCase();
        return num.includes(q) || name.includes(q) || email.includes(q) || phone.includes(q) || orderId.includes(q);
      }
      return true;
    });
  }, [invoices, statusFilter, paymentFilter, searchQuery]);

  // KPI Metrics
  const metrics = useMemo(() => {
    const totalIssued = invoices.filter((i) => i.status === 'ISSUED').length;
    const totalBilled = invoices
      .filter((i) => i.status === 'ISSUED')
      .reduce((acc, i) => acc + (Number(i.grandTotal) || 0), 0);
    const paidAmount = invoices
      .filter((i) => i.status === 'ISSUED' && i.paymentStatus === 'PAID')
      .reduce((acc, i) => acc + (Number(i.grandTotal) || 0), 0);
    const pendingAmount = invoices
      .filter((i) => i.status === 'ISSUED' && i.paymentStatus !== 'PAID')
      .reduce((acc, i) => acc + (Number(i.grandTotal) || 0), 0);

    return { totalIssued, totalBilled, paidAmount, pendingAmount };
  }, [invoices]);

  return (
    <div className="space-y-6 animate-in fade-in select-none">
      {/* =========================================================================
         1. TOP TOOLBAR & KPI HEADER
         ========================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-[#0c101d] border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-lime-400/10 border border-lime-400/20 flex items-center justify-center text-lime-400 shrink-0">
            <Receipt className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-lime-400 uppercase tracking-widest">
                FINANCIAL OPERATIONS
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-mono text-slate-300">
                GST Ready
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-display uppercase tracking-tight">
              Invoices & Billing Hub
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchInvoices}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
            title="Refresh Invoices"
          >
            <History className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-lime-400 text-slate-950 hover:bg-lime-300 font-mono font-black text-xs uppercase tracking-wider shadow-lg shadow-lime-400/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>CREATE INVOICE</span>
          </button>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#0c101d] border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
            Invoices Issued
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-black text-white font-mono">
              {metrics.totalIssued}
            </span>
            <FileText className="w-4 h-4 text-slate-500" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0c101d] border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
            Total Billed
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-black text-white font-mono">
              ₹{metrics.totalBilled.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
            <Receipt className="w-4 h-4 text-cyan-400" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0c101d] border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">
            Settled / Paid
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-black text-emerald-400 font-mono">
              ₹{metrics.paidAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0c101d] border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">
            Pending Balance
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-black text-amber-400 font-mono">
              ₹{metrics.pendingAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
        </div>
      </div>

      {/* =========================================================================
         2. SEARCH & FILTER CONTROLS
         ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-2xl bg-[#0c101d] border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by invoice #, customer name, email, or order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {/* Invoice Status Filter */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
            {['ALL', 'ISSUED', 'DRAFT', 'VOID'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                  statusFilter === st
                    ? 'bg-lime-400 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Payment Status Filter */}
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-[11px] font-mono focus:border-cyan-400 focus:outline-none shrink-0"
          >
            <option value="ALL">Payment: ALL</option>
            <option value="PAID">Paid</option>
            <option value="PENDING">Pending</option>
            <option value="OVERDUE">Overdue</option>
          </select>
        </div>
      </div>

      {/* =========================================================================
         3. INVOICE TABLE LIST
         ========================================================================= */}
      <div className="rounded-2xl bg-[#0c101d] border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-[10px] text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4 text-right">Grand Total</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-500 font-mono">
                    <Receipt className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
                    <span>No invoices found matching current criteria.</span>
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => {
                  const isIssued = inv.status === 'ISSUED';
                  const isVoid = inv.status === 'VOID';
                  const isPaid = inv.paymentStatus === 'PAID';

                  return (
                    <tr
                      key={inv.id}
                      className="hover:bg-slate-900/40 transition-colors group"
                    >
                      {/* Invoice Number */}
                      <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{inv.invoiceNumber}</span>
                        </div>
                        {inv.orderId && (
                          <span className="text-[9px] text-slate-500 block font-normal">
                            Ref: {inv.order?.orderNumber || inv.orderId}
                          </span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                        {inv.invoiceDate ? new Date(inv.invoiceDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                      </td>

                      {/* Customer */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white line-clamp-1">{inv.customerName}</div>
                        <div className="text-[10px] text-slate-500 line-clamp-1">
                          {inv.customerPhone || inv.customerEmail || 'Walk-in client'}
                        </div>
                      </td>

                      {/* Invoice Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${
                            isIssued
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : isVoid
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>

                      {/* Payment Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase ${
                            isPaid
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : inv.paymentStatus === 'OVERDUE'
                              ? 'bg-rose-500/10 text-rose-400'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {isPaid ? <CheckCircle className="w-2.5 h-2.5" /> : <Clock className="w-2.5 h-2.5" />}
                          <span>{inv.paymentStatus || 'PENDING'}</span>
                        </span>
                      </td>

                      {/* Grand Total */}
                      <td className="py-3.5 px-4 text-right font-black text-white whitespace-nowrap">
                        ₹{(Number(inv.grandTotal) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Print / View PDF */}
                          <button
                            type="button"
                            onClick={() => handleOpenPreview(inv)}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-400 hover:text-cyan-300 border border-slate-800 transition-colors cursor-pointer"
                            title="Preview & Print PDF"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit Invoice */}
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(inv)}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer"
                            title="Edit Invoice"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Void or Delete */}
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmInvoice(inv)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors cursor-pointer"
                            title={isIssued ? 'Void Invoice' : 'Delete Draft'}
                          >
                            {isIssued ? <Ban className="w-3.5 h-3.5" /> : <Trash2 className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================================
         4. CREATE / EDIT INVOICE MODAL
         ========================================================================= */}
      {(isCreateModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            className="fixed inset-0 bg-[#071226]/60 backdrop-blur-xs transition-opacity"
            onClick={() => {
              setIsCreateModalOpen(false);
              setIsEditModalOpen(false);
            }}
          />
          <div className="relative w-full max-w-4xl rounded-2xl bg-[#0B1020] border border-slate-800 p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto shadow-2xl z-10 font-mono text-xs text-slate-300">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold text-lime-400 uppercase tracking-wider block">
                  {isEditModalOpen ? 'EDIT INVOICE RECORD' : 'CREATE NEW INVOICE'}
                </span>
                <h3 className="text-xl font-black text-white font-display uppercase mt-0.5">
                  {isEditModalOpen ? formData.invoiceNumber : 'Generate Billing Document'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setIsEditModalOpen(false);
                }}
                className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Issued Warning Alert if Editing an Issued Invoice */}
            {isEditModalOpen && formData.status === 'ISSUED' && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
                <div>
                  <span className="font-bold block">AUDIT COMPLIANCE NOTICE:</span>
                  <span>
                    You are editing an ISSUED invoice. Any material changes to line items, prices, or taxes will be logged permanently in the invoice audit revision history with before and after snapshots.
                  </span>
                </div>
              </div>
            )}

            {formError && (
              <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-6">
              {/* Optional: Load from existing order */}
              {!isEditModalOpen && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-cyan-400 uppercase">
                      Create from Existing Order (Optional)
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Auto-populates customer and items
                    </span>
                  </div>
                  <select
                    value={selectedOrderId}
                    onChange={(e) => handleSelectOrder(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-cyan-400 focus:outline-none text-xs"
                  >
                    <option value="">-- Choose Existing Order --</option>
                    {allOrders.map((ord) => (
                      <option key={ord.id} value={ord.id}>
                        {ord.orderNumber || ord.id} • {ord.customerName} • ₹{ord.totalAmount || 0}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Invoice Meta Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-slate-400 uppercase font-bold block mb-1">
                    Invoice Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.invoiceDate}
                    onChange={(e) => setFormData({ ...formData, invoiceDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-400 uppercase font-bold block mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-400 uppercase font-bold block mb-1">
                    Invoice Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="DRAFT">DRAFT (Editable)</option>
                    <option value="ISSUED">ISSUED (Official)</option>
                    <option value="VOID">VOID (Cancelled)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 uppercase font-bold block mb-1">
                    Payment Status
                  </label>
                  <select
                    value={formData.paymentStatus}
                    onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="PAID">PAID</option>
                    <option value="OVERDUE">OVERDUE</option>
                  </select>
                </div>
              </div>

              {/* Customer Details */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <span className="text-[11px] font-bold text-slate-300 uppercase block">
                  Customer & Billing Information
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-slate-400 uppercase font-bold block mb-1">
                      Customer Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Patel"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 uppercase font-bold block mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. +91 98765 43210"
                      value={formData.customerPhone}
                      onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 uppercase font-bold block mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. customer@example.com"
                      value={formData.customerEmail}
                      onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-slate-400 uppercase font-bold block mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Flat 402, Sunshine Heights, Andheri West"
                      value={formData.billingStreet}
                      onChange={(e) => setFormData({ ...formData, billingStreet: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 uppercase font-bold block mb-1">
                      City, State & Pincode
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="City"
                        value={formData.billingCity}
                        onChange={(e) => setFormData({ ...formData, billingCity: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-400 focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Pincode"
                        value={formData.billingPincode}
                        onChange={(e) => setFormData({ ...formData, billingPincode: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Line Items */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-300 uppercase">
                    Itemised Products & Services
                  </span>
                  <button
                    type="button"
                    onClick={handleAddLineItem}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-400 text-[10px] font-bold border border-slate-800 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>ADD LINE ITEM</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.items.map((it, idx) => {
                    const lineAmount = (Number(it.quantity) || 0) * (Number(it.unitPrice) || 0);

                    return (
                      <div
                        key={idx}
                        className="grid grid-cols-12 gap-2 items-center p-3 rounded-xl bg-slate-950 border border-slate-800"
                      >
                        <div className="col-span-5 sm:col-span-6">
                          <input
                            type="text"
                            required
                            placeholder="Description (e.g. Oversized 240 GSM Tee - Black XL)"
                            value={it.description}
                            onChange={(e) => handleUpdateLineItem(idx, 'description', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white focus:border-cyan-400 focus:outline-none text-xs"
                          />
                        </div>

                        <div className="col-span-2">
                          <input
                            type="text"
                            placeholder="HSN"
                            value={it.hsnCode || '61091000'}
                            onChange={(e) => handleUpdateLineItem(idx, 'hsnCode', e.target.value)}
                            className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white focus:border-cyan-400 focus:outline-none text-xs text-center"
                          />
                        </div>

                        <div className="col-span-2 sm:col-span-1">
                          <input
                            type="number"
                            min="1"
                            placeholder="Qty"
                            value={it.quantity}
                            onChange={(e) => handleUpdateLineItem(idx, 'quantity', e.target.value)}
                            className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white focus:border-cyan-400 focus:outline-none text-xs text-center font-bold"
                          />
                        </div>

                        <div className="col-span-2">
                          <input
                            type="number"
                            min="0"
                            placeholder="Rate (₹)"
                            value={it.unitPrice}
                            onChange={(e) => handleUpdateLineItem(idx, 'unitPrice', e.target.value)}
                            className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white focus:border-cyan-400 focus:outline-none text-xs text-right font-bold"
                          />
                        </div>

                        <div className="col-span-1 flex items-center justify-end">
                          <button
                            type="button"
                            onClick={() => handleRemoveLineItem(idx)}
                            disabled={formData.items.length <= 1}
                            className="p-1.5 rounded text-slate-500 hover:text-rose-400 disabled:opacity-20 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Financial Breakdown & Tax */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-slate-800">
                <div className="space-y-3">
                  <div>
                    <label className="text-slate-400 uppercase font-bold block mb-1">
                      Payment Method
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Razorpay UPI / GPay / NetBanking"
                      value={formData.paymentMethod}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 uppercase font-bold block mb-1">
                      Payment / Transaction Reference
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. pay_Nabc12345678"
                      value={formData.paymentReference}
                      onChange={(e) => setFormData({ ...formData, paymentReference: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 uppercase font-bold block mb-1">
                      Internal Notes
                    </label>
                    <textarea
                      rows="2"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-cyan-400 focus:outline-none resize-none"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                  <div className="flex justify-between items-center text-slate-400">
                    <span>Subtotal</span>
                    <span className="font-mono text-white font-bold">
                      ₹{formCalculations.subtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-slate-400">
                    <span>Discount (₹)</span>
                    <input
                      type="number"
                      min="0"
                      value={formData.discount}
                      onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                      className="w-24 px-2 py-1 rounded bg-slate-900 border border-slate-800 text-right text-white font-mono font-bold focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div className="flex justify-between items-center text-slate-400">
                    <span>Shipping Charges (₹)</span>
                    <input
                      type="number"
                      min="0"
                      value={formData.shippingFee}
                      onChange={(e) => setFormData({ ...formData, shippingFee: e.target.value })}
                      className="w-24 px-2 py-1 rounded bg-slate-900 border border-slate-800 text-right text-white font-mono font-bold focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-slate-800/80">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.applyGst}
                        onChange={(e) => setFormData({ ...formData, applyGst: e.target.checked })}
                        className="rounded accent-lime-400"
                      />
                      <span className="text-[11px] font-bold text-slate-300">
                        Apply GST (5% Clothing HSN)
                      </span>
                    </label>
                    <span className="text-[10px] text-slate-500 font-mono">
                      CGST 2.5% + SGST 2.5%
                    </span>
                  </div>

                  {formData.applyGst && (
                    <div className="space-y-1 text-[11px] text-slate-400 pl-4 border-l border-slate-800">
                      <div className="flex justify-between">
                        <span>CGST (2.5%)</span>
                        <span className="font-mono text-slate-300">₹{formCalculations.cgst.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>SGST (2.5%)</span>
                        <span className="font-mono text-slate-300">₹{formCalculations.sgst.toFixed(2)}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-3 border-t border-slate-800 text-sm">
                    <span className="font-bold text-white uppercase">Grand Total</span>
                    <span className="font-black text-lime-400 text-lg font-mono">
                      ₹{formCalculations.grandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white font-bold cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-lime-400 text-slate-950 hover:bg-lime-300 font-black shadow-lg shadow-lime-400/20 cursor-pointer disabled:opacity-50"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>{isSubmitting ? 'SAVING...' : isEditModalOpen ? 'UPDATE INVOICE' : 'SAVE & ISSUE INVOICE'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
         5. PRINTABLE A4 GST INVOICE PREVIEW MODAL
         ========================================================================= */}
      {isPreviewModalOpen && activeInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div
            className="fixed inset-0 bg-[#071226]/70 backdrop-blur-xs transition-opacity"
            onClick={() => setIsPreviewModalOpen(false)}
          />

          <div className="relative w-full max-w-4xl rounded-2xl bg-[#0B1020] border border-slate-800 p-4 sm:p-6 space-y-4 max-h-[96vh] overflow-y-auto shadow-2xl z-10">
            {/* Top Bar with Print Button */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-white font-mono">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-lime-400" />
                <span className="font-bold text-sm">
                  {activeInvoice.invoiceNumber} • Preview Document
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-lime-400 text-slate-950 hover:bg-lime-300 font-black text-xs uppercase shadow cursor-pointer"
                >
                  <Printer className="w-4 h-4 stroke-[2.5]" />
                  <span>PRINT / DOWNLOAD PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsPreviewModalOpen(false)}
                  className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* A4 PRINTABLE DOCUMENT CONTAINER */}
            <div
              ref={printContentRef}
              id="printable-tax-invoice"
              className="bg-white text-slate-900 p-8 sm:p-12 rounded-xl shadow-lg font-sans text-xs max-w-3xl mx-auto border border-slate-200"
              style={{ minHeight: '297mm' }}
            >
              {/* Invoice Header */}
              <div className="flex justify-between items-start pb-6 border-b-2 border-slate-900">
                <div>
                  <div className="flex items-center gap-3">
                    <img
                      src="/brand-dark.png"
                      alt="The PrintHub"
                      className="h-10 object-contain"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <div>
                      <h1 className="text-xl font-black text-[#183630] tracking-tight uppercase">
                        The PrintHub
                      </h1>
                      <span className="text-[10px] font-bold text-amber-700 tracking-widest block uppercase">
                        Custom Merchandise & Apparel Atelier
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 text-[11px] text-slate-600 leading-tight space-y-0.5">
                    <p className="font-semibold text-slate-800">The PrintHub Custom Merchandise Pvt Ltd</p>
                    <p>{activeInvoice.storeSnapshot?.address || storeSettings.address || 'Atelier Plot 42, Print District, Lower Parel, Mumbai, MH 400013'}</p>
                    <p>Phone: {activeInvoice.storeSnapshot?.phone || storeSettings.phone || '+91 79928 01158'}</p>
                    <p>Email: {activeInvoice.storeSnapshot?.email || storeSettings.email || 'theprinthub.in@gmail.com'}</p>
                    <p className="font-bold text-slate-900 pt-1">
                      GSTIN: {activeInvoice.storeSnapshot?.gstin || '27AAACT0000A1Z5'} • State: 27 - Maharashtra
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="inline-block px-3 py-1 rounded bg-[#183630] text-[#E5DAC9] font-black tracking-widest text-xs uppercase mb-2">
                    TAX INVOICE
                  </div>
                  <h2 className="text-base font-black text-slate-900 font-mono">
                    {activeInvoice.invoiceNumber}
                  </h2>
                  <div className="mt-2 text-[11px] text-slate-600 space-y-0.5">
                    <p>
                      <span className="font-semibold">Invoice Date:</span>{' '}
                      {activeInvoice.invoiceDate ? new Date(activeInvoice.invoiceDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                    </p>
                    <p>
                      <span className="font-semibold">Payment Status:</span>{' '}
                      <span className="font-bold uppercase text-slate-900">
                        {activeInvoice.paymentStatus || 'PENDING'}
                      </span>
                    </p>
                    {activeInvoice.orderId && (
                      <p>
                        <span className="font-semibold">Order Ref:</span>{' '}
                        {activeInvoice.order?.orderNumber || activeInvoice.orderId}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Bill To & Ship To Details */}
              <div className="grid grid-cols-2 gap-8 py-6 border-b border-slate-200">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Billed To:
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">
                    {activeInvoice.customerName}
                  </h3>
                  <div className="text-[11px] text-slate-600 mt-1 leading-snug space-y-0.5">
                    {activeInvoice.billingAddress?.street && <p>{activeInvoice.billingAddress.street}</p>}
                    <p>
                      {[
                        activeInvoice.billingAddress?.city,
                        activeInvoice.billingAddress?.state,
                        activeInvoice.billingAddress?.pincode,
                      ].filter(Boolean).join(', ')}
                    </p>
                    {activeInvoice.customerPhone && <p>Phone: {activeInvoice.customerPhone}</p>}
                    {activeInvoice.customerEmail && <p>Email: {activeInvoice.customerEmail}</p>}
                  </div>
                </div>

                <div className="text-right sm:text-left">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Payment Details:
                  </span>
                  <div className="text-[11px] text-slate-600 mt-1 leading-snug space-y-0.5">
                    <p><span className="font-semibold">Method:</span> {activeInvoice.paymentMethod || 'Razorpay / UPI'}</p>
                    {activeInvoice.paymentReference && (
                      <p><span className="font-semibold">Txn Ref:</span> {activeInvoice.paymentReference}</p>
                    )}
                    <p><span className="font-semibold">Place of Supply:</span> Maharashtra (27)</p>
                  </div>
                </div>
              </div>

              {/* Itemized Table */}
              <div className="py-6">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b-2 border-slate-900 text-[10px] uppercase font-bold text-slate-900">
                      <th className="py-2.5 px-2 w-10 text-center">#</th>
                      <th className="py-2.5 px-2">Description of Goods / Services</th>
                      <th className="py-2.5 px-2 text-center w-24">HSN Code</th>
                      <th className="py-2.5 px-2 text-center w-16">Qty</th>
                      <th className="py-2.5 px-2 text-right w-24">Rate (₹)</th>
                      <th className="py-2.5 px-2 text-right w-28">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-[11px]">
                    {(activeInvoice.items || []).map((it, idx) => {
                      const qty = Number(it.quantity) || 1;
                      const rate = Number(it.unitPrice) || 0;
                      const amt = qty * rate;

                      return (
                        <tr key={idx}>
                          <td className="py-2.5 px-2 text-center text-slate-500">{idx + 1}</td>
                          <td className="py-2.5 px-2 font-medium text-slate-900">
                            {it.description}
                          </td>
                          <td className="py-2.5 px-2 text-center text-slate-600 font-mono">
                            {it.hsnCode || '61091000'}
                          </td>
                          <td className="py-2.5 px-2 text-center font-bold text-slate-900 font-mono">
                            {qty}
                          </td>
                          <td className="py-2.5 px-2 text-right text-slate-700 font-mono">
                            {rate.toFixed(2)}
                          </td>
                          <td className="py-2.5 px-2 text-right font-bold text-slate-900 font-mono">
                            {amt.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Financial Calculation & Breakdown */}
              <div className="grid grid-cols-2 gap-8 pt-4 border-t border-slate-200">
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                      Amount Chargeable in Words:
                    </span>
                    <p className="text-[11px] font-bold text-slate-900 italic">
                      {numberToWords(activeInvoice.grandTotal)}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[10px] text-slate-600 space-y-1">
                    <span className="font-bold text-slate-800 uppercase block">Terms & Conditions:</span>
                    <p>{activeInvoice.terms || 'All items are custom manufactured to client specifications. Inspect upon receipt.'}</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Taxable Subtotal:</span>
                    <span className="font-mono text-slate-900 font-bold">
                      ₹{(Number(activeInvoice.subtotal) || 0).toFixed(2)}
                    </span>
                  </div>

                  {Number(activeInvoice.discount) > 0 && (
                    <div className="flex justify-between text-slate-600">
                      <span>Discount:</span>
                      <span className="font-mono text-slate-900 font-bold">
                        -₹{(Number(activeInvoice.discount) || 0).toFixed(2)}
                      </span>
                    </div>
                  )}

                  {Number(activeInvoice.totalTax) > 0 && (
                    <>
                      <div className="flex justify-between text-slate-600 text-[11px]">
                        <span>CGST (2.5%):</span>
                        <span className="font-mono text-slate-800">
                          ₹{(Number(activeInvoice.cgst) || 0).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-600 text-[11px]">
                        <span>SGST (2.5%):</span>
                        <span className="font-mono text-slate-800">
                          ₹{(Number(activeInvoice.sgst) || 0).toFixed(2)}
                        </span>
                      </div>
                    </>
                  )}

                  {Number(activeInvoice.shippingFee) > 0 && (
                    <div className="flex justify-between text-slate-600">
                      <span>Shipping / Delivery:</span>
                      <span className="font-mono text-slate-900 font-bold">
                        ₹{(Number(activeInvoice.shippingFee) || 0).toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between pt-3 border-t-2 border-slate-900 text-sm font-black text-slate-900">
                    <span className="uppercase">Grand Total (INR):</span>
                    <span className="font-mono text-base">
                      ₹{(Number(activeInvoice.grandTotal) || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Signatory Footer */}
              <div className="mt-12 pt-8 border-t border-slate-200 flex justify-between items-end text-[11px] text-slate-600">
                <div>
                  <p className="font-bold text-slate-900">Electronic Verification</p>
                  <p>Computer generated invoice, requires no physical stamp.</p>
                </div>
                <div className="text-right">
                  <div className="w-40 border-b border-slate-400 mb-2 ml-auto" />
                  <span className="font-bold text-slate-900 block">
                    For The PrintHub Atelier
                  </span>
                  <span className="text-[10px] text-slate-500">Authorized Signatory</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete / Void Confirmation Modal */}
      {deleteConfirmInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#071226]/60 backdrop-blur-xs"
            onClick={() => setDeleteConfirmInvoice(null)}
          />
          <div className="relative w-full max-w-md rounded-2xl bg-[#0B1020] border border-slate-800 p-6 space-y-4 shadow-2xl z-10 font-mono text-xs">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-black text-white font-display uppercase">
                {deleteConfirmInvoice.status === 'ISSUED' ? 'Void Issued Invoice?' : 'Delete Draft Invoice?'}
              </h3>
            </div>
            <p className="text-slate-400">
              {deleteConfirmInvoice.status === 'ISSUED'
                ? `Invoice ${deleteConfirmInvoice.invoiceNumber} has been officially issued. For regulatory compliance, it will be marked VOID rather than deleted permanently.`
                : `Are you sure you want to permanently delete draft invoice ${deleteConfirmInvoice.invoiceNumber}?`}
            </p>
            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmInvoice(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-slate-300 font-bold border border-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  await deleteInvoice(deleteConfirmInvoice.id);
                  setDeleteConfirmInvoice(null);
                  await fetchInvoices();
                }}
                className="px-4 py-2 rounded-xl bg-rose-500 text-white font-bold hover:bg-rose-600"
              >
                {deleteConfirmInvoice.status === 'ISSUED' ? 'Mark VOID' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminInvoicesTab;
