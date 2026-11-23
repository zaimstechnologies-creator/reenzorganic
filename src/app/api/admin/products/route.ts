import { NextResponse } from "next/server";
import { createProduct, getProducts, hasVariantIdentifierConflict } from "@/lib/database";
import { hasAdminSession, isSameOriginRequest } from "@/lib/admin-auth";
import { parseProductSubmission } from "@/lib/product-submission";
import { databaseUnavailable } from "@/lib/api-errors";

export async function GET() {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Sign in to manage products." }, { status: 401 });
  }
  try {
    return NextResponse.json(
      { products: await getProducts(false) },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return databaseUnavailable("loading admin products", error);
  }
}

export async function POST(request: Request) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Sign in to manage products." }, { status: 401 });
  }
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Request origin could not be verified." }, { status: 403 });
  }

  const result = await parseProductSubmission(request);
  if (!result.success) {
    return NextResponse.json({ error: result.message }, { status: result.status });
  }
  try {
    if (await hasVariantIdentifierConflict(result.product)) {
      return NextResponse.json(
        { error: "A product option already uses one of these option IDs." },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { product: await createProduct(result.product, result.imageChange) },
      { status: 201 },
    );
  } catch (error) {
    return databaseUnavailable("saving a product", error);
  }
}

