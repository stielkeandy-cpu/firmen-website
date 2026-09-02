// Mobile navigation toggle
const burger = document.getElementById('burger');
const nav = document.getElementById('mainNav');

if (burger && nav) {
  burger.addEventListener('click', () => {
    nav.classList.toggle('open');
    burger.classList.toggle('active');
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      burger.classList.remove('active');
    });
  });
}

// Highlight active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function highlightNav() {
  const scrollY = window.pageYOffset;
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + sectionId) {
          link.classList.add('active');
        }
      });
    }
  });
}
window.addEventListener('scroll', highlightNav);

// Tarif-Buttons: Leistung ins Formular übernehmen und scrollen
document.querySelectorAll('.select-service').forEach(btn => {
  btn.addEventListener('click', () => {
    const service = btn.getAttribute('data-service');
    const select = document.getElementById('b-service');
    if (select && service) {
      select.value = service;
    }
    const booking = document.getElementById('buchung');
    if (booking) {
      booking.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Booking form – Formspree + Fallback
const bookingForm = document.getElementById('bookingForm');
const bookingSuccess = document.getElementById('bookingSuccess');

if (bookingForm) {
  bookingForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const emailInput = document.getElementById('b-email');
    const replyto = document.getElementById('replyto');
    if (replyto && emailInput) {
      replyto.value = emailInput.value;
    }

    const formAction = bookingForm.getAttribute('action');
    const isFormspreeConfigured = formAction && !formAction.includes('YOUR_FORM_ID');

    const submitBtn = document.getElementById('bookingSubmit');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Wird gesendet …';
    }

    if (isFormspreeConfigured) {
      try {
        const formData = new FormData(bookingForm);
        const response = await fetch(formAction, {
          method: 'POST',
          body: formData,
          headers: { Accept: 'application/json' }
        });

        if (response.ok) {
          bookingForm.style.display = 'none';
          if (bookingSuccess) bookingSuccess.style.display = 'block';
          bookingForm.reset();
        } else {
          alert('Es gab ein Problem beim Senden. Bitte versuchen Sie es erneut oder rufen Sie uns an: 0155 6747 11603');
        }
      } catch (err) {
        alert('Verbindungsfehler. Bitte rufen Sie uns an: 0155 6747 11603');
      }
    } else {
      // Fallback: mailto öffnen (wenn Formspree noch nicht eingerichtet)
      const name = document.getElementById('b-name').value;
      const email = document.getElementById('b-email').value;
      const phone = document.getElementById('b-phone').value;
      const service = document.getElementById('b-service').value;
      const area = document.getElementById('b-area').value || '–';
      const date = document.getElementById('b-date').value || '–';
      const address = document.getElementById('b-address').value || '–';
      const message = document.getElementById('b-message').value || '–';

      const subject = encodeURIComponent('Neue Buchungsanfrage – Allround Service Stielke');
      const body = encodeURIComponent(
        'Neue Buchungsanfrage über die Website\n\n' +
        'Name: ' + name + '\n' +
        'E-Mail: ' + email + '\n' +
        'Telefon: ' + phone + '\n' +
        'Leistung: ' + service + '\n' +
        'Fläche (m²): ' + area + '\n' +
        'Wunschtermin: ' + date + '\n' +
        'Objektadresse: ' + address + '\n\n' +
        'Nachricht:\n' + message + '\n'
      );

      window.location.href = 'mailto:allroundservicestielke@web.de?subject=' + subject + '&body=' + body;

      setTimeout(function () {
        bookingForm.style.display = 'none';
        if (bookingSuccess) bookingSuccess.style.display = 'block';
      }, 500);
    }

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Buchung absenden';
    }
  });
}

// ===== Auftragskalkulator =====
(function () {
  const tarifSelect = document.getElementById('calc-tarif');
  const areaInput = document.getElementById('calc-area');
  const freqSelect = document.getElementById('calc-freq');
  const resultBox = document.getElementById('calc-result');
  const priceEl = document.getElementById('calc-price');
  const detailEl = document.getElementById('calc-detail');
  const toFormBtn = document.getElementById('calc-to-form');

  if (!tarifSelect || !areaInput) return;

  function formatEuro(n) {
    return n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
  }

  function calculate() {
    const opt = tarifSelect.options[tarifSelect.selectedIndex];
    const area = parseFloat(areaInput.value);
    if (!opt || !opt.value || !area || area < 1) {
      resultBox.style.display = 'none';
      return;
    }

    const min = parseFloat(opt.getAttribute('data-min'));
    const max = parseFloat(opt.getAttribute('data-max'));
    const name = opt.getAttribute('data-name');
    const freq = parseFloat(freqSelect.value) || 1;

    // Bei höherer Frequenz leichte Rabatt-Andeutung (nur Anzeige, unverbindlich)
    let discount = 1;
    if (freq >= 5) discount = 0.9;
    else if (freq >= 3) discount = 0.93;
    else if (freq >= 2) discount = 0.95;

    const minTotal = min * area * discount;
    const maxTotal = max * area * discount;

    let freqText = freqSelect.options[freqSelect.selectedIndex].text;
    priceEl.textContent = formatEuro(minTotal) + ' – ' + formatEuro(maxTotal);
    detailEl.textContent = name + ' · ' + area + ' m² · ' + freqText + (discount < 1 ? ' (Richtwert mit Frequenzvorteil)' : '');

    resultBox.dataset.name = name;
    resultBox.dataset.area = area;
    resultBox.dataset.price = formatEuro(minTotal) + ' – ' + formatEuro(maxTotal);
    resultBox.dataset.freq = freqText;
    resultBox.style.display = 'block';
  }

  tarifSelect.addEventListener('change', calculate);
  areaInput.addEventListener('input', calculate);
  freqSelect.addEventListener('change', calculate);

  if (toFormBtn) {
    toFormBtn.addEventListener('click', function () {
      const name = resultBox.dataset.name;
      const area = resultBox.dataset.area;
      const price = resultBox.dataset.price;
      const freq = resultBox.dataset.freq;
      if (!name) return;

      const serviceSelect = document.getElementById('b-service');
      const areaField = document.getElementById('b-area');
      const messageField = document.getElementById('b-message');
      const kalkField = document.getElementById('b-kalkulation');

      if (serviceSelect) {
        // passende Option wählen
        for (let i = 0; i < serviceSelect.options.length; i++) {
          if (serviceSelect.options[i].value === name) {
            serviceSelect.selectedIndex = i;
            break;
          }
        }
      }
      if (areaField) areaField.value = area;
      if (kalkField) {
        kalkField.value = name + ' | ' + area + ' m² | ' + freq + ' | Schätzung: ' + price + ' netto';
      }
      if (messageField && !messageField.value) {
        messageField.value = 'Kalkulation über Website: ' + name + ', ' + area + ' m², ' + freq + '. Geschätzter Rahmen: ' + price + ' netto.';
      }

      const booking = document.getElementById('buchung');
      if (booking) booking.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
})();

// Scroll to top
(function () {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;
  window.addEventListener('scroll', function () {
    if (window.pageYOffset > 400) btn.classList.add('visible');
    else btn.classList.remove('visible');
  });
  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// ===== Rabattcodes – Validierung (5–10 €) =====
(function () {
  const PROMO_CODES = {
    'SAUBER5': 5,
    'GLANZ7': 7,
    'STIELKE10': 10,
    'PUTZ8': 8,
    'BUDGET6': 6,
    'START5': 5,
    'NEUKUNDE9': 9,
    'HALLE7': 7,
    'SALZATAL10': 10,
    'ECO6': 6
  };

  const CODE_PATTERN = /^[A-ZÄÖÜ0-9]{4,20}$/;

  let activeDiscount = 0;
  let activeCode = '';
  let validated = false;

  function normalizeCode(c) {
    return (c || '')
      .trim()
      .toUpperCase()
      .replace(/\s+/g, '')
      .replace(/[^A-ZÄÖÜ0-9]/g, '');
  }

  function clearPromoState(statusEl) {
    activeDiscount = 0;
    activeCode = '';
    validated = false;
    const rabattCode = document.getElementById('b-rabattcode');
    const rabattEuro = document.getElementById('b-rabatt-euro');
    if (rabattCode) rabattCode.value = '';
    if (rabattEuro) rabattEuro.value = '';
    const discEl = document.getElementById('calc-discount');
    if (discEl) {
      discEl.style.display = 'none';
      discEl.textContent = '';
    }
    [document.getElementById('calc-promo'), document.getElementById('b-promo-form')].forEach(function (el) {
      if (el) el.classList.remove('promo-input-ok', 'promo-input-error');
    });
    if (statusEl) {
      statusEl.textContent = '';
      statusEl.className = 'promo-status';
    }
  }

  function setInputState(input, ok) {
    if (!input) return;
    input.classList.remove('promo-input-ok', 'promo-input-error');
    input.classList.add(ok ? 'promo-input-ok' : 'promo-input-error');
  }

  /**
   * Validiert und wendet einen Code an.
   * @returns {{ ok: boolean, empty: boolean, message: string }}
   */
  function validateAndApply(raw, statusEl, codeInput) {
    const code = normalizeCode(raw);

    if (!code) {
      clearPromoState(statusEl);
      if (statusEl) {
        statusEl.textContent = 'Kein Code eingegeben – optional, Anfrage ohne Rabatt möglich.';
        statusEl.className = 'promo-status';
      }
      if (codeInput) codeInput.classList.remove('promo-input-ok', 'promo-input-error');
      return { ok: true, empty: true, message: '' };
    }

    if (code.length < 4 || code.length > 20) {
      clearPromoState(statusEl);
      setInputState(codeInput, false);
      if (statusEl) {
        statusEl.textContent = 'Code muss 4–20 Zeichen haben (Buchstaben/Zahlen).';
        statusEl.className = 'promo-status promo-error';
      }
      return { ok: false, empty: false, message: 'Ungültiges Format' };
    }

    if (!CODE_PATTERN.test(code)) {
      clearPromoState(statusEl);
      setInputState(codeInput, false);
      if (statusEl) {
        statusEl.textContent = 'Ungültige Zeichen. Nur Buchstaben und Zahlen erlaubt.';
        statusEl.className = 'promo-status promo-error';
      }
      return { ok: false, empty: false, message: 'Ungültige Zeichen' };
    }

    if (PROMO_CODES[code] === undefined) {
      clearPromoState(statusEl);
      setInputState(codeInput, false);
      if (statusEl) {
        statusEl.textContent = 'Code „' + code + '“ ist ungültig oder abgelaufen.';
        statusEl.className = 'promo-status promo-error';
      }
      return { ok: false, empty: false, message: 'Code ungültig' };
    }

    const amount = PROMO_CODES[code];
    if (amount < 5 || amount > 10) {
      clearPromoState(statusEl);
      setInputState(codeInput, false);
      if (statusEl) {
        statusEl.textContent = 'Code außerhalb des erlaubten Rabattbereichs (5–10 €).';
        statusEl.className = 'promo-status promo-error';
      }
      return { ok: false, empty: false, message: 'Rabatt ungültig' };
    }

    activeDiscount = amount;
    activeCode = code;
    validated = true;

    const rabattCode = document.getElementById('b-rabattcode');
    const rabattEuro = document.getElementById('b-rabatt-euro');
    if (rabattCode) rabattCode.value = code;
    if (rabattEuro) rabattEuro.value = amount + ' €';

    setInputState(codeInput, true);
    if (codeInput) codeInput.value = code;

    // Sync beider Eingabefelder
    const calcIn = document.getElementById('calc-promo');
    const formIn = document.getElementById('b-promo-form');
    if (calcIn && codeInput !== calcIn) {
      calcIn.value = code;
      setInputState(calcIn, true);
    }
    if (formIn && codeInput !== formIn) {
      formIn.value = code;
      setInputState(formIn, true);
    }

    const discEl = document.getElementById('calc-discount');
    if (discEl) {
      discEl.style.display = 'block';
      discEl.textContent = 'Rabattcode ' + code + ': −' + amount + ' € (wird bei der Anfrage vermerkt)';
    }

    if (statusEl) {
      statusEl.textContent = '✓ Code „' + code + '“ gültig: −' + amount + ' € Rabatt';
      statusEl.className = 'promo-status promo-ok';
    }

    // Status in beiden Statusfeldern
    const ps = document.getElementById('promo-status');
    const fps = document.getElementById('form-promo-status');
    [ps, fps].forEach(function (el) {
      if (el && el !== statusEl) {
        el.textContent = '✓ Code „' + code + '“ gültig: −' + amount + ' € Rabatt';
        el.className = 'promo-status promo-ok';
      }
    });

    return { ok: true, empty: false, message: 'gültig' };
  }

  function bindPromo(inputId, btnId, statusId) {
    const input = document.getElementById(inputId);
    const btn = document.getElementById(btnId);
    const status = document.getElementById(statusId);
    if (!input || !status) return;

    function run() {
      validateAndApply(input.value, status, input);
    }

    if (btn) btn.addEventListener('click', run);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        run();
      }
    });
    input.addEventListener('blur', function () {
      if (input.value.trim()) run();
    });
    input.addEventListener('input', function () {
      // Bei Änderung vorherige Validierung ungültig
      if (validated && normalizeCode(input.value) !== activeCode) {
        validated = false;
        input.classList.remove('promo-input-ok');
      }
    });
  }

  bindPromo('calc-promo', 'calc-promo-btn', 'promo-status');
  bindPromo('b-promo-form', 'form-promo-btn', 'form-promo-status');

  // Zufälliger Tipp-Code
  const hint = document.getElementById('promo-hint');
  if (hint) {
    const codes = Object.keys(PROMO_CODES);
    const pick = codes[Math.floor(Math.random() * codes.length)];
    const amount = PROMO_CODES[pick];
    hint.innerHTML = 'Codes sparen 5–10 €. Heutiger Tipp-Code: <strong>' + pick + '</strong> (−' + amount + ' €) · weitere: SAUBER5 · GLANZ7 · STIELKE10 · PUTZ8 · BUDGET6';
  }

  // Kalkulation → Formular
  const toForm = document.getElementById('calc-to-form');
  if (toForm) {
    toForm.addEventListener('click', function () {
      if (activeCode && activeDiscount && validated) {
        const msg = document.getElementById('b-message');
        const kalk = document.getElementById('b-kalkulation');
        const line = 'Rabattcode: ' + activeCode + ' (−' + activeDiscount + ' €)';
        if (kalk && kalk.value && kalk.value.indexOf('Rabattcode') === -1) {
          kalk.value += ' | ' + line;
        }
        if (msg && msg.value.indexOf('Rabattcode') === -1) {
          msg.value = (msg.value ? msg.value + '\n' : '') + line;
        }
        const formPromoInput = document.getElementById('b-promo-form');
        if (formPromoInput) {
          formPromoInput.value = activeCode;
          setInputState(formPromoInput, true);
        }
      }
    });
  }

  // Formular-Absenden: Code final prüfen
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', function (e) {
      const formIn = document.getElementById('b-promo-form');
      const formStatus = document.getElementById('form-promo-status');
      const raw = formIn ? formIn.value : '';

      if (!raw || !raw.trim()) {
        // Ohne Code ok
        clearPromoState(formStatus);
        return;
      }

      const result = validateAndApply(raw, formStatus, formIn);
      if (!result.ok) {
        e.preventDefault();
        e.stopImmediatePropagation();
        if (formIn) {
          formIn.focus();
          formIn.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return false;
      }
    }, true);
  }

  // Für andere Skripte nutzbar
  window.StielkePromo = {
    validate: function (raw) {
      return validateAndApply(raw, null, null);
    },
    getActive: function () {
      return validated ? { code: activeCode, euro: activeDiscount } : null;
    },
    codes: Object.keys(PROMO_CODES)
  };
})();

// Bewerbungsformular → Formspree
(function () {
  const form = document.getElementById('applyForm');
  const success = document.getElementById('applySuccess');
  const submitBtn = document.getElementById('applySubmit');
  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const action = form.getAttribute('action') || '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Wird gesendet …';
    }

    try {
      if (action.indexOf('formspree.io') !== -1) {
        const res = await fetch(action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });
        if (res.ok) {
          form.style.display = 'none';
          if (success) success.style.display = 'block';
          form.reset();
        } else {
          alert('Senden fehlgeschlagen. Bitte später erneut versuchen oder per E-Mail / WhatsApp bewerben.');
        }
      } else {
        form.style.display = 'none';
        if (success) success.style.display = 'block';
      }
    } catch (err) {
      alert('Netzwerkfehler. Bitte per E-Mail an allroundservicestielke@web.de oder WhatsApp bewerben.');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Bewerbung absenden';
      }
    }
  });
})();
