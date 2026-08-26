import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders, products, users } from "@/db/schema";
import { desc, sql, lte } from "drizzle-orm";
import { seedDatabase } from "@/db/seed";

export async function GET() {
  try {
    await seedDatabase(false);

    // Fetch all orders
    const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));
    const allProducts = await db.select().from(products);
    const allUsers = await db.select().from(users);

    const totalOrders = allOrders.length;
    const totalRevenue = allOrders.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0);
    const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : "0.00";
    const lowStockProducts = allProducts.filter((p) => p.stock <= 15);

    // Calculate revenue grouped by last 7 days
    const daysMap: Record<string, { date: string; revenue: number; orders: number }> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateKey = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      daysMap[dateKey] = { date: dateKey, revenue: 0, orders: 0 };
    }

    // Fill sales data
    allOrders.forEach((o) => {
      const date = o.createdAt ? new Date(o.createdAt) : new Date();
      const dateKey = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      if (daysMap[dateKey]) {
        daysMap[dateKey].revenue += parseFloat(o.total) || 0;
        daysMap[dateKey].orders += 1;
      }
    });

    const salesChartData = Object.values(daysMap);

    // Sales by category
    const categorySalesMap: Record<string, number> = {};
    allOrders.forEach((o) => {
      if (Array.isArray(o.items)) {
        o.items.forEach((item) => {
          const prod = allProducts.find((p) => p.id === item.productId);
          const cat = prod?.categoryName || "Other";
          categorySalesMap[cat] = (categorySalesMap[cat] || 0) + (item.price * item.quantity);
        });
      }
    });

    const categoryDistribution = Object.entries(categorySalesMap).map(([name, value]) => ({
      name,
      value: Math.round(value),
    }));

    return NextResponse.json({
      stats: {
        totalRevenue: totalRevenue.toFixed(2),
        totalOrders,
        avgOrderValue,
        totalCustomers: allUsers.length || 1,
        totalProducts: allProducts.length,
        lowStockCount: lowStockProducts.length,
      },
      salesChartData,
      categoryDistribution,
      lowStockProducts: lowStockProducts.slice(0, 5),
      recentOrders: allOrders.slice(0, 6),
    });
  } catch (error) {
    console.error("GET /api/admin/stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
