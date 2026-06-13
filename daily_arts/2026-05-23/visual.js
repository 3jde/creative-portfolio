// Hieronymus Bosch, The Garden of Earthly Delights: a triptych becomes a responsive swarm ecology.
let creatures = [];
let spores = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  pixelDensity(min(2, window.devicePixelRatio || 1));
  colorMode(HSB, 360, 100, 100, 100);
  buildWorld();
}

function buildWorld() {
  creatures = [];
  spores = [];
  for (let i = 0; i < 96; i++) {
    creatures.push({
      x: random(-1, 1),
      y: random(-0.72, 0.72),
      z: random(-1, 1),
      s: random(0.45, 1.7),
      phase: random(TAU),
      hue: random([92, 128, 172, 205, 318, 18, 42]),
      kind: floor(random(4))
    });
  }
  for (let i = 0; i < 420; i++) {
    spores.push({ x: random(-1, 1), y: random(-1, 1), z: random(-1, 1), p: random(TAU), h: random([54, 88, 178, 292]) });
  }
}

function draw() {
  const p = pointer();
  const mx = map(p.x, 0, width, -1, 1);
  const my = map(p.y, 0, height, -1, 1);
  background(204, 46, 5);
  orbitControl(0.18, 0.18, 0.02);
  rotateX(-0.18 + my * 0.09);
  rotateY(mx * 0.16);
  drawPanels(mx);
  drawSpores(mx, my);
  drawCreatures(mx, my);
  drawGardenVeins(mx);
}

function pointer() {
  if (touches.length) return createVector(touches[0].x, touches[0].y);
  return createVector(mouseX || width * 0.5, mouseY || height * 0.5);
}

function drawPanels(mx) {
  const w = width * 0.34;
  const h = height * 0.88;
  for (let i = -1; i <= 1; i++) {
    push();
    translate(i * w * 0.82, 0, -width * 0.26);
    rotateY(i * 0.12 + mx * 0.03);
    noStroke();
    fill(i < 0 ? 142 : i === 0 ? 194 : 336, 52, i === 0 ? 18 : 13, 86);
    box(w, h, 12);
    stroke(48, 46, 84, 30);
    strokeWeight(1.2);
    for (let y = -h * 0.42; y < h * 0.43; y += h / 9) line(-w * 0.44, y, w * 0.44, y + sin(frameCount * 0.01 + y) * 18);
    pop();
  }
}

function drawSpores(mx, my) {
  blendMode(ADD);
  noStroke();
  for (const s of spores) {
    const drift = frameCount * 0.002 + s.p;
    const x = (s.x + sin(drift + my) * 0.12) * width * 0.62;
    const y = (s.y + cos(drift * 1.4 + mx) * 0.08) * height * 0.45;
    const z = (s.z + sin(drift * 0.7) * 0.22) * width * 0.42;
    push();
    translate(x, y, z);
    fill(s.h, 45, 88, 7);
    sphere(1.5 + sin(drift * 4) * 0.7, 6, 4);
    pop();
  }
  blendMode(BLEND);
}

function drawCreatures(mx, my) {
  for (const c of creatures) {
    const t = frameCount * 0.018 + c.phase;
    const seek = mouseIsPressed ? 0.35 : 0.12;
    const x = (c.x + sin(t * 0.8 + c.z) * seek + mx * 0.05) * width * 0.48;
    const y = (c.y + cos(t + c.x) * seek * 0.6 + my * 0.03) * height * 0.38;
    const z = (c.z + sin(t * 0.45) * 0.28) * width * 0.36;
    push();
    translate(x, y, z);
    rotateY(t * 0.7);
    rotateZ(sin(t) * 0.5);
    const sc = min(width, height) * 0.018 * c.s;
    noStroke();
    fill(c.hue, 58, 74, 78);
    if (c.kind === 0) {
      sphere(sc, 10, 7);
      translate(sc * 0.9, 0, 0);
      fill((c.hue + 48) % 360, 64, 82, 70);
      cone(sc * 0.55, sc * 1.2, 8, 1);
    } else if (c.kind === 1) {
      box(sc * 1.8, sc * 0.65, sc * 0.65);
      for (let i = -1; i <= 1; i += 2) {
        push();
        translate(0, i * sc * 0.55, 0);
        rotateZ(i * 0.8);
        cylinder(sc * 0.09, sc * 1.6, 5, 1);
        pop();
      }
    } else if (c.kind === 2) {
      torus(sc * 0.75, sc * 0.17, 10, 5);
      sphere(sc * 0.42, 8, 5);
    } else {
      cone(sc * 0.78, sc * 1.8, 7, 1);
      translate(0, -sc * 0.85, 0);
      sphere(sc * 0.35, 7, 5);
    }
    pop();
  }
}

function drawGardenVeins(mx) {
  noFill();
  strokeWeight(1.5);
  for (let i = 0; i < 18; i++) {
    stroke(94 + i * 5, 56, 68, 18);
    beginShape();
    for (let a = 0; a < TAU; a += 0.16) {
      const r = min(width, height) * (0.12 + i * 0.018 + sin(a * 3 + frameCount * 0.015 + i) * 0.018);
      vertex(cos(a + mx * 0.2) * r, sin(a * 1.4) * r * 0.48, -width * 0.18 + i * 10);
    }
    endShape(CLOSE);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  buildWorld();
}
