let t = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);
  noLoop();
}

function draw() {
  background(210, 80, 20); // Deep ocean blue
  
  // Generative wave composition
  for (let y = height * 0.3; y < height; y += 20) {
    beginShape();
    fill(210, 80, map(y, height*0.3, height, 40, 100), 0.8);
    stroke(255, 0.5);
    vertex(0, height);
    for (let x = 0; x <= width; x += 50) {
      let noiseVal = noise(x * 0.005, y * 0.01);
      let waveHeight = map(noiseVal, 0, 1, -100, 100);
      vertex(x, y + waveHeight);
    }
    vertex(width, height);
    endShape(CLOSE);
  }
}
