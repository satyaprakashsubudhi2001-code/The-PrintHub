import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Package,
  CheckCircle2,
  DollarSign,
  Filter,
  RotateCcw,
  ShoppingBag,
  Layers,
  ArrowRight,
  PlusCircle,
  FileText
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

/**
 * AdminDashboardTab Component — Executive Business Overview & Financial KPIs
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
    cleanAllDemoData,
  } = useStore();

  const [dateFilter, setDateFilter] = useState('30DAYS'); // 'TODAY' | 'YESTERDAY' | '7DAYS' | '30DAYS' | 'THIS_MONTH' | 'LAST_MONTH' | 'ALL'
  const [cleanNotice, setCleanNotice] = useState('');

  const handleCleanDemoData = () => {
    if (typeof window !== 'undefined') {
      if (window.confirm('Are you sure you want to clean all existing demo data (orders, expenses, inventory, and design requests) to a fresh clean slate?')) {
        cleanAllDemoData();
        setCleanNotice('✓ All demo data has been cleaned successfully. Database is now at 0.');
        setTimeout(() => setCleanNotice(''), 4500);
      }
    } else {
      cleanAllDemoData();
    }
  };

  // Inventory KPIs
  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.status !== 'inactive').length;
  const outOfStockCount = inventory.filter((i) => i.currentStock === 0).length;
  const lowStockCount = inventory.filter((i) => i.currentStock > 0 && i.currentStock <= (i.minStockLevel || 10)).length;

  // Financial & Order KPIs
  const financial = useMemo(() => {
    return computeFinancialOverview(orders, expenses, dateFilter);
  }, [orders, expenses, dateFilter, computeFinancialOverview]);

  // Design Requests
  const totalDesignRequests = designRequests.length;

  const recentOrders = useMemo(() => {
    return [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  }, [orders]);

  const newOrdersCount = orders.filter(o => o.orderStatus === 'NEW').length;
  const pendingOrdersCount = orders.filter(o => o.orderStatus === 'CONFIRMED' || o.orderStatus === 'IN_PRODUCTION').length;
  const completedOrdersCount = orders.filter(o => o.orderStatus === 'SHIPPED' || o.orderStatus === 'DELIVERED').length;

  const cardStyle = "bg-[#FFFFFF] border border-[#123B34]/10 rounded-2xl shadow-[0_4px_20px_rgba(18,59,52,0.06)] p-5";

  return (
    <div className="space-y-6 select-none animate-in fade-in duration-200 text-[#18302B]">
      {cleanNotice && (
        <div className="p-3.5 px-4 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-mono font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{cleanNotice}</span>
        </div>
      )}

      {/* HEADER CONTROLS & DATE FILTER BAR */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#64746E] font-bold block mb-1">
            EXECUTIVE COMMAND OVERVIEW
          </span>
          <h2 className="text-2xl font-black tracking-tight font-display text-[#123B34]">
            The PrintHub Business Intelligence
          </h2>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap w-full md:w-auto">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0">
            <div className="flex items-center gap-1 text-[11px] font-mono text-[#64746E] mr-1 shrink-0">
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
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all cursor-pointer whitespace-nowrap border ${
                    active
                      ? 'bg-[#123B34] text-[#E7C47F] border-[#123B34]'
                      : 'bg-white text-[#64746E] border-[#123B34]/10 hover:border-[#123B34]/30 hover:text-[#123B34]'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleCleanDemoData}
            title="Reset demo data to 0"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-[#64746E] hover:text-[#C94C4C] bg-white border border-[#123B34]/10 hover:border-[#C94C4C]/50 transition-all cursor-pointer whitespace-nowrap ml-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clean Data</span>
          </button>
        </div>
      </div>

      {/* 4 PRIMARY KPIS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={cardStyle}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64746E]">REVENUE</span>
            <DollarSign className="w-4 h-4 text-[#168A5B]" />
          </div>
          <div className="text-3xl font-black tracking-tight text-[#123B34] mb-1">
            ₹{financial.totalRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-[#64746E]">
            {financial.totalRevenue > 0 ? `From ${financial.totalOrdersCount} orders` : 'No sales recorded yet'}
          </div>
        </div>

        <div className={cardStyle}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64746E]">EXPENSES</span>
            <Layers className="w-4 h-4 text-[#C68A24]" />
          </div>
          <div className="text-3xl font-black tracking-tight text-[#123B34] mb-1">
            ₹{(financial.totalCogs + financial.totalOperatingExpenses).toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-[#64746E]">
            {(financial.totalCogs + financial.totalOperatingExpenses) > 0 ? `COGS: ₹${financial.totalCogs.toLocaleString()} | Overheads: ₹${financial.totalOperatingExpenses.toLocaleString()}` : 'No expenses recorded yet'}
          </div>
        </div>

        <div className={cardStyle}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64746E]">NET PROFIT</span>
            <TrendingUp className="w-4 h-4 text-[#168A5B]" />
          </div>
          <div className="text-3xl font-black tracking-tight text-[#123B34] mb-1">
            ₹{financial.netProfit.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-[#64746E]">
            {financial.totalRevenue > 0 ? `Margin: ${financial.profitMarginPercent}%` : 'Awaiting sales data'}
          </div>
        </div>

        <div className={cardStyle}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64746E]">ORDERS</span>
            <Package className="w-4 h-4 text-[#123B34]" />
          </div>
          <div className="text-3xl font-black tracking-tight text-[#123B34] mb-1">
            {financial.totalOrdersCount}
          </div>
          <div className="text-xs text-[#64746E]">
            {financial.totalOrdersCount > 0 ? `${financial.completedOrdersCount} completed` : 'No orders yet'}
          </div>
        </div>
      </div>

      {/* OVERVIEWS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* REVENUE OVERVIEW */}
        <div className={cardStyle}>
          <h3 className="text-sm font-black uppercase tracking-wider text-[#123B34] mb-4">Revenue Overview</h3>
          
          {financial.totalRevenue > 0 || financial.totalOperatingExpenses > 0 ? (
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-[#64746E]">Revenue</span>
                  <span className="text-[#123B34]">₹{financial.totalRevenue.toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full h-3 rounded-full bg-[#123B34]/5 overflow-hidden">
                  <div className="h-full rounded-full bg-[#168A5B]" style={{ width: '100%' }} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-[#64746E]">Expenses</span>
                  <span className="text-[#123B34]">
                    ₹{(financial.totalCogs + financial.totalOperatingExpenses).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-[#123B34]/5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#C94C4C]"
                    style={{ width: `${financial.totalRevenue > 0 ? Math.min(100, ((financial.totalCogs + financial.totalOperatingExpenses) / financial.totalRevenue) * 100) : (financial.totalOperatingExpenses > 0 ? 100 : 0)}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-[#64746E]">Net Profit</span>
                  <span className="text-[#123B34]">₹{financial.netProfit.toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full h-3 rounded-full bg-[#123B34]/5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#E7C47F]"
                    style={{ width: `${Math.max(0, Math.min(100, Number(financial.profitMarginPercent)))}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 flex items-center justify-center text-sm font-medium text-[#64746E]">
              No financial data available yet.
            </div>
          )}
        </div>

        {/* ORDER OVERVIEW */}
        <div className={cardStyle}>
          <h3 className="text-sm font-black uppercase tracking-wider text-[#123B34] mb-4">Order Overview</h3>
          
          {orders.length > 0 ? (
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-[#64746E]">New</span>
                  <span className="text-[#123B34]">{newOrdersCount}</span>
                </div>
                <div className="w-full h-3 rounded-full bg-[#123B34]/5 overflow-hidden">
                  <div className="h-full rounded-full bg-[#C68A24]" style={{ width: `${(newOrdersCount / orders.length) * 100}%` }} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-[#64746E]">Pending</span>
                  <span className="text-[#123B34]">{pendingOrdersCount}</span>
                </div>
                <div className="w-full h-3 rounded-full bg-[#123B34]/5 overflow-hidden">
                  <div className="h-full rounded-full bg-[#123B34]" style={{ width: `${(pendingOrdersCount / orders.length) * 100}%` }} />
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-[#64746E]">Completed</span>
                  <span className="text-[#123B34]">{completedOrdersCount}</span>
                </div>
                <div className="w-full h-3 rounded-full bg-[#123B34]/5 overflow-hidden">
                  <div className="h-full rounded-full bg-[#168A5B]" style={{ width: `${(completedOrdersCount / orders.length) * 100}%` }} />
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 flex items-center justify-center text-sm font-medium text-[#64746E]">
              No orders yet.
            </div>
          )}
        </div>
      </div>

      {/* TABLES AND ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* RECENT ORDERS */}
        <div className={`lg:col-span-2 ${cardStyle} overflow-hidden flex flex-col`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-[#123B34]">Recent Orders</h3>
            <button 
              onClick={() => navigate?.('orders')}
              className="text-xs font-bold text-[#64746E] hover:text-[#123B34] flex items-center gap-1"
            >
              View All <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          
          <div className="overflow-x-auto -mx-5 px-5 flex-1">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#123B34]/10 text-[#64746E]">
                  <th className="py-2.5 font-bold uppercase">ID</th>
                  <th className="py-2.5 font-bold uppercase">Customer</th>
                  <th className="py-2.5 font-bold uppercase">Amount</th>
                  <th className="py-2.5 font-bold uppercase">Status</th>
                  <th className="py-2.5 font-bold uppercase">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-[#123B34]/5 hover:bg-[#F4EBDD]/50 transition-colors">
                      <td className="py-3 font-mono font-bold text-[#123B34]">{order.displayId || order.id.substring(0, 8).toUpperCase()}</td>
                      <td className="py-3 text-[#18302B]">{order.customerInfo?.name || order.customerId || 'Guest'}</td>
                      <td className="py-3 font-bold text-[#123B34]">₹{(order.totalAmount || 0).toLocaleString('en-IN')}</td>
                      <td className="py-3">
                        <span className="px-2 py-1 rounded bg-[#123B34]/5 text-[#64746E] text-[10px] font-bold uppercase tracking-wider">
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="py-3 text-[#64746E]">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-[#64746E] font-medium">
                      No orders yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className={`${cardStyle} flex flex-col`}>
          <h3 className="text-sm font-black uppercase tracking-wider text-[#123B34] mb-4">Quick Actions</h3>
          
          <div className="space-y-2.5 flex-1">
            <button
              onClick={() => navigate?.('products')}
              className="w-full px-4 py-3 rounded-xl bg-white hover:bg-[#F4EBDD] border border-[#123B34]/10 text-[#123B34] text-xs font-bold transition-colors flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4 text-[#168A5B]" />
              <span>Create Product</span>
            </button>

            <button
              onClick={() => navigate?.('categories')}
              className="w-full px-4 py-3 rounded-xl bg-white hover:bg-[#F4EBDD] border border-[#123B34]/10 text-[#123B34] text-xs font-bold transition-colors flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4 text-[#168A5B]" />
              <span>Create Category</span>
            </button>

            <button
              onClick={() => navigate?.('manual-order')}
              className="w-full px-4 py-3 rounded-xl bg-white hover:bg-[#F4EBDD] border border-[#123B34]/10 text-[#123B34] text-xs font-bold transition-colors flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4 text-[#168A5B]" />
              <span>Manual Order / POS</span>
            </button>

            <button
              onClick={() => navigate?.('stock')}
              className="w-full px-4 py-3 rounded-xl bg-white hover:bg-[#F4EBDD] border border-[#123B34]/10 text-[#123B34] text-xs font-bold transition-colors flex items-center gap-2"
            >
              <Layers className="w-4 h-4 text-[#E7C47F]" />
              <span>Add Stock</span>
            </button>

            <button
              onClick={() => navigate?.('requests')}
              className="w-full px-4 py-3 rounded-xl bg-white hover:bg-[#F4EBDD] border border-[#123B34]/10 text-[#123B34] text-xs font-bold transition-colors flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-[#C68A24]" />
              <span>View Design Requests</span>
            </button>
          </div>
        </div>
      </div>

      {/* OPERATIONS SNAPSHOT (Secondary KPIs) */}
      <div>
        <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#64746E] mb-3 ml-1">
          OPERATIONS SNAPSHOT
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <div className="bg-white border border-[#123B34]/10 rounded-xl p-3 shadow-sm">
            <span className="text-[10px] font-bold text-[#64746E] block mb-1 uppercase tracking-wider">Products</span>
            <span className="text-lg font-black text-[#123B34]">{totalProducts}</span>
          </div>
          <div className="bg-white border border-[#123B34]/10 rounded-xl p-3 shadow-sm">
            <span className="text-[10px] font-bold text-[#64746E] block mb-1 uppercase tracking-wider">Active</span>
            <span className="text-lg font-black text-[#168A5B]">{activeProducts}</span>
          </div>
          <div className="bg-white border border-[#123B34]/10 rounded-xl p-3 shadow-sm">
            <span className="text-[10px] font-bold text-[#64746E] block mb-1 uppercase tracking-wider">Low Stock</span>
            <span className={`text-lg font-black ${lowStockCount > 0 ? 'text-[#C68A24]' : 'text-[#123B34]'}`}>{lowStockCount}</span>
          </div>
          <div className="bg-white border border-[#123B34]/10 rounded-xl p-3 shadow-sm">
            <span className="text-[10px] font-bold text-[#64746E] block mb-1 uppercase tracking-wider">Out of Stock</span>
            <span className={`text-lg font-black ${outOfStockCount > 0 ? 'text-[#C94C4C]' : 'text-[#123B34]'}`}>{outOfStockCount}</span>
          </div>
          <div className="bg-white border border-[#123B34]/10 rounded-xl p-3 shadow-sm">
            <span className="text-[10px] font-bold text-[#64746E] block mb-1 uppercase tracking-wider">Pending Orders</span>
            <span className="text-lg font-black text-[#123B34]">{pendingOrdersCount}</span>
          </div>
          <div className="bg-white border border-[#123B34]/10 rounded-xl p-3 shadow-sm">
            <span className="text-[10px] font-bold text-[#64746E] block mb-1 uppercase tracking-wider">Design Reqs</span>
            <span className="text-lg font-black text-[#123B34]">{totalDesignRequests}</span>
          </div>
        </div>
      </div>

    </div>
  );
}

export default AdminDashboardTab;
