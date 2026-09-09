import React, { useState, useMemo } from 'react';
import {
  Package,
  Search,
  Filter,
  MessageCircle,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { AdminRequestDetailModal } from './AdminRequestDetailModal';
import { generateDesignRequestZip } from '../../services/packageExporter';

export function AdminDesignRequestsTab() {
  const { designRequests = [] } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Stats calculation
  const totalCount = designRequests.length;
  const newCount = designRequests.filter((r) => r.status === 'NEW').length;
  const reviewCount = designRequests.filter((r) => r.status === 'UNDER_REVIEW').length;
  const contactedCount = designRequests.filter((r) => r.status === 'CUSTOMER_CONTACTED').length;
  const completedCount = designRequests.filter((r) => r.status === 'COMPLETED').length;

  // Filtered Requests List
  const filteredRequests = useMemo(() => {
    return designRequests.filter((req) => {
      if (statusFilter !== 'ALL' && req.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchId = req.id?.toLowerCase().includes(q);
        const matchName = req.customer?.name?.toLowerCase().includes(q);
        const matchPhone = req.customer?.mobile?.toLowerCase().includes(q);
        const matchEmail = req.customer?.email?.toLowerCase().includes(q);
        const matchProduct = req.product?.name?.toLowerCase().includes(q);
        if (!matchId && !matchName && !matchPhone && !matchEmail && !matchProduct) return false;
      }
      return true;
    });
  }, [designRequests, statusFilter, searchQuery]);

  // 4-Color Bracket Status Tag Helper
  const getBracketStatusTag = (status) => {
    switch (status) {
      case 'COMPLETED':
        return {
          label: '[ Completed ]',
          bg: 'bg-[#183630]',
          text: 'text-[#E5C690]',
          border: 'border-[#B8A98F]',
        };
      case 'CUSTOMER_CONTACTED':
        return {
          label: '[ Pending ]',
          bg: 'bg-[#E5C690]',
          text: 'text-[#183630]',
          border: 'border-[#183630]',
        };
      case 'UNDER_REVIEW':
      case 'NEW':
      default:
        return {
          label: '[ Processing ]',
          bg: 'bg-[#183630]',
          text: 'text-[#E5DAC9]',
          border: 'border-[#B8A98F]/60',
        };
    }
  };

  return (
    <div className="space-y-6 font-mono text-xs text-[#183630]">
      {/* Detail Modal Inspector */}
      {selectedRequest && (
        <AdminRequestDetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}

      {/* Banner */}
      <div className="p-6 rounded-3xl bg-[#E5C690] border border-[#B8A98F] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#183630] uppercase font-display tracking-tight">
              Custom Design & Quotation Requests Queue
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#183630] text-[#E5DAC9] text-[10px] font-bold">
              [ 3D STUDIO PIPELINE ]
            </span>
          </div>
          <p className="text-[#183630]/75 text-xs font-sans mt-1">
            Customer inquiries submitted through the interactive 3D Customizer Studio. Inspect artwork files, print dimensions, send WhatsApp quotations, and download high-resolution production packages.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-[#183630] text-[#E5DAC9] border border-[#B8A98F] text-[11px] font-bold">
            {newCount} New Inquiries
          </span>
        </div>
      </div>

      {/* Quick Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-[#E5DAC9] border border-[#B8A98F] shadow-sm space-y-1">
          <span className="text-[10px] text-[#183630]/75 uppercase font-bold">TOTAL REQUESTS</span>
          <div className="text-2xl sm:text-3xl font-black text-[#183630]">{totalCount}</div>
        </div>

        <div className="p-5 rounded-3xl bg-[#E5DAC9] border border-[#B8A98F] shadow-sm space-y-1">
          <span className="text-[10px] text-[#183630]/75 uppercase font-bold">NEW SUBMISSIONS</span>
          <div className="text-2xl sm:text-3xl font-black text-[#183630]">{newCount}</div>
        </div>

        <div className="p-5 rounded-3xl bg-[#E5DAC9] border border-[#B8A98F] shadow-sm space-y-1">
          <span className="text-[10px] text-[#183630]/75 uppercase font-bold">UNDER REVIEW</span>
          <div className="text-2xl sm:text-3xl font-black text-[#183630]">{reviewCount + contactedCount}</div>
        </div>

        <div className="p-5 rounded-3xl bg-[#E5C690] border border-[#B8A98F] shadow-sm space-y-1">
          <span className="text-[10px] text-[#183630]/75 uppercase font-bold">COMPLETED / QUOTED</span>
          <div className="text-2xl sm:text-3xl font-black text-[#183630]">{completedCount}</div>
        </div>
      </div>

      {/* Search and Status Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-[#E5DAC9] border border-[#B8A98F]">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto no-scrollbar">
          {[
            { id: 'ALL', label: 'ALL' },
            { id: 'NEW', label: 'NEW' },
            { id: 'UNDER_REVIEW', label: 'PROCESSING' },
            { id: 'CUSTOMER_CONTACTED', label: 'PENDING' },
            { id: 'COMPLETED', label: 'COMPLETED' },
          ].map((st) => {
            const isSelected = statusFilter === st.id;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => setStatusFilter(st.id)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold tracking-wider shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? 'bracket-selected font-black text-[#183630]'
                    : 'bg-[#E5DAC9] border border-[#B8A98F] text-[#183630]/80 hover:border-[#183630]'
                }`}
              >
                {isSelected ? `[ ${st.label} ]` : st.label}
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-80 shrink-0">
          <Search className="w-4 h-4 text-[#183630]/60 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Request ID, customer, product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-[#183630] placeholder:text-[#183630]/60 text-xs focus:outline-none focus:border-[#183630]"
          />
        </div>
      </div>

      {/* Requests Table */}
      <div className="rounded-3xl bg-[#E5DAC9] border border-[#B8A98F] overflow-hidden shadow-sm">
        {filteredRequests.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Package className="w-8 h-8 text-[#183630]/50 mx-auto" />
            <h3 className="text-sm font-bold text-[#183630]">No design requests found</h3>
            <p className="text-xs text-[#183630]/75">Inquiries placed by customers in the 3D studio appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#183630] border-b border-[#B8A98F]/30 text-[#E5DAC9] text-[10px] uppercase font-bold">
                <tr>
                  <th className="py-3.5 px-4">Request ID</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Product & Specs</th>
                  <th className="py-3.5 px-4">Placements & Files</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#B8A98F]/30">
                {filteredRequests.map((req) => {
                  const tag = getBracketStatusTag(req.status);
                  const whatsappNumber = req.customer?.mobile?.replace(/\D/g, '') || '';
                  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                    `Hello ${req.customer?.name}! This is The PrintHub regarding your Custom Design Request (${req.id}).`
                  )}`;

                  return (
                    <tr key={req.id} className="hover:bg-[#183630]/5 transition-colors">
                      <td className="py-4 px-4 font-bold text-[#183630]">
                        {req.id}
                      </td>

                      <td className="py-4 px-4 text-[#183630]/70 text-[11px]">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-4 px-4">
                        <span className="font-bold text-[#183630] block">{req.customer?.name}</span>
                        <span className="text-[11px] text-[#183630]/80 block">{req.customer?.mobile}</span>
                        <span className="text-[10px] text-[#183630]/60 block truncate max-w-[150px]">{req.customer?.email}</span>
                      </td>

                      <td className="py-4 px-4">
                        <span className="font-bold text-[#183630] block">{req.product?.name}</span>
                        <span className="text-[11px] text-[#183630]/75 block font-sans">
                          {req.color?.name} • Size {req.size}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <span className="text-[#183630] block font-bold">
                          {req.placements?.length || 0} Print Location(s)
                        </span>
                        <span className="text-[10px] text-[#183630]/70 block">
                          {req.artworkFiles?.length || 0} Artwork File(s)
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${tag.bg} ${tag.text} border ${tag.border}`}>
                          {tag.label}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedRequest(req)}
                            className="px-3 py-1.5 rounded-lg bg-[#183630] hover:bg-[#183630]/90 text-[#E5C690] border border-[#B8A98F]/40 font-bold text-[11px] uppercase transition-colors cursor-pointer"
                          >
                            [ Inspect ]
                          </button>

                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-[#E5C690] text-[#183630] hover:bg-[#d9b87c] transition-colors"
                            title="Chat on WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>

                          <button
                            type="button"
                            onClick={() => generateDesignRequestZip(req)}
                            className="p-1.5 rounded-lg bg-[#183630] text-[#E5DAC9] hover:text-[#E5C690] transition-colors cursor-pointer"
                            title="Download Complete Request ZIP"
                          >
                            <Download className="w-4 h-4" />
                          </button>
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
