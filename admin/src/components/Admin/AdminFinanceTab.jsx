import React, { useState, useMemo } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Printer,
  PieChart,
  BarChart3,
  Percent,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export function AdminFinanceTab() {
  const {
    adminOrders = [],
    expenses = [],
    inventory = [],
  } = useStore();

  const [dateRange, setDateRange] = useState('ALL'); // 'TODAY' | 'WEEK' | 'MONTH' | 'QUARTER' | 'YEAR' | 'ALL'
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'ONLINE' | 'MANUAL'

  // Filter Orders & Expenses by Date Range
  const filteredData = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    const filterDate = (itemDateStr) => {
      if (dateRange === 'ALL' || !itemDateStr) return true;
      const d = new Date(itemDateStr);
      if (dateRange === 'TODAY') {
        return itemDateStr.startsWith(todayStr);
      }
      if (dateRange === 'WEEK') {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        return d >= weekAgo;
      }
      if (dateRange === 'MONTH') {
        const monthAgo = new Date();
        monthAgo.setMonth(now.getMonth() - 1);
        return d >= monthAgo;
      }
      if (dateRange === 'QUARTER') {
        const quarterAgo = new Date();
        quarterAgo.setMonth(now.getMonth() - 3);
        return d >= quarterAgo;
      }
      if (dateRange === 'YEAR') {
        const yearAgo = new Date();
        yearAgo.setFullYear(now.getFullYear() - 1);
        return d >= yearAgo;
      }
      return true;
    };

    const orders = adminOrders.filter((ord) => {
      const matchDate = filterDate(ord.date || ord.createdAt);
      if (filterType === 'ONLINE' && ord.orderType === 'MANUAL') return false;
      if (filterType === 'MANUAL' && ord.orderType !== 'MANUAL') return false;
      return matchDate;
    });

    const exps = expenses.filter((e) => filterDate(e.date));

    return { orders, expenses: exps };
  }, [adminOrders, expenses, dateRange, filterType]);

  // Financial Metrics Calculation
  const financials = useMemo(() => {
    const orders = filteredData.orders;
    const exps = filteredData.expenses;

    // 1. Gross Revenue (Total Customer & Manual Invoiced Sales)
    const grossRevenue = orders.reduce((sum, ord) => sum + (Number(ord.total) || 0), 0);

    // 2. Direct Product COGS (Blanks + Manufacturing)
    const directCogs = orders.reduce((sum, ord) => {
      const ordCost = Number(ord.totalCost) || (Number(ord.total) || 0) * 0.45;
      return sum + ordCost;
    }, 0);

    // 3. Shipping & Logistics Collections vs Costs
    const shippingCollected = orders.reduce((sum, ord) => sum + (Number(ord.shipping) || 0), 0);

    // 4. Discounts Allowed
    const discountsGiven = orders.reduce((sum, ord) => sum + (Number(ord.discount) || 0), 0);

    // 5. Taxes Collected (GST)
    const taxesCollected = orders.reduce((sum, ord) => sum + (Number(ord.tax) || 0), 0);

    // 6. Direct Gross Profit = Gross Revenue - Direct COGS
    const grossProfit = grossRevenue - directCogs;
    const grossMargin = grossRevenue > 0 ? (grossProfit / grossRevenue) * 100 : 0;

    // 7. Operational Overhead (Sum of logged expenses)
    const overheadExpenses = exps.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

    // Overhead category breakdown
    const overheadByCategory = {};
    exps.forEach((e) => {
      overheadByCategory[e.category] = (overheadByCategory[e.category] || 0) + (Number(e.amount) || 0);
    });

    // 8. Net Profit = Gross Profit - Overhead Expenses
    const netProfit = grossProfit - overheadExpenses;
    const netMargin = grossRevenue > 0 ? (netProfit / grossRevenue) * 100 : 0;

    // 9. Total Orders & Average Order Value (AOV)
    const totalOrdersCount = orders.length;
    const aov = totalOrdersCount > 0 ? grossRevenue / totalOrdersCount : 0;

    return {
      grossRevenue: Math.round(grossRevenue),
      directCogs: Math.round(directCogs),
      discountsGiven: Math.round(discountsGiven),
      shippingCollected: Math.round(shippingCollected),
      taxesCollected: Math.round(taxesCollected),
      grossProfit: Math.round(grossProfit),
      grossMargin: Math.round(grossMargin * 10) / 10,
      overheadExpenses: Math.round(overheadExpenses),
      overheadByCategory,
      netProfit: Math.round(netProfit),
      netMargin: Math.round(netMargin * 10) / 10,
      totalOrdersCount,
      aov: Math.round(aov),
      isProfit: netProfit >= 0,
    };
  }, [filteredData]);

  // Export Financial Summary CSV
  const handleExportStatement = () => {
    const csvContent = [
      ['The PrintHub Atelier - Official Financial & P&L Statement'],
      ['Generated On', new Date().toLocaleString()],
      ['Timeframe Filter', dateRange],
      ['Order Filter', filterType],
      [''],
      ['Metric', 'Amount (INR)'],
      ['Gross Invoiced Revenue', financials.grossRevenue],
      ['Discounts Granted', financials.discountsGiven],
      ['Direct Product COGS (Blanks/Printing)', financials.directCogs],
      ['Gross Operational Profit', financials.grossProfit],
      ['Gross Profit Margin (%)', `${financials.grossMargin}%`],
      ['Total Overhead & Operational Expenses', financials.overheadExpenses],
      ['Net Realized Profit / (Loss)', financials.netProfit],
      ['Net Margin (%)', `${financials.netMargin}%`],
      ['Total Orders Processed', financials.totalOrdersCount],
      ['Average Order Value (AOV)', financials.aov],
      [''],
      ['Overhead Breakdown by Category'],
      ...Object.entries(financials.overheadByCategory).map(([cat, amt]) => [cat, amt]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ThePrintHub_Financial_Statement_${dateRange}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 font-mono text-xs text-[#183630]">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-[#E5C690] border border-[#B8A98F] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#183630] uppercase font-display tracking-tight">
              Financial Performance & Net P&L Engine
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#183630] text-[#E5DAC9] text-[10px] font-bold">
              [ REAL-TIME ATELIER VALUATION ]
            </span>
          </div>
          <p className="text-[#183630]/75 text-xs font-sans mt-1">
            Automated Profit & Loss calculation synthesizing order revenues, direct apparel COGS, printing inks, logistics, and facility overhead expenses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="px-3 py-2 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] hover:border-[#183630] text-[#183630] font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>[ PRINT STATEMENT ]</span>
          </button>

          <button
            type="button"
            onClick={handleExportStatement}
            className="px-4 py-2 rounded-xl bg-[#183630] text-[#E5C690] hover:bg-[#183630]/90 font-bold flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>[ EXPORT P&L CSV ]</span>
          </button>
        </div>
      </div>

      {/* Date & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-[#E5DAC9] border border-[#B8A98F]">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto no-scrollbar">
          {[
            { id: 'TODAY', label: 'TODAY' },
            { id: 'WEEK', label: 'LAST 7 DAYS' },
            { id: 'MONTH', label: 'THIS MONTH' },
            { id: 'QUARTER', label: 'QUARTER' },
            { id: 'YEAR', label: 'YEAR' },
            { id: 'ALL', label: 'ALL TIME' },
          ].map((rng) => {
            const isSelected = dateRange === rng.id;
            return (
              <button
                key={rng.id}
                type="button"
                onClick={() => setDateRange(rng.id)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold tracking-wider shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? 'bracket-selected font-black text-[#183630]'
                    : 'bg-[#E5DAC9] border border-[#B8A98F] text-[#183630]/80 hover:border-[#183630]'
                }`}
              >
                {isSelected ? `[ ${rng.label} ]` : rng.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] text-[#183630]/70 font-bold uppercase">Source:</span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-[#183630] font-bold text-xs"
          >
            <option value="ALL">All Orders (Online + POS)</option>
            <option value="ONLINE">Customer Web Storefront Only</option>
            <option value="MANUAL">Manual POS / WhatsApp Only</option>
          </select>
        </div>
      </div>

      {/* Top 4 Primary Financial Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Revenue */}
        <div className="p-5 rounded-3xl bg-[#E5DAC9] border border-[#B8A98F] shadow-sm space-y-1">
          <div className="flex items-center justify-between text-[#183630]/75 text-[10px] font-bold uppercase">
            <span>GROSS REVENUE</span>
            <DollarSign className="w-4 h-4 text-[#183630]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#183630]">
            ₹{financials.grossRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-[#183630]/70">
            {financials.totalOrdersCount} orders • AOV: ₹{financials.aov.toLocaleString('en-IN')}
          </div>
        </div>

        {/* Direct Product COGS */}
        <div className="p-5 rounded-3xl bg-[#E5DAC9] border border-[#B8A98F] shadow-sm space-y-1">
          <div className="flex items-center justify-between text-[#183630]/75 text-[10px] font-bold uppercase">
            <span>DIRECT COGS</span>
            <Layers className="w-4 h-4 text-[#183630]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#183630]">
            ₹{financials.directCogs.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-[#183630]/70">
            Blanks, garments & print consumables
          </div>
        </div>

        {/* Total Overhead Expenses */}
        <div className="p-5 rounded-3xl bg-[#E5DAC9] border border-[#B8A98F] shadow-sm space-y-1">
          <div className="flex items-center justify-between text-[#183630]/75 text-[10px] font-bold uppercase">
            <span>OVERHEAD EXPENSES</span>
            <ArrowDownRight className="w-4 h-4 text-red-800" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#183630]">
            ₹{financials.overheadExpenses.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-[#183630]/70">
            Rent, utilities, packaging, marketing
          </div>
        </div>

        {/* Net Profit / Loss */}
        <div className="p-5 rounded-3xl bg-[#E5C690] border border-[#B8A98F] shadow-sm space-y-1">
          <div className="flex items-center justify-between text-[#183630]/85 text-[10px] font-bold uppercase">
            <span>NET ATELIER PROFIT</span>
            {financials.isProfit ? (
              <TrendingUp className="w-4 h-4 text-emerald-900" />
            ) : (
              <TrendingDown className="w-4 h-4 text-rose-900" />
            )}
          </div>
          <div
            className={`text-2xl sm:text-3xl font-black ${
              financials.isProfit ? 'text-[#183630]' : 'text-rose-900'
            }`}
          >
            ₹{financials.netProfit.toLocaleString('en-IN')}
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-[#183630]">
            <span>Margin: {financials.netMargin}%</span>
            <span>•</span>
            <span>Gross: {financials.grossMargin}%</span>
          </div>
        </div>
      </div>

      {/* Comprehensive P&L Statement Table & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* P&L Statement Formal Ledger (Left 2 Cols) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#E5DAC9] border border-[#B8A98F] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#B8A98F]/40 pb-3">
            <h3 className="text-xs font-bold text-[#183630] uppercase font-display">
              Formal Income Statement & Ledger
            </h3>
            <span className="text-[10px] text-[#183630]/70">
              Period: {dateRange} ({filteredData.orders.length} transactions)
            </span>
          </div>

          <div className="space-y-3">
            {/* 1. Operating Revenue */}
            <div className="space-y-1">
              <div className="flex justify-between font-bold text-[#183630] text-xs">
                <span>1. OPERATING SALES REVENUE</span>
                <span>₹{financials.grossRevenue.toLocaleString('en-IN')}</span>
              </div>
              <div className="pl-4 space-y-0.5 text-[#183630]/80 text-[11px]">
                <div className="flex justify-between">
                  <span>Gross Item Sales Value:</span>
                  <span>₹{(financials.grossRevenue + financials.discountsGiven).toLocaleString('en-IN')}</span>
                </div>
                {financials.discountsGiven > 0 && (
                  <div className="flex justify-between text-emerald-900 font-bold">
                    <span>Less: Promotional Discounts & Coupons:</span>
                    <span>- ₹{financials.discountsGiven.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery & Logistics Charges Billed:</span>
                  <span>₹{financials.shippingCollected.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* 2. Direct Cost of Goods Sold */}
            <div className="space-y-1 pt-2 border-t border-[#B8A98F]/30">
              <div className="flex justify-between font-bold text-[#183630] text-xs">
                <span>2. DIRECT COST OF GOODS SOLD (COGS)</span>
                <span>- ₹{financials.directCogs.toLocaleString('en-IN')}</span>
              </div>
              <div className="pl-4 space-y-0.5 text-[#183630]/80 text-[11px]">
                <div className="flex justify-between">
                  <span>Apparel Blanks & Substrates:</span>
                  <span>- ₹{Math.round(financials.directCogs * 0.75).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Direct DTF Inks, Powders & Consumables:</span>
                  <span>- ₹{Math.round(financials.directCogs * 0.25).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Subtotal: Gross Profit */}
            <div className="p-3 rounded-2xl bg-[#183630] text-[#E5DAC9] flex justify-between font-bold text-xs">
              <span>GROSS PROFIT (REVENUE - COGS)</span>
              <span className="text-[#E5C690] font-black">
                ₹{financials.grossProfit.toLocaleString('en-IN')} ({financials.grossMargin}%)
              </span>
            </div>

            {/* 3. Operating Overhead Expenses */}
            <div className="space-y-1 pt-2 border-t border-[#B8A98F]/30">
              <div className="flex justify-between font-bold text-[#183630] text-xs">
                <span>3. OPERATING OVERHEAD EXPENSES</span>
                <span>- ₹{financials.overheadExpenses.toLocaleString('en-IN')}</span>
              </div>
              <div className="pl-4 space-y-1 text-[#183630]/80 text-[11px]">
                {Object.entries(financials.overheadByCategory).length === 0 ? (
                  <div className="text-[10px] text-[#183630]/50 italic">No operational expenses logged for this timeframe.</div>
                ) : (
                  Object.entries(financials.overheadByCategory).map(([cat, amt]) => (
                    <div key={cat} className="flex justify-between">
                      <span>{cat}:</span>
                      <span>- ₹{amt.toLocaleString('en-IN')}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Net Bottom Line */}
            <div className="p-4 rounded-2xl bg-[#E5C690] border border-[#B8A98F] flex justify-between items-center font-black text-sm text-[#183630] mt-4 shadow-sm">
              <div className="space-y-0.5">
                <span className="block uppercase text-xs">NET ATELIER OPERATING PROFIT</span>
                <span className="block text-[10px] font-normal text-[#183630]/75">After all direct material COGS and studio expenses</span>
              </div>
              <div className="text-right">
                <span className={`text-base sm:text-lg block ${financials.isProfit ? 'text-[#183630]' : 'text-rose-900'}`}>
                  ₹{financials.netProfit.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-[#183630]/80">Net Margin: {financials.netMargin}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Allocation & Margin Diagnostics (Right 1 Col) */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-[#E5DAC9] border border-[#B8A98F] shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-[#B8A98F]/40 pb-3">
              <PieChart className="w-4 h-4 text-[#183630]" />
              <h3 className="text-xs font-bold text-[#183630] uppercase">
                Revenue Distribution Waterfall
              </h3>
            </div>

            <div className="space-y-3">
              {/* COGS Ratio */}
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-[#183630]/80">Cost of Goods Sold</span>
                  <span className="font-bold">
                    {financials.grossRevenue > 0 ? Math.round((financials.directCogs / financials.grossRevenue) * 100) : 0}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[#183630]/20 overflow-hidden">
                  <div
                    className="h-full bg-[#183630] rounded-full"
                    style={{
                      width: `${Math.min(100, financials.grossRevenue > 0 ? (financials.directCogs / financials.grossRevenue) * 100 : 0)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Overhead Ratio */}
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-[#183630]/80">Overhead Expenses</span>
                  <span className="font-bold">
                    {financials.grossRevenue > 0 ? Math.round((financials.overheadExpenses / financials.grossRevenue) * 100) : 0}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[#183630]/20 overflow-hidden">
                  <div
                    className="h-full bg-[#B8A98F] rounded-full"
                    style={{
                      width: `${Math.min(100, financials.grossRevenue > 0 ? (financials.overheadExpenses / financials.grossRevenue) * 100 : 0)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Net Profit Ratio */}
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-[#183630] font-bold">Net Retained Profit</span>
                  <span className="font-black text-emerald-900">
                    {financials.netMargin}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[#183630]/20 overflow-hidden">
                  <div
                    className="h-full bg-[#E5C690] rounded-full"
                    style={{
                      width: `${Math.max(0, Math.min(100, financials.netMargin))}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#E5C690] border border-[#B8A98F] shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-[#183630] uppercase">
              Financial Health Check
            </h3>
            <p className="text-[#183630]/80 text-[11px] leading-relaxed">
              Your gross margin stands at <span className="font-bold">{financials.grossMargin}%</span>. A healthy custom printing atelier typically aims for a 45-60% gross margin and 20-35% net margin after overhead.
            </p>
            <div className="p-3 rounded-2xl bg-[#183630] text-[#E5DAC9] text-[11px] space-y-1">
              <div className="flex justify-between">
                <span>Inventory Asset Value:</span>
                <span className="font-mono font-bold text-[#E5C690]">
                  ₹{inventory.reduce((sum, i) => sum + (i.currentStock || 0) * (i.unitCost || 0), 0).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-[10px] text-[#E5DAC9]/70">
                <span>Tracked Substrates:</span>
                <span>{inventory.length} SKUs</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
