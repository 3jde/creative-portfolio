let pearls = [];
let blink = 0;
let lastTap = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  resetPearls();
}

function resetPearls() {
  pearls = Array.from({ length: 34 }, (_, i) => ({
    angle: i * TAU / 34,
    radius: random(18, min(width, height) * 0.34),
    speed: random(-0.012, 0.014),
    size: random(4, 16),
    hue: random([38, 48, 190, 205])
  }));
}

function draw() {
  background(196, 72, 8);
  const p = pointer();
  const gaze = createVector(map(p.x, 0, width, -1, 1), map(p.y, 0, height, -1, 1));
  paintRoom(gaze);
  paintHead(gaze);
  paintPearlField(p, gaze);
  paintLens(p);
}

function pointer() {
  if (touches.length) return createVector(touches[0].x, touches[0].y);
  return createVector(mouseX || width * 0.62, mouseY || height * 0.44);
}

function paintRoom(gaze) {
  noStroke();
  fill(203, 55, 12);
  rect(0, 0, width, height);
  fill(42, 44, 18, 82);
  beginShape();
  vertex(width * 0.06, height);
  vertex(width * (0.28 + gaze.x * 0.03), height * 0.18);
  vertex(width * (0.72 + gaze.x * 0.02), height * 0.1);
  vertex(width * 0.94, height);
  endShape(CLOSE);
  blendMode(ADD);
  for (let i = 0; i < 18; i++) {
    fill(44, 55, 90, 2.7);
    ellipse(width * (0.15 + gaze.x * 0.025), height * 0.18, width * (0.22 + i * 0.035), height * (0.16 + i * 0.03));
  }
  blendMode(BLEND);
}

function paintHead(gaze) {
  const cx = width * 0.5;
  const cy = height * 0.49;
  const scale = min(width, height) / 760;
  push();
  translate(cx, cy);
  rotate(gaze.x * 0.08);
  noStroke();
  fill(34, 58, 18);
  ellipse(-15 * scale, 110 * scale, 250 * scale, 260 * scale);
  fill(34, 52, 78);
  ellipse(0, 0, 190 * scale, 245 * scale);
  fill(30, 68, 33, 82);
  arc(0, 22 * scale, 194 * scale, 242 * scale, -0.1, PI + 0.1);
  fill(208, 70, 62);
  arc(-4 * scale, -92 * scale, 215 * scale, 132 * scale, PI, TAU);
  fill(52, 88, 86);
  rect(-108 * scale, -120 * scale, 218 * scale, 38 * scale, 20 * scale);
  fill(24, 45, 94, 84);
  ellipse(-35 * scale, -26 * scale, 16 * scale, 9 * scale);
  ellipse(39 * scale, -24 * scale, 16 * scale, 9 * scale);
  fill(14, 50, 18);
  ellipse(-32 * scale + gaze.x * 6 * scale, -25 * scale + gaze.y * 3 * scale, 5 * scale);
  ellipse(42 * scale + gaze.x * 6 * scale, -23 * scale + gaze.y * 3 * scale, 5 * scale);
  stroke(18, 55, 45, 75);
  strokeWeight(3 * scale);
  noFill();
  arc(4 * scale, 40 * scale, 54 * scale, 20 * scale, 0.1, PI - 0.1);
  noStroke();
  blendMode(ADD);
  fill(190, 22, 100, 92);
  ellipse(91 * scale + gaze.x * 10 * scale, 62 * scale + gaze.y * 8 * scale, 35 * scale);
  fill(45, 55, 100, 38);
  ellipse(86 * scale + gaze.x * 10 * scale, 54 * scale + gaze.y * 8 * scale, 12 * scale);
  blendMode(BLEND);
  pop();
}

function paintPearlField(p, gaze) {
  const center = createVector(width * 0.5 + gaze.x * 32, height * 0.5 + gaze.y * 22);
  blendMode(ADD);
  for (const pearl of pearls) {
    pearl.angle += pearl.speed + gaze.x * 0.0015;
    const wobble = sin(frameCount * 0.018 + pearl.radius) * 12;
    const x = center.x + cos(pearl.angle) * (pearl.radius + wobble);
    const y = center.y + sin(pearl.angle * 0.72) * (pearl.radius * 0.58 + wobble);
    const d = dist(x, y, p.x, p.y);
    fill(pearl.hue, 22, 95, map(d, 0, width * 0.35, 78, 18, true));
    ellipse(x, y, pearl.size + map(d, 0, 160, 13, 0, true));
  }
  blendMode(BLEND);
}

function paintLens(p) {
  noFill();
  stroke(48, 45, 96, 42);
  strokeWeight(2);
  ellipse(p.x, p.y, 96 + sin(frameCount * 0.04) * 18);
  stroke(190, 18, 96, 35);
  ellipse(p.x, p.y, 156);
  noStroke();
}

function mousePressed() {
  if (millis() - lastTap < 320) resetPearls();
  lastTap = millis();
}

function touchStarted() {
  mousePressed();
  return false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  resetPearls();
}
