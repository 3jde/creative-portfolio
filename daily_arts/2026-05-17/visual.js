let seeds = [];
let glyphs = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  pixelDensity(1);
  colorMode(HSB, 360, 100, 100, 100);
  for (let i = 0; i < 180; i++) {
    seeds.push({
      a: random(TWO_PI),
      r: random(40, min(width, height) * 0.54),
      z: random(-360, 360),
      s: random(4, 18),
      h: random([28, 54, 112, 176, 318])
    });
  }
  for (let i = 0; i < 34; i++) {
    glyphs.push({ x: random(-width * 0.46, width * 0.46), y: random(-height * 0.38, height * 0.38), k: random(0.6, 1.7), p: random(TWO_PI) });
  }
}

function draw() {
  background(8, 22, 9);
  const t = millis() * 0.001;
  const mx = map(mouseX || width / 2, 0, width, -1, 1);
  const my = map(mouseY || height / 2, 0, height, -1, 1);
  rotateX(-0.48 + my * 0.18);
  rotateY(t * 0.11 + mx * 0.7);
  ambientLight(34, 24, 22);
  pointLight(48, 86, 92, -width * 0.3, -height * 0.25, 420);
  pointLight(322, 70, 88, width * 0.32, height * 0.2, 260);

  noFill();
  strokeWeight(1.25);
  for (let ring = 0; ring < 24; ring++) {
    const rr = 34 + ring * 17;
    const wobble = sin(t * 0.9 + ring) * 18;
    stroke((ring * 13 + t * 18) % 360, 55, 82, 22);
    beginShape();
    for (let a = 0; a <= TWO_PI + 0.03; a += 0.055) {
      const n = noise(cos(a) * 1.3 + ring, sin(a) * 1.3, t * 0.18);
      const r = rr + n * 72 + wobble;
      vertex(cos(a) * r, sin(a) * r, (n - 0.5) * 190);
    }
    endShape();
  }

  for (const s of seeds) {
    const pulse = sin(t * s.s + s.a * 3) * 0.5 + 0.5;
    const x = cos(s.a + t * 0.13) * (s.r + pulse * 26);
    const y = sin(s.a * 1.7 - t * 0.09) * (s.r * 0.68 + pulse * 16);
    const z = s.z + sin(t + s.a) * 120;
    push();
    translate(x, y, z);
    rotateZ(t + s.a);
    rotateX(t * 0.6);
    noStroke();
    fill(s.h, 72, 92, 76);
    cone(s.s * (0.7 + pulse), s.s * 3.2, 5, 1);
    pop();
  }

  push();
  translate(0, 0, -190);
  for (const g of glyphs) {
    const k = g.k * (1 + 0.18 * sin(t * 1.5 + g.p));
    stroke((g.p * 80 + t * 30) % 360, 50, 96, 34);
    strokeWeight(2);
    noFill();
    push();
    translate(g.x, g.y, sin(t + g.p) * 90);
    rotateZ(g.p + t * 0.2);
    beginShape();
    for (let i = 0; i < 7; i++) {
      const a = i * TWO_PI / 6;
      vertex(cos(a) * 18 * k, sin(a) * 28 * k);
    }
    endShape(CLOSE);
    pop();
  }
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
