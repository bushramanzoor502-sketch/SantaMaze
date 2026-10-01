import { useEffect, useRef, useState } from 'react';
import { Dir, generate, levelSeed, type Maze } from '../../lib/maze';
import { prefersReducedMotion } from '../../lib/env';
import './MazeCraft.css';

const STEPS = [
  {
    title: 'Carve',
    body: 'Starting from a random cell on the outer edge, a depth-first search tunnels through the grid until every cell is connected — a “perfect” maze with exactly one route between any two points.',
  },
  {
    title: 'Braid',
    body: 'Some dead ends are knocked through into loops. Early levels get plenty, late ones almost none — that is what makes a world forgiving at first and sharp later on.',
  },
  {
    title: 'Place',
    body: 'The locked gate goes on the cell furthest from the start, and the gifts are spread evenly along the paths — about one for every eight cells.',
  },
];

// Snowy Village, level 10 (9 x 15) — exactly as the game would build it.
const ROWS = 9;
const COLS = 15;
const LEVEL = 10;

/**
 * Animates the game's maze generator step by step on a 2D canvas.
 * Reduced motion: draws the finished maze immediately.
 */
export function MazeCraft() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stage, setStage] = useState(-1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const trace: { cell: number; dir: Dir; stage: 'carve' | 'braid' }[] = [];
    const braid = 0.34 + (0.1 - 0.34) * ((LEVEL - 1) / 24);
    const maze = generate(ROWS, COLS, levelSeed(1, LEVEL), Math.max(4, Math.floor((ROWS * COLS) / 8)), braid, trace);
    const carveCount = trace.filter((t) => t.stage === 'carve').length;

    let raf = 0;
    let started = false;
    let step = 0;
    let holdUntil = 0;

    const draw = (applied: number, showGoal: boolean, highlight: number) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== Math.round(w * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const cs = Math.min(w / (COLS + 1), h / (ROWS + 1));
      const ox = (w - cs * COLS) / 2;
      const oy = (h - cs * ROWS) / 2;

      // Open passages so far.
      const open = new Uint8Array(ROWS * COLS);
      const visited = new Uint8Array(ROWS * COLS);
      visited[maze.start] = 1;
      for (let i = 0; i < applied; i++) {
        const t = trace[i];
        const nb = t.cell + (t.dir === Dir.Up ? -COLS : t.dir === Dir.Down ? COLS : t.dir === Dir.Left ? -1 : 1);
        open[t.cell] |= t.dir;
        open[nb] |= t.dir === Dir.Up ? Dir.Down : t.dir === Dir.Down ? Dir.Up : t.dir === Dir.Left ? Dir.Right : Dir.Left;
        visited[t.cell] = visited[nb] = 1;
      }

      // Path floor for visited cells.
      for (let c = 0; c < ROWS * COLS; c++) {
        if (!visited[c]) continue;
        const x = ox + (c % COLS) * cs;
        const y = oy + Math.floor(c / COLS) * cs;
        ctx.fillStyle = 'rgba(221, 238, 255, 0.16)';
        ctx.fillRect(x, y, cs, cs);
      }
      // Newest carve glows.
      if (highlight >= 0 && highlight < applied) {
        const t = trace[highlight];
        ctx.fillStyle = t.stage === 'braid' ? 'rgba(255, 201, 40, 0.75)' : 'rgba(41, 199, 255, 0.6)';
        ctx.fillRect(ox + (t.cell % COLS) * cs, oy + Math.floor(t.cell / COLS) * cs, cs, cs);
      }

      // Walls (snow ridges).
      ctx.strokeStyle = '#f4faff';
      ctx.lineWidth = Math.max(2, cs * 0.16);
      ctx.lineCap = 'round';
      ctx.beginPath();
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const cell = r * COLS + c;
          const x = ox + c * cs;
          const y = oy + r * cs;
          if (!(open[cell] & Dir.Up)) {
            ctx.moveTo(x, y);
            ctx.lineTo(x + cs, y);
          }
          if (!(open[cell] & Dir.Left)) {
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + cs);
          }
          if (r === ROWS - 1) {
            ctx.moveTo(x, y + cs);
            ctx.lineTo(x + cs, y + cs);
          }
          if (c === COLS - 1) {
            ctx.moveTo(x + cs, y);
            ctx.lineTo(x + cs, y + cs);
          }
        }
      }
      ctx.stroke();

      // Start marker.
      const sx = ox + (maze.start % COLS) * cs + cs / 2;
      const sy = oy + Math.floor(maze.start / COLS) * cs + cs / 2;
      ctx.fillStyle = '#ef3340';
      ctx.beginPath();
      ctx.arc(sx, sy, cs * 0.28, 0, Math.PI * 2);
      ctx.fill();

      if (showGoal) drawGoalAndGifts(ctx, maze, ox, oy, cs);
    };

    const finish = () => {
      draw(trace.length, true, -1);
      setStage(2);
    };

    if (prefersReducedMotion()) {
      finish();
      const onResize = () => draw(trace.length, true, -1);
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }

    draw(0, false, -1);
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (now < holdUntil) return;
      if (step < carveCount) {
        step = Math.min(carveCount, step + 2);
        setStage(0);
        draw(step, false, step - 1);
      } else if (step < trace.length) {
        step++;
        setStage(1);
        draw(step, false, step - 1);
        holdUntil = now + 140;
      } else if (step === trace.length) {
        step++;
        setStage(2);
        draw(trace.length, true, -1);
        holdUntil = now + 4200;
      } else {
        step = 0;
        draw(0, false, -1);
        holdUntil = now + 500;
      }
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started) {
        started = true;
        raf = requestAnimationFrame(tick);
      } else if (!e.isIntersecting && started) {
        started = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(canvas);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="craft section" aria-labelledby="craft-title">
      <div className="container-wide craft__grid">
        <div className="craft__copy">
          <p className="kicker reveal">Under the snow</p>
          <h2 id="craft-title" className="reveal">
            How every maze is made
          </h2>
          <p className="lead reveal">
            No level is drawn by hand. Each one is built from a seed the moment you start it, so the same level is the
            same maze on every phone. This is the game’s own generator, running live: Snowy Village, level {LEVEL}.
          </p>
          <ol className="craft__steps">
            {STEPS.map((s, i) => (
              <li key={s.title} className={`craft__step reveal ${stage === i ? 'is-active' : ''}`}>
                <span className="craft__badge">{i + 1}</span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="craft__board reveal">
          <canvas
            ref={canvasRef}
            className="craft__canvas"
            role="img"
            aria-label={`A ${ROWS} by ${COLS} maze being generated: carved, braided, then given a gate and gifts`}
          />
          <ul className="craft__legend" aria-hidden="true">
            <li>
              <i className="dot dot--start" /> Start
            </li>
            <li>
              <i className="dot dot--gift" /> Gift
            </li>
            <li>
              <i className="dot dot--gate" /> Gate
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function drawGoalAndGifts(ctx: CanvasRenderingContext2D, maze: Maze, ox: number, oy: number, cs: number) {
  const center = (cell: number) => [ox + (cell % maze.cols) * cs + cs / 2, oy + Math.floor(cell / maze.cols) * cs + cs / 2];
  maze.gift.forEach((g, cell) => {
    if (!g) return;
    const [x, y] = center(cell);
    const s = cs * 0.42;
    ctx.fillStyle = '#d71932';
    ctx.fillRect(x - s / 2, y - s / 2, s, s);
    ctx.fillStyle = '#ffc928';
    ctx.fillRect(x - s * 0.08, y - s / 2, s * 0.16, s);
    ctx.fillRect(x - s / 2, y - s * 0.08, s, s * 0.16);
  });
  const [gx, gy] = center(maze.goal);
  ctx.strokeStyle = '#ffc928';
  ctx.lineWidth = Math.max(2, cs * 0.12);
  ctx.beginPath();
  ctx.arc(gx, gy, cs * 0.34, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#15965f';
  ctx.beginPath();
  ctx.arc(gx, gy, cs * 0.2, 0, Math.PI * 2);
  ctx.fill();
}
