let pieces = [];
let grabbed = null;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(min(2, window.devicePixelRatio || 1));
  colorMode(HSB, 360, 100, 100, 1);
  seedPortrait();
}

function seedPortrait() {
  pieces = [];
  const cx = width / 2, cy = height / 2;
  const specs = [
    [0, -170, 46, 78, 34], [-52, -142, 62, 38, 106], [54, -138, 62, 38, 4],
    [-84, -68, 52, 64, 22], [84, -66, 52, 64, 22], [0, -36, 40, 94, 48],
    [-44, 34, 58, 38, 350], [44, 34, 58, 38, 8], [0, 92, 92, 34, 18],
    [-112, 14, 34, 110, 136], [112, 12, 34, 110, 136], [0, 148, 78, 48, 96],
    [-30, -82, 26, 22, 58], [34, -82, 26, 22, 58], [0, 8, 30, 52, 28]
  ];
  for (const [x, y, w, h, hue] of specs) {
    pieces.push({ homeX: cx + x, homeY: cy + y, x: cx + x + random(-14, 14), y: cy + y + random(-14, 14), vx: 0, vy: 0, w, h, hue, rot: random(-0.6, 0.6), spin: random(-0.015, 0.015) });
  }
}

function draw() {
  background(43, 26, 8);
  drawTable();
  const px = touches[0]?.x ?? mouseX;
  const py = touches[0]?.y ?? mouseY;
  for (const p of pieces) {
    if (p !== grabbed) {
      p.vx += (p.homeX - p.x) * 0.006;
      p.vy += (p.homeY - p.y) * 0.006;
      const d = dist(px, py, p.x, p.y);
      if (d < 130) {
        const a = atan2(p.y - py, p.x - px);
        p.vx += cos(a) * 0.22;
        p.vy += sin(a) * 0.22;
      }
    }
    p.vx *= 0.9; p.vy *= 0.9;
    p.x += p.vx; p.y += p.vy;
    p.rot += p.spin + p.vx * 0.001;
    drawProduce(p);
  }
  drawFaceGuides();
}

function drawTable() {
  noStroke();
  for (let y = 0; y < height; y += 18) {
    fill(35, 25, map(y, 0, height, 16, 6), 1);
    rect(0, y, width, 18);
  }
}

function drawProduce(p) {
  push();
  translate(p.x, p.y);
  rotate(p.rot);
  drawingContext.shadowColor = 'rgba(0,0,0,.45)';
  drawingContext.shadowBlur = 18;
  drawingContext.shadowOffsetY = 8;
  noStroke();
  fill(p.hue, 72, 78, 0.95);
  ellipse(0, 0, p.w, p.h);
  fill((p.hue + 28) % 360, 58, 96, 0.38);
  ellipse(-p.w * .18, -p.h * .18, p.w * .34, p.h * .24);
  stroke(96, 42, 38, 0.9);
  strokeWeight(3);
  line(0, -p.h * .42, 8, -p.h * .6);
  noStroke();
  fill(128, 48, 43, 0.85);
  ellipse(14, -p.h * .52, 18, 9);
  pop();
}

function drawFaceGuides() {
  const cx = width / 2, cy = height / 2;
  noFill();
  stroke(45, 20, 82, 0.14);
  strokeWeight(2);
  ellipse(cx, cy - 24, 268, 374);
  line(cx - 112, cy + 78, cx + 112, cy + 78);
  noStroke();
  fill(42, 28, 92, 0.7);
  textAlign(CENTER);
  textSize(13);
  text('drag produce, release to let the portrait rebuild', cx, height - 28);
}

function pointerStart(x, y) {
  let best = null, bestD = 999;
  for (const p of pieces) {
    const d = dist(x, y, p.x, p.y);
    if (d < max(p.w, p.h) * .65 && d < bestD) { best = p; bestD = d; }
  }
  grabbed = best;
}
function mousePressed() { pointerStart(mouseX, mouseY); }
function touchStarted() { pointerStart(touches[0]?.x || mouseX, touches[0]?.y || mouseY); return false; }
function mouseDragged() { if (grabbed) { grabbed.x = mouseX; grabbed.y = mouseY; grabbed.vx = movedX; grabbed.vy = movedY; } }
function touchMoved() { if (grabbed && touches[0]) { grabbed.x = touches[0].x; grabbed.y = touches[0].y; } return false; }
function mouseReleased() { grabbed = null; }
function touchEnded() { grabbed = null; return false; }
function windowResized() { resizeCanvas(windowWidth, windowHeight); seedPortrait(); }
