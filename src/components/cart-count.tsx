"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCartState } from "@/components/use-cart-state";

export function CartButton() {
  const { lines } = useCartState();
  const count = lines.reduce((total, line) => total + line.quantity, 0);

  return (
    <Link
      className="relative grid size-11 cursor-pointer place-items-center rounded-full border border-reenz-sage/30 bg-white/5 text-reenz-sage transition-colors hover:border-reenz-gold/60 hover:bg-white/10 hover:text-reenz-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-reenz-gold"
      href="/cart"
      aria-label={`View shopping cart, ${count} ${count === 1 ? "item" : "items"}`}
    >
      <ShoppingCart aria-hidden="true" size={20} />
      <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-reenz-forest text-[0.65rem] font-bold text-white" aria-live="polite">
        {count}
      </span>
    </Link>
  );
}
