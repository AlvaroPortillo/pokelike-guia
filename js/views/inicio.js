import { esc, pd } from '../util.js';

export default {
  render(d) {
    const n = d.nodes;
    const c = d.constants;
    const totalAch = d.achievements.reduce((s, a) => s + (a.reward || 0), 0);
    const fill = (s, v) => esc(String(s).replace(/\{n\}/g, v));
    return `
<header class="hero">
  <div class="hero__txt">
    <h1>Guía para completar <span>Pokelike</span></h1>
    <p class="hero__lede">Todo lo necesario para pasarse la <strong>Historia</strong> y la <strong>Torre Batalla</strong>, los <strong>Desafíos</strong>, las <strong>Megaevoluciones</strong> y el <strong>Pokésort</strong> diario. Los nombres salen tal cual aparecen con el juego en español.</p>
    <nav class="hero-menu" aria-label="Secciones de la guía">
      <ul>
        <li><a href="#/historia">Historia <small>6 regiones</small></a></li>
        <li><a href="#/torre">Torre Batalla <small>7 fases</small></a></li>
        <li><a href="#/desafios">Desafíos <small>${d.challenges.length}</small></a></li>
        <li><a href="#/megas">Megas <small>${d.megas.length}</small></a></li>
        <li><a href="#/pokesort">Pokésort <small>diario</small></a></li>
        <li><a href="#/logros">Logros <small>${d.achievements.length}</small></a></li>
        <li><a href="#/rasgos">Rasgos <small>de tipo</small></a></li>
        <li><a href="#/progreso">Mi progreso</a></li>
      </ul>
    </nav>
  </div>
  <div class="hero__gengar" aria-hidden="true">
    <img src="assets/gengar-amarillo.png" alt="" width="56" height="56">
    <span class="hero__shadow"></span>
  </div>
</header>

<div class="cols">
<div>
  <h2 id="partida">Cómo es una partida</h2>
  <p>Pokelike es un roguelike: cada partida empieza de cero con un inicial a nivel ${c.starterLevel} y recorre <strong>9 mapas</strong>. Los 8 primeros acaban en un <strong>Líder de Gimnasio</strong> y el noveno es la <strong>Liga</strong> (Alto Mando y Campeón). Si te debilitan a todo el equipo, pierdes la partida, pero lo desbloqueado (logros, Pokédex, Salón de la Fama) se queda.</p>
  <p>Cada mapa es una red de casillas por capas: eliges el camino y cada casilla te da algo. Lo que dice el juego de cada una:</p>
  <ul>
    <li><strong>${esc(n.catchPokemon)}</strong>: eliges uno de varios Pokémon para tu equipo.</li>
    <li><strong>${fill(n.wildBattle, 1)}</strong> y <strong>${fill(n.trainerBattle, 'N')}</strong>: ganas niveles para todo el equipo.</li>
    <li><strong>${esc(n.item)}</strong>: un objeto (bolsa de hasta ${c.maxBag}; pasivas activas a la vez: hasta ${c.maxPassives}).</li>
    <li><strong>${esc(n.randomEvent)}</strong> (casilla «?»): puede salir de todo.</li>
    <li><strong>${esc(n.pokemonCenter)}</strong>: cura al equipo.</li>
    <li><strong>${esc(n.tradeNode).replace('{n}', 'N')}</strong>.</li>
    <li><strong>${esc(n.martNode)}</strong>.</li>
    <li><strong>${esc(n.legendary)}</strong>: aparece a veces; vale la pena casi siempre.</li>
  </ul>
  <p>Los combates son automáticos: lo que tú decides es <strong>qué Pokémon llevas, con qué objetos y en qué orden</strong> (antes de la Liga el juego te deja «Elegir tu Orden» arrastrando a tus Pokémon). Por eso lo que más importa es llegar a cada jefe con nivel suficiente y con tipos que le hagan daño supereficaz.</p>

  <h2 id="orden">En qué orden se desbloquea todo</h2>
  <ol class="steps">
    <li><strong>Historia · Kanto.</strong> Es lo primero que hay abierto. Elige «Clásico» (sin muerte permanente). Al ganarla se abren Johto y la Torre Batalla. <a href="#/historia/1">Ver guía de Kanto</a>.</li>
    <li><strong>Torre Batalla · Fase 1 (Kanto).</strong> «Supera el modo Historia para desbloquear». Al superar la Fase 1 se abre el <strong>Modo Desafío</strong>. <a href="#/torre/1">Ver Fase 1</a>.</li>
    <li><strong>Resto de regiones de la Historia</strong> (Johto, Hoenn, Sinnoh, Teselia, Kalos) y <strong>Fases 2 a 7 de la Torre</strong>. Cada fase superada sube también el límite de entrenamiento de EV en la Tienda.</li>
    <li><strong>Megaevoluciones.</strong> El Mega Bracelet se consigue al superar la <strong>Torre de Kalos (Fase 6)</strong>; las Mega Stones de ORAS, al superar la <strong>Fase 7</strong>. <a href="#/megas">Ver megas</a>.</li>
    <li><strong>Desafíos, Pokésort y logros</strong> para ir sacando dinero y completar el juego. Los logros dan en total <strong>${pd(totalAch)}</strong>.</li>
  </ol>

  <h2 id="consejos">Consejos para quien empieza</h2>
  <ul>
    <li><strong>Mira el jefe del mapa antes de elegir camino.</strong> En cada región de esta guía tienes el equipo y los niveles de cada líder, y qué tipos le hacen daño.</li>
    <li><strong>Prioriza niveles antes de cada jefe.</strong> Los combates contra entrenadores dan más niveles que los salvajes.</li>
    <li><strong>No llenes el equipo de un solo tipo.</strong> Cubre los tipos de los jefes que vienen; cada región trae un equipo sugerido calculado para eso.</li>
    <li><strong>Usa el Centro Pokémon si llegas tocado</strong> al último tramo antes del líder.</li>
    <li><strong>Coge el Huevo Suerte en cuanto salga</strong>: «30% de prob.: el portador gana +1 nivel extra tras cada combate». Es lo que más recomienda la comunidad para la primera partida (<a href="https://pokelike-guide.fr/es/basics/getting-started/" rel="noopener">pokelike-guide.fr</a>). Dáselo al Pokémon que más vaya a pelear.</li>
    <li><strong>Aprovecha los rasgos de tipo</strong>: dos o más Pokémon con un tipo en común activan una mejora para todo el equipo. Ver <a href="#/rasgos">Rasgos</a>.</li>
    <li><strong>Para ir más rápido</strong>, la comunidad recomienda activar en <strong>Ajustes → Saltar Automático</strong> las opciones «Todos los combates» y «Evoluciones».</li>
    <li><strong>Marca lo que vas haciendo</strong> en cada sección, o importa tu progreso del juego desde <a href="#/progreso">Mi progreso</a>.</li>
  </ul>

  <h2 id="niveles">Cómo subir niveles (lo que más falla al empezar)</h2>
  <p>El consejo que más se repite en la comunidad es «sube más niveles». En la práctica:</p>
  <ul>
    <li><strong>Antes de elegir camino, mira todo el mapa</strong> y coge la ruta con más combates contra entrenadores. Si el primer mapa sale malo, reinicia: no pierdes nada.</li>
    <li><strong>Referencia:</strong> si tu inicial llega a <strong>Nv. 36 antes del 3.er gimnasio</strong>, vas bien.</li>
    <li><strong>No cojas Pokémon de más.</strong> Un buen ritmo: el inicial, la Poké Ball de arriba a la izquierda de las rutas 1, 3, 8 y 9, y uno de una casilla «?». Evita capturar en los mapas 2 y 7: en el siguiente salen con un ataque más fuerte.</li>
    <li><strong>Dos MT pronto</strong> para tu Pokémon principal (una tercera para el de apoyo, nunca más de cuatro).</li>
    <li><strong>Pocos objetos:</strong> como mucho 5 antes de la ruta 9, y nada que dependa de la suerte (retroceso, críticos…). Una Lupa basta.</li>
    <li><strong>No pares en todos los Centros Pokémon</strong>, sobre todo si llevas Restos: esos 1 o 2 niveles extra se acumulan.</li>
    <li><strong>No arriesgues al final.</strong> Si ya tienes tu equipo para la Liga, no te juegues la partida por una Master Ball o un Entrenador Guay.</li>
  </ul>
  <p><small class="muted">Fuente: «How to get levels», de blooddealer, en el <a href="https://discord.com/channels/1493295201597264044/1544947178479423498" rel="noopener">Discord oficial</a> (pide cuenta). Escrita para Johto, vale igual para las demás regiones.</small></p>

  <h2 id="faq">Preguntas frecuentes</h2>
  <dl class="faq">
    <dt>¿Cómo desbloqueo un Pokémon como inicial?</dt>
    <dd>Gana una partida con él en el equipo y regístralo en el Salón de la Fama (con legendarios no vale), o cómpralo en huevo en la Tienda Poké (ahí sí hay legendarios, pero no salen Celebi, Jirachi, Shaymin, Victini ni Hoopa). Los Pokémon que te dan algunas pasivas del Modo Desafío, las que cambian tu equipo por Pokémon al azar o te dan un legendario (Star Piece, Comet Shard, Legends Call), no se desbloquean.</dd>
    <dt>¿Qué significa la Poké Ball o la Super Ball en las capturas?</dt>
    <dd>Poké Ball: ya lo tienes en la Pokédex, pero aún no es inicial. Super Ball: ya puedes empezar con él. A veces los variocolor salen con Poké Ball por error.</dd>
    <dt>¿Dónde encuentro el Pokémon que quiero?</dt>
    <dd>En la Pokédex del juego (arriba a la derecha): cada Pokémon dice en qué mapas sale su línea evolutiva, en Historia y en la Torre.</dd>
    <dt>He olvidado la contraseña de mi cuenta</dt>
    <dd>No se puede cambiar desde el juego. Abre un ticket en el canal <em>bugs-and-ideas</em> del Discord oficial con la etiqueta «Password Reset» y capturas que prueben que la cuenta es tuya. Nunca pongas la contraseña en el mensaje. Al iniciar sesión, usuario y contraseña distinguen mayúsculas.</dd>
    <dt>¿Se puede instalar como app?</dt>
    <dd>No hay app oficial. En el móvil, abre pokelike.xyz en Chrome → menú ⋮ → «Añadir a pantalla de inicio».</dd>
  </dl>
  <p><small class="muted">Fuente: canales <em>faq</em> y <em>wiki</em> del Discord oficial (leídos el 13-11-2026).</small></p>

  <h2 id="comunidad">Comunidad oficial</h2>
  <p>El único dominio real del juego es <strong>pokelike.xyz</strong>: hay muchas copias con nombres parecidos. Los enlaces oficiales son:</p>
  <ul>
    <li><a href="https://pokelike.xyz" rel="noopener">pokelike.xyz</a>: el juego.</li>
    <li><a href="https://discord.gg/YsakfWStYq" rel="noopener">Discord oficial</a>: anuncios de cada parche, pistas diarias del Pokésort y guías de jugadores (en inglés, con un canal en español).</li>
    <li><a href="https://www.reddit.com/r/Pokelike/" rel="noopener">r/Pokelike</a> en Reddit.</li>
  </ul>

  <h2 id="probabilidades">Variocolor y Aurora</h2>
  <p>Cada Pokémon que aparece tiene un <strong>1 %</strong> de ser variocolor (2 % con el Amuleto Iris), y algunos son <strong>Aurora</strong>, aún más raros. Además de ser raros, refuerzan los rasgos de tipo. Lo tienes explicado, con las probabilidades, en <a href="#/variocolor">Variocolor y Aurora</a>.</p>
</div>

<aside class="toc panel" aria-label="En esta página">
  <h3>En esta página</h3>
  <ol>
    <li><a href="#partida" data-local>Cómo es una partida</a></li>
    <li><a href="#orden" data-local>Orden de desbloqueo</a></li>
    <li><a href="#consejos">Consejos para empezar</a></li>
    <li><a href="#niveles">Cómo subir niveles</a></li>
    <li><a href="#faq">Preguntas frecuentes</a></li>
    <li><a href="#comunidad">Comunidad oficial</a></li>
    <li><a href="#probabilidades">Variocolor y Aurora</a></li>
  </ol>
</aside>
</div>`;
  },
  mount(root) {
    // Los enlaces internos de la página (#id) no deben cambiar de sección.
    root.querySelectorAll('.toc a[href^="#"]:not([href^="#/"])').forEach((a) => {
      a.addEventListener('click', (ev) => {
        ev.preventDefault();
        document.getElementById(a.getAttribute('href').slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  },
};
