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
      className="product-card"
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
      <div className="product-art">
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
        <span className="product-art-label">{categoryLabel}</span>
      </div>
      <div className="product-details">
        <p className="product-category">{categoryLabel}</p>
        <h3 title={product.name}>{cardTitle}</h3>
        {product.description && <p className="product-description">{product.description}</p>}
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
          className="product-card-action"
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
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function StoreHeader({ currentPage }: { currentPage: StorefrontShellProps["currentPage"] }) {
  return (
    <header className={`site-header${currentPage === "home" ? " site-header--home" : ""}`}>
      <div className="container header-inner">
        <a className="logo-container" href="/" aria-label="Reenz Organic home">
          <Image src={resolveStoreImage("/assets/images/logo.png")} alt="Reenz Organic" className="logo" width={320} height={112} priority />
        </a>
        <StoreNavigation currentPage={currentPage} />
        <div className="cart-container">
          <CartButton />
        </div>
      </div>
    </header>
  );
}

function StoreFooter() {
  return (
    <>
      <footer className="site-footer">
        <div className="footer-content container">
          <div className="footer-branding">
            <a className="footer-brand" href="/" aria-label="Reenz Organic home">
              <Image src={resolveStoreImage("/assets/images/logo.png")} alt="Reenz Organic" className="footer-logo" width={320} height={112} />
            </a>
            <p>Thoughtful favorites, inspired by nature.</p>
          </div>
          <nav className="footer-navigation" aria-label="Explore our store">
            <h2>Explore</h2>
            <div className="footer-navigation-links">
              <a href="/">Home</a>
              <a href="/catalog">Catalog</a>
              <a href="/contact">Contact</a>
            </div>
          </nav>
          <div className="footer-social">
            <h2>Follow us</h2>
            <nav className="social-links" aria-label="Social media">
              <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FaFacebookF aria-hidden="true" size={18} />
              </a>
              <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FaInstagram aria-hidden="true" size={18} />
              </a>
              <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <FaYoutube aria-hidden="true" size={18} />
              </a>
              <a href="https://www.tiktok.com/" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                <FaTiktok aria-hidden="true" size={18} />
              </a>
            </nav>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-bottom-inner container">
            <p>&copy; {new Date().getFullYear()} Reenz Organic. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <dialog className="product-dialog" id="product-dialog" aria-labelledby="product-dialog-title">
        <div className="product-dialog-header">
          <p className="eyebrow" id="product-dialog-category" />
          <button className="product-dialog-close" type="button" aria-label="Close product details">
            &times;
          </button>
        </div>
        <div className="product-dialog-layout">
          <div className="product-dialog-image-wrap">
            <img id="product-dialog-image" alt="" hidden />
          </div>
          <div className="product-dialog-info">
            <h2 id="product-dialog-title" />
            <p className="product-dialog-description" id="product-dialog-description" />
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
            <p className="product-dialog-price" id="product-dialog-price" />
            <button className="button product-dialog-add" id="product-dialog-add" type="button">
              Add to cart
            </button>
            <p className="product-dialog-unavailable" id="product-dialog-unavailable" hidden>
              Live price and availability are not listed yet. Please check back soon.
            </p>
            <p className="product-dialog-status" id="product-dialog-status" role="status" aria-live="polite" />
          </div>
        </div>
      </dialog>
      <dialog className="cart-dialog" id="cart-dialog" aria-labelledby="cart-heading">
        <div className="cart-dialog-header">
          <div>
            <p className="eyebrow">Your selection</p>
            <h2 id="cart-heading">Shopping cart</h2>
          </div>
          <button className="cart-close" type="button" aria-label="Close shopping cart">
            &times;
          </button>
        </div>
        <p className="cart-status" id="cart-status" role="status" aria-live="polite" />
        <p className="cart-empty" id="cart-empty">
          Your cart is empty. Add something lovely from the collection.
        </p>
        <ul className="cart-items" id="cart-items" />
        <div className="cart-summary" id="cart-summary" hidden>
          <span>Subtotal</span>
          <strong id="cart-subtotal">Rs.0.00 PKR</strong>
        </div>
        <button className="button cart-checkout" id="cart-checkout" type="button" hidden>
          Continue to checkout <span className="button-arrow" aria-hidden="true">&rarr;</span>
        </button>
        <p className="cart-note">Cash on delivery. Your order details are sent directly to our team.</p>
      </dialog>
      <dialog className="checkout-dialog" id="checkout-dialog" aria-labelledby="checkout-heading">
        <div className="cart-dialog-header">
          <div>
            <p className="eyebrow">Almost there</p>
            <h2 id="checkout-heading">Delivery details</h2>
          </div>
          <button className="cart-close" id="checkout-close" type="button" aria-label="Close checkout">
            &times;
          </button>
        </div>
        <p className="checkout-status" id="checkout-status" role="status" aria-live="polite" />
        <form className="checkout-form" id="checkout-form">
          <label>
            Full name
            <input name="name" autoComplete="name" required maxLength={100} />
          </label>
          <label>
            Phone number
            <input name="phone" type="tel" autoComplete="tel" required maxLength={30} />
          </label>
          <label>
            Email <span>(optional)</span>
            <input name="email" type="email" autoComplete="email" maxLength={254} />
          </label>
          <label>
            Delivery address
            <textarea name="address" autoComplete="street-address" rows={3} required maxLength={500} />
          </label>
          <p className="checkout-total">
            <span>Order total</span>
            <strong id="checkout-total">Rs.0.00 PKR</strong>
          </p>
          <p className="checkout-payment-note">Pay in cash when your order arrives.</p>
          <button className="button checkout-submit" id="checkout-submit" type="submit">
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
