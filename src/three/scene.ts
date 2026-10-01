// The hero diorama: a real Snowy Village level, built by the game's own maze
// generator (ported in lib/maze.ts), rendered as a clay-and-snow island and
// toured on autopilot by Santa using the game's walk sprite sheet.
//
// Look-only: there are no player controls. Pointer movement tilts the island
// and scrolling eases the camera towards a top-down view.

import {
  ACESFilmicToneMapping,
  CanvasTexture,
  CircleGeometry,
  Clock,
  Color,
  DirectionalLight,
  Fog,
  Group,
  HemisphereLight,
  InstancedMesh,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PointLight,
  RingGeometry,
  Scene,
  SRGBColorSpace,
  Sprite,
  SpriteMaterial,
  Texture,
  TextureLoader,
  Vector3,
  WebGLRenderer,
} from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { Dir, Random, canMove, generate, levelSeed, tour, type Maze } from '../lib/maze';

export interface HudState {
  level: number;
  rows: number;
  cols: number;
  collected: number;
  total: number;
  phase: 'building' | 'collecting' | 'unlocked' | 'complete';
  seconds: number;
  stars: number;
}

export interface SceneOptions {
  assetBase: string;
  onHud?: (s: HudState) => void;
  onReady?: () => void;
  mobile?: boolean;
}

// Snowy Village tuning from GameData.cpp.
const VILLAGE = { baseRows: 6, baseCols: 11, capRows: 12, capCols: 21, growRows: 3, growCols: 2, braidStart: 0.34, braidEnd: 0.1 };
function planVillageLevel(level: number) {
  const step = level - 1;
  const rows = Math.min(VILLAGE.capRows, VILLAGE.baseRows + Math.floor(step / VILLAGE.growRows));
  const cols = Math.min(VILLAGE.capCols, VILLAGE.baseCols + Math.floor(step / VILLAGE.growCols));
  const t = Math.min(1, step / 24);
  return {
    rows,
    cols,
    seed: levelSeed(1, level),
    gifts: Math.max(4, Math.floor((rows * cols) / 8)),
    braid: VILLAGE.braidStart + (VILLAGE.braidEnd - VILLAGE.braidStart) * t,
  };
}

const CELL = 1;
const WALL = 0.42;
const PITCH = CELL + WALL;
const WALL_H = 0.5;
const SANTA = 2.3;
const SPEED = 3.4; // cells per second (the game's base walk is 4.6)

