import { NextResponse } from "next/server";
import { getProductImage } from "@/lib/database";
import { hasAdminSession } from "@/lib/admin-auth";
import { databaseUnavailable } from "@/lib/api-errors";

type RouteContext = { params: Promise<{ id: string; version: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id, version } = await context.params;
  const requestedVersion = Number(version);
  if (!Number.isSafeInteger(requestedVersion)) {
    return new NextResponse(null, { status: 404 });
  }

  try {
    const image = await getProductImage(id);
    if (
      !image ||
      image.version !== requestedVersion ||
      (!image.published && !(await hasAdminSession()))
    ) {
      return new NextResponse(null, { status: 404 });
    }

    const body = new Uint8Array(image.bytes.byteLength);
    body.set(image.bytes);
    return new NextResponse(body.buffer, {
      headers: {
        "Content-Type": image.contentType,
        "Cache-Control": image.published
          ? "public, max-age=0, s-maxage=60, stale-while-revalidate=300"
          : "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    return databaseUnavailable("loading a product image", error);
  }
}
