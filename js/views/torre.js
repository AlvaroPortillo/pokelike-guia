import { esc, typeChips, typeEs, mon, bar } from '../util.js';
import { isDone } from '../store.js';
import { check, pageHead, seg } from './common.js';

const REGION_COLORS = { 1: '#e8503a', 2: '#c0a050', 3: '#60a878', 4: '#7878c8', 5: '#808080', 6: '#4a90d9', 7: '#3f9a8c' };

// Consejos por fase del Discord oficial, canal #usercreated-guides (leído el 13-11-2026, juego v3.6.x).
const DC_GUIDES = 'https://discord.com/channels/1493295201597264044/1544947178479423498';
const TOWER_TIPS = {
  4: {
    autor: 'Jump',
    titulo: 'Sinnoh Battletower Non Shiny Charmander Guide',
    html: '<p><strong>Se puede con un Charmander normal</strong> (sin variocolor), fácil de conseguir en la Torre de Kanto. Dale EV antes: Ataque Especial, Velocidad y PS al máximo. Reinicia el mapa 1 hasta que salga uno con buenos niveles y, si puede ser, una MT; Charmander barre solo al primer jefe. Ayuda tener EV en Pokémon Volador, Tierra o Lucha con buena Velocidad base.</p>',
  },
  5: {
    autor: 'iswilltv',
    titulo: 'Tips UNOVA',
    html: '<p><strong>Empoleon con Restos y ataque de Agua de nivel 3</strong>, y a aguantar. Ojo: <strong>Zoroark copia tus mejoras</strong>, así que aquí no te sirven las de Lucha, Veneno ni Hielo.</p>',
  },
  7: {
    autor: 'Jump',
    titulo: 'Oras Battletower with Shiny Gible Guide',
    html: '<p><strong>Gible variocolor de inicial.</strong> En el mapa 1, sáltate la primera captura y reinicia hasta un mapa con casi todo entrenadores y una MT: con Nv. 14 y una MT, o Nv. 16-17 sin ella, ganas al primer jefe. En el mapa 2 coge un Pokémon fuerte (mejor con EV) que pelee mientras Gible evoluciona; con Gabite ya barres a los jefes. Hacen falta dos objetos: <strong>Arena Fina o Metrónomo</strong>, para que Garchomp gane al 7.º jefe (Steven, Roca/Acero), y <strong>Pañuelo Elección</strong>, para ser más rápido que el jefe final.</p>',
  },
};

function towerTips(st) {
  const t = TOWER_TIPS[st];
  if (!t) return '';
  return `<div class="note" style="margin-top:1.5rem">
    <p><strong>Una estrategia que funciona en esta fase</strong></p>
    ${t.html}
    <p><small class="muted">Fuente: <a href="${DC_GUIDES}" rel="noopener">«${esc(t.titulo)}», de ${esc(t.autor)} (Discord oficial)</a>. El enlace pide cuenta de Discord.</small></p>
  </div>`;
}

function stageView(t, d) {
  const clear = d.achievements.find((a) => a.id === `endless_stage_${t.stage}`);
  const starter = d.achievements.find((a) => a.id === `starters_stage_${t.stage}`);
  const levelRows = t.levels.map((l, i) => `<tr><td>Mapa ${i + 1}</td><td class="num">${l[0]}–${l[1]}</td><td>${i === 8 ? 'Jefe final de la fase' : i % 3 === 2 ? 'Fin de tramo' : ''}</td></tr>`).join('');
  const pairs = t.pairs.map((p) => `<tr><td>${typeChips(p.types)}</td><td>${bar(p.pct)}</td></tr>`).join('');
  const trios = t.trios.map((p) => `<tr><td>${typeChips(p.types)}</td><td>${bar(p.pct)}</td></tr>`).join('');
  const def = t.defense.map((x) => `<tr><td>${typeChips(x.types)}</td><td class="num">${x.weak} %</td><td class="num">${x.res} %</td><td>${x.examples.map(esc).join(', ')}</td></tr>`).join('');
  const common = Object.entries(t.typeCount).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([ty, n]) => `${esc(typeEs(ty))} (${n})`).join(', ');
  const gensTxt = t.stage === 7 ? 'Gen 3 (Hoenn, versión ORAS)' : `Gen ${t.stage}`;

  return `
  <section style="--region:${REGION_COLORS[t.stage]}">
    <div class="region-head"><div>
      <h2>Fase ${t.stage} · ${esc(t.name)}</h2>
      <p>Pokémon de la ${esc(gensTxt)} (n.º ${t.gens[0]}–${t.gens[1]}). 9 mapas en 3 tramos; ${clear ? esc(clear.desc) : ''}.</p>
    </div></div>

    <div class="grid-2" style="margin-bottom:1.5rem">
      <div class="panel">
        <h3>Tu marca</h3>
        <p>${check(`tower:${t.stage}`, `Fase ${t.stage} superada`)}</p>
        ${starter ? `<p class="muted">Logro extra: <strong>${esc(starter.name)}</strong>: ${esc(starter.desc)}.</p>` : ''}
        <p class="muted">Pokémon finales disponibles en esta generación: ${t.finals}. Tipos más comunes entre ellos: ${common}.</p>
      </div>
      <div class="panel">
        <h3>Niveles por mapa</h3>
        <div class="table-wrap"><table><thead><tr><th>Mapa</th><th class="num">Niveles</th><th></th></tr></thead><tbody>${levelRows}</tbody></table></div>
      </div>
    </div>

    <h3>Mejores parejas de tipos para atacar</h3>
    <p class="muted">Porcentaje de los Pokémon finales de la ${esc(gensTxt)} (sin legendarios) que reciben daño supereficaz de al menos uno de los dos tipos. Son los rivales que te vas a encontrar en esta fase.</p>
    <div class="table-wrap"><table><thead><tr><th>Tipos de ataque</th><th>Cobertura supereficaz</th></tr></thead><tbody>${pairs}</tbody></table></div>

    <h3>Mejores tríos</h3>
    <div class="table-wrap"><table><thead><tr><th>Tipos de ataque</th><th>Cobertura supereficaz</th></tr></thead><tbody>${trios}</tbody></table></div>

    <h3>Mejores tipos para aguantar</h3>
    <p class="muted">Combinaciones de tipo que existen en esta generación, ordenadas por lo poco que les hacen los ataques del mismo tipo (STAB) de los rivales. «Débil» es el % de ataques STAB rivales que le son supereficaces; «Resiste», el % que le hacen poco o nada.</p>
    <div class="table-wrap"><table><thead><tr><th>Tipo</th><th class="num">Débil</th><th class="num">Resiste</th><th>Ejemplos</th></tr></thead><tbody>${def}</tbody></table></div>

    <h3>Los Pokémon más fuertes de la generación</h3>
    <p class="muted">Por estadísticas base totales, sin legendarios. Si te salen en una captura, suelen merecer la pena.</p>
    <div class="picks">${t.top.map((p) => `<div class="pick">${mon(p, { types: true, extra: `${p.bst} pts de estadísticas base` })}</div>`).join('')}</div>
  </section>`;
}

