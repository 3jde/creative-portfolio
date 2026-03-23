let particles = [];
const numParticles = 100; // Fewer particles for names
const famousNames = [
  "Einstein", "Curie", "Newton", "Hawking", "Galileo",
  "Shakespeare", "Da Vinci", "Beethoven", "Mozart", "Van Gogh",
  "Mandela", "Gandhi", "MLK", "Lincoln", "Churchill",
  "Plato", "Aristotle", "Socrates", "Confucius", "Buddha",
  "Jobs", "Gates", "Turing", "Hopper", "Musk"
];

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Optional: Set text properties once
  textAlign(CENTER, CENTER);
  textSize(16);
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  background(0, 0, 0, 80); // Darker, semi-transparent background for cosmic feel

  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    p.update();
    p.show();
    if (p.isFinished()) {
      particles.splice(i, 1);
      particles.push(new Particle());
    }
  }
}

class Particle {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.vx = random(-0.5, 0.5); // Slower movement for names
    this.vy = random(-0.5, 0.5);
    this.alpha = 255;
    this.color = color(random(200, 255), random(200, 255), random(150, 255)); // Brighter, starry colors
    this.size = random(3, 7); // Slightly larger for better text visibility
    this.name = random(famousNames); // Assign a famous name
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 1.5; // Slower fade out
    this.vx *= 0.995; // More damping
    this.vy *= 0.995;
  }

  show() {
    noStroke();
    fill(this.color, this.alpha);
    ellipse(this.x, this.y, this.size); // Draw the "star" dot

    // Draw the name
    fill(255, this.alpha); // White text, fades with particle
    text(this.name, this.x, this.y - this.size / 2 - 5); // Position text above the dot
  }

  isFinished() {
    return this.alpha < 0 || this.x < -50 || this.x > width + 50 || this.y < -50 || this.y > height + 50; // Extend bounds slightly
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}