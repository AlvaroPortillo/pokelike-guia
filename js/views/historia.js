import { esc, typeChip, typeChips, mon } from '../util.js';
import { isDone } from '../store.js';
import { check, pageHead, seg } from './common.js';

const ROLE = { gym: 'Líder de Gimnasio', e4: 'Alto Mando', champion: 'Campeón' };

// Consejos de la comunidad, cada bloque con su fuente.
// · pokelike-guide.fr: escrita para versiones 2.x del juego.
// · Discord oficial, canal #usercreated-guides (leído el 13-11-2026, juego v3.6.x). Hace falta cuenta de Discord.
const DC_GUIDES = 'https://discord.com/channels/1493295201597264044/1544947178479423498';
const FR = (p, l) => ({ href: `https://pokelike-guide.fr/es/normal/${p}`, label: `${l} (pokelike-guide.fr)`, old: true });
const DC = (autor, titulo) => ({ href: DC_GUIDES, label: `«${titulo}», de ${autor} (Discord oficial)` });
const COMMUNITY = {
  1: [
    {
      src: FR('best-starter/', 'Mejor inicial'),
      html: `<p><strong>Inicial:</strong> Bulbasaur es el más fácil (ventaja contra Brock y Misty y aguanta a Lt. Surge); Squirtle, el seguro; Charmander, el más difícil al principio. No cambies el inicial demasiado pronto. Kanto es la región más benévola para la primera victoria.</p>`,
    },
    {
      src: DC('blooddealer', 'Gen1 StoryMode solo blastoise'),
      html: `<p><strong>Squirtle puede pasarse Kanto casi solo.</strong> Llega al 3.er gimnasio con Blastoise a Nv. 36 y ataque de nivel 2, y al 4.º sobre el Nv. 50 con ataque de nivel 3 y Agua Mística. Desde ahí, solo subir niveles. En la Liga, Restos; contra el Campeón, mejor Cascabel Concha para curarte, porque su Dragonite lleva Cinta Elección.</p>`,
    },
  ],
  2: [
    {
      src: FR('gen-2-strategy/', 'Estrategia de Johto'),
      html: `<p><strong>Johto es la más difícil.</strong> El Rival Silver gana Doble EXP (el propio juego lo indica en su casilla), así que es arriesgado. Mejor inicial: Cyndaquil (Typhlosion); Espeon funciona como atacante Psíquico.</p>
      <p><strong>Equipo con el que la comunidad completó Johto:</strong> Typhlosion (Carbón), Espeon (Cuchara Torcida), Honchkrow (Restos), Tyranitar, Scizor (Periscopio) y Skarmory. Tyranitar y Skarmory llevaban dos objetos que, según la misma guía, hoy solo existen en el Desafío de Gimnasios: dales otro objeto.</p>`,
    },
    {
      src: DC('blooddealer', 'Gen2 StoryMode'),
      html: `<p><strong>Lo que más ayuda es Restos o Cascabel Concha</strong> en tu Pokémon principal: con uno de los dos, la partida casi está ganada. Prioridad: <strong>dos MT para Typhlosion</strong>; si no las tienes antes del 4.º gimnasio, reinicia. Como empiezas con Fuego, busca un Agua o Planta para los entrenadores de Tierra y Agua (Montañeros y Pescadores).</p>
      <p><strong>Contra Lance:</strong> lo mejor es <strong>Togekiss con Pañuelo Elección</strong>, que gana a todo su equipo y supera en velocidad incluso a Aerodactyl. También valen Mamoswine, Jynx o Delibird con ataque de nivel 2, Espeon con Cuchara Torcida, Weavile o Kingdra con Metrónomo y Tyranitar con Pañuelo Elección.</p>
      <p><strong>Plan B:</strong> si ves un <strong>Porygon-Z</strong>, cógelo: él solo puede ganar la Liga y al Rival con un objeto que suba el daño un 20 % y Restos o Cascabel Concha («Gen2 StoryMode solo porygon»). En Nuzlocke con Chikorita, <strong>Jolteon</strong> gana casi todo menos a los Montañeros («Gen2 Chikorita Nuzlocke 2.0»).</p>`,
    },
    {
      src: DC('Currents', 'Johto (Story Mode) Comprehensive Guide'),
      html: `<p>Si quieres profundizar: guía larga en inglés que explica el porqué de cada decisión en Johto, pensada sobre todo para Nuzlocke.</p>`,
    },
  ],
  3: [
    {
      src: FR('best-starter/', 'Mejor inicial'),
      html: `<p><strong>Inicial:</strong> Treecko o Mudkip, porque tienen ventaja contra el primer gimnasio (Roca); Torchic empieza en desventaja.</p>`,
    },
    {
      src: DC('blooddealer', 'Gen3 StoryMode'),
      html: `<p><strong>Treecko es el mejor inicial:</strong> se pasa solo todos los gimnasios menos el 6.º y los Alto Mando 1 y 3. Si consigues <strong>Metagross y Salamence</strong>, ya casi has ganado. Restos y Pañuelo Elección facilitan mucho la partida.</p>
      <ul>
        <li><strong>El Team Aqua o Magma sale 3 veces</strong>: lucha contra ellos, dan mucha experiencia. Elige el bando según tu inicial.</li>
        <li><strong>Joyas escondidas:</strong> Spoink con Sebo gana a los Lucha y Fuego; Trapinch con Metrónomo puede con Steven, Drake y el 6.º gimnasio.</li>
        <li>Pon a tu inicial el último del equipo: debe encargarse de los rivales más fuertes.</li>
      </ul>`,
    },
  ],
  5: [
    {
      src: DC('blooddealer', 'Gen5 StoryMode'),
      html: `<p><strong>La estrella es Excadrill con Pañuelo Elección</strong> (Drilbur con su habilidad normal y ataque de nivel 3): gana a todo menos a los pájaros. Consigue el Pañuelo cuanto antes y no se lo quites hasta el Alto Mando. Además hacen falta un Pokémon Normal para el primer Alto Mando (Fantasma) y algo que gane a los pájaros (6.º gimnasio y Mandibuzz del segundo Alto Mando).</p>
      <ul>
        <li><strong>Pelea siempre contra N</strong>: Excadrill casi le gana solo, y N ofrece buenos Pokémon.</li>
        <li>No luches contra los entrenadores de Agua. En el 3.er gimnasio pon a Excadrill el último: gana a Leavanny si no está envenenado.</li>
        <li><strong>Liga:</strong> un Normal y detrás Excadrill con Lupa contra el 1.º; el que gane a los pájaros contra el 2.º; Excadrill con Lupa contra el 3.º; Excadrill con Pañuelo Elección contra el 4.º; contra el Campeón, tu inicial (debe ganar al pájaro) y después Excadrill.</li>
      </ul>`,
    },
  ],
};

