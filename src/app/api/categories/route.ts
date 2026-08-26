import { NextResponse } from "next/server";
import { db } from "@/db";
import { categories, products } from "@/db/schema";
import { seedDatabase } from "@/db/seed";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    await seedDatabase(false);

    const allCategories = await db.select().from(categories);

    // Dynamic count of products per category
    const counts = await db
      .select({
        categorySlug: products.categorySlug,
        count: sql<number>`count(*)::int`,
      })
      .from(products)
      .groupBy(products.categorySlug);

    const countMap = new Map(counts.map((c) => [c.categorySlug, c.count]));

    const enrichedCategories = allCategories.map((cat) => ({
      ...cat,
      itemCount: countMap.get(cat.slug) || cat.itemCount || 0,
    }));

    return NextResponse.json({ categories: enrichedCategories });
  } catch (error) {
    console.error("GET /api/categories error:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
