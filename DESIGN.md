# DESIGN.md · Guía Pokelike

Sistema visual de la guía. Lo pidió el usuario el 13-11-2026: **estética de los Pokémon clásicos de Game Boy
(Rojo, Azul y Amarillo), con Gengar como protagonista**, y los sprites modernos para el resto de Pokémon.
Este estilo manda sobre las preferencias de diseño globales (oscuro con neón, superficies translúcidas, sans
gruesa): ellas mismas dicen que el estilo que pida el usuario manda. Lo que sigue siendo obligatorio: contraste
WCAG AA, foco visible, `prefers-reduced-motion`, que funcione a 390 px y 1280 px, y los tokens en `:root`.

Es una guía de fans: homenaje a la época, **sin** logotipos, tipografías ni pantallas oficiales copiadas.

## 1. La idea

La guía se siente como abrir el juego en una Game Boy: **cuadros de texto con doble borde, menús con cursor ▶,
barras de experiencia y un Gengar enorme acechando de fondo**. El marco (cabecera, menús, títulos, cuadros,
tablas) es todo Game Boy; la columna de lectura se queda tranquila y legible, en sans normal.

Regla de oro: **el mundo es el marco, no el texto.** Un párrafo largo nunca va en letra pixel.

## 2. Temas

Dos temas con los mismos papeles. El oscuro es el de por defecto; el claro se elige con un botón y se guarda.

### Oscuro «Noche Gengar» (por defecto)
La Torre Pokémon de Pueblo Lavanda de noche: violeta casi negro, plano, sin degradados.

| Token | Valor | Uso |
|---|---|---|
| `--ground` | `#110c1b` | Fondo de página |
| `--ground-2` | `#181226` | Franjas, cabecera de tabla |
| `--panel` | `#211936` | Cuadros de texto |
| `--panel-2` | `#2c2147` | Cuadro activo, hover |
| `--line` | `#3d2f5c` | Bordes finos, separadores |
| `--frame` | `#efe8fb` | Borde exterior de los cuadros (el «marco» Game Boy) |
| `--ink` | `#f4effa` | Texto principal |
| `--ink-2` | `#cdc3e0` | Texto secundario (≈ 11:1 sobre el fondo) |
| `--ink-3` | `#a899c4` | Notas, metadatos (≈ 7,3:1; 5,7:1 sobre `--panel-2`) |
| `--ghost` | `#7b5ea7` | Violeta Gengar: solo siluetas, sombras y adornos, nunca texto |
| `--accent` | `#ff4d6d` | Rojo «ojos de Gengar»: acción principal, región actual, cursor ▶ (≈ 6:1) |
| `--on-accent` | `#110c1b` | Texto sobre `--accent` (≈ 6:1; el blanco solo da 3,2:1) |
| `--accent-ink` | `#ff8fa3` | Enlaces y texto en rojo (≈ 7:1) |
| `--lcd` | `#9bbc0f` | Verde pantalla: barra de EXP, completado, «hecho» |
| `--warn` | `#f8c030` | Avisos y foco visible |

### Claro «Pantalla Game Boy»
La pantalla verde de la Game Boy original, aclarada para leer bien.

| Token | Valor |
|---|---|
| `--ground` | `#e3eec0` |
| `--ground-2` | `#d4e3a6` |
| `--panel` | `#f3f8e2` |
| `--panel-2` | `#e8f1cc` |
| `--line` | `#a7c25a` |
| `--frame` | `#0f380f` |
| `--ink` | `#0f380f` |
| `--ink-2` | `#2c5a2c` (≈ 6,6:1) |
| `--ink-3` | `#3f6b3a` (≈ 5:1) |
| `--ghost` | `#5d4a86` |
| `--accent` | `#ad1433` (≈ 5,9:1; 5,2:1 sobre `--ground-2`) |
| `--on-accent` | `#ffffff` (≈ 7,2:1) |
| `--accent-ink` | `#a3142f` (≈ 6,4:1) |
| `--lcd` | `#306230` |
| `--warn` | `#7a4f00` (≈ 5,9:1) |

Estrategia de color: **restringida**. Neutros del mundo + un acento (rojo Gengar) + el verde pantalla con un
único significado («hecho / progreso»). Los colores de tipo (Fuego, Agua…) solo viven en las etiquetas de tipo.

## 3. Tipografía

