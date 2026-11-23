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
      className="cart-button"
      type="button"
      aria-label={`View shopping cart, ${count} ${count === 1 ? "item" : "items"}`}
      aria-haspopup="dialog"
      aria-controls="cart-dialog"
    >
      <ShoppingCart aria-hidden="true" size={20} />
      <span className="cart-count" aria-live="polite">
        {count}
      </span>
    </button>
  );
}
