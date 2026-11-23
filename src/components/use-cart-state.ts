"use client";

import { useEffect, useState } from "react";
import { CART_CHANGE_EVENT, readCartLines, type CartLine } from "@/lib/cart";

export function useCartState() {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    function refreshCart() {
      try {
        setLines(readCartLines());
        setError("");
      } catch (cause) {
        setLines([]);
        setError(
          cause instanceof Error ? cause.message : "The saved cart could not be loaded.",
        );
      } finally {
        setReady(true);
      }
    }

    refreshCart();
    window.addEventListener(CART_CHANGE_EVENT, refreshCart);
    window.addEventListener("storage", refreshCart);
    return () => {
      window.removeEventListener(CART_CHANGE_EVENT, refreshCart);
      window.removeEventListener("storage", refreshCart);
    };
  }, []);

  return { lines, ready, error };
}
