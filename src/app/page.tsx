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
        <section className="hero" aria-labelledby="hero-heading">
          <div className="hero-background" aria-hidden="true">
            <div className="hero-background-slide">
              <Image
                src={resolveStoreImage("/assets/images/hero-fruit-platter.webp")}
                alt=""
                fill
                sizes="100vw"
              />
            </div>
            <div className="hero-background-slide hero-background-slide--second">
              <Image
                src={resolveStoreImage("/assets/images/hero-dried-fruits.webp")}
                alt=""
                fill
                sizes="100vw"
              />
            </div>
            <div className="hero-background-slide hero-background-slide--third">
              <Image
                src={resolveStoreImage("/assets/images/hero-fruits-nuts.webp")}
                alt=""
                fill
                sizes="100vw"
              />
            </div>
            <div className="hero-background-overlay" />
          </div>
          <div className="hero-content">
            <div className="hero-copy">
              <p className="eyebrow">Artisanal &amp; Sustainable Estate</p>
              <h1 id="hero-heading">
                100% Organic, Purely <em>Original.</em>
              </h1>
              <p className="hero-description">
                Experience the essence of nature with our curated collection of farm-fresh harvests and traditional botanical elixirs.
              </p>
              <div className="hero-actions">
                <Link className="button" href="#featured">
                  Explore the collection{" "}
                  <ArrowRight className="button-arrow" aria-hidden="true" size={18} />
                </Link>
                <Link className="button button--outline" href="/catalog">
                  Find your favorites
                </Link>
              </div>
            </div>
            <div className="hero-visual" aria-hidden="true">
              <div className="hero-image-frame">
                <span className="hero-slide hero-slide--primary">
                  <Image
                    src={resolveStoreImage("/assets/images/hero-fruit-platter.webp")}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 75vw, 36vw"
                    preload
                  />
                </span>
                <span className="hero-slide hero-slide--secondary">
                  <Image
                    src={resolveStoreImage("/assets/images/hero-dried-fruits.webp")}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 48vw, 24vw"
                  />
                </span>
                <span className="hero-slide hero-slide--tertiary">
                  <Image
                    src={resolveStoreImage("/assets/images/hero-fruits-nuts.webp")}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 32vw, 16vw"
                  />
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="trust-strip" aria-label="Our promise">
          <div className="trust-item">
            <Leaf className="trust-icon" aria-hidden="true" size={20} />
            Picked for quality
          </div>
          <div className="trust-item">
            <Heart className="trust-icon" aria-hidden="true" size={20} />
            Naturally delicious
          </div>
          <div className="trust-item">
            <Sparkles className="trust-icon" aria-hidden="true" size={20} />
            Goodness for every day
          </div>
        </section>

        <section className="section-wrap products-section" id="featured" aria-labelledby="products-heading">
          <div className="container">
            <div className="products-heading-row" data-reveal>
              <div className="section-heading">
                <p className="eyebrow">Straight from our store</p>
                <h2 id="products-heading">Shop Reenz Organic favorites</h2>
                <p>Explore thoughtful favorites from across our pantry.</p>
              </div>
            </div>
            <Link className="desi-category-link" href="/catalog?category=desi-items">
              <span className="desi-category-copy">
                <span className="desi-category-eyebrow">Desi Items</span>
                <strong>Desi Ghee &amp; Organic Honey</strong>
                <span>Explore our traditional ghee and honey favorites.</span>
              </span>
              <span className="desi-category-action">
                Shop desi items <ArrowRight aria-hidden="true" size={16} />
              </span>
            </Link>
            <div className="collection-highlights" aria-label="Explore our pantry">
              <Link className="collection-highlight" href="/catalog?category=dry-fruits">
                <Image
                  src={resolveStoreImage("/assets/images/hero-fruit-platter.webp")}
                  alt="A colorful assortment of dried fruit"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <span className="collection-highlight-label">
                  <span>Dried fruit</span>
                  <ArrowRight aria-hidden="true" size={16} />
                </span>
              </Link>
              <Link className="collection-highlight" href="/catalog?category=desi-items">
                <Image
                  src={resolveStoreImage("/assets/images/home-screen-right-side-photo.jpg")}
                  alt="Desi ghee, honey, and dried fruit"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <span className="collection-highlight-label">
                  <span>Pantry favorites</span>
                  <ArrowRight aria-hidden="true" size={16} />
                </span>
              </Link>
              <Link className="collection-highlight" href="/catalog?category=nuts">
                <Image
                  src={resolveStoreImage("/assets/images/Almond.jpg")}
                  alt="A close-up of whole almonds"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <span className="collection-highlight-label">
                  <span>Nuts &amp; more</span>
                  <ArrowRight aria-hidden="true" size={16} />
                </span>
              </Link>
            </div>
            {products.length === 0 && (
              <p className="catalog-notice" role="status">
                There are no available products right now. Please check back soon.
              </p>
            )}
            <ProductGrid products={products} />
            <div className="products-footer" data-reveal>
              <Link className="button" href="/catalog">
                View the collection{" "}
                <ArrowRight className="button-arrow" aria-hidden="true" size={18} />
              </Link>
            </div>
          </div>
        </section>

        <section className="story-section" aria-labelledby="story-heading">
          <div className="container story-grid">
            <div className="story-image" data-reveal>
              <Image
                src={resolveStoreImage("/assets/images/home-screen-right-side-photo.jpg")}
                alt="Reenz Organic desi ghee and honey alongside a colorful selection of dried fruit"
                width={960}
                height={960}
                sizes="(max-width: 760px) 100vw, 45vw"
              />
            </div>
            <div className="story-copy" data-reveal>
              <p className="eyebrow">A little more thoughtful</p>
              <h2 id="story-heading">Good food should feel good.</h2>
              <p>
                We believe the best pantry staples start with nature and end with a moment worth
                savoring. Explore honest flavors, thoughtful picks, and simple ways to make the
                everyday feel a little more special.
              </p>
              <div className="story-points">
                <div>
                  <strong>From nature</strong>
                  <span>Ingredients inspired by the richness of the earth.</span>
                </div>
                <div>
                  <strong>For every day</strong>
                  <span>Easy favorites for little rituals and big cravings.</span>
                </div>
              </div>
              <Link className="button" href="/catalog">
                Shop pantry favorites{" "}
                <ArrowRight className="button-arrow" aria-hidden="true" size={18} />
              </Link>
            </div>
          </div>
        </section>

        <section className="closing-banner" aria-label="Delivery, returns, and refunds" data-reveal>
          <div className="closing-benefits">
            <article className="closing-benefit">
              <Truck className="closing-benefit-icon" aria-hidden="true" size={32} />
              <h2>Free Delivery</h2>
              <p>Free and fast delivery in 24/7 hours</p>
            </article>
            <article className="closing-benefit">
              <RotateCcw className="closing-benefit-icon" aria-hidden="true" size={32} />
              <h2>Returns</h2>
              <p>Our returns policy last 7 days</p>
            </article>
            <article className="closing-benefit">
              <CircleDollarSign className="closing-benefit-icon" aria-hidden="true" size={32} />
              <h2>Refunds</h2>
              <p>Our refund policy last 7 days</p>
            </article>
          </div>
        </section>
      </main>
    </StorefrontShell>
  );
}
