let flecks = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(min(2, window.devicePixelRatio || 1));
  colorMode(HSB, 360, 100, 100, 1);
  for (let i = 0; i < 220; i++) flecks.push({ x: random(width), y: random(height), s: random(0.6, 2.8), p: random(TAU) });
}

function draw() {
  const mx = map(mouseX || width * .5, 0, width, -1, 1);
  const my = map(mouseY || height * .5, 0, height, -1, 1);
  drawNocturneSky(mx, my);
  drawRiver(mx);
  drawIndustrialShadows(mx, my);
  drawFireworks(mx, my);
  drawFlecks(mx);
}

function drawNocturneSky(mx, my) {
  noStroke();
  for (let y = 0; y < height; y += 3) {
    const t = y / height;
    fill(206 + mx * 8, 32 + t * 14, 8 + t * 24 + my * 4, 1);
    rect(0, y, width, 3);
  }
  blendMode(ADD);
  for (let i = 0; i < 7; i++) {
    fill(48, 22, 18, 0.035);
    ellipse(width * (.18 + i * .12 + mx * .012), height * (.16 + sin(frameCount * .005 + i) * .04), width * .42, height * .22);
  }
  blendMode(BLEND);
}

function drawRiver(mx) {
  noStroke();
  for (let y = height * .52; y < height; y += 5) {
    const t = map(y, height * .52, height, 0, 1);
    fill(198, 38, 13 + t * 13, 0.92);
    rect(0, y, width, 5);
    stroke(45, 30, 60, 0.11);
    strokeWeight(1);
    line(0, y + sin(y * .04 + frameCount * .018) * 5, width, y + sin(y * .035 + mx * 2) * 5);
    noStroke();
  }
}

function drawIndustrialShadows(mx, my) {
  const h = height * .52;
  fill(210, 45, 5, 0.82);
  noStroke();
  rect(0, h - 12, width, 28);
  for (let i = 0; i < 9; i++) {
    const x = width * (i / 8) + mx * 18 * sin(i);
    const top = h - 50 - noise(i, frameCount * .006) * 95 - my * 16;
    fill(216, 38, 4, 0.78);
    rect(x - 8, top, 16, h - top);
    fill(36, 62, 42, 0.18);
    ellipse(x + 10, top - 12, 46, 18);
  }
}

function drawFireworks(mx, my) {
  blendMode(ADD);
  const cx = width * (.68 + mx * .04);
  const cy = height * (.23 + my * .025);
  for (let r = 18; r < 180; r += 18) {
    stroke(42, 55, 80, map(r, 18, 180, .24, .02));
    noFill();
    ellipse(cx, cy, r + sin(frameCount * .015 + r) * 8, r * .62);
  }
  for (let i = 0; i < 46; i++) {
    const a = i * TAU / 46 + sin(frameCount * .006) * .25;
    const r = 26 + (i % 8) * 16 + sin(frameCount * .035 + i) * 8;
    noStroke();
    fill(45, 46, 90, 0.18);
    ellipse(cx + cos(a) * r, cy + sin(a) * r * .6, 3.5, 3.5);
  }
  blendMode(BLEND);
}

function drawFlecks(mx) {
  noStroke();
  for (const f of flecks) {
    f.x += 0.08 + mx * 0.05;
    if (f.x > width + 10) f.x = -10;
    const shimmer = sin(frameCount * .03 + f.p) * .5 + .5;
    fill(45, 30, 88, 0.08 + shimmer * .12);
    ellipse(f.x, f.y + sin(frameCount * .01 + f.p) * 2, f.s, f.s);
  }
}

function windowResized() { resizeCanvas(windowWidth, windowHeight); }
