import { NextResponse } from "next/server";
import { getOrders } from "@/lib/database";
import { hasAdminSession } from "@/lib/admin-auth";
import { databaseUnavailable } from "@/lib/api-errors";

export async function GET() {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Sign in to manage orders." }, { status: 401 });
  }
  try {
    const orders = await getOrders();
    return NextResponse.json({ orders }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return databaseUnavailable("loading admin orders", error);
  }
}
