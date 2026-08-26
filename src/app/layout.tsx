import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { AppProvider } from "@/context/AppProvider";

export const metadata: Metadata = {
  title: "ApexMart | Next-Gen E-Commerce Platform",
  description: "Modern fullstack eCommerce platform featuring precision acoustics, wearables, lifestyle gear, live order tracking, and admin analytics.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen selection:bg-indigo-500 selection:text-white">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
