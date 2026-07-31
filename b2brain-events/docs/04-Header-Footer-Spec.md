# Header & footer — exact spec from live b2brain.com

Extracted 2026-07-31 from `https://www.b2brain.com/` by reading the authored Webflow
CSS rules (not just resolved pixels), so `fr`/`auto` units, hover states and
breakpoints are the real values rather than one viewport's snapshot.

Re-extract with the browser tools if the live site changes; do not hand-edit numbers here.

---

## 1. Design tokens (Webflow CSS variables)

The live site defines 99 variables. These are the ones the chrome uses.

### Colour
| Token | Value |
|---|---|
| `--black` | `black` |
| `--black-70` | `#000000b3` (rgba(0,0,0,.7)) |
| `--white` | `white` |
| `--purple` | `#6c58ba` |
| `--purple-light` | `#e3e0f5` |
| `--orange` | `#ff382c` |
| `--orange-light` | `#ffe4de` |
| `--border-light` | `#f0f0f0` |
| `--cloudy-grey` | `#6b6b6b` |
| `--light-greey` | `#afafaf` |
| `--whitesmoke` | `whitesmoke` |
| `--green` | `#89f86e` · `--pink` `#ff7cc0` · `--yellow` `#ffeb46` · `--ceramic` `#12340c` |

### Type
| Token | Value |
|---|---|
| font family — inter-display | `Interdisplay, Arial, sans-serif` |
| font family — archivo | `Archivo, Arial, sans-serif` |
| font family — satoshi | `"Satoshi Variable", Arial, sans-serif` |
| body-01 / 02 / 03 | `18px` / `16px` / `14px` |
| line-height body-lh-01 / 02 / 03 | `28px` / `24px` / `20px` |
| caption-01 / 02 | `14px` / `13px` |
| letter-spacing caption-ls-01 / 02 | `.56px` / `.26px` |
| weights | regular `400` · medium `500` · semi-bold `600` · bold `700` |

**Font files** (self-host or link): InterDisplay Regular / Medium / SemiBold / Bold `.woff2`,
served from `cdn.prod.website-files.com/69e6119560a70ab3a0930480/…`.

### Layout
| Token | Value |
|---|---|
| container | `1280px` (`--_perimeter---container-section--container`) |
| container-large | `1344px` |
| container side padding | `2.5rem` = 40px (desktop) · `1.25rem` = 20px (≤767px) |

---

## 2. Assets

| Asset | URL |
|---|---|
| Logo (header **and** footer — same file) | `…/69efa4bdf72ec4163c3d5632_B2Brain-Right-Logo-2.webp` |
| Logo alt | header `B2Brain logo` · footer `B2Brain Logo` |
| Instagram | `…/69e6119760a70ab3a0930562_Group%205004.svg` |
| X | `…/6a0a1c99d68593a4c2ebd833_x-logo.svg` |
| Facebook | `…/69e6119760a70ab3a0930563_Group%205001.svg` |
| LinkedIn | `…/69e6119760a70ab3a0930561_Group%205003.svg` |
| YouTube | `…/6a175eab6e860fb6f2b25e71_youtube-social-icon.svg` |

Social SVGs are **self-contained badges** — the white circle and light border are inside
the SVG, not CSS. Do not redraw them; ship the files.

---

## 3. Header

```
.navbar-component            z-index 999 · border-bottom 1px solid black
└ .nav-container             grid · 80px
  ├ .nav-brand > img.website-brand-img
  ├ nav.nav-menu-light       Platform · Use Cases ▾ · Pricing · Events · Blogs
  └ .log-infos               Book a Demo · [Start Free Trial]
```