function communityBox(gen) {
  const blocks = COMMUNITY[gen];
  if (!blocks) return '';
  return `<div class="note" style="margin-bottom:1.5rem">
    <p><strong>Lo que dice la comunidad</strong> <small class="muted">· cada consejo lleva su fuente; los enlaces de Discord piden cuenta</small></p>
    ${blocks.map((b) => `${b.html}<p><small class="muted">Fuente: <a href="${b.src.href}" rel="noopener">${esc(b.src.label)}</a>${b.src.old ? ', escrita para una versión anterior del juego' : ''}.</small></p>`).join('')}
  </div>`;
}

function bossBlock(b) {
  const best = b.best.map((r) => `${typeChip(r.type)} <small class="muted">${r.se}/${r.of}</small>`).join(' ');
  return `
  <dl class="kv">
    <dt>${esc(ROLE[b.role])}</dt><dd><strong>${esc(b.name)}</strong> ${b.type ? typeChip(b.type) : '<small class="muted">tipos variados</small>'}${b.badge ? ` <small class="muted">· ${esc(b.badge)}</small>` : ''}</dd>
    <dt>Equipo</dt><dd class="team">${b.team.map((p) => mon(p, { level: p.level, extra: [p.mega ? 'Megaevoluciona' : '', p.item ? esc(p.item) : ''].filter(Boolean).join(' · ') })).join('')}</dd>
    <dt>Atácale con</dt><dd>${best || '<small class="muted">sin ventaja clara de tipo</small>'}</dd>
    <dt>Aguanta bien</dt><dd>${b.safe.length ? typeChips(b.safe) : '<small class="muted">ningún tipo resiste todo su equipo</small>'}</dd>
  </dl>`;
}

