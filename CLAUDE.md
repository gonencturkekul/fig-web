# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# OpenWolf

@.wolf/OPENWOLF.md

This project uses OpenWolf for context management. Read and follow .wolf/OPENWOLF.md every session. Check .wolf/cerebrum.md before generating code. Check .wolf/anatomy.md before reading files.

# Design system

**Read `DESIGN.md` before any new development or UI change.** It is the design system extracted from the shipped site: colour, type, spacing and radius tokens (YAML frontmatter, normative), component patterns, and the Do's and Don'ts. New UI elements must reuse those tokens and patterns instead of inventing new values. If a change alters the system (new token, new component pattern), update `DESIGN.md` in the same commit.

# Project

Bilingual (EN/TR) static marketing site for **Aegean Sun**, a Turkish dried fruit exporter, deployed on Vercel at `https://www.aegeansunfruit.com`. Plain HTML, vanilla JS, and two stylesheets: `styles.css` for every page except the two home pages, which use `home.css` (the 2026 redesign, self-hosted Libre Franklin + Source Serif 4). `home.css` ends with a copy of the consent-bar and chat styles; keep it in step with `styles.css`. There is no build step, no package.json, no tests and no linter. `README.md` is the detailed operating manual. Read the relevant section of it before you change analytics, consent, forms or the chat widget.

## Running locally

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

`/_vercel/insights/script.js` returns a 404 locally. That is expected, because Vercel injects it at the edge.

## Architecture

- **No templating: every page is a full, standalone HTML file.** The header, nav (including the Products dropdown and the language switcher), footer, consent-default `<script>` block and meta tags are copied into all 18 pages (9 English pages at the root, 9 Turkish pages under `tr/`). A change to any shared chrome has to be made in every page. Use repo-wide grep or find-and-replace, and check both languages.
- **Language pairs.** Each English page has a Turkish counterpart with a different slug (`products.html` ↔ `tr/urunler.html`, `product-dried-fig.html` ↔ `tr/kuru-incir.html`, etc.; the README has the full table). Each pair is linked through the language switcher, `<link rel="alternate" hreflang>`, the canonical and `og:url` (all absolute on the www host), and `sitemap.xml`. When you add a page, create both versions, wire all of those links, and add the sitemap entry. Under `tr/`, asset paths are prefixed with `../`.
- **`<html lang>` drives the JS language.** `main.js` (nav, dropdowns, contact form validation messages), `consent.js` (the `COPY` object) and `chat.js` (the `KB` answers) each choose EN or TR from it. None of them keeps per-page config.
- **`assets/js/main.js`** loads on every page. It handles the mobile menu, hover/click dropdowns (the desktop breakpoint is 981px), and contact and newsletter form validation. A form with no `action` stays in **demo mode** and shows success without sending anything. Once `action` is set, the script hands submission back to the browser.
- **`assets/js/chat.js`** loads on the two home pages only. It is a keyword-matching assistant with no backend. Its answers live in the `KB` object, and each answer must restate a fact already published on the site.
- **`assets/js/consent.js` and analytics.** The site uses *basic* consent mode on purpose. Every `<head>` only declares denied consent defaults. On Accept, `consent.js` pushes `consent_decision`, sends `consent update` (only `analytics_storage`), and then loads GTM container `GTM-P398DTWM`. GA4 (`G-YSX5V6H7JQ`) is a tag *inside* that container. Choice is stored in `localStorage` key `aegeansun-cookie-consent`. Vercel Web Analytics runs separately and needs no cookies or consent.

## Invariants (deliberate, do not "fix")

- Do not add a `gtag.js` loader, a `gtag('config', …)` call, a top-of-`<head>` GTM snippet, or the GTM `<noscript>` iframe. Each one either double-counts page views or reaches Google before consent, which would make the privacy page untrue.
- Keep Decline as prominent as Accept. The consent bar has no close/X button and no "by continuing you agree" text. The footer's *Cookie preferences* link (`data-consent-open`) reopens it.
- Do not grant ad consent types. The bar asks one question, about measurement only.
- `privacy.html` / `tr/gizlilik.html` describe what the site actually does. If you change data flows (forms, analytics, processors), update both privacy pages to match.
- The domain and the contact e-mail (`muzaffer.turkekul@aegeansunfruit.com`) are repeated across all pages, the sitemap, `robots.txt`, the JSON-LD on the home pages, and `chat.js`. Change them with a repo-wide replace.
- Company details, figures, certifications, testimonials and product specs are placeholders/typical values (see "Before going live" in the README). Do not invent new claims.
