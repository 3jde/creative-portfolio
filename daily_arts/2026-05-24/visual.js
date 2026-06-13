let lances = [];
let banners = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  pixelDensity(min(2, window.devicePixelRatio || 1));
  colorMode(HSB, 360, 100, 100, 1);
  for (let i = 0; i < 96; i++) {
    const z = map(i, 0, 95, -900, 420);
    lances.push({
      z,
      x: random(-420, 420) * map(z, -900, 420, .42, 1.4),
      y: random(-180, 150),
      tilt: random(-0.7, 0.7),
      hue: random([18, 42, 205, 342])
    });
  }
  for (let i = 0; i < 18; i++) banners.push({ x: random(-360, 360), z: random(-760, 260), phase: random(TAU), hue: random([2, 44, 213]) });
}

function draw() {
  background(184, 24, 7);
  const mx = map(mouseX || width * .5, 0, width, -1, 1);
  const my = map(mouseY || height * .5, 0, height, -1, 1);
  orbitControl(0.7, 0.7, 0.05);
  rotateX(-0.2 + my * 0.12);
  rotateY(mx * 0.22);
  ambientLight(24);
  directionalLight(color(44, 55, 92), -0.35, -0.7, -0.2);
  directionalLight(color(205, 50, 50), 0.5, 0.1, -0.8);
  drawGround();
  drawPerspectiveRibs();
  for (const b of banners) drawBanner(b);
  for (const s of lances) drawLance(s, mx);
  drawArmorNodes(mx, my);
}

function drawGround() {
  push();
  rotateX(HALF_PI);
  noStroke();
  for (let i = 0; i < 12; i++) {
    fill(i % 2 ? color(70, 31, 22) : color(112, 18, 18));
    translate(0, 0, -1);
    plane(1200 - i * 28, 760 - i * 42);
  }
  pop();
}

function drawPerspectiveRibs() {
  strokeWeight(2);
  for (let i = -9; i <= 9; i++) {
    stroke(44, 68, 65, 0.35);
    line(i * 54, 215, 420, i * 9, -40, -930);
  }
  for (let z = -860; z < 430; z += 95) {
    stroke(31, 55, 50, 0.28);
    line(-620, 210, z, 620, 210, z);
  }
}

function drawLance(s, mx) {
  push();
  const pulse = sin(frameCount * 0.018 + s.z * 0.015);
  translate(s.x + pulse * 18, s.y, s.z);
  rotateZ(s.tilt + mx * 0.25);
  rotateY(HALF_PI + pulse * 0.08);
  stroke(s.hue, 62, 95, 0.72);
  strokeWeight(map(s.z, -900, 420, 1.2, 5));
  line(-150, 0, 0, 150, 0, 0);
  noStroke();
  fill(35, 25, 94, 0.9);
  cone(8, 26, 5);
  pop();
}

function drawBanner(b) {
  push();
  translate(b.x, -96 + sin(frameCount * 0.025 + b.phase) * 18, b.z);
  rotateY(sin(frameCount * 0.012 + b.phase) * 0.3);
  stroke(35, 30, 92);
  strokeWeight(3);
  line(0, -80, 0, 0, 78, 0);
  noStroke();
  fill(b.hue, 72, 78, 0.86);
  beginShape();
  for (let i = 0; i < 9; i++) vertex(sin(i * .9 + frameCount * .035 + b.phase) * 16 + 8, -70 + i * 12, 0);
  vertex(74, 18, 0);
  vertex(10, -70, 0);
  endShape(CLOSE);
  pop();
}

function drawArmorNodes(mx, my) {
  for (let i = 0; i < 34; i++) {
    const a = i * 0.72 + frameCount * 0.008;
    const r = 130 + (i % 7) * 36;
    push();
    translate(cos(a) * r * 0.9, 82 + sin(i) * 42 + my * 22, sin(a) * r - 120);
    rotateY(a + mx);
    fill(205, 24, 70, 0.55);
    noStroke();
    sphere(10 + (i % 4) * 3, 8, 6);
    pop();
  }
}

function windowResized() { resizeCanvas(windowWidth, windowHeight); }
