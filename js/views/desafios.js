import { esc, typeChip, mon, pd } from '../util.js';
import { isDone } from '../store.js';
import { check, pageHead } from './common.js';
import { gameDayNumber } from '../pokesort-gen.js';

// Consejos derivados de las reglas de cada desafío (lo que dice el propio juego).
const TIPS = {
  monotype: 'Hay que superar la fase con cada uno de los 18 tipos. Empieza por tipos con muchos Pokémon y buena cobertura propia (Agua, Normal, Psíquico) y deja para el final los que tienen pocas opciones.',
  starpiece: 'Tu equipo cambia tras cada jefe: no merece la pena invertir en un Pokémon concreto. Prioriza objetos y reliquias, que sí se quedan.',
  trickroom: 'Ataca primero el más lento: busca Pokémon lentos y fuertes (Snorlax, Rhydon, Golem, Slowbro…) y evita los rápidos y frágiles.',
  suddendeath: 'Cada Pokémon debilitado se pierde. Ten siempre recambios en el equipo y no fuerces combates cuando vas justo de nivel.',
  inverse: 'La tabla de tipos se invierte: lo que antes era supereficaz ahora es poco eficaz y viceversa. Los tipos con muchas debilidades normales (Hielo, Roca, Planta) pasan a ser muy resistentes.',
  legendary: 'Los entrenadores rivales sacan legendarios del tipo del mapa: mira el tipo del jefe y lleva su contrario, con nivel de sobra.',
  maptype: 'Solo puedes capturar del tipo del jefe de cada mapa, así que tu equipo será variado a la fuerza: aprovecha a los de mapas anteriores contra los jefes siguientes.',
  noreplace: 'No puedes liberar ni sustituir: piensa bien las seis capturas y deja hueco para cubrir tipos que te falten más adelante.',
  noevo: 'Nada evoluciona: busca Pokémon que ya son fuertes en su primera forma o que no tienen evolución.',
  noheal: 'Sin Centros Pokémon ni curas gratis: los objetos que curan valen el doble. Evita combates innecesarios.',
  onlyfight: 'Casi todo son combates contra entrenadores con +50 % de nivel: necesitas cobertura de tipos fuerte desde el principio.',
  ultimate: 'Nuzlocke, sin curas y sin evoluciones a la vez. Hazlo cuando ya domines los otros tres por separado.',
};

