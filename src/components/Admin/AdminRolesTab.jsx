import React from 'react';
import {
  ShieldCheck,
  UserCheck,
  Lock,
  Key,
  Check,
  X,
  AlertCircle,
  Crown,
  User,
  Users,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ADMIN_ROLES } from '../../services/adminDb';

const MODULE_PERMISSIONS = [
  { module: 'Dashboard & KPI Overview', super: 'Full', admin: 'Full', staff: 'Read Only' },
  { module: 'Homepage CMS (Drafts & Edit)', super: 'Full', admin: 'Full', staff: 'Read Only' },
  { module: 'Homepage CMS (Live Publish)', super: 'Full', admin: 'Draft Only', staff: 'No Access' },
  { module: 'Announcement Bar Manager', super: 'Full', admin: 'Full', staff: 'Read Only' },
  { module: 'Image & Media Manager', super: 'Full', admin: 'Full', staff: 'Read Only' },
  { module: 'Product Catalog Management', super: 'Full', admin: 'Full', staff: 'Read Only' },
  { module: 'Category Taxonomy Hierarchy', super: 'Full', admin: 'Full', staff: 'No Access' },
  { module: 'Stock & SKU Inventory', super: 'Full', admin: 'Full', staff: 'Add / Adjust' },
  { module: 'Order Lifecycle & Statuses', super: 'Full', admin: 'Full', staff: 'Status Update' },
  { module: 'Manual Order Entry (POS)', super: 'Full', admin: 'Full', staff: 'Full' },
  { module: 'Profit & Loss Financials', super: 'Full', admin: 'Read Only', staff: 'No Access' },
  { module: 'Operational Expenses Ledger', super: 'Full', admin: 'Full', staff: 'No Access' },
  { module: 'Executive Reports & CSV', super: 'Full', admin: 'Full', staff: 'Read Only' },
  { module: 'Design Requests Queue', super: 'Full', admin: 'Full', staff: 'Full' },
  { module: '3D Customizer Calibration', super: 'Full', admin: 'Full', staff: 'Read Only' },
  { module: 'Customer CRM Directory', super: 'Full', admin: 'Full', staff: 'Read & Notes' },
  { module: 'Social & Contact Settings', super: 'Full', admin: 'Full', staff: 'Read Only' },
  { module: 'Security Audit & Role Config', super: 'Full', admin: 'Read Only', staff: 'No Access' },
];

