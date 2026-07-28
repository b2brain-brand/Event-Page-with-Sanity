# B2Brain Event Pages — AWS Domain Setup

**Goal:** serve this Vercel + Sanity app under the client's own domain, **b2brain.com**, whose DNS is managed in **AWS Route 53**.

**Current app URL:** `https://project-pcxmd.vercel.app`

There are two ways to do this. **Read §1 first and pick one** — the rest of the doc gives exact steps for each.

---

## 0. How b2brain.com is hosted today (verified)

Confirmed by inspecting the live site and DNS:

| Fact | Value |
|---|---|
| **DNS / nameservers** | AWS **Route 53** (`awsdns-*`) — the client controls DNS |
| **`www.b2brain.com`** | CNAME → `cdn.webflow.com` → the site is hosted on **Webflow** |
| **Edge in front of the site** | **Cloudflare** (`CF-Ray`, `Server: cloudflare`) — but this is **Webflow's own Cloudflare**, NOT a Cloudflare account the client controls |

**Consequences:**
- **Route 53 alone cannot do path routing.** DNS resolves hostnames, not paths — there is no record that sends `/events/*` to Vercel and the rest to Webflow.
- **A Cloudflare Worker is NOT available** to the client here: the Cloudflare edge belongs to Webflow, and you can only deploy Workers to a Cloudflare zone you own. (DNS is on Route 53, so the client has no Cloudflare zone.)
- To get `b2brain.com/events/*`, the client must insert **their own reverse proxy in front of the whole domain**. Given DNS is at AWS, that proxy is **AWS CloudFront** (Option B below), with **Webflow as the default origin** and **Vercel for the event paths**.
- *Alternative:* move the domain's DNS into the client's **own** Cloudflare account (change nameservers away from Route 53), then a Worker becomes possible. Out of scope here since the client wants to stay on AWS.

---

## 1. Choose the approach

| | **Option A — Subdomain** `events.b2brain.com` | **Option B — Path** `b2brain.com/events/*` |
|---|---|---|
| URL users see | `events.b2brain.com/…` | `b2brain.com/events/…` |
| SEO | First-party subdomain (very good) | First-party path (best; same authority as root) |
| AWS work | One DNS record in Route 53 | New CloudFront distribution in front of the **whole** site (Webflow + Vercel origins) + routing rules |
| Prerequisite | None | You must build CloudFront in front of the live Webflow site (it is **not** behind CloudFront today) |
| Risk | Very low | Higher — you're re-fronting all production traffic |
| Time | ~15 min + DNS/SSL propagation | Half a day + careful testing |

**Recommendation:** start with **Option A (subdomain)** — it is already live and working, fully first-party, changes nothing about the existing Webflow site, and matches `NEXT_PUBLIC_SITE_URL` (`https://events.b2brain.com`). Move to Option B only if SEO specifically requires the `/events` path on the apex.

> **Reality check for Option B (see §0):** b2brain.com is on **Webflow** behind **Webflow's Cloudflare** — there is no AWS CloudFront in front of it today, and no client-controlled Cloudflare to add a Worker to. So Option B means **building a new CloudFront distribution in front of the entire domain**, with Webflow as the default origin. That is real infra work on live production traffic — do it deliberately, test on the `*.cloudfront.net` URL first, and keep the Route 53 record ready to roll back.

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

The site is on **Webflow** and is **not** behind CloudFront today (see §0), so this option means **creating a brand-new CloudFront distribution in front of the whole domain**: Webflow becomes the *default* origin, Vercel becomes the origin for the event paths, and Route 53 repoints from Webflow to CloudFront.

### 3.1 Prerequisites
- Access to the AWS account (CloudFront, ACM, Route 53).
- An **ACM certificate in `us-east-1`** covering `b2brain.com` and `www.b2brain.com` (CloudFront only reads certs from us-east-1).
- The Webflow custom domain (`www.b2brain.com`) must remain configured in Webflow.
- A maintenance window + rollback plan (you're re-fronting live traffic).

### 3.2 Create the distribution with the Webflow (default) origin
1. CloudFront → **Create distribution**.
2. **Default origin = Webflow:**
   - **Origin domain:** `proxy-ssl.webflow.com`
   - **Protocol:** HTTPS only.
   - **Add custom origin header:** `Host: www.b2brain.com` — **mandatory**. Webflow decides which site to serve from the Host header; without this you get a Webflow 404.
   - Name it e.g. `webflow-main`.

### 3.2b Add the Vercel origin
1. Same distribution → **Origins → Create origin**.
2. **Origin domain:** `project-pcxmd.vercel.app`
3. **Protocol:** HTTPS only.
4. **Host header:** send the origin's own host (`project-pcxmd.vercel.app`) so Vercel serves this project. *(Do not forward the viewer `Host: b2brain.com` unless you also add `b2brain.com` as a domain on the Vercel project — the simple, reliable setup is: origin host = the vercel.app host.)*
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

Ordering: CloudFront matches the **most specific** behavior first, so these `/events/*`, `/_next/*` etc. behaviors sit **above** the default behavior. The default (`*`) behavior points at the **`webflow-main`** origin so the rest of the site is unaffected.

### 3.3b Attach domain + certificate, then cut over DNS
1. Distribution **Settings** → **Alternate domain names (CNAMEs):** add `www.b2brain.com` and `b2brain.com`.
2. Attach the **ACM certificate (us-east-1)** covering both.
3. **Test first on the CloudFront URL** (`https://dxxxx.cloudfront.net/...`) before touching DNS — verify Webflow pages *and* the `/events/*` pages both work.
4. **Route 53:** change the `www.b2brain.com` record from the Webflow CNAME to an **ALIAS → the CloudFront distribution** (and the apex `b2brain.com` too if it should flow through CloudFront). Keep the old value noted for rollback.

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
3. Confirm the **rest of the site** (`/`, `/pricing`, `/blogs`, …) still serves from Webflow unchanged (the `webflow-main` default origin).

### 3.6 If pages load but look broken
Almost always a **missing `/_next/*` behavior** (assets 404 against the main origin). Add/verify that behavior and invalidate again.

---

## 4. What NOT to change

- **Do not** move the Sanity project or its `projectId` (`gwr013fi`) — the app reads content from it.
- **Do not** delete the `project-pcxmd.vercel.app` URL; CloudFront (Option B) uses it as the origin, and it's a useful fallback.
- **Do not** point Route 53 directly at Vercel in Option B — the domain records point at **CloudFront**, and CloudFront's path behaviors route `/events/*` to Vercel while the default origin stays on **Webflow**.
- **Do not** remove the Webflow custom-domain config — CloudFront's default origin depends on Webflow still accepting `Host: www.b2brain.com`.

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
