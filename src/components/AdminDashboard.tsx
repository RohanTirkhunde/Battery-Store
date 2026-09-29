import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { BatteryBrand, BatteryCategory, BatteryModel, Order, BreakdownRequest } from '../types';
import { BatteryVisual } from './BatteryVisual';
import {
  ShieldCheck,
  Package,
  Wrench,
  Layers,
  IndianRupee,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  Edit2,
  Phone,
  MapPin,
  Save,
  ArrowLeft,
  Search,
  Filter,
  Image as ImageIcon,
  Upload,
  ExternalLink,
  MessageSquare,
  Settings,
  Store,
  LogOut,
  Lock
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { currentUser, adminEmail, logout, isAdmin } = useAuth();
  const {
    batteries,
    orders,
    breakdowns,
    updateOrderStatus,
    deleteOrder,
    updateBreakdownStatus,
    deleteBreakdown,
    updateBattery,
    addBattery,
    deleteBattery,
    setActiveView,
    ownerPhone,
    ownerEmail,
    ownerUpiId,
    sendOrderToOwnerWhatsApp,
    showToast
  } = useStore();

  const handleSignOut = () => {
    logout();
    setActiveView('store');
    showToast('Signed out from Owner Admin Panel');
  };

  // Active Delete Confirmation Modal state (works 100% reliably in iFrame without window.confirm)
  const [itemToDelete, setItemToDelete] = useState<{
    type: 'battery' | 'order' | 'breakdown';
    id: string;
    name: string;
    detail?: string;
  } | null>(null);

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    if (itemToDelete.type === 'battery') {
      deleteBattery(itemToDelete.id);
    } else if (itemToDelete.type === 'order') {
      deleteOrder(itemToDelete.id);
    } else if (itemToDelete.type === 'breakdown') {
      deleteBreakdown(itemToDelete.id);
    }
    setItemToDelete(null);
  };

  const [activeTab, setActiveTab] = useState<'orders' | 'breakdowns' | 'inventory' | 'settings'>('orders');

  // Order filters
  const [orderFilter, setOrderFilter] = useState<'all' | 'received' | 'confirmed' | 'out_for_delivery' | 'installed'>('all');
  const [editingTechForOrder, setEditingTechForOrder] = useState<string | null>(null);
  const [techNameInput, setTechNameInput] = useState('');

  // Inventory filters & editing
  const [brandFilter, setBrandFilter] = useState<BatteryBrand | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<BatteryCategory | 'all'>('all');
  const [inventorySearch, setInventorySearch] = useState('');

  // Full Model & Picture Editor state
  const [fullEditBattery, setFullEditBattery] = useState<BatteryModel | null>(null);
  const [editAppString, setEditAppString] = useState('');
  const [editFeatString, setEditFeatString] = useState('');

  // Add Battery / Inverter state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newModel, setNewModel] = useState<{
    name: string;
    brand: BatteryBrand;
    category: BatteryCategory;
    capacityAh: number;
    voltage: number;
    warrantyMonths: number;
    warrantyType: string;
    priceWithoutExchange: number;
    priceWithExchange: number;
    inStock: boolean;
    stockCount: number;
    technology: 'Tall Tubular' | 'Short Tubular' | 'Maintenance Free (SMF)' | 'Flooded Lead Acid' | 'VRLA' | 'Pure Sine Wave' | 'Digital UPS' | 'Solar Hybrid' | 'Inverter + Battery Combo';
    vaRating?: number;
    outputWatts?: number;
    recommendedFor: string;
    features: string;
    imageUrl?: string;
  }>({
    name: '',
    brand: 'Luminous',
    category: 'inverter-machine',
    capacityAh: 0,
    voltage: 12,
    warrantyMonths: 24,
    warrantyType: '24 Months Comprehensive Manufacturer Warranty',
    priceWithoutExchange: 6800,
    priceWithExchange: 5600,
    inStock: true,
    stockCount: 10,
    technology: 'Pure Sine Wave',
    vaRating: 900,
    outputWatts: 756,
    recommendedFor: '1-2 BHK Homes, 3 Fans + 4 LED Lights + 1 TV + Wi-Fi',
    features: 'Pure sine wave output, LED display showing backup time in hours, MCB trip protection',
    imageUrl: ''
  });

  // KPI calculations
  const totalRevenue = orders
    .filter(o => o.orderStatus !== 'cancelled')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingDeliveries = orders.filter(o => o.orderStatus === 'received' || o.orderStatus === 'confirmed' || o.orderStatus === 'out_for_delivery').length;
  const activeBreakdowns = breakdowns.filter(b => b.status === 'pending' || b.status === 'dispatched').length;
  const totalUnitsInStock = batteries.reduce((sum, b) => sum + (b.inStock ? b.stockCount : 0), 0);

  // Filtered lists
  const filteredOrders = orders.filter(o => (orderFilter === 'all' ? true : o.orderStatus === orderFilter));

  const filteredBatteries = batteries.filter(b => {
    const matchesBrand = brandFilter === 'all' || b.brand === brandFilter;
    const matchesCategory = categoryFilter === 'all' || b.category === categoryFilter;
    const matchesSearch =
      b.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      b.brand.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      (b.category && b.category.toLowerCase().includes(inventorySearch.toLowerCase())) ||
      (b.vaRating && b.vaRating.toString().includes(inventorySearch)) ||
      b.capacityAh.toString().includes(inventorySearch);
    return matchesBrand && matchesCategory && matchesSearch;
  });

  const handleOpenFullEdit = (b: BatteryModel) => {
    setFullEditBattery({ ...b });
    setEditAppString(b.recommendedFor.join(', '));
    setEditFeatString(b.features.join(', '));
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && fullEditBattery) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFullEditBattery({
          ...fullEditBattery,
          imageUrl: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveFullEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullEditBattery) return;

    updateBattery(fullEditBattery.id, {
      ...fullEditBattery,
      priceWithExchange: Number(fullEditBattery.priceWithExchange),
      priceWithoutExchange: Number(fullEditBattery.priceWithoutExchange),
      stockCount: Number(fullEditBattery.stockCount),
      capacityAh: Number(fullEditBattery.capacityAh),
      warrantyMonths: Number(fullEditBattery.warrantyMonths),
      exchangeDiscount: Math.max(0, Number(fullEditBattery.priceWithoutExchange) - Number(fullEditBattery.priceWithExchange)),
      recommendedFor: editAppString.split(',').map(s => s.trim()).filter(Boolean),
      features: editFeatString.split(',').map(s => s.trim()).filter(Boolean)
    });

    setFullEditBattery(null);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModel.name.trim()) return;

    addBattery({
      ...newModel,
      exchangeDiscount: Math.max(0, newModel.priceWithoutExchange - newModel.priceWithExchange),
      recommendedFor: newModel.recommendedFor.split(',').map(s => s.trim()).filter(Boolean),
      features: newModel.features.split(',').map(s => s.trim()).filter(Boolean)
    });

    setIsAddModalOpen(false);
  };

  React.useEffect(() => {
    if (!isAdmin) {
      setActiveView('store');
    }
  }, [isAdmin, setActiveView]);

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('store')}
            className="p-2 bg-neutral-100 hover:bg-neutral-200 rounded-xl text-neutral-600 transition-colors cursor-pointer"
            title="Return to customer store view"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-indigo-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider">
                Restricted Owner Panel
              </span>
              <span className="text-xs text-neutral-500 font-mono">{ownerEmail}</span>
            </div>
            <h1 className="text-2xl font-black font-display text-neutral-900 mt-0.5">
              NEW Bharat Battery Management
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              Opposite to Sangrilla Hotel, Near Honda Showroom, Wagholi, Pune - 412207
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="py-2 px-3.5 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Battery</span>
          </button>
          <button
            onClick={handleSignOut}
            className="py-2 px-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
            title="Sign Out of Owner Admin Panel"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 text-xs font-semibold">
            <span>Shop Revenue</span>
            <IndianRupee className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono text-neutral-900 tabular-nums">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
          <div className="mt-1 text-[11px] text-neutral-400">Total processed orders</div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 text-xs font-semibold">
            <span>Pending Wagholi Orders</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono text-neutral-900 tabular-nums">
            {pendingDeliveries}
          </div>
          <div className="mt-1 text-[11px] text-amber-700 font-medium">Requires dispatch / fitment</div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 text-xs font-semibold">
            <span>Active Jumpstart Calls</span>
            <Wrench className="w-4 h-4 text-red-600" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono text-neutral-900 tabular-nums">
            {activeBreakdowns}
          </div>
          <div className="mt-1 text-[11px] text-red-600 font-medium">Roadside / home assistance</div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 text-xs font-semibold">
            <span>Total Units In Stock</span>
            <Layers className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono text-neutral-900 tabular-nums">
            {totalUnitsInStock}
          </div>
          <div className="mt-1 text-[11px] text-neutral-400">Across 5 authorized brands</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200 pb-3 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('orders')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'orders'
              ? 'bg-neutral-900 text-white shadow-xs'
              : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Orders & WhatsApp Dispatch ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'inventory'
              ? 'bg-neutral-900 text-white shadow-xs'
              : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Edit Battery Info, Pictures & Prices ({batteries.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('breakdowns')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'breakdowns'
              ? 'bg-neutral-900 text-white shadow-xs'
              : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Roadside Jumpstarts ({breakdowns.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'settings'
              ? 'bg-neutral-900 text-white shadow-xs'
              : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Shop Info & Alert Mobile (8329838314)</span>
        </button>
      </div>

      {/* TAB 1: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-neutral-100 rounded-xl text-xs w-fit">
            {(['all', 'received', 'confirmed', 'out_for_delivery', 'installed'] as const).map(st => (
              <button
                key={st}
                onClick={() => setOrderFilter(st)}
                className={`px-3 py-1.5 rounded-lg font-semibold capitalize cursor-pointer transition-colors ${
                  orderFilter === st
                    ? 'bg-white text-neutral-950 shadow-2xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {st.replace(/_/g, ' ')}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredOrders.map(order => (
              <div key={order.id} className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-4">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-neutral-900">{order.orderNumber}</span>
                      <span className="text-xs text-neutral-400">·</span>
                      <span className="text-xs text-neutral-500 font-mono">
                        {new Date(order.date).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs font-semibold text-neutral-700">
                      <span>{order.customerName}</span>
                      <span className="text-neutral-300">|</span>
                      <a href={`tel:${order.customerPhone}`} className="text-amber-700 hover:underline flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {order.customerPhone}
                      </a>
                    </div>
                  </div>

                  {/* Actions & WhatsApp Alert */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => sendOrderToOwnerWhatsApp(order)}
                      className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                      title="Send this order to Owner Mobile WhatsApp (8329838314)"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp to {ownerPhone}</span>
                    </button>

                    <select
                      value={order.orderStatus}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['orderStatus'])}
                      className="bg-neutral-50 border border-neutral-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-neutral-900 focus:outline-hidden"
                    >
                      <option value="received">Received</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="out_for_delivery">Out for Delivery</option>
                      <option value="installed">Installed & Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => setItemToDelete({
                        type: 'order',
                        id: order.id,
                        name: `Order #${order.orderNumber}`,
                        detail: `Customer: ${order.customerName} (${order.customerPhone}) · Total: ₹${order.totalAmount.toLocaleString('en-IN')}`
                      })}
                      className="py-1.5 px-2 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer border border-red-200 hover:border-red-600 shadow-2xs"
                      title="Delete this order record from owner dashboard"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </div>
                </div>

                {/* Delivery Destination & Advance Payment Status */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200/80">
                    <div className="text-neutral-500 font-semibold mb-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Delivery Address in Wagholi:</span>
                    </div>
                    <div className="font-medium text-neutral-900">{order.address}</div>
                    <div className="text-neutral-600 mt-0.5">{order.area} · Near {order.landmark || 'Not specified'}</div>
                    <div className="text-amber-700 font-bold mt-1">Window: {order.deliverySlot}</div>
                  </div>

                  <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200/80">
                    <div className="text-neutral-500 font-semibold mb-1 flex items-center gap-1">
                      <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Advance & Payment Balance:</span>
                    </div>
                    <div className="font-bold text-emerald-800">
                      Advance Paid (UPI): ₹{order.advanceAmount || 1000}
                    </div>
                    {order.upiTransactionRef && (
                      <div className="text-[11px] font-mono text-neutral-600 mt-0.5">
                        UPI Ref: {order.upiTransactionRef}
                      </div>
                    )}
                    <div className="font-bold text-neutral-900 mt-1">
                      Remaining COD Due: ₹{order.remainingAmount || (order.totalAmount - (order.advanceAmount || 1000))}
                    </div>
                  </div>

                  <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200/80 flex flex-col justify-between">
                    <div>
                      <div className="text-neutral-500 font-semibold mb-1 flex items-center gap-1">
                        <Wrench className="w-3.5 h-3.5 text-neutral-400" />
                        <span>Assigned Wagholi Technician:</span>
                      </div>
                      <div className="font-bold text-neutral-900">
                        {order.assignedTechnician || 'Unassigned (Self / In-Shop)'}
                      </div>
                    </div>

                    {editingTechForOrder === order.id ? (
                      <div className="flex gap-1.5 mt-2">
                        <input
                          type="text"
                          value={techNameInput}
                          onChange={(e) => setTechNameInput(e.target.value)}
                          placeholder="e.g. Santosh / Ramesh"
                          className="flex-1 bg-white border border-neutral-300 rounded px-2 py-1 text-xs"
                        />
                        <button
                          onClick={() => {
                            updateOrderStatus(order.id, order.orderStatus, `Assigned to ${techNameInput}`);
                            order.assignedTechnician = techNameInput;
                            setEditingTechForOrder(null);
                          }}
                          className="px-2 py-1 bg-neutral-900 text-white rounded text-[11px] font-bold"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingTechForOrder(order.id);
                          setTechNameInput(order.assignedTechnician || '');
                        }}
                        className="text-amber-700 font-semibold hover:underline text-[11px] mt-2 text-left"
                      >
                        + Assign / Change Technician
                      </button>
                    )}
                  </div>
                </div>

                {/* Items */}
                <div className="border-t border-neutral-100 pt-3 flex flex-wrap justify-between items-center gap-3 text-xs">
                  <div className="space-y-1">
                    {order.items.map((it, idx) => (
                      <div key={idx} className="text-neutral-800">
                        <span className="font-bold">{it.quantity}x {it.battery.name}</span>
                        <span className="text-neutral-500 ml-1">({it.battery.brand})</span>
                        {it.withExchange ? (
                          <span className="ml-2 font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]">
                            Old Scrap Return: ₹{it.battery.exchangeDiscount} rebate
                          </span>
                        ) : (
                          <span className="ml-2 text-neutral-400 text-[10px]">New Only</span>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="text-right">
                    <span className="text-lg font-black font-mono text-neutral-900 tabular-nums">
                      Total Bill: ₹{order.totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: INVENTORY & FULL EDIT (PRICES + INFORMATION + PICTURE) */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-semibold text-neutral-500 mr-1">Category:</span>
                {[
                  { id: 'all', label: 'All Items' },
                  { id: 'inverter-machine', label: '⚡ Inverters & UPS' },
                  { id: 'inverter', label: 'Inverter Batteries' },
                  { id: 'car', label: 'Car Batteries' },
                  { id: 'two-wheeler', label: 'Bike Batteries' },
                  { id: 'commercial', label: 'Commercial' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setCategoryFilter(cat.id as any)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                      categoryFilter === cat.id
                        ? 'bg-amber-500 text-neutral-950 font-bold shadow-2xs'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Live Search */}
              <div className="relative min-w-[220px]">
                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-neutral-400" />
                <input
                  type="text"
                  value={inventorySearch}
                  onChange={(e) => setInventorySearch(e.target.value)}
                  placeholder="Search model, brand, or VA/Ah..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-amber-500 font-medium"
                />
              </div>
            </div>

            {/* Brand Filter */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-neutral-100">
              <span className="text-xs font-semibold text-neutral-500 mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3" /> Brand:
              </span>
              {(['all', 'Exide', 'Amaron', 'Livfast', 'Luminous', 'Microtek', 'Power Zone'] as const).map(br => (
                <button
                  key={br}
                  onClick={() => setBrandFilter(br)}
                  className={`px-2.5 py-0.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                    brandFilter === br
                      ? 'bg-neutral-900 text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {br === 'all' ? 'All Brands' : br}
                </button>
              ))}
            </div>
          </div>

          {/* Table / List */}
          <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Battery / Inverter Model</th>
                    <th className="py-3 px-4">Brand / Category</th>
                    <th className="py-3 px-4">Picture Status</th>
                    <th className="py-3 px-4">Capacity & Warranty</th>
                    <th className="py-3 px-4">With Scrap Return</th>
                    <th className="py-3 px-4">Without Exchange</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4 text-right">Edit Controls</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 font-medium">
                  {filteredBatteries.map((b) => (
                    <tr key={b.id} className="hover:bg-neutral-50/50">
                      <td className="py-3 px-4">
                        <span className="font-bold text-neutral-900 block">{b.name}</span>
                        <span className="text-[10px] text-neutral-400 font-mono">{b.technology}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-neutral-800">{b.brand}</span>
                        <span className="text-neutral-400 block capitalize text-[11px]">
                          {b.category === 'inverter-machine' ? 'Home UPS Inverter' : b.category}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {b.imageUrl ? (
                          <div className="flex items-center gap-1.5 text-emerald-700">
                            <img
                              src={b.imageUrl}
                              alt="Thumbnail"
                              className="w-7 h-7 object-contain rounded border border-neutral-300 bg-neutral-100"
                            />
                            <span className="text-[11px] font-semibold">Custom Pic</span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-neutral-400 font-medium">High-Res SVG</span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono">
                        <span className="font-bold text-neutral-900">
                          {b.category === 'inverter-machine'
                            ? (b.vaRating ? `${b.vaRating} VA` : `${b.capacityAh || 900} VA`)
                            : `${b.capacityAh} Ah`}
                        </span>
                        <span className="text-neutral-400 block text-[11px]">{b.warrantyMonths} Months</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold font-mono text-emerald-700 tabular-nums">
                          ₹{b.priceWithExchange.toLocaleString('en-IN')}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold font-mono text-neutral-900 tabular-nums">
                          ₹{b.priceWithoutExchange.toLocaleString('en-IN')}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-mono font-bold ${b.stockCount > 5 ? 'text-neutral-800' : 'text-amber-600'}`}>
                          {b.stockCount} units
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenFullEdit(b)}
                            className="py-1 px-2.5 bg-neutral-900 hover:bg-amber-500 hover:text-neutral-950 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                            title="Edit full battery details, information, picture and prices"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit Info & Picture</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setItemToDelete({
                              type: 'battery',
                              id: b.id,
                              name: `${b.brand} ${b.name}`,
                              detail: `Capacity: ${b.capacityAh}Ah · ₹${b.priceWithExchange.toLocaleString('en-IN')} (Exchange) / ₹${b.priceWithoutExchange.toLocaleString('en-IN')}`
                            })}
                            className="py-1 px-2.5 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer border border-red-200 hover:border-red-600 shadow-2xs"
                            title={`Delete ${b.name} from catalog`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ROADSIDE JUMPSTARTS */}
      {activeTab === 'breakdowns' && (
        <div className="space-y-4">
          {breakdowns.length === 0 ? (
            <div className="bg-white rounded-2xl border border-neutral-200 p-8 text-center text-neutral-500">
              No emergency jumpstart calls at the moment.
            </div>
          ) : (
            breakdowns.map(req => (
              <div key={req.id} className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-red-600">{req.requestNumber}</span>
                    <span className="text-xs text-neutral-400">·</span>
                    <span className="text-xs font-semibold text-neutral-500">
                      {new Date(req.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      req.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' :
                      req.status === 'dispatched' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {req.status}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-neutral-900">{req.customerName}</h3>
                  <div className="text-xs text-neutral-600 flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-neutral-400" />
                    <a href={`tel:${req.phone}`} className="font-bold text-amber-700 hover:underline">{req.phone}</a>
                    <span className="text-neutral-300">|</span>
                    <span className="font-medium text-neutral-900">{req.vehicleModel} {req.vehicleNumber ? `(${req.vehicleNumber})` : ''}</span>
                  </div>

                  <div className="text-xs text-neutral-700 flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                    <span><strong>Location:</strong> {req.location}</span>
                  </div>
                  <div className="text-xs text-neutral-500 italic">
                    Issue: {req.issueDescription}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
                  {req.status !== 'resolved' && (
                    <>
                      <button
                        onClick={() => updateBreakdownStatus(req.id, 'dispatched', 'Wagholi Quick Response Unit')}
                        className="py-2 px-3 bg-amber-500 hover:bg-amber-600 text-neutral-950 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        Dispatch Mobile Tech
                      </button>
                      <button
                        onClick={() => updateBreakdownStatus(req.id, 'resolved')}
                        className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        Mark Jumpstart Resolved
                      </button>
                    </>
                  )}
                  {req.status === 'resolved' && (
                    <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      Assistance Complete
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => setItemToDelete({
                      type: 'breakdown',
                      id: req.id,
                      name: `Jumpstart Request #${req.requestNumber}`,
                      detail: `Customer: ${req.customerName} (${req.phone}) · Vehicle: ${req.vehicleModel} · Location: ${req.location}`
                    })}
                    className="py-2 px-3 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer border border-red-200 hover:border-red-600 shadow-2xs"
                    title="Delete jumpstart record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 4: SHOP SETTINGS & MOBILE CONFIGURATION */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 max-w-3xl space-y-6 shadow-xs">
          <div>
            <h2 className="text-xl font-bold font-display text-neutral-900">
              NEW Bharat Battery Store Configuration
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Verify your physical store address, mobile number for instant WhatsApp order notifications, and UPI receiver ID.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-1">
              <span className="text-neutral-500 block font-semibold">Store Physical Landmark:</span>
              <span className="text-sm font-bold text-neutral-900 block">
                NEW Bharat Battery, Opposite to sangrilla hotel near honda showroom wagholi pune-412207
              </span>
            </div>

            <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-1">
              <span className="text-neutral-500 block font-semibold">Direct Order Mobile Alert:</span>
              <span className="text-base font-black font-mono text-emerald-700 block">
                +91 {ownerPhone}
              </span>
              <span className="text-[11px] text-neutral-400">All customer orders message this number</span>
            </div>

            <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-1">
              <span className="text-neutral-500 block font-semibold">Owner Email:</span>
              <span className="text-sm font-bold font-mono text-neutral-900 block">
                {ownerEmail}
              </span>
            </div>

            <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-1">
              <span className="text-neutral-500 block font-semibold">Advance Payment UPI ID:</span>
              <span className="text-sm font-bold font-mono text-neutral-900 block">
                {ownerUpiId}
              </span>
              <span className="text-[11px] text-neutral-400">Collects ₹1,000 order booking advance</span>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-200">
            <h3 className="text-sm font-bold text-neutral-900 mb-2">Test Direct Order Dispatch to Your Mobile:</h3>
            <button
              type="button"
              onClick={() => {
                if (orders.length > 0) {
                  sendOrderToOwnerWhatsApp(orders[0]);
                } else {
                  alert('No orders to test. A sample order will be created.');
                }
              }}
              className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Test Send WhatsApp Order Message to {ownerPhone}</span>
            </button>
          </div>
        </div>
      )}

      {/* FULL MODEL & PICTURE EDIT MODAL */}
      {fullEditBattery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-neutral-200 my-8 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200 mb-5">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-600">
                  Admin Model Studio
                </span>
                <h2 className="text-xl font-bold font-display text-neutral-900 mt-0.5">
                  Edit Information, Picture & Prices for {fullEditBattery.name}
                </h2>
              </div>
              <button
                onClick={() => setFullEditBattery(null)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveFullEdit} className="space-y-6 text-xs">
              {/* PICTURE EDIT SECTION */}
              <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-amber-600" />
                    <span>Battery Picture Management</span>
                  </label>
                  {fullEditBattery.imageUrl && (
                    <button
                      type="button"
                      onClick={() => setFullEditBattery({ ...fullEditBattery, imageUrl: undefined })}
                      className="text-[11px] font-semibold text-red-600 hover:underline"
                    >
                      Remove Custom Picture (Use SVG)
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  {/* Current Visual Preview */}
                  <div className="sm:col-span-4 bg-white p-2 rounded-xl border border-neutral-200 flex flex-col items-center justify-center h-36">
                    {fullEditBattery.imageUrl ? (
                      <img
                        src={fullEditBattery.imageUrl}
                        alt="Preview"
                        className="max-h-28 object-contain"
                      />
                    ) : (
                      <BatteryVisual
                        brand={fullEditBattery.brand}
                        category={fullEditBattery.category}
                        name={fullEditBattery.name}
                        capacityAh={fullEditBattery.capacityAh}
                        size="sm"
                        className="h-28"
                      />
                    )}
                    <span className="text-[10px] text-neutral-400 mt-1">Current Active Visual</span>
                  </div>

                  {/* Picture Inputs */}
                  <div className="sm:col-span-8 space-y-3">
                    <div>
                      <label className="block text-neutral-600 font-semibold mb-1">
                        Option A: Paste Image Web URL
                      </label>
                      <input
                        type="url"
                        value={fullEditBattery.imageUrl || ''}
                        onChange={(e) => setFullEditBattery({ ...fullEditBattery, imageUrl: e.target.value })}
                        placeholder="https://example.com/battery-image.png"
                        className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-600 font-semibold mb-1">
                        Option B: Upload Photo from Your Device
                      </label>
                      <label className="flex items-center gap-2 px-3 py-2 bg-white border border-neutral-300 border-dashed rounded-lg cursor-pointer hover:bg-neutral-50 transition-colors">
                        <Upload className="w-4 h-4 text-amber-600" />
                        <span className="text-neutral-700 font-medium">Browse & Upload Image file...</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* GENERAL INFORMATION */}
              <div className="space-y-3">
                <h4 className="font-bold text-neutral-900 uppercase tracking-wider">
                  Basic Model Information
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-700 font-semibold mb-1">Battery Model Name *</label>
                    <input
                      type="text"
                      required
                      value={fullEditBattery.name}
                      onChange={(e) => setFullEditBattery({ ...fullEditBattery, name: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-700 font-semibold mb-1">Brand</label>
                    <select
                      value={fullEditBattery.brand}
                      onChange={(e) => setFullEditBattery({ ...fullEditBattery, brand: e.target.value as BatteryBrand })}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg font-medium"
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
                    <label className="block text-neutral-700 font-semibold mb-1">Category</label>
                    <select
                      value={fullEditBattery.category}
                      onChange={(e) => setFullEditBattery({ ...fullEditBattery, category: e.target.value as BatteryCategory })}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg font-medium"
                    >
                      <option value="inverter-machine">Inverter & Home UPS (Machine)</option>
                      <option value="inverter">Inverter Battery (Tubular)</option>
                      <option value="car">Car Battery</option>
                      <option value="two-wheeler">Two-Wheeler Battery</option>
                      <option value="commercial">Commercial & Heavy SUV</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-neutral-700 font-semibold mb-1">Internal Technology</label>
                    <select
                      value={fullEditBattery.technology}
                      onChange={(e) => setFullEditBattery({ ...fullEditBattery, technology: e.target.value as any })}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg font-medium"
                    >
                      <option value="Pure Sine Wave">Pure Sine Wave</option>
                      <option value="Digital UPS">Digital UPS</option>
                      <option value="Solar Hybrid">Solar Hybrid</option>
                      <option value="Inverter + Battery Combo">Inverter + Battery Combo</option>
                      <option value="Tall Tubular">Tall Tubular</option>
                      <option value="Short Tubular">Short Tubular</option>
                      <option value="Maintenance Free (SMF)">Maintenance Free (SMF)</option>
                      <option value="Flooded Lead Acid">Flooded Lead Acid</option>
                      <option value="VRLA">VRLA</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* PRICING & INVENTORY */}
              <div className="space-y-3">
                <h4 className="font-bold text-neutral-900 uppercase tracking-wider">
                  Pricing & Stock Control
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-neutral-700 font-semibold mb-1">Price With Scrap Exchange (₹)</label>
                    <input
                      type="number"
                      required
                      value={fullEditBattery.priceWithExchange}
                      onChange={(e) => setFullEditBattery({ ...fullEditBattery, priceWithExchange: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-700 font-semibold mb-1">Price Without Exchange (₹)</label>
                    <input
                      type="number"
                      required
                      value={fullEditBattery.priceWithoutExchange}
                      onChange={(e) => setFullEditBattery({ ...fullEditBattery, priceWithoutExchange: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-700 font-semibold mb-1">Available Stock (Units)</label>
                    <input
                      type="number"
                      required
                      value={fullEditBattery.stockCount}
                      onChange={(e) => setFullEditBattery({ ...fullEditBattery, stockCount: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* TECHNICAL SPECIFICATIONS */}
              <div className="space-y-3">
                <h4 className="font-bold text-neutral-900 uppercase tracking-wider">
                  Technical Specifications
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {fullEditBattery.category === 'inverter-machine' ? (
                    <>
                      <div>
                        <label className="block text-neutral-700 font-semibold mb-1">VA Rating (VA)</label>
                        <input
                          type="number"
                          value={fullEditBattery.vaRating || 900}
                          onChange={(e) => setFullEditBattery({ ...fullEditBattery, vaRating: Number(e.target.value) })}
                          className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-neutral-700 font-semibold mb-1">Wattage (Watts)</label>
                        <input
                          type="number"
                          value={fullEditBattery.outputWatts || 756}
                          onChange={(e) => setFullEditBattery({ ...fullEditBattery, outputWatts: Number(e.target.value) })}
                          className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg font-mono"
                        />
                      </div>
                    </>
                  ) : (
                    <div>
                      <label className="block text-neutral-700 font-semibold mb-1">Capacity (Ah)</label>
                      <input
                        type="number"
                        value={fullEditBattery.capacityAh}
                        onChange={(e) => setFullEditBattery({ ...fullEditBattery, capacityAh: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg font-mono"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-neutral-700 font-semibold mb-1">Voltage (V)</label>
                    <input
                      type="number"
                      value={fullEditBattery.voltage}
                      onChange={(e) => setFullEditBattery({ ...fullEditBattery, voltage: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-700 font-semibold mb-1">Warranty (Months)</label>
                    <input
                      type="number"
                      value={fullEditBattery.warrantyMonths}
                      onChange={(e) => setFullEditBattery({ ...fullEditBattery, warrantyMonths: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-700 font-semibold mb-1">Weight (Kg)</label>
                    <input
                      type="number"
                      value={fullEditBattery.weightKg || 0}
                      onChange={(e) => setFullEditBattery({ ...fullEditBattery, weightKg: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Warranty Terms Breakdown</label>
                  <input
                    type="text"
                    value={fullEditBattery.warrantyType}
                    onChange={(e) => setFullEditBattery({ ...fullEditBattery, warrantyType: e.target.value })}
                    placeholder="e.g. 36 Months Free Replacement + 18 Months Pro-Rata"
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Dimensions (L x W x H mm)</label>
                  <input
                    type="text"
                    value={fullEditBattery.dimensions || ''}
                    onChange={(e) => setFullEditBattery({ ...fullEditBattery, dimensions: e.target.value })}
                    placeholder="502 x 191 x 440 mm"
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              {/* APPLICATION & FEATURES */}
              <div className="space-y-3">
                <h4 className="font-bold text-neutral-900 uppercase tracking-wider">
                  Vehicle Compatibility & Features
                </h4>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">
                    Recommended Vehicles / Applications (comma-separated):
                  </label>
                  <input
                    type="text"
                    value={editAppString}
                    onChange={(e) => setEditAppString(e.target.value)}
                    placeholder="Maruti Swift, Baleno, WagonR, Wagholi Apartments"
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">
                    Bullet Features (comma-separated):
                  </label>
                  <textarea
                    rows={2}
                    value={editFeatString}
                    onChange={(e) => setEditFeatString(e.target.value)}
                    placeholder="High cranking amps, Spill proof vents, Heavy duty spines"
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg"
                  />
                </div>
              </div>

              {/* SAVE / CANCEL / DELETE BUTTONS */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => {
                    const bat = fullEditBattery;
                    setFullEditBattery(null);
                    setItemToDelete({
                      type: 'battery',
                      id: bat.id,
                      name: `${bat.brand} ${bat.name}`,
                      detail: `Category: ${bat.category} · ${bat.capacityAh}Ah · ₹${bat.priceWithExchange.toLocaleString('en-IN')}`
                    });
                  }}
                  className="py-2.5 px-3.5 rounded-xl bg-red-50 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white font-bold text-xs cursor-pointer flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Model from Catalog</span>
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setFullEditBattery(null)}
                    className="py-2.5 px-4 rounded-xl bg-neutral-100 text-neutral-700 font-bold hover:bg-neutral-200 cursor-pointer text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 font-black shadow-md shadow-amber-500/20 cursor-pointer flex items-center gap-1.5 text-xs"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save All Changes</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Battery Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-neutral-200 my-8">
            <h2 className="text-xl font-bold font-display text-neutral-900 mb-4">
              Add New Battery Model to Catalog
            </h2>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Battery Model Name *</label>
                <input
                  type="text"
                  required
                  value={newModel.name}
                  onChange={(e) => setNewModel({ ...newModel, name: e.target.value })}
                  placeholder="e.g. Exide Inva Red 500"
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Brand</label>
                  <select
                    value={newModel.brand}
                    onChange={(e) => setNewModel({ ...newModel, brand: e.target.value as BatteryBrand })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg"
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
                  <label className="block font-semibold text-neutral-700 mb-1">Category</label>
                  <select
                    value={newModel.category}
                    onChange={(e) => setNewModel({ ...newModel, category: e.target.value as BatteryCategory })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg"
                  >
                    <option value="inverter-machine">Inverter & Home UPS (Machine)</option>
                    <option value="inverter">Inverter Battery (Tubular)</option>
                    <option value="car">Car Battery</option>
                    <option value="two-wheeler">Two-Wheeler Battery</option>
                    <option value="commercial">Commercial / SUV</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Internal Technology</label>
                <select
                  value={newModel.technology}
                  onChange={(e) => setNewModel({ ...newModel, technology: e.target.value as any })}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg"
                >
                  <option value="Pure Sine Wave">Pure Sine Wave</option>
                  <option value="Digital UPS">Digital UPS</option>
                  <option value="Solar Hybrid">Solar Hybrid</option>
                  <option value="Inverter + Battery Combo">Inverter + Battery Combo</option>
                  <option value="Tall Tubular">Tall Tubular</option>
                  <option value="Short Tubular">Short Tubular</option>
                  <option value="Maintenance Free (SMF)">Maintenance Free (SMF)</option>
                  <option value="Flooded Lead Acid">Flooded Lead Acid</option>
                  <option value="VRLA">VRLA</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Price With Exchange (₹)</label>
                  <input
                    type="number"
                    value={newModel.priceWithExchange}
                    onChange={(e) => setNewModel({ ...newModel, priceWithExchange: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Price Without Exchange (₹)</label>
                  <input
                    type="number"
                    value={newModel.priceWithoutExchange}
                    onChange={(e) => setNewModel({ ...newModel, priceWithoutExchange: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {newModel.category === 'inverter-machine' ? (
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">VA Rating (VA)</label>
                    <input
                      type="number"
                      value={newModel.vaRating || 900}
                      onChange={(e) => setNewModel({ ...newModel, vaRating: Number(e.target.value) })}
                      placeholder="900"
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg font-mono"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block font-semibold text-neutral-700 mb-1">Capacity (Ah)</label>
                    <input
                      type="number"
                      value={newModel.capacityAh}
                      onChange={(e) => setNewModel({ ...newModel, capacityAh: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg font-mono"
                    />
                  </div>
                )}
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">Warranty (Months)</label>
                  <input
                    type="number"
                    value={newModel.warrantyMonths}
                    onChange={(e) => setNewModel({ ...newModel, warrantyMonths: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Optional Picture URL</label>
                <input
                  type="url"
                  value={newModel.imageUrl || ''}
                  onChange={(e) => setNewModel({ ...newModel, imageUrl: e.target.value })}
                  placeholder="https://example.com/battery.png"
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="py-2 px-4 rounded-lg bg-neutral-100 text-neutral-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-lg bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold"
                >
                  Save Model
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ACTIVE IN-APP DELETE CONFIRMATION MODAL */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-neutral-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-display text-neutral-900">
                  Confirm Deletion
                </h3>
                <p className="text-xs text-neutral-500">
                  Are you sure you want to permanently delete this {itemToDelete.type}?
                </p>
              </div>
            </div>

            <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200 space-y-1">
              <div className="font-bold text-sm text-neutral-900">
                {itemToDelete.name}
              </div>
              {itemToDelete.detail && (
                <div className="text-xs text-neutral-600">
                  {itemToDelete.detail}
                </div>
              )}
            </div>

            <div className="text-xs text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
              ⚠️ This will immediately remove this {itemToDelete.type} from the owner panel and store database.
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="py-2.5 px-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="py-2.5 px-5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs cursor-pointer flex items-center gap-1.5 transition-colors shadow-sm shadow-red-600/30"
              >
                <Trash2 className="w-4 h-4" />
                <span>Yes, Delete Now</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
