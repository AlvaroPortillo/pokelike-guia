import { esc, pd, fmt } from '../util.js';
import { pageHead } from './common.js';

const pct = (p) => `${(p * 100).toFixed(p < 0.1 ? 1 : 0).replace('.', ',')} %`;
const atLeastOne = (p, n) => 1 - (1 - p) ** n;
const nFor = (p, target) => Math.ceil(Math.log(1 - target) / Math.log(1 - p));

export default {
  render(d) {
    const n = d.nodes;
    const c = d.constants;
    const totalAch = d.achievements.reduce((s, a) => s + (a.reward || 0), 0);
    const rows = [10, 25, 50, 100, 200].map((k) => `<tr><td class="num">${k}</td><td class="num">${pct(atLeastOne(c.shinyBase, k))}</td><td class="num">${pct(atLeastOne(c.shinyCharm, k))}</td></tr>`).join('');
    const fill = (s, v) => esc(String(s).replace(/\{n\}/g, v));
    return `
${pageHead('Guía para completar Pokelike', 'Todo lo necesario para pasarse la <strong>Historia</strong> y la <strong>Torre Batalla</strong>, los <strong>Desafíos</strong>, las <strong>Megaevoluciones</strong> y el <strong>Pokésort</strong> diario. Los nombres salen tal cual aparecen con el juego en español.')}

<div class="cols">
<div>
  <h2 id="partida">Cómo es una partida</h2>
  <p>Pokelike es un roguelike: cada partida empieza de cero con un inicial a nivel ${c.starterLevel} y recorre <strong>9 mapas</strong>. Los 8 primeros acaban en un <strong>Líder de Gimnasio</strong> y el noveno es la <strong>Liga</strong> (Alto Mando y Campeón). Si te debilitan a todo el equipo, pierdes la partida, pero lo desbloqueado (logros, Pokédex, Salón de la Fama) se queda.</p>
  <p>Cada mapa es una red de casillas por capas: eliges el camino y cada casilla te da algo. Lo que dice el juego de cada una:</p>
  <ul>
    <li><strong>${esc(n.catchPokemon)}</strong>: eliges uno de varios Pokémon para tu equipo.</li>
    <li><strong>${fill(n.wildBattle, 1)}</strong> y <strong>${fill(n.trainerBattle, 'N')}</strong>: ganas niveles para todo el equipo.</li>
    <li><strong>${esc(n.item)}</strong>: un objeto (bolsa de hasta ${c.maxBag}; pasivas activas a la vez: hasta ${c.maxPassives}).</li>
    <li><strong>${esc(n.randomEvent)}</strong> (casilla «?»): puede salir de todo.</li>
    <li><strong>${esc(n.pokemonCenter)}</strong>: cura al equipo.</li>
    <li><strong>${esc(n.tradeNode).replace('{n}', 'N')}</strong>.</li>
    <li><strong>${esc(n.martNode)}</strong>.</li>
    <li><strong>${esc(n.legendary)}</strong>: aparece a veces; vale la pena casi siempre.</li>
  </ul>
  <p>Los combates son automáticos: lo que tú decides es <strong>qué Pokémon llevas, con qué objetos y en qué orden</strong> (antes de la Liga el juego te deja «Elegir tu Orden» arrastrando a tus Pokémon). Por eso lo que más importa es llegar a cada jefe con nivel suficiente y con tipos que le hagan daño supereficaz.</p>

  <h2 id="orden">En qué orden se desbloquea todo</h2>
  <ol class="steps">
    <li><strong>Historia · Kanto.</strong> Es lo primero que hay abierto. Elige «Clásico» (sin muerte permanente). Al ganarla se abren Johto y la Torre Batalla. <a href="#/historia/1">Ver guía de Kanto</a>.</li>
    <li><strong>Torre Batalla · Fase 1 (Kanto).</strong> «Supera el modo Historia para desbloquear». Al superar la Fase 1 se abre el <strong>Modo Desafío</strong>. <a href="#/torre/1">Ver Fase 1</a>.</li>
    <li><strong>Resto de regiones de la Historia</strong> (Johto, Hoenn, Sinnoh, Teselia, Kalos) y <strong>Fases 2 a 7 de la Torre</strong>. Cada fase superada sube también el límite de entrenamiento de EV en la Tienda.</li>
    <li><strong>Megaevoluciones.</strong> El Mega Bracelet se consigue al superar la <strong>Torre de Kalos (Fase 6)</strong>; las Mega Stones de ORAS, al superar la <strong>Fase 7</strong>. <a href="#/megas">Ver megas</a>.</li>
    <li><strong>Desafíos, Pokésort y logros</strong> para ir sacando dinero y completar el juego. Los logros dan en total <strong>${pd(totalAch)}</strong>.</li>
  </ol>

  <h2 id="consejos">Consejos para quien empieza</h2>
  <ul>
    <li><strong>Mira el jefe del mapa antes de elegir camino.</strong> En cada región de esta guía tienes el equipo y los niveles de cada líder, y qué tipos le hacen daño.</li>
    <li><strong>Prioriza niveles antes de cada jefe.</strong> Los combates contra entrenadores dan más niveles que los salvajes.</li>
    <li><strong>No llenes el equipo de un solo tipo.</strong> Cubre los tipos de los jefes que vienen; cada región trae un equipo sugerido calculado para eso.</li>
    <li><strong>Usa el Centro Pokémon si llegas tocado</strong> al último tramo antes del líder.</li>
    <li><strong>Coge el Huevo Suerte en cuanto salga</strong>: «30% de prob.: el portador gana +1 nivel extra tras cada combate». Es lo que más recomienda la comunidad para la primera partida (<a href="https://pokelike-guide.fr/es/basics/getting-started/" rel="noopener">pokelike-guide.fr</a>). Dáselo al Pokémon que más vaya a pelear.</li>
    <li><strong>Aprovecha los rasgos de tipo</strong>: dos o más Pokémon con un tipo en común activan una mejora para todo el equipo. Ver <a href="#/rasgos">Rasgos</a>.</li>
    <li><strong>Para ir más rápido</strong>, la comunidad recomienda activar en <strong>Ajustes → Saltar Automático</strong> las opciones «Todos los combates» y «Evoluciones».</li>
    <li><strong>Marca lo que vas haciendo</strong> en cada sección, o importa tu progreso del juego desde <a href="#/progreso">Mi progreso</a>.</li>
  </ul>

  <h2 id="probabilidades">Probabilidades que conviene saber</h2>
  <p>En las partidas, cada Pokémon que aparece tiene un <strong>${pct(c.shinyBase)}</strong> de ser shiny. Con la Pokédex de Kanto completa sube a <strong>${pct(c.shinyCharm)}</strong>, y algunos efectos de la partida lo duplican. El Pokésort no tiene shinys.</p>
  <div class="table-wrap" style="max-width:520px"><table>
    <thead><tr><th class="num">Pokémon vistos</th><th class="num">Al menos 1 shiny (1 %)</th><th class="num">Al menos 1 shiny (2 %)</th></tr></thead>
    <tbody>${rows}</tbody>
  </table></div>
  <p class="muted" style="margin-top:.6rem">Para tener un 50 % de ver al menos uno hacen falta ${fmt(nFor(c.shinyBase, 0.5))} Pokémon con el 1 % y ${fmt(nFor(c.shinyCharm, 0.5))} con el 2 %. Cada intento es independiente: llevar muchos sin shiny no hace más probable el siguiente.</p>
</div>

<aside class="toc panel" aria-label="En esta página">
  <h3>En esta página</h3>
  <ol>
    <li><a href="#partida" data-local>Cómo es una partida</a></li>
    <li><a href="#orden" data-local>Orden de desbloqueo</a></li>
    <li><a href="#consejos">Consejos para empezar</a></li>
    <li><a href="#probabilidades">Probabilidades</a></li>
  </ol>
  <h3>Secciones</h3>
  <ol>
    <li><a href="#/historia">Historia: 6 regiones</a></li>
    <li><a href="#/torre">Torre Batalla: 7 fases</a></li>
    <li><a href="#/desafios">Desafíos</a></li>
    <li><a href="#/megas">Megaevoluciones (${d.megas.length})</a></li>
    <li><a href="#/pokesort">Pokésort diario</a></li>
    <li><a href="#/logros">Logros (${d.achievements.length})</a></li>
  </ol>
</aside>
</div>`;
  },
  mount(root) {
    // Los enlaces internos de la página (#id) no deben cambiar de sección.
    root.querySelectorAll('.toc a[href^="#"]:not([href^="#/"])').forEach((a) => {
      a.addEventListener('click', (ev) => {
        ev.preventDefault();
        document.getElementById(a.getAttribute('href').slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  },
};
