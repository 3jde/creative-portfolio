let nodes = [];
function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < 150; i++) {
    nodes.push(createVector(random(width), random(height)));
  }
}

function draw() {
  background(240, 20);
  let mouse = createVector(mouseX, mouseY);
  
  stroke(0, 50);
  nodes.forEach(n => {
    let d = dist(mouse.x, mouse.y, n.x, n.y);
    if (d < 150) {
      let f = map(d, 0, 150, 5, 0);
      let dir = p5.Vector.sub(n, mouse);
      dir.normalize();
      dir.mult(f);
      n.add(dir);
    }
    
    // Boundary check
    n.x = constrain(n.x, 0, width);
    n.y = constrain(n.y, 0, height);
    
    fill(0);
    noStroke();
    circle(n.x, n.y, 4);
    
    stroke(0, 20);
    nodes.forEach(other => {
      if (n !== other && dist(n.x, n.y, other.x, other.y) < 50) {
        line(n.x, n.y, other.x, other.y);
      }
    });
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}