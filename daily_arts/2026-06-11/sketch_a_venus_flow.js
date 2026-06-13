// Sketch A: Visual Impact - Flow Field inspired by The Birth of Venus
let particles = [];
let numParticles = 2000;
let noiseScale = 0.01;

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle());
  }
  background(20, 30, 50);
}

function draw() {
  background(20, 30, 50, 10);
  for (let i = 0; i < numParticles; i++) {
    particles[i].update();
    particles[i].display();
  }
}

class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(0, 0);
    this.color = color(random(150, 255), random(100, 200), random(150, 255), 150); // Pink/Teal/Pearl hues
  }

  update() {
    let angle = noise(this.pos.x * noiseScale, this.pos.y * noiseScale) * TWO_PI * 4;
    this.vel = p5.Vector.fromAngle(angle);
    this.pos.add(this.vel);
    if (this.pos.x < 0 || this.pos.x > width || this.pos.y < 0 || this.pos.y > height) {
      this.pos.x = random(width);
      this.pos.y = random(height);
    }
  }

  display() {
    stroke(this.color);
    strokeWeight(1.5);
    point(this.pos.x, this.pos.y);
  }
}
