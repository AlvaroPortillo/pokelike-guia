import { esc, typeChip, typeChips, typeEs, mon, bar } from '../util.js';
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

// Rasgos que el juego fija a algunos jefes (en vez de calcularlos con su equipo, o además).
function traitsLine(tr) {
  if (!tr) return '';
  const list = (o) => Object.entries(o).map(([ty, n]) => `${typeChip(ty)} <small class="muted">rango ${n}</small>`).join(' ');
  if (tr.all != null) return `<dt>Rasgos</dt><dd>Los 18 rasgos a rango ${tr.all}</dd>`;
  if (tr.fixed) return `<dt>Rasgos</dt><dd>${list(tr.fixed)} <small class="muted">· fijados por el juego</small></dd>`;
  if (tr.extra) return `<dt>Rasgos</dt><dd>${list(tr.extra)} <small class="muted">· además de los de su equipo</small></dd>`;
  return '';
}

function bossCard(stage, b) {
  const id = `tower:${stage}:${b.map}`;
  const role = b.map === 9 ? 'Jefe final de la fase' : b.map % 3 === 0 ? 'Fin de tramo' : '';
  const best = b.best.map((r) => `${typeChip(r.type)} <small class="muted">${r.se}/${r.of}</small>`).join(' ');
  const team = b.team.map((p) => mon(p, {
    level: p.level,
    extra: [
      p.mega ? (p.megaAbility ? `Mega · ${esc(p.megaAbility)}` : 'Mega') : '',
      p.shiny ? 'Variocolor' : '',
      p.item ? esc(p.item) : '',
    ].filter(Boolean).join(' · '),
  })).join('');
  return `
  <article class="map${isDone(id) ? ' is-done' : ''}">
    <div class="map__n">${b.map}<small>Mapa</small></div>
    <div>
      <div class="map__title">${esc(b.name)} ${b.types.length ? typeChips(b.types) : ''}</div>
      <div class="map__meta">Hasta Nv. ${b.maxLevel}${role ? ` · ${role}` : ''}</div>
    </div>
    <div class="map__check">${check(id, 'Superado')}</div>
    <div class="map__body"><dl class="kv">
      <dt>Equipo</dt><dd class="team">${team}</dd>
      ${traitsLine(b.traits)}
      <dt>Atácale con</dt><dd>${best || '<small class="muted">sin ventaja clara de tipo</small>'}</dd>
      <dt>Aguanta bien</dt><dd>${b.safe.length ? typeChips(b.safe) : '<small class="muted">ningún tipo resiste todo su equipo</small>'}</dd>
    </dl></div>
  </article>`;
}

function bossesView(t) {
  if (!t.bosses?.length) return '';
  const megas = t.bosses.reduce((n, b) => n + b.team.filter((p) => p.mega).length, 0);
  const megaNote = megas
    ? (t.stage === 7
      ? `<p class="muted">En esta fase los rivales megaevolucionados usan también su <strong>habilidad mega</strong> (la tienes al lado de cada uno; qué hace cada una, en <a href="#/megas">Megas</a>).</p>`
      : '<p class="muted">Las megas de los rivales de esta fase salen ya megaevolucionadas, pero sin habilidad mega (eso solo pasa en la Torre ORAS).</p>')
    : '';
  return `
    <h3 id="jefes">Los 9 jefes de la fase</h3>
    <p class="muted">Son siempre los mismos: el juego genera cada fase con una semilla fija, así que todos os encontráis los mismos combates. Sacados del propio juego (v3.6.3); «Atácale con» y «Aguanta bien» están calculados con la tabla de tipos, igual que en la Historia.</p>
    ${megaNote}
    <div class="maps" style="margin-bottom:2rem">${t.bosses.map((b) => bossCard(t.stage, b)).join('')}</div>`;
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
        ${t.hcReward ? `<p>${check(`towerhc:${t.stage}`, `Fase ${t.stage} superada en Hardcore`, 'Superada en Hardcore')} <small class="muted">· ${esc(d.towerHc?.label || 'Premio Hardcore')}: <strong>${esc(t.hcReward)}</strong></small></p>` : ''}
        ${starter ? `<p class="muted">Logro extra: <strong>${esc(starter.name)}</strong>: ${esc(starter.desc)}.</p>` : ''}
        <p class="muted">Pokémon finales disponibles en esta generación: ${t.finals}. Tipos más comunes entre ellos: ${common}.</p>
      </div>
      <div class="panel">
        <h3>Niveles por mapa</h3>
        <div class="table-wrap"><table><thead><tr><th>Mapa</th><th class="num">Niveles</th><th></th></tr></thead><tbody>${levelRows}</tbody></table></div>
      </div>
    </div>

    ${bossesView(t)}

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
    const head = pageHead('Torre Batalla', 'Se desbloquea al superar la Historia. Son 7 fases (Kanto, Johto, Hoenn, Sinnoh, Teselia, Kalos y ORAS), cada una de 9 mapas con Pokémon de su generación. En cada fase tienes los <strong>9 jefes</strong> con su equipo (megas incluidas). Cada fase gira en torno a los Pokémon de su generación, así que la clave es la <strong>cobertura de tipos</strong> contra esa generación: aquí la tienes calculada para cada fase.');
    if (!t) return `${head}${seg(items, null, 'torre')}<div class="note note--warn"><p>No existe la fase «${esc(sub)}». Elige una de las de arriba.</p></div>`;
    return `${head}
<div class="note" style="margin-bottom:1.5rem"><p><strong>Qué desbloquea:</strong> la Fase 1 abre el Desafío de Gimnasios; la Fase 6 (Kalos) da el Mega Bracelet; la Fase 7 (ORAS) abre las Mega Stones de ORAS. Cada fase superada sube el límite de entrenamiento de EV de la Tienda.</p></div>
<div class="grid-2" style="margin-bottom:1.5rem">
  <div class="panel">
    <h3>Normal o Hardcore (desde la v3.7)</h3>
    <p><strong>Normal</strong> se juega con <a href="#/reliquias">Reliquias</a>: una inicial y otra tras cada combate contra entrenadores. <strong>Hardcore</strong> es la torre de siempre, sin reliquias.</p>
    <p>Cada modo desbloquea sus propias fases. Superar una en Hardcore también desbloquea la siguiente en Normal, y todo lo superado antes de la 3.7 cuenta como Hardcore.</p>
  </div>
  <div class="panel">
    <h3>${esc(d.towerHc?.label || 'Premio Hardcore')} de cada fase</h3>
    <p class="muted">${esc(d.towerHc?.tip || '')} Las fases que ya superaste antes pagan la próxima vez que abras la torre.</p>
    <ul>${d.tower.filter((x) => x.hcReward).map((x) => `<li>${isDone(`towerhc:${x.stage}`) ? '✓ ' : ''}<strong>${esc(x.name)}</strong>: ${esc(x.hcReward)}</li>`).join('')}</ul>
    <p class="muted">Los huevos Aurora dan siempre un Pokémon Aurora de una línea que aún no tienes en Aurora; se abren desde la carta de ORAS.</p>
  </div>
</div>
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
