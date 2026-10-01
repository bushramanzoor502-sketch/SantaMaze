// Small inline icons. Decorative by default (aria-hidden).

type P = { className?: string };
const base = { 'aria-hidden': true, focusable: false } as const;

export const ArrowRight = ({ className }: P) => (
  <svg {...base} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const ArrowDown = ({ className }: P) => (
  <svg {...base} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14M6 13l6 6 6-6" />
  </svg>
);

export const Chevron = ({ className, dir = 'right' }: P & { dir?: 'left' | 'right' }) => (
  <svg {...base} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d={dir === 'right' ? 'M9 5l7 7-7 7' : 'M15 5l-7 7 7 7'} />
  </svg>
);

export const PlayStore = ({ className }: P) => (
  <svg {...base} className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M4.2 2.6c-.3.3-.4.7-.4 1.2v16.4c0 .5.2.9.4 1.2l.1.1L13.5 12v-.2L4.3 2.5l-.1.1z" />
    <path d="M16.6 15.1l-3.1-3.1v-.2l3.1-3.1.1.1 3.6 2.1c1 .6 1 1.6 0 2.2l-3.6 2-.1 0z" opacity=".85" />
    <path d="M16.7 15l-3.2-3.1-9.3 9.4c.3.4.9.4 1.6 0l10.9-6.3" opacity=".7" />
    <path d="M16.7 8.9L5.8 2.7c-.7-.4-1.3-.3-1.6 0l9.3 9.2 3.2-3z" opacity=".55" />
  </svg>
);

export const Mail = ({ className }: P) => (
  <svg {...base} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="14" rx="3" />
    <path d="M4 7l8 6 8-6" />
  </svg>
);

export const Menu = ({ className }: P) => (
  <svg {...base} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
    <path d="M4 7h16M4 12h16M4 17h10" />
  </svg>
);

export const Close = ({ className }: P) => (
  <svg {...base} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const Star = ({ className, filled = true }: P & { filled?: boolean }) => (
  <svg {...base} className={className} viewBox="0 0 24 24">
    <path
      d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  </svg>
);

export const Copy = ({ className }: P) => (
  <svg {...base} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="8" y="8" width="12" height="12" rx="2.5" />
    <path d="M16 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h2" />
  </svg>
);

export const Snowflake = ({ className }: P) => (
  <svg {...base} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M12 2v20M3.3 7l17.4 10M3.3 17L20.7 7M9 3.5l3 2.5 3-2.5M9 20.5l3-2.5 3 2.5" />
  </svg>
);
