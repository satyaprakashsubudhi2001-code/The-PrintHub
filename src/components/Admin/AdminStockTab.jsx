import React, { useState, useMemo } from 'react';
import {
  Package,
  Plus,
  Minus,
  RefreshCw,
  Search,
  Filter,
  History,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Truck,
  ArrowDownRight,
  ArrowUpRight,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

/**
 * AdminStockTab Component — Enterprise Inventory & Stock Management
 * Tracks SKU-level physical counts, supplier unit costs, and immutable stock history.
 * Strict 4-Color Luxury System.
 */
export function AdminStockTab() {
  const { inventory = [], stockMovements = [], adjustStock } = useStore();

  const [activeView, setActiveView] = useState('inventory'); // 'inventory' | 'history'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK'

  // Adjustment Modal State
  const [selectedSkuItem, setSelectedSkuItem] = useState(null);
  const [adjustForm, setAdjustForm] = useState({
    actionType: 'ADD', // 'ADD' | 'REMOVE' | 'AUDIT'
    quantity: 50,
    reason: 'New Purchase',
    supplier: '',
    unitCost: 0,
  });
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      if (statusFilter === 'IN_STOCK' && item.status !== 'IN STOCK') return false;
      if (statusFilter === 'LOW_STOCK' && item.status !== 'LOW STOCK') return false;
      if (statusFilter === 'OUT_OF_STOCK' && item.status !== 'OUT OF STOCK') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchSku = item.sku?.toLowerCase().includes(q);
        const matchName = item.productName?.toLowerCase().includes(q);
        const matchVariant = item.variant?.toLowerCase().includes(q);
        if (!matchSku && !matchName && !matchVariant) return false;
      }
      return true;
    });
  }, [inventory, statusFilter, searchQuery]);

  const handleOpenAdjustModal = (item, defaultType = 'ADD') => {
    setSelectedSkuItem(item);
    setAdjustForm({
      actionType: defaultType,
      quantity: defaultType === 'ADD' ? 50 : 10,
      reason: defaultType === 'ADD' ? 'New Purchase' : 'Defect / Damage',
      supplier: item.supplier || 'Vardhman Mills',
      unitCost: item.unitCost || 180,
    });
  };

  const handleExecuteAdjustment = (e) => {
    e.preventDefault();
    if (!selectedSkuItem) return;

    const delta =
      adjustForm.actionType === 'REMOVE'
        ? -Math.abs(Number(adjustForm.quantity))
        : Math.abs(Number(adjustForm.quantity));

    adjustStock(
      selectedSkuItem.sku,
      delta,
      adjustForm.actionType,
      adjustForm.reason,
      adjustForm.supplier,
      Number(adjustForm.unitCost)
    );

    showToast(
      `✓ Stock adjusted for ${selectedSkuItem.sku}: ${delta > 0 ? '+' : ''}${delta} units (${adjustForm.reason})`
    );
    setSelectedSkuItem(null);
  };

  return (
    <div className="space-y-6 select-none animate-in fade-in duration-200">
      {/* =====================================================================
          TOP CONTROLS & SUB-TABS
          ===================================================================== */}
      <div className="p-4 rounded-2xl bg-[#183630] border border-[#B8A98F]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[#E5DAC9]">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#E5C690] font-bold block">
            ATELIER SUPPLY CHAIN
          </span>
          <h2 className="text-lg font-black tracking-tight font-display text-[#E5DAC9]">
            Inventory & Stock Control
          </h2>
          <p className="text-xs text-[#B8A98F] mt-0.5">
            Real-time physical counts, supplier procurement, and immutable movement ledger.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveView('inventory')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
              activeView === 'inventory'
                ? 'bracket-selected-dark text-[#E5C690] bg-[#E5DAC9]/10 border-[#B8A98F]/70'
                : 'bg-[#E5DAC9]/5 text-[#E5DAC9]/70 border-transparent hover:text-[#E5C690]'
            }`}
          >
            <span>[ SKU Inventory ]</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('history')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
              activeView === 'history'
                ? 'bracket-selected-dark text-[#E5C690] bg-[#E5DAC9]/10 border-[#B8A98F]/70'
                : 'bg-[#E5DAC9]/5 text-[#E5DAC9]/70 border-transparent hover:text-[#E5C690]'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>[ Stock Movement History ]</span>
          </button>
        </div>
      </div>

      {toastMsg && (
        <div className="p-3.5 rounded-xl bg-[#183630] border border-[#E5C690] text-[#E5C690] text-xs font-bold font-mono flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#E5C690] shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* =====================================================================
          VIEW 1: INVENTORY TABLE
          ===================================================================== */}
      {activeView === 'inventory' && (
        <div className="space-y-4">
          {/* Filter Toolbar */}
          <div className="p-3.5 rounded-xl bg-[#183630] border border-[#B8A98F]/25 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs font-mono text-[#E5DAC9]">
            <div className="relative flex-1 max-w-md">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#B8A98F]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search SKU, garment name, or variant..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#E5DAC9]/5 border border-[#B8A98F]/40 text-[#E5DAC9] placeholder:text-[#B8A98F]/60 focus:outline-none focus:border-[#E5C690]"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <span className="text-[10px] text-[#B8A98F] uppercase mr-1">Status:</span>
              {[
                { id: 'ALL', label: 'All' },
                { id: 'IN_STOCK', label: 'In Stock' },
                { id: 'LOW_STOCK', label: 'Low Stock' },
                { id: 'OUT_OF_STOCK', label: 'Out of Stock' },
              ].map((pill) => {
                const active = statusFilter === pill.id;
                return (
                  <button
                    key={pill.id}
                    type="button"
                    onClick={() => setStatusFilter(pill.id)}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                      active
                        ? 'bg-[#E5C690] text-[#183630]'
                        : 'bg-[#E5DAC9]/5 text-[#E5DAC9]/70 hover:text-[#E5C690]'
                    }`}
                  >
                    {pill.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Table Container */}
          <div className="rounded-2xl bg-[#183630] border border-[#B8A98F]/30 overflow-hidden text-[#E5DAC9]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#E5DAC9]/5 border-b border-[#B8A98F]/20 text-[#B8A98F] uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">SKU / Product</th>
                    <th className="py-3 px-4">Variant / Spec</th>
                    <th className="py-3 px-4 text-center">Current Stock</th>
                    <th className="py-3 px-4 text-center">Reserved</th>
                    <th className="py-3 px-4 text-center">Sold</th>
                    <th className="py-3 px-4">Unit Cost</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#B8A98F]/15">
                  {filteredInventory.map((item) => {
                    const isLow = item.status === 'LOW STOCK';
                    const isOut = item.status === 'OUT OF STOCK';

                    return (
                      <tr key={item.sku} className="hover:bg-[#E5DAC9]/[0.02] transition-colors">
                        <td className="py-3 px-4 font-sans font-bold">
                          <span className="text-[#E5DAC9] block">{item.productName}</span>
                          <span className="text-[10px] text-[#B8A98F] font-mono block">
                            SKU: {item.sku}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-[#E5DAC9]/90 font-sans">
                          <span>{item.variant}</span>
                        </td>

                        <td className="py-3 px-4 text-center">
                          <span className={`font-black text-sm ${isOut ? 'text-[#E5C690]' : isLow ? 'text-[#E5C690]' : 'text-[#E5DAC9]'}`}>
                            {item.currentStock}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-center text-[#B8A98F]">
                          {item.reservedStock || 0}
                        </td>

                        <td className="py-3 px-4 text-center text-[#B8A98F]">
                          {item.soldQuantity || 0}
                        </td>

                        <td className="py-3 px-4 text-[#E5C690] font-bold">
                          ₹{item.unitCost || 0}
                        </td>

                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${
                              isOut
                                ? 'bg-[#183630] text-[#E5C690] border-[#B8A98F]'
                                : isLow
                                ? 'bg-[#E5C690]/20 text-[#E5C690] border-[#E5C690]/40'
                                : 'bg-[#E5DAC9]/10 text-[#E5DAC9] border-[#B8A98F]/30'
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenAdjustModal(item, 'ADD')}
                              className="px-2 py-1 rounded bg-[#E5C690] text-[#183630] hover:bg-[#d9b87c] text-[10px] font-black uppercase tracking-wide cursor-pointer"
                              title="Add Stock"
                            >
                              + Add
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenAdjustModal(item, 'REMOVE')}
                              className="px-2 py-1 rounded bg-[#E5DAC9]/10 text-[#E5DAC9] hover:text-[#E5C690] text-[10px] font-bold cursor-pointer border border-[#B8A98F]/30"
                              title="Remove Stock"
                            >
                              - Remove
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          VIEW 2: STOCK MOVEMENT HISTORY LEDGER
          ===================================================================== */}
      {activeView === 'history' && (
        <div className="rounded-2xl bg-[#183630] border border-[#B8A98F]/30 overflow-hidden text-[#E5DAC9]">
          <div className="p-4 border-b border-[#B8A98F]/20 flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#E5C690]">
              Immutable Stock Movement Audit Trail ({stockMovements.length} records)
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#E5DAC9]/5 border-b border-[#B8A98F]/20 text-[#B8A98F] uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Log ID</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">SKU / Item</th>
                  <th className="py-3 px-4">Action Type</th>
                  <th className="py-3 px-4 text-center">Qty Change</th>
                  <th className="py-3 px-4">Reason / Supplier</th>
                  <th className="py-3 px-4">Unit Cost</th>
                  <th className="py-3 px-4 text-right">Logged By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#B8A98F]/15">
                {stockMovements.map((log) => (
                  <tr key={log.id} className="hover:bg-[#E5DAC9]/[0.02]">
                    <td className="py-3 px-4 text-[#E5C690] font-bold">{log.id}</td>
                    <td className="py-3 px-4 text-[#B8A98F]">
                      {new Date(log.date).toLocaleDateString()} {new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#E5DAC9]">
                      <div>{log.productName}</div>
                      <div className="text-[10px] text-[#B8A98F] font-normal">{log.sku} • {log.variant}</div>
                    </td>
                    <td className="py-3 px-4 uppercase text-[10px]">
                      <span className="px-1.5 py-0.5 rounded bg-[#E5DAC9]/10 border border-[#B8A98F]/30">
                        {log.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-black text-sm">
                      <span className={log.quantity > 0 ? 'text-[#E5C690]' : 'text-[#B8A98F]'}>
                        {log.quantity > 0 ? `+${log.quantity}` : log.quantity}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#E5DAC9]/90">
                      <div>{log.reason}</div>
                      {log.supplier && <div className="text-[10px] text-[#B8A98F]">Supplier: {log.supplier}</div>}
                    </td>
                    <td className="py-3 px-4 text-[#E5C690]">
                      {log.unitCost ? `₹${log.unitCost}` : '—'}
                    </td>
                    <td className="py-3 px-4 text-right text-[#B8A98F] text-[10px]">
                      {log.admin}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: MANUAL STOCK ENTRY / ADJUSTMENT
          ===================================================================== */}
      {selectedSkuItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#183630]/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-[#183630] border border-[#E5C690] p-6 text-[#E5DAC9] space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#B8A98F]/20 pb-3">
              <div>
                <span className="text-[10px] font-mono text-[#E5C690] font-bold uppercase block">
                  MANUAL STOCK ENTRY
                </span>
                <h3 className="text-base font-black font-display uppercase tracking-tight text-[#E5DAC9]">
                  {selectedSkuItem.productName} ({selectedSkuItem.variant})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSkuItem(null)}
                className="text-xs font-mono text-[#B8A98F] hover:text-[#E5DAC9]"
              >
                Cancel
              </button>
            </div>

            <div className="p-3 rounded-xl bg-[#E5DAC9]/5 border border-[#B8A98F]/25 flex items-center justify-between text-xs font-mono">
              <span>Current Stock on Floor:</span>
              <span className="font-black text-sm text-[#E5C690]">{selectedSkuItem.currentStock} units</span>
            </div>

            <form onSubmit={handleExecuteAdjustment} className="space-y-3.5 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[#B8A98F] uppercase text-[10px] font-bold">Action Type</label>
                  <select
                    value={adjustForm.actionType}
                    onChange={(e) => setAdjustForm({ ...adjustForm, actionType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#183630] border border-[#B8A98F]/40 text-[#E5DAC9] focus:outline-none focus:border-[#E5C690]"
                  >
                    <option value="ADD">+ Add Stock (Purchase / Supply)</option>
                    <option value="REMOVE">- Remove Stock (Damage / Scrap / Audit)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[#E5C690] uppercase text-[10px] font-bold">Quantity *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={adjustForm.quantity}
                    onChange={(e) => setAdjustForm({ ...adjustForm, quantity: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9]/5 border border-[#B8A98F]/40 text-[#E5C690] font-bold focus:outline-none focus:border-[#E5C690]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[#B8A98F] uppercase text-[10px] font-bold">Reason *</label>
                  <input
                    type="text"
                    required
                    value={adjustForm.reason}
                    onChange={(e) => setAdjustForm({ ...adjustForm, reason: e.target.value })}
                    placeholder="e.g. New Purchase / QC Defect"
                    className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9]/5 border border-[#B8A98F]/40 text-[#E5DAC9] focus:outline-none focus:border-[#E5C690]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#B8A98F] uppercase text-[10px] font-bold">Supplier Name</label>
                  <input
                    type="text"
                    value={adjustForm.supplier}
                    onChange={(e) => setAdjustForm({ ...adjustForm, supplier: e.target.value })}
                    placeholder="e.g. Vardhman Mills"
                    className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9]/5 border border-[#B8A98F]/40 text-[#E5DAC9] focus:outline-none focus:border-[#E5C690]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[#B8A98F] uppercase text-[10px] font-bold">Procurement Unit Cost (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={adjustForm.unitCost}
                  onChange={(e) => setAdjustForm({ ...adjustForm, unitCost: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9]/5 border border-[#B8A98F]/40 text-[#E5DAC9] focus:outline-none focus:border-[#E5C690]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#B8A98F]/20">
                <button
                  type="button"
                  onClick={() => setSelectedSkuItem(null)}
                  className="px-3.5 py-1.5 rounded-xl border border-[#B8A98F]/30 text-xs font-mono text-[#E5DAC9]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#E5C690] hover:bg-[#d9b87c] text-[#183630] text-xs font-mono font-black uppercase tracking-wider cursor-pointer"
                >
                  Save Stock Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminStockTab;
