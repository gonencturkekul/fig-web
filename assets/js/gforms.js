/* ==========================================================================
   Aegean Sun: sending the site's forms to Google Forms (no backend needed).

   The enquiry forms (home carton label in home.js, contact page in main.js) and
   the newsletter sign-up post their answers to two Google Forms owned by the
   company; the answers land in the forms' Responses tab / linked Google Sheet.
   This file is the one place that knows the form addresses and which site
   field goes to which Google question ("entry.NNN"), so the page scripts only
   pass plain values.

   How it works and its limits:
   - It POSTs to the form's public /formResponse address, the same request a
     visitor's browser makes on the Google Form itself. Google does not allow
     reading the reply from another site (CORS), so the request is sent with
     mode "no-cors": we learn that it was delivered, not what Google said.
     A network failure rejects, and the callers then fall back to mailto, so an
     enquiry is never silently lost on our side.
   - Nothing is sent before the visitor presses Send, no cookies go with it
     (credentials: "omit"), and it needs no consent: it is the visitor's own
     submission, disclosed on the privacy pages (privacy.html, tr/gizlilik.html).
   - Every required question in the Google Form must get a value, or Google
     drops the response. Required on Google: enquiry name, company, e-mail,
     country, product(s), samples (Yes/No); newsletter e-mail. The site marks
     the same fields required, and send() fills any gap with "-" as a last guard.

   To change a form: open it in Google Forms, ⋮ → "Get pre-filled link", fill
   every field, copy the link, and read the entry.NNN numbers from it. Update
   FORMS below. If a question is added and made required on Google, add it here.
   ========================================================================== */
(function () {
  'use strict';

  var FORMS = {
    enquiry: {
      action: 'https://docs.google.com/forms/d/e/1FAIpQLSe7CO1ZLaFrG-75LT1NXl8Yo0nZEExvANJ70nPbgcBOcEK-bg/formResponse',
      fields: {
        name: { entry: 'entry.1623673233', required: true },     // Name Surname
        company: { entry: 'entry.882475704', required: true },   // Company Name
        email: { entry: 'entry.542952197', required: true },     // E-Mail
        phone: { entry: 'entry.903342493' },                     // Phone
        country: { entry: 'entry.223092602', required: true },   // Country
        product: { entry: 'entry.1561789793', required: true },  // Interested Product(s)
        samples: { entry: 'entry.1154334988', required: true },  // Do you require samples: must be exactly "Yes" or "No"
        message: { entry: 'entry.466557965' }                    // Additional Message
      }
    },
    newsletter: {
      action: 'https://docs.google.com/forms/d/e/1FAIpQLSfmsNuQ1zRSYVzp7uIdlgNia8luN8hAlkvWzf5ypABJF8iR1w/formResponse',
      fields: {
        email: { entry: 'entry.1613510902', required: true }     // E-Mail Address
      }
    }
  };

  // Spam guard 1: a form sent sooner than this after the page opened is almost certainly a bot.
  var MIN_MS = 2500;
  var openedAt = Date.now();

  /* Spam guard 2: every form carries a hidden "website" field (class .hp, off-screen,
     tabindex -1, aria-hidden). People never see it; form-filling bots usually fill it.
     Returns true when the submission looks automated, so callers can pretend success
     without sending anything (a bot learns nothing, a person is never blocked). */
  function looksAutomated(form) {
    var trap = form && form.querySelector('input[name="website"]');
    return !!(trap && trap.value) || Date.now() - openedAt < MIN_MS;
  }

  /* Sends one response. `kind` is "enquiry" or "newsletter"; `values` maps the
     field keys above to strings. Resolves when the request was delivered,
     rejects on a network failure or an unknown form. */
  function send(kind, values) {
    var form = FORMS[kind];
    if (!form || !window.fetch) return Promise.reject(new Error('Google Forms sending unavailable'));
    var body = new URLSearchParams();
    Object.keys(form.fields).forEach(function (key) {
      var field = form.fields[key];
      var value = values[key] == null ? '' : String(values[key]).trim();
      if (!value && field.required) value = '-';   // never let Google drop a response for a blank required answer
      if (value) body.append(field.entry, value);
    });
    return fetch(form.action, {
      method: 'POST',
      mode: 'no-cors',
      credentials: 'omit',
      referrerPolicy: 'strict-origin',
      body: body
    }).then(function () { return true; });
  }

  window.AegeanForms = { send: send, looksAutomated: looksAutomated };
})();
