(function () {
  const PENDING_KEY = 'stielke_reviews_pending';
  const PUBLISHED_KEY = 'stielke_reviews_published';
  const AUTH_KEY = 'stielke_admin_ok';
  const cfg = window.STIELKE_AUTH || { adminPassword: 'Admin2026!' };

  const loginView = document.getElementById('loginView');
  const adminView = document.getElementById('adminView');
  const pendingList = document.getElementById('pendingList');
  const publishedList = document.getElementById('publishedList');
  const exportJson = document.getElementById('exportJson');

  function getPending() {
    try { return JSON.parse(localStorage.getItem(PENDING_KEY) || '[]'); } catch (e) { return []; }
  }
  function setPending(arr) {
    localStorage.setItem(PENDING_KEY, JSON.stringify(arr));
  }
  function getPublishedLocal() {
    try { return JSON.parse(localStorage.getItem(PUBLISHED_KEY) || '[]'); } catch (e) { return []; }
  }
  function setPublishedLocal(arr) {
    localStorage.setItem(PUBLISHED_KEY, JSON.stringify(arr));
  }

  function stars(n) {
    return '★'.repeat(n) + '☆'.repeat(Math.max(0, 5 - n));
  }

  function render() {
    const pending = getPending();
    const published = getPublishedLocal();

    if (!pending.length) {
      pendingList.innerHTML = '<p class="form-note">Keine ausstehenden Bewertungen in diesem Browser. Neue kommen per Formular auf der Website (und per E-Mail).</p>';
    } else {
      pendingList.innerHTML = pending.map(function (r, i) {
        return '<div class="admin-card" data-i="' + i + '">' +
          '<div class="stars">' + stars(r.stars) + '</div>' +
          '<strong>' + escapeHtml(r.name) + '</strong> · ' + (r.date || '') +
          '<p>' + escapeHtml(r.text) + '</p>' +
          '<div class="admin-actions">' +
          '<button type="button" class="btn btn-primary btn-sm btn-approve" data-i="' + i + '">Freigeben</button>' +
          '<button type="button" class="btn btn-outline btn-sm btn-reject" data-i="' + i + '" style="color:#b91c1c;border-color:#b91c1c;">Ablehnen</button>' +
          '</div></div>';
      }).join('');
    }

    if (!published.length) {
      publishedList.innerHTML = '<p class="form-note">Noch keine freigegebenen Einträge in diesem Browser. Datei reviews.json wird zusätzlich auf der Startseite geladen.</p>';
    } else {
      publishedList.innerHTML = published.map(function (r) {
        return '<div class="admin-card"><div class="stars">' + stars(r.stars) + '</div><strong>' +
          escapeHtml(r.name) + '</strong> · ' + (r.date || '') +
          '<p>' + escapeHtml(r.text) + '</p></div>';
      }).join('');
    }

    // Export = local published (admin can merge with file)
    exportJson.textContent = JSON.stringify(published, null, 2);

    pendingList.querySelectorAll('.btn-approve').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const i = parseInt(btn.getAttribute('data-i'), 10);
        const p = getPending();
        const item = p.splice(i, 1)[0];
        if (!item) return;
        item.id = item.id || ('r' + Date.now());
        const pub = getPublishedLocal();
        pub.unshift(item);
        setPending(p);
        setPublishedLocal(pub);
        render();
      });
    });
    pendingList.querySelectorAll('.btn-reject').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const i = parseInt(btn.getAttribute('data-i'), 10);
        const p = getPending();
        p.splice(i, 1);
        setPending(p);
        render();
      });
    });
  }

  function escapeHtml(s) {
    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
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

  show(sessionStorage.getItem(AUTH_KEY) === '1');

  document.getElementById('adminLoginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const pw = document.getElementById('adminPass').value;
    const err = document.getElementById('adminLoginError');
    if (pw === cfg.adminPassword) {
      sessionStorage.setItem(AUTH_KEY, '1');
      err.classList.add('hidden');
      show(true);
    } else {
      err.classList.remove('hidden');
    }
  });

  document.getElementById('adminLogout').addEventListener('click', function () {
    sessionStorage.removeItem(AUTH_KEY);
    show(false);
  });

  document.getElementById('copyJson').addEventListener('click', function () {
    const t = exportJson.textContent;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(t).then(function () {
        alert('JSON kopiert. In reviews.json einfügen und hochladen.');
      });
    } else {
      alert('Bitte Text manuell markieren und kopieren.');
    }
  });
})();
