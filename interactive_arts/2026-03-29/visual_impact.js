let particles = [];
const numParticles = 200;

function setup() {
    createCanvas(windowWidth, windowHeight);
    for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
    }
}

function draw() {
    background(0, 10);
    
    // Update and display particles
    for (let p of particles) {
        p.update();
        p.display();
    }
    
    // Draw connections between nearby particles
    stroke(100, 150, 255, 50);
    strokeWeight(0.5);
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            let d = dist(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
            if (d < 100) {
                line(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
            }
        }
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

class Particle {
    constructor() {
        this.x = random(width);
        this.y = random(height);
        this.vx = random(-1, 1);
        this.vy = random(-1, 1);
        this.size = random(2, 6);
        this.color = color(random(150, 255), random(100, 200), 255);
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        
        // Bounce off edges
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
        
        // Add some noise for organic movement
        this.vx += random(-0.1, 0.1);
        this.vy += random(-0.1, 0.1);
        
        // Constrain velocity
        this.vx = constrain(this.vx, -2, 2);
        this.vy = constrain(this.vy, -2, 2);
    }
    
    display() {
        noStroke();
        fill(this.color);
        ellipse(this.x, this.y, this.size);
        
        // Glow effect
        fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], 30);
        ellipse(this.x, this.y, this.size * 3);
    }
}