/* Aegean Sun — shared front-end behaviour (no dependencies). */
(function () {
  "use strict";

  /* ---------- Mobile navigation ---------- */
  function initNav() {
    var toggle = document.querySelector(".nav__toggle");
    var menu = document.getElementById("primary-menu");
    if (toggle && menu) {
      toggle.addEventListener("click", function () {
        var open = menu.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(open));
      });
    }

    /* Dropdowns (products menu, language switcher): click/tap everywhere,
       hover as well on desktop. */
    var dropdowns = document.querySelectorAll(".has-dropdown");

    function isDesktop() {
      return window.matchMedia("(min-width: 981px)").matches;
    }

    function setOpen(item, open, viaHover) {
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

      item.addEventListener("mouseenter", function () {
        if (isDesktop() && !item.classList.contains("is-open")) setOpen(item, true, true);
      });
      item.addEventListener("mouseleave", function () {
        if (isDesktop()) setOpen(item, false);
      });
    });

    function closeAllDropdowns() {
      Array.prototype.forEach.call(dropdowns, function (item) {
        setOpen(item, false);
      });
    }

    document.addEventListener("click", closeAllDropdowns);
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeAllDropdowns();
    });
  }

  /* ---------- Footer year ---------- */
  function initYear() {
    var slot = document.querySelector("[data-year]");
    if (slot) slot.textContent = String(new Date().getFullYear());
  }

  /* ---------- Form messages, per page language ---------- */
  var MESSAGES = {
    en: {
      required: "This field is required.",
      email: "Please enter a valid email address.",
      short: "Please give us a little more detail (at least 10 characters).",
      invalid: "Please check the highlighted fields and try again.",
      sent: "Thank you! Your enquiry has been recorded. Our export team replies within one business day."
    },
    tr: {
      required: "Bu alanın doldurulması gerekiyor.",
      email: "Lütfen geçerli bir e-posta adresi girin.",
      short: "Lütfen biraz daha ayrıntı verin (en az 10 karakter).",
      invalid: "Lütfen işaretli alanları kontrol edip tekrar deneyin.",
      sent: "Teşekkürler! Talebiniz bize ulaştı. İhracat ekibimiz bir iş günü içinde dönüş yapar."
    }
  };
  var T = MESSAGES[document.documentElement.lang] || MESSAGES.en;

  /* ---------- Contact form ---------- */
  /* The form validates in the browser and then hands off to whatever endpoint
     is set in the form's `action` attribute. With no action configured it stays
     in demo mode: it shows a success message without sending anything.
     To go live, point `action` at a form service (Formspree, Netlify Forms,
     your own /api/contact handler, ...) and keep method="post". */
  function initContactForm() {
    var form = document.getElementById("contact-form");
    if (!form) return;

    var status = document.getElementById("form-status");
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    function setError(field, message) {
      var wrapper = field.closest(".field");
      if (!wrapper) return;
      wrapper.classList.add("has-error");
      var slot = wrapper.querySelector(".field__error");
      if (slot) slot.textContent = message;
      field.setAttribute("aria-invalid", "true");
    }

    function clearError(field) {
      var wrapper = field.closest(".field");
      if (!wrapper) return;
      wrapper.classList.remove("has-error");
      field.removeAttribute("aria-invalid");
    }

    function showStatus(message, kind) {
      if (!status) return;
      status.textContent = message;
      status.className = "form-status is-visible form-status--" + kind;
      status.focus();
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

    /* Clear an error as soon as the visitor starts fixing it. */
    form.addEventListener("input", function (event) {
      if (event.target.closest(".field.has-error")) clearError(event.target);
    });

    form.addEventListener("submit", function (event) {
      var problems = validate();

      if (problems.length) {
        event.preventDefault();
        showStatus(T.invalid, "err");
        problems[0].focus();
        return;
      }

      /* No endpoint wired up yet — confirm locally instead of navigating away. */
      if (!form.getAttribute("action")) {
        event.preventDefault();
        showStatus(T.sent, "ok");
        form.reset();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    initYear();
    initContactForm();
  });
})();
