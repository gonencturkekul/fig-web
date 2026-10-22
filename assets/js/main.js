/* Aegean Sun — shared front-end behaviour (no dependencies). */
(function () {
  "use strict";

  var MAIL = "muzaffer.turkekul@aegeansunfruit.com";

  function isDesktop() {
    return window.matchMedia("(min-width: 981px)").matches;
  }

  /* ---------- Mobile navigation ---------- */
  function initNav() {
    var toggle = document.querySelector(".nav__toggle");
    var menu = document.getElementById("primary-menu");

    /* The open/close labels come from data attributes so this file stays
       language-agnostic; without them the HTML's aria-label is left alone. */
    function setMenu(open) {
      if (!toggle || !menu) return;
      menu.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      var label = toggle.getAttribute(open ? "data-label-close" : "data-label-open");
      if (label) toggle.setAttribute("aria-label", label);
    }
    function menuIsOpen() {
      return !!menu && menu.classList.contains("is-open");
    }

    if (toggle && menu) {
      toggle.addEventListener("click", function () {
        setMenu(!menuIsOpen());
      });

      /* An open mobile menu has no meaning on desktop (the CSS shows the bar
         anyway), and would reappear open if the window were shrunk again. */
      window.addEventListener("resize", function () {
        if (isDesktop() && menuIsOpen()) setMenu(false);
      });
    }

    /* Dropdowns (products menu, language switcher): click/tap everywhere,
       hover as well on desktop. */
    var dropdowns = document.querySelectorAll(".has-dropdown");

    function setOpen(item, open, viaHover) {
      window.clearTimeout(item.closeTimer);
      item.classList.toggle("is-open", open);
      item.hoverOpened = open && viaHover === true;
      var b = item.querySelector(".menu__button");
      if (b) b.setAttribute("aria-expanded", String(open));
    }

    Array.prototype.forEach.call(dropdowns, function (item) {
      var button = item.querySelector(".menu__button");
      if (!button) return;

      button.addEventListener("click", function (event) {
        event.stopPropagation();
        /* Moving the pointer here already opened it on desktop; a click then
           has to keep it open rather than reading it as "close me". */
        var open = !item.classList.contains("is-open") || item.hoverOpened === true;
        closeAllDropdowns();
        setOpen(item, open);
      });

      /* Closing on a short delay forgives a pointer that cuts a corner on its
         way from the button down to an item. */
      item.addEventListener("mouseenter", function () {
        window.clearTimeout(item.closeTimer);
        if (isDesktop() && !item.classList.contains("is-open")) setOpen(item, true, true);
      });
      item.addEventListener("mouseleave", function () {
        if (!isDesktop()) return;
        window.clearTimeout(item.closeTimer);
        item.closeTimer = window.setTimeout(function () { setOpen(item, false); }, 250);
      });

      /* Tabbing past the last item must close the menu, otherwise it hangs
         open over the page. relatedTarget is null when focus leaves the
         window (or lands on something unfocusable); those cases are covered
         by the document click handler, so only act on a real destination. */
      item.addEventListener("focusout", function (event) {
        var next = event.relatedTarget;
        if (next && !item.contains(next)) setOpen(item, false);
      });
    });

    function closeAllDropdowns() {
      Array.prototype.forEach.call(dropdowns, function (item) {
        setOpen(item, false);
      });
    }

    document.addEventListener("click", closeAllDropdowns);

    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape") return;

      /* Escape closes the innermost thing first: an open dropdown, then the
         mobile menu. Focus goes back to the control that opened it so a
         keyboard user is not dropped at the top of the page. */
      var openItem = null;
      Array.prototype.forEach.call(dropdowns, function (item) {
        if (item.classList.contains("is-open")) openItem = item;
      });
      if (openItem) {
        var button = openItem.querySelector(".menu__button");
        var hadFocus = openItem.contains(document.activeElement);
        closeAllDropdowns();
        if (button && hadFocus) button.focus();
        return;
      }
      if (menuIsOpen()) {
        setMenu(false);
        if (toggle) toggle.focus();
      }
    });
  }

  /* ---------- Footer year + "years since" counters ---------- */
  function initYear() {
    var now = new Date().getFullYear();
    var slot = document.querySelector("[data-year]");
    if (slot) slot.textContent = String(now);

    /* "58 years of harvests" must not go stale: the page states the founding
       year and the number is derived from it. */
    var since = document.querySelectorAll("[data-since]");
    Array.prototype.forEach.call(since, function (node) {
      var year = parseInt(node.getAttribute("data-since"), 10);
      if (year > 1900 && year <= now) node.textContent = String(now - year);
    });
  }

  /* ---------- Form messages, per page language ---------- */
  var MESSAGES = {
    en: {
      required: "This field is required.",
      email: "Please enter a valid email address.",
      short: "Please give us a little more detail (at least 10 characters).",
      invalid: "Please check the highlighted fields and try again.",
      mailto: "Your email app should open with your enquiry filled in — press Send there to reach us. If nothing opened, write to " + MAIL + ".",
      newsletterMailto: "Sign-up isn’t live yet — email us and we’ll add you.",
      newsletterLink: "Email us to subscribe",
      sending: "Sending…",
      sent: "Thank you, your enquiry has been sent to our export team. We reply within one working day.",
      sendFailed: "We could not send the form just now, so your email app should open with the enquiry filled in instead. Press Send there to reach us, or write to " + MAIL + ".",
      newsletterSent: "Thank you, you are on the list. Harvest news will come to this address.",
      newsletterFailed: "We could not sign you up just now.",
      subjectEnquiry: "Website enquiry",
      subjectNewsletter: "Newsletter"
    },
    tr: {
      required: "Bu alanın doldurulması gerekiyor.",
      email: "Lütfen geçerli bir e-posta adresi girin.",
      short: "Lütfen biraz daha ayrıntı verin (en az 10 karakter).",
      invalid: "Lütfen işaretli alanları kontrol edip tekrar deneyin.",
      mailto: "E-posta uygulamanız talebiniz doldurulmuş olarak açılmalı — bize ulaşmak için orada Gönder’e basın. Hiçbir şey açılmadıysa " + MAIL + " adresine yazın.",
      newsletterMailto: "Bülten kayıtları henüz açık değil — bize e-posta gönderin, sizi listeye ekleyelim.",
      newsletterLink: "Abone olmak için e-posta gönderin",
      sending: "Gönderiliyor…",
      sent: "Teşekkürler, talebiniz ihracat ekibimize gönderildi. Bir iş günü içinde yanıt veriyoruz.",
      sendFailed: "Form şu anda gönderilemedi; bunun yerine e-posta uygulamanız talebiniz doldurulmuş olarak açılmalı. Bize ulaşmak için orada Gönder’e basın ya da " + MAIL + " adresine yazın.",
      newsletterSent: "Teşekkürler, listeye eklendiniz. Hasat haberleri bu adrese gelecek.",
      newsletterFailed: "Kaydınızı şu anda alamadık.",
      subjectEnquiry: "Web sitesi talebi",
      subjectNewsletter: "Bülten"
    }
  };
  var T = MESSAGES[(document.documentElement.lang || "en").slice(0, 2).toLowerCase()] || MESSAGES.en;

  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  /* ---------- Shared form helpers ---------- */

  /* Each control's error slot gets an id and is referenced by aria-describedby,
     so a screen reader reads the message with the field. The HTML already
     carries both; this fills the gap if a page was edited without them. */
  function linkErrorSlot(field) {
    var wrapper = field.closest(".field");
    var slot = wrapper && wrapper.querySelector(".field__error");
    if (!slot) return null;
    if (!slot.id) slot.id = "err-" + (field.name || field.id);
    var ids = (field.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean);
    if (ids.indexOf(slot.id) === -1) {
      ids.push(slot.id);
      field.setAttribute("aria-describedby", ids.join(" "));
    }
    return slot;
  }

  /* Visible label text without the required-asterisk. */
  function labelFor(field) {
    var label = field.id && document.querySelector('label[for="' + field.id + '"]');
    if (!label) return field.name;
    var clone = label.cloneNode(true);
    Array.prototype.forEach.call(clone.querySelectorAll(".req"), function (n) { n.remove(); });
    return clone.textContent.trim();
  }

  function showStatus(status, message, kind, focus) {
    if (!status) return;
    status.textContent = message;
    status.className = "form-status is-visible form-status--" + kind;
    if (focus) status.focus();
  }

  /* Disable the submit button while the browser hands the form to its action
     URL, so a double-click cannot post twice. Restored on pageshow because the
     back button can bring this page back from the bfcache still disabled. */
  function lockWhileSending(form) {
    var btn = form.querySelector('[type="submit"]');
    if (!btn) return;
    var original = btn.textContent;
    /* Deferred: disabling inside the submit event can drop the submission in some browsers. */
    window.setTimeout(function () {
      btn.disabled = true;
      btn.textContent = T.sending;
    }, 0);
    window.addEventListener("pageshow", function restore() {
      btn.disabled = false;
      btn.textContent = original;
    });
  }

  function openMailto(subject, bodyLines) {
    var href = "mailto:" + MAIL +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(bodyLines.join("\r\n"));
    window.location.href = href;
  }

  /* ---------- Contact form ---------- */
  /* The form validates in the browser and then hands off to whatever endpoint
     is set in the form's `action` attribute. No endpoint exists yet, so without
     one it falls back to the only honest channel: a pre-filled e-mail the
     visitor sends themselves. It never claims the enquiry was received.
     To go live, point `action` at a form service (Formspree, Netlify Forms,
     your own /api/contact handler, ...) and keep method="post". */
  function initContactForm() {
    var form = document.getElementById("contact-form");
    if (!form) return;

    var status = document.getElementById("form-status");

    function setError(field, message) {
      var wrapper = field.closest(".field");
      if (!wrapper) return;
      wrapper.classList.add("has-error");
      var slot = linkErrorSlot(field);
      if (slot) slot.textContent = message;
      field.setAttribute("aria-invalid", "true");
    }

    function clearError(field) {
      var wrapper = field.closest(".field");
      if (!wrapper) return;
      wrapper.classList.remove("has-error");
      field.removeAttribute("aria-invalid");
    }

    function validate() {
      var problems = [];
      var fields = form.querySelectorAll("input, select, textarea");

      Array.prototype.forEach.call(fields, function (field) {
        clearError(field);
        var value = (field.value || "").trim();

        if (field.hasAttribute("required") && !value) {
          setError(field, T.required);
          problems.push(field);
          return;
        }
        if (field.type === "email" && value && !emailPattern.test(value)) {
          setError(field, T.email);
          problems.push(field);
          return;
        }
        if (field.name === "message" && value && value.length < 10) {
          setError(field, T.short);
          problems.push(field);
        }
      });

      return problems;
    }

    /* Pre-select the product when a product page links here with ?product=.
       Short names are the ones the product pages use; full option values work too. */
    (function preselectProduct() {
      var select = form.querySelector('select[name="product"]');
      if (!select || !window.URLSearchParams) return;
      var wanted = new URLSearchParams(window.location.search).get("product");
      if (!wanted) return;
      var alias = { fig: "dried-fig", salami: "fig-salami", apricot: "dried-apricot", mulberry: "dried-mulberry" };
      var value = alias[wanted] || wanted;
      for (var i = 0; i < select.options.length; i++) {
        if (select.options[i].value === value && !select.options[i].disabled) {
          select.value = value;
          return;
        }
      }
    })();

    /* Subject and body for the mailto fallback, built from whatever the
       visitor filled in, labelled with the form's own visible labels. */
    function buildMail() {
      var lines = [];
      var topic = "";
      Array.prototype.forEach.call(form.elements, function (field) {
        if (!field.name || field.type === "submit" || field.type === "hidden" || field.disabled) return;
        if ((field.type === "checkbox" || field.type === "radio") && !field.checked) return;
        var value = (field.value || "").trim();
        if (!value) return;
        if (field.tagName === "SELECT") {
          value = field.options[field.selectedIndex].text.trim();
          if (field.name === "product") topic = value;
        }
        if (field.name === "message") {
          lines.push("", labelFor(field) + ":", value);
        } else {
          lines.push(labelFor(field) + ": " + value);
        }
      });
      return { subject: T.subjectEnquiry + (topic ? " — " + topic : ""), lines: lines };
    }

    /* Clear an error as soon as the visitor starts fixing it. */
    form.addEventListener("input", function (event) {
      if (event.target.closest(".field.has-error")) clearError(event.target);
    });
    form.addEventListener("change", function (event) {
      if (event.target.closest(".field.has-error")) clearError(event.target);
    });

    form.addEventListener("submit", function (event) {
      var problems = validate();

      if (problems.length) {
        event.preventDefault();
        /* The status line is a polite live region, so it announces by itself;
           focus goes to the first invalid control, which is where the visitor
           has to act. Focusing the status box first would hide that. */
        showStatus(status, T.invalid, "err", false);
        problems[0].focus();
        return;
      }

      /* No `action` on the form: send it to the company's Google Form
         (assets/js/gforms.js). If that script is missing or the request
         fails, fall back to the pre-filled e-mail, so nothing is lost. */
      if (!form.getAttribute("action")) {
        event.preventDefault();
        if (!window.AegeanForms) {
          var mail = buildMail();
          showStatus(status, T.mailto, "ok", true);
          openMailto(mail.subject, mail.lines);
          return;
        }
        sendToGoogle();
        return;
      }

      lockWhileSending(form);
    });

    /* The Google Form has fewer questions than this form: quantity and
       "how can we help" travel inside the message, and "samples" is Yes when
       the visitor picked "Request samples". */
    function sendToGoogle() {
      var el = form.elements;
      var btn = form.querySelector('[type="submit"]');
      var label = btn.textContent;
      function text(field) { return field ? (field.value || "").trim() : ""; }
      function chosen(field) { return field && field.value ? field.options[field.selectedIndex].text.trim() : ""; }
      function done() { btn.disabled = false; btn.textContent = label; }

      /* A bot (hidden trap field filled, or sent within seconds): show success, send nothing. */
      if (window.AegeanForms.looksAutomated(form)) { showStatus(status, T.sent, "ok", true); form.reset(); return; }

      var extra = [];
      if (text(el.quantity)) extra.push(labelFor(el.quantity) + ": " + text(el.quantity));
      if (el.reason) extra.push(labelFor(el.reason) + ": " + chosen(el.reason));
      extra.push("Page: " + location.pathname + " (" + (document.documentElement.lang || "en") + ")");
      var message = text(el.message) + "\n\n" + extra.join("\n");

      btn.disabled = true;
      btn.textContent = T.sending;
      window.AegeanForms.send("enquiry", {
        name: text(el.name),
        company: text(el.company),
        email: text(el.email),
        phone: text(el.phone),
        country: text(el.country),
        product: chosen(el.product),
        samples: el.reason && el.reason.value === "samples" ? "Yes" : "No",
        message: message
      }).then(function () {
        done();
        showStatus(status, T.sent, "ok", true);
        form.reset();
      }, function () {
        /* Delivery failed (offline, blocked): hand the visitor the e-mail route instead. */
        done();
        var mail = buildMail();
        showStatus(status, T.sendFailed, "err", true);
        openMailto(mail.subject, mail.lines);
      });
    }
  }

  /* ---------- Newsletter sign-up ---------- */
  /* Same contract as the enquiry form: validate here; with an `action` set,
     hand off to the browser. With none, send the address to the company's
     newsletter Google Form (assets/js/gforms.js); if that fails, say so and
     offer an e-mail instead of pretending the address was stored. */
  function initNewsletter() {
    var form = document.getElementById("newsletter-form");
    if (!form) return;

    var status = document.getElementById("newsletter-status");
    var field = document.getElementById("newsletter-email");

    function setError(message) {
      var wrapper = field.closest(".field");
      if (wrapper) {
        wrapper.classList.add("has-error");
        var slot = linkErrorSlot(field);
        if (slot) slot.textContent = message;
      }
      field.setAttribute("aria-invalid", "true");
    }

    function clearError() {
      var wrapper = field.closest(".field");
      if (wrapper) wrapper.classList.remove("has-error");
      field.removeAttribute("aria-invalid");
    }

    form.addEventListener("input", clearError);

    form.addEventListener("submit", function (event) {
      var value = (field.value || "").trim();
      clearError();

      if (!value || !emailPattern.test(value)) {
        event.preventDefault();
        setError(value ? T.email : T.required);
        showStatus(status, T.invalid, "err", false);
        field.focus();
        return;
      }

      if (!form.getAttribute("action")) {
        event.preventDefault();
        /* Shown when sending is impossible or failed: an e-mail link instead.
           Built with DOM nodes, not innerHTML: the address is user input. */
        var offerMail = function (message, kind) {
          showStatus(status, message + " ", kind, true);
          var link = document.createElement("a");
          link.href = "mailto:" + MAIL + "?subject=" + encodeURIComponent(T.subjectNewsletter) +
            "&body=" + encodeURIComponent(value);
          link.textContent = T.newsletterLink;
          status.appendChild(link);
        };
        if (!window.AegeanForms) { offerMail(T.newsletterMailto, "ok"); return; }
        if (window.AegeanForms.looksAutomated(form)) { showStatus(status, T.newsletterSent, "ok", true); form.reset(); return; }
        var btn = form.querySelector('[type="submit"]');
        var label = btn.textContent;
        btn.disabled = true;
        btn.textContent = T.sending;
        window.AegeanForms.send("newsletter", { email: value }).then(function () {
          btn.disabled = false; btn.textContent = label;
          showStatus(status, T.newsletterSent, "ok", true);
          form.reset();
        }, function () {
          btn.disabled = false; btn.textContent = label;
          offerMail(T.newsletterFailed, "err");
        });
        return;
      }

      lockWhileSending(form);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    initYear();
    initContactForm();
    initNewsletter();
  });
})();
