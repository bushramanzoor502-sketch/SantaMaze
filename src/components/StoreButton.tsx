import { site } from '../data/site';
import { PlayStore } from './Icons';

/**
 * The primary "get the game" CTA. Until a Play Store URL is set in
 * data/site.ts it reads "Coming soon" instead of linking anywhere.
 */
export function StoreButton({ className = '' }: { className?: string }) {
  if (site.playStoreUrl) {
    return (
      <a className={`btn ${className}`} href={site.playStoreUrl} rel="noopener" target="_blank">
        <PlayStore />
        Get it on Google Play
      </a>
    );
  }
  return (
    <span className={`btn ${className}`} role="note" aria-disabled="true" title="The Google Play link will be added at launch">
      <PlayStore />
      Coming soon to Google Play
    </span>
  );
}
