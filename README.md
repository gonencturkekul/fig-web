# Aegean Sun — dried fruit marketing website

A static marketing website for a dried fruit business, built with plain HTML, CSS
and vanilla JavaScript. No build step, no dependencies, no framework — open the
files in a browser or drop the folder on any static host.

## Pages

The site is bilingual. English lives at the root, Turkish under `tr/`, and every
page links to its counterpart in the other language.

| English | Turkish | Page |
| --- | --- | --- |
| `index.html` | `tr/index.html` | Home — hero, product preview, why-us, process, regions, contact section |
| `products.html` | `tr/urunler.html` | Products — full range, packaging, wholesale & export, comparison table |
| `product-dried-fig.html` | `tr/kuru-incir.html` | Dried Fig — story, specification, grades, packaging, uses |
| `product-fig-salami.html` | `tr/incir-salami.html` | Fig Salami — story, specification, formats, serving |
| `product-dried-apricot.html` | `tr/kuru-kayisi.html` | Dried Apricot — story, specification, grades, packaging, uses |
| `product-dried-mulberry.html` | `tr/kuru-dut.html` | Dried Mulberry — story, specification, packaging, uses |
| `about.html` | `tr/hakkimizda.html` | About Us — history, values, quality & production, certifications |
| `contact.html` | `tr/iletisim.html` | Contact Us — enquiry form, contact details, FAQ |

The four products sit in a dropdown under **Products** / **Ürünler** in the main
navigation on every page, alongside a link to the full products listing.

## Language switching

The switcher sits at the top right of the header: a button showing the current
language's flag and code, which opens a list underneath it with English first
(the site default) and Türkçe below. Each entry points at the *same* page in the
other language — Products goes to Ürünler, not back to the home page. Each page
carries:

- `<html lang="en">` or `<html lang="tr">`, which also selects the language of
  the contact form's validation messages (see `assets/js/main.js`)
- `<link rel="alternate" hreflang="...">` tags pairing the two versions

To add a page, create both language versions, link each one's switcher to the
other, and add the `hreflang` pair to both.

**Before launch:** search engines want *absolute* URLs in `hreflang`, so once the
domain is known, change e.g. `href="tr/urunler.html"` to
`href="https://yourdomain.com/tr/urunler.html"` in every page's `<head>`. The
relative versions in place now are correct for local use and for browsing the
files directly.

There is no automatic redirect by browser language: a visitor always lands on the
version they were linked to and switches by hand.

## Structure

```
assets/
  video/fig-journey.mp4   film: home page process section and Dried Fig pages
  css/styles.css   all styling for every page
  js/main.js       mobile menu, products dropdown, contact form validation
  js/chat.js       sales assistant widget, home pages only
                   (form messages are per-language, keyed off <html lang>)
  img/hero.jpg     home page hero photograph
  img/dried-fig-basket.jpg  dried fig photograph, home page card
  img/dried-fig.webp        dried fig photograph, products pages
  img/dried-apricot.webp    dried apricot photograph
  img/fig-salami.webp       fig salami photograph
  img/dried-mulberry.webp   dried mulberry photograph
  img/fig-box.webp          boxed dried figs, Products and About pages
  img/fig-drying.webp       figs drying in the field, home and About pages
  img/logo-mark.webp        logo emblem, header and footer
  img/logo-mark.png         same emblem at 96 px, used as the favicon
  img/logo-caramel-fig.png  full Caramel Fig lockup (emblem + wordmark), not yet placed
  img/flag-tr.svg, flag-en.svg  language switcher flags
```

## Running it locally

Any static server works, for example:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Opening `index.html` directly from the file system also works.

## The sales assistant

Both home pages load `assets/js/chat.js`, which puts a small assistant in the
bottom right corner. It is deliberately plain: no backend, no API key and no
third-party script, so it costs nothing and cannot leak anything. It matches
the visitor's words against a list of keywords and replies with a fixed answer,
picking Turkish or English from `<html lang>`.

Every answer in it is a fact that already appears on this site — MOQ, incoterms,
lead times, certificates, samples, addresses, the representatives. When nothing
matches, it says so and hands the visitor the enquiry form, the e-mail address
and the phone number rather than guessing.

To add or change an answer, edit the `KB` object near the top of the file. Each
entry is:

```js
{ id: "moq",
  k:  ["minimum", "moq", "palet"],   // keywords, accent- and case-insensitive
  a:  "One pallet (roughly 500 kg) …", // the reply
  links: [["FAQ", L.faq]],             // buttons under the reply
  next:  ["Delivery time", "Price list"] }  // suggested follow-up chips
```

Keep `a` to something the site itself says; that is the whole point of it.

To put it on more pages, add `<script src="assets/js/chat.js" defer></script>`
to that page (`../assets/js/chat.js` under `tr/`).

If you want a real AI assistant instead — one that answers in its own words —
it needs a server to hold the API key, because anything in the browser is
public. On Vercel that is one serverless function under `api/`, the key stored
as an environment variable, and `chat.js` posting to it. That is a separate
job, and it costs per message.

## Making the contact form live

The form on `contact.html` validates in the browser and, with no `action` set,
stays in demo mode: it shows a success message without sending anything.

To receive real enquiries, set the form's `action` to your endpoint:

```html
<form id="contact-form" method="post" action="https://formspree.io/f/XXXXXXX">
```

Any form service (Formspree, Netlify Forms, Getform) or your own backend
handler works — the script hands submission over to the browser as soon as an
`action` is present, and the field `name` attributes (`name`, `company`, `email`,
`phone`, `country`, `product`, `quantity`, `reason`, `message`) are posted as-is.

## Before going live — replace the placeholders

The copy is written as a complete, realistic site, but the company details are
placeholders. Search and replace **in both languages** (the root files and `tr/`):

- **Brand name** — `Aegean Sun` (the logo artwork lives in `assets/img/logo-mark.webp`, `assets/img/logo-mark.png` and `assets/img/logo-caramel-fig.png`)
- **Address** — the sales office (Istanbul / Kağıthane), factory (Aydın /
  Nazilli) and production plant (Athens) lines, in the footer, the contact page
  and the home page card
- **Figures and claims** — founding year, capacity, grower count, export markets,
  and the certification list on `about.html`. Only claim certifications you hold.
- **Testimonials** on `index.html` — replace with real, attributable quotes.
- **Product specifications** — the grades, calibres, moisture levels and HS codes
  are typical industry values; confirm them against your own spec sheets.
- **Product range grids** — each product page lists trade grades and pack sizes
  (Lerida 5 kg, Layer 250 g, diced 10×12 mm and so on). These are the formats a
  Turkish dried fruit exporter typically offers; trim them to what you actually pack.

Every picture on the site is a photograph or the logo artwork; the only
drawings left are the two language flags. Any of them can be swapped the same
way: drop the file in `assets/img/` and point the `<img>` at it. Product images are cropped to a
4:3 window, so any shape of source photograph fits.
