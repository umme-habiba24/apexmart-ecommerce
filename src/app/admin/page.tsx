"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { InternshipTourModal } from "@/components/layout/InternshipTourModal";
import { Product, Order, Category, Coupon } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useToast } from "@/context/ToastContext";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Layers,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Package,
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  Truck,
  Sparkles,
  Tag,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  X,
  Eye,
} from "lucide-react";

export default function AdminPage() {
  const { user, isAdmin, loginAs } = useAuth();
  const { formatPrice } = useCurrency();
  const { success, error, info } = useToast();

  const [activeTab, setActiveTab] = useState<"overview" | "products" | "orders" | "coupons">("overview");
  const [stats, setStats] = useState<any>(null);
  const [salesChart, setSalesChart] = useState<any[]>([]);
  const [categoryDist, setCategoryDist] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tourOpen, setTourOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // New product modal state
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProdName, setNewProdName] = useState("");
  const [newProdCategory, setNewProdCategory] = useState("audio");
  const [newProdPrice, setNewProdPrice] = useState("");
  const [newProdComparePrice, setNewProdComparePrice] = useState("");
  const [newProdStock, setNewProdStock] = useState("25");
  const [newProdBrand, setNewProdBrand] = useState("ApexPro");
  const [newProdImage, setNewProdImage] = useState("");
  const [newProdDesc, setNewProdDesc] = useState("");
  const [newProdFeatured, setNewProdFeatured] = useState(false);

  // New coupon modal state
  const [showAddCouponModal, setShowAddCouponModal] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState("");
  const [newCouponDesc, setNewCouponDesc] = useState("");
  const [newCouponDiscount, setNewCouponDiscount] = useState("15");
  const [newCouponMinSpend, setNewCouponMinSpend] = useState("50");

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, prodRes, orderRes, coupRes, catRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/products?limit=100"),
        fetch("/api/orders"),
        fetch("/api/coupons"),
        fetch("/api/categories"),
      ]);

      const statsData = await statsRes.json();
      const prodData = await prodRes.json();
      const orderData = await orderRes.json();
      const coupData = await coupRes.json();
      const catData = await catRes.json();

      if (statsData.stats) setStats(statsData.stats);
      if (statsData.salesChartData) setSalesChart(statsData.salesChartData);
      if (statsData.categoryDistribution) setCategoryDist(statsData.categoryDistribution);
      if (prodData.products) setProducts(prodData.products);
      if (orderData.orders) setOrders(orderData.orders);
      if (coupData.coupons) setCoupons(coupData.coupons);
      if (catData.categories) setCategories(catData.categories);
    } catch (e) {
      console.error("Failed to load admin stats", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleResetDb = async () => {
    setIsResetting(true);
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        success("Database reset with initial products and sample records!", "Database Reset");
        loadAdminData();
      }
    } catch {
      error("Failed to reset database", "Error");
    } finally {
      setIsResetting(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice) {
      error("Please enter product name and price", "Missing Information");
      return;
    }

    try {
      const foundCat = categories.find((c) => c.slug === newProdCategory);
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newProdName,
          categorySlug: newProdCategory,
          categoryName: foundCat?.name || "General",
          price: newProdPrice,
          compareAtPrice: newProdComparePrice || null,
          stock: parseInt(newProdStock) || 10,
          brand: newProdBrand,
          description: newProdDesc || "High quality gear crafted for professionals.",
          images: newProdImage
            ? [newProdImage]
            : ["https://images.pexels.com/photos/577768/pexels-photo-577768.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"],
          isFeatured: newProdFeatured,
        }),
      });

      const data = await res.json();
      if (data.success && data.product) {
        setProducts([data.product, ...products]);
        setShowAddProductModal(false);
        setNewProdName("");
        setNewProdPrice("");
        setNewProdComparePrice("");
        setNewProdDesc("");
        setNewProdImage("");
        success("Product created and published to live store catalog!", "Product Added");
      }
    } catch {
      error("Failed to create product", "Error");
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setProducts(products.filter((p) => p.id !== id));
        success("Product removed from database", "Deleted");
      }
    } catch {
      error("Failed to delete product", "Error");
    }
  };

  const handleUpdateStock = async (id: number, newStock: number) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: Math.max(0, newStock) }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts(products.map((p) => (p.id === id ? { ...p, stock: newStock } : p)));
        success(`Stock updated to ${newStock} units`, "Inventory Updated");
      }
    } catch {
      error("Failed to update stock", "Error");
    }
  };

  const handleUpdateOrderStatus = async (orderId: number, orderStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders(orders.map((o) => (o.id === orderId ? { ...o, orderStatus } : o)));
        success(`Order status updated to ${orderStatus}`, "Fulfillment Status Changed");
      }
    } catch {
      error("Failed to update status", "Error");
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode || !newCouponDiscount) return;

    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: newCouponCode,
          description: newCouponDesc || `${newCouponDiscount}% Discount`,
          discountType: "percent",
          discountValue: newCouponDiscount,
          minSpend: newCouponMinSpend,
        }),
      });

      const data = await res.json();
      if (data.success && data.coupon) {
        setCoupons([data.coupon, ...coupons]);
        setShowAddCouponModal(false);
        setNewCouponCode("");
        setNewCouponDesc("");
        success(`Coupon ${data.coupon.code} is now live!`, "Promo Code Created");
      }
    } catch {
      error("Failed to create coupon", "Error");
    }
  };

  const COLORS = ["#6366f1", "#a855f7", "#ec4899", "#10b981", "#f59e0b", "#3b82f6"];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Header onOpenTour={() => setTourOpen(true)} />
      <InternshipTourModal isOpen={tourOpen} onClose={() => setTourOpen(false)} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Admin Header Bar */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border border-purple-500/30 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  Executive Store Management
                </h1>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Full Access
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time sales analytics, live order fulfillment, inventory health & promo campaigns
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleResetDb}
              disabled={isResetting}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isResetting ? "animate-spin" : ""}`} />
              <span>{isResetting ? "Resetting..." : "Reset Store Data"}</span>
            </button>

            <button
              onClick={() => loginAs("customer")}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all"
            >
              Switch to Customer View
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-3 px-4 text-xs font-bold rounded-xl transition-all flex items-center gap-2 shrink-0 ${
              activeTab === "overview"
                ? "bg-purple-600 text-white shadow-md"
                : "text-slate-400 hover:bg-slate-900 hover:text-white"
            }`}
          >
            <TrendingUp className="w-4 h-4" /> Overview & Charts
          </button>

          <button
            onClick={() => setActiveTab("products")}
            className={`py-3 px-4 text-xs font-bold rounded-xl transition-all flex items-center gap-2 shrink-0 ${
              activeTab === "products"
                ? "bg-purple-600 text-white shadow-md"
                : "text-slate-400 hover:bg-slate-900 hover:text-white"
            }`}
          >
            <Package className="w-4 h-4" /> Products & Inventory ({products.length})
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`py-3 px-4 text-xs font-bold rounded-xl transition-all flex items-center gap-2 shrink-0 ${
              activeTab === "orders"
                ? "bg-purple-600 text-white shadow-md"
                : "text-slate-400 hover:bg-slate-900 hover:text-white"
            }`}
          >
            <Truck className="w-4 h-4" /> Order Fulfillment ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab("coupons")}
            className={`py-3 px-4 text-xs font-bold rounded-xl transition-all flex items-center gap-2 shrink-0 ${
              activeTab === "coupons"
                ? "bg-purple-600 text-white shadow-md"
                : "text-slate-400 hover:bg-slate-900 hover:text-white"
            }`}
          >
            <Tag className="w-4 h-4" /> Coupons & Promos ({coupons.length})
          </button>
        </div>

        {/* TAB 1: OVERVIEW & ANALYTICS */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Total Revenue
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-white">{formatPrice(stats?.totalRevenue || 1093.19)}</p>
                <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +18.4% this week
                </span>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Total Orders
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-white">{stats?.totalOrders || orders.length || 4}</p>
                <span className="text-[11px] text-indigo-300 font-medium">
                  {orders.filter((o) => o.orderStatus === "processing").length} pending dispatch
                </span>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Avg Order Value (AOV)
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-white">
                  {formatPrice(stats?.avgOrderValue || 273.3)}
                </p>
                <span className="text-[11px] text-purple-300 font-medium">Per customer checkout</span>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Low Stock Alerts
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-white">
                  {stats?.lowStockCount || products.filter((p) => p.stock <= 15).length}
                </p>
                <span className="text-[11px] text-amber-400 font-medium">Items with ≤ 15 units left</span>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Daily Sales Area Chart */}
              <div className="lg:col-span-8 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-white">Daily Revenue Progression</h3>
                    <p className="text-xs text-slate-400">Gross sales volume over the last 7 days</p>
                  </div>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={salesChart.length > 0 ? salesChart : [
                      { date: "Day 1", revenue: 240 },
                      { date: "Day 2", revenue: 380 },
                      { date: "Day 3", revenue: 520 },
                      { date: "Day 4", revenue: 290 },
                      { date: "Day 5", revenue: 640 },
                      { date: "Day 6", revenue: 490 },
                      { date: "Today", revenue: 820 },
                    ]}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                      <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `$${v}`} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          borderColor: "#334155",
                          borderRadius: "12px",
                          fontSize: "12px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#8b5cf6"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorRev)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Category Sales Breakdown */}
              <div className="lg:col-span-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
                <div>
                  <h3 className="font-bold text-sm text-white">Sales By Category</h3>
                  <p className="text-xs text-slate-400">Revenue split across collections</p>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryDist.length > 0 ? categoryDist : [
                      { name: "Audio", value: 440 },
                      { name: "Wearables", value: 350 },
                      { name: "Fashion", value: 280 },
                      { name: "Home", value: 210 },
                    ]}>
                      <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                      <YAxis stroke="#64748b" fontSize={10} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          borderColor: "#334155",
                          borderRadius: "12px",
                          fontSize: "12px",
                        }}
                      />
                      <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS & INVENTORY MANAGEMENT */}
        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-base text-white">Live Product Catalog & Stock</h3>
                <p className="text-xs text-slate-400">
                  Update inventory levels, toggle featured tags, or publish new store items
                </p>
              </div>

              <button
                onClick={() => setShowAddProductModal(true)}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/30 transition-all self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Product</span>
              </button>
            </div>

            {/* Product Table */}
            <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="p-4">Product</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Stock Level</th>
                      <th className="p-4">Rating</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          <img
                            src={p.images?.[0]}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover bg-slate-800 shrink-0"
                          />
                          <div>
                            <Link
                              href={`/products/${p.slug}`}
                              className="font-bold text-white hover:text-indigo-400 transition-colors line-clamp-1"
                            >
                              {p.name}
                            </Link>
                            <span className="text-[10px] text-slate-500">{p.sku || "APX-SKU"}</span>
                          </div>
                        </td>
                        <td className="p-4 text-slate-300">{p.categoryName}</td>
                        <td className="p-4 font-bold text-emerald-400">{formatPrice(p.price)}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-bold px-2 py-0.5 rounded-md ${
                                p.stock <= 5
                                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                                  : p.stock <= 15
                                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                  : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              }`}
                            >
                              {p.stock} in stock
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleUpdateStock(p.id, p.stock - 1)}
                                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                              >
                                -
                              </button>
                              <button
                                onClick={() => handleUpdateStock(p.id, p.stock + 5)}
                                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                              >
                                +5
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-amber-400 font-bold">{p.rating || "4.8"}★</span>{" "}
                          <span className="text-slate-500">({p.reviewCount || 0})</span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS FULFILLMENT */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-base text-white">Active Orders & Shipment Workflow</h3>
              <p className="text-xs text-slate-400">
                Update delivery progress, mark orders as dispatched, or assign carriers
              </p>
            </div>

            <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="p-4">Order #</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Items</th>
                      <th className="p-4">Total</th>
                      <th className="p-4">Payment</th>
                      <th className="p-4">Fulfillment Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-4">
                          <Link
                            href={`/track-order?orderId=${o.orderNumber}`}
                            className="font-mono font-bold text-indigo-400 hover:underline flex items-center gap-1"
                          >
                            <span>{o.orderNumber}</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                          <span className="text-[10px] text-slate-500 block">
                            {o.trackingNumber || "Assigned"}
                          </span>
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-white">{o.customerName}</p>
                          <p className="text-[11px] text-slate-400">{o.customerEmail}</p>
                        </td>
                        <td className="p-4">
                          <span className="font-semibold text-slate-300">
                            {o.items?.length || 1} items
                          </span>
                        </td>
                        <td className="p-4 font-bold text-emerald-400">{formatPrice(o.total)}</td>
                        <td className="p-4">
                          <span className="capitalize px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                            {o.paymentMethod}
                          </span>
                        </td>
                        <td className="p-4">
                          <select
                            value={o.orderStatus}
                            onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                            className={`text-xs rounded-xl px-2.5 py-1.5 border font-semibold focus:outline-none ${
                              o.orderStatus === "delivered"
                                ? "bg-emerald-950 text-emerald-300 border-emerald-700"
                                : o.orderStatus === "shipped"
                                ? "bg-purple-950 text-purple-300 border-purple-700"
                                : "bg-amber-950 text-amber-300 border-amber-700"
                            }`}
                          >
                            <option value="processing">Processing</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="shipped">Shipped</option>
                            <option value="out_for_delivery">Out for Delivery</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: COUPONS & PROMOS */}
        {activeTab === "coupons" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-base text-white">Promo Codes & Discounts</h3>
                <p className="text-xs text-slate-400">
                  Create store coupons and manage percentage discounts
                </p>
              </div>

              <button
                onClick={() => setShowAddCouponModal(true)}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/30 transition-all self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Create Promo Code</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {coupons.map((c) => (
                <div
                  key={c.id}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-sm text-indigo-400 uppercase tracking-wider">
                      {c.code}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{c.description}</p>
                  <p className="text-[11px] text-slate-500">
                    Min Spend: {formatPrice(c.minSpend || 0)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal: Add New Product */}
        {showAddProductModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="font-bold text-base text-white">Publish New Product</h3>
                <button
                  onClick={() => setShowAddProductModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateProduct} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    placeholder="e.g. Apex Ultra ANC Headphones"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Category</label>
                    <select
                      value={newProdCategory}
                      onChange={(e) => setNewProdCategory(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.slug}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Brand</label>
                    <input
                      type="text"
                      value={newProdBrand}
                      onChange={(e) => setNewProdBrand(e.target.value)}
                      placeholder="ApexMart"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(e.target.value)}
                      placeholder="199.99"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Compare Price</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newProdComparePrice}
                      onChange={(e) => setNewProdComparePrice(e.target.value)}
                      placeholder="249.99"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Initial Stock</label>
                    <input
                      type="number"
                      value={newProdStock}
                      onChange={(e) => setNewProdStock(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Image URL</label>
                  <input
                    type="url"
                    value={newProdImage}
                    onChange={(e) => setNewProdImage(e.target.value)}
                    placeholder="https://images.pexels.com/..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={newProdDesc}
                    onChange={(e) => setNewProdDesc(e.target.value)}
                    placeholder="Product highlights and details..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={newProdFeatured}
                      onChange={(e) => setNewProdFeatured(e.target.checked)}
                      className="rounded bg-slate-950 text-purple-600"
                    />
                    <span>Mark as Featured Product</span>
                  </label>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/30"
                  >
                    Save & Publish
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Add Coupon */}
        {showAddCouponModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="font-bold text-base text-white">Create Promo Code</h3>
                <button
                  onClick={() => setShowAddCouponModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateCoupon} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Coupon Code</label>
                  <input
                    type="text"
                    required
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                    placeholder="e.g. VIP30"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Discount %</label>
                  <input
                    type="number"
                    required
                    value={newCouponDiscount}
                    onChange={(e) => setNewCouponDiscount(e.target.value)}
                    placeholder="20"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Min Order Spend ($)</label>
                  <input
                    type="number"
                    value={newCouponMinSpend}
                    onChange={(e) => setNewCouponMinSpend(e.target.value)}
                    placeholder="50"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Description</label>
                  <input
                    type="text"
                    value={newCouponDesc}
                    onChange={(e) => setNewCouponDesc(e.target.value)}
                    placeholder="20% off all orders"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/30"
                >
                  Create Promo Code
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
