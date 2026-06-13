// Caspar David Friedrich, Wanderer above the Sea of Fog: silence becomes a navigable atmosphere.
let fog = [];
let birds = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(min(2, window.devicePixelRatio || 1));
  colorMode(HSB, 360, 100, 100, 100);
  seedFog();
}

function seedFog() {
  fog = [];
  birds = [];
  for (let i = 0; i < 110; i++) fog.push({ x: random(width), y: random(height * 0.18, height * 0.86), w: random(width * 0.14, width * 0.5), p: random(TAU), h: random([196, 210, 225, 36]) });
  for (let i = 0; i < 16; i++) birds.push({ x: random(width), y: random(height * 0.1, height * 0.38), p: random(TAU), s: random(0.5, 1.4) });
}

function draw() {
  const p = pointer();
  drawSky(p);
  drawMountains(p);
  drawFog(p);
  drawWanderer(p);
  drawCompassLight(p);
  drawBirds(p);
}

function pointer() {
  if (touches.length) return createVector(touches[0].x, touches[0].y);
  return createVector(mouseX || width * 0.52, mouseY || height * 0.44);
}

function drawSky(p) {
  noStroke();
  for (let y = 0; y < height; y += 4) {
    const k = y / height;
    const glow = 1 - abs(p.y - y) / height;
    fill(205 + k * 22, 30, 12 + k * 30 + glow * 12, 100);
    rect(0, y, width, 5);
  }
}

function drawMountains(p) {
  for (let layer = 0; layer < 5; layer++) {
    const base = height * (0.44 + layer * 0.095);
    const amp = height * (0.07 + layer * 0.018);
    fill(205 + layer * 5, 34, 13 + layer * 5, 78);
    noStroke();
    beginShape();
    vertex(0, height);
    for (let x = -20; x <= width + 20; x += 24) {
      const n = noise(x * 0.004, layer * 8);
      const parallax = map(p.x, 0, width, -18, 18) * (layer + 1) * 0.12;
      vertex(x, base + parallax + sin(x * 0.011 + layer) * amp * 0.22 - n * amp);
    }
    vertex(width, height);
    endShape(CLOSE);
  }
}

function drawFog(p) {
  blendMode(ADD);
  noStroke();
  for (const f of fog) {
    const drift = sin(frameCount * 0.006 + f.p) * 26 + map(p.x, 0, width, -18, 18);
    const breathe = cos(frameCount * 0.008 + f.p) * 10;
    fill(f.h, 18, 74, 5.8);
    ellipse(f.x + drift, f.y + breathe, f.w, f.w * 0.18);
  }
  blendMode(BLEND);
}

function drawWanderer(p) {
  const cx = width * 0.5 + map(p.x, 0, width, -34, 34);
  const cy = height * 0.68 + map(p.y, 0, height, -16, 18);
  const s = min(width, height) / 720;
  noStroke();
  fill(210, 38, 7, 96);
  beginShape();
  vertex(cx - 72 * s, height);
  vertex(cx - 36 * s, cy + 64 * s);
  vertex(cx + 36 * s, cy + 64 * s);
  vertex(cx + 80 * s, height);
  endShape(CLOSE);
  fill(24, 30, 18, 98);
  ellipse(cx, cy - 132 * s, 42 * s, 52 * s);
  fill(215, 45, 12, 98);
  beginShape();
  vertex(cx - 34 * s, cy - 104 * s);
  vertex(cx + 32 * s, cy - 104 * s);
  vertex(cx + 22 * s, cy + 36 * s);
  vertex(cx - 26 * s, cy + 38 * s);
  endShape(CLOSE);
  stroke(24, 34, 10, 95);
  strokeWeight(8 * s);
  line(cx - 18 * s, cy + 28 * s, cx - 38 * s, cy + 92 * s);
  line(cx + 18 * s, cy + 28 * s, cx + 40 * s, cy + 92 * s);
  strokeWeight(4 * s);
  line(cx + 44 * s, cy - 70 * s, cx + 70 * s, cy + 86 * s);
}

function drawCompassLight(p) {
  blendMode(ADD);
  noFill();
  for (let i = 0; i < 9; i++) {
    stroke(42, 34, 95, 5 + i * 1.7);
    strokeWeight(1);
    arc(p.x, p.y, 90 + i * 52, 48 + i * 28, -PI * 0.92, -PI * 0.08);
  }
  blendMode(BLEND);
}

function drawBirds(p) {
  stroke(214, 26, 78, 36);
  strokeWeight(1.4);
  noFill();
  for (const b of birds) {
    b.x += 0.28 * b.s + map(p.x, 0, width, -0.08, 0.12);
    if (b.x > width + 30) b.x = -30;
    const y = b.y + sin(frameCount * 0.018 + b.p) * 9;
    const flap = sin(frameCount * 0.08 + b.p) * 7 * b.s;
    arc(b.x - 6 * b.s, y, 16 * b.s, 8 * b.s + flap, PI, TAU);
    arc(b.x + 6 * b.s, y, 16 * b.s, 8 * b.s - flap, PI, TAU);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  seedFog();
}
