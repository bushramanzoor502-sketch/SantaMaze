import { asset, srcSet } from '../lib/env';

interface Props {
  /** Asset name without the -<width>.webp suffix, e.g. "worlds/ice-castle". */
  name: string;
  widths: number[];
  sizes: string;
  alt: string;
  className?: string;
  priority?: boolean;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}

/** Responsive image for assets exported at several widths. */
export function Picture({ name, widths, sizes, alt, className, priority, width, height, style }: Props) {
  const fallback = widths[Math.min(1, widths.length - 1)];
  return (
    <img
      className={className}
      src={asset(`${name}-${fallback}.webp`)}
      srcSet={srcSet(name, widths)}
      sizes={sizes}
      alt={alt}
      width={width}
      height={height}
      style={style}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      {...(priority ? { fetchPriority: 'high' as const } : {})}
    />
  );
}
