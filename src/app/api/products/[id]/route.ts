import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products, reviews } from "@/db/schema";
import { eq, or } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const isNumeric = /^\d+$/.test(id);

    let productQuery;
    if (isNumeric) {
      productQuery = await db.select().from(products).where(eq(products.id, parseInt(id, 10))).limit(1);
    } else {
      productQuery = await db.select().from(products).where(eq(products.slug, id)).limit(1);
    }

    if (!productQuery || productQuery.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const product = productQuery[0];

    // Fetch reviews for this product
    const productReviews = await db
      .select()
      .from(reviews)
      .where(eq(reviews.productId, product.id))
      .orderBy(reviews.createdAt);

    // Fetch related products in the same category
    const relatedProducts = await db
      .select()
      .from(products)
      .where(eq(products.categorySlug, product.categorySlug))
      .limit(4);

    return NextResponse.json({
      product,
      reviews: productReviews,
      related: relatedProducts.filter((p) => p.id !== product.id),
    });
  } catch (error) {
    console.error("GET /api/products/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const prodId = parseInt(id, 10);
    const body = await req.json();

    const [updated] = await db
      .update(products)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(products.id, prodId))
      .returning();

    return NextResponse.json({ product: updated, success: true });
  } catch (error) {
    console.error("PATCH /api/products/[id] error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const prodId = parseInt(id, 10);

    await db.delete(reviews).where(eq(reviews.productId, prodId));
    await db.delete(products).where(eq(products.id, prodId));

    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch (error) {
    console.error("DELETE /api/products/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
