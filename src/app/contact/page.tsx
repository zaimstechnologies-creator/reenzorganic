import { Mail, Truck } from "lucide-react";
import { connection } from "next/server";
import { ContactForm } from "@/components/contact-form";
import { StorefrontShell } from "@/components/storefront";

export const instant = false;

export default async function ContactPage() {
  await connection();
  return (
    <StorefrontShell currentPage="contact">
      <main className="min-h-screen bg-reenz-cream">
        <section className="min-h-full bg-reenz-cream" aria-labelledby="contact-heading">
          <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-8 md:py-16">
            <header className="mx-auto mb-9 max-w-2xl text-center">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-reenz-leaf">Thoughtful goods. Real people.</p>
              <h1 id="contact-heading" className="mb-3 font-heading text-5xl text-reenz-forest">Let’s talk.</h1>
              <p className="leading-7 text-reenz-muted">
                Questions about our products or an order? Send us a message and the Reenz Organic
                team will be in touch.
              </p>
            </header>
            <div className="grid gap-6 md:grid-cols-2 md:gap-8">
              <aside className="rounded-3xl bg-reenz-forest p-6 text-reenz-paper md:p-8" aria-labelledby="contact-details-heading">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-reenz-gold">Here to help</p>
                <h2 id="contact-details-heading" className="font-heading text-3xl leading-tight">Good things start with a conversation.</h2>
                <p className="text-sm leading-6 text-reenz-paper/75">
                  Whether you need a hand with an order or would like to know more about what we make,
                  we’d love to hear from you.
                </p>
                <ul className="mt-6 grid list-none gap-4 p-0">
                  <li className="flex items-center gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-reenz-paper/10" aria-hidden="true">
                      <Mail className="size-5 stroke-reenz-gold stroke-2" />
                    </span>
                    <span>
                      <strong className="block">Product questions</strong>
                      <small className="mt-1 block text-xs text-reenz-paper/70">Ask us about ingredients and our range.</small>
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-reenz-paper/10" aria-hidden="true">
                      <Truck className="size-5 stroke-reenz-gold stroke-2" />
                    </span>
                    <span>
                      <strong className="block">Order support</strong>
                      <small className="mt-1 block text-xs text-reenz-paper/70">Tell us how we can help with your order.</small>
                    </span>
                  </li>
                </ul>
              </aside>

              <div className="rounded-3xl border border-reenz-border bg-reenz-paper p-5 shadow-sm md:p-8">
                <div>
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-reenz-leaf">Contact form</p>
                  <h2 className="mb-2 font-heading text-2xl text-reenz-forest">Send us a message</h2>
                  <p className="text-sm text-reenz-muted">
                    Fill in the details below and we’ll receive your note directly.
                  </p>
                </div>
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>
    </StorefrontShell>
  );
}

