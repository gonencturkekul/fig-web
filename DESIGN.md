---
name: Aegean Sun
description: Sun-dried Aegean figs, fig salami, apricots and mulberries, presented to trade buyers on cream paper in fig-plum ink.
colors:
  fig: "#5b2c53"
  fig-dark: "#3d1c38"
  fig-light: "#8a4c7f"
  apricot: "#e08b3c"
  apricot-lt: "#f4b76a"
  apricot-ink: "#a4561a"
  leaf: "#4a6b3d"
  cream: "#fdf8f1"
  sand: "#f3e7d7"
  white: "#ffffff"
  ink: "#2b2320"
  ink-soft: "#6b5f57"
  border: "#e6d8c6"
  input-border: "#9c8b78"
  error: "#b3261e"
  leaf-dark: "#33502a"
  pale: "#fbeedd"
  muted: "#5e534c"
typography:
  home-display:
    fontFamily: "\"Libre Franklin\", \"Arial Narrow\", Arial, sans-serif"
    fontSize: "clamp(3.1rem, 1rem + 5vw, 6.25rem)"
    fontWeight: 700
    lineHeight: 0.92
    letterSpacing: "-0.035em"
  home-head:
    fontFamily: "\"Libre Franklin\", \"Arial Narrow\", Arial, sans-serif"
    fontSize: "clamp(2rem, 1.3rem + 3.2vw, 4rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.03em"
  home-lead:
    fontFamily: "\"Libre Franklin\", \"Arial Narrow\", Arial, sans-serif"
    fontSize: "clamp(1.25rem, 1.1rem + 0.7vw, 1.625rem)"
    fontWeight: 700
    lineHeight: 1.1
  home-body:
    fontFamily: "\"Source Serif 4\", Georgia, \"Times New Roman\", serif"
    fontSize: "clamp(1.0625rem, 1rem + 0.25vw, 1.1875rem)"
    fontWeight: 400
    lineHeight: 1.55
  home-small:
    fontFamily: "\"Source Serif 4\", Georgia, \"Times New Roman\", serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  display:
    fontFamily: "Georgia, \"Times New Roman\", serif"
    fontSize: "clamp(2.1rem, 5vw, 3.3rem)"
    fontWeight: 700
    lineHeight: 1.2
  headline:
    fontFamily: "Georgia, \"Times New Roman\", serif"
    fontSize: "clamp(1.6rem, 3.4vw, 2.3rem)"
    fontWeight: 700
    lineHeight: 1.2
  title:
    fontFamily: "Georgia, \"Times New Roman\", serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.2
  slogan:
    fontFamily: "Georgia, \"Times New Roman\", serif"
    fontSize: "clamp(1.25rem, 2.4vw, 1.7rem)"
    fontWeight: 400
    lineHeight: 1.35
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.65
  lead:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif"
    fontSize: "1.1rem"
    fontWeight: 400
    lineHeight: 1.65
  button:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif"
    fontSize: "0.98rem"
    fontWeight: 600
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    letterSpacing: "0.08em"
rounded:
  xs: "4px"
  sm: "8px"
  md: "14px"
  media: "20px"
  pill: "999px"
  circle: "50%"
spacing:
  xs: "8px"
  sm: "14px"
  md: "20px"
  gutter: "22px"
  lg: "26px"
  xl: "40px"
  section-tight: "48px"
  section-mobile: "54px"
  section: "72px"
