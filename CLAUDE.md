# Guía · Pokelike (pokelike.xyz)

Guía web personal en castellano para completar Pokelike, el roguelike de Pokémon de navegador y móvil
(https://pokelike.xyz, v3.6.3 del 7-11-2026). La usan el usuario y un amigo.

**Fase actual: solo planificación.** No crear archivos, código ni commits salvo que el usuario lo pida.

## Reglas del proyecto (pedidas por el usuario)
- **Todo en castellano.** El usuario juega con el juego 100 % en español: nombres de Pokémon, objetos,
  movimientos, modos y lugares tal como salen en español. Cero fallos de traducción, nada inventado.
- Contenido sacado de fuentes reales (Reddit, foros, webs de guías, Discord, X…), con la fuente enlazada.
- Guía por cada nivel de la campaña, Torre Batalla, Poke-Resort y modos de desafío.
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
- **Poke-Resort:** no aparece en el código ni en ninguna web. Pendiente de que el usuario diga dónde lo ve.
- **Notas de versión:** solo dentro del juego (sin URL pública).

## Fuentes encontradas
- Oficial: https://pokelike.xyz y Discord oficial https://discord.gg/YsakfWStYq (comunidad principal; hace
  falta cuenta para leerlo).
- Guía de fans con versión en español: https://pokelike-guide.fr (sus notas de versión llegan solo a v2.2).
- Herramienta de terceros: https://github.com/pierpierpy/pokelike.xyz.bot (copia sin servidor para bots).
- Prensa: https://androidphoria.com/juegos/pokelike-roguelike-de-pokemon
- No oficiales / clones: pokelike.click, poke-like.com, pokelike.site.
- No se encontró subreddit r/Pokelike confirmado ni cuenta oficial en X.

## Preguntas abiertas para el usuario
1. ¿Dónde está el Poke-Resort en el juego y con qué nombre exacto sale en pantalla?
2. Si el juego deja un nombre en inglés («Safari Zone»): ¿usar el oficial en español («Zona Safari») o el del juego?
