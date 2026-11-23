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
      <article className="catalog-card">
        <DialogTrigger asChild>
          <button className="catalog-card-trigger" type="button">
            <span className="catalog-card-image">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              ) : (
                <span className="catalog-image-placeholder" aria-hidden="true">
                  Reenz Organic
                </span>
              )}
              <span className="catalog-card-category">{productCategoryLabel(product.category)}</span>
            </span>
            <span className="catalog-card-content">
              <span className="catalog-card-title" title={product.name}>
                {title}
              </span>
              <span className="catalog-card-description">
                {product.description || "A thoughtful favorite for your pantry."}
              </span>
              <span className="catalog-card-meta">
                <strong>{formatPriceRange(product)}</strong>
              </span>
              <span className="catalog-card-more">
                View details <ArrowRight aria-hidden="true" size={16} />
              </span>
            </span>
          </button>
        </DialogTrigger>
      </article>

      <DialogContent className="catalog-product-dialog sm:max-w-3xl">
        <div className="catalog-dialog-layout">
          <div className="catalog-dialog-image">
            {product.image ? (
              <Image src={product.image} alt={product.alt} fill sizes="(max-width: 640px) 90vw, 42vw" />
            ) : (
              <span className="catalog-image-placeholder" aria-hidden="true">
                Reenz Organic
              </span>
            )}
          </div>
          <div className="catalog-dialog-info">
            <p className="eyebrow">{productCategoryLabel(product.category)}</p>
            <DialogHeader className="catalog-dialog-header">
              <DialogTitle className="catalog-dialog-title">{title}</DialogTitle>
              <DialogDescription className="catalog-dialog-description">
                {product.description || "A thoughtful favorite for your pantry."}
              </DialogDescription>
            </DialogHeader>
            <label className="catalog-variant-label" htmlFor={`catalog-variant-${product.id}`}>
              Choose an option
            </label>
            <select
              className="catalog-variant-select"
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
            <p className="catalog-selected-price">
              <span>Unit price</span>
              <strong>{formatPrice(selectedVariant.priceCents)} PKR</strong>
            </p>
            <div className="catalog-purchase-row">
              <div className="catalog-quantity-control" aria-label="Quantity">
                <button
                  type="button"
                  aria-label={`Decrease ${title} quantity`}
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                >
                  <Minus aria-hidden="true" size={16} />
                </button>
                <output aria-live="polite" aria-label="Quantity">
                  {quantity}
                </output>
                <button
                  type="button"
                  aria-label={`Increase ${title} quantity`}
                  disabled={quantity >= 20}
                  onClick={() => setQuantity((current) => Math.min(20, current + 1))}
                >
                  <Plus aria-hidden="true" size={16} />
                </button>
              </div>
              <button
                className="button catalog-add-to-cart"
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
            <p className="catalog-cart-message" role="status" aria-live="polite">
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
    <div className="catalog-browser">
      <div className="catalog-layout">
        <aside className="catalog-sidebar" aria-label="Catalog filters">
          <div className="catalog-filter-heading">
            <p className="eyebrow">Browse with ease</p>
            <h2>Find your favorite</h2>
          </div>

          <label className="catalog-search">
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
                className="catalog-search-clear"
                type="button"
                aria-label="Clear search"
                onClick={() => setQuery("")}
              >
                <X aria-hidden="true" size={18} />
              </button>
            )}
          </label>

          <section className="catalog-sidebar-section" aria-labelledby="catalog-categories-heading">
            <h3 id="catalog-categories-heading">Product categories</h3>
            <nav className="catalog-categories" aria-label="Filter by product category">
              {categories.map((item) => (
                <button
                  className={`catalog-category${category === item.value ? " is-active" : ""}`}
                  key={item.value}
                  type="button"
                  aria-pressed={category === item.value}
                  onClick={() => setCategory(item.value)}
                >
                  <span className="catalog-category-name">{item.label}</span>
                  <span className="catalog-category-count">{item.count}</span>
                </button>
              ))}
            </nav>
          </section>

          <section className="catalog-sidebar-section catalog-featured" aria-labelledby="catalog-featured-heading">
            <h3 id="catalog-featured-heading">Featured products</h3>
            {featuredProducts.length > 0 ? (
              <div className="catalog-featured-list">
                {featuredProducts.map((product) => (
                  <button
                    className="catalog-featured-item"
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
                      />
                    ) : (
                      <span className="catalog-featured-placeholder" aria-hidden="true" />
                    )}
                    <span className="catalog-featured-copy">
                      <strong>{product.name.replace(/^(?:REENZ\s+|Imperial\s+)/i, "")}</strong>
                      <span>{formatPriceRange(product)}</span>
                    </span>
                    <ArrowRight aria-hidden="true" size={16} />
                  </button>
                ))}
              </div>
            ) : (
              <p className="catalog-featured-empty">Featured picks will appear here soon.</p>
            )}
          </section>
        </aside>

        <div className="catalog-results">
          <header className="catalog-results-header">
            <div>
              <p className="eyebrow">Our selection</p>
              <h2 id="catalog-products-heading">The collection</h2>
              <p className="catalog-result-status" role="status" aria-live="polite">
                Showing {visibleProducts.length} of {products.length}{" "}
                {products.length === 1 ? "product" : "products"}
              </p>
            </div>
            <div className="catalog-results-actions">
              {cartCount > 0 && (
                <span className="catalog-cart-count">
                  <ShoppingCart aria-hidden="true" size={15} />
                  {cartCount} in cart
                </span>
              )}
              {(category !== "all" || query) && (
                <button className="catalog-reset-button" type="button" onClick={clearFilters}>
                  Clear filters
                </button>
              )}
            </div>
          </header>
          <p className="catalog-cart-status" role="status" aria-live="polite">
            {cartStatus}
          </p>

          <section className="catalog-product-section" aria-labelledby="catalog-products-heading">
            {visibleProducts.length > 0 ? (
              <div className="catalog-products-scroll" role="region" aria-label="Product results" tabIndex={0}>
                <div className="catalog-products-grid">
                  {visibleProducts.map((product) => (
                    <CatalogProductCard key={product.id} product={product} onAddToCart={addToCart} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="catalog-empty">
                <span className="catalog-empty-mark" aria-hidden="true">
                  <Search size={20} />
                </span>
                <h3>{products.length ? "No matches just yet" : "A fresh collection is on its way"}</h3>
                <p>
                  {products.length
                    ? "Try another search or category to find what you need."
                    : "There are no available products right now. Please check back soon."}
                </p>
                {(category !== "all" || query) && (
                  <button className="button" type="button" onClick={clearFilters}>
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
