/**
 * My rune: eight hand-cut lines from a centre, each ending in a drilled
 * dot, the way it's carved on the stone (and tattooed, as loops, on my arm).
 * The angles and lengths are uneven on purpose, like the carving.
 */
const CUTS = [
  [-112, 0.78],
  [-80, 0.82],
  [-38, 0.76],
  [-4, 0.8],
  [40, 0.77],
  [88, 0.83],
  [140, 0.79],
  [196, 0.8],
] as const;

const at = (degrees: number, radius: number) => {
  const a = (degrees * Math.PI) / 180;
  return {
    x: +(50 + Math.cos(a) * radius * 50).toFixed(2),
    y: +(50 + Math.sin(a) * radius * 50).toFixed(2),
  };
};

/** In a 100×100 box: where each line ends and where its dot sits. */
export const RUNE = CUTS.map(([degrees, length]) => ({
  end: at(degrees, length - 0.12),
  dot: at(degrees, length),
}));
