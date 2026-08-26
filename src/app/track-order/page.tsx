"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { InternshipTourModal } from "@/components/layout/InternshipTourModal";
import { Order } from "@/types";
import { useCurrency } from "@/context/CurrencyContext";
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Printer,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialOrderId = searchParams.get("orderId") || "APX-89210";

  const { formatPrice } = useCurrency();
  const [orderQuery, setOrderQuery] = useState(initialOrderId);
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [tourOpen, setTourOpen] = useState(false);

  useEffect(() => {
    if (initialOrderId) {
      handleSearchOrder(initialOrderId);
    }
  }, [initialOrderId]);

  const handleSearchOrder = async (orderNumber: string) => {
    const cleanNumber = orderNumber.trim();
    if (!cleanNumber) return;

    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(cleanNumber)}`);
      const data = await res.json();
      if (data.order) {
        setOrder(data.order);
      } else {
        setOrder(null);
        setErrorMsg(`No order found matching "${cleanNumber}". Try sample order APX-89210, APX-77412, or APX-65109.`);
      }
    } catch {
      setErrorMsg("Failed to query order tracking database. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStageIndex = (status: string) => {
    switch (status?.toLowerCase()) {
      case "processing":
        return 1;
      case "confirmed":
        return 2;
      case "shipped":
        return 3;
      case "out_for_delivery":
        return 4;
      case "delivered":
        return 5;
      default:
        return 1;
    }
  };

  const currentStage = order ? getStageIndex(order.orderStatus) : 1;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Header onOpenTour={() => setTourOpen(true)} />
      <CartDrawer />
      <InternshipTourModal isOpen={tourOpen} onClose={() => setTourOpen(false)} />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-200 font-medium">Order Tracker</span>
        </nav>

        {/* Header & Search Bar */}
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              <Package className="w-7 h-7 text-indigo-400" />
              <span>Real-Time Order Tracking</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Enter your APX order number to inspect shipment milestones, carrier route, and printable receipts
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
                placeholder="Enter Order # (e.g. APX-89210 or APX-77412)"
                className="w-full bg-slate-900 border border-slate-700 text-sm rounded-2xl pl-10 pr-4 py-3 text-white placeholder-slate-400 font-mono focus:outline-none focus:border-indigo-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>

            <button
              onClick={() => handleSearchOrder(orderQuery)}
              disabled={isLoading || !orderQuery.trim()}
              className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50 shrink-0"
            >
              {isLoading ? "Searching..." : "Track Shipment"}
            </button>
          </div>

          {/* Sample shortcuts */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Demo Test Numbers:</span>
            <button
              onClick={() => {
                setOrderQuery("APX-89210");
                handleSearchOrder("APX-89210");
              }}
              className="text-indigo-400 hover:underline font-mono font-bold"
            >
              APX-89210 (Shipped)
            </button>
            <span>•</span>
            <button
              onClick={() => {
                setOrderQuery("APX-77412");
                handleSearchOrder("APX-77412");
              }}
              className="text-indigo-400 hover:underline font-mono font-bold"
            >
              APX-77412 (Delivered)
            </button>
            <span>•</span>
            <button
              onClick={() => {
                setOrderQuery("APX-94812");
                handleSearchOrder("APX-94812");
              }}
              className="text-indigo-400 hover:underline font-mono font-bold"
            >
              APX-94812 (Processing)
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {order && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Status Card Header */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black text-white font-mono">
                      {order.orderNumber}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        order.orderStatus === "delivered"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : order.orderStatus === "shipped"
                          ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Placed on{" "}
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Recently"}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => window.print()}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Invoice</span>
                  </button>
                </div>
              </div>

              {/* Visual 5-Stage Timeline */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300 mb-6">
                  Shipment Progression
                </h4>

                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute top-4 left-6 right-6 h-1 bg-slate-800 -z-0">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 transition-all duration-700"
                      style={{
                        width: `${Math.min(100, ((currentStage - 1) / 4) * 100)}%`,
                      }}
                    />
                  </div>

                  {/* 5 Milestones */}
                  <div className="grid grid-cols-5 text-center relative z-10">
                    {/* Stage 1 */}
                    <div className="flex flex-col items-center space-y-2">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                          currentStage >= 1
                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                            : "bg-slate-800 text-slate-500"
                        }`}
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-white">Order Placed</span>
                      <span className="text-[10px] text-slate-400 hidden sm:block">Verified</span>
                    </div>

                    {/* Stage 2 */}
                    <div className="flex flex-col items-center space-y-2">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                          currentStage >= 2
                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                            : "bg-slate-800 text-slate-500"
                        }`}
                      >
                        <Package className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-white">Packed</span>
                      <span className="text-[10px] text-slate-400 hidden sm:block">Apex Center</span>
                    </div>

                    {/* Stage 3 */}
                    <div className="flex flex-col items-center space-y-2">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                          currentStage >= 3
                            ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                            : "bg-slate-800 text-slate-500"
                        }`}
                      >
                        <Truck className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-white">In Transit</span>
                      <span className="text-[10px] text-slate-400 hidden sm:block">{order.carrier}</span>
                    </div>

                    {/* Stage 4 */}
                    <div className="flex flex-col items-center space-y-2">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                          currentStage >= 4
                            ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                            : "bg-slate-800 text-slate-500"
                        }`}
                      >
                        <MapPin className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-white">Out for Delivery</span>
                      <span className="text-[10px] text-slate-400 hidden sm:block">Local Hub</span>
                    </div>

                    {/* Stage 5 */}
                    <div className="flex flex-col items-center space-y-2">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                          currentStage >= 5
                            ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                            : "bg-slate-800 text-slate-500"
                        }`}
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-white">Delivered</span>
                      <span className="text-[10px] text-slate-400 hidden sm:block">Front Door</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Courier & Tracking Bar */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-400">Tracking Number</span>
                  <p className="font-mono font-bold text-indigo-300 text-sm mt-0.5">
                    {order.trackingNumber || "Assigned on Dispatch"}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Carrier Service</span>
                  <p className="font-bold text-white mt-0.5">{order.carrier || "FedEx Ground"}</p>
                </div>
                <div>
                  <span className="text-slate-400">Payment Status</span>
                  <p className="font-bold text-emerald-400 mt-0.5 capitalize">{order.paymentStatus} via {order.paymentMethod}</p>
                </div>
              </div>
            </div>

            {/* Items & Financial Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Items List */}
              <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <h4 className="font-bold text-sm text-white pb-3 border-b border-slate-800">
                  Shipped Items ({order.items?.length || 0})
                </h4>

                <div className="space-y-3 divide-y divide-slate-800/60">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="pt-3 first:pt-0 flex items-center gap-3 text-xs">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 rounded-xl object-cover bg-slate-800 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/products/${item.slug}`}
                          className="font-bold text-white hover:text-indigo-400 transition-colors line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        <p className="text-slate-400 text-[11px] mt-0.5">
                          Quantity: {item.quantity} {item.color ? `• Color: ${item.color}` : ""}
                        </p>
                      </div>
                      <span className="font-bold text-emerald-400 text-sm">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address & Invoice Summary */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
                  <h4 className="font-bold text-sm text-white pb-2 border-b border-slate-800">
                    Delivery Address
                  </h4>
                  <p className="font-bold text-white">{order.customerName}</p>
                  <p className="text-slate-300">{order.shippingAddress?.street}</p>
                  <p className="text-slate-400">
                    {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}
                  </p>
                  <p className="text-slate-400">{order.shippingAddress?.country}</p>
                  {order.customerPhone && (
                    <p className="text-slate-400 pt-1">Phone: {order.customerPhone}</p>
                  )}
                </div>

                <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2.5 text-xs">
                  <h4 className="font-bold text-sm text-white pb-2 border-b border-slate-800">
                    Order Financials
                  </h4>
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal:</span>
                    <span className="text-white">{formatPrice(order.subtotal)}</span>
                  </div>
                  {parseFloat(order.discount) > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Discount ({order.couponCode || "PROMO"}):</span>
                      <span>-{formatPrice(order.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-400">
                    <span>Shipping Fee:</span>
                    <span className="text-white">
                      {parseFloat(order.shippingFee) === 0 ? "FREE" : formatPrice(order.shippingFee)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Sales Tax:</span>
                    <span className="text-white">{formatPrice(order.tax)}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-800 flex justify-between font-black text-sm text-white">
                    <span>Total Paid:</span>
                    <span className="text-emerald-400 text-base">{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading Tracker...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
