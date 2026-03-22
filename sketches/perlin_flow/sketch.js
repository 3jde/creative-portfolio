// Coding Train Challenge #24: Perlin Noise Flow Field inspired
let inc = 0.1;
let scl = 20;
let cols, rows;
let zoff = 0;
let particles = [];
let flowfield = [];

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('canvas-container'); // If running inside the portfolio site
    
    cols = floor(width / scl);
    rows = floor(height / scl);
    flowfield = new Array(cols * rows);

    for (let i = 0; i < 2000; i++) {
        particles[i] = new Particle();
    }
    background(0);
}

function draw() {
    // Draw a faint background to create trail effects
    background(0, 10);
    
    let yoff = 0;
    for (let y = 0; y < rows; y++) {
        let xoff = 0;
        for (let x = 0; x < cols; x++) {
            let index = x + y * cols;
            let angle = noise(xoff, yoff, zoff) * TWO_PI * 4;
            let v = p5.Vector.fromAngle(angle);
            v.setMag(1);
            flowfield[index] = v;
            xoff += inc;
        }
        yoff += inc;
    }
    zoff += 0.003; // Time offset for flowing field change

    for (let i = 0; i < particles.length; i++) {
        particles[i].follow(flowfield);
        particles[i].update();
        particles[i].edges();
        particles[i].show();
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    cols = floor(width / scl);
    rows = floor(height / scl);
    flowfield = new Array(cols * rows);
    background(0);
}

class Particle {
    constructor() {
        this.pos = createVector(random(width), random(height));
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);
        this.maxspeed = 4;
        this.prevPos = this.pos.copy();
        
        // Cyberpunk colors: Neon cyan, magenta, and green
        let colorPalette = [
            color(0, 255, 255, 50),
            color(255, 0, 255, 50),
            color(0, 255, 0, 50)
        ];
        this.col = random(colorPalette);
    }

    update() {
        this.vel.add(this.acc);
        this.vel.limit(this.maxspeed);
        this.pos.add(this.vel);
        this.acc.mult(0);
    }

    follow(vectors) {
        let x = floor(this.pos.x / scl);
        let y = floor(this.pos.y / scl);
        let index = x + y * cols;
        // Edge cases
        if (index > -1 && index < vectors.length) {
            let force = vectors[index];
            this.applyForce(force);
        }
    }

    applyForce(force) {
        this.acc.add(force);
    }

    show() {
        stroke(this.col);
        strokeWeight(1);
        line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
        this.updatePrev();
    }

    updatePrev() {
        this.prevPos.x = this.pos.x;
        this.prevPos.y = this.pos.y;
    }

    edges() {
        if (this.pos.x > width) {
            this.pos.x = 0;
            this.updatePrev();
        }
        if (this.pos.x < 0) {
            this.pos.x = width;
            this.updatePrev();
        }
        if (this.pos.y > height) {
            this.pos.y = 0;
            this.updatePrev();
        }
        if (this.pos.y < 0) {
            this.pos.y = height;
            this.updatePrev();
        }
    }
}