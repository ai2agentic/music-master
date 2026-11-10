import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(root, 'public');
const musicDir = path.join(root, 'mp3');
const port = Number(process.env.PORT || 3000);
const password = process.env.APP_PASSWORD || 'change-me-now';
const sessions = new Map();
const loginAttempts = new Map();
const SESSION_MS = 1000 * 60 * 60 * 12;

function send(res, status, body, type = 'text/plain; charset=utf-8') {
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store' });
  res.end(body);
}

function cookieSession(req) {
  return true;
}

function safeMusicName(name) {
  return path.basename(name).toLowerCase().endsWith('.mp3') && !name.includes('..') && !name.includes('/') && !name.includes('\\');
}

function listTracks() {
  fs.mkdirSync(musicDir, { recursive: true });
  return fs.readdirSync(musicDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && safeMusicName(entry.name))
    .map((entry) => ({ name: entry.name, url: `/api/track/${encodeURIComponent(entry.name)}` }))
    .sort((a, b) => a.name.localeCompare(b.name, 'de'));
}

function serveStatic(req, res) {
  const requested = req.url === '/' ? '/index.html' : req.url;
  const file = path.normalize(path.join(publicDir, requested));
  if (!file.startsWith(publicDir)) return send(res, 403, 'Forbidden');
  fs.readFile(file, (error, data) => {
    if (error) return send(res, 404, 'Not found');
    const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8' };
    send(res, 200, data, types[path.extname(file)] || 'application/octet-stream');
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  if (req.method === 'POST' && url.pathname === '/api/login') {
    const address = req.socket.remoteAddress || 'unknown';
    const attempt = loginAttempts.get(address) || { failures: 0, blockedUntil: 0 };
    if (attempt.blockedUntil > Date.now()) return send(res, 429, JSON.stringify({ error: 'Zu viele Versuche. Bitte kurz warten.' }), 'application/json');
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      try {
        const supplied = JSON.parse(body).password || '';
        const suppliedHash = crypto.createHash('sha256').update(supplied).digest();
        const passwordHash = crypto.createHash('sha256').update(password).digest();
        const matching = crypto.timingSafeEqual(suppliedHash, passwordHash);
        if (!matching) {
          attempt.failures += 1;
          if (attempt.failures >= 5) { attempt.blockedUntil = Date.now() + 60_000; attempt.failures = 0; }
          loginAttempts.set(address, attempt);
          return send(res, 401, JSON.stringify({ error: 'Passwort falsch' }), 'application/json');
        }
        const token = crypto.randomBytes(32).toString('hex');
        sessions.set(token, Date.now() + SESSION_MS);
        loginAttempts.delete(address);
        res.writeHead(200, { 'Content-Type': 'application/json', 'Set-Cookie': `session=${token}; HttpOnly; SameSite=Strict; Path=/`, 'Cache-Control': 'no-store' });
        return res.end(JSON.stringify({ ok: true }));
      } catch { return send(res, 400, JSON.stringify({ error: 'Ungültige Anfrage' }), 'application/json'); }
    });
    return;
  }

  if (req.method === 'POST' && url.pathname === '/api/logout') {
    const cookie = req.headers.cookie || '';
    const token = cookie.split(';').map((part) => part.trim()).find((part) => part.startsWith('session='));
    if (token) sessions.delete(token.slice('session='.length));
    res.writeHead(204, { 'Set-Cookie': 'session=; Max-Age=0; HttpOnly; SameSite=Strict; Path=/' });
    return res.end();
  }

  if (url.pathname.startsWith('/api/')) {
    if (!cookieSession(req)) return send(res, 401, JSON.stringify({ error: 'Anmeldung erforderlich' }), 'application/json');
    if (req.method === 'GET' && url.pathname === '/api/tracks') return send(res, 200, JSON.stringify(listTracks()), 'application/json');
    if (req.method === 'GET' && url.pathname.startsWith('/api/track/')) {
      const name = decodeURIComponent(url.pathname.slice('/api/track/'.length));
      if (!safeMusicName(name)) return send(res, 400, 'Invalid track');
      const file = path.join(musicDir, name);
      if (!fs.existsSync(file)) return send(res, 404, 'Track not found');
      const size = fs.statSync(file).size;
      const range = req.headers.range;
      if (!range) {
        res.writeHead(200, { 'Content-Type': 'audio/mpeg', 'Content-Length': size, 'Accept-Ranges': 'bytes', 'Cache-Control': 'private, max-age=3600' });
        return fs.createReadStream(file).pipe(res);
      }
      const match = range.match(/bytes=(\d*)-(\d*)/);
      if (!match) return send(res, 416, 'Invalid range');
      const start = match[1] ? Number(match[1]) : Math.max(0, size - Number(match[2] || 1));
      const end = match[2] ? Math.min(Number(match[2]), size - 1) : size - 1;
      if (start > end || start >= size) return send(res, 416, 'Range not satisfiable');
      res.writeHead(206, { 'Content-Type': 'audio/mpeg', 'Content-Length': end - start + 1, 'Content-Range': `bytes ${start}-${end}/${size}`, 'Accept-Ranges': 'bytes', 'Cache-Control': 'private, max-age=3600' });
      return fs.createReadStream(file, { start, end }).pipe(res);
    }
    return send(res, 404, 'Not found');
  }

  serveStatic(req, res);
});

server.listen(port, () => console.log(`Musikplayer läuft auf http://localhost:${port}`));
