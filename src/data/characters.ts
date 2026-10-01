// The four Santas from cpp/game/GameData.cpp. In the game they are one Santa in
// four coats: all unlocked from the start, chosen purely for looks.

export interface Character {
  id: string;
  name: string;
  coat: string;
  folder: 'red' | 'blue' | 'green' | 'black';
  blurb: string;
  color: string;
  glow: string;
}

export const characters: Character[] = [
  {
    id: 'classic',
    name: 'Classic Santa',
    coat: 'Red',
    folder: 'red',
    blurb: 'The suit everyone knows — red velvet, white trim and a sack full of gifts.',
    color: '#D71932',
    glow: 'rgba(215, 25, 50, .45)',
  },
  {
    id: 'frost',
    name: 'Frost Santa',
    coat: 'Blue',
    folder: 'blue',
    blurb: 'An icy-blue coat that looks right at home in the halls of the Ice Castle.',
    color: '#2C7FD0',
    glow: 'rgba(41, 199, 255, .45)',
  },
  {
    id: 'evergreen',
    name: 'Evergreen Santa',
    coat: 'Green',
    folder: 'green',
    blurb: 'Pine-green and ready to slip between the trees of the Winter Forest.',
    color: '#15965F',
    glow: 'rgba(21, 150, 95, .45)',
  },
  {
    id: 'midnight',
    name: 'Midnight Santa',
    coat: 'Black',
    folder: 'black',
    blurb: 'A coat as dark as the night sky over the village, trimmed in snow white.',
    color: '#2a3550',
    glow: 'rgba(160, 180, 220, .35)',
  },
];

/** Animations each Santa has in the game (6 animations x 4 directions x 8 frames). */
export const animations = ['Idle', 'Walk', 'Run', 'Wall hit', 'Fall', 'Stand up'];
