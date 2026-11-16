import { esc, typeChip, typeChips, typeEs } from '../util.js';
import { pageHead } from './common.js';

let query = '';

// El juego marca en negrita con **texto** en la línea corta de cada reliquia.
const short = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
const fill = (s, vars) => String(s).replace(/\{(\w+)\}/g, (m, k) => (vars[k] != null ? vars[k] : m));

// Cada reliquia va en un único apartado, en este orden de prioridad.
const section = (r) => (r.charm ? 'amuleto' : r.oneShot ? 'uso' : r.capstone ? 'z' : r.starter ? 'inicial' : `kit:${r.kit}`);

function row(r, { withTypes = true } = {}) {
  const text = `${r.name} ${r.short} ${r.desc} ${(r.synergy || []).map(typeEs).join(' ')}`.toLowerCase();
  return `<tr data-relic data-text="${esc(text)}">
    <td><strong>${esc(r.name)}</strong>${withTypes && r.synergy?.length ? `<br>${typeChips(r.synergy)}` : ''}</td>
    <td>${short(r.short)}<details><summary><small>Texto completo</small></summary><p style="margin:.4rem 0 0">${esc(r.desc)}</p></details></td>
  </tr>`;
}
const table = (rows, first = 'Reliquia') => `<div class="table-wrap"><table>
  <thead><tr><th>${first}</th><th>Qué hace (texto del juego)</th></tr></thead>
  <tbody>${rows}</tbody>
</table></div>`;

