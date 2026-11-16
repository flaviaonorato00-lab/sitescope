# SiteScope

Check the performance, accessibility, SEO and best practices of any public website. Paste an address, get Lighthouse scores in about 10 seconds. No sign-up needed.

**Live demo:** [sitescope-zeta.vercel.app](https://sitescope-zeta.vercel.app)

## Features

- Analyze any public website on **mobile** or **desktop** using the Google PageSpeed Insights API
- Four scores (performance, accessibility, SEO, best practices) with green / orange / red colors
- Every analysis is saved, and each site has a history page with all its past results
- Results from the last hour are reused (cache), so repeated requests are instant and do not use the API quota
- No login: anyone can use it

## Tech stack

- **Next.js 16** (App Router, Route Handlers) and **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **PostgreSQL** (Neon) with **Prisma 7**
- **Vitest** for unit tests
- Deployed on **Vercel**

## How it works

```
Form (React)  →  POST /api/analyze  →  validate URL  →  recent result in database?
                                                          ├─ yes → return it (cached)
                                                          └─ no  → Google PageSpeed API → save → return scores
```

- `lib/url.ts` cleans the address (adds `https://`, removes `www.`, trailing slashes and tracking parameters) and **rejects** local and private addresses (`localhost`, `192.168.x.x`, `.local`, ...) so the server cannot be used to reach internal networks.
- `lib/pagespeed.ts` calls the Google API and returns the four scores.
- `app/api/analyze/route.ts` connects everything and talks to the database.
- `prisma/schema.prisma` defines two tables: `Site` and `Audit` (one site has many audits).

### API

`POST /api/analyze`

```json
{ "url": "example.com", "strategy": "mobile" }
```

`strategy` is optional (`"mobile"` by default, or `"desktop"`). Response:

```json
{
  "siteId": "…",
  "auditId": "…",
  "url": "https://example.com",
  "strategy": "mobile",
  "cached": false,
  "scores": { "performance": 100, "accessibility": 96, "seo": 80, "bestPractices": 100 }
}
```

Errors return `{ "error": "…" }` with status `400` (invalid input) or `502` (Google could not analyze the site).

## Run locally

You need Node.js, a PostgreSQL database (for example a free one on [Neon](https://neon.tech)) and a free [PageSpeed Insights API key](https://developers.google.com/speed/docs/insights/v5/get-started).

```bash
git clone https://github.com/flaviaonorato00-lab/sitescope.git
cd sitescope
npm install
```

Create a `.env` file:

```
DATABASE_URL=your-postgres-connection-string
PAGESPEED_API_KEY=your-google-api-key
```

Create the tables and start the app:

```bash
npx prisma migrate deploy
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tests

```bash
npm test
```

The URL validation and normalization (`lib/url.ts`) is covered by unit tests.

## Ideas for improvement

- Rate limiting per IP
- Scheduled re-analysis of saved sites, to show trends over time
- Tests for the API route and an end-to-end test of the form
