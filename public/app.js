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
const albums = [
  { name: 'Exodus', year: 1977, tracks: ['Natural Mystic', 'So Much Things to Say', 'Guiltiness', 'The Heathen', 'Exodus', 'Jamming', 'Waiting in Vain', 'Turn Your Lights Down Low', 'Three Little Birds', 'One Love / People Get Ready'] },
  { name: 'Legend', year: 1984, tracks: ['Is This Love', 'No Woman, No Cry', 'Could You Be Loved', 'Three Little Birds', 'Buffalo Soldier', 'Get Up, Stand Up', 'Stir It Up', 'One Love / People Get Ready', 'I Shot the Sheriff', 'Redemption Song'] }
];

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
function renderPlaylist() { playlistEmpty.hidden = playlist.length > 0; playlistTracks.innerHTML = playlist.map((name) => { const track = library.find((item) => item.name === name); if (track) return `<li class="track"><button data-url="${track.url}" data-name="${escapeHtml(track.name)}">▶ ${escapeHtml(track.name)}</button></li>`; const query = encodeURIComponent(name.replace(' (YouTube)', '')); return `<li class="track"><a class="youtube" href="https://www.youtube.com/results?search_query=${query}" target="_blank" rel="noopener">▶ ${escapeHtml(name)}</a></li>`; }).join(''); playlistTracks.querySelectorAll('button').forEach((button) => button.addEventListener('click', () => play(button.dataset.url, button.dataset.name))); }
function renderAlbums() { document.querySelector('#albums').innerHTML = albums.map((album) => `<article class="album"><div class="section-head"><div><h2>${album.name}</h2><p class="muted">Bob Marley &amp; The Wailers · ${album.year}</p></div><a class="youtube" href="https://www.youtube.com/results?search_query=${encodeURIComponent(`Bob Marley ${album.name} official album`)}" target="_blank" rel="noopener">Auf YouTube öffnen</a></div><ul class="album-tracks">${album.tracks.map((track) => `<li><span>${track}</span><div><button class="small" data-add-online="${escapeHtml(track)}">+ Playlist</button><a class="small link" href="https://www.youtube.com/results?search_query=${encodeURIComponent(`Bob Marley ${track} official`)}" target="_blank" rel="noopener">Anhören</a></div></li>`).join('')}</ul></article>`).join(''); document.querySelectorAll('[data-add-online]').forEach((button) => button.addEventListener('click', () => addToPlaylist(`Bob Marley · ${button.dataset.addOnline} (YouTube)`))); }
clearPlaylist.addEventListener('click', () => { playlist = []; localStorage.setItem('aurora-playlist', '[]'); renderPlaylist(); });
logout.addEventListener('click', async () => { await fetch('/api/logout', { method: 'POST' }); app.hidden = true; login.hidden = false; document.querySelector('#password').value = ''; });
search.addEventListener('input', render);
renderAlbums();
