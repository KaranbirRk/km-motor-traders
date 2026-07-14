/**
 * Server-only module — never import from client components.
 * Fetches raw vehicle data from the Friday Dealer public API.
 *
 * Required env var : FRIDAY_API_KEY
 * Optional env var : FRIDAY_API_BASE_URL (defaults to https://fridaydealer.com.au)
 */

export interface SaasVehicleRaw {
  [key: string]: unknown;
}

const ENDPOINT = '/api/public/vehicles';
const PAGE_SIZE = 50;
const MAX_PAGES = 20; // safety cap — 1 000 vehicles max

function getApiKey(): string {
  const key = process.env.FRIDAY_API_KEY;
  if (!key) {
    throw new Error(
      '[friday] FRIDAY_API_KEY is not set. ' +
        'Copy .env.example to .env.local and paste your key.'
    );
  }
  return key;
}

function getBaseUrl(): string {
  return (process.env.FRIDAY_API_BASE_URL ?? 'https://fridaydealer.com').replace(/\/$/, '');
}

function extractVehicles(body: unknown): SaasVehicleRaw[] {
  if (Array.isArray(body)) return body as SaasVehicleRaw[];
  if (body && typeof body === 'object') {
    const obj = body as Record<string, unknown>;
    if (Array.isArray(obj.data)) return obj.data as SaasVehicleRaw[];
    if (Array.isArray(obj.vehicles)) return obj.vehicles as SaasVehicleRaw[];
    const firstArray = Object.values(obj).find(Array.isArray);
    if (firstArray) return firstArray as SaasVehicleRaw[];
  }
  console.warn('[friday] Unexpected response shape:', JSON.stringify(body).slice(0, 200));
  return [];
}

type FridayStock = 'live' | 'upcoming';

async function fetchPage(
  apiKey: string,
  baseUrl: string,
  page: number,
  stock: FridayStock
): Promise<SaasVehicleRaw[]> {
  const stockParam = stock === 'upcoming' ? '&stock=upcoming' : '';
  const url = `${baseUrl}${ENDPOINT}?page=${page}&pageSize=${PAGE_SIZE}${stockParam}`;

  let res: Response;
  try {
    res = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}`, Accept: 'application/json' },
      next: { revalidate: 60 },
    });
  } catch (err) {
    throw new Error(`[friday] Network error on page ${page}: ${err}`);
  }

  if (res.status === 401) {
    throw new Error(
      '[friday] 401 Unauthorized — FRIDAY_API_KEY is invalid or expired. Check your Vercel environment variables.'
    );
  }
  if (res.status === 429) {
    throw new Error(
      '[friday] 429 Rate limit — Friday Dealer allows max 60 requests/min. Try increasing FRIDAY_REVALIDATE_SECONDS.'
    );
  }
  if (!res.ok) {
    throw new Error(`[friday] API returned ${res.status} ${res.statusText} for ${url}`);
  }

  const body: unknown = await res.json();
  return extractVehicles(body);
}

async function fetchAllPages(
  apiKey: string,
  baseUrl: string,
  stock: FridayStock
): Promise<SaasVehicleRaw[]> {
  const all: SaasVehicleRaw[] = [];

  for (let page = 1; page <= MAX_PAGES; page++) {
    const vehicles = await fetchPage(apiKey, baseUrl, page, stock);
    all.push(...vehicles);
    if (vehicles.length < PAGE_SIZE) break;
  }

  return all;
}

/**
 * Fetch ALL vehicles from the Friday Dealer API, paginating automatically.
 * Fetches both Live inventory and Coming Soon (upcoming) stock — the Friday
 * API serves these from separate listing modes, so we request both and merge.
 * Stops when a page returns fewer results than PAGE_SIZE.
 */
export async function fetchFridayInventory(): Promise<SaasVehicleRaw[]> {
  const apiKey = getApiKey();
  const baseUrl = getBaseUrl();

  const [live, upcoming] = await Promise.all([
    fetchAllPages(apiKey, baseUrl, 'live'),
    fetchAllPages(apiKey, baseUrl, 'upcoming'),
  ]);

  return [...live, ...upcoming];
}