function regionView(r) {
  const maps = r.maps.map((m) => {
    const id = `gym:${r.gen}:${m.n}`;
    return `
    <article class="map${isDone(id) ? ' is-done' : ''}">
      <div class="map__n">${m.n}<small>Mapa</small></div>
      <div>
        <div class="map__title">${esc(m.name || `Mapa ${m.n}`)}</div>
        <div class="map__meta">Niveles del mapa ${m.levels[0]}–${m.levels[1]} · el jefe llega a Nv. ${m.boss.maxLevel}</div>
      </div>
      <div class="map__check">${check(id, 'Superado')}</div>
      <div class="map__body">${bossBlock(m.boss)}</div>
    </article>`;
  }).join('');

  const league = r.league
    ? r.league.map((b) => `<article class="map"><div class="map__n">9<small>${b.role === 'champion' ? 'Campeón' : 'Alto M.'}</small></div><div><div class="map__title">${esc(b.name)}</div><div class="map__meta">Hasta Nv. ${b.maxLevel}</div></div><div></div><div class="map__body">${bossBlock(b)}</div></article>`).join('')
    : `<div class="note"><p>Los equipos del Alto Mando y el Campeón de Kalos todavía no se han podido sacar del juego (no están en la misma lista que los de las otras regiones), así que aquí no aparecen. Lleva el equipo sugerido y llega por encima del nivel ${r.leagueMap.levels[1]}.</p></div>`;

  const s = r.suggested;
  return `
  <section class="region" style="--region:${esc(r.color)}">
    <div class="region-head">
      <div>
        <h2>${esc(r.name)} <small class="muted" style="font-family:var(--sans);font-size:1rem">Gen ${r.gen}</small></h2>
        <p>Iniciales: ${r.starters.map((p) => esc(p.name)).join(', ')} · niveles de ${r.maps[0].levels[0]} a ${r.leagueMap.levels[1]}.</p>
      </div>
    </div>

    ${communityBox(r.gen)}
    <div class="panel" style="margin-bottom:1.5rem">
      <h3>Equipo sugerido para ${esc(r.name)}</h3>
      <p class="muted">Seis Pokémon no legendarios de la Gen ${r.gen} elegidos para que, entre todos, tengan ataque supereficaz contra el <strong>${s.coverage} %</strong> de los ${s.targets} Pokémon de líderes${r.league ? ', Alto Mando y Campeón' : ''}, priorizando estadísticas base altas. Te saldrán otros en las capturas: úsalo como referencia de qué tipos buscar.</p>
      <div class="picks">${s.team.map((p) => `<div class="pick">${mon(p, { types: true })}</div>`).join('')}</div>
      <p style="margin-top:1rem">${check(`region:${r.gen}`, `${r.name} completada (Campeón derrotado)`)}</p>
    </div>

    <h3>Los 8 gimnasios</h3>
    <div class="maps">${maps}</div>

    <h3>Mapa 9 · ${esc(r.leagueMap.name || 'Liga Pokémon')} <small class="muted">(niveles ${r.leagueMap.levels[0]}–${r.leagueMap.levels[1]})</small></h3>
    <p class="muted">El Alto Mando y el Campeón se enfrentan seguidos: el juego te deja elegir el orden de tu equipo antes de empezar.</p>
    <div class="maps">${league}</div>
  </section>`;
}

export default {
  render(d, sub) {
    const gen = Number(sub) || 1;
    const r = d.story.find((x) => x.gen === gen);
    const items = d.story.map((x) => ({ id: x.gen, label: x.name, done: isDone(`region:${x.gen}`) }));
    if (!r) return `${pageHead('Historia')}${seg(items, null, 'historia')}<div class="note note--warn"><p>No existe la región «${esc(sub)}». Elige una de las de arriba.</p></div>`;
    return `
${pageHead('Historia', 'El modo principal: 6 regiones de 9 mapas cada una. Por cada mapa tienes el líder, su equipo con niveles, los tipos que le hacen daño (y a cuántos de su equipo) y los tipos que aguantan sus ataques. Los nombres de mapas y líderes salen en inglés porque así los muestra el juego en español.')}
${seg(items, gen, 'historia')}
${regionView(r)}`;
  },
};
