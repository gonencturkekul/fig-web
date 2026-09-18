/* ==========================================================================
   Aegean Sun — sales assistant widget
   A self-contained, keyword-driven assistant. No backend, no API key, no
   third-party script: every answer below is a fact that already appears on
   this site. Anything it cannot answer is handed to a human.
   Language is read from <html lang>.
   ========================================================================== */
(function () {
  "use strict";

  var LANG = (document.documentElement.lang || "en").slice(0, 2).toLowerCase() === "tr" ? "tr" : "en";

  /* ---------------------------------------------------------------- copy */

  var UI = {
    tr: {
      launch: "Sorunuz mu var?",
      title: "Satış yardımcısı",
      subtitle: "Otomatik yanıtlar &middot; 7/24",
      close: "Sohbeti kapat",
      placeholder: "Sorunuzu yazın…",
      send: "Gönder",
      note: "Bu otomatik bir yardımcıdır; yanıtlar sitedeki bilgilerden gelir.",
      welcome: "Merhaba! Aegean Sun'ın otomatik satış yardımcısıyım. Ürünler, minimum sipariş, teslim şekilleri, numune ve sertifikalar hakkında sitedeki bilgileri hemen verebilirim.",
      chips: ["Ürünleriniz neler?", "Minimum sipariş miktarı", "Numune alabilir miyim?", "Fiyat listesi"]
    },
    en: {
      launch: "Any questions?",
      title: "Sales assistant",
      subtitle: "Automated answers &middot; 24/7",
      close: "Close chat",
      placeholder: "Type your question…",
      send: "Send",
      note: "This is an automated assistant; its answers come from this site.",
      welcome: "Hello! I am Aegean Sun's automated sales assistant. I can answer what this site says about our products, minimum order, incoterms, samples and certificates.",
      chips: ["What do you sell?", "Minimum order quantity", "Can I get a sample?", "Price list"]
    }
  };

  var L = {
    tr: {
      products: "urunler.html", fig: "kuru-incir.html", salami: "incir-salami.html",
      apricot: "kuru-kayisi.html", mulberry: "kuru-dut.html",
      contact: "iletisim.html", form: "iletisim.html#contact-form",
      faq: "iletisim.html#faq", about: "hakkimizda.html"
    },
    en: {
      products: "products.html", fig: "product-dried-fig.html", salami: "product-fig-salami.html",
      apricot: "product-dried-apricot.html", mulberry: "product-dried-mulberry.html",
      contact: "contact.html", form: "contact.html#contact-form",
      faq: "contact.html#faq", about: "about.html"
    }
  }[LANG];

  var MAIL = "mturkekul@gmail.com";
  var TEL = "+90 507 863 40 45";

  /* ------------------------------------------------------------- answers */

  var KB = {
    tr: [
      { id: "products",
        k: ["urun", "ürün", "ne sat", "neler sat", "cesit", "çeşit", "katalog", "yelpaze", "portfoy"],
        a: "Dört ürünümüz var: kuru incir, incir salamı, kuru kayısı ve kuru dut. Hepsi perakende paket, toplu tüketim ve özel marka olarak hazırlanabiliyor.",
        links: [["Tüm ürünler", L.products], ["Kuru İncir", L.fig], ["İncir Salamı", L.salami]],
        next: ["Minimum sipariş miktarı", "Numune alabilir miyim?", "Sertifikalarınız"] },

      { id: "fig",
        k: ["kuru incir", "incir kal", "lerida", "protoben", "incir hakkinda", "incir hakkında"],
        a: "Kuru incirimiz Aydın Nazilli'deki fabrikamızda üretiliyor. Doğal Lerida ve Protoben çeşitleri tahta tepsilerde güneşte kurutuluyor, sonra elde altı kaliteye ayrılıyor.",
        links: [["Kuru İncir sayfası", L.fig]],
        next: ["Ambalaj seçenekleri", "Teslim süresi", "Fiyat listesi"] },

      { id: "salami",
        k: ["salam", "sucuk", "sucuğ", "180"],
        a: "İncir salamı Atina'daki üretim tesisimizde yapılıyor. Altı çeşidi var, hepsi 180 g çubuk; şeker ilavesiz ve katkısız.",
        links: [["İncir Salamı sayfası", L.salami]],
        next: ["Çeşitler ve içerikler", "Minimum sipariş miktarı", "Numune alabilir miyim?"] },

      { id: "apricot",
        k: ["kayis", "kayıs", "malatya", "apricot"],
        a: "Kuru kayısı Malatya'dan geliyor; kükürtlü sarı ve doğal koyu tipler. Bütün yarımlar kilodaki adet sayısına göre, jumbodan küçüğe satılıyor; ayrıca sanayi için kesim, küp ve püre yapıyoruz.",
        links: [["Kuru Kayısı sayfası", L.apricot]],
        next: ["Minimum sipariş miktarı", "Teslim süresi", "Fiyat listesi"] },

      { id: "mulberry",
        k: ["dut", "mulberry"],
        a: "Kuru dut, ürün yelpazemizin dördüncü ürünü; güneş ve rüzgârla kurutuluyor.",
        links: [["Kuru Dut sayfası", L.mulberry]],
        next: ["Ambalaj seçenekleri", "Numune alabilir miyim?", "Fiyat listesi"] },

      { id: "moq",
        k: ["minimum", "moq", "en az", "asgari", "alt sinir", "alt sınır", "kac kilo", "kaç kilo", "palet", "konteyner"],
        a: "Stoklu perakende formatlarında bir palet (yaklaşık 500 kg), özel marka üretiminde bir tam konteyner. Numunede alt sınır yok.",
        links: [["Sık sorulanlar", L.faq]],
        next: ["Özel marka üretimi", "Teslim süresi", "Numune alabilir miyim?"] },

      { id: "private",
        k: ["ozel marka", "özel marka", "private label", "kendi markam", "fason", "doypack", "etiket", "tasarim", "tasarım"],
        a: "Evet, özel marka üretimi yapıyoruz. Doypack, bandrol ve kolileri sizin tasarımınızla basıyoruz; çok dilli etiketler ve pazara özel besin değeri tabloları dahil. Tasarım onayından sonra tipik termin dört hafta.",
        links: [["Teklif formu", L.form]],
        next: ["Minimum sipariş miktarı", "Teslim şekilleri", "Sertifikalarınız"] },

      { id: "incoterms",
        k: ["incoterm", "teslim sekl", "teslim şekl", "exw", "fob", "cif", "ddp", "navlun", "nakliye", "kargo", "hava"],
        a: "EXW, FOB İzmir, CIF ve DDP ile çalışıyoruz. Numuneler ve acil tamamlamalar için hava kargo da mümkün.",
        links: [["Sık sorulanlar", L.faq]],
        next: ["Teslim süresi", "Minimum sipariş miktarı", "Fiyat listesi"] },

      { id: "delivery",
        k: ["teslim sure", "teslim süre", "ne kadar sur", "ne kadar sür", "termin", "transit", "sevkiyat ne zaman", "kac gun", "kaç gün", "lead time"],
        a: "Stoklu formatlar, sipariş onayından sonra genellikle 10 iş günü içinde tesisten çıkar. Deniz yolu transit süresi Kuzey Avrupa'ya yaklaşık 7–12 gün, Kuzey Amerika'ya 25–35 gündür.",
        links: [["Sık sorulanlar", L.faq]],
        next: ["Teslim şekilleri", "Fiyat listesi", "İletişim bilgileri"] },

      { id: "certs",
        k: ["sertifika", "belge", "analiz", "brcgs", "iso", "organik", "koser", "koşer", "helal", "mensei", "menşe", "saglik", "sağlık"],
        a: "Her sevkiyat analiz raporu, menşe şahadetnamesi ve sağlık sertifikasıyla birlikte yola çıkar. BRCGS, ISO 22000, organik, Koşer ve Helal belgelerini talep üzerine önceden paylaşıyoruz.",
        links: [["Belge talebi", L.form]],
        next: ["Teslim şekilleri", "Minimum sipariş miktarı", "İletişim bilgileri"] },

      { id: "sample",
        k: ["numune", "sample", "deneme kutu", "tadim", "tadım"],
        a: "Numune kutusu gönderiyoruz; numune ücretlidir ve miktar alt sınırı yoktur. Formda ürünü ve varış noktasını belirtirseniz hemen dönelim.",
        links: [["Numune isteyin", L.form]],
        next: ["Fiyat listesi", "Minimum sipariş miktarı", "Teslim süresi"] },

      { id: "price",
        k: ["fiyat", "teklif", "price", "quote", "ucret", "ücret", "maliyet", "liste"],
        a: "Fiyatlar ürüne, miktara ve varış noktasına göre değişiyor, bu yüzden siteye sabit liste koymuyoruz. Ürünü, miktarı ve varış limanını iletin; ekibimiz fiyat, termin ve numune ile dönsün.",
        links: [["Teklif formu", L.form], ["E-posta: " + MAIL, "mailto:" + MAIL]],
        next: ["Minimum sipariş miktarı", "Teslim şekilleri", "Numune alabilir miyim?"] },

      { id: "contact",
        k: ["iletisim", "iletişim", "telefon", "whatsapp", "mail", "e-posta", "eposta", "ulas", "ulaş", "numara", "kiminle"],
        a: "Satış ve ihracat: Muzaffer Türkekul. E-posta " + MAIL + " — mesajlarınıza 7 gün 24 saat cevap veriyoruz. Telefon ve WhatsApp " + TEL + ".",
        links: [["E-posta gönderin", "mailto:" + MAIL], ["Telefon / WhatsApp", "tel:+905078634045"], ["İletişim sayfası", L.contact]],
        next: ["Temsilcilikleriniz", "Çalışma saatleri", "Fiyat listesi"] },

      { id: "reps",
        k: ["temsilci", "kanada", "canada", "toronto", "yunanistan", "atina", "ontario", "cetin", "çetin", "filiz"],
        a: "Yurt dışı temsilciliklerimiz: Kanada / Toronto — Çetin Onur, +1 548 255 6022. Yunanistan / Atina — Filiz Tipos, +30 693 285 0255. İkisine de telefon ve WhatsApp'tan ulaşabilirsiniz.",
        links: [["İletişim sayfası", L.contact]],
        next: ["İletişim bilgileri", "Fiyat listesi", "Nerede üretiyorsunuz?"] },

      { id: "where",
        k: ["nerede", "adres", "fabrika", "tesis", "ofis", "konum", "ziyaret", "aydin", "aydın", "nazilli", "istanbul"],
        a: "Satış ofisi İstanbul / Kağıthane, fabrika Aydın / Nazilli, üretim fabrikası Atina / Yunanistan. Bahçe ve tesis ziyaretlerine açığız.",
        links: [["İletişim sayfası", L.contact], ["Hakkımızda", L.about]],
        next: ["Temsilcilikleriniz", "Kapasiteniz nedir?", "İletişim bilgileri"] },

      { id: "capacity",
        k: ["kapasite", "ton", "uretim miktar", "üretim miktar", "kac ulke", "kaç ülke", "ihracat pazar", "ne zamandan beri", "kurulus", "kuruluş", "1968"],
        a: "1968'den beri ailece hasat ediyoruz. Yıllık kapasitemiz 22.500 ton ve 24 ülkeye ihracat yapıyoruz.",
        links: [["Hakkımızda", L.about]],
        next: ["Nerede üretiyorsunuz?", "Sertifikalarınız", "Ürünleriniz neler?"] },

      { id: "season",
        k: ["sezon", "hasat", "2026", "yeni mahsul", "rekolte"],
        a: "2026 sezon hasatları başlamıştır. Kurutma işlemi yapılıp alıcılara ulaştırılacaktır.",
        links: [["Kuru İncir sayfası", L.fig]],
        next: ["Fiyat listesi", "Teslim süresi", "Numune alabilir miyim?"] },

      { id: "hours",
        k: ["saat", "ne zaman acik", "ne zaman açık", "mesai", "cevap ne zaman", "gun icinde", "gün içinde"],
        a: "Telefon Pazartesi–Cuma 08:30–18:00 (GMT+3) arasında açık. E-postalarınıza 7 gün 24 saat cevap veriyoruz.",
        links: [["İletişim sayfası", L.contact]],
        next: ["İletişim bilgileri", "Temsilcilikleriniz", "Fiyat listesi"] },

      { id: "langs",
        k: ["dil", "language", "ingilizce", "almanca", "yunanca", "konusuyor", "konuşuyor"],
        a: "Türkçe, İngilizce, Almanca ve Yunanca konuşuyoruz.",
        links: [["İletişim sayfası", L.contact]],
        next: ["İletişim bilgileri", "Temsilcilikleriniz", "Fiyat listesi"] },

      { id: "hello",
        k: ["merhaba", "selam", "gunaydin", "günaydın", "iyi gunler", "iyi günler", "hello", "hi "],
        a: "Merhaba! Hangi ürünle ilgileniyorsunuz?",
        links: [],
        next: ["Ürünleriniz neler?", "Fiyat listesi", "Numune alabilir miyim?"] },

      { id: "thanks",
        k: ["tesekkur", "teşekkür", "sagol", "sağol", "eyvallah", "thanks"],
        a: "Rica ederim. Başka bir sorunuz olursa buradayım.",
        links: [],
        next: ["Ürünleriniz neler?", "İletişim bilgileri", "Fiyat listesi"] }
    ],

    en: [
      { id: "products",
        k: ["product", "what do you sell", "range", "catalog", "catalogue", "portfolio", "offer"],
        a: "We have four products: dried figs, fig salami, dried apricots and dried mulberries. All of them can be packed for retail, food service or private label.",
        links: [["All products", L.products], ["Dried Fig", L.fig], ["Fig Salami", L.salami]],
        next: ["Minimum order quantity", "Can I get a sample?", "Your certificates"] },

      { id: "fig",
        k: ["dried fig", "lerida", "protoben", "fig grade", "about figs"],
        a: "Our dried figs are produced at our factory in Nazilli, Aydin. Natural Lerida and Protoben are sun-dried on wooden trays and then hand-sorted into six grades.",
        links: [["Dried Fig page", L.fig]],
        next: ["Packaging formats", "Delivery time", "Price list"] },

      { id: "salami",
        k: ["salami", "salam", "180 g", "180g"],
        a: "Fig salami is made at our production plant in Athens. There are six varieties, all in 180 g logs, with no added sugar and no additives.",
        links: [["Fig Salami page", L.salami]],
        next: ["Varieties and ingredients", "Minimum order quantity", "Can I get a sample?"] },

      { id: "apricot",
        k: ["apricot", "malatya"],
        a: "Our dried apricots come from Malatya, in sulphured golden and natural dark types. Whole halves are sold by count per kilo, from jumbo downwards; below that we cut, dice and purée to industrial specification.",
        links: [["Dried Apricot page", L.apricot]],
        next: ["Minimum order quantity", "Delivery time", "Price list"] },

      { id: "mulberry",
        k: ["mulberry", "mulberries"],
        a: "Dried mulberry is the fourth product in our range; it is dried by sun and wind.",
        links: [["Dried Mulberry page", L.mulberry]],
        next: ["Packaging formats", "Can I get a sample?", "Price list"] },

      { id: "moq",
        k: ["minimum", "moq", "smallest order", "how much do i have to", "pallet", "container"],
        a: "One pallet (roughly 500 kg) for stocked retail formats, and one full container for private label runs. For samples there is no minimum.",
        links: [["FAQ", L.faq]],
        next: ["Do you supply private label?", "Delivery time", "Can I get a sample?"] },

      { id: "private",
        k: ["private label", "own brand", "white label", "artwork", "pouch", "label", "packaging design"],
        a: "Yes, we supply private label. We print pouches, sleeves and cartons to your artwork, including multilingual labels and market-specific nutrition panels. Typical lead time is four weeks from artwork approval.",
        links: [["Enquiry form", L.form]],
        next: ["Minimum order quantity", "Which incoterms?", "Your certificates"] },

      { id: "incoterms",
        k: ["incoterm", "exw", "fob", "cif", "ddp", "shipping term", "freight", "air freight"],
        a: "We work with EXW, FOB Izmir, CIF and DDP. Air freight is available for samples and urgent top-ups.",
        links: [["FAQ", L.faq]],
        next: ["Delivery time", "Minimum order quantity", "Price list"] },

      { id: "delivery",
        k: ["delivery", "how long", "lead time", "transit", "when can you ship", "dispatch"],
        a: "Stocked formats normally leave our facility within 10 working days of a confirmed order. Sea transit is roughly 7–12 days to Northern Europe and 25–35 days to North America.",
        links: [["FAQ", L.faq]],
        next: ["Which incoterms?", "Price list", "Contact details"] },

      { id: "certs",
        k: ["certificate", "certification", "analysis", "brcgs", "iso", "organic", "kosher", "halal", "origin", "health certificate", "document"],
        a: "Every shipment travels with its analysis report, certificate of origin and health certificate. BRCGS, ISO 22000, organic, Kosher and Halal documents are shared on request beforehand.",
        links: [["Request documents", L.form]],
        next: ["Which incoterms?", "Minimum order quantity", "Contact details"] },

      { id: "sample",
        k: ["sample", "trial box", "tasting", "try your"],
        a: "We do send sample boxes. Samples are charged, and there is no minimum quantity. Tell us the product and the destination in the form and we will come back to you.",
        links: [["Request a sample", L.form]],
        next: ["Price list", "Minimum order quantity", "Delivery time"] },

      { id: "price",
        k: ["price", "quote", "cost", "how much", "rate", "offer sheet", "price list"],
        a: "Prices depend on the product, the volume and the destination, so we do not publish a fixed list. Send us the product, the quantity and the destination port and our team will come back with a price, a lead time and a sample.",
        links: [["Enquiry form", L.form], ["Email: " + MAIL, "mailto:" + MAIL]],
        next: ["Minimum order quantity", "Which incoterms?", "Can I get a sample?"] },

      { id: "contact",
        k: ["contact", "phone", "whatsapp", "email", "mail", "reach you", "talk to", "call you"],
        a: "Sales and export: Muzaffer Türkekul. Email " + MAIL + " — we reply to messages 24/7. Phone and WhatsApp " + TEL + ".",
        links: [["Send an email", "mailto:" + MAIL], ["Phone / WhatsApp", "tel:+905078634045"], ["Contact page", L.contact]],
        next: ["Your representatives", "Opening hours", "Price list"] },

      { id: "reps",
        k: ["representative", "agent", "canada", "toronto", "greece", "athens", "ontario", "cetin", "filiz"],
        a: "Our representatives abroad: Canada / Toronto — Çetin Onur, +1 548 255 6022. Greece / Athens — Filiz Tipos, +30 693 285 0255. Both are reachable by phone and WhatsApp.",
        links: [["Contact page", L.contact]],
        next: ["Contact details", "Price list", "Where do you produce?"] },

      { id: "where",
        k: ["where are you", "address", "factory", "facility", "office", "location", "visit", "aydin", "nazilli", "istanbul"],
        a: "Our sales office is in Kagithane, Istanbul, the factory is in Nazilli, Aydin, and the production plant is in Athens, Greece. Orchard and facility visits are welcome.",
        links: [["Contact page", L.contact], ["About us", L.about]],
        next: ["Your representatives", "What is your capacity?", "Contact details"] },

      { id: "capacity",
        k: ["capacity", "tonnes", "tons", "how many countries", "export market", "since when", "founded", "1968"],
        a: "We have been harvesting as a family since 1968. Our annual capacity is 22,500 tonnes and we export to 24 countries.",
        links: [["About us", L.about]],
        next: ["Where do you produce?", "Your certificates", "What do you sell?"] },

      { id: "season",
        k: ["season", "harvest", "2026", "new crop"],
        a: "The 2026 season harvest has started. The fruit is being dried now and will be shipped to buyers.",
        links: [["Dried Fig page", L.fig]],
        next: ["Price list", "Delivery time", "Can I get a sample?"] },

      { id: "hours",
        k: ["opening hour", "office hour", "when are you open", "what time", "how fast do you reply"],
        a: "The phone is open Monday–Friday, 08:30–18:00 (GMT+3). We reply to e-mail 24/7.",
        links: [["Contact page", L.contact]],
        next: ["Contact details", "Your representatives", "Price list"] },

      { id: "langs",
        k: ["language", "english", "german", "greek", "turkish", "do you speak"],
        a: "We speak Turkish, English, German and Greek.",
        links: [["Contact page", L.contact]],
        next: ["Contact details", "Your representatives", "Price list"] },

      { id: "hello",
        k: ["hello", "hi ", "hey", "good morning", "good afternoon", "merhaba"],
        a: "Hello! Which product are you interested in?",
        links: [],
        next: ["What do you sell?", "Price list", "Can I get a sample?"] },

      { id: "thanks",
        k: ["thank", "thanks", "cheers", "appreciate"],
        a: "You are welcome. I am here if anything else comes up.",
        links: [],
        next: ["What do you sell?", "Contact details", "Price list"] }
    ]
  }[LANG];

  var FALLBACK = {
    tr: {
      a: "Bunu sitedeki bilgilerden yanıtlayamadım. Sorunuzu doğrudan ekibimize iletelim; mesajlara 7 gün 24 saat dönüyoruz.",
      links: [["Teklif formu", L.form], ["E-posta: " + MAIL, "mailto:" + MAIL], ["Telefon / WhatsApp", "tel:+905078634045"]],
      next: ["Ürünleriniz neler?", "Minimum sipariş miktarı", "Fiyat listesi"]
    },
    en: {
      a: "I could not answer that from what is on this site. Let us put your question straight to our team — we reply to messages 24/7.",
      links: [["Enquiry form", L.form], ["Email: " + MAIL, "mailto:" + MAIL], ["Phone / WhatsApp", "tel:+905078634045"]],
      next: ["What do you sell?", "Minimum order quantity", "Price list"]
    }
  }[LANG];

  var T = UI[LANG];

  /* ------------------------------------------------------------ matching */

  var FOLD = { "ı": "i", "İ": "i", "ş": "s", "Ş": "s", "ğ": "g", "Ğ": "g", "ü": "u", "Ü": "u", "ö": "o", "Ö": "o", "ç": "c", "Ç": "c" };

  function norm(s) {
    return (" " + String(s) + " ")
      .replace(/[ıİşŞğĞüÜöÖçÇ]/g, function (c) { return FOLD[c]; })
      .toLowerCase()
      .replace(/[^a-z0-9+ ]+/g, " ")
      .replace(/\s+/g, " ");
  }

  function answerFor(text) {
    var q = norm(text), best = null, bestScore = 0;
    for (var i = 0; i < KB.length; i++) {
      var item = KB[i], score = 0;
      for (var j = 0; j < item.k.length; j++) {
        var kw = norm(item.k[j]).trim();
        if (kw && q.indexOf(kw) !== -1) score += kw.length;
      }
      if (score > bestScore) { bestScore = score; best = item; }
    }
    return bestScore >= 3 ? best : FALLBACK;
  }

  /* ----------------------------------------------------------------- DOM */

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  var root = el("div", "chat");
  root.setAttribute("data-chat", "");

  var launcher = el("button", "chat__launcher");
  launcher.type = "button";
  launcher.setAttribute("aria-expanded", "false");
  launcher.innerHTML =
    '<svg class="chat__launcher-icon" width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">' +
    '<path d="M21 11.5a8.5 8.5 0 0 1-12.3 7.6L3 20.5l1.5-5A8.5 8.5 0 1 1 21 11.5Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>' +
    '</svg><span class="chat__launcher-text">' + T.launch + "</span>";

  var panel = el("div", "chat__panel");
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", T.title);
  panel.hidden = true;

  var head = el("div", "chat__head");
  var headText = el("div", "chat__head-text");
  headText.appendChild(el("strong", null, T.title));
  var sub = el("span", "chat__head-sub");
  sub.innerHTML = T.subtitle;
  headText.appendChild(sub);
  var closeBtn = el("button", "chat__close");
  closeBtn.type = "button";
  closeBtn.setAttribute("aria-label", T.close);
  closeBtn.innerHTML =
    '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">' +
    '<path d="M3 3l10 10M13 3L3 13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  head.appendChild(headText);
  head.appendChild(closeBtn);

  var log = el("div", "chat__log");
  log.setAttribute("role", "log");
  log.setAttribute("aria-live", "polite");
  log.setAttribute("tabindex", "0");

  var chips = el("div", "chat__chips");

  var form = el("form", "chat__form");
  var input = el("input", "chat__input");
  input.type = "text";
  input.autocomplete = "off";
  input.placeholder = T.placeholder;
  input.setAttribute("aria-label", T.placeholder);
  var send = el("button", "chat__send");
  send.type = "submit";
  send.setAttribute("aria-label", T.send);
  send.innerHTML =
    '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">' +
    '<path d="M20 12L4 4l6 8-6 8 16-8Z" fill="currentColor"/></svg>';
  form.appendChild(input);
  form.appendChild(send);

  var note = el("p", "chat__note", T.note);

  panel.appendChild(head);
  panel.appendChild(log);
  panel.appendChild(chips);
  panel.appendChild(form);
  panel.appendChild(note);
  root.appendChild(panel);
  root.appendChild(launcher);

  /* ------------------------------------------------------------ messages */

  function bubble(who, text, links) {
    var wrap = el("div", "chat__msg chat__msg--" + who);
    wrap.appendChild(el("p", "chat__bubble", text));
    if (links && links.length) {
      var row = el("div", "chat__links");
      links.forEach(function (pair) {
        var a = el("a", "chat__link", pair[0]);
        a.href = pair[1];
        if (/^https?:/i.test(pair[1])) { a.target = "_blank"; a.rel = "noopener"; }
        row.appendChild(a);
      });
      wrap.appendChild(row);
    }
    log.appendChild(wrap);
    log.scrollTop = log.scrollHeight;
    return wrap;
  }

  function setChips(list) {
    chips.textContent = "";
    (list || []).forEach(function (label) {
      var b = el("button", "chat__chip", label);
      b.type = "button";
      b.addEventListener("click", function () { ask(label); });
      chips.appendChild(b);
    });
  }

  var thinking = null;
  function showThinking() {
    thinking = el("div", "chat__msg chat__msg--bot");
    var dots = el("p", "chat__bubble chat__typing");
    dots.innerHTML = "<span></span><span></span><span></span>";
    dots.setAttribute("aria-label", "…");
    thinking.appendChild(dots);
    log.appendChild(thinking);
    log.scrollTop = log.scrollHeight;
  }
  function clearThinking() {
    if (thinking && thinking.parentNode) thinking.parentNode.removeChild(thinking);
    thinking = null;
  }

  function ask(text) {
    var q = String(text).trim();
    if (!q) return;
    bubble("user", q, null);
    setChips([]);
    showThinking();
    window.setTimeout(function () {
      clearThinking();
      var hit = answerFor(q);
      bubble("bot", hit.a, hit.links);
      setChips(hit.next);
      log.scrollTop = log.scrollHeight;
    }, 320);
  }

  /* -------------------------------------------------------------- events */

  var started = false;
  function open() {
    panel.hidden = false;
    root.classList.add("is-open");
    launcher.setAttribute("aria-expanded", "true");
    if (!started) {
      started = true;
      bubble("bot", T.welcome, null);
      setChips(T.chips);
    }
    window.setTimeout(function () { input.focus(); }, 60);
  }
  function close() {
    root.classList.remove("is-open");
    panel.hidden = true;
    launcher.setAttribute("aria-expanded", "false");
    launcher.focus();
  }

  launcher.addEventListener("click", function () {
    if (panel.hidden) { open(); } else { close(); }
  });
  closeBtn.addEventListener("click", close);

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var v = input.value;
    input.value = "";
    ask(v);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !panel.hidden) close();
  });

  function mount() {
    if (!root.parentNode) document.body.appendChild(root);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
