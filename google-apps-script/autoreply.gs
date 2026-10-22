/**
 * Aegean Sun: auto-replies and the double opt-in newsletter list for the
 * website's Google Forms.
 *
 * Paste this SAME file into the Apps Script editor of BOTH Google Forms
 * (Enquiry and Newsletter), then run install() once in each. The Newsletter
 * form's script is also deployed as a web app, for the confirm and unsubscribe
 * links. Full steps are in README.md, sections "Auto-reply e-mails" and
 * "Newsletter: double opt-in and unsubscribe". This file is kept in the repo
 * only as the source of truth; it is not served by the website (.vercelignore).
 *
 * Enquiry form: each enquiry gets one plain-text reply from the Google account
 * that owns the form, with replies going to the sales address. It repeats what
 * they asked for, in Turkish when the website marked the enquiry "(tr)".
 *
 * Newsletter form (double opt-in): a sign-up is NOT a subscription. The address
 * goes into a "Subscribers" spreadsheet as "pending" and gets a confirmation
 * link. Only after they open it and press Confirm does it become "confirmed"
 * and receive the welcome e-mail. The button step matters: mail security
 * scanners open every link in an e-mail, so a link that confirmed on its own
 * would subscribe people who never clicked. Unconfirmed sign-ups are deleted
 * after PENDING_DAYS. Every welcome and newsletter e-mail carries a personal
 * unsubscribe link; unsubscribing marks the row and deletes that address's
 * form responses. Newsletters are written as a Gmail draft and sent by
 * sendNewsletter(), which adds the link for each person.
 *
 * Safety:
 * - Plain text for anything a visitor typed (never rendered as HTML).
 * - One e-mail of each kind per address per day, and at most DAILY_CAP enquiry
 *   replies and confirmation requests a day in total, so a stranger cannot use
 *   the public forms to flood inboxes or use up the Gmail quota that real
 *   replies and newsletters need. Free text a visitor typed is shortened and
 *   stripped of links before it is repeated in a reply (clean_), so the reply
 *   cannot carry someone else's message or link.
 * - Every helper ends in "_". Apps Script lets anyone who can open the web app
 *   call any other top-level function from their browser (google.script.run),
 *   so only doGet, act (needs a secret token) and cleanup (harmless) are left
 *   callable; install, sendTest and sendNewsletter refuse anyone but the owner.
 * - Gmail quota: about 100 e-mails a day on a personal Google account, 1,500
 *   on Google Workspace. sendNewsletter() stops at the quota and continues
 *   where it left off when run again the next day.
 */

var SALES = 'muzaffer.turkekul@aegeansunfruit.com';
var SENDER_NAME = 'Aegean Sun';
var SITE = 'https://www.aegeansunfruit.com';

// The Newsletter form's web app address (Deploy → New deployment → Web app; it ends in /exec).
// Paste it here in the Newsletter form's script after the first deployment (README step).
var NEWSLETTER_APP_URL = '';

var PENDING_DAYS = 30;        // unconfirmed sign-ups are deleted after this many days
var DRAFT_PREFIX = '[Newsletter]';   // sendNewsletter() sends the Gmail draft whose subject starts with this
var SHEET_NAME = 'Subscribers';
var DAILY_CAP = { enquiry: 40, confirm: 40 };   // per day, in total, for e-mails a stranger can trigger
var COLS = ['E-mail', 'Status', 'Token', 'Signed up', 'Confirmed', 'Unsubscribed', 'Last newsletter', 'Responses deleted'];
var C = { email: 0, status: 1, token: 2, signedUp: 3, confirmed: 4, unsubscribed: 5, last: 6, purged: 7 };   // column indexes in COLS

/* ===================== Owner-run functions (pick in the editor, press Run) ===================== */