const easeOutBack = (t: number) => {
  const c = 1.5;
  return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
};
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export async function createScene(container: HTMLElement, opts: SceneOptions) {
  const mobile = !!opts.mobile;
  const renderer = new WebGLRenderer({ antialias: !mobile, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.75));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;
  renderer.shadowMap.enabled = !mobile;
  renderer.shadowMap.type = PCFSoftShadowMap;
  renderer.domElement.setAttribute('aria-hidden', 'true');
  renderer.domElement.className = 'diorama__canvas';

  const scene = new Scene();
  scene.fog = new Fog(new Color('#0b2a55'), 30, 70);
  const camera = new PerspectiveCamera(32, 1, 0.1, 200);

  // ---- textures (the game's own art) ---------------------------------------
  const loader = new TextureLoader();
  const load = (p: string) =>
    loader.loadAsync(`${opts.assetBase}${p}`).then((t) => {
      t.colorSpace = SRGBColorSpace;
      t.anisotropy = 4;
      return t;
    });
  const [santaTex, giftRed, giftGreen, treeTex, pineTex, lampTex, gateTex, snowmanTex] = await Promise.all([
    load('three/santa-walk.webp'),
    load('objects/gift-red.webp'),
    load('objects/gift-green.webp'),
    load('objects/christmas-tree-large.webp'),
    load('objects/snowy-pine.webp'),
    load('objects/festive-lamp.webp'),
    load('objects/village-gate.webp'),
    load('objects/snowman.webp'),
  ]);
  santaTex.repeat.set(1 / 8, 1 / 4);

  // ---- lights ----------------------------------------------------------------
  scene.add(new HemisphereLight('#bcd4ff', '#3a2a1c', 0.95));
  const moon = new DirectionalLight('#fff1dc', 2.6);
  moon.position.set(-8, 16, 10);
  moon.castShadow = !mobile;
  moon.shadow.mapSize.set(1024, 1024);
  moon.shadow.camera.left = -16;
  moon.shadow.camera.right = 16;
  moon.shadow.camera.top = 16;
  moon.shadow.camera.bottom = -16;
  moon.shadow.bias = -0.0008;
  moon.shadow.radius = 4;
  scene.add(moon);
  const lanternA = new PointLight('#ffb35a', mobile ? 0 : 6, 9, 1.6);
  const lanternB = new PointLight('#ffb35a', mobile ? 0 : 6, 9, 1.6);
  scene.add(lanternA, lanternB);

  // ---- materials -------------------------------------------------------------
  const clayMat = new MeshStandardMaterial({ color: '#2f7a46', roughness: 0.8 });
  const snowMat = new MeshStandardMaterial({ color: '#f6fbff', roughness: 0.95 });
  const groundMat = new MeshStandardMaterial({ color: '#b98d64', roughness: 1 });
  const baseMat = new MeshStandardMaterial({ color: '#eef5ff', roughness: 0.95 });
  const iceMat = new MeshStandardMaterial({ color: '#3f8fd8', roughness: 0.12, metalness: 0.1, transparent: true, opacity: 0.55 });
  const ringMat = new MeshBasicMaterial({ color: '#ef3340', transparent: true, opacity: 0.85, depthWrite: false });

  const blobTex = (() => {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const g = c.getContext('2d')!;
    const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(10,20,40,0.55)');
    grad.addColorStop(1, 'rgba(10,20,40,0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 64);
    return new CanvasTexture(c);
  })();

  const world = new Group();
  scene.add(world);

  // Island base + ice skirt (built once; sized per level).
  const island = new Group();
  world.add(island);
  const ice = new Mesh(new CircleGeometry(1, 64), iceMat);
  ice.rotation.x = -Math.PI / 2;
  ice.position.y = -0.62;
  ice.receiveShadow = true;
  island.add(ice);

  // Disposable per-level content.
  let levelGroup = new Group();
  world.add(levelGroup);
  const disposables: { dispose(): void }[] = [];

  // ---- per-level state -------------------------------------------------------
  let level = 5;
  let maze: Maze;
  let plan: ReturnType<typeof planVillageLevel>;
  let route: number[] = [];
  let walls: InstancedMesh, caps: InstancedMesh;
  let wallData: { x: number; z: number; w: number; d: number; delay: number }[] = [];
  let gifts = new Map<number, Sprite>();
  let popping: { s: Sprite; t: number }[] = [];
  let santa: Sprite;
  let santaShadow: Mesh;
  let gateRing: Mesh;
  let gate: Sprite;
  let extentX = 10;
  let extentZ = 10;

  let phase: HudState['phase'] = 'building';
  let phaseT = 0;
  let routePos = 0;
  let collected = 0;
  let walkSeconds = 0;
  let facingRow = 2;
  let frame = 0;
  let frameT = 0;

  const coord = (k: number, n: number) => {
    const total = n * PITCH + WALL;
    const v = Math.floor(k / 2) * PITCH + (k % 2 === 0 ? WALL / 2 : WALL + CELL / 2);
    return v - total / 2;
  };
  const cellPos = (cell: number, out = new Vector3()) => {
    const r = Math.floor(cell / maze.cols);
    const c = cell % maze.cols;
    return out.set(coord(2 * c + 1, maze.cols), 0, coord(2 * r + 1, maze.rows));
  };

  const sprite = (tex: Texture, h: number, aspect = 1, cy = 0.04) => {
    const m = new SpriteMaterial({ map: tex, alphaTest: 0.35, transparent: true });
    const s = new Sprite(m);
    s.center.set(0.5, cy);
    s.scale.set(h * aspect, h, 1);
    disposables.push(m);
    return s;
  };

  function hud() {
    const par = ((plan.rows * plan.cols * 2) / 4.6) * 2.2;
    const stars = walkSeconds <= par ? 3 : walkSeconds <= par * 1.5 ? 2 : 1;
    opts.onHud?.({
      level,
      rows: plan.rows,
      cols: plan.cols,
      collected,
      total: maze.giftCount,
      phase,
      seconds: walkSeconds,
      stars,
    });
  }

  function buildLevel() {
    // Clear previous level.
    world.remove(levelGroup);
    disposables.splice(0).forEach((d) => d.dispose());
    levelGroup = new Group();
    world.add(levelGroup);
    gifts = new Map();
    popping = [];

    plan = planVillageLevel(level);
    maze = generate(plan.rows, plan.cols, plan.seed, plan.gifts, plan.braid);
    route = tour(maze);
    const R = maze.rows;
    const C = maze.cols;
    extentX = C * PITCH + WALL;
    extentZ = R * PITCH + WALL;

    // Island slab under the maze.
    const pad = 0.9;
    const baseGeo = new RoundedBoxGeometry(extentX + pad * 2, 0.6, extentZ + pad * 2, 3, 0.28);
    const base = new Mesh(baseGeo, baseMat);
    base.position.y = -0.3;
    base.receiveShadow = true;
    const topGeo = new RoundedBoxGeometry(extentX, 0.12, extentZ, 2, 0.06);
    const top = new Mesh(topGeo, groundMat);
    top.position.y = -0.02;
    top.receiveShadow = true;
    levelGroup.add(base, top);
    disposables.push(baseGeo, topGeo);
    ice.scale.set(extentX / 2 + 2.2, extentZ / 2 + 2.2, 1);

    // Wall blocks on the (2R+1) x (2C+1) block grid.
    wallData = [];
    const maxDist = Math.max(1, ...Array.from(maze.distance));
    const distAt = (r: number, c: number) => (r >= 0 && r < R && c >= 0 && c < C ? maze.distance[r * C + c] : maxDist);
    for (let bi = 0; bi <= 2 * R; bi++) {
      for (let bj = 0; bj <= 2 * C; bj++) {
        const evenR = bi % 2 === 0;
        const evenC = bj % 2 === 0;
        if (!evenR && !evenC) continue; // a cell, never a wall
        let solid = true;
        let d = maxDist;
        if (evenR && !evenC) {
          // horizontal wall between rows bi/2-1 and bi/2, column (bj-1)/2
          const c = (bj - 1) / 2;
          const below = bi / 2;
          const above = below - 1;
          if (above >= 0 && below < R) solid = !canMove(maze, above * C + c, Dir.Down);
          d = Math.min(distAt(above, c), distAt(below, c));
        } else if (!evenR && evenC) {
          const r = (bi - 1) / 2;
          const right = bj / 2;
          const left = right - 1;
          if (left >= 0 && right < C) solid = !canMove(maze, r * C + left, Dir.Right);
          d = Math.min(distAt(r, left), distAt(r, right));
        } else {
          const r = bi / 2;
          const c = bj / 2;
          d = Math.min(distAt(r - 1, c - 1), distAt(r - 1, c), distAt(r, c - 1), distAt(r, c));
        }
        if (!solid) continue;
        wallData.push({
          x: coord(bj, C),
          z: coord(bi, R),
          w: evenC ? WALL : CELL + 0.02,
          d: evenR ? WALL : CELL + 0.02,
          delay: (d / maxDist) * 0.9,
        });
      }
    }
    const wallGeo = new RoundedBoxGeometry(1, 1, 1, 2, 0.12);
    const capGeo = new RoundedBoxGeometry(1, 1, 1, 2, 0.3);
    walls = new InstancedMesh(wallGeo, clayMat, wallData.length);
    caps = new InstancedMesh(capGeo, snowMat, wallData.length);
    walls.castShadow = caps.castShadow = !mobile;
    walls.receiveShadow = caps.receiveShadow = true;
    levelGroup.add(walls, caps);
    disposables.push(wallGeo, capGeo, { dispose: () => (walls.dispose(), caps.dispose()) });
    setWallRise(0);

    // Props on wall pillars: pines around the rim, a few trees and lamps inside.
    const rnd = new Random(plan.seed ^ 0x51a7);
    let lamps = 0;
    const lampPositions: Vector3[] = [];
    for (let bi = 0; bi <= 2 * R; bi += 2) {
      for (let bj = 0; bj <= 2 * C; bj += 2) {
        const rim = bi === 0 || bj === 0 || bi === 2 * R || bj === 2 * C;
        const roll = rnd.nextFloat();
        const x = coord(bj, C);
        const z = coord(bi, R);
        let s: Sprite | null = null;
        if (rim && bi === 0 && roll < 0.55) s = sprite(roll < 0.3 ? pineTex : treeTex, 1.6 + rnd.nextFloat() * 0.5);
        else if (rim && bi !== 2 * R && roll < 0.18) s = sprite(pineTex, 1.3 + rnd.nextFloat() * 0.4);
        else if (!rim && roll < 0.05 && lamps < 4) {
          s = sprite(lampTex, 1.35);
          lamps++;
          lampPositions.push(new Vector3(x, 1.2, z));
        } else if (!rim && roll > 0.94) s = sprite(treeTex, 1.3);
        if (s) {
          s.position.set(x, WALL_H + 0.08, z);
          s.userData.baseY = WALL_H + 0.08;
          s.userData.delay = 0.5 + rnd.nextFloat() * 0.5;
          s.userData.scale = s.scale.clone();
          levelGroup.add(s);
        }
      }
    }
    if (lampPositions[0]) lanternA.position.copy(lampPositions[0]);
    if (lampPositions[1]) lanternB.position.copy(lampPositions[1]);
    const snowman = sprite(snowmanTex, 1.5, 0.85);
    snowman.position.set(extentX / 2 + 0.4, 0, extentZ / 2 + 0.35);
    levelGroup.add(snowman);

    // Gifts — alternating the game's red and green boxes.
    let gi = 0;
    maze.gift.forEach((g, cell) => {
      if (!g) return;
      const s = sprite(gi++ % 2 ? giftGreen : giftRed, 0.9, 1, 0.08);
      cellPos(cell, s.position);
      s.position.y = 0.02;
      s.userData.scale = s.scale.clone();
      s.userData.phase = gi * 0.7;
      gifts.set(cell, s);
      levelGroup.add(s);
    });

    // Gate at the furthest cell, with a ring that turns gold when unlocked.
    gate = sprite(gateTex, 1.9);
    cellPos(maze.goal, gate.position);
    gate.position.z -= 0.25;
    levelGroup.add(gate);
    const ringGeo = new RingGeometry(0.34, 0.46, 40);
    gateRing = new Mesh(ringGeo, ringMat);
    gateRing.rotation.x = -Math.PI / 2;
    cellPos(maze.goal, gateRing.position);
    gateRing.position.y = 0.06;
    ringMat.color.set('#ef3340');
    levelGroup.add(gateRing);
    disposables.push(ringGeo);

    // Santa + contact shadow.
    const santaMat = new SpriteMaterial({ map: santaTex, alphaTest: 0.35, transparent: true });
    disposables.push(santaMat);
    santa = new Sprite(santaMat);
    santa.center.set(0.5, 0.07);
    santa.scale.set(SANTA, SANTA, 1);
    cellPos(maze.start, santa.position);
    const shadowMat = new MeshBasicMaterial({ map: blobTex, transparent: true, depthWrite: false });
    const shadowGeo = new CircleGeometry(0.5, 24);
    santaShadow = new Mesh(shadowGeo, shadowMat);
    santaShadow.rotation.x = -Math.PI / 2;
    disposables.push(shadowMat, shadowGeo);
    levelGroup.add(santa, santaShadow);

    phase = 'building';
    phaseT = 0;
    routePos = 0;
    collected = 0;
    walkSeconds = 0;
    facingRow = 2;
    hud();
  }

  const dummy = new Object3D();
  function setWallRise(t: number, sinking = false) {
    for (let i = 0; i < wallData.length; i++) {
      const w = wallData[i];
      const local = sinking ? clamp01(1 - (t * 1.6 - (0.9 - w.delay))) : clamp01((t - w.delay) / 0.55);
      const k = sinking ? easeInOut(local) : easeOutBack(local);
      const h = Math.max(0.001, WALL_H * k);
      dummy.position.set(w.x, h / 2, w.z);
      dummy.scale.set(w.w, h, w.d);
      dummy.updateMatrix();
      walls.setMatrixAt(i, dummy.matrix);
      dummy.position.set(w.x, h + 0.03 * k, w.z);
      dummy.scale.set(w.w + 0.08, 0.16 * Math.max(0.001, k), w.d + 0.08);
      dummy.updateMatrix();
      caps.setMatrixAt(i, dummy.matrix);
    }
    walls.instanceMatrix.needsUpdate = true;
    caps.instanceMatrix.needsUpdate = true;
  }

  // ---- camera framing, pointer tilt, scroll dolly --------------------------
  let width = 1;
  let height = 1;
  let pointerX = 0;
  let pointerY = 0;
  let tiltX = 0;
  let tiltY = 0;
  let scrollP = 0;

  function resize() {
    const rect = container.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  function placeCamera(time: number) {
    const elev = (52 + scrollP * 22) * (Math.PI / 180);
    const yaw = (-14 + Math.sin(time * 0.12) * 4) * (Math.PI / 180) + tiltX * 0.16;
    const vfov = (camera.fov * Math.PI) / 180;
    const hfov = 2 * Math.atan(Math.tan(vfov / 2) * camera.aspect);
    const e = elev + tiltY * 0.06;
    // Fit the island's footprint: width against the horizontal FOV, depth
    // (foreshortened by the camera's elevation) against the vertical one.
    const halfW = (extentX / 2 + 2.2) * Math.cos(yaw) + (extentZ / 2) * Math.abs(Math.sin(yaw));
    const halfD = (extentZ / 2 + 1.6) * Math.sin(e) + 1.6;
    const dist = Math.max(halfW / Math.tan(hfov / 2), halfD / Math.tan(vfov / 2)) * (1 - scrollP * 0.06);
    camera.position.set(Math.sin(yaw) * Math.cos(e) * dist, Math.sin(e) * dist, Math.cos(yaw) * Math.cos(e) * dist);
    camera.lookAt(0, -0.2, 0);
  }

  const onPointer = (e: PointerEvent) => {
    pointerX = (e.clientX / window.innerWidth) * 2 - 1;
    pointerY = (e.clientY / window.innerHeight) * 2 - 1;
  };
  const onScroll = () => {
    const rect = container.getBoundingClientRect();
    scrollP = clamp01(-rect.top / Math.max(1, rect.height));
  };

  // ---- per-frame update ------------------------------------------------------
  const tmpA = new Vector3();
  const tmpB = new Vector3();
  function update(dt: number, time: number) {
    tiltX += (pointerX - tiltX) * Math.min(1, dt * 3);
    tiltY += (pointerY - tiltY) * Math.min(1, dt * 3);
    phaseT += dt;

    // Props pop up with the walls.
    if (phase === 'building') {
      setWallRise(phaseT);
      levelGroup.children.forEach((o) => {
        if (o instanceof Sprite && o.userData.delay !== undefined) {
          const k = easeOutBack(clamp01((phaseT - o.userData.delay) / 0.5));
          o.scale.copy(o.userData.scale).multiplyScalar(Math.max(0.001, k));
        }
      });
      if (phaseT > 1.6) {
        phase = 'collecting';
        phaseT = 0;
        hud();
      }
    }

    // Gifts bob gently; collected ones pop and vanish.
    gifts.forEach((g) => {
      g.position.y = 0.02 + Math.sin(time * 2.4 + g.userData.phase) * 0.05;
    });
    popping = popping.filter((p) => {
      p.t += dt;
      const k = p.t / 0.35;
      p.s.scale.copy(p.s.userData.scale).multiplyScalar(1 + k * 0.8);
      (p.s.material as SpriteMaterial).opacity = 1 - k;
      p.s.position.y += dt * 1.6;
      if (k >= 1) {
        levelGroup.remove(p.s);
        return false;
      }
      return true;
    });

    if (phase === 'collecting' || phase === 'unlocked') {
      walkSeconds += dt;
      routePos = Math.min(route.length - 1, routePos + dt * SPEED);
      const i = Math.floor(routePos);
      const f = routePos - i;
      const a = route[i];
      const b = route[Math.min(route.length - 1, i + 1)];
      cellPos(a, tmpA);
      cellPos(b, tmpB);
      santa.position.lerpVectors(tmpA, tmpB, f);
      const dc = (b % maze.cols) - (a % maze.cols);
      const dr = Math.floor(b / maze.cols) - Math.floor(a / maze.cols);
      if (dc > 0) facingRow = 1;
      else if (dc < 0) facingRow = 3;
      else if (dr > 0) facingRow = 2;
      else if (dr < 0) facingRow = 0;

      // Collect any gift on the cell Santa is passing through.
      const here = f < 0.5 ? a : b;
      const g = gifts.get(here);
      if (g) {
        gifts.delete(here);
        popping.push({ s: g, t: 0 });
        collected++;
        if (collected === maze.giftCount) {
          phase = 'unlocked';
          ringMat.color.set('#ffc928');
        }
        hud();
      }

      if (routePos >= route.length - 1) {
        phase = 'complete';
        phaseT = 0;
        hud();
      }
    }

    if (phase === 'complete') {
      // Santa glides into the gate and the level resets.
      const k = clamp01(phaseT / 0.7);
      santa.scale.setScalar(SANTA * (1 - k * 0.9));
      santa.material.opacity = 1 - k;
      if (phaseT > 3.4) {
        const sinkT = phaseT - 3.4;
        setWallRise(sinkT, true);
        if (sinkT > 1.1) {
          level = level >= 14 ? 5 : level + 1;
          buildLevel();
        }
      }
    }

    // Sprite animation: 8 frames, 100ms each while walking (from walk.json).
    const walking = phase === 'collecting' || phase === 'unlocked';
    frameT += dt;
    if (walking && frameT > 0.1) {
      frameT = 0;
      frame = (frame + 1) % 8;
    } else if (!walking) frame = 0;
    santaTex.offset.set(frame / 8, 1 - (facingRow + 1) / 4);
    santaShadow.position.set(santa.position.x, 0.05, santa.position.z);
    santaShadow.visible = phase !== 'complete';

    const pulse = phase === 'unlocked' ? 1 + Math.sin(time * 6) * 0.12 : 1;
    gateRing.scale.setScalar(pulse);

    lanternA.intensity = mobile ? 0 : 6 + Math.sin(time * 3.1) * 0.6;
    lanternB.intensity = mobile ? 0 : 6 + Math.sin(time * 2.7 + 1) * 0.6;

    placeCamera(time);
  }

  // ---- loop with visibility gating --------------------------------------------
  const clock = new Clock();
  let raf = 0;
  let onScreen = true;
  const frameLoop = () => {
    raf = requestAnimationFrame(frameLoop);
    const dt = Math.min(0.05, clock.getDelta());
    update(dt, clock.elapsedTime);
    renderer.render(scene, camera);
  };
  const start = () => {
    if (raf || !onScreen || document.hidden) return;
    clock.getDelta();
    raf = requestAnimationFrame(frameLoop);
  };
  const stop = () => {
    cancelAnimationFrame(raf);
    raf = 0;
  };

  container.appendChild(renderer.domElement);
  resize();
  buildLevel();
  onScroll();
  placeCamera(0);
  renderer.render(scene, camera);
  opts.onReady?.();

  const ro = new ResizeObserver(resize);
  ro.observe(container);
  const io = new IntersectionObserver(([e]) => {
    onScreen = e.isIntersecting;
    onScreen ? start() : stop();
  });
  io.observe(container);
  const onVis = () => (document.hidden ? stop() : start());
  document.addEventListener('visibilitychange', onVis);
  window.addEventListener('pointermove', onPointer, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
  start();

  return {
    dispose() {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('scroll', onScroll);
      disposables.forEach((d) => d.dispose());
      [santaTex, giftRed, giftGreen, treeTex, pineTex, lampTex, gateTex, snowmanTex, blobTex].forEach((t) => t.dispose());
      [clayMat, snowMat, groundMat, baseMat, iceMat, ringMat].forEach((m) => m.dispose());
      ice.geometry.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
