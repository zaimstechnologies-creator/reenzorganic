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
      <main className="min-h-screen bg-reenz-cream">
        <section className="py-14 md:py-20" aria-labelledby="catalog-heading">
          <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
            <header className="mb-9 flex flex-col gap-6 border-b border-reenz-border pb-8 md:flex-row md:items-center md:justify-between">
              <div className="max-w-3xl">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-reenz-leaf">Thoughtful pantry, naturally</p>
                <h1 id="catalog-heading" className="mb-3 font-heading text-4xl leading-tight text-reenz-forest [&_em]:font-normal [&_em]:text-reenz-leaf">
                  Shop our <em>collection</em>
                </h1>
                <p className="m-0 max-w-2xl leading-7 text-reenz-muted">
                  Discover everyday favorites, carefully selected for good food and good
                  moments.
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3 self-start rounded-2xl bg-reenz-sage px-5 py-3" aria-label={`${products.length} products available`}>
                <strong className="font-heading text-3xl leading-none text-reenz-green">{products.length}</strong>
                <span className="text-sm font-medium text-reenz-green">{products.length === 1 ? "product" : "products"} to explore</span>
              </div>
            </header>

            <CatalogBrowser products={products} initialCategory={initialCategory} />
          </div>
        </section>
      </main>
    </StorefrontShell>
  );
}
