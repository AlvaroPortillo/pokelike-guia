import { esc } from '../util.js';
import { pageHead } from './common.js';

const fecha = (iso) => {
  const d = new Date(`${iso}T12:00:00Z`);
  return Number.isNaN(d.getTime()) ? iso : new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
};

export default {
  render(d) {
    const notes = d.patchNotes || [];
    const items = notes.map((n, i) => `
      <details class="panel" style="margin-bottom:.6rem" ${i < 3 ? 'open' : ''}>
        <summary><strong>v${esc(n.version)}</strong> · ${esc(n.title)} <small class="muted">· ${esc(fecha(n.date))}${n.es ? '' : ' · el juego la muestra en inglés'}</small></summary>
        ${(n.sections || []).map((s) => `<h3 style="margin-top:1rem">${esc(s.heading)}</h3><ul>${(s.entries || []).map((e) => `<li>${esc(e)}</li>`).join('')}</ul>`).join('')}
      </details>`).join('');
    return `
${pageHead('Novedades del juego', `Las notas de versión tal como las publica el juego (dentro del propio juego, no hay página pública). Datos leídos de la versión ${esc(d.version)}; las ${notes.length} versiones, de la más nueva a la más antigua.`)}
${items || '<p class="muted">No hay notas de versión en los datos.</p>'}`;
  },
};
