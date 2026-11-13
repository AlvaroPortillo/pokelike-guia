// Añade a data/guia.json los 9 jefes de cada fase de la Torre Batalla.
// Uso: node tools/add-tower-bosses.js tools/dumps data/guia.json
// Volcados (sacados en pokelike.xyz con setLanguage('es'), ver CLAUDE.md):
//  - tower-bosses.json: rollRegion(fase, región) del juego, con los ids numéricos de cada Pokémon.
//  - tower-bosses-es.json: los mismos equipos ya montados como en el combate (evolución por nivel, nombres
//    en español, objetos, variocolor, megas y su habilidad).
// Los jefes de la Torre son fijos: el juego genera cada región con una semilla fija (fase × 1000 + región).
const fs = require('fs');
const path = require('path');
const [, , dir, outFile] = process.argv;
if (!dir || !outFile) { console.error('Uso: node add-tower-bosses.js <carpeta_volcados> <guia.json>'); process.exit(1); }

const readJson = (f) => {
  let txt = fs.readFileSync(f, 'utf8');
  let v = JSON.parse(txt);
  if (typeof v === 'string') v = JSON.parse(v); // Playwright guarda el resultado como cadena JSON
  return v;
};
const guia = readJson(outFile);
const raw = readJson(path.join(dir, 'tower-bosses.json'));
const es = readJson(path.join(dir, 'tower-bosses-es.json'));

const TC = guia.typeChart;
const TYPES = guia.types.map((t) => t.id);
const eff = (atk, defTypes) => defTypes.reduce((m, t) => m * (TC[atk]?.[t] ?? 1), 1);
// Mismo criterio que la Historia (tools/build-data.js): tipos que dan supereficaz a más rivales.
function weakTo(team) {
  return TYPES.map((a) => {
    let se = 0, bad = 0;
    for (const p of team) { const e = eff(a, p.types); if (e >= 2) se++; else if (e < 1) bad++; }
    return { type: a, se, bad, score: se - bad * 0.75 };
  }).filter((r) => r.se > 0).sort((a, b) => b.score - a.score || b.se - a.se).slice(0, 4);
}
function resistsTo(attackTypes) {
  return TYPES.map((def) => {
    const v = attackTypes.map((a) => eff(a, [def]));
    return { type: def, worst: Math.max(...v), avg: v.reduce((s, n) => s + n, 0) / v.length };
  }).filter((r) => r.worst <= 1 && r.avg < 1).sort((a, b) => a.avg - b.avg).slice(0, 4).map((r) => r.type);
}

// Sprites que no existen en PokeAPI: se usa el de la especie base.
const SPRITE_FALLBACK = { 10301: 718 }; // Mega-Zygarde
const ORAS = 7; // solo en la Torre ORAS los rivales usan la habilidad mega (enemyMegaAbilitiesOn del juego)

let total = 0;
for (const st of es.stages) {
  const stage = guia.tower.find((t) => t.stage === st.stage);
  if (!stage) throw new Error(`No hay fase ${st.stage} en guia.json`);
  const rawStage = raw.stages[String(st.stage)];
  stage.bosses = st.maps.map((m) => {
    const rawTr = rawStage[m.region - 1].trainers[(m.map - 1) % 3];
    const team = m.team.map((p, k) => {
      const numId = rawTr.speciesIds[k];
      const isMega = /-mega(-[xy])?$/.test(p.raw || '') || /-primal$/.test(p.raw || '');
      let name = p.name;
      if (p.mega?.name) name = p.mega.name;
      else if (isMega) name = p.name.replace(/^(.+?)-mega(?:-([xy]))?$/i, (_, b, xy) => `Mega-${b}${xy ? ' ' + xy.toUpperCase() : ''}`);
      return {
        id: SPRITE_FALLBACK[numId] ?? numId,
        name,
        types: p.types,
        level: p.level,
        ...(p.shiny ? { shiny: true } : {}),
        ...(p.item ? { item: p.item } : {}),
        ...(isMega ? { mega: true } : {}),
        ...(isMega && st.stage === ORAS && p.mega?.ability ? { megaAbility: p.mega.ability } : {}),
      };
    });
    const atkTypes = [...new Set(team.flatMap((p) => p.types))];
    const types = m.type ? m.type.split('/') : [];
    total++;
    return {
      map: m.map,
      name: m.name,
      types,
      maxLevel: Math.max(...team.map((p) => p.level)),
      // Rasgos del rival (runEndlessTrainerFight del juego): «fixed» sustituye a los que daría su equipo,
      // «all» pone los 18 rasgos a ese rango y «extra» se suma a los de su equipo.
      traits: (rawTr.specificTraits || rawTr.allTraits != null || rawTr.traitOverrides)
        ? { ...(rawTr.specificTraits ? { fixed: rawTr.specificTraits } : {}), ...(rawTr.allTraits != null ? { all: rawTr.allTraits } : {}), ...(rawTr.traitOverrides ? { extra: rawTr.traitOverrides } : {}) }
        : null,
      team,
      best: weakTo(team).map((r) => ({ type: r.type, se: r.se, of: team.length })),
      safe: resistsTo(atkTypes),
    };
  });
}
fs.writeFileSync(outFile, JSON.stringify(guia));
console.log(`Jefes añadidos: ${total} (${es.stages.length} fases). Versión del juego en el volcado: ${es.version}.`);
