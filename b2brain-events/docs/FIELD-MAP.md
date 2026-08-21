# Field map — `preview-v2.html` → Sanity

Every slot in the reference build, the Sanity field that feeds it, and what
happens when that field is empty. This is the analysis the schema was built
from; use it as the review checklist when the design changes.

Reference source: `../../preview-v2.html` (the `window.EVENTS[slug]` object plus
the `mX()` renderers).

---

## How to read the "when empty" column

The reference build's core promise is **empty data hides its slot**. Three levels:

| Level | Effect |
|---|---|
| **field** | That one element disappears; the section stays |
| **layout** | The section re-flows to a different layout (e.g. 2-col → 1-col) |
| **section** | The whole `<section>` AND its "On this page" link disappear |

---

## 1 · Site-wide chrome — `siteSettings` (singleton)

Everything below was **hardcoded in the reference HTML**. On a 40-page
programmatic set that is a liability, so it moved into one document. The
`initialValue` of every field is the exact reference string, so an untouched
settings document renders the page identically.

**Audited against the rendered page: there is no user-visible string left in the
code.** Every word on an event page comes from either the `event` document
(event-specific) or `siteSettings` (global).

| Rendered element | Sanity field | Notes |
|---|---|---|
| Logo wordmark (nav + footer) | `logoText` | |
| Nav links | `navLinks[] {label, href, isCurrent}` | `isCurrent` renders full-black instead of 70% |
| Nav "Log In" | `navLoginLabel` / `navLoginHref` | |
| Nav button | `navCtaLabel` / `navCtaHref` | defaults to `#cta` |
| Hero breadcrumb | `breadcrumb {homeLabel, homeHref, eventsLabel, eventsHref}` | **Point `eventsHref` at your existing events collection page** — it does not have to live in this project. Also drives the BreadcrumbList JSON-LD. |
| Hero meta row labels | `labels.heroMetaDates` / `heroMetaLocation` / `heroMetaFormat` | "Dates" · "Location" · "Format" |
| Keynote chip | `labels.speakerKeynoteChip` | |
| Playbook step prefix | `labels.playbookMotionPrefix` | `{n}` → 1/2/3 |
| Gallery empty-slide text | `labels.galleryPlaceholder` | `{n}` → slide number |
| Footer stamp prefixes | `labels.footerStampPrefix` / `footerSourcesPrefix` | |
| ROI calculator — 7 input labels | `roiLabels.{spend, reps, days, convos, qualRate, meetingRate, acv}` | |
| ROI calculator — 3 output labels | `roiLabels.{outQualified, outMeetings, outPipeline}` | `outPipeline` takes `{x}` for the return multiple |
| Sticky sub-nav label | `tocLabel` | "On this page" |
| Sticky sub-nav button | `tocCtaLabel` | "Plan your booth" |
| "On this page" link words | `tocLabels.{overview,gallery,why,…}` | 13 keys, one per section |
| Every section eyebrow + H2 | `labels.*` | 35 keys — see below |
| Footer blurb | `footerBlurb` | |
| Footer columns | `footerColumns[] {heading, links[]}` | 3 columns |
| Footer legal / copyright | `footerLegal` / `footerCopyright` | |
| Hero CTA labels | `heroPrimaryCtaLabel` / `heroSecondaryCtaLabel` | per-event override exists for the primary |
| Closing CTA | `ctaHeadlineTemplate`, `ctaPrimaryLabel/Href`, `ctaSecondaryLabelTemplate/Href`, `ctaFallbackEyebrow` | `{event}` token |
| ROI comparison sentence | `roiLtmCopy`, `roiIndustryAverage` | `{ltm}` `{avg}` tokens, `**bold**` markers |
| Canonical origin, org name, logo, `sameAs`, default OG image | `siteUrl`, `organization*`, `defaultOgImage` | JSON-LD + metadata |

### All 49 `labels.*` keys

`heroRefreshNote` · `heroMetaDates` · `heroMetaLocation` · `heroMetaFormat` ·
`answerEyebrow` · `answerHeadingTemplate` · `galleryEyebrow` · `galleryHeading` ·
`galleryFootnote` · `galleryPlaceholder` · `whyEyebrow` · `agendaEyebrow` ·
`agendaHeading` · `agendaPendingNote` · `speakersEyebrow` · `speakersHeading` ·
`speakerKeynoteChip` · `exhibitorsEyebrow` · `exhibitorsHeading` ·
`exhibitorsNotableHeading` · `audienceEyebrow` · `audienceHeading` ·
`audienceTitleMixLabel` · `audienceIndustriesLabel` · `audienceMatchHeading` ·
`costEyebrow` · `costHeading` · `logisticsEyebrow` · `logisticsHeading` ·
`passesLabel` · `sentimentEyebrow` · `sentimentHeading` · `sentimentVideoLabel` ·
`sentimentRedditLabel` · `sentimentTestimonialLabel` · `playbookEyebrowTemplate` ·
`playbookHeadingTemplate` · `playbookMotionPrefix` · `playbookStep1..3` ·
`similarEyebrow` · `similarHeading` · `similarLinkLabel` · `faqEyebrow` ·
`faqHeading` · `faqSideNote` · `footerStampPrefix` · `footerSourcesPrefix`

