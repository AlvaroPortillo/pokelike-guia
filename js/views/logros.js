import { esc, pd } from '../util.js';
import { isDone } from '../store.js';
import { check, pageHead } from './common.js';

// Orden de las categorías tal como las agrupa el juego.
const ORDER = ['normal', 'gen1_nuz', 'gen1_chal', 'gen2_norm', 'gen2_nuz', 'gen2_chal', 'gen3_norm', 'gen3_nuz', 'gen3_chal',
  'gen4_norm', 'gen4_nuz', 'gen4_chal', 'gen5_norm', 'gen5_nuz', 'gen5_chal', 'gen6_norm', 'gen6_nuz', 'gen6_chal',
  'tower', 'challenge', 'story_chal', 'general'];

let query = '';
let show = 'todos';

export default {
  render(d) {
    const done = d.achievements.filter((a) => isDone(`ach:${a.id}`));
    const earned = done.reduce((s, a) => s + (a.reward || 0), 0);
    const total = d.achievements.reduce((s, a) => s + (a.reward || 0), 0);
    const cats = [...ORDER, ...new Set(d.achievements.map((a) => a.cat).filter((c) => !ORDER.includes(c)))];
    const groups = cats.map((cat) => {
      const list = d.achievements.filter((a) => a.cat === cat);
      if (!list.length) return '';
      const n = list.filter((a) => isDone(`ach:${a.id}`)).length;
      return `
      <section class="ach-group" data-group>
        <h3>${esc(d.achCats[cat] || cat)} <small class="muted">${n}/${list.length}${list[0].reward ? ` · ${pd(list[0].reward)} cada uno` : ''}</small></h3>
        ${list.map((a) => {
          const ok = isDone(`ach:${a.id}`);
          return `<div class="ach${ok ? ' is-done' : ''}" data-ach data-done="${ok}" data-text="${esc(`${a.name} ${a.desc}`.toLowerCase())}">
            ${check(`ach:${a.id}`, a.name, '')}
            <div><div class="ach__name">${esc(a.name)}</div><div class="ach__desc">${esc(a.desc)}</div></div>
            <div class="ach__rw">${a.reward ? pd(a.reward) : ''}</div>
          </div>`;
        }).join('')}
      </section>`;
    }).join('');

    return `
${pageHead('Logros', `Los ${d.achievements.length} logros del juego con su texto en español y lo que pagan. Puedes marcarlos a mano o importarlos del juego en <a href="#/progreso">Mi progreso</a> (los importados salen marcados con «del juego»).`)}
<div class="stats">
  <div class="stat"><div class="stat__label">Conseguidos</div><div class="stat__val">${done.length} / ${d.achievements.length}</div></div>
  <div class="stat"><div class="stat__label">Dinero ganado con logros</div><div class="stat__val">${pd(earned)}</div></div>
  <div class="stat"><div class="stat__label">Dinero que queda por ganar</div><div class="stat__val">${pd(total - earned)}</div></div>
</div>
<div class="toolbar">
  <input class="input" type="search" id="ach-q" placeholder="Buscar logro (p. ej. Nuzlocke, variocolor, Kanto)…" value="${esc(query)}" aria-label="Buscar logro" style="flex:1 1 260px">
  <select class="input" id="ach-show" aria-label="Mostrar">
    <option value="todos" ${show === 'todos' ? 'selected' : ''}>Todos</option>
    <option value="pendientes" ${show === 'pendientes' ? 'selected' : ''}>Solo pendientes</option>
    <option value="hechos" ${show === 'hechos' ? 'selected' : ''}>Solo conseguidos</option>
  </select>
</div>
<p class="muted" id="ach-empty" hidden>Ningún logro coincide con la búsqueda. Prueba con otra palabra o elige «Todos».</p>
${groups}`;
  },
  mount(root) {
    const q = root.querySelector('#ach-q');
    const sel = root.querySelector('#ach-show');
    const apply = () => {
      query = q.value.trim().toLowerCase();
      show = sel.value;
      let visible = 0;
      root.querySelectorAll('[data-group]').forEach((g) => {
        let any = false;
        g.querySelectorAll('[data-ach]').forEach((el) => {
          const okText = !query || el.dataset.text.includes(query);
          const okShow = show === 'todos' || (show === 'hechos') === (el.dataset.done === 'true');
          el.hidden = !(okText && okShow);
          if (!el.hidden) { any = true; visible++; }
        });
        g.hidden = !any;
      });
      root.querySelector('#ach-empty').hidden = visible > 0;
    };
    q.addEventListener('input', apply);
    sel.addEventListener('change', apply);
    apply();
  },
};
