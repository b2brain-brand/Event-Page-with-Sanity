---
name: b2brain-web-design
description: Use when designing, reviewing, or building any B2Brain (b2brain.com) marketing web page, Webflow template/section/component, landing page, or programmatic event page — homepage, platform, solution/use-case pages, pricing, blog, event pages — so it matches B2Brain's brutalist visual system and operator voice.
---

# B2Brain Web Design System

## Overview
B2Brain's public site is **brutalist-modern B2B SaaS** (Focus Lab "home-01" lineage). One-line identity: **border-radius 0 everywhere, hard 1px black borders, Archivo display + Satoshi body, black-on-white with exactly ONE accent per section, and an asterisk-prefixed uppercase eyebrow above every section.** It should read like an operator's dashboard or a CFO's spreadsheet — not a pastel SaaS landing page. Rounded corners, drop shadows, gradients, glassmorphism, or stock photos of people in suits = instantly off-brand.

## When to use
- Building or reviewing any b2brain.com page, Webflow template, section, or component.
- Spinning up a new landing page, solution page, or programmatic **event page**.
- Checking whether a design or draft is on-brand before it ships.
- Onboarding: understanding B2Brain's tokens, components, and voice.

## The 8 non-negotiable rules
1. **Border-radius = 0.** Every visual edge is a 1px solid **black** line. Rounding any corner breaks the system.
2. **Black & white first, ONE accent per section.** Most of a page is pure black on white. Each section gets a single dominant accent in one defined surface — never gradients, never a wash, never all accents at once.
3. **Asterisk eyebrow on every section:** `* SECTION LABEL` — Satoshi/Inter, 14px, weight 600, `letter-spacing 0.56px`, UPPERCASE, black. Never drop it; never use other prefixes (no `01.`, chevrons, emoji).
4. **Type = Archivo headings (weight 500) + Satoshi body.** The display look comes from large sizes and tight **negative** letter-spacing, not from weight. Headings are never heavier than 500.
5. **Grid lines are architecture.** Separate cells with 1px black borders. To avoid `:last-child` hacks, use the **"1px gap over a black background"** trick: `display:grid; gap:1px; background:#000` on the container, `background:#fff` on each cell → crisp 1px black grid lines.
6. **Operator visuals, not stock.** Mock dashboards, stat cards, formula boxes, before/after tables, capture cards. If a visual could appear inside a customer's Salesforce, it fits. No stock people, no abstract illustration.
7. **Two button styles only.** `primary` = black fill / white text, hovers to **purple** fill. `ghost` = transparent + 1px black border, hovers to inverted black-on-white. No tertiary, no icon-only buttons.
8. **Forbidden:** rounded corners · shadows · gradients (linear/radial/mesh) · glassmorphism/backdrop-filter · emoji · icon fonts (Font Awesome) · stock suit photography · heading weight > 500 · any font other than Archivo / Satoshi Variable / Inter Display.

## Design tokens — LIVE from the Webflow site (source of truth)
> These are read from the site's Webflow variable collections (**Colors, Typography, Perimeter**). They override any older doc.

### Colors
| Token | Value | Use |
|---|---|---|
| `--black` / `--white` | black / white | primary fg/bg, borders, button fills |
| `--black-70` | rgba(0,0,0,.70) | supporting body text |
| `--orange` / `--orange-light` | `#ff382c` / `#ffe4de` | **Commitment** — booth/exhibitor, primary CTA banner |
| `--purple` / `--purple-light` | `#6c58ba` / `#e3e0f5` | **Pipeline** — LTM/attribution/CMO, button hover |
| `--green` | `#89f86e` (text on it: `--ceramic #12340c`) | **Speed** — attendee, success/after states |
| `--yellow` | `#ffeb46` | captured-insight chips (sparingly) |
| `--pink` | `#ff7cc0` | rare accent chips only |
| `--border-light` | `#f0f0f0` | internal list-row dividers **inside** black-bordered cards only |
| `--whitesmoke` / `--cloudy-grey` | whitesmoke / `#6b6b6b` | subtle fills / footer microcopy |

**Accent → meaning (keep consistent across pages):** Orange = Commitment · Purple = Pipeline · Green = Speed. These map to the three product pillars.

