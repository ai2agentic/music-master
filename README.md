# Music Master

Dieses Repository ist ein sauberer Startpunkt für eine eigene Idee nach dem Agentic-Engineering-Prinzip.

## Der einfache Ablauf

1. `docs/SPEC.md` beschreibt, was entstehen soll.
2. `docs/PLAN.md` zerlegt die Idee in kleine Schritte.
3. `docs/TASKS.md` zeigt, was als Nächstes gebaut wird.
4. Der Agent baut jeweils nur einen Task.
5. Wir prüfen das Ergebnis mit klaren Tests.

## Aktueller Stand

Der erste MVP steht: Eine lokale Node.js-Web-App liest MP3-Dateien aus `mp3/`, schützt die Bibliothek mit einem Passwort und spielt die Titel im Browser ab.

## Starten

```bash
APP_PASSWORD='dein-persönliches-passwort' npm start
```

Danach im Browser `http://localhost:3000` öffnen. Wenn `APP_PASSWORD` fehlt, verwendet die Entwicklungsumgebung den Platzhalter `change-me-now`; vor jeder Nutzung muss ein eigenes Passwort gesetzt werden.
