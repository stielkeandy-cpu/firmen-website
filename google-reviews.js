(function () {
  var cfg = window.STIELKE_GOOGLE_REVIEWS || {};
  var maps = document.getElementById('googleMapsLink');
  var rev = document.getElementById('googleReviewLink');
  if (maps && cfg.mapsUrl) maps.href = cfg.mapsUrl;
  var reviewUrl = cfg.reviewUrl;
  if (!reviewUrl && cfg.placeId) {
    reviewUrl = 'https://search.google.com/local/writereview?placeid=' + encodeURIComponent(cfg.placeId);
  }
  if (rev && reviewUrl) {
    rev.href = reviewUrl;
  } else if (rev && cfg.mapsUrl) {
    rev.href = cfg.mapsUrl;
  }
})();
