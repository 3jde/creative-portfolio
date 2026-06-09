let particles = [];
let noiseScale = 0.01;
let colors = ['#f44336', '#ff9800', '#2196f3', '#000000', '#ffeb3b'];

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(20, 10, 10);
  for(let i=0; i<3000; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      col: random(colors),
      life: random(100, 300)
    });
  }
}

function draw() {
  background(20, 10, 10, 15);
  noStroke();
  
  for(let p of particles) {
    fill(p.col);
    circle(p.x, p.y, 2);
    
    // Munch's The Scream inspired swirling flow field
    let n = noise(p.x * noiseScale, p.y * noiseScale, frameCount * 0.005);
    let angle = map(n, 0, 1, 0, TWO_PI * 3);
    
    // Add attraction to center bottom (the bridge)
    let dx = width/2 - p.x;
    let dy = height - p.y;
    let dist = sqrt(dx*dx + dy*dy);
    angle += atan2(dy, dx) * map(dist, 0, height, 0.5, 0);
    
    p.x += cos(angle) * 3;
    p.y += sin(angle) * 3;
    p.life--;
    
    if(p.life < 0 || p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
      p.x = random(width);
      p.y = random(height);
      p.life = random(100, 300);
      p.col = random(colors);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}