import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  Calendar,
  Sparkles,
  Link2,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

/**
 * AdminAnnouncementTab Component — Moving Marquee Ticker Content Management
 * Strict 4-Color Luxury System:
 * - #183630, #E5DAC9, #E5C690, #B8A98F
 */
export function AdminAnnouncementTab() {
  const {
    announcements = [],
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    reorderAnnouncements,
  } = useStore();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    text: '',
    highlight: '',
    badge: 'PROMO',
    route: 'products',
    enabled: true,
    priority: 1,
    startDate: '',
    endDate: '',
  });
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const handleStartAdd = () => {
    setFormData({
      text: '',
      highlight: '',
      badge: 'ATELIER',
      route: 'products',
      enabled: true,
      priority: announcements.length + 1,
      startDate: '',
      endDate: '',
    });
    setIsAdding(true);
    setEditingId(null);
  };

  const handleStartEdit = (item) => {
    setFormData({
      text: item.text || '',
      highlight: item.highlight || '',
      badge: item.badge || 'PROMO',
      route: item.route || 'products',
      enabled: item.enabled !== false,
      priority: item.priority || 1,
      startDate: item.startDate || '',
      endDate: item.endDate || '',
    });
    setEditingId(item.id);
    setIsAdding(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.text.trim()) return;

    if (editingId) {
      updateAnnouncement(editingId, formData);
      setEditingId(null);
    } else {
      addAnnouncement(formData);
      setIsAdding(false);
    }
  };

  const handleMove = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= announcements.length) return;
    const reordered = [...announcements];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);
    reorderAnnouncements(reordered);
  };

  return (
    <div className="space-y-6 select-none animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl bg-[#183630] border border-[#B8A98F]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[#E5DAC9]">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#E5C690] font-bold block">
            TOP TICKER MARQUEE
          </span>
          <h2 className="text-lg font-black tracking-tight font-display text-[#E5DAC9]">
            Announcement Bar Management
          </h2>
          <p className="text-xs text-[#B8A98F] mt-0.5">
            Configure the infinite loop messages displayed in the customer top bar.
          </p>
        </div>

        <button
          type="button"
          onClick={handleStartAdd}
          className="px-4 py-2 rounded-xl bg-[#E5C690] hover:bg-[#d9b87c] text-[#183630] text-xs font-mono font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Add Announcement</span>
        </button>
      </div>

      {/* Add / Edit Form Modal / Card */}
      {(isAdding || editingId) && (
        <form
          onSubmit={handleSave}
          className="p-5 rounded-2xl bg-[#183630] border border-[#E5C690] space-y-4 text-[#E5DAC9] animate-in fade-in"
        >
          <div className="flex items-center justify-between border-b border-[#B8A98F]/20 pb-3">
            <h3 className="text-sm font-black font-display uppercase tracking-tight text-[#E5C690]">
              {editingId ? 'Edit Announcement' : 'Add New Ticker Announcement'}
            </h3>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setEditingId(null);
              }}
              className="text-xs font-mono text-[#B8A98F] hover:text-[#E5DAC9]"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs font-mono">
            <div className="sm:col-span-7 space-y-1">
              <label className="text-[#B8A98F] uppercase text-[10px] font-bold">Full Announcement Sentence *</label>
              <input
                type="text"
                required
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                placeholder="e.g. Free Digital Proofs on All Custom Orders"
                className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9]/5 border border-[#B8A98F]/40 text-[#E5DAC9] focus:outline-none focus:border-[#E5C690]"
              />
            </div>

            <div className="sm:col-span-3 space-y-1">
              <label className="text-[#E5C690] uppercase text-[10px] font-bold">Word to Highlight (Gold)</label>
              <input
                type="text"
                value={formData.highlight}
                onChange={(e) => setFormData({ ...formData, highlight: e.target.value })}
                placeholder="e.g. Free"
                className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9]/5 border border-[#B8A98F]/40 text-[#E5C690] focus:outline-none focus:border-[#E5C690]"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-[#B8A98F] uppercase text-[10px] font-bold">Badge Text</label>
              <input
                type="text"
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                placeholder="e.g. CUSTOM"
                className="w-full px-3 py-2 rounded-xl bg-[#E5DAC9]/5 border border-[#B8A98F]/40 text-[#E5DAC9] focus:outline-none focus:border-[#E5C690]"
              />
            </div>

            <div className="sm:col-span-6 space-y-1">
              <label className="text-[#B8A98F] uppercase text-[10px] font-bold">Target Storefront Route</label>
              <select
                value={formData.route}
                onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#183630] border border-[#B8A98F]/40 text-[#E5DAC9] focus:outline-none focus:border-[#E5C690]"
              >
                <option value="products">products (Shop All Products)</option>
                <option value="design-by-customer">design-by-customer (3D Studio Customizer)</option>
                <option value="bulk-orders">bulk-orders (Wholesale Quotes)</option>
                <option value="offers">offers (Special Discounts)</option>
                <option value="help">help (Shipping & Dispatch Info)</option>
                <option value="about-us">about-us (Brand Story)</option>
              </select>
            </div>

            <div className="sm:col-span-3 space-y-1">
              <label className="text-[#B8A98F] uppercase text-[10px] font-bold">Start Date (Optional)</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#183630] border border-[#B8A98F]/40 text-[#E5DAC9]"
              />
            </div>

            <div className="sm:col-span-3 space-y-1">
              <label className="text-[#B8A98F] uppercase text-[10px] font-bold">End Date (Optional)</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#183630] border border-[#B8A98F]/40 text-[#E5DAC9]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setEditingId(null);
              }}
              className="px-3.5 py-1.5 rounded-xl border border-[#B8A98F]/30 text-xs font-mono text-[#E5DAC9]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-[#E5C690] hover:bg-[#d9b87c] text-[#183630] text-xs font-mono font-black uppercase"
            >
              {editingId ? 'Save Updates' : 'Add to Ticker'}
            </button>
          </div>
        </form>
      )}

      {/* Announcements Table */}
      <div className="rounded-2xl bg-[#183630] border border-[#B8A98F]/30 overflow-hidden text-[#E5DAC9]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#E5DAC9]/5 border-b border-[#B8A98F]/20 text-[#B8A98F] uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4 w-12">Order</th>
                <th className="py-3 px-4">Announcement Text</th>
                <th className="py-3 px-4">Highlight</th>
                <th className="py-3 px-4">Link Route</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#B8A98F]/15">
              {announcements.map((item, idx) => {
                const isEnabled = item.enabled !== false;
                return (
                  <tr key={item.id} className="hover:bg-[#E5DAC9]/[0.02] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMove(idx, -1)}
                          className="p-1 rounded hover:bg-[#E5DAC9]/10 disabled:opacity-30 cursor-pointer"
                          title="Move up"
                        >
                          <ArrowUp className="w-3 h-3 text-[#B8A98F]" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === announcements.length - 1}
                          onClick={() => handleMove(idx, 1)}
                          className="p-1 rounded hover:bg-[#E5DAC9]/10 disabled:opacity-30 cursor-pointer"
                          title="Move down"
                        >
                          <ArrowDown className="w-3 h-3 text-[#B8A98F]" />
                        </button>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-sans font-medium text-[#E5DAC9]">
                      <span>{item.text}</span>
                    </td>

                    <td className="py-3 px-4 text-[#E5C690] font-bold">
                      {item.highlight || '—'}
                    </td>

                    <td className="py-3 px-4 text-[#B8A98F]">
                      <span className="inline-flex items-center gap-1">
                        <Link2 className="w-3 h-3" />
                        <span>{item.route || 'home'}</span>
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => updateAnnouncement(item.id, { enabled: !isEnabled })}
                        className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border cursor-pointer ${
                          isEnabled
                            ? 'bg-[#E5C690]/20 text-[#E5C690] border-[#E5C690]/40'
                            : 'bg-[#E5DAC9]/10 text-[#B8A98F] border-[#B8A98F]/20'
                        }`}
                      >
                        {isEnabled ? 'ACTIVE' : 'MUTED'}
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(item)}
                          className="p-1.5 rounded-lg bg-[#E5DAC9]/10 hover:bg-[#E5DAC9]/20 text-[#E5C690] cursor-pointer"
                          title="Edit Announcement"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {confirmDeleteId === item.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                deleteAnnouncement(item.id);
                                setConfirmDeleteId(null);
                              }}
                              className="px-2 py-1 rounded bg-[#183630] border border-[#E5C690] text-[#E5C690] text-[10px] font-bold"
                            >
                              Confirm
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-1.5 py-1 text-[10px] text-[#B8A98F]"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(item.id)}
                            className="p-1.5 rounded-lg bg-[#E5DAC9]/10 hover:bg-[#E5DAC9]/20 text-[#B8A98F] hover:text-[#E5DAC9] cursor-pointer"
                            title="Delete Announcement"
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
      </div>
    </div>
  );
}

export default AdminAnnouncementTab;
