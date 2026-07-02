let cols, rows;
let size = 60;
// Classic Bauhaus-inspired minimal palette
let palette = ['#E63946', '#F1FAEE', '#A8DADC', '#457B9D', '#1D3557', '#F4A261', '#E9C46A'];

function setup() {
  createCanvas(windowWidth, windowHeight);
  cols = floor(width / size) + 2;
  rows = floor(height / size) + 2;
  rectMode(CENTER);
  noStroke();
}

function draw() {
  background('#F1FAEE');
  
  let time = frameCount * 0.005;
  
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * size;
      let y = j * size;
      
      // Use 3D perlin noise for smooth continuous flow
      let n = noise(i * 0.1, j * 0.1, time);
      let colorNoise = noise(i * 0.05, j * 0.05, time + 100);
      
      let colIndex = floor(map(colorNoise, 0, 1, 0, palette.length));
      colIndex = constrain(colIndex, 0, palette.length - 1);
      
      fill(palette[colIndex]);
      
      push();
      translate(x, y);
      rotate(n * TWO_PI); // Subtly rotate based on noise field
      
      // Scale based on noise to create a breathing effect
      let s = size * map(n, 0, 1, 0.3, 1.2);
      
      // Alternate shapes based on position and noise
      if ((i + j) % 2 === 0) {
        if (n > 0.5) ellipse(0, 0, s, s);
        else rect(0, 0, s, s, s * 0.2); // Rounded rect
      } else {
        arc(0, 0, s, s, 0, PI); // Half circle
      }
      pop();
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cols = floor(width / size) + 2;
  rows = floor(height / size) + 2;
}