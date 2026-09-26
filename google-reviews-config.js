/**
 * Google Bewertungen – Allround Service Stielke
 *
 * 1. Google Unternehmensprofil (Business Profile) einrichten / öffnen
 * 2. Place ID ermitteln: https://developers.google.com/maps/documentation/places/web-service/place-id
 *    oder in Google Maps → Teilen → Link, Place-ID aus dem Link
 * 3. placeId und reviewUrl unten eintragen
 */
window.STIELKE_GOOGLE_REVIEWS = {
  // Place ID eintragen, z. B. "ChIJ..."
  placeId: '',
  // Profil in Maps (Fallback-Suche nach Adresse)
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Allround+Service+Stielke+Naundorfer+Weg+4+06198+Salzatal',
  // Wird automatisch gesetzt, wenn placeId vorhanden – oder manuell überschreiben
  reviewUrl: ''
};