Plus `tocLabels.*` (13 keys) and `roiLabels.*` (10 keys).

> Every one has a fallback in `src/lib/defaults.ts` equal to the reference-build
> string. Clear a field in Sanity and the page falls back rather than rendering a
> blank heading — you cannot break the page by emptying a label.

### Using your existing events collection page

This project ships an `/events` index only so the app has a working root in
development. If you already run an events collection page elsewhere:

1. Set `breadcrumb.eventsHref` to it (e.g. `https://b2brain.com/events`).
2. Point the `Events` entry in `navLinks` and the footer's Events column at it.
3. Optionally delete `src/app/events/page.tsx`. Nothing else depends on it —
   `/events/[slug]`, the sitemap and the "Similar events" cards are unaffected.

---

## 2 · Supporting documents

| Document | Why it is a document and not a text field |
|---|---|
| `venue` | Moscone / McCormick / GWCC each host several shows. Typed once, it gives every `Event` JSON-LD a complete `location` with street address and geo. |
| `eventSeries` | Groups Dreamforce 2026 / 2027. Carries the organiser for JSON-LD `organizer`, and lets last year's page point at this year's edition instead of competing with it. |
| `eventCategory` | Filters `/events`, drives the automatic "Similar events" fallback, and gives the footer's Events column real destinations. |

---

## 3 · The event page, section by section

### Hero — `mHero()` → `Hero.tsx`

| Rendered element | Sanity field | When empty |
|---|---|---|
| Breadcrumb | *(derived)* Home / Events / `name` | — |
| Chip 1 — type | `type` | field |
| Chip 2 — countdown | *(computed from `startDate`)* | field |
| Chip 3 — hashtag | `hashtag` | field |
| `<h1>` | `name` | **required** |
| Sub-headline | `tagline` | field |
| Primary button | `heroPrimaryCtaLabel` → settings | falls back |
| Secondary button | `registerUrl` + settings label | field (button vanishes) |
| Meta cell "Dates" | `startDate` + `endDate` | cell |
| Meta cell "Location" | `venue->name` · `venue->city` | cell |
| Meta cell "Format" | `formatNote` ?? `format` | cell |
| Video eyebrow | `heroVideo.label` | field |
| Video thumbnail | `heroVideo.thumbnail` | falls back to YouTube's own still |
| Video caption | `heroVideo.caption` | field |
| Playback mode | `heroVideo.openOnYouTube` | off = inline player, on = link out |
| Countdown line under video | *(computed)* + `labels.heroRefreshNote` | field |
| **Whole right column** | `heroVideo.youtubeUrl` | **layout** — hero becomes full-width |

> The hero's right column was a stat card ("operator card") in the original
> reference build. It is now a **video** from a previous edition — it proves the
> event is real to someone who has never attended, and gives the page a media
> asset worth linking to. The old `heroCard` type is removed from the schema.
>
> The player is a **click-to-load facade**: until someone clicks, it is a still
> image and a black play square. No YouTube request, no third-party cookies, no
> effect on page speed. The iframe mounts only on click, via
> `youtube-nocookie.com`. Set *Open on YouTube instead of playing inline* when
> the uploader has disabled embedding.

> `subhead` exists in the reference data object but **is never printed in the hero**.
> The field is kept and repurposed as the meta-description fallback. Documented
> in the schema so nobody "fixes" it by rendering it.

### At-a-glance — `mStats()` → `Stats.tsx`

| Element | Field | When empty |
|---|---|---|
| Number | `stats[].num` | **cell** (a cell with no number is dropped) |
| Label | `stats[].label` | field |
| Qualifier | `stats[].meta` | field |
| Whole strip | `stats` | **section** |

Ship 2 or 4. Three leaves a hole at the 2-up breakpoint.

### Quick answer — `mAnswer()` → `Answer.tsx`

| Element | Field | When empty |
|---|---|---|
| H2 "What is [event]?" | `labels.answerHeadingTemplate` + `name` | — |
| Answer paragraph | `tldr` | **section** |

Highest-value paragraph on the page — this is what AI answer engines lift.

