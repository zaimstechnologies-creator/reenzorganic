import Image from "next/image";
import Link from "next/link";
import { AdminLoginForm } from "@/components/admin-login-form";
import { resolveStoreImage } from "@/lib/store-images";

export const metadata = { title: "Admin sign in | Reenz Organic" };

export default function AdminLoginPage() {
  return (
    <main className="admin-login-layout">
      <section className="admin-login-brand-panel">
        <Link className="admin-login-brand" href="/">
          <Image
            src={resolveStoreImage("/assets/images/logo.png")}
            alt="Reenz Organic"
            width={137}
            height={55}
            priority
          />
        </Link>
        <div className="admin-login-brand-copy">
          <p>THE REENZ ORGANIC WORKSPACE</p>
          <h1>
            Thoughtful goods.
            <br />
            <em>Thoughtfully managed.</em>
          </h1>
          <span>Keep your catalog fresh and your store running smoothly.</span>
        </div>
        <small className="admin-login-copyright">© Reenz Organic. Crafted with care.</small>
      </section>
      <section className="admin-login-workspace">
        <header className="admin-login-topbar">
          <span>Store management</span>
          <Link href="/">Return to storefront <span aria-hidden="true">↗</span></Link>
        </header>
        <div className="admin-login-content">
          <AdminLoginForm />
          <p className="admin-login-security">SECURE ADMIN AREA <span /> PRIVATE ACCESS ONLY</p>
        </div>
      </section>
    </main>
  );
}

