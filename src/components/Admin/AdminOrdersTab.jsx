import React, { useState } from 'react';
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
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AdminRequestDetailModal } from './AdminRequestDetailModal';

/**
 * Admin Design Requests & Quotations Manager Tab
 * Displays the incoming pipeline of customer design concepts with statuses,
 * instant WhatsApp triggers, and detailed modal inspection.
 */
export function AdminOrdersTab() {
  const {
    designRequests = [],
    selectedDesignRequest,
    setSelectedDesignRequest,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [inspectingRequest, setInspectingRequest] = useState(null);

  // Status Counts
  const newCount = designRequests.filter((r) => r.status === 'NEW').length;
  const underReviewCount = designRequests.filter((r) => r.status === 'UNDER_REVIEW').length;
  const quotePendingCount = designRequests.filter((r) => r.status === 'QUOTE_PENDING').length;
  const inProductionCount = designRequests.filter((r) => r.status === 'IN_PRODUCTION' || r.status === 'CUSTOMER_CONFIRMED').length;
  const shippedCount = designRequests.filter((r) => r.status === 'SHIPPED' || r.status === 'READY_TO_SHIP').length;
  const deliveredCount = designRequests.filter((r) => r.status === 'DELIVERED').length;

  // Filtered Requests
  const filteredRequests = designRequests.filter((req) => {
    if (statusFilter !== 'all' && req.status !== statusFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = req.id.toLowerCase().includes(q);
      const matchName = req.customer?.name?.toLowerCase().includes(q);
      const matchMobile = req.customer?.mobile?.includes(q);
      const matchProduct = req.product?.name?.toLowerCase().includes(q);
      return matchId || matchName || matchMobile || matchProduct;
    }
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'NEW':
        return <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-mono font-bold uppercase animate-pulse">● NEW REQUEST</span>;
      case 'UNDER_REVIEW':
        return <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-mono font-bold uppercase">● UNDER REVIEW</span>;
      case 'QUOTE_PENDING':
        return <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[10px] font-mono font-bold uppercase">● QUOTE SENT</span>;
      case 'CUSTOMER_CONFIRMED':
        return <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold uppercase">● CONFIRMED</span>;
      case 'IN_PRODUCTION':
        return <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-[10px] font-mono font-bold uppercase">● IN PRODUCTION</span>;
      case 'READY_TO_SHIP':
        return <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 text-[10px] font-mono font-bold uppercase">● READY TO SHIP</span>;
      case 'SHIPPED':
        return <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-mono font-bold uppercase">● SHIPPED</span>;
      case 'DELIVERED':
        return <span className="px-2.5 py-0.5 rounded-full bg-slate-500/20 text-slate-300 border border-slate-500/30 text-[10px] font-mono font-bold uppercase">● DELIVERED</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-mono font-bold uppercase">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 select-none font-sans text-white">
      {/* Inspector Modal */}
      {inspectingRequest && (
        <AdminRequestDetailModal
          request={inspectingRequest}
          onClose={() => setInspectingRequest(null)}
        />
      )}

      {/* =========================================================================
         1. STATS METRICS ROW
         ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <button
          type="button"
          onClick={() => setStatusFilter('NEW')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            statusFilter === 'NEW'
              ? 'bg-rose-500/15 border-rose-500/50 ring-2 ring-rose-500/30'
              : 'bg-slate-950 border-slate-800 hover:border-slate-700'
          }`}
        >
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">NEW REQUESTS</span>
          <span className="text-2xl font-black font-mono text-rose-400">{newCount}</span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('UNDER_REVIEW')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            statusFilter === 'UNDER_REVIEW'
              ? 'bg-amber-500/15 border-amber-500/50 ring-2 ring-amber-500/30'
              : 'bg-slate-950 border-slate-800 hover:border-slate-700'
          }`}
        >
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">UNDER REVIEW</span>
          <span className="text-2xl font-black font-mono text-amber-400">{underReviewCount}</span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('QUOTE_PENDING')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            statusFilter === 'QUOTE_PENDING'
              ? 'bg-cyan-500/15 border-cyan-500/50 ring-2 ring-cyan-500/30'
              : 'bg-slate-950 border-slate-800 hover:border-slate-700'
          }`}
        >
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">QUOTATIONS SENT</span>
          <span className="text-2xl font-black font-mono text-cyan-400">{quotePendingCount}</span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('IN_PRODUCTION')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            statusFilter === 'IN_PRODUCTION'
              ? 'bg-indigo-500/15 border-indigo-500/50 ring-2 ring-indigo-500/30'
              : 'bg-slate-950 border-slate-800 hover:border-slate-700'
          }`}
        >
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">IN PRODUCTION</span>
          <span className="text-2xl font-black font-mono text-indigo-400">{inProductionCount}</span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('SHIPPED')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            statusFilter === 'SHIPPED'
              ? 'bg-blue-500/15 border-blue-500/50 ring-2 ring-blue-500/30'
              : 'bg-slate-950 border-slate-800 hover:border-slate-700'
          }`}
        >
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">DISPATCHED</span>
          <span className="text-2xl font-black font-mono text-blue-400">{shippedCount}</span>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('DELIVERED')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            statusFilter === 'DELIVERED'
              ? 'bg-emerald-500/15 border-emerald-500/50 ring-2 ring-emerald-500/30'
              : 'bg-slate-950 border-slate-800 hover:border-slate-700'
          }`}
        >
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">DELIVERED</span>
          <span className="text-2xl font-black font-mono text-emerald-400">{deliveredCount}</span>
        </button>
      </div>

      {/* =========================================================================
         2. SEARCH & FILTER CONTROLS
         ========================================================================= */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Request ID, Customer, Phone..."
            className="w-full pl-10 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-lime-400 font-mono"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-slate-200"
          >
            <option value="all">ALL STATUSES ({designRequests.length})</option>
            <option value="NEW">New Requests</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="QUOTE_PENDING">Quotation Sent</option>
            <option value="CUSTOMER_CONFIRMED">Confirmed</option>
            <option value="IN_PRODUCTION">In Production</option>
            <option value="READY_TO_SHIP">Ready to Ship</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* =========================================================================
         3. DESIGN REQUESTS TABLE
         ========================================================================= */}
      <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 text-[10px] uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Request ID</th>
                <th className="py-3.5 px-4">Customer Details</th>
                <th className="py-3.5 px-4">Product & Specs</th>
                <th className="py-3.5 px-4">Placements</th>
                <th className="py-3.5 px-4">Quotation Total</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {filteredRequests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-lime-400 block">{req.id}</span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white">{req.customer?.name}</div>
                    <div className="text-[10px] text-slate-400">{req.customer?.mobile}</div>
                    <div className="text-[10px] text-slate-500">{req.customer?.city || req.shipping?.city}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white">{req.product?.name}</div>
                    <div className="text-[10px] text-slate-400">{req.color?.name} • Size {req.size}</div>
                    <div className="text-[9px] text-cyan-400">{req.printMethod || 'DTF 300 DPI'}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5">
                      {req.placements?.map((p, i) => (
                        <div key={i} className="text-[10px] text-slate-300">
                          • {p.name} ({p.widthInches}" × {p.heightInches}")
                        </div>
                      ))}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    {req.quote?.totalQuote ? (
                      <span className="font-bold text-lime-400 text-sm">₹{req.quote.totalQuote}</span>
                    ) : (
                      <span className="text-[10px] text-amber-400">Quote Pending</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    {getStatusBadge(req.status)}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setInspectingRequest(req)}
                        className="px-3 py-1.5 rounded-lg bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold text-[10px] uppercase tracking-wider font-display transition-all shadow"
                      >
                        Inspect & Quote
                      </button>

                      <a
                        href={`https://wa.me/${(req.customer?.mobile || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `Hello ${req.customer?.name}, this is The PrintHub regarding your Design Request ${req.id}.`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 transition-colors"
                        title="Chat on WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-current" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminOrdersTab;
