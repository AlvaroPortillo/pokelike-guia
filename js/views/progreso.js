import { esc, fmt, icon, toast } from '../util.js';
import { isDone, getState, exportJson, importJson, resetAll, BOOKMARKLET, storageAvailable } from '../store.js';
import { pageHead } from './common.js';

// Mismo código que el marcador, para pegarlo en la consola del navegador (útil si no se pueden crear marcadores).
const CONSOLE_SNIPPET = BOOKMARKLET.replace(/^javascript:/, '');

export default {
  render(d) {
    const st = getState();
    const count = (ids) => ids.filter(isDone).length;
    const regions = count(d.story.map((r) => `region:${r.gen}`));
    const gyms = count(d.story.flatMap((r) => r.maps.map((m) => `gym:${r.gen}:${m.n}`)));
    const tower = count(d.tower.map((t) => `tower:${t.stage}`));
    const ach = count(d.achievements.map((a) => `ach:${a.id}`));
    const chal = count(d.challenges.filter((c) => c.id !== 'monotype').map((c) => `chal:${c.id}`));
    const mono = count(d.dailyTypes.map((t) => `mono:${t}`));
    const megas = count(d.megas.map((m) => `mega:${m.id}`));
    const g = st.game;
    const stat = (label, val) => `<div class="stat"><div class="stat__label">${esc(label)}</div><div class="stat__val">${val}</div></div>`;

    return `
${pageHead('Mi progreso', 'Lo que marcas se guarda en <strong>este navegador</strong>. Tu amigo y tú tenéis cada uno el vuestro. Para pasarlo a otro dispositivo, exporta un archivo e impórtalo allí.')}
${storageAvailable() ? '' : '<div class="note note--error" style="margin-bottom:1rem"><p><strong>Este navegador no está guardando nada.</strong> El almacenamiento local está bloqueado (modo privado o cookies desactivadas). Permite el almacenamiento para este sitio o exporta antes de cerrar.</p></div>'}

<div class="stats">
  ${stat('Regiones de Historia', `${regions} / ${d.story.length}`)}
  ${stat('Gimnasios superados', `${gyms} / ${d.story.length * 8}`)}
  ${stat('Fases de Torre', `${tower} / ${d.tower.length}`)}
  ${stat('Logros', `${ach} / ${d.achievements.length}`)}
  ${stat('Desafíos permanentes', `${chal} / ${d.challenges.length - 1}`)}
  ${stat('Monotipo', `${mono} / 18`)}
  ${stat('Mega Stones', `${megas} / ${d.megas.length}`)}
  ${g ? stat('Pokédex (del juego)', fmt(g.dexCaught)) : ''}
</div>
${g ? `<p class="muted">Último progreso importado del juego: ${esc(new Date(g.importedAt).toLocaleString('es-ES'))}. Las casillas que vienen del juego aparecen marcadas con «del juego» y no se pueden desmarcar a mano.</p>` : ''}

<h2>Importar desde el juego</h2>
<div class="note" style="margin-bottom:1rem">
  <p><strong>¿Va por la nube de Gmail?</strong> No. Pokelike guarda en el propio navegador y, si te registras, en su servidor con <strong>usuario y contraseña</strong> (se puede añadir un correo a la cuenta, pero no hay inicio de sesión con Google). La guía no se conecta a tu cuenta: lee lo que el juego ya tiene guardado en tu navegador.</p>
</div>
<ol class="steps">
  <li><strong>Abre <a href="https://pokelike.xyz" target="_blank" rel="noopener">pokelike.xyz</a></strong> en este mismo navegador. Si juegas con cuenta, inicia sesión y espera a que ponga que la nube está sincronizada.</li>
  <li><strong>Copia tu progreso.</strong> En ordenador: arrastra este botón a tu barra de marcadores y púlsalo estando en pokelike.xyz:
    <div class="btns"><a class="btn bookmarklet" id="bm" href="#">${icon.link} Copiar progreso de Pokelike</a></div>
    <details><summary>Si no puedes usar marcadores (por ejemplo en el móvil)</summary>
      <p style="margin-top:.6rem">En ordenador, abre la consola en pokelike.xyz (F12 → «Consola»), pega este código y pulsa Intro. Copia tu progreso al portapapeles. Solo lee el guardado; no cambia nada en el juego.</p>
      <textarea class="input" readonly id="snippet" aria-label="Código para la consola">${esc(CONSOLE_SNIPPET)}</textarea>
      <div class="btns"><button class="btn" type="button" id="copy-snippet">${icon.copy} Copiar código</button></div>
      <p class="muted">En el móvil los navegadores no suelen dejar ejecutar marcadores ni abrir la consola. Lo más sencillo: inicia sesión con tu cuenta del juego en un ordenador, deja que sincronice y haz la importación ahí.</p>
    </details>
  </li>
  <li><strong>Pega aquí lo copiado</strong> y pulsa «Importar». Se marcarán solos los logros, los desafíos superados, las regiones de la Historia y las fases de la Torre que el juego tenga.
    <textarea class="input" id="paste" placeholder='Pega aquí el texto copiado (empieza por {"source":"pokelike.xyz"…)' aria-label="Texto copiado del juego o de una exportación"></textarea>
    <div class="btns"><button class="btn btn--primary" type="button" id="do-import">${icon.upload} Importar</button></div>
    <p class="note note--error" id="import-error" hidden></p>
  </li>
</ol>

<h2>Guardar y pasar a otro dispositivo</h2>
<div class="btns">
  <button class="btn btn--primary" type="button" id="export">${icon.download} Exportar a archivo</button>
  <label class="btn" for="file">${icon.upload} Importar archivo</label>
  <input type="file" id="file" accept="application/json,.json" hidden>
</div>
<p class="muted">El archivo incluye tus marcas y lo importado del juego. Importarlo sustituye el progreso de este navegador.</p>

<h2>Empezar de cero</h2>
<p>Borra todas las marcas y lo importado en este navegador. No toca nada del juego.</p>
<div class="btns"><button class="btn btn--danger" type="button" id="reset">${icon.trash} Borrar mi progreso</button></div>`;
  },

  mount(root) {
    const bm = root.querySelector('#bm');
    bm.setAttribute('href', BOOKMARKLET);
    bm.addEventListener('click', (ev) => {
      ev.preventDefault();
      toast('Este botón no se pulsa aquí: arrástralo a la barra de marcadores y úsalo estando en pokelike.xyz.');
    });

    root.querySelector('#copy-snippet').addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(CONSOLE_SNIPPET);
        toast('Código copiado. Pégalo en la consola de pokelike.xyz.');
      } catch (e) {
        root.querySelector('#snippet').select();
        toast(`No se pudo copiar automáticamente (${e.message}). Está seleccionado: pulsa Ctrl+C.`, { error: true });
      }
    });

    const errBox = root.querySelector('#import-error');
    root.querySelector('#do-import').addEventListener('click', () => {
      const text = root.querySelector('#paste').value.trim();
      errBox.hidden = true;
      if (!text) {
        errBox.textContent = 'No has pegado nada. Copia tu progreso desde pokelike.xyz (paso 2) y pégalo en el cuadro.';
        errBox.hidden = false;
        return;
      }
      try {
        toast(importJson(text));
      } catch (e) {
        errBox.textContent = e.message;
        errBox.hidden = false;
      }
    });

    root.querySelector('#export').addEventListener('click', () => {
      try {
        const blob = new Blob([exportJson()], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `pokelike-guia-progreso-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.append(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(a.href), 2000);
        toast('Archivo descargado. Guárdalo para importarlo en otro dispositivo.');
      } catch (e) {
        toast(`No se pudo crear el archivo (${e.message}). Prueba con otro navegador o revisa que las descargas estén permitidas.`, { error: true });
      }
    });

    root.querySelector('#file').addEventListener('change', async (ev) => {
      const f = ev.target.files?.[0];
      if (!f) return;
      try {
        const text = await f.text();
        toast(importJson(text));
      } catch (e) {
        toast(`No se pudo importar «${f.name}»: ${e.message}`, { error: true });
      } finally {
        ev.target.value = '';
      }
    });

    const reset = root.querySelector('#reset');
    let armed = false;
    reset.addEventListener('click', () => {
      if (!armed) {
        armed = true;
        reset.textContent = 'Pulsa otra vez para borrarlo todo';
        setTimeout(() => { armed = false; reset.innerHTML = `${icon.trash} Borrar mi progreso`; }, 5000);
        return;
      }
      try {
        resetAll();
        toast('Progreso borrado en este navegador.');
      } catch (e) {
        toast(e.message, { error: true });
      }
    });
  },
};