export default {
  render(d) {
    const R = d.relics;
    if (!R) return `${pageHead('Reliquias')}<div class="note note--warn"><p>Faltan los datos de reliquias en esta versión de la guía. Hay que volver a generarlos con tools/add-37.js.</p></div>`;
    const by = (s) => R.list.filter((r) => section(r) === s);
    const types = d.types.map((t) => t.id);

    const starters = types.map((t) => {
      const list = by('inicial').filter((r) => r.starterType === t);
      if (!list.length) return '';
      const all = `${typeEs(t)} ${list.map((r) => `${r.name} ${r.short} ${r.desc}`).join(' ')}`.toLowerCase();
      return `<tr data-relic data-text="${esc(all)}"><td colspan="2" style="padding-top:1rem">${typeChip(t)}</td></tr>${list.map((r) => row(r, { withTypes: false })).join('')}`;
    }).join('');

    const zs = types.map((t) => by('z').find((r) => r.capstone === t)).filter(Boolean)
      .map((r) => row({ ...r, synergy: [r.capstone] })).join('');

    const kits = R.kits.map((k) => {
      const list = by(`kit:${k.id}`);
      if (!list.length) return '';
      return `<section data-group>
        <h3 id="kit-${esc(k.id)}">${esc(k.name)} ${k.types.length ? typeChips(k.types) : ''} <small class="muted">· ${list.length}</small></h3>
        ${table(list.map((r) => row(r)).join(''))}
      </section>`;
    }).join('');

    return `
${pageHead('Reliquias', `Desde la v3.7 los objetos pasivos se llaman <strong>Reliquias</strong>. Hay ${R.total} en juego (otras ${R.retired} se retiraron: las partidas que ya tenían una la conservan). Aquí están todas con el texto tal cual sale en el juego en español (v${esc(d.version)}).`)}

<div class="cols">
<div>
  <h2 id="como">Cómo funcionan</h2>
  <p>Lo que dicen las notas de la versión 3.7 y 3.7.1:</p>
  <ul>
    <li>Salen en el <strong><a href="#/desafios">Desafío de Gimnasios</a></strong> y en el modo <strong>Normal</strong> de la <a href="#/torre">Torre Batalla</a> («una inicial y otra tras cada combate contra entrenadores»). El modo Hardcore de la Torre es la torre de siempre, sin reliquias.</li>
    <li>«Antes del primer mapa eliges <strong>1 de 3 Reliquias iniciales</strong> pensadas para el tipo de tu inicial.»</li>
    <li>«La primera carta de cada pantalla de Reliquias <strong>se basa en lo que ya tienes</strong>. Las otras dos son al azar.»</li>
    <li>Puedes llevar hasta <strong>${R.maxSlots}</strong> a la vez; si ya tienes el máximo, la nueva sustituye a una (el juego pone «SUSTITUIR») o te la saltas. Los <strong>amuletos</strong> no ocupan hueco.</li>
    <li>Las cartas muestran los <strong>iconos de los rasgos</strong> con los que funcionan (aquí, los tipos debajo del nombre), y una etiqueta SHINY o LEGENDARIO cuando lo necesitan. Por eso conviene juntar reliquias del tipo que más llevas: ver <a href="#/rasgos">Rasgos</a>.</li>
  </ul>

  <div class="toolbar" style="margin-top:1.5rem">
    <input class="input" type="search" id="rel-q" placeholder="Buscar reliquia (p. ej. veneno, crítico, Baya)…" value="${esc(query)}" aria-label="Buscar reliquia" style="flex:1 1 260px">
  </div>
  <p class="muted" id="rel-empty" hidden>Ninguna reliquia coincide con la búsqueda. Prueba con otra palabra.</p>

  <section data-group>
    <h2 id="iniciales">Reliquias iniciales por tipo</h2>
    <p>Las ${by('inicial').length} que solo se ofrecen al empezar: el juego te enseña 3 según el tipo de tu inicial.</p>
    ${table(starters)}
  </section>

  <section data-group>
    <h2 id="cristales-z">Cristales Z</h2>
    <p>«Ten <strong>3 Reliquias de un tipo con su rasgo activo</strong> y aparecerá el Cristal Z de ese tipo. Hay uno para cada tipo.» Por ejemplo, para Fuego el juego dice: «${esc(fill(R.ui.capstoneReq, { n: 3, type: typeEs('Fire') }))}».</p>
    ${table(zs, 'Cristal Z')}
  </section>

  <section data-group>
    <h2 id="amuletos">Amuletos y de un solo uso</h2>
    <p>Los amuletos no ocupan hueco de reliquia. «Una vez desbloqueado, el <strong>Cazador Shiny</strong> se suma a cada partida con Reliquias como segunda Reliquia inicial» (se desbloquea con el logro «Maestro de la Pokédex»). La <strong>Bola Férrea</strong> es la maldición de la <a href="#/desafios">Medalla Alma</a>.</p>
    ${table([...by('amuleto'), ...by('uso')].map((r) => row(r)).join(''))}
  </section>

  <h2 id="grupos">El resto, por grupo</h2>
  <p>Cada reliquia lleva la etiqueta de un grupo del juego; los tipos de al lado son los rasgos con los que va cada grupo. COLECCIONISTA son las raras; GENERALISTA, las que sirven a cualquier equipo.</p>
  ${kits}
</div>

<aside class="toc panel" aria-label="En esta página">
  <h3>En esta página</h3>
  <ol>
    <li><a href="#como" data-local>Cómo funcionan</a></li>
    <li><a href="#iniciales" data-local>Iniciales por tipo</a></li>
    <li><a href="#cristales-z" data-local>Cristales Z</a></li>
    <li><a href="#amuletos" data-local>Amuletos</a></li>
    <li><a href="#grupos" data-local>Por grupo</a></li>
  </ol>
</aside>
</div>`;
  },
  mount(root) {
    root.querySelectorAll('.toc a[href^="#"]:not([href^="#/"])').forEach((a) => {
      a.addEventListener('click', (ev) => {
        ev.preventDefault();
        document.getElementById(a.getAttribute('href').slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
    const q = root.querySelector('#rel-q');
    const apply = () => {
      query = q.value.trim().toLowerCase();
      let visible = 0;
      root.querySelectorAll('[data-group]').forEach((g) => {
        let any = false;
        g.querySelectorAll('[data-relic]').forEach((el) => {
          el.hidden = !!query && !el.dataset.text.includes(query);
          if (!el.hidden) { any = true; visible++; }
        });
        g.hidden = !any;
      });
      root.querySelector('#rel-empty').hidden = visible > 0;
    };
    q.addEventListener('input', apply);
    apply();
  },
};
