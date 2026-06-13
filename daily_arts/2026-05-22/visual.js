let dust = [];
let figures = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  pixelDensity(min(2, window.devicePixelRatio || 1));
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
  for (let i = 0; i < 190; i++) {
    dust.push({
      x: random(-1, 1),
      y: random(-1, 1),
      z: random(-1, 1),
      s: random(1, 5),
      p: random(TAU)
    });
  }
  for (let i = 0; i < 12; i++) {
    figures.push({
      x: map(i, 0, 11, -0.42, 0.42) + random(-0.05, 0.05),
      z: random(0.15, 0.82),
      h: random(0.15, 0.34),
      hue: random([22, 38, 208, 344])
    });
  }
}

function draw() {
  const w = width;
  const h = height;
  const mx = (mouseX / max(1, w) - 0.5) * 2;
  const my = (mouseY / max(1, h) - 0.5) * 2;
  background(32, 35, 5);
  ambientLight(22, 30, 24);
  pointLight(42, 65, 95, mx * w * 0.25, my * h * 0.18 - h * 0.05, 220);
  pointLight(205, 38, 28, -w * 0.28, -h * 0.22, -100);
  orbitControl(0.18, 0.18, 0.02);
  rotateX(-0.16 + my * 0.05);
  rotateY(mx * 0.1);
  drawRoom(w, h, mx);
  drawFigures(w, h);
  drawMirror(w, h, mx, my);
  drawDust(w, h, mx, my);
}

function drawRoom(w, h, mx) {
  push();
  translate(0, h * 0.08, 0);
  for (let i = 0; i < 10; i++) {
    const z = map(i, 0, 9, -w * 0.75, w * 0.32);
    const scaleLine = map(i, 0, 9, 1.45, 0.28);
    fill(38, 50, 16 + i * 2, 84);
    push();
    translate(0, 0, z);
    box(w * scaleLine, 3, 3);
    pop();
    fill(36, 48, 20, 62);
    push();
    translate(-w * scaleLine * 0.5, -h * 0.14 * scaleLine, z);
    box(4, h * 0.38 * scaleLine, 4);
    pop();
    push();
    translate(w * scaleLine * 0.5, -h * 0.14 * scaleLine, z);
    box(4, h * 0.38 * scaleLine, 4);
    pop();
  }
  pop();
  for (let i = 0; i < 8; i++) {
    push();
    translate(map(i, 0, 7, -w * 0.36, w * 0.36), -h * 0.28, -w * 0.25);
    rotateZ(sin(frameCount * 0.01 + i) * 0.03 + mx * 0.04);
    fill(42, 58, 34 + i * 2, 62);
    box(w * 0.035, h * 0.34, 8);
    pop();
  }
}

function drawFigures(w, h) {
  for (const f of figures) {
    const depth = map(f.z, 0, 1, -w * 0.1, w * 0.34);
    const scaleF = map(f.z, 0, 1, 1.1, 0.38);
    push();
    translate(f.x * w, h * 0.13 * scaleF, depth);
    rotateY(sin(frameCount * 0.012 + f.x * 7) * 0.08);
    fill(f.hue, 46, 56, 85);
    ellipsoid(w * 0.025 * scaleF, h * 0.085 * f.h, w * 0.022 * scaleF, 10, 6);
    translate(0, -h * 0.07 * scaleF, 0);
    fill(34, 30, 82, 86);
    sphere(w * 0.018 * scaleF, 10, 6);
    pop();
  }
}

function drawMirror(w, h, mx, my) {
  push();
  translate(0, -h * 0.23, -w * 0.34);
  rotateY(mx * 0.16);
  fill(44, 42, 18, 86);
  box(w * 0.26, h * 0.18, 10);
  translate(0, 0, 7);
  fill(202, 34, 70, 62);
  plane(w * 0.2, h * 0.12);
  fill(44, 12, 100, 80);
  for (let i = -1; i <= 1; i += 2) {
    push();
    translate(i * w * 0.045 + mx * 12, my * 7, 5);
    ellipse(0, 0, w * 0.028, h * 0.055);
    pop();
  }
  pop();
}

function drawDust(w, h, mx, my) {
  blendMode(ADD);
  for (const d of dust) {
    const t = frameCount * 0.012 + d.p;
    const x = d.x * w * 0.45 + sin(t * 0.8) * 18 + mx * d.z * 40;
    const y = d.y * h * 0.32 + cos(t) * 12 + my * 30;
    const z = d.z * w * 0.5;
    push();
    translate(x, y, z);
    fill(46, 54, 88, 18);
    sphere(d.s, 6, 4);
    pop();
  }
  blendMode(BLEND);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
