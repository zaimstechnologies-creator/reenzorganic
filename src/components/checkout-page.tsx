"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { clearCart, type CartLine } from "@/lib/cart";
import type { Product } from "@/lib/products";
import { useCartState } from "@/components/use-cart-state";

function formatPrice(cents: number): string {
  return `Rs.${new Intl.NumberFormat("en-PK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100)}`;
}

function getErrorMessage(value: unknown): string | null {
  if (typeof value !== "object" || value === null || !("error" in value)) {
    return null;
  }
  return typeof value.error === "string" ? value.error : null;
}

function getProductAndVariant(line: CartLine, products: Product[]) {
  const product = products.find((item) => item.id === line.productId);
  const variant = product?.variants.find((item) => item.id === line.variantId);
  return { product, variant };
}

type PlacedOrder = {
  id: string;
  totalCents: number;
};

function readPlacedOrder(value: unknown): PlacedOrder | null {
  if (
    typeof value !== "object" ||
    value === null ||
    !("order" in value) ||
    typeof value.order !== "object" ||
    value.order === null ||
    !("id" in value.order) ||
    typeof value.order.id !== "string" ||
    !("totalCents" in value.order) ||
    typeof value.order.totalCents !== "number" ||
    !Number.isSafeInteger(value.order.totalCents) ||
    value.order.totalCents < 0
  ) {
    return null;
  }
  return { id: value.order.id, totalCents: value.order.totalCents };
}

