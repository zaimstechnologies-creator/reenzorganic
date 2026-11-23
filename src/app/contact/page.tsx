import { Mail, Truck } from "lucide-react";
import { connection } from "next/server";
import { ContactForm } from "@/components/contact-form";
import { StorefrontShell } from "@/components/storefront";

export const instant = false;

export default async function ContactPage() {
  await connection();
  return (
    <StorefrontShell currentPage="contact">
      <main className="contact-page">
        <section className="contact-section" aria-labelledby="contact-heading">
          <div className="contact-inner container">
            <header className="contact-intro">
              <p className="eyebrow">Thoughtful goods. Real people.</p>
              <h1 id="contact-heading">Let’s talk.</h1>
              <p>
                Questions about our products or an order? Send us a message and the Reenz Organic
                team will be in touch.
              </p>
            </header>
            <div className="contact-layout">
              <aside className="contact-details" aria-labelledby="contact-details-heading">
                <p className="contact-kicker">Here to help</p>
                <h2 id="contact-details-heading">Good things start with a conversation.</h2>
                <p className="contact-details-copy">
                  Whether you need a hand with an order or would like to know more about what we make,
                  we’d love to hear from you.
                </p>
                <ul className="contact-topics">
                  <li>
                    <span className="contact-topic-icon" aria-hidden="true">
                      <Mail />
                    </span>
                    <span>
                      <strong>Product questions</strong>
                      <small>Ask us about ingredients and our range.</small>
                    </span>
                  </li>
                  <li>
                    <span className="contact-topic-icon" aria-hidden="true">
                      <Truck />
                    </span>
                    <span>
                      <strong>Order support</strong>
                      <small>Tell us how we can help with your order.</small>
                    </span>
                  </li>
                </ul>
              </aside>

              <div className="contact-form-card">
                <div className="contact-form-heading">
                  <p className="eyebrow">Contact form</p>
                  <h2>Send us a message</h2>
                  <p>
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

