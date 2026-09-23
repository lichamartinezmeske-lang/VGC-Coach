# VGC Coach 1.0 — Final

VGC Coach 1.0 reúne el proyecto en una sola versión: Team Coach, construcción de equipos, análisis de jugador/replays, Battle Lab, rangos y una base de batallas online compatible con el simulador de Pokémon Showdown.

## Lo más importante: Team Coach AI

Dentro de **Team Builder**, el Coach analiza el equipo cada vez que agregás o quitás un Pokémon.

Puede:
- detectar el arquetipo aproximado;
- identificar win conditions y funciones reconocibles;
- señalar dependencia de daño físico/especial;
- detectar falta de speed control o soporte;
- advertir sobre respuestas poco claras a Trick Room;
- proponer candidatos para añadir o probar en lugar de una pieza;
- explicar por qué propone cada cambio;
- generar un plan de juego sencillo;
- recalcular todo al cambiar el equipo.

Las recomendaciones son deliberadamente explicables: el motor no presenta una heurística como si fuera una verdad matemática. El siguiente nivel sería alimentar este motor con un dataset de meta actualizado y un modelo externo, pero la versión final funciona sin una API de IA de pago.

## Showdown / Player Engine

VGC Coach consulta los endpoints públicos documentados de Pokémon Showdown para usuarios, ladder y replays. No solicita contraseñas. Las replays pueden recuperarse en JSON y las búsquedas se pueden filtrar por usuario y formato.

## Batallas

La carpeta incluye `server.js`, que crea un servidor Express y un WebSocket de matchmaking y utiliza `BattleStream` de `pokemon-showdown`. El simulador oficial documenta que recibe decisiones de jugadores y devuelve mensajes del protocolo de batalla.

### Requisitos

- Node.js 20+ recomendado.
- Internet para instalar dependencias y consultar recursos externos.

### Ejecutar

```bash
npm install
npm start
```

Abrí:

```text
http://localhost:3000
```

En **Competitivo → Buscar partida Ranked**, dos navegadores conectados al mismo servidor pueden entrar en la cola. La interfaz recibe el protocolo de batalla y crea botones básicos a partir de las solicitudes de elección.

> Nota: el cliente de batalla de esta entrega es una base funcional y deliberadamente simple. Para un servicio público real todavía hay que implementar validación completa de equipos, autenticación, reconexión, moderación, almacenamiento, HTTPS/WSS, rate limiting y una interfaz de batalla completa.

## Publicación

Para una demo estática podés usar GitHub Pages, pero las funciones de matchmaking/combate necesitan un proceso Node.js persistente. Para esas funciones hay que desplegar `server.js` en un servicio que soporte Node/WebSocket.

## Licencias y activos

Pokémon Showdown está distribuido bajo MIT. Revisá el repositorio oficial y las condiciones de los sprites/datos de terceros antes de publicar comercialmente. VGC Coach no es un producto oficial de Pokémon ni de Pokémon Showdown.
