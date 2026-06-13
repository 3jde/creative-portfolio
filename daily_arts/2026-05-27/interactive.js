let figures = [];
let flare = 0;
let mode = "rally";

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(min(2, window.devicePixelRatio || 1));
  colorMode(HSB, 360, 100, 100, 1);
  resetFigures();
}

function resetFigures() {
  figures = [];
  for (let i = 0; i < 150; i++) {
    const row = floor(i / 18);
    const x = width * .12 + (i % 18) * width * .045 + random(-18, 18);
    const y = height * .83 - row * 34 + random(-10, 10);
    figures.push({ pos: createVector(random(width), height + random(120)), home: createVector(x, y), vel: p5.Vector.random2D().mult(random(.5, 2)), h: random([4, 28, 214, 45]), mass: random(.7, 1.8), arm: random(TAU) });
  }
}

function draw() {
  background(232, 18, 8);
  drawSmoke();
  const target = createVector(mouseX || width * .5, mouseY || height * .55);
  for (const f of figures) updateFigure(f, target);
  drawFlag(target);
  for (const f of figures) drawFigure(f);
  drawForeground();
  flare *= .92;
}

function updateFigure(f, target) {
  let desired = p5.Vector.sub(f.home, f.pos).mult(mode === "scatter" ? -.006 : .012);
  if (mouseIsPressed) desired.add(p5.Vector.sub(target, f.pos).setMag(.18 / f.mass));
  if (mode === "scatter") desired.add(p5.Vector.random2D().mult(.42));
  f.vel.add(desired);
  f.vel.mult(.93);
  f.pos.add(f.vel);
}

function drawSmoke() {
  noStroke();
  for (let i = 0; i < 34; i++) {
    const x = (i * 97 + frameCount * (i % 3 + 1) * .35) % (width + 180) - 90;
    const y = height * (.18 + (i % 9) * .055) + sin(frameCount * .01 + i) * 18;
    fill(42, 20, 45 + i % 4 * 8, .035);
    ellipse(x, y, 170 + i % 5 * 38, 48 + i % 6 * 15);
  }
}

function drawFlag(target) {
  push();
  translate(width * .55, height * .29);
  const wind = sin(frameCount * .055) * 18 + flare * 24;
  stroke(34, 20, 82, .8);
  strokeWeight(5);
  line(0, 0, -24, height * .42);
  noStroke();
  for (let i = 0; i < 3; i++) {
    fill([214, 0, 42][i], 76, 88, .88);
    beginShape();
    vertex(0, i * 24);
    bezierVertex(68, -18 + i * 24 + wind, 124, 28 + i * 24 - wind, 190, i * 24 + sin(frameCount * .05) * 14);
    vertex(188, i * 24 + 24);
    bezierVertex(118, 42 + i * 24 - wind, 74, 4 + i * 24 + wind, 0, i * 24 + 24);
    endShape(CLOSE);
  }
  if (flare > .02) {
    noFill();
    stroke(45, 80, 100, flare * .5);
    strokeWeight(3);
    circle(target.x - width * .55, target.y - height * .29, 120 + flare * 220);
  }
  pop();
}

function drawFigure(f) {
  push();
  translate(f.pos.x, f.pos.y);
  const scaleByY = map(f.pos.y, height * .18, height, .45, 1.25, true);
  scale(scaleByY);
  noStroke();
  fill(f.h, 48, f.h === 214 ? 72 : 84, .9);
  rect(-5, -24, 10, 28, 3);
  fill(30, 22, 88, .95);
  circle(0, -32, 11);
  stroke(f.h, 58, 88, .8);
  strokeWeight(3);
  const arm = sin(frameCount * .05 + f.arm) * 8 + flare * 12;
  line(-4, -18, -18, -35 - arm);
  line(4, -18, 17, -32 + arm);
  pop();
}

function drawForeground() {
  noStroke();
  fill(32, 45, 10, .8);
  beginShape();
  vertex(0, height);
  for (let x = 0; x <= width; x += 45) vertex(x, height * .88 + noise(x * .01, frameCount * .004) * 48);
  vertex(width, height);
  endShape(CLOSE);
}

function keyPressed() {
  if (key === " ") flare = 1;
  if (key === "r" || key === "R") { mode = "rally"; resetFigures(); }
  if (key === "s" || key === "S") mode = mode === "scatter" ? "rally" : "scatter";
}

function windowResized() { resizeCanvas(windowWidth, windowHeight); resetFigures(); }
