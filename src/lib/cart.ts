export type CartLine = {
  productId: string;
  variantId: string;
  quantity: number;
};

const CART_STORAGE_KEY = "reenz-organic-cart";
export const CART_CHANGE_EVENT = "reenz:cart-change";

function isCartLine(value: unknown): value is CartLine {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const line = value as Record<string, unknown>;
  return (
    typeof line.productId === "string" &&
    line.productId.length > 0 &&
    typeof line.variantId === "string" &&
    line.variantId.length > 0 &&
    Number.isInteger(line.quantity) &&
    Number(line.quantity) >= 1 &&
    Number(line.quantity) <= 20
  );
}

function validateQuantity(quantity: number) {
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
    throw new Error("Choose a quantity between 1 and 20.");
  }
}

export function readCartLines(): CartLine[] {
  const saved = window.localStorage.getItem(CART_STORAGE_KEY);
  if (saved === null) {
    return [];
  }

  let value: unknown;
  try {
    value = JSON.parse(saved);
  } catch (cause) {
    console.error("Could not read the saved cart.", cause);
    throw new Error("Your saved cart is invalid. Clear it to start a new cart.");
  }

  if (!Array.isArray(value) || !value.every(isCartLine)) {
    throw new Error("Your saved cart is invalid. Clear it to start a new cart.");
  }
  return value;
}

function writeCartLines(lines: CartLine[]) {
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines));
  window.dispatchEvent(new Event(CART_CHANGE_EVENT));
}

export function addCartLine(productId: string, variantId: string, quantity: number) {
  validateQuantity(quantity);
  const lines = readCartLines();
  const existing = lines.find(
    (line) => line.productId === productId && line.variantId === variantId,
  );

  if (existing) {
    const updatedQuantity = existing.quantity + quantity;
    validateQuantity(updatedQuantity);
    writeCartLines(
      lines.map((line) =>
        line === existing ? { ...line, quantity: updatedQuantity } : line,
      ),
    );
    return;
  }

  if (lines.length >= 25) {
    throw new Error("Your cart can contain up to 25 different product options.");
  }
  writeCartLines([...lines, { productId, variantId, quantity }]);
}

export function updateCartLineQuantity(
  productId: string,
  variantId: string,
  quantity: number,
) {
  validateQuantity(quantity);
  const lines = readCartLines();
  writeCartLines(
    lines.map((line) =>
      line.productId === productId && line.variantId === variantId
        ? { ...line, quantity }
        : line,
    ),
  );
}

export function removeCartLine(productId: string, variantId: string) {
  const lines = readCartLines();
  writeCartLines(
    lines.filter(
      (line) => line.productId !== productId || line.variantId !== variantId,
    ),
  );
}

export function clearCart() {
  writeCartLines([]);
}
