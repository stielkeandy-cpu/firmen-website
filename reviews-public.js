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

  function escapeHtml(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function card(r) {
    const text = r.body || r.text || '';
    const date = r.created_at ? String(r.created_at).slice(0, 10) : (r.date || '');
    return (
      '<blockquote class="testimonial-card">' +
      '<div class="stars">' + stars(r.stars) + '</div>' +
      '<p>„' + escapeHtml(text) + '“</p>' +
      '<footer>— ' + escapeHtml(r.name) + (date ? ', ' + escapeHtml(date) : '') + '</footer>' +
      '</blockquote>'
    );
  }

  function render(list) {
    if (!grid) return;
    if (!list || !list.length) {
      grid.innerHTML = '<p class="form-note">Noch keine freigegebenen Bewertungen.</p>';
      return;
    }
    grid.innerHTML = list.map(card).join('');
  }

  function mergeUnique(a, b) {
    const seen = {};
    const out = [];
    (a || []).concat(b || []).forEach(function (r) {
      const text = r.body || r.text || '';
      const k = (r.id || '') + '|' + (r.name || '') + '|' + text;
      if (seen[k]) return;
      seen[k] = 1;
      out.push(r);
    });
    return out;
  }

  async function loadReviews() {
    let fileReviews = [];
    try {
      const res = await fetch('reviews.json', { cache: 'no-store' });
      if (res.ok) fileReviews = await res.json();
    } catch (e) {}
    let local = [];
    try {
      local = JSON.parse(localStorage.getItem(PUBLISHED_KEY) || '[]');
    } catch (e) {}
    render(mergeUnique(local, Array.isArray(fileReviews) ? fileReviews : []));
  }

  loadReviews();

  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      const name = document.getElementById('rev-name').value.trim();
      const text = document.getElementById('rev-text').value.trim();
      const starsVal = parseInt(document.getElementById('rev-stars').value, 10);
      const btn = document.getElementById('reviewSubmit');
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Wird gesendet …';
      }

      try {
        const entry = {
          id: 'p' + Date.now(),
          name: name,
          text: text,
          stars: starsVal,
          date: new Date().toISOString().slice(0, 10)
        };
        const pending = JSON.parse(localStorage.getItem(PENDING_KEY) || '[]');
        pending.unshift(entry);
        localStorage.setItem(PENDING_KEY, JSON.stringify(pending));
      } catch (err) {}

      let sent = false;
      const action = form.getAttribute('action');
      if (action && action.indexOf('formspree.io') !== -1) {
        try {
          const res = await fetch(action, {
            method: 'POST',
            body: new FormData(form),
            headers: { Accept: 'application/json' }
          });
          if (!res.ok) throw new Error('formspree');
          sent = true;
        } catch (err) {
          sent = false;
        }
      } else {
        sent = true;
      }

      if (sent) {
        form.style.display = 'none';
        if (success) success.style.display = 'block';
        form.reset();
      } else {
        alert('Senden fehlgeschlagen. Bitte später erneut versuchen.');
      }
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Bewertung absenden';
      }
    });
  }
})();