export default {
  render(d) {
    const perm = d.challenges.map((c) => `
      <article class="ach${isDone(`chal:${c.id}`) ? ' is-done' : ''}" style="grid-template-columns:auto minmax(0,1fr)">
        ${mon(c.mon)}
        <div>
          <div class="ach__name">${esc(c.name)}</div>
          <div class="ach__desc">${esc(c.desc)}</div>
          ${TIPS[c.id] ? `<p style="margin:.4rem 0 .5rem"><strong>Consejo:</strong> ${esc(TIPS[c.id])}</p>` : ''}
          ${c.id === 'monotype' ? '' : check(`chal:${c.id}`, 'Superado')}
        </div>
      </article>`).join('');

    const today = dailyType(d.dailyTypes);
    const mono = d.dailyTypes.map((t) => `<span style="min-width:9.5rem">${check(`mono:${t}`, `Monotipo superado con tipo ${t}`, typeChip(t))}</span>`).join('');
    const monoDone = d.dailyTypes.filter((t) => isDone(`mono:${t}`)).length;

    const weekly = d.weekly.map((w) => `
      <details class="panel" style="margin-bottom:.6rem">
        <summary><strong>${esc(w.name)}</strong> <small class="muted">· ${w.rewards.map((r) => pd(r.reward)).join(' / ')}</small></summary>
        <p style="margin-top:.75rem">${esc(w.desc)}</p>
      </details>`).join('');

    const G = d.gymChallenge;
    const badgesDone = G ? G.badges.filter((b) => isDone(`badge:${b.level}`)).length : 0;
    const badges = G ? G.badges.map((b) => `<tr class="${isDone(`badge:${b.level}`) ? 'is-done' : ''}">
        <td class="num">${b.level + 1}</td>
        <td><strong>${esc(b.name)}</strong></td>
        <td>${b.rule ? esc(b.rule) : `<small class="muted">${esc(G.standard)}</small>`}</td>
        <td>${esc(b.reward)}</td>
        <td class="num">${pd(b.pay)}</td>
        <td>${check(`badge:${b.level}`, `${b.name} conseguida`, 'Conseguida')}</td>
      </tr>`).join('') : '';

    return `
${pageHead('Desafíos', `El menú Desafíos se abre al superar la Fase 1 de la Torre Batalla. Dentro están el <strong>${esc(G?.title || 'Desafío de Gimnasios')}</strong>${G ? ` («${esc(G.desc)}», según el juego; antes de la v3.7 se llamaba Modo Desafío)` : ''}, el <strong>diario Mono-tipo</strong>, los <strong>semanales</strong> y <strong>12 desafíos permanentes</strong> con reglas especiales. Ser el MVP de partidas de Desafío ganadas es lo que desbloquea las Mega Stones (ver <a href="#/megas">Megas</a>).`)}

${G ? `<h2 id="medallas">${esc(G.title)}: las 8 medallas <small class="muted">(${badgesDone}/8)</small></h2>
<p>«${esc(G.intro)}» Las reglas <strong>se acumulan</strong>: cada nivel añade la suya a las de los anteriores, así que la Medalla Tierra se juega con las 7 reglas a la vez. Se juega con <a href="#/reliquias">Reliquias</a>.</p>
<div class="table-wrap"><table>
  <thead><tr><th class="num">Nivel</th><th>Medalla</th><th>Regla que añade</th><th>Premio la primera vez</th><th class="num">Cada victoria</th><th></th></tr></thead>
  <tbody>${badges}</tbody>
</table></div>
<p class="muted">«Cada victoria» es lo que paga ganar una partida en ese nivel, también al repetirla (notas de la 3.7: 1.000 ₽ más 100 ₽ por nivel de medalla, y 2.000 ₽ con dos Campeones). La Medalla Volcán da 2 fichas Mega: ver <a href="#/megas">Megas</a>.</p>
<div class="note"><p><strong>Consejo:</strong> desde la Medalla Alma llevas una Bola Férrea maldita (tu primer Pokémon empieza cada combate con −2 de Velocidad) y no se puede quitar: pon delante un Pokémon resistente que no dependa de atacar primero.</p></div>` : ''}

<h2>Desafío diario Mono-tipo</h2>
<p>Cada día toca un tipo: gana una partida usando solo Pokémon de ese tipo. Rota por los 18 tipos siempre en el mismo orden y cambia a las 00:00 hora de España (el juego usa la hora de Alemania, que es la misma).</p>
<div class="panel" style="margin-bottom:1rem">
  <p style="margin:0">Hoy toca: ${today ? typeChip(today) : '<small class="muted">no se pudo calcular: mira el juego</small>'} <small class="muted">· misma fórmula que usa el juego.</small></p>
</div>

<h2>Los 12 desafíos permanentes</h2>
<div>${perm}</div>

<h3>Monotipo: los 18 tipos <small class="muted">(${monoDone}/18)</small></h3>
<p class="muted">El desafío Monotipo se supera una vez con cada tipo.</p>
<div style="display:flex;flex-wrap:wrap;gap:.6rem 1rem">${mono}</div>

<h2>Desafíos semanales</h2>
<p>Cada semana el juego pone uno temático, con recompensas por dificultad. Estos son los que han salido hasta la versión ${esc(d.version)}; el de la semana lo ves en el propio juego.</p>
${weekly}`;
  },
};

// Tipo del diario: misma fórmula que el juego (número de día en Europe/Berlin, módulo 18).
// Comprobado: 12-11-2026 = día 20769 = Siniestro, igual que en el juego.
function dailyType(types) {
  try {
    const len = types.length;
    return types[((gameDayNumber() % len) + len) % len];
  } catch {
    return null;
  }
}
