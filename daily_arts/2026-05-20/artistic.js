// Claude Monet, Water Lilies: optical mixing becomes a slow responsive pond.
let strokes = [];
let lilies = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(Math.min(2, window.devicePixelRatio || 1));
  colorMode(HSB, 360, 100, 100, 100);
  seedPond();
}

function seedPond() {
  strokes = [];
  lilies = [];
  const gap = max(14, min(width, height) * 0.027);
  for (let y = -gap; y < height + gap; y += gap) {
    for (let x = -gap; x < width + gap; x += gap) {
      strokes.push({ x: x + random(-5, 5), y: y + random(-5, 5), len: random(gap * 0.7, gap * 1.9), seed: random(1000), hue: random([180, 196, 212, 126, 48]), sat: random(18, 54) });
    }
  }
  for (let i = 0; i < 18; i++) lilies.push({ x: random(width), y: random(height * 0.24, height * 0.82), r: random(22, 62), seed: random(1000) });
}

function draw() {
  background(190, 32, 10);
  const px = mouseX || width * 0.52;
  const py = mouseY || height * 0.5;
  noFill();
  for (const s of strokes) {
    const d = dist(px, py, s.x, s.y);
    const glow = constrain(1 - d / min(width, height) * 1.25, 0, 1);
    const n = noise(s.x * 0.004, s.y * 0.006, frameCount * 0.006 + s.seed);
    const angle = n * TAU + glow * 0.9;
    const wave = sin(frameCount * 0.018 + s.seed + d * 0.018) * (2 + glow * 9);
    stroke((s.hue + glow * 34 + n * 16) % 360, s.sat, 42 + glow * 45 + n * 22, 32 + glow * 38);
    strokeWeight(1.2 + glow * 2.3);
    push();
    translate(s.x + cos(angle) * wave, s.y + sin(angle) * wave * 0.6);
    rotate(angle * 0.28);
    line(-s.len * 0.5, 0, s.len * 0.5, 0);
    pop();
  }
  drawLilies(px, py);
  drawReflections(px, py);
}

function drawLilies(px, py) {
  for (const l of lilies) {
    const d = dist(px, py, l.x, l.y);
    const open = constrain(1 - d / 260, 0, 1);
    const driftX = sin(frameCount * 0.012 + l.seed) * 8;
    const driftY = cos(frameCount * 0.01 + l.seed) * 5;
    push();
    translate(l.x + driftX, l.y + driftY);
    rotate(sin(frameCount * 0.006 + l.seed) * 0.14);
    noStroke();
    for (let i = 0; i < 8; i++) {
      const a = i * TAU / 8;
      fill(105 + i * 3, 36, 54 + open * 23, 42);
      ellipse(cos(a) * l.r * 0.28, sin(a) * l.r * 0.15, l.r * 0.8, l.r * 0.28 + open * 12);
    }
    fill(318, 35 + open * 25, 93, 42 + open * 38);
    for (let i = 0; i < 7; i++) {
      const a = i * TAU / 7 + frameCount * 0.006;
      ellipse(cos(a) * l.r * 0.12, sin(a) * l.r * 0.08, l.r * 0.28, l.r * 0.11 + open * 7);
    }
    pop();
  }
}

function drawReflections(px, py) {
  blendMode(ADD);
  strokeWeight(1);
  for (let i = 0; i < 36; i++) {
    const y = map(i, 0, 35, height * 0.1, height * 0.94);
    const phase = frameCount * 0.016 + i * 0.7;
    const light = constrain(1 - abs(y - py) / height, 0, 1);
    stroke(48, 34, 92, 5 + light * 16);
    beginShape();
    for (let x = -30; x < width + 30; x += 22) vertex(x, y + sin(x * 0.014 + phase) * (7 + light * 12) + cos((x - px) * 0.01) * light * 8);
    endShape();
  }
  blendMode(BLEND);
}

function mousePressed() {
  lilies.push({ x: mouseX, y: mouseY, r: random(28, 54), seed: random(1000) });
  if (lilies.length > 26) lilies.shift();
}

function touchStarted() {
  mousePressed();
  return false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  seedPond();
}
