"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { InternshipTourModal } from "@/components/layout/InternshipTourModal";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Plus,
  ShieldCheck,
  Package,
  Layers,
  ChevronRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export default function AccountPage() {
  const { user, isAdmin, updateUser, addAddress, loginAs } = useAuth();
  const { success, error } = useToast();

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [newStreet, setNewStreet] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newState, setNewState] = useState("");
  const [newZip, setNewZip] = useState("");
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ name, phone });
    success("Profile preferences updated successfully!", "Saved");
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet || !newCity || !newZip) {
      error("Please fill in street, city, and zip code", "Incomplete Form");
      return;
    }

    addAddress({
      label: "Alternate Address",
      street: newStreet,
      city: newCity,
      state: newState || "CA",
      zipCode: newZip,
      country: "United States",
      isDefault: false,
    });

    setNewStreet("");
    setNewCity("");
    setNewState("");
    setNewZip("");
    setShowAddressModal(false);
    success("New delivery address added!", "Address Saved");
  };

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
          <span className="text-slate-200 font-medium">Customer Account</span>
        </nav>

        {/* Profile Header Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 border border-slate-800 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500 shadow-xl"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-xl font-black text-white shadow-xl">
                {user?.name?.[0] || "U"}
              </div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">{user?.name}</h1>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    isAdmin
                      ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                      : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  }`}
                >
                  {user?.role || "Customer"}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/account/orders"
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              <Package className="w-4 h-4 text-emerald-400" />
              <span>Order History</span>
            </Link>

            {isAdmin && (
              <Link
                href="/admin"
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-purple-600/30 transition-colors"
              >
                <Layers className="w-4 h-4" />
                <span>Admin Dashboard</span>
              </Link>
            )}
          </div>
        </div>

        {/* Profile Settings & Addresses */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Profile Form */}
          <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="font-bold text-sm text-white pb-3 border-b border-slate-800 flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-400" />
              <span>Personal Information</span>
            </h3>

            <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ""}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-500 cursor-not-allowed"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Primary demo account email
                </span>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all"
              >
                Save Preferences
              </button>
            </form>
          </div>

          {/* Saved Addresses */}
          <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>Saved Addresses</span>
              </h3>

              <button
                onClick={() => setShowAddressModal(true)}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Address</span>
              </button>
            </div>

            <div className="space-y-3">
              {user?.addresses?.map((addr) => (
                <div
                  key={addr.id}
                  className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs space-y-1 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white uppercase tracking-wider">{addr.label}</span>
                    {addr.isDefault && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-slate-300">{addr.street}</p>
                  <p className="text-slate-400">
                    {addr.city}, {addr.state} {addr.zipCode}
                  </p>
                  <p className="text-slate-400">{addr.country}</p>
                </div>
              ))}
            </div>

            {/* Add Address Form Modal */}
            {showAddressModal && (
              <form onSubmit={handleAddAddress} className="p-4 rounded-2xl bg-slate-950 border border-indigo-500/30 space-y-3 text-xs animate-in fade-in">
                <h4 className="font-bold text-white text-xs">Add New Delivery Address</h4>

                <input
                  type="text"
                  required
                  placeholder="Street Address"
                  value={newStreet}
                  onChange={(e) => setNewStreet(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />

                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="City"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={newState}
                    onChange={(e) => setNewState(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                  <input
                    type="text"
                    required
                    placeholder="ZIP"
                    value={newZip}
                    onChange={(e) => setNewZip(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddressModal(false)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
