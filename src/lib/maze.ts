// A TypeScript port of the game's maze generator (cpp/game/MazeGenerator.cpp)
// and its xorshift32 PRNG (cpp/core/Random.h). Same seed, same draw order,
// same rules: randomised iterative DFS from an edge cell, optional braiding of
// dead ends, the goal at the furthest reachable cell, gifts spread at an even
// stride along breadth-first order. Ice zones are left out — the game ships
// with them switched off.

export const Dir = { Up: 1, Down: 2, Left: 4, Right: 8 } as const;
export type Dir = (typeof Dir)[keyof typeof Dir];

const ALL = [Dir.Up, Dir.Down, Dir.Left, Dir.Right] as const;
const dRow = (d: Dir) => (d === Dir.Up ? -1 : d === Dir.Down ? 1 : 0);
const dCol = (d: Dir) => (d === Dir.Left ? -1 : d === Dir.Right ? 1 : 0);
const opposite = (d: Dir): Dir =>
  d === Dir.Up ? Dir.Down : d === Dir.Down ? Dir.Up : d === Dir.Left ? Dir.Right : Dir.Left;

export class Random {
  private s: number;
  constructor(seed = 0x9e3779b9) {
    this.s = seed >>> 0 || 0x9e3779b9;
  }
  next(): number {
    let s = this.s;
    s = (s ^ (s << 13)) >>> 0;
    s = (s ^ (s >>> 17)) >>> 0;
    s = (s ^ (s << 5)) >>> 0;
    this.s = s;
    return s;
  }
  nextFloat(): number {
    return Math.fround((this.next() >>> 8) * (1 / 16777216));
  }
  range(lo: number, hi: number): number {
    return Math.fround(lo + this.nextFloat() * (hi - lo));
  }
  nextInt(bound: number): number {
    if (bound <= 0) return 0;
    return this.next() % bound;
  }
}

export interface Maze {
  rows: number;
  cols: number;
  /** Bitmask of open directions per cell (Dir flags). */
  open: Uint8Array;
  gift: Uint8Array;
  distance: Uint16Array;
  start: number;
  goal: number;
  giftCount: number;
  /** Cells in breadth-first (distance) order from the start. */
  order: number[];
}

export function canMove(m: Maze, cell: number, d: Dir): boolean {
  return (m.open[cell] & d) !== 0;
}

export function neighbour(m: Maze, cell: number, d: Dir): number {
  return cell + dRow(d) * m.cols + dCol(d);
}

function bfs(m: Maze): number[] {
  const n = m.rows * m.cols;
  const seen = new Uint8Array(n);
  const queue = [m.start];
  seen[m.start] = 1;
  m.distance[m.start] = 0;
  for (let head = 0; head < queue.length; head++) {
    const cur = queue[head];
    const r = Math.floor(cur / m.cols);
    const c = cur % m.cols;
    for (const d of ALL) {
      if (!canMove(m, cur, d)) continue;
      const nr = r + dRow(d);
      const nc = c + dCol(d);
      const ni = nr * m.cols + nc;
      if (seen[ni]) continue;
      seen[ni] = 1;
      m.distance[ni] = m.distance[cur] + 1;
      queue.push(ni);
    }
  }
  return queue;
}

