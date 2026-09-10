export type V3 = { x: number; y: number; z: number };
export type Flight = {
  from: V3;
  to: V3;
  arc: number;
  duration: number;
  t: number;
};
export type Level = 'easy' | 'normal' | 'hard';
export type Phase = 'ready' | 'playing' | 'paused' | 'over';
export const difficulty = {
  easy: { speed: 2.3, accuracy: 0.72, flight: 2.5, reaction: 0.3 },
  normal: { speed: 3.7, accuracy: 0.88, flight: 2.15, reaction: 0.2 },
  hard: { speed: 5.4, accuracy: 0.98, flight: 1.85, reaction: 0.1 },
};
export const clamp = (v: number, a: number, b: number) =>
  Math.max(a, Math.min(b, v));
export const powerFor = (seconds: number) =>
  clamp(0.25 + seconds / 1.1, 0.25, 1);
export function trajectory(f: Flight, u: number): V3 {
  u = clamp(u, 0, 1);
  if (u === 0) return { ...f.from };
  if (u === 1) return { ...f.to };
  return {
    x: f.from.x + (f.to.x - f.from.x) * u,
    y: f.from.y + (f.to.y - f.from.y) * u + 4 * f.arc * u * (1 - u),
    z: f.from.z + (f.to.z - f.from.z) * u,
  };
}
export class Match {
  phase: Phase = 'ready';
  level: Level = 'easy';
  score: [number, number] = [0, 0];
  rally = 0;
  best = 0;
  ball: V3 = { x: 0, y: 1.6, z: -4 };
  opponent = { x: 0, z: -4.6 };
  flight: Flight | null = null;
  lastHitter: 'player' | 'ai' = 'ai';
  wait = 0;
  message = '准备好，来一场轻盈的对决';
  swingLeft = 0;
  swingPos = { x: 0, y: 1 };
  shotPower = 0.25;
  near = false;
  aiAttempted = false;
  event = 0;
  eventType = '';
  rng: () => number;
  constructor(rng: () => number = Math.random) {
    this.rng = rng;
  }
  start(level: Level = this.level) {
    this.level = level;
    this.score = [0, 0];
    this.rally = 0;
    this.best = 0;
    this.phase = 'playing';
    this.opponent = { x: 0, z: -4.6 };
    this.flight = null;
    this.wait = 1.1;
    this.message = '准备接发球';
    this.swingLeft = 0;
    this.event++;
    this.eventType = 'start';
  }
  pause() {
    if (this.phase === 'playing') {
      this.phase = 'paused';
      this.swingLeft = 0;
    }
  }
  resume() {
    if (this.phase === 'paused') this.phase = 'playing';
  }
  point(winner: 0 | 1, reason: string) {
    if (this.phase !== 'playing') return;
    this.score[winner]++;
    this.best = Math.max(this.best, this.rally);
    this.flight = null;
    this.swingLeft = 0;
    this.wait = 1.7;
    this.message = winner === 0 ? '好球！你得分' : '对手得分 · ' + reason;
    this.event++;
    this.eventType = winner === 0 ? 'winPoint' : 'losePoint';
    if (this.score[winner] >= 11) {
      this.phase = 'over';
      this.message =
        winner === 0 ? '今天的球场，属于你！' : '再来一局，一定会更好';
    }
  }
  serve() {
    this.rally = 0;
    this.lastHitter = 'ai';
    this.launch(
      { ...this.opponent, y: 1.8 },
      { x: (this.rng() - 0.5) * 3.6, y: 0.1, z: 5.9 },
      difficulty[this.level].flight,
      1.65,
    );
    this.message = '来球了 · 移动球拍接球';
  }
  launch(from: V3, to: V3, duration: number, arc: number) {
    this.flight = { from, to, duration, arc, t: 0 };
    this.ball = { ...from };
    this.aiAttempted = false;
  }
  swing(pos: { x: number; y: number }, power: number, near: boolean) {
    if (this.phase !== 'playing') return false;
    this.swingPos = { ...pos };
    this.shotPower = clamp(power, 0.25, 1);
    this.near = near;
    this.swingLeft = 0.2;
    return this.tryHit();
  }
  tryHit() {
    if (!this.flight || this.lastHitter !== 'ai' || this.swingLeft <= 0)
      return false;
    const b = this.ball,
      p = this.swingPos;
    if (b.z < 2.7 || b.z > 5.9 || Math.hypot(b.x - p.x, b.y - p.y) > 1.0)
      return false;
    const targetX = clamp(p.x * 1.35, -2.55, 2.55);
    this.lastHitter = 'player';
    this.rally++;
    this.best = Math.max(this.best, this.rally);
    this.swingLeft = 0;
    const endZ = this.near ? -1.85 : -5.65,
      netU = b.z / (b.z - endZ);
    const clearArc =
      (1.75 - (b.y * (1 - netU) + 0.08 * netU)) / (4 * netU * (1 - netU));
    this.launch(
      { ...b },
      { x: targetX, y: 0.08, z: endZ },
      (this.near ? 1.42 : 1.8) - this.shotPower * 0.55,
      Math.max(this.near ? 0.85 : 1.2, clearArc),
    );
    this.message =
      this.shotPower > 0.85
        ? '漂亮！全力回击'
        : this.near
          ? '轻巧吊球 · 网前落点'
          : '高远回球 · 底线落点';
    this.event++;
    this.eventType = 'hit';
    return true;
  }
  update(dt: number) {
    if (this.phase !== 'playing') return;
    // Bound individual physics steps, including a recovered background frame.
    dt = Math.min(dt, 0.05);
    this.swingLeft = Math.max(0, this.swingLeft - dt);
    if (!this.flight) {
      this.wait -= dt;
      if (this.wait <= 0) this.serve();
      return;
    }
    const f = this.flight,
      old = { ...this.ball };
    f.t += dt;
    const u = f.t / f.duration;
    this.ball = trajectory(f, u);
    if (old.z * this.ball.z < 0) {
      const crossing =
        Math.abs(old.z) / (Math.abs(old.z) + Math.abs(this.ball.z));
      const y = old.y + (this.ball.y - old.y) * crossing;
      if (y < 1.55) {
        this.point(this.lastHitter === 'player' ? 1 : 0, '球没有越过球网');
        return;
      }
    }
    if (this.lastHitter === 'ai') {
      this.tryHit();
    } else {
      const d = difficulty[this.level],
        intercept = trajectory(f, 0.78);
      if (f.t > d.reaction) {
        const dx = intercept.x - this.opponent.x,
          dz = intercept.z - this.opponent.z,
          dist = Math.hypot(dx, dz);
        const step = Math.min(dist, d.speed * dt);
        if (dist > 0.001) {
          this.opponent.x += (dx / dist) * step;
          this.opponent.z += (dz / dist) * step;
        }
      }
      if (u >= 0.78 && !this.aiAttempted) {
        this.aiAttempted = true;
        if (
          Math.hypot(
            this.opponent.x - this.ball.x,
            this.opponent.z - this.ball.z,
          ) < 1.35 &&
          this.rng() < d.accuracy
        ) {
          this.lastHitter = 'ai';
          this.rally++;
          this.best = Math.max(this.best, this.rally);
          this.launch(
            { ...this.ball },
            { x: (this.rng() - 0.5) * 4.3, y: 0.08, z: 5.9 },
            d.flight,
            0.95 + this.rng() * 0.6,
          );
          this.message = '对手回球 · 提前蓄力';
          this.event++;
          this.eventType = 'return';
          return;
        }
      }
    }
    if (this.flight === f && u >= 1)
      this.point(
        this.lastHitter === 'player' ? 0 : 1,
        this.lastHitter === 'player' ? '对手没接到' : '没接到来球',
      );
  }
}
