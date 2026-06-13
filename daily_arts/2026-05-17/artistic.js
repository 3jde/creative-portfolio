let dots = [];
let wind = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  colorMode(HSB, 360, 100, 100, 100);
  buildDots();
}

function buildDots() {
  dots = [];
  const palette = [36, 47, 78, 120, 178, 212, 256, 348];
  const step = max(7, min(width, height) / 94);
  for (let y = -step; y < height + step; y += step) {
    for (let x = -step; x < width + step; x += step) {
      const river = height * 0.62 + sin(x * 0.008) * height * 0.06;
      const shade = y > river ? 66 : 94;
      const humanBand = abs(y - height * 0.5) < height * 0.18 && random() < 0.09;
      dots.push({
        x: x + random(-2, 2),
        y: y + random(-2, 2),
        ox: x,
        oy: y,
        h: humanBand ? random([8, 218, 322]) : random(palette),
        b: shade + random(-10, 7),
        s: random(28, 70),
        r: random(step * 0.28, step * 0.58),
        p: random(TWO_PI)
      });
    }
  }
}

function draw() {
  background(45, 16, 97);
  const t = millis() * 0.001;
  wind = lerp(wind, map(mouseX || width / 2, 0, width, -1, 1), 0.035);

  noStroke();
  fill(206, 18, 92, 100);
  rect(0, height * 0.6, width, height * 0.4);
  fill(76, 18, 90, 100);
  rect(0, 0, width, height * 0.6);
  fill(48, 55, 95, 80);
  ellipse(width * 0.78, height * 0.22, min(width, height) * 0.18);

  for (const d of dots) {
    const nx = noise(d.ox * 0.006, d.oy * 0.006, t * 0.16);
    const drift = (nx - 0.5) * 18 + wind * (d.oy / height) * 18;
    const ripple = sin(t * 2 + d.p + d.ox * 0.012) * 3;
    const px = d.x + drift;
    const py = d.y + ripple;
    fill((d.h + wind * 10 + nx * 14) % 360, d.s, d.b, 78);
    ellipse(px, py, d.r, d.r * (0.75 + nx * 0.6));
  }

  drawFigures(t);

  fill(36, 20, 18, 72);
  textSize(12);
  textAlign(LEFT, BOTTOM);
  text('drag the light across the river', 18, height - 18);
}

function drawFigures(t) {
  const figures = [
    [0.18, 0.55, 0.9, 8],
    [0.33, 0.48, 1.25, 218],
    [0.52, 0.54, 1.05, 328],
    [0.68, 0.5, 1.35, 42]
  ];
  for (const f of figures) {
    const x = width * f[0] + sin(t + f[0] * 8) * 4;
    const y = height * f[1];
    const k = min(width, height) * 0.045 * f[2];
    fill(f[3], 58, 52, 80);
    ellipse(x, y - k * 1.35, k * 0.55);
    rectMode(CENTER);
    rect(x, y, k * 0.62, k * 1.8, 3);
    fill(40, 30, 24, 70);
    ellipse(x, y + k * 1.1, k * 1.2, k * 0.24);
  }
}

function mouseDragged() {
  for (const d of dots) {
    const ds = dist(mouseX, mouseY, d.x, d.y);
    if (ds < 90) {
      d.h = (d.h + 2.5) % 360;
      d.b = min(100, d.b + 0.8);
    }
  }
  return false;
}

function touchMoved() {
  mouseDragged();
  return false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  buildDots();
}
