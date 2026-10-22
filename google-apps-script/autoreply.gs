/**
 * Aegean Sun: auto-reply for the website's Google Forms.
 *
 * Paste this SAME file into the Apps Script editor of BOTH Google Forms
 * (Enquiry and Newsletter), then run install() once in each. Full steps are in
 * README.md, section "Auto-reply e-mails". This file is kept in the repo only as
 * the source of truth; it is not served by the website (.vercelignore).
 *
 * What it does: when someone submits a form (through the website or the form
 * itself), it sends them one plain-text e-mail from the Google account that owns
 * the form, with replies going to the sales address. The enquiry reply repeats
 * what they asked for; the newsletter reply thanks them for signing up. Language:
 * the website adds "Page: /tr/… (tr)" to Turkish enquiries, so those get Turkish;
 * everything else gets English. The newsletter form has no language field, so
 * its reply is in both languages.
 *
 * Safety: plain text only (nothing the visitor typed is ever rendered as HTML),
 * one auto-reply per address per day (so a stranger cannot use the form to flood
 * someone's inbox), and a malformed address is skipped. Gmail quota: about 100
 * e-mails a day on a personal Google account, 1,500 on Google Workspace.
 */

var SALES = 'muzaffer.turkekul@aegeansunfruit.com';
var SENDER_NAME = 'Aegean Sun';
var SITE = 'https://www.aegeansunfruit.com';

/** Run once in each form's script editor: creates the "on form submit" trigger. */
function install() {
  var form = FormApp.getActiveForm();
  // A project made at script.google.com is not attached to a form, so there is nothing to listen to.
  if (!form) throw new Error('Open this script from the form itself (form → ⋮ → Apps Script), not from script.google.com.');
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'onSubmit') ScriptApp.deleteTrigger(t);   // never install twice
  });
  ScriptApp.newTrigger('onSubmit').forForm(form).onFormSubmit().create();
  Logger.log('Auto-reply installed for: ' + form.getTitle());
}

/** Run by hand to check that this account may send e-mail: mails a sample reply to yourself.
    Uses MailApp directly, so the once-a-day limit in reply() does not hide the result. */
function sendTest() {
  var me = Session.getEffectiveUser().getEmail();
  var form = FormApp.getActiveForm();
  var isNewsletter = form && form.getItems().some(function (i) { return i.getTitle().trim() === 'E-Mail Address'; });
  var mail = isNewsletter ? newsletterMail() : enquiryMail({ 'Name Surname': 'Test', 'Interested Product(s)': 'Dried fig', 'Do you require samples': 'No' });
  MailApp.sendEmail({ to: me, subject: '[TEST] ' + mail.subject, body: mail.body, name: SENDER_NAME, replyTo: SALES });
  Logger.log('Test sent to ' + me + '. Triggers on this project: ' +
    ScriptApp.getProjectTriggers().map(function (t) { return t.getHandlerFunction() + '/' + t.getEventType(); }).join(', '));
}

/** Trigger handler: works out which form this is from its questions, then replies. */
function onSubmit(e) {
  // Pressing Run on onSubmit has no submission to read; it only runs from the trigger that install() creates.
  if (!e || !e.response) throw new Error('onSubmit runs on its own after a form submission. Run install() once, then send a test.');
  var answers = {};
  e.response.getItemResponses().forEach(function (r) {
    answers[r.getItem().getTitle().trim()] = String(r.getResponse() || '').trim();
  });

  if ('E-Mail Address' in answers) {
    reply(answers['E-Mail Address'], newsletterMail());
  } else {
    reply(answers['E-Mail'], enquiryMail(answers));
  }
}

/** Sends one plain-text reply, at most once a day per address. */
function reply(to, mail) {
  // Each outcome is logged so the Executions page (Apps Script → Executions) shows why a reply did or did not go out.
  if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(to)) { Logger.log('Skipped: no valid e-mail address (' + to + ')'); return; }
  var props = PropertiesService.getScriptProperties();
  var key = 'sent:' + to.toLowerCase();
  var today = Utilities.formatDate(new Date(), 'Europe/Istanbul', 'yyyy-MM-dd');
  if (props.getProperty(key) === today) { Logger.log('Skipped: already replied to ' + to + ' today'); return; }
  MailApp.sendEmail({ to: to, subject: mail.subject, body: mail.body, name: SENDER_NAME, replyTo: SALES });
  props.setProperty(key, today);
  Logger.log('Auto-reply sent to ' + to);
}

/** The enquiry reply, in Turkish when the enquiry came from a Turkish page. */
function enquiryMail(a) {
  var tr = /\(tr\)\s*$/m.test(a['Additional Message'] || '');
  var name = a['Name Surname'] && a['Name Surname'] !== '-' ? a['Name Surname'] : '';
  var product = a['Interested Product(s)'] || '-';
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
        'Firma: ' + (a['Company Name'] || '-'),
        'Varış ülkesi: ' + (a['Country'] || '-'),
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
      'Company: ' + (a['Company Name'] || '-'),
      'Country: ' + (a['Country'] || '-'),
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

/** The newsletter reply, in English and Turkish (the form does not say which language). */
function newsletterMail() {
  return {
    subject: 'Welcome to the Aegean Sun newsletter / Aegean Sun bültenine hoş geldiniz',
    body: [
      'Thank you for signing up. We will send harvest news, new-season availability and price updates to this address.',
      'If you did not sign up, or want to leave the list at any time, reply to this e-mail with "unsubscribe" and we will remove you.',
      '',
      'Kaydınız için teşekkür ederiz. Hasat haberlerini, yeni sezon ürün durumunu ve fiyat güncellemelerini bu adrese göndereceğiz.',
      'Kaydı siz yapmadıysanız ya da istediğiniz an listeden çıkmak için bu e-postayı "abonelikten çık" yazarak yanıtlamanız yeterli.',
      '',
      'Aegean Sun',
      SALES + ' · ' + SITE
    ].join('\n')
  };
}
