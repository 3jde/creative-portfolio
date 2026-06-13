// Botticelli, Birth of Venus: the shell is a wind instrument instead of an icon.
let ribs = [];
let petals = [];
let wind = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(Math.min(2, window.devicePixelRatio || 1));
  colorMode(HSB, 360, 100, 100, 100);
  for (let i = 0; i < 33; i++) ribs.push({ a: map(i, 0, 32, -PI * 0.86, -PI * 0.14), flex: random(0.7, 1.4) });
  for (let i = 0; i < 180; i++) petals.push(makePetal(random(width), random(height)));
}

function draw() {
  const pointer = createVector(mouseX || width * 0.5, mouseY || height * 0.5);
  wind = lerp(wind, mouseIsPressed ? 1 : 0.22, 0.045);
  drawBackdrop();
  drawShell(pointer);
  drawPetals(pointer);
  drawFigureTrace(pointer);
}

function drawBackdrop() {
  background(154, 30, 11);
  noStroke();
  for (let y = 0; y < height; y += 9) {
    const h = map(y, 0, height, 178, 36);
    fill(h, 32, map(y, 0, height, 20, 72), 11);
    rect(0, y, width, 10);
  }
}

function drawShell(pointer) {
  const cx = width * 0.5;
  const cy = height * 0.62;
  const base = min(width, height) * 0.32;
  noFill();
  strokeWeight(2);
  for (const r of ribs) {
    const bend = map(pointer.x, 0, width, -0.16, 0.16) * r.flex;
    const lift = map(pointer.y, 0, height, -30, 30) * r.flex;
    stroke(33, 36, 96, 42);
    beginShape();
    for (let t = 0; t <= 1; t += 0.035) {
      const radius = base * t;
      const a = r.a + bend * sin(t * PI);
      const x = cx + cos(a) * radius * 1.42;
      const y = cy + sin(a) * radius * 0.78 + lift * t;
      curveVertex(x, y);
    }
    endShape();
  }
  for (let i = 0; i < 9; i++) {
    stroke(25, 50, 92, 20);
    arc(cx, cy, base * (0.45 + i * 0.22), base * (0.16 + i * 0.1), PI, TAU);
  }
}

function drawFigureTrace(pointer) {
  const cx = width * 0.5 + map(pointer.x, 0, width, -18, 18);
  const cy = height * 0.43 + map(pointer.y, 0, height, -10, 10);
  noFill();
  stroke(42, 22, 96, 34);
  strokeWeight(5);
  beginShape();
  for (let i = 0; i < 80; i++) {
    const a = map(i, 0, 79, -PI * 0.62, PI * 1.35);
    const rr = min(width, height) * (0.06 + 0.035 * sin(a * 3 + frameCount * 0.03));
    curveVertex(cx + cos(a) * rr, cy + sin(a) * rr * 1.9);
  }
  endShape();
  strokeWeight(1.4);
  stroke(192, 32, 98, 22);
  for (let i = 0; i < 36; i++) {
    const a = i * 0.42 + frameCount * 0.012;
    line(cx, cy - 40, cx + cos(a) * 90, cy - 28 + sin(a) * 35);
  }
}

function drawPetals(pointer) {
  blendMode(ADD);
  noStroke();
  for (const p of petals) {
    const d = dist(pointer.x, pointer.y, p.x, p.y);
    const push = constrain(90 / max(d, 30), 0, 3.5);
    p.vx += (noise(p.seed, frameCount * 0.01) - 0.42) * 0.09 + wind * 0.05 + (p.x - pointer.x) * push * 0.0007;
    p.vy += sin(frameCount * 0.018 + p.seed) * 0.025 + (p.y - pointer.y) * push * 0.0005;
    p.vx *= 0.985;
    p.vy *= 0.985;
    p.x += p.vx;
    p.y += p.vy;
    if (p.x > width + 40 || p.y < -40 || p.y > height + 40) Object.assign(p, makePetal(-30, random(height)));
    fill(p.h, p.s, p.b, 34 + push * 18);
    push();
    translate(p.x, p.y);
    rotate(p.seed + frameCount * 0.018 + p.vx);
    ellipse(0, 0, p.size * 1.7, p.size * 0.72);
    pop();
  }
  blendMode(BLEND);
}

function makePetal(x, y) {
  return { x, y, vx: random(-0.4, 1.2), vy: random(-0.25, 0.35), seed: random(1000), size: random(5, 15), h: random([332, 18, 42]), s: random(28, 66), b: random(80, 100) };
}

function touchMoved() {
  return false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
