import React from "react";
import Link from "next/link";
import { InventoryCar, ListingStatus } from "../types";

const STATUS: Record<ListingStatus, { label: string; className: string }> = {
  available: { label: "Available", className: "bg-emerald-700 text-white" },
  pending: { label: "Pending", className: "bg-amber-500 text-ink" },
  sold: { label: "Sold", className: "bg-ink-muted text-white" },
};

interface Props {
  car: InventoryCar;
  upcoming?: boolean;
  index?: number;
}

const InventoryCarCard: React.FC<Props> = ({ car, upcoming = false, index = 0 }) => {
  const isUpcoming = upcoming || car.status === "upcoming";
  const badge = STATUS[car.listingStatus];

  return (
    <Link
      href={`/inventory/${car.id}`}
      className="group flex flex-col border border-border bg-white reveal hover:border-ink/30 transition-colors"
      style={{ transitionDelay: `${index * 0.06}s` }}
    >
      <div
        className={`relative aspect-[16/10] overflow-hidden ${
          isUpcoming || car.image === "/logo.png" ? "bg-ink" : "bg-surface-2"
        }`}
      >
        {!isUpcoming &&
          (car.image === "/logo.png" ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-white/35 text-[10px] font-semibold uppercase tracking-[0.3em]">
                Photos Coming Soon
              </p>
            </div>
          ) : (
            <img
              src={car.image}
              alt={`${car.year} ${car.make} ${car.model}`}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
            />
          ))}

        {isUpcoming ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display tracking-[0.25em] uppercase text-xs text-white border border-white/30 px-5 py-2.5">
              Coming Soon
            </span>
          </div>
        ) : (
          <span
            className={`absolute top-3 left-3 text-[9px] font-bold uppercase tracking-[0.16em] px-2.5 py-1 rounded-sm ${badge.className}`}
          >
            {badge.label}
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand mb-1">
            {car.year}
          </p>
          <h3 className="font-display text-xl uppercase tracking-wide text-ink leading-tight">
            {car.make} {car.model}
          </h3>
        </div>

        <p className="text-xs text-ink-muted font-medium">
          {car.mileage.toLocaleString()} km
          <span className="mx-2 text-border">·</span>
          {car.transmission}
          {car.fuelType ? (
            <>
              <span className="mx-2 text-border">·</span>
              {car.fuelType}
            </>
          ) : null}
        </p>

        <div className="mt-auto pt-4 border-t border-border flex items-center justify-between gap-3">
          <div className="min-w-0">
            {!isUpcoming && car.price > 0 ? (
              <p className="font-display text-xl tracking-wide text-ink leading-none">
                <span className="text-brand">$</span>
                {car.price.toLocaleString()}
                <span className="ml-2 text-[10px] font-sans font-medium uppercase tracking-[0.14em] text-ink-muted align-middle">
                  {car.priceFeesIncluded ? "Inc. fees" : "Exc. fees"}
                </span>
              </p>
            ) : !isUpcoming ? (
              <span className="text-[10px] uppercase tracking-[0.14em] text-ink-muted">
                Call for details
              </span>
            ) : null}
          </div>
          <span className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink group-hover:text-brand transition-colors">
            Inspect →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default InventoryCarCard;
