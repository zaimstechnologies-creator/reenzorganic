"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ArrowRight, Minus, Plus, Search, ShoppingCart, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  productCategories,
  productCategoryLabel,
  type Product,
  type ProductCategory,
  type ProductVariant,
} from "@/lib/products";

type CatalogCategory = ProductCategory | "all";

function formatPrice(cents: number): string {
  return `Rs.${new Intl.NumberFormat("en-PK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100)}`;
}

function formatPriceRange(product: Product): string {
  const prices = product.variants.map((variant) => variant.priceCents);
  const low = Math.min(...prices);
  const high = Math.max(...prices);

  return low === high ? formatPrice(low) : `From ${formatPrice(low)}`;
}

function CatalogProductCard({
  product,
  onAddToCart,
}: {
  product: Product;
  onAddToCart: (product: Product, variant: ProductVariant, quantity: number) => void;
}) {
  const defaultVariant = product.variants[0];
  const [selectedVariantId, setSelectedVariantId] = useState(defaultVariant.id);
  const [quantity, setQuantity] = useState(1);
  const [cartMessage, setCartMessage] = useState("");
  const selectedVariant =
    product.variants.find((variant) => variant.id === selectedVariantId) ?? defaultVariant;
  const title = product.name.replace(/^(?:REENZ\s+|Imperial\s+)/i, "");

  return (
    <Dialog>
      <article className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-reenz-border bg-reenz-paper shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
        <DialogTrigger asChild>
          <button className="group flex h-full flex-1 cursor-pointer flex-col border-0 bg-transparent p-0 text-left text-reenz-ink focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-reenz-green" type="button">
            <span className="relative block aspect-[4/3] w-full overflow-hidden bg-reenz-sage">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.alt}
                  fill
                  sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, (max-width: 1535px) 33vw, 25vw"
                  quality={90}
                  className="size-full object-cover transition duration-300"
                />
              ) : (
                <span className="grid size-full place-items-center bg-reenz-sage font-heading text-xl text-reenz-leaf" aria-hidden="true">
                  Reenz Organic
                </span>
              )}
              <span className="absolute bottom-3 left-3 rounded-full bg-reenz-paper/95 px-3 py-1 text-xs font-semibold text-reenz-green shadow-sm">{productCategoryLabel(product.category)}</span>
            </span>
            <span className="flex flex-1 flex-col p-4">
              <span className="line-clamp-2 min-h-[3.5rem] font-heading text-xl font-medium leading-snug text-reenz-forest" title={product.name}>
                {title}
              </span>
              <span className="mt-2 line-clamp-2 min-h-11 text-sm leading-5 text-reenz-muted">
                {product.description || "A thoughtful favorite for your pantry."}
              </span>
              <span className="mt-auto flex items-center justify-start gap-2 border-t border-reenz-border pt-3 text-xs text-reenz-muted">
                <strong className="text-sm font-semibold text-reenz-green">{formatPriceRange(product)}</strong>
              </span>
              <span className="mt-3 flex items-center justify-between text-sm font-semibold text-reenz-green">
                View details <ArrowRight aria-hidden="true" size={16} />
              </span>
            </span>
          </button>
        </DialogTrigger>
      </article>

      <DialogContent className="w-[min(94vw,900px)] max-h-[90vh] overflow-y-auto rounded-3xl border border-reenz-border bg-reenz-paper p-5 text-reenz-ink shadow-2xl sm:max-w-3xl">
        <div className="grid gap-6 sm:grid-cols-2 sm:items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-reenz-sage">
            {product.image ? (
              <Image src={product.image} alt={product.alt} fill sizes="(max-width: 640px) 90vw, 42vw" quality={90} className="size-full object-cover" />
            ) : (
              <span className="grid size-full place-items-center bg-reenz-sage font-heading text-xl text-reenz-leaf" aria-hidden="true">
                Reenz Organic
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-reenz-leaf">{productCategoryLabel(product.category)}</p>
            <DialogHeader className="gap-3">
              <DialogTitle className="text-3xl leading-tight text-reenz-forest">{title}</DialogTitle>
              <DialogDescription className="leading-6 text-reenz-muted">
                {product.description || "A thoughtful favorite for your pantry."}
              </DialogDescription>
            </DialogHeader>
            <label className="mt-5 block text-sm font-semibold text-reenz-green" htmlFor={`catalog-variant-${product.id}`}>
              Choose an option
            </label>
            <select
              className="mt-2 min-h-12 w-full rounded-xl border border-reenz-border bg-reenz-paper px-3 text-sm text-reenz-ink outline-none focus:border-reenz-leaf focus:ring-2 focus:ring-reenz-leaf/20"
              id={`catalog-variant-${product.id}`}
              value={selectedVariant.id}
              onChange={(event) => setSelectedVariantId(event.currentTarget.value)}
            >
              {product.variants.map((variant) => (
                <option key={variant.id} value={variant.id}>
                  {variant.title || "Available option"} — {formatPrice(variant.priceCents)} PKR
                </option>
              ))}
            </select>
            <p className="mt-4 flex items-center justify-between border-t border-reenz-border pt-3 text-sm text-reenz-muted">
              <span>Unit price</span>
              <strong className="font-semibold text-reenz-green">{formatPrice(selectedVariant.priceCents)} PKR</strong>
            </p>
            <div className="mt-4 grid grid-cols-[auto_1fr] items-center gap-3">
              <div className="inline-flex min-h-11 items-center rounded-full border border-reenz-border bg-reenz-paper" aria-label="Quantity">
                <button
                  type="button"
                  aria-label={`Decrease ${title} quantity`}
                  disabled={quantity <= 1}
                  className="grid size-10 cursor-pointer place-items-center rounded-full border-0 bg-transparent text-reenz-green transition hover:bg-reenz-sage disabled:cursor-not-allowed disabled:opacity-40"
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                >
                  <Minus aria-hidden="true" size={16} />
                </button>
                <output className="min-w-8 text-center text-sm font-semibold tabular-nums text-reenz-forest" aria-live="polite" aria-label="Quantity">
                  {quantity}
                </output>
                <button
                  type="button"
                  aria-label={`Increase ${title} quantity`}
                  disabled={quantity >= 20}
                  className="grid size-10 cursor-pointer place-items-center rounded-full border-0 bg-transparent text-reenz-green transition hover:bg-reenz-sage disabled:cursor-not-allowed disabled:opacity-40"
                  onClick={() => setQuantity((current) => Math.min(20, current + 1))}
                >
                  <Plus aria-hidden="true" size={16} />
                </button>
              </div>
              <button
                className="inline-flex min-h-11 min-w-0 items-center justify-center gap-2 rounded-full bg-reenz-green px-4 py-3 text-sm font-semibold text-white no-underline shadow-sm transition hover:bg-reenz-forest"
                type="button"
                onClick={() => {
                  onAddToCart(product, selectedVariant, quantity);
                  setCartMessage(`${quantity} ${quantity === 1 ? "item" : "items"} added to your cart.`);
                }}
              >
                <ShoppingCart aria-hidden="true" size={17} />
                Add to cart
              </button>
            </div>
            <p className="mt-3 min-h-5 text-sm font-medium text-reenz-green" role="status" aria-live="polite">
              {cartMessage}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function CatalogBrowser({
  products,
  initialCategory = "all",
}: {
  products: Product[];
  initialCategory?: CatalogCategory;
}) {
  const [category, setCategory] = useState<CatalogCategory>(initialCategory);
  const [query, setQuery] = useState("");
  const [cartQuantities, setCartQuantities] = useState<Record<string, number>>({});
  const [cartStatus, setCartStatus] = useState("");
  const cartCount = Object.values(cartQuantities).reduce((total, quantity) => total + quantity, 0);

  function addToCart(product: Product, variant: ProductVariant, quantity: number) {
    setCartQuantities((current) => ({
      ...current,
      [`${product.id}:${variant.id}`]: (current[`${product.id}:${variant.id}`] ?? 0) + quantity,
    }));
    window.dispatchEvent(new CustomEvent("reenz:cart-add", { detail: quantity }));
    setCartStatus(`${product.name} added to cart.`);
  }

  const categories = [
    { value: "all" as const, label: "All products", count: products.length },
    ...productCategories.map(({ value, label }) => ({
      value,
      label,
      count: products.filter((product) => product.category === value).length,
    })),
  ];
  const featuredProducts = [
    ...products.filter((product) => product.homepageFeatured),
    ...products.filter((product) => !product.homepageFeatured),
  ].slice(0, 4);

  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    const matching = products.filter((product) => {
      const matchesCategory = category === "all" || product.category === category;
      const searchableText = [
        product.name,
        product.description,
        productCategoryLabel(product.category),
        ...product.variants.map((variant) => variant.title),
      ]
        .join(" ")
        .toLocaleLowerCase();

      return matchesCategory && (!normalizedQuery || searchableText.includes(normalizedQuery));
    });

    return matching;
  }, [category, products, query]);

  function clearFilters() {
    setCategory("all");
    setQuery("");
  }

  return (
    <div className="rounded-3xl border border-reenz-border bg-reenz-paper p-4 shadow-sm sm:p-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(220px,250px)_minmax(0,1fr)] lg:items-start">
        <aside className="grid content-start gap-5 rounded-2xl bg-reenz-cream/70 p-4 lg:sticky lg:top-4" aria-label="Catalog filters">
          <div className="grid gap-1">
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-reenz-leaf">Browse with ease</p>
            <h2 className="m-0 font-heading text-2xl leading-tight text-reenz-forest">Find your favorite</h2>
          </div>

          <label className="flex min-h-12 min-w-0 items-center gap-3 rounded-xl border border-reenz-border bg-reenz-paper px-4 transition focus-within:border-reenz-leaf focus-within:ring-2 focus-within:ring-reenz-leaf/15">
            <Search aria-hidden="true" size={19} />
            <span className="sr-only">Search products</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.currentTarget.value)}
              placeholder="Search products"
              autoComplete="off"
              enterKeyHint="search"
            />
            {query && (
              <button
                className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-full border-0 bg-transparent text-reenz-muted transition hover:bg-reenz-sage"
                type="button"
                aria-label="Clear search"
                onClick={() => setQuery("")}
              >
                <X aria-hidden="true" size={18} />
              </button>
            )}
          </label>

          <section className="grid gap-3" aria-labelledby="catalog-categories-heading">
            <h3 id="catalog-categories-heading" className="m-0 font-heading text-xl text-reenz-forest">Product categories</h3>
            <nav className="m-0 grid grid-cols-2 gap-2 sm:grid-cols-2 lg:grid-cols-1" aria-label="Filter by product category">
              {categories.map((item) => (
                <button
                  className={`flex min-h-12 cursor-pointer items-center justify-between gap-2 rounded-xl border px-3 py-2 text-left text-sm transition ${category === item.value ? "border-reenz-forest bg-reenz-forest text-reenz-paper" : "border-reenz-border bg-reenz-paper text-reenz-green hover:border-reenz-leaf hover:bg-reenz-sage"}`}
                  key={item.value}
                  type="button"
                  aria-pressed={category === item.value}
                  onClick={() => setCategory(item.value)}
                >
                  <span className="font-semibold">{item.label}</span>
                  <span className={`grid size-6 shrink-0 place-items-center rounded-full text-xs font-bold ${category === item.value ? "bg-reenz-paper/15 text-reenz-paper" : "bg-reenz-sage text-reenz-green"}`}>{item.count}</span>
                </button>
              ))}
            </nav>
          </section>

          <section className="grid gap-3" aria-labelledby="catalog-featured-heading">
            <h3 id="catalog-featured-heading" className="m-0 font-heading text-xl text-reenz-forest">Featured products</h3>
            {featuredProducts.length > 0 ? (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
                {featuredProducts.map((product) => (
                  <button
                    className="flex min-w-0 cursor-pointer items-center gap-3 rounded-xl border border-reenz-border bg-reenz-paper p-2 text-left transition hover:border-reenz-leaf hover:bg-white"
                    key={product.id}
                    type="button"
                    onClick={() => {
                      setCategory("all");
                      setQuery(product.name);
                    }}
                  >
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt=""
                        width={56}
                        height={56}
                        sizes="56px"
                        className="size-14 shrink-0 rounded-lg object-cover"
                      />
                    ) : (
                      <span className="size-14 shrink-0 rounded-lg bg-reenz-sage" aria-hidden="true" />
                    )}
                    <span className="grid min-w-0 flex-1 gap-1">
                      <strong className="line-clamp-1 text-sm font-semibold text-reenz-forest">{product.name.replace(/^(?:REENZ\s+|Imperial\s+)/i, "")}</strong>
                      <span className="text-xs text-reenz-muted">{formatPriceRange(product)}</span>
                    </span>
                    <ArrowRight aria-hidden="true" size={16} />
                  </button>
                ))}
              </div>
            ) : (
              <p className="m-0 rounded-xl border border-dashed border-reenz-border bg-reenz-paper/70 p-3 text-sm leading-6 text-reenz-muted">Featured picks will appear here soon.</p>
            )}
          </section>
        </aside>

        <div className="min-w-0">
          <header className="mb-4 flex flex-col gap-4 border-b border-reenz-border pb-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-reenz-leaf">Our selection</p>
              <h2 id="catalog-products-heading" className="mb-1 font-heading text-2xl text-reenz-forest">The collection</h2>
              <p className="m-0 text-sm text-reenz-muted" role="status" aria-live="polite">
                Showing {visibleProducts.length} of {products.length}{" "}
                {products.length === 1 ? "product" : "products"}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 md:justify-end">
              {cartCount > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-reenz-sage px-3 py-1.5 text-xs font-semibold text-reenz-green">
                  <ShoppingCart aria-hidden="true" size={15} />
                  {cartCount} in cart
                </span>
              )}
              {(category !== "all" || query) && (
                <button className="shrink-0 cursor-pointer border-0 bg-transparent text-sm font-semibold text-reenz-green underline decoration-reenz-gold underline-offset-4 hover:text-reenz-leaf" type="button" onClick={clearFilters}>
                  Clear filters
                </button>
              )}
            </div>
          </header>
          <p className="sr-only" role="status" aria-live="polite">
            {cartStatus}
          </p>

          <section className="pt-4" aria-labelledby="catalog-products-heading">
            {visibleProducts.length > 0 ? (
              <div className="w-full px-1 pb-3" role="region" aria-label="Product results" tabIndex={0}>
                <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {visibleProducts.map((product) => (
                    <CatalogProductCard key={product.id} product={product} onAddToCart={addToCart} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid justify-items-center rounded-2xl border border-dashed border-reenz-border bg-reenz-cream/60 px-5 py-12 text-center">
                <span className="mb-4 grid size-12 place-items-center rounded-full bg-reenz-sage text-reenz-leaf" aria-hidden="true">
                  <Search size={20} />
                </span>
                <h3 className="mb-2 font-heading text-2xl text-reenz-forest">{products.length ? "No matches just yet" : "A fresh collection is on its way"}</h3>
                <p className="mb-5 max-w-md text-sm leading-6 text-reenz-muted">
                  {products.length
                    ? "Try another search or category to find what you need."
                    : "There are no available products right now. Please check back soon."}
                </p>
                {(category !== "all" || query) && (
                  <button className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full bg-reenz-green px-5 py-3 text-sm font-semibold text-white no-underline shadow-sm transition hover:bg-reenz-forest" type="button" onClick={clearFilters}>
                    View all products
                  </button>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
