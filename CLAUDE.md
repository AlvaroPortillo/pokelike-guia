# Guía · Pokelike (pokelike.xyz)

Guía web personal en castellano para completar Pokelike, el roguelike de Pokémon de navegador y móvil
(https://pokelike.xyz, v3.6.3 del 7-11-2026). La usan el usuario y un amigo.

**Fase actual (12-11-2026): guía completa y publicada en GitHub Pages (https://alvaroportillo.github.io/pokelike-guia/), con secciones Variocolor y Aurora y Novedades (notas de versión). Siguiente paso: rediseño visual moderno (`impeccable` init + PRODUCT.md; Scenario Pro para imágenes).** Commits solo cuando el usuario lo pida.
Lo imprescindible (pedido «sí o sí»): Historia completa con mejores equipos, Torre Batalla con mejores
combinaciones de tipos, Desafíos, Megaevoluciones. Prioridad: que un amigo novato se pase Historia y Torre.

## Estructura de la web
- `index.html` + `css/styles.css` + `js/app.js` (router por hash `#/seccion/sub`), `js/store.js` (progreso en
  `localStorage` clave `pokelike-guia:v1`, exportar/importar, marcador que copia `poke_achievements` y
  `poke_challenges_done` desde pokelike.xyz), `js/util.js`, `js/views/*.js` (una por sección).
- `data/guia.json`: todos los datos del juego, generado por `tools/build-data.js` a partir de volcados sacados
  con Playwright evaluando las constantes globales del juego en pokelike.xyz con `setLanguage('es')`
  (`dump.json`, `dump2.json`, `i18n_es.json`, `es1.json`, `tower2.json`). Equipos sugeridos y coberturas
  son cálculos propios (tabla de tipos + estadísticas base del juego) y la web lo dice.
- Sprites: PokeAPI/sprites en GitHub. Fuente: DotGothic16 (OFL) autoalojada en `assets/fonts`.
- Kalos: Alto Mando y Campeona salen de `KALOS_ELITE_4` (volcado `ke4.json`).
- Pokésort: `js/pokesort-gen.js` reproduce el generador del juego (`pcGeneratePuzzle`); coincide en 20/20 días
  reales. Día del juego = fecha en Europe/Berlin (= España peninsular); el diario Mono-tipo es día % 18.
- Rasgos de tipo (código): cada Pokémon da 1 punto a cada tipo suyo (+1 si shiny); rango = puntos/2, máx. 12.
- Comunidad: consejos de pokelike-guide.fr (escrita para v2.x) con enlace y aviso de versión. pokelike.site es un
  clon no oficial: no usarlo como fuente.
- `impeccable` instalado completo el 12-11-2026 (`npx skills add pbakaus/impeccable -g`); detector limpio.
  Falta su flujo `init` (PRODUCT.md) si se quiere rediseño.
- Repo recreado en GitHub el 12-11-2026: un solo contribuidor (AlvaroPortillo). Git local del repo con
  `user.name=AlvaroPortillo`, `user.email=alvaro7portillo77@gmail.com`. Nunca añadir `Co-Authored-By`.

## Reglas del proyecto (pedidas por el usuario)
- **Todo en castellano.** El usuario juega con el juego 100 % en español: nombres de Pokémon, objetos,
  movimientos, modos y lugares tal como salen en español. Cero fallos de traducción, nada inventado.
  Regla fija: cada texto, exactamente como sale con el juego en español, aunque ahí se quede en inglés
  (p. ej. «Safari Zone»). No volver a preguntar por idioma ni por nombres.
- Contenido sacado de fuentes reales (Reddit, foros, webs de guías, Discord, X…), con la fuente enlazada.
- Guía por cada nivel de la campaña, Torre Batalla, Pokésort diario y modos de desafío.
- Progreso marcable, guardado en `localStorage` con exportar/importar en JSON (como su guía de Kingdom Hearts,
  repo `AlvaroPortillo/kh-guia-100`). Cada persona usa su propio navegador.
- Arquitectura simple y funcional: HTML + CSS + JS (módulos ES), sin compilación, publicada en GitHub Pages
  desde un repo público.
- Diseño con los skills `impeccable` / `taste`. ECC para eficiencia. Scenario (cuenta pro) solo si se
  quieren imágenes o animación.
- No hacer nada que no se pida: ni clonar, ni crear, ni lanzar procesos por iniciativa propia.
- Commits y push solo cuando el usuario lo pida.

## Estado del repo (12-11-2026)
- Rama `main` enlazada a `origin` = https://github.com/AlvaroPortillo/pokelike-guia (público).
- Config local: `push.autoSetupRemote=true`, `pull.rebase=true`, `fetch.prune=true`.
- La autenticación la hace Git Credential Manager (ya viene con Git). `gh` no está instalado y el usuario no
  quiere usar cuenta de administrador.

## Lo investigado del juego (12-11-2026, leyendo la web y su bundle JS, sin iniciar sesión)
- Todo corre en el navegador: un único bundle `https://pokelike.xyz/js/bundle.<hash>.js`.
- **Idiomas:** hay traducción al castellano propia del juego (Torre Batalla, Desafíos, Logros, Salón de la
  Fama, Código de Guardado; objetos como Huevo Suerte, Restos, Casco Dentado). Algunos textos se quedan en
  inglés dentro del español (p. ej. «Safari Zone»).
- **Guardado:** en `localStorage`, unas 80 claves `poke_*` (p. ej. `poke_achievements`, `poke_dex`,
  `poke_shiny_dex`, `poke_hall_of_fame`, `poke_challenges_done`, `poke_weekly`, `poke_daily`,
  `poke_current_run`, `poke_endless_best`, `poke_settings`). Nube opcional en `https://save.pokelike.xyz`
  (API privada sin documentar: `/api/login`, `/api/register`, `/api/state`, `/api/sync`, `/api/profile`;
  token en `poke_save_token`). Menú con «Código de Guardado».
- **Conectar la cuenta:** no llamar a la API privada con credenciales. Propuesta: un bookmarklet que el
  usuario ejecuta en pokelike.xyz (con sesión iniciada) y copia sus claves `poke_*` como JSON; la guía lo
  importa y marca sola logros, Pokédex y desafíos. Sirve igual para el amigo.
- **Modos vistos:** Historia (Normal / Nuzlocke, por regiones; hay referencias hasta Kalos), Torre Batalla
  (5 regiones: Kanto, Johto, Hoenn, Sinnoh, Teselia), Desafíos (12 permanentes + diarios y semanales),
  Pokésort diario, Multijugador (próximamente). En el código aparecen también Endless, Spire, Soul Link,
  Pokechain, Megas y fusiones.
- **Pokésort diario:** lo que el usuario llamaba «Poke-Resort» (en el código, `pokechain`). Sin shinys.
  6 Pokémon (no legendarios, Gen 1–6) para ordenar; 5 enlaces entre vecinos, cada uno con una condición:
  Color, Tipo, Gen (=, >, <), Etapa (=, >, <) o Supera (supereficaz izq.→der.). Solución única. 4 vidas.
  Puzle igual para todos, generado por día. Recompensa en código: `500 + (racha−1)×10` ₽, una vez al día.
  Día de gracia: salva la racha si fallas un día; se recarga tras 7 soluciones. Guardado: `poke_pokechain`.
- **Datos extraídos del juego (12-11-2026, v3.6.3):** con el juego en español, los nombres de mapas y de
  líderes salen en inglés (cabecera «Rustboro City: vs. Roxanne (Roca)»); tipos, objetos, logros y desafíos
  salen en español; la región 5 sale como «Teselia». Historia: 6 regiones (Kanto → Kalos), 9 mapas cada una
  (8 gimnasios + Liga). 265 logros (`poke_achievements` = array de ids; recompensa ₽ según categoría).
  Desafíos hechos en `poke_challenges_done` (array de ids). Desafío diario Mono-tipo: rota los 18 tipos,
  reinicio con hora de Europe/Berlin. Shiny en partidas: 1 % base, 2 % con la Pokédex de Kanto completa,
  ×2 con ciertas pasivas/eventos.
- **Notas de versión:** solo dentro del juego (sin URL pública).

## Fuentes encontradas
- Oficial: https://pokelike.xyz y Discord oficial https://discord.gg/YsakfWStYq (comunidad principal; hace
  falta cuenta para leerlo).
- Guía de fans con versión en español: https://pokelike-guide.fr (sus notas de versión llegan solo a v2.2).
- Herramienta de terceros: https://github.com/pierpierpy/pokelike.xyz.bot (copia sin servidor para bots).
- Prensa: https://androidphoria.com/juegos/pokelike-roguelike-de-pokemon
- No oficiales / clones: pokelike.click, poke-like.com, pokelike.site.
- No se encontró subreddit r/Pokelike confirmado ni cuenta oficial en X.
