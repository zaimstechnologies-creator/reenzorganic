import { randomUUID } from "node:crypto";
import { productCategories, type ProductInput, type ProductVariant } from "@/lib/products";

type ValidationResult =
  | { success: true; product: ProductInput }
  | { success: false; message: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function validateProductInput(value: unknown): ValidationResult {
  if (!isRecord(value)) {
    return { success: false, message: "Enter valid product details." };
  }

  const { name, category, description, alt, variants, published } = value;
  if (
    typeof name !== "string" ||
    name.trim().length < 1 ||
    name.trim().length > 160 ||
    typeof category !== "string" ||
    !productCategories.some((item) => item.value === category) ||
    typeof description !== "string" ||
    description.length > 5000 ||
    (alt !== undefined && typeof alt !== "string") ||
    typeof published !== "boolean" ||
    !Array.isArray(variants) ||
    variants.length < 1 ||
    variants.length > 20
  ) {
    return {
      success: false,
      message: "Check the product name, category, description, and publication status.",
    };
  }

  const parsedVariants: ProductVariant[] = [];
  const variantIds = new Set<string>();
  for (const variant of variants) {
    if (
      !isRecord(variant) ||
      (variant.id !== undefined &&
        (typeof variant.id !== "string" || !/^[\w.:-]{1,100}$/.test(variant.id))) ||
      typeof variant.title !== "string" ||
      variant.title.length > 100 ||
      !Number.isSafeInteger(variant.priceCents) ||
      Number(variant.priceCents) < 0 ||
      Number(variant.priceCents) > 1_000_000_000
    ) {
      return {
        success: false,
        message: "Enter a valid option name and price.",
      };
    }

    const id = typeof variant.id === "string" && variant.id ? variant.id : randomUUID();
    if (variantIds.has(id)) {
      return { success: false, message: "Each product option must have a unique ID." };
    }
    variantIds.add(id);

    parsedVariants.push({
      id,
      title: variant.title.trim(),
      priceCents: Number(variant.priceCents),
    });
  }

  return {
    success: true,
    product: {
      name: name.trim(),
      category: category as ProductInput["category"],
      description: description.trim(),
      alt: typeof alt === "string" && alt.trim() ? alt.trim().slice(0, 300) : name.trim(),
      variants: parsedVariants,
      published,
    },
  };
}

