"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Package,
  ArrowRight,
  Printer,
  ShoppingBag,
  Truck,
  ShieldCheck,
} from "lucide-react";
import confetti from "canvas-confetti";
import { Order } from "@/types";
import { useCurrency } from "@/context/CurrencyContext";

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
}

export function OrderSuccessModal({ order, onClose }: OrderSuccessModalProps) {
  const { formatPrice } = useCurrency();

  useEffect(() => {
    if (order) {
      // Fire confetti celebration
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#6366f1", "#a855f7", "#10b981", "#f59e0b"],
        });
      } catch (e) {
        console.error("Confetti trigger failed", e);
      }
    }
  }, [order]);

  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header with checkmark */}
        <div className="p-6 text-center border-b border-slate-800 bg-gradient-to-b from-indigo-950/40 to-slate-900">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-3 shadow-lg shadow-emerald-500/10">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-white">Order Confirmed!</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto">
            Thank you, <strong className="text-white">{order.customerName}</strong>! Your order{" "}
            <span className="text-indigo-400 font-mono font-bold">{order.orderNumber}</span> has been received and is now being prepared for shipping.
          </p>
        </div>

        {/* Order Details Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm text-slate-300">
          {/* Tracking info bar */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-slate-400">Tracking Number:</span>
              <p className="font-mono font-bold text-white text-sm mt-0.5">{order.trackingNumber}</p>
            </div>
            <div>
              <span className="text-slate-400">Carrier & Method:</span>
              <p className="font-semibold text-emerald-400 mt-0.5">{order.carrier || "FedEx Express 2-Day"}</p>
            </div>
            <div>
              <span className="text-slate-400">Estimated Delivery:</span>
              <p className="font-semibold text-white mt-0.5">3 Business Days</p>
            </div>
          </div>

          {/* Items Summary */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              Items in this Shipment ({order.items?.length || 0})
            </h4>
            <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
              {order.items?.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover bg-slate-700 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white truncate">{item.name}</p>
                    <p className="text-slate-400 text-[11px]">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-bold text-emerald-400">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Address and Financials Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800">
              <span className="font-bold text-white uppercase tracking-wider block mb-1.5">
                Delivery Address
              </span>
              <p className="text-slate-300 font-medium">{order.shippingAddress?.street}</p>
              <p className="text-slate-400">
                {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}
              </p>
              <p className="text-slate-400">{order.shippingAddress?.country}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 space-y-1">
              <span className="font-bold text-white uppercase tracking-wider block mb-1.5">
                Payment Summary
              </span>
              <div className="flex justify-between text-slate-400">
                <span>Subtotal:</span>
                <span className="text-white">{formatPrice(order.subtotal)}</span>
              </div>
              {parseFloat(order.discount) > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount:</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400">
                <span>Shipping:</span>
                <span className="text-white">
                  {parseFloat(order.shippingFee) === 0 ? "FREE" : formatPrice(order.shippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Tax:</span>
                <span className="text-white">{formatPrice(order.tax)}</span>
              </div>
              <div className="pt-1.5 border-t border-slate-700 flex justify-between font-bold text-sm text-white">
                <span>Total Paid:</span>
                <span className="text-emerald-400">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition-colors border border-slate-700"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>

          <div className="flex items-center gap-2">
            <Link
              href={`/track-order?orderId=${order.orderNumber}`}
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all"
            >
              <Package className="w-4 h-4" />
              <span>Track Live Status</span>
            </Link>

            <Link
              href="/products"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
