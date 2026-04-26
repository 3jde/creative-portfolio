let palettes = ['#E63946', '#F1FAEE', '#A8DADC', '#457B9D', '#1D3557'];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop();
  background('#f8f5eb');
  drawGenerativeArt();
}

function drawGenerativeArt() {
  translate(width/2, height/2);
  let layers = 8;
  for (let i = 0; i < layers; i++) {
    push();
    rotate(random(TWO_PI));
    let r = map(i, 0, layers, width * 0.4, 50);
    let pts = floor(random(10, 40));
    fill(random(palettes));
    stroke(255, 100);
    strokeWeight(2);
    
    beginShape();
    for(let j=0; j<pts; j++){
      let angle = map(j, 0, pts, 0, TWO_PI);
      let rOffset = random(0.8, 1.2);
      let x = cos(angle) * r * rOffset;
      let y = sin(angle) * r * rOffset;
      vertex(x, y);
    }
    endShape(CLOSE);
    pop();
  }
}

function mousePressed() {
  background('#f8f5eb');
  drawGenerativeArt();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background('#f8f5eb');
  drawGenerativeArt();
}