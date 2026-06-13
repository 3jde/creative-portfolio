let strokes = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  background('#acc2d9'); // Foggy morning blue
  noStroke();
}

function draw() {
  // Add a few strokes per frame
  for(let i=0; i<5; i++) {
    let x = random(width);
    let y = random(height);
    
    // Determine color based on position
    let col;
    if(y > height * 0.6) {
      // Water
      col = random(['#315f7a', '#6d95aa', '#1a3c54', '#acc2d9']);
    } else {
      // Sky
      col = random(['#c9d6e4', '#e2d4c0', '#acc2d9', '#8e9ab0']);
    }
    
    // Sun and reflection
    let sunDist = dist(x, y, width * 0.6, height * 0.4);
    if(sunDist < 80) col = '#e86f4a'; // Sun core
    else if(x > width * 0.55 && x < width * 0.65 && y > height * 0.6) {
      if(random() < 0.3) col = '#e86f4a'; // Sun reflection on water
    }
    
    // Add stroke
    fill(color(col + '88')); // Add transparency
    
    // Brush mechanics
    let strokeW = random(10, 40);
    let strokeH = random(3, 8);
    
    // Slight variation based on mouse for subtle interaction
    let angle = (noise(x * 0.01, y * 0.01, frameCount * 0.01) - 0.5) * 0.5;
    if(mouseIsPressed) {
      let d = dist(mouseX, mouseY, x, y);
      if(d < 200) angle += atan2(mouseY - y, mouseX - x);
    }
    
    push();
    translate(x, y);
    rotate(angle);
    rect(0, 0, strokeW, strokeH, 5);
    pop();
  }
}

function windowResized() { resizeCanvas(windowWidth, windowHeight); background('#acc2d9'); }