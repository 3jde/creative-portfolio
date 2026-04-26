let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  for (let i = 0; i < 200; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  background(10, 10, 20);
  rotateY(frameCount * 0.01);
  rotateX(frameCount * 0.005);
  
  noFill();
  stroke(255, 50);
  sphere(200);

  for (let p of particles) {
    p.update();
    p.show();
  }
}

class Particle {
  constructor() {
    this.pos = p5.Vector.random3D().mult(random(100, 300));
    this.vel = p5.Vector.random3D().mult(random(0.5, 2));
    this.c = color(random(100, 255), random(50, 200), random(150, 255));
  }
  update() {
    this.pos.add(this.vel);
    if (this.pos.mag() > 400 || this.pos.mag() < 50) {
      this.vel.mult(-1);
    }
  }
  show() {
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    noStroke();
    fill(this.c);
    sphere(3);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}