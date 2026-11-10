# SPEC: Was bauen wir?

## 1. Idee in einem Satz

Ich möchte einen privaten Musikplayer bauen, der meine eigene Musik vom Rechner abspielt und autorisierte Audio- oder Videoquellen als MP3 oder MP4 importieren kann.

## 2. Für wen?

Die Person, die es nutzt, bin zuerst ich selbst.

## 3. Welches Problem?

Heute ist schwierig, meine lokale Musik bequem online zu hören und erlaubte Quellen in einer eigenen Mediathek zu verwalten.

## 4. Muss können

- [ ] Musikdateien vom eigenen Rechner in einer Bibliothek anzeigen.
- [ ] Die erste Version unterstützt MP3-Dateien.
- [ ] Titel, Alben und Playlists abspielen, pausieren und durchsuchen.
- [ ] Eine einzelne autorisierte URL importieren.
- [ ] Eine autorisierte Playlist importieren.
- [ ] Das gewünschte Format MP3 oder MP4 auswählen.
- [ ] Importierte Dateien in der eigenen Bibliothek anzeigen.

## 5. Darf nicht passieren

- Keine Dateien ohne ausdrückliche Berechtigung herunterladen.
- Keine Zugangsdaten oder Cookies von Videoplattformen speichern.
- Keine lokale Musik öffentlich zugänglich machen.
- Keine Datei überschreiben, ohne vorher zu fragen.

## 6. Look

Aurora: violett bis türkis, klare Schrift, gläserne Karten, ruhig und freundlich.

## 7. Fertig, wenn

- [ ] Eine Person kann die Hauptaufgabe ohne Erklärung durchführen.
- [ ] Die wichtigsten Daten bleiben nach dem Neuladen erhalten.
- [ ] Die fünf manuellen Abnahmetests bestehen.
- [ ] Der Player funktioniert im privaten Netzwerk und später sicher von unterwegs.
- [ ] Der Fernzugriff verwendet eine verschlüsselte Verbindung und eine Anmeldung.
- [ ] Der Importer blockiert unklare oder nicht freigegebene Quellen.

## 8. Bewusst noch nicht

- Login
- Bezahlfunktion
- öffentliche Freigabe des Rechners
- automatische Umgehung von Zugriffssperren oder Plattformregeln
- unnötige Zusatzfunktionen

## 9. Offene Produktentscheidungen

- Lokaler MVP: kein Login, Menü öffnet direkt.
- Vor dem Fernzugriff: Login wieder aktivieren.
- Weitere Formate wie M4A, FLAC oder WAV kommen erst nach dem MVP.
- MP3-Ordner: `mp3/` im Projektverzeichnis.
- Wo sollen importierte Dateien gespeichert werden?
- Welche Quellen und Inhalte darf der Importer ausdrücklich verarbeiten?
