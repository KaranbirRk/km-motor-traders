"use client";

import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import InventoryCarCard from "../../components/InventoryCarCard";
import { InventoryCar } from "../../types";

interface Props {
  inventoryCars: InventoryCar[];
  upcomingCars: InventoryCar[];
  source: "api" | "fallback";
}

type Tab = "available" | "upcoming";

function matchesSearch(car: InventoryCar, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  const haystack = [
    car.make,
    car.model,
    String(car.year),
    car.transmission,
    car.fuelType,
    car.bodyType,
    car.color,
    car.stockNumber,
    car.advertisement,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return q.split(/\s+/).every((term) => haystack.includes(term));
}

export default function InventoryPageClient({
  inventoryCars,
  upcomingCars,
}: Props) {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<Tab>("available");

  const filteredInventory = useMemo(
    () => inventoryCars.filter((car) => matchesSearch(car, search)),
    [inventoryCars, search]
  );

  const filteredUpcoming = useMemo(
    () => upcomingCars.filter((car) => matchesSearch(car, search)),
    [upcomingCars, search]
  );

  const list = tab === "available" ? filteredInventory : filteredUpcoming;
  const totalResults = filteredInventory.length + filteredUpcoming.length;
  const isSearching = search.trim().length > 0;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      e.preventDefault();
      document.getElementById("inventory-search")?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("active");
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll<HTMLElement>(".reveal").forEach((el) => {
      observer.observe(el);
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add("active");
      }
    });
    return () => observer.disconnect();
  }, [search, tab, list.length]);

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      {/* Fixed filter bar — stays under header while stock scrolls */}
      <div className="fixed left-0 right-0 top-[6.25rem] sm:top-[8rem] z-40 bg-surface/95 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-3 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="flex gap-1 border border-border p-0.5 rounded-sm w-fit">
            <button
              type="button"
              onClick={() => setTab("available")}
              className={`px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] rounded-sm transition-colors ${
                tab === "available"
                  ? "bg-ink text-white"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              Available ({filteredInventory.length})
            </button>
            <button
              type="button"
              onClick={() => setTab("upcoming")}
              className={`px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] rounded-sm transition-colors ${
                tab === "upcoming"
                  ? "bg-ink text-white"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              Upcoming ({filteredUpcoming.length})
            </button>
          </div>

          <div className="group/search relative w-full sm:max-w-sm">
            <label htmlFor="inventory-search" className="sr-only">
              Search vehicles
            </label>
            <i
              className="fas fa-search pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-ink-muted text-xs transition-colors duration-200 group-focus-within/search:text-brand"
              aria-hidden
            />
            <input
              id="inventory-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search make, model, year…"
              autoComplete="off"
              className="w-full h-11 bg-white border border-border pl-10 pr-10 text-sm font-medium text-ink outline-none rounded-sm transition-all duration-200 placeholder:text-[#9a968c] hover:border-ink/25 focus:border-brand focus:ring-2 focus:ring-brand/20 [&::-webkit-search-cancel-button]:hidden"
            />
            {search ? (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center text-ink-muted hover:text-ink hover:bg-surface-2 transition-colors rounded-sm"
                aria-label="Clear search"
              >
                <i className="fas fa-times text-[10px]" />
              </button>
            ) : (
              <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center border border-border bg-surface px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-ink-muted group-focus-within/search:opacity-0 transition-opacity">
                /
              </kbd>
            )}
          </div>
        </div>
      </div>

      <section className="pt-[8.5rem] sm:pt-16 pb-14 md:pb-18">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="mb-10 reveal">
            <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-wide text-ink">
              {tab === "available" ? "Available stock" : "Upcoming stock"}
            </h1>
            <p className="mt-3 text-sm text-ink-muted max-w-lg">
              {tab === "available"
                ? "Inspected vehicles ready for the lot. Call to book a look."
                : "Arriving soon — reserve before they land."}
            </p>
            {isSearching && (
              <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
                {totalResults} {totalResults === 1 ? "match" : "matches"} across stock
              </p>
            )}
          </div>

          {list.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {list.map((car, i) => (
                <InventoryCarCard
                  key={car.id}
                  car={car}
                  upcoming={tab === "upcoming"}
                  index={i}
                />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center border border-dashed border-border reveal">
              <p className="text-ink-muted text-sm">
                {isSearching
                  ? "No vehicles match your search."
                  : tab === "available"
                    ? "No available stock right now."
                    : "No upcoming stock listed."}
              </p>
            </div>
          )}

          <div className="mt-16 text-center reveal">
            <p className="text-sm text-ink-muted mb-5">
              Looking for something specific? We&apos;ll source it.
            </p>
            <a
              href="/#visit"
              className="inline-block bg-ink text-white px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] hover:bg-brand hover:text-ink transition-colors rounded-sm"
            >
              Contact the yard
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