export function generate(
  rows: number,
  cols: number,
  seed: number,
  giftTarget: number,
  braidChance = 0,
  /** Optional: receives every carve in order, tagged by stage. */
  trace?: { cell: number; dir: Dir; stage: 'carve' | 'braid' }[],
): Maze {
  rows = Math.max(1, rows);
  cols = Math.max(1, cols);
  const n = rows * cols;
  const m: Maze = {
    rows,
    cols,
    open: new Uint8Array(n),
    gift: new Uint8Array(n),
    distance: new Uint16Array(n),
    start: 0,
    goal: 0,
    giftCount: 0,
    order: [],
  };
  const rnd = new Random(seed);
  const inBounds = (r: number, c: number) => r >= 0 && r < rows && c >= 0 && c < cols;
  let stage: 'carve' | 'braid' = 'carve';
  const carve = (cell: number, d: Dir) => {
    trace?.push({ cell, dir: d, stage });
    m.open[cell] |= d;
    m.open[neighbour(m, cell, d)] |= opposite(d);
  };

  // Seeded start on the outer ring — drawn first, exactly as the game does.
  const vertical = rnd.nextInt(2) === 0;
  const sr = vertical ? rnd.nextInt(rows) : rnd.nextInt(2) === 0 ? 0 : rows - 1;
  const sc = vertical ? (rnd.nextInt(2) === 0 ? 0 : cols - 1) : rnd.nextInt(cols);
  m.start = sr * cols + sc;

  // Randomised iterative depth-first search.
  const visited = new Uint8Array(n);
  visited[m.start] = 1;
  const stack = [m.start];
  while (stack.length) {
    const cur = stack[stack.length - 1];
    const r = Math.floor(cur / cols);
    const c = cur % cols;
    const cand: Dir[] = [];
    for (const d of ALL) {
      const nr = r + dRow(d);
      const nc = c + dCol(d);
      if (!inBounds(nr, nc) || visited[nr * cols + nc]) continue;
      cand.push(d);
    }
    if (!cand.length) {
      stack.pop();
      continue;
    }
    const d = cand[rnd.nextInt(cand.length)];
    carve(cur, d);
    const next = neighbour(m, cur, d);
    visited[next] = 1;
    stack.push(next);
  }

  // Braiding: reopen some dead ends into loops.
  stage = 'braid';
  if (braidChance > 0) {
    const chance = Math.fround(braidChance);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cell = r * cols + c;
        let exits = 0;
        let openDir: Dir | 0 = 0;
        for (const d of ALL) {
          if (canMove(m, cell, d)) {
            exits++;
            openDir = d;
          }
        }
        if (exits !== 1) continue;
        if (rnd.nextFloat() >= chance) continue;
        const cand: Dir[] = [];
        for (const d of ALL) {
          if (d === openDir) continue;
          if (!inBounds(r + dRow(d), c + dCol(d))) continue;
          cand.push(d);
        }
        if (cand.length) carve(cell, cand[rnd.nextInt(cand.length)]);
      }
    }
  }

  // Goal: the furthest reachable cell.
  m.order = bfs(m);
  m.goal = m.order[m.order.length - 1];

  // Gifts at an even, jittered stride along distance order.
  const placeable = Math.max(0, m.order.length - 2);
  const wanted = Math.min(Math.max(giftTarget, 0), placeable);
  let placed = 0;
  if (wanted > 0 && placeable > 0) {
    const stride = Math.fround(placeable / wanted);
    for (let i = 0; i < wanted; i++) {
      const jitter = rnd.range(0.15, 0.85);
      let slot = Math.trunc(Math.fround((i + jitter) * stride));
      slot = Math.min(Math.max(slot, 1), placeable);
      const cell = m.order[slot];
      if (cell === m.goal || cell === m.start || m.gift[cell]) continue;
      m.gift[cell] = 1;
      placed++;
    }
  }
  m.giftCount = placed;
  return m;
}

/** Shortest route between two cells (BFS over open passages). */
export function path(m: Maze, from: number, to: number): number[] {
  const prev = new Int32Array(m.rows * m.cols).fill(-1);
  prev[from] = from;
  const q = [from];
  for (let h = 0; h < q.length; h++) {
    const cur = q[h];
    if (cur === to) break;
    for (const d of ALL) {
      if (!canMove(m, cur, d)) continue;
      const nx = neighbour(m, cur, d);
      if (prev[nx] !== -1) continue;
      prev[nx] = cur;
      q.push(nx);
    }
  }
  const out: number[] = [];
  for (let c = to; c !== from; c = prev[c]) {
    if (c < 0) return [];
    out.push(c);
  }
  out.push(from);
  return out.reverse();
}

/**
 * A route that starts at the start, visits every gift (nearest-first) and
 * ends at the goal — the order a tidy player would collect them in.
 */
export function tour(m: Maze): number[] {
  const remaining = new Set<number>();
  m.gift.forEach((g, i) => g && remaining.add(i));
  const route: number[] = [m.start];
  let cur = m.start;
  while (remaining.size) {
    let best = -1;
    let bestPath: number[] = [];
    for (const g of remaining) {
      const p = path(m, cur, g);
      if (best === -1 || p.length < bestPath.length) {
        best = g;
        bestPath = p;
      }
    }
    route.push(...bestPath.slice(1));
    remaining.delete(best);
    cur = best;
  }
  route.push(...path(m, cur, m.goal).slice(1));
  return route;
}

/** The game's per-level seed: splitmix32, mixed twice (GameData.cpp). */
export function levelSeed(mapId: number, level: number): number {
  const mix = (v: number) => {
    v = (v + 0x9e3779b9) >>> 0;
    v = (v ^ (v >>> 16)) >>> 0;
    v = Math.imul(v, 0x21f0aaad) >>> 0;
    v = (v ^ (v >>> 15)) >>> 0;
    v = Math.imul(v, 0x735a2d97) >>> 0;
    v = (v ^ (v >>> 15)) >>> 0;
    return v;
  };
  return mix((mix(Math.imul(mapId, 0x9e3779b9) >>> 0) ^ level) >>> 0);
}
