let angle = 0;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
}

function draw() {
  background(10, 10, 20);
  
  ambientLight(100);
  pointLight(255, 100, 150, 0, 0, 200);
  directionalLight(100, 200, 255, 1, 1, -1);
  
  rotateX(angle);
  rotateY(angle * 1.3);
  rotateZ(angle * 0.7);
  
  for(let i = 0; i < 50; i++) {
    push();
    rotateY(i * 0.2);
    rotateX(i * 0.1);
    translate(150 + sin(frameCount * 0.01 + i) * 50, 0, 0);
    specularMaterial(255, 150 + i*2, 200);
    shininess(20);
    sphere(8 + sin(frameCount*0.05 + i)*4);
    pop();
  }
  
  specularMaterial(250);
  torus(80, 20, 64, 64);
  
  angle += 0.01;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}