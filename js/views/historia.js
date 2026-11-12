import { esc, typeChip, typeChips, mon } from '../util.js';
import { isDone } from '../store.js';
import { check, pageHead, seg } from './common.js';

const ROLE = { gym: 'Líder de Gimnasio', e4: 'Alto Mando', champion: 'Campeón' };

// Consejos de la comunidad (pokelike-guide.fr, escrita para versiones 2.x del juego), con su enlace.
const SRC = 'https://pokelike-guide.fr/es/normal/';
const COMMUNITY = {
  1: {
    html: `<p><strong>Inicial:</strong> Bulbasaur es el más fácil (ventaja contra Brock y Misty y aguanta a Lt. Surge); Squirtle, el seguro; Charmander, el más difícil al principio. No cambies el inicial demasiado pronto. Kanto es la región más benévola para la primera victoria.</p>`,
    links: [['best-starter/', 'Mejor inicial']],
  },
  2: {
    html: `<p><strong>Johto es la más difícil.</strong> El Rival Silver gana Doble EXP (el propio juego lo indica en su casilla), así que es arriesgado. Mejor inicial: Cyndaquil (Typhlosion); Espeon funciona como atacante Psíquico.</p>
      <p><strong>Equipo con el que la comunidad completó Johto:</strong> Typhlosion (Carbón), Espeon (Cuchara Torcida), Honchkrow (Restos), Tyranitar, Scizor (Periscopio) y Skarmory. Tyranitar y Skarmory llevaban dos objetos que, según la misma guía, hoy solo existen en el Modo Desafío: dales otro objeto.</p>`,
    links: [['gen-2-strategy/', 'Estrategia de Johto']],
  },
  3: {
    html: `<p><strong>Inicial:</strong> Treecko o Mudkip, porque tienen ventaja contra el primer gimnasio (Roca); Torchic empieza en desventaja.</p>`,
    links: [['best-starter/', 'Mejor inicial']],
  },
};

function communityBox(gen) {
  const c = COMMUNITY[gen];
  if (!c) return '';
  return `<div class="note" style="margin-bottom:1.5rem">
    <p><strong>Lo que dice la comunidad</strong> <small class="muted">· fuente: ${c.links.map(([p, l]) => `<a href="${SRC}${p}" rel="noopener">${esc(l)} (pokelike-guide.fr)</a>`).join(', ')}, guía escrita para una versión anterior del juego</small></p>
    ${c.html}
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
