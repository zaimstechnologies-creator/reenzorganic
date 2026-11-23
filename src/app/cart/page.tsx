import { connection } from "next/server";
import { ShoppingCartPage } from "@/components/shopping-cart-page";
import { StorefrontShell } from "@/components/storefront";
import { getProducts } from "@/lib/database";

export const instant = false;
export const metadata = { title: "Shopping cart | Reenz Organic" };

export default async function CartPage() {
  await connection();
  const products = await getProducts();

  return (
    <StorefrontShell currentPage="cart">
      <ShoppingCartPage products={products} />
    </StorefrontShell>
  );
}
