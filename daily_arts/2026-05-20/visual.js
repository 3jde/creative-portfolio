// J.M.W. Turner, Rain, Steam and Speed: atmosphere becomes a velocity machine.
let rails = [];
let sparks = [];
let stormPulse = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  pixelDensity(Math.min(2, window.devicePixelRatio || 1));
  colorMode(HSB, 360, 100, 100, 100);
  for (let i = 0; i < 42; i++) {
    rails.push({
      y: map(i, 0, 41, -height * 0.34, height * 0.46),
      phase: random(TAU),
      hue: random([38, 46, 202, 212])
    });
  }
  for (let i = 0; i < 520; i++) sparks.push(makeSpark(true));
}

function draw() {
  const mx = (mouseX || width * 0.5) / width - 0.5;
  const my = (mouseY || height * 0.5) / height - 0.5;
  stormPulse = lerp(stormPulse, mouseIsPressed ? 1 : 0, 0.07);
  background(205, 38, 7);
  orbitControl(0.35, 0.35, 0.08);
  rotateX(-0.18 + my * 0.18);
  rotateY(mx * 0.25);

  noStroke();
  for (let z = -820; z < 260; z += 70) {
    push();
    translate(0, height * 0.18, z);
    fill(42, 35, map(z, -820, 260, 7, 38), 16);
    box(width * 1.9, 5, 38);
    pop();
  }

  drawTrain(mx);
  drawRainField();
  drawRails();
  updateSparks(mx, my);
}

function drawTrain(mx) {
  push();
  translate(-width * 0.08 + mx * 120, height * 0.13, -120);
  rotateZ(-0.04);
  ambientLight(40);
  directionalLight(40, 60, 100, -0.2, 0.3, -0.7);
  specularMaterial(38, 75, 72, 95);
  shininess(18);
  box(width * 0.21, height * 0.045, 130);
  translate(width * 0.1, -height * 0.018, -15);
  specularMaterial(30, 90, 90, 95);
  box(width * 0.08, height * 0.075, 105);
  pop();
}

function drawRainField() {
  strokeWeight(1.2);
  for (const r of rails) {
    beginShape();
    noFill();
    stroke(r.hue, 45, 88, 16 + stormPulse * 16);
    for (let x = -width * 0.72; x <= width * 0.72; x += 18) {
      const t = frameCount * 0.026 + r.phase + x * 0.008;
      const gust = noise(x * 0.008, r.y * 0.01, frameCount * 0.014);
      const y = r.y + sin(t) * 20 + (gust - 0.5) * (80 + stormPulse * 110);
      const z = map(gust, 0, 1, -520, 120);
      curveVertex(x, y, z);
    }
    endShape();
  }
}

function drawRails() {
  stroke(36, 52, 86, 72);
  strokeWeight(3);
  for (let i = -1; i <= 1; i += 2) {
    beginShape();
    for (let z = -760; z < 180; z += 22) {
      const spread = map(z, -760, 180, width * 0.11, width * 0.36);
      vertex(i * spread, height * 0.26, z);
    }
    endShape();
  }
}

function updateSparks(mx, my) {
  blendMode(ADD);
  strokeWeight(2);
  for (const s of sparks) {
    const speed = 3.2 + stormPulse * 5 + abs(mx) * 2.5;
    s.x += s.vx * speed - mx * 8;
    s.y += s.vy * (1.5 + stormPulse) + my * 2;
    s.z += s.vz * speed;
    s.life -= 1.2;
    stroke(s.h, 65, 95, constrain(s.life, 0, 70));
    point(s.x, s.y, s.z);
    if (s.life <= 0 || s.x > width || s.z > 240) Object.assign(s, makeSpark(false));
  }
  blendMode(BLEND);
}

function makeSpark(initial) {
  return {
    x: random(-width * 0.75, initial ? width * 0.75 : -width * 0.45),
    y: random(-height * 0.42, height * 0.48),
    z: random(-760, initial ? 240 : -480),
    vx: random(0.6, 2.4),
    vy: random(-0.5, 0.5),
    vz: random(0.8, 2.2),
    h: random([38, 46, 205, 218]),
    life: random(22, 70)
  };
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
