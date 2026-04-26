let nodes = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < 100; i++) {
    nodes.push(createVector(random(width), random(height)));
  }
}

function draw() {
  background(34);
  stroke(255, 100);
  
  let mouse = createVector(mouseX, mouseY);
  
  for (let i = 0; i < nodes.length; i++) {
    let n = nodes[i];
    let d = dist(mouse.x, mouse.y, n.x, n.y);
    
    if (d < 150) {
      let dir = p5.Vector.sub(n, mouse);
      dir.normalize();
      dir.mult(map(d, 0, 150, 5, 0));
      n.add(dir);
    }
    
    // Return to original or drift
    n.x += random(-1, 1);
    n.y += random(-1, 1);
    
    // Draw connections
    for (let j = i + 1; j < nodes.length; j++) {
      let d2 = dist(n.x, n.y, nodes[j].x, nodes[j].y);
      if (d2 < 100) {
        stroke(0, 255, 150, map(d2, 0, 100, 255, 0));
        line(n.x, n.y, nodes[j].x, nodes[j].y);
      }
    }
    
    fill(255);
    noStroke();
    circle(n.x, n.y, 4);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}