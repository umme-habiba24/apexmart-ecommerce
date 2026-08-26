"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { InternshipTourModal } from "@/components/layout/InternshipTourModal";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
  Tag,
  Truck,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    discount,
    shippingFee,
    tax,
    total,
    coupon,
    applyCoupon,
    removeCoupon,
    freeShippingThreshold,
    amountUntilFreeShipping,
  } = useCart();
  const { formatPrice } = useCurrency();

  const [promoCode, setPromoCode] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;
    setIsApplying(true);
    await applyCoupon(promoCode);
    setIsApplying(false);
    setPromoCode("");
  };

  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Header onOpenTour={() => setTourOpen(true)} />
      <CartDrawer />
      <InternshipTourModal isOpen={tourOpen} onClose={() => setTourOpen(false)} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-200 font-medium">Shopping Bag</span>
        </nav>

        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Shopping Cart
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              You have {cart.length} unique items in your bag
            </p>
          </div>

          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs text-rose-400 hover:text-rose-300 font-semibold"
            >
              Clear Entire Bag
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="py-20 text-center rounded-3xl bg-slate-900/60 border border-slate-800 p-8 space-y-4 max-w-lg mx-auto">
            <div className="w-20 h-20 rounded-3xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-slate-500 shadow-inner">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Your Shopping Cart is Empty</h2>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Discover audiophile studio gear, titanium wearables, and handcrafted accessories.
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Items Column */}
            <div className="lg:col-span-8 space-y-4">
              {/* Free Shipping Progress Indicator */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="flex items-center gap-2 text-slate-200">
                    <Truck className="w-4 h-4 text-indigo-400" />
                    {amountUntilFreeShipping > 0
                      ? `Add ${formatPrice(amountUntilFreeShipping)} more to qualify for FREE Express Delivery!`
                      : "🎉 Congratulations! You have unlocked FREE Express Shipping!"}
                  </span>
                  <span className="font-bold text-indigo-400">{Math.round(freeShippingProgress)}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      amountUntilFreeShipping === 0
                        ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                        : "bg-gradient-to-r from-indigo-500 to-purple-500"
                    }`}
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>

              {/* Items List Table */}
              <div className="rounded-2xl bg-slate-900 border border-slate-800 divide-y divide-slate-800/80 overflow-hidden">
                {cart.map((item) => (
                  <div key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <Link href={`/products/${item.slug}`} className="shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 rounded-xl object-cover bg-slate-800 border border-slate-700/60"
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${item.slug}`}
                        className="font-bold text-sm text-white hover:text-indigo-400 transition-colors line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                        {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                        {item.selectedSize && <span>• Size: {item.selectedSize}</span>}
                        <span>• Unit Price: {formatPrice(item.price)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-slate-700 rounded-xl bg-slate-800 p-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 text-slate-400 hover:text-white transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-white min-w-[24px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="p-1.5 text-slate-400 hover:text-white transition-colors disabled:opacity-40"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Total Item Price */}
                      <div className="text-right min-w-[80px]">
                        <span className="text-sm font-black text-emerald-400">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
                        title="Remove from Cart"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Summary Column */}
            <div className="lg:col-span-4 space-y-4">
              {/* Promo Code Box */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300">
                  Promo / Coupon Code
                </h3>

                {coupon ? (
                  <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-indigo-400" />
                      <div>
                        <strong className="text-indigo-300 uppercase font-mono">{coupon.code}</strong>
                        <p className="text-slate-400 text-[11px]">{coupon.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-rose-400 hover:underline font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="e.g. SAVE15, APEX20"
                        className="w-full bg-slate-950 border border-slate-700 text-xs rounded-xl pl-8 pr-3 py-2.5 text-white placeholder-slate-400 uppercase font-mono tracking-wider focus:outline-none focus:border-indigo-500"
                      />
                      <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    </div>
                    <button
                      type="submit"
                      disabled={isApplying || !promoCode.trim()}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors border border-slate-700 disabled:opacity-50"
                    >
                      {isApplying ? "Checking..." : "Apply"}
                    </button>
                  </form>
                )}
              </div>

              {/* Order Breakdown */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <h3 className="font-bold text-sm text-white pb-3 border-b border-slate-800">
                  Order Summary
                </h3>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Cart Subtotal</span>
                    <span className="font-bold text-white">{formatPrice(subtotal)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Discount ({coupon?.code})</span>
                      <span className="font-bold">-{formatPrice(discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-slate-400">Estimated Shipping</span>
                    <span>
                      {shippingFee === 0 ? (
                        <strong className="text-emerald-400 uppercase">FREE Express</strong>
                      ) : (
                        formatPrice(shippingFee)
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">Estimated Sales Tax (8%)</span>
                    <span>{formatPrice(tax)}</span>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex justify-between text-base font-black text-white">
                    <span>Estimated Total</span>
                    <span className="text-emerald-400">{formatPrice(total)}</span>
                  </div>
                </div>

                <button
                  onClick={() => router.push("/checkout")}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-indigo-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 transition-all active:scale-[0.99]"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-center gap-3 text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 256-Bit SSL Encrypted
                  </span>
                  <span>•</span>
                  <span>Fast Dispatch</span>
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