| Selector | Properties |
|---|---|
| `.navbar-component` | `z-index:999; border-bottom:1px solid var(--black); background:transparent; display:flex; justify-content:center; align-items:center` |
| `.nav-container` | `display:grid; grid-template-columns:max-content 1fr max-content; gap:16px; width:100%; max-width:1280px; height:80px; min-height:80px; padding:0 2.5rem` |
| `.nav-brand` | `width:100%; min-width:195px; max-width:195px; position:relative` |
| `.website-brand-img` | `width:135px; display:block` |
| `.nav-menu-light` | `display:flex; justify-content:center; align-items:center` |
| `.nav-link` | `height:100%; font:400 16px/24px Interdisplay; color:var(--black-70); text-align:center; padding:29px 15px; display:flex; align-items:center` |
| `.nav-link:hover` | `color:var(--black)` |
| `.nav-down-arrow` | `width:16px; height:18px; margin:1px 0 0 4px` |
| `.log-infos` | `display:flex; justify-content:flex-start; align-items:center; width:100%` |
| `.nav-outer-link` | `color:var(--white); font-size:14px; line-height:20px; text-align:center; cursor:pointer` |
| `.nav-try-wrap` | `background:var(--black); align-items:center; margin-left:18px; padding:8px 20px; transition:.4s; display:flex` |
| `.nav-try-wrap:hover` | `background:var(--purple); color:var(--white)` |
| `.nav-try-outside` | `height:20px; overflow:hidden` |
| `.footer-link-line` | `background:var(--black); width:0%; height:1px` — the underline that animates in on the text link |

### Dropdown
| Selector | Properties |
|---|---|
| `.home-drop-list` | `border-style:none solid solid; border-width:1px; border-color:var(--black); background:var(--white); flex-direction:column; width:195px; padding:4px 0; inset:81px auto auto -30%; overflow:hidden` |
| `.home-drop-list.white-bg.pricing` | `width:200px; left:-50%` |
| `.home-drop-list.white-bg.pricing.w--open` | `width:270px` |
| `.home-drop-item` | `gap:14px; border-bottom:1px solid #f0f0f0; justify-content:flex-start; align-items:center; padding:16px 20px 16px 20px; display:flex` |
| `.home-drop-item.opc.last` | `border-bottom-style:none` |

Note the **top border is absent** — the list hangs off the nav's own bottom border.

### Header breakpoints
| ≤991px | `.nav-container` height/min-height `70px` · `.menu-button` shown: `color:#fff; background:#000; padding:7px 16px 5px` · `.menu-button.w--open` background `var(--purple)` · `.nav-menu-light` background white, `padding:0 30px 30px` · `.nav-link` padding-block `20px` · `.nav-try-wrap` margin-left `0` · `.log-infos` hidden, `.log-infos-inside.mobile` shown (`gap:40px; column; margin-top:20px; padding-left:16px`) · dropdown loses all borders |
| ≤767px | `.nav-menu-light` `flex-flow:column` · `.nav-container` `padding:0 1.25rem`, `justify-content:space-between` · `.nav-try-wrap` `margin-bottom:20px` |
| ≤479px | `.nav-container` height `64px` · `.nav-brand` min/max-width `124px` (`.w--current` `128px`) · `.website-brand-img` `width:100%; height:auto` · `.nav-link` `padding:16px 20px 16px 0` |

---

## 4. Footer

```
section.footer
└ .container-fluid
  └ .footer-content
    ├ .footer-wrap                     ← border-bottom 1px black, padding-bottom 80px
    │ ├ .footer-left    (262px)        logo · blurb · socials
    │ └ .footer-right   (771px)        4 × .footer-body
    │   ├ Overview   (76px)
    │   ├ Use cases  (171px)
    │   ├ Company    (94px)
    │   └ ._04       (283px)           newsletter + AI
    └ .footer-copyright                ← pt 24px, pb 32px
      ├ p.copyright-text
      └ .cp-links                       Privacy · Terms
```

