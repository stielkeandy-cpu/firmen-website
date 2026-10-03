(function () {
  'use strict';

  function show(name) {
    document.querySelectorAll('.screen').forEach(function (s) {
      s.classList.toggle('active', s.getAttribute('data-screen') === name);
    });
    document.querySelectorAll('.nav-btn').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-go') === name);
    });
    var main = document.querySelector('.app-main');
    if (main) main.scrollTop = 0;
    try {
      history.replaceState(null, '', '#' + name);
    } catch (e) {}
  }

  document.querySelectorAll('[data-go]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      var target = el.getAttribute('data-go');
      if (!target) return;
      if (el.tagName === 'BUTTON' || el.getAttribute('type') === 'button') {
        e.preventDefault();
      }
      show(target);
    });
  });

  var hash = (location.hash || '#home').replace('#', '');
  if (!document.querySelector('[data-screen="' + hash + '"]')) hash = 'home';
  show(hash);

  // Formspree submit
  var form = document.getElementById('appBookForm');
  var status = document.getElementById('bookStatus');
  if (form) {
    var loaded = Date.now();
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var hp = form.querySelector('input[name="website_url"]');
      if (hp && hp.value.trim()) return;
      if (Date.now() - loaded < 2500) {
        status.textContent = 'Bitte kurz warten und erneut senden.';
        status.className = 'form-note err';
        return;
      }
      status.textContent = 'Wird gesendet …';
      status.className = 'form-note';
      var data = new FormData(form);
      fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' }
      }).then(function (res) {
        if (res.ok) {
          status.textContent = 'Danke! Wir melden uns in Kürze.';
          status.className = 'form-note ok';
          form.reset();
        } else {
          status.textContent = 'Fehler beim Senden. Bitte anrufen: 0174 2988851';
          status.className = 'form-note err';
        }
      }).catch(function () {
        status.textContent = 'Netzwerkfehler. Bitte 0174 2988851 anrufen.';
        status.className = 'form-note err';
      });
    });
  }

  // Service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(function () {});
  }
})();
