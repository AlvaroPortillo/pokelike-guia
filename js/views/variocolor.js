import { esc, fmt } from '../util.js';
import { pageHead } from './common.js';

const pct = (p) => {
  const v = p * 100;
  return `${v < 1 ? v.toFixed(2) : v < 10 ? v.toFixed(1) : v.toFixed(0)} %`.replace('.', ',');
};
const atLeastOne = (p, n) => 1 - (1 - p) ** n;
const nFor = (p, target) => Math.ceil(Math.log(1 - target) / Math.log(1 - p));

export default {
  render(d) {
    const s = d.shiny;
    const auroraBase = s.base * s.auroraShare;
    const auroraBest = s.iris * s.auroraShareCharm;
    const rows = [10, 25, 50, 100, 200, 500].map((n) => `<tr><td class="num">${n}</td><td class="num">${pct(atLeastOne(s.base, n))}</td><td class="num">${pct(atLeastOne(s.iris, n))}</td></tr>`).join('');
    return `
${pageHead('Variocolor y Aurora', 'Los variocolor (los «shiny» de siempre) son Pokémon de otro color. En Pokelike, además de quedar bonitos, <strong>refuerzan los rasgos de tipo</strong>. Los <strong>Aurora</strong> son un variocolor todavía más raro, añadido en las últimas versiones.')}

<div class="cols">
<div>
  <h2>Qué probabilidad hay</h2>
  <p>Leído en el código del juego: cada Pokémon que te aparece tiene un <strong>${pct(s.base)}</strong> de ser variocolor (1 de cada 100).</p>
  <ul>
    <li><strong>${esc(s.irisUi.name)}</strong>: «${esc(s.ui.shinyCharmEffect)}» Pasa al <strong>${pct(s.iris)}</strong> (1 de cada 50). Se consigue completando la Pokédex de la Gen 1.</li>
    <li>Algunos efectos dentro de la partida vuelven a duplicar la probabilidad.</li>
  </ul>

  <h3>¿Cuántos Pokémon hay que ver para que salga uno?</h3>
  <p>La tabla responde a esta pregunta: <em>si veo tantos Pokémon, ¿qué probabilidad hay de que <strong>al menos uno</strong> sea variocolor?</em> La primera columna es sin el ${esc(s.irisUi.name)} y la segunda, con él.</p>
  <div class="table-wrap" style="max-width:600px"><table>
    <thead><tr><th class="num">Pokémon vistos</th><th class="num">Sin ${esc(s.irisUi.name)} (1 %)</th><th class="num">Con ${esc(s.irisUi.name)} (2 %)</th></tr></thead>
    <tbody>${rows}</tbody>
  </table></div>
  <p style="margin-top:.75rem">Ejemplo: después de ver 100 Pokémon, sin amuleto tienes un ${pct(atLeastOne(s.base, 100))} de haber visto al menos un variocolor; con amuleto, un ${pct(atLeastOne(s.iris, 100))}. Para tener un 50 % hacen falta ${fmt(nFor(s.base, 0.5))} Pokémon sin amuleto y ${fmt(nFor(s.iris, 0.5))} con él.</p>
  <p class="muted">Cada Pokémon es una tirada independiente: llevar muchos sin variocolor no hace que el siguiente sea más probable.</p>

  <h2>Pokémon Aurora</h2>
  <p>En palabras del juego: «${esc(s.ui.tip)}».</p>
  <ul>
    <li><strong>Cuánto salen:</strong> 1 de cada 10 variocolor es Aurora. Con el <strong>${esc(s.ui.charm)}</strong> («${esc(s.ui.auroraCharmHow)}»), 1 de cada 5.</li>
    <li><strong>En total:</strong> un ${pct(auroraBase)} por Pokémon visto (1 de cada ${fmt(Math.round(1 / auroraBase))}); con los dos amuletos, un ${pct(auroraBest)} (1 de cada ${fmt(Math.round(1 / auroraBest))}).</li>
    <li><strong>Dónde:</strong> según el código, los variocolor de la Historia salen siempre normales. Los Aurora salen en la <strong>Torre Batalla</strong> y en los modos de partida continua.</li>
    <li><strong>Para qué sirven:</strong> cuentan 3 veces para los rasgos (un variocolor normal cuenta 2 y un Pokémon normal, 1). ${esc(s.patch.starterBody)} ${esc(s.patch.dexBody)}</li>
  </ul>
</div>
<aside class="panel">
  <h3>Cuánto suma cada uno a los rasgos</h3>
  <div class="table-wrap"><table>
    <thead><tr><th>Pokémon</th><th class="num">Puntos por tipo</th></tr></thead>
    <tbody>
      <tr><td>Normal</td><td class="num">1</td></tr>
      <tr><td>Variocolor</td><td class="num">2</td></tr>
      <tr><td>Aurora</td><td class="num">3</td></tr>
    </tbody>
  </table></div>
  <p class="muted" style="margin-top:.6rem">Cada 2 puntos de un tipo suben un rango su rasgo. Ver <a href="#/rasgos">Rasgos</a>.</p>
  <h3>Amuletos</h3>
  <ul>
    <li><strong>${esc(s.irisUi.name)}</strong>: Pokédex de la Gen 1 completa.</li>
    <li><strong>${esc(s.ui.charm)}</strong>: Pokédex entera completa.</li>
  </ul>
</aside>
</div>`;
  },
};
