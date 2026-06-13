let seeds = [];
let tiles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(min(2, window.devicePixelRatio || 1));
  colorMode(HSB, 360, 100, 100, 100);
  buildTiles();
  for (let i = 0; i < 42; i++) {
    seeds.push({ x: random(width), y: random(height), r: random(8, 32), p: random(TAU), type: floor(random(3)) });
  }
}

function buildTiles() {
  tiles = [];
  const step = max(24, min(width, height) / 20);
  for (let y = -step; y < height + step; y += step) {
    for (let x = -step; x < width + step; x += step) {
      tiles.push({ x, y, s: step * random(0.44, 0.88), p: random(TAU), h: random([42, 48, 55, 76, 156, 205]) });
    }
  }
}

function draw() {
  background(36, 58, 8);
  drawGoldGround();
  drawEmbrace();
  drawPatternGrowth();
  drawTouchBloom();
}

function drawGoldGround() {
  noStroke();
  for (const t of tiles) {
    const wave = sin(frameCount * 0.018 + t.p) * 0.5 + 0.5;
    fill(t.h, 70, 38 + wave * 44, 64);
    if (t.h < 80) {
      rect(t.x, t.y, t.s, t.s * 0.72, 3);
    } else {
      ellipse(t.x, t.y, t.s * 0.88, t.s * 0.88);
    }
  }
  stroke(49, 82, 95, 24);
  strokeWeight(1);
  for (let i = 0; i < 80; i++) {
    const x = noise(i * 9, frameCount * 0.002) * width;
    const y = noise(i * 7, 20 + frameCount * 0.002) * height;
    line(x - 18, y, x + 18, y + sin(i) * 10);
  }
}

function drawEmbrace() {
  const cx = width * 0.5;
  const cy = height * 0.5;
  const scaleBody = min(width, height) / 720;
  push();
  translate(cx, cy);
  scale(scaleBody);
  noStroke();
  fill(47, 80, 85, 92);
  beginShape();
  vertex(-150, -210);
  bezierVertex(-230, -80, -180, 180, -55, 230);
  bezierVertex(80, 280, 175, 128, 150, -135);
  bezierVertex(96, -220, -70, -270, -150, -210);
  endShape(CLOSE);
  fill(32, 42, 18, 92);
  ellipse(-58, -152, 86, 96);
  fill(24, 32, 92, 94);
  ellipse(38, -170, 70, 86);
  fill(18, 42, 25, 80);
  arc(18, -180, 96, 72, -0.35, PI + 0.28);
  fill(48, 66, 98, 78);
  for (let i = 0; i < 34; i++) {
    const x = randomSeeded(i, -130, 135);
    const y = randomSeeded(i + 99, -98, 190);
    const s = randomSeeded(i + 7, 12, 38);
    if (i % 3 === 0) rect(x, y, s, s * 0.7, 4);
    else if (i % 3 === 1) ellipse(x, y, s, s);
    else triangle(x, y - s * 0.5, x - s * 0.5, y + s * 0.4, x + s * 0.5, y + s * 0.4);
  }
  pop();
}

function drawPatternGrowth() {
  const magnet = createVector(mouseX || width * 0.5, mouseY || height * 0.5);
  for (const s of seeds) {
    const d = dist(s.x, s.y, magnet.x, magnet.y);
    const pull = map(d, 0, min(width, height) * 0.46, 1, 0, true);
    const r = s.r + pull * 48 + sin(frameCount * 0.02 + s.p) * 4;
    stroke(48, 78, 96, 50 + pull * 28);
    strokeWeight(1.2 + pull * 2);
    noFill();
    push();
    translate(s.x + (magnet.x - s.x) * pull * 0.04, s.y + (magnet.y - s.y) * pull * 0.04);
    rotate(s.p + frameCount * 0.004);
    if (s.type === 0) rect(-r * 0.5, -r * 0.35, r, r * 0.7, 5);
    if (s.type === 1) ellipse(0, 0, r, r * 0.72);
    if (s.type === 2) {
      beginShape();
      for (let a = 0; a < TAU; a += TAU / 7) vertex(cos(a) * r * 0.52, sin(a) * r * 0.52);
      endShape(CLOSE);
    }
    pop();
  }
}

function drawTouchBloom() {
  if (!mouseIsPressed) return;
  blendMode(ADD);
  noStroke();
  for (let i = 0; i < 18; i++) {
    const a = i / 18 * TAU + frameCount * 0.025;
    const r = 24 + i * 5;
    fill(50 + i * 2, 76, 94, 28);
    ellipse(mouseX + cos(a) * r, mouseY + sin(a) * r, 22, 22);
  }
  blendMode(BLEND);
}

function randomSeeded(seed, lo, hi) {
  return map(sin(seed * 999.91) * 0.5 + 0.5, 0, 1, lo, hi);
}

function touchStarted() {
  seeds.push({ x: mouseX, y: mouseY, r: random(10, 28), p: random(TAU), type: floor(random(3)) });
  return false;
}

function touchMoved() {
  return false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  buildTiles();
}
