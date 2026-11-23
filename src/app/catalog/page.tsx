import { connection } from "next/server";
import { CatalogBrowser } from "@/components/catalog-browser";
import { StorefrontShell } from "@/components/storefront";
import { getProducts } from "@/lib/database";
import { productCategories } from "@/lib/products";

export const instant = false;

type CatalogSearchParams = {
  category?: string | string[];
};

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<CatalogSearchParams>;
}) {
  await connection();
  const [products, params] = await Promise.all([getProducts(), searchParams]);
  const requestedCategory = typeof params.category === "string" ? params.category : "all";
  const initialCategory =
    productCategories.find((category) => category.value === requestedCategory)?.value ?? "all";

  return (
    <StorefrontShell currentPage="catalog">
      <main className="catalog-page">
        <section className="section-wrap" aria-labelledby="catalog-heading">
          <div className="container">
            <header className="catalog-intro">
              <div className="catalog-intro-copy">
                <p className="eyebrow">Thoughtful pantry, naturally</p>
                <h1 id="catalog-heading">
                  Shop our <em>collection</em>
                </h1>
                <p>
                  Discover everyday favorites, carefully selected for good food and good
                  moments.
                </p>
              </div>
              <div className="catalog-live-count" aria-label={`${products.length} products available`}>
                <strong>{products.length}</strong>
                <span>{products.length === 1 ? "product" : "products"} to explore</span>
              </div>
            </header>

            <CatalogBrowser products={products} initialCategory={initialCategory} />
          </div>
        </section>
      </main>
    </StorefrontShell>
  );
}
