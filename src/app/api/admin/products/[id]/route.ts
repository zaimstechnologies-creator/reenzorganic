import { NextResponse } from "next/server";
import {
  deleteProduct,
  hasVariantIdentifierConflict,
  setHomepageFeatured,
  updateProduct,
} from "@/lib/database";
import { hasAdminSession, isSameOriginRequest } from "@/lib/admin-auth";
import { parseProductSubmission } from "@/lib/product-submission";
import { databaseUnavailable } from "@/lib/api-errors";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Sign in to manage products." }, { status: 401 });
  }
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Request origin could not be verified." }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Choose whether to feature this product on the homepage." }, { status: 400 });
  }
  if (
    typeof body !== "object" ||
    body === null ||
    !("homepageFeatured" in body) ||
    typeof body.homepageFeatured !== "boolean"
  ) {
    return NextResponse.json({ error: "Choose whether to feature this product on the homepage." }, { status: 400 });
  }

  const { id } = await context.params;
  try {
    const result = await setHomepageFeatured(id, body.homepageFeatured);
    if ("reason" in result) {
      if (result.reason === "not-found") {
        return NextResponse.json({ error: "Product not found." }, { status: 404 });
      }
      if (result.reason === "unpublished") {
        return NextResponse.json({ error: "Publish this product before adding it to the homepage." }, { status: 409 });
      }
      return NextResponse.json({ error: "The homepage can show up to four products. Remove one before adding another." }, { status: 409 });
    }
    return NextResponse.json({ product: result.product });
  } catch (error) {
    return databaseUnavailable("updating homepage product selection", error);
  }
}

export async function PUT(request: Request, context: RouteContext) {
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

  const { id } = await context.params;
  try {
    if (await hasVariantIdentifierConflict(result.product, id)) {
      return NextResponse.json(
        { error: "A product option already uses one of these option IDs." },
        { status: 409 },
      );
    }
    const product = await updateProduct(id, result.product, result.imageChange);
    return product
      ? NextResponse.json({ product })
      : NextResponse.json({ error: "Product not found." }, { status: 404 });
  } catch (error) {
    return databaseUnavailable("updating a product", error);
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Sign in to manage products." }, { status: 401 });
  }
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Request origin could not be verified." }, { status: 403 });
  }

  const { id } = await context.params;
  try {
    return (await deleteProduct(id))
      ? NextResponse.json({ deleted: true })
      : NextResponse.json({ error: "Product not found." }, { status: 404 });
  } catch (error) {
    return databaseUnavailable("deleting a product", error);
  }
}