| Papel | Fuente | Detalles |
|---|---|---|
| Pixel (marco) | **DotGothic16** (OFL, autoalojada en `assets/fonts`) | Títulos h1/h2, menú, botones, números, etiquetas. Siempre en mayúsculas en menús y botones; `letter-spacing: .04em`. Sin negrita sintética. |
| Lectura | `system-ui` (Segoe UI, Roboto, SF…) | Párrafos, listas, tablas largas. 17 px / 1,6. Medida 60-72 caracteres. |
| Subtítulos | `system-ui` 700 | h3 y nombres dentro de las tarjetas. |

Escala (`--step-*`): −1 `0.875rem` · 0 `1.0625rem` · 1 `1.25rem` · 2 `clamp(1.5rem, 1.2rem + 1vw, 1.9rem)` ·
3 `clamp(2rem, 1.2rem + 3.4vw, 3.6rem)` · 4 (titular de Inicio) `clamp(2.6rem, 1.4rem + 5vw, 5.2rem)`.
La letra pixel se ve nítida en múltiplos de 16 px: los tamaños grandes se redondean a 32, 48, 64 o 80 px.

## 4. Espacio, bordes y radios

- Espaciado en múltiplos de 4 px: `--s-1` 4 · `--s-2` 8 · `--s-3` 12 · `--s-4` 16 · `--s-5` 24 · `--s-6` 32 ·
  `--s-7` 48 · `--s-8` 64 · `--s-9` 96. Más aire encima de un título que debajo.
- Radios **cortos y pixelados**: `--r-1` 4 px (etiquetas), `--r-2` 6 px (cuadros), `--r-3` 10 px (sprites
  enmarcados). Nada de píldoras ni radios grandes: no son de la época.
- Bordes: el cuadro de texto lleva **doble borde** (`--frame` 3 px por fuera, 3 px de `--panel` y 2 px de
  `--line` por dentro), hecho con `box-shadow` apilados para no cambiar el tamaño.
- Sin sombras difusas. La única «sombra» es la sombra pixel de Gengar.
- Anchura máxima de página: 1180 px. Columna de lectura: 72ch.

## 5. Componentes

- **Cuadro de texto** (`.box`): el componente base. Paneles, notas, preguntas frecuentes, resumen de región.
  Las notas llevan el triángulo ▼ de «continuar» parpadeando abajo a la derecha (solo decorativo, `aria-hidden`).
- **Menú con cursor**: la navegación principal. En escritorio, una fila de opciones dentro de un cuadro; la
  sección actual lleva el cursor ▶ rojo delante. Al pasar el ratón o el foco por otra opción, el cursor salta a
  ella (sin deslizar). En móvil, botón «MENÚ» arriba a la derecha que abre un cuadro lateral con la lista en
  vertical, como el menú de pausa de los juegos clásicos (se cierra con Esc y devuelve el foco).
- **Barra de EXP** (`.bar`): todo progreso (mapas, logros, Pokédex). Pista oscura con borde pixel, relleno
  `--lcd` a tramos de 2 px. Siempre con el número al lado («4/9»).
- **Región / fase**: botones del selector como opciones de menú pixel; la activa lleva ▶ y fondo `--panel-2`.
  Una región completa lleva una medalla (un rombo pixel `--lcd`) a la derecha.
- **Tarjeta de mapa / líder**: cuadro de texto con la cabecera «Rustboro City: vs. Roxanne (Roca)» en pixel, el
  número del mapa grande en `--accent`, y el equipo del líder como fila de sprites con su nivel («Nv. 14») en
  pixel. El dato decisivo (los tipos que le hacen daño) va primero.
- **Etiqueta de tipo** (`.type`): el color de cada tipo, letra pixel en mayúsculas, radio 4 px, borde inferior
  2 px más oscuro (efecto botón de la época). El texto cumple AA sobre cada color.
- **Sprites**: los modernos de PokeAPI (`spriteUrl`), siempre `image-rendering: pixelated`, a 1×, 2× o 3×
  (nunca tamaños intermedios que emborronen).
- **Casilla** (`.check`): cuadrado pixel de 20 px con doble borde; marcada, se rellena de `--lcd` con la
  marca. El origen «importado» se indica con texto, no solo con color.
- **Tablas**: dentro de un cuadro; cabecera en pixel y `--ground-2`; cuerpo en sans.
- **Botones**: rectángulos de radio 4 px con texto pixel en mayúsculas. Primario: fondo `--accent`, texto
  `--on-accent`. Secundario: `--panel-2` con borde `--frame`. Al pulsar baja 2 px (sin animación suave).
- **Aviso emergente** (`.toast`): cuadro de texto abajo, con un Gengar pequeño a la izquierda.

## 6. Gengar

Gengar es la mascota de la guía. Se usa **mucho, pero siempre en el marco**, nunca tapando el texto.

