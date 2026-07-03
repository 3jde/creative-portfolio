let shapes = [];
let palette = ['#d12c22', '#e5a525', '#1a3c5a', '#100f0d', '#6e808e'];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  for (let i = 0; i < 60; i++) {
    shapes.push({
      type: random(['sphere', 'box', 'cone']),
      x: random(-width/2, width/2),
      y: random(-height/2, height/2),
      z: random(-400, 400),
      size: random(10, 80),
      color: color(random(palette)),
      rx: random(TWO_PI),
      ry: random(TWO_PI),
      speed: random(-0.02, 0.02)
    });
  }
}

function draw() {
  background('#e8e3d3');
  ambientLight(150);
  directionalLight(255, 255, 255, 0.5, 0.5, -1);
  
  rotateX(frameCount * 0.005);
  rotateY(frameCount * 0.005);

  shapes.forEach(s => {
    push();
    translate(s.x, s.y, s.z);
    rotateX(s.rx += s.speed);
    rotateY(s.ry += s.speed);
    
    ambientMaterial(s.color);
    if (s.type === 'sphere') sphere(s.size);
    else if (s.type === 'box') box(s.size);
    else cone(s.size, s.size * 2);
    pop();
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}