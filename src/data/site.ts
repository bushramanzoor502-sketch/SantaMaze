// Site-wide settings: names, links and contact details used across every page.

export const site = {
  name: "Santa's Maze Adventure",
  /** The label the app shows under its icon on Android. */
  storeLabel: "Santa's Adventure",
  tagline: 'Collect every gift. Unlock the gate.',
  shortDescription:
    'A cozy Christmas maze game for Android. Guide Santa through four winter worlds, collect every gift to unlock the gate, and race the par time for three stars.',
  email: 'bushramanzoor502@gmail.com',
  developer: 'SaleBazar BD',
  developerUrl: 'https://play.google.com/store/apps/developer?id=SaleBazar+BD',
  country: 'Bangladesh',
  /** Built from the game's applicationId. */
  playStoreUrl: 'https://play.google.com/store/apps/details?id=com.christmas.santa.run.maze.kids',
  privacyLastUpdated: 'October 1, 2026',
} as const;

export const nav = [
  { key: 'home', label: 'Home', path: '' },
  { key: 'about', label: 'About', path: 'about/' },
  { key: 'privacy', label: 'Privacy Policy', path: 'privacy-policy/' },
  { key: 'contact', label: 'Contact Us', path: 'contact/' },
] as const;

export type PageKey = (typeof nav)[number]['key'];
