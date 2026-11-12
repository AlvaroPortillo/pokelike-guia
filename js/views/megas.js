import { esc, typeChips, spriteUrl } from '../util.js';
import { isDone } from '../store.js';
import { check, pageHead } from './common.js';

const TIER_LABEL = (n) => (n === 1 ? 'MVP de 1 partida de Desafío ganada' : `MVP de ${n} partidas de Desafío ganadas`);

export default {
  render(d, sub) {
    const filter = sub || 'todas';
    const tiers = [...new Set(d.megas.map((m) => m.tier))].sort((a, b) => a - b);
    const list = d.megas.filter((m) => filter === 'todas' || (filter === 'oras' ? m.oras : String(m.tier) === filter))
      .sort((a, b) => a.tier - b.tier || b.bst - a.bst);
    const owned = d.megas.filter((m) => isDone(`mega:${m.id}`)).length;
    const rows = list.map((m) => `
      <tr class="${isDone(`mega:${m.id}`) ? 'is-done' : ''}">
        <td><span class="mon"><img src="${spriteUrl(m.formId)}" alt="" loading="lazy" width="40" height="40" onerror="this.src='${spriteUrl(m.species.id)}';this.onerror=null"><span class="mon__txt"><span class="mon__name">${esc(m.mega)}</span><span class="mon__lv">${esc(m.item)}${m.oras ? ' · ORAS' : ''}</span></span></span></td>
        <td>${typeChips(m.types)}</td>
        <td class="num">${m.bst}</td>
        <td>${m.ability ? `<strong>${esc(m.ability.name)}</strong><br><small class="muted">${esc(m.ability.desc)}</small>` : '<small class="muted">—</small>'}</td>
        <td class="num">${m.tier}</td>
        <td>${check(`mega:${m.id}`, `Tengo la ${m.item}`, 'Tengo')}</td>
      </tr>`).join('');
    const btn = (id, label) => `<a href="#/megas/${id}" ${filter === id ? 'aria-current="true"' : ''}>${esc(label)}</a>`;

    return `
${pageHead('Megaevoluciones', `En Pokelike las megas se consiguen así (textos del juego): «Primero vence la <strong>Torre de Combate de Kalos (Gen 6)</strong> para conseguir el Mega Bracelet, luego desbloquea cada Mega Stone siendo el <strong>MVP</strong> de partidas de Desafío ganadas». Las ${d.megas.filter((m) => m.oras).length} piedras de ORAS piden además superar la Torre ORAS (Fase 7).`)}

<div class="grid-2" style="margin-bottom:1.5rem">
  <div class="panel">
    <h3>Cómo se usan</h3>
    <p>«Empieza una partida de Torre de Combate o de Desafío con un inicial compatible y este llevará la piedra: Mega Evoluciona en cada combate.» Cada piedra cuenta las victorias como MVP de toda la línea evolutiva (por ejemplo, Charmander, Charmeleon y Charizard suman para la Charizardite).</p>
    <p class="muted">Llevas ${owned} de ${d.megas.length} marcadas.</p>
  </div>
  <div class="panel">
    <h3>Cuántas victorias como MVP pide cada piedra</h3>
    <ul>${tiers.map((t) => `<li><strong>${t}</strong>: ${esc(TIER_LABEL(t))} · ${d.megas.filter((m) => m.tier === t).length} piedras</li>`).join('')}</ul>
    <p class="muted">Consejo: empieza por las de 1 victoria con iniciales (Venusaur, Charizard, Blastoise…) porque ya los usas para ganar.</p>
  </div>
</div>

<nav class="seg" aria-label="Filtrar megas">${btn('todas', 'Todas')}${tiers.map((t) => btn(String(t), `${t} MVP`)).join('')}${btn('oras', 'Solo ORAS')}</nav>
<div class="table-wrap"><table>
  <thead><tr><th>Mega · piedra</th><th>Tipos</th><th class="num">Estad.</th><th>Habilidad mega</th><th class="num">MVP</th><th></th></tr></thead>
  <tbody>${rows}</tbody>
</table></div>`;
  },
};
