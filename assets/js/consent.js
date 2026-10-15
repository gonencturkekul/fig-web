/* ==========================================================================
   Aegean Sun — cookie consent
   Google Analytics and Google Tag Manager are NOT loaded by the page itself.
   The head only declares denied consent defaults and queues gtag(); this file
   shows the choice, remembers it, and loads both only once the visitor
   accepts.
   Declining loads nothing and clears any cookie a previous visit left.
   The choice is kept in localStorage, which is not a cookie and never
   reaches the server.
   ========================================================================== */
(function () {
  "use strict";

  var GA_ID = "G-YSX5V6H7JQ";
  var GTM_ID = "GTM-P398DTWM";
  var KEY = "aegeansun-cookie-consent";
  var LANG = (document.documentElement.lang || "en").slice(0, 2).toLowerCase() === "tr" ? "tr" : "en";

  var COPY = {
    tr: {
      title: "Çerez tercihiniz",
      body: "Sitenin nasıl kullanıldığını anlamak için Google Analytics kullanmak istiyoruz; bunun için tarayıcınıza çerez yerleştirilir. Reddederseniz hiçbir çerez yerleştirilmez ve site tamamen aynı şekilde çalışır.",
      accept: "Kabul et",
      reject: "Reddet",
      details: "Hangi çerezler?",
      cols: ["Çerez", "Ne işe yarar", "Süre"],
      rows: [
        ["_ga", "Ziyaretçileri birbirinden ayırt eder", "2 yıl"],
        ["_ga_" + GA_ID.replace(/^G-/, ""), "Oturum durumunu saklar", "2 yıl"]
      ],
      note: "Tercihiniz yalnızca tarayıcınızda saklanır; çerez değildir ve bize gönderilmez. Dilediğiniz zaman sayfa altındaki “Çerez tercihleri” bağlantısından değiştirebilirsiniz.",
      reopen: "Çerez tercihleri",
      policy: "Gizlilik ve Çerezler",
      policyHref: "gizlilik.html"
    },
    en: {
      title: "Your cookie choice",
      body: "We would like to use Google Analytics to understand how the site is used, which places cookies in your browser. If you decline, no cookies are placed and the site works exactly the same.",
      accept: "Accept",
      reject: "Decline",
      details: "Which cookies?",
      cols: ["Cookie", "What it does", "Lifetime"],
      rows: [
        ["_ga", "Tells visitors apart", "2 years"],
        ["_ga_" + GA_ID.replace(/^G-/, ""), "Keeps session state", "2 years"]
      ],
      note: "Your choice is stored in your browser only; it is not a cookie and is never sent to us. You can change it at any time from the “Cookie preferences” link in the footer.",
      reopen: "Cookie preferences",
      policy: "Privacy &amp; Cookies",
      policyHref: "privacy.html"
    }
  }[LANG];

  /* ------------------------------------------------------------- storage */

  function read() {
    try { return window.localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function write(value) {
    try { window.localStorage.setItem(KEY, value); } catch (e) { /* private mode */ }
  }

  /* ----------------------------------------------------------- analytics */

  function gtagSafe() {
    /* The head defines gtag(); fall back to a queue push if it somehow did not. */
    if (typeof window.gtag === "function") return window.gtag;
    return function () { (window.dataLayer = window.dataLayer || []).push(arguments); };
  }

  var loaded = false;
  function loadAnalytics() {
    if (loaded) return;
    loaded = true;

    var gtag = gtagSafe();
    gtag("consent", "update", {
      analytics_storage: "granted"
    });

    /* Google Analytics 4, configured here rather than in the markup. */
    var ga = document.createElement("script");
    ga.async = true;
    ga.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    document.head.appendChild(ga);
    gtag("config", GA_ID);

    /* Google Tag Manager. This is the snippet Google hands out, moved out of
       the markup for the same reason: in the <head> it would reach Google
       before the visitor had answered the bar. */
    window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
    var gtm = document.createElement("script");
    gtm.async = true;
    gtm.src = "https://www.googletagmanager.com/gtm.js?id=" + GTM_ID;
    document.head.appendChild(gtm);
  }

  /* A visitor who accepted and then changed their mind keeps the cookies from
     the earlier visit unless we remove them here. */
  function clearAnalyticsCookies() {
    var names = document.cookie.split(";").map(function (c) {
      return c.split("=")[0].trim();
    }).filter(function (n) {
      return n === "_ga" || n.indexOf("_ga_") === 0 || n.indexOf("_gid") === 0;
    });
    var host = window.location.hostname;
    var domains = ["", host, "." + host];
    var parts = host.split(".");
    if (parts.length > 2) domains.push("." + parts.slice(-2).join("."));

    names.forEach(function (name) {
      domains.forEach(function (d) {
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/" +
          (d ? "; domain=" + d : "");
      });
    });
  }

  /* ---------------------------------------------------------------- view */

  var bar = null;

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function measure() {
    /* Keep the chat launcher clear of the bar while it is on screen. */
    var h = bar && !bar.hidden ? bar.offsetHeight : 0;
    document.documentElement.style.setProperty("--consent-h", h + "px");
  }

  function build() {
    bar = el("div", "consent");
    bar.setAttribute("role", "dialog");
    bar.setAttribute("aria-label", COPY.title);
    bar.setAttribute("aria-live", "polite");

    var inner = el("div", "consent__inner");

    var text = el("div", "consent__text");
    var h = el("strong", "consent__title", COPY.title);
    h.setAttribute("tabindex", "-1");
    text.appendChild(h);
    var intro = el("p", null, COPY.body + " ");
    var policy = el("a", "consent__policy", COPY.policy.replace("&amp;", "&"));
    policy.href = COPY.policyHref;
    intro.appendChild(policy);
    text.appendChild(intro);

    var details = el("details", "consent__details");
    details.appendChild(el("summary", null, COPY.details));
    var table = el("table", "consent__table");
    var thead = el("thead");
    var hr = el("tr");
    COPY.cols.forEach(function (c) {
      var th = el("th", null, c);
      th.setAttribute("scope", "col");
      hr.appendChild(th);
    });
    thead.appendChild(hr);
    table.appendChild(thead);
    var tbody = el("tbody");
    COPY.rows.forEach(function (row) {
      var tr = el("tr");
      row.forEach(function (cell, i) {
        var td = el(i === 0 ? "th" : "td", null, cell);
        if (i === 0) td.setAttribute("scope", "row");
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    details.appendChild(table);
    details.appendChild(el("p", "consent__note", COPY.note));
    details.addEventListener("toggle", measure);
    text.appendChild(details);

    var actions = el("div", "consent__actions");
    /* Declining has to be exactly as easy as accepting, so both are buttons
       of the same size and weight — no greyed-out "decline". */
    var reject = el("button", "consent__btn consent__btn--ghost", COPY.reject);
    reject.type = "button";
    var accept = el("button", "consent__btn consent__btn--primary", COPY.accept);
    accept.type = "button";
    reject.addEventListener("click", function () { decide("denied"); });
    accept.addEventListener("click", function () { decide("granted"); });
    actions.appendChild(reject);
    actions.appendChild(accept);

    inner.appendChild(text);
    inner.appendChild(actions);
    bar.appendChild(inner);
    document.body.appendChild(bar);
    return bar;
  }

  function show() {
    if (!bar) build();
    bar.hidden = false;
    measure();
    var title = bar.querySelector(".consent__title");
    if (title) title.focus();
  }

  function hide() {
    if (!bar) return;
    bar.hidden = true;
    measure();
  }

  function decide(value) {
    write(value);
    hide();
    if (value === "granted") {
      loadAnalytics();
    } else {
      clearAnalyticsCookies();
    }
  }

  /* --------------------------------------------------------------- wiring */

  function initReopenLinks() {
    var links = document.querySelectorAll("[data-consent-open]");
    Array.prototype.forEach.call(links, function (a) {
      a.textContent = COPY.reopen;
      a.addEventListener("click", function (e) {
        e.preventDefault();
        show();
      });
    });
  }

  function start() {
    initReopenLinks();
    var choice = read();
    if (choice === "granted") {
      loadAnalytics();
    } else if (choice !== "denied") {
      show();
    }
    window.addEventListener("resize", measure);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
