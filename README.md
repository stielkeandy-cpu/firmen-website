# Allround Service Stielke – Firmenhomepage

Statische Website für **Allround Service Stielke**  
Reinigung · Hausmeisterservice · Sangerhausen & Salzatal

**Live:** [https://www.allround-service-stielke.com](https://www.allround-service-stielke.com)

---

## Inhalt der Website

- Startseite mit Leistungen, Tarifen (Staffelpreise 2026), Kalkulator
- Online-Anfrageformular (E-Mail über Formspree)
- Bewerbungsformular (Karriere)
- Kontakt, Google Maps, WhatsApp & Facebook
- FAQ, Ablauf, Kundenstimmen, Chat-Assistent
- Impressum & Datenschutzerklärung
- SEO: Meta-Tags, Open Graph, JSON-LD, `sitemap.xml`, `robots.txt`
- Google-Search-Console-Verifizierung

---

## Dateien

| Datei | Beschreibung |
|--------|----------------|
| `index.html` | Hauptseite |
| `styles.css` | Design (responsive) |
| `script.js` | Menü, Formulare, Kalkulator, Chat, Rabattcodes |
| `impressum.html` | Impressum |
| `datenschutz.html` | Datenschutz |
| `logo.png` | Logo |
| `robots.txt` | Suchmaschinen-Hinweise |
| `sitemap.xml` | Sitemap für Google |
| `googlea87fe3bac411748e.html` | Google-Site-Verifizierung |
| `ANLEITUNG-BUCHUNG.txt` | Formspree-Hinweise |
| `SEO-HINWEISE.txt` | SEO-Kurzinfo |

---

## Lokal testen

Einfach `index.html` im Browser öffnen oder einen lokalen Server nutzen:

```bash
# z. B. mit Python
python3 -m http.server 8080
```

Dann: [http://localhost:8080](http://localhost:8080)

---

## Online stellen

### Variante A: Beliebiger Webhost (z. B. Lima-City)

1. Alle Dateien aus diesem Ordner per FTP/Filemanager **in das Root-Verzeichnis** der Domain laden  
2. `https://www.allround-service-stielke.com` aufrufen  

### Variante B: GitHub Pages

1. Repository öffentlich halten (oder GitHub Pro für private + Pages)
2. **Settings → Pages →** Branch `main`, Ordner `/ (root)`
3. Optional: Custom Domain `www.allround-service-stielke.com` eintragen  
4. DNS beim Domain-Anbieter: CNAME `www` → `DEIN-USER.github.io`  
   (Apex-Domain: A-Records laut [GitHub-Docs](https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site))

---

## Formulare (Formspree)

Anfragen und Bewerbungen gehen an:

```text
https://formspree.io/f/xgaeagza
```

Empfänger: die bei Formspree hinterlegte E-Mail (z. B. `allroundservicestielke@web.de`).

Bei neuer Form-ID in `index.html` alle `action="https://formspree.io/f/..."` anpassen.

---

## Kontaktdaten (Stand Website)

| | |
|--|--|
| **Hauptsitz** | John-Schehr-Straße 19, 06526 Sangerhausen |
| **Zweitstandort** | Naundorfer Weg 4, 06198 Salzatal |
| **Telefon** | 0155 6747 11603 |
| **WhatsApp** | 0174 2988851 |
| **E-Mail** | allroundservicestielke@web.de |

---

## SEO / Search Console

1. Property für `allround-service-stielke.com` bestätigen  
2. Sitemap einreichen:  
   `https://www.allround-service-stielke.com/sitemap.xml`  
3. Google Unternehmensprofil (Sangerhausen) pflegen  

Die Browser-Meldung „keine Style-Informationen“ bei der Sitemap ist **normal** und kein Fehler.

---

## Technik

- Rein HTML, CSS, JavaScript – **kein** Build-Schritt, keine Datenbank
- Mobil optimiert
- Formulare: HTML5-Pflichtfelder + Formspree
- Chatbot: lokale FAQ-Logik (kein externes Abo)

---

## Lizenz / Nutzung

Firmenwebsite für Allround Service Stielke.  
Inhalte und Logo: Eigentum des Betreibers.

---

## Support bei Anpassungen

Tarife, Texte, Formulare oder SEO können jederzeit in den HTML/CSS/JS-Dateien geändert und erneut hochgeladen werden.
