import React, { useState, useMemo } from 'react';
import {
  FileText,
  Download,
  Printer,
  Calendar,
  BarChart2,
  Package,
  DollarSign,
  TrendingUp,
  Layers,
  ShoppingBag,
  Clock,
  ArrowDownRight,
  Filter,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export function AdminReportsTab() {
  const {
    adminOrders = [],
    inventory = [],
    stockMovements = [],
    expenses = [],
    customers = [],
  } = useStore();

  const [activeReport, setActiveReport] = useState('sales'); // 'sales' | 'inventory' | 'pnl' | 'movement' | 'fulfillment' | 'expenses'
  const [timeRange, setTimeRange] = useState('ALL'); // 'TODAY' | 'WEEK' | 'MONTH' | 'YEAR' | 'ALL'

  // Time filter helper
  const isWithinTimeRange = (dateStr) => {
    if (timeRange === 'ALL' || !dateStr) return true;
    const now = new Date();
    const itemDate = new Date(dateStr);
    if (timeRange === 'TODAY') {
      return dateStr.startsWith(now.toISOString().split('T')[0]);
    }
    if (timeRange === 'WEEK') {
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      return itemDate >= weekAgo;
    }
    if (timeRange === 'MONTH') {
      const monthAgo = new Date();
      monthAgo.setMonth(now.getMonth() - 1);
      return itemDate >= monthAgo;
    }
    if (timeRange === 'YEAR') {
      const yearAgo = new Date();
      yearAgo.setFullYear(now.getFullYear() - 1);
      return itemDate >= yearAgo;
    }
    return true;
  };

  // Filtered Datasets
  const filteredOrders = useMemo(
    () => adminOrders.filter((o) => isWithinTimeRange(o.date || o.createdAt)),
    [adminOrders, timeRange]
  );
  const filteredExpenses = useMemo(
    () => expenses.filter((e) => isWithinTimeRange(e.date)),
    [expenses, timeRange]
  );
  const filteredMovements = useMemo(
    () => stockMovements.filter((m) => isWithinTimeRange(m.timestamp)),
    [stockMovements, timeRange]
  );

  // 1. Sales Report Calculations
  const salesReportData = useMemo(() => {
    const totalOrders = filteredOrders.length;
    const grossSales = filteredOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    const totalDiscounts = filteredOrders.reduce((sum, o) => sum + (Number(o.discount) || 0), 0);
    const totalShipping = filteredOrders.reduce((sum, o) => sum + (Number(o.shipping) || 0), 0);
    const totalTax = filteredOrders.reduce((sum, o) => sum + (Number(o.tax) || 0), 0);
    const totalCost = filteredOrders.reduce((sum, o) => sum + (Number(o.totalCost) || (Number(o.total) || 0) * 0.45), 0);
    const totalProfit = grossSales - totalCost;
    const aov = totalOrders > 0 ? grossSales / totalOrders : 0;
    const margin = grossSales > 0 ? (totalProfit / grossSales) * 100 : 0;

    return {
      totalOrders,
      grossSales: Math.round(grossSales),
      totalDiscounts: Math.round(totalDiscounts),
      totalShipping: Math.round(totalShipping),
      totalTax: Math.round(totalTax),
      totalCost: Math.round(totalCost),
      totalProfit: Math.round(totalProfit),
      aov: Math.round(aov),
      margin: Math.round(margin * 10) / 10,
    };
  }, [filteredOrders]);

  // 2. Inventory Report Calculations
  const inventoryReportData = useMemo(() => {
    const totalSKUs = inventory.length;
    const totalUnits = inventory.reduce((sum, i) => sum + (Number(i.currentStock) || 0), 0);
    const outOfStockSKUs = inventory.filter((i) => (Number(i.currentStock) || 0) <= 0).length;
    const lowStockSKUs = inventory.filter(
      (i) => (Number(i.currentStock) || 0) > 0 && (Number(i.currentStock) || 0) <= (Number(i.minStock) || 5)
    ).length;
    const assetCostValue = inventory.reduce(
      (sum, i) => sum + (Number(i.currentStock) || 0) * (Number(i.unitCost) || 0),
      0
    );

    return {
      totalSKUs,
      totalUnits,
      outOfStockSKUs,
      lowStockSKUs,
      assetCostValue: Math.round(assetCostValue),
    };
  }, [inventory]);

  // 3. P&L Report Calculations
  const pnlReportData = useMemo(() => {
    const revenue = salesReportData.grossSales;
    const cogs = salesReportData.totalCost;
    const grossProfit = revenue - cogs;
    const grossMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0;
    const totalExpenses = filteredExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
    const netProfit = grossProfit - totalExpenses;
    const netMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0;

    return {
      revenue,
      cogs,
      grossProfit,
      grossMargin: Math.round(grossMargin * 10) / 10,
      totalExpenses,
      netProfit,
      netMargin: Math.round(netMargin * 10) / 10,
    };
  }, [salesReportData, filteredExpenses]);

  // 4. Fulfillment Report Calculations
  const fulfillmentReportData = useMemo(() => {
    const statusCounts = {};
    filteredOrders.forEach((o) => {
      const st = o.orderStatus || 'CONFIRMED';
      statusCounts[st] = (statusCounts[st] || 0) + 1;
    });
    return statusCounts;
  }, [filteredOrders]);

  // Export CSV based on active report
  const handleExportCSV = () => {
    let rows = [];
    let filename = `ThePrintHub_Report_${activeReport}_${timeRange}.csv`;

    if (activeReport === 'sales') {
      rows = [
        ['Sales Performance Report', `Timeframe: ${timeRange}`],
        ['Gross Sales (INR)', salesReportData.grossSales],
        ['Discounts (INR)', salesReportData.totalDiscounts],
        ['Delivery / Shipping Billed (INR)', salesReportData.totalShipping],
        ['GST Tax Collected (INR)', salesReportData.totalTax],
        ['Direct Apparel COGS (INR)', salesReportData.totalCost],
        ['Gross Operational Profit (INR)', salesReportData.totalProfit],
        ['Gross Margin (%)', `${salesReportData.margin}%`],
        ['Total Orders Processed', salesReportData.totalOrders],
        ['Average Order Value (INR)', salesReportData.aov],
      ];
    } else if (activeReport === 'inventory') {
      rows = [
        ['SKU Code', 'Product Title', 'Size', 'Color', 'Current Stock', 'Min Alert Stock', 'Unit Cost (INR)', 'Total Value (INR)'],
        ...inventory.map((i) => [
          i.sku,
          `"${i.productName}"`,
          i.size,
          i.color,
          i.currentStock,
          i.minStock,
          i.unitCost,
          (i.currentStock || 0) * (i.unitCost || 0),
        ]),
      ];
    } else if (activeReport === 'pnl') {
      rows = [
        ['P&L Financial Summary', `Timeframe: ${timeRange}`],
        ['Gross Revenue (INR)', pnlReportData.revenue],
        ['Less: Direct COGS (INR)', pnlReportData.cogs],
        ['Gross Profit (INR)', pnlReportData.grossProfit],
        ['Gross Margin (%)', `${pnlReportData.grossMargin}%`],
        ['Less: Operational Overhead (INR)', pnlReportData.totalExpenses],
        ['Net Retained Profit (INR)', pnlReportData.netProfit],
        ['Net Profit Margin (%)', `${pnlReportData.netMargin}%`],
      ];
    } else if (activeReport === 'movement') {
      rows = [
        ['Timestamp', 'SKU', 'Product', 'Type', 'Quantity', 'Reason', 'Admin User', 'Supplier'],
        ...filteredMovements.map((m) => [
          m.timestamp,
          m.sku,
          `"${m.productName}"`,
          m.type,
          m.quantity,
          `"${m.reason || ''}"`,
          m.adminUser || 'Admin',
          `"${m.supplier || ''}"`,
        ]),
      ];
    } else if (activeReport === 'expenses') {
      rows = [
        ['Date', 'Title', 'Category', 'Amount (INR)', 'Vendor', 'Payment Method', 'Invoice'],
        ...filteredExpenses.map((e) => [
          e.date,
          `"${e.title}"`,
          e.category,
          e.amount,
          `"${e.vendor || ''}"`,
          e.paymentMethod,
          `"${e.invoiceNumber || ''}"`,
        ]),
      ];
    }

    const csvContent = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 font-mono text-xs text-[#183630]">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-[#E5C690] border border-[#B8A98F] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#183630] uppercase font-display tracking-tight">
              Executive Analytics & Audited Reports
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#183630] text-[#E5DAC9] text-[10px] font-bold">
              [ EXPORTABLE BUSINESS INTELLIGENCE ]
            </span>
          </div>
          <p className="text-[#183630]/75 text-xs font-sans mt-1">
            Generate formal CSV export packages and print-ready ledgers across Sales, Inventory Valuation, P&L Statements, Stock Audit Movements, and Operational Expenses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="px-3 py-2 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] hover:border-[#183630] text-[#183630] font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>[ PRINT REPORT ]</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-xl bg-[#183630] text-[#E5C690] hover:bg-[#183630]/90 font-bold flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>[ EXPORT CSV ]</span>
          </button>
        </div>
      </div>

      {/* Navigation & Period Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-[#E5DAC9] border border-[#B8A98F]">
        {/* Report Types Tabs with [ Bracket ] treatment */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto no-scrollbar">
          {[
            { id: 'sales', label: 'SALES' },
            { id: 'inventory', label: 'INVENTORY VALUATION' },
            { id: 'pnl', label: 'P&L STATEMENT' },
            { id: 'movement', label: 'STOCK MOVEMENTS' },
            { id: 'fulfillment', label: 'FULFILLMENT' },
            { id: 'expenses', label: 'EXPENSES' },
          ].map((rep) => {
            const isSelected = activeReport === rep.id;
            return (
              <button
                key={rep.id}
                type="button"
                onClick={() => setActiveReport(rep.id)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold tracking-wider shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? 'bracket-selected font-black text-[#183630]'
                    : 'bg-[#E5DAC9] border border-[#B8A98F] text-[#183630]/80 hover:border-[#183630]'
                }`}
              >
                {isSelected ? `[ ${rep.label} ]` : rep.label}
              </button>
            );
          })}
        </div>

        {/* Time Period Filter */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] text-[#183630]/70 font-bold uppercase">Timeframe:</span>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#E5DAC9] border border-[#B8A98F] text-[#183630] font-bold text-xs"
          >
            <option value="ALL">All Time Recorded</option>
            <option value="TODAY">Today's Shift</option>
            <option value="WEEK">Last 7 Days</option>
            <option value="MONTH">This Month</option>
            <option value="YEAR">This Year (YTD)</option>
          </select>
        </div>
      </div>

      {/* REPORT 1: SALES PERFORMANCE */}
      {activeReport === 'sales' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-[#E5DAC9] border border-[#B8A98F] shadow-sm space-y-1">
              <span className="text-[10px] text-[#183630]/75 uppercase font-bold">GROSS SALES</span>
              <div className="text-2xl font-black text-[#183630]">
                ₹{salesReportData.grossSales.toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-[#183630]/60 block">{salesReportData.totalOrders} total orders</span>
            </div>

            <div className="p-5 rounded-3xl bg-[#E5DAC9] border border-[#B8A98F] shadow-sm space-y-1">
              <span className="text-[10px] text-[#183630]/75 uppercase font-bold">DIRECT COGS</span>
              <div className="text-2xl font-black text-[#183630]">
                ₹{salesReportData.totalCost.toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-[#183630]/60 block">Materials & blank garments</span>
            </div>

            <div className="p-5 rounded-3xl bg-[#E5DAC9] border border-[#B8A98F] shadow-sm space-y-1">
              <span className="text-[10px] text-[#183630]/75 uppercase font-bold">GROSS PROFIT</span>
              <div className="text-2xl font-black text-[#183630]">
                ₹{salesReportData.totalProfit.toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-[#183630]/60 block">Gross Margin: {salesReportData.margin}%</span>
            </div>

            <div className="p-5 rounded-3xl bg-[#E5C690] border border-[#B8A98F] shadow-sm space-y-1">
              <span className="text-[10px] text-[#183630]/75 uppercase font-bold">AVG ORDER VALUE</span>
              <div className="text-2xl font-black text-[#183630]">
                ₹{salesReportData.aov.toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-[#183630]/80 block">Discounts: ₹{salesReportData.totalDiscounts.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Orders Log Sample */}
          <div className="rounded-3xl bg-[#E5DAC9] border border-[#B8A98F] overflow-hidden shadow-sm">
            <div className="p-4 bg-[#183630] text-[#E5DAC9] font-bold uppercase text-xs flex justify-between">
              <span>Orders Included In This Period ({filteredOrders.length})</span>
              <span>Sorted Chronologically</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#183630]/10 text-[#183630] text-[10px] uppercase font-bold border-b border-[#B8A98F]/30">
                  <tr>
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Cost (₹)</th>
                    <th className="py-3 px-4 text-right">Total (₹)</th>
                    <th className="py-3 px-4 text-right">Profit (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#B8A98F]/30">
                  {filteredOrders.map((o) => {
                    const cogs = Number(o.totalCost) || (Number(o.total) || 0) * 0.45;
                    const profit = (Number(o.total) || 0) - cogs;
                    return (
                      <tr key={o.id} className="hover:bg-[#183630]/5 transition-colors">
                        <td className="py-3 px-4 font-bold">{o.id}</td>
                        <td className="py-3 px-4 text-[#183630]/80">{o.date || o.createdAt}</td>
                        <td className="py-3 px-4">{o.customer?.name || 'Walk-in'}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] bg-[#E5C690] text-[#183630] font-bold">
                            {o.orderType || 'ONLINE'}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold">{o.orderStatus}</td>
                        <td className="py-3 px-4 text-right font-mono">₹{Math.round(cogs).toLocaleString('en-IN')}</td>
                        <td className="py-3 px-4 text-right font-bold font-mono">₹{(Number(o.total) || 0).toLocaleString('en-IN')}</td>
                        <td className="py-3 px-4 text-right font-black font-mono text-emerald-900">₹{Math.round(profit).toLocaleString('en-IN')}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* REPORT 2: INVENTORY & STOCK VALUATION */}
      {activeReport === 'inventory' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-[#E5DAC9] border border-[#B8A98F] shadow-sm space-y-1">
              <span className="text-[10px] text-[#183630]/75 uppercase font-bold">TRACKED SKUS</span>
              <div className="text-2xl font-black text-[#183630]">{inventoryReportData.totalSKUs}</div>
              <span className="text-[10px] text-[#183630]/60 block">Distinct sizes & color variants</span>
            </div>

            <div className="p-5 rounded-3xl bg-[#E5DAC9] border border-[#B8A98F] shadow-sm space-y-1">
              <span className="text-[10px] text-[#183630]/75 uppercase font-bold">TOTAL PHYSICAL PIECES</span>
              <div className="text-2xl font-black text-[#183630]">{inventoryReportData.totalUnits}</div>
              <span className="text-[10px] text-[#183630]/60 block">Units on floor</span>
            </div>

            <div className="p-5 rounded-3xl bg-[#E5DAC9] border border-[#B8A98F] shadow-sm space-y-1">
              <span className="text-[10px] text-[#183630]/75 uppercase font-bold">LOW / DEPLETED SKUS</span>
              <div className="text-2xl font-black text-rose-900">
                {inventoryReportData.lowStockSKUs + inventoryReportData.outOfStockSKUs}
              </div>
              <span className="text-[10px] text-[#183630]/60 block">{inventoryReportData.outOfStockSKUs} completely zeroed</span>
            </div>

            <div className="p-5 rounded-3xl bg-[#E5C690] border border-[#B8A98F] shadow-sm space-y-1">
              <span className="text-[10px] text-[#183630]/75 uppercase font-bold">TOTAL ASSET VALUATION</span>
              <div className="text-2xl font-black text-[#183630]">
                ₹{inventoryReportData.assetCostValue.toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-[#183630]/80 block">At landed supplier cost</span>
            </div>
          </div>

          {/* Full Inventory SKU Audit Table */}
          <div className="rounded-3xl bg-[#E5DAC9] border border-[#B8A98F] overflow-hidden shadow-sm">
            <div className="p-4 bg-[#183630] text-[#E5DAC9] font-bold uppercase text-xs">
              Inventory Ledger Breakdown ({inventory.length} SKUs)
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#183630]/10 text-[#183630] text-[10px] uppercase font-bold border-b border-[#B8A98F]/30">
                  <tr>
                    <th className="py-3 px-4">SKU</th>
                    <th className="py-3 px-4">Product Name</th>
                    <th className="py-3 px-4">Size</th>
                    <th className="py-3 px-4">Color</th>
                    <th className="py-3 px-4 text-center">In Stock</th>
                    <th className="py-3 px-4 text-center">Min Alert</th>
                    <th className="py-3 px-4 text-right">Cost (₹)</th>
                    <th className="py-3 px-4 text-right">Asset Value (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#B8A98F]/30">
                  {inventory.map((item) => (
                    <tr key={item.id} className="hover:bg-[#183630]/5 transition-colors">
                      <td className="py-3 px-4 font-bold">{item.sku}</td>
                      <td className="py-3 px-4">{item.productName}</td>
                      <td className="py-3 px-4 font-bold">{item.size}</td>
                      <td className="py-3 px-4">{item.color}</td>
                      <td className="py-3 px-4 text-center font-bold">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] ${
                            (item.currentStock || 0) <= 0
                              ? 'bg-rose-800 text-white'
                              : (item.currentStock || 0) <= (item.minStock || 5)
                              ? 'bg-[#E5C690] text-[#183630]'
                              : 'bg-[#183630] text-[#E5DAC9]'
                          }`}
                        >
                          {item.currentStock}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center text-[#183630]/70">{item.minStock}</td>
                      <td className="py-3 px-4 text-right font-mono">₹{item.unitCost}</td>
                      <td className="py-3 px-4 text-right font-bold font-mono">
                        ₹{((item.currentStock || 0) * (item.unitCost || 0)).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* REPORT 3: PROFIT & LOSS STATEMENT */}
      {activeReport === 'pnl' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-[#E5DAC9] border border-[#B8A98F] shadow-sm space-y-4 max-w-3xl mx-auto">
            <div className="text-center pb-3 border-b border-[#B8A98F]/40 space-y-1">
              <h3 className="text-sm font-bold text-[#183630] uppercase font-display">
                Audited Atelier Income Statement
              </h3>
              <p className="text-[10px] text-[#183630]/70">Selected Timeframe: {timeRange}</p>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between py-2 border-b border-[#B8A98F]/20 font-bold">
                <span>Gross Invoiced Sales:</span>
                <span>₹{pnlReportData.revenue.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between py-2 border-b border-[#B8A98F]/20 text-[#183630]/80">
                <span>Direct Material COGS (Blanks & Inks):</span>
                <span>- ₹{pnlReportData.cogs.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between py-2.5 bg-[#183630] text-[#E5DAC9] px-3 rounded-xl font-bold">
                <span>Gross Operational Profit:</span>
                <span className="text-[#E5C690]">
                  ₹{pnlReportData.grossProfit.toLocaleString('en-IN')} ({pnlReportData.grossMargin}%)
                </span>
              </div>

              <div className="flex justify-between py-2 border-b border-[#B8A98F]/20 text-[#183630]/80">
                <span>Operational Overhead & Studio Expenses:</span>
                <span>- ₹{pnlReportData.totalExpenses.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between py-3 bg-[#E5C690] text-[#183630] px-4 rounded-2xl font-black text-sm border border-[#B8A98F]">
                <span>NET OPERATING PROFIT / (LOSS):</span>
                <span>
                  ₹{pnlReportData.netProfit.toLocaleString('en-IN')} ({pnlReportData.netMargin}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REPORT 4: STOCK MOVEMENTS AUDIT */}
      {activeReport === 'movement' && (
        <div className="rounded-3xl bg-[#E5DAC9] border border-[#B8A98F] overflow-hidden shadow-sm">
          <div className="p-4 bg-[#183630] text-[#E5DAC9] font-bold uppercase text-xs flex justify-between">
            <span>Physical Stock Movement Log ({filteredMovements.length})</span>
            <span>Audited Records</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#183630]/10 text-[#183630] text-[10px] uppercase font-bold border-b border-[#B8A98F]/30">
                <tr>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4">Movement Type</th>
                  <th className="py-3 px-4 text-center">Quantity Delta</th>
                  <th className="py-3 px-4">Supplier / Reason</th>
                  <th className="py-3 px-4">Logged By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#B8A98F]/30">
                {filteredMovements.map((m) => (
                  <tr key={m.id} className="hover:bg-[#183630]/5 transition-colors">
                    <td className="py-3 px-4 text-[#183630]/80 whitespace-nowrap">
                      {new Date(m.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-bold">{m.sku}</td>
                    <td className="py-3 px-4">{m.productName}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E5C690] text-[#183630]">
                        {m.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-bold font-mono">
                      {m.type === 'ADD' ? `+${m.quantity}` : `-${m.quantity}`}
                    </td>
                    <td className="py-3 px-4 text-[#183630]/80">{m.supplier || m.reason || 'Manual Adjustment'}</td>
                    <td className="py-3 px-4 font-bold">{m.adminUser || 'Admin'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORT 5: FULFILLMENT STATUS */}
      {activeReport === 'fulfillment' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Object.entries(fulfillmentReportData).map(([status, count]) => (
              <div key={status} className="p-5 rounded-3xl bg-[#E5DAC9] border border-[#B8A98F] shadow-sm space-y-1">
                <span className="text-[10px] text-[#183630]/75 uppercase font-bold">{status}</span>
                <div className="text-2xl font-black text-[#183630]">{count}</div>
                <span className="text-[10px] text-[#183630]/60 block">Orders in stage</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* REPORT 6: EXPENSES LEDGER */}
      {activeReport === 'expenses' && (
        <div className="rounded-3xl bg-[#E5DAC9] border border-[#B8A98F] overflow-hidden shadow-sm">
          <div className="p-4 bg-[#183630] text-[#E5DAC9] font-bold uppercase text-xs flex justify-between">
            <span>Expenses Incurred ({filteredExpenses.length})</span>
            <span>Total: ₹{filteredExpenses.reduce((s, e) => s + (Number(e.amount) || 0), 0).toLocaleString('en-IN')}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#183630]/10 text-[#183630] text-[10px] uppercase font-bold border-b border-[#B8A98F]/30">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Expense Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Vendor</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#B8A98F]/30">
                {filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-[#183630]/5 transition-colors">
                    <td className="py-3 px-4">{exp.date}</td>
                    <td className="py-3 px-4 font-bold">{exp.title}</td>
                    <td className="py-3 px-4">{exp.category}</td>
                    <td className="py-3 px-4">{exp.vendor || '—'}</td>
                    <td className="py-3 px-4">{exp.paymentMethod || 'UPI'}</td>
                    <td className="py-3 px-4 text-right font-bold">₹{(Number(exp.amount) || 0).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
