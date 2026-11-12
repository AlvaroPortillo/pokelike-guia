import { esc, pd, mon } from '../util.js';
import { pageHead } from './common.js';
import { generatePuzzle, gameDayNumber } from '../pokesort-gen.js';

function todayBlock(d, labels) {
  let p;
  const day = gameDayNumber();
  try { p = generatePuzzle(day, d.pokesort, d.typeChart); } catch (e) {
    return `<div class="note note--error"><p>No se pudo calcular el puzle de hoy (${esc(e.message)}). Recarga la página; si sigue fallando, puede que el juego haya cambiado su Pokésort y haya que actualizar la guía.</p></div>`;
  }
  if (!p) return '<div class="note note--warn"><p>El cálculo no ha dado puzle para hoy. Puede que el juego haya cambiado su Pokésort: hazlo a mano con el método de abajo.</p></div>';
  const fecha = new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
  const chain = p.solution.map((m, i) => `<li class="pc-slot"><span class="pc-pos">${i + 1}</span>${mon(m, { types: true })}${i < 5 ? `<span class="pc-link">${esc(condLabel(labels, p.conds[i]))}</span>` : ''}</li>`).join('');
  return `
  <div class="panel pc-today">
    <h3>Solución de hoy · ${esc(fecha)}</h3>
    <p class="muted">La guía genera el puzle igual que el juego (comprobado con 20 días reales), así que sale al instante, sin esperar a que nadie lo publique. Cambia a las 00:00 hora de España. Si en el juego ves otros 6 Pokémon, manda el juego: avisa para revisarlo.</p>
    <p>Así te salen colocados al abrirlo: ${p.start.map((m) => esc(m.name)).join(', ')}.</p>
    <details>
      <summary class="btn btn--primary" style="display:inline-flex">Mostrar solución</summary>
      <ol class="pc-chain">${chain}</ol>
    </details>
  </div>`;
}

const COND_ORDER = ['color', 'type', 'gen_eq', 'gen_gt', 'gen_lt', 'stage_eq', 'stage_gt', 'stage_lt', 'se'];
const condLabel = (labels, k) => {
  const base = labels[k.split('_')[0]] || k;
  const sign = k.endsWith('_eq') ? ' =' : k.endsWith('_gt') ? ' >' : k.endsWith('_lt') ? ' <' : '';
  return base + sign;
};

export default {
  render(d) {
    const p = d.pokesort;
    const c = d.constants;
    const reward = (streak) => c.pokesortReward + Math.max(0, streak - 1) * 10;
    const conds = COND_ORDER.map((k) => `<dt>${esc(condLabel(p.conds, k))}</dt><dd>${esc(p.condDesc[k])}</dd>`).join('');
    const days = [1, 2, 3, 5, 7, 10, 14, 21, 30, 50, 100];
    return `
${pageHead('Pokésort diario', `El minijuego de cada día: ordena 6 Pokémon para que cada pareja de vecinos cumpla su condición. Lo resuelves una vez al día para cobrar la recompensa; además hay puzles de práctica sin premio.`)}
${todayBlock(d, p.conds)}

<div class="cols">
<div>
  <h2>Reglas exactas</h2>
  <ul>
    <li><strong>6 Pokémon</strong> en fila y <strong>5 enlaces</strong> entre vecinos. Cada enlace tiene una condición y la fila es correcta cuando se cumplen las 5.</li>
    <li>Salen Pokémon de la <strong>Gen 1 a la 6</strong>, nunca legendarios. No hay shinys.</li>
    <li>Cada puzle tiene <strong>una sola solución</strong> y siempre mezcla al menos dos tipos de condición.</li>
    <li>Tienes <strong>${c.pokesortLives} vidas</strong>. Cada vez que pulsas «Enviar» con algún enlace mal, pierdes una y el juego te dice cuántos enlaces están bien.</li>
    <li>El puzle es el mismo para todos ese día.</li>
  </ul>

  <h2>Las condiciones</h2>
  <dl class="cond">${conds}</dl>
  <p class="muted" style="margin-top:.75rem">«Etapa» es el punto de su línea evolutiva: sin evolucionar, 1.ª evolución o 2.ª evolución. «Supera» mira solo el tipo principal del de la izquierda.</p>

  <h2>Cómo resolverlo sin gastar vidas</h2>
  <ol class="steps">
    <li><strong>Empieza por las condiciones más restrictivas.</strong> «Supera», «Color» y «Gen =» suelen cumplirlas muy pocas parejas; «Gen >/<» y «Etapa >/<» casi cualquier pareja. Coloca primero las parejas que solo encajan de una forma.</li>
    <li><strong>Mira los extremos.</strong> Los Pokémon de la primera y la última posición solo tienen un vecino. Si uno apenas encaja con nadie, va en una punta.</li>
    <li><strong>Las condiciones con dirección fijan el orden.</strong> En «Gen >», «Etapa <» o «Supera», izquierda y derecha no son intercambiables: úsalo para descartar la mitad de las colocaciones.</li>
    <li><strong>Cuando falles, usa el número de enlaces correctos.</strong> Cambia un solo par cada vez: si sube el número, el cambio era bueno; si baja, deshazlo. Así cada vida te da información segura.</li>
    <li><strong>Antes de enviar, repasa los 5 enlaces uno a uno.</strong> Como la solución es única, si todos se cumplen, es la buena.</li>
  </ol>
</div>

<aside>
  <div class="panel" style="margin-bottom:1rem">
    <h3>Recompensa y racha</h3>
    <p>Según el código del juego: <strong>${pd(c.pokesortReward)} + 10 ₽ por cada día de racha a partir del segundo</strong>. Solo se cobra el puzle diario y una vez al día.</p>
    <div class="table-wrap"><table>
      <thead><tr><th class="num">Días de racha</th><th class="num">Recompensa</th></tr></thead>
      <tbody>${days.map((n) => `<tr><td class="num">${n}</td><td class="num">${pd(reward(n))}</td></tr>`).join('')}</tbody>
    </table></div>
  </div>
  <div class="panel">
    <h3>Día de gracia</h3>
    <p>Si un día no lo resuelves, el <strong>día de gracia</strong> te guarda la racha. Después se recarga cuando resuelves ${c.pokesortFreezeRecharge} puzles diarios más. Si lo tienes gastado y fallas otro día, la racha vuelve a 1.</p>
  </div>
</aside>
</div>`;
  },
};
