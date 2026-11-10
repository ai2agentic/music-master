const login = document.querySelector('#login');
const app = document.querySelector('#app');
const form = document.querySelector('#login-form');
const error = document.querySelector('#login-error');
const tracks = document.querySelector('#tracks');
const empty = document.querySelector('#empty');
const count = document.querySelector('#count');
const search = document.querySelector('#search');
const audio = document.querySelector('#audio');
const nowPlaying = document.querySelector('#now-playing');
const playlistTracks = document.querySelector('#playlist-tracks');
const playlistEmpty = document.querySelector('#playlist-empty');
const clearPlaylist = document.querySelector('#clear-playlist');
const logout = document.querySelector('#logout');
let library = [];
let playlist = JSON.parse(localStorage.getItem('aurora-playlist') || '[]');

loadTracks();

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  error.textContent = '';
  const response = await fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: document.querySelector('#password').value }) });
  if (!response.ok) { error.textContent = 'Das Passwort stimmt nicht.'; return; }
  login.hidden = true; app.hidden = false; await loadTracks();
});

async function loadTracks() {
  const response = await fetch('/api/tracks');
  library = response.ok ? await response.json() : [];
  render();
}

function render() {
  const query = search.value.trim().toLowerCase();
  const visible = library.filter((track) => track.name.toLowerCase().includes(query));
  count.textContent = `${library.length} ${library.length === 1 ? 'Titel' : 'Titel'}`;
  empty.hidden = library.length !== 0;
  tracks.innerHTML = visible.map((track) => `<li class="track"><button data-url="${track.url}" data-name="${escapeHtml(track.name)}">▶ ${escapeHtml(track.name)}</button></li>`).join('');
  tracks.innerHTML = visible.map((track) => `<li class="track"><button data-url="${track.url}" data-name="${escapeHtml(track.name)}">▶ ${escapeHtml(track.name)}</button><button class="add" data-add="${escapeHtml(track.name)}" title="Zur Playlist hinzufügen">+</button></li>`).join('');
  tracks.querySelectorAll('button:not(.add)').forEach((button) => button.addEventListener('click', () => play(button.dataset.url, button.dataset.name)));
  tracks.querySelectorAll('.add').forEach((button) => button.addEventListener('click', () => addToPlaylist(button.dataset.add)));
  renderPlaylist();
}

function escapeHtml(value) { return value.replace(/[&<>"']/g, (char) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;' }[char])); }
function play(url, name) { audio.src = url; nowPlaying.textContent = name; audio.play(); }
function addToPlaylist(name) { if (!playlist.includes(name)) { playlist.push(name); localStorage.setItem('aurora-playlist', JSON.stringify(playlist)); renderPlaylist(); } }
function renderPlaylist() { playlistEmpty.hidden = playlist.length > 0; playlistTracks.innerHTML = playlist.map((name) => { const track = library.find((item) => item.name === name); return track ? `<li class="track"><button data-url="${track.url}" data-name="${escapeHtml(track.name)}">▶ ${escapeHtml(track.name)}</button></li>` : ''; }).join(''); playlistTracks.querySelectorAll('button').forEach((button) => button.addEventListener('click', () => play(button.dataset.url, button.dataset.name))); }
clearPlaylist.addEventListener('click', () => { playlist = []; localStorage.setItem('aurora-playlist', '[]'); renderPlaylist(); });
logout.addEventListener('click', async () => { await fetch('/api/logout', { method: 'POST' }); app.hidden = true; login.hidden = false; document.querySelector('#password').value = ''; });
search.addEventListener('input', render);
