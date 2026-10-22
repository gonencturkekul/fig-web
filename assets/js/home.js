/* ==========================================================================
   Aegean Sun home pages (EN and TR): behaviour. Language from <html lang>.
   1. Entrances: blocks marked data-reveal show their parts in sequence, once.
   2. The live carton label: the enquiry form rewrites the label as you choose,
      and sending opens an e-mail with the label as its body. The site has no
      form backend yet, so mailto is the honest route (same as the live site).
   3. The film: a muted loop while it is on screen; "Play with sound" restarts
      it with controls; the tabs switch caption language or show the transcript.
   No dependencies; everything degrades to plain, visible content without JS.
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- 1. Entrances --------------------------------------------------- */
  var hero = document.querySelector('.hero');
  // Let the first paint happen hidden, then raise the sun and open the photograph.
  if (hero) requestAnimationFrame(function () { requestAnimationFrame(function () { hero.classList.add('is-in'); }); });

  var blocks = document.querySelectorAll('[data-reveal]');
  blocks.forEach(function (block) {
    // Each child gets its place in the sequence; CSS turns it into a 45–80ms stagger.
    Array.prototype.forEach.call(block.children, function (child, i) { child.style.setProperty('--i', Math.min(i, 10)); });
  });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.05 });
    blocks.forEach(function (b) { io.observe(b); });
  } else {
    blocks.forEach(function (b) { b.classList.add('is-in'); });
  }
  // Printing or saving the page should never capture hidden blocks.
  window.addEventListener('beforeprint', function () { blocks.forEach(function (b) { b.classList.add('is-in'); }); });

  /* ---- Language switcher ---------------------------------------------- */
  // Click or tap opens the menu; Escape or a click elsewhere closes it and returns focus sensibly.
  var langBtn = document.querySelector('.lang__button');
  var langMenu = document.getElementById('lang-menu');
  if (langBtn && langMenu) {
    var setLang = function (open) {
      langBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      langMenu.hidden = !open;
    };
    langBtn.addEventListener('click', function () {
      var open = langBtn.getAttribute('aria-expanded') !== 'true';
      setLang(open);
      if (open) langMenu.querySelector('a').focus();
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.lang')) setLang(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && langBtn.getAttribute('aria-expanded') === 'true') { setLang(false); langBtn.focus(); }
    });
    // Tabbing out of the switcher closes the menu too.
    langBtn.parentNode.addEventListener('focusout', function (e) {
      if (!e.relatedTarget || !langBtn.parentNode.contains(e.relatedTarget)) setLang(false);
    });
  }

  /* ---- 2. The live carton label --------------------------------------- */
  // Grades and packs per product, in both languages, taken from the four product pages (EN and TR).
  // The page language comes from <html lang>, the same way main.js and chat.js choose theirs.
  var LANG = (document.documentElement.lang || 'en').slice(0, 2).toLowerCase() === 'tr' ? 'tr' : 'en';
  var CATALOGUES = {
    en: {
      fig: {
        name: 'Dried fig',
        grades: ['Lerida', 'Protoben', 'Bağlama', 'Garland', 'Pulled', 'Layer', 'Makaroni', 'Diced 8×10 mm'],
        packs: ['5 kg carton', '10 kg carton', '12.5 kg industrial carton', '1 kg tray', '200 g / 500 g retail pouch', 'Private label']
      },
      salami: {
        name: 'Fig salami',
        grades: ['Smoked paprika', 'Almond', 'Pistachio', 'Moroccan spices', 'Tikka masala', 'Orange', 'Mixed, all six'],
        packs: ['180 g flow-wrapped log', 'Vacuum-packed log', 'Mixed carton', 'Gift box with dried figs', 'Private label sleeve']
      },
      apricot: {
        name: 'Dried apricot',
        grades: ['Jumbo No.1–No.2', 'Standard No.3–No.4', 'Small No.5–No.6', 'Natural, unsulphured', 'Organic', 'Diced 10×12 mm', 'Puree and paste'],
        packs: ['5 kg carton', '12.5 kg carton', '1 kg PET jar', '200 g / 500 g retail pouch', '20 kg aseptic', 'Private label']
      },
      mulberry: {
        name: 'Dried mulberry',
        grades: ['Whole, sun and wind dried'],
        packs: ['12.5 kg bulk carton', 'Your grammage', 'Own-label retail']
      }
    },
    tr: {
      fig: {
        name: 'Kuru incir',
        grades: ['Lerida', 'Protoben', 'Bağlama', 'Garland (Çelenk)', 'Çekme', 'Layer (Sıralı)', 'Makaroni', 'Küp 8×10 mm'],
        packs: ['5 kg koli', '10 kg koli', '12,5 kg sanayi kolisi', '1 kg tabla', '200 g / 500 g perakende doypack', 'Özel marka']
      },
      salami: {
        name: 'İncir salamı',
        grades: ['Tütsülenmiş kırmızı biberli', 'Bademli', 'Fıstıklı', 'Fas baharatlı', 'Tikka masala', 'Portakallı', 'Karma, altı çeşit'],
        packs: ['180 g flowpack çubuk', 'Vakumlu çubuk', 'Karma koli', 'Kuru incirli hediye kutusu', 'Özel marka bandrol']
      },
      apricot: {
        name: 'Kuru kayısı',
        grades: ['Jumbo 1–2 numara', 'Standart 3–4 numara', 'Küçük 5–6 numara', 'Doğal (kükürtsüz)', 'Organik', 'Küp 10×12 mm', 'Püre ve ezme'],
        packs: ['5 kg koli', '12,5 kg koli', '1 kg PET kavanoz', '200 g / 500 g perakende doypack', '20 kg aseptik', 'Özel marka']
      },
      mulberry: {
        name: 'Kuru dut',
        grades: ['Bütün, güneş ve rüzgârla kurutulmuş'],
        packs: ['12,5 kg dökme koli', 'İstediğiniz gramaj', 'Kendi etiketinizle perakende']
      }
    }
  };
  var WORDS = {
    en: {
      volume: 'To be agreed', dest: 'Your port', sampleYes: 'Yes, a graded sample set', sampleNo: 'No',
      missing: 'One thing is missing: your e-mail address.',
      opening: 'Opening your e-mail app…',
      opened: 'Your e-mail app should now show the enquiry, ready to send. If it did not open, write to ',
      from: 'Enquiry from aegeansunfruit.com', subject: 'Enquiry: ',
      product: 'Product', grade: 'Grade', pack: 'Pack', vol: 'Volume', terms: 'Terms', shipTo: 'Ship to',
      samples: 'Samples', name: 'Name', company: 'Company', email: 'E-mail'
    },
    tr: {
      volume: 'Görüşülecek', dest: 'Limanınız', sampleYes: 'Evet, sınıflandırılmış numune seti', sampleNo: 'Hayır',
      missing: 'Bir eksik var: e-posta adresiniz.',
      opening: 'E-posta uygulamanız açılıyor…',
      opened: 'E-posta uygulamanızda talebiniz gönderilmeye hazır olmalı. Açılmadıysa şu adrese yazın: ',
      from: 'aegeansunfruit.com üzerinden gelen talep', subject: 'Fiyat talebi: ',
      product: 'Ürün', grade: 'Sınıf', pack: 'Ambalaj', vol: 'Miktar', terms: 'Teslim şekli', shipTo: 'Varış',
      samples: 'Numune', name: 'Ad soyad', company: 'Firma', email: 'E-posta'
    }
  };
  var CATALOGUE = CATALOGUES[LANG];
  var W = WORDS[LANG];
  var EMAIL = 'muzaffer.turkekul@aegeansunfruit.com';

  var form = document.getElementById('enquiry-form');
  if (form) {
    var f = form.elements;
    var status = document.getElementById('enquiry-status');
    var emailErr = document.getElementById('f-email-err');
    var out = {};
    document.querySelectorAll('[data-out]').forEach(function (dd) { out[dd.getAttribute('data-out')] = dd; });

    function fillOptions(select, list) {
      select.innerHTML = '';
      list.forEach(function (v) { var o = document.createElement('option'); o.textContent = v; select.appendChild(o); });
    }
    // Writes one label line, and flashes it briefly so the buyer sees the label respond.
    function write(key, value) {
      var dd = out[key];
      if (!dd || dd.textContent === value) return;
      dd.textContent = value;
      if (!reduceMotion) {
        dd.classList.add('is-new');
        setTimeout(function () { dd.classList.remove('is-new'); }, 600);
      }
    }
    function label() {
      var p = CATALOGUE[f.product.value];
      write('product', p.name);
      write('grade', f.grade.value);
      write('pack', f.pack.value);
      write('terms', f.terms.value);
      write('volume', f.volume.value.trim() || W.volume);
      write('dest', f.dest.value.trim() || W.dest);
      write('sample', f.sample.checked ? W.sampleYes : W.sampleNo);
    }
    function product() {
      var p = CATALOGUE[f.product.value];
      fillOptions(f.grade, p.grades);
      fillOptions(f.pack, p.packs);
      label();
    }

    f.product.addEventListener('change', product);
    form.addEventListener('input', label);
    form.addEventListener('change', label);
    product();

    // "Free samples" links tick the sample box on the way to the form.
    document.querySelectorAll('[data-sample]').forEach(function (a) {
      a.addEventListener('click', function () { f.sample.checked = true; label(); });
    });

    f.email.addEventListener('input', function () {
      if (f.email.getAttribute('aria-invalid') === 'true' && f.email.validity.valid) {
        f.email.removeAttribute('aria-invalid'); emailErr.hidden = true;
      }
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.className = 'coupon__status'; status.textContent = '';
      var email = f.email.value.trim();
      if (!email || !f.email.validity.valid) {
        f.email.setAttribute('aria-invalid', 'true');
        emailErr.hidden = false;
        status.classList.add('is-error');
        status.textContent = W.missing;
        f.email.focus();
        return;
      }
      // The e-mail body is the label, line by line, so nothing typed is lost.
      var lines = [
        W.from,
        '',
        W.product + ': ' + out.product.textContent,
        W.grade + ': ' + out.grade.textContent,
        W.pack + ': ' + out.pack.textContent,
        W.vol + ': ' + out.volume.textContent,
        W.terms + ': ' + out.terms.textContent,
        W.shipTo + ': ' + out.dest.textContent,
        W.samples + ': ' + out.sample.textContent,
        '',
        W.name + ': ' + (f.name.value.trim() || '-'),
        W.company + ': ' + (f.company.value.trim() || '-'),
        W.email + ': ' + email
      ];
      var subject = W.subject + out.product.textContent + ', ' + out.grade.textContent;
      var send = form.querySelector('.coupon__send');
      send.setAttribute('aria-busy', 'true');
      status.textContent = W.opening;
      window.location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\n'));
      setTimeout(function () {
        send.removeAttribute('aria-busy');
        status.classList.add('is-ok');
        status.innerHTML = '';
        status.appendChild(document.createTextNode(W.opened));
        var a = document.createElement('a'); a.href = 'mailto:' + EMAIL; a.textContent = EMAIL;
        status.appendChild(a); status.appendChild(document.createTextNode('.'));
      }, 900);
    });
  }

  /* ---- 3. The film ------------------------------------------------------ */
  var video = document.getElementById('film');
  if (video) {
    var playBtn = document.getElementById('film-play');
    var withSound = false;
    var saveData = navigator.connection && navigator.connection.saveData;

    function showTrack(lang) {
      Array.prototype.forEach.call(video.textTracks, function (t) {
        t.mode = (lang && t.language === lang) ? 'showing' : 'hidden';
      });
    }

    // A silent loop while the film is on screen; skipped for reduced motion and data-saver users.
    if (!reduceMotion && !saveData && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (withSound) return;
          if (e.isIntersecting) { video.preload = 'auto'; video.play().catch(function () {}); }
          else video.pause();
        });
      }, { threshold: 0.4 }).observe(video);
    }

    playBtn.addEventListener('click', function () {
      withSound = true;
      video.muted = false; video.loop = false; video.controls = true; video.currentTime = 0;
      var sel = document.querySelector('.film__tabs [aria-selected="true"]').getAttribute('data-track');
      showTrack(sel === 'transcript' ? LANG : sel);  // transcript tab: captions in the page's language
      video.play().catch(function () {});
      video.focus();
    });

    // Tabs: arrow keys move between them; selecting one switches captions or shows the transcript.
    var tabs = Array.prototype.slice.call(document.querySelectorAll('.film__tabs [role="tab"]'));
    var panel = document.getElementById('film-panel');
    function select(tab) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
      });
      panel.setAttribute('aria-labelledby', tab.id);
      var which = tab.getAttribute('data-track');
      panel.querySelector('[data-for="caption"]').hidden = which === 'transcript';
      panel.querySelector('[data-for="transcript"]').hidden = which !== 'transcript';
      // Captions follow the tab on the muted loop too (useful without sound); the transcript tab keeps the page language.
      showTrack(which === 'transcript' ? LANG : which);
    }
    // Start with the tab marked selected in the markup (English on the EN page, Turkish on the TR page).
    var first = tabs.filter(function (t) { return t.getAttribute('aria-selected') === 'true'; })[0];
    if (first) video.addEventListener('loadedmetadata', function () { select(first); }, { once: true });
    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { select(tab); });
      tab.addEventListener('keydown', function (e) {
        var next = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : null;
        if (next === null) return;
        e.preventDefault();
        var t = tabs[(next + tabs.length) % tabs.length];
        t.focus(); select(t);
      });
    });
  }
})();