/** Run once in each form's script editor: creates the triggers (and, for the newsletter, the subscriber list). */
function install() {
  ownerOnly_();
  var form = FormApp.getActiveForm();
  // A project made at script.google.com is not attached to a form, so there is nothing to listen to.
  if (!form) throw new Error('Open this script from the form itself (form → ⋮ → Apps Script), not from script.google.com.');
  ScriptApp.getProjectTriggers().forEach(function (t) {
    var fn = t.getHandlerFunction();
    if (fn === 'onSubmit' || fn === 'cleanup') ScriptApp.deleteTrigger(t);   // never install twice
  });
  ScriptApp.newTrigger('onSubmit').forForm(form).onFormSubmit().create();
  ScriptApp.newTrigger('cleanup').timeBased().everyDays(1).atHour(3).create();
  // The web app (doGet/act) has no active form, so remember which form this is.
  PropertiesService.getScriptProperties().setProperty('FORM_ID', form.getId());
  Logger.log('Auto-reply installed for: ' + form.getTitle());
  if (isNewsletter_(form)) {
    Logger.log('Subscriber list: ' + subscribers_().getParent().getUrl());
    if (!NEWSLETTER_APP_URL) Logger.log('Next: deploy this script as a web app and paste its /exec address into NEWSLETTER_APP_URL (README).');
  }
}

/** Run by hand to check that this account may send e-mail: mails a sample to yourself.
    Uses MailApp directly, so the once-a-day limit in reply_() does not hide the result. */
function sendTest() {
  ownerOnly_();
  var me = Session.getEffectiveUser().getEmail();
  var form = FormApp.getActiveForm();
  var mail = form && isNewsletter_(form)
    ? confirmMail_('00000000-0000-0000-0000-000000000000')   // also checks that NEWSLETTER_APP_URL is set
    : enquiryMail_({ 'Name Surname': 'Test', 'Interested Product(s)': 'Dried fig', 'Do you require samples': 'No' });
  MailApp.sendEmail({ to: me, subject: '[TEST] ' + mail.subject, body: mail.body, name: SENDER_NAME, replyTo: SALES });
  Logger.log('Test sent to ' + me + '. Triggers on this project: ' +
    ScriptApp.getProjectTriggers().map(function (t) { return t.getHandlerFunction() + '/' + t.getEventType(); }).join(', '));
}

/** Sends the Gmail draft whose subject starts with DRAFT_PREFIX to every confirmed subscriber,
    adding each person's unsubscribe link. Safe to run again: people who already got this
    subject are skipped, so after the daily quota runs out, run it again the next day. */
function sendNewsletter() {
  ownerOnly_();
  var drafts = GmailApp.getDrafts().filter(function (d) { return d.getMessage().getSubject().indexOf(DRAFT_PREFIX) === 0; });
  if (drafts.length !== 1) throw new Error('Expected exactly one Gmail draft whose subject starts with "' + DRAFT_PREFIX + '", found ' + drafts.length + '.');
  var msg = drafts[0].getMessage();
  var subject = msg.getSubject().slice(DRAFT_PREFIX.length).trim();
  if (!subject) throw new Error('The draft needs a subject after "' + DRAFT_PREFIX + '".');
  var html = msg.getBody(), plain = msg.getPlainBody();
  var attachments = msg.getAttachments({ includeInlineImages: false });

  var sheet = subscribers_();
  var rows = sheet.getDataRange().getValues();
  var sent = 0, waiting = 0;
  for (var i = 1; i < rows.length; i++) {
    var r = rows[i];
    if (r[C.status] !== 'confirmed' || String(r[C.last]) === subject) continue;
    if (MailApp.getRemainingDailyQuota() < 1) { waiting++; continue; }
    var link = appUrl_() + '?a=unsub&t=' + r[C.token];
    GmailApp.sendEmail(r[C.email], subject,
      plain + '\n\n--\nUnsubscribe / Abonelikten çık: ' + link, {
        htmlBody: html + '<hr><p style="font-size:12px;color:#666">You receive this because you confirmed your subscription at ' +
          SITE + '. <a href="' + link + '">Unsubscribe</a> · Bu e-postayı aboneliğinizi onayladığınız için alıyorsunuz. ' +
          '<a href="' + link + '">Abonelikten çık</a></p>',
        name: SENDER_NAME, replyTo: SALES, attachments: attachments
      });
    markSent_(sheet, r[C.token], subject);   // written per person, so a crash never double-sends
    sent++;
  }
  Logger.log('Sent "' + subject + '" to ' + sent + ' subscriber(s).' +
    (waiting ? ' Daily quota reached: ' + waiting + ' still to go. Run sendNewsletter again tomorrow.' : ' Done: you can delete the draft.'));
}

