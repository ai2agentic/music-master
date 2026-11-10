# PLAN

## Ziel des MVP

Ein privater MP3-Player liest Dateien aus `mp3/`, spielt sie im Browser ab und schützt den Fernzugriff mit einem Passwort.

## Bauphasen

1. Grundgerüst: kleine Web-App starten und MP3-Ordner einlesen.
2. Player: Liste, Suche, Play/Pause und Fortschrittsbalken.
3. Bibliothek: Titelinformationen und einfache Playlists.
4. Anmeldung: Passwort-Login, sichere Sitzung und Abmeldung.
5. Heimnetz: Player auf einem zweiten Gerät prüfen.
6. Fernzugriff: verschlüsselte Verbindung vorbereiten und mit Testkonto prüfen.
7. Importer: nur autorisierte Quellen, eigener Zielordner, keine Überschreibung ohne Bestätigung.

## Technische Leitplanken

- KISS: zuerst eine kleine Node.js-Web-App ohne unnötige Dienste.
- MP3-Dateien bleiben im lokalen `mp3/`-Ordner.
- Keine Veröffentlichung, bevor die Sicherheitsprüfung bestanden ist.
- Jede Phase endet mit einem sichtbaren Test.

## Leitplanken

- MVP zuerst
- eine kleine Änderung pro Task
- Tests vor oder zusammen mit der Implementierung
- keine Veröffentlichung ohne menschliche Prüfung
