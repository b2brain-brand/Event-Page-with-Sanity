# B2Brain — Event Landing Pages

One template. One document per event. Every show gets its own landing page,
built and published entirely from Sanity — no code, no deploy.

**Live now**

| | |
|---|---|
| Editor (Sanity Studio) | <https://project-pcxmd.vercel.app/studio> |
| Events index | <https://project-pcxmd.vercel.app/events> |
| Example — data-rich | <https://project-pcxmd.vercel.app/events/dreamforce-2026> |
| Example — data-sparse | <https://project-pcxmd.vercel.app/events/smts-2026> |
| Sanity project | `gwr013fi` · dataset `production` |

Open the two examples side by side. Same template, same document type, very
different amounts of data — and neither page has an empty box. That is the whole
design in one comparison.

---

## 1. The mental model — read this first

This is the part that confuses everyone coming from Webflow.

```
Sanity project  "Event Landing Page"  (gwr013fi)
│
└── dataset: production          ← the database. There is only one. You never pick it.
    │
    ├── 📄 Event          × many  ← ONE DOCUMENT = ONE LANDING PAGE
    ├── ⚙️  Site settings  × 1     ← shared wrapper used by EVERY page
    ├── 📍 Venue          × many  ← reusable, referenced by events
    ├── 🔁 Event series   × many  ← reusable (Dreamforce across years)
    └── 🏷️  Category       × many  ← reusable (Manufacturing, Technology…)
```

**"production" is not a place you edit.** It is the name of the database that
holds all of the above. The Studio is already pointed at it — you will never
choose it or switch it.

**The landing page lives in the `Event` document.** Everything you see on
`/events/dreamforce-2026` comes from the *Dreamforce 2026* Event document, plus
the shared labels in Site settings. Venue, Series and Category are lookup lists
that Events point at so you do not retype an address five times.

### So where do I edit what?

| I want to change… | Go to | Example |
|---|---|---|
| Anything specific to **one show** | **Events** → that event | Dreamforce's dates, attendee count, FAQ, photos, booth cost |
| A **heading or label that appears on every page** | **Site settings** → Section labels | "Who's on stage", "Cost & ROI", "Keynote" |
| The **nav, footer, breadcrumb, CTA buttons** | **Site settings** | "Book a Demo", footer columns |
| A **venue address** (affects every show there) | **Venues** | Moscone Center's street address |
| Which **vertical** a show belongs to | **Categories**, then tag the Event | "Manufacturing" |
| **Add a brand-new field** that does not exist | Code — see [docs/CHANGING-THE-SCHEMA.md](docs/CHANGING-THE-SCHEMA.md) | "Floor plan URL" |

Rule of thumb: **if the text changes from show to show it is in the Event
document; if it is the same on all 40 pages it is in Site settings.**

---

## 2. Publishing a new event page

Roughly 30–45 minutes once the venue exists. No developer, no deploy.

1. Open <https://project-pcxmd.vercel.app/studio>
2. **Events → Upcoming → + (Create new)**
3. Work left to right through the six tabs (section 3 below)
4. **Publish**

The page is live at `/events/<your-slug>` within seconds. It is automatically
added to the sitemap, to the events index, and becomes eligible to appear in
other events' "Similar events" row.

**You never touch code, and you never create a new template.** All 40 pages
render through the same one. The only thing that differs between them is the
content of their Event document.

### The one rule

**Never invent a number to fill a section.**

The template is built so a missing section costs nothing — it disappears along
with its nav link and the page still looks finished. A wrong attendee count
costs the page its credibility. Leave it blank, publish, come back with a source.

---

## 3. The Event document — complete field reference

Six tabs across the top of the editor, ordered the way the page reads.

### Tab 1 · Hero & identity

