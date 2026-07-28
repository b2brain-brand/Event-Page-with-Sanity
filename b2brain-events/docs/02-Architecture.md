# B2Brain Event Pages — Architecture & Build Document

**Audience:** the client's technical team / any developer taking over the project.
**What this covers:** what was built, the stack, how the pieces fit, the data model, how rendering and caching work, and the key design decisions.

---

## 1. What this system is

A **programmatic SEO engine for event landing pages**. One CMS document produces one fully-designed, SEO-ready landing page that is a pixel match for b2brain.com's look (nav, footer, event cards, collection page, blog section). Marketing creates/edits pages in a CMS; pages publish themselves without a developer.

**Goals it was built to hit:**
- One document → one landing page.
- Exact b2brain.com visual identity, applied automatically to every page.
- Graceful degradation — any empty field simply hides its block; the layout never breaks.
- Content editable by non-developers; brand chrome locked in code so the two sites can't drift.
- Fast, cacheable, statically-rendered pages with per-page on-demand refresh on publish.

---

## 2. Technology stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | **Next.js (App Router)** | Server components, static generation (SSG) + ISR |
| Language | **TypeScript** | End-to-end typed, incl. generated Sanity types |
| CMS | **Sanity v3/v6** | Schema-as-code, hosted content lake + CDN |
| Content editor | **Sanity Studio**, embedded at `/studio` | Same deployment as the site |
| Rich text | **Portable Text** (`@portabletext/react`) | Renders the blog/article body |
| Hosting | **Vercel** | Native Git integration, auto-deploy on push |
| Media | **Sanity CDN** (`cdn.sanity.io`) | Images uploaded in Studio, resized on the fly |
| Source control | **GitHub** — `b2brain-brand/Event-Page-with-Sanity` | Root dir of the app: `b2brain-events/` |

---

## 3. Repository layout

```
b2brain-events/
├─ src/
│  ├─ app/
│  │  ├─ page.tsx                 # home (redirect/landing)
│  │  ├─ events/page.tsx          # /events collection page
│  │  ├─ events/[slug]/page.tsx   # one event landing page (SSG)
│  │  ├─ api/revalidate/route.ts  # Sanity webhook → cache purge
│  │  ├─ studio/[[...tool]]/…     # embedded Sanity Studio at /studio
│  │  ├─ sitemap.xml / robots.txt # SEO
│  │  └─ globals.css              # the full design system (verbatim brand CSS)
│  ├─ components/
│  │  ├─ Nav.tsx, Footer.tsx      # brand chrome (reads code-owned BRAND)
│  │  ├─ BrandIcons.tsx           # inline brand/answer-engine SVGs
│  │  ├─ sections/                # Article, Similar, FAQ, Hero, Stats, …
│  │  └─ events/                  # collection-page cards, filter, featured list
│  └─ lib/
│     ├─ brand.ts                 # BRAND constant — nav/footer/sidebar, real b2brain URLs
│     ├─ chrome.ts                # resolveChrome(): CMS value → else BRAND fallback
│     ├─ defaults.ts              # L()/S() helpers: CMS value → else code default
│     ├─ format.ts, types.ts      # helpers + shared TS types
│     └─ sanity client/queries    # GROQ queries + configured clients
├─ sanity/
│  ├─ schemaTypes/
│  │  ├─ documents/               # event, eventsIndexPage, siteSettings, venue,
│  │  │                           #   eventSeries, eventCategory
│  │  └─ objects/                 # article (Portable Text), keyTakeaways, etc.
│  └─ env.ts                      # projectId / dataset / apiVersion
├─ scripts/                       # one-off content/seed scripts (see §8)
└─ docs/                          # these handover documents
```

---

## 4. Data model (Sanity schema)

**Documents:**
- **`event`** — the core type; one per landing page. Holds hero, dates, venue, category/type, card fields (`cardStat`, `cardAudience`, `cardHeadline`, `cardImage`), the `article` (Portable Text blog body), FAQ, gallery, stats.
- **`eventsIndexPage`** — singleton; copy for the `/events` collection page (hero, stats strip, FAQ, CTA).
- **`siteSettings`** — singleton; global copy defaults (section eyebrows/headings/labels).
- **`venue`, `eventSeries`, `eventCategory`** — referenced lookups used inside events (and for the industry filter on `/events`).

**Objects:**
- **`article`** — Portable Text array: block styles `normal / h2 / h3 / h4 / blockquote`, bullet/number lists, marks (`strong / em / link`), inline `image` (with `alt` + `caption`), and a **`keyTakeaways`** object (the purple TL;DR panel).

The **article's Table of Contents and heading anchors are derived at render time** from the H2/H3 blocks — they are not stored fields.

---

## 5. Rendering & routing

- **`/events/[slug]`** is statically generated (`generateStaticParams` enumerates all published event slugs) and served as static HTML with **ISR** (`revalidate: 3600`, i.e. an hourly floor) plus **on-demand revalidation** on publish (see §6).
- **`/events`** (collection) is static; it lists events with a client-side **industry radio filter** and search.
- **`/studio/[[...tool]]`** hosts the Sanity Studio in the same app.
- Data is fetched with **GROQ** through the Sanity client. A read token is attached so production reads work even though the dataset isn't publicly readable.

---

## 6. Caching & the publish pipeline

Two independent flows:

