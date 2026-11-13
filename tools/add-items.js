// Añade a data/guia.json los objetos del juego (equipables y de usar) y la Tienda Poké, en español.
// Uso: node tools/add-items.js tools/dumps data/guia.json
// Volcado: tools/dumps/items-es.json, sacado en pokelike.xyz con setLanguage('es') a partir de ITEM_POOL,
// USABLE_ITEM_POOL, tItemName/tItemDesc, I18N.es.ui.mart / ui.tm y las constantes de precios (ver CLAUDE.md).
// Las pasivas del Modo Desafío (PASSIVE_ITEM_POOL) NO se incluyen: no tienen traducción y el próximo parche las rehace.
const fs = require('fs');
const path = require('path');
const [, , dir, outFile] = process.argv;
if (!dir || !outFile) { console.error('Uso: node add-items.js <carpeta_volcados> <guia.json>'); process.exit(1); }
const readJson = (f) => { let v = JSON.parse(fs.readFileSync(f, 'utf8')); return typeof v === 'string' ? JSON.parse(v) : v; };
const guia = readJson(outFile);
const src = readJson(path.join(dir, 'items-es.json'));

// Grupos para la guía (los ids son los del juego).
const GROUPS = [
  { id: 'nivel', title: 'Niveles y dinero', ids: ['lucky_egg', 'amulet_coin'] },
  { id: 'dano', title: 'Más daño', ids: ['wide_lens', 'expert_belt', 'choice_band', 'choice_specs', 'metronome', 'lagging_tail', 'scope_lens', 'loaded_dice'] },
  { id: 'aguante', title: 'Aguante y curación', ids: ['leftovers', 'shell_bell', 'assault_vest', 'eviolite', 'red_card', 'rocky_helmet'] },
  { id: 'velocidad', title: 'Velocidad y turno', ids: ['choice_scarf', 'quick_claw', 'kings_rock'] },
  { id: 'tipo', title: 'Potenciadores de tipo (+40 % a un tipo)', ids: null },
];
const used = new Set(GROUPS.flatMap((g) => g.ids || []));
const byId = Object.fromEntries(src.held.map((i) => [i.id, i]));
const groups = GROUPS.map((g) => ({
  id: g.id,
  title: g.title,
  items: (g.ids || src.held.filter((i) => !used.has(i.id)).map((i) => i.id)).map((id) => {
    const i = byId[id];
    if (!i) throw new Error(`Objeto ${id} no está en el volcado: revisa los grupos.`);
    return { id, name: i.name, desc: i.desc, minMap: i.minMap || 1 };
  }),
}));
const total = groups.reduce((n, g) => n + g.items.length, 0);
if (total !== src.held.length) throw new Error(`Faltan objetos: ${total} de ${src.held.length}`);

guia.items = { version: src.version, groups, usable: src.usable, tm: src.tm, martNode: src.martNode, mart: src.mart };
fs.writeFileSync(outFile, JSON.stringify(guia));
console.log(`Objetos añadidos: ${total} equipables y ${src.usable.length} de usar (${src.version}).`);
