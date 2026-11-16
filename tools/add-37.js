// Añade a data/guia.json lo nuevo de la v3.7 / 3.7.1: Reliquias, Desafío de Gimnasios (8 medallas), premios
// Hardcore de la Torre, fichas Mega, y refresca semanales, logros, desafíos y notas de versión.
// Uso: node tools/add-37.js tools/dumps data/guia.json
// Volcado: tools/dumps/v37-raw.txt, sacado en pokelike.xyz con setLanguage('es') (ver CLAUDE.md, «Volcado 3.7»).
const fs = require('fs');
const path = require('path');
const [, , dir, outFile] = process.argv;
if (!dir || !outFile) { console.error('Uso: node add-37.js <carpeta_volcados> <guia.json>'); process.exit(1); }
const readJson = (f) => {
  try { const v = JSON.parse(fs.readFileSync(f, 'utf8')); return typeof v === 'string' ? JSON.parse(v) : v; }
  catch (e) { console.error(`No se pudo leer ${f}: ${e.message}. Vuelve a sacar el volcado en pokelike.xyz.`); process.exit(1); }
};
const guia = readJson(outFile);
const d = readJson(path.join(dir, 'v37-raw.txt'));
const need = ['relics', 'kits', 'kitNames', 'passiveUi', 'badges', 'badgeUi', 'badgeConst', 'towerHc', 'towerHcUi', 'megaTokenMvp', 'megaUi', 'weekly', 'challenges', 'achievements', 'achRewards', 'patchNotes'];
const missing = need.filter((k) => d[k] == null);
if (missing.length) { console.error(`Al volcado le faltan: ${missing.join(', ')}. Puede que el juego haya cambiado sus nombres internos.`); process.exit(1); }

const fill = (s, vars) => String(s).replace(/\{(\w+)\}/g, (m, k) => (vars[k] != null ? vars[k] : m));
const version = String(d.version || '').replace(/^v/, '');
if (!version) { console.error('El volcado no trae la versión del juego.'); process.exit(1); }

// --- Reliquias (solo las que salen ahora: las retiradas no se ofrecen en partidas nuevas) ---
const active = d.relics.filter((r) => !r.retired);
const untranslated = active.filter((r) => !r.es).map((r) => r.id);
if (untranslated.length) console.warn(`Aviso: ${untranslated.length} reliquias sin texto en español (salen como en el juego): ${untranslated.join(', ')}`);
const relic = (r) => ({
  id: r.id, name: r.name, short: r.short, desc: r.desc, kit: r.kit, synergy: r.synergy || [],
  starterType: r.starterType, capstone: r.capstone, charm: r.charm || undefined, curse: r.curse || undefined,
  oneShot: r.oneShot || undefined, eevee: r.eeveeOnly || undefined, starter: r.starterOnly || undefined,
});
guia.relics = {
  total: active.length, retired: d.relics.length - active.length, maxSlots: guia.constants.maxPassives,
  kits: Object.entries(d.kits).map(([id, k]) => ({ id, name: d.kitNames[id] || id, types: k.types || [], rare: !!k.rare, open: !!k.open })),
  list: active.map(relic),
  ui: { capstoneReq: d.passiveUi.capstoneReq, arch: d.passiveUi.arch, startTitle: d.passiveUi.startTitle },
};

// --- Desafío de Gimnasios: 8 medallas ---
const B = d.badgeUi, C = d.badgeConst;
const ruleVars = { wildLevels: C.wild, enemyLevels: Math.round((C.enemyMult - 1) * 100), trainerLevels: C.trainer };
const rewardText = (rw) => {
  const out = [];
  if (rw.pd) out.push(fill(B.reward.pd, { n: Number(rw.pd).toLocaleString('es-ES') }));
  if (rw.shards) out.push(rw.shards === 1 ? B.reward.shard : fill(B.reward.shards, { n: rw.shards }));
  if (rw.megaTokens) out.push(rw.megaTokens === 1 ? B.reward.megaToken : fill(B.reward.megaTokens, { n: rw.megaTokens }));
  if (rw.shinyLegendaryEgg) out.push(B.reward.shinyLegendaryEgg);
  if (rw.auroraEggs) out.push(fill(d.towerHcUi.auroraEggs, { n: rw.auroraEggs }));
  if (!out.length) throw new Error(`Premio desconocido: ${JSON.stringify(rw)}. Revisa el volcado.`);
  return out.join(' + ');
};
guia.gymChallenge = {
  title: d.challengeUi.modeTitle, desc: d.challengeUi.modeDesc, intro: B.screenIntro, standard: B.standard,
  caseTitle: B.caseTitle,
  badges: d.badges.map((b, i) => ({
    level: i, id: b.id, name: B.badge[b.id] || b.id, sprite: b.sprite,
    rule: b.rule ? fill(B.rule[b.rule], { n: ruleVars[b.rule] }) : null,
    reward: rewardText(b.reward), pay: C.pay[i],
  })),
};

// --- Torre Batalla: premio Hardcore por fase ---
for (const t of guia.tower) {
  const rw = d.towerHc[t.stage];
  if (!rw) throw new Error(`La fase ${t.stage} de la Torre no tiene premio Hardcore en el volcado.`);
  t.hcReward = rewardText(rw);
}
guia.towerHc = { label: d.towerHcUi.label, tip: d.towerHcUi.tip };

// --- Fichas Mega ---
guia.megaTokens = { mvp: d.megaTokenMvp, hint: d.megaUi.tokensHint };

// --- Semanales, desafíos, logros y notas de versión ---
guia.weekly = d.weekly.map((w) => ({ id: w.id, seq: w.seq, name: w.name, desc: w.desc, rewards: w.subs.map((s) => ({ name: s.name, reward: s.reward, repeat: s.repeat })) }))
  .sort((a, b) => b.seq - a.seq);
const oldChal = Object.fromEntries(guia.challenges.map((c) => [c.id, c]));
guia.challenges = d.challenges.map((c) => {
  if (!oldChal[c.id]) throw new Error(`Desafío nuevo «${c.id}» sin Pokémon asignado en la guía: añádelo a mano.`);
  return { ...oldChal[c.id], name: c.name, desc: c.desc };
});
const knownCats = new Set(Object.keys(guia.achCats));
const unknown = [...new Set(d.achievements.map((a) => a.cat))].filter((c) => !knownCats.has(c));
if (unknown.length) throw new Error(`Categorías de logro nuevas sin nombre en la guía: ${unknown.join(', ')}.`);
guia.achievements = d.achievements.map((a) => ({ id: a.id, cat: a.cat, icon: a.icon, name: a.name, desc: a.desc, reward: d.achRewards[a.cat] ?? null }));
guia.patchNotes = d.patchNotes;
guia.version = version;
guia.extracted = new Date().toISOString().slice(0, 10);

fs.writeFileSync(outFile, JSON.stringify(guia));
console.log(`OK v${version}: ${active.length} reliquias (${guia.relics.retired} retiradas), ${guia.gymChallenge.badges.length} medallas, `
  + `${guia.tower.length} premios Hardcore, ${guia.weekly.length} semanales, ${guia.achievements.length} logros, ${guia.patchNotes.length} notas de versión.`);
