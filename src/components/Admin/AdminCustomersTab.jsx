import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  MessageCircle,
  Phone,
  Mail,
  ShoppingBag,
  DollarSign,
  Download,
  Edit2,
  CheckCircle2,
  Star,
  ShieldAlert,
  Calendar,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export function AdminCustomersTab() {
  const {
    customers = [],
    adminOrders = [],
    updateCustomerNotes,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('spend'); // 'spend' | 'orders' | 'recent' | 'name'
  const [editingNotesCustomer, setEditingNotesCustomer] = useState(null);
  const [notesInput, setNotesInput] = useState('');

  // Synthesize customers with live orders to guarantee exact up-to-date order count & spend
  const enrichedCustomers = useMemo(() => {
    return customers.map((cust) => {
      // Find orders matching this customer by phone or email
      const matchingOrders = adminOrders.filter(
        (o) =>
          (o.customer?.phone && cust.phone && o.customer.phone.replace(/\D/g, '') === cust.phone.replace(/\D/g, '')) ||
          (o.customer?.email && cust.email && o.customer.email.toLowerCase() === cust.email.toLowerCase())
      );

      const liveOrdersCount = Math.max(cust.totalOrders || 0, matchingOrders.length);
      const liveSpend = Math.max(
        cust.totalSpend || 0,
        matchingOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0)
      );

      let calculatedStatus = cust.status || 'Active';
      if (liveSpend >= 5000) calculatedStatus = 'VIP';
      if (liveOrdersCount >= 4) calculatedStatus = 'VIP';

      return {
        ...cust,
        totalOrders: liveOrdersCount,
        totalSpend: liveSpend,
        status: calculatedStatus,
        ordersList: matchingOrders,
      };
    });
  }, [customers, adminOrders]);

  // Filter and Sort
  const filteredCustomers = useMemo(() => {
    let result = enrichedCustomers.filter((c) => {
      if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = c.name?.toLowerCase().includes(q);
        const matchPhone = c.phone?.toLowerCase().includes(q);
        const matchEmail = c.email?.toLowerCase().includes(q);
        const matchCity = c.city?.toLowerCase().includes(q);
        const matchNotes = c.notes?.toLowerCase().includes(q);
        if (!matchName && !matchPhone && !matchEmail && !matchCity && !matchNotes) return false;
      }
      return true;
    });

    result.sort((a, b) => {
      if (sortBy === 'spend') return (b.totalSpend || 0) - (a.totalSpend || 0);
      if (sortBy === 'orders') return (b.totalOrders || 0) - (a.totalOrders || 0);
      if (sortBy === 'recent') {
        const dateA = new Date(a.lastOrderDate || '2000-01-01');
        const dateB = new Date(b.lastOrderDate || '2000-01-01');
        return dateB - dateA;
      }
      if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
      return 0;
    });

    return result;
  }, [enrichedCustomers, statusFilter, searchQuery, sortBy]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    const totalClients = enrichedCustomers.length;
    const vipClients = enrichedCustomers.filter((c) => c.status === 'VIP').length;
    const totalLifetimeSpend = enrichedCustomers.reduce((sum, c) => sum + (c.totalSpend || 0), 0);
    const avgSpendPerClient = totalClients > 0 ? totalLifetimeSpend / totalClients : 0;
    return {
      totalClients,
      vipClients,
      totalLifetimeSpend,
      avgSpendPerClient: Math.round(avgSpendPerClient),
    };
  }, [enrichedCustomers]);

  const handleOpenNotes = (customer) => {
    setEditingNotesCustomer(customer);
    setNotesInput(customer.notes || '');
  };

  const handleSaveNotes = (e) => {
    e.preventDefault();
    if (editingNotesCustomer) {
      updateCustomerNotes(editingNotesCustomer.id, notesInput);
      setEditingNotesCustomer(null);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['ID,Name,Phone,Email,City,Status,Total Orders,Total Spend (INR),Last Order Date,Notes'];
    const rows = filteredCustomers.map((c) =>
      `"${c.id}","${c.name}","${c.phone || ''}","${c.email || ''}","${c.city || ''}","${c.status}",${c.totalOrders},${c.totalSpend},"${c.lastOrderDate || ''}","${(c.notes || '').replace(/"/g, '""')}"`
    );
    const blob = new Blob([[...headers, ...rows].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `printhub_customers_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 font-mono text-xs text-[#183630]">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-[#E5C690] border border-[#B8A98F] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#183630] uppercase font-display tracking-tight">
              Client Directory & CRM Relations
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#183630] text-[#E5DAC9] text-[10px] font-bold">
              [ DIRECT CLIENT INTELLIGENCE ]
            </span>
          </div>
          <p className="text-[#183630]/75 text-xs font-sans mt-1">
            Central repository of retail, corporate, and walk-in studio clients. Track order history, lifetime valuation, preferred fits, and direct WhatsApp communication.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-xl bg-[#183630] text-[#E5C690] hover:bg-[#183630]/90 font-bold flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>[ EXPORT CRM CSV ]</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-[#E5DAC9] border border-[#B8A98F] shadow-sm space-y-1">
          <span className="text-[10px] text-[#183630]/75 uppercase font-bold">TOTAL CLIENTS</span>
          <div className="text-2xl sm:text-3xl font-black text-[#183630]">
            {metrics.totalClients}
          </div>
          <span className="text-[10px] text-[#183630]/60 block">Registered & POS profiles</span>
        </div>

        <div className="p-5 rounded-3xl bg-[#E5DAC9] border border-[#B8A98F] shadow-sm space-y-1">
          <span className="text-[10px] text-[#183630]/75 uppercase font-bold">VIP & WHOLESALE ACCOUNTS</span>
          <div className="text-2xl sm:text-3xl font-black text-[#183630]">
            {metrics.vipClients}
          </div>
          <span className="text-[10px] text-[#183630]/60 block">High value recurring patrons</span>
        </div>

        <div className="p-5 rounded-3xl bg-[#E5DAC9] border border-[#B8A98F] shadow-sm space-y-1">
          <span className="text-[10px] text-[#183630]/75 uppercase font-bold">LIFETIME CLIENT REVENUE</span>
          <div className="text-2xl sm:text-3xl font-black text-[#183630]">
            ₹{metrics.totalLifetimeSpend.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-[#183630]/60 block">Aggregated across all channels</span>
        </div>

        <div className="p-5 rounded-3xl bg-[#E5C690] border border-[#B8A98F] shadow-sm space-y-1">
          <span className="text-[10px] text-[#183630]/75 uppercase font-bold">AVG VALUE PER CLIENT</span>
          <div className="text-2xl sm:text-3xl font-black text-[#183630]">
            ₹{metrics.avgSpendPerClient.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-[#183630]/80 block">Customer Lifetime Value (LTV)</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-[#E5DAC9] border border-[#B8A98F]">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto no-scrollbar">
          {[
            { id: 'ALL', label: 'ALL CLIENTS' },
            { id: 'VIP', label: 'VIP' },
            { id: 'Active', label: 'ACTIVE' },
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

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="w-4 h-4 text-[#183630]/60 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search name, phone, email, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-[#183630] placeholder:text-[#183630]/60 text-xs focus:outline-none focus:border-[#183630]"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-[#183630] font-bold text-xs shrink-0"
          >
            <option value="spend">Sort: Highest Spend</option>
            <option value="orders">Sort: Most Orders</option>
            <option value="recent">Sort: Most Recent</option>
            <option value="name">Sort: Alphabetical</option>
          </select>
        </div>
      </div>

      {/* Customers Table */}
      <div className="rounded-3xl bg-[#E5DAC9] border border-[#B8A98F] overflow-hidden shadow-sm">
        {filteredCustomers.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Users className="w-8 h-8 text-[#183630]/40 mx-auto" />
            <h3 className="text-sm font-bold text-[#183630]">No client records found</h3>
            <p className="text-xs text-[#183630]/75">Clients who place storefront or manual orders will appear here automatically.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#183630] text-[#E5DAC9] text-[10px] uppercase font-bold border-b border-[#B8A98F]/30">
                <tr>
                  <th className="py-3.5 px-4">Client</th>
                  <th className="py-3.5 px-4">Contact Coordinates</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Tier Status</th>
                  <th className="py-3.5 px-4 text-center">Orders</th>
                  <th className="py-3.5 px-4 text-right">Lifetime Spend</th>
                  <th className="py-3.5 px-4">Internal Notes</th>
                  <th className="py-3.5 px-4 text-right">Direct Connect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#B8A98F]/30">
                {filteredCustomers.map((cust) => {
                  const cleanPhone = cust.phone?.replace(/\D/g, '') || '';
                  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                    `Hello ${cust.name}! Greetings from The PrintHub Atelier.`
                  )}`;

                  return (
                    <tr key={cust.id} className="hover:bg-[#183630]/5 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-[#183630] block text-xs">{cust.name}</span>
                        <span className="text-[10px] text-[#183630]/60 block">ID: {cust.id}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-[#183630] block font-bold">{cust.phone || '—'}</span>
                        <span className="text-[10px] text-[#183630]/70 block truncate max-w-[180px]">
                          {cust.email || '—'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-[#183630]/80">
                        {cust.city || 'India'}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                            cust.status === 'VIP'
                              ? 'bg-[#E5C690] text-[#183630] border-[#B8A98F]'
                              : 'bg-[#183630] text-[#E5DAC9] border-[#B8A98F]/40'
                          }`}
                        >
                          [ {cust.status} ]
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center font-bold text-[#183630]">
                        {cust.totalOrders}
                      </td>

                      <td className="py-3.5 px-4 text-right font-black text-sm text-[#183630]">
                        ₹{cust.totalSpend.toLocaleString('en-IN')}
                      </td>

                      <td className="py-3.5 px-4 max-w-[220px]">
                        <div className="flex items-center gap-1.5 group">
                          <span className="text-[11px] text-[#183630]/80 truncate block">
                            {cust.notes || <span className="text-[#183630]/40 italic">No notes</span>}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleOpenNotes(cust)}
                            className="p-1 rounded text-[#183630]/60 hover:text-[#183630] opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Edit Notes"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenNotes(cust)}
                            className="px-2.5 py-1 rounded-lg bg-[#E5DAC9] border border-[#B8A98F] text-[#183630] hover:border-[#183630] text-[10px] font-bold"
                          >
                            NOTES
                          </button>

                          {cleanPhone && (
                            <a
                              href={whatsappUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-[#E5C690] text-[#183630] hover:bg-[#d9b87c] transition-colors"
                              title="Message on WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {cust.email && (
                            <a
                              href={`mailto:${cust.email}`}
                              className="p-1.5 rounded-lg bg-[#183630] text-[#E5DAC9] hover:text-[#E5C690] transition-colors"
                              title="Send Email"
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </a>
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

      {/* Edit Notes Modal */}
      {editingNotesCustomer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#E5DAC9] rounded-3xl border border-[#B8A98F] shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#B8A98F]/40 pb-3">
              <h3 className="text-sm font-bold text-[#183630] uppercase font-display">
                [ CLIENT NOTES: {editingNotesCustomer.name} ]
              </h3>
              <button
                type="button"
                onClick={() => setEditingNotesCustomer(null)}
                className="text-[#183630] hover:opacity-75 font-black text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNotes} className="space-y-4">
              <div>
                <label className="block text-[#183630] font-bold mb-1 text-xs">
                  Production & Fitting Preferences, Corporate GSTIN, or VIP Instructions:
                </label>
                <textarea
                  rows="4"
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder="e.g. Prefers oversized unisex cuts, works at TechCorp, requests expedited courier..."
                  className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-[#183630] text-xs resize-none focus:border-[#183630] outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#B8A98F]/40">
                <button
                  type="button"
                  onClick={() => setEditingNotesCustomer(null)}
                  className="px-4 py-2 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-[#183630] font-bold"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#183630] text-[#E5C690] hover:bg-[#183630]/90 font-bold"
                >
                  [ SAVE CLIENT NOTES ]
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
