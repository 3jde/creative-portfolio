let particles = [];
function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  for (let i = 0; i < 500; i++) {
    particles.push({
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-500, 500),
      color: color(random(100, 255), random(50, 200), 255)
    });
  }
  noStroke();
}

function draw() {
  background(10, 15, 25);
  rotateY(frameCount * 0.01);
  rotateX(frameCount * 0.005);
  
  particles.forEach(p => {
    push();
    translate(p.x, p.y, p.z);
    fill(p.color);
    box(5);
    pop();
    
    p.z += 2;
    if (p.z > 500) p.z = -500;
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}