const demoTracks = [
  { name: 'Aurora Morning · Demo', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { name: 'Evening Drive · Demo', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { name: 'Weekend Session · Demo', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' }
];
const list = document.querySelector('#tracks');
const search = document.querySelector('#search');
const now = document.querySelector('#now');
const audio = document.querySelector('#audio');
function render() { const q = search.value.toLowerCase(); list.innerHTML = demoTracks.filter((track) => track.name.toLowerCase().includes(q)).map((track) => `<li><button data-name="${track.name}" data-url="${track.url}">▶ ${track.name}</button></li>`).join(''); list.querySelectorAll('button').forEach((button) => button.addEventListener('click', () => { now.textContent = button.dataset.name; audio.src = button.dataset.url; audio.play(); })); }
document.querySelector('#demo').addEventListener('click', () => { const track = demoTracks[0]; now.textContent = track.name; audio.src = track.url; audio.play(); });
search.addEventListener('input', render); render();
