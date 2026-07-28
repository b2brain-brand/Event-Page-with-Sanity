# B2Brain Event Pages — Operating Guide

**Audience:** the B2Brain marketing/content team and whoever maintains the site.
**What this covers:** how to create, edit, publish, and deploy event landing pages day-to-day — no code required for content work.

---

## 1. The 60-second mental model

- Every **event landing page** = **one document** in the Sanity CMS.
- You edit content in a browser (the **Sanity Studio**), press **Publish**, and the live page updates automatically within about a minute.
- The nav bar, footer, and brand styling are **fixed in code** so they always match b2brain.com — you don't (and can't) edit those from the CMS. That's intentional: it stops the two sites drifting apart.
- "Empty hides its slot" — if you leave a field blank, that block simply does not appear on the page. You never get an empty box or a broken layout. Fill in only what you have.

---

## 2. Where everything lives

| Thing | Where | Link |
|---|---|---|
| **Content editor (Sanity Studio)** | Hosted inside the app | `https://<your-domain>/studio` |
| **Live site (current)** | Vercel | `https://project-pcxmd.vercel.app` |
| **Source code** | GitHub | `github.com/b2brain-brand/Event-Page-with-Sanity` |
| **Hosting / deploys** | Vercel dashboard | vercel.com → project "b2brain-events" |
| **CMS project** | Sanity | sanity.io/manage → project `gwr013fi` |

> Log in to Studio with the Google/GitHub account that was invited to the Sanity project. If you can't get in, ask the project admin to invite you at **sanity.io/manage → Members**.

---

## 3. The three kinds of content you can edit

Open **`/studio`**. In the left sidebar you'll see:

1. **Event** — one entry per event landing page (Dreamforce 2026, etc.). This is what you'll touch most.
2. **Events Page** — the copy on the `/events` collection/listing page (hero, stats, FAQ, CTA). There is only one of these.
3. **Site Settings** — global copy defaults (section eyebrows/headings, labels). Optional to touch; every field already falls back to a sensible default in code, so you only override here if you want different wording everywhere.

Supporting lists (used *inside* an event): **Venue**, **Event Series**, **Event Category**.

---

## 4. Create a new event page (step by step)

1. Go to **`/studio`** → **Event** → **Create new**.
2. Fill in the **Overview** tab:
   - **Name** (e.g. "Dreamforce 2026") and **Slug** — click **Generate** to make the slug from the name. The slug becomes the URL: `…/events/dreamforce-2026`.
   - **Start / End date**, **Venue**, **City**, **Industry (Category)**, **Type**.
   - **Card stat / Card audience / Card headline** — the short lines used when this event shows up as a card on other pages. Keep them tight.
3. Fill in the **Hero**, **What / Why / How**, **Stats**, **Gallery**, etc. Leave anything you don't have blank — it hides.
4. **Article (the blog section):** in the article/proof group, write the body using the rich-text editor — headings (H2/H3), paragraphs, lists, quotes, and inline images with **alt text + caption**. The "On this page" table of contents and the sticky "Book a 30m chat" rail are generated automatically from your H2/H3 headings — you don't build them by hand.
   - Add a **Key takeaways** block for the purple TL;DR box at the top.
5. Fill in **FAQ** and any remaining fields.
6. Press **Publish** (bottom right).

The page is live at `https://<your-domain>/events/<slug>` within ~60 seconds.

> **Design is automatic.** You never choose fonts, colours, spacing, or card styles. The system applies the exact b2brain.com look to every event. Just supply content.

---

## 5. Edit an existing event

1. `/studio` → **Event** → pick the event.
2. Change the fields.
3. **Publish.**
4. Wait ~1 minute, then hard-refresh the live page (**Ctrl/Cmd + Shift + R**) to see it.

**Preview before publishing:** use the **draft** state in Studio to review. Unpublished drafts do not appear on the live site.

---

## 6. Images

- Upload images directly in Studio (drag into an image field). They're stored and served by Sanity's CDN — no separate upload step.
- **Always fill in the alt text** (accessibility + SEO). For article images, add a **caption** too if the live design shows one.
- Recommended: landscape images ~1200×675px or larger; the system resizes them.

---

## 7. Publishing & how "going live" works

- **Content change** (you press Publish in Studio) → a **webhook** tells the live site to refresh just that page. Live in ~60s. No deploy needed.
- **Design/feature change** (a developer edits code) → they push to GitHub `main` → Vercel rebuilds and deploys automatically in ~1–2 minutes.

You, as a content editor, only ever use **Publish**. You never touch GitHub or Vercel.

---

## 8. "I published but the page didn't change"

Work through these in order:

1. **Hard-refresh** the page: **Ctrl/Cmd + Shift + R** (browser cache is the #1 cause).
2. Confirm you pressed **Publish**, not just saved a draft. The button says "Publish" and turns grey once published.
3. Wait a full **60–90 seconds** — there's a short cache window.
4. Still stale? A developer can force a refresh by re-triggering the Sanity webhook (Sanity → API → Webhooks → the revalidate hook → "Send test"), or it self-heals within the hourly cache floor.
5. Check you edited the **right document** (e.g. global copy lives in *Site Settings*, not the Event).

---

## 9. Roles & access

- **Content editors** need a Sanity **Editor** invite (sanity.io/manage → Members).
- **Developers** need GitHub repo access + Vercel project access.
- Keep the number of people with **Vercel production** and **Sanity Administrator** access small.

---

## 10. Security housekeeping (one-time, before public launch)

- **Rotate the Sanity API token.** The build token was shared in plain text during development. In **sanity.io/manage → API → Tokens**, delete the old token, create a fresh one, and update it in **Vercel → Settings → Environment Variables** (`SANITY_API_READ_TOKEN`, and `SANITY_API_WRITE_TOKEN` if used by seed scripts). Redeploy.
- Never commit `.env.local` (it's already gitignored).
- Keep `SANITY_REVALIDATE_SECRET` private — it's what stops strangers forcing cache refreshes.

---

## 11. Who to call

| Problem | Owner |
|---|---|
| Content won't publish / Studio login | Sanity project admin |
| Page down / deploy failed | Developer (Vercel dashboard → Deployments → logs) |
| Domain / URL issues | Whoever manages AWS Route 53 (see the *AWS Domain Setup* doc) |
| Design change request | Developer (it's a code change by design) |

---

*Companion documents: **02 — Architecture / How It's Built** (for your technical team) and **03 — AWS Domain Setup** (pointing b2brain.com at this app).*
