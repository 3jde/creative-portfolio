let angle = 0;
let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  for (let i = 0; i < 200; i++) {
    particles.push({
      offset: random(TWO_PI),
      speed: random(0.01, 0.03),
      dist: random(100, 400),
      size: random(2, 12)
    });
  }
}

function draw() {
  background(5, 5, 10);
  
  // Lighting setup for high visual impact
  ambientLight(40, 40, 60);
  pointLight(255, 100, 200, mouseX - width/2, mouseY - height/2, 200);
  pointLight(100, 200, 255, -mouseX + width/2, -mouseY + height/2, 200);
  
  specularMaterial(250);
  shininess(100);
  
  rotateX(angle * 0.5);
  rotateY(angle * 0.3);
  rotateZ(angle * 0.2);
  
  // Draw organic flowing particles
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    push();
    let currentAngle = frameCount * p.speed + p.offset;
    let r = p.dist + sin(frameCount * 0.02 + i) * 50;
    
    translate(
      sin(currentAngle) * r * cos(p.offset),
      cos(currentAngle) * r * sin(p.offset),
      sin(currentAngle * 0.5) * (r/2)
    );
    
    sphere(p.size + sin(frameCount * 0.1 + i) * 3);
    pop();
  }
  
  angle += 0.01;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}