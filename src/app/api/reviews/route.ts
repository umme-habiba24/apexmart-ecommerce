import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { reviews, products } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    let query = db.select().from(reviews);
    if (productId) {
      query = query.where(eq(reviews.productId, parseInt(productId, 10))) as any;
    }

    const reviewList = await query.orderBy(reviews.createdAt);
    return NextResponse.json({ reviews: reviewList });
  } catch (error) {
    console.error("GET /api/reviews error:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, userId, userName, userAvatar, rating, title, comment } = body;

    if (!productId || !userName || !rating || !title || !comment) {
      return NextResponse.json({ error: "Missing required review fields" }, { status: 400 });
    }

    const [newReview] = await db
      .insert(reviews)
      .values({
        productId: parseInt(productId, 10),
        userId: userId || null,
        userName,
        userAvatar: userAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userName)}`,
        rating: parseInt(rating, 10),
        title,
        comment,
        verifiedPurchase: true,
        helpfulCount: 0,
      })
      .returning();

    // Recalculate average rating for product
    const allProdReviews = await db
      .select({ rating: reviews.rating })
      .from(reviews)
      .where(eq(reviews.productId, parseInt(productId, 10)));

    const count = allProdReviews.length;
    const sum = allProdReviews.reduce((acc, r) => acc + r.rating, 0);
    const avg = (sum / count).toFixed(1);

    await db
      .update(products)
      .set({
        rating: avg,
        reviewCount: count,
      })
      .where(eq(products.id, parseInt(productId, 10)));

    return NextResponse.json({ review: newReview, success: true }, { status: 201 });
  } catch (error) {
    console.error("POST /api/reviews error:", error);
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}
