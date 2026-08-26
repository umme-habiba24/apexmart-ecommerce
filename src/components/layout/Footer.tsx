"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Mail,
  Heart,
  CheckCircle2,
  Code2,
  Database,
  ExternalLink,
} from "lucide-react";
import { useToast } from "@/context/ToastContext";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const { success } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      success("Thanks for subscribing! Use code SAVE15 for 15% off your first order.", "Newsletter Subscribed");
      setEmail("");
    }
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-300">
      {/* Value Badges Bar */}
      <div className="border-b border-slate-800/80 bg-slate-900/40 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800/60">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Free Express Shipping</h4>
                <p className="text-xs text-slate-400 mt-0.5">On all US & worldwide orders over $99</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800/60">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">2-Year Official Warranty</h4>
                <p className="text-xs text-slate-400 mt-0.5">100% verified authentic merchandise</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800/60">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">30-Day Hassle-Free Returns</h4>
                <p className="text-xs text-slate-400 mt-0.5">Pre-paid instant return label</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800/60">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">24/7 Dedicated Support</h4>
                <p className="text-xs text-slate-400 mt-0.5">Live expert consultation anytime</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-md">
                <Zap className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="font-black text-xl text-white tracking-tight">
                APEX<span className="text-indigo-400">.</span>MART
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Curated premium tech gadgets, artisanal lifestyle goods, acoustic studio audio, and modern workspace gear. Built with Next.js 16, TypeScript, Tailwind CSS, PostgreSQL, and Drizzle ORM.
            </p>

            {/* Newsletter Subscription */}
            <div className="pt-2">
              <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                Join the VIP Club (Get 15% Off)
              </h5>
              {subscribed ? (
                <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/50 border border-emerald-800/50 p-2.5 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>You're subscribed! Use coupon <strong>SAVE15</strong> at checkout.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="bg-slate-900 text-sm text-white rounded-xl px-3.5 py-2 border border-slate-700 flex-1 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors shrink-0 shadow-md shadow-indigo-600/20"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Categories Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/products?category=audio" className="text-slate-400 hover:text-white transition-colors">
                  Audio & Acoustics
                </Link>
              </li>
              <li>
                <Link href="/products?category=wearables" className="text-slate-400 hover:text-white transition-colors">
                  Wearables & Tech
                </Link>
              </li>
              <li>
                <Link href="/products?category=fashion" className="text-slate-400 hover:text-white transition-colors">
                  Fashion & Lifestyle
                </Link>
              </li>
              <li>
                <Link href="/products?category=workspace" className="text-slate-400 hover:text-white transition-colors">
                  Workspace & Desk
                </Link>
              </li>
              <li>
                <Link href="/products?category=home-living" className="text-slate-400 hover:text-white transition-colors">
                  Home & Coffee
                </Link>
              </li>
              <li>
                <Link href="/products?category=wellness" className="text-slate-400 hover:text-white transition-colors">
                  Self-Care & Wellness
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/track-order" className="text-slate-400 hover:text-white transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="text-slate-400 hover:text-white transition-colors">
                  Order History & Invoices
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="text-slate-400 hover:text-white transition-colors">
                  My Saved Wishlist
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-slate-400 hover:text-white transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link href="/account" className="text-slate-400 hover:text-white transition-colors">
                  Account Preferences
                </Link>
              </li>
            </ul>
          </div>

          {/* Project & Tech Stack */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-indigo-400" />
              Internship Tech
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                Next.js 16 (App Router)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                PostgreSQL + Drizzle ORM
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                Tailwind CSS v4 + Recharts
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-400"></span>
                TypeScript & React 19
              </li>
              <li className="pt-2">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1 text-purple-400 hover:text-purple-300 font-medium"
                >
                  Admin Analytics & Inventory →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="border-t border-slate-800/80 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 ApexMart E-Commerce Platform. Designed for Portfolio & Internship Project Presentation.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Built with passion & precision</span>
            <span>•</span>
            <span className="text-emerald-400 font-medium">100% Production Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
