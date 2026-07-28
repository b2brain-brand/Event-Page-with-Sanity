# B2Brain Event Pages — AWS Domain Setup

**Goal:** serve this Vercel + Sanity app under the client's own domain, **b2brain.com**, whose DNS is managed in **AWS Route 53**.

**Current app URL:** `https://project-pcxmd.vercel.app`

There are two ways to do this. **Read §1 first and pick one** — the rest of the doc gives exact steps for each.

---

## 1. Choose the approach

| | **Option A — Subdomain** `events.b2brain.com` | **Option B — Path** `b2brain.com/events/*` |
|---|---|---|
| URL users see | `events.b2brain.com/…` | `b2brain.com/events/…` |
| SEO | First-party subdomain (very good) | First-party path (best; same authority as root) |
| AWS work | One DNS record in Route 53 | CloudFront distribution in front of the **whole** site + routing rules |
| Prerequisite | None | The main b2brain.com must sit **behind AWS CloudFront** |
| Risk | Very low | Higher — you're proxying production traffic |
| Time | ~15 min + DNS/SSL propagation | Half a day + testing |

**Recommendation:** start with **Option A (subdomain)**. It is fully first-party, works with zero changes to the existing b2brain.com site, and is what `NEXT_PUBLIC_SITE_URL` already defaults to (`https://events.b2brain.com`). Move to Option B later only if SEO specifically requires the `/events` path on the apex domain.

> **Important reality check for Option B:** you can only reverse-proxy a sub-path (`/events/*`) onto b2brain.com if **all** of b2brain.com's traffic already flows through a proxy you control (CloudFront). If the main site is hosted on Webflow/another host with its own DNS record and is *not* behind CloudFront, Option B means first putting the entire site behind CloudFront — a bigger project. If in doubt, use Option A.

---

## 2. Option A — Subdomain `events.b2brain.com` (recommended)

### Step 1 — Add the domain in Vercel
1. Vercel → project **b2brain-events** → **Settings → Domains**.
2. Add `events.b2brain.com`.
3. Vercel shows a **CNAME target** (typically `cname.vercel-dns.com`). Copy it.

### Step 2 — Create the DNS record in Route 53
1. AWS Console → **Route 53 → Hosted zones → b2brain.com**.
2. **Create record**:
   - **Record name:** `events`
   - **Type:** `CNAME`
   - **Value:** the Vercel target from Step 1 (e.g. `cname.vercel-dns.com`)
   - **TTL:** 300
3. Save.

> If Vercel gives you an A/ALIAS target instead of a CNAME, create an **A record** with those values. Follow exactly what the Vercel Domains screen tells you.

### Step 3 — Wait for SSL
Vercel auto-provisions an HTTPS certificate once DNS resolves (usually minutes, up to ~1 hour). The Domains screen turns green ("Valid Configuration").

### Step 4 — Update app config for the new origin
1. Vercel → **Settings → Environment Variables** → set
   `NEXT_PUBLIC_SITE_URL = https://events.b2brain.com` → **Redeploy**.
2. Sanity → **sanity.io/manage → project `gwr013fi` → API → CORS origins** → add
   `https://events.b2brain.com` (allow credentials).
3. Sanity → **API → Webhooks** → confirm the revalidate webhook URL is
   `https://events.b2brain.com/api/revalidate` (or keep the vercel.app URL — both work; prefer the final domain).

### Step 5 — Verify
- Visit `https://events.b2brain.com/events/dreamforce-2026` → loads over HTTPS.
- Visit `https://events.b2brain.com/sitemap.xml` → URLs use the new domain.
- Publish a small edit in Studio → page updates within ~60s.

**Done.** Optionally add a link to `events.b2brain.com` from the main site's nav.

---

## 3. Option B — Path `b2brain.com/events/*` via CloudFront

Use this only if the whole site is (or will be) behind **AWS CloudFront**. You add the Vercel app as a **second origin** and route a few path prefixes to it. The main site keeps serving everything else.

### 3.1 Prerequisites
- b2brain.com served through a **CloudFront distribution** (the apex/`www` Route 53 record is an ALIAS to the CloudFront domain).
- Access to edit that distribution.
- ACM certificate covering b2brain.com already attached to the distribution (it is, if the site runs on CloudFront today).

### 3.2 Add the Vercel origin
1. CloudFront → your b2brain.com distribution → **Origins → Create origin**.
2. **Origin domain:** `project-pcxmd.vercel.app`
3. **Protocol:** HTTPS only.
4. **Origin request policy / Host header:** send the origin's own host (`project-pcxmd.vercel.app`) so Vercel serves this project. *(Do not forward the viewer `Host: b2brain.com` unless you have also added `b2brain.com` as a domain on the Vercel project and configured it — the simple, reliable setup is: origin host = the vercel.app host.)*
5. Name it e.g. `vercel-events`.

