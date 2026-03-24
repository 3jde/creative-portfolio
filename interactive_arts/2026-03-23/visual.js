let particles = [];
const numParticles = 80;
let zoom = 1.0; 
let zSpeed = 0.0005; 

const famousNames = [
  "Einstein", "Curie", "Newton", "Hawking", "Galileo",
  "Shakespeare", "Da Vinci", "Beethoven", "Mozart", "Van Gogh",
  "Mandela", "Gandhi", "MLK", "Lincoln", "Churchill",
  "Plato", "Aristotle", "Socrates", "Confucius", "Buddha",
  "Jobs", "Gates", "Turing", "Hopper", "Musk"
];

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textSize(14);
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  background(0, 50);

  push();
  translate(width / 2, height / 2);
  scale(zoom);
  translate(-width / 2, -height / 2);

  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].show();
  }
  pop();

  zoom += zSpeed;
}

class Particle {
  constructor() {
    this.reset(true); // Initial setup
  }

  reset(isInitial) {
    this.x = random(width);
    this.y = random(height);
    this.size = random(2, 5);
    this.color = color(random(200, 255), random(200, 255), random(220, 255));
    this.name = random(famousNames);
    
    // Make them appear sooner if it's initial load
    this.alpha = isInitial ? random(100, 255) : 0;
    this.targetAlpha = random(100, 255);
    this.flickerSpeed = random(0.01, 0.03);
    this.timer = isInitial ? random(0, 2000) : random(2000, 6000); 
    this.state = isInitial ? 'visible' : 'hidden'; 
  }

  update() {
    if (this.timer > 0) {
      this.timer -= 16;
      return;
    }

    if (this.state === 'hidden') {
      this.state = 'fadingIn';
    } else if (this.state === 'fadingIn') {
      this.alpha += this.flickerSpeed * 255;
      if (this.alpha >= this.targetAlpha) {
        this.alpha = this.targetAlpha;
        this.state = 'visible';
        this.timer = random(1000, 3000);
      }
    } else if (this.state === 'visible') {
      if (this.timer <= 0) this.state = 'fadingOut';
      else this.timer -= 16;
    } else if (this.state === 'fadingOut') {
      this.alpha -= this.flickerSpeed * 255;
      if (this.alpha <= 0) {
        this.alpha = 0;
        this.state = 'hidden';
        this.timer = random(1000, 3000);
      }
    }
  }

  show() {
    if (this.alpha <= 0) return;
    
    noStroke();
    fill(this.color, this.alpha);
    ellipse(this.x, this.y, this.size);
    fill(255, this.alpha);
    text(this.name, this.x, this.y - 10);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}