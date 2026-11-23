"use client";

import { useState, type ReactNode } from "react";
import { addCartLine } from "@/lib/cart";

export function AddToCartButton({
  productId,
  variantId,
  productName,
  className,
  children = "Add to cart",
}: {
  productId: string;
  variantId: string;
  productName: string;
  className: string;
  children?: ReactNode;
}) {
  const [status, setStatus] = useState("");

  function addToCart() {
    try {
      addCartLine(productId, variantId, 1);
      setStatus(`${productName} added to your cart.`);
    } catch (cause) {
      setStatus(cause instanceof Error ? cause.message : "The item could not be added.");
    }
  }

  return (
    <>
      <button className={className} type="button" onClick={addToCart}>
        {children}
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {status}
      </span>
    </>
  );
}
