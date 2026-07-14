import { InventoryCar, ListingStatus, StockStatus } from '../types';
import { SaasVehicleRaw } from './saasInventoryClient';

/**
 * Mapper for Friday Dealer (fridaydealer.com.au) API response shape:
 *
 * {
 *   id, make, model, year, color, bodyType, fuelType,
 *   transmission, odometer, condition, displayPrice,
 *   displayPriceDriveAway, stockNumber, advertisement,
 *   status ("AVAILABLE" | "SOLD" | ...), websiteListingMode ("LIVE" | "COMING_SOON" | "OFF"),
 *   complianceYear, createdAt, images: []
 * }
 */

const PLACEHOLDER_IMAGE = '/logo.png';

function toStr(v: unknown): string {
  return v != null ? String(v) : '';
}

function toNum(v: unknown): number {
  const n = Number(v);
  return isNaN(n) ? 0 : n;
}

function normalizeStatus(value: unknown): string {
  return toStr(value).toUpperCase().replace(/[\s-]+/g, '_');
}

function mapStatus(raw: SaasVehicleRaw): StockStatus {
  const listingMode = normalizeStatus(raw.websiteListingMode);
  if (listingMode === 'COMING_SOON') return 'upcoming';

  const s = normalizeStatus(raw.status);
  if (s === 'UPCOMING' || s === 'COMING_SOON' || s === 'RESERVED' || s === 'PRESALE') {
    return 'upcoming';
  }
  return 'inventory';
}

function mapListingStatus(raw: SaasVehicleRaw): ListingStatus {
  const listingMode = normalizeStatus(raw.websiteListingMode);
  if (listingMode === 'COMING_SOON') return 'pending';

  const s = normalizeStatus(raw.status);
  if (s === 'SOLD') return 'sold';
  if (
    s === 'PENDING' ||
    s === 'RESERVED' ||
    s === 'ON_HOLD' ||
    s === 'UNDER_OFFER' ||
    s === 'DEPOSIT' ||
    s === 'UPCOMING' ||
    s === 'COMING_SOON' ||
    s === 'PRESALE'
  ) {
    return 'pending';
  }
  return 'available';
}

function mapTransmission(v: unknown): 'Automatic' | 'Manual' {
  const s = toStr(v).toLowerCase();
  if (s.includes('manual') || s === 'm') return 'Manual';
  return 'Automatic';
}

function mapPriceFeesIncluded(raw: SaasVehicleRaw): boolean {
  const v = toStr(raw.displayPriceDriveAway).toUpperCase();
  return v === 'INCLUDED' || v === 'INCLUDE' || v === 'YES' || v === 'TRUE';
}

const MAX_IMAGES = 20;

function extractImageUrl(item: unknown): string {
  if (typeof item === 'string') return item.trim();
  if (typeof item === 'object' && item !== null) {
    const obj = item as Record<string, unknown>;
    return toStr(obj.url ?? obj.src ?? obj.path ?? obj.image ?? '').trim();
  }
  return '';
}

/** Map up to 20 listing photo URLs from the Friday API `images` array. */
function mapImages(raw: SaasVehicleRaw): string[] {
  const imgs = raw.images;
  if (!Array.isArray(imgs) || imgs.length === 0) return [];

  const urls: string[] = [];
  for (const item of imgs) {
    if (urls.length >= MAX_IMAGES) break;
    const url = extractImageUrl(item);
    if (url && !urls.includes(url)) urls.push(url);
  }
  return urls;
}

export function mapSaasVehicle(raw: SaasVehicleRaw, index: number): InventoryCar {
  const id = toStr(raw.id ?? raw.stockNumber ?? `saas-${index}`);
  const year = toNum(raw.year);
  const make = toStr(raw.make);
  const model = toStr(raw.model);
  const images = mapImages(raw);
  const image = images[0] ?? PLACEHOLDER_IMAGE;
  const mileage = toNum(raw.odometer);
  const transmission = mapTransmission(raw.transmission);

  // displayPrice may be null (price not set yet); fall back to 0
  const price = toNum(raw.displayPrice ?? raw.price ?? 0);
  const priceFeesIncluded = mapPriceFeesIncluded(raw);

  const status = mapStatus(raw);
  const listingStatus = mapListingStatus(raw);

  // Friday Dealer API has no featured flag — getFeaturedCars() falls back
  // to first N inventory cars automatically.
  const featured = false;

  return { id, year, make, model, image, images, mileage, transmission, price, priceFeesIncluded, status, listingStatus, featured,
    color: toStr(raw.color) || undefined,
    bodyType: toStr(raw.bodyType) || undefined,
    fuelType: toStr(raw.fuelType) || undefined,
    complianceYear: toStr(raw.complianceYear) || undefined,
    stockNumber: toStr(raw.stockNumber) || undefined,
    advertisement: toStr(raw.advertisement) || undefined,
  };
}
