// The four worlds, as defined in the game's cpp/game/GameData.cpp.
// Subtitles are the game's own; "character" paraphrases the tuning comments.

export interface World {
  id: string;
  index: number;
  name: string;
  subtitle: string;
  character: string;
  description: string;
  /** Relative difficulty from the code comments: 1 gentlest … 4 hardest. */
  difficulty: 1 | 2 | 3 | 4;
  difficultyLabel: string;
  startSize: [rows: number, cols: number];
  maxSize: [rows: number, cols: number];
  /** Fraction of dead ends reopened into loops at level 1 → level 24. */
  braid: [number, number];
  accent: string;
  /** Colours for the 3D diorama when themed for this world. */
  palette: { wall: string; cap: string; ground: string; water: string };
}

export const worlds: World[] = [
  {
    id: 'snowy-village',
    index: 1,
    name: 'Snowy Village',
    subtitle: 'Where every window glows',
    character: 'The gentle one',
    description:
      'Lantern-lit lanes, cottages and Christmas trees. The village grows slowly and forgives longest — the place to find your feet.',
    difficulty: 1,
    difficultyLabel: 'Gentle',
    startSize: [6, 11],
    maxSize: [12, 21],
    braid: [0.34, 0.1],
    accent: '#FFC928',
    palette: { wall: '#c98a5a', cap: '#f4faff', ground: '#e9dcc9', water: '#8fd3ff' },
  },
  {
    id: 'winter-forest',
    index: 2,
    name: 'Winter Forest',
    subtitle: 'Quiet pines, deep drifts',
    character: 'Tighter corridors sooner',
    description:
      'Snowy paths wind between tall pines, log cabins and frozen ponds. The corridors close in sooner than in the village.',
    difficulty: 2,
    difficultyLabel: 'Steady',
    startSize: [7, 13],
    maxSize: [13, 23],
    braid: [0.28, 0.06],
    accent: '#15965F',
    palette: { wall: '#2f6b4a', cap: '#f4faff', ground: '#dfe9f2', water: '#7cc4f0' },
  },
  {
    id: 'ice-castle',
    index: 3,
    name: 'Ice Castle',
    subtitle: 'Halls of frozen light',
    character: 'The hardest',
    description:
      'Crystal halls and glowing ice. The castle starts bigger, grows fastest and stops forgiving altogether — by its late levels every dead end stays a dead end.',
    difficulty: 4,
    difficultyLabel: 'Hardest',
    startSize: [8, 17],
    maxSize: [15, 27],
    braid: [0.16, 0],
    accent: '#29C7FF',
    palette: { wall: '#7fb8e8', cap: '#ffffff', ground: '#dcecff', water: '#5fb8ff' },
  },
  {
    id: 'workshop',
    index: 4,
    name: "Santa's Workshop",
    subtitle: 'Where it all gets made',
    character: 'Big yards, unforgiving late',
    description:
      'Holly hedges, cobbled yards and warm workshop lights. Roomy at first — and unforgiving once you climb its ladder.',
    difficulty: 3,
    difficultyLabel: 'Tricky',
    startSize: [7, 15],
    maxSize: [14, 25],
    braid: [0.22, 0.03],
    accent: '#D71932',
    palette: { wall: '#2c6e45', cap: '#f4faff', ground: '#e4d6c4', water: '#8fd3ff' },
  },
];

/** Levels it takes a world to reach its hardest settings (kCurveLength). */
export const CURVE_LENGTH = 24;
