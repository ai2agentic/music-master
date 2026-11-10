const demoTracks = ['Aurora Morning.mp3', 'Evening Drive.mp3', 'Weekend Session.mp3'];
const list = document.querySelector('#tracks');
const search = document.querySelector('#search');
const now = document.querySelector('#now');
function render() { const q = search.value.toLowerCase(); list.innerHTML = demoTracks.filter((name) => name.toLowerCase().includes(q)).map((name) => `<li><button data-name="${name}">▶ ${name}</button></li>`).join(''); list.querySelectorAll('button').forEach((button) => button.addEventListener('click', () => { now.textContent = button.dataset.name; })); }
document.querySelector('#demo').addEventListener('click', () => { now.textContent = 'Aurora Morning.mp3'; });
search.addEventListener('input', render); render();
