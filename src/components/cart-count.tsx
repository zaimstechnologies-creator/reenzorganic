"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCartState } from "@/components/use-cart-state";

export function CartButton() {
  const { lines } = useCartState();
  const count = lines.reduce((total, line) => total + line.quantity, 0);

  return (
    <Link
      className="group relative grid size-10 cursor-pointer place-items-center rounded-full border border-reenz-sage/15 bg-[#212E24] text-reenz-sage transition-all hover:bg-reenz-green hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-reenz-gold"
      href="/cart"
      aria-label={`View shopping cart, ${count} ${count === 1 ? "item" : "items"}`}
    >
      <ShoppingBag aria-hidden="true" className="transition-transform group-hover:scale-105" size={19} strokeWidth={1.75} />
      <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full border-2 border-[#1a251d] bg-reenz-gold text-[10px] font-bold leading-none text-reenz-forest" aria-live="polite">
        {count}
      </span>
    </Link>
  );
}
