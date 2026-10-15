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
                   (form messages are per-language, keyed off <html lang>)
  js/chat.js       sales assistant widget, home pages only
  js/consent.js    cookie bar; loads Google Analytics only on consent
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
sitemap.xml        all 16 URLs, with their language alternates
robots.txt         points crawlers at the sitemap
```

## Running it locally

Any static server works, for example:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Opening `index.html` directly from the file system also works.

## Domain and search engines

The site's address is **https://www.aegeansunfruit.com**. Every page carries an
absolute `<link rel="canonical">`, `og:url` and `hreflang` pair built on that
host, plus `og:image`, `og:site_name`, `og:locale` and a Twitter card, so a
link pasted into WhatsApp, LinkedIn or Slack shows the hero photograph and the
page title. `sitemap.xml` lists all 16 URLs with their language alternates, and
`robots.txt` points at it. The two home pages also carry an `Organization`
JSON-LD block (address, factory, plant, phone, e-mail, the three sales
contacts).

Two things to do on the hosting side, once:

- pick one host and redirect the other — the apex `aegeansunfruit.com` should
  301-redirect to `www.aegeansunfruit.com`, since that is what the canonicals
  say. On Vercel: add both domains to the project and set the apex to redirect.
- submit `https://www.aegeansunfruit.com/sitemap.xml` in Google Search Console
  and Bing Webmaster Tools.

### Verifying the site with Google Search Console

Search Console has to be shown that the domain is ours before it will report
anything. It offers two routes, and they are satisfied in different places:

