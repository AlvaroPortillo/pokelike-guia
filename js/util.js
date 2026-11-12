// Utilidades compartidas: escape HTML, tipos, sprites y efectividad.

export const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Colores de tipo (paleta estándar de la serie) y color de texto legible encima.
const TYPE_COLORS = {
  Normal: '#A8A77A', Fire: '#EE8130', Water: '#6390F0', Electric: '#F7D02C', Grass: '#7AC74C', Ice: '#96D9D6',
  Fighting: '#C22E28', Poison: '#A33EA1', Ground: '#E2BF65', Flying: '#A98FF3', Psychic: '#F95587', Bug: '#A6B91A',
  Rock: '#B6A136', Ghost: '#735797', Dragon: '#6F35FC', Dark: '#705746', Steel: '#B7B7CE', Fairy: '#D685AD',
};
const DARK_TEXT = new Set(['Normal', 'Electric', 'Grass', 'Ice', 'Ground', 'Flying', 'Bug', 'Rock', 'Steel', 'Fairy', 'Fire']);

let TYPE_ES = {};
let CHART = {};
export function setTypeData(types, chart) {
  TYPE_ES = Object.fromEntries(types.map((t) => [t.id, t.es]));
  CHART = chart;
}
export const typeEs = (t) => TYPE_ES[t] || t;

export function typeChip(t) {
  if (!t) return '';
  return `<span class="type" style="--tc:${TYPE_COLORS[t] || '#666'};--tt:${DARK_TEXT.has(t) ? '#16130d' : '#fff'}">${esc(typeEs(t))}</span>`;
}
export const typeChips = (list) => `<span class="types">${(list || []).map(typeChip).join('')}</span>`;

export function eff(atk, defTypes) {
  return (defTypes || []).reduce((m, d) => m * (CHART[atk]?.[d] ?? 1), 1);
}

// Sprites: repositorio público de PokeAPI (por número de la Pokédex nacional o id de forma).
export const spriteUrl = (id) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

export function mon(p, { level, size, types, extra } = {}) {
  if (!p) return '';
  const img = p.id ? `<img src="${spriteUrl(p.id)}" alt="" loading="lazy" width="40" height="40" onerror="this.style.visibility='hidden'">` : '';
  const lv = level != null ? `<span class="mon__lv">Nv. ${esc(level)}</span>` : '';
  const ty = types ? `<span class="types" style="margin-top:.2rem">${(p.types || []).map(typeChip).join('')}</span>` : '';
  const ex = extra ? `<span class="mon__lv">${extra}</span>` : '';
  return `<span class="mon${size === 'lg' ? ' mon--lg' : ''}">${img}<span class="mon__txt"><span class="mon__name">${esc(p.name)}</span>${lv}${ty}${ex}</span></span>`;
}

export const fmt = (n) => Number(n).toLocaleString('es-ES');
export const pd = (n) => `${fmt(n)} ₽`;

export function bar(pct) {
  const v = Math.max(0, Math.min(100, Math.round(pct)));
  return `<span class="bar"><span class="bar__track"><span class="bar__fill" style="width:${v}%"></span></span><span class="bar__val">${v} %</span></span>`;
}

let toastTimer;
export function toast(msg, { error = false, ms = 4500 } = {}) {
  const el = document.querySelector('.toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.toggle('toast--error', error);
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.hidden = true; }, error ? Math.max(ms, 9000) : ms);
}

export const icon = {
  download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v11m0 0-4-4m4 4 4-4M5 19h14"/></svg>',
  upload: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 15V4m0 0L8 8m4-4 4 4M5 19h14"/></svg>',
  copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6m4-6v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>',
  link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h6v6m0-6L10 14M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
};