| Selector | Properties |
|---|---|
| `.footer` | `display:flex; justify-content:center; width:100%; padding-top:120px` |
| `.container-fluid` | `width:100%; max-width:1280px; margin-inline:auto; padding:0 2.5rem` |
| `.footer-wrap` | `display:flex; justify-content:space-between; width:100%; margin-inline:auto; padding-bottom:80px; border-bottom:1px solid var(--black)` |
| `.footer-left` | `display:flex; flex-flow:column; gap:19px; width:100%; max-width:262px` |
| `.footer-body-l` | `display:flex; flex-direction:column; gap:40px; align-items:flex-start` |
| `.footer-text` | `width:100%; max-width:260px` · `.body-02` → `color:var(--black-70)` |
| `.footer-socials` | `display:flex; gap:10px; align-items:center` (`._02` → gap 20px) |
| `.social-link` | `width:32px; height:32px; transition:.6s` |
| `.social-link:hover` | `transform:translateY(-6px)` |
| `.social-link._02` | `width:24px; height:24px` |
| `.footer-right` | `display:flex; gap:40px; justify-content:space-between; width:100%; max-width:771px` |
| `.footer-body` | `display:flex; flex-flow:column; gap:24px; justify-content:flex-start; align-items:flex-start` |
| `.footer-body._04` | `gap:40px; width:100%; max-width:283px` |
| `.footer-link-list` | `display:flex; flex-flow:column; gap:16px; align-items:flex-start` |
| column heading `h2.caption-01` | `font:600 14px/20px Interdisplay; letter-spacing:.56px; text-transform:uppercase; color:var(--black); margin:0` |
| `.footer-link` | `color:var(--black-70); font:400 16px/24px Interdisplay; white-space:nowrap; transition:color .4s` |
| `.footer-link:hover` | `color:var(--black)` |
| `.footer-link._02` | `color:var(--black); font-weight:500` |
| `.footer-link._03` | `color:var(--black); font-weight:400` |
| `.footer-copyright` | `display:flex; justify-content:space-between; align-items:center; padding-top:24px; padding-bottom:32px` |
| `.copyright-text` | `font:400 16px/24px Interdisplay; letter-spacing:.26px; color:var(--black); margin-bottom:0` |
| `.cp-links` | `display:flex; gap:30px; align-items:center` |
| `.text-link` | `color:var(--black); font-weight:500` · `.text-black70` → `color:var(--black-70)` |
| `.footer-link-wrap` | `overflow:hidden` (clips the animated underline) |

### Newsletter + AI column
| Selector | Properties |
|---|---|
| `.footer-form-wrap`, `.footer-ai-wrap` | `display:flex; flex-flow:column; gap:24px` |
| `.footer-email` | `width:100%; height:100%; border:1px solid var(--black); background:var(--white); font:400 16px/24px Interdisplay; letter-spacing:.26px; color:var(--black); padding:8px 13px 11px 44px; border-radius:0` — rendered box **267×48**, placeholder `Enter your e-mail` |
| `.footer-email:focus` | `border-color:#ececec` |
| `.footer-email::placeholder` | `rgba(0,0,0,.3)` |
| submit `.ct-btn` | 36×36, transparent background |
| AI icon links | 24×24 inline SVG · `color:var(--black)`; `:hover` → `color:var(--orange)`. Classes: `.footer-chatgpt-icon`, `.footer-gemini-icon`, `.footer-claude-icon`, `.footer-grok-icon`, `.footer-perplexity-icon` |
| `.social_share_icon_contain.is-footer` | `display:flex; gap:1rem; align-items:center` |

### Footer content (verbatim)
- **Blurb:** “The Event Intelligence Platform. Turn trade show conversations into booked meetings and measurable pipeline. From Offline to Pipeline.”
- **Overview:** Platform `/platform` · Events `/events` · Blogs `/blogs`
- **Use cases:** New Pipeline Generation `/new-pipeline-generation` · Event Attendees `/event-attendees` · Event Exhibitors `/event-exhibitors`
- **Company:** Book a Demo `/demo` · Pricing `/pricing` · About us `/about`
- **Headings:** `*Subscribe newsletter` · `Learn about B2Brain with AI` (both rendered uppercase by CSS)
- **AI blurb:** “Wondering if B2Brain is right for your team? Ask AI to evaluate pricing, ROI, ideal customer fit, alternatives, implementation requirements, and whether B2Brain deserves a place on your shortlist.”
- **Copyright:** `© 2026 B2Brain, Inc. · Wilmington, DE · support@b2brain.com` (the email is a `.text-link.text-black70`)
- **Legal:** Privacy `/privacy-policy` · Terms `/terms-of-service`
- **Socials:** instagram.com/getb2brain · x.com/getb2brain · facebook.com/b2brain · linkedin.com/company/b2brain · youtube.com/@b2brain/videos

### Footer breakpoints
| ≤991px | `.footer` padding-top `80px` · `.footer-wrap` `flex-flow:column; padding-bottom:60px` · `.footer-left` `margin-bottom:60px` · `.footer-right` `grid-template-columns:1fr 1fr 1fr; max-width:100%` · `.footer-copyright` padding-bottom `30px` |
