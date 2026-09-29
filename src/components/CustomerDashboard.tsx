import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { User, Package, ShieldCheck, Clock, CheckCircle2, ArrowLeft, Plus, Phone, MapPin, LogOut } from 'lucide-react';
import { BatteryBrand } from '../types';

export const CustomerDashboard: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { orders, warranties, breakdowns, registerWarranty, setActiveView, setSelectedCategory, showToast } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'warranties' | 'new-warranty'>('orders');

  // Form for warranty registration
  const [batteryName, setBatteryName] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [brand, setBrand] = useState<BatteryBrand>('Exide');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [warrantyMonths, setWarrantyMonths] = useState(54);
  const [invoiceNumber, setInvoiceNumber] = useState('');

  // Filter orders for current customer
  const customerOrders = orders.filter(
    (o) =>
      o.customerPhone === currentUser?.phone ||
      o.customerEmail === currentUser?.email ||
      o.customerName.toLowerCase().includes(currentUser?.name.toLowerCase() || 'never_match')
  );

  const customerWarranties = warranties.filter(
    (w) =>
      w.customerPhone === currentUser?.phone ||
      w.customerName.toLowerCase().includes(currentUser?.name.toLowerCase() || 'never_match')
  );

  const handleRegisterWarranty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batteryName || !serialNumber || !invoiceNumber) {
      alert('Please fill in battery model, serial number and invoice number.');
      return;
    }

    registerWarranty({
      batteryName,
      serialNumber,
      brand,
      purchaseDate,
      warrantyPeriodMonths: Number(warrantyMonths),
      customerName: currentUser?.name || 'Customer',
      customerPhone: currentUser?.phone || '+91 98220 00000',
      invoiceNumber
    });

    setBatteryName('');
    setSerialNumber('');
    setInvoiceNumber('');
    setActiveTab('warranties');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Top Navigation Back */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setActiveView('store')}
          className="flex items-center gap-2 text-xs font-bold text-neutral-600 hover:text-amber-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Battery Store</span>
        </button>

        <span className="text-xs font-semibold text-neutral-500">
          Wagholi Service Branch · Wagholi, Pune 412207
        </span>
      </div>

      {/* Customer Header Card */}
      <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500 text-neutral-950 font-black text-2xl flex items-center justify-center shadow-md shadow-amber-500/20">
            {currentUser?.name ? currentUser.name[0].toUpperCase() : 'C'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black font-display text-neutral-900">
                {currentUser?.name || 'Valued Customer'}
              </h1>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Active Customer
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 mt-1">
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-neutral-400" />
                {currentUser?.phone}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                {currentUser?.address || 'Wagholi, Pune'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('new-warranty')}
            className="flex-1 sm:flex-none py-2.5 px-3.5 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-amber-200"
          >
            <Plus className="w-4 h-4" />
            <span>Register Warranty</span>
          </button>
          <button
            onClick={() => setActiveView('store')}
            className="flex-1 sm:flex-none py-2.5 px-3.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Order New Battery
          </button>
          <button
            onClick={() => {
              logout();
              setActiveView('store');
              showToast('Customer logged out. Cart cleared.');
            }}
            className="flex-1 sm:flex-none py-2.5 px-3.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-red-200"
            title="Sign Out of Customer Account"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200 pb-3 mb-6">
        <button
          onClick={() => setActiveTab('orders')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'bg-neutral-900 text-white shadow-xs'
              : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Orders ({customerOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('warranties')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'warranties'
              ? 'bg-neutral-900 text-white shadow-xs'
              : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>E-Warranty Certificates ({customerWarranties.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('new-warranty')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'new-warranty'
              ? 'bg-neutral-900 text-white shadow-xs'
              : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Register Battery Warranty</span>
        </button>
      </div>

      {/* TAB 1: ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {customerOrders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-neutral-200 p-8 text-center text-neutral-500">
              <Package className="w-12 h-12 text-neutral-300 mx-auto mb-2 stroke-1" />
              <p className="text-sm font-bold text-neutral-800">No Orders Found</p>
              <p className="text-xs text-neutral-400 mt-1">
                You haven't placed any battery orders yet. Explore our genuine inverter and automotive battery models.
              </p>
              <button
                onClick={() => setActiveView('store')}
                className="mt-4 py-2 px-4 bg-amber-500 text-neutral-950 font-bold rounded-xl text-xs"
              >
                Browse Battery Store
              </button>
            </div>
          ) : (
            customerOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs">
                {/* Order Top Bar */}
                <div className="flex flex-wrap items-center justify-between pb-4 border-b border-neutral-100 gap-2">
                  <div>
                    <span className="text-[11px] font-mono font-bold text-amber-700 uppercase">
                      {order.orderNumber}
                    </span>
                    <h3 className="text-sm font-bold text-neutral-900 mt-0.5">
                      Placed on {new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </h3>
                  </div>

                  {/* Status Indicator */}
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                      order.orderStatus === 'installed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : order.orderStatus === 'out_for_delivery'
                        ? 'bg-amber-100 text-amber-800 animate-pulse'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span className="capitalize">{order.orderStatus.replace(/_/g, ' ')}</span>
                    </span>
                  </div>
                </div>

                {/* Tracking Progress */}
                <div className="py-4 border-b border-neutral-100">
                  <div className="flex items-center justify-between text-[11px] font-bold text-neutral-500 mb-2">
                    <span className={order.orderStatus ? 'text-amber-600' : ''}>1. Received</span>
                    <span className={order.orderStatus !== 'received' ? 'text-amber-600' : ''}>2. Confirmed</span>
                    <span className={['out_for_delivery', 'installed'].includes(order.orderStatus) ? 'text-amber-600' : ''}>3. Technician Dispatched</span>
                    <span className={order.orderStatus === 'installed' ? 'text-emerald-600' : ''}>4. Installed & Tested</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 transition-all duration-500"
                      style={{
                        width:
                          order.orderStatus === 'installed'
                            ? '100%'
                            : order.orderStatus === 'out_for_delivery'
                            ? '75%'
                            : order.orderStatus === 'confirmed'
                            ? '50%'
                            : '25%'
                      }}
                    />
                  </div>
                  {order.assignedTechnician && (
                    <div className="mt-2 text-xs text-neutral-600">
                      Assigned Wagholi Technician: <strong className="text-neutral-900">{order.assignedTechnician}</strong>
                    </div>
                  )}
                </div>

                {/* Items */}
                <div className="py-4 space-y-2">
                  {order.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-neutral-900">{it.quantity}x {it.battery.name}</span>
                        <span className="text-neutral-500 ml-2">({it.battery.brand} · {it.battery.capacityAh} Ah)</span>
                        {it.withExchange && (
                          <span className="block text-[11px] text-emerald-700 font-semibold">
                            ✓ Scrap return applied (Saved ₹{it.battery.exchangeDiscount})
                          </span>
                        )}
                      </div>
                      <span className="font-mono font-bold text-neutral-900 tabular-nums">
                        ₹{((it.withExchange ? it.battery.priceWithExchange : it.battery.priceWithoutExchange) * it.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Delivery location & total */}
                <div className="pt-3 border-t border-neutral-100 flex flex-wrap justify-between items-center text-xs text-neutral-600 gap-2">
                  <div>
                    <span>Delivery Location: </span>
                    <strong className="text-neutral-900">{order.address}, {order.area}</strong>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-neutral-500 block">Total Due:</span>
                    <span className="font-mono text-base font-black text-neutral-900 tabular-nums">
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: WARRANTIES */}
      {activeTab === 'warranties' && (
        <div className="space-y-4">
          {customerWarranties.length === 0 ? (
            <div className="bg-white rounded-2xl border border-neutral-200 p-8 text-center text-neutral-500">
              <ShieldCheck className="w-12 h-12 text-neutral-300 mx-auto mb-2 stroke-1" />
              <p className="text-sm font-bold text-neutral-800">No Registered Batteries Yet</p>
              <p className="text-xs text-neutral-400 mt-1">
                Purchased an Exide, Amaron, Livfast, Luminous, Microtek or Power Zone battery from New Bharat Battery? Register it for warranty claim support.
              </p>
              <button
                onClick={() => setActiveTab('new-warranty')}
                className="mt-4 py-2 px-4 bg-amber-500 text-neutral-950 font-bold rounded-xl text-xs cursor-pointer"
              >
                Register Battery Now
              </button>
            </div>
          ) : (
            customerWarranties.map((war) => (
              <div key={war.id} className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs">
                <div className="flex flex-wrap items-center justify-between pb-3 border-b border-neutral-100 gap-2">
                  <div>
                    <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                      {war.brand} Authorized E-Warranty
                    </span>
                    <h3 className="text-base font-bold text-neutral-900">{war.batteryName}</h3>
                  </div>

                  <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg text-xs font-bold">
                    Active Guarantee ({war.warrantyPeriodMonths} Months)
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 text-xs">
                  <div>
                    <span className="text-neutral-400 block text-[10px]">Serial Number</span>
                    <span className="font-mono font-bold text-neutral-900">{war.serialNumber}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[10px]">Invoice Number</span>
                    <span className="font-mono font-bold text-neutral-900">{war.invoiceNumber}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[10px]">Purchase Date</span>
                    <span className="font-medium text-neutral-900">{war.purchaseDate}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[10px]">Dealer Center</span>
                    <span className="font-medium text-neutral-900">New Bharat Battery (Wagholi)</span>
                  </div>
                </div>

                <div className="bg-neutral-50 p-3 rounded-xl text-xs text-neutral-600 flex items-center justify-between">
                  <span>For replacement or doorstep service call:</span>
                  <a href="tel:+918329838314" className="text-neutral-900 font-mono font-bold hover:underline">+91 83298 38314</a>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: REGISTER NEW WARRANTY */}
      {activeTab === 'new-warranty' && (
        <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 max-w-xl mx-auto shadow-xs">
          <div className="mb-6">
            <h2 className="text-xl font-black font-display text-neutral-900">
              Register Your Battery for Digital Warranty
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Store your battery serial code and invoice to enjoy hassle-free warranty replacement at New Bharat Battery in Wagholi.
            </p>
          </div>

          <form onSubmit={handleRegisterWarranty} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Battery Brand *
              </label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value as BatteryBrand)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-medium text-neutral-900 focus:outline-hidden focus:border-amber-500"
              >
                <option value="Exide">Exide</option>
                <option value="Amaron">Amaron</option>
                <option value="Livfast">Livfast</option>
                <option value="Luminous">Luminous</option>
                <option value="Microtek">Microtek</option>
                <option value="Power Zone">Power Zone</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Battery Model Name *
              </label>
              <input
                type="text"
                required
                value={batteryName}
                onChange={(e) => setBatteryName(e.target.value)}
                placeholder="e.g. Exide Inva Tubular IT 500 or Amaron Flo 35Ah"
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-medium text-neutral-900 focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Battery Serial Number *
                </label>
                <input
                  type="text"
                  required
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  placeholder="e.g. EXT-2026-9948"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-mono text-neutral-900 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Invoice / Bill Number *
                </label>
                <input
                  type="text"
                  required
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  placeholder="e.g. INV-NBB-8812"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-mono text-neutral-900 focus:outline-hidden focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Purchase Date
                </label>
                <input
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-medium text-neutral-900 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Warranty Duration (Months)
                </label>
                <input
                  type="number"
                  value={warrantyMonths}
                  onChange={(e) => setWarrantyMonths(Number(e.target.value))}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-medium text-neutral-900 focus:outline-hidden focus:border-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
            >
              Save Warranty Record
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
