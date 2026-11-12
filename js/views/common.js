import { esc } from '../util.js';
import { doneSource } from '../store.js';

// Casilla marcable. Si viene del juego importado, aparece marcada y bloqueada con la etiqueta «del juego».
export function check(id, label = 'Hecho', labelHtml = null) {
  const src = doneSource(id);
  const fromGame = src === 'game';
  return `<label class="check"><input type="checkbox" data-check="${esc(id)}" ${src ? 'checked' : ''} ${fromGame ? 'disabled' : ''} aria-label="${esc(label)}">${labelHtml ?? esc(label)}${fromGame ? ' <span class="src" title="Marcado según el progreso importado del juego">del juego</span>' : ''}</label>`;
}

export const pageHead = (title, intro) => `<header class="page-head"><h1>${esc(title)}</h1>${intro ? `<p>${intro}</p>` : ''}</header>`;

export function seg(items, current, base) {
  return `<nav class="seg" aria-label="Apartados">${items.map((it) => `<a href="#/${base}/${encodeURIComponent(it.id)}" ${String(it.id) === String(current) ? 'aria-current="true"' : ''}>${it.done ? '<span class="dot" aria-hidden="true"></span>' : ''}${esc(it.label)}</a>`).join('')}</nav>`;
}
