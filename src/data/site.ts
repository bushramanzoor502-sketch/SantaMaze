// Site-wide settings. Anything in [brackets] is a placeholder the developer
// still needs to fill in — the game project does not contain this information.

export const site = {
  name: "Santa's Maze Adventure",
  /** The label the app shows under its icon on Android. */
  storeLabel: "Santa's Adventure",
  tagline: 'Collect every gift. Unlock the gate.',
  shortDescription:
    'A cozy Christmas maze game for Android. Guide Santa through four winter worlds, collect every gift to unlock the gate, and race the par time for three stars.',
  email: 'bushramanzoor502@gmail.com',
  developer: '[Developer Name]',
  country: '[Country]',
  /** Set this once the Play Store listing exists. Empty = "Coming soon". */
  playStoreUrl: '',
  socials: [
    { label: 'X (Twitter)', href: '' },
    { label: 'Instagram', href: '' },
    { label: 'YouTube', href: '' },
  ],
  privacyLastUpdated: 'October 1, 2026',
} as const;

export const nav = [
  { key: 'home', label: 'Home', path: '' },
  { key: 'about', label: 'About', path: 'about/' },
  { key: 'privacy', label: 'Privacy Policy', path: 'privacy-policy/' },
  { key: 'contact', label: 'Contact Us', path: 'contact/' },
] as const;

export type PageKey = (typeof nav)[number]['key'];
