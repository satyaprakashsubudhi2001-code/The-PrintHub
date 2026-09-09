import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Package,
  AlertTriangle,
  CheckCircle2,
  Clock,
  DollarSign,
  ShoppingCart,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

/**
 * AdminDashboardTab Component — Executive Business Overview & Financial KPIs
 * Strict 4-Color Luxury System:
 * - #183630 (Dark Green)
 * - #E5DAC9 (Beige)
 * - #E5C690 (Soft Gold)
 * - #B8A98F (Taupe / Highlight)
 */
export function AdminDashboardTab({ onNavigateTab, onNavigate }) {
  const navigate = onNavigateTab || onNavigate;
  const {
    products = [],
    orders = [],
    expenses = [],
    designRequests = [],
    inventory = [],
    computeFinancialOverview,
  } = useStore();

  const [dateFilter, setDateFilter] = useState('30DAYS'); // 'TODAY' | 'YESTERDAY' | '7DAYS' | '30DAYS' | 'THIS_MONTH' | 'LAST_MONTH' | 'ALL'

  // Inventory KPIs
  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.status !== 'inactive').length;
  const outOfStockCount = inventory.filter((i) => i.currentStock === 0).length;
  const lowStockCount = inventory.filter((i) => i.currentStock > 0 && i.currentStock <= (i.minStockLevel || 10)).length;

  // Financial & Order KPIs
  const financial = useMemo(() => {
    return computeFinancialOverview(orders, expenses, dateFilter);
  }, [orders, expenses, dateFilter, computeFinancialOverview]);

  // Today's Metrics
  const todayFinancial = useMemo(() => {
    return computeFinancialOverview(orders, expenses, 'TODAY');
  }, [orders, expenses, computeFinancialOverview]);

  // This Month's Metrics
  const monthFinancial = useMemo(() => {
    return computeFinancialOverview(orders, expenses, 'THIS_MONTH');
  }, [orders, expenses, computeFinancialOverview]);

  // Design Requests
  const totalDesignRequests = designRequests.length;
  const pendingDesignRequests = designRequests.filter((r) => r.status === 'NEW' || r.status === 'UNDER_REVIEW').length;

  return (
    <div className="space-y-6 select-none animate-in fade-in duration-200">
      {/* =====================================================================
          HEADER CONTROLS & DATE FILTER BAR
          ===================================================================== */}
      <div className="p-4 rounded-2xl bg-[#183630] border border-[#B8A98F]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[#E5DAC9]">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#E5C690] font-bold block">
            EXECUTIVE COMMAND OVERVIEW
          </span>
          <h2 className="text-lg font-black tracking-tight font-display text-[#E5DAC9]">
            The PrintHub Business Intelligence
          </h2>
        </div>

        {/* Date Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full md:w-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1 text-[11px] font-mono text-[#B8A98F] mr-1 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span>Range:</span>
          </div>
          {[
            { id: 'TODAY', label: 'Today' },
            { id: '7DAYS', label: '7 Days' },
            { id: '30DAYS', label: '30 Days' },
            { id: 'THIS_MONTH', label: 'This Month' },
            { id: 'ALL', label: 'All Time' },
          ].map((item) => {
            const active = dateFilter === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setDateFilter(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold tracking-wide transition-all cursor-pointer whitespace-nowrap border ${
                  active
                    ? 'bracket-selected-dark text-[#E5C690] bg-[#E5DAC9]/10 border-[#B8A98F]/70 shadow-sm'
                    : 'bg-[#E5DAC9]/5 text-[#E5DAC9]/70 border-transparent hover:text-[#E5C690] hover:bg-[#E5DAC9]/10'
                }`}
              >
                <span>{active ? `[ ${item.label} ]` : item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =====================================================================
          1. PRIMARY FINANCIAL KPIS (Revenue, Costs, Net Profit, Loss, Margin)
          ===================================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* TOTAL SALES / REVENUE */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#E5C690] text-[#183630] border border-[#B8A98F] shadow-sm space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-[#183630]/75">
              TOTAL REVENUE (SALES)
            </span>
            <DollarSign className="w-4 h-4 text-[#183630]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight">
            ₹{financial.totalRevenue.toLocaleString('en-IN')}
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono pt-1 border-t border-[#183630]/15">
            <span>Today: ₹{todayFinancial.totalRevenue.toLocaleString('en-IN')}</span>
            <span className="font-bold">Mo: ₹{monthFinancial.totalRevenue.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* TOTAL DIRECT & OPERATING COSTS */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#183630] text-[#E5DAC9] border border-[#B8A98F]/40 shadow-sm space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-[#B8A98F]">
              TOTAL COSTS & EXPENSES
            </span>
            <Layers className="w-4 h-4 text-[#E5C690]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-[#E5DAC9]">
            ₹{(financial.totalCogs + financial.totalOperatingExpenses).toLocaleString('en-IN')}
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono pt-1 border-t border-[#B8A98F]/20 text-[#B8A98F]">
            <span>COGS: ₹{financial.totalCogs.toLocaleString('en-IN')}</span>
            <span>Overhead: ₹{financial.totalOperatingExpenses.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* TOTAL NET PROFIT */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#183630] text-[#E5DAC9] border border-[#B8A98F]/40 shadow-sm space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-[#E5C690]">
              NET PROFIT
            </span>
            <TrendingUp className="w-4 h-4 text-[#E5C690]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-[#E5C690]">
            ₹{financial.netProfit.toLocaleString('en-IN')}
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono pt-1 border-t border-[#B8A98F]/20 text-[#B8A98F]">
            <span>Margin: <strong className="text-[#E5C690]">{financial.profitMarginPercent}%</strong></span>
            <span>Month: ₹{monthFinancial.netProfit.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* TOTAL LOSS (IF ANY) / GROSS SURPLUS */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#183630] text-[#E5DAC9] border border-[#B8A98F]/40 shadow-sm space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-[#B8A98F]">
              {financial.netLoss > 0 ? 'NET DEFICIT / LOSS' : 'GROSS OPERATING SURPLUS'}
            </span>
            {financial.netLoss > 0 ? (
              <ArrowDownRight className="w-4 h-4 text-[#E5C690]" />
            ) : (
              <ArrowUpRight className="w-4 h-4 text-[#E5C690]" />
            )}
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-[#E5DAC9]">
            {financial.netLoss > 0 ? `₹${financial.netLoss.toLocaleString('en-IN')}` : `₹${financial.grossProfit.toLocaleString('en-IN')}`}
          </div>
          <div className="text-[11px] font-mono pt-1 border-t border-[#B8A98F]/20 text-[#B8A98F]">
            {financial.netLoss > 0 ? 'Operating deficit recorded' : 'Gross profit before overhead'}
          </div>
        </div>
      </div>

      {/* =====================================================================
          2. OPERATIONS & INVENTORY KPIS (8 Core Metrics)
          ===================================================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {/* Total Products */}
        <button
          type="button"
          onClick={() => onNavigateTab?.('products')}
          className="p-3.5 rounded-xl bg-[#183630] border border-[#B8A98F]/30 text-left hover:border-[#E5C690] transition-all cursor-pointer"
        >
          <span className="text-[9px] font-mono uppercase text-[#B8A98F] block">TOTAL PRODUCTS</span>
          <div className="text-xl font-black font-mono text-[#E5DAC9] mt-0.5">{totalProducts}</div>
        </button>

        {/* Active Products */}
        <button
          type="button"
          onClick={() => onNavigateTab?.('products')}
          className="p-3.5 rounded-xl bg-[#183630] border border-[#B8A98F]/30 text-left hover:border-[#E5C690] transition-all cursor-pointer"
        >
          <span className="text-[9px] font-mono uppercase text-[#B8A98F] block">ACTIVE ITEMS</span>
          <div className="text-xl font-black font-mono text-[#E5C690] mt-0.5">{activeProducts}</div>
        </button>

        {/* Out of Stock */}
        <button
          type="button"
          onClick={() => onNavigateTab?.('stock')}
          className="p-3.5 rounded-xl bg-[#183630] border border-[#B8A98F]/30 text-left hover:border-[#E5C690] transition-all cursor-pointer"
        >
          <span className="text-[9px] font-mono uppercase text-[#B8A98F] block">OUT OF STOCK</span>
          <div className={`text-xl font-black font-mono mt-0.5 ${outOfStockCount > 0 ? 'text-[#E5C690]' : 'text-[#E5DAC9]'}`}>
            {outOfStockCount}
          </div>
        </button>

        {/* Low Stock */}
        <button
          type="button"
          onClick={() => onNavigateTab?.('stock')}
          className="p-3.5 rounded-xl bg-[#183630] border border-[#B8A98F]/30 text-left hover:border-[#E5C690] transition-all cursor-pointer"
        >
          <span className="text-[9px] font-mono uppercase text-[#B8A98F] block">LOW STOCK</span>
          <div className={`text-xl font-black font-mono mt-0.5 ${lowStockCount > 0 ? 'text-[#E5C690]' : 'text-[#E5DAC9]'}`}>
            {lowStockCount}
          </div>
        </button>

        {/* Total Orders */}
        <button
          type="button"
          onClick={() => onNavigateTab?.('orders')}
          className="p-3.5 rounded-xl bg-[#183630] border border-[#B8A98F]/30 text-left hover:border-[#E5C690] transition-all cursor-pointer"
        >
          <span className="text-[9px] font-mono uppercase text-[#B8A98F] block">TOTAL ORDERS</span>
          <div className="text-xl font-black font-mono text-[#E5DAC9] mt-0.5">{financial.totalOrdersCount}</div>
        </button>

        {/* Pending Orders */}
        <button
          type="button"
          onClick={() => onNavigateTab?.('orders')}
          className="p-3.5 rounded-xl bg-[#183630] border border-[#B8A98F]/30 text-left hover:border-[#E5C690] transition-all cursor-pointer"
        >
          <span className="text-[9px] font-mono uppercase text-[#B8A98F] block">PENDING ORDERS</span>
          <div className="text-xl font-black font-mono text-[#E5C690] mt-0.5">{financial.pendingOrdersCount}</div>
        </button>

        {/* Completed Orders */}
        <button
          type="button"
          onClick={() => onNavigateTab?.('orders')}
          className="p-3.5 rounded-xl bg-[#183630] border border-[#B8A98F]/30 text-left hover:border-[#E5C690] transition-all cursor-pointer"
        >
          <span className="text-[9px] font-mono uppercase text-[#B8A98F] block">COMPLETED</span>
          <div className="text-xl font-black font-mono text-[#E5DAC9] mt-0.5">{financial.completedOrdersCount}</div>
        </button>

        {/* Design Requests */}
        <button
          type="button"
          onClick={() => onNavigateTab?.('requests')}
          className="p-3.5 rounded-xl bg-[#183630] border border-[#B8A98F]/30 text-left hover:border-[#E5C690] transition-all cursor-pointer"
        >
          <span className="text-[9px] font-mono uppercase text-[#B8A98F] block">DESIGN REQS</span>
          <div className="text-xl font-black font-mono text-[#E5C690] mt-0.5">{totalDesignRequests}</div>
        </button>
      </div>

      {/* =====================================================================
          3. FINANCIAL CHARTS & REVENUE BREAKDOWN
          ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left 7 Cols: Financial Performance Visual Graph */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-[#183630] border border-[#B8A98F]/30 space-y-4 text-[#E5DAC9]">
          <div className="flex items-center justify-between border-b border-[#B8A98F]/20 pb-3">
            <div>
              <span className="text-[10px] font-mono text-[#E5C690] font-bold uppercase">LEDGER VISUALIZER</span>
              <h3 className="text-sm font-black tracking-tight font-display text-[#E5DAC9]">
                Revenue vs Direct Cost vs Net Margin
              </h3>
            </div>
            <span className="text-xs font-mono text-[#B8A98F]">
              Margin: <strong className="text-[#E5C690]">{financial.profitMarginPercent}%</strong>
            </span>
          </div>

          {/* Pure SVG Bar Visualizer in 4-Color Luxury Palette */}
          <div className="space-y-3 pt-2">
            {/* 1. Gross Revenue */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#E5DAC9]">Gross Revenue</span>
                <span className="font-bold text-[#E5C690]">₹{financial.totalRevenue.toLocaleString('en-IN')} (100%)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-[#E5DAC9]/10 overflow-hidden">
                <div className="h-full rounded-full bg-[#E5C690]" style={{ width: '100%' }} />
              </div>
            </div>

            {/* 2. Cost of Goods Sold */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#E5DAC9]">Cost of Blanks & Printing (COGS)</span>
                <span className="font-bold text-[#B8A98F]">
                  ₹{financial.totalCogs.toLocaleString('en-IN')}{' '}
                  ({financial.totalRevenue > 0 ? ((financial.totalCogs / financial.totalRevenue) * 100).toFixed(1) : 0}%)
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-[#E5DAC9]/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#B8A98F]"
                  style={{
                    width: `${financial.totalRevenue > 0 ? Math.min(100, (financial.totalCogs / financial.totalRevenue) * 100) : 0}%`,
                  }}
                />
              </div>
            </div>

            {/* 3. Operating Overhead */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#E5DAC9]">Operating Overhead & Utilities</span>
                <span className="font-bold text-[#B8A98F]">
                  ₹{financial.totalOperatingExpenses.toLocaleString('en-IN')}{' '}
                  ({financial.totalRevenue > 0 ? ((financial.totalOperatingExpenses / financial.totalRevenue) * 100).toFixed(1) : 0}%)
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-[#E5DAC9]/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#B8A98F]/60"
                  style={{
                    width: `${financial.totalRevenue > 0 ? Math.min(100, (financial.totalOperatingExpenses / financial.totalRevenue) * 100) : 0}%`,
                  }}
                />
              </div>
            </div>

            {/* 4. Net Profit Realized */}
            <div className="space-y-1 pt-1 border-t border-[#B8A98F]/20">
              <div className="flex justify-between text-xs font-mono">
                <span className="font-bold text-[#E5C690]">Realized Net Profit</span>
                <span className="font-black text-[#E5C690]">
                  ₹{financial.netProfit.toLocaleString('en-IN')} ({financial.profitMarginPercent}%)
                </span>
              </div>
              <div className="w-full h-3.5 rounded-full bg-[#E5DAC9]/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#E5C690]"
                  style={{
                    width: `${Math.max(0, Math.min(100, Number(financial.profitMarginPercent)))}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Quick Actions & Recent Channel Summary */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-[#183630] border border-[#B8A98F]/30 space-y-4 text-[#E5DAC9]">
          <div className="flex items-center justify-between border-b border-[#B8A98F]/20 pb-3">
            <div>
              <span className="text-[10px] font-mono text-[#E5C690] font-bold uppercase">OPERATIONS DISPATCH</span>
              <h3 className="text-sm font-black tracking-tight font-display text-[#E5DAC9]">
                Quick Business Actions
              </h3>
            </div>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => navigate?.('manual-order')}
              className="w-full p-3 rounded-xl bg-[#E5C690] hover:bg-[#d9b87c] text-[#183630] text-xs font-black tracking-wider uppercase transition-all flex items-center justify-between cursor-pointer shadow-xs"
            >
              <span>+ Create Manual / WhatsApp Order</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => navigate?.('stock')}
              className="w-full p-3 rounded-xl bg-[#E5DAC9]/10 hover:bg-[#E5DAC9]/20 text-[#E5DAC9] border border-[#B8A98F]/40 text-xs font-bold transition-all flex items-center justify-between cursor-pointer"
            >
              <span>[ + Log Manual Stock Entry ]</span>
              <Package className="w-4 h-4 text-[#E5C690]" />
            </button>

            <button
              type="button"
              onClick={() => navigate?.('expenses')}
              className="w-full p-3 rounded-xl bg-[#E5DAC9]/10 hover:bg-[#E5DAC9]/20 text-[#E5DAC9] border border-[#B8A98F]/40 text-xs font-bold transition-all flex items-center justify-between cursor-pointer"
            >
              <span>[ + Add Operational Expense ]</span>
              <DollarSign className="w-4 h-4 text-[#E5C690]" />
            </button>

            <button
              type="button"
              onClick={() => navigate?.('cms')}
              className="w-full p-3 rounded-xl bg-[#E5DAC9]/10 hover:bg-[#E5DAC9]/20 text-[#E5DAC9] border border-[#B8A98F]/40 text-xs font-bold transition-all flex items-center justify-between cursor-pointer"
            >
              <span>[ Edit Homepage Content & Banners ]</span>
              <Layers className="w-4 h-4 text-[#E5C690]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardTab;