components:
  button-primary:
    backgroundColor: "{colors.fig}"
    textColor: "{colors.white}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "13px 26px"
  button-primary-hover:
    backgroundColor: "{colors.fig-dark}"
    textColor: "{colors.white}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.fig}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "13px 26px"
  button-ghost-hover:
    backgroundColor: "{colors.fig}"
    textColor: "{colors.white}"
  button-ghost-light:
    backgroundColor: "transparent"
    textColor: "{colors.white}"
    rounded: "{rounded.pill}"
    padding: "13px 26px"
  button-ghost-light-hover:
    backgroundColor: "{colors.white}"
    textColor: "{colors.fig-dark}"
  button-light:
    backgroundColor: "{colors.white}"
    textColor: "{colors.fig-dark}"
    rounded: "{rounded.pill}"
    padding: "13px 26px"
  button-light-hover:
    backgroundColor: "{colors.sand}"
  consent-button:
    rounded: "{rounded.pill}"
    padding: "12px 26px"
    height: "44px"
  card:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.md}"
    padding: "28px"
  product-card-body:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.md}"
    padding: "24px"
  format-card:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.md}"
    padding: "20px 22px"
  form-card:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.md}"
    padding: "32px"
  input:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "12px 14px"
    height: "44px"
  input-focus:
    backgroundColor: "{colors.white}"
  tag:
    backgroundColor: "rgba(74, 107, 61, 0.10)"
    textColor: "{colors.leaf}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "4px 11px"
  nav-link:
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "10px 14px"
    height: "44px"
  nav-link-hover:
    backgroundColor: "{colors.sand}"
    textColor: "{colors.fig-dark}"
  nav-link-active:
    textColor: "{colors.fig}"
  icon-badge:
    backgroundColor: "{colors.sand}"
    textColor: "{colors.fig}"
    rounded: "{rounded.circle}"
    size: "44px"
  chat-chip:
    backgroundColor: "{colors.white}"
    textColor: "{colors.fig}"
    rounded: "{rounded.pill}"
    padding: "7px 14px"
    height: "44px"
---

<!--
  DESIGN.md for the Aegean Sun marketing site.
  Extracted (scan mode) from the shipped code: assets/css/styles.css (tokens in :root),
  the EN pages at the root, and the icon sprite assets/img/icons.svg.
  The YAML frontmatter above is normative. The prose below explains where and why each
  token is used. Machine-readable extensions (tonal ramps, shadows, motion, breakpoints,
  component snippets) live in .impeccable/design.json; regenerate it whenever this file changes.
-->

# Design System: Aegean Sun

## Overview

**Creative North Star: "The Sun-Drying Yard"**

Read this file before any new UI work in this repo; new elements reuse these tokens and patterns rather than inventing values.

The site should feel like standing in an Aegean drying yard in late summer: warm, sunlit and handmade. Real produce photography (figs on wooden trays, sliced fig salami on brown paper) carries the story, laid on cream paper rather than clinical white, written in a deep fig-plum ink and warmed by apricot. It is a persuasion surface for trade buyers, so the warmth always sits on top of hard facts: specification tables, grades, formats and a clear route to an enquiry.

Density is relaxed but purposeful. Sections breathe on a 72px rhythm inside a 1140px column, and each section has one job. Structure comes from hairline dividers and tonal bands (cream, sand, white) far more than from boxes; where cards exist they are soft, white, gently rounded and lift a few pixels when touched. Components are warm and confident: rounded pill buttons, soft lift on hover, generous padding.

Dark fig surfaces (the home hero gradient, inner-page banners, the footer) frame the page top and bottom, and a single apricot band near the end of most pages carries the closing call to action. Everything is drawn with system fonts and one line-icon family, so the site loads instantly on any connection a buyer happens to be on.

**Key Characteristics:**
- Cream paper ground, fig-plum ink, apricot warmth, leaf green for natural and organic signals.
- Real photography in 4:3 windows and a portrait 9:16 film frame; no illustration or stock abstraction.
- Georgia serif headings over a system sans body; no webfonts.
- Pill-shaped actions, 14px containers, 8px controls.
- Hairline-divided lists and tonal section bands instead of grids of identical cards.
- One focus ring, 44px targets everywhere, 16px minimum input text.

## Colors

A warm, earthy palette: one fig-plum family for ink and action, one apricot family for warmth, a leaf green for natural cues, and cream and sand paper neutrals.

