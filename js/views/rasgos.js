import { esc, typeChip } from '../util.js';
import { pageHead } from './common.js';

const SHOW = [1, 2, 3, 6, 12];

export default {
  render(d) {
    const types = d.types.map((t) => t.id).filter((t) => d.traits[t]);
    const rows = types.map((t) => `<tr><td>${typeChip(t)}</td>${SHOW.map((r) => `<td>${esc(d.traits[t][r - 1] || '')}</td>`).join('')}</tr>`).join('');
    return `
${pageHead('Rasgos de tipo', 'Cada tipo que tengas en el equipo activa un <strong>rasgo</strong> que mejora a todo el equipo en combate. Es la mecánica que más pesa al montar equipo, junto con la ventaja de tipos.')}

<div class="cols">
<div>
  <h2>Cómo se suben los rangos</h2>
  <p>Leído en el código del juego (v3.6.3):</p>
  <ul>
    <li>Cada Pokémon del equipo da <strong>1 punto a cada uno de sus tipos</strong>. Un Pokémon Planta/Veneno da 1 punto a Planta y 1 a Veneno.</li>
    <li>Un <strong>variocolor da 1 punto más</strong> (2 a cada tipo) y un <strong>Aurora, 2 más</strong> (3 a cada tipo). Ver <a href="#/variocolor">Variocolor y Aurora</a>.</li>
    <li><strong>Cada 2 puntos de un tipo = 1 rango</strong> de su rasgo. El máximo es el rango 12.</li>
  </ul>
  <div class="table-wrap" style="max-width:560px"><table>
    <thead><tr><th>Pokémon del mismo tipo en el equipo</th><th class="num">Puntos</th><th class="num">Rango</th></tr></thead>
    <tbody>
      <tr><td>1</td><td class="num">1</td><td class="num">0 (sin rasgo)</td></tr>
      <tr><td>2</td><td class="num">2</td><td class="num">1</td></tr>
      <tr><td>4</td><td class="num">4</td><td class="num">2</td></tr>
      <tr><td>6</td><td class="num">6</td><td class="num">3</td></tr>
      <tr><td>6, todos variocolor</td><td class="num">12</td><td class="num">6</td></tr>
    </tbody>
  </table></div>
  <p class="muted" style="margin-top:.6rem">Algunos objetos y efectos del juego suman rangos extra; por eso existen rangos por encima del 6.</p>

  <h2>Qué significa para tu equipo</h2>
  <ul>
    <li><strong>Un tipo suelto no da rasgo.</strong> Para activar uno necesitas al menos 2 Pokémon que lo compartan.</li>
    <li><strong>Los dobles tipos rinden más</strong>: un mismo Pokémon empuja dos rasgos a la vez.</li>
    <li><strong>Equilibrio:</strong> repetir tipo sube el rasgo pero quita cobertura. Una base de 2–4 Pokémon con un tipo en común y el resto cubriendo debilidades suele ser buen punto medio.</li>
    <li>Según <a href="https://pokelike-guide.fr/es/traits/" rel="noopener">pokelike-guide.fr</a>, <strong>Bicho</strong> funciona como «motor de niveles» (probabilidad de +1 nivel tras cada combate), muy útil al principio de la Torre.</li>
  </ul>
</div>
<aside class="panel">
  <h3>Rasgos más directos para empezar</h3>
  <ul>
    <li>${typeChip('Bug')}: niveles extra tras combatir.</li>
    <li>${typeChip('Fire')} y ${typeChip('Flying')}: más ataque o velocidad al empezar cada combate.</li>
    <li>${typeChip('Normal')}: más PS máximos.</li>
    <li>${typeChip('Steel')}: menos daño recibido.</li>
  </ul>
  <p class="muted">Textos completos de cada rango en la tabla de abajo.</p>
</aside>
</div>

<h2>Todos los rasgos, por rango</h2>
<p class="muted">Texto tal cual sale en el juego en español. Se muestran los rangos 1, 2, 3, 6 y 12.</p>
<div class="table-wrap"><table>
  <thead><tr><th>Tipo</th>${SHOW.map((r) => `<th>Rango ${r}</th>`).join('')}</tr></thead>
  <tbody>${rows}</tbody>
</table></div>`;
  },
};