| Field | Type | Required | What it does |
|---|---|---|---|
| Event name | text | ✅ | The H1, breadcrumb, browser title, and the `{event}` token in playbook + CTA headlines. **Always include the year** — "Dreamforce 2026" |
| URL slug | slug | ✅ | Becomes `/events/<slug>`. Click *Generate* |
| Event type | dropdown | ✅ | First chip in the hero. Also the JSON-LD subtype |
| Hero sub-headline | text | ✅ | The 19px line under the H1. What the show is + how big |
| Positioning line | text | | **Not printed on the page.** Becomes the meta description when the SEO tab is blank |
| Start date / End date | date | ✅ | Hero date range, the live countdown chip, and JSON-LD |
| Venue | reference | ✅ | Pick an existing one or create it. Supplies "Location" + the full address for JSON-LD |
| Format | dropdown | | Third hero meta cell. Sets the JSON-LD attendance mode |
| Format label override | text | | Prints instead of the dropdown, e.g. "In-person + Salesforce+ broadcast" |
| Hashtag | text | | Purple chip. Include the `#`. Blank = no chip |
| Official event site | url | | JSON-LD `url` |
| Registration URL | url | | Powers the ghost "Register" button. Blank = button disappears |
| Series | reference | | Groups the show across years. Supplies the JSON-LD organiser |
| Categories | references | | Drives the index filter + automatic "Similar events" |
| **Hero video** | object | | Footage from a previous edition, beside the H1. **Leave empty and the hero becomes full-width** |
| ↳ YouTube URL | url | | Any shape — `watch?v=`, `youtu.be/`, `/embed/`, `/shorts/` |
| ↳ Custom thumbnail | image | | Optional 16:9. Blank = YouTube's own still is used |
| ↳ Thumbnail alt text | text | | Falls back to the caption |
| ↳ Card eyebrow | text | | e.g. "FROM DREAMFORCE 2025" |
| ↳ Caption | text | | One line under the video |
| ↳ Open on YouTube instead of playing inline | toggle | | Off = player loads in place. On = opens YouTube in a new tab |
| Hero primary CTA override | text | | Defaults to Site settings ("Plan your booth") |

### Tab 2 · Facts

| Field | Type | What it does |
|---|---|---|
| At-a-glance stats | list, max 4 | The bordered strip. Each = Number + Label + Qualifier. **Ship 2 or 4** — three leaves a hole at tablet width. A stat with no number is dropped |
| **Quick answer** | long text | The purple box, and **the single highest-value paragraph on the page** — this is what AI answer engines quote |

The quick answer has a formula: answer in the first sentence → dates, city,
venue → scale numbers → one line on why exhibitors care. 400–600 characters. No
marketing adjectives.

### Tab 3 · Programme

| Field | Type | What it does |
|---|---|---|
| Photos from the floor | list of images | Slider. 1 image = no arrows/dots. 0 = **section disappears** |
| Gallery footnote override | text | Defaults to Site settings |
| **Why it matters** | object | |
| ↳ Section headline | text | The H2 — a claim about pipeline density at *this* show |
| ↳ Body paragraphs | list | One entry per paragraph. 400–600 chars total |
| ↳ Pullquote | object | Text + attribution. **Blank = body goes full-width** |
| **Agenda** | object | |
| ↳ Tracks | tags | Bordered chips. Fill these first — sourceable months before the schedule |
| ↳ Days | list | Tab label + sub-label + sessions (time, title, room, track) |
| Speakers | list | Name, role, initials *(auto-derived if blank)*, keynote toggle. 4 or 8 fills the grid |
| **Exhibitors & sponsors** | object | |
| ↳ Sponsor tiers | list | Tier name + company names as text |
| ↳ Which booths to map first | text | Your POV on the exhibitor list. Quoted for "who exhibits at [event]" |

**Agenda half-data case:** tracks known but schedule not published? Fill only
tracks. The section renders with a "being confirmed" note automatically.

### Tab 4 · Audience & cost

