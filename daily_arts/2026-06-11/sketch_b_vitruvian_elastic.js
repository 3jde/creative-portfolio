// Sketch B: Novel Interaction - Elastic Wireframe inspired by Vitruvian Man
let nodes = [];
let springs = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Create center node and surrounding nodes
  nodes.push(createVector(width/2, height/2));
  for(let i=0; i<8; i++) {
    let angle = TWO_PI / 8 * i;
    let r = 150;
    nodes.push(createVector(width/2 + cos(angle)*r, height/2 + sin(angle)*r));
  }
}

function draw() {
  background(240, 235, 220); // Parchment color
  
  // Interactive distortion
  let target = createVector(mouseX, mouseY);
  nodes[0].lerp(target, 0.1);

  stroke(100, 80, 50);
  strokeWeight(2);
  noFill();

  // Draw circle and square boundaries mimicking the original
  circle(width/2, height/2, dist(nodes[0].x, nodes[0].y, nodes[1].x, nodes[1].y) * 2);
  rectMode(CENTER);
  rect(width/2, height/2, dist(nodes[0].x, nodes[0].y, nodes[3].x, nodes[3].y) * 1.8);

  // Draw connecting lines
  for(let i=1; i<nodes.length; i++) {
    line(nodes[0].x, nodes[0].y, nodes[i].x, nodes[i].y);
    let next = (i % 8) + 1;
    line(nodes[i].x, nodes[i].y, nodes[next].x, nodes[next].y);
  }
}
