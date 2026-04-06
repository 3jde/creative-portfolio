let nodes = [];
const numNodes = 50;
let mouseForce = 0.5;

function setup() {
    createCanvas(windowWidth, windowHeight);
    for (let i = 0; i < numNodes; i++) {
        nodes.push(new Node());
    }
}

function draw() {
    background(20, 20, 30, 20);
    
    // Update and display nodes
    for (let node of nodes) {
        node.update();
        node.display();
    }
    
    // Draw connections
    stroke(255, 100, 100, 100);
    strokeWeight(1);
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            let d = dist(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
            if (d < 150) {
                line(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
            }
        }
    }
    
    // Mouse interaction visualization
    if (mouseIsPressed) {
        fill(255, 100, 100, 50);
        noStroke();
        ellipse(mouseX, mouseY, 100, 100);
    }
}

function mouseMoved() {
    // Apply force to nodes based on mouse position
    for (let node of nodes) {
        let d = dist(mouseX, mouseY, node.x, node.y);
        if (d < 200) {
            let angle = atan2(node.y - mouseY, node.x - mouseX);
            let force = map(d, 0, 200, mouseForce, 0);
            node.vx += cos(angle) * force;
            node.vy += sin(angle) * force;
        }
    }
}

function mousePressed() {
    mouseForce = 2.0; // Stronger force when clicking
}

function mouseReleased() {
    mouseForce = 0.5;
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

class Node {
    constructor() {
        this.x = random(width);
        this.y = random(height);
        this.vx = random(-0.5, 0.5);
        this.vy = random(-0.5, 0.5);
        this.size = random(8, 15);
        this.color = color(random(200, 255), random(100, 200), random(100, 200));
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        
        // Bounce off edges with damping
        if (this.x < this.size || this.x > width - this.size) {
            this.vx *= -0.9;
            this.x = constrain(this.x, this.size, width - this.size);
        }
        if (this.y < this.size || this.y > height - this.size) {
            this.vy *= -0.9;
            this.y = constrain(this.y, this.size, height - this.size);
        }
        
        // Apply friction
        this.vx *= 0.99;
        this.vy *= 0.99;
    }
    
    display() {
        noStroke();
        fill(this.color);
        ellipse(this.x, this.y, this.size);
        
        // Inner highlight
        fill(255, 255, 255, 100);
        ellipse(this.x - this.size/4, this.y - this.size/4, this.size/3);
    }
}