"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type StoreNavigationProps = {
  currentPage: "home" | "catalog" | "contact";
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
        className="nav-toggle"
        type="button"
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-controls="primary-navigation"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
      </button>
      <nav
        className={`site-nav${isOpen ? " is-open" : ""}`}
        id="primary-navigation"
        aria-label="Main navigation"
      >
        <ul className="nav-list">
          <li>
            <Link
              href="/"
              aria-current={currentPage === "home" ? "page" : undefined}
              onClick={closeMenu}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/catalog"
              aria-current={currentPage === "catalog" ? "page" : undefined}
              onClick={closeMenu}
            >
              Catalog
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              aria-current={currentPage === "contact" ? "page" : undefined}
              onClick={closeMenu}
            >
              Contact
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