- **DNS TXT record** (what a *Domain* property asks for). This lives at
  whoever answers DNS for `aegeansunfruit.com` — nothing in this repository can
  satisfy it. Add a TXT record on the root of the domain (name: `@`, or leave it
  at the provider's default) with the value Search Console shows, and the
  lowest TTL offered. On Vercel: Project → Settings → Domains → the domain →
  DNS Records → Add → type `TXT`. At a registrar such as GoDaddy or Namecheap
  it is under DNS management for the domain. The record can take a few minutes
  to an hour to propagate; press *Verify* in Search Console afterwards. The
  value issued on 2026-10-07 was
  `google-site-verification=5ySKh33dsXBKKduZimTz87vZbeqgzu1cPMC8G2wBH9w`.
  Leave the record in place — Google re-checks it, and removing it unverifies
  the property.
- **HTML tag or HTML file** (what a *URL prefix* property offers). These are
  satisfied from this repository. For the tag, Search Console gives a
  `<meta name="google-site-verification" content="…">` line, which goes in the
  `<head>` of every page, next to the other meta tags. For the file, it gives a
  name like `google1234abcd.html`, and the file at the site root contains the
  single line `google-site-verification: google1234abcd.html`. Both tokens are
  issued per method, so neither is interchangeable with the DNS value above.

A Domain property covers `www`, the apex and both `http`/`https` at once, which
is why Search Console offers it first; a URL-prefix property covers only the
exact address you type.

If the address ever changes, the host appears in `sitemap.xml`, `robots.txt`
and in the `canonical` / `og:url` / `hreflang` tags of all 16 pages. A
find-and-replace over the repository covers it.

The contact address on the site is `muzaffer.turkekul@aegeansunfruit.com`. It
appears 49 times — `mailto:` links, the visible text beside them, the footers
of all 16 pages, the sales assistant's answers and the home pages' JSON-LD — so
changing it again is a find-and-replace over the repository, not an edit in one
place.

## Visitor numbers

Every page loads Vercel Web Analytics with one line in the `<head>`:

```html
<script defer src="/_vercel/insights/script.js"></script>
```

The npm package and `<Analytics />` component Vercel's dashboard shows by
default are for Next.js and React; this site is plain HTML with no build step,
so it takes the script-tag form instead (the same one under "HTML" in that
dashboard's framework dropdown).

Two things to know:

- it only reports once **Web Analytics is enabled** for the project, under the
  project's Analytics tab in Vercel. The tag alone does nothing.
- `/_vercel/insights/script.js` is injected by Vercel's edge, not by this
  repository, so it 404s when you run the site from a local server. That is
  expected and harmless — the page works either way.

It counts page views, referrers, countries and devices. It sets no cookies and
stores no per-visitor identifier, so it does not need a cookie banner the way
Google Analytics does — worth keeping that way, given how many visitors will be
in the EU. Ad blockers do block it, so treat the numbers as a floor.

Speed Insights (how fast pages load for real visitors) is a separate Vercel
product with its own tag, `<script defer src="/_vercel/speed-insights/script.js"></script>`,
and is not installed.

### Google Analytics 4

All 16 pages also carry the GA4 tag for property `G-YSX5V6H7JQ`, placed
immediately after the `<meta name="viewport">` line as Google's instructions
ask. It is independent of the Vercel counter above; running both is fine, and
their numbers will not agree — they count differently and are blocked by
different things.

**GA4 sets cookies** (`_ga` and `_ga_<id>`) and sends visitor data to Google,
so EU visitors have to consent before any of it loads. Nothing Google-related
is therefore in the markup. The `<head>` of every page only declares denied
defaults and queues `gtag()`:

```html
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('consent', 'default', { analytics_storage: 'denied', ... });
</script>
```

`assets/js/consent.js` shows the bar, remembers the answer, and only on
**Accept** sends `consent update` and then loads the Tag Manager container —
in that order, so the tags inside it start granted instead of firing denied
and being corrected. On **Decline** nothing is fetched from Google at all, and
any `_ga` cookie a previous visit left is deleted. The answer is kept in
`localStorage` under `aegeansun-cookie-consent` — not a cookie, never sent to
the server, which is why it needs no consent itself.

Details that are deliberate, not accidental, and should survive any redesign:

- **Decline is the same size and weight as Accept.** Consent has to be as easy
  to refuse as to give; a greyed-out or hidden "decline" invalidates it.
- **Nothing is assumed from silence.** Closing or ignoring the bar is not
  consent, so the bar has no X and no "by continuing you agree".
- **The choice can be withdrawn** from the *Cookie preferences* link in every
  footer, which reopens the bar.
- The bar lists the cookies by name, purpose and lifetime, and links to the
  privacy page.

Changing the copy means editing `COPY` at the top of `assets/js/consent.js`,
which holds both languages.

### Google Tag Manager

Container `GTM-P398DTWM` is loaded by `assets/js/consent.js` too, next to GA4
and under the same condition: nothing until Accept. Google's own instructions
put the loader at the top of `<head>`, which here would reach Google before
the visitor had answered the bar and make the privacy page untrue, so the
snippet lives in `consent.js` instead. It is the same code Google gives, only
moved.

**The `<noscript>` iframe is deliberately not installed.** It exists to fire
tags for visitors without JavaScript — exactly the visitors who can never be
shown the consent bar, so it would be the one path around it. Measurement
through GTM needs JavaScript anyway, so little is lost. Add it only if you
decide that trade is worth it.

**GA4 lives inside the container.** There is no `gtag.js` loader and no
`gtag("config", ...)` call anywhere in the site: the measurement id
`G-YSX5V6H7JQ` appears in `consent.js` only to name the cookie the bar lists.
A GA4 configuration tag in the container is therefore the one thing that
counts a page view — add a second one anywhere and every view is counted
twice.

So the container must actually contain that tag, or nothing is measured at
all. In Tag Manager: a **Google Tag** with id `G-YSX5V6H7JQ`, triggered on
**Initialization — All Pages**, then **Submit** to publish the container. A
container that has never been published serves an empty response, which is
why the site can look wired up and still report nothing.

Tags you add inside GTM inherit the consent state: the container only loads
after Accept, and `analytics_storage` is granted at that moment. A tag that
needs ad storage would need its own consent category, which this bar does not
offer — it asks one yes/no question.

## Privacy & Cookies page

`privacy.html` and `tr/gizlilik.html` carry the privacy notice, linked from the
footer of every page and from the cookie bar. They are built from the same
shell as the rest of the site, so they have their own canonical, hreflang pair,
Open Graph tags and sitemap entries; they are deliberately not in the top menu.

The text describes what the site actually does — the enquiry form, the
newsletter, the Vercel counter, consent-gated Google Analytics, server logs —
with a purpose, a legal basis and a retention period for each, then cookies,
recipients, transfers abroad, rights under the KVKK and the GDPR, and how to
complain.

**This is not legal advice, and it is not finished until you check three
things:**

1. **The enquiry form and the newsletter are still in demo mode.** The page
   says enquiries reach us and newsletter addresses are stored. That becomes
   true when those forms are wired to a provider; until then the page
   over-describes, and worse, a visitor who fills the form believes they have
   contacted you when nothing was sent.
2. **Name the processors once chosen.** When the form and the list go live,
   add the provider (Formspree, Brevo, Mailchimp …) to the "who we share with"
   list — a processor that holds enquiry data has to be named.
3. **Retention periods are stated in general terms** ("until the enquiry is
   settled", "until you unsubscribe"). If you want firm periods, set them and
   replace that wording.

A lawyer should read it before you rely on it, particularly for KVKK
registration obligations (VERBIS) which this page does not address.

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

## Making the forms live

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

The newsletter sign-up beside it (`#newsletter-form`, both contact pages) works
the same way and is also in demo mode. Point its `action` at your mailing-list
provider's subscribe endpoint (Mailchimp, Brevo, MailerLite, Buttondown …); it
posts a single field, `email`. Remember to do it in `tr/iletisim.html` as well
as `contact.html` — they are separate forms.

Two things worth doing before you start collecting addresses: send a
confirmation e-mail (double opt-in) and put a working unsubscribe link in every
newsletter. The card promises one, and both are required under GDPR for
European subscribers. Any of the providers above does this for you.

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