export default {
  render(d, sub) {
    const st = Number(sub) || 1;
    const t = d.tower.find((x) => x.stage === st);
    const items = d.tower.map((x) => ({ id: x.stage, label: `${x.stage} · ${x.name}`, done: isDone(`tower:${x.stage}`) }));
    const head = pageHead('Torre Batalla', 'Se desbloquea al superar la Historia. Son 7 fases (Kanto, Johto, Hoenn, Sinnoh, Teselia, Kalos y ORAS), cada una de 9 mapas con Pokémon de su generación. Cada fase gira en torno a los Pokémon de su generación, así que la clave es la <strong>cobertura de tipos</strong> contra esa generación: aquí la tienes calculada para cada fase.');
    if (!t) return `${head}${seg(items, null, 'torre')}<div class="note note--warn"><p>No existe la fase «${esc(sub)}». Elige una de las de arriba.</p></div>`;
    return `${head}
<div class="note" style="margin-bottom:1.5rem"><p><strong>Qué desbloquea:</strong> la Fase 1 abre el Modo Desafío; la Fase 6 (Kalos) da el Mega Bracelet; la Fase 7 (ORAS) abre las Mega Stones de ORAS. Cada fase superada sube el límite de entrenamiento de EV de la Tienda.</p></div>
${seg(items, st, 'torre')}
${stageView(t, d)}
${towerTips(st)}
<h2>Lo que dice la comunidad sobre la Torre</h2>
<div class="note">
  <p><small class="muted">Fuente: <a href="https://pokelike-guide.fr/es/battle-tower/team-comps/" rel="noopener">Composiciones</a> e <a href="https://pokelike-guide.fr/es/battle-tower/starters/" rel="noopener">Iniciales de la Torre</a> (pokelike-guide.fr). Escrita cuando la Torre tenía 5 regiones y cada fase mezclaba varias generaciones; hoy son 7 fases de una sola generación, así que tómalo como orientación.</small></p>
  <ul>
    <li><strong>Iniciales de la Torre:</strong> puedes empezar con cualquier Pokémon con el que ya hayas ganado una partida. En Kanto y Johto, Scyther basta como Pokémon principal. Desde Hoenn, mejor Mr. Mime o Aerodactyl, porque los Bicho aguantan peor a los primeros jefes.</li>
    <li><strong>Arquetipos que funcionan:</strong> Bicho al principio (Scyther o Pinsir con el rasgo Bicho); presión Voladora; núcleo Fuego + Psíquico (Arcanine + Alakazam); Dragón al final (Garchomp, Salamence, Dragonite, Kingdra).</li>
    <li><strong>Buenas elecciones sueltas:</strong> Gengar, Charizard, Lapras, Togekiss, Espeon, Umbreon y Lanturn (Agua/Eléctrico, que alimenta dos rasgos a la vez).</li>
    <li><strong>Método:</strong> elige un tipo principal para el rasgo, lleva sus objetos que potencian ese tipo y vuelca los niveles en tus mejores atacantes antes de cada jefe. Mira <a href="#/rasgos">Rasgos</a>.</li>
  </ul>
</div>`;
  },
};
