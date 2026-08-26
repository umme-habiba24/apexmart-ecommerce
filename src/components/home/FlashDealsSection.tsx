"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Zap, Clock, ArrowRight } from "lucide-react";
import { Product } from "@/types";
import { ProductCard } from "@/components/products/ProductCard";

interface FlashDealsSectionProps {
  products: Product[];
}

export function FlashDealsSection({ products }: FlashDealsSectionProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 42,
    seconds: 19,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const dealProducts = products.filter((p) => p.compareAtPrice || p.isTrending).slice(0, 4);

  return (
    <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-indigo-950/40 border border-rose-500/20 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider mb-1">
            <Zap className="w-4 h-4 fill-rose-400" />
            <span>Limited Time Offer</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Flash Deals & Special Offers
          </h2>
        </div>

        {/* Live Countdown Timer */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-300 mr-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-rose-400" /> Ends In:
          </span>
          <div className="flex items-center gap-1.5 font-mono font-bold text-sm">
            <div className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white shadow-inner">
              {String(timeLeft.hours).padStart(2, "0")}h
            </div>
            <span className="text-slate-500">:</span>
            <div className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white shadow-inner">
              {String(timeLeft.minutes).padStart(2, "0")}m
            </div>
            <span className="text-slate-500">:</span>
            <div className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-rose-400 shadow-inner">
              {String(timeLeft.seconds).padStart(2, "0")}s
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {dealProducts.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
