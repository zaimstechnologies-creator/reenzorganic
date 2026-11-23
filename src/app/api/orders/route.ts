import { NextResponse } from "next/server";
import { createOrder } from "@/lib/database";
import type { CheckoutDetails, CheckoutLine } from "@/lib/orders";
import { isSameOriginRequest } from "@/lib/admin-auth";

type CheckoutRequest = Omit<CheckoutDetails, "customerName"> & {
  name: string;
  items: CheckoutLine[];
};

function isCheckoutRequest(value: unknown): value is CheckoutRequest {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const body = value as Record<string, unknown>;
  if (
    typeof body.name !== "string" ||
    body.name.trim().length < 2 ||
    body.name.length > 100 ||
    typeof body.phone !== "string" ||
    !/^[0-9+().\-\s]{7,30}$/.test(body.phone) ||
    typeof body.address !== "string" ||
    body.address.trim().length < 5 ||
    body.address.length > 500 ||
    typeof body.email !== "string" ||
    body.email.length > 254 ||
    (body.email !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) ||
    !Array.isArray(body.items) ||
    body.items.length < 1 ||
    body.items.length > 25
  ) {
    return false;
  }

  const variantIds = new Set<string>();
  return body.items.every((item: unknown) => {
    if (
      typeof item !== "object" ||
      item === null ||
      !("variantId" in item) ||
      typeof item.variantId !== "string" ||
      !/^[\w.:-]{1,100}$/.test(item.variantId) ||
      !("quantity" in item) ||
      !Number.isInteger(item.quantity) ||
      Number(item.quantity) < 1 ||
      Number(item.quantity) > 20 ||
      variantIds.has(item.variantId)
    ) {
      return false;
    }
    variantIds.add(item.variantId);
    return true;
  });
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Request origin could not be verified." }, { status: 403 });
  }
  if (Number(request.headers.get("content-length") ?? 0) > 65536) {
    return NextResponse.json({ error: "The order request is too large." }, { status: 413 });
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Enter valid delivery details." }, { status: 400 });
  }
  if (!isCheckoutRequest(body)) {
    return NextResponse.json(
      { error: "Enter a valid name, phone number, delivery address and cart." },
      { status: 400 },
    );
  }

  let order;
  try {
    order = await createOrder(
      {
        customerName: body.name.trim(),
        email: body.email.trim(),
        phone: body.phone.trim(),
        address: body.address.trim(),
      },
      body.items,
    );
  } catch (error) {
    console.error("Could not save customer order.", error);
    return NextResponse.json(
      { error: "Checkout is temporarily unavailable. Please try again shortly." },
      { status: 503 },
    );
  }
  if (!order) {
    return NextResponse.json(
      { error: "A product in your cart is no longer available. Refresh the catalog and try again." },
      { status: 409 },
    );
  }

  return NextResponse.json(
    { order: { id: order.id, totalCents: order.totalCents, status: order.status } },
    { status: 201, headers: { "Cache-Control": "no-store" } },
  );
}
