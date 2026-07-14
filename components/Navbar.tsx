"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CONTACT_INFO } from "../constants";

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(!isHome);

  useEffect(() => {
    if (!isHome) {
      setScrolled(true);
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const navItems = [
    { label: "Stock", href: "/inventory" },
    { label: "Sell", href: isHome ? "#sell" : "/#sell" },
    { label: "Visit", href: isHome ? "#visit" : "/#visit" },
  ];

  return (
    <header className="sticky top-0 z-[100]">
      {/* Utility bar */}
      <div className="bg-ink text-white text-[11px] tracking-wide">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-9 flex items-center justify-between gap-4">
          <a
            href={`tel:${CONTACT_INFO.phoneTel}`}
            className="group/phone relative font-medium text-white/90 transition-colors duration-200 hover:text-brand"
          >
            <span className="inline-flex items-center gap-1.5">
              <i className="fas fa-phone text-[9px] opacity-50 group-hover/phone:opacity-100 transition-opacity duration-200" />
              {CONTACT_INFO.phone}
            </span>
            <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-brand transition-all duration-300 group-hover/phone:w-full" />
          </a>
          <span className="hidden sm:inline text-white/55 truncate transition-colors duration-200 hover:text-brand cursor-default">
            {CONTACT_INFO.hoursWeekday}
          </span>
          <span className="text-white/40 font-display tracking-[0.15em] uppercase text-[10px] transition-colors duration-200 hover:text-brand cursor-default">
            {CONTACT_INFO.lmct}
          </span>
        </div>
      </div>

      {/* Main nav */}
      <nav
        className={`border-b transition-colors duration-300 ${
          scrolled
            ? "bg-surface/95 backdrop-blur-md border-border"
            : "bg-surface border-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-3 sm:py-3.5 flex items-center justify-between gap-6">
          <Link href="/" className="flex items-center min-w-0 shrink-0">
            <img
              src="/logo.png"
              alt="KM Motor Traders"
              className="h-10 sm:h-16 w-auto max-h-16 object-contain"
            />
          </Link>

          <div className="hidden md:flex items-center gap-7 lg:gap-9">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted hover:text-ink transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <a
              href={`tel:${CONTACT_INFO.phoneTel}`}
              className="bg-ink text-white text-xs font-semibold uppercase tracking-[0.16em] px-5 py-2.5 rounded-sm hover:bg-brand hover:text-ink transition-colors"
            >
              Call Now
            </a>
          </div>

          <button
            type="button"
            className="md:hidden w-10 h-10 flex items-center justify-center text-ink shrink-0"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <i className={`fas ${menuOpen ? "fa-times" : "fa-bars"}`} />
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-border bg-surface px-5 py-4 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block text-sm font-semibold uppercase tracking-[0.16em] py-2"
              >
                {item.label}
              </Link>
            ))}
            <a
              href={`tel:${CONTACT_INFO.phoneTel}`}
              className="block text-center bg-ink text-white text-xs font-semibold uppercase tracking-[0.16em] px-5 py-3 rounded-sm"
            >
              Call {CONTACT_INFO.phone}
            </a>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