| Field | Type | What it does |
|---|---|---|
| **Who attends** | object | |
| ↳ Attendee title mix | list | Job family + % — drives the purple bars. Should total ~100 |
| ↳ Industries | tags | Bordered chips |
| ↳ Is your buyer here? | text | **Must say who this show is NOT for.** That sentence does more for trust than the rest of the page |
| **Cost & ROI** | object | |
| ↳ Booth cost paragraph | text | A real range + what it excludes. Wins "how much does it cost to exhibit at [event]" |
| ↳ Calculator defaults | 7 numbers | Booth investment · reps · show days · conversations per rep per day · qualified rate % · **meeting rate % (this is the LTM number)** · average ACV. **Remove and the whole section disappears** |
| **Logistics** | object | |
| ↳ Cells | list | Heading + paragraph **or** bullet list. Ship 2 or 4 |
| ↳ Passes & pricing | list | Name + what it includes + price *(text, so "Varies" works)* |

The calculator numbers are only *starting values* — visitors change them in the
browser. The maths: `reps × days × conversations` → `× qualified%` →
`× meeting%` → `× ACV` = modeled pipeline, shown against your spend.

### Tab 5 · Proof & FAQ

| Field | Type | What it does |
|---|---|---|
| **What people say** | object | |
| ↳ Video | list | Title + source line + optional link/thumbnail |
| ↳ Reddit | list | Quote + subreddit + tone. **Always publish at least one "Mixed"** — an all-positive block reads as marketing |
| ↳ Testimonials | list | Quote + attribution from past exhibitors |
| **How to win at this event** | object | Three motions: Pre-event (purple) · On the floor (orange) · Post-event (green). **Fill all three or none** |
| Similar events | references, max 3 | Cards pull their own name/dates/city. Leave blank and it auto-fills from the same category |
| Auto-fill similar events | toggle | On by default |
| **FAQ** | list | 5–7 pairs. Emitted as both the accordion **and** FAQPage structured data |
| Closing CTA headline override | text | Defaults to the Site settings template |
| Closing CTA eyebrow override | text | Normally the live countdown |

The five FAQs that earn their place on every event page, in this order:
1. When and where is [event]? 2. Who attends? 3. How much does it cost to
exhibit? 4. Does it provide lead retrieval? 5. How should an exhibitor prepare?

Answers must be **self-contained** — "see above" is worthless to a crawler.

### Tab 6 · SEO & page meta

| Field | Type | What it does |
|---|---|---|
| Meta title | text | 50–60 chars. Falls back to "[name] — B2Brain — The Event Meeting Platform" |
| Meta description | text | 140–160 chars. Falls back to Positioning line → Quick answer → Hero sub-headline |
| Share image | image | 1200×630. Falls back to the site default |
| Canonical URL override | url | Leave blank — the template writes the correct self-canonical |
| Hide from search engines | toggle | Adds `noindex` and drops the page from the sitemap. Use for half-sourced pages |
| **Last updated** | date | ✅ Footer stamp + `dateModified` + sitemap. **Bump every time you re-verify numbers** |
| **Sources** | list | Where the numbers came from. Printed in the footer. Every number should trace to one |
| First published | datetime | `datePublished`. Set once |
| Feature on the events index | toggle | |

---

## 4. Site settings — the shared wrapper

**One document, used by every page.** Change a heading here and all 40 pages
follow. Everything has a sensible default already filled in.

| Group | Holds |
|---|---|
| **Nav, TOC & footer** | Logo wordmark · nav links · log-in · nav button · **hero breadcrumb (incl. where "Events" points)** · sticky sub-nav label + button · footer blurb, columns, copyright, legal |
| **Section labels** | All 49 headings and eyebrows — "Who's on stage", "Cost & ROI", "Keynote", the playbook step prefix, the footer stamp wording, the gallery placeholder |
| **"On this page" labels** | The 13 sticky sub-nav words |
| **ROI calculator labels** | The 7 input + 3 output labels |
| **CTAs & ROI copy** | Hero CTA labels · closing CTA templates · **industry LTM average (8%)** · the LTM comparison sentence |
| **Organisation & defaults** | Canonical site URL · org name, logo, social URLs · default share image |

