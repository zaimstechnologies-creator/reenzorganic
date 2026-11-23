export const productCategories = [
  { value: "dry-fruits", label: "Dry Fruits" },
  { value: "desi-items", label: "Desi Items" },
  { value: "nuts", label: "Nuts" },
  { value: "powders", label: "Powders" },
] as const;

export type ProductCategory = (typeof productCategories)[number]["value"];

export type ProductVariant = {
  id: string;
  title: string;
  priceCents: number;
};

export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  image: string;
  alt: string;
  variants: ProductVariant[];
  published: boolean;
  homepageFeatured: boolean;
  updatedAt: string;
};

export type ProductInput = Omit<Product, "id" | "image" | "updatedAt" | "homepageFeatured">;

export type ProductImageChange =
  | { type: "keep" }
  | { type: "remove" }
  | { type: "replace"; bytes: Uint8Array; contentType: "image/jpeg" | "image/png" | "image/webp" };

export type StoredProductImage = {
  bytes: Uint8Array;
  contentType: "image/jpeg" | "image/png" | "image/webp";
  published: boolean;
  version: number;
};

export const productCategoryLabel = (category: ProductCategory) =>
  productCategories.find((item) => item.value === category)?.label ?? "Products";

