let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  for(let i=0; i<300; i++) {
    particles.push(new Particle(random(width), random(height)));
  }
}

function draw() {
  background(20, 20, 30, 80);
  
  for(let p of particles) {
    p.update();
    p.display();
  }
}

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(1, 3));
    this.acc = createVector(0, 0);
    this.r = random(2, 6);
    this.color = color(random(100, 255), random(100, 200), 255);
  }
  
  update() {
    let mouse = createVector(mouseX, mouseY);
    let d = p5.Vector.dist(this.pos, mouse);
    
    if(d < 150) {
      let force = p5.Vector.sub(this.pos, mouse);
      force.setMag(map(d, 0, 150, 5, 0));
      this.acc.add(force);
    }
    
    this.vel.add(this.acc);
    this.vel.limit(8);
    this.pos.add(this.vel);
    this.acc.mult(0);
    
    // Friction
    this.vel.mult(0.95);
    
    // Edges
    if(this.pos.x < 0 || this.pos.x > width) this.vel.x *= -1;
    if(this.pos.y < 0 || this.pos.y > height) this.vel.y *= -1;
    
    this.pos.x = constrain(this.pos.x, 0, width);
    this.pos.y = constrain(this.pos.y, 0, height);
  }
  
  display() {
    noStroke();
    fill(this.color);
    circle(this.pos.x, this.pos.y, this.r * 2);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}