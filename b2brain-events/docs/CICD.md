# Deployment & CI/CD

## The short version

**You probably don't need GitHub Actions.** When you imported the repo into
Vercel, Vercel's native Git integration started auto-deploying on every push to
`main` — that is what has been shipping every change so far, and it already
works. Env vars live in the Vercel project; a push triggers a build; done.

The `.github/workflows/deploy.yml` in this repo is an **optional alternative**
for when you want CI to gate deploys on a passing type-check, or you want the
deploy driven by GitHub rather than Vercel. If you keep both, you get **two
deployments per commit** — so pick one (below).

---

## Vercel CLI — what it needs

Three values. You said you already created them:

| Value | What it is | Where to find it |
|---|---|---|
| **Vercel Token** | a personal access token | vercel.com → Account Settings → Tokens → Create |
| **Vercel Org ID** | your team/org id | Vercel project → Settings → General, or `.vercel/project.json` after `vercel link` |
| **Vercel Project ID** | this project's id | same place |

That's the complete list for the CLI. To run it locally:

```bash
cd b2brain-events
vercel pull --yes --environment=production --token=YOUR_TOKEN
vercel build --prod --token=YOUR_TOKEN
vercel deploy --prebuilt --prod --token=YOUR_TOKEN
```

`vercel pull` downloads the project's env vars into `.vercel/.env.*`, so the
build uses the same Sanity tokens and site URL that the dashboard build uses.

---

## The key point about "matching variables across GitHub and Vercel"

**You do NOT need to copy the Sanity tokens into GitHub.** That is the part
worth getting right.

- **App env vars** (`SANITY_API_READ_TOKEN`, `NEXT_PUBLIC_SITE_URL`,
  `SANITY_REVALIDATE_SECRET`, the project id/dataset) live **only in Vercel**.
  `vercel pull` fetches them at build time. One source of truth.
- **GitHub secrets** hold only the **three Vercel-CLI credentials** above —
  nothing Sanity-related.

So there is no list of app variables to keep in sync between two systems. Add
them once in Vercel; GitHub just needs permission to talk to Vercel.

### GitHub secrets to add (only if you use the Action)

Repo → **Settings → Secrets and variables → Actions → New repository secret**:

| Secret name | Value |
|---|---|
| `VERCEL_TOKEN` | your Vercel token |
| `VERCEL_ORG_ID` | your Vercel org id |
| `VERCEL_PROJECT_ID` | your Vercel project id |

Until `VERCEL_TOKEN` exists, the workflow's deploy steps skip cleanly (green,
no-op) — so merging this file will not turn your commits red.

---

## Pick ONE deploy path (don't run both)

### Option A — keep Vercel's native integration (recommended, already working)

Do nothing. Vercel deploys on every push. The Action's type-check job still runs
as a safety net, but its deploy steps stay skipped because you won't add
`VERCEL_TOKEN`. Simplest, and it's the current setup.

### Option B — deploy via GitHub Actions instead

1. Add the three secrets above.
2. Turn **off** Vercel's native auto-deploy so you don't get double builds:
   Vercel → project → **Settings → Git → Ignored Build Step**, set the command to
   `exit 0` (always skip), **or** disconnect the Git repo under Settings → Git.
3. Now GitHub Actions owns deploys: type-check → build → deploy, with a preview
   on every PR.

The Action already sets **Root Directory** correctly by running from
`b2brain-events` and pulling the project config, so the subfolder is handled.

---

## What the workflow does

`.github/workflows/deploy.yml`:

- **`typecheck` job** — runs on every push and PR: `npm ci` + `npm run lint` +
  `npm run typecheck`. Deploys wait on it, so lint or type errors never ship.
- **`deploy` job** — production on push to `main`, a preview URL on PRs. Skips
  entirely if `VERCEL_TOKEN` is unset.

---

## Reminder: content vs. code deploys

Two different "deploys", don't confuse them:

- **Code change** (a `.tsx`, schema, CSS) → push to GitHub → Vercel rebuilds.
  That is what this doc covers.
- **Content change** (editing an event in the Studio) → **no rebuild**. The
  Sanity webhook purges the cache tag and the page updates in seconds. See
  [DEPLOYMENT.md](DEPLOYMENT.md).