### Gallery — `mGallery()` → `GallerySection.tsx` + `Gallery.tsx`

| Element | Field | When empty |
|---|---|---|
| Slide image | `gallery[].image` | placeholder tile renders |
| Alt text | `gallery[].alt` | falls back to caption |
| Caption bar | `gallery[].caption` | field |
| Arrows + dots | *(auto)* | hidden when exactly 1 slide |
| Footnote | `galleryFootnote` → `labels.galleryFootnote` | field |
| Whole section | `gallery` | **section** |

`gallery[].accent` is carried from the reference model but is not rendered.

### Why it matters — `mWhy()` → `Why.tsx`

| Element | Field | When empty |
|---|---|---|
| H2 | `why.headline` | field |
| Paragraphs | `why.body[]` (one entry per paragraph) | field |
| Pullquote | `why.pullquote.text` / `.attr` | **layout** — body goes full-width |
| Whole section | headline **and** body both empty | **section** |

### Agenda — `mAgenda()` → `AgendaSection.tsx` + `Agenda.tsx`

| Element | Field | When empty |
|---|---|---|
| Tab label / sub-label | `agenda.days[].label` / `.meta` | field |
| Session row | `agenda.days[].items[] {time, title, loc, track}` | field |
| Track chips | `agenda.tracks[]` | field |
| "Being confirmed" note | `labels.agendaPendingNote` | shown **only** when tracks exist but days do not |
| Whole section | days **and** tracks both empty | **section** |

The half-data case is the useful one: tracks are sourceable months before the
schedule, so the page answers "what's on the floor" from day one.

### Speakers — `mSpeakers()` → `Speakers.tsx`

| Element | Field | When empty |
|---|---|---|
| Avatar initials | `speakers[].initials` | **derived from the name** |
| Name / role | `speakers[].name` / `.role` | field |
| Keynote chip | `speakers[].keynote` | field |
| Whole section | `speakers` | **section** |

### Exhibitors — `mExhibitors()` → `Exhibitors.tsx`

| Element | Field | When empty |
|---|---|---|
| Tier row | `exhibitors.tiers[] {tier, names[]}` | field |
| "Which booths to map first" | `exhibitors.notable` | field |
| Whole section | tiers **and** notable both empty | **section** |

### Who attends — `mAudience()` → `Audience.tsx`

| Element | Field | When empty |
|---|---|---|
| Title-mix bars | `audience.titleMix[] {label, pct}` | column |
| Industry chips | `audience.industries[]` | field |
| "Is your buyer here?" card | `audience.match` | field |
| Layout | — | **layout** — one column only ⇒ single bordered box, not a dead half |
| Whole section | both columns empty | **section** |

### Cost & ROI — `mROI()` → `CostSection.tsx` + `Roi.tsx`

| Element | Field | When empty |
|---|---|---|
| Booth cost paragraph | `cost.boothRange` | field |
| 7 calculator inputs | `cost.roi.{spend, reps, days, convosPerRepDay, qualRate, meetingRate, acv}` | **section** |
| Outputs | *(computed in the browser)* | — |
| Comparison sentence | `roiLtmCopy` + `roiIndustryAverage` (settings) | — |

Formula (verified against the reference):
`convos = reps × days × convosPerRepDay` → `qualified = convos × qualRate%` →
`meetings = qualified × meetingRate%` → `pipeline = meetings × acv` →
`return = pipeline ÷ spend`. `meetingRate` **is** the LTM number.

### Logistics — `mLogistics()` → `Logistics.tsx`

| Element | Field | When empty |
|---|---|---|
| Cell heading | `logistics.cells[].h` | field |
| Cell body **or** list | `.body` / `.list[]` | list wins when both are set |
| Passes table | `logistics.passes[] {name, note, price}` | field |
| Whole section | cells **and** passes both empty | **section** |

`price` is text so "Varies" and "Free with code" work. Numeric prices are also
emitted as JSON-LD `Offer`s; non-numeric ones are skipped.

### What people say — `mSentiment()` → `Sentiment.tsx`

| Element | Field | When empty |
|---|---|---|
| Video cards | `sentiment.videos[] {title, src, url?, thumbnail?}` | block |
| Reddit cards | `sentiment.reddit[] {quote, sub, tone}` | block |
| Testimonials | `sentiment.testimonials[] {q, a}` | block |
| Whole section | all three empty | **section** |

`url` and `thumbnail` are additive: absent, the card renders exactly as the
reference (static thumb + play mark).

### Playbook — `mPlaybook()` → `Playbook.tsx`

