let rain = [];
let walkers = [];
let ink = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  buildRain();
}

function buildRain() {
  rain = Array.from({ length: 260 }, () => ({
    x: random(width),
    y: random(-height, height),
    len: random(18, 64),
    speed: random(5, 13),
    drift: random(-1.8, -0.4)
  }));
  walkers = Array.from({ length: 11 }, (_, i) => ({
    x: map(i, 0, 10, width * 0.05, width * 0.95),
    y: height * random(0.53, 0.76),
    pace: random(0.25, 0.9),
    hue: random([18, 32, 210, 226])
  }));
  ink = [];
}

function draw() {
  const p = pointer();
  background(206, 38, 14);
  paintPaper();
  paintBridge(p);
  paintWalkers(p);
  paintRain(p);
  paintInk(p);
  paintRiver();
}

function pointer() {
  if (touches.length) return createVector(touches[0].x, touches[0].y);
  return createVector(mouseX || width * 0.5, mouseY || height * 0.52);
}

function paintPaper() {
  noStroke();
  for (let y = 0; y < height; y += 5) {
    fill(205, 32, map(y, 0, height, 23, 9), 18);
    rect(0, y, width, 5);
  }
  for (let i = 0; i < 90; i++) {
    fill(42, 18, 70, 2.8);
    ellipse(random(width), random(height), random(1, 4), random(1, 4));
  }
}

function paintBridge(p) {
  const bend = map(p.x, 0, width, -32, 32);
  stroke(32, 48, 20, 88);
  strokeWeight(max(10, height * 0.025));
  noFill();
  beginShape();
  for (let i = 0; i <= 34; i++) {
    const x = map(i, 0, 34, -width * 0.05, width * 1.05);
    const y = height * 0.64 + sin(i / 34 * PI) * -height * 0.13 + bend * sin(i * 0.4);
    vertex(x, y);
  }
  endShape();
  strokeWeight(2);
  stroke(34, 65, 78, 50);
  for (let i = 0; i < 19; i++) {
    const x = map(i, 0, 18, width * 0.03, width * 0.97);
    line(x, height * 0.58, x + bend * 0.25, height * 0.76);
  }
}

function paintWalkers(p) {
  for (const w of walkers) {
    w.x += w.pace;
    if (w.x > width + 30) w.x = -30;
    const lift = sin(frameCount * 0.08 + w.x * 0.02) * 5;
    const near = constrain(map(dist(w.x, w.y, p.x, p.y), 0, 180, 1, 0), 0, 1);
    push();
    translate(w.x, w.y + lift);
    noStroke();
    fill(w.hue, 58, 30 + near * 34, 88);
    arc(0, -18, 42, 34, PI, TAU);
    fill(30, 40, 18, 92);
    rect(-7, -18, 14, 38, 4);
    stroke(30, 35, 12, 80);
    strokeWeight(2);
    line(-5, 18, -16, 39);
    line(5, 18, 15, 39);
    pop();
  }
}

function paintRain(p) {
  strokeCap(SQUARE);
  for (const r of rain) {
    const force = map(dist(r.x, r.y, p.x, p.y), 0, 220, 2.8, 0, true);
    r.x += r.drift - force * 0.7;
    r.y += r.speed + force;
    if (r.y > height + 70 || r.x < -80) {
      r.x = random(width + 100);
      r.y = random(-140, -20);
    }
    stroke(202, 24, 92, 24 + force * 15);
    strokeWeight(1 + force * 0.45);
    line(r.x, r.y, r.x - r.len * 0.36, r.y + r.len);
  }
}

function paintInk(p) {
  if (frameCount % 4 === 0 && (mouseIsPressed || touches.length)) {
    ink.push({ x: p.x, y: p.y, r: 4, life: 100, hue: random([205, 220, 28]) });
  }
  noStroke();
  for (let i = ink.length - 1; i >= 0; i--) {
    const b = ink[i];
    b.r += 1.7;
    b.life -= 1.9;
    fill(b.hue, 45, 55, b.life * 0.22);
    ellipse(b.x, b.y, b.r * 2.2, b.r * 0.8);
    if (b.life <= 0) ink.splice(i, 1);
  }
}

function paintRiver() {
  blendMode(ADD);
  for (let i = 0; i < 42; i++) {
    const y = height * 0.78 + i * height * 0.005;
    stroke(196, 25, 70, 5);
    line(0, y + sin(frameCount * 0.02 + i) * 6, width, y + cos(frameCount * 0.015 + i) * 5);
  }
  blendMode(BLEND);
}

function touchStarted() {
  return false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  buildRain();
}
