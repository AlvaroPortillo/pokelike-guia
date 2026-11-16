import { esc, pd } from '../util.js';
import { pageHead } from './common.js';

// Discord oficial, canal #usercreated-guides (leído el 13-11-2026).
const DC_GUIDES = 'https://discord.com/channels/1493295201597264044/1544947178479423498';

function itemRows(items) {
  return items.map((i) => `<tr>
    <td><strong>${esc(i.name)}</strong></td>
    <td>${esc(i.desc)}</td>
    <td class="num">${i.minMap > 1 ? `Desde el mapa ${i.minMap}` : '<small class="muted">Desde el principio</small>'}</td>
  </tr>`).join('');
}

export default {
  render(d) {
    const it = d.items;
    const c = d.constants;
    if (!it) return `${pageHead('Objetos')}<div class="note note--warn"><p>Faltan los datos de objetos en esta versión de la guía.</p></div>`;
    const m = it.mart;
    const tm = it.usable.find((u) => u.id === 'tm_normal');
    const usable = it.usable.filter((u) => u.id !== 'tm_normal');

    return `
${pageHead('Objetos', `Los ${it.groups.reduce((n, g) => n + g.items.length, 0)} objetos que puede llevar equipados un Pokémon, los de usar y la Tienda Poké, con el texto tal cual sale en el juego en español (${esc(it.version)}).`)}

<div class="cols">
<div>
  <h2 id="como">Cómo funcionan</h2>
  <ul>
    <li>Los consigues en las casillas de <strong>objeto</strong> del mapa y en los eventos. La casilla de la <strong>Tienda Poké</strong> del mapa no te los da: te los compra a cambio de Caramelos Raros (en el juego sale como «${esc(it.martNode)}»).</li>
    <li>Cada Pokémon lleva <strong>un objeto equipado</strong>. Bolsa de hasta ${c.maxBag}. Aparte van las <a href="#/reliquias">Reliquias</a> (antes «pasivas»), hasta ${c.maxPassives} a la vez.</li>
    <li>La <strong>Mega Stone también ocupa el hueco del objeto</strong>: un Pokémon megaevolucionado no puede llevar además otro objeto (ver <a href="#/megas">Megas</a>).</li>
    <li>Algunos solo salen a partir de cierto mapa: lo tienes en la última columna.</li>
  </ul>

  <div class="note">
    <p><strong>Los que más recomienda la comunidad</strong></p>
    <ul>
      <li><strong>Huevo Suerte</strong> en cuanto salga, en el Pokémon que más pelee: es lo que más niveles da en la primera partida (<a href="https://pokelike-guide.fr/es/basics/getting-started/" rel="noopener">pokelike-guide.fr</a>).</li>
      <li><strong>Pocos objetos y nada que dependa de la suerte</strong> (Roca del Rey, Periscopio…): con una <strong>Lupa</strong> basta («How to get levels», de blooddealer, <a href="${DC_GUIDES}" rel="noopener">Discord oficial</a>).</li>
      <li>Para el final de la Torre ORAS: <strong>Arena Fina o Metrónomo</strong> y <strong>Pañuelo Elección</strong> para ser más rápido que el jefe final (Jump, <a href="${DC_GUIDES}" rel="noopener">Discord oficial</a>).</li>
    </ul>
    <p><small class="muted">Los enlaces de Discord piden cuenta.</small></p>
  </div>

  ${it.groups.map((g) => `
  <h2 id="${esc(g.id)}">${esc(g.title)}</h2>
  ${g.id === 'tipo' ? '<p class="muted">Todos hacen lo mismo con su tipo: +40 % de daño, y el Pokémon intenta usar ataques de ese tipo si puede.</p>' : ''}
  <div class="table-wrap"><table>
    <thead><tr><th>Objeto</th><th>Qué hace</th><th class="num">Dónde sale</th></tr></thead>
    <tbody>${itemRows(g.items)}</tbody>
  </table></div>`).join('')}

  <h2 id="usar">Objetos de usar</h2>
  <p>Se gastan al usarlos sobre un Pokémon de tu equipo.</p>
  <div class="table-wrap"><table>
    <thead><tr><th>Objeto</th><th>Qué hace</th></tr></thead>
    <tbody>
      ${usable.map((u) => `<tr><td><strong>${esc(u.name)}</strong></td><td>${esc(u.desc)}</td></tr>`).join('')}
      ${tm ? `<tr><td><strong>${esc(tm.name)}</strong></td><td>${esc(it.tm.offerBoss)} ${esc(it.tm.offerTutor)}</td></tr>` : ''}
    </tbody>
  </table></div>
  <p class="muted">${esc(it.tm.offerStarter)}</p>

  <h2 id="tienda">Tienda Poké (menú del juego)</h2>
  <p>Desde el menú principal, con los Pokédólares que ganas con logros, desafíos y el Pokésort.</p>
  <div class="table-wrap"><table>
    <thead><tr><th>Qué</th><th>Precio</th><th>Detalles</th></tr></thead>
    <tbody>
      <tr><td><strong>${esc(m.shinyEgg)}</strong></td><td class="num">${pd(m.shinyEggCost)}</td><td>${esc(m.shinyEggDesc)} Si te sale uno que ya tienes, te devuelven ${pd(m.shinyEggRefund)}.</td></tr>
      <tr><td><strong>${esc(m.legendEgg)}</strong></td><td class="num">${pd(m.legendEggCost)}</td><td>${esc(m.legendEggDesc)} Cada eclosión que no sale variocolor suma +0,3 % a la siguiente. ${esc(m.dupShard)}. No salen Celebi, Jirachi, Shaymin, Victini ni Hoopa.</td></tr>
      <tr><td><strong>${esc(m.voucher)}</strong></td><td class="num">10 Trozos Cometa</td><td>${esc(m.voucherDesc)}</td></tr>
      <tr><td><strong>Vitaminas</strong> (EV)</td><td class="num">${pd(m.vitaminCost)} por punto</td><td>${esc(m.vitaminsDesc)} Cada punto sube un <strong>5 %</strong> esa estadística (leído en el código del juego).</td></tr>
      <tr><td><strong>${esc(m.evReset)}</strong></td><td class="num">Gratis</td><td>${esc(m.evResetNote)}</td></tr>
    </tbody>
  </table></div>
  <h3>Vitaminas y límite de EV</h3>
  <ul>
    ${m.vitamins.map((v) => `<li><strong>${esc(v.name)}</strong>: ${esc(v.stat)}</li>`).join('')}
  </ul>
  <p>${esc(m.capLocked)}. El límite es de <strong>10 puntos de EV por cada fase de la Torre superada</strong>, hasta 50 por Pokémon (por línea evolutiva). Solo cuentan en la Torre Batalla y en el Desafío de Gimnasios.</p>

  <div class="note"><p><strong>Reliquias:</strong> los antiguos objetos pasivos del Desafío y de la Torre. Desde la v3.7 tienen su propia sección: <a href="#/reliquias">Reliquias</a>.</p></div>
</div>

<aside class="toc panel" aria-label="En esta página">
  <h3>En esta página</h3>
  <ol>
    <li><a href="#como" data-local>Cómo funcionan</a></li>
    ${it.groups.map((g) => `<li><a href="#${esc(g.id)}" data-local>${esc(g.title.replace(/ \(.*\)$/, ''))}</a></li>`).join('')}
    <li><a href="#usar" data-local>Objetos de usar</a></li>
    <li><a href="#tienda" data-local>Tienda Poké</a></li>
  </ol>
</aside>
</div>`;
  },
  mount(root) {
    // Los enlaces del índice no deben cambiar de sección.
    root.querySelectorAll('.toc a[href^="#"]:not([href^="#/"])').forEach((a) => {
      a.addEventListener('click', (ev) => {
        ev.preventDefault();
        document.getElementById(a.getAttribute('href').slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  },
};
