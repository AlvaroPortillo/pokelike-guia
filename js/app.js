// Arranque: carga datos, progreso y enruta por el hash (#/seccion/sub).
import { setTypeData, esc, toast } from './util.js';
import { loadProgress, setCheck, onChange } from './store.js';
import inicio from './views/inicio.js';
import historia from './views/historia.js';
import torre from './views/torre.js';
import desafios from './views/desafios.js';
import megas from './views/megas.js';
import pokesort from './views/pokesort.js';
import logros from './views/logros.js';
import progreso from './views/progreso.js';
import rasgos from './views/rasgos.js';
import variocolor from './views/variocolor.js';
import novedades from './views/novedades.js';
import objetos from './views/objetos.js';

const ROUTES = { '': inicio, historia, torre, rasgos, variocolor, desafios, megas, objetos, pokesort, logros, novedades, progreso };
const TITLES = { '': 'Inicio', historia: 'Historia', torre: 'Torre Batalla', rasgos: 'Rasgos de tipo', variocolor: 'Variocolor y Aurora', desafios: 'Desafíos', megas: 'Megaevoluciones', objetos: 'Objetos', pokesort: 'Pokésort', logros: 'Logros', novedades: 'Novedades', progreso: 'Mi progreso' };
const app = document.getElementById('app');
let data = null;

function showFatal(title, detail) {
  app.innerHTML = `<div class="note note--error"><p><strong>${esc(title)}</strong></p><p>${esc(detail)}</p></div>`;
}

async function loadData() {
  let res;
  try {
    res = await fetch('data/guia.json', { cache: 'no-cache' });
  } catch (e) {
    const local = location.protocol === 'file:';
    throw new Error(local
      ? 'El navegador no deja leer los datos al abrir la guía como archivo (file://). Ábrela desde su dirección de GitHub Pages o con un servidor local (por ejemplo, «python -m http.server» en la carpeta del proyecto).'
      : `No se pudo descargar data/guia.json (${e.message}). Comprueba tu conexión y recarga la página.`);
  }
  if (!res.ok) throw new Error(`El servidor respondió ${res.status} al pedir data/guia.json. Si acabas de publicar la guía, espera un minuto a que GitHub Pages termine y recarga.`);
  try { return await res.json(); } catch (e) {
    throw new Error(`data/guia.json está dañado y no se puede leer (${e.message}). Hay que volver a generarlo.`);
  }
}

function parseHash() {
  const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
  return { route: parts[0] || '', sub: parts[1] || null };
}

function render({ keepScroll = false } = {}) {
  const { route, sub } = parseHash();
  const view = ROUTES[route];
  document.querySelectorAll('.tabs a').forEach((a) => {
    if (a.dataset.route === route) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
  if (!view) {
    document.title = 'Sección no encontrada · Guía Pokelike';
    app.innerHTML = `<div class="note note--warn"><p><strong>Esta sección no existe.</strong> La dirección «${esc(location.hash)}» no corresponde a ninguna parte de la guía. Usa el menú de arriba o vuelve al <a href="#/">inicio</a>.</p></div>`;
    return;
  }
  const y = window.scrollY;
  try {
    app.innerHTML = view.render(data, sub);
    view.mount?.(app, data, sub);
  } catch (e) {
    console.error(e);
    showFatal(`No se pudo mostrar la sección «${TITLES[route]}».`, `Error interno: ${e.message}. Recarga la página; si se repite, exporta tu progreso desde «Mi progreso» y avisa del error con este texto.`);
  }
  document.title = `${TITLES[route]} · Guía Pokelike`;
  if (keepScroll) window.scrollTo(0, y);
  else { window.scrollTo(0, 0); app.focus({ preventScroll: true }); }
}

// Casillas: cualquier <input data-check="id"> guarda su estado.
app.addEventListener('change', (ev) => {
  const el = ev.target;
  if (!(el instanceof HTMLInputElement) || !el.dataset.check) return;
  try { setCheck(el.dataset.check, el.checked); } catch (e) {
    el.checked = !el.checked;
    toast(e.message, { error: true });
  }
});

async function start() {
  const warn = loadProgress();
  try {
    data = await loadData();
  } catch (e) {
    showFatal('No se pudo cargar la guía.', e.message);
    return;
  }
  setTypeData(data.types, data.typeChart);
  onChange(() => {
    const id = document.activeElement?.dataset?.check;
    render({ keepScroll: true });
    if (id) app.querySelector(`[data-check="${CSS.escape(id)}"]`)?.focus({ preventScroll: true });
  });
  window.addEventListener('hashchange', () => render());
  render();
  if (warn) toast(warn, { error: true });
}

start();