### 3.3 Route the right paths to Vercel
A Next.js app is not just its pages — it also serves static assets, the CMS studio, and the webhook. **All of these prefixes must go to the Vercel origin**, or pages will render without CSS/JS. Create a **Cache Behavior** for each, pointing at origin `vercel-events`:

| Path pattern | Why |
|---|---|
| `/events` and `/events/*` | the event collection + landing pages |
| `/_next/*` | Next.js JS/CSS/static assets (**without this the pages are unstyled**) |
| `/studio` and `/studio/*` | the Sanity Studio editor |
| `/api/*` | the revalidate webhook endpoint |
| `/sitemap.xml`, `/robots.txt` | SEO (optional — or keep these on the main site and merge manually) |

For each behavior:
- **Viewer protocol policy:** Redirect HTTP to HTTPS.
- **Allowed methods:** `GET, HEAD` is enough for pages; use `GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE` for the `/api/*` behavior (the webhook is a POST).
- **Cache policy:** `CachingOptimized` for `/_next/*` (immutable hashed assets); for `/events/*` use a policy that respects origin cache headers (e.g. `CachingDisabled` or a short TTL) so publishes show quickly — Vercel already sets correct caching, so **forward the origin cache headers** rather than overriding.
- **Origin request policy:** forward all viewer headers/query strings the app needs; `AllViewerExceptHostHeader` is a safe default here (Host stays the vercel.app host per §3.2).

Ordering: CloudFront matches the **most specific** behavior first, so these `/events/*`, `/_next/*` etc. behaviors sit **above** the default behavior that serves the main site. The default (`*`) behavior stays pointed at the existing main-site origin.

### 3.4 App config changes
1. Vercel env: `NEXT_PUBLIC_SITE_URL = https://www.b2brain.com` → **Redeploy** (so canonicals/sitemap are on the apex).
2. Sanity **CORS origins**: add `https://www.b2brain.com`.
3. Sanity **Webhook** URL: `https://www.b2brain.com/api/revalidate`.

### 3.5 Invalidate & test
1. CloudFront → **Invalidations** → create `/*` (once, after wiring behaviors).
2. Test, in order:
   - `https://www.b2brain.com/events` → collection page loads **with styling** (proves `/_next/*` is proxied).
   - `https://www.b2brain.com/events/dreamforce-2026` → landing page, images, fonts all present.
   - View source → CSS/JS URLs are `/_next/...` and resolve 200.
   - `https://www.b2brain.com/studio` → Studio loads.
   - Publish an edit → page refreshes within ~60s (proves `/api/*` webhook is reachable).
3. Confirm the **rest of the site** (`/`, `/pricing`, `/blogs`, …) still serves from the main origin unchanged.

### 3.6 If pages load but look broken
Almost always a **missing `/_next/*` behavior** (assets 404 against the main origin). Add/verify that behavior and invalidate again.

---

## 4. What NOT to change

- **Do not** move the Sanity project or its `projectId` (`gwr013fi`) — the app reads content from it.
- **Do not** delete the `project-pcxmd.vercel.app` URL; CloudFront (Option B) uses it as the origin, and it's a useful fallback.
- **Do not** point Route 53 for the **apex** directly at Vercel in Option B — only CloudFront behaviors route the sub-paths; the apex ALIAS stays on CloudFront.

---

## 5. Post-cutover checklist (either option)

- [ ] `NEXT_PUBLIC_SITE_URL` updated to the final origin, and redeployed.
- [ ] Sanity **CORS origin** added for the final domain.
- [ ] Sanity **webhook** points at the final domain's `/api/revalidate` and a test publish refreshes the page.
- [ ] `sitemap.xml` shows the final domain's URLs; submit it in Google Search Console.
- [ ] HTTPS valid (padlock) on the final URL.
- [ ] **Rotate the Sanity API token** (it was shared in plaintext during the build) and update it in Vercel env.
- [ ] Spot-check a published event end-to-end on the final domain.

---

## 6. Reference values

| Item | Value |
|---|---|
| Vercel app origin | `project-pcxmd.vercel.app` |
| Sanity project ID | `gwr013fi` |
| Sanity dataset | `production` |
| Studio path | `/studio` |
| Webhook endpoint | `/api/revalidate` (POST, signed) |
| Recommended subdomain | `events.b2brain.com` |
| DNS host | AWS Route 53, hosted zone `b2brain.com` |

*Companion documents: **01 — Operating Guide** and **02 — Architecture / How It's Built**.*
