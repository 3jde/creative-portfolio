let rings = [];
let bridgePulse = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(min(2, window.devicePixelRatio || 1));
  colorMode(HSB, 360, 100, 100, 100);
  for (let i = 0; i < 32; i++) {
    rings.push({ y: random(height), phase: random(TAU), hue: random([18, 28, 204, 318]) });
  }
}

function draw() {
  const cx = width * 0.5;
  const cy = height * 0.52;
  const pressure = mouseIsPressed ? 1 : 0;
  bridgePulse = lerp(bridgePulse, pressure, 0.08);
  background(228, 60, 7);
  drawSky();
  drawFjord();
  drawBridge();
  drawFigure(cx, cy);
  drawScream(cx, cy, pressure);
  drawHint();
}

function drawSky() {
  noStroke();
  for (let y = 0; y < height * 0.65; y += 7) {
    const k = y / (height * 0.65);
    fill(lerp(18, 338, k * 0.45), 76, lerp(93, 35, k), 90);
    rect(0, y, width, 9);
  }
  noFill();
  strokeWeight(max(2, width * 0.006));
  for (let i = 0; i < rings.length; i++) {
    const r = rings[i];
    const y = (r.y + frameCount * (0.35 + i * 0.01)) % (height * 0.72);
    const amp = 22 + sin(frameCount * 0.02 + r.phase) * 18 + bridgePulse * 38;
    stroke(r.hue, 78, 88, 32);
    beginShape();
    for (let x = -20; x <= width + 20; x += 22) {
      const yy = y + sin(x * 0.012 + r.phase + frameCount * 0.018) * amp;
      curveVertex(x, yy);
    }
    endShape();
  }
}

function drawFjord() {
  noStroke();
  fill(212, 70, 18, 92);
  beginShape();
  vertex(0, height * 0.62);
  vertex(width, height * 0.48);
  vertex(width, height);
  vertex(0, height);
  endShape();
  stroke(194, 52, 55, 30);
  strokeWeight(2);
  for (let i = 0; i < 16; i++) {
    const y = height * 0.62 + i * height * 0.024;
    line(0, y + sin(frameCount * 0.02 + i) * 5, width, y - i * 4);
  }
}

function drawBridge() {
  const skew = map(mouseX, 0, width, -70, 70, true);
  fill(28, 68, 35, 95);
  noStroke();
  quad(-40, height * 0.78, width * 0.62 + skew, height * 0.52, width * 0.78 + skew, height * 0.6, width * 0.1, height + 40);
  stroke(31, 52, 85, 86);
  strokeWeight(5);
  for (let i = 0; i < 7; i++) {
    const off = i * 34;
    line(-20, height * 0.77 + off, width * 0.71 + skew, height * 0.54 + off * 0.23);
  }
  stroke(30, 72, 18, 95);
  strokeWeight(9);
  line(width * 0.06, height, width * 0.68 + skew, height * 0.54);
  line(width * 0.22, height, width * 0.84 + skew, height * 0.6);
}

function drawFigure(cx, cy) {
  const lean = map(mouseX, 0, width, -0.15, 0.15, true);
  push();
  translate(cx, cy + sin(frameCount * 0.06) * 4);
  rotate(lean);
  noStroke();
  fill(28, 24, 18, 98);
  ellipse(0, 72, 48, 140);
  fill(30, 28, 82, 98);
  ellipse(0, 0, 72, 92);
  fill(28, 42, 7, 98);
  ellipse(-14, -9, 12, 24);
  ellipse(14, -9, 12, 24);
  fill(356, 72, 16, 98);
  ellipse(0, 24, 17, 32 + bridgePulse * 26);
  stroke(28, 22, 18, 98);
  strokeWeight(14);
  line(-29, 37, -56, 18);
  line(29, 37, 56, 18);
  pop();
}

function drawScream(cx, cy, pressure) {
  noFill();
  const touchDist = dist(mouseX, mouseY, cx, cy);
  const field = map(touchDist, 0, max(width, height) * 0.7, 1.7, 0.25, true) + pressure;
  for (let i = 0; i < 18; i++) {
    const rad = 55 + i * (18 + field * 8);
    stroke((20 + i * 11) % 360, 78, 96, 34 - i * 1.3);
    strokeWeight(max(1.2, 5 - i * 0.12));
    beginShape();
    for (let a = 0; a <= TAU + 0.08; a += 0.14) {
      const wobble = sin(a * 5 + frameCount * 0.08 + i) * 12 * field;
      const x = cx + cos(a) * (rad + wobble) * 0.68;
      const y = cy + sin(a) * (rad * 0.82 + wobble);
      curveVertex(x, y);
    }
    endShape();
  }
}

function drawHint() {
  fill(42, 30, 96, 70);
  noStroke();
  textAlign(LEFT, BOTTOM);
  textSize(12);
  text("press / drag to bend the sound field", 16, height - 16);
}

function touchMoved() {
  return false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
