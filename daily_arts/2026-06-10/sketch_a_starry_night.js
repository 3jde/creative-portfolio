function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  angleMode(DEGREES);
  noStroke();
}

function draw() {
  background(10, 20, 40);
  
  // A simple representation of swirling stars using WebGL
  rotateX(frameCount * 0.5);
  rotateY(frameCount * 0.5);
  
  for(let i = 0; i < 200; i++) {
    push();
    let r = noise(i * 0.1, frameCount * 0.01) * 300;
    let theta = noise(i * 0.2) * 360;
    let phi = noise(i * 0.3) * 180;
    
    let x = r * sin(phi) * cos(theta);
    let y = r * sin(phi) * sin(theta);
    let z = r * cos(phi);
    
    translate(x, y, z);
    fill(255, 200, 50, 150); // Starry yellow
    sphere(5);
    pop();
  }
}