export function CheckoutPage({ products }: { products: Product[] }) {
  const { lines, ready, error: cartError } = useCartState();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [cartClearError, setCartClearError] = useState("");
  const [placedOrder, setPlacedOrder] = useState<PlacedOrder | null>(null);
  const resolvedLines = lines.map((line) => ({
    line,
    ...getProductAndVariant(line, products),
  }));
  const availableLines = resolvedLines.filter(
    (item): item is typeof item & { product: Product; variant: NonNullable<typeof item.variant> } =>
      Boolean(item.product && item.variant),
  );
  const subtotalCents = availableLines.reduce(
    (total, item) => total + item.variant.priceCents * item.line.quantity,
    0,
  );
  const hasUnavailableLines = availableLines.length !== lines.length;

  async function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    setCartClearError("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      address: String(formData.get("address") ?? "").trim(),
      items: availableLines.map(({ line }) => ({
        variantId: line.variantId,
        quantity: line.quantity,
      })),
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result: unknown = await response.json();

      if (!response.ok) {
        throw new Error(getErrorMessage(result) ?? "Your order could not be placed.");
      }

      const order = readPlacedOrder(result);
      if (!order) {
        throw new Error("The order was received, but its confirmation could not be read.");
      }

      setPlacedOrder(order);
      try {
        clearCart();
      } catch (cause) {
        setCartClearError(
          cause instanceof Error
            ? cause.message
            : "Your order was placed, but this device could not clear the cart.",
        );
      }
    } catch (cause) {
      setSubmitError(
        cause instanceof Error ? cause.message : "Checkout could not be completed.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-reenz-cream">
      <section className="py-12 sm:py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <Link className="mb-6 inline-flex min-h-9 items-center gap-2 text-sm font-semibold text-reenz-green no-underline hover:text-reenz-leaf" href="/cart">
            <ArrowLeft aria-hidden="true" size={16} /> Back to cart
          </Link>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-reenz-leaf">Almost there</p>
          <h1 className="mb-2 font-heading text-4xl leading-tight text-reenz-forest">Checkout</h1>
          <p className="mb-8 text-sm leading-6 text-reenz-muted">
            Add your delivery details. Payment is collected on delivery.
          </p>

          {cartClearError && (
            <p className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900" role="status">
              {cartClearError}
            </p>
          )}

          {placedOrder ? (
            <div className="mx-auto grid max-w-2xl justify-items-center rounded-2xl border border-reenz-border bg-reenz-paper px-5 py-10 text-center shadow-sm sm:px-10">
              <span className="mb-4 grid size-12 place-items-center rounded-full bg-reenz-sage text-reenz-green">
                <CheckCircle2 aria-hidden="true" size={24} />
              </span>
              <h2 className="mb-2 font-heading text-3xl text-reenz-forest">Order received</h2>
              <p className="mb-2 text-sm leading-6 text-reenz-muted">
                Thank you. Your order has been saved and our team will follow up about delivery.
              </p>
              <p className="mb-5 text-sm text-reenz-muted">
                Order <strong className="font-semibold text-reenz-forest">#{placedOrder.id.slice(0, 8)}</strong>
                {" · "}
                Total <strong className="font-semibold text-reenz-forest">{formatPrice(placedOrder.totalCents)}</strong>
              </p>
              <p className="mb-6 text-xs text-reenz-muted">Pay in cash when your order arrives.</p>
              <Link className="inline-flex min-h-11 items-center gap-2 rounded-full bg-reenz-green px-5 py-3 text-sm font-semibold text-white no-underline hover:bg-reenz-forest" href="/catalog">
                Continue shopping <ArrowRight aria-hidden="true" size={16} />
              </Link>
            </div>
          ) : !ready ? (
            <p className="rounded-2xl border border-reenz-border bg-reenz-paper p-6 text-sm text-reenz-muted" role="status">
              Loading your order…
            </p>
          ) : cartError ? (
            <div className="rounded-2xl border border-reenz-border bg-reenz-paper p-6">
              <p className="mb-4 text-sm text-red-700" role="alert">{cartError}</p>
              <Link className="font-semibold text-reenz-green underline underline-offset-4" href="/cart">Return to your cart</Link>
            </div>
          ) : !lines.length ? (
            <div className="rounded-2xl border border-reenz-border bg-reenz-paper p-6">
              <p className="mb-4 text-sm text-reenz-muted">Your cart is empty. Add products before checking out.</p>
              <Link className="font-semibold text-reenz-green underline underline-offset-4" href="/catalog">Browse products</Link>
            </div>
          ) : hasUnavailableLines ? (
            <div className="rounded-2xl border border-reenz-border bg-reenz-paper p-6">
              <p className="mb-4 text-sm text-reenz-muted">
                A product option in your cart is no longer available. Remove it from your cart before placing the order.
              </p>
              <Link className="font-semibold text-reenz-green underline underline-offset-4" href="/cart">Review your cart</Link>
            </div>
          ) : (
            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
              <form className="grid gap-4 rounded-2xl border border-reenz-border bg-reenz-paper p-5 shadow-sm sm:p-6" onSubmit={submitOrder}>
                <h2 className="mb-1 font-heading text-2xl text-reenz-forest">Delivery details</h2>
                {submitError && (
                  <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                    {submitError}
                  </p>
                )}
                <label className="grid gap-2 text-sm font-semibold text-reenz-green">
                  Full name
                  <input className="min-h-12 w-full rounded-xl border border-reenz-border bg-white px-4 text-sm text-reenz-ink outline-none focus:border-reenz-leaf focus:ring-2 focus:ring-reenz-leaf/20" name="name" autoComplete="name" required minLength={2} maxLength={100} />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-reenz-green">
                  Phone number
                  <input className="min-h-12 w-full rounded-xl border border-reenz-border bg-white px-4 text-sm text-reenz-ink outline-none focus:border-reenz-leaf focus:ring-2 focus:ring-reenz-leaf/20" name="phone" type="tel" autoComplete="tel" required minLength={7} maxLength={30} />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-reenz-green">
                  Email <span className="font-normal text-reenz-muted">(optional)</span>
                  <input className="min-h-12 w-full rounded-xl border border-reenz-border bg-white px-4 text-sm text-reenz-ink outline-none focus:border-reenz-leaf focus:ring-2 focus:ring-reenz-leaf/20" name="email" type="email" autoComplete="email" maxLength={254} />
                </label>
                <label className="grid gap-2 text-sm font-semibold text-reenz-green">
                  Delivery address
                  <textarea className="w-full rounded-xl border border-reenz-border bg-white px-4 py-3 text-sm text-reenz-ink outline-none focus:border-reenz-leaf focus:ring-2 focus:ring-reenz-leaf/20" name="address" autoComplete="street-address" rows={3} required minLength={5} maxLength={500} />
                </label>
                <button className="mt-2 inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-reenz-green px-5 py-3 text-sm font-semibold text-white transition hover:bg-reenz-forest disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={submitting}>
                  {submitting ? "Placing order…" : "Place order"}
                  {!submitting && <ArrowRight aria-hidden="true" size={16} />}
                </button>
              </form>

              <aside className="rounded-2xl border border-reenz-border bg-reenz-paper p-5 shadow-sm">
                <h2 className="mb-4 font-heading text-xl text-reenz-forest">Order summary</h2>
                <ul className="mb-4 grid list-none gap-3 border-b border-reenz-border p-0 pb-4">
                  {resolvedLines.map(({ line, product, variant }) => (
                    <li className="flex items-start justify-between gap-3 text-sm" key={`${line.productId}:${line.variantId}`}>
                      <span className="min-w-0 text-reenz-muted">
                        {product?.name.replace(/^(?:REENZ\s+|Imperial\s+)/i, "")} · {variant?.title} × {line.quantity}
                      </span>
                      <strong className="shrink-0 text-reenz-forest">
                        {formatPrice((variant?.priceCents ?? 0) * line.quantity)}
                      </strong>
                    </li>
                  ))}
                </ul>
                <p className="mb-3 flex items-center justify-between text-sm text-reenz-muted">
                  <span>Total</span>
                  <strong className="text-base text-reenz-green">{formatPrice(subtotalCents)}</strong>
                </p>
                <p className="m-0 text-xs leading-5 text-reenz-muted">
                  Cash on delivery. Our team will confirm delivery details with you.
                </p>
              </aside>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
