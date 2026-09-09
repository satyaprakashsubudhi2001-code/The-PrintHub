import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  Search,
  Download,
  Trash2,
  Filter,
  User,
  Clock,
  FileText,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export function AdminAuditLogTab() {
  const {
    auditLogs = [],
    adminRole,
    adminUser,
    logAdminActivity,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [sectionFilter, setSectionFilter] = useState('ALL');
  const [actionFilter, setActionFilter] = useState('ALL');

  // Filtered Logs
  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      if (sectionFilter !== 'ALL' && log.section !== sectionFilter) return false;
      if (actionFilter !== 'ALL' && log.action !== actionFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchAdmin = log.admin?.toLowerCase().includes(q);
        const matchAction = log.action?.toLowerCase().includes(q);
        const matchSection = log.section?.toLowerCase().includes(q);
        const matchRecord = log.recordId?.toLowerCase().includes(q);
        const matchDetails = JSON.stringify(log.details || {}).toLowerCase().includes(q);
        if (!matchAdmin && !matchAction && !matchSection && !matchRecord && !matchDetails) return false;
      }
      return true;
    });
  }, [auditLogs, sectionFilter, actionFilter, searchQuery]);

  // Unique sections & actions for filters
  const sections = useMemo(() => {
    const set = new Set(auditLogs.map((l) => l.section).filter(Boolean));
    return Array.from(set);
  }, [auditLogs]);

  const actions = useMemo(() => {
    const set = new Set(auditLogs.map((l) => l.action).filter(Boolean));
    return Array.from(set);
  }, [auditLogs]);

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Log ID,Timestamp,Admin,Role,Section,Action,Record ID,Details'];
    const rows = filteredLogs.map((l) =>
      `"${l.id}","${l.timestamp}","${l.admin}","${l.role || ''}","${l.section}","${l.action}","${l.recordId || ''}","${JSON.stringify(l.details || {}).replace(/"/g, '""')}"`
    );
    const blob = new Blob([[...headers, ...rows].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ThePrintHub_Audit_Logs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getActionBadge = (action) => {
    if (action.includes('DELETE') || action.includes('REMOVE')) {
      return 'bg-rose-900/20 text-rose-900 border-rose-900/40';
    }
    if (action.includes('CREATE') || action.includes('ADD') || action.includes('PUBLISH')) {
      return 'bg-emerald-900/20 text-emerald-900 border-emerald-900/40';
    }
    if (action.includes('UPDATE') || action.includes('EDIT')) {
      return 'bg-[#183630] text-[#E5DAC9] border-[#B8A98F]';
    }
    return 'bg-[#E5C690] text-[#183630] border-[#B8A98F]';
  };

  return (
    <div className="space-y-6 font-mono text-xs text-[#183630]">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-[#E5C690] border border-[#B8A98F] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#183630] uppercase font-display tracking-tight">
              Activity & Security Audit Ledger
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#183630] text-[#E5DAC9] text-[10px] font-bold">
              [ IMMUTABLE TRAIL ]
            </span>
          </div>
          <p className="text-[#183630]/75 text-xs font-sans mt-1">
            Complete historical audit trail tracking every administrative action, price change, CMS publish event, manual order creation, and stock adjustments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-xl bg-[#183630] text-[#E5C690] hover:bg-[#183630]/90 font-bold flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>[ EXPORT AUDIT TRAIL ]</span>
          </button>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-[#E5DAC9] border border-[#B8A98F] shadow-sm space-y-1">
          <span className="text-[10px] text-[#183630]/75 uppercase font-bold">TOTAL LOGGED EVENTS</span>
          <div className="text-2xl font-black text-[#183630]">{auditLogs.length}</div>
          <span className="text-[10px] text-[#183630]/60 block">Recorded in atelier session</span>
        </div>

        <div className="p-5 rounded-3xl bg-[#E5DAC9] border border-[#B8A98F] shadow-sm space-y-1">
          <span className="text-[10px] text-[#183630]/75 uppercase font-bold">CMS PUBLISH EVENTS</span>
          <div className="text-2xl font-black text-[#183630]">
            {auditLogs.filter((l) => l.action?.includes('PUBLISH')).length}
          </div>
          <span className="text-[10px] text-[#183630]/60 block">Storefront copy updates</span>
        </div>

        <div className="p-5 rounded-3xl bg-[#E5DAC9] border border-[#B8A98F] shadow-sm space-y-1">
          <span className="text-[10px] text-[#183630]/75 uppercase font-bold">STOCK ADJUSTMENTS</span>
          <div className="text-2xl font-black text-[#183630]">
            {auditLogs.filter((l) => l.section === 'STOCK' || l.action?.includes('STOCK')).length}
          </div>
          <span className="text-[10px] text-[#183630]/60 block">Inventory entries</span>
        </div>

        <div className="p-5 rounded-3xl bg-[#E5C690] border border-[#B8A98F] shadow-sm space-y-1">
          <span className="text-[10px] text-[#183630]/75 uppercase font-bold">ACTIVE ACTOR</span>
          <div className="text-base font-black text-[#183630] truncate">
            {adminUser?.email || 'admin@theprinthub.com'}
          </div>
          <span className="text-[10px] text-[#183630]/80 block font-bold">Role: {adminRole?.name || adminRole?.id || 'Super Administrator'}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-[#E5DAC9] border border-[#B8A98F]">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto no-scrollbar">
          {['ALL', ...sections].map((sec) => {
            const isSelected = sectionFilter === sec;
            return (
              <button
                key={sec}
                type="button"
                onClick={() => setSectionFilter(sec)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold tracking-wider shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? 'bracket-selected font-black text-[#183630]'
                    : 'bg-[#E5DAC9] border border-[#B8A98F] text-[#183630]/80 hover:border-[#183630]'
                }`}
              >
                {isSelected ? `[ ${sec.toUpperCase()} ]` : sec.toUpperCase()}
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-72 shrink-0">
          <Search className="w-4 h-4 text-[#183630]/60 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search audit trail, actor, details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-[#183630] placeholder:text-[#183630]/60 text-xs focus:outline-none focus:border-[#183630]"
          />
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="rounded-3xl bg-[#E5DAC9] border border-[#B8A98F] overflow-hidden shadow-sm">
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Activity className="w-8 h-8 text-[#183630]/40 mx-auto" />
            <h3 className="text-sm font-bold text-[#183630]">No audit events found</h3>
            <p className="text-xs text-[#183630]/75">Administrative interactions will appear here in chronological sequence.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#183630] text-[#E5DAC9] text-[10px] uppercase font-bold border-b border-[#B8A98F]/30">
                <tr>
                  <th className="py-3.5 px-4">Timestamp</th>
                  <th className="py-3.5 px-4">Admin / Operator</th>
                  <th className="py-3.5 px-4">Section</th>
                  <th className="py-3.5 px-4">Action</th>
                  <th className="py-3.5 px-4">Record Identifier</th>
                  <th className="py-3.5 px-4">Audit Details & Context</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#B8A98F]/30">
                {filteredLogs.map((log) => {
                  const badgeClass = getActionBadge(log.action);
                  return (
                    <tr key={log.id} className="hover:bg-[#183630]/5 transition-colors">
                      <td className="py-3.5 px-4 text-[#183630]/80 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-[#183630] block">{log.admin}</span>
                        <span className="text-[10px] text-[#183630]/60 block">{log.role || 'Staff'}</span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-[#E5DAC9] border border-[#B8A98F] text-[#183630] font-bold text-[10px]">
                          {log.section}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${badgeClass}`}>
                          {log.action}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-[#183630]">
                        {log.recordId || '—'}
                      </td>

                      <td className="py-3.5 px-4 text-[#183630]/85 text-[11px] max-w-xs truncate">
                        {typeof log.details === 'object' ? (
                          <span title={JSON.stringify(log.details, null, 2)}>
                            {Object.entries(log.details)
                              .map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}`)
                              .join(' • ')}
                          </span>
                        ) : (
                          String(log.details || '—')
                        )}
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