**Content publish (no deploy):**
```
Editor presses Publish in Studio
        │
        ▼
Sanity fires a signed webhook  →  POST /api/revalidate
        │  (HMAC-SHA256 signature verified against SANITY_REVALIDATE_SECRET)
        ▼
route.ts calls revalidateTag() for the touched _type / slug
        │
        ▼
Only the affected page(s) are purged and re-rendered.  Live in ~60s.
```
- Webhook config in Sanity: **Filter** `_type in ["event","siteSettings","venue","eventSeries","eventCategory"]`, **Projection** `{_type, "slug": slug.current}`, **Secret** = `SANITY_REVALIDATE_SECRET`.
- The signature check is mandatory — without it anyone could force cache purges.

**Code deploy:**
```
git push origin main  →  Vercel auto-build (Root dir b2brain-events, Preset Next.js)  →  live in ~1–2 min
```

**Caching gotcha (for developers):** `next build`/`start` cache Sanity fetches under `.next`, and the Sanity CDN caches ~60s. After writing to Sanity, a *local* rebuild can still show old data. To verify locally: delete `.next`, wait ~65s, rebuild. In production, fire the webhook or wait the hourly floor.

---

## 7. Key design decisions (the "why")

1. **Brand chrome is code, not CMS.** `src/lib/brand.ts` holds the real b2brain.com nav, footer, and the article sidebar as constants pointing at the live site's URLs. `resolveChrome()` merges any CMS override on top, per-field, with the code value as fallback. **Why:** an event page's nav/footer can never drift from b2brain.com or show stale placeholder links — the failure mode we hit early when this lived in CMS.

2. **"CMS value beats code default, else code default."** Helpers `L()`/`S()` read Sanity first, fall back to `defaults.ts`. **Why:** editors can override any copy, but a blank field always yields a correct default rather than an empty page. This is the mechanism behind "empty hides its slot."

3. **Nav/footer links point at the real b2brain.com**, not internal placeholders. **Why:** until the app is served under the real domain, the chrome should still take users to the genuine pages. (See the AWS Domain doc for going fully first-party.)

4. **The design system is centralised in `globals.css`** as the verbatim brand CSS plus the added sections (article, collection cards, similar-events, sticky TOC/sidebar). **Why:** one source of truth for the look; every event inherits it automatically. No per-event styling.

5. **The blog/article is layout-generated.** TOC, scrollspy highlight, heading anchors, and the sticky promo rail are computed from the content — editors write prose, the structure is automatic.

6. **Internal event links are relative** (`/events/<slug>`) so they resolve correctly wherever the app is mounted; only outbound brand links are absolute.

---

## 8. Content/seed scripts

In `scripts/` (run with Node, using the write token in `.env.local`):

| Script | Purpose |
|---|---|
| `seed.mjs` | Seed sample events / baseline docs |
| `publish-events-page.mjs` | Populate/publish the `/events` collection singleton |
| `apply-brand.mjs` | Apply brand/global copy defaults |
| `apply-requests.mjs` | Apply a batch of specific content changes |
| `build-dreamforce-article.mjs` | Build the Dreamforce article body + images (reference example) |
| `upload-gallery.mjs` | Upload a gallery image set |

These are conveniences for bulk/initial content; day-to-day editing is done in Studio.

---

## 9. Environment variables

Set identically in **`.env.local`** (local dev) and **Vercel → Environment Variables** (production).

| Variable | Example / value | Exposure |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `gwr013fi` | public |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` | public |
| `NEXT_PUBLIC_SANITY_API_VERSION` | `2024-10-28` | public |
| `NEXT_PUBLIC_SITE_URL` | canonical origin, e.g. `https://events.b2brain.com` | public |
| `SANITY_API_READ_TOKEN` | *(secret)* — read token for live/draft queries | server only |
| `SANITY_API_WRITE_TOKEN` | *(secret)* — used only by seed scripts | server only |
| `SANITY_REVALIDATE_SECRET` | *(secret)* — shared with the Sanity webhook | server only |

- **`NEXT_PUBLIC_SITE_URL` is mandatory in production** — it drives `<link rel=canonical>`, Open Graph URLs, and the sitemap. If unset, sitemap/canonical fall back to localhost.
- **`SANITY_API_READ_TOKEN` is mandatory in production** — the dataset is not publicly readable, so without it published pages 404.
- Server-only vars must **never** be prefixed `NEXT_PUBLIC_`.

---

## 10. Vercel project settings

- **Root Directory:** `b2brain-events`
- **Framework Preset:** Next.js
- **Build:** `next build` (default)
- **Auto-deploy:** on push to `main` (native Git integration)
- **Env vars:** all seven above, in Production (and Preview if you use preview deploys).
- After adding/changing env vars, **redeploy** for them to take effect.

---

## 11. SEO characteristics

- Per-page canonical + Open Graph via `NEXT_PUBLIC_SITE_URL`.
- `sitemap.xml` and `robots.txt` generated from published events.
- Static HTML (fast, crawlable) with hourly ISR.
- When the app moves under the real domain (see AWS doc), update `NEXT_PUBLIC_SITE_URL` to the final origin so canonicals/sitemap are first-party.

---

## 12. Known follow-ups

- **Rotate the Sanity token before public launch** (shared in plaintext during the build).
- **Point the real domain at the app** — see *03 — AWS Domain Setup*. On cutover: set `NEXT_PUBLIC_SITE_URL` to the final URL, add the domain to **Sanity → API → CORS origins**, and confirm the webhook targets the new domain's `/api/revalidate`.

---

*Companion documents: **01 — Operating Guide** (content team) and **03 — AWS Domain Setup**.*
