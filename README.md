# KM Motor Traders

Dealership website for **KM Motor Traders** (Dandenong, VIC). Inventory and leads are powered by [Friday Dealer](https://fridaydealer.com). The site stores no vehicle data.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- Friday Dealer public API (vehicles + leads)

## Local setup

```bash
cp .env.example .env.local
# Add FRIDAY_API_KEY when ready — without it, seed inventory shows
npm install
npm run dev   # http://localhost:3002
```

Check Friday connection: http://localhost:3002/api/friday-status

## Brand (softened 60-30-10)

| Role | Token | Hex |
|---|---|---|
| 60% surface | `surface` | `#F4F3EE` |
| 30% ink | `ink` | `#111111` |
| 10% accent | `brand` | `#C9A227` (muted gold) |

## Contact

- Phone: 0410 052 424
- Address: 19 Hammond Road, Dandenong VIC 3175
- LMCT 11727
- Hours: Mon–Sat 8am–5pm · Sunday by appointment

## Deploy

Import to Vercel, set `FRIDAY_API_KEY`, redeploy. Confirm `/api/friday-status` and a test enquiry in the Friday dashboard.
