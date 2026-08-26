"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  loginAs: (role: "customer" | "admin" | "guest") => void;
  updateUser: (updated: Partial<User>) => void;
  addAddress: (address: any) => void;
  logout: () => void;
}

const DEMO_CUSTOMER: User = {
  id: 1,
  name: "Alex Morgan",
  email: "customer@apexmart.io",
  role: "customer",
  avatar: "https://images.pexels.com/photos/6633650/pexels-photo-6633650.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=200&w=200",
  phone: "+1 (555) 349-8201",
  addresses: [
    {
      id: "addr_1",
      label: "Home",
      street: "742 Evergreen Terrace",
      city: "San Francisco",
      state: "CA",
      zipCode: "94107",
      country: "United States",
      isDefault: true,
    },
    {
      id: "addr_2",
      label: "Office",
      street: "100 Market St Suite 400",
      city: "San Francisco",
      state: "CA",
      zipCode: "94105",
      country: "United States",
      isDefault: false,
    },
  ],
};

const DEMO_ADMIN: User = {
  id: 2,
  name: "Sarah Sterling (Store Admin)",
  email: "admin@apexmart.io",
  role: "admin",
  avatar: "https://images.pexels.com/photos/3184451/pexels-photo-3184451.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=200&w=200",
  phone: "+1 (555) 902-1844",
  addresses: [
    {
      id: "addr_admin",
      label: "Apex HQ",
      street: "500 Howard Street, Fl 12",
      city: "San Francisco",
      state: "CA",
      zipCode: "94105",
      country: "United States",
      isDefault: true,
    },
  ],
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(DEMO_CUSTOMER);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedRole = localStorage.getItem("apex_user_role");
    if (savedRole === "admin") {
      setUser(DEMO_ADMIN);
    } else if (savedRole === "guest") {
      setUser(null);
    } else {
      setUser(DEMO_CUSTOMER);
    }
    setIsLoading(false);
  }, []);

  const loginAs = (role: "customer" | "admin" | "guest") => {
    if (role === "admin") {
      setUser(DEMO_ADMIN);
      localStorage.setItem("apex_user_role", "admin");
    } else if (role === "customer") {
      setUser(DEMO_CUSTOMER);
      localStorage.setItem("apex_user_role", "customer");
    } else {
      setUser(null);
      localStorage.setItem("apex_user_role", "guest");
    }
  };

  const updateUser = (updated: Partial<User>) => {
    if (!user) return;
    setUser({ ...user, ...updated });
  };

  const addAddress = (address: any) => {
    if (!user) return;
    const currentAddresses = user.addresses || [];
    const newAddresses = [...currentAddresses, { ...address, id: `addr_${Date.now()}` }];
    setUser({ ...user, addresses: newAddresses });
  };

  const logout = () => {
    loginAs("guest");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: user?.role === "admin",
        isLoading,
        loginAs,
        updateUser,
        addAddress,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