### Primary
- **Fig Plum** (#5b2c53): the single action and link colour. Primary buttons, links, active nav, icon strokes inside badges, step numbers, the chat launcher, the focus ring on light surfaces.
- **Dried Fig Skin** (#3d1c38): headings on light surfaces, button hover, the inner-page banner and footer background, the darkest end of the hero gradient, and the focus ring inside the apricot CTA band.
- **Fig Flesh** (#8a4c7f): the light end of the hero gradient and the outline of chat suggestion chips. Never body text.

### Secondary
- **Sun Apricot** (#e08b3c): fills and decoration only. The CTA band gradient start, the active-nav underline, the large opening quote mark.
- **Apricot Glow** (#f4b76a): accents on dark fig surfaces: hero statistics, footer link hover, the hero glow, the focus ring on dark surfaces, and the CTA band gradient end.
- **Apricot Ink** (#a4561a): the same hue darkened to pass 4.5:1, used whenever apricot must be small text on cream or white (format meta labels, the brand sub-line).

### Tertiary
- **Orchard Leaf** (#4a6b3d): natural and organic signals. Product tags (on a 10% leaf tint), checklist dots, success messages.

### Neutral
- **Cream Paper** (#fdf8f1): the page ground, input fill, chat log, and the translucent sticky header.
- **Drying Sand** (#f3e7d7): alternate section bands, icon-badge discs, hover fill for nav and menu items, image placeholders behind photos.
- **Raised White** (#ffffff): raised surfaces only: cards, forms, dropdowns, quotes, the consent bar, white section bands.
- **Walnut Ink** (#2b2320): body text. Also the tint of every shadow.
- **Soft Walnut** (#6b5f57): secondary copy, lead paragraphs, card descriptions, notes.
- **Linen Hairline** (#e6d8c6): every divider and card border. Decorative only; too light to bound a control.
- **Control Edge** (#9c8b78): input borders, chosen for 3:1 against cream and white.
- **Error Red** (#b3261e): required markers, invalid field borders and error text. It is a literal in the stylesheet, not yet a custom property.

### Named Rules
**The Apricot Ink Rule.** Sun Apricot is for fills and decoration only. Any apricot text on a light background uses Apricot Ink; on dark fig surfaces use Apricot Glow.

**The One Voice Rule.** Fig Plum is the only action colour. Every primary button, link and active state is fig; apricot never becomes a button fill on light pages.

**The Cream Paper Rule.** The page is cream, not white. White marks something raised above the paper (a card, a form, a dropdown) or a deliberate white band.

## Typography

**Display Font:** Georgia (with "Times New Roman", serif)
**Body Font:** System UI stack (-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif)
**Label/Mono Font:** Monospace appears only for cookie names in the consent table (ui-monospace stack).

**Character:** A sturdy, bookish serif in bold gives headings the feel of a printed trade catalogue; the neutral system sans keeps specifications and long copy crisp and fast.

### Hierarchy
- **Display** (700, clamp(2.1rem, 5vw, 3.3rem), 1.2): page h1, in the hero and the inner-page banner.
- **Headline** (700, clamp(1.6rem, 3.4vw, 2.3rem), 1.2): section h2.
- **Title** (700, 1.25rem, 1.2): card and list h3; feature items and steps step down to 1.15rem and 1.05rem.
- **Slogan** (400, clamp(1.25rem, 2.4vw, 1.7rem), 1.35): one centred serif line in fig, capped at 28ch. Georgia at regular weight also sets quotes (1.08rem) and the big figures (hero stats, about-page numbers) in bold.
- **Body** (400, 17px, 1.65): all running copy; drops to 16px under 620px. Transcript and legal copy cap at 70ch; section intros at 720px.
- **Lead** (400, 1.1rem): the first paragraph under a section heading, in Soft Walnut.
- **Button** (600, 0.98rem): button and nav labels.
- **Label** (700, 0.75rem, 0.08em, uppercase): product tags, format meta, table column heads and footer column titles (0.82rem, 0.14em). 12px is the smallest text on the site.

### Named Rules
**The No-Webfont Rule.** On every page except the two home pages, display is Georgia and body is the system stack, by decision. The home pages (2026 redesign) use Libre Franklin and Source Serif 4, self-hosted from `assets/fonts/` (latin + latin-ext, about 85 KB on an English page). Never load fonts from Google's servers: that would reach Google before consent.

**The 16px Floor Rule.** Every input, select and textarea is at least 1rem, so iOS never zooms on focus. Nothing on the site is smaller than 12px (0.75rem).

## Layout

A single centred column (1140px max, 22px side gutters) carries every page. Sections stack vertically at 72px top and bottom (48px for tight sections, 54px under 620px) and alternate between cream, sand and white bands to separate topics without borders. Section heads cap at 720px and can centre.

Inside sections, content uses 2-, 3- and 4-column grids with a 26px gap, a 1:1 split row with a 52px gap for photo-and-copy, a 1.25:0.75 contact grid, an auto-fill format grid (260px minimum, which yields three columns in the wrap), and a four-step process row. Buttons sit in a wrapping row with a 14px gap.

Responsive behaviour uses one main breakpoint, 980px, for both the nav collapse and the grid collapse, so the header never changes layout at a different width than the page. Below it, split rows, the hero and the contact grid go to one column, the hero photo moves above the copy at 3:2, and four-column grids go to two. At 620px, grids go to one column except the format grid (two small cards per row) and the hero stats (three in a row). The consent bar compacts at 820px. 360px tightens the header lockup.

**The Divided List Rule.** Parallel benefits are a feature list: items separated by hairline top borders, each with a 44px icon badge beside its heading, in three columns on desktop and one on mobile. Hairlines carry the structure; nothing is a box inside a box.

## Elevation & Depth

A hybrid system: tonal layering (cream paper, sand bands, white raised surfaces) does most of the work, and soft, warm shadows tinted with Walnut Ink add lift to raised things. Shadows are ambient, never structural, and they deepen on interaction.

### Shadow Vocabulary
- **Resting** (`box-shadow: 0 1px 3px rgba(43, 35, 32, .08)`): cards, product and format cards, quotes, the map, primary buttons at rest.
- **Lifted** (`box-shadow: 0 8px 24px rgba(43, 35, 32, .10)`): hover state of cards and primary buttons; dropdowns, form cards, split-row photos, the video frame, the chat launcher.
- **Floating** (`box-shadow: 0 20px 48px rgba(43, 35, 32, .14)`): the hero photo and the open chat panel.
- **Consent edge** (`box-shadow: 0 -8px 28px rgba(43, 35, 32, .14)`): upward shadow of the fixed consent bar only.

### Named Rules
**The Soft Lift Rule.** Interactive raised things rise on hover: buttons 2px, format cards 3px, product cards 4px, with the shadow stepping from Resting to Lifted. On press they return to 0 and drop the shadow.

**The Warm Shadow Rule.** Every shadow is tinted Walnut Ink (rgba(43, 35, 32, ...)), never pure black, so depth stays warm on cream.

## Shapes

The form language is soft and rounded, never sharp. Actions are full pills (999px): buttons, consent buttons, the language switcher, tags, chat chips and the harvest-news badge. Containers use gentle 14px corners (cards, dropdowns, quotes, FAQ items, the video frame, the chat panel). Small controls use 8px (inputs, nav items, the menu toggle, status messages). Large photographs use 20px windows (the hero photo is 22px). Circles mark icon badges, step numbers and checklist dots.

Photographs are clipped into fixed windows: 4:3 for product cards and split rows, 3:2 for the hero on mobile, and portrait 9:16 for the film. Borders are 1px Linen Hairline on containers; buttons carry a 2px border so ghost and filled variants are the same size.

**The Pill Action Rule.** If it is an action, it is a pill. If it holds content, it is 14px. If it takes input, it is 8px.

## Components

### Buttons
Warm and confident: rounded pills with generous padding that lift softly when touched.
- **Shape:** full pill (999px), 2px border on every variant.
- **Primary:** Fig Plum fill, white text, 13px by 26px, Resting shadow. Hover darkens to Dried Fig Skin and raises to the Lifted shadow.
- **Hover / Focus:** rise 2px over 0.15s; press returns to 0 with no shadow. Focus uses the global ring at 3px offset.
- **Ghost:** transparent with a 2px fig outline and fig text; hover fills fig with white text. The second action beside a primary.
- **Ghost light:** for dark fig surfaces (the hero): white text, 70% white outline; hover fills white with Dried Fig Skin text.
- **Light:** white fill, Dried Fig Skin text; hover sand. For dark or coloured bands.

### Chips
- **Product tag:** uppercase label in Orchard Leaf on a 10% leaf tint, pill-shaped, sitting above the product name. Truncates rather than wraps.
- **Chat chips and links:** white pills at 44px height with a Fig Flesh (chips) or hairline (links) border and fig text; hover sand.

### Cards / Containers
- **Corner Style:** 14px.
- **Background:** Raised White on cream or sand (on sand bands, icon badges flip to white).
- **Shadow Strategy:** Resting at rest, Lifted on hover for product and format cards (see Elevation & Depth).
- **Border:** 1px Linen Hairline.
- **Internal Padding:** 28px for general cards, 24px for the product-card body, 20px by 22px for format cards, 32px for form cards.
- **Product card:** a 4:3 photo window over a body with tag, title, short description and a bold fig link pinned to the bottom.
- **Format card:** uppercase Apricot Ink meta line, serif title, one short line of detail, used for grades and varieties.

### Inputs / Fields
- **Style:** Cream fill, 1px Control Edge border, 8px corners, 12px by 14px padding, 44px minimum height, 1rem text. Labels sit above in 600 weight Dried Fig Skin.
- **Focus:** 2px fig outline at 1px offset, fig border, and the fill brightens to white.
- **Error:** Error Red border on a pale red fill, with linked error text below at 0.84rem. Required asterisks are Error Red and hidden from assistive tech.
- **Status:** success messages on a leaf tint, errors on pale red, both with 8px corners.

### Navigation
- **Style:** a sticky header of translucent cream (94%) with an 8px backdrop blur and a hairline bottom border, at least 74px tall. The brand lockup is a 44px mark beside a Georgia wordmark and an uppercase Apricot Ink sub-line.
- **Links:** 600 weight, 44px tall, 8px corners, Walnut Ink; hover fills sand with Dried Fig Skin text. The current page is fig with a 2px apricot underline drawn as an inset shadow.
- **Dropdown:** white, 14px corners, Lifted shadow, with a pointer bridge so it does not close on the way down. The Products dropdown lists each product with a small Soft Walnut description.
- **Language switcher:** a pill button with the flag and language code, separated from the menu by a hairline; under 620px it shows the flag alone.
- **Mobile (under 980px):** a 44px bordered toggle opens a full-width stacked menu; dropdowns indent behind a 2px hairline, and the header CTA becomes a full-width pill.

### Icon Badge
A drawn line icon (22px) in Fig Plum inside a 44px Drying Sand disc. It is decoration (aria-hidden); the meaning lives in the heading beside it. Icons come only from the sprite: 24px grid, 1.75 stroke, round caps and joins, no fill, coloured by currentColor.

### Hero and Banner
The home hero is a 135-degree gradient from Dried Fig Skin through Fig Plum to Fig Flesh, with a soft Apricot Glow radial in the top-right corner, a floating 22px photo whose top aligns with the h1, and three apricot statistics over a faint white rule. Inner pages use a flat Dried Fig Skin banner with a breadcrumb trail.

### CTA Band
A 120-degree gradient from Sun Apricot to Apricot Glow, holding one headline, one sentence in Dried Fig Skin and one primary button. It closes most pages; the focus ring inside it switches to Dried Fig Skin.

### Quote
A white 14px card with a large Georgia opening mark in Sun Apricot at the top left, the quote in serif Dried Fig Skin, and the attribution in Soft Walnut.

### Video Frame
A portrait 9:16 frame, capped at 420px wide and 80vh tall, 14px corners, Lifted shadow, near-black walnut letterbox (#241d1b), contain-fit so the film is never cropped. A transcript disclosure sits below at the same width.

### Consent Bar
A fixed white bar with a hairline top and the Consent edge shadow. Accept is a fig pill, Decline is a fig-outlined pill of the same size, padding and weight. There is no close button.

**The Equal Decline Rule.** Decline is always the same size, padding, weight and prominence as Accept. Never demote it to a link or a lighter style.

**The One Ring Rule.** One focus ring for the whole site: 3px solid Fig Plum at 2px offset on light surfaces, Apricot Glow on dark fig surfaces (hero, banner, footer, chat header), Dried Fig Skin inside the apricot CTA band. Components do not invent their own focus treatments.

**The 44px Rule.** Every link, button, summary, chip and control has a hit area of at least 44 by 44px, padded out without changing its look when needed.

## Do's and Don'ts

### Do:
- **Do** use Apricot Ink (#a4561a) for any apricot-coloured text on cream or white; keep Sun Apricot (#e08b3c) for fills, gradients and decoration.
- **Do** draw every icon from the sprite with `<svg class="icon"><use href="assets/img/icons.svg#i-NAME"/></svg>`: line style, 1.75 stroke, currentColor. Add new symbols to the sprite in the same style.
- **Do** present parallel benefits as a hairline-divided feature list with 44px icon badges rather than a grid of identical cards.
- **Do** rely on the single global focus ring (fig on light, Apricot Glow on dark, Dried Fig Skin in the CTA band).
- **Do** give every interactive element a 44px minimum target and set inputs at 16px (1rem) or larger.
- **Do** keep Decline equal in size and weight to Accept in the consent bar.
- **Do** frame the film in a portrait 9:16 frame capped at 420px wide and 80vh tall.
- **Do** make actions pill-shaped (999px) with the Soft Lift hover, containers 14px, controls 8px.
- **Do** tint shadows with Walnut Ink and pick from the Resting, Lifted and Floating steps.
- **Do** use real produce photography cropped into fixed 4:3 windows, with sand behind it as the loading placeholder.

### Don't:
- **Don't** set small text in Sun Apricot (#e08b3c) on light backgrounds; it fails 4.5:1.
- **Don't** use emoji, icon fonts or one-off inline SVGs as icons.
- **Don't** build rows of decorative look-alike cards for benefits or contact details.
- **Don't** use side-stripe or border-left accents on quotes, callouts or cards; the quote uses its apricot opening mark instead.
- **Don't** load webfonts from a third-party host. Georgia and the system stack are the type for inner pages; the home pages' self-hosted Libre Franklin and Source Serif 4 are the only webfonts.
- **Don't** add per-component focus styles or remove the ring.
- **Don't** give the consent bar a close button, demote Decline, or add "by continuing you agree" text.
- **Don't** put the portrait film in a 16:9 frame.
- **Don't** use pure white as the page ground or pure black shadows.

## Home pages (2026 redesign): "One motif, the sun"

`index.html` and `tr/index.html` use their own stylesheet, `assets/css/home.css`, and a stricter, flatter version of this system. When the inner pages are redesigned they should move to it. Colours are the same brand palette; the type, shapes and depth rules below replace the ones above **on the home pages only**.

**The idea.** The sun that dries the fruit, which also names the company, is the only shape with character. It appears at four scales: the giant apricot disc in the hero (about 120vh across, cropped by the viewport, rising into place on load); the round window every photograph sits in; the filled dot used as a bullet and beside the wordmark; and the footer sunrise behind a row of drying trays. Do not add a second motif (no blobs, arches or hexagons).

**Type.** Libre Franklin 700 for display, headings, buttons and labels; Source Serif 4 for reading. Five steps (`home-*` in the frontmatter). The hero h1 is uppercase; every other heading is sentence case. Every heading stays at two lines or fewer at every width, in both languages.

**Colour roles.** Cream ground; Walnut Ink text; Fig Plum for every action; Sun Apricot as the motif fill and as whole fields (the hero sun, the film plate, the enquiry coupon); Dried Fig Skin for the chain panel and footer; Leaf Dark (#33502a) for the regions band; Pale (#fbeedd) for text on dark fields; Muted (#5e534c, 6.9:1 on cream) for secondary notes.

**Shapes and depth.** Photographs are round (`border-radius: 50%`). Actions are pills. Panels and fields are square-cornered. No gradients, no shadows at rest, no hairline dividers, no icon cards, no eyebrow labels. The only shadows are on things that truly float: the language menu, the consent bar and the chat panel. Surfaces are separated by a change of field colour.

**Sections.** Hero (sun) → the range as a two-column trade catalogue with sun-dot bullets → the chain (inset fig panel, round photo cropped by its edge) → process tiles that grow in size → the film on a square apricot plate with caption tabs → the regions band → buyer quotes (portrait and offset quotation) → the enquiry coupon → the footer mark.

**The live enquiry label.** The enquiry form is drawn as a carton label: choices fill the label on the left, sending opens a pre-written e-mail (no form backend yet). Grades and packs per product live in `CATALOGUES` in `assets/js/home.js` in both languages; keep them in step with the product pages.

**Motion.** Sections enter once, their parts rising 24px in sequence. The hero sun rises into place; the hero photo is visible from the first frame (it is the LCP) and only settles from a slight zoom. Region photos drift with scroll where supported. Everything has a `prefers-reduced-motion` fallback.

**Shared widgets.** The consent bar and chat widget keep their existing design; `home.css` carries a copy of their styles from `styles.css`, mapping the old token names on each widget's root.
