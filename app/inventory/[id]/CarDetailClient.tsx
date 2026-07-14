"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import VehicleEnquiryForm from "../../../components/VehicleEnquiryForm";
import { InventoryCar } from "../../../types";

interface Props {
  car: InventoryCar;
}

const MAX_GALLERY_IMAGES = 20;
const SWIPE_THRESHOLD_PX = 50;

export default function CarDetailClient({ car }: Props) {
  const photos = (
    car.images?.length
      ? car.images
      : car.image !== "/logo.png"
        ? [car.image]
        : []
  )
    .filter(Boolean)
    .slice(0, MAX_GALLERY_IMAGES);
  const hasImages = photos.length > 0;

  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const swipedRef = useRef(false);
  const activeThumbRef = useRef<HTMLButtonElement>(null);
  const lightboxThumbRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setActiveIndex(0);
    setLightboxOpen(false);
  }, [car.id]);

  useEffect(() => {
    activeThumbRef.current?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
    lightboxThumbRef.current?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
    });
  }, [activeIndex]);

  useEffect(() => {
    if (!lightboxOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") {
        setActiveIndex((i) => (i - 1 + photos.length) % photos.length);
      }
      if (e.key === "ArrowRight") {
        setActiveIndex((i) => (i + 1) % photos.length);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [lightboxOpen, photos.length]);

  const copyAdvertisement = async () => {
    if (!car.advertisement) return;
    try {
      await navigator.clipboard.writeText(car.advertisement);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  const goPrev = () => {
    if (photos.length < 2) return;
    setActiveIndex((i) => (i - 1 + photos.length) % photos.length);
  };
  const goNext = () => {
    if (photos.length < 2) return;
    setActiveIndex((i) => (i + 1) % photos.length);
  };

  const onArrowClick = (e: React.MouseEvent, direction: "prev" | "next") => {
    e.preventDefault();
    e.stopPropagation();
    if (direction === "prev") goPrev();
    else goNext();
  };

  const onTouchStart = (e: React.TouchEvent) => {
    if (photos.length < 2) return;
    const target = e.target as HTMLElement | null;
    if (target?.closest("[data-gallery-arrow]")) return;
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    swipedRef.current = false;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (photos.length < 2 || !touchStartRef.current) return;
    const target = e.target as HTMLElement | null;
    if (target?.closest("[data-gallery-arrow]")) {
      touchStartRef.current = null;
      return;
    }
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    if (Math.abs(dx) < SWIPE_THRESHOLD_PX || Math.abs(dx) < Math.abs(dy)) return;

    swipedRef.current = true;
    if (dx < 0) goNext();
    else goPrev();
  };

  const openLightbox = () => {
    if (swipedRef.current) {
      swipedRef.current = false;
      return;
    }
    setLightboxOpen(true);
  };

  const specs: { label: string; value: string }[] = [
    { label: "Odometer", value: `${car.mileage.toLocaleString()} km` },
    { label: "Transmission", value: car.transmission },
    ...(car.fuelType ? [{ label: "Fuel", value: car.fuelType }] : []),
    ...(car.bodyType ? [{ label: "Body", value: car.bodyType }] : []),
    ...(car.color ? [{ label: "Colour", value: car.color }] : []),
    ...(car.stockNumber ? [{ label: "Stock #", value: car.stockNumber }] : []),
  ];

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-8 pb-6">
        <Link
          href="/inventory"
          className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-muted hover:text-brand transition-colors"
        >
          ← Back to stock
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-5 sm:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Gallery + specs */}
          <div className="lg:col-span-7 space-y-5">
            {hasImages ? (
              <>
                <div className="relative">
                  <div
                    className="relative overflow-hidden border border-border bg-surface-2 touch-pan-y"
                    onTouchStart={onTouchStart}
                    onTouchEnd={onTouchEnd}
                  >
                    <button
                      type="button"
                      onClick={openLightbox}
                      className="block w-full text-left"
                      aria-label="Open photo gallery"
                    >
                      <img
                        key={photos[activeIndex]}
                        src={photos[activeIndex]}
                        alt={`${car.year} ${car.make} ${car.model} — photo ${activeIndex + 1}`}
                        className="w-full aspect-[4/3] object-cover select-none"
                        draggable={false}
                      />
                    </button>
                    {photos.length > 1 && (
                      <span className="absolute bottom-3 right-3 bg-ink/80 text-white text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 pointer-events-none">
                        {activeIndex + 1} / {photos.length}
                      </span>
                    )}
                  </div>

                  {photos.length > 1 && (
                    <>
                      <button
                        type="button"
                        data-gallery-arrow="prev"
                        onClick={(e) => onArrowClick(e, "prev")}
                        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-ink/70 hover:bg-ink text-white flex items-center justify-center transition-colors"
                        aria-label="Previous photo"
                      >
                        <i className="fas fa-chevron-left text-xs pointer-events-none" />
                      </button>
                      <button
                        type="button"
                        data-gallery-arrow="next"
                        onClick={(e) => onArrowClick(e, "next")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-ink/70 hover:bg-ink text-white flex items-center justify-center transition-colors"
                        aria-label="Next photo"
                      >
                        <i className="fas fa-chevron-right text-xs pointer-events-none" />
                      </button>
                    </>
                  )}
                </div>

                {photos.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1 scroll-smooth">
                    {photos.map((src, i) => (
                      <button
                        key={`${src}-${i}`}
                        ref={i === activeIndex ? activeThumbRef : undefined}
                        type="button"
                        onClick={() => setActiveIndex(i)}
                        className={`relative shrink-0 w-16 h-16 overflow-hidden border-2 transition-all ${
                          i === activeIndex
                            ? "border-brand opacity-100"
                            : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                        aria-label={`Show photo ${i + 1}`}
                        aria-current={i === activeIndex ? "true" : undefined}
                      >
                        <img
                          src={src}
                          alt=""
                          className="w-full h-full object-cover pointer-events-none"
                          draggable={false}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="border border-border bg-ink flex items-center justify-center py-28">
                <p className="text-white/30 text-[10px] font-semibold uppercase tracking-[0.3em]">
                  Photos Coming Soon
                </p>
              </div>
            )}

            {/* Specs as definition list */}
            <dl className="border border-border bg-white divide-y divide-border">
              {specs.map((spec) => (
                <div
                  key={spec.label}
                  className="flex justify-between gap-4 px-5 py-3.5 text-sm"
                >
                  <dt className="text-ink-muted font-medium uppercase tracking-[0.12em] text-[11px]">
                    {spec.label}
                  </dt>
                  <dd className="text-ink font-semibold text-right">{spec.value}</dd>
                </div>
              ))}
              <div className="flex justify-between gap-4 px-5 py-3.5 text-sm">
                <dt className="text-ink-muted font-medium uppercase tracking-[0.12em] text-[11px]">
                  Price
                </dt>
                <dd className="text-ink font-semibold text-right font-display text-lg tracking-wide">
                  {car.price > 0 ? (
                    <>
                      <span className="text-brand">$</span>
                      {car.price.toLocaleString()}
                      <span className="text-[10px] text-ink-muted font-sans font-medium ml-2 tracking-normal uppercase">
                        {car.priceFeesIncluded ? "Inc. fees" : "Exc. fees"}
                      </span>
                    </>
                  ) : (
                    "Call for details"
                  )}
                </dd>
              </div>
            </dl>
          </div>

          {/* Title + about + form rail */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand mb-2">
                {car.year}
              </p>
              <h1 className="font-display text-3xl sm:text-4xl uppercase tracking-wide text-ink leading-tight">
                {car.make} {car.model}
              </h1>
            </div>

            {car.advertisement && (
              <div className="border border-border bg-white p-5 relative">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-muted">
                    About this vehicle
                  </p>
                  <button
                    type="button"
                    onClick={copyAdvertisement}
                    className="shrink-0 w-8 h-8 border border-border flex items-center justify-center text-ink-muted hover:text-brand hover:border-brand transition-colors"
                    aria-label={copied ? "Copied" : "Copy listing text"}
                  >
                    <i className={`fas ${copied ? "fa-check" : "fa-copy"} text-xs`} />
                  </button>
                </div>
                <p className="text-sm text-ink-muted leading-relaxed whitespace-pre-line">
                  {car.advertisement}
                </p>
              </div>
            )}

            <VehicleEnquiryForm car={car} />
          </div>
        </div>
      </div>

      {lightboxOpen && hasImages && (
        <div
          className="fixed inset-0 z-[120] bg-ink/95 flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label="Photo gallery"
        >
          <div className="flex items-center justify-between px-4 sm:px-8 py-4 text-white">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
              {activeIndex + 1} / {photos.length}
            </p>
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="w-10 h-10 border border-white/20 hover:border-brand hover:text-brand flex items-center justify-center transition-colors"
              aria-label="Close gallery"
            >
              <i className="fas fa-times" />
            </button>
          </div>

          <div
            className="relative flex-1 flex items-center justify-center px-4 sm:px-16 pb-6 touch-pan-y"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {photos.length > 1 && (
              <button
                type="button"
                data-gallery-arrow="prev"
                onClick={(e) => onArrowClick(e, "prev")}
                className="absolute left-2 sm:left-6 z-20 w-11 h-11 border border-white/20 hover:border-brand text-white flex items-center justify-center transition-colors"
                aria-label="Previous photo"
              >
                <i className="fas fa-chevron-left pointer-events-none" />
              </button>
            )}

            <img
              key={`lb-${photos[activeIndex]}`}
              src={photos[activeIndex]}
              alt={`${car.year} ${car.make} ${car.model}`}
              className="max-h-full max-w-full object-contain select-none"
              draggable={false}
            />

            {photos.length > 1 && (
              <button
                type="button"
                data-gallery-arrow="next"
                onClick={(e) => onArrowClick(e, "next")}
                className="absolute right-2 sm:right-6 z-20 w-11 h-11 border border-white/20 hover:border-brand text-white flex items-center justify-center transition-colors"
                aria-label="Next photo"
              >
                <i className="fas fa-chevron-right pointer-events-none" />
              </button>
            )}
          </div>

          {photos.length > 1 && (
            <div className="flex gap-2 justify-center overflow-x-auto px-4 pb-6 scroll-smooth">
              {photos.map((src, i) => (
                <button
                  key={`lb-${src}-${i}`}
                  ref={i === activeIndex ? lightboxThumbRef : undefined}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  className={`shrink-0 w-14 h-14 overflow-hidden border-2 transition-all ${
                    i === activeIndex
                      ? "border-brand"
                      : "border-transparent opacity-50 hover:opacity-100"
                  }`}
                  aria-label={`Go to photo ${i + 1}`}
                >
                  <img
                    src={src}
                    alt=""
                    className="w-full h-full object-cover pointer-events-none"
                    draggable={false}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <Footer />
    </div>
  );
}
