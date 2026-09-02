# Aegean Sun — dried fruit marketing website

A static marketing website for a dried fruit business, built with plain HTML, CSS
and vanilla JavaScript. No build step, no dependencies, no framework — open the
files in a browser or drop the folder on any static host.

## Pages

| File | Page |
| --- | --- |
| `index.html` | Home — hero, product preview, why-us, process, testimonials, contact section |
| `products.html` | Products menu — the full range, packaging options, comparison table |
| `product-dried-fig.html` | Dried Fig — story, specification, packaging, uses |
| `product-fig-salami.html` | Fig Salami — story, specification, packaging, serving |
| `product-dried-apricot.html` | Dried Apricot — story, specification, packaging, uses |
| `about.html` | About Us — history, values, figures, certifications |
| `contact.html` | Contact Us — enquiry form, direct contact details, FAQ |

The three products sit in a dropdown under **Products** in the main navigation on
every page, alongside a link to the full products listing.

## Structure

```
assets/
  css/styles.css   all styling for every page
  js/main.js       mobile menu, products dropdown, contact form validation
  img/*.svg        logo and illustrations (hand-written SVG, no binary assets)
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
placeholders. Search and replace:

- **Brand name** — `Aegean Sun` (also in `assets/img/logo.svg` if you redraw it)
- **Email** — `sales@aegeansun.example`, `quality@aegeansun.example`
- **Phone** — `+90 256 000 00 00` (and the `tel:+902560000000` links)
- **Address** — `Incirliova OSB, 2. Cadde No. 14, 09600 Incirliova / Aydin`
- **Figures and claims** — founding year, capacity, grower count, export markets,
  and the certification list on `about.html`. Only claim certifications you hold.
- **Testimonials** on `index.html` — replace with real, attributable quotes.
- **Product specifications** — the grades, calibres, moisture levels and HS codes
  are typical industry values; confirm them against your own spec sheets.

Photography will lift the site further: the illustrations in `assets/img/` are
placeholders sized 4:3 for the product cards, and can be swapped for real photos
with no CSS changes.
