import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  CircleDollarSign,
  Clock,
  FlaskConical,
  Globe,
  Heart,
  RefreshCw,
  RotateCcw,
  Sun,
  Truck,
} from "lucide-react";
import { connection } from "next/server";
import { ProductGrid, StorefrontShell } from "@/components/storefront";
import { getHomepageProducts } from "@/lib/database";
import { resolveStoreImage } from "@/lib/store-images";

export const instant = false;

export default async function Home() {
  await connection();
  const products = await getHomepageProducts();

  return (
    <StorefrontShell currentPage="home">
      <main>
        <section
          className="home-hero relative overflow-hidden border-b border-reenz-sage/10 bg-[#1a251d] pt-12 pb-16 text-reenz-paper lg:pt-20 lg:pb-24"
          aria-labelledby="hero-heading"
        >
          <div className="home-hero__glow pointer-events-none absolute inset-0" aria-hidden="true" />
          <div className="relative mx-auto max-w-7xl px-6 sm:px-8">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14">
              <div className="z-10 space-y-7 text-center lg:col-span-7 lg:text-left">
                <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-reenz-leaf/30 bg-reenz-paper/8 px-3.5 py-1.5 text-xs font-medium uppercase tracking-widest text-reenz-sage backdrop-blur-md lg:mx-0">
                  <span className="size-1.5 animate-pulse rounded-full bg-reenz-gold" aria-hidden="true" />
                  Artisanal &amp; Sustainable Estate
                </p>
                <h1
                  id="hero-heading"
                  className="font-heading text-4xl font-medium leading-[1.08] tracking-tight text-reenz-paper sm:text-5xl lg:text-7xl"
                >
                  100% Organic,
                  <br />
                  Purely <em className="font-normal text-reenz-gold">Original.</em>
                </h1>
                <p className="mx-auto max-w-xl text-base font-light leading-relaxed text-reenz-sage/80 sm:text-lg lg:mx-0">
                  Experience the essence of nature with our curated collection of farm-fresh
                  harvests and traditional botanical elixirs.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 pt-2 lg:justify-start">
                  <Link
                    className="inline-flex items-center gap-2 rounded-full bg-reenz-paper px-7 py-3.5 text-sm font-semibold text-reenz-forest no-underline shadow-[0_20px_40px_-15px_rgba(21,32,24,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-reenz-cream hover:shadow-[0_0_25px_rgba(212,163,89,0.25)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-reenz-gold"
                    href="/catalog"
                  >
                    <span>Explore the collection</span>
                    <ArrowRight aria-hidden="true" className="text-reenz-green" size={16} />
                  </Link>
                  <Link
                    className="inline-flex items-center rounded-full border border-reenz-sage/25 px-6 py-3.5 text-sm font-medium text-reenz-sage no-underline transition-all duration-200 hover:border-reenz-sage/60 hover:bg-white/5 hover:text-reenz-paper focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-reenz-gold"
                    href="/catalog"
                  >
                    Find your favorites
                  </Link>
                </div>
                <div className="mx-auto grid w-full max-w-lg grid-cols-1 gap-4 border-t border-reenz-sage/10 pt-8 text-center sm:grid-cols-3 lg:mx-0 lg:max-w-none lg:text-left">
                  <div className="min-w-0">
                    <p className="m-0 font-heading text-xl font-semibold text-reenz-gold sm:text-2xl xl:text-3xl">
                      Farm-fresh
                    </p>
                    <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-widest text-reenz-sage/60">
                      Harvests
                    </p>
                  </div>
                  <div className="min-w-0 border-t border-reenz-sage/10 pt-4 sm:border-l sm:border-t-0 sm:pt-0 sm:pl-3 lg:pl-5">
                    <p className="m-0 font-heading text-xl font-semibold text-reenz-gold sm:text-2xl xl:text-3xl">
                      Thoughtful
                    </p>
                    <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-widest text-reenz-sage/60">
                      Favorites
                    </p>
                  </div>
                  <div className="min-w-0 border-t border-reenz-sage/10 pt-4 sm:border-l sm:border-t-0 sm:pt-0 sm:pl-3 lg:pl-5">
                    <p className="m-0 font-heading text-xl font-semibold text-reenz-gold sm:text-2xl xl:text-3xl">
                      Botanical
                    </p>
                    <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-widest text-reenz-sage/60">
                      Elixirs
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative lg:col-span-5">
                <div className="relative mx-auto max-w-md overflow-hidden rounded-[2rem] border border-reenz-sage/15 bg-gradient-to-b from-[#243528] to-[#162118] p-3 shadow-2xl lg:max-w-none">
                  <div className="relative h-[430px] overflow-hidden rounded-[1.4rem] bg-reenz-green/40">
                    <Image
                      src={resolveStoreImage("/assets/images/home-screen-right-side-photo.jpg")}
                      alt="Reenz Organic pantry favorites arranged together"
                      fill
                      sizes="(max-width: 1023px) 90vw, 40vw"
                      className="home-hero__photo object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-reenz-forest/90 via-reenz-forest/20 to-transparent" />
                  </div>
                  <div className="absolute left-6 top-6 z-20 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-[#1a251d]/80 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-reenz-sage shadow-sm backdrop-blur-md">
                    <Check aria-hidden="true" className="text-reenz-gold" size={14} />
                    <span>Picked for quality</span>
                  </div>
                  <div className="absolute right-6 top-6 z-20 flex size-8 items-center justify-center rounded-full border border-white/10 bg-[#1a251d]/80 text-reenz-gold backdrop-blur-md">
                    <Sun aria-hidden="true" size={16} />
                  </div>
                  <Link
                    className="group absolute bottom-6 left-6 right-6 z-20 flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-reenz-forest/85 p-4 text-reenz-paper no-underline backdrop-blur-md transition hover:border-reenz-gold/40"
                    href="/catalog"
                  >
                    <span>
                      <span className="mb-0.5 block text-[10px] font-semibold uppercase tracking-widest text-reenz-gold">
                        A little more thoughtful
                      </span>
                      <span className="font-heading text-sm font-medium sm:text-base">
                        Good food should feel good.
                      </span>
                    </span>
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-reenz-gold/40 bg-reenz-gold/20 text-reenz-gold transition group-hover:bg-reenz-gold group-hover:text-reenz-forest">
                      <ArrowRight aria-hidden="true" size={16} />
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-16 grid grid-cols-2 gap-4 border-t border-reenz-sage/10 pt-8 md:grid-cols-4 lg:gap-6">
              <div className="flex items-center gap-3 text-xs font-medium tracking-wide text-reenz-sage/90 sm:text-sm">
                <CheckCircle2 aria-hidden="true" className="shrink-0 text-reenz-gold" size={20} strokeWidth={1.75} />
                <span>Picked for quality</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-medium tracking-wide text-reenz-sage/90 sm:text-sm">
                <Heart aria-hidden="true" className="shrink-0 text-reenz-gold" size={20} strokeWidth={1.75} />
                <span>Naturally delicious</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-medium tracking-wide text-reenz-sage/90 sm:text-sm">
                <Clock aria-hidden="true" className="shrink-0 text-reenz-gold" size={20} strokeWidth={1.75} />
                <span>Goodness for every day</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-medium tracking-wide text-reenz-sage/90 sm:text-sm">
                <FlaskConical aria-hidden="true" className="shrink-0 text-reenz-gold" size={20} strokeWidth={1.75} />
                <span>Traditional botanical elixirs</span>
              </div>
            </div>
          </div>
        </section>

        <section
          className="scroll-mt-20 bg-reenz-cream py-20 lg:py-28"
          id="pantry-favorites"
          aria-labelledby="products-heading"
        >
          <div className="mx-auto max-w-7xl px-6 sm:px-8">
            <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-reenz-leaf">
                  <span className="size-1.5 rounded-full bg-reenz-leaf" aria-hidden="true" />
                  Straight from our store
                </p>
                <h2
                  id="products-heading"
                  className="font-heading text-3xl font-semibold tracking-tight text-reenz-forest sm:text-4xl lg:text-5xl"
                >
                  Shop Reenz Organic favorites
                </h2>
                <p className="mt-2 max-w-lg text-sm font-normal text-reenz-forest/70 sm:text-base">
                  Explore thoughtful favorites from across our pantry.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-6 text-xs font-semibold tracking-wide sm:text-sm">
                <Link
                  className="flex items-center gap-1.5 border-b border-reenz-leaf/40 pb-0.5 text-reenz-leaf no-underline transition-colors hover:text-[#233F2E]"
                  href="/catalog"
                >
                  <span>View the collection</span>
                  <ArrowRight aria-hidden="true" size={14} />
                </Link>
              </div>
            </div>

            {products.length === 0 ? (
              <p
                className="rounded-2xl border border-reenz-border bg-reenz-paper p-5 text-sm text-reenz-muted"
                role="status"
              >
                There are no available products right now. Please check back soon.
              </p>
            ) : (
              <ProductGrid products={products} />
            )}
          </div>
        </section>

        <section
          className="relative scroll-mt-20 overflow-hidden border-y border-reenz-sage/20 bg-[#f0f4ea] py-20 lg:py-28"
          aria-labelledby="story-heading"
          id="features"
        >
          <div className="mx-auto max-w-7xl px-6 sm:px-8">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="relative lg:col-span-5">
                <div className="relative h-[520px] overflow-hidden rounded-3xl border-2 border-white/60 bg-[#1a251d]/20 shadow-2xl">
                  <Image
                    src={resolveStoreImage("/assets/images/hero-fruit-platter.webp")}
                    alt="A colorful selection of dried fruit ready to enjoy"
                    fill
                    sizes="(max-width: 1023px) 90vw, 42vw"
                    className="home-story__photo object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-reenz-forest/90 via-reenz-forest/30 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/10 bg-reenz-forest/90 p-6 text-reenz-paper shadow-[0_20px_40px_-15px_rgba(21,32,24,0.12)] backdrop-blur-md">
                    <h3 className="mb-1.5 font-heading text-xl font-semibold leading-snug sm:text-2xl">
                      Thoughtful favorites, inspired by nature.
                    </h3>
                    <p className="m-0 text-xs font-light text-reenz-sage/80 sm:text-sm">
                      Experience the essence of nature in every pantry favorite.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-7 lg:col-span-7">
                <div>
                  <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-reenz-leaf/15 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-reenz-leaf">
                    <RefreshCw aria-hidden="true" size={14} />
                    <span>A little more thoughtful</span>
                  </p>
                  <h2
                    id="story-heading"
                    className="font-heading text-4xl font-bold leading-tight tracking-tight text-reenz-forest sm:text-5xl lg:text-6xl"
                  >
                    Good food should feel good.
                  </h2>
                </div>
                <p className="max-w-xl text-base font-light leading-relaxed text-reenz-forest/75 sm:text-lg">
                  We believe the best pantry staples start with nature and end with a moment worth
                  savoring. Explore honest flavors, thoughtful picks, and simple ways to make the
                  everyday feel a little more special.
                </p>
                <div className="flex items-start gap-4 rounded-2xl border border-reenz-border bg-reenz-paper p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-transform duration-200 hover:translate-x-1">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-reenz-leaf/20 bg-reenz-cream text-reenz-leaf">
                    <Globe aria-hidden="true" size={22} strokeWidth={1.75} />
                  </span>
                  <span>
                    <strong className="block font-heading text-lg font-bold text-reenz-forest">
                      From nature
                    </strong>
                    <span className="mt-0.5 block text-xs font-normal text-reenz-forest/70 sm:text-sm">
                      Ingredients inspired by the richness of the earth.
                    </span>
                  </span>
                </div>
                <div className="flex items-start gap-4 rounded-2xl border border-reenz-border bg-reenz-paper p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-transform duration-200 hover:translate-x-1">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-reenz-gold/25 bg-reenz-cream text-reenz-gold">
                    <Heart aria-hidden="true" size={22} strokeWidth={1.75} />
                  </span>
                  <span>
                    <strong className="block font-heading text-lg font-bold text-reenz-forest">
                      For every day
                    </strong>
                    <span className="mt-0.5 block text-xs font-normal text-reenz-forest/70 sm:text-sm">
                      Easy favorites for little rituals and big cravings.
                    </span>
                  </span>
                </div>
                <div className="pt-2">
                  <Link
                    className="inline-flex items-center gap-2.5 rounded-full bg-reenz-green px-8 py-3.5 text-sm font-medium text-reenz-paper no-underline shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-reenz-forest hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-reenz-gold"
                    href="/catalog"
                  >
                    <span>Shop pantry favorites</span>
                    <ArrowRight aria-hidden="true" className="text-reenz-gold" size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-reenz-cream py-16" aria-label="Delivery, returns, and refunds">
          <div className="mx-auto max-w-7xl px-6 sm:px-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <article className="flex flex-col items-center justify-center rounded-2xl border border-reenz-border bg-reenz-paper p-7 text-center shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-1 hover:border-reenz-leaf/30">
                <span className="mb-3.5 flex size-12 items-center justify-center rounded-full bg-reenz-cream text-reenz-green">
                  <Truck aria-hidden="true" size={24} strokeWidth={1.75} />
                </span>
                <h2 className="m-0 font-heading text-xl font-bold text-reenz-forest">Free Delivery</h2>
                <p className="mt-1 text-xs font-normal text-reenz-forest/65">
                  Free and fast delivery in 24/7 hours
                </p>
              </article>
              <article className="flex flex-col items-center justify-center rounded-2xl border border-reenz-border bg-reenz-paper p-7 text-center shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-1 hover:border-reenz-leaf/30">
                <span className="mb-3.5 flex size-12 items-center justify-center rounded-full bg-reenz-cream text-reenz-green">
                  <RotateCcw aria-hidden="true" size={24} strokeWidth={1.75} />
                </span>
                <h2 className="m-0 font-heading text-xl font-bold text-reenz-forest">Returns</h2>
                <p className="mt-1 text-xs font-normal text-reenz-forest/65">
                  Our returns policy last 7 days
                </p>
              </article>
              <article className="flex flex-col items-center justify-center rounded-2xl border border-reenz-border bg-reenz-paper p-7 text-center shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-1 hover:border-reenz-leaf/30">
                <span className="mb-3.5 flex size-12 items-center justify-center rounded-full bg-reenz-cream text-reenz-green">
                  <CircleDollarSign aria-hidden="true" size={24} strokeWidth={1.75} />
                </span>
                <h2 className="m-0 font-heading text-xl font-bold text-reenz-forest">Refunds</h2>
                <p className="mt-1 text-xs font-normal text-reenz-forest/65">
                  Our refund policy last 7 days
                </p>
              </article>
            </div>
          </div>
        </section>
      </main>
    </StorefrontShell>
  );
}
