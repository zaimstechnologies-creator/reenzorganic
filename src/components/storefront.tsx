import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
      className="group flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-reenz-border bg-reenz-paper transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(21,32,24,0.12)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-reenz-green"
    >
      <div>
        <div className="relative h-60 overflow-hidden bg-[#EAE8DD]">
          {image && (
            <Image
              src={image}
              alt={product.alt}
              fill
              sizes="(max-width: 700px) 100vw, (max-width: 1180px) 50vw, 25vw"
              loading={eagerImage ? "eager" : "lazy"}
              className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />
          )}
          <span className="absolute left-3.5 top-3.5 z-10 rounded-md bg-reenz-forest px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-reenz-paper shadow-sm">
            {categoryLabel}
          </span>
        </div>
        <div className="p-5">
          <p className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-reenz-leaf">
            {categoryLabel}
          </p>
          <h3 className="mb-2 font-heading text-xl font-bold text-reenz-forest transition-colors group-hover:text-reenz-green" title={product.name}>
            {cardTitle}
          </h3>
          {product.description && (
            <p className="line-clamp-3 text-xs font-normal leading-relaxed text-reenz-forest/70">
              {product.description}
            </p>
          )}
        </div>
      </div>
      <div className="px-5 pb-5 pt-2">
        <AddToCartButton
          className="group/button flex min-h-11 w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-reenz-border bg-reenz-cream/40 px-4 py-2.5 text-xs font-semibold text-reenz-forest no-underline transition-all duration-200 hover:border-reenz-green/30 hover:bg-reenz-green hover:text-reenz-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-reenz-gold"
          productId={product.id}
          variantId={product.variants[0].id}
          productName={product.name}
        >
          <span>Add to cart</span>
          <span className="flex size-6 items-center justify-center rounded-full bg-reenz-paper text-reenz-forest transition-colors group-hover/button:bg-white/20 group-hover/button:text-white">
            <ArrowRight aria-hidden="true" size={13} strokeWidth={2.5} />
          </span>
        </AddToCartButton>
      </div>
    </article>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} eagerImage={index === 0} />
      ))}
    </div>
  );
}

function StoreHeader({ currentPage }: { currentPage: StorefrontShellProps["currentPage"] }) {
  return (
    <header className="sticky top-0 z-50 border-b border-reenz-sage/10 bg-[#1a251d]/95 text-reenz-sage backdrop-blur-md transition-all">
      <div className="relative mx-auto grid h-20 w-full max-w-7xl grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4 px-6 sm:px-8">
        <Link className="inline-flex w-fit shrink-0 items-center rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-reenz-gold" href="/" aria-label="Reenz Organic home">
          <Image
            src={resolveStoreImage("/assets/images/logo.png")}
            alt="Reenz Organic"
            className="h-auto w-24 object-contain"
            width={320}
            height={112}
            priority
          />
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
    <footer className="mt-auto border-t border-reenz-sage/10 bg-[#1a251d] pt-16 pb-12 text-reenz-paper">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="grid grid-cols-1 gap-10 border-b border-reenz-sage/10 pb-14 md:grid-cols-12">
          <div className="space-y-4 md:col-span-6">
            <Link className="inline-flex w-fit shrink-0 items-center rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-reenz-gold" href="/" aria-label="Reenz Organic home">
              <Image src={resolveStoreImage("/assets/images/logo.png")} alt="Reenz Organic" className="h-auto w-28 object-contain" width={320} height={112} />
            </Link>
            <p className="max-w-sm text-xs font-light leading-6 text-reenz-sage/70 sm:text-sm">
              Thoughtful favorites, inspired by nature.
            </p>
          </div>
          <nav className="justify-self-start space-y-3 md:col-span-3" aria-label="Explore our store">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-reenz-gold">
              Explore
            </h2>
            <div className="flex flex-col items-start gap-1">
              <Link className="inline-flex min-h-8 items-center text-xs text-reenz-sage/80 no-underline transition-colors hover:text-reenz-paper focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-reenz-gold" href="/">Home</Link>
              <Link className="inline-flex min-h-8 items-center text-xs text-reenz-sage/80 no-underline transition-colors hover:text-reenz-paper focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-reenz-gold" href="/catalog">Catalog</Link>
              <Link className="inline-flex min-h-8 items-center text-xs text-reenz-sage/80 no-underline transition-colors hover:text-reenz-paper focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-reenz-gold" href="/contact">Contact</Link>
            </div>
          </nav>
          <div className="justify-self-start space-y-3 text-left md:col-span-3">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-reenz-gold">
              Follow us
            </h2>
            <nav className="flex items-center gap-2.5" aria-label="Social media">
              <a className="flex size-9 items-center justify-center rounded-full border border-reenz-sage/10 bg-[#243527] text-reenz-sage/80 no-underline transition-colors hover:-translate-y-0.5 hover:border-reenz-gold hover:bg-reenz-green hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-reenz-gold" href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FaFacebookF aria-hidden="true" size={15} />
              </a>
              <a className="flex size-9 items-center justify-center rounded-full border border-reenz-sage/10 bg-[#243527] text-reenz-sage/80 no-underline transition-colors hover:-translate-y-0.5 hover:border-reenz-gold hover:bg-reenz-green hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-reenz-gold" href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FaInstagram aria-hidden="true" size={15} />
              </a>
              <a className="flex size-9 items-center justify-center rounded-full border border-reenz-sage/10 bg-[#243527] text-reenz-sage/80 no-underline transition-colors hover:-translate-y-0.5 hover:border-reenz-gold hover:bg-reenz-green hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-reenz-gold" href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <FaYoutube aria-hidden="true" size={15} />
              </a>
              <a className="flex size-9 items-center justify-center rounded-full border border-reenz-sage/10 bg-[#243527] text-reenz-sage/80 no-underline transition-colors hover:-translate-y-0.5 hover:border-reenz-gold hover:bg-reenz-green hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-reenz-gold" href="https://www.tiktok.com/" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                <FaTiktok aria-hidden="true" size={15} />
              </a>
            </nav>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between pt-8 text-center text-xs text-reenz-sage/60 sm:flex-row sm:text-left">
          <p className="m-0">&copy; {new Date().getFullYear()} Reenz Organic. All rights reserved.</p>
          <p className="mt-2 m-0 font-heading text-sm italic text-reenz-sage/40 sm:mt-0">
            Thoughtful favorites, inspired by nature.
          </p>
        </div>
      </div>
    </footer>
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
