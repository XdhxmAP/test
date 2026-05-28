# Voksera — website

Marketing site for **Voksera**, an influencer-marketing agency for streetwear and
youth-fashion brands. The site's job is to convince a brand to work with Voksera:
clear, premium, editorial, and honest (no invented social proof).

Static HTML/CSS/JS — **no build step, no dependencies, no framework.** Open the
files and they work; drop the folder on any static host and it's live.

---

## Run it locally

It's plain static files, so any static server works. From the project root:

```bash
# Python (preinstalled on most machines)
python3 -m http.server 8000
# then open http://localhost:8000

# …or Node, if you prefer
npx serve .
```

You can also just open `index.html` directly in a browser. The contact form's
background submit needs `http://`/`https://` to talk to Formspree, but everything
else (layout, nav, mobile menu) works from `file://` too.

---

## Project structure

```
.
├── index.html        One-pager: hero · what we do · why · how it works · contact
├── services.html     Fuller breakdown of the offering + pricing model
├── about.html        Founder story (the lead asset in place of case studies)
├── imprint.html      Impressum  — TEMPLATE with placeholders
├── privacy.html      Datenschutzerklärung — TEMPLATE with placeholders
├── terms.html        AGB — TEMPLATE with placeholders
├── css/styles.css    Design system + all components + responsive rules
├── js/main.js        Mobile menu, sticky-header state, contact form, footer year
├── fonts/            Self-hosted fonts (woff2, latin subset)
└── assets/           favicon.svg
```

The nav and footer are duplicated across pages (the trade-off for having no build
step). If you change one, update it everywhere — search for `site-header` and
`site-footer`.

---

## ✅ Before you go live — checklist

1. **Wire up the contact form** (see below) — otherwise it just tells visitors to email.
2. **Fill the legal pages** — `imprint.html`, `privacy.html`, `terms.html` are
   templates. Every placeholder is highlighted on-page and looks like
   `[LIKE THIS]`. See "Legal pages" below.
3. **Confirm the domain** — canonical/Open Graph URLs assume `https://voksera.com`.
   Find-and-replace if that changes.
4. *(Optional)* add a social preview image — see "Social preview" below.

---

## Contact form (Formspree)

The form posts to [Formspree](https://formspree.io). To turn it on:

1. Create a free account at **formspree.io** using **adham@voksera.com**.
2. Create a new form; Formspree gives you an endpoint like
   `https://formspree.io/f/abcdwxyz`.
3. In `index.html`, find the contact `<form>` and replace `YOUR_FORM_ID` in its
   `action` with your real form ID.

Behaviour:
- **With JavaScript:** the form submits in the background (`fetch`) and shows an
  inline success/error message — the visitor never leaves the page.
- **Without JavaScript:** it falls back to a normal POST to Formspree's hosted
  thank-you page.
- **Before you set a real ID:** `js/main.js` detects the `YOUR_FORM_ID`
  placeholder and shows a "please email us at adham@voksera.com" message instead
  of posting to a dead URL — so the site is never broken, just not yet collecting.

Spam protection: a hidden honeypot field (`_gotcha`) is already included.

Want a different service (Getform, etc.) or a pure `mailto:` form instead? Swap the
`action`/handler — the markup is standard. If you change the processor, update
section 4 of the Privacy Policy to match.

---

## Fonts & GDPR

Fonts are **self-hosted** (in `/fonts`), not loaded from the Google Fonts CDN.
That's deliberate: for a German/EU site, loading fonts from Google's servers
transmits visitors' IP addresses to Google and is a well-known GDPR problem. Self-
hosting keeps every request on your own origin — and it's faster. Only the **latin**
subset is shipped (English-only site), so the whole type payload is ~96 KB.

- **Instrument Serif** — editorial display headlines
- **Inter** (variable) — body, UI, navigation

Both are open-source (SIL Open Font License). The `@font-face` rules are at the top
of `css/styles.css`.

---

## Legal pages

`imprint.html`, `privacy.html`, and `terms.html` are **structured templates, not
binding legal text** (there's a comment saying so at the top of each file, plus a
visible note on each page). The Impressum and Privacy Policy are legally required
in Germany/EU; generate the final wording with a tool like
[eRecht24](https://www.erecht24.de) or a lawyer.

Every spot that needs your input is highlighted on-page and written as
`[A PLACEHOLDER]`. The Privacy Policy already documents the contact-form data,
Formspree as a processor, retention, GDPR rights, and the self-hosted fonts —
review and confirm it all matches reality, then delete the yellow build-notes.

---

## Customising

Most of the look lives in CSS custom properties at the top of `css/styles.css`
(`:root`) — colours, fonts, spacing scale, and the fluid type sizes. Change the
palette or type scale there and it updates everywhere.

```css
--paper: #f6f2eb;   /* page background (warm off-white) */
--ink:   #1a1713;   /* near-black accent: headlines, buttons, footer */
```

## Social preview (optional)

Open Graph/Twitter text tags are set on every page. To add a preview image, drop a
1200×630 PNG at `assets/og-image.png` and uncomment the `og:image` lines in each
page's `<head>`.

---

## Deploy

Any static host works — no build, no server code:

- **Netlify / Vercel / Cloudflare Pages:** drag-and-drop the folder, or connect the
  repo. No build command; publish directory is the project root.
- **GitHub Pages:** push and enable Pages on the branch.

Make sure HTTPS is enforced (all of the above do this by default).

---

## Accessibility & responsiveness

- Mobile-first; verified layout intent at ~375 / 430 / 768 / 1280 / 1600 px.
- No horizontal scroll; fluid type and spacing via `clamp()`.
- Semantic landmarks, skip-link, labelled form fields, visible focus states,
  `prefers-reduced-motion` support, and a keyboard-accessible mobile menu
  (Escape to close, focus returned to the toggle).
```
