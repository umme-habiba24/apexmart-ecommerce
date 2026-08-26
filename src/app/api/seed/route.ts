import { NextRequest, NextResponse } from "next/server";
import { seedDatabase } from "@/db/seed";

export async function POST(req: NextRequest) {
  try {
    const { force } = await req.json().catch(() => ({ force: true }));
    const result = await seedDatabase(force ?? true);
    return NextResponse.json(result);
  } catch (error) {
    console.error("POST /api/seed error:", error);
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 });
  }
}