Templates use `{event}` for the event name — e.g. *"Walk into {event} with a
target list — and out with meetings booked."*

The ROI sentence also takes `{ltm}` and `{avg}`, and `**double asterisks**` make
text bold.

> **Clearing a label is safe.** Every one falls back to its built-in default, so
> you cannot produce a blank heading by emptying a field.

---

## 5. Supporting documents

| Document | Fill in | Why it is separate |
|---|---|---|
| **Venue** | Name, "City, ST", street address, postal code, country, coordinates | Reused across shows. Typed once, every Event JSON-LD gets a complete address — which is what answers "where is [event] held" |
| **Event series** | Series name, organiser name + URL | Groups Dreamforce 2026/2027. Carries the organiser for JSON-LD, and lets last year's page point at this year's |
| **Category** | Title, slug, description | Filters the index, powers automatic "Similar events", gives the footer's Events column real destinations |

Only Name, City and the slug are required on a Venue. The rest improves
structured data.

---

## 6. How the template adapts

The core promise, inherited from the original design:

```
empty data → no section → no nav link → no empty box
```

Verified in production:

| | Dreamforce 2026 | SE Manufacturing Tech Show |
|---|---|---|
| Sections rendered | 16 | 12 |
| "On this page" links | 13 | 9 |
| Hero | 2-column with operator card | full-width, no card |
| Photos · Speakers · Exhibitors · Reviews | present | **section removed entirely** |
| Why it matters | 2-col with pullquote | full-width, no quote |
| Agenda | 3 day tabs + tracks | tracks + "being confirmed" note |

Fill what you can source. The page never looks half-finished.

---

## 7. Search & AI visibility

Every page emits five structured-data blocks automatically:

`Organization` · `WebPage` · `BreadcrumbList` · `Event` · `FAQPage`

The `Event` block carries dates, venue address + coordinates, organiser, pass
prices as offers, and speakers as performers. That is what makes the page
eligible for Google's event rich result and gives AI answer engines a
machine-readable "when and where".

Also automatic: sitemap (excludes `noindex`, ranks upcoming shows higher),
`robots.txt`, canonical tags, OpenGraph and Twitter cards.

**Rule: nothing goes into structured data that is not also visible on the page.**

---

## 8. Running it locally

```bash
cd b2brain-events
npm install
cp .env.local.example .env.local     # fill in — see docs/DEPLOYMENT.md
npm run dev
```

→ <http://localhost:3000/events> and <http://localhost:3000/studio>

`npm run seed` reloads the two example events. **It overwrites Site settings**,
so do not run it after you have customised them.

