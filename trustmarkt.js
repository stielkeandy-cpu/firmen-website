(function () {
  var cfg = window.STIELKE_TRUSTMARKT || {};
  var link = document.getElementById('trustmarktReviewLink');
  if (link && cfg.reviewUrl) {
    link.href = cfg.reviewUrl;
  }
  var box = document.getElementById('trustmarktWidget');
  if (box && cfg.widgetHtml && String(cfg.widgetHtml).trim()) {
    box.innerHTML = cfg.widgetHtml;
  }
})();
