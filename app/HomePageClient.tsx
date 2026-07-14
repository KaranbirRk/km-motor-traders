"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import InventoryCarCard from "../components/InventoryCarCard";
import SellCarEnquiryForm from "../components/SellCarEnquiryForm";
import { CONTACT_INFO } from "../constants";
import { InventoryCar } from "../types";

interface Props {
  featuredCars: InventoryCar[];
}

const MAP_QUERY = encodeURIComponent("19 Hammond Road, Dandenong VIC 3175");

const HomePageClient: React.FC<Props> = ({ featuredCars }) => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("active");
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll<HTMLElement>(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const displayCars = featuredCars.slice(0, 6);

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      {/* 1. Asymmetric hero — full photo visible on all screens */}
      <section className="grid grid-cols-1 lg:grid-cols-12 lg:items-stretch bg-surface">
        <div className="lg:col-span-5 flex flex-col justify-center px-5 sm:px-10 lg:px-12 py-12 sm:py-16 lg:py-20 order-2 lg:order-1">
          <div className="reveal max-w-md mx-auto lg:mx-0 w-full">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-8 bg-brand" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-ink-muted">
                {CONTACT_INFO.suburb} · {CONTACT_INFO.lmct}
              </span>
            </div>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-[4.25rem] uppercase leading-[0.95] tracking-wide text-ink">
              KM Motor
              <br />
              Traders
            </h1>

            <div className="mt-8 bg-ink text-white px-4 py-2.5 inline-block">
              <span className="font-display text-sm sm:text-base tracking-[0.3em] uppercase">
                Used Car Sales
              </span>
            </div>

            <p className="mt-8 text-base text-ink-muted leading-relaxed max-w-sm">
              {CONTACT_INFO.slogan}
            </p>

            <div className="flex flex-wrap gap-3 mt-10">
              <Link
                href="/inventory"
                className="bg-brand text-ink px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] hover:bg-brand-hover transition-colors rounded-sm"
              >
                View Inventory
              </Link>
              <a
                href="#sell"
                className="border border-ink text-ink px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] hover:bg-ink hover:text-white transition-colors rounded-sm"
              >
                Sell Your Car
              </a>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 relative order-1 lg:order-2 bg-[#0c0c0c]">
          <div className="relative w-full aspect-[4/3] lg:min-h-[min(100%,36rem)] lg:h-full lg:aspect-auto">
            <img
              src="/hero.png"
              alt="KM Motor Traders dealership in Dandenong"
              className="absolute inset-0 w-full h-full object-cover object-center lg:object-contain lg:object-center"
            />
            <div
              className="pointer-events-none absolute inset-y-0 left-0 hidden lg:block w-12 bg-gradient-to-r from-surface to-transparent"
              aria-hidden
            />
          </div>
        </div>
      </section>

      {/* 2. Trust strip */}
      <section className="border-y border-border bg-surface-2">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-4 sm:py-5">
          <ul className="flex flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-2.5 sm:gap-x-6 sm:gap-y-2 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted">
            <li className="text-ink">Quality cars</li>
            <li className="hidden sm:inline text-brand" aria-hidden>
              ·
            </li>
            <li className="h-px w-8 bg-brand/60 sm:hidden" aria-hidden />
            <li>Great prices</li>
            <li className="hidden sm:inline text-brand" aria-hidden>
              ·
            </li>
            <li className="h-px w-8 bg-brand/60 sm:hidden" aria-hidden />
            <li>Honest service</li>
          </ul>
        </div>
      </section>

      {/* 3. Featured stock — editorial grid */}
      <section id="stock" className="py-20 md:py-28 bg-surface">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12 reveal">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand mb-3">
                On the yard
              </p>
              <h2 className="font-display text-4xl sm:text-5xl uppercase tracking-wide text-ink">
                Current stock
              </h2>
            </div>
            <Link
              href="/inventory"
              className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted hover:text-brand transition-colors"
            >
              View all stock →
            </Link>
          </div>

          {displayCars.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayCars.map((car, i) => (
                <InventoryCarCard key={car.id} car={car} index={i} />
              ))}
            </div>
          ) : (
            <p className="text-ink-muted text-sm">Stock updating soon — please call us.</p>
          )}
        </div>
      </section>

      {/* 4. About split */}
      <section id="about" className="bg-surface-2 border-y border-border">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2">
          <div className="relative min-h-[320px] lg:min-h-[480px]">
            <img
              src="/about.jpg"
              alt="KM Motor Traders yard"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center px-5 sm:px-10 lg:px-14 py-16 reveal">
            <div className="h-px w-12 bg-brand mb-6" />
            <h2 className="font-display text-4xl uppercase tracking-wide text-ink mb-6">
              Straight talk.
              <br />
              Local yard.
            </h2>
            <p className="text-ink-muted leading-relaxed max-w-md">
              KM Motor Traders is a used-car yard on Hammond Road in Dandenong. We keep
              things simple: inspected stock, clear pricing, and no pressure. Licensed
              and local — {CONTACT_INFO.lmct}.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-ink">
              <li className="flex gap-3">
                <span className="text-brand font-bold">—</span>
                Inspected vehicles before they hit the lot
              </li>
              <li className="flex gap-3">
                <span className="text-brand font-bold">—</span>
                Trade-ins and sell-your-car valuations
              </li>
              <li className="flex gap-3">
                <span className="text-brand font-bold">—</span>
                Finance help when you need it
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 5. We Buy Cars — ink band */}
      <section id="sell" className="bg-ink text-white py-20 md:py-24 relative">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand" aria-hidden />
        <div className="max-w-6xl mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-5 reveal">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand mb-4">
              We buy cars
            </p>
            <h2 className="font-display text-4xl sm:text-5xl uppercase tracking-wide leading-tight">
              Sell your car today
            </h2>
            <p className="mt-6 text-white/60 leading-relaxed max-w-sm">
              Running or not — tell us what you&apos;ve got and we&apos;ll come back with
              a fair cash offer.
            </p>
            <ul className="mt-10 space-y-4 text-sm text-white/80">
              <li className="flex gap-3 items-start">
                <span className="text-brand mt-0.5">✓</span>
                All makes and models
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-brand mt-0.5">✓</span>
                Fast quotes — no paperwork headache
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-brand mt-0.5">✓</span>
                Free removal available
              </li>
            </ul>
            <a
              href={`tel:${CONTACT_INFO.phoneTel}`}
              className="inline-block mt-10 text-brand font-display text-2xl tracking-wide hover:text-white transition-colors"
            >
              {CONTACT_INFO.phone}
            </a>
          </div>
          <div className="lg:col-span-7 reveal stagger-1">
            <SellCarEnquiryForm />
          </div>
        </div>
      </section>

      {/* 6. Visit — map dominant */}
      <section id="visit" className="py-20 md:py-24 bg-surface">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="mb-10 reveal">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand mb-3">
              Find us
            </p>
            <h2 className="font-display text-4xl sm:text-5xl uppercase tracking-wide text-ink">
              Visit the yard
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 border border-border overflow-hidden min-h-[360px] reveal">
              <iframe
                title="KM Motor Traders map"
                src={`https://maps.google.com/maps?q=${MAP_QUERY}&z=15&output=embed`}
                className="w-full h-full min-h-[360px] border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="lg:col-span-4 border border-border bg-white p-7 flex flex-col gap-8 reveal stagger-1">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-muted mb-2">
                  Address
                </p>
                <p className="text-ink leading-relaxed">{CONTACT_INFO.address}</p>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${MAP_QUERY}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-brand hover:text-brand-hover"
                >
                  Get directions →
                </a>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-muted mb-2">
                  Hours
                </p>
                <p className="text-sm text-ink">{CONTACT_INFO.hoursWeekday}</p>
                <p className="text-sm text-ink-muted mt-1">{CONTACT_INFO.hoursSunday}</p>
              </div>
              <a
                href={`tel:${CONTACT_INFO.phoneTel}`}
                className="mt-auto bg-ink text-white text-center py-3.5 text-xs font-semibold uppercase tracking-[0.18em] hover:bg-brand hover:text-ink transition-colors rounded-sm"
              >
                Call {CONTACT_INFO.phone}
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePageClient;
