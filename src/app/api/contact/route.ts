import { NextResponse } from "next/server";
import { createContactMessage } from "@/lib/database";
import { isSameOriginRequest } from "@/lib/admin-auth";

type ContactBody = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

function isContactBody(value: unknown): value is ContactBody {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const body = value as Record<string, unknown>;
  return (
    typeof body.name === "string" &&
    body.name.trim().length >= 2 &&
    body.name.length <= 100 &&
    typeof body.email === "string" &&
    body.email.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email) &&
    typeof body.phone === "string" &&
    body.phone.length <= 30 &&
    /^[0-9+().\-\s]*$/.test(body.phone) &&
    typeof body.message === "string" &&
    body.message.trim().length >= 5 &&
    body.message.length <= 5000
  );
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Request origin could not be verified." }, { status: 403 });
  }
  if (Number(request.headers.get("content-length") ?? 0) > 16384) {
    return NextResponse.json({ error: "The message is too large." }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Enter valid contact details." }, { status: 400 });
  }
  if (!isContactBody(body)) {
    return NextResponse.json(
      { error: "Enter a valid name, email address and message." },
      { status: 400 },
    );
  }

  try {
    await createContactMessage({
      name: body.name.trim(),
      email: body.email.trim(),
      phone: body.phone.trim(),
      message: body.message.trim(),
    });
  } catch (error) {
    console.error("Could not save contact message.", error);
    return NextResponse.json(
      { error: "Your message could not be sent right now. Please try again shortly." },
      { status: 503 },
    );
  }

  return NextResponse.json({ sent: true }, { status: 201 });
}
