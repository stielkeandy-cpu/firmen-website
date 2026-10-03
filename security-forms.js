/**
 * Formular-Schutz: Honeypot, Mindestzeit, einfache Rate-Limits
 */
(function () {
  var MIN_MS = 3000; // absenden erst nach 3 Sekunden auf der Seite
  var MAX_PER_HOUR = 8;
  var pageLoaded = Date.now();
  var storageKey = 'stielke_form_sends';

  function getSends() {
    try {
      var raw = sessionStorage.getItem(storageKey);
      var data = raw ? JSON.parse(raw) : [];
      var hourAgo = Date.now() - 60 * 60 * 1000;
      return data.filter(function (t) { return t > hourAgo; });
    } catch (e) {
      return [];
    }
  }

  function recordSend() {
    try {
      var data = getSends();
      data.push(Date.now());
      sessionStorage.setItem(storageKey, JSON.stringify(data));
    } catch (e) {}
  }

  document.querySelectorAll('form[action*="formspree"]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      // Honeypot
      var hp = form.querySelector('input[name="website_url"]');
      if (hp && hp.value && String(hp.value).trim() !== '') {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Zu schnell = Bot
      if (Date.now() - pageLoaded < MIN_MS) {
        e.preventDefault();
        alert('Bitte warten Sie einen Moment und senden Sie das Formular erneut ab.');
        return false;
      }

      // Rate limit
      var sends = getSends();
      if (sends.length >= MAX_PER_HOUR) {
        e.preventDefault();
        alert('Zu viele Anfragen. Bitte versuchen Sie es später erneut oder rufen Sie uns an: 0174 2988851');
        return false;
      }

      recordSend();
    }, true);
  });
})();
