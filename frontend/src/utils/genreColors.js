// Todos los libros comparten la misma estética "rosa palo" armoniosa con el
// púrpura de la app (botones, links). Se deja como función (en vez de una
// constante suelta) por si más adelante se quiere volver a variar por
// género u otro criterio.
const SPINE_BG = "#A67C8D"; // rosa palo con toque morado
const GOLD = "#D9BFC9"; // filete lila-rosado
const CREAM = "#FFF7F5"; // texto marfil cálido

export function colorForGenre() {
  return { bg: SPINE_BG, gold: GOLD, text: CREAM };
}
