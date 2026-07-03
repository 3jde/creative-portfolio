let nodes = [];
let palette = ['#d12c22', '#e5a525', '#1a3c5a', '#100f0d'];

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < 40; i++) {
    nodes.push(new Node(random(width), random(height)));
  }
}

function draw() {
  background('#e8e3d3');
  
  nodes.forEach(node => {
    node.interact(mouseX, mouseY);
    node.update();
  });
  
  for(let i=0; i<nodes.length; i++) {
    for(let j=i+1; j<nodes.length; j++) {
      let d = dist(nodes[i].pos.x, nodes[i].pos.y, nodes[j].pos.x, nodes[j].pos.y);
      if(d < 150) {
        stroke(0, map(d, 0, 150, 255, 0));
        strokeWeight(map(d, 0, 150, 3, 0.5));
        line(nodes[i].pos.x, nodes[i].pos.y, nodes[j].pos.x, nodes[j].pos.y);
      }
    }
    nodes[i].display();
  }
}

class Node {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.origin = createVector(x, y);
    this.size = random(10, 40);
    this.col = color(random(palette));
    this.type = random(['circle', 'triangle']);
  }

  interact(mx, my) {
    let mouse = createVector(mx, my);
    let d = p5.Vector.dist(this.pos, mouse);
    if (d < 100) {
      let force = p5.Vector.sub(this.pos, mouse);
      force.setMag(map(d, 0, 100, 5, 0));
      this.acc.add(force);
    }
    
    // Spring back to origin
    let returnForce = p5.Vector.sub(this.origin, this.pos);
    returnForce.mult(0.05);
    this.acc.add(returnForce);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.mult(0.9); // friction
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  display() {
    noStroke();
    fill(this.col);
    if (this.type === 'circle') {
      circle(this.pos.x, this.pos.y, this.size);
    } else {
      push();
      translate(this.pos.x, this.pos.y);
      rotate(this.vel.heading());
      triangle(-this.size/2, -this.size/2, this.size/2, 0, -this.size/2, this.size/2);
      pop();
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}