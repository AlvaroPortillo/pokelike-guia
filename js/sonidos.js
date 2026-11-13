// Efectos de sonido al estilo de la Game Boy: pitidos de onda cuadrada sintetizados en el navegador
// (sonido propio con el timbre de la época; no son grabaciones de los juegos).
// Se activan o desactivan con el botón «Efectos»; la preferencia se guarda en este navegador.

const KEY = 'pokelike-guia:efectos';
const btn = document.querySelector('.sfx-btn');
let on = true;
try { on = localStorage.getItem(KEY) !== 'no'; } catch { /* sin almacenamiento */ }
let ctx = null;

// Cada sonido: lista de [frecuencia en Hz, duración en ms].
const SFX = {
  select: [[1047, 35], [1568, 45]],
  page: [[784, 30], [1047, 30], [1319, 40]],
  menuOpen: [[880, 30], [1175, 45]],
  menuClose: [[1175, 30], [880, 45]],
  check: [[523, 45], [659, 45], [784, 45], [1047, 90]],
  uncheck: [[784, 40], [523, 70]],
  toggle: [[659, 35], [988, 55]],
  error: [[196, 90], [147, 140]],
};

export function play(name) {
  // En el móvil no suenan: allí la guía es la versión simple.
  if (!on || !SFX[name] || window.matchMedia('(max-width: 860px)').matches) return;
  try {
    ctx ??= new AudioContext();
    if (ctx.state === 'suspended') ctx.resume();
    let t = ctx.currentTime + 0.005;
    for (const [freq, ms] of SFX[name]) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.045, t);
      gain.gain.setValueAtTime(0, t + ms / 1000);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + ms / 1000 + 0.01);
      t += ms / 1000;
    }
  } catch { /* sin audio: la guía funciona igual */ }
}

const ICON_ON = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M1 6h2v4H1zM4 5h2v6H4zM7 3h2v10H7zM10 5h2v6h-2zM13 7h2v2h-2z" fill="currentColor"/></svg>';
const ICON_OFF = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M1 7h14v2H1z" fill="currentColor"/></svg>';
function paint() {
  if (!btn) return;
  btn.setAttribute('aria-pressed', String(on));
  btn.innerHTML = `${on ? ICON_ON : ICON_OFF}<span class="sfx-btn__txt">Efectos</span>`;
}
paint();

btn?.addEventListener('click', () => {
  on = !on;
  try { localStorage.setItem(KEY, on ? 'si' : 'no'); } catch { /* nada */ }
  paint();
  play('toggle');
});

// Clics en cosas que se pueden pulsar (las casillas y los botones con sonido propio van aparte).
document.addEventListener('click', (ev) => {
  const el = ev.target.closest('a, button, summary');
  if (!el || el.matches('.sfx-btn, .menu-btn, .theme-btn')) return;
  // Los enlaces a otra sección suenan al cambiar de página, no al pulsar.
  if (el.matches('a[href^="#/"]')) return;
  play('select');
});
document.querySelector('.menu-btn')?.addEventListener('click', () => {
  play(document.getElementById('menu')?.classList.contains('is-open') ? 'menuOpen' : 'menuClose');
});
document.querySelector('.theme-btn')?.addEventListener('click', () => play('toggle'));
window.addEventListener('hashchange', () => play('page'));
document.addEventListener('change', (ev) => {
  const el = ev.target;
  if (el instanceof HTMLInputElement && el.type === 'checkbox') play(el.checked ? 'check' : 'uncheck');
});

// Avisos de error: sonido grave cuando aparece un aviso rojo.
const toastEl = document.querySelector('.toast');
if (toastEl) {
  new MutationObserver(() => {
    if (!toastEl.hidden && toastEl.classList.contains('toast--error')) play('error');
  }).observe(toastEl, { attributes: true, attributeFilter: ['hidden', 'class'] });
}
