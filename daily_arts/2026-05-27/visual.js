let ribbons = [];
let sparks = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  pixelDensity(min(2, window.devicePixelRatio || 1));
  colorMode(HSB, 360, 100, 100, 1);
  for (let i = 0; i < 84; i++) {
    ribbons.push({ r: random(70, 430), z: random(-520, 240), a: random(TAU), speed: random(.004, .018), hue: random([28, 38, 48, 202, 216]) });
  }
  for (let i = 0; i < 420; i++) sparks.push({ a: random(TAU), r: random(20, 510), z: random(-520, 380), s: random(.4, 2.8), h: random([36, 48, 58, 212]) });
}

function draw() {
  background(28, 42, 5);
  const mx = map(mouseX || width / 2, 0, width, -1, 1);
  const my = map(mouseY || height / 2, 0, height, -1, 1);
  orbitControl(.55, .55, .04);
  rotateX(-.18 + my * .22);
  rotateY(mx * .28 + frameCount * .0015);
  ambientLight(18);
  pointLight(color(45, 80, 100), mx * 260, -180 + my * 90, 180);
  pointLight(color(205, 60, 70), -260, 180, -220);
  drawSunCore(mx, my);
  for (const r of ribbons) drawRibbon(r, mx, my);
  drawRainField(mx);
  drawHull();
}

function drawSunCore(mx, my) {
  push();
  noStroke();
  for (let i = 7; i > 0; i--) {
    fill(43, 82 - i * 5, 100, .055);
    sphere(28 + i * 34 + abs(mx) * 18, 32, 14);
  }
  fill(49, 72, 100, .96);
  sphere(34 + sin(frameCount * .03) * 3, 48, 24);
  pop();
}

function drawRibbon(r, mx, my) {
  const t = frameCount * r.speed + r.a;
  push();
  rotateZ(t + mx * .45);
  rotateY(sin(t * 1.7) * .42 + my * .18);
  translate(cos(t) * r.r, sin(t * .8) * r.r * .38, r.z + sin(t * 2) * 90);
  rotateZ(t * 1.4);
  noFill();
  stroke(r.hue, 78, 92, .3);
  strokeWeight(map(r.r, 70, 430, 7, 1.1));
  beginShape();
  for (let i = 0; i < 22; i++) {
    const q = i / 21;
    vertex((q - .5) * 210, sin(q * TAU + t) * 24, cos(q * TAU + t * 1.2) * 18);
  }
  endShape();
  pop();
}

function drawRainField(mx) {
  strokeWeight(1);
  for (const p of sparks) {
    const drift = frameCount * .012 * p.s;
    const x = cos(p.a + drift * .18) * p.r + mx * 55;
    const y = sin(p.a * 1.7 + drift) * p.r * .44;
    const z = ((p.z + frameCount * p.s * 2) % 900) - 520;
    stroke(p.h, 38, 100, .25);
    line(x, y, z, x + 18, y + 10, z + 34);
  }
}

function drawHull() {
  push();
  translate(0, 118, 132);
  rotateX(.08);
  fill(18, 54, 18, .9);
  noStroke();
  box(360, 26, 72);
  translate(55, -36, -6);
  fill(35, 40, 38, .8);
  cone(34, 90, 5);
  pop();
}

function windowResized() { resizeCanvas(windowWidth, windowHeight); }
