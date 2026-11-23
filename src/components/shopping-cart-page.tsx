"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Minus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { clearCart, removeCartLine, updateCartLineQuantity, type CartLine } from "@/lib/cart";
import type { Product } from "@/lib/products";
import { useCartState } from "@/components/use-cart-state";

function formatPrice(cents: number): string {
  return `Rs.${new Intl.NumberFormat("en-PK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100)}`;
}

function getProductAndVariant(line: CartLine, products: Product[]) {
  const product = products.find((item) => item.id === line.productId);
  const variant = product?.variants.find((item) => item.id === line.variantId);
  return { product, variant };
}

export function ShoppingCartPage({ products }: { products: Product[] }) {
  const { lines, ready, error: cartError } = useCartState();
  const [actionError, setActionError] = useState("");
  const resolvedLines = lines.map((line) => ({
    line,
    ...getProductAndVariant(line, products),
  }));
  const itemCount = lines.reduce((total, line) => total + line.quantity, 0);
  const subtotalCents = resolvedLines.reduce(
    (total, item) =>
      total + (item.variant?.priceCents ?? 0) * item.line.quantity,
    0,
  );
  const unavailableCount = resolvedLines.filter(
    (item) => !item.product || !item.variant,
  ).length;

  function runCartAction(action: () => void) {
    setActionError("");
    try {
      action();
    } catch (cause) {
      setActionError(cause instanceof Error ? cause.message : "The cart could not be updated.");
    }
  }

  return (
    <main className="min-h-screen bg-reenz-cream">
      <section className="py-12 sm:py-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-reenz-leaf">Your selection</p>
          <h1 className="mb-2 font-heading text-4xl leading-tight text-reenz-forest">Shopping cart</h1>
          <p className="mb-8 text-sm leading-6 text-reenz-muted">
            Review your items before adding delivery details.
          </p>

          {(cartError || actionError) && (
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
              <span>{actionError || cartError}</span>
              {cartError && (
                <button
                  className="cursor-pointer font-semibold underline underline-offset-4"
                  type="button"
                  onClick={() => runCartAction(clearCart)}
                >
                  Clear saved cart
                </button>
              )}
            </div>
          )}

          {!ready ? (
            <p className="rounded-2xl border border-reenz-border bg-reenz-paper p-6 text-sm text-reenz-muted" role="status">
              Loading your cart…
            </p>
          ) : !lines.length ? (
            <div className="grid justify-items-center rounded-2xl border border-dashed border-reenz-border bg-reenz-paper px-5 py-12 text-center">
              <h2 className="mb-2 font-heading text-2xl text-reenz-forest">Your cart is empty</h2>
              <p className="mb-5 text-sm text-reenz-muted">Find something lovely for your pantry.</p>
              <Link className="inline-flex min-h-11 items-center gap-2 rounded-full bg-reenz-green px-5 py-3 text-sm font-semibold text-white no-underline hover:bg-reenz-forest" href="/catalog">
                Browse products <ArrowRight aria-hidden="true" size={16} />
              </Link>
            </div>
          ) : (
            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
              <div className="grid gap-3">
                {resolvedLines.map(({ line, product, variant }) => (
                  <article className="flex min-w-0 flex-wrap items-center gap-4 rounded-2xl border border-reenz-border bg-reenz-paper p-4 sm:flex-nowrap" key={`${line.productId}:${line.variantId}`}>
                    {product?.image ? (
                      <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-reenz-sage">
                        <Image src={product.image} alt={product.alt} fill sizes="80px" className="object-cover" />
                      </div>
                    ) : (
                      <div className="grid size-20 shrink-0 place-items-center rounded-xl bg-reenz-sage text-xs text-reenz-muted" aria-hidden="true">
                        Image unavailable
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h2 className="mb-1 font-heading text-lg text-reenz-forest">
                        {product?.name.replace(/^(?:REENZ\s+|Imperial\s+)/i, "") ?? "Unavailable product"}
                      </h2>
                      <p className="m-0 text-sm text-reenz-muted">
                        {variant ? variant.title || "Available option" : "This option is no longer available"}
                      </p>
                      {variant && (
                        <p className="mt-1 text-sm font-semibold text-reenz-green">
                          {formatPrice(variant.priceCents)}
                        </p>
                      )}
                    </div>
                    <div className="flex min-w-0 items-center gap-3">
                      {variant ? (
                        <div className="inline-flex h-10 items-center rounded-full border border-reenz-border" aria-label={`Quantity for ${product?.name ?? "unavailable product"}`}>
                          <button
                            className="grid size-9 cursor-pointer place-items-center rounded-full text-reenz-green hover:bg-reenz-sage disabled:cursor-not-allowed disabled:opacity-40"
                            type="button"
                            aria-label={`Decrease ${product?.name ?? "product"} quantity`}
                            disabled={line.quantity <= 1}
                            onClick={() => runCartAction(() => updateCartLineQuantity(line.productId, line.variantId, line.quantity - 1))}
                          >
                            <Minus aria-hidden="true" size={15} />
                          </button>
                          <span className="min-w-7 text-center text-sm font-semibold text-reenz-forest">{line.quantity}</span>
                          <button
                            className="grid size-9 cursor-pointer place-items-center rounded-full text-reenz-green hover:bg-reenz-sage disabled:cursor-not-allowed disabled:opacity-40"
                            type="button"
                            aria-label={`Increase ${product?.name ?? "product"} quantity`}
                            disabled={line.quantity >= 20}
                            onClick={() => runCartAction(() => updateCartLineQuantity(line.productId, line.variantId, line.quantity + 1))}
                          >
                            <Plus aria-hidden="true" size={15} />
                          </button>
                        </div>
                      ) : null}
                      <button
                        className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full text-reenz-muted hover:bg-reenz-sage hover:text-reenz-forest"
                        type="button"
                        aria-label={`Remove ${product?.name ?? "unavailable product"} from cart`}
                        onClick={() => runCartAction(() => removeCartLine(line.productId, line.variantId))}
                      >
                        <Trash2 aria-hidden="true" size={17} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              <aside className="rounded-2xl border border-reenz-border bg-reenz-paper p-5 shadow-sm">
                <h2 className="mb-4 font-heading text-xl text-reenz-forest">Order summary</h2>
                <p className="mb-4 flex items-center justify-between border-b border-reenz-border pb-4 text-sm text-reenz-muted">
                  <span>{itemCount} {itemCount === 1 ? "item" : "items"}</span>
                  <strong className="text-reenz-forest">{formatPrice(subtotalCents)}</strong>
                </p>
                <p className="mb-5 text-xs leading-5 text-reenz-muted">
                  Cash on delivery. Delivery details are confirmed at checkout.
                </p>
                {unavailableCount ? (
                  <p className="m-0 text-sm text-reenz-clay" role="alert">
                    Remove unavailable options before checkout.
                  </p>
                ) : (
                  <Link className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-reenz-green px-5 py-3 text-sm font-semibold text-white no-underline hover:bg-reenz-forest" href="/checkout">
                    Continue to checkout <ArrowRight aria-hidden="true" size={16} />
                  </Link>
                )}
                <button
                  className="mt-3 min-h-10 w-full cursor-pointer rounded-full border border-reenz-border bg-transparent text-sm font-semibold text-reenz-green hover:bg-reenz-cream"
                  type="button"
                  onClick={() => runCartAction(clearCart)}
                >
                  Clear cart
                </button>
              </aside>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
