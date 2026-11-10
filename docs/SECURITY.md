# Sicherheit für den Fernzugriff

Die Musikbibliothek bleibt privat.

Aktueller Entwicklungsmodus: Der lokale MVP öffnet direkt ohne Login. Diese Einstellung gilt nur für die lokale Entwicklung. Vor einer Erreichbarkeit von ausserhalb muss der Login wieder aktiviert werden.

## Grundregeln

- Keine direkte Freigabe des Musikordners ins öffentliche Internet.
- Fernzugriff nur über HTTPS beziehungsweise eine verschlüsselte private Verbindung.
- Jede Anfrage braucht eine Anmeldung.
- Das Passwort wird nur als sicherer Hash gespeichert, nie im Klartext.
- Nach mehreren falschen Versuchen wird der Zugang vorübergehend gebremst.
- Der Player darf lesen und abspielen.
- Der Importer darf nur in einen festgelegten Zielordner schreiben.
- Der Importer darf keine vorhandenen Dateien ohne Bestätigung überschreiben.
- Zugangsdaten gehören in Umgebungsvariablen oder einen Secret Store, niemals in Git.

## Reihenfolge

1. Player lokal bauen.
2. Player im Heimnetz testen.
3. Anmeldung und verschlüsselte Verbindung einrichten.
4. Fernzugriff mit Testkonto prüfen.
5. Erst danach den Downloader/Importer anschliessen.