/* ===================== Triggers ===================== */

/** Form-submit trigger: works out which form this is from its questions, then replies. */
function onSubmit(e) {
  // Pressing Run on onSubmit has no submission to read; it only runs from the trigger that install() creates.
  if (!e || !e.response) throw new Error('onSubmit runs on its own after a form submission. Run install() once, then send a test.');
  var answers = {};
  e.response.getItemResponses().forEach(function (r) {
    answers[r.getItem().getTitle().trim()] = String(r.getResponse() || '').trim();
  });

  if ('E-Mail Address' in answers) {
    signUp_(answers['E-Mail Address']);
  } else {
    reply_(answers['E-Mail'], enquiryMail_(answers), 'enquiry');
  }
}

/** Daily trigger (03:00): deletes sign-ups never confirmed within PENDING_DAYS, and old send-limit markers.
    Left callable from the web app on purpose: running it early changes nothing. */
function cleanup() {
  var props = PropertiesService.getScriptProperties();
  // Once a day is enough; this also stops a visitor from calling it in a loop to hold the lock.
  if (Date.now() - Number(props.getProperty('LAST_CLEANUP') || 0) < 20 * 3600 * 1000) return;
  props.setProperty('LAST_CLEANUP', String(Date.now()));
  var today = today_();
  Object.keys(props.getProperties()).forEach(function (k) {
    if (k.indexOf('sent:') === 0 && props.getProperty(k) !== today) props.deleteProperty(k);
  });
  if (!props.getProperty('SUBSCRIBERS_ID')) return;   // the Enquiry form has no list

  withLock_(20000, function () {
    var sheet = subscribers_();
    var rows = sheet.getDataRange().getValues();
    var cutoff = Date.now() - PENDING_DAYS * 24 * 3600 * 1000;
    for (var i = rows.length - 1; i >= 1; i--) {   // bottom-up, so deleting keeps the indexes valid
      if (rows[i][C.status] === 'pending' && new Date(rows[i][C.signedUp]).getTime() < cutoff) {
        deleteResponses_(rows[i][C.email]);
        sheet.deleteRow(i + 1);
      } else if (rows[i][C.status] === 'unsubscribed' && !rows[i][C.purged]) {
        purge_(sheet, i + 1, rows[i][C.email]);   // retries an unsubscribe whose clean-up failed
      }
    }
  });
}

/* ===================== Web app: the confirm and unsubscribe links ===================== */

/** Shows the confirm / unsubscribe page. It only shows a button: nothing changes until
    a person presses it (see the header comment on mail scanners). */
function doGet(e) {
  var p = (e && e.parameter) || {};
  var action = p.a === 'confirm' || p.a === 'unsub' ? p.a : '';
  var token = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(p.t || '') ? p.t : '';
  return page_(action && token ? action : 'invalid', token);
}

/** Called by the page's button (google.script.run). Returns the key of the message to show. */
function act(action, token) {
  if (typeof token !== 'string' || !/^[0-9a-f-]{36}$/i.test(token)) return 'invalid';
  var result = withLock_(3000, function () {
    var sheet = subscribers_();
    var rows = sheet.getDataRange().getValues();
    for (var i = 1; i < rows.length; i++) {
      if (rows[i][C.token] !== token) continue;
      var status = rows[i][C.status];
      if (action === 'confirm') {
        if (status === 'confirmed') return { key: 'alreadyConfirmed' };
        if (status !== 'pending') return { key: 'invalid' };   // an unsubscribed address must sign up again
        sheet.getRange(i + 1, C.status + 1).setValue('confirmed');
        sheet.getRange(i + 1, C.confirmed + 1).setValue(new Date());
        return { key: 'confirmed', email: rows[i][C.email] };
      }
      if (action === 'unsub') {
        if (status === 'unsubscribed') return { key: 'alreadyUnsubscribed' };
        sheet.getRange(i + 1, C.status + 1).setValue('unsubscribed');
        sheet.getRange(i + 1, C.unsubscribed + 1).setValue(new Date());
        return { key: 'unsubscribed', email: rows[i][C.email] };
      }
    }
    return { key: 'invalid' };
  });
  if (!result) return 'busy';
  // The answer is already saved, so a failure below must not show the visitor an error (a retry would
  // only say "already done"). A failed welcome is logged; a failed clean-up is retried by cleanup().
  try {
    if (result.key === 'confirmed') reply_(result.email, welcomeMail_(token), 'welcome');
    if (result.key === 'unsubscribed') {
      withLock_(20000, function () { var sh = subscribers_(); purge_(sh, rowOf_(sh, token), result.email); });
    }
  } catch (err) {
    Logger.log('After ' + result.key + ' for ' + result.email + ': ' + err);
  }
  return result.key;
}