- **Fondo de Inicio**: el sprite de Gengar de Rojo/Azul (PokeAPI `versions/generation-i/red-blue/transparent/94.png`,
  56 px) ampliado ×8 o ×10 con `pixelated`, detrás del titular, con opacidad del 18-25 % en oscuro. Flota
  despacio (sube y baja 8 px en 4 s, a saltos) y debajo tiene su sombra pixel que crece y encoge.
- **Asomado**: en el resto de páginas, un Gengar pequeño (×3) asoma por el borde inferior derecho del pie y se
  esconde al llegar al final del todo.
- **Estados vacíos y errores**: «¡Aquí no hay nada!» o el error de carga, con Gengar a ×4.
- **Cargando**: la silueta de Gengar en `--ghost` parpadeando a saltos con «CARGANDO…».
- **Marca**: junto al nombre «Guía Pokelike», la cara de Gengar del sprite clásico (recortada, 28 px).
- **Lo clásico es solo el diseño de la app.** Todo Pokémon que forma parte del contenido (equipos de líderes,
  equipos sugeridos, megas, Pokésort, variocolor…) sale con su sprite actual, incluido Gengar cuando aparece
  como Pokémon del juego. El Gengar de Rojo/Azul solo existe como mascota decorativa del marco.
- Todos los Gengar decorativos llevan `alt=""` y `aria-hidden="true"`.

## 7. Movimiento

Movimiento **a saltos**, como en la Game Boy: `steps()` en vez de suavizados largos.

- Cambio de sección: fundido de pantalla en 4 pasos (`steps(4)`, 200 ms), como al entrar a una ruta.
- Cursor ▶ y triángulo ▼: parpadeo de 1 s con `steps(1)`.
- Gengar de fondo: flotación de 4 s con `steps(8)`; sombra a juego.
- Hover y foco: cambio inmediato o 150 ms como mucho.
- Barra de EXP: al cargar se rellena en `steps(10)` durante 300 ms.
- **`prefers-reduced-motion: reduce`**: todo quieto (sin flotación, sin parpadeo, sin fundidos). El contenido
  nunca depende de una animación para verse.

## 8. Accesibilidad y adaptación

- Contraste AA comprobado en los dos temas (texto normal ≥ 4,5:1; la letra pixel cuenta como texto normal).
- Foco visible: contorno de 3 px en `--warn` con 2 px de separación, en todo lo que se puede pulsar.
- Selector de tema accesible (botón con `aria-pressed`), y el tema por defecto respeta
  `prefers-color-scheme` solo si el usuario no ha elegido.
- 390 px: menú en cuadro lateral, una columna, sprites del equipo en rejilla de 3, tablas con desplazamiento
  horizontal dentro de su cuadro. Gengar de fondo a ×5 y por detrás del titular.
- 1280 px: menú en fila, columnas de 2 donde ya las hay (índice lateral en Inicio).

## 9. Qué no hacer

- Nada de logotipos oficiales, la tipografía del logo de Pokémon ni capturas de los juegos.
- Ni degradados (tampoco morados), ni sombras difusas, ni superficies de cristal, ni emojis como iconos.
- Ni letra pixel en párrafos largos, ni sprites a tamaños que emborronen.
- No usar el verde pantalla para algo que no sea «hecho / progreso», ni el rojo para algo que no sea la acción
  o la posición actual.
- No tocar el router, el progreso (`localStorage`) ni el importador: el rediseño es de estilos y de marcado.

## 10. Sonido (solo escritorio)

- **Música** (botón «Música» en la cabecera, activar/desactivar): canciones originales de Pokémon Rojo/Azul
  servidas desde YouTube (js/musica.js, lista TRACKS). Nunca se suben archivos de audio al repo. Se ven en
  la pantalla de una Game Boy pequeña abajo a la derecha («GAME GENGAR»), porque YouTube exige que el
  reproductor se vea y mida al menos 200×200 px. Pasa sola a la siguiente, tiene aleatorio y salta las que
  fallen. No se conecta a YouTube hasta pulsar el botón (dominio youtube-nocookie).
- **Efectos** (botón «Efectos»): pitidos de onda cuadrada sintetizados en el navegador con el timbre de la
  Game Boy (js/sonidos.js): seleccionar, cambiar de sección, abrir/cerrar menú, marcar/desmarcar, cambiar de
  tema y error. Son sonidos propios, no grabaciones de los juegos.
- **Móvil (≤ 860 px): versión simple**, sin música ni efectos (lo pidió el usuario: allí casi no se usa).