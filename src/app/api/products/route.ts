import { NextResponse } from "next/server";
import { getProducts } from "@/lib/database";
import { hasAdminSession } from "@/lib/admin-auth";
import { databaseUnavailable } from "@/lib/api-errors";

export async function GET(request: Request) {
  const includeUnpublished =
    new URL(request.url).searchParams.get("includeUnpublished") === "true";
  if (includeUnpublished && !(await hasAdminSession())) {
    return NextResponse.json({ error: "Sign in to view unpublished products." }, { status: 401 });
  }

  try {
    return NextResponse.json(
      { products: await getProducts(!includeUnpublished) },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return databaseUnavailable("loading products", error);
  }
}

