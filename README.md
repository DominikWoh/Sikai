# Sikai · सिकाइ — Nepali lernen

Eine Lernreise von Kathmandu zum Everest Base Camp: 9 Kapitel Geschichte, Vokabeltrainer mit Devanagari + Umschrift, XP, Streak, Reise-Pass mit Stempeln. Für alle, die Nepali von null auf „kleines Gespräch“ lernen wollen — komplett auf Deutsch.

**Live:** <https://dominikwoh.github.io/Sikai/>

## Als App installieren (funktioniert dann komplett offline)

- **Android (Chrome):** Seite öffnen → Menü · · · → **„App installieren“** — oder direkt über die Schaltfläche in den App-Einstellungen.
- **iPhone (Safari):** Teilen-Taste → **„Zum Startbildschirm hinzufügen“**.

Beim ersten Öffnen speichert sich die gesamte App auf dem Gerät — alle Kapitel, Übungen und Audios. Danach funktioniert Sikai ohne jede Internetverbindung. Fortschritt (XP, Streak) liegt lokal im Browser des jeweiligen Geräts.

## Lokal starten

Die App ist rein statisch — kein Build, kein Server nötig:

```bash
python -m http.server 8765
# dann http://localhost:8765 öffnen
```

## Technik (Kurzfassung)

- Vanille HTML/CSS/JS, keine Abhängigkeiten, keine externen Anfragen (Fonts lokal eingebettet).
- `sw.js` (Service Worker) precacht alle ~230 Dateien inkl. der 183 Audio-Dateien; er wird per Skript aus dem Dateibaum generiert und trägt einen Inhalts-Hash als Build-Kennung. Bei Inhaltsänderungen wird er neu generiert — installierte Apps laden die neue Version dann automatisch nach (Update-Banner).
- Manifest + Icons für Android/iOS; relative Pfade, damit alles auch unter einem GitHub-Pages-Unterpfad läuft.

## Struktur

```
index.html        App-Shell (Tabs: Start · Üben · Einstellungen)
app.js            Lern-Engine: Story, SRS, XP, Streak, Quiz-Typen, PWA-Logik
styles.css        Design (hell/dunkel, warm & ruhig, Devanagari-taugliche Fonts)
data/             Kapitel 1–9 + Basislektion
assets/           Icons (Lucide) + Fonts (Fraunces, Mukta — lokal)
audio/            183 MP3-Aussprachedateien
manifest.json     PWA-Manifest   ·   sw.js   Service Worker (generiert)
```