export function AdminRolesTab() {
  const {
    adminRole,
    changeAdminRole,
    adminUser,
  } = useStore();

  const isSuper = adminRole?.id === 'SUPER_ADMIN';
  const isAdmin = adminRole?.id === 'ADMIN';
  const isStaff = adminRole?.id === 'STAFF';

  return (
    <div className="space-y-6 font-mono text-xs text-[#183630]">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-[#E5C690] border border-[#B8A98F] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#183630] uppercase font-display tracking-tight">
              Role-Based Access Control (RBAC) & Governance
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#183630] text-[#E5DAC9] text-[10px] font-bold">
              [ ENTERPRISE SECURITY ]
            </span>
          </div>
          <p className="text-[#183630]/75 text-xs font-sans mt-1">
            Configure administrative permission tiers. Super Admin retains absolute publish and financial authority, while Staff operators are restricted to fulfillment and inventory logging.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-2 rounded-xl bg-[#183630] text-[#E5C690] border border-[#B8A98F] flex items-center gap-2">
            <Key className="w-3.5 h-3.5" />
            <span className="font-bold">Active Role: {adminRole?.name || adminRole?.id || 'Super Administrator'}</span>
          </div>
        </div>
      </div>

      {/* Role Switcher Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Super Admin */}
        <div
          onClick={() => changeAdminRole('SUPER_ADMIN')}
          className={`p-6 rounded-3xl border cursor-pointer transition-all space-y-3 relative overflow-hidden ${
            isSuper
              ? 'bg-[#183630] text-[#E5DAC9] border-[#E5C690] shadow-md ring-2 ring-[#E5C690]/50'
              : 'bg-[#E5DAC9] text-[#183630] border-[#B8A98F] hover:border-[#183630]'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown
                className={`w-5 h-5 ${
                  isSuper ? 'text-[#E5C690]' : 'text-[#183630]'
                }`}
              />
              <span className="font-bold text-sm uppercase">SUPER ADMIN</span>
            </div>
            {isSuper && (
              <span className="px-2 py-0.5 rounded-full bg-[#E5C690] text-[#183630] text-[10px] font-black">
                ACTIVE
              </span>
            )}
          </div>
          <p
            className={`text-[11px] leading-relaxed font-sans ${
              isSuper ? 'text-[#E5DAC9]/80' : 'text-[#183630]/80'
            }`}
          >
            Absolute control over all atelier operations. Can directly publish to customer website, delete orders, view raw net P&L margins, and manage security settings.
          </p>
          <div className="pt-2">
            <button
              type="button"
              className={`w-full py-2 rounded-xl text-center font-bold text-xs uppercase ${
                isSuper
                  ? 'bg-[#E5C690] text-[#183630]'
                  : 'bg-[#183630] text-[#E5DAC9]'
              }`}
            >
              {isSuper ? '[ ACTIVE ROLE ]' : 'SWITCH TO SUPER ADMIN'}
            </button>
          </div>
        </div>

        {/* Admin */}
        <div
          onClick={() => changeAdminRole('ADMIN')}
          className={`p-6 rounded-3xl border cursor-pointer transition-all space-y-3 relative overflow-hidden ${
            isAdmin
              ? 'bg-[#183630] text-[#E5DAC9] border-[#E5C690] shadow-md ring-2 ring-[#E5C690]/50'
              : 'bg-[#E5DAC9] text-[#183630] border-[#B8A98F] hover:border-[#183630]'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck
                className={`w-5 h-5 ${
                  isAdmin ? 'text-[#E5C690]' : 'text-[#183630]'
                }`}
              />
              <span className="font-bold text-sm uppercase">ADMIN</span>
            </div>
            {isAdmin && (
              <span className="px-2 py-0.5 rounded-full bg-[#E5C690] text-[#183630] text-[10px] font-black">
                ACTIVE
              </span>
            )}
          </div>
          <p
            className={`text-[11px] leading-relaxed font-sans ${
              isAdmin ? 'text-[#E5DAC9]/80' : 'text-[#183630]/80'
            }`}
          >
            Senior operational manager. Can edit products, prepare CMS draft revisions, manage orders, record production expenses, and handle incoming design requests.
          </p>
          <div className="pt-2">
            <button
              type="button"
              className={`w-full py-2 rounded-xl text-center font-bold text-xs uppercase ${
                isAdmin
                  ? 'bg-[#E5C690] text-[#183630]'
                  : 'bg-[#183630] text-[#E5DAC9]'
              }`}
            >
              {isAdmin ? '[ ACTIVE ROLE ]' : 'SWITCH TO ADMIN'}
            </button>
          </div>
        </div>

        {/* Staff */}
        <div
          onClick={() => changeAdminRole('STAFF')}
          className={`p-6 rounded-3xl border cursor-pointer transition-all space-y-3 relative overflow-hidden ${
            isStaff
              ? 'bg-[#183630] text-[#E5DAC9] border-[#E5C690] shadow-md ring-2 ring-[#E5C690]/50'
              : 'bg-[#E5DAC9] text-[#183630] border-[#B8A98F] hover:border-[#183630]'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users
                className={`w-5 h-5 ${
                  isStaff ? 'text-[#E5C690]' : 'text-[#183630]'
                }`}
              />
              <span className="font-bold text-sm uppercase">OPERATIONAL STAFF</span>
            </div>
            {isStaff && (
              <span className="px-2 py-0.5 rounded-full bg-[#E5C690] text-[#183630] text-[10px] font-black">
                ACTIVE
              </span>
            )}
          </div>
          <p
            className={`text-[11px] leading-relaxed font-sans ${
              isStaff ? 'text-[#E5DAC9]/80' : 'text-[#183630]/80'
            }`}
          >
            Floor printing staff & dispatch desk. Can view orders, change fulfillment stages, log new walk-in orders, and perform manual stock check-ins without accessing financials.
          </p>
          <div className="pt-2">
            <button
              type="button"
              className={`w-full py-2 rounded-xl text-center font-bold text-xs uppercase ${
                isStaff
                  ? 'bg-[#E5C690] text-[#183630]'
                  : 'bg-[#183630] text-[#E5DAC9]'
              }`}
            >
              {isStaff ? '[ ACTIVE ROLE ]' : 'SWITCH TO STAFF'}
            </button>
          </div>
        </div>
      </div>

      {/* Permissions Matrix */}
      <div className="rounded-3xl bg-[#E5DAC9] border border-[#B8A98F] overflow-hidden shadow-sm">
        <div className="p-4 bg-[#183630] text-[#E5DAC9] font-bold uppercase text-xs flex justify-between">
          <span>Enterprise Role Permission Matrix</span>
          <span>18 Controlled Functional Areas</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#183630]/10 text-[#183630] text-[10px] uppercase font-bold border-b border-[#B8A98F]/30">
              <tr>
                <th className="py-3 px-4">Functional Capability</th>
                <th className="py-3 px-4 text-center">Super Admin</th>
                <th className="py-3 px-4 text-center">Admin</th>
                <th className="py-3 px-4 text-center">Staff</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#B8A98F]/30">
              {MODULE_PERMISSIONS.map((perm) => (
                <tr key={perm.module} className="hover:bg-[#183630]/5 transition-colors">
                  <td className="py-3 px-4 font-bold text-[#183630]">{perm.module}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#183630] text-[#E5DAC9] font-bold text-[10px]">
                      {perm.super}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        perm.admin === 'No Access'
                          ? 'bg-red-900/10 text-red-900'
                          : 'bg-[#E5C690] text-[#183630]'
                      }`}
                    >
                      {perm.admin}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        perm.staff === 'No Access'
                          ? 'bg-red-900/10 text-red-900'
                          : perm.staff === 'Full'
                          ? 'bg-[#183630] text-[#E5DAC9]'
                          : 'bg-[#E5DAC9] border border-[#B8A98F] text-[#183630]'
                      }`}
                    >
                      {perm.staff}
                    </span>
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
