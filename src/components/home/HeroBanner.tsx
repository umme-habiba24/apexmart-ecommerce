"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  Zap,
  Tag,
  Star,
} from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";

export function HeroBanner() {
  const { formatPrice } = useCurrency();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/70 to-slate-900 border border-slate-800 shadow-2xl">
      {/* Decorative Glow Elements */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Promo Chip */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/30 text-indigo-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: "6s" }} />
              <span>Internship Capstone Edition 2026</span>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              <span className="text-amber-300 font-mono">Use APEX20 for 20% OFF</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Next-Gen Precision.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
                Acoustics, Wearables & Lifestyle.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
              Experience audiophile studio headphones, titanium biometric wearables, full-grain Italian leather, and ergonomic workspace essentials crafted for modern life.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/products"
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center gap-2 transition-all active:scale-95 group"
              >
                <span>Explore Catalog</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/products?featured=true"
                className="px-6 py-3.5 rounded-2xl bg-slate-800/90 hover:bg-slate-800 text-white font-semibold text-sm border border-slate-700/80 transition-all flex items-center gap-2"
              >
                <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>Featured Deals</span>
              </Link>
            </div>

            {/* Mini Trust Stats */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-left">
              <div>
                <p className="text-lg sm:text-2xl font-black text-white">4.9/5.0</p>
                <div className="flex items-center text-amber-400 text-xs mt-0.5">
                  <Star className="w-3 h-3 fill-amber-400" />
                  <Star className="w-3 h-3 fill-amber-400" />
                  <Star className="w-3 h-3 fill-amber-400" />
                  <Star className="w-3 h-3 fill-amber-400" />
                  <Star className="w-3 h-3 fill-amber-400" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">1,200+ Verified Reviews</p>
              </div>

              <div>
                <p className="text-lg sm:text-2xl font-black text-white">2-Day</p>
                <p className="text-[11px] text-emerald-400 font-semibold mt-0.5">Express Delivery</p>
                <p className="text-[11px] text-slate-400 mt-1">Free over $99</p>
              </div>

              <div>
                <p className="text-lg sm:text-2xl font-black text-white">100%</p>
                <p className="text-[11px] text-purple-400 font-semibold mt-0.5">Authentic Gear</p>
                <p className="text-[11px] text-slate-400 mt-1">2-Yr Full Warranty</p>
              </div>
            </div>
          </div>

          {/* Right Showcase Card Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden bg-slate-800/80 border border-slate-700/80 shadow-2xl p-4 group">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden relative">
                <img
                  src="https://images.pexels.com/photos/577768/pexels-photo-577768.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"
                  alt="Apex ANC Pro Studio Headphones"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                <div className="absolute top-3 left-3 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Flagship Release
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-xs uppercase font-bold tracking-widest text-indigo-400">
                    Audio & Acoustics
                  </span>
                  <h3 className="text-lg font-bold text-white mt-0.5">
                    Apex ANC Pro Studio Headphones
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-black text-emerald-400">
                        {formatPrice(299.99)}
                      </span>
                      <span className="text-xs text-slate-400 line-through">
                        {formatPrice(379.99)}
                      </span>
                    </div>

                    <Link
                      href="/products/apex-anc-pro-headphones"
                      className="px-3.5 py-1.5 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-200 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