### Typography
**Fonts:** `Archivo` (headings/display), `Satoshi Variable` (body — the site's `font-satoshi` base), `Inter Display` (alt). **Weights:** 400 / 500 / 600 / 700.

| Style | Size / Line-height / Tracking |
|---|---|
| H1 | 64 / 72 / **-1.92** |
| H2 | 56 / 64 / **-1.68** |
| H3 | 40 / 48 / 0 |
| H4 | 36 / 44 / -0.72 |
| H5 | 24 / 32 / 0 |
| H6 | 22 / 30 / 0 |
| Sub-heading | 20 / 28 / -0.4 |
| Body-M / Body-lg | 18 / 28 |
| Body | 16 / 24 |
| Body-sm | 14 / 20 |
| Caption / eyebrow / stat-label | 14, weight 600, **0.56** tracking, UPPERCASE |
| Caption-2 | 13 / 20 / 0.26 |

Headings weight **500**. Responsive: mobile H1 ≈ 48/56, H2 ≈ 40/48 (Typography collection has Tablet / Mobile-L / Mobile modes).

### Spacing & layout
- **Container 1280px** · Container-Large **1344px** (full-bleed grids) · side margin **30px** · full-width `100%`.
- **Section padding:** standard **100px** top/bottom · narrative-spine (hero, pillars, CTA, footer) **160px** · compact strips **40–80px**.
- Padding scale (px): 0 · 2 · 4 · 8 · 12 · 16 · 20 · 24 · 28 · 32 · 36 · 40 · 44 · 64 · 80 · 100 · 120 · 140 · 160.
- Gap scale (px): 0 · 2 · 4 · 8 · 12 · 16 · 20 · 24 · 28 · 32 · 40.

## Component patterns (all zero-radius, 1px black borders)
- **Nav** — sticky, white, 1px black bottom border; logo (black square + orange inner inset) + links + `Book a Demo` (primary) / `Start Free Trial`.
- **Eyebrow** — `* LABEL` (rule 3).
- **Buttons** — primary + ghost (rule 7).
- **Badge/pill** — small uppercase coloured chip beside short text (green/orange/purple variants).
- **Stat card** — Archivo 56/64 metric + uppercase label; pair every number with a comparison.
- **3-motion grid** — 3 cells in a 1px-black frame, each: `MOTION 0X` step, black icon-square with coloured inset, H3, thin-rule bullet list.
- **Pillars (Speed / Commitment / Pipeline)** — two-column deep dives, tinted 4:3 visual, reversible; often collapsible on the live homepage.
- **Comparison table** — 3 cols (feature · "Badge scanners" · "B2Brain"); black header row, B2Brain header in orange, purple checkmarks.
- **Pricing cards** — 2 tiers, featured uses purple-light fill + black `MOST POPULAR` pill; Archivo price.
- **Integrations strip** — 1px-black white pills, each with a 24px coloured square mark + name.
- **Industries grid** — 4 cells, coloured icon square + industry + 3 representative show names.
- **Proof / testimonial** — metric + quote + avatar (tinted square) + star rating.
- **FAQ** — two-col; question in Archivo 22/30 with a 1.5px plus/cross that animates open.
- **CTA banner** — orange-light fill, 1px black, two solid orange "pixel" blocks pinned to opposite corners (the signature mosaic), centered eyebrow + H2 + button pair.
- **Footer** — 5-col (brand + 3 nav + newsletter); 36px 1px-black social squares; black-fill square submit inside a bordered input.

## Page recipes (how the real pages compose)
- **Homepage:** Nav → Hero (orange visual) → logo strip → 3-motion arc (Before/During/After, **52% LTM**) → testimonials → problem + LTM definition (**~40% vs ~9%**) → 3 pillars (Speed/Commitment/Pipeline) → ~12-capability grid → industries (4 + shows) → vs-badge-scanner table → pricing (**Show Pass $200/user/event**; **Pipeline custom from $10K/yr**) → integrations → blog cards → FAQ → demo CTA → footer.
- **Platform:** Nav → hero → 3-motion overview → Motion 01/02/03 (each: problem + expandable feature cards + testimonial; Motion 02 has a **"30-second window"** callout) → CRM integrations → Security (SOC 2 / GDPR / SSO) → FAQ → CTA → footer. *(No sticky in-page subnav currently.)*
- **Solution / use-case pages** (page-hero tinted per page: **exhibitors = orange, attendees = green, pipeline = purple**): page-hero → problem grid → playbook / before-after timeline / insights grid → persona row → proof grid → CTA → footer.
- **Event pages (programmatic, V2):** hero + at-a-glance stats → quick-answer → gallery → why-it-matters → agenda (day tabs) → speakers → sponsors → who-attends → cost & ROI → logistics → reviews (video/Reddit/testimonials) → similar events → FAQ → CTA. Reference build: `events-template/preview-v2.html`.

## Voice (site copy = third-person **operator-to-operator** — NEVER Krishna's first person)
- Every number is **paired with a comparison** (52% LTM vs ~9% post-event). No standalone percentages.
- No emojis, no exclamation marks, no "AI-powered" lead-in.
- **Forbidden words:** seamless · effortless · leverage · unlock · unleash · empower · supercharge · world-class · best-in-class · next-gen · synergy · ecosystem · touchpoints · journeys · experiences · boost engagement · "event tech" · "lead retrieval" · "engagement platform".
- Own the category metric: **LTM (Leads-to-Meeting)**. Narrative spine = **Speed → Commitment → Pipeline**.

## Build workflow (new page / template)
1. State the page's intent (which query/persona it targets, which pillar it expresses).
2. Start from the tokens above; **reuse existing components before inventing** new ones.
3. Compose in **black-and-white first**; add exactly one accent per section.
4. Every section: asterisk eyebrow → heading → operator visual.
5. Zero radius, 1px black borders; use the 1px-gap-over-black trick for bordered grids.
6. Responsive at **991px** and **640px**; verify **no horizontal scroll** at 1280 / 768 / 375.
7. Write copy per the voice rules; check it against the forbidden-words list.
8. In Webflow: **bind to the site variables** (Colors / Typography / Perimeter collections) instead of hardcoding values.

## Common mistakes
- Rounded corners or shadows (off-brand on sight).
- Body font = plain Inter → wrong; the site's base body is **Satoshi Variable**.
- Container 1160 (old doc value) → it's **1280**.
- More than one accent colour in a single section.
- Missing the `*` eyebrow.
- Standalone stats with no comparison.
- Using Krishna's first-person voice on the B2Brain site (site is third-person operator).

## Deeper references (in the vault)
- `clients/b2brain/context/04_design_system.skill.xml` — exhaustive component + CSS library and section recipes. *(Predates the live-token corrections above; this SKILL.md wins on tokens/fonts/container.)*
- `clients/b2brain/context/03_brand_content_style_guide.md` — full voice, headline patterns, forbidden-words list.
- `clients/b2brain/events-template/preview-v2.html` — the built, paste-ready brutalist **event page V2** (best working reference for a full page).
- Canonical live tokens: the Webflow **Colors / Typography / Perimeter** variable collections on the B2Brain site.
