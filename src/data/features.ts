// Confirmed features only. Each one maps to something in the game's code.

export interface Feature {
  id: string;
  kicker: string;
  title: string;
  body: string;
  image: string;
  alt: string;
}

export const features: Feature[] = [
  {
    id: 'endless',
    kicker: 'Endless levels',
    title: 'Mazes that keep growing',
    body: 'There is no last level. Every world builds a fresh maze for each step of its ladder, adding rows and columns as you climb and steadily closing the shortcuts, until it reaches its hardest settings at level 24 — and then keeps going.',
    image: 'maps/winter-forest',
    alt: 'Top-down view of a Winter Forest maze with snowy paths winding between pines',
  },
  {
    id: 'steer',
    kicker: 'Three ways to steer',
    title: 'Joystick, swipe — or both',
    body: 'Pick the control style that suits your thumbs. Tune the joystick sensitivity and drag it to wherever feels natural; the game remembers where you left it.',
    image: 'scenes/gameplay-hud',
    alt: 'Gameplay screen showing Santa in a hedge maze, the gift counter and the “Drag to move Santa” hint',
  },
  {
    id: 'bumps',
    kicker: 'Feel every corner',
    title: 'Speed has consequences',
    body: 'Clip a wall at speed and Santa stumbles. Hit one flat out and he goes down in a burst of snow, dusts himself off and gets back up — with a thump you can feel through haptic feedback.',
    image: 'maps/workshop',
    alt: "Top-down view of a Santa's Workshop maze with cobbled paths and holly hedges",
  },
  {
    id: 'seeded',
    kicker: 'Fair for everyone',
    title: 'The same maze on every phone',
    body: 'Each level is generated from a fixed seed, so level 7 of the Ice Castle is the same maze for every player — and replaying a level puts you back in exactly the layout you were solving.',
    image: 'maps/ice-castle',
    alt: 'Top-down view of an Ice Castle maze with ice paths and crystal pillars',
  },
  {
    id: 'offline',
    kicker: 'Play anywhere',
    title: 'Offline. No ads.',
    body: 'The game needs no internet connection and shows no ads. Your progress, gifts and settings are saved on your device.',
    image: 'maps/snowy-village',
    alt: 'Top-down view of a Snowy Village maze with lanterns, gifts and Christmas trees',
  },
];
