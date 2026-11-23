"use client";

import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";

export function CartButton() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    function updateCount(event: Event) {
      if (event instanceof CustomEvent && typeof event.detail === "number") {
        setCount((current) => current + event.detail);
      }
    }

    window.addEventListener("reenz:cart-add", updateCount);
    return () => window.removeEventListener("reenz:cart-add", updateCount);
  }, []);

  return (
    <button
      className="relative grid size-11 cursor-pointer place-items-center rounded-full border border-reenz-sage/30 bg-white/5 text-reenz-sage transition-colors hover:border-reenz-gold/60 hover:bg-white/10 hover:text-reenz-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-reenz-gold"
      type="button"
      aria-label={`View shopping cart, ${count} ${count === 1 ? "item" : "items"}`}
      aria-haspopup="dialog"
      aria-controls="cart-dialog"
    >
      <ShoppingCart aria-hidden="true" size={20} />
      <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-reenz-forest text-[0.65rem] font-bold text-white" aria-live="polite">
        {count}
      </span>
    </button>
  );
}
