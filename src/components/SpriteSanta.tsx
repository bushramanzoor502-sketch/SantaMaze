import { asset } from '../lib/env';
import './SpriteSanta.css';

export type Facing = 'up' | 'right' | 'down' | 'left';
const ROW: Record<Facing, number> = { up: 0, right: 1, down: 2, left: 3 };

interface Props {
  coat?: 'red' | 'blue' | 'green' | 'black';
  anim?: 'idle' | 'walk';
  facing?: Facing;
  /** Rendered size in px (frames are square). */
  size?: number | string;
  className?: string;
  label?: string;
  playing?: boolean;
}

/**
 * Plays one of the game's own sprite sheets (8 frames x 4 directions) with a
 * CSS steps() animation. Frame timings follow the game's JSON: idle 300ms,
 * walk 100ms.
 */
export function SpriteSanta({ coat = 'red', anim = 'idle', facing = 'down', size = 160, className = '', label, playing = true }: Props) {
  const style = {
    '--sheet': `url(${asset(`characters/${coat}/${anim}.webp`)})`,
    '--row': ROW[facing],
    '--size': typeof size === 'number' ? `${size}px` : size,
    '--dur': anim === 'idle' ? '2.4s' : '0.8s',
  } as React.CSSProperties;
  return (
    <div
      className={`sprite-santa ${playing ? 'is-playing' : ''} ${className}`}
      style={style}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    />
  );
}
