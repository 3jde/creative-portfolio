let noiseScale = 0.005;
let colors = ['#e63946', '#f1faee', '#a8dadc', '#457b9d', '#1d3557'];

function setup() {
  createCanvas(windowWidth, windowHeight);
  background('#f8f9fa');
  noLoop();
  
  for (let i = 0; i < 2000; i++) {
    drawFlowLine();
  }
}

function drawFlowLine() {
  let x = random(width);
  let y = random(height);
  let c = color(random(colors));
  c.setAlpha(150);
  
  stroke(c);
  strokeWeight(random(1, 3));
  noFill();
  
  beginShape();
  for (let step = 0; step < 50; step++) {
    vertex(x, y);
    let angle = noise(x * noiseScale, y * noiseScale) * TWO_PI * 2;
    x += cos(angle) * 10;
    y += sin(angle) * 10;
    
    if (x < 0 || x > width || y < 0 || y > height) break;
  }
  endShape();
}

function mousePressed() {
  background('#f8f9fa');
  noiseSeed(random(10000));
  for (let i = 0; i < 2000; i++) {
    drawFlowLine();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  mousePressed();
}