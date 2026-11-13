# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Dos personas: el autor de la guía y un amigo novato en Pokelike. Ambos juegan con el juego 100 % en español.
Cada uno usa su propio navegador (el autor juega en Firefox). Usan la guía tanto en el móvil como en el PC, sin
que ninguno mande, y para cualquiera de estos trabajos por igual:
- consultar un dato en plena partida (qué tipos van bien contra un líder, en qué fase de la Torre están);
- preparar con calma un equipo o una estrategia antes de empezar una región o una fase;
- marcar el progreso (mapas, logros, desafíos) y ver cuánto falta.

De momento no se va a difundir: es pública en GitHub Pages, pero el público son esas dos personas.

## Product Purpose
Guía en castellano para completar Pokelike (https://pokelike.xyz), el roguelike de Pokémon de navegador y móvil.
Lo imprescindible: Historia completa con los mejores equipos, Torre Batalla con las mejores combinaciones de tipos,
Desafíos y Megaevoluciones. Además: Rasgos de tipo, Variocolor, Pokésort diario, Logros, Novedades y Mi progreso.
Éxito: que el amigo novato se pase la Historia y la Torre Batalla con la guía.

## Positioning
Es la única guía al día (v3.6.3) con los datos sacados directamente del juego en español, con los nombres
exactamente como salen en el juego, cálculos propios de coberturas y equipos a partir de la tabla de tipos y las
estadísticas base, y un importador que marca solo los logros y desafíos del jugador. La guía de fans existente
(pokelike-guide.fr) se quedó en v2.x.

## Operating Context
- Se alterna con el juego: en otra pestaña del PC o en el móvil al lado.
- El progreso se guarda en `localStorage` (clave `pokelike-guia:v1`), con exportar/importar en JSON.
- Importador: un marcador que se ejecuta en pokelike.xyz y copia `poke_achievements` y `poke_challenges_done`.
- El juego tiene parches cada dos semanas; la guía se actualiza regenerando `data/guia.json`.

## Capabilities and Constraints
- HTML + CSS + JS (módulos ES) sin compilación, publicado en GitHub Pages desde un repo público.
- Router por hash (`#/seccion/sub`), una vista por sección en `js/views/`. No romper el router, el progreso ni el
  importador.
- Todo en castellano; cada nombre exactamente como sale con el juego en español, aunque ahí quede en inglés.
- Contenido con fuente real enlazada; lo calculado se dice que es calculado.
- La solución del Pokésort va oculta tras «Mostrar solución» (el Discord oficial prohíbe publicarlas).
- Sprites de PokeAPI/sprites (pixel art pequeño, se escala con `image-rendering: pixelated`).

## Brand Commitments
- Nombre: «Guía Pokelike». Guía de fans sin relación con Pokelike, Nintendo, Game Freak ni The Pokémon Company:
  sin logotipos, tipografías ni pantallas oficiales copiadas.
- Estilo pedido por el usuario (13-11-2026): el diseño de la app es un homenaje a los Pokémon clásicos de Game
  Boy (Rojo, Azul, Amarillo), con **Gengar** como mascota (les encanta). Lo clásico es solo el diseño: los
  Pokémon del contenido usan siempre los sprites actuales. Detalle en `DESIGN.md`.
- Voz: castellano claro y directo, tuteo, frases cortas, explicando el porqué.

## Evidence on Hand
- Datos del juego en `data/guia.json` (v3.6.3, 12-11-2026).
- Consejos de la comunidad: pokelike-guide.fr y el Discord oficial (`notas/discord-2026-11-13.md`), con autor.
- No hay testimonios, cifras de uso ni prensa propia: no inventarlos.

## Product Principles
1. El dato correcto primero: exactitud de nombres y cifras antes que adorno.
2. Encontrar en segundos: cada sección se escanea rápido tanto en el móvil como en el PC.
3. Pensada para un novato: explica el porqué y no da por sabida la jerga.
4. Honesta con la fuente: siempre se ve de dónde sale cada cosa y qué está calculado.
5. El progreso es de cada uno: local, sin cuentas ni contraseñas.

## Accessibility & Inclusion
WCAG AA de contraste, foco visible, `prefers-reduced-motion` respetado, funciona a 390 px y a 1280 px.
