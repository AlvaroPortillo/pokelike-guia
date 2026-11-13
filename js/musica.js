// Música de los Pokémon clásicos (Rojo/Azul) desde YouTube, en una Game Boy pequeña en la esquina.
// No se conecta a YouTube hasta que el usuario pulsa «Música» (y usa youtube-nocookie.com).
// YouTube exige que el reproductor se vea y mida al menos 200×200 px: va en la pantalla de la Game Boy.
// Cerrar la Game Boy pausa la música.

const TRACKS = [
  { title: 'Pueblo Lavanda', id: 'JNJJ-QkZ8cM' },
  { title: 'Torre Pokémon', id: 'u8NktOkmRvM' },
  { title: 'Combate contra entrenador', id: 'Fupfr_eVLPo' },
  { title: 'Combate contra Pokémon salvaje', id: 'NrS523dOHU4' },
  { title: 'Combate contra Líder de Gimnasio', id: 'Vk9T241KnF0' },
  { title: 'Combate final contra el rival', id: 'MEhQgmkuMuw' },
  { title: 'Pueblo Paleta', id: 'cOWRNLaCMJg' },
  { title: 'Ruta 1', id: 'u0G12EBW4KY' },
];

const KEY = 'pokelike-guia:musica';
const ICONS = {
  prev: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 2h2v12H3zM14 2v12L6 8z" fill="currentColor"/></svg>',
  next: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M11 2h2v12h-2zM2 2v12l8-6z" fill="currentColor"/></svg>',
  play: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2v12l10-6z" fill="currentColor"/></svg>',
  pause: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 2h4v12H3zM9 2h4v12H9z" fill="currentColor"/></svg>',
  shuffle: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M1 4h3l6 8h3v-2l3 3-3 3v-2h-4L3 6H1zM10 4h3V2l3 3-3 3V6h-2l-2 2.6-1.2-1.6z" fill="currentColor"/></svg>',
  close: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 3h2v2h2v2h2V5h2V3h2v2h-2v2h-2v2h2v2h2v2h-2v-2H9V9H7v2H5v2H3v-2h2V9h2V7H5V5H3z" fill="currentColor"/></svg>',
};

