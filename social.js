(function () {
  var cfg = window.STIELKE_SOCIAL || {};
  var pageUrl = encodeURIComponent(window.location.href.split('#')[0]);
  var title = encodeURIComponent(cfg.shareTitle || document.title);
  var text = encodeURIComponent(cfg.shareText || '');

  document.querySelectorAll('[data-social="facebook"]').forEach(function (el) {
    if (cfg.facebook) el.href = cfg.facebook;
  });
  document.querySelectorAll('[data-social="instagram"]').forEach(function (el) {
    if (cfg.instagram && cfg.instagram.indexOf('instagram.com/') > -1 && !cfg.instagram.endsWith('instagram.com/')) {
      el.href = cfg.instagram;
      el.style.display = '';
    } else if (cfg.instagram && /instagram\.com\/.+/.test(cfg.instagram)) {
      el.href = cfg.instagram;
    } else {
      // no real profile yet – hide profile links, keep share
      if (el.classList.contains('social-profile')) {
        el.setAttribute('hidden', 'hidden');
      }
    }
  });

  document.querySelectorAll('[data-share]').forEach(function (el) {
    var type = el.getAttribute('data-share');
    var href = '#';
    if (type === 'facebook') {
      href = 'https://www.facebook.com/sharer/sharer.php?u=' + pageUrl;
    } else if (type === 'whatsapp') {
      href = 'https://wa.me/?text=' + title + '%20' + pageUrl;
    } else if (type === 'linkedin') {
      href = 'https://www.linkedin.com/sharing/share-offsite/?url=' + pageUrl;
    } else if (type === 'telegram') {
      href = 'https://t.me/share/url?url=' + pageUrl + '&text=' + title;
    } else if (type === 'email') {
      href = 'mailto:?subject=' + title + '&body=' + text + '%20' + pageUrl;
    } else if (type === 'xing') {
      href = 'https://www.xing.com/spi/shares/new?url=' + pageUrl;
    }
    el.href = href;
    if (type !== 'email') {
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener');
    }
  });

  var copyBtn = document.getElementById('shareCopy');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var url = window.location.href.split('#')[0];
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(function () {
          copyBtn.textContent = 'Link kopiert';
          setTimeout(function () { copyBtn.textContent = 'Link kopieren'; }, 2000);
        });
      } else {
        prompt('Link kopieren:', url);
      }
    });
  }
})();
