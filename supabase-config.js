// === Supabase Konfiguration ===
// 1. Projekt auf https://supabase.com anlegen
// 2. Project Settings → API: Project URL + anon public Key hier eintragen
// 3. SQL aus SUPABASE-SETUP.txt im SQL-Editor ausführen
// 4. Auth: Benutzer für Admin anlegen (Authentication → Users)

window.STIELKE_SUPABASE = {
  url: "https://DEIN-PROJEKT.supabase.co",
  anonKey: "DEIN-ANON-KEY",
  // true = Supabase nutzen, false = nur reviews.json + localStorage
  enabled: false
};

window.stielkeSupabaseClient = null;

window.initStielkeSupabase = function () {
  var cfg = window.STIELKE_SUPABASE;
  if (!cfg || !cfg.enabled) return null;
  if (!cfg.url || cfg.url.indexOf("DEIN-PROJEKT") !== -1) {
    console.warn("Supabase: bitte URL und anonKey in supabase-config.js eintragen.");
    return null;
  }
  if (typeof supabase === "undefined" || !supabase.createClient) {
    console.warn("Supabase JS-Bibliothek nicht geladen.");
    return null;
  }
  window.stielkeSupabaseClient = supabase.createClient(cfg.url, cfg.anonKey);
  return window.stielkeSupabaseClient;
};
