const notes = [];
let score = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  resetScore();
}

function resetScore() {
  score = [];
  const palette = [4, 32, 50, 206, 256, 318];
  for (let i = 0; i < 42; i++) {
    score.push({
      x: random(width),
      y: random(height),
      r: random(16, 64),
      h: random(palette),
      vx: random(-0.4, 0.4),
      vy: random(-0.4, 0.4),
      phase: random(TWO_PI),
      kind: random(['circle', 'bar', 'arc'])
    });
  }
}

function draw() {
  background(42, 18, 94);
  const t = millis() * 0.001;
  noStroke();
  fill(38, 18, 86, 55);
  rect(0, 0, width, height);

  for (const n of notes) {
    n.life *= 0.966;
    n.r += 4.5;
  }
  while (notes.length && notes[0].life < 1) notes.shift();

  for (const s of score) {
    const dx = mouseX - s.x;
    const dy = mouseY - s.y;
    const d = max(24, sqrt(dx * dx + dy * dy));
    if (mouseIsPressed || touches.length) {
      s.vx -= dx / (d * d) * 4.5;
      s.vy -= dy / (d * d) * 4.5;
    } else {
      s.vx += sin(t + s.phase) * 0.015;
      s.vy += cos(t * 0.8 + s.phase) * 0.015;
    }
    s.x += s.vx;
    s.y += s.vy;
    s.vx *= 0.985;
    s.vy *= 0.985;
    if (s.x < -80) s.x = width + 80;
    if (s.x > width + 80) s.x = -80;
    if (s.y < -80) s.y = height + 80;
    if (s.y > height + 80) s.y = -80;
  }

  stroke(25, 22, 18, 28);
  strokeWeight(1);
  for (let i = 0; i < score.length; i++) {
    for (let j = i + 1; j < score.length; j++) {
      const a = score[i];
      const b = score[j];
      const d = dist(a.x, a.y, b.x, b.y);
      if (d < 150) line(a.x, a.y, b.x, b.y);
    }
  }

  for (const s of score) {
    push();
    translate(s.x, s.y);
    rotate(s.phase + t * 0.24);
    const breathe = 1 + sin(t * 1.7 + s.phase) * 0.12;
    fill(s.h, 70, 82, 78);
    stroke(24, 26, 16, 80);
    strokeWeight(2);
    if (s.kind === 'circle') {
      ellipse(0, 0, s.r * breathe);
    } else if (s.kind === 'bar') {
      rectMode(CENTER);
      rect(0, 0, s.r * 1.7, s.r * 0.26, 2);
    } else {
      noFill();
      stroke(s.h, 76, 68, 86);
      strokeWeight(7);
      arc(0, 0, s.r * 1.4, s.r * 1.4, 0, PI + HALF_PI);
    }
    pop();
  }

  noFill();
  for (const n of notes) {
    stroke(n.h, 78, 74, n.life);
    strokeWeight(3);
    ellipse(n.x, n.y, n.r);
  }
}

function pointerTone(x, y) {
  notes.push({ x, y, r: 8, life: 100, h: map(x, 0, width, 0, 360) });
  for (const s of score) {
    const d = dist(x, y, s.x, s.y);
    if (d < 220) {
      const a = atan2(s.y - y, s.x - x);
      s.vx += cos(a) * map(d, 0, 220, 7, 0.4);
      s.vy += sin(a) * map(d, 0, 220, 7, 0.4);
    }
  }
}

function mouseDragged() { pointerTone(mouseX, mouseY); return false; }
function mousePressed() { pointerTone(mouseX, mouseY); return false; }
function touchMoved() { if (touches[0]) pointerTone(touches[0].x, touches[0].y); return false; }
function doubleClicked() { resetScore(); }
function windowResized() { resizeCanvas(windowWidth, windowHeight); resetScore(); }
