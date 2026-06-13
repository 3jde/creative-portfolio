// Alma Thomas color fields become a touch-played mosaic organ.
let cells = [];
let ripples = [];
let columns = 0;
let rows = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(min(2, window.devicePixelRatio || 1));
  colorMode(HSB, 360, 100, 100, 100);
  buildCells();
}

function buildCells() {
  cells = [];
  const step = max(18, min(width, height) / 26);
  columns = ceil(width / step) + 2;
  rows = ceil(height / step) + 2;
  for (let y = -1; y < rows; y++) {
    for (let x = -1; x < columns; x++) {
      const band = floor((x + y * 0.65) / 4);
      cells.push({
        x: x * step,
        y: y * step,
        w: step * random(0.42, 0.86),
        h: step * random(0.5, 1.15),
        p: random(TAU),
        band,
        hue: (band * 37 + random([-10, 0, 12, 24])) % 360
      });
    }
  }
  ripples = [];
}

function draw() {
  const p = pointer();
  background(225, 36, 7);
  drawStaff();
  drawMosaic(p);
  drawRipples();
  drawCursorChord(p);
}

function pointer() {
  if (touches.length) return createVector(touches[0].x, touches[0].y);
  return createVector(mouseX || width * 0.5, mouseY || height * 0.5);
}

function drawStaff() {
  stroke(210, 28, 82, 8);
  strokeWeight(1);
  for (let y = height * 0.12; y < height * 0.92; y += height * 0.08) {
    line(0, y + sin(frameCount * 0.01 + y) * 6, width, y);
  }
}

function drawMosaic(p) {
  noStroke();
  for (const c of cells) {
    const cx = c.x + c.w * 0.5;
    const cy = c.y + c.h * 0.5;
    const d = dist(p.x, p.y, cx, cy);
    const hit = constrain(1 - d / min(width, height) * 1.6, 0, 1);
    const wave = sin(frameCount * 0.035 + c.p + hit * 2.5);
    const lift = hit * 22 + wave * 3;
    const sat = 54 + hit * 32;
    const bri = 38 + hit * 46 + wave * 8;
    push();
    translate(c.x + sin(c.p + frameCount * 0.012) * 2, c.y - lift);
    rotate((wave + hit) * 0.035);
    fill((c.hue + hit * 70 + frameCount * 0.02) % 360, sat, bri, 82);
    rect(0, 0, c.w * (1 + hit * 0.16), c.h, 2);
    pop();
  }
}

function drawCursorChord(p) {
  blendMode(ADD);
  noFill();
  for (let i = 0; i < 7; i++) {
    stroke((frameCount * 0.7 + i * 42) % 360, 70, 96, 16);
    strokeWeight(2);
    const r = 28 + i * 22 + sin(frameCount * 0.04 + i) * 10;
    ellipse(p.x, p.y, r * 1.4, r);
  }
  blendMode(BLEND);
}

function drawRipples() {
  for (let i = ripples.length - 1; i >= 0; i--) {
    const r = ripples[i];
    r.age += 1;
    noFill();
    stroke((r.h + r.age) % 360, 78, 94, max(0, 60 - r.age));
    strokeWeight(2);
    for (let k = 0; k < 5; k++) ellipse(r.x, r.y, r.age * (2.2 + k * 0.55), r.age * (1.2 + k * 0.28));
    if (r.age > 72) ripples.splice(i, 1);
  }
}

function mousePressed() {
  addRipple(mouseX, mouseY);
}

function touchStarted() {
  if (touches.length) addRipple(touches[0].x, touches[0].y);
  return false;
}

function addRipple(x, y) {
  ripples.push({ x, y, age: 0, h: map(x, 0, width, 0, 320) });
  if (ripples.length > 18) ripples.shift();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  buildCells();
}
