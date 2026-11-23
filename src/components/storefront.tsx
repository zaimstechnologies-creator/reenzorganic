import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa6";
import { StoreNavigation } from "@/components/store-navigation";
import { CartButton } from "@/components/cart-count";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { productCategoryLabel, type Product } from "@/lib/products";
import { resolveStoreImage } from "@/lib/store-images";

type StorefrontShellProps = {
  children: React.ReactNode;
  currentPage: "home" | "catalog" | "contact" | "cart" | "checkout";
};

function ProductCard({
  product,
  eagerImage = false,
}: {
  product: Product;
  eagerImage?: boolean;
}) {
  const cardTitle = product.name.replace(/^(?:REENZ\s+|Imperial\s+)/i, "");
  const categoryLabel = productCategoryLabel(product.category);
  const image = product.image;

  return (
    <article
      className="overflow-hidden rounded-2xl border border-reenz-border bg-reenz-paper shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-reenz-green"
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
        <AddToCartButton
          className="mt-2 inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-reenz-green px-5 py-3 text-sm font-semibold text-white no-underline shadow-sm transition hover:bg-reenz-forest focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-reenz-gold"
          productId={product.id}
          variantId={product.variants[0].id}
          productName={product.name}
        >
          <ShoppingCart aria-hidden="true" size={16} />
          Add to cart
        </AddToCartButton>
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
        <Link className="inline-flex shrink-0 items-center" href="/" aria-label="Reenz Organic home">
          <Image src={resolveStoreImage("/assets/images/logo.png")} alt="Reenz Organic" className="h-auto w-32 object-contain md:w-32" width={320} height={112} priority />
        </Link>
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
            <Link className="inline-flex w-fit shrink-0 items-center" href="/" aria-label="Reenz Organic home">
              <Image src={resolveStoreImage("/assets/images/logo.png")} alt="Reenz Organic" className="h-auto w-28 object-contain" width={320} height={112} />
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-6 text-reenz-paper/65">Thoughtful favorites, inspired by nature.</p>
          </div>
          <nav className="justify-self-start" aria-label="Explore our store">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-reenz-sage/75">Explore</h2>
            <div className="flex flex-col items-start gap-1">
              <Link className="inline-flex min-h-9 items-center text-sm text-reenz-paper/75 no-underline transition hover:text-reenz-gold hover:underline hover:underline-offset-4 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-reenz-gold" href="/">Home</Link>
              <Link className="inline-flex min-h-9 items-center text-sm text-reenz-paper/75 no-underline transition hover:text-reenz-gold hover:underline hover:underline-offset-4 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-reenz-gold" href="/catalog">Catalog</Link>
              <Link className="inline-flex min-h-9 items-center text-sm text-reenz-paper/75 no-underline transition hover:text-reenz-gold hover:underline hover:underline-offset-4 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-reenz-gold" href="/contact">Contact</Link>
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

    </>
  );
}

export async function StorefrontShell({ children, currentPage }: StorefrontShellProps) {
  return (
    <>
      <StoreHeader currentPage={currentPage} />
      {children}
      <StoreFooter />
    </>
  );
}
