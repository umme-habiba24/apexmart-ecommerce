"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { OrderSuccessModal } from "@/components/checkout/OrderSuccessModal";
import { InternshipTourModal } from "@/components/layout/InternshipTourModal";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { Order } from "@/types";
import {
  CreditCard,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Sparkles,
  ChevronRight,
  ArrowRight,
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  Tag,
  Zap,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, discount, coupon, total, clearCart } = useCart();
  const { formatPrice } = useCurrency();
  const { user } = useAuth();
  const { success, error } = useToast();

  const [shippingSpeed, setShippingSpeed] = useState<"standard" | "express" | "overnight">("standard");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal" | "apple_pay" | "cod">("card");

  // Shipping form fields
  const [fullName, setFullName] = useState(user?.name || "Alex Morgan");
  const [email, setEmail] = useState(user?.email || "customer@apexmart.io");
  const [phone, setPhone] = useState(user?.phone || "+1 (555) 349-8201");
  const [street, setStreet] = useState("742 Evergreen Terrace");
  const [city, setCity] = useState("San Francisco");
  const [state, setState] = useState("CA");
  const [zipCode, setZipCode] = useState("94107");
  const [country, setCountry] = useState("United States");
  const [notes, setNotes] = useState("");

  // Card details for live card preview
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [cardHolder, setCardHolder] = useState("ALEX MORGAN");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("888");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [tourOpen, setTourOpen] = useState(false);

  // Auto fill demo address button
  const handlePrefillDemoAddress = () => {
    setFullName("Alex Morgan");
    setEmail("customer@apexmart.io");
    setPhone("+1 (555) 349-8201");
    setStreet("742 Evergreen Terrace");
    setCity("San Francisco");
    setState("CA");
    setZipCode("94107");
    setCountry("United States");
    setNotes("Leave with concierge at front desk.");
    success("Demo customer address prefilled!", "Prefilled");
  };

  // Shipping fee calculation
  const shippingFee =
    shippingSpeed === "standard"
      ? subtotal >= 99 || coupon?.code === "FREESHIP" ? 0 : 9.99
      : shippingSpeed === "express"
      ? 14.99
      : 24.99;

  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = taxableAmount * 0.08;
  const finalTotal = taxableAmount + shippingFee + tax;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      error("Your cart is empty. Please add items before checking out.", "Empty Cart");
      return;
    }

    if (!fullName || !email || !street || !city || !zipCode) {
      error("Please fill in all required shipping address fields.", "Missing Information");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        userId: user?.id || 1,
        customerName: fullName,
        customerEmail: email,
        customerPhone: phone,
        shippingAddress: {
          street,
          city,
          state,
          zipCode,
          country,
        },
        items: cart.map((item) => ({
          productId: item.productId,
          name: item.name,
          slug: item.slug,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          color: item.selectedColor,
          size: item.selectedSize,
        })),
        subtotal: subtotal.toFixed(2),
        discount: discount.toFixed(2),
        shippingFee: shippingFee.toFixed(2),
        tax: tax.toFixed(2),
        total: finalTotal.toFixed(2),
        couponCode: coupon?.code || null,
        paymentMethod,
        notes,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (data.success && data.order) {
        setCreatedOrder(data.order);
        clearCart();
        success("Order placed successfully!", "Payment Confirmed");
      } else {
        error(data.error || "Failed to process order", "Checkout Error");
      }
    } catch (err) {
      console.error("Order placement failed", err);
      error("Network error occurred during checkout. Please retry.", "Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Header onOpenTour={() => setTourOpen(true)} />
      <CartDrawer />
      <InternshipTourModal isOpen={tourOpen} onClose={() => setTourOpen(false)} />

      {/* Success Celebration Modal */}
      <OrderSuccessModal
        order={createdOrder}
        onClose={() => {
          setCreatedOrder(null);
          router.push("/");
        }}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/cart" className="hover:text-white transition-colors">Bag</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-200 font-medium">Express Checkout</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span>Secure Checkout</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Lock className="w-3 h-3" /> SSL 256-bit Encrypted
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Complete your order details below for instant fulfillment and dispatch
            </p>
          </div>

          <button
            type="button"
            onClick={handlePrefillDemoAddress}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-xs font-bold transition-colors self-start sm:self-auto"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Auto-fill Demo Address</span>
          </button>
        </div>

        {cart.length === 0 && !createdOrder ? (
          <div className="py-20 text-center rounded-3xl bg-slate-900/60 border border-slate-800 p-8 space-y-4 max-w-md mx-auto">
            <h2 className="text-xl font-bold text-white">Your Cart is Empty</h2>
            <p className="text-xs text-slate-400">Add some products to your cart before proceeding to checkout.</p>
            <Link
              href="/products"
              className="inline-block px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
            >
              Browse Catalog
            </Link>
          </div>
        ) : (
          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Steps Column */}
            <div className="lg:col-span-8 space-y-6">
              {/* Step 1: Customer & Shipping Address */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                      1
                    </span>
                    <h3 className="font-bold text-base text-white">Shipping & Contact Details</h3>
                  </div>
                  <span className="text-[11px] text-slate-400">All fields required</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Alex Morgan"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                      />
                      <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. alex@apexmart.io"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                      />
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Phone Number</label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                      />
                      <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Street Address</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        placeholder="742 Evergreen Terrace"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                      />
                      <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="San Francisco"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">State</label>
                      <input
                        type="text"
                        required
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="CA"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">ZIP Code</label>
                      <input
                        type="text"
                        required
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        placeholder="94107"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold text-xs mb-1">
                    Special Delivery Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Leave package inside parcel locker at front gate"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Step 2: Shipping Method Speed */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                    2
                  </span>
                  <h3 className="font-bold text-base text-white">Delivery Speed & Courier Tier</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label
                    onClick={() => setShippingSpeed("standard")}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      shippingSpeed === "standard"
                        ? "border-indigo-500 bg-indigo-600/10 text-white shadow-md"
                        : "border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs font-bold mb-1">
                        <span>Standard Shipping</span>
                        <Truck className="w-4 h-4 text-indigo-400" />
                      </div>
                      <p className="text-[11px] text-slate-400">3-5 Business Days</p>
                    </div>
                    <span className="font-bold text-sm text-emerald-400 mt-3">
                      {subtotal >= 99 || coupon?.code === "FREESHIP" ? "FREE" : formatPrice(9.99)}
                    </span>
                  </label>

                  <label
                    onClick={() => setShippingSpeed("express")}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      shippingSpeed === "express"
                        ? "border-indigo-500 bg-indigo-600/10 text-white shadow-md"
                        : "border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs font-bold mb-1">
                        <span>FedEx 2-Day Air</span>
                        <Sparkles className="w-4 h-4 text-purple-400" />
                      </div>
                      <p className="text-[11px] text-slate-400">Guaranteed 2 Days</p>
                    </div>
                    <span className="font-bold text-sm text-white mt-3">
                      {formatPrice(14.99)}
                    </span>
                  </label>

                  <label
                    onClick={() => setShippingSpeed("overnight")}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      shippingSpeed === "overnight"
                        ? "border-indigo-500 bg-indigo-600/10 text-white shadow-md"
                        : "border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs font-bold mb-1">
                        <span>UPS Overnight</span>
                        <Zap className="w-4 h-4 text-amber-400" />
                      </div>
                      <p className="text-[11px] text-slate-400">Next Business Morning</p>
                    </div>
                    <span className="font-bold text-sm text-white mt-3">
                      {formatPrice(24.99)}
                    </span>
                  </label>
                </div>
              </div>

              {/* Step 3: Payment Method Simulation */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                      3
                    </span>
                    <h3 className="font-bold text-base text-white">Payment Method</h3>
                  </div>
                  <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" /> Sandbox Simulated
                  </span>
                </div>

                {/* Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                      paymentMethod === "card"
                        ? "border-indigo-500 bg-indigo-600 text-white shadow-md"
                        : "border-slate-800 bg-slate-950 text-slate-400 hover:text-white"
                    }`}
                  >
                    Credit / Debit Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("apple_pay")}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                      paymentMethod === "apple_pay"
                        ? "border-indigo-500 bg-indigo-600 text-white shadow-md"
                        : "border-slate-800 bg-slate-950 text-slate-400 hover:text-white"
                    }`}
                  >
                    Apple Pay
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("paypal")}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                      paymentMethod === "paypal"
                        ? "border-indigo-500 bg-indigo-600 text-white shadow-md"
                        : "border-slate-800 bg-slate-950 text-slate-400 hover:text-white"
                    }`}
                  >
                    PayPal Express
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cod")}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                      paymentMethod === "cod"
                        ? "border-indigo-500 bg-indigo-600 text-white shadow-md"
                        : "border-slate-800 bg-slate-950 text-slate-400 hover:text-white"
                    }`}
                  >
                    Cash on Delivery
                  </button>
                </div>

                {/* Simulated Credit Card Box */}
                {paymentMethod === "card" && (
                  <div className="space-y-4 pt-2">
                    {/* Visual Card Component */}
                    <div className="relative w-full max-w-sm mx-auto aspect-[1.586/1] rounded-2xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-purple-950 border border-indigo-500/40 p-5 text-white shadow-2xl flex flex-col justify-between overflow-hidden">
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-7 rounded-md bg-amber-400/80 border border-amber-300" />
                        <span className="font-mono font-bold text-xs tracking-widest text-indigo-300 uppercase">
                          APEX PLATINUM
                        </span>
                      </div>

                      <div className="font-mono text-base sm:text-lg tracking-widest font-bold text-slate-100">
                        {cardNumber}
                      </div>

                      <div className="flex items-end justify-between text-xs">
                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-slate-400 block">
                            Card Holder
                          </span>
                          <span className="font-semibold text-slate-200 uppercase truncate block max-w-[150px]">
                            {cardHolder || "ALEX MORGAN"}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-slate-400 block">
                            Expires
                          </span>
                          <span className="font-mono font-semibold text-slate-200">
                            {cardExpiry}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Inputs for Card */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="sm:col-span-2">
                        <label className="block text-slate-300 font-semibold mb-1">Card Number</label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="4242 4242 4242 4242"
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Cardholder Name</label>
                        <input
                          type="text"
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value)}
                          placeholder="Alex Morgan"
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white uppercase"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">Expiry (MM/YY)</label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="12/28"
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">CVC Code</label>
                          <input
                            type="password"
                            value={cardCvc}
                            maxLength={4}
                            onChange={(e) => setCardCvc(e.target.value)}
                            placeholder="•••"
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "apple_pay" && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 text-center">
                    Apple Pay authentication will trigger automatically when clicking "Place Order".
                  </div>
                )}

                {paymentMethod === "paypal" && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 text-center">
                    You will be securely redirected to PayPal sandbox to authorize payment.
                  </div>
                )}

                {paymentMethod === "cod" && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 text-center">
                    Pay with cash or contactless card when the courier arrives at your address.
                  </div>
                )}
              </div>
            </div>

            {/* Right Sticky Order Summary */}
            <div className="lg:col-span-4 space-y-4">
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 sticky top-24 shadow-2xl">
                <h3 className="font-bold text-base text-white pb-3 border-b border-slate-800 flex items-center justify-between">
                  <span>Order Summary</span>
                  <span className="text-xs text-slate-400 font-normal">({cart.length} items)</span>
                </h3>

                {/* Items preview */}
                <div className="space-y-3 max-h-48 overflow-y-auto pr-1 divide-y divide-slate-800/60">
                  {cart.map((item) => (
                    <div key={item.id} className="pt-2 first:pt-0 flex items-center gap-3 text-xs">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover bg-slate-800 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white truncate">{item.name}</p>
                        <p className="text-slate-400 text-[11px]">
                          Qty: {item.quantity} {item.selectedColor ? `• ${item.selectedColor}` : ""}
                        </p>
                      </div>
                      <span className="font-bold text-white">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Financial breakdown */}
                <div className="pt-3 border-t border-slate-800 space-y-2 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Subtotal</span>
                    <span className="font-semibold text-white">{formatPrice(subtotal)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Discount ({coupon?.code})</span>
                      <span className="font-bold">-{formatPrice(discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-slate-400">Shipping</span>
                    <span>
                      {shippingFee === 0 ? (
                        <strong className="text-emerald-400 uppercase">FREE</strong>
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
                    <span>Total Due</span>
                    <span className="text-emerald-400 text-lg">{formatPrice(finalTotal)}</span>
                  </div>
                </div>

                {/* Submit Order Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || cart.length === 0}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/30 transition-all active:scale-[0.99] disabled:opacity-40"
                >
                  <Lock className="w-4 h-4" />
                  <span>{isSubmitting ? "Processing Order..." : `Pay ${formatPrice(finalTotal)} & Complete Order`}</span>
                </button>

                <div className="pt-2 text-center text-[11px] text-slate-400 space-y-1">
                  <p>30-Day Money-Back Guarantee • 2-Year Warranty</p>
                  <p className="text-emerald-400">Instant tracking number assigned on payment</p>
                </div>
              </div>
            </div>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}