let state = { i: 0, shuffle: false };
try { state = { ...state, ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch { /* sin almacenamiento */ }
if (!(state.i >= 0 && state.i < TRACKS.length)) state.i = 0;
const save = () => { try { localStorage.setItem(KEY, JSON.stringify({ i: state.i, shuffle: state.shuffle })); } catch { /* nada */ } };

const btn = document.querySelector('.music-btn');
let dock = null;
let player = null;
let playing = false;
let failures = 0;
let switchedAt = 0; // al cambiar de canción, YouTube avisa de que la anterior «terminó»: se ignora ese aviso

function build() {
  dock = document.createElement('section');
  dock.className = 'gb';
  dock.id = 'gb';
  dock.setAttribute('aria-label', 'Música de Pokémon Rojo y Azul');
  dock.innerHTML = `
    <div class="gb__bezel"><span class="gb__led" aria-hidden="true"></span><div class="gb__screen"><div id="gb-player"></div></div></div>
    <p class="gb__track" aria-live="polite"></p>
    <div class="gb__ctrls">
      <button type="button" class="gb__btn" data-act="prev" aria-label="Canción anterior">${ICONS.prev}</button>
      <button type="button" class="gb__btn gb__btn--big" data-act="play" aria-label="Reproducir">${ICONS.play}</button>
      <button type="button" class="gb__btn" data-act="next" aria-label="Canción siguiente">${ICONS.next}</button>
      <button type="button" class="gb__btn gb__btn--small" data-act="shuffle" aria-pressed="${state.shuffle}" aria-label="Orden aleatorio">${ICONS.shuffle}</button>
      <button type="button" class="gb__btn gb__btn--small" data-act="close" aria-label="Cerrar y parar la música">${ICONS.close}</button>
    </div>
    <p class="gb__brand" aria-hidden="true">GAME GENGAR</p>`;
  document.body.append(dock);
  dock.addEventListener('click', (ev) => {
    const act = ev.target.closest('[data-act]')?.dataset.act;
    if (act === 'prev') go(-1);
    else if (act === 'next') go(1);
    else if (act === 'play') toggle();
    else if (act === 'shuffle') { state.shuffle = !state.shuffle; ev.target.closest('button').setAttribute('aria-pressed', String(state.shuffle)); save(); }
    else if (act === 'close') close();
  });
  dock.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') close(); });
  paint();
  loadApi();
}

function paint() {
  if (!dock) return;
  dock.querySelector('.gb__track').textContent = `${state.i + 1}/${TRACKS.length} · ${TRACKS[state.i].title}`;
  const play = dock.querySelector('[data-act="play"]');
  play.innerHTML = playing ? ICONS.pause : ICONS.play;
  play.setAttribute('aria-label', playing ? 'Pausar' : 'Reproducir');
  dock.classList.toggle('is-playing', playing);
}

function loadApi() {
  if (window.YT?.Player) { makePlayer(); return; }
  window.onYouTubeIframeAPIReady = makePlayer;
  const s = document.createElement('script');
  s.src = 'https://www.youtube.com/iframe_api';
  s.onerror = () => { dock.querySelector('.gb__track').textContent = 'No se pudo conectar con YouTube. Revisa la conexión.'; };
  document.head.append(s);
}

function makePlayer() {
  player = new window.YT.Player('gb-player', {
    host: 'https://www.youtube-nocookie.com',
    width: 200, height: 200, videoId: TRACKS[state.i].id,
    playerVars: { playsinline: 1, rel: 0, modestbranding: 1 },
    events: {
      onReady: () => player.playVideo(),
      onStateChange: (e) => {
        if (e.data === 1) { playing = true; failures = 0; }
        if (e.data === 2) playing = false;
        if (e.data === 0) { playing = false; if (Date.now() - switchedAt > 2500) go(1); return; }
        paint();
      },
      // Vídeo borrado o que no deja reproducirse fuera de YouTube: pasa a la siguiente.
      onError: (e) => {
        if (![2, 5, 100, 101, 150].includes(e.data)) return;
        failures += 1;
        if (failures >= TRACKS.length) { dock.querySelector('.gb__track').textContent = 'Ninguna canción se puede reproducir ahora mismo.'; return; }
        go(1);
      },
    },
  });
}

function go(step) {
  if (state.shuffle && TRACKS.length > 1) {
    let n; do { n = Math.floor(Math.random() * TRACKS.length); } while (n === state.i);
    state.i = n;
  } else {
    state.i = (state.i + step + TRACKS.length) % TRACKS.length;
  }
  switchedAt = Date.now();
  save(); paint();
  player?.loadVideoById?.(TRACKS[state.i].id);
}

function toggle() {
  if (!player?.getPlayerState) return;
  if (playing) player.pauseVideo(); else player.playVideo();
}

function open() {
  if (!dock) build(); else { dock.hidden = false; player?.playVideo?.(); }
  setBtn(true);
  dock.querySelector('[data-act="play"]').focus();
}

function close() {
  player?.pauseVideo?.();
  dock.hidden = true;
  setBtn(false);
  btn.focus();
}

// Interruptor de la cabecera: música activada / desactivada.
const ICON_ON = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 6h3l4-3v10L5 10H2zM11 5h1v1h1v4h-1v1h-1v-1h1V6h-1z" fill="currentColor"/></svg>';
const ICON_OFF = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 6h3l4-3v10L5 10H2zM11 6h1v1h1V6h1v1h-1v2h1v1h-1V9h-1v1h-1V9h1V7h-1z" fill="currentColor"/></svg>';
function setBtn(on) {
  if (!btn) return;
  btn.setAttribute('aria-pressed', String(on));
  btn.innerHTML = `${on ? ICON_ON : ICON_OFF}<span class="music-btn__txt">Música</span>`;
}
setBtn(false);

btn?.addEventListener('click', () => { if (dock && !dock.hidden) close(); else open(); });

// En el móvil no hay música (versión simple): si la ventana se estrecha con la música puesta, se para.
window.matchMedia('(max-width: 860px)').addEventListener('change', (ev) => {
  if (ev.matches && dock && !dock.hidden) { player?.pauseVideo?.(); dock.hidden = true; setBtn(false); }
});
