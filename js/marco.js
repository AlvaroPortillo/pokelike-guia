// Marco de la página: selector de tema (claro/oscuro) y menú desplegable del móvil.
// No toca el router ni el progreso: solo la cabecera.

const THEME_KEY = 'pokelike-guia:tema';
const root = document.documentElement;
const themeBtn = document.querySelector('.theme-btn');
const themeMeta = document.querySelector('meta[name="theme-color"]');

function paintTheme() {
  const light = root.dataset.theme === 'claro';
  // El botón dice lo que va a hacer: en claro ofrece el oscuro y al revés.
  const txt = themeBtn?.querySelector('.theme-btn__txt');
  if (txt) txt.textContent = light ? 'Tema oscuro' : 'Tema claro';
  themeMeta?.setAttribute('content', light ? '#e3eec0' : '#110c1b');
}

themeBtn?.addEventListener('click', () => {
  const light = root.dataset.theme !== 'claro';
  if (light) root.dataset.theme = 'claro'; else delete root.dataset.theme;
  try { localStorage.setItem(THEME_KEY, light ? 'claro' : 'oscuro'); } catch { /* sin almacenamiento: el cambio dura hasta recargar */ }
  paintTheme();
});
paintTheme();

// Menú del móvil: se abre como el menú de pausa de los juegos clásicos.
const menuBtn = document.querySelector('.menu-btn');
const menu = document.getElementById('menu');

function setMenu(open, { focusBtn = false } = {}) {
  if (!menuBtn || !menu) return;
  menu.classList.toggle('is-open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.textContent = open ? 'Cerrar' : 'Menú';
  if (open) (menu.querySelector('[aria-current="page"]') || menu.querySelector('a'))?.focus();
  else if (focusBtn) menuBtn.focus();
}

menuBtn?.addEventListener('click', () => setMenu(!menu.classList.contains('is-open')));
document.addEventListener('keydown', (ev) => {
  if (ev.key === 'Escape' && menu?.classList.contains('is-open')) setMenu(false, { focusBtn: true });
});
document.addEventListener('click', (ev) => {
  if (!menu?.classList.contains('is-open')) return;
  if (!menu.contains(ev.target) && !menuBtn.contains(ev.target)) setMenu(false);
});
window.addEventListener('hashchange', () => setMenu(false));
