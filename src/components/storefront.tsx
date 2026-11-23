/* eslint-disable @next/next/no-html-link-for-pages, @next/next/no-img-element -- Full-page navigation rebinds the supplied DOM-based cart script; it also fills the dialog image at runtime. */
import Image from "next/image";
import Script from "next/script";
import { FaFacebookF, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa6";
import { StoreNavigation } from "@/components/store-navigation";
import { CartButton } from "@/components/cart-count";
import { productCategoryLabel, type Product } from "@/lib/products";
import { resolveStoreImage } from "@/lib/store-images";

type StorefrontShellProps = {
  children: React.ReactNode;
  currentPage: "home" | "catalog" | "contact";
};

function ProductCard({
  product,
  eagerImage = false,
}: {
  product: Product;
  eagerImage?: boolean;
}) {
  const defaultVariant = product.variants[0];
  const cardTitle = product.name.replace(/^(?:REENZ\s+|Imperial\s+)/i, "");
  const categoryLabel = productCategoryLabel(product.category);
  const image = product.image;

  return (
    <article
      className="overflow-hidden rounded-2xl border border-reenz-border bg-reenz-paper shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-reenz-green"
      data-catalog-category={product.category}
      tabIndex={0}
      aria-controls="product-dialog"
      aria-label={`View details for ${product.name}`}
      data-product-id={product.id}
      data-product-name={product.name}
      data-product-image={product.image}
      data-product-alt={product.alt}
      data-product-price={(defaultVariant.priceCents / 100).toFixed(2)}
      data-variant-id={defaultVariant.id}
    >
      <div className="relative aspect-square overflow-hidden bg-reenz-sage">
        {image && (
          <Image
            src={image}
            alt={product.alt}
            width={900}
            height={900}
            sizes="(max-width: 700px) 100vw, (max-width: 1180px) 50vw, 25vw"
            loading={eagerImage ? "eager" : "lazy"}
          />
        )}
        <span className="absolute bottom-3 left-3 rounded-full bg-reenz-paper/95 px-3 py-1 text-xs font-semibold text-reenz-green">{categoryLabel}</span>
      </div>
      <div className="grid gap-2 p-4">
        <p className="m-0 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-reenz-leaf">{categoryLabel}</p>
        <h3 className="m-0 font-heading text-xl font-medium text-reenz-forest" title={product.name}>{cardTitle}</h3>
        {product.description && <p className="m-0 line-clamp-3 text-sm leading-6 text-reenz-muted">{product.description}</p>}
        <select
          data-variant-select
          aria-label={`Available options for ${product.name}`}
          hidden
          defaultValue={defaultVariant.id}
        >
          {product.variants.map((variant) => {
            return (
              <option
                key={variant.id}
                value={variant.id}
                data-variant-title={variant.title}
                data-variant-price={(variant.priceCents / 100).toFixed(2)}
              >
                {variant.title || "Available option"}
              </option>
            );
          })}
        </select>
        <button
          className="mt-2 inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-reenz-green px-5 py-3 text-sm font-semibold text-white no-underline shadow-sm transition hover:bg-reenz-forest focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-reenz-gold"
          type="button"
          aria-controls="product-dialog"
          aria-label={`Choose options and add ${product.name} to cart`}
        >
          Add to cart
        </button>
      </div>
    </article>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function StoreHeader({ currentPage }: { currentPage: StorefrontShellProps["currentPage"] }) {
  return (
    <header className={currentPage === "home" ? "absolute inset-x-0 top-0 z-30 border-b border-transparent bg-[#1a251d]/92 backdrop-blur-[12px]" : "relative z-30 border-b border-reenz-sage/20 bg-[#1a251d]"}>
      <div className="mx-auto grid min-h-20 w-full max-w-7xl grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4 px-4 md:px-8">
        <a className="inline-flex shrink-0 items-center" href="/" aria-label="Reenz Organic home">
          <Image src={resolveStoreImage("/assets/images/logo.png")} alt="Reenz Organic" className="h-auto w-32 object-contain md:w-32" width={320} height={112} priority />
        </a>
        <StoreNavigation currentPage={currentPage} />
        <div className="shrink-0 justify-self-end">
          <CartButton />
        </div>
      </div>
    </header>
  );
}

function StoreFooter() {
  return (
    <>
      <footer className="mt-auto border-t border-reenz-sage/10 bg-[#1a251d] text-reenz-paper">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-start gap-8 px-4 py-14 md:grid-cols-[minmax(0,1.4fr)_minmax(7rem,0.6fr)_minmax(10rem,0.8fr)] md:gap-12 md:px-8">
          <div>
            <a className="inline-flex w-fit shrink-0 items-center" href="/" aria-label="Reenz Organic home">
              <Image src={resolveStoreImage("/assets/images/logo.png")} alt="Reenz Organic" className="h-auto w-28 object-contain" width={320} height={112} />
            </a>
            <p className="mt-3 max-w-xs text-sm leading-6 text-reenz-paper/65">Thoughtful favorites, inspired by nature.</p>
          </div>
          <nav className="justify-self-start" aria-label="Explore our store">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-reenz-sage/75">Explore</h2>
            <div className="flex flex-col items-start gap-1">
              <a className="inline-flex min-h-9 items-center text-sm text-reenz-paper/75 no-underline transition hover:text-reenz-gold hover:underline hover:underline-offset-4 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-reenz-gold" href="/">Home</a>
              <a className="inline-flex min-h-9 items-center text-sm text-reenz-paper/75 no-underline transition hover:text-reenz-gold hover:underline hover:underline-offset-4 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-reenz-gold" href="/catalog">Catalog</a>
              <a className="inline-flex min-h-9 items-center text-sm text-reenz-paper/75 no-underline transition hover:text-reenz-gold hover:underline hover:underline-offset-4 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-reenz-gold" href="/contact">Contact</a>
            </div>
          </nav>
          <div className="justify-self-start text-left md:justify-self-end">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-reenz-sage/75">Follow us</h2>
            <nav className="flex items-center gap-2.5" aria-label="Social media">
              <a className="grid size-10 place-items-center rounded-full border border-reenz-paper/22 text-reenz-paper/80 no-underline transition hover:-translate-y-0.5 hover:border-reenz-gold hover:bg-reenz-gold hover:text-[#1a251d] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-reenz-gold" href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FaFacebookF aria-hidden="true" size={18} />
              </a>
              <a className="grid size-10 place-items-center rounded-full border border-reenz-paper/22 text-reenz-paper/80 no-underline transition hover:-translate-y-0.5 hover:border-reenz-gold hover:bg-reenz-gold hover:text-[#1a251d] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-reenz-gold" href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FaInstagram aria-hidden="true" size={18} />
              </a>
              <a className="grid size-10 place-items-center rounded-full border border-reenz-paper/22 text-reenz-paper/80 no-underline transition hover:-translate-y-0.5 hover:border-reenz-gold hover:bg-reenz-gold hover:text-[#1a251d] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-reenz-gold" href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <FaYoutube aria-hidden="true" size={18} />
              </a>
              <a className="grid size-10 place-items-center rounded-full border border-reenz-paper/22 text-reenz-paper/80 no-underline transition hover:-translate-y-0.5 hover:border-reenz-gold hover:bg-reenz-gold hover:text-[#1a251d] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-reenz-gold" href="https://www.tiktok.com/" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                <FaTiktok aria-hidden="true" size={18} />
              </a>
            </nav>
          </div>
        </div>
        <div className="border-t border-reenz-paper/15">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-reenz-paper/55 md:px-8">
            <p className="m-0">&copy; {new Date().getFullYear()} Reenz Organic. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <dialog className="fixed inset-0 m-auto max-h-[90vh] max-w-4xl w-[92vw] overflow-y-auto rounded-3xl border border-reenz-border bg-reenz-paper p-5 text-reenz-ink shadow-2xl" id="product-dialog" aria-labelledby="product-dialog-title">
        <div className="mb-4 flex items-start justify-between gap-4">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-reenz-leaf" id="product-dialog-category" />
          <button className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-full border border-reenz-border bg-reenz-paper text-xl text-reenz-green hover:bg-reenz-sage" type="button" aria-label="Close product details">
            &times;
          </button>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="overflow-hidden rounded-2xl bg-reenz-sage">
            <img id="product-dialog-image" alt="" hidden />
          </div>
          <div className="product-dialog-info">
            <h2 id="product-dialog-title" />
            <p className="leading-6 text-reenz-muted" id="product-dialog-description" />
            <div className="product-dialog-options" id="product-dialog-options" hidden>
              <span id="product-dialog-variant-label">Choose an option</span>
              <div className="product-option-select">
                <button
                  className="product-option-trigger"
                  id="product-dialog-variant-trigger"
                  type="button"
                  aria-labelledby="product-dialog-variant-label product-dialog-variant-value"
                  aria-haspopup="listbox"
                  aria-expanded="false"
                  aria-controls="product-dialog-variant-listbox"
                >
                  <span id="product-dialog-variant-value" />
                </button>
                <div
                  className="product-option-listbox"
                  id="product-dialog-variant-listbox"
                  role="listbox"
                  aria-labelledby="product-dialog-variant-label"
                  hidden
                />
                <select id="product-dialog-variant" tabIndex={-1} aria-hidden="true" hidden />
              </div>
            </div>
            <p className="flex items-center justify-between border-t border-reenz-border py-3 font-semibold text-reenz-green" id="product-dialog-price" />
            <button className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-reenz-green px-5 py-3 text-sm font-semibold text-white" id="product-dialog-add" type="button">
              Add to cart
            </button>
            <p className="product-dialog-unavailable" id="product-dialog-unavailable" hidden>
              Live price and availability are not listed yet. Please check back soon.
            </p>
            <p className="product-dialog-status" id="product-dialog-status" role="status" aria-live="polite" />
          </div>
        </div>
      </dialog>
      <dialog className="fixed inset-0 m-auto max-h-[90vh] max-w-xl w-[92vw] overflow-y-auto rounded-3xl border border-reenz-border bg-reenz-paper p-5 text-reenz-ink shadow-2xl" id="cart-dialog" aria-labelledby="cart-heading">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow">Your selection</p>
            <h2 id="cart-heading">Shopping cart</h2>
          </div>
          <button className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-full border border-reenz-border bg-reenz-paper text-xl text-reenz-green hover:bg-reenz-sage" type="button" aria-label="Close shopping cart">
            &times;
          </button>
        </div>
        <p className="text-sm text-reenz-muted" id="cart-status" role="status" aria-live="polite" />
        <p className="rounded-xl bg-reenz-cream p-4 text-sm text-reenz-muted" id="cart-empty">
          Your cart is empty. Add something lovely from the collection.
        </p>
        <ul className="cart-items" id="cart-items" />
        <div className="cart-summary" id="cart-summary" hidden>
          <span>Subtotal</span>
          <strong id="cart-subtotal">Rs.0.00 PKR</strong>
        </div>
        <button className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-reenz-green px-5 py-3 text-sm font-semibold text-white" id="cart-checkout" type="button" hidden>
          Continue to checkout <span className="button-arrow" aria-hidden="true">&rarr;</span>
        </button>
        <p className="cart-note">Cash on delivery. Your order details are sent directly to our team.</p>
      </dialog>
      <dialog className="fixed inset-0 m-auto max-h-[90vh] max-w-xl w-[92vw] overflow-y-auto rounded-3xl border border-reenz-border bg-reenz-paper p-5 text-reenz-ink shadow-2xl" id="checkout-dialog" aria-labelledby="checkout-heading">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow">Almost there</p>
            <h2 id="checkout-heading">Delivery details</h2>
          </div>
          <button className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-full border border-reenz-border bg-reenz-paper text-xl text-reenz-green hover:bg-reenz-sage" id="checkout-close" type="button" aria-label="Close checkout">
            &times;
          </button>
        </div>
        <p className="text-sm text-reenz-muted" id="checkout-status" role="status" aria-live="polite" />
        <form className="grid gap-4" id="checkout-form">
          <label className="grid gap-2 text-sm font-semibold text-reenz-green">
            Full name
            <input className="w-full rounded-xl border border-reenz-border bg-white px-4 py-3 text-sm text-reenz-ink outline-none focus:border-reenz-leaf focus:ring-2 focus:ring-reenz-leaf/20" name="name" autoComplete="name" required maxLength={100} />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-reenz-green">
            Phone number
            <input className="w-full rounded-xl border border-reenz-border bg-white px-4 py-3 text-sm text-reenz-ink outline-none focus:border-reenz-leaf focus:ring-2 focus:ring-reenz-leaf/20" name="phone" type="tel" autoComplete="tel" required maxLength={30} />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-reenz-green">
            Email <span>(optional)</span>
            <input className="w-full rounded-xl border border-reenz-border bg-white px-4 py-3 text-sm text-reenz-ink outline-none focus:border-reenz-leaf focus:ring-2 focus:ring-reenz-leaf/20" name="email" type="email" autoComplete="email" maxLength={254} />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-reenz-green">
            Delivery address
            <textarea className="w-full rounded-xl border border-reenz-border bg-white px-4 py-3 text-sm text-reenz-ink outline-none focus:border-reenz-leaf focus:ring-2 focus:ring-reenz-leaf/20" name="address" autoComplete="street-address" rows={3} required maxLength={500} />
          </label>
          <p className="flex items-center justify-between border-t border-reenz-border py-3 font-semibold text-reenz-green">
            <span>Order total</span>
            <strong id="checkout-total">Rs.0.00 PKR</strong>
          </p>
          <p className="text-xs text-reenz-muted">Pay in cash when your order arrives.</p>
          <button className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-reenz-green px-5 py-3 text-sm font-semibold text-white" id="checkout-submit" type="submit">
            Place order <span className="button-arrow" aria-hidden="true">&rarr;</span>
          </button>
        </form>
      </dialog>
    </>
  );
}

export async function StorefrontShell({ children, currentPage }: StorefrontShellProps) {
  return (
    <>
      <StoreHeader currentPage={currentPage} />
      {children}
      <StoreFooter />
      <Script src="/assets/app.js?v=19" strategy="afterInteractive" />
    </>
  );
}
