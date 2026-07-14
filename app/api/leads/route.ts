import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface LeadRequestBody {
  firstName?: unknown;
  lastName?: unknown;
  email?: unknown;
  phone?: unknown;
  vehicleId?: unknown;
  vehicleInterest?: unknown;
  notes?: unknown;
  company?: unknown; // honeypot — must stay empty
}

function toTrimmedString(v: unknown, maxLength: number): string {
  if (typeof v !== 'string') return '';
  return v.trim().slice(0, maxLength);
}

function getApiKey(): string | null {
  return process.env.FRIDAY_API_KEY ?? null;
}

function getBaseUrl(): string {
  return (process.env.FRIDAY_API_BASE_URL ?? 'https://fridaydealer.com').replace(/\/$/, '');
}

export async function POST(request: NextRequest) {
  let raw: LeadRequestBody;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid request body.' }, { status: 400 });
  }

  const firstName = toTrimmedString(raw.firstName, 80);
  const lastName = toTrimmedString(raw.lastName, 80);
  const email = toTrimmedString(raw.email, 254);
  const phone = toTrimmedString(raw.phone, 40);
  const vehicleId = toTrimmedString(raw.vehicleId, 100);
  const vehicleInterest = toTrimmedString(raw.vehicleInterest, 200);
  const notes = toTrimmedString(raw.notes, 2000);
  const company = toTrimmedString(raw.company, 200);

  if (!firstName) {
    return NextResponse.json({ success: false, message: 'First name is required.' }, { status: 400 });
  }
  if (!email && !phone) {
    return NextResponse.json(
      { success: false, message: 'Provide an email or phone number so the dealer can respond.' },
      { status: 400 }
    );
  }

  // Honeypot — a real visitor never fills this in. Discard silently without
  // hitting the Friday API, matching Friday's own spam-handling behavior.
  if (company) {
    return NextResponse.json({ success: true }, { status: 201 });
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    console.error('[leads] FRIDAY_API_KEY is not set — cannot submit enquiry.');
    return NextResponse.json(
      { success: false, message: 'Enquiry submission is temporarily unavailable. Please call us instead.' },
      { status: 500 }
    );
  }

  const payload: Record<string, string> = { firstName };
  if (lastName) payload.lastName = lastName;
  if (email) payload.email = email;
  if (phone) payload.phone = phone;
  if (vehicleId) payload.vehicleId = vehicleId;
  if (vehicleInterest) payload.vehicleInterest = vehicleInterest;
  if (notes) payload.notes = notes;

  const url = `${getBaseUrl()}/api/public/leads`;

  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error('[leads] Network error submitting to Friday:', err);
    return NextResponse.json(
      { success: false, message: 'Network error — please try again.' },
      { status: 500 }
    );
  }

  let body: { success?: boolean; message?: string } = {};
  try {
    body = await res.json();
  } catch {
    /* Friday may return an empty body on some error responses */
  }

  if (res.ok) {
    return NextResponse.json({ success: true }, { status: 201 });
  }

  if (res.status === 429) {
    const retryAfter = res.headers.get('Retry-After');
    return NextResponse.json(
      { success: false, message: body.message ?? 'Too many requests — please try again shortly.' },
      { status: 429, headers: retryAfter ? { 'Retry-After': retryAfter } : undefined }
    );
  }

  if (res.status === 400) {
    return NextResponse.json(
      { success: false, message: body.message ?? 'Please check your details and try again.' },
      { status: 400 }
    );
  }

  if (res.status === 401) {
    console.error('[leads] 401 Unauthorized — FRIDAY_API_KEY is invalid or expired.');
  } else {
    console.error(`[leads] Friday API returned ${res.status} ${res.statusText}`);
  }

  return NextResponse.json(
    { success: false, message: 'Enquiry submission is temporarily unavailable. Please call us instead.' },
    { status: 500 }
  );
}
