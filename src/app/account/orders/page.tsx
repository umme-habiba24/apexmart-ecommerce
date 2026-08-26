"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { InternshipTourModal } from "@/components/layout/InternshipTourModal";
import { Order } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useCart } from "@/context/CartContext";
import {
  Package,
  Truck,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  ShoppingBag,
  RotateCcw,
} from "lucide-react";

export default function OrderHistoryPage() {
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const { addToCart, openCart } = useCart();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tourOpen, setTourOpen] = useState(false);

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        if (data.orders) setOrders(data.orders);
      } catch (e) {
        console.error("Failed to load orders", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadOrders();
  }, []);

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
          <Link href="/account" className="hover:text-white transition-colors">Account</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-200 font-medium">Order History</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              <Package className="w-7 h-7 text-indigo-400" />
              <span>Order History & Invoices</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Review previous purchases, tracking links, and download invoices
            </p>
          </div>

          <Link
            href="/products"
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors shadow-md shadow-indigo-600/30 self-start sm:self-auto"
          >
            Explore Catalog
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 animate-pulse h-40" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="py-20 text-center rounded-3xl bg-slate-900/60 border border-slate-800 p-8 space-y-4 max-w-md mx-auto">
            <Package className="w-12 h-12 text-slate-600 mx-auto" />
            <h2 className="text-lg font-bold text-white">No Orders Found</h2>
            <p className="text-xs text-slate-400">You haven't placed any orders yet.</p>
            <Link
              href="/products"
              className="inline-block px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-sm text-white">
                        {order.orderNumber}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
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
                    <span className="text-slate-400 mt-1 block">
                      Placed on{" "}
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Recent"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-bold text-emerald-400 text-base">
                      {formatPrice(order.total)}
                    </span>
                    <Link
                      href={`/track-order?orderId=${order.orderNumber}`}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Track Shipment</span>
                    </Link>
                  </div>
                </div>

                {/* Items in order */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {order.items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-xl object-cover bg-slate-800 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/products/${item.slug}`}
                          className="font-bold text-white hover:text-indigo-400 truncate block"
                        >
                          {item.name}
                        </Link>
                        <p className="text-slate-400 text-[11px]">
                          Qty: {item.quantity} • {formatPrice(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