| Command | Does |
|---|---|
| `npm run dev` | Dev server + Studio |
| `npm run build` | Production build |
| `npm run lint` | Next.js Core Web Vitals + TypeScript lint checks |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run seed` | Write the two example events |
| `npm run upload:gallery <slug> <folder>` | Attach local photos to an event's gallery, filename order |
| `npm run typegen` | Generate exact TS types from the schema |

---

## 9. Deployment

Hosted on Vercel from `b2brain-brand/Event-Page-with-Sanity`. Two settings that
must be right, both of which caused failed builds during setup:

| Setting | Value |
|---|---|
| **Root Directory** | `b2brain-events` ← the app is not at the repo root |
| **Framework Preset** | `Next.js` ← anything else looks for a `dist/` folder |

Environment variables:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `gwr013fi` |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | `2024-10-28` |
| `NEXT_PUBLIC_SITE_URL` | production origin, **no trailing slash** |
| `SANITY_API_READ_TOKEN` | Viewer token — **not optional**, see below |
| `SANITY_REVALIDATE_SECRET` | any long random string, must match the webhook |

> The dataset does not serve content to anonymous requests. Without a valid read
> token every event page 404s in production while looking perfect in the Studio.

Full walkthrough incl. the Sanity webhook: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

---

## 10. Troubleshooting

| Symptom | Cause |
|---|---|
| `/studio` loads but shows no content | The domain is not in Sanity's CORS list. sanity.io/manage → API → CORS origins → add it, **Allow credentials ticked** |
| Event pages 404 in production, fine locally | `SANITY_API_READ_TOKEN` missing, wrong, or rotated |
| Published in Sanity, site unchanged | Webhook missing or misconfigured. Check its **Delivery log**. The filter must use `in`, not `=` |
| Build fails: *No Output Directory named "dist"* | Framework Preset is not Next.js |
| Build fails: *no package.json* | Root Directory is not `b2brain-events` |
| Sitemap full of `localhost` URLs | `NEXT_PUBLIC_SITE_URL` not set — then **redeploy**, env changes do not apply retroactively |
| Field saves in Studio but never shows on the page | It was added to the schema but not to the GROQ query. See [docs/CHANGING-THE-SCHEMA.md](docs/CHANGING-THE-SCHEMA.md) |
| Studio edit not visible on `npm run dev` | Cached. Dev caching is off by default now; if it persists, delete `.next` |

---

## 11. Documentation

| Doc | Read when |
|---|---|
| [docs/EDITOR-PLAYBOOK.md](docs/EDITOR-PLAYBOOK.md) | You are writing an event page — tab-by-tab timings, voice rules, pre-publish checklist |
| [docs/FIELD-MAP.md](docs/FIELD-MAP.md) | You need to know which field feeds which pixel, and what happens when it is empty |
| [docs/CHANGING-THE-SCHEMA.md](docs/CHANGING-THE-SCHEMA.md) | You want to add or remove a field |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Vercel, webhook, CORS, tokens, custom domain |

---

## 12. Repo layout

```
b2brain-events/
├── sanity/
│   ├── schemaTypes/
│   │   ├── documents/   event · venue · eventSeries · eventCategory · siteSettings
│   │   └── objects/     the 16 page modules
│   ├── lib/             client · fetch · image · queries (GROQ)
│   └── structure.ts     Studio menu, incl. the "Needs sourcing" queue
├── src/
│   ├── app/
│   │   ├── events/[slug]/page.tsx   the landing page
│   │   ├── studio/[[...tool]]/      embedded Studio
│   │   ├── api/revalidate/          Sanity webhook → cache purge
│   │   └── globals.css              ← the design contract, do not restyle
│   ├── components/
│   │   ├── EventPage.tsx            renders modules, drops nulls, builds the TOC
│   │   └── sections/                one file per module
│   └── lib/                         formatters · label defaults · types
├── scripts/seed.mjs
└── docs/
```

`src/app/globals.css` is the original design's stylesheet copied verbatim. It is
not a starting point to iterate on — it is the contract. Zero border-radius, 1px
black borders, one accent per section, asterisk eyebrow on every section,
Archivo ≤ weight 500 + Inter body.

---

## 13. Production notes

**Studio access** — add teammates at sanity.io/manage → **Members**. Editors do
not need a GitHub or Vercel account.

**The "Needs sourcing" queue** — Studio → Events → *Needs sourcing* lists
anything still `noindex`, missing a quick answer, under three FAQs, or with no
sources. That is your production backlog.

**After a show closes** the page changes job rather than dying: bump *Last
updated*, swap in photos from that edition, add testimonials you collected, and
when next year's edition is announced add it to *Similar events* so the ranking
page hands traffic forward. The countdown chip flips to "Past event · recap" on
its own.

**Roll-out cadence** — do not ship 40 pages at once. Three pilot pages, then
five, then eight. Stop once you have covered the shows your ICP actually
attends; pages for shows your buyers skip will not rank and they dilute the
topical authority of the ones that do.
