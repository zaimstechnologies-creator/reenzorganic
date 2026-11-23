"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type StoreNavigationProps = {
  currentPage: "home" | "catalog" | "contact" | "cart" | "checkout";
};

export function StoreNavigation({ currentPage }: StoreNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        toggleRef.current?.focus();
      }
    }

    const desktopQuery = window.matchMedia("(min-width: 769px)");
    function closeOnDesktop() {
      if (desktopQuery.matches) setIsOpen(false);
    }

    document.addEventListener("keydown", handleKeyDown);
    desktopQuery.addEventListener("change", closeOnDesktop);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      desktopQuery.removeEventListener("change", closeOnDesktop);
    };
  }, [isOpen]);

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <>
      <button
        ref={toggleRef}
        className="grid size-10 cursor-pointer place-items-center rounded-full border border-reenz-sage/30 bg-transparent text-reenz-sage transition-colors hover:bg-reenz-sage/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-reenz-leaf md:hidden"
        type="button"
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-controls="primary-navigation"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
      </button>
      <nav
        className={`hidden items-center justify-self-center max-md:absolute max-md:inset-x-4 max-md:top-[calc(100%-0.25rem)] max-md:flex-col max-md:rounded-2xl max-md:bg-[#1a251d] max-md:p-3 ${isOpen ? "max-md:flex" : ""} md:flex`}
        id="primary-navigation"
        aria-label="Main navigation"
      >
        <ul className="flex list-none flex-wrap items-center gap-1 p-0 max-md:w-full max-md:flex-col max-md:items-stretch">
          <li>
            <Link
              href="/"
              aria-current={currentPage === "home" ? "page" : undefined}
              onClick={closeMenu}
              className="rounded-full px-4 py-2.5 text-sm font-medium text-reenz-sage no-underline transition-colors hover:bg-white/10 hover:text-reenz-paper aria-[current=page]:bg-white/10 aria-[current=page]:text-reenz-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-reenz-gold max-md:flex max-md:px-4"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/catalog"
              aria-current={currentPage === "catalog" ? "page" : undefined}
              onClick={closeMenu}
              className="rounded-full px-4 py-2.5 text-sm font-medium text-reenz-sage no-underline transition-colors hover:bg-white/10 hover:text-reenz-paper aria-[current=page]:bg-white/10 aria-[current=page]:text-reenz-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-reenz-gold max-md:flex max-md:px-4"
            >
              Catalog
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              aria-current={currentPage === "contact" ? "page" : undefined}
              onClick={closeMenu}
              className="rounded-full px-4 py-2.5 text-sm font-medium text-reenz-sage no-underline transition-colors hover:bg-white/10 hover:text-reenz-paper aria-[current=page]:bg-white/10 aria-[current=page]:text-reenz-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-reenz-gold max-md:flex max-md:px-4"
            >
              Contact
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
