import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import {
  ArrowRight,
  CircleDollarSign,
  Heart,
  Leaf,
  RotateCcw,
  Sparkles,
  Truck,
} from "lucide-react";
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
        <section className="relative isolate flex min-h-[calc(100svh-4rem)] w-full overflow-hidden md:min-h-[calc(100vh-4rem)]" aria-labelledby="hero-heading">
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
            <div className="absolute inset-0 opacity-0 animate-[hero-background-cycle_18s_ease-in-out_infinite]">
              <Image
                src={resolveStoreImage("/assets/images/hero-fruit-platter.webp")}
                alt=""
                fill
                sizes="100vw"
                className="scale-105 object-cover"
              />
            </div>
            <div className="absolute inset-0 opacity-0 animate-[hero-background-cycle_18s_ease-in-out_infinite_-6s]">
              <Image
                src={resolveStoreImage("/assets/images/hero-dried-fruits.webp")}
                alt=""
                fill
                sizes="100vw"
              />
            </div>
            <div className="absolute inset-0 opacity-0 animate-[hero-background-cycle_18s_ease-in-out_infinite_-12s]">
              <Image
                src={resolveStoreImage("/assets/images/hero-fruits-nuts.webp")}
                alt=""
                fill
                sizes="100vw"
              />
            </div>
            <div className="absolute inset-0 bg-[#1a251d]/68" />
          </div>
          <div className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 content-center items-center gap-8 px-4 py-12 md:px-8 md:py-20 lg:grid-cols-2 lg:gap-12">
            <div className="relative z-10">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-reenz-sage">Artisanal &amp; Sustainable Estate</p>
              <h1 id="hero-heading" className="mb-5 font-heading text-5xl leading-[1.05] tracking-tight text-reenz-sage [&_em]:font-normal [&_em]:text-reenz-sage md:text-6xl">
                100% Organic, Purely <em>Original.</em>
              </h1>
              <p className="max-w-xl text-base leading-7 text-reenz-sage/80">
                Experience the essence of nature with our curated collection of farm-fresh harvests and traditional botanical elixirs.
              </p>
              <div className="mt-7 flex flex-wrap gap-3 md:flex-nowrap">
                <Link className="inline-flex min-h-11 min-w-0 items-center justify-center gap-2 rounded-full bg-reenz-sage px-4 py-3 text-xs font-semibold text-reenz-forest no-underline shadow-sm transition hover:bg-reenz-leaf hover:text-reenz-sage md:px-5 md:text-sm" href="#featured">
                  Explore the collection{" "}
                  <ArrowRight className="text-lg leading-none" aria-hidden="true" size={18} />
                </Link>
                <Link className="inline-flex min-h-11 min-w-0 items-center justify-center gap-2 rounded-full border border-reenz-sage px-4 py-3 text-xs font-semibold text-reenz-sage no-underline shadow-none transition hover:bg-reenz-sage hover:text-reenz-forest md:px-5 md:text-sm" href="/catalog">
                  Find your favorites
                </Link>
              </div>
            </div>
            <div className="relative z-10 mx-auto w-full max-w-lg" aria-hidden="true">
              <div className="relative aspect-square w-full">
                <span className="absolute inset-x-0 top-0 block h-[78%] w-[78%] overflow-hidden rounded-[2rem] border-[3px] border-[#1a251d] shadow-xl">
                  <Image
                    src={resolveStoreImage("/assets/images/hero-fruit-platter.webp")}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 75vw, 36vw"
                    preload
                  />
                </span>
                <span className="absolute bottom-0 right-0 block h-[48%] w-[54%] overflow-hidden rounded-[2rem] border-[3px] border-[#1a251d] shadow-xl">
                  <Image
                    src={resolveStoreImage("/assets/images/hero-dried-fruits.webp")}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 48vw, 24vw"
                    className="size-full object-cover"
                  />
                </span>
                <span className="absolute right-0 top-4 block h-[32%] w-[34%] overflow-hidden rounded-[2rem] border-[3px] border-[#1a251d] shadow-xl">
                  <Image
                    src={resolveStoreImage("/assets/images/hero-fruits-nuts.webp")}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 32vw, 16vw"
                    className="size-full object-cover"
                  />
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-3 border-y border-reenz-sage/15 bg-[#1a251d] px-4 py-3 text-sm font-medium text-reenz-sage" aria-label="Our promise">
          <div className="flex min-h-14 items-center justify-center gap-2 px-3 border-r border-reenz-sage/20">
            <Leaf className="text-lg text-reenz-gold" aria-hidden="true" size={20} />
            Picked for quality
          </div>
          <div className="flex min-h-14 items-center justify-center gap-2 px-3 border-r border-reenz-sage/20">
            <Heart className="text-lg text-reenz-gold" aria-hidden="true" size={20} />
            Naturally delicious
          </div>
          <div className="flex min-h-14 items-center justify-center gap-2 px-3">
            <Sparkles className="text-lg text-reenz-gold" aria-hidden="true" size={20} />
            Goodness for every day
          </div>
        </section>

        <section className="bg-reenz-cream py-14 md:py-20" id="featured" aria-labelledby="products-heading">
          <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
            <div className="mb-7" data-reveal>
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-reenz-leaf">Straight from our store</p>
                <h2 id="products-heading" className="mb-2 font-heading text-3xl leading-tight text-reenz-forest">Shop Reenz Organic favorites</h2>
                <p className="max-w-2xl text-sm leading-6 text-reenz-muted">Explore thoughtful favorites from across our pantry.</p>
              </div>
            </div>
            <Link className="group mb-8 flex flex-col gap-4 rounded-2xl bg-reenz-forest p-5 text-reenz-paper no-underline transition hover:bg-reenz-green focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-reenz-gold md:flex-row md:items-center md:justify-between md:px-7 md:py-6" href="/catalog?category=desi-items">
              <span className="block">
                <span className="mb-1 block text-xs font-bold uppercase tracking-[0.16em] text-reenz-gold">Desi Items</span>
                <strong className="block font-heading text-2xl font-medium">Desi Ghee &amp; Organic Honey</strong>
                <span className="mt-1 block text-sm text-reenz-paper/75">Explore our traditional ghee and honey favorites.</span>
              </span>
              <span className="inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-reenz-paper/25 bg-reenz-paper/10 px-5 py-3 text-sm font-semibold text-reenz-paper transition-colors group-hover:border-reenz-gold/70 group-hover:bg-reenz-paper/15 md:w-auto md:min-w-44">
                Shop desi items <ArrowRight aria-hidden="true" size={16} />
              </span>
            </Link>
            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5" aria-label="Explore our pantry">
              <Link className="relative block aspect-[4/3] overflow-hidden rounded-2xl bg-reenz-sage no-underline [&::after]:absolute [&::after]:inset-0 [&::after]:content-[''] [&::after]:bg-gradient-to-t [&::after]:from-reenz-forest/80 [&::after]:via-transparent [&::after]:to-transparent" href="/catalog?category=dry-fruits">
                <Image
                  src={resolveStoreImage("/assets/images/hero-fruit-platter.webp")}
                  alt="A colorful assortment of dried fruit"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="size-full object-cover transition duration-300"
                />
                <span className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between p-4 font-semibold text-reenz-paper">
                  <span>Dried fruit</span>
                  <ArrowRight aria-hidden="true" size={16} />
                </span>
              </Link>
              <Link className="relative block aspect-[4/3] overflow-hidden rounded-2xl bg-reenz-sage no-underline [&::after]:absolute [&::after]:inset-0 [&::after]:content-[''] [&::after]:bg-gradient-to-t [&::after]:from-reenz-forest/80 [&::after]:via-transparent [&::after]:to-transparent" href="/catalog?category=desi-items">
                <Image
                  src={resolveStoreImage("/assets/images/home-screen-right-side-photo.jpg")}
                  alt="Desi ghee, honey, and dried fruit"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="size-full object-cover transition duration-300"
                />
                <span className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between p-4 font-semibold text-reenz-paper">
                  <span>Pantry favorites</span>
                  <ArrowRight aria-hidden="true" size={16} />
                </span>
              </Link>
              <Link className="relative block aspect-[4/3] overflow-hidden rounded-2xl bg-reenz-sage no-underline [&::after]:absolute [&::after]:inset-0 [&::after]:content-[''] [&::after]:bg-gradient-to-t [&::after]:from-reenz-forest/80 [&::after]:via-transparent [&::after]:to-transparent" href="/catalog?category=nuts">
                <Image
                  src={resolveStoreImage("/assets/images/Almond.jpg")}
                  alt="A close-up of whole almonds"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="size-full object-cover transition duration-300"
                />
                <span className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between p-4 font-semibold text-reenz-paper">
                  <span>Nuts &amp; more</span>
                  <ArrowRight aria-hidden="true" size={16} />
                </span>
              </Link>
            </div>
            {products.length === 0 && (
              <p className="rounded-2xl border border-reenz-border bg-reenz-paper p-5 text-sm text-reenz-muted" role="status">
                There are no available products right now. Please check back soon.
              </p>
            )}
            <ProductGrid products={products} />
            <div className="mt-8 flex justify-center" data-reveal>
              <Link className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full bg-reenz-green px-5 py-3 text-sm font-semibold text-white no-underline shadow-sm transition hover:bg-reenz-forest focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-reenz-gold" href="/catalog">
                View the collection{" "}
                <ArrowRight className="text-lg leading-none" aria-hidden="true" size={18} />
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-reenz-paper py-14 md:py-20" aria-labelledby="story-heading">
          <div className="mx-auto grid w-full max-w-7xl items-center gap-8 px-4 md:grid-cols-2 md:gap-12 md:px-8">
            <div className="aspect-[4/3] overflow-hidden rounded-[2rem] bg-reenz-sage shadow-lg" data-reveal>
              <Image
                src={resolveStoreImage("/assets/images/home-screen-right-side-photo.jpg")}
                alt="Reenz Organic desi ghee and honey alongside a colorful selection of dried fruit"
                width={960}
                height={960}
                sizes="(max-width: 760px) 100vw, 45vw"
                className="size-full object-cover"
              />
            </div>
            <div data-reveal>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-reenz-leaf">A little more thoughtful</p>
              <h2 id="story-heading" className="mb-4 font-heading text-4xl leading-tight text-reenz-forest">Good food should feel good.</h2>
              <p className="leading-7 text-reenz-muted">
                We believe the best pantry staples start with nature and end with a moment worth
                savoring. Explore honest flavors, thoughtful picks, and simple ways to make the
                everyday feel a little more special.
              </p>
              <div className="my-6 grid gap-4">
                <div className="grid gap-1 border-l-2 border-reenz-gold pl-4">
                  <strong className="text-sm text-reenz-green">From nature</strong>
                  <span className="text-sm leading-6 text-reenz-muted">Ingredients inspired by the richness of the earth.</span>
                </div>
                <div className="grid gap-1 border-l-2 border-reenz-gold pl-4">
                  <strong className="text-sm text-reenz-green">For every day</strong>
                  <span className="text-sm leading-6 text-reenz-muted">Easy favorites for little rituals and big cravings.</span>
                </div>
              </div>
              <Link className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full bg-reenz-green px-5 py-3 text-sm font-semibold text-white no-underline shadow-sm transition hover:bg-reenz-forest focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-reenz-gold" href="/catalog">
                Shop pantry favorites{" "}
                <ArrowRight className="text-lg leading-none" aria-hidden="true" size={18} />
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-reenz-sage px-4 py-10" aria-label="Delivery, returns, and refunds" data-reveal>
          <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
            <article className="rounded-2xl bg-reenz-paper p-5 text-center shadow-sm">
              <Truck className="mx-auto mb-3 size-8 text-reenz-leaf" aria-hidden="true" size={32} />
              <h2 className="mb-1 font-heading text-xl font-medium text-reenz-forest">Free Delivery</h2>
              <p className="m-0 text-sm text-reenz-muted">Free and fast delivery in 24/7 hours</p>
            </article>
            <article className="rounded-2xl bg-reenz-paper p-5 text-center shadow-sm">
              <RotateCcw className="mx-auto mb-3 size-8 text-reenz-leaf" aria-hidden="true" size={32} />
              <h2 className="mb-1 font-heading text-xl font-medium text-reenz-forest">Returns</h2>
              <p className="m-0 text-sm text-reenz-muted">Our returns policy last 7 days</p>
            </article>
            <article className="rounded-2xl bg-reenz-paper p-5 text-center shadow-sm">
              <CircleDollarSign className="mx-auto mb-3 size-8 text-reenz-leaf" aria-hidden="true" size={32} />
              <h2 className="mb-1 font-heading text-xl font-medium text-reenz-forest">Refunds</h2>
              <p className="m-0 text-sm text-reenz-muted">Our refund policy last 7 days</p>
            </article>
          </div>
        </section>
      </main>
    </StorefrontShell>
  );
}
