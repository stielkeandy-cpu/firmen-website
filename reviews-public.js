(function () {
  const grid = document.getElementById('reviewsGrid');
  const form = document.getElementById('reviewForm');
  const success = document.getElementById('reviewSuccess');
  const PENDING_KEY = 'stielke_reviews_pending';
  const PUBLISHED_KEY = 'stielke_reviews_published';

  function stars(n) {
    n = parseInt(n, 10) || 0;
    return '★'.repeat(n) + '☆'.repeat(Math.max(0, 5 - n));
  }

  function card(r) {
    return '<blockquote class="testimonial-card">' +
      '<div class="stars">' + stars(r.stars) + '</div>' +
      '<p>„' + escapeHtml(r.text) + '“</p>' +
      '<footer>— ' + escapeHtml(r.name) + (r.date ? ', ' + escapeHtml(r.date) : '') + '</footer>' +
      '</blockquote>';
  }

  function escapeHtml(s) {
    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function mergeUnique(a, b) {
    const seen = {};
    const out = [];
    (a || []).concat(b || []).forEach(function (r) {
      const k = (r.id || '') + '|' + (r.name || '') + '|' + (r.text || '');
      if (seen[k]) return;
      seen[k] = 1;
      out.push(r);
    });
    return out;
  }

  function render(list) {
    if (!grid) return;
    if (!list || !list.length) {
      grid.innerHTML = '<p class="form-note">Noch keine freigegebenen Bewertungen.</p>';
      return;
    }
    grid.innerHTML = list.map(card).join('');
  }

  // Load file + local published
  let fileReviews = [];
  fetch('reviews.json', { cache: 'no-store' })
    .then(function (r) { return r.ok ? r.json() : []; })
    .catch(function () { return []; })
    .then(function (data) {
      fileReviews = Array.isArray(data) ? data : [];
      let local = [];
      try { local = JSON.parse(localStorage.getItem(PUBLISHED_KEY) || '[]'); } catch (e) {}
      render(mergeUnique(local, fileReviews));
    });

  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      const name = document.getElementById('rev-name').value.trim();
      const text = document.getElementById('rev-text').value.trim();
      const starsVal = parseInt(document.getElementById('rev-stars').value, 10);
      const entry = {
        id: 'p' + Date.now(),
        name: name,
        text: text,
        stars: starsVal,
        date: new Date().toISOString().slice(0, 10)
      };

      // Pending for admin (same browser)
      try {
        const pending = JSON.parse(localStorage.getItem(PENDING_KEY) || '[]');
        pending.unshift(entry);
        localStorage.setItem(PENDING_KEY, JSON.stringify(pending));
      } catch (err) {}

      const action = form.getAttribute('action');
      const btn = document.getElementById('reviewSubmit');
      if (btn) { btn.disabled = true; btn.textContent = 'Wird gesendet …'; }

      try {
        if (action && action.indexOf('formspree.io') !== -1) {
          const res = await fetch(action, {
            method: 'POST',
            body: new FormData(form),
            headers: { Accept: 'application/json' }
          });
          if (!res.ok) throw new Error('send failed');
        }
        form.style.display = 'none';
        if (success) success.style.display = 'block';
        form.reset();
      } catch (err) {
        alert('Senden fehlgeschlagen. Bitte später erneut versuchen oder per E-Mail schreiben.');
      } finally {
        if (btn) { btn.disabled = false; btn.textContent = 'Bewertung absenden'; }
      }
    });
  }
})();
