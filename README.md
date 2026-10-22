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
| `404.html` | `tr/404.html` | Page not found — links to the four products and the enquiry form. `noindex`, not in the sitemap; Vercel serves `/404.html` automatically for unknown URLs (use the `tr/` one's link from Turkish pages) |

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
  css/home.css     the only stylesheet, loaded by every page (2026 redesign):
                   tokens, home sections, the "Inner pages" components
                   (page head, sections, spec tables, closer, contact form,
                   legal text) and, at the end, the consent-bar and chat
                   styles. product-dried-mulberry.html is the reference
                   inner page. (styles.css was retired in October 2026.)
  css/fonts.css    @font-face for the self-hosted fonts
  fonts/           Libre Franklin 700 and Source Serif 4 (latin + latin-ext,
                   which carries the Turkish letters), served from our domain
  js/main.js       contact and about pages only: contact form validation,
                   `?product=` preselect, `data-since` year counters
                   (form messages are per-language, keyed off <html lang>)
  js/chat.js       sales assistant widget, every page except privacy and 404
  js/gforms.js     sends the enquiry and newsletter forms to the company's
                   Google Forms (addresses and field mapping live here)
  js/consent.js    cookie bar; loads Google Analytics only on consent
  js/home.js       every page: section entrances, the flag language switcher;
                   home pages also: the carton-label
                   enquiry form (mailto, EN/TR from <html lang>), the film
                   loop, caption tabs and the flag language switcher
  img/hero.jpg     home page hero photograph (og:image, JPEG fallback)
  img/hero.webp, hero-800.webp  the same hero as WebP, 1536 and 800 px wide
  img/fig-box-crop.webp     boxed figs cropped into the fruit, home pages
  img/menderes-valley.webp  Büyük Menderes valley at Kuyucak (Wikimedia
                            Commons, Volker Höhfeld, CC BY-SA 4.0), home pages
  img/malatya-orchards.webp apricot orchards at Battalgazi, Malatya (Wikimedia
                            Commons, Zeynel Cebeci, CC BY-SA 4.0), home pages
                            Both are credited in the home-page footers; keep
                            the credit if you keep the photo, or replace them
                            with our own shoot.
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
  img/icons.svg             SVG icon sprite (see "Icons" below)
sitemap.xml        all 16 URLs, with their language alternates
robots.txt         allows all crawlers, names the AI search crawlers, points at the sitemap
llms.txt           plain-text summary of the company, products and pages for
                   AI assistants (keep its facts in step with the pages)
```

## Standing business facts

Two statements are repeated across pages, the chat answers and the form messages,
so change them everywhere together: **replies come within one working day** (office
hours Mon-Fri 08:30-18:00 GMT+3, no 24/7 claim) and **graded sample sets are free
for qualified trade buyers**. The product video is portrait 9:16, so `.video-frame`
is portrait too (max 420px wide, 80vh tall).

## Icons

Icons are one SVG sprite, `assets/img/icons.svg`, used like this (root pages;
under `tr/` the path is `../assets/img/icons.svg`):

```html
<span class="icon-badge" aria-hidden="true"><svg class="icon"><use href="assets/img/icons.svg#i-leaf"></use></svg></span>
```

Symbols: `leaf certificate truck pin globe mail phone whatsapp clock box factory
shield scale handshake sun lab tag users document ship sparkle check`. They are
24px line icons drawn with `currentColor`, so colour comes from the CSS of
whatever wraps them. To add one, add a `<symbol id="i-NAME" viewBox="0 0 24 24">`
with the same stroke style (1.75, round caps and joins, no fill). Do not use
emoji as icons: they render differently on every device and cannot be themed.

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
contacts). Since the 2026 redesign the home pages add a second JSON-LD block:
`WebSite`, `WebPage` (with the four products as an `ItemList`) and a
`VideoObject` for the fig film with its transcript.

For AI search and assistants (ChatGPT, Claude, Perplexity, Google AI
Overviews), `robots.txt` names their crawlers and allows them, and `llms.txt`
at the root holds a short factual summary with links. The home pages also put
the specifications in plain text on the page (grades, calibres, packs, HS
codes, terms), which is what those assistants quote. If a fact changes, change
it on the page, in `llms.txt` and in `chat.js`.

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
- **The choice can be withdrawn** from the *Cookie preferences* button in every
  footer (`data-consent-open`; it works on a `<button>` or an `<a>`), which
  reopens the bar.
- **Focus behaves politely.** The bar is a `role="region"` labelled by its
  title, not a dialog: it does not trap focus. On first load focus is *not*
  moved (it would pull a keyboard or screen-reader user off the page they just
  opened). When the bar is reopened from the footer, focus goes to its title;
  after a decision it returns to the control that opened it, or to `<main>`
  if the bar had appeared by itself.
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

### Against Google's basic consent mode guide

Checked step by step against Google's "Set up consent mode" page. Where this
site departs from the sample, it is on purpose:

| Guide says | Here |
| --- | --- |
| Set the defaults in the data layer before the banner, with `wait_for_update` | Done, in the `<head>` of all 18 pages. `wait_for_update: 500` is inert in a basic setup — the container only loads after the update — but it is kept so the block matches the documented one if a tag is ever added earlier. |
| Save the interaction in `localStorage` or a cookie | `localStorage`, under `aegeansun-cookie-consent`. |
| Give every banner button an identifier | `#consent-accept` and `#consent-decline`. |
| Push the banner interaction to the data layer | `{event: "consent_decision", consent_decision: "granted"\|"denied"}`, pushed before the container loads so a trigger inside it can fire on the event. |
| Load the Google tag once consent is granted | `consent.js` sends the update, then loads `gtm.js`. |
| Sample grants `ad_storage`, `ad_user_data`, `ad_personalization` and `analytics_storage` on accept | **Only `analytics_storage`.** The bar asks one question, about measurement, and the privacy page describes only Analytics. Granting advertising consent nobody was asked for would be a false signal — and the guide itself says to decide this from your own policy rather than from the sample. Adding ad tags means asking about them in the bar first. |
| With Tag Manager, the recommended approach is to load your banner *through* the container | **Not followed.** The container would have to load before the banner could ask anything, which is the one thing this setup refuses to do. The bar is part of the site instead: it works with the container unpublished, it is bilingual from `<html lang>`, and it is styled with the site's own CSS. |
| Install the Google tag on every page (gtag.js route) | Not applicable — GA4 is a tag inside the container, so there is no `gtag.js` on any page. |

### Why consent mode stays "basic"

Google offers two shapes of consent mode, and this site deliberately uses the
stricter one.

- **Basic** (what we do): no Google tag loads until the visitor accepts. A
  visitor who declines, or ignores the bar, is never counted and nothing about
  them reaches Google.
- **Advanced**: the container loads for everyone immediately and, while
  consent is denied, sends cookieless pings. Google then *models* the missing
  visitors to fill the gap.

Advanced measures more, and it is tempting for a site with worldwide traffic,
where many visitors never touch the bar. It was weighed and rejected:

1. **The modelling would not run.** Google only models once the property is
   over its thresholds — reported by third-party guides as roughly 1,000
   events a day from declining visitors for 7 days, and around 1,000 daily
   consenting users across 7 of the last 28 days. A B2B exporter's site is
   orders of magnitude below that, so advanced mode would buy the extra
   exposure and deliver no modelled data at all.
2. **It would contradict a published promise.** The privacy page states that
   until you answer, the page does not even send a request to Google. Advanced
   mode makes that false, and the page would have to be rewritten.
3. **The company is Turkish and sells into the EU.** Both the KVKK's cookie
   guidance and the EU ePrivacy rules point the same way: ask first.

`region`-scoped defaults — `gtag('consent','default',{…, region:['DE','FR']})`
— only change *which default applies where*; the tags still load everywhere,
so they are a feature of advanced mode and do nothing in ours.

If the picture changes (serious traffic, or an ads campaign that needs
conversion modelling), switching is small: declare granted defaults outside
the regulated regions, load the container in the head as Google documents,
and update the privacy page to match. It is a legal decision before it is a
technical one.

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

1. **The forms send to Google Forms** (see "The forms (Google Forms)"), and
   the privacy pages say so. If you change the provider, change that wording.
2. **Name every processor.** Google (Forms and Sheets) is named in the "who we
   share with" list; any new provider that holds enquiry or newsletter data
   (Brevo, Mailchimp …) has to be added there too.
3. **Retention periods are stated in general terms** ("until the enquiry is
   settled", "until you unsubscribe"). If you want firm periods, set them and
   replace that wording.

A lawyer should read it before you rely on it, particularly for KVKK
registration obligations (VERBIS) which this page does not address.

## The sales assistant

Every page except the privacy and 404 pages loads `assets/js/chat.js`, which puts a small assistant in the
bottom right corner. It is deliberately plain: no backend, no API key and no
third-party script, so it costs nothing and cannot leak anything. It matches
the visitor's words against a list of keywords and replies with a fixed answer,
picking Turkish or English from `<html lang>`.

Every answer in it is a fact that already appears on this site — MOQ, incoterms,
lead times, shipping destinations, shelf life, vegan/gluten-free status,
organic availability, certificates, samples, addresses, the representatives. If
you change a fact on a page (a shelf life, the sample policy, the reply time),
change the matching `KB` answer too. When nothing
matches, it says so and hands the visitor the enquiry form, the e-mail address
and the phone number rather than guessing.

To add or change an answer, edit the `KB` object near the top of the file. Each
entry is:

```js
{ id: "moq",
  k:  ["minimum", "moq", "palet"],   // keywords, accent- and case-insensitive
  a:  "One pallet (roughly 500 kg) …", // the reply
  links: [["FAQ", L.faq]],             // buttons under the reply
  next:  ["Delivery time", "How do I get a price?"] }  // suggested follow-up chips
```

Matching happens at the **start of a word**, not anywhere inside it, so the
keyword `rate` no longer fires on "accurate" or "separate", while stems such as
`certificat` still catch "certificates". Very short keywords (`iso`, `moq`,
`hi` …) are listed in `WHOLE` and must match a whole word. The longest matching
keyword wins, so specific phrases ("shipping term") beat general ones
("shipping").

On phones the launcher hides itself while the footer is on screen
(`IntersectionObserver`, class `is-near-footer`) so it never covers footer
links.

Keep `a` to something the site itself says; that is the whole point of it.

To put it on more pages, add `<script src="assets/js/chat.js" defer></script>`
to that page (`../assets/js/chat.js` under `tr/`). The links it offers are bare
file names, which resolve correctly from both the root and `tr/`.

If you want a real AI assistant instead — one that answers in its own words —
it needs a server to hold the API key, because anything in the browser is
public. On Vercel that is one serverless function under `api/`, the key stored
as an environment variable, and `chat.js` posting to it. That is a separate
job, and it costs per message.

## The forms (Google Forms)

Three forms collect data: the carton-label enquiry on both home pages
(`#enquiry-form`, `assets/js/home.js`), the enquiry form on both contact pages
(`#contact-form`, `assets/js/main.js`) and the newsletter sign-up on both contact
pages (`#newsletter-form`, `main.js`). All three post to two Google Forms owned
by the company; responses land in each form's **Responses** tab (or the Google
Sheet linked to it). Turn on *Responses → ⋮ → Get email notifications for new
responses* in both forms so new enquiries are noticed.

- **Enquiry form:** https://forms.gle/qJRTMzmaduVEyT5d9
- **Newsletter form:** https://forms.gle/wrXFGHuErAcqNfZR8

`assets/js/gforms.js` is the only file that knows the form addresses and which
site field goes to which Google question (`entry.NNN`). It must load before
`home.js` / `main.js` on the four pages with forms. How a submission travels:

1. The page script validates in the browser (invalid fields get `aria-invalid`
   and a linked message; the first one takes focus).
2. It calls `AegeanForms.send('enquiry' | 'newsletter', values)`, which POSTs to
   the form's `/formResponse` address with `mode: "no-cors"` and no cookies.
   Google does not let another site read its reply, so success means
   "delivered", not "accepted"; Google drops a response that misses a required
   answer, so `send()` fills any blank required answer with `-`.
3. On success the visitor sees a thank-you and the form resets. If the request
   fails (offline, blocked), the enquiry forms open a pre-filled `mailto:` to
   the sales address and say so; the newsletter offers an e-mail link.

Field mapping. The Google enquiry form has fewer questions than the site
forms, so: product, grade and pack (home label) travel together in
*Interested Product(s)*; quantity, "how can we help", volume, terms and the
page/language go into *Additional Message*; *Do you require samples* is "Yes"
when the visitor ticks the sample box (home) or picks "Request samples"
(contact). Name, company, e-mail and country are required on the site because
they are required in the Google Form.

Spam: every form has a hidden `website` field (`.hp`, off-screen). A form sent
with it filled, or within 2.5 seconds of the page opening, shows the normal
thank-you but sends nothing.

**Changing a Google Form.** If you add, rename or delete a question, or make
one required, update `FORMS` in `gforms.js`: in Google Forms open ⋮ → *Get
pre-filled link*, fill every field, click *Get link*, and read the
`entry.NNN` numbers from the link. A required question the site does not send
makes Google silently drop every response. Test after any change.

**Moving to another provider.** Setting an `action="https://…"` on a contact
page form makes `main.js` hand the form to that endpoint instead (Formspree,
Brevo, your own handler); the field `name`s are posted as-is. Update the
privacy pages to name the new processor.

Newsletter law: before sending the first newsletter, send each subscriber a
confirmation (double opt-in) and put a working unsubscribe link in every
issue; both are required under the GDPR for European subscribers. Google
Forms does neither for you.

### Auto-reply e-mails

`google-apps-script/autoreply.gs` sends each person who submits a form one
plain-text reply from the Google account that owns the forms (replies go to
the sales address). Enquiries get a reply in English, or in Turkish when they
came from a `/tr/` page, repeating the product, company, country and sample
request; newsletter sign-ups get a confirmation link instead (see the next
section). At most one e-mail of each kind per address per day. The folder is
in `.vercelignore`, so it is not published with the site.

Install it once in **each** form (Enquiry and Newsletter):

1. Open the form in Google Forms → ⋮ (top right) → **Apps Script**.
2. Delete what is in `Code.gs`, paste the whole of `autoreply.gs`, and save.
3. Pick **install** in the function list at the top and press **Run**. Google
   asks for permission (to read the form's responses and send e-mail as you):
   choose your account → *Advanced* → *Go to … (unsafe)* → **Allow**. The
   warning appears because the script is your own, not a published app.
4. Send a test from the website and check the inbox you used.

If no reply arrives, open the script (form → ⋮ → Apps Script):

- **Triggers** (clock icon, left) must list one `onSubmit` / *From form* /
  *On form submit*. If it is empty, `install` was not run in this form.
- **Run `sendTest`** mails a sample reply to your own account. If that fails,
  the permission step was not completed; if it arrives, sending works.
- **Executions** (left) lists every run. A failed `onSubmit` shows the error;
  a successful one logs *Auto-reply sent to …* or why it skipped (no valid
  address, or already replied to that address today — test with a fresh
  address each time).
- Check the spam folder: the reply comes from a Gmail account but names the
  company, which some filters dislike.

To change the wording, edit the file here and paste it again into both forms
(no need to run install again). If a question in the Enquiry form is renamed,
update the titles used in `onSubmit` / `enquiryMail` (`E-Mail`,
`Name Surname`, `Interested Product(s)`, …).

### Newsletter: double opt-in and unsubscribe

The same script runs the newsletter list, so nobody is mailed who did not
confirm, and every e-mail has a working unsubscribe link:

1. A sign-up on the contact page lands in the Newsletter form. The script
   adds the address to a **Subscribers** spreadsheet in your Drive (created
   on the first `install`; `install` logs its link) as `pending`, and sends a
   bilingual e-mail with a confirmation link.
2. The link opens a small page served by the script (a Google "web app") with
   a **Confirm** button. Only the button press confirms: mail security
   scanners open every link in an e-mail, and a link that confirmed on its own
   would subscribe people who never clicked. The row becomes `confirmed` and a
   welcome e-mail with the person's unsubscribe link goes out.
3. Sign-ups that are never confirmed are deleted after 30 days (daily
   `cleanup` trigger), together with their form responses.
4. The unsubscribe link (same page, **Unsubscribe** button) marks the row
   `unsubscribed`, keeps the address and dates as a record that the request
   was honoured, and deletes the address's Newsletter form responses.

One-time setup, in the **Newsletter** form's script only (after pasting the
latest `autoreply.gs` and running `install` again):

1. **Deploy → New deployment** → gear icon → **Web app**. *Execute as*:
   **Me**; *Who has access*: **Anyone**. Press **Deploy**, allow access, and
   copy the **Web app URL** (it ends in `/exec`).
2. Paste it into `NEWSLETTER_APP_URL` at the top of the script and save.
   Also paste it into this repo's copy, so the two stay the same.
3. Run `sendTest`: you get the confirmation e-mail; open its link to see the
   page (pressing Confirm on the test link says it is not valid, which is
   expected: it belongs to no subscriber).
4. Sign up on the website with a fresh address and go through confirm and
   unsubscribe once.

After every later change to the script, update the web app too: **Deploy →
Manage deployments → ✏️ → Version: New version → Deploy**. The URL stays the
same; without this the confirm/unsubscribe page keeps running the old code.

**Sending a newsletter.** Write it in Gmail (in the account that owns the
forms) as a draft whose subject starts with `[Newsletter]`, e.g.
`[Newsletter] New-season figs, September 2027`; leave the *To* field empty.
Then, in the Newsletter form's script, run `sendNewsletter`. It sends the
draft (without the `[Newsletter]` prefix) to every confirmed subscriber, one
e-mail each, and adds that person's unsubscribe link at the bottom. It
records the subject per person, so running it again never sends twice; if
the daily Gmail quota runs out, the log says so, and running it the next day
continues. Use a new subject for each newsletter. Pictures: use linked
images; pasted inline images are not carried over. The first run asks for
Gmail permission (to read the draft).

Abuse limits: at most 40 enquiry replies and 40 confirmation requests a day
in total (`DAILY_CAP`), so a stranger filling the public forms with other
people's addresses cannot use up the Gmail quota that real replies and
newsletters need; replies only repeat short, link-free versions of what the
visitor typed. Only the owner can run `install`, `sendTest` and `sendNewsletter`. Every
helper function name ends in `_`, because Apps Script lets visitors of the
web app call any other function from their browser.

Sign-ups made before this was installed are not in the Subscribers sheet;
ask them to sign up again, or add them by hand only if they confirmed in
writing.

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
