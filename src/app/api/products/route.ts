import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { and, eq, gte, ilike, lte, or, sql, desc, asc } from "drizzle-orm";
import { seedDatabase } from "@/db/seed";

export async function GET(req: NextRequest) {
  try {
    // Auto seed on first hit if empty
    await seedDatabase(false);

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sort = searchParams.get("sort") || "featured";
    const brand = searchParams.get("brand");
    const inStock = searchParams.get("inStock") === "true";
    const featured = searchParams.get("featured") === "true";
    const trending = searchParams.get("trending") === "true";
    const newArrival = searchParams.get("newArrival") === "true";
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    const conditions = [];

    if (search.trim()) {
      const s = `%${search.trim()}%`;
      conditions.push(
        or(
          ilike(products.name, s),
          ilike(products.description, s),
          ilike(products.brand, s),
          ilike(products.categoryName, s)
        )
      );
    }

    if (category && category !== "all") {
      conditions.push(eq(products.categorySlug, category));
    }

    if (brand && brand !== "all") {
      conditions.push(eq(products.brand, brand));
    }

    if (minPrice) {
      conditions.push(gte(sql`CAST(${products.price} AS NUMERIC)`, parseFloat(minPrice)));
    }

    if (maxPrice) {
      conditions.push(lte(sql`CAST(${products.price} AS NUMERIC)`, parseFloat(maxPrice)));
    }

    if (inStock) {
      conditions.push(gte(products.stock, 1));
    }

    if (featured) {
      conditions.push(eq(products.isFeatured, true));
    }

    if (trending) {
      conditions.push(eq(products.isTrending, true));
    }

    if (newArrival) {
      conditions.push(eq(products.isNewArrival, true));
    }

    let orderByClause;
    switch (sort) {
      case "price_asc":
        orderByClause = asc(sql`CAST(${products.price} AS NUMERIC)`);
        break;
      case "price_desc":
        orderByClause = desc(sql`CAST(${products.price} AS NUMERIC)`);
        break;
      case "rating":
        orderByClause = desc(sql`CAST(${products.rating} AS NUMERIC)`);
        break;
      case "newest":
        orderByClause = desc(products.createdAt);
        break;
      case "reviews":
        orderByClause = desc(products.reviewCount);
        break;
      case "featured":
      default:
        orderByClause = desc(products.isFeatured);
        break;
    }

    let query = db.select().from(products);
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    const items = await query.orderBy(orderByClause).limit(limit);

    // Get list of unique brands for filters
    const allBrands = await db
      .select({ brand: products.brand })
      .from(products)
      .groupBy(products.brand);

    return NextResponse.json({
      products: items,
      total: items.length,
      brands: allBrands.map((b) => b.brand),
    });
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      description,
      price,
      compareAtPrice,
      costPrice,
      stock,
      categorySlug,
      categoryName,
      brand,
      images,
      tags,
      specs,
      colors,
      sizes,
      sku,
      isFeatured,
      isTrending,
      isNewArrival,
    } = body;

    if (!name || !price || !categorySlug) {
      return NextResponse.json({ error: "Name, price, and category are required" }, { status: 400 });
    }

    const slug = body.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

    const [newProduct] = await db.insert(products).values({
      name,
      slug,
      description: description || "No description provided.",
      price: price.toString(),
      compareAtPrice: compareAtPrice ? compareAtPrice.toString() : null,
      costPrice: costPrice ? costPrice.toString() : "0.00",
      stock: parseInt(stock) || 10,
      categorySlug,
      categoryName: categoryName || categorySlug,
      brand: brand || "ApexMart",
      rating: "5.0",
      reviewCount: 0,
      images: images && images.length > 0 ? images : ["https://images.pexels.com/photos/577768/pexels-photo-577768.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"],
      tags: tags || [],
      specs: specs || {},
      colors: colors || ["Default"],
      sizes: sizes || ["Standard"],
      sku: sku || `APX-${Math.floor(1000 + Math.random() * 9000)}`,
      isFeatured: !!isFeatured,
      isTrending: !!isTrending,
      isNewArrival: !!isNewArrival,
      status: "active",
    }).returning();

    return NextResponse.json({ product: newProduct, success: true }, { status: 201 });
  } catch (error) {
    console.error("POST /api/products error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
