# B2Brain — programmatic event landing pages

Next.js 16 frontend + embedded Sanity Studio. One Sanity document renders one
event landing page, pixel-for-pixel identical to `preview-v2.html`.

Built for scale: 20–40 trade-show pages a year, each ranking for
`[event name] [year]` and converting to a booked demo.

---

## Status

Built, seeded, type-checked and verified against a running production build.

| Check | Result |
|---|---|
| `tsc --noEmit` | clean |
| `next build` | clean, both event pages prerendered |
| Section order (rich event) | 16 sections, identical to the reference |
| Section order (sparse event) | 12 sections — gallery, speakers, exhibitors, reviews correctly absent |
| "On this page" strip | 13 links vs 9 — tracks the sections that actually rendered |
| Type tokens | Archivo 60/66/−1.8px w500 · Inter 16px · container 1160px |
| Border radius, every element | `0px` |
| Horizontal scroll @ 1280 / 768 / 375 | none |
| Slider · tabs · accordion · ROI calc | all working |
| ROI maths | 4×3×10 → 60 qualified → 31 meetings → $1.2M → 13.9× ✓ |
| JSON-LD | Organization · WebPage · BreadcrumbList · Event · FAQPage |
| Hardcoded user-visible strings | **zero** — audited against the rendered page |

---

## Quick start

```bash
npm install
cp .env.local.example .env.local   # fill in — see docs/DEPLOYMENT.md
npm run seed                        # loads the two reference events
npm run dev
```

| URL | What |
|---|---|
| `/events` | index |
| `/events/dreamforce-2026` | data-rich — every module populated |
| `/events/smts-2026` | data-sparse — watch sections drop out |
| `/studio` | Sanity Studio |

Open the two event pages side by side. That contrast is the whole design
argument: same template, same document type, no empty boxes either way.

---

## Documentation

| Doc | Read it when |
|---|---|
| [`docs/FIELD-MAP.md`](docs/FIELD-MAP.md) | You need to know which Sanity field feeds which pixel, and what happens when it is empty |
| [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) | Deploying to Vercel, wiring the webhook, rotating tokens |
| [`docs/EDITOR-PLAYBOOK.md`](docs/EDITOR-PLAYBOOK.md) | You are writing an event page |

---

## Layout

```
sanity/
  schemaTypes/
    documents/   event · venue · eventSeries · eventCategory · siteSettings
    objects/     hero · stats · gallery · why · agenda · speakers · exhibitors
                 audience · cost · logistics · sentiment · playbook · faq · shared
  lib/           client · fetch · image · queries (GROQ)
  structure.ts   desk structure — incl. the "Needs sourcing" queue
src/
  app/
    events/[slug]/page.tsx   the landing page (ISR, prerendered)
    events/page.tsx          index
    studio/[[...tool]]       embedded Studio
    api/revalidate           Sanity webhook -> cache-tag purge
    api/draft-mode/*         Presentation preview
    sitemap.ts robots.ts
    globals.css              ← copied VERBATIM from preview-v2.html
  components/
    EventPage.tsx            the build pipeline: render, drop nulls, build the TOC
    sections/                one file per module
  lib/                       format helpers ported 1:1 · label defaults · types
scripts/seed.mjs             the two reference events, as Sanity documents
```

---

## Everything is editable from Sanity

A new event page is filled in entirely through the Studio — no code, no deploy.
Two documents cover the whole page:

| Document | Holds | Changes per… |
|---|---|---|
| `event` | ~120 fields across 16 sections — the facts, copy, numbers, photos, FAQ | **every event** |
| `siteSettings` | 72 strings — nav, breadcrumb, footer, all 49 section labels, 13 nav labels, 10 ROI calculator labels, CTA templates | **once, globally** |

The split is the point: a new show means filling the `event` document, and the
49 section headings stay consistent across all 40 pages because nobody retypes
them. Change "Exhibitors" once in settings and every page follows.

Every label falls back to the reference-build string, so clearing a field in
Sanity degrades to the default instead of rendering a blank heading.

### Already have an events collection page?

Set `Site settings → Hero breadcrumb → Events URL` to it. This project's
`/events` index exists only so the app has a working root in development —
delete `src/app/events/page.tsx` if you don't want it. `/events/[slug]`, the
sitemap and the Similar-events cards are unaffected.

## The two ideas worth understanding

### 1. Empty data hides its slot

Ported straight from the reference build. Each section renderer returns its
markup or `null`; `EventPage.tsx` calls them, drops the nulls, and builds the
"On this page" strip from what survived.

```
empty data → no section → no nav link → no empty box
```

That is what makes a sparse regional show and a 170,000-person conference share
one document type. Editors fill what they can source and publish; the page never
looks half-finished.

### 2. Structured facts, not a rich-text blob

Every module is typed. Dates are dates, percentages are numbers, the ROI inputs
are seven named fields. That is what lets the same document simultaneously
produce the visible page, the `Event` and `FAQPage` structured data, the sitemap
entry, the "Similar events" cards on three other pages, and the `/events` index
row — with nothing retyped and nothing able to drift out of sync.

A rich-text body would have been faster to build and would have made all of that
impossible.

---

## Design contract

`src/app/globals.css` is the `<style>` block of `preview-v2.html`, copied
verbatim (minus the dev-only preview widget, which the file itself says never
ships). It is not a starting point to iterate on — it is the contract. Class
names in the components match it exactly.

The eight non-negotiables from the B2Brain design system all hold: zero border
radius everywhere, 1px black borders, one accent per section, asterisk eyebrow
on every section, Archivo ≤ weight 500 + Inter body, operator visuals rather
than stock, two button styles, no shadows or gradients.

---

## Known deviations

Four, all additive, all listed with rationale at the end of
[`docs/FIELD-MAP.md`](docs/FIELD-MAP.md). Short version: the dev-only preview
switcher is gone, site-wide copy moved into `siteSettings` with the reference
strings as defaults, the Similar-events grid narrows below three cards, and
video reviews accept an optional link and thumbnail.

One unresolved inconsistency, left alone deliberately: `SKILL.md` specifies a
1280px container and Satoshi body font; `preview-v2.html` uses 1160px and Inter.
The brief was to match the HTML, so this build uses 1160 / Inter. Two lines in
`globals.css` if you decide otherwise.

---

## Scripts

| Command | Does |
|---|---|
| `npm run dev` | Next dev server + Studio |
| `npm run build` | production build |
| `npm run seed` | write the two reference events to Sanity (needs a write token) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run typegen` | generate exact TS types from the schema + GROQ queries |

`npm run typegen` is worth running once the schema settles — it replaces the
hand-written types in `src/lib/types.ts` with generated ones, so a schema change
that breaks a component becomes a compile error instead of a blank section.

---

## Sanity project

`gwr013fi` · dataset `production` · Studio at `/studio`.

**The dataset does not serve content to anonymous requests.** Unauthenticated
GROQ queries return an empty result set rather than an error, so
`SANITY_API_READ_TOKEN` is required at runtime — without it every event page
404s in production while looking fine in the Studio. See `docs/DEPLOYMENT.md`.

**Rotate the API token before go-live.** The one used to build and seed this was
shared in plain text.
