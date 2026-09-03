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
    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
  function stars(n) {
    n = parseInt(n, 10) || 0;
    return '★'.repeat(n) + '☆'.repeat(Math.max(0, 5 - n));
  }
  function getClient() {
    return window.initStielkeSupabase && window.initStielkeSupabase();
  }

  async function isSupabaseLoggedIn() {
    const client = getClient();
    if (!client) return false;
    const { data } = await client.auth.getSession();
    return !!(data && data.session);
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

  async function render() {
    const client = getClient();
    if (client) {
      try {
        const { data: pending, error: e1 } = await client.from('reviews').select('*').eq('status', 'pending').order('created_at', { ascending: false });
        if (e1) throw e1;
        const { data: approved, error: e2 } = await client.from('reviews').select('*').eq('status', 'approved').order('created_at', { ascending: false });
        if (e2) throw e2;
        renderPendingSupabase(pending || []);
        renderPublishedSupabase(approved || []);
        if (exportJson) exportJson.textContent = JSON.stringify(approved || [], null, 2);
        return;
      } catch (err) {
        pendingList.innerHTML = '<p class="form-note" style="color:#b91c1c;">Supabase-Fehler: ' + escapeHtml(err.message || String(err)) + '</p>';
      }
    }
    let pending = [], published = [];
    try { pending = JSON.parse(localStorage.getItem(PENDING_KEY) || '[]'); } catch (e) {}
    try { published = JSON.parse(localStorage.getItem(PUBLISHED_KEY) || '[]'); } catch (e) {}
    renderPendingLocal(pending);
    renderPublishedLocal(published);
    if (exportJson) exportJson.textContent = JSON.stringify(published, null, 2);
  }

  function renderPendingSupabase(pending) {
    if (!pending.length) {
      pendingList.innerHTML = '<p class="form-note">Keine ausstehenden Bewertungen in Supabase.</p>';
      return;
    }
    pendingList.innerHTML = pending.map(function (r) {
      return '<div class="admin-card"><div class="stars">' + stars(r.stars) + '</div><strong>' + escapeHtml(r.name) + '</strong> · ' +
        (r.created_at ? String(r.created_at).slice(0, 10) : '') +
        (r.email ? '<br><small>' + escapeHtml(r.email) + '</small>' : '') +
        '<p>' + escapeHtml(r.body) + '</p><div class="admin-actions">' +
        '<button type="button" class="btn btn-primary btn-sm" data-act="approve" data-id="' + r.id + '">Freigeben</button>' +
        '<button type="button" class="btn btn-outline btn-sm" data-act="reject" data-id="' + r.id + '" style="color:#b91c1c;border-color:#b91c1c;">Ablehnen</button></div></div>';
    }).join('');
    pendingList.querySelectorAll('button[data-act]').forEach(function (btn) {
      btn.addEventListener('click', async function () {
        const id = btn.getAttribute('data-id');
        const status = btn.getAttribute('data-act') === 'approve' ? 'approved' : 'rejected';
        const client = getClient();
        btn.disabled = true;
        const { error } = await client.from('reviews').update({ status: status }).eq('id', id);
        if (error) alert('Fehler: ' + error.message);
        render();
      });
    });
  }

  function renderPublishedSupabase(list) {
    if (!list.length) {
      publishedList.innerHTML = '<p class="form-note">Noch keine freigegebenen Bewertungen.</p>';
      return;
    }
    publishedList.innerHTML = list.map(function (r) {
      return '<div class="admin-card"><div class="stars">' + stars(r.stars) + '</div><strong>' + escapeHtml(r.name) + '</strong> · ' +
        (r.created_at ? String(r.created_at).slice(0, 10) : '') + '<p>' + escapeHtml(r.body) + '</p></div>';
    }).join('');
  }

  function renderPendingLocal(pending) {
    if (!pending.length) {
      pendingList.innerHTML = '<p class="form-note">Keine ausstehenden Bewertungen (lokal).</p>';
      return;
    }
    pendingList.innerHTML = pending.map(function (r, i) {
      return '<div class="admin-card"><div class="stars">' + stars(r.stars) + '</div><strong>' + escapeHtml(r.name) +
        '</strong><p>' + escapeHtml(r.text || r.body) + '</p><div class="admin-actions">' +
        '<button type="button" class="btn btn-primary btn-sm btn-approve" data-i="' + i + '">Freigeben</button>' +
        '<button type="button" class="btn btn-outline btn-sm btn-reject" data-i="' + i + '" style="color:#b91c1c;border-color:#b91c1c;">Ablehnen</button></div></div>';
    }).join('');
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

  function renderPublishedLocal(published) {
    if (!published.length) {
      publishedList.innerHTML = '<p class="form-note">Keine lokalen Freigaben.</p>';
      return;
    }
    publishedList.innerHTML = published.map(function (r) {
      return '<div class="admin-card"><div class="stars">' + stars(r.stars) + '</div><strong>' + escapeHtml(r.name) +
        '</strong><p>' + escapeHtml(r.text || r.body) + '</p></div>';
    }).join('');
  }

  if (loginHint) {
    if (window.STIELKE_SUPABASE && window.STIELKE_SUPABASE.enabled) {
      loginHint.textContent = 'Supabase-Login: E-Mail und Passwort des Admin-Users.';
      const passInput = document.getElementById('adminPass');
      if (passInput && !document.getElementById('adminEmail')) {
        const emailGroup = document.createElement('div');
        emailGroup.className = 'form-group';
        emailGroup.innerHTML = '<label for="adminEmail">E-Mail</label><input type="email" id="adminEmail" required autocomplete="username" placeholder="admin@…">';
        passInput.parentElement.parentElement.insertBefore(emailGroup, passInput.parentElement);
      }
    } else {
      loginHint.textContent = 'Lokaler Modus. Für Supabase: supabase-config.js → enabled: true + Keys.';
    }
  }

  (async function init() {
    if (await isSupabaseLoggedIn()) { show(true); return; }
    if (sessionStorage.getItem(AUTH_KEY) === '1' && !(window.STIELKE_SUPABASE && window.STIELKE_SUPABASE.enabled)) {
      show(true); return;
    }
    show(false);
  })();

  if (loginForm) {
    loginForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const err = document.getElementById('adminLoginError');
      const client = getClient();
      const emailEl = document.getElementById('adminEmail');
      const pw = document.getElementById('adminPass').value;

      if (client && window.STIELKE_SUPABASE && window.STIELKE_SUPABASE.enabled) {
        const email = emailEl ? emailEl.value.trim() : '';
        if (!email) {
          err.textContent = 'E-Mail eingeben.';
          err.classList.remove('hidden');
          return;
        }
        const { error } = await client.auth.signInWithPassword({ email: email, password: pw });
        if (error) {
          err.textContent = error.message || 'Login fehlgeschlagen';
          err.classList.remove('hidden');
          return;
        }
        err.classList.add('hidden');
        show(true);
        return;
      }

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
    logoutBtn.addEventListener('click', async function () {
      const client = getClient();
      if (client) await client.auth.signOut();
      sessionStorage.removeItem(AUTH_KEY);
      show(false);
    });
  }

  const copyBtn = document.getElementById('copyJson');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      const t = exportJson.textContent;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(t).then(function () { alert('JSON kopiert.'); });
      }
    });
  }
})();
