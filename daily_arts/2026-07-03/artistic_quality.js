let shapes = [];
let palette = ['#d12c22', '#e5a525', '#1a3c5a', '#100f0d', '#6e808e'];

function setup() {
  createCanvas(windowWidth, windowHeight);
  background('#e8e3d3');
  noLoop();
  
  // Generate random shapes matching Composition VIII vibe
  for(let i = 0; i < 15; i++) {
    shapes.push({
      type: 'concentric',
      x: random(width),
      y: random(height),
      r: random(50, 200),
      colors: [random(palette), random(palette)]
    });
  }
  
  for(let i = 0; i < 20; i++) {
    shapes.push({
      type: 'line',
      x1: random(width), y1: random(height),
      x2: random(width), y2: random(height),
      weight: random(1, 10),
      color: '#100f0d'
    });
  }
}

function draw() {
  background('#e8e3d3');
  
  // Draw subtle grid
  stroke('#cfc9b6');
  strokeWeight(1);
  for(let x = 0; x < width; x += 50) line(x, 0, x, height);
  for(let y = 0; y < height; y += 50) line(0, y, width, y);

  // Draw lines
  shapes.filter(s => s.type === 'line').forEach(s => {
    stroke(s.color);
    strokeWeight(s.weight);
    line(s.x1, s.y1, s.x2, s.y2);
    // Draw triangle at end
    push();
    translate(s.x2, s.y2);
    let angle = atan2(s.y2 - s.y1, s.x2 - s.x1);
    rotate(angle);
    noStroke();
    fill(s.color);
    triangle(0, -s.weight*2, s.weight*4, 0, 0, s.weight*2);
    pop();
  });
  
  // Draw concentric circles
  shapes.filter(s => s.type === 'concentric').forEach(s => {
    noFill();
    stroke(s.colors[0]);
    strokeWeight(s.r * 0.1);
    circle(s.x, s.y, s.r);
    
    stroke(s.colors[1]);
    strokeWeight(s.r * 0.05);
    circle(s.x, s.y, s.r * 0.6);
    
    fill(random(palette));
    noStroke();
    circle(s.x, s.y, s.r * 0.2);
  });
}

function mousePressed() {
  shapes = [];
  setup();
  redraw();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  shapes = [];
  setup();
  redraw();
}