/* ===================== Helpers (names end in "_": not callable from the browser) ===================== */

/** Throws unless the person running this is the script's owner (blocks google.script.run callers). */
function ownerOnly_() {
  var owner = Session.getEffectiveUser().getEmail();
  // Both sides empty would compare equal, so an empty owner address also refuses.
  if (!owner || Session.getActiveUser().getEmail() !== owner) throw new Error('Only the form owner can run this.');
}

function isNewsletter_(form) {
  return form.getItems().some(function (i) { return i.getTitle().trim() === 'E-Mail Address'; });
}

function today_() {
  return Utilities.formatDate(new Date(), 'Europe/Istanbul', 'yyyy-MM-dd');
}

function appUrl_() {
  if (!NEWSLETTER_APP_URL) throw new Error('NEWSLETTER_APP_URL is empty: deploy the web app and paste its /exec address at the top of the script.');
  return NEWSLETTER_APP_URL;
}

/** Runs fn while holding the script lock, so two sign-ups or clicks never edit the sheet at once.
    Waits up to `ms`; returns null if the lock stayed busy (the web app then says "try again"). */
function withLock_(ms, fn) {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(ms)) return null;
  try { return fn(); } finally { lock.releaseLock(); }
}

/** The sheet row number (1-based) holding this token, or 0. Looked up again each time, because
    cleanup() may have deleted rows since the sheet was last read. */
function rowOf_(sheet, token) {
  var rows = sheet.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) if (rows[i][C.token] === token) return i + 1;
  return 0;
}

/** Records that this subscriber got the newsletter. The leading ' keeps Sheets from turning a
    subject like "11/2026" into a date (which would break the "already sent" check) or "=..." into a formula. */
function markSent_(sheet, token, subject) {
  withLock_(20000, function () {
    var row = rowOf_(sheet, token);
    if (row) sheet.getRange(row, C.last + 1).setValue("'" + subject);
  });
}

/** Deletes an unsubscribed address's form responses and notes when, so cleanup() can retry a failure. */
function purge_(sheet, row, email) {
  if (!row) return;
  deleteResponses_(email);
  sheet.getRange(row, C.purged + 1).setValue(new Date());
}

/** The "Subscribers" sheet, in a spreadsheet the script creates in the owner's Drive on first use. */
function subscribers_() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('SUBSCRIBERS_ID');
  if (id) return SpreadsheetApp.openById(id).getSheetByName(SHEET_NAME);
  // Only the Newsletter form's project keeps a list; never create a stray one in the Enquiry project.
  var formId = props.getProperty('FORM_ID');
  if (!formId || !isNewsletter_(FormApp.openById(formId))) throw new Error("No subscriber list here: this is not the Newsletter form's script, or install has not been run.");
  var ss = SpreadsheetApp.create('Aegean Sun newsletter subscribers');
  var sheet = ss.getSheets()[0].setName(SHEET_NAME);
  sheet.appendRow(COLS);
  sheet.setFrozenRows(1);
  props.setProperty('SUBSCRIBERS_ID', ss.getId());
  return sheet;
}

