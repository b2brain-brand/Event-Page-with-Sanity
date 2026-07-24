# Adding and changing fields

## First: two different websites, two different jobs

This trips up everyone coming from Webflow or Contentful.

| Where | URL | What you do there |
|---|---|---|
| **The Studio** | `http://localhost:3000/studio` (or `your-domain.com/studio`) | **Edit content.** Fill in events, change labels, upload photos, publish. |
| **sanity.io/manage** | <https://sanity.io/manage> | **Project admin only.** API tokens, datasets, CORS origins, team members, billing. |

`sanity.io/manage` has **no content editor and no field builder**. If you went
there looking for the CMS, you found nothing editable — that is expected, not a
bug. All content editing happens in the Studio.

## Second: in Sanity, fields are code — there is no "Add field" button

Webflow lets you click *Add Field* in the UI. Sanity does not, anywhere, by
design. The schema lives in this repo:

```
sanity/schemaTypes/
  documents/
    event.ts          ← the ~120 fields on an event page
    venue.ts
    eventSeries.ts
    eventCategory.ts
    siteSettings.ts   ← the 72 global strings
  objects/
    hero.ts  stats.ts  gallery.ts  why.ts  agenda.ts  speakers.ts
    exhibitors.ts  audience.ts  cost.ts  logistics.ts  sentiment.ts
    playbook.ts  faq.ts  shared.ts
```

You edit one of those files, save, and the field appears in the Studio.

**The trade-off, honestly:** you cannot add a field without touching code, which
means a developer (or me) has to do it. In exchange the schema is versioned in
git, reviewable in a pull request, and provably identical in every environment.
That is what stops 40 event pages drifting apart — nobody can quietly add a
field to one show and not the others.

---

## Adding a field — worked example

Say you want a **"Floor plan URL"** on every event, shown in the Logistics
section.

### 1. Add it to the schema

`sanity/schemaTypes/documents/event.ts`, inside the `fields: [ ... ]` array —
put it in the group where it belongs (`commercial` is the Audience & cost tab):

```ts
defineField({
  name: 'floorPlanUrl',
  title: 'Floor plan URL',
  type: 'url',
  group: 'commercial',
  description:
    'Link to the organiser\'s exhibitor floor plan PDF. Leave blank and the link does not render.',
}),
```

Save. If `npm run dev` is running, the Studio hot-reloads — the field is there.

That is enough to *store* the value. To *show* it on the page, two more steps.

### 2. Fetch it

`sanity/lib/queries.ts`, in `EVENT_QUERY` — add the field name to the projection:

```groq
  officialUrl,
  registerUrl,
  floorPlanUrl,          // ← add
```

If you skip this, the field saves fine in the Studio but arrives as `undefined`
in the component. **This is the single most common mistake.** A field that
"saves but doesn't show" is almost always missing from the GROQ query.

### 3. Render it

Add it to the type in `src/lib/types.ts`:

```ts
  registerUrl?: string
  floorPlanUrl?: string   // ← add
```

Then use it in the relevant section component — here
`src/components/sections/Logistics.tsx`:

```tsx
{has(event.floorPlanUrl) && (
  <a className="link-underline link-arrow" href={event.floorPlanUrl}
     target="_blank" rel="noopener noreferrer">
    Download the floor plan
  </a>
)}
```

Wrap it in `has(...)` — that is the house rule. Every field must degrade to
nothing when empty, so a sparse event never renders a dead link or an empty box.

### 4. Check it

```bash
npm run typecheck && npm run build
```

---

## The three kinds of change

| You want to… | Edit | Needs a deploy? |
|---|---|---|
| Change a **value** (event copy, a label, a photo) | The Studio | No — publish and the webhook pushes it live |
| Add or remove a **field** | `sanity/schemaTypes/*.ts` + query + component | Yes |
| Change **layout or styling** | `src/components/**` / `globals.css` | Yes |

Most of what you will do day to day is the first row, and that needs no
developer at all.

---

## Before you add a field, check it isn't already there

The `event` document already carries ~120 fields. Open
[`FIELD-MAP.md`](FIELD-MAP.md) — it lists every one against the pixel it feeds.

And if the text you want to change is a **heading, eyebrow, button label or
any other fixed wording**, it is already editable without code:
**Studio → Site settings → Section labels** (49 keys), **"On this page" labels**
(13), **ROI calculator labels** (10). No deploy needed.

---

## Field types you will reach for

| Sanity type | Use for |
|---|---|
| `string` | short single-line text |
| `text` | multi-line (set `rows`) |
| `number` | percentages, counts, money |
| `boolean` | toggles — e.g. `keynote` |
| `date` / `datetime` | show dates, last-updated |
| `url` | external links |
| `image` | with `options: { hotspot: true }` |
| `array` of `string` | tag lists — add `options: { layout: 'tags' }` |
| `array` of an object type | repeaters — speakers, FAQ, stats |
| `reference` | link to another document — venue, related events |

Always give a `description`. It is the only instruction the person filling the
page will see, and it is why a new event takes 30 minutes instead of two hours.

---

## Deployed the Studio? Add the domain to CORS

Currently allowed: `http://localhost:3000` and `http://localhost:3333`.

The moment you open `/studio` on a Vercel URL, it will fail to load content
until you add that origin: **sanity.io/manage → API → CORS origins → Add**,
with **Allow credentials** ticked. Vercel preview URLs change every deploy, so
either add `https://*.vercel.app` or work against a stable alias.
