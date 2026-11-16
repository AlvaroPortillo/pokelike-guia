# Guía Pokelike

Guía en castellano para completar [Pokelike](https://pokelike.xyz), el roguelike de Pokémon de navegador y móvil.

**Ver la guía:** https://alvaroportillo.github.io/pokelike-guia/

## Qué incluye

- **Historia**: las 6 regiones (Kanto, Johto, Hoenn, Sinnoh, Teselia y Kalos). Para cada uno de los 9 mapas: el líder, su equipo con niveles y objetos, los tipos que le hacen daño y los que aguantan sus ataques. También el Alto Mando, el Campeón y un equipo sugerido por región.
- **Torre Batalla**: las 7 fases, con los niveles de cada mapa, las mejores parejas y tríos de tipos para atacar, los mejores tipos para aguantar y los Pokémon más fuertes de cada generación.
- **Rasgos de tipo**: cómo se suben los rangos y qué hace cada rasgo.
- **Desafíos**: los 12 permanentes con consejos, el Monotipo con sus 18 tipos, el diario de hoy y los semanales.
- **Megaevoluciones**: las 48 Mega Stones, cómo se desbloquean, sus tipos, estadísticas y habilidad.
- **Pokésort**: la solución del puzle de hoy, las reglas exactas, la recompensa por racha y un método para resolverlo.
- **Logros**: los 265, con buscador y lo que paga cada uno.
- **Mi progreso**: marca lo que vas haciendo, importa tu progreso desde el juego y expórtalo a un archivo para pasarlo a otro dispositivo.

Los nombres salen tal cual aparecen con el juego en español, incluso los que el juego deja en inglés.

## De dónde salen los datos

- Del propio juego, versión 3.7.1, leído el 16-11-2026 con el idioma en español (jefes de la Torre y rasgos, de la 3.6.3).
- Los equipos sugeridos y las coberturas de tipos están **calculados** con la tabla de tipos y las estadísticas base del juego.
- Los consejos de la comunidad vienen de [pokelike-guide.fr](https://pokelike-guide.fr/es/), enlazada en cada sitio donde se usa.

## Tu progreso

Lo que marcas se guarda solo en tu navegador: cada persona tiene el suyo. Para importar tu progreso del juego, abre la guía en un ordenador y sigue los pasos de **Mi progreso**. Con el juego abierto en el mismo navegador, un marcador copia tus logros y desafíos y la guía los marca sola. No necesita tu cuenta ni tu contraseña.

## Abrirla en tu ordenador

Hace falta un servidor local, porque el navegador no deja cargar los datos abriendo `index.html` con doble clic. Desde la carpeta del proyecto:

```
python -m http.server 5178
```

Luego abre http://127.0.0.1:5178. Es HTML, CSS y JavaScript sin compilación ni dependencias.

## Actualizar los datos cuando salga otra versión del juego

`tools/build-data.js` genera `data/guia.json` a partir de los datos del juego. Cómo se sacan esos datos está explicado en `CLAUDE.md`.

---

Guía de fans sin relación con Pokelike, Nintendo, Game Freak ni The Pokémon Company. Imágenes de Pokémon de [PokeAPI/sprites](https://github.com/PokeAPI/sprites). Fuente DotGothic16 (licencia SIL Open Font).
