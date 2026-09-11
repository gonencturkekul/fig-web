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
| `product-fig-salami.html` | `tr/incir-sucugu.html` | Fig Salami — story, specification, formats, serving |
| `product-dried-apricot.html` | `tr/kuru-kayisi.html` | Dried Apricot — story, specification, grades, packaging, uses |
| `about.html` | `tr/hakkimizda.html` | About Us — history, values, quality & production, certifications |
| `contact.html` | `tr/iletisim.html` | Contact Us — enquiry form, contact details, FAQ |

The three products sit in a dropdown under **Products** / **Ürünler** in the main
navigation on every page, alongside a link to the full products listing.

## Language switching

The switcher sits at the top right of the header, with a flag and a language
code, and always points at the *same* page in the other language — Products goes
to Ürünler, not back to the home page. Each page carries:

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
  css/styles.css   all styling for every page
  js/main.js       mobile menu, products dropdown, contact form validation
                   (form messages are per-language, keyed off <html lang>)
  img/hero.jpg     home page hero photograph
  img/dried-fig-basket.jpg  dried fig product card photograph
  img/flag-tr.svg, flag-en.svg  language switcher flags
  img/*.svg        logo and product illustrations (hand-written SVG)
```

## Running it locally

Any static server works, for example:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Opening `index.html` directly from the file system also works.

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

- **Brand name** — `Aegean Sun` (also in `assets/img/logo.svg` if you redraw it)
- **Email** — `sales@aegeansun.example`, `quality@aegeansun.example`
- **Phone** — `+90 256 000 00 00` (and the `tel:+902560000000` links)
- **Address** — `Incirliova OSB, 2. Cadde No. 14, 09600 Incirliova / Aydin`
- **Figures and claims** — founding year, capacity, grower count, export markets,
  and the certification list on `about.html`. Only claim certifications you hold.
- **Testimonials** on `index.html` — replace with real, attributable quotes.
- **Product specifications** — the grades, calibres, moisture levels and HS codes
  are typical industry values; confirm them against your own spec sheets.
- **Product range grids** — each product page lists trade grades and pack sizes
  (Lerida 5 kg, Layer 250 g, diced 10×12 mm and so on). These are the formats a
  Turkish dried fruit exporter typically offers; trim them to what you actually pack.

Photography will lift the site further: the illustrations in `assets/img/` are
placeholders sized 4:3 for the product cards, and can be swapped for real photos
with no CSS changes.
