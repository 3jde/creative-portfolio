let figures = [];
let sparks = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
  buildWatch();
}

function buildWatch() {
  figures = [];
  const count = 46;
  for (let i = 0; i < count; i++) {
    const lane = i % 5;
    const x = map(i, 0, count - 1, width * 0.08, width * 0.92) + random(-18, 18);
    const y = height * (0.44 + lane * 0.075) + random(-16, 20);
    figures.push({
      x, y,
      h: random(height * 0.13, height * 0.31),
      w: random(12, 32),
      phase: random(TAU),
      hue: random([28, 36, 43, 204, 12]),
      brass: random() < 0.22
    });
  }
  sparks = Array.from({ length: 110 }, () => ({
    x: random(width),
    y: random(height * 0.18, height * 0.82),
    vx: random(-0.25, 0.6),
    vy: random(-0.08, 0.08),
    life: random(100)
  }));
}

function draw() {
  background(25, 45, 4, 100);
  const mx = touches.length ? touches[0].x : mouseX;
  const my = touches.length ? touches[0].y : mouseY;
  const focusX = constrain(mx || width * 0.55, 0, width);
  const focusY = constrain(my || height * 0.43, 0, height);
  paintSmoke();
  paintLightCone(focusX, focusY);
  paintMarch(focusX, focusY);
  paintSparks(focusX, focusY);
  paintVignette();
}

function paintSmoke() {
  blendMode(BLEND);
  for (let i = 0; i < 28; i++) {
    const y = height * 0.24 + i * height * 0.018;
    const drift = sin(frameCount * 0.01 + i) * 70;
    fill(36, 35, 18, 4);
    ellipse(width * 0.5 + drift, y, width * (0.48 + i * 0.015), height * 0.08);
  }
}

function paintLightCone(focusX, focusY) {
  blendMode(ADD);
  for (let r = 0; r < 22; r++) {
    const a = map(r, 0, 21, 15, 0.6);
    fill(43, 68, 100, a);
    ellipse(focusX, focusY, width * (0.16 + r * 0.035), height * (0.12 + r * 0.018));
  }
  blendMode(BLEND);
}

function paintMarch(focusX, focusY) {
  figures.sort((a, b) => a.y - b.y);
  for (const f of figures) {
    const d = dist(f.x, f.y, focusX, focusY);
    const lit = constrain(map(d, 0, width * 0.42, 1, 0), 0, 1);
    const step = sin(frameCount * 0.032 + f.phase) * 6;
    push();
    translate(f.x + step * 0.18, f.y + step * 0.08);
    fill(31, 80, 8 + lit * 38, 96);
    rect(-f.w * 0.5, -f.h, f.w, f.h, 3);
    fill(f.hue, 70, 18 + lit * 68, 93);
    ellipse(0, -f.h - f.w * 0.38, f.w * 1.04, f.w * 1.18);
    fill(36, 60, 8 + lit * 26, 85);
    rect(-f.w * 1.2, -f.h * 0.92, f.w * 2.4, f.h * 0.36, 2);
    if (f.brass) {
      blendMode(ADD);
      fill(48, 95, 95, 50 + lit * 45);
      ellipse(f.w * 0.9, -f.h * 0.68, f.w * 1.1, f.w * 1.1);
      blendMode(BLEND);
    }
    pop();
  }
}

function paintSparks(focusX, focusY) {
  blendMode(ADD);
  for (const s of sparks) {
    const pull = createVector(focusX - s.x, focusY - s.y).mult(0.00016);
    s.vx += pull.x;
    s.vy += pull.y;
    s.x += s.vx;
    s.y += s.vy;
    s.life -= 0.45;
    if (s.life <= 0 || s.x < -20 || s.x > width + 20) {
      s.x = random(width);
      s.y = random(height * 0.18, height * 0.8);
      s.vx = random(-0.25, 0.6);
      s.vy = random(-0.08, 0.08);
      s.life = random(65, 130);
    }
    fill(42, 85, 96, map(s.life, 0, 130, 0, 42));
    ellipse(s.x, s.y, random(1.5, 4.5));
  }
  blendMode(BLEND);
}

function paintVignette() {
  for (let i = 0; i < 38; i++) {
    noFill();
    stroke(20, 55, 2, 4);
    strokeWeight(width * 0.015);
    rect(i * -8, i * -6, width + i * 16, height + i * 12);
  }
  noStroke();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  buildWatch();
}
