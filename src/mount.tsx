import { createRoot, hydrateRoot } from 'react-dom/client';
import type { ComponentType } from 'react';
import './styles/global.css';

/** Hydrates the prerendered page (build) or renders it fresh (dev). */
export function mount(Page: ComponentType) {
  const root = document.getElementById('root')!;
  if (root.firstElementChild) hydrateRoot(root, <Page />);
  else createRoot(root).render(<Page />);
}
