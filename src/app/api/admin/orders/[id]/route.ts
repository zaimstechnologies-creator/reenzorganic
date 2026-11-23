import { NextResponse } from "next/server";
import { updateOrderStatus } from "@/lib/database";
import { hasAdminSession, isSameOriginRequest } from "@/lib/admin-auth";
import { isOrderStatus } from "@/lib/orders";
import { databaseUnavailable } from "@/lib/api-errors";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Sign in to manage orders." }, { status: 401 });
  }
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Request origin could not be verified." }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Choose a valid order status." }, { status: 400 });
  }
  if (
    typeof body !== "object" ||
    body === null ||
    !("status" in body) ||
    typeof body.status !== "string" ||
    !isOrderStatus(body.status)
  ) {
    return NextResponse.json({ error: "Choose a valid order status." }, { status: 400 });
  }

  const { id } = await context.params;
  try {
    const order = await updateOrderStatus(id, body.status);
    return order
      ? NextResponse.json({ order })
      : NextResponse.json({ error: "Order not found." }, { status: 404 });
  } catch (error) {
    return databaseUnavailable("updating an order", error);
  }
}
