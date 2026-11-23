import { NextResponse } from "next/server";

export function databaseUnavailable(operation: string, error: unknown) {
  console.error(`Database request failed while ${operation}.`, error);
  return NextResponse.json(
    { error: "The store database is temporarily unavailable. Check the database connection and try again." },
    { status: 503, headers: { "Cache-Control": "no-store" } },
  );
}
