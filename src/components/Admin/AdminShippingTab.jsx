import React, { useState } from 'react';
import {
  Truck,
  Package,
  CheckCircle2,
  Clock,
  Printer,
  FileText,
  Search,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  MapPin,
  RefreshCw,
  Sliders,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { SHIPPING_PROVIDERS } from '../../constants/orderWorkflow';
import { shippingService } from '../../services/shippingService';

export function AdminShippingTab({ onSelectOrder }) {
  const { orders, currentTheme } = useStore();

  const [shippingSearch, setShippingSearch] = useState('');
  const [testPin, setTestPin] = useState('');
  const [pinResult, setPinResult] = useState(null);
  const [isCheckingPin, setIsCheckingPin] = useState(false);

  // Orders that have active shipments booked or are ready to ship
  const shippedOrders = orders.filter((o) => o.shipment?.awbNumber || o.orderStatus === 'READY_TO_SHIP' || o.orderStatus === 'SHIPPED');

  const handleTestPin = async (e) => {
    e.preventDefault();
    if (!testPin.trim()) return;
    setIsCheckingPin(true);
    const res = await shippingService.checkServiceability(testPin.trim());
    setPinResult(res);
    setIsCheckingPin(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in select-none">
      {/* Header & Carrier Connection Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>Logistics & Shipping Partners Hub</span>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono border border-cyan-500/30">
              4 Carriers Live
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Real-time AWB allocation, courier routing, thermal shipping labels, and pickup manifest synchronization.
          </p>
        </div>
      </div>

      {/* Carrier Aggregators Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SHIPPING_PROVIDERS.map((provider) => (
          <div
            key={provider.id}
            className="p-5 rounded-3xl glass-panel border border-slate-700/80 space-y-3 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{provider.logo}</span>
                <div>
                  <h3 className="text-xs font-bold text-white">{provider.name}</h3>
                  <span className="text-[10px] text-slate-400 font-mono">Code: {provider.code}</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-bold">
                CONNECTED
              </span>
            </div>

            <div className="space-y-1 text-xs border-t border-slate-800 pt-2 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Avg Delivery:</span>
                <span className="font-semibold text-white">{provider.avgDays}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Base Freight:</span>
                <span className="font-mono text-emerald-400">₹{provider.baseFee}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">COD Available:</span>
                <span className="text-white">✓ Active</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PIN Code Serviceability & Rate Check Simulator */}
      <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span>Real-Time Courier Rate & PIN Code Serviceability Engine</span>
          </span>
          <span className="text-[10px] text-slate-500 font-mono">Origin: Gurugram Central Hub (122015)</span>
        </div>

        <form onSubmit={handleTestPin} className="flex flex-col sm:flex-row gap-2.5">
          <input
            type="text"
            maxLength="6"
            value={testPin}
            onChange={(e) => setTestPin(e.target.value)}
            placeholder="Enter Destination PIN Code (e.g. 560001 or 400001)..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            disabled={isCheckingPin}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-black text-xs shadow-glow-cyan transition-all"
          >
            {isCheckingPin ? 'Calculating Rates...' : 'Check Serviceability & Freight'}
          </button>
        </form>

        {pinResult && (
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 animate-in fade-in text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">
                Destination: {pinResult.city}, {pinResult.state} (PIN: {pinResult.pinCode})
              </span>
              <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${pinResult.serviceable ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                {pinResult.serviceable ? '✓ Serviceable by All Carriers' : '✗ PIN Code Unserviceable'}
              </span>
            </div>

            {pinResult.couriers && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
                {pinResult.couriers.map((c) => (
                  <div key={c.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                    <span className="font-bold text-white block">{c.name}</span>
                    <div className="flex justify-between text-slate-400">
                      <span>Rate:</span>
                      <span className="font-mono text-emerald-400 font-bold">₹{c.rate}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>ETA:</span>
                      <span>{c.estimatedDelivery}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Active Dispatched Shipments Table */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Active Courier Shipments & Dispatched Manifests ({shippedOrders.length})
        </h3>

        <div className="rounded-3xl glass-panel border border-slate-700/80 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-950/90 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Order ID</th>
                  <th className="py-3.5 px-4">Recipient</th>
                  <th className="py-3.5 px-4">Carrier & Service</th>
                  <th className="py-3.5 px-4">AWB Tracking #</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">ETA Delivery</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {shippedOrders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-slate-500 text-xs">
                      No active shipments currently in transit.
                    </td>
                  </tr>
                ) : (
                  shippedOrders.map((order) => (
                    <tr
                      key={order.id}
                      onClick={() => onSelectOrder(order)}
                      className="hover:bg-slate-850/60 transition-colors cursor-pointer"
                    >
                      <td className="py-4 px-4 font-mono font-bold text-cyan-400 whitespace-nowrap">
                        #{order.id}
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-bold text-white block">{order.customerName}</span>
                        <span className="text-[10px] text-slate-400">{order.shippingAddress?.city}</span>
                      </td>
                      <td className="py-4 px-4 text-slate-200">
                        {order.shipment?.courierName || 'Pending Allocation'}
                      </td>
                      <td className="py-4 px-4 font-mono font-bold text-white whitespace-nowrap">
                        {order.shipment?.awbNumber || (
                          <span className="text-slate-500 font-normal italic">Ready for Manifest</span>
                        )}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase font-mono">
                          {order.shipment?.status || order.orderStatus}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-300 whitespace-nowrap">
                        {order.shipment?.estimatedDelivery || '2–4 Days'}
                      </td>
                      <td className="py-4 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onSelectOrder(order)}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
