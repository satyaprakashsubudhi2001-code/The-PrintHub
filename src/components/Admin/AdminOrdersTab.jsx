import React, { useState, useMemo } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  ExternalLink,
  DollarSign,
  ChevronRight,
  Printer,
  FileText,
  MessageCircle,
  Phone,
  User,
  Package,
  Download,
  Trash2,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AdminOrderDetailModal } from './AdminOrderDetailModal';

export function AdminOrdersTab({ onNavigateToManualOrder }) {
  const {
    adminOrders = [],
    updateAdminOrder,
    deleteAdminOrder,
    adminRole,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [paymentFilter, setPaymentFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [inspectingOrder, setInspectingOrder] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Status counts
  const statusCounts = useMemo(() => {
    const counts = {
      ALL: adminOrders.length,
      CONFIRMED: 0,
      IN_PRODUCTION: 0,
      READY_TO_SHIP: 0,
      SHIPPED: 0,
      DELIVERED: 0,
      CANCELLED: 0,
    };
    adminOrders.forEach((o) => {
      if (counts[o.orderStatus] !== undefined) counts[o.orderStatus]++;
    });
    return counts;
  }, [adminOrders]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return adminOrders.filter((ord) => {
      if (statusFilter !== 'ALL' && ord.orderStatus !== statusFilter) return false;
      if (paymentFilter !== 'ALL' && ord.paymentStatus !== paymentFilter) return false;
      if (typeFilter === 'ONLINE' && ord.orderType === 'MANUAL') return false;
      if (typeFilter === 'MANUAL' && ord.orderType !== 'MANUAL') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = ord.id?.toLowerCase().includes(q);
        const matchName = ord.customer?.name?.toLowerCase().includes(q);
        const matchPhone = ord.customer?.phone?.includes(q);
        const matchItems = ord.items?.some((i) => i.name?.toLowerCase().includes(q) || i.sku?.toLowerCase().includes(q));
        if (!matchId && !matchName && !matchPhone && !matchItems) return false;
      }
      return true;
    });
  }, [adminOrders, statusFilter, paymentFilter, typeFilter, searchQuery]);

  // Financial aggregates of filtered orders
  const financialTotals = useMemo(() => {
    const totalSales = filteredOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    const totalCost = filteredOrders.reduce((sum, o) => sum + (Number(o.totalCost) || (Number(o.total) || 0) * 0.45), 0);
    const totalProfit = totalSales - totalCost;
    const margin = totalSales > 0 ? (totalProfit / totalSales) * 100 : 0;
    return {
      totalSales: Math.round(totalSales),
      totalCost: Math.round(totalCost),
      totalProfit: Math.round(totalProfit),
      margin: Math.round(margin * 10) / 10,
    };
  }, [filteredOrders]);

  const handleStatusQuickChange = (orderId, newStatus) => {
    updateAdminOrder(orderId, { orderStatus: newStatus });
  };

  const handleDelete = (orderId) => {
    deleteAdminOrder(orderId);
    setDeleteConfirmId(null);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'Order ID,Date,Type,Customer Name,Phone,Email,Status,Payment Status,Payment Method,Subtotal,Discount,Shipping,Tax,Total (INR),Direct Cost (INR),Profit (INR),Margin (%)',
    ];
    const rows = filteredOrders.map((o) => {
      const cost = Number(o.totalCost) || (Number(o.total) || 0) * 0.45;
      const profit = (Number(o.total) || 0) - cost;
      const margin = (Number(o.total) || 0) > 0 ? ((profit / (Number(o.total) || 1)) * 100).toFixed(1) : '0.0';
      return `"${o.id}","${o.date || o.createdAt || ''}","${o.orderType || 'ONLINE'}","${o.customer?.name || ''}","${o.customer?.phone || ''}","${o.customer?.email || ''}","${o.orderStatus}","${o.paymentStatus || 'PAID'}","${o.paymentMethod || 'UPI'}",${o.subtotal || o.total || 0},${o.discount || 0},${o.shipping || 0},${o.tax || 0},${o.total || 0},${Math.round(cost)},${Math.round(profit)},${margin}%`;
    });
    const blob = new Blob([[...headers, ...rows].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ThePrintHub_Orders_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getOrderStatusTag = (status) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-[#183630] text-[#E5C690] border-[#B8A98F]';
      case 'SHIPPED':
      case 'READY_TO_SHIP':
        return 'bg-[#E5C690] text-[#183630] border-[#183630]';
      case 'IN_PRODUCTION':
        return 'bg-[#183630] text-[#E5DAC9] border-[#B8A98F]/60';
      case 'CONFIRMED':
      case 'NEW':
      default:
        return 'bg-[#E5DAC9] text-[#183630] border-[#B8A98F] font-bold';
    }
  };

  return (
    <div className="space-y-6 font-mono text-xs text-[#183630]">
      {/* Detail Modal Inspector */}
      {inspectingOrder && (
        <AdminOrderDetailModal
          order={inspectingOrder}
          onClose={() => setInspectingOrder(null)}
        />
      )}

      {/* Banner */}
      <div className="p-6 rounded-3xl bg-[#E5C690] border border-[#B8A98F] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#183630] uppercase font-display tracking-tight">
              Order Fulfillment & Revenue Dispatch Pipeline
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#183630] text-[#E5DAC9] text-[10px] font-bold">
              [ ONLINE + POS DISPATCH ]
            </span>
          </div>
          <p className="text-[#183630]/75 text-xs font-sans mt-1">
            Complete lifecycle monitoring across customer storefront checkouts, phone orders, and direct studio inquiries with integrated cost, profit, and margin analytics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3 py-2 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] hover:border-[#183630] text-[#183630] font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>[ EXPORT ORDERS CSV ]</span>
          </button>

          {onNavigateToManualOrder && (
            <button
              type="button"
              onClick={onNavigateToManualOrder}
              className="px-4 py-2 rounded-xl bg-[#183630] text-[#E5C690] hover:bg-[#183630]/90 font-bold flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Package className="w-4 h-4" />
              <span>[ + NEW MANUAL ORDER ]</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-[#E5DAC9] border border-[#B8A98F] shadow-sm space-y-1">
          <span className="text-[10px] text-[#183630]/75 uppercase font-bold">ORDERS COUNT</span>
          <div className="text-2xl sm:text-3xl font-black text-[#183630]">{filteredOrders.length}</div>
          <span className="text-[10px] text-[#183630]/60 block">{adminOrders.length} total across all time</span>
        </div>

        <div className="p-5 rounded-3xl bg-[#E5DAC9] border border-[#B8A98F] shadow-sm space-y-1">
          <span className="text-[10px] text-[#183630]/75 uppercase font-bold">FILTERED INVOICED SALES</span>
          <div className="text-2xl sm:text-3xl font-black text-[#183630]">
            ₹{financialTotals.totalSales.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-[#183630]/60 block">Direct customer invoices</span>
        </div>

        <div className="p-5 rounded-3xl bg-[#E5DAC9] border border-[#B8A98F] shadow-sm space-y-1">
          <span className="text-[10px] text-[#183630]/75 uppercase font-bold">ESTIMATED DIRECT COGS</span>
          <div className="text-2xl sm:text-3xl font-black text-[#183630]">
            ₹{financialTotals.totalCost.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-[#183630]/60 block">Blanks & consumable costs</span>
        </div>

        <div className="p-5 rounded-3xl bg-[#E5C690] border border-[#B8A98F] shadow-sm space-y-1">
          <span className="text-[10px] text-[#183630]/75 uppercase font-bold">NET OPERATIONAL PROFIT</span>
          <div className="text-2xl sm:text-3xl font-black text-[#183630]">
            ₹{financialTotals.totalProfit.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-[#183630]/80 block font-bold">
            Average Profit Margin: {financialTotals.margin}%
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-[#E5DAC9] border border-[#B8A98F]">
        {/* Status Filters with [ Bracket ] treatment */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto no-scrollbar">
          {[
            { id: 'ALL', label: 'ALL' },
            { id: 'CONFIRMED', label: 'CONFIRMED' },
            { id: 'IN_PRODUCTION', label: 'PRINTING' },
            { id: 'READY_TO_SHIP', label: 'PACKED' },
            { id: 'SHIPPED', label: 'SHIPPED' },
            { id: 'DELIVERED', label: 'DELIVERED' },
          ].map((st) => {
            const isSelected = statusFilter === st.id;
            const count = statusCounts[st.id];
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => setStatusFilter(st.id)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold tracking-wider shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bracket-selected font-black text-[#183630]'
                    : 'bg-[#E5DAC9] border border-[#B8A98F] text-[#183630]/80 hover:border-[#183630]'
                }`}
              >
                <span>{isSelected ? `[ ${st.label} ]` : st.label}</span>
                {count !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono ${
                      isSelected ? 'bg-[#183630] text-[#E5DAC9]' : 'bg-[#183630]/15 text-[#183630]'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Source & Search */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-2.5 py-2 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-[#183630] font-bold text-xs"
          >
            <option value="ALL">All Channels</option>
            <option value="ONLINE">Customer Web Store</option>
            <option value="MANUAL">Direct POS / WhatsApp</option>
          </select>

          <div className="relative w-full sm:w-60 shrink-0">
            <Search className="w-4 h-4 text-[#183630]/60 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Order ID, client, SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-[#183630] placeholder:text-[#183630]/60 text-xs focus:outline-none focus:border-[#183630]"
            />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-3xl bg-[#E5DAC9] border border-[#B8A98F] overflow-hidden shadow-sm">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <ShoppingBag className="w-8 h-8 text-[#183630]/40 mx-auto" />
            <h3 className="text-sm font-bold text-[#183630]">No orders found</h3>
            <p className="text-xs text-[#183630]/75">Orders placed by customers or entered manually will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#183630] text-[#E5DAC9] text-[10px] uppercase font-bold border-b border-[#B8A98F]/30">
                <tr>
                  <th className="py-3.5 px-4">Order ID & Date</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Channel</th>
                  <th className="py-3.5 px-4">Items / Specs</th>
                  <th className="py-3.5 px-4 text-right">Invoiced (₹)</th>
                  <th className="py-3.5 px-4 text-right">Profit (₹)</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Fulfillment Stage</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#B8A98F]/30">
                {filteredOrders.map((ord) => {
                  const cost = Number(ord.totalCost) || (Number(ord.total) || 0) * 0.45;
                  const profit = (Number(ord.total) || 0) - cost;
                  const margin = (Number(ord.total) || 0) > 0 ? ((profit / (Number(ord.total) || 1)) * 100).toFixed(0) : '0';
                  const cleanPhone = ord.customer?.phone?.replace(/\D/g, '') || '';
                  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                    `Hello ${ord.customer?.name}! This is The PrintHub regarding your Order #${ord.id}. Status: ${ord.orderStatus}.`
                  )}`;

                  return (
                    <tr key={ord.id} className="hover:bg-[#183630]/5 transition-colors">
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-bold text-[#183630] block">#{ord.id}</span>
                        <span className="text-[10px] text-[#183630]/70 block">
                          {ord.date || ord.createdAt ? new Date(ord.date || ord.createdAt).toLocaleDateString() : 'Today'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-[#183630] block">{ord.customer?.name || 'Guest'}</span>
                        <span className="text-[10px] text-[#183630]/70 block">{ord.customer?.phone || '—'}</span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full bg-[#E5C690] text-[#183630] text-[10px] font-bold border border-[#B8A98F]">
                          {ord.orderType === 'MANUAL' ? ord.source || 'POS / WhatsApp' : 'Web Store'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 max-w-[200px]">
                        {ord.items && ord.items.length > 0 ? (
                          <div className="space-y-0.5">
                            <span className="font-bold text-[#183630] block truncate">
                              {ord.items[0]?.name}
                            </span>
                            <span className="text-[10px] text-[#183630]/70 block">
                              {ord.items[0]?.size ? `Size: ${ord.items[0].size}` : ''}{' '}
                              {ord.items.length > 1 ? `+ ${ord.items.length - 1} more items` : `(Qty: ${ord.items[0]?.quantity || 1})`}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-[#183630]/60 italic">Custom Order Details</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right font-black text-sm text-[#183630] whitespace-nowrap">
                        ₹{(Number(ord.total) || 0).toLocaleString('en-IN')}
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <span className="font-black text-xs text-emerald-900 block">
                          +₹{Math.round(profit).toLocaleString('en-IN')}
                        </span>
                        <span className="text-[9px] text-[#183630]/70 block font-mono">
                          Margin: {margin}%
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            ord.paymentStatus === 'PAID'
                              ? 'bg-emerald-900/15 text-emerald-900 border-emerald-900/30'
                              : 'bg-amber-900/15 text-amber-900 border-amber-900/30'
                          }`}
                        >
                          {ord.paymentStatus || 'PAID'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <select
                          value={ord.orderStatus || 'CONFIRMED'}
                          onChange={(e) => handleStatusQuickChange(ord.id, e.target.value)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border cursor-pointer ${getOrderStatusTag(
                            ord.orderStatus
                          )}`}
                        >
                          <option value="CONFIRMED">● CONFIRMED</option>
                          <option value="IN_PRODUCTION">● IN PRODUCTION</option>
                          <option value="READY_TO_SHIP">● READY TO SHIP</option>
                          <option value="SHIPPED">● SHIPPED</option>
                          <option value="DELIVERED">● DELIVERED</option>
                          <option value="CANCELLED">● CANCELLED</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setInspectingOrder(ord)}
                            className="px-2.5 py-1 rounded-lg bg-[#183630] text-[#E5C690] hover:bg-[#183630]/90 font-bold text-[10px] cursor-pointer"
                          >
                            [ Inspect ]
                          </button>

                          {cleanPhone && (
                            <a
                              href={whatsappUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-[#E5C690] text-[#183630] hover:bg-[#d9b87c] transition-colors"
                              title="Chat on WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {deleteConfirmId === ord.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleDelete(ord.id)}
                                className="px-1.5 py-1 rounded bg-rose-900 text-white font-bold text-[9px]"
                              >
                                CONFIRM
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-1.5 py-1 rounded bg-[#E5DAC9] border border-[#B8A98F] text-[9px]"
                              >
                                CANCEL
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(ord.id)}
                              className="p-1.5 rounded-lg text-rose-800 hover:bg-rose-900/10 transition-colors"
                              title="Delete Order"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
