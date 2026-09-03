(function () {
  const PENDING_KEY = 'stielke_reviews_pending';
  const PUBLISHED_KEY = 'stielke_reviews_published';
  const AUTH_KEY = 'stielke_admin_ok';
  const cfgLocal = window.STIELKE_AUTH || { adminPassword: 'Admin2026!' };

  const loginView = document.getElementById('loginView');
  const adminView = document.getElementById('adminView');
  const pendingList = document.getElementById('pendingList');
  const publishedList = document.getElementById('publishedList');
  const exportJson = document.getElementById('exportJson');
  const loginForm = document.getElementById('adminLoginForm');
  const loginHint = document.getElementById('adminLoginHint');

  function escapeHtml(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  function stars(n) {
    n = parseInt(n, 10) || 0;
    return '★'.repeat(n) + '☆'.repeat(Math.max(0, 5 - n));
  }

  function show(ok) {
    if (ok) {
      loginView.classList.add('hidden');
      adminView.classList.remove('hidden');
      render();
    } else {
      adminView.classList.add('hidden');
      loginView.classList.remove('hidden');
    }
  }

  function render() {
    let pending = [];
    let published = [];
    try { pending = JSON.parse(localStorage.getItem(PENDING_KEY) || '[]'); } catch (e) {}
    try { published = JSON.parse(localStorage.getItem(PUBLISHED_KEY) || '[]'); } catch (e) {}

    if (!pending.length) {
      pendingList.innerHTML = '<p class="form-note">Keine ausstehenden Bewertungen. Neue kommen per Formular (E-Mail + optional dieser Browser).</p>';
    } else {
      pendingList.innerHTML = pending.map(function (r, i) {
        return (
          '<div class="admin-card"><div class="stars">' + stars(r.stars) + '</div><strong>' +
          escapeHtml(r.name) + '</strong> · ' + (r.date || '') +
          '<p>' + escapeHtml(r.text || r.body) + '</p><div class="admin-actions">' +
          '<button type="button" class="btn btn-primary btn-sm btn-approve" data-i="' + i + '">Freigeben</button>' +
          '<button type="button" class="btn btn-outline btn-sm btn-reject" data-i="' + i + '" style="color:#b91c1c;border-color:#b91c1c;">Ablehnen</button></div></div>'
        );
      }).join('');
    }

    if (!published.length) {
      publishedList.innerHTML = '<p class="form-note">Noch keine freigegebenen Einträge hier. Für alle Besucher: JSON in reviews.json speichern und hochladen.</p>';
    } else {
      publishedList.innerHTML = published.map(function (r) {
        return (
          '<div class="admin-card"><div class="stars">' + stars(r.stars) + '</div><strong>' +
          escapeHtml(r.name) + '</strong><p>' + escapeHtml(r.text || r.body) + '</p></div>'
        );
      }).join('');
    }

    if (exportJson) exportJson.textContent = JSON.stringify(published, null, 2);

    pendingList.querySelectorAll('.btn-approve').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const i = parseInt(btn.getAttribute('data-i'), 10);
        const p = JSON.parse(localStorage.getItem(PENDING_KEY) || '[]');
        const item = p.splice(i, 1)[0];
        if (!item) return;
        const pub = JSON.parse(localStorage.getItem(PUBLISHED_KEY) || '[]');
        pub.unshift(item);
        localStorage.setItem(PENDING_KEY, JSON.stringify(p));
        localStorage.setItem(PUBLISHED_KEY, JSON.stringify(pub));
        render();
      });
    });
    pendingList.querySelectorAll('.btn-reject').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const i = parseInt(btn.getAttribute('data-i'), 10);
        const p = JSON.parse(localStorage.getItem(PENDING_KEY) || '[]');
        p.splice(i, 1);
        localStorage.setItem(PENDING_KEY, JSON.stringify(p));
        render();
      });
    });
  }

  if (loginHint) {
    loginHint.textContent = 'Passwort steht in auth-config.js (adminPassword).';
  }

  show(sessionStorage.getItem(AUTH_KEY) === '1');

  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const err = document.getElementById('adminLoginError');
      const pw = document.getElementById('adminPass').value;
      if (pw === cfgLocal.adminPassword) {
        sessionStorage.setItem(AUTH_KEY, '1');
        err.classList.add('hidden');
        show(true);
      } else {
        err.textContent = 'Falsches Passwort.';
        err.classList.remove('hidden');
      }
    });
  }

  const logoutBtn = document.getElementById('adminLogout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function () {
      sessionStorage.removeItem(AUTH_KEY);
      show(false);
    });
  }

  const copyBtn = document.getElementById('copyJson');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      const t = exportJson.textContent;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(t).then(function () {
          alert('JSON kopiert. In reviews.json einfügen und hochladen.');
        });
      }
    });
  }
})();
