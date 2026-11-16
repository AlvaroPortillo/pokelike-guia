// Progreso del usuario: localStorage + exportar/importar JSON + importar desde el juego.

const KEY = 'pokelike-guia:v1';
const APP = 'pokelike-guia';

// Logro del juego que equivale a cada marca de la guía (si existe).
const REGION_CLEAR_ACH = { 1: 'elite_four', 3: 'g3_champion', 4: 'g4_champion', 5: 'g5_champion', 6: 'g6_champion' };

const empty = () => ({ v: 1, checks: {}, game: null, updatedAt: null });
let state = empty();
let storageOk = true;
const listeners = new Set();

export function loadProgress() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      state = { ...empty(), ...parsed, checks: parsed.checks || {} };
    }
  } catch (e) {
    storageOk = false;
    return `No se pudo leer tu progreso guardado (${e.message}). Puede que el navegador bloquee el almacenamiento local (modo privado o cookies desactivadas). La guía funciona, pero lo que marques no se guardará: permite el almacenamiento para este sitio o usa «Exportar» antes de cerrar.`;
  }
  return null;
}

function save() {
  state.updatedAt = new Date().toISOString();
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
    storageOk = true;
  } catch (e) {
    storageOk = false;
    throw new Error(`No se pudo guardar en este navegador (${e.name === 'QuotaExceededError' ? 'almacenamiento lleno' : e.message}). Exporta tu progreso a un archivo para no perderlo.`);
  }
  listeners.forEach((fn) => fn());
}

export const onChange = (fn) => listeners.add(fn);
export const storageAvailable = () => storageOk;
export const getState = () => state;

const gameAch = () => new Set(state.game?.achievements || []);
const gameChal = () => new Set(state.game?.challenges || []);

// Devuelve 'game' si viene del juego importado, 'manual' si lo marcó la persona, o null.
export function doneSource(id) {
  if (state.checks[id]) return 'manual';
  if (!state.game) return null;
  const [kind, a, b] = id.split(':');
  const ach = gameAch();
  if (kind === 'ach' && ach.has(a)) return 'game';
  if (kind === 'tower' && ach.has(`endless_stage_${a}`)) return 'game';
  if (kind === 'region' && REGION_CLEAR_ACH[a] && ach.has(REGION_CLEAR_ACH[a])) return 'game';
  if (kind === 'gym' && a === '1' && ach.has(`gym_${Number(b) - 1}`)) return 'game';
  if (kind === 'gym' && REGION_CLEAR_ACH[a] && ach.has(REGION_CLEAR_ACH[a])) return 'game';
  const chal = gameChal();
  if (kind === 'chal' && chal.has(a)) return 'game';
  if (kind === 'mono' && chal.has(`monotype:${a}`)) return 'game';
  // v3.7: el juego guarda las medallas del Desafío de Gimnasios como «badge:N» (la 0 también con «intro»)
  // y los premios Hardcore de la Torre como «towerhc:N».
  if (kind === 'badge' && (chal.has(`badge:${a}`) || (a === '0' && chal.has('intro')))) return 'game';
  if (kind === 'towerhc' && chal.has(`towerhc:${a}`)) return 'game';
  return null;
}
export const isDone = (id) => doneSource(id) !== null;

export function setCheck(id, value) {
  if (value) state.checks[id] = true; else delete state.checks[id];
  save();
}

export function exportJson() {
  return JSON.stringify({ app: APP, v: 1, exportedAt: new Date().toISOString(), checks: state.checks, game: state.game }, null, 2);
}

// Acepta: (a) un archivo exportado por la guía, o (b) lo que copia el marcador desde pokelike.xyz.
export function importJson(text) {
  let data;
  try { data = JSON.parse(text); } catch (e) {
    throw new Error(`El texto no es JSON válido (${e.message}). Asegúrate de pegar el contenido completo, sin cortar el principio ni el final.`);
  }
  if (!data || typeof data !== 'object') throw new Error('El JSON está vacío o no es un objeto. Vuelve a exportar o a copiar desde el juego.');

  if (data.app === APP) {
    if (typeof data.checks !== 'object' || data.checks === null) throw new Error('El archivo es de esta guía pero no trae la lista de marcas («checks»). Puede estar dañado: exporta de nuevo.');
    state.checks = { ...data.checks };
    state.game = data.game || null;
    save();
    return `Progreso importado: ${Object.keys(state.checks).length} marcas manuales${state.game ? ' y los datos del juego' : ''}.`;
  }

  if (data.source === 'pokelike.xyz') {
    const parseList = (raw, name) => {
      if (raw == null || raw === '') return [];
      try {
        const v = typeof raw === 'string' ? JSON.parse(raw) : raw;
        if (!Array.isArray(v)) throw new Error('no es una lista');
        return v.map(String);
      } catch (e) {
        throw new Error(`La clave ${name} del juego no tiene el formato esperado (${e.message}). Puede que el juego haya cambiado su guardado; avisa para actualizar la guía.`);
      }
    };
    const achievements = parseList(data.poke_achievements, 'poke_achievements');
    const challenges = parseList(data.poke_challenges_done, 'poke_challenges_done');
    if (!achievements.length && !challenges.length) {
      throw new Error('El juego no tiene logros ni desafíos guardados en este navegador. Si juegas con cuenta, abre pokelike.xyz con la sesión iniciada, espera a que sincronice y vuelve a usar el marcador.');
    }
    state.game = {
      achievements, challenges,
      dexCaught: Number(data.dexCaught) || 0, shinyCaught: Number(data.shinyCaught) || 0,
      importedAt: new Date().toISOString(),
    };
    save();
    return `Importado del juego: ${achievements.length} logros y ${challenges.length} desafíos superados.`;
  }

  throw new Error('No reconozco este JSON: no es una exportación de esta guía ni lo que copia el marcador de pokelike.xyz. Revisa que has pegado el texto correcto.');
}

export function resetAll() {
  state = empty();
  save();
}

// Código del marcador: se ejecuta en pokelike.xyz, lee el guardado local y lo copia al portapapeles.
export const BOOKMARKLET = `javascript:(()=>{try{if(!/pokelike\\.xyz$/.test(location.hostname)){alert('Abre primero https://pokelike.xyz y pulsa el marcador allí.');return;}const g=k=>localStorage.getItem(k);const n=k=>{try{const o=JSON.parse(g(k)||'{}');return Object.values(o).filter(v=>v===1||(v&&v.caught)).length}catch(e){return 0}};const o={source:'pokelike.xyz',at:new Date().toISOString(),poke_achievements:g('poke_achievements'),poke_challenges_done:g('poke_challenges_done'),dexCaught:n('poke_dex'),shinyCaught:n('poke_shiny_dex')};const s=JSON.stringify(o);navigator.clipboard.writeText(s).then(()=>alert('Progreso copiado. Vuelve a la guía y pégalo en «Importar desde el juego».'),()=>prompt('No se pudo copiar solo. Copia este texto (Ctrl+C):',s));}catch(e){alert('No se pudo leer el guardado del juego: '+e.message)}})()`;
