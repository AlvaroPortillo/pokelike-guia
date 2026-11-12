// Reproduce el puzle diario del Pokésort tal como lo genera el juego (v3.6.3) a partir del número de día.
// El juego no descarga el puzle: lo calcula en el navegador con una semilla del día, así que aquí sale idéntico.

// Número de día del juego: fecha en Europe/Berlin (misma hora que la España peninsular), en días desde 1970.
export function gameDayNumber(date = new Date()) {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit' })
    .formatToParts(date).filter((x) => x.type !== 'literal').map((x) => [x.type, +x.value]));
  return Math.floor(Date.UTC(p.year, p.month - 1, p.day) / 864e5);
}

function makeRng(seed) {
  let v = seed >>> 0;
  return function () {
    v = (v + 0x6d2b79f5) | 0;
    let t = Math.imul(v ^ (v >>> 15), 1 | v);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function sample(arr, n, rng) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, n);
}

export function makeConditions(chart) {
  const eff = (atk, defTypes) => defTypes.reduce((m, t) => m * (chart[atk]?.[t] ?? 1), 1);
  return [
    { key: 'color', cat: 'color', test: (a, b) => a.color === b.color },
    { key: 'type', cat: 'type', test: (a, b) => a.types.some((t) => b.types.includes(t)) },
    { key: 'gen_eq', cat: 'gen', test: (a, b) => a.gen === b.gen },
    { key: 'gen_gt', cat: 'gen', test: (a, b) => a.gen > b.gen },
    { key: 'gen_lt', cat: 'gen', test: (a, b) => a.gen < b.gen },
    { key: 'stage_eq', cat: 'stage', test: (a, b) => a.stage === b.stage },
    { key: 'stage_gt', cat: 'stage', test: (a, b) => a.stage > b.stage },
    { key: 'stage_lt', cat: 'stage', test: (a, b) => a.stage < b.stage },
    { key: 'se', cat: 'se', test: (a, b) => a.types.length > 0 && eff(a.types[0], b.types || []) >= 2 },
  ];
}

function countSolutions(mons, conds, limit) {
  const n = mons.length, used = new Array(n).fill(false), cur = new Array(n);
  let found = 0;
  (function rec(pos) {
    if (found >= limit) return;
    if (pos === n) { found++; return; }
    for (let i = 0; i < n; i++) {
      if (used[i] || (pos > 0 && !conds[pos - 1].test(cur[pos - 1], mons[i]))) continue;
      used[i] = true; cur[pos] = mons[i];
      rec(pos + 1);
      used[i] = false;
      if (found >= limit) return;
    }
  })(0);
  return found;
}

// data = { pool: [ids en el orden del juego], mons: { id: [nombre, tipos, color, gen, etapa] } }
export function generatePuzzle(day, data, chart) {
  const CONDS = makeConditions(chart);
  const mon = (id) => { const m = data.mons[id]; return { id: +id, name: m[0], types: m[1], color: m[2], gen: m[3], stage: m[4] }; };
  const rng = makeRng(((day * 0x9e3779b1) ^ 0x9e3779b9) >>> 0);
  const pool = data.pool;
  if (pool.length < 6) return null;
  for (let attempt = 0; attempt < 8000; attempt++) {
    const mons = sample(pool, 6, rng).map(mon);
    const conds = [];
    let ok = true;
    for (let i = 0; i < 5; i++) {
      const fits = CONDS.filter((c) => c.test(mons[i], mons[i + 1]));
      if (!fits.length) { ok = false; break; }
      conds.push(fits[Math.floor(rng() * fits.length)]);
    }
    if (!ok || new Set(conds.map((c) => c.cat)).size < 2 || countSolutions(mons, conds, 2) !== 1) continue;
    let start = mons.slice();
    for (let k = 0; k < 40; k++) {
      start = sample(mons, 6, rng);
      if (start.some((m, i) => m.id !== mons[i].id)) break;
    }
    return { solution: mons, conds: conds.map((c) => c.key), start };
  }
  return null;
}
