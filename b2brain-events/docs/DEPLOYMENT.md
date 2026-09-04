# Deployment — Vercel + Sanity

One repo, one Vercel project, one Sanity project. The Studio is mounted inside
the Next app at `/studio`, so editors never leave the domain and there is no
second deployment to keep in sync.

```
                    ┌──────────────────────── Vercel ────────────────────────┐
   editor ──────────▶  /studio            (Sanity Studio, embedded)          │
                    │  /events            (index)                            │
   visitor ─────────▶  /events/[slug]     (ISR, prerendered per event)       │
                    │  /api/revalidate    (webhook target)                   │
                    │  /api/draft-mode/*  (Presentation preview)             │
                    └───────────▲───────────────────────┬────────────────────┘
                                │ purge cache tag       │ GROQ (read token)
                    ┌───────────┴───────────────────────▼────────────────────┐
                    │  Sanity  project gwr013fi · dataset production          │
                    └────────────────────────────────────────────────────────┘
```

---

## 0 · Before anything else: rotate the token

The API token used to scaffold and seed this project was shared in plain text.
Treat it as compromised:

1. <https://sanity.io/manage> → project **Event Landing Page** → **API** → **Tokens**
2. Delete the existing token.
3. Create **two** new ones instead of reusing one:
   - `events-web-read` — **Viewer** role → `SANITY_API_READ_TOKEN`
   - `events-seed-write` — **Editor** role → `SANITY_API_WRITE_TOKEN`, local only

A Viewer token is all the website needs. Nothing at runtime should be able to
write.

---

## 1 · Environment variables

| Variable | Where | Value |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Vercel + local | `gwr013fi` |
| `NEXT_PUBLIC_SANITY_DATASET` | Vercel + local | `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Vercel + local | `2024-10-28` |
| `NEXT_PUBLIC_SITE_URL` | Vercel + local | production origin, no trailing slash |
| `SANITY_API_READ_TOKEN` | Vercel + local | Viewer token |
| `SANITY_REVALIDATE_SECRET` | Vercel + local | any long random string |
| `SANITY_API_WRITE_TOKEN` | **local only** | Editor token, for `npm run seed` |

> **The read token is not optional.** This dataset does not serve content to
> anonymous requests — an unauthenticated GROQ query returns an empty result set
> rather than an error. Without the token every event page 404s in production
> while looking fine in the Studio. This is the single most likely cause of a
> failed first deploy.

Set all of them for **Production, Preview and Development** in Vercel.

---

## 2 · First deploy

```bash
git init && git add -A && git commit -m "B2Brain event pages: Sanity + Next.js"
```

Then either connect the repo in the Vercel dashboard, or:

```bash
npx vercel link
npx vercel env pull .env.local
npx vercel --prod
```

Framework preset: **Next.js**. Build command, output dir and install command are
all the defaults — nothing to override.

---

## 3 · CORS — let the Studio talk to Sanity

<https://sanity.io/manage> → **API** → **CORS origins** → add, both with
**Allow credentials** ticked:

- `https://<your-production-domain>`
- `http://localhost:3000`

Vercel preview deployments get a new URL each time. Either add the wildcard
`https://*.vercel.app` (convenient, broad) or use a stable preview alias.

---

## 4 · Webhook — publish in Sanity, live in seconds

Without this, edits wait for the hourly revalidate. With it, publishing purges
exactly the affected cache tags.

<https://sanity.io/manage> → **API** → **Webhooks** → **Create webhook**

| Setting | Value |
|---|---|
| Name | `Revalidate Vercel` |
| URL | `https://<your-domain>/api/revalidate` |
| Dataset | `production` |
| Trigger on | Create · Update · Delete |
| Filter | `_type in ["event","siteSettings","venue","eventSeries","eventCategory"]` |
| Projection | `{_type, "slug": slug.current}` |
| HTTP method | `POST` |
| API version | `v2021-03-25` |
| Secret | the same string as `SANITY_REVALIDATE_SECRET` |

The route rejects any request whose signature does not verify. Editing site
settings, a venue, a series or a category also purges the `event` tag, because
all four change what an event page renders.

Verify:

```bash
curl -i -X POST https://<your-domain>/api/revalidate -d '{}'
```

`401 Invalid signature` is the correct answer — it proves the guard is live.

---

## 5 · Live preview (Presentation)

Already wired. `/studio` → **Presentation** shows the real page beside the form,
with drafts. It calls `/api/draft-mode/enable`, which validates against the read
token before setting the cookie.

If Presentation loads a blank frame, the cause is almost always a missing CORS
origin (step 3) or a missing `SANITY_API_READ_TOKEN`.

---

## 6 · Where this lives on the domain

Event pages want to sit on the main domain — `b2brain.com/events/...` — so they
inherit its authority. Three options, best first:

1. **Same Next app.** If b2brain.com is already Next on Vercel, move these
   routes into it. One deploy, no proxy, no duplicate nav.
2. **Reverse proxy.** Keep this app separate and proxy `b2brain.com/events/*`
   to it (Cloudflare Worker, or Vercel rewrites from the main project). Set
   `NEXT_PUBLIC_SITE_URL=https://b2brain.com` so canonicals and the sitemap
   point at the public origin, and add `/events/sitemap.xml` to the main
   `robots.txt`.
3. **Subdomain** — `events.b2brain.com`. Simplest to stand up, weakest for SEO:
   a subdomain does not fully inherit the root domain's authority.

The current build assumes option 2 or 3. It is `NEXT_PUBLIC_SITE_URL` and
nothing else.

---

## 7 · Post-deploy checklist

- [ ] `/events/dreamforce-2026` returns 200 and renders every section
- [ ] `/events/smts-2026` returns 200 with gallery, speakers, exhibitors and
      reviews **absent** — that is the graceful degradation working
- [ ] `/studio` loads and lists Events, Venues, Series, Categories, Site settings
- [ ] Presentation shows a live page next to the form
- [ ] `/sitemap.xml` lists every published event that has a slug
- [ ] `/robots.txt` disallows `/studio` and `/api/`
- [ ] Publishing an edit in Sanity changes the live page within ~10s
- [ ] Rich Results Test passes for `Event` and `FAQPage`:
      <https://search.google.com/test/rich-results>
- [ ] Submit the sitemap in Search Console
