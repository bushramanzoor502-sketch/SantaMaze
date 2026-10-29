import { site } from '../data/site';
import { PlayStore } from './Icons';

/** The primary "get the game" CTA, linking to the Google Play listing. */
export function StoreButton({ className = '' }: { className?: string }) {
  return (
    <a className={`btn ${className}`} href={site.playStoreUrl} rel="noopener" target="_blank">
      <PlayStore />
      Get it on Google Play
    </a>
  );
}
