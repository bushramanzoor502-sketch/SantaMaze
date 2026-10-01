// Gameplay facts, taken from the game's source. Quoted strings are the
// game's own on-screen text.

export const loop = [
  {
    step: '01',
    title: 'Steer Santa',
    body: 'Use the on-screen joystick, swipe anywhere on the board, or both at once. Push the stick further and Santa breaks from a walk into a run, then a sprint.',
    hint: 'Use the stick to move',
  },
  {
    step: '02',
    title: 'Collect every gift',
    body: 'Gifts are spread along the whole maze — roughly one for every eight cells — so every corner is worth exploring. The counter fills as you go.',
    hint: '0/12',
  },
  {
    step: '03',
    title: 'The gate unlocks',
    body: 'The exit is a locked door that stays sealed until the very last gift is picked up. Then it opens — and it always sits at the cell furthest from where you started.',
    hint: 'Gate unlocked! Reach the door',
  },
  {
    step: '04',
    title: 'Beat the par time',
    body: 'Santa glides inside, the doors swing shut and your time is shown. Finish inside par for three stars, within one and a half times par for two.',
    hint: 'Level Complete',
  },
];

export const controls = [
  { name: 'Joystick', detail: 'The default. An on-screen thumbstick you can move anywhere on the screen.' },
  { name: 'Swipe', detail: 'Drag anywhere on the board to steer.' },
  { name: 'Both', detail: 'Stick and swipe together — use whichever your thumb reaches first.' },
];

export const settings = [
  'Music on / off',
  'Music volume',
  'Gift pickup sound',
  'Haptic feedback',
  'Control mode — Joystick, Swipe or Both',
  'Joystick sensitivity (55% – 175%)',
  'Joystick position',
];

export const stars = [
  { stars: 3, rule: 'At or under par time' },
  { stars: 2, rule: 'Within 1.5× par' },
  { stars: 1, rule: 'Any finish' },
];
