let blocks = [];
let seedValue = 270527;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(min(2, window.devicePixelRatio || 1));
  colorMode(HSB, 360, 100, 100, 1);
  buildComposition();
}

function buildComposition() {
  randomSeed(seedValue);
  blocks = [];
  const palette = [8, 38, 52, 214, 0];
  for (let i = 0; i < 18; i++) {
    blocks.push({
      x: random(.14, .86),
      y: random(.12, .82),
      w: random(.025, .18),
      h: random(.012, .11),
      a: random(-.8, .8),
      hue: random(palette),
      sat: random([0, 18, 70, 82]),
      bri: random([12, 24, 78, 92]),
      phase: random(TAU)
    });
  }
}

function draw() {
  background(42, 16, 89);
  paperGrain();
  const mx = map(mouseX || width / 2, 0, width, -1, 1);
  const my = map(mouseY || height / 2, 0, height, -1, 1);
  translate(width / 2, height / 2);
  const unit = min(width, height);
  drawQuietAxis(unit, mx);
  for (const b of blocks) drawBlock(b, unit, mx, my);
  drawBlackSquare(unit, mx, my);
}

function paperGrain() {
  noStroke();
  for (let i = 0; i < 650; i++) {
    fill(35, 10, random(76, 96), .035);
    rect(random(width), random(height), random(1, 3), random(1, 3));
  }
}

function drawQuietAxis(unit, mx) {
  stroke(32, 18, 28, .14);
  strokeWeight(1);
  line(-unit * .42, sin(frameCount * .006) * 26, unit * .42, mx * 34);
  line(mx * 18, -unit * .36, -mx * 26, unit * .37);
}

function drawBlock(b, unit, mx, my) {
  push();
  const drift = sin(frameCount * .008 + b.phase);
  translate((b.x - .5) * width + mx * drift * 24, (b.y - .5) * height + my * cos(b.phase) * 20);
  rotate(b.a + drift * .035 + mx * .04);
  noStroke();
  fill(b.hue, b.sat, b.bri, .82);
  rectMode(CENTER);
  rect(0, 0, max(8, b.w * unit), max(4, b.h * unit));
  pop();
}

function drawBlackSquare(unit, mx, my) {
  push();
  translate(-unit * .09 + mx * 16, -unit * .05 + my * 12);
  rotate(-.09 + sin(frameCount * .005) * .018);
  fill(30, 28, 8, .92);
  noStroke();
  rectMode(CENTER);
  rect(0, 0, unit * .18, unit * .18);
  noFill();
  stroke(30, 20, 12, .18);
  strokeWeight(2);
  rect(0, 0, unit * .205, unit * .205);
  pop();
}

function mousePressed() {
  seedValue = floor(random(999999));
  buildComposition();
}

function windowResized() { resizeCanvas(windowWidth, windowHeight); }
