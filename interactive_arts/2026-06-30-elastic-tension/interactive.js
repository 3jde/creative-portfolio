let nodes = [];
const COLS = 20;
const ROWS = 15;
let spacingX, spacingY;

function setup() {
  createCanvas(windowWidth, windowHeight);
  spacingX = width / COLS;
  spacingY = height / ROWS;
  
  for (let i = 0; i <= COLS; i++) {
    for (let j = 0; j <= ROWS; j++) {
      let baseX = i * spacingX;
      let baseY = j * spacingY;
      nodes.push({
        x: baseX, y: baseY,
        vx: 0, vy: 0,
        baseX: baseX, baseY: baseY
      });
    }
  }
}

function draw() {
  background(245, 245, 250, 100); // Trail effect
  
  for (let i = 0; i < nodes.length; i++) {
    let n = nodes[i];
    
    // Elastic pull to base position
    let dx = n.baseX - n.x;
    let dy = n.baseY - n.y;
    n.vx += dx * 0.05; // spring constant
    n.vy += dy * 0.05;
    
    // Mouse interaction (repel)
    let md = dist(mouseX, mouseY, n.x, n.y);
    if (md < 150) {
      let force = (150 - md) * 0.01; // interaction strength
      n.vx -= (mouseX - n.x) * force;
      n.vy -= (mouseY - n.y) * force;
    }
    
    // Friction
    n.vx *= 0.85;
    n.vy *= 0.85;
    
    n.x += n.vx;
    n.y += n.vy;
  }
  
  // Draw the grid connections
  stroke(100, 150, 255, 80);
  strokeWeight(1);
  for (let i = 0; i < COLS; i++) {
    for (let j = 0; j < ROWS; j++) {
      let idx = i * (ROWS + 1) + j;
      let n1 = nodes[idx];
      let n2 = nodes[idx + 1]; // next in col
      let n3 = nodes[(i + 1) * (ROWS + 1) + j]; // next in row
      
      line(n1.x, n1.y, n2.x, n2.y);
      if (n3) line(n1.x, n1.y, n3.x, n3.y);
      
      // Draw nodes
      noStroke();
      fill(30, 80, 200, 150);
      ellipse(n1.x, n1.y, 4, 4);
      stroke(100, 150, 255, 80);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // Recalculate base positions
  spacingX = width / COLS;
  spacingY = height / ROWS;
  let idx = 0;
  for (let i = 0; i <= COLS; i++) {
    for (let j = 0; j <= ROWS; j++) {
      nodes[idx].baseX = i * spacingX;
      nodes[idx].baseY = j * spacingY;
      idx++;
    }
  }
}