| Element | Field | When empty |
|---|---|---|
| Eyebrow / H2 | `labels.playbook*Template` + `name` | — |
| Card 01 (purple) | `playbook.pre {h, b}` | card |
| Card 02 (orange) | `playbook.floor {h, b}` | card |
| Card 03 (green) | `playbook.post {h, b}` | card |
| Step labels | `labels.playbookStep1..3` | — |
| Whole section | all three motions empty | **section** |

Fill all three or none — a partial set renders a lopsided grid.

### Similar events — `mSimilar()` → `Similar.tsx`

| Element | Field | When empty |
|---|---|---|
| Cards | `relatedEvents[]` → references | falls back ↓ |
| Fallback | `autoFillRelated` ⇒ up to 3 upcoming events sharing a category | |
| Card contents | pulled from the referenced event: name, dates, city | never retyped |
| Whole section | no picks **and** no fallback matches | **section** |

The grid narrows to 1 or 2 tracks when there are fewer than 3 cards, so it
never shows dead space inside the bordered frame.

### FAQ — `mFaq()` → `FaqSection.tsx` + `Faq.tsx`

| Element | Field | When empty |
|---|---|---|
| Question / answer | `faq[] {q, a}` | row |
| Side note | `labels.faqSideNote` | field |
| Whole section | `faq` | **section** |

Answers stay in the DOM when collapsed — the accordion is presentation, never a
content gate.

### Closing CTA — `mCta()` → `Cta.tsx`

| Element | Field | When empty |
|---|---|---|
| Eyebrow | `ctaEyebrowOverride` ?? computed countdown ?? `ctaFallbackEyebrow` | — |
| H2 | `ctaHeadline` ?? `ctaHeadlineTemplate` + `name` | — |
| Primary button | settings `ctaPrimary*` | — |
| Supporting text | `ctaSecondaryLabelTemplate` | hidden when empty; never a link |

Always renders. It is the conversion surface.

### Footer — `mFooter()` → `Footer.tsx`

| Element | Field | When empty |
|---|---|---|
| Stamp: last updated | `lastUpdated` | field |
| Stamp: sources | `sources[].label` | field |

---

## 4 · Fields that exist only for search

Not in the reference HTML — added because a programmatic page set lives or dies
on them.

| Field | Feeds |
|---|---|
| `seo.metaTitle` | `<title>`, OG, Twitter. Falls back to `[name] — B2Brain — The Event Meeting Platform` |
| `seo.metaDescription` | meta description. Falls back to `subhead` → `tldr` → `tagline` |
| `seo.ogImage` | OG / Twitter image (1200×630). Falls back to `defaultOgImage` |
| `seo.canonicalUrl` | `<link rel=canonical>` override |
| `seo.noIndex` | `robots noindex` + drops the page from the sitemap |
| `publishedAt` | JSON-LD `datePublished` |
| `lastUpdated` | JSON-LD `dateModified` + the footer stamp + sitemap `lastmod` |
| `sources[]` | the footer stamp; your own verification trail |
| `categories[]` | `/events` filtering + the Similar-events fallback |
| `venue.streetAddress` / `postalCode` / `geo` | JSON-LD `location` |
| `series.organizerName` / `organizerUrl` | JSON-LD `organizer` |

### Structured data emitted per page

One `@graph`, five node types: `Organization`, `WebPage`, `BreadcrumbList`,
`Event`, `FAQPage`. Verified output for Dreamforce 2026:

```
Event      name, startDate, endDate, MixedEventAttendanceMode,
           location {Place + PostalAddress + GeoCoordinates},
           organizer {Salesforce}, 2 Offers, 8 performers
FAQPage    5 questions
Breadcrumb Home > Events > Dreamforce 2026
```

Rule: nothing goes into structured data that is not also visible on the page.

---

## 5 · Deliberate deviations from the reference file

Four, all additive. Everything else is a literal port.

| # | Change | Why |
|---|---|---|
| 1 | The dev-only `PREVIEW MODE` switcher is not ported | The file says it "never ships". Its job — proving graceful degradation — is now done by the two seeded events. |
| 2 | Site-wide copy moved to `siteSettings` | 40 pages cannot each own their own copy of the word "Exhibitors". Defaults are the reference strings verbatim. |
| 3 | `Similar events` grid narrows below 3 cards | The reference only ever had 0 or 3. With 1–2, a fixed 3-track grid leaves dead space — against the file's own no-empty-boxes rule. |
| 4 | Optional `url` / `thumbnail` on video reviews | Renders identically when absent. |

**Known inconsistency, left as-is:** `SKILL.md` states container `1280px` and
Satoshi as the body font; `preview-v2.html` uses `1160px` and Inter. The brief
was to match the HTML exactly, so the build uses **1160 / Inter**. Changing both
is a two-line edit in `globals.css` if you decide the SKILL is authoritative.
