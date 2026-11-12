// Genera data/guia.json a partir de los volcados del juego (v3.6.3).
// Uso: node tools/build-data.js <carpeta_volcados> data/guia.json
// Los volcados se sacan en pokelike.xyz evaluando sus constantes globales (ver CLAUDE.md).
const fs = require('fs');
const path = require('path');
const [, , dir, outFile] = process.argv;
if (!dir || !outFile) { console.error('Uso: node build-data.js <carpeta_volcados> <salida.json>'); process.exit(1); }
const load = f => {
  try { return JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')); }
  catch (e) { console.error(`No se pudo leer ${f}: ${e.message}. Vuelve a generar los volcados.`); process.exit(1); }
};
const d = load('dump.json'), x = load('dump2.json'), es = load('i18n_es.json'), t2 = load('tower2.json'), e1 = load('es1.json');
const ke4 = load('ke4.json'), pc = load('pc2.json');
const itemEs = (it) => (it ? (es.items.name[it.id] || it.name) : null);
const dex = x.dex, TC = d.TYPE_CHART;
const TYPES = d.MONOTYPE_TYPES;
const typeEs = Object.fromEntries(e1.types);
const spEs = n => es.species[n.replace(/[.' ]/g, m => (m === ' ' ? '-' : '')).replace(/♀/, '-f')] || n;
const legend = new Set(d.LEGENDARY_IDS);

// --- utilidades de tipos ---
const eff = (atk, defTypes) => defTypes.reduce((m, t) => m * (TC[atk]?.[t] ?? 1), 1);
const bst = s => (s.hp + s.atk + s.def + s.speed + s.special + (s.spdef ?? s.special));
const hasEvo = new Set([...Object.keys(d.EVOLUTIONS || x.EVOLUTIONS), ...Object.keys(x.BRANCHING_EVOLUTIONS)].map(Number));
const monRef = id => {
  if (typeof id === 'string') return { id: null, name: id.replace(/-mega(-[xy])?$/, (m) => ' (Mega' + (m.endsWith('x') ? ' X' : m.endsWith('y') ? ' Y' : '') + ')').replace(/^./, c => c.toUpperCase()), types: [] };
  const p = dex[id];
  return p ? { id, name: spEs(p.name), types: p.types } : { id, name: `#${id}`, types: [] };
};

function weakTo(team) {
  // Para cada tipo de ataque: a cuántos del equipo da supereficaz y a cuántos no afecta bien
  return TYPES.map(a => {
    let se = 0, bad = 0;
    for (const p of team) { const e = eff(a, p.types); if (e >= 2) se++; else if (e < 1) bad++; }
    return { type: a, se, bad, score: se - bad * 0.75 };
  }).filter(r => r.se > 0).sort((a, b) => b.score - a.score || b.se - a.se).slice(0, 4);
}
function resistsTo(attackTypes) {
  // Tipos defensivos que reciben poco de los tipos de ataque del rival
  return TYPES.map(def => {
    const v = attackTypes.map(a => eff(a, [def]));
    return { type: def, worst: Math.max(...v), avg: v.reduce((s, n) => s + n, 0) / v.length };
  }).filter(r => r.worst <= 1 && r.avg < 1).sort((a, b) => a.avg - b.avg).slice(0, 4).map(r => r.type);
}
function boss(b, role) {
  const team = b.team.map(p => ({ id: p.speciesId, name: spEs(p.name), types: p.types, level: p.level, item: itemEs(p.heldItem), mega: p.mega ? true : undefined }));
  const atkTypes = [...new Set(team.flatMap(p => p.types))];
  return {
    name: b.name, role, type: b.type === 'Mixed' ? null : b.type, badge: b.badge || null,
    team, maxLevel: Math.max(...team.map(p => p.level)),
    best: weakTo(team).map(r => ({ type: r.type, se: r.se, of: team.length })),
    safe: resistsTo(atkTypes),
  };
}

// --- pool de Pokémon por generación (sin legendarios, formas finales) ---
function pool(min, max) {
  const out = [];
  for (let id = min; id <= max; id++) {
    const p = dex[id]; if (!p || legend.has(id)) continue;
    out.push({ id, name: spEs(p.name), types: p.types, bst: bst(p.baseStats), final: !hasEvo.has(id) });
  }
  return out;
}
function pickTeam(bosses, candidates) {
  // Greedy: elige 6 Pokémon que maximicen la cobertura supereficaz sobre todos los Pokémon de los jefes,
  // con un plus por estadísticas base (BST). Devuelve también la cobertura alcanzada.
  const targets = bosses.flatMap(b => b.team);
  const finals = candidates.filter(c => c.final && c.bst >= 450);
  const covers = c => new Set(targets.map((t, i) => (c.types.some(a => eff(a, t.types) >= 2) ? i : -1)).filter(i => i >= 0));
  const chosen = [], covered = new Set(), usedTypes = new Set();
  for (let k = 0; k < 6; k++) {
    let best = null, bestScore = -1;
    for (const c of finals) {
      if (chosen.includes(c) || c.types.every(t => usedTypes.has(t))) continue;
      const cv = covers(c); let gain = 0; cv.forEach(i => { if (!covered.has(i)) gain++; });
      const score = gain * 4 + c.bst / 25;
      if (score > bestScore) { bestScore = score; best = c; }
    }
    if (!best) break;
    chosen.push(best); covers(best).forEach(i => covered.add(i)); best.types.forEach(t => usedTypes.add(t));
  }
  return { team: chosen.map(c => ({ id: c.id, name: c.name, types: c.types, bst: c.bst })), coverage: targets.length ? Math.round(covered.size / targets.length * 100) : 0, targets: targets.length };
}

// --- Historia ---
const gymSets = [d.GYM_LEADERS, d.JOHTO_GYM_LEADERS, d.HOENN_GYM_LEADERS, d.SINNOH_GYM_LEADERS, d.UNOVA_GYM_LEADERS, x.KALOS_GYM_LEADERS];
const e4Sets = [d.ELITE_4, d.GEN2_ELITE_4, d.HOENN_ELITE_4, d.SINNOH_ELITE_4, d.UNOVA_ELITE_4, ke4];
const mapNames = [d.MAP_NAMES, null, d.GEN3_MAP_NAMES, d.GEN4_MAP_NAMES, d.GEN5_MAP_NAMES, x.GEN6_MAP_NAMES];
const lv = t2.storyLv;
const lvSets = [lv.MAP_LEVEL_RANGES, lv.GEN2_MAP_LEVEL_RANGES, lv.GEN3_MAP_LEVEL_RANGES, lv.GEN4_MAP_LEVEL_RANGES, lv.GEN5_MAP_LEVEL_RANGES, lv.GEN6_MAP_LEVEL_RANGES];
const regionEs = { Unova: 'Teselia' };
const story = d.HISTORY_REGIONS.map((h, i) => {
  const gen = h.gen, [mn, mx] = d.STAGE_GEN_RANGE[gen];
  const gyms = gymSets[i].map(g => boss(g, 'gym'));
  const league = e4Sets[i] ? e4Sets[i].map(g => boss(g, g.title === 'Champion' ? 'champion' : 'e4')) : null;
  const all = [...gyms, ...(league || [])];
  return {
    gen, id: h.meta.label.toLowerCase(), name: regionEs[h.meta.label] || h.meta.label, color: h.meta.color,
    starters: (d.REGION_STARTERS[gen] || []).map(monRef),
    maps: gyms.map((g, m) => ({ n: m + 1, name: mapNames[i] ? mapNames[i][m] : null, levels: lvSets[i][m], boss: g })),
    leagueMap: { n: 9, name: mapNames[i] ? mapNames[i][8] : null, levels: lvSets[i][8] },
    league,
    suggested: pickTeam(all, pool(mn, mx)),
  };
});

// --- Torre Batalla ---
function poolCoverage(p) {
  const finals = p.filter(c => c.final);
  const hit = types => finals.filter(c => types.some(a => eff(a, c.types) >= 2)).length / finals.length;
  const pairs = [];
  for (let a = 0; a < TYPES.length; a++) for (let b = a + 1; b < TYPES.length; b++) pairs.push({ types: [TYPES[a], TYPES[b]], pct: hit([TYPES[a], TYPES[b]]) });
  pairs.sort((u, v) => v.pct - u.pct);
  const trios = [];
  for (const pr of pairs.slice(0, 25)) for (const t of TYPES) if (!pr.types.includes(t)) trios.push({ types: [...pr.types, t], pct: hit([...pr.types, t]) });
  trios.sort((u, v) => v.pct - u.pct);
  const uniq = (arr, n) => { const s = new Set(), r = []; for (const o of arr) { const k = [...o.types].sort().join(); if (!s.has(k)) { s.add(k); r.push({ types: o.types, pct: Math.round(o.pct * 100) }); } if (r.length >= n) break; } return r; };
  // Defensa: tipo (simple o doble) que menos debilidades tiene contra los tipos STAB del pool
  const stab = finals.flatMap(c => c.types);
  const defCombos = [];
  const existing = [...new Set(finals.map(c => c.types.join('/')))].map(k => k.split('/'));
  for (const dt of existing) {
    const weak = stab.filter(s => eff(s, dt) >= 2).length / stab.length;
    const res = stab.filter(s => eff(s, dt) < 1).length / stab.length;
    const ex = finals.filter(c => c.types.join('/') === dt.join('/')).sort((u, v) => v.bst - u.bst).slice(0, 3).map(c => c.name);
    defCombos.push({ types: dt, weak: Math.round(weak * 100), res: Math.round(res * 100), examples: ex });
  }
  defCombos.sort((u, v) => (u.weak - u.res * 0.5) - (v.weak - v.res * 0.5));
  const typeCount = {}; finals.forEach(c => c.types.forEach(t => typeCount[t] = (typeCount[t] || 0) + 1));
  const top = finals.slice().sort((a, b) => b.bst - a.bst).slice(0, 12).map(c => ({ id: c.id, name: c.name, types: c.types, bst: c.bst }));
  return { pairs: uniq(pairs, 6), trios: uniq(trios, 5), defense: defCombos.slice(0, 6), typeCount, top, finals: finals.length };
}
const tower = Object.keys(t2.names).map(s => {
  const st = Number(s), [mn, mx] = d.STAGE_GEN_RANGE[st];
  return { stage: st, name: regionEs[t2.names[s]] || t2.names[s], gens: [mn, mx], levels: t2.ranges[s], ...poolCoverage(pool(mn, mx)) };
});

// --- Desafíos ---
const challenges = e1.chal.map(c => ({ id: c.id, mon: monRef(c.mon), name: c.name, desc: c.desc }));
const weekly = d.WEEKLY_CHALLENGES.map(w => {
  const w2 = es.ui.weekly[w.id] || {};
  return { id: w.id, seq: w.seq, name: w2.name || w.name, desc: w2.desc || w.desc, rewards: (w.subs || []).map(s => ({ name: s.name, reward: s.reward, repeat: s.repeat ?? null })) };
}).sort((a, b) => b.seq - a.seq);

// --- Megas ---
const megas = x.MEGA_STONES.map((m, i) => {
  const n = x.megaNames[i];
  return { id: m.id, formId: m.formId, item: n.item, mega: n.mega, species: monRef(m.species), types: m.megaTypes, stats: m.megaStats, bst: bst(m.megaStats), tier: m.tier, starter: !!m.starter, oras: !!m.oras, ability: n.ab ? { name: n.ab[0], desc: n.ab[1] } : null };
});

// --- Logros ---
const achievements = e1.achs.map(a => ({ id: a.id, cat: a.cat, icon: a.icon, name: a.name, desc: a.desc, reward: d.ACH_REWARD_BY_CATEGORY[a.cat] ?? null }));

const out = {
  version: '3.6.3', extracted: '2026-11-12',
  types: TYPES.map(t => ({ id: t, es: typeEs[t] })),
  typeChart: TC,
  story, tower, challenges, dailyTypes: d.DAILY_CHALLENGE_TYPES, weekly, megas, achievements,
  achCats: es.ui.ach.cat,
  constants: {
    shinyBase: 0.01, shinyCharm: 0.02, maxPassives: d.MAX_PASSIVES, maxBag: d.MAX_BAG_ITEMS, starterLevel: 5,
    pokesortReward: d.POKECHAIN_REWARD, pokesortFreezeRecharge: d.POKECHAIN_FREEZE_RECHARGE, pokesortLives: 4,
    shinyEggCost: d.SHINY_EGG_COST, mvpMilestones: d.MVP_MILESTONES, storyCounters: d.STORY_COUNTERS,
  },
  pokesort: { conds: es.ui.pokesort.condLabel, condDesc: es.ui.pokesort.condDesc,
    // Datos del generador del juego: orden exacto del pool y atributos [nombre, tipos, color, gen, etapa].
    pool: pc.pool, mons: Object.fromEntries(Object.entries(pc.mons).map(([id, m]) => [id, [spEs(m[0]), m[1], m[2], m[3], m[4]]])) },
  nodes: es.ui.mapUi,
  // Rasgos por tipo: texto del juego en español para cada rango (1..12).
  traits: es.traits,
};
fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(out));
console.log('OK', outFile, (fs.statSync(outFile).size / 1024).toFixed(0) + ' KB',
  'historia', story.length, 'torre', tower.length, 'desafíos', challenges.length, 'megas', megas.length, 'logros', achievements.length);
for (const r of story) console.log(r.name, 'cobertura', r.suggested.coverage + '%', r.suggested.team.map(p => p.name).join(', '));
for (const t of tower) console.log('Torre', t.name, t.pairs[0].types.join('+'), t.pairs[0].pct + '%', '| def', t.defense[0].types.join('/'));
