import { connection } from "next/server";
import { CheckoutPage } from "@/components/checkout-page";
import { StorefrontShell } from "@/components/storefront";
import { getProducts } from "@/lib/database";

export const instant = false;
export const metadata = { title: "Checkout | Reenz Organic" };

export default async function CheckoutRoute() {
  await connection();
  const products = await getProducts();

  return (
    <StorefrontShell currentPage="checkout">
      <CheckoutPage products={products} />
    </StorefrontShell>
  );
}
