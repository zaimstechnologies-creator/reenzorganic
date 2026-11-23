import Image from "next/image";
import Link from "next/link";
import { AdminLoginForm } from "@/components/admin-login-form";
import { resolveStoreImage } from "@/lib/store-images";

export const metadata = { title: "Admin sign in | Reenz Organic" };

export default function AdminLoginPage() {
  return (
    <main className="grid min-h-screen grid-cols-1 bg-reenz-cream lg:grid-cols-[minmax(320px,42%)_minmax(0,58%)]">
      <section className="relative hidden min-h-screen flex-col justify-between overflow-hidden bg-[#26372a] px-[clamp(2rem,5vw,5.5rem)] py-10 text-reenz-paper lg:flex">
        <Link className="flex w-fit items-center text-reenz-paper no-underline" href="/">
          <Image
            src={resolveStoreImage("/assets/images/logo.png")}
            alt="Reenz Organic"
            width={137}
            height={55}
            priority
          />
        </Link>
        <div className="max-w-md">
          <p className="mb-5 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-reenz-gold">THE REENZ ORGANIC WORKSPACE</p>
          <h1 className="font-heading text-[clamp(2.8rem,4vw,4.8rem)] leading-[1.02] font-medium [&_em]:text-reenz-gold [&_em]:not-italic">
            Thoughtful goods.
            <br />
            <em>Thoughtfully managed.</em>
          </h1>
          <span className="mt-6 block text-sm leading-6 text-reenz-paper/75">Keep your catalog fresh and your store running smoothly.</span>
        </div>
        <small className="text-xs text-reenz-paper/55">© Reenz Organic. Crafted with care.</small>
      </section>
      <section className="flex min-h-screen min-w-0 flex-col bg-reenz-cream">
        <header className="flex h-20 shrink-0 items-center justify-between border-b border-reenz-border px-5 md:px-10">
          <span>Store management</span>
          <Link className="text-sm font-semibold text-reenz-green no-underline" href="/">Return to storefront <span aria-hidden="true">↗</span></Link>
        </header>
        <div className="mx-auto flex w-full max-w-[520px] flex-1 flex-col justify-center gap-5 px-5 py-10">
          <AdminLoginForm />
          <p className="flex flex-wrap items-center justify-center gap-2 text-center text-[0.65rem] font-bold uppercase tracking-[0.12em] text-reenz-muted">SECURE ADMIN AREA <span className="size-1 rounded-full bg-reenz-leaf" /> PRIVATE ACCESS ONLY</p>
        </div>
      </section>
    </main>
  );
}