/** A newsletter sign-up: adds or refreshes the address as "pending" and mails the confirmation link. */
function signUp_(email) {
  email = String(email || '').trim().toLowerCase();
  // Strict on purpose: the address is written into a spreadsheet, and a value starting with = + - @ would be read as a formula.
  if (!/^[a-z0-9_][a-z0-9._%+'-]*@[a-z0-9.-]+\.[a-z][a-z0-9-]+$/.test(email)) { Logger.log('Skipped: no valid e-mail address (' + email + ')'); return; }
  var token = withLock_(20000, function () {
    var sheet = subscribers_();
    var rows = sheet.getDataRange().getValues();
    for (var i = 1; i < rows.length; i++) {
      if (String(rows[i][C.email]).toLowerCase() !== email) continue;
      if (rows[i][C.status] === 'confirmed') return null;            // already on the list: send nothing
      // Pending: same link again, so an earlier e-mail still works; the 30 days restart.
      // Unsubscribed and signing up again: keep the token too, so the unsubscribe link in old e-mails keeps working.
      sheet.getRange(i + 1, C.status + 1, 1, 6).setValues([['pending', rows[i][C.token], new Date(), '', '', '']]);
      return rows[i][C.token];
    }
    var t = Utilities.getUuid();
    sheet.appendRow([email, 'pending', t, new Date(), '', '', '', '']);
    return t;
  });
  if (!token) { Logger.log('Skipped: ' + email + ' is already subscribed'); return; }
  reply_(email, confirmMail_(token), 'confirm');
}

/** Deletes this address's answers from the Newsletter form and from its linked response sheet, if any. */
function deleteResponses_(email) {
  var id = PropertiesService.getScriptProperties().getProperty('FORM_ID');
  if (!id) return;
  var form = FormApp.openById(id);
  email = String(email).toLowerCase();
  form.getResponses().forEach(function (r) {
    var hit = r.getItemResponses().some(function (ir) { return String(ir.getResponse()).trim().toLowerCase() === email; });
    if (hit) form.deleteResponse(r.getId());
  });
  if (form.getDestinationType() !== FormApp.DestinationType.SPREADSHEET) return;
  SpreadsheetApp.openById(form.getDestinationId()).getSheets().forEach(function (sh) {
    // Only the tab this form writes to. Its form URL may carry another id than getId(), so compare by opening it.
    var url = sh.getFormUrl();
    try { if (!url || FormApp.openByUrl(url).getId() !== form.getId()) return; } catch (err) { return; }
    var rows = sh.getDataRange().getValues();
    for (var i = rows.length - 1; i >= 1; i--) {
      if (rows[i].some(function (v) { return String(v).trim().toLowerCase() === email; })) sh.deleteRow(i + 1);
    }
  });
}

/** Sends one plain-text e-mail, at most once a day per address and kind. */
function reply_(to, mail, kind) {
  // Each outcome is logged so the Executions page (Apps Script → Executions) shows why a reply did or did not go out.
  if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(to)) { Logger.log('Skipped: no valid e-mail address (' + to + ')'); return; }
  var props = PropertiesService.getScriptProperties();
  var key = 'sent:' + kind + ':' + to.toLowerCase();
  if (props.getProperty(key) === today_()) { Logger.log('Skipped: already sent a ' + kind + ' e-mail to ' + to + ' today'); return; }
  var countKey = 'sent:count:' + kind + ':' + today_();
  var count = Number(props.getProperty(countKey) || 0);
  if (DAILY_CAP[kind] && count >= DAILY_CAP[kind]) { Logger.log('Skipped: daily limit of ' + DAILY_CAP[kind] + ' ' + kind + ' e-mails reached (' + to + ')'); return; }
  MailApp.sendEmail({ to: to, subject: mail.subject, body: mail.body, name: SENDER_NAME, replyTo: SALES });
  props.setProperty(key, today_());
  props.setProperty(countKey, String(count + 1));
  Logger.log('Sent ' + kind + ' e-mail to ' + to);
}

/* ===================== E-mail texts ===================== */

/** The enquiry reply, in Turkish when the enquiry came from a Turkish page. */
function enquiryMail_(a) {
  var tr = /\(tr\)\s*$/m.test(a['Additional Message'] || '');
  var name = clean_(a['Name Surname']);
  if (name === '-') name = '';
  var product = clean_(a['Interested Product(s)']) || '-';
  var samples = a['Do you require samples'] === 'Yes';
  if (tr) {
    return {
      subject: 'Talebinizi aldık: ' + product,
      body: [
        'Merhaba' + (name ? ' ' + name : '') + ',',
        '',
        'Aegean Sun ile iletişime geçtiğiniz için teşekkür ederiz. Talebiniz ihracat ekibimize ulaştı; bir iş günü içinde fiyat, teslim süresi' + (samples ? ' ve numune seti' : '') + ' için size dönüyoruz.',
        '',
        'Talebiniz:',
        'Ürün: ' + product,
        'Firma: ' + (clean_(a['Company Name']) || '-'),
        'Varış ülkesi: ' + (clean_(a['Country']) || '-'),
        'Numune: ' + (samples ? 'Evet' : 'Hayır'),
        '',
        'Eklemek istediğiniz bir şey varsa bu e-postayı yanıtlamanız yeterli.',
        '',
        'Saygılarımızla,',
        'Muzaffer Türkekul',
        'Aegean Sun, ihracat satış',
        SALES + ' · +90 507 863 40 45',
        SITE + '/tr/'
      ].join('\n')
    };
  }
  return {
    subject: 'We have your enquiry: ' + product,
    body: [
      'Hello' + (name ? ' ' + name : '') + ',',
      '',
      'Thank you for contacting Aegean Sun. Your enquiry has reached our export team, and we will reply within one working day with a price, a lead time' + (samples ? ' and your sample set' : '') + '.',
      '',
      'Your enquiry:',
      'Product: ' + product,
      'Company: ' + (clean_(a['Company Name']) || '-'),
      'Country: ' + (clean_(a['Country']) || '-'),
      'Samples: ' + (samples ? 'Yes' : 'No'),
      '',
      'If there is anything to add, simply reply to this e-mail.',
      '',
      'Kind regards,',
      'Muzaffer Türkekul',
      'Aegean Sun, export sales',
      SALES + ' · +90 507 863 40 45',
      SITE
    ].join('\n')
  };
}

/** Visitor text for a reply: links and web addresses removed, one line, at most 60 characters. */
function clean_(v) {
  return String(v || '')
    .replace(/\S*(:\/\/|www\.)\S*/gi, '')           // anything with :// or www.
    .replace(/\S+\.[a-z]{2,}(\/\S*)?/gi, '')        // bare domains such as evil.com/x
    .replace(/\s+/g, ' ').trim().slice(0, 60);
}

/** The confirmation request, in English and Turkish (the form does not say which language). */
function confirmMail_(token) {
  var link = appUrl_() + '?a=confirm&t=' + token;
  return {
    subject: 'Please confirm your subscription / Lütfen aboneliğinizi onaylayın',
    body: [
      'Someone, hopefully you, asked to receive the Aegean Sun newsletter at this address.',
      'To confirm, open this link and press "Confirm":',
      link,
      'If it was not you, ignore this e-mail: you will not be added, and the request is deleted after ' + PENDING_DAYS + ' days.',
      '',
      'Bu adres için Aegean Sun bülteni talep edildi.',
      'Onaylamak için bu bağlantıyı açıp "Onayla" düğmesine basın:',
      link,
      'Talep sizden gelmediyse bu e-postayı dikkate almayın: listeye eklenmezsiniz ve talep ' + PENDING_DAYS + ' gün sonra silinir.',
      '',
      'Aegean Sun',
      SALES + ' · ' + SITE
    ].join('\n')
  };
}

/** The welcome e-mail, sent once the subscription is confirmed. */
function welcomeMail_(token) {
  var link = appUrl_() + '?a=unsub&t=' + token;
  return {
    subject: 'Welcome to the Aegean Sun newsletter / Aegean Sun bültenine hoş geldiniz',
    body: [
      'Thank you for confirming. We will send harvest news, new-season availability and price updates to this address.',
      'To leave the list at any time, use this link (it is also at the bottom of every newsletter):',
      link,
      '',
      'Onayınız için teşekkür ederiz. Hasat haberlerini, yeni sezon ürün durumunu ve fiyat güncellemelerini bu adrese göndereceğiz.',
      'İstediğiniz an listeden çıkmak için bu bağlantıyı kullanın (her bültenin altında da yer alır):',
      link,
      '',
      'Aegean Sun',
      SALES + ' · ' + SITE
    ].join('\n')
  };
}

/* ===================== The web app page ===================== */

/** One small bilingual page: a question with a button, then the result. Only fixed texts and a
    validated token are put into it, so nothing from outside is rendered as HTML. */
function page_(action, token) {
  var T = {
    confirm: ['Confirm your subscription', 'Aboneliğinizi onaylayın', 'Press the button to join the Aegean Sun newsletter.', 'Aegean Sun bültenine katılmak için düğmeye basın.', 'Confirm / Onayla'],
    unsub: ['Leave the newsletter', 'Bültenden ayrılın', 'Press the button and we will stop sending you the newsletter.', 'Düğmeye bastığınızda size bülten göndermeyi bırakırız.', 'Unsubscribe / Abonelikten çık'],
    invalid: ['This link is not valid', 'Bu bağlantı geçerli değil', 'It may be incomplete or out of date. You can sign up again on our contact page.', 'Eksik ya da süresi geçmiş olabilir. İletişim sayfamızdan yeniden kaydolabilirsiniz.', '']
  }[action];
  var done = {
    confirmed: ['You are on the list. A welcome e-mail is on its way.', 'Listeye eklendiniz. Hoş geldiniz e-postası yolda.'],
    alreadyConfirmed: ['You were already on the list.', 'Zaten listedeydiniz.'],
    unsubscribed: ['You have left the list. We will not send you the newsletter again.', 'Listeden çıktınız. Size bir daha bülten göndermeyeceğiz.'],
    alreadyUnsubscribed: ['You had already left the list.', 'Listeden zaten çıkmıştınız.'],
    busy: ['Too many requests just now. Please try again in a minute.', 'Şu anda çok fazla istek var. Lütfen bir dakika sonra tekrar deneyin.'],
    invalid: ['This link is not valid any more. You can sign up again on our contact page.', 'Bu bağlantı artık geçerli değil. İletişim sayfamızdan yeniden kaydolabilirsiniz.']
  };
  var html =
    '<!doctype html><html lang="en"><head><meta charset="utf-8"><style>' +
    'body{margin:0;background:#fdf8f1;color:#2b1d14;font:17px/1.55 Georgia,serif}' +
    'main{max-width:34rem;margin:12vh auto;padding:0 20px}h1{font-size:1.6rem;margin:0 0 .2em;font-weight:600}' +
    '.tr{color:#6b5848}p{margin:.4em 0}button{margin-top:1.4em;font:600 16px/1 system-ui,sans-serif;background:#2b1d14;color:#fdf8f1;' +
    'border:0;border-radius:999px;padding:14px 26px;min-height:44px;cursor:pointer}button:disabled{opacity:.5}' +
    '#out{margin-top:1.2em;font-weight:600}a{color:#a4561a}' +
    '</style></head><body><main>' +
    '<h1>' + T[0] + '</h1><h1 class="tr" lang="tr">' + T[1] + '</h1>' +
    '<p>' + T[2] + '</p><p class="tr" lang="tr">' + T[3] + '</p>' +
    (T[4] ? '<button id="go" type="button">' + T[4] + '</button>' : '') +
    '<div id="out" role="status" aria-live="polite"></div>' +
    '<p style="margin-top:2em"><a href="' + SITE + '/contact.html#newsletter" target="_top">aegeansunfruit.com</a></p>' +
    '</main><script>' +
    'var DONE=' + JSON.stringify(done) + ';' +
    'var b=document.getElementById("go"),o=document.getElementById("out");' +
    'function show(k){var m=DONE[k]||DONE.invalid;o.innerHTML="";m.forEach(function(t,i){var p=document.createElement("p");p.textContent=t;if(i)p.lang="tr";o.appendChild(p)});if(b){if(k==="busy")b.disabled=false;else b.remove()}}' +
    'if(b)b.onclick=function(){b.disabled=true;google.script.run.withSuccessHandler(show)' +
    '.withFailureHandler(function(){b.disabled=false;o.textContent="Something went wrong, please try again. / Bir sorun oluştu, lütfen tekrar deneyin."})' +
    '.act(' + JSON.stringify(action) + ',' + JSON.stringify(token) + ')};' +
    '</script></body></html>';
  return HtmlService.createHtmlOutput(html)
    .setTitle('Aegean Sun newsletter')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}
