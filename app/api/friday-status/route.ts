import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const apiKey = process.env.FRIDAY_API_KEY;
  const baseUrl = (process.env.FRIDAY_API_BASE_URL ?? 'https://fridaydealer.com').replace(/\/$/, '');
  const url = `${baseUrl}/api/public/vehicles?page=1&pageSize=1`;

  if (!apiKey) {
    return NextResponse.json(
      { ok: false, error: 'FRIDAY_API_KEY is not set in environment variables', url: null },
      { status: 200 }
    );
  }

  const keyDebug = { length: apiKey.length, prefix: apiKey.slice(0, 6), hasTrimSpace: apiKey !== apiKey.trim() };

  let res: Response;
  try {
    res = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}`, Accept: 'application/json' },
      cache: 'no-store',
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: `Network error: ${err}`, url },
      { status: 200 }
    );
  }

  if (res.status === 401) {
    let detail = '';
    try { detail = await res.text(); } catch { /* ignore */ }
    return NextResponse.json(
      { ok: false, error: '401 Unauthorized — FRIDAY_API_KEY is invalid or expired', detail, url, keyDebug },
      { status: 200 }
    );
  }
  if (res.status === 429) {
    return NextResponse.json(
      { ok: false, error: '429 Rate limit — try again in a minute', url },
      { status: 200 }
    );
  }
  if (!res.ok) {
    return NextResponse.json(
      { ok: false, error: `API returned ${res.status} ${res.statusText}`, url },
      { status: 200 }
    );
  }

  let body: unknown;
  try {
    body = await res.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: 'API response was not valid JSON', url },
      { status: 200 }
    );
  }

  // Count total vehicles by fetching first page and checking for pagination metadata
  let vehicleCount: number | null = null;
  if (body && typeof body === 'object') {
    const obj = body as Record<string, unknown>;
    if (typeof obj.total === 'number') vehicleCount = obj.total;
    else if (typeof obj.totalCount === 'number') vehicleCount = obj.totalCount;
    else if (Array.isArray(obj.data)) vehicleCount = (obj.data as unknown[]).length;
    else if (Array.isArray(body)) vehicleCount = (body as unknown[]).length;
  }

  return NextResponse.json({ ok: true, vehicleCount, url });
}
