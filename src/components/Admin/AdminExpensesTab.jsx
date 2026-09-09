import React, { useState, useMemo } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  DollarSign,
  Search,
  Filter,
  Download,
  Calendar,
  CreditCard,
  Building,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  Tag,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

const EXPENSE_CATEGORIES = [
  'Raw Materials',
  'Inks & Consumables',
  'Blanks & Textiles',
  'Packaging & Boxes',
  'Shipping & Couriers',
  'Utilities & Electricity',
  'Rent & Studio Facility',
  'Marketing & Ads',
  'Equipment & Maintenance',
  'Staff & Labor',
  'Miscellaneous',
];

export function AdminExpensesTab() {
  const {
    expenses = [],
    addExpense,
    updateExpense,
    deleteExpense,
    adminRole,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form State
  const [form, setForm] = useState({
    title: '',
    category: 'Inks & Consumables',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'UPI',
    vendor: '',
    invoiceNumber: '',
    notes: '',
  });

  // Filtered Expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter((item) => {
      if (categoryFilter !== 'ALL' && item.category !== categoryFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title?.toLowerCase().includes(q);
        const matchVendor = item.vendor?.toLowerCase().includes(q);
        const matchInv = item.invoiceNumber?.toLowerCase().includes(q);
        const matchNotes = item.notes?.toLowerCase().includes(q);
        if (!matchTitle && !matchVendor && !matchInv && !matchNotes) return false;
      }
      return true;
    });
  }, [expenses, categoryFilter, searchQuery]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    const total = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
    const thisMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const monthly = expenses
      .filter((e) => e.date?.startsWith(thisMonth))
      .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

    const byCat = {};
    expenses.forEach((e) => {
      byCat[e.category] = (byCat[e.category] || 0) + (Number(e.amount) || 0);
    });

    return { total, monthly, byCat };
  }, [expenses]);

  const handleOpenAdd = () => {
    setForm({
      title: '',
      category: 'Inks & Consumables',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'UPI',
      vendor: '',
      invoiceNumber: '',
      notes: '',
    });
    setEditingExpense(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (exp) => {
    setEditingExpense(exp);
    setForm({
      title: exp.title || '',
      category: exp.category || 'Raw Materials',
      amount: exp.amount || '',
      date: exp.date || new Date().toISOString().split('T')[0],
      paymentMethod: exp.paymentMethod || 'UPI',
      vendor: exp.vendor || '',
      invoiceNumber: exp.invoiceNumber || '',
      notes: exp.notes || '',
    });
    setShowAddModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    const amountNum = parseFloat(form.amount) || 0;

    if (editingExpense) {
      updateExpense(editingExpense.id, {
        ...form,
        amount: amountNum,
      });
    } else {
      addExpense({
        ...form,
        amount: amountNum,
      });
    }
    setShowAddModal(false);
  };

  const handleDelete = (id) => {
    deleteExpense(id);
    setDeleteConfirmId(null);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['ID,Date,Title,Category,Amount (INR),Vendor,Payment Method,Invoice Ref,Notes'];
    const rows = filteredExpenses.map((e) =>
      `"${e.id}","${e.date}","${e.title}","${e.category}",${e.amount},"${e.vendor || ''}","${e.paymentMethod || ''}","${e.invoiceNumber || ''}","${e.notes || ''}"`
    );
    const blob = new Blob([[...headers, ...rows].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `printhub_expenses_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 font-mono text-xs text-[#183630]">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-[#E5C690] border border-[#B8A98F] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#183630] uppercase font-display tracking-tight">
              Operational Expense & Overhead Ledger
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#183630] text-[#E5DAC9] text-[10px] font-bold">
              [ REAL-TIME COGS & OVERHEAD ]
            </span>
          </div>
          <p className="text-[#183630]/75 text-xs font-sans mt-1">
            Track daily raw materials, inks, blank apparel consignments, studio rent, utilities, and marketing expenses. Directly integrates with Net Profit & Loss accounting.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3 py-2 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] hover:border-[#183630] text-[#183630] font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>[ EXPORT CSV ]</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-[#183630] text-[#E5C690] hover:bg-[#183630]/90 font-bold flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>[ + LOG NEW EXPENSE ]</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-[#E5DAC9] border border-[#B8A98F] shadow-sm space-y-1">
          <span className="text-[10px] text-[#183630]/75 uppercase font-bold">LIFETIME LOGGED EXPENSES</span>
          <div className="text-2xl sm:text-3xl font-black text-[#183630]">
            ₹{metrics.total.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-[#183630]/60 block">{expenses.length} distinct journal entries</span>
        </div>

        <div className="p-5 rounded-3xl bg-[#E5DAC9] border border-[#B8A98F] shadow-sm space-y-1">
          <span className="text-[10px] text-[#183630]/75 uppercase font-bold">THIS CURRENT MONTH</span>
          <div className="text-2xl sm:text-3xl font-black text-[#183630]">
            ₹{metrics.monthly.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-[#183630]/60 block">Incurred in {new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })}</span>
        </div>

        <div className="p-5 rounded-3xl bg-[#E5C690] border border-[#B8A98F] shadow-sm space-y-1">
          <span className="text-[10px] text-[#183630]/75 uppercase font-bold">PRIMARY OVERHEAD DRIVER</span>
          <div className="text-base sm:text-lg font-black text-[#183630] truncate">
            {Object.entries(metrics.byCat).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'}
          </div>
          <span className="text-[10px] text-[#183630]/80 block">
            ₹{(Object.entries(metrics.byCat).sort((a, b) => b[1] - a[1])[0]?.[1] || 0).toLocaleString('en-IN')} allocated
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-[#E5DAC9] border border-[#B8A98F]">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto no-scrollbar">
          {['ALL', ...EXPENSE_CATEGORIES].slice(0, 7).map((cat) => {
            const isSelected = categoryFilter === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold tracking-wider shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? 'bracket-selected font-black text-[#183630]'
                    : 'bg-[#E5DAC9] border border-[#B8A98F] text-[#183630]/80 hover:border-[#183630]'
                }`}
              >
                {isSelected ? `[ ${cat.toUpperCase()} ]` : cat.toUpperCase()}
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-72 shrink-0">
          <Search className="w-4 h-4 text-[#183630]/60 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search title, vendor, invoice..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-[#183630] placeholder:text-[#183630]/60 text-xs focus:outline-none focus:border-[#183630]"
          />
        </div>
      </div>

      {/* Expenses Ledger Table */}
      <div className="rounded-3xl bg-[#E5DAC9] border border-[#B8A98F] overflow-hidden shadow-sm">
        {filteredExpenses.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Receipt className="w-8 h-8 text-[#183630]/40 mx-auto" />
            <h3 className="text-sm font-bold text-[#183630]">No expense records found</h3>
            <p className="text-xs text-[#183630]/75">Log expenses to track production costs accurately against sales.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#183630] text-[#E5DAC9] text-[10px] uppercase font-bold border-b border-[#B8A98F]/30">
                <tr>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Title & Item</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Vendor / Supplier</th>
                  <th className="py-3.5 px-4">Payment Method</th>
                  <th className="py-3.5 px-4">Invoice Ref</th>
                  <th className="py-3.5 px-4 text-right">Amount (₹)</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#B8A98F]/30">
                {filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-[#183630]/5 transition-colors">
                    <td className="py-3.5 px-4 text-[#183630]/80 whitespace-nowrap">
                      {exp.date}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-[#183630] block">{exp.title}</span>
                      {exp.notes && (
                        <span className="text-[10px] text-[#183630]/60 block truncate max-w-[200px]">
                          {exp.notes}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full bg-[#E5C690] text-[#183630] text-[10px] font-bold border border-[#B8A98F]">
                        {exp.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-[#183630]/90">
                      {exp.vendor || '—'}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-[#183630]/80">
                      {exp.paymentMethod || 'UPI'}
                    </td>

                    <td className="py-3.5 px-4 text-[#183630]/70">
                      {exp.invoiceNumber || '—'}
                    </td>

                    <td className="py-3.5 px-4 text-right font-black text-sm text-[#183630]">
                      ₹{(Number(exp.amount) || 0).toLocaleString('en-IN')}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(exp)}
                          className="p-1.5 rounded-lg bg-[#E5DAC9] border border-[#B8A98F] text-[#183630] hover:border-[#183630] transition-colors"
                          title="Edit Expense"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {deleteConfirmId === exp.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleDelete(exp.id)}
                              className="px-2 py-1 rounded bg-red-800 text-white font-bold text-[10px]"
                            >
                              CONFIRM
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-2 py-1 rounded bg-[#E5DAC9] border border-[#B8A98F] text-[10px]"
                            >
                              CANCEL
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(exp.id)}
                            className="p-1.5 rounded-lg bg-red-900/10 text-red-800 hover:bg-red-900/20 transition-colors"
                            title="Delete Expense"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#E5DAC9] rounded-3xl border border-[#B8A98F] shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#B8A98F]/40 pb-3">
              <h3 className="text-sm font-bold text-[#183630] uppercase font-display">
                {editingExpense ? '[ EDIT EXPENSE ENTRY ]' : '[ LOG NEW PRODUCTION EXPENSE ]'}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-[#183630] hover:opacity-75 font-black text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-[#183630] font-bold mb-1">Expense Title / Item *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 500m DTF Transfer Film Roll"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-[#183630] focus:border-[#183630] outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#183630] font-bold mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-[#183630] font-bold"
                  >
                    {EXPENSE_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#183630] font-bold mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="e.g. 4800"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-[#183630] font-bold focus:border-[#183630] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#183630] font-bold mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-[#183630]"
                  />
                </div>

                <div>
                  <label className="block text-[#183630] font-bold mb-1">Payment Method</label>
                  <select
                    value={form.paymentMethod}
                    onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-[#183630] font-bold"
                  >
                    <option value="UPI">UPI / GPay / PhonePe</option>
                    <option value="Bank Transfer">Bank Transfer / NEFT</option>
                    <option value="Cash">Cash</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#183630] font-bold mb-1">Vendor / Supplier</label>
                  <input
                    type="text"
                    placeholder="e.g. ColorTex Inks Pvt Ltd"
                    value={form.vendor}
                    onChange={(e) => setForm({ ...form, vendor: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-[#183630]"
                  />
                </div>

                <div>
                  <label className="block text-[#183630] font-bold mb-1">Invoice / Bill Number</label>
                  <input
                    type="text"
                    placeholder="e.g. INV-9021"
                    value={form.invoiceNumber}
                    onChange={(e) => setForm({ ...form, invoiceNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-[#183630]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#183630] font-bold mb-1">Notes / Description</label>
                <textarea
                  rows="2"
                  placeholder="Additional context or batch information..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-[#183630] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#B8A98F]/40">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-[#183630] font-bold cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#183630] text-[#E5C690] hover:bg-[#183630]/90 font-bold cursor-pointer"
                >
                  [ SAVE EXPENSE ENTRY ]
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
