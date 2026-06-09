let shapes = [];
let colors = ['#d32f2f', '#1976d2', '#fbc02d', '#388e3c', '#000000'];

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  for(let i=0; i<40; i++) {
    shapes.push({
      x: random(width), y: random(height),
      type: random(['circle', 'rect', 'triangle', 'line']),
      size: random(20, 150),
      col: random(colors),
      vx: random(-2, 2), vy: random(-2, 2),
      rot: random(TWO_PI), vrot: random(-0.05, 0.05),
      active: 0
    });
  }
}

function draw() {
  background(240, 235, 220);
  
  for(let s of shapes) {
    // Mouse interaction: push away
    let d = dist(mouseX, mouseY, s.x, s.y);
    if(d < 150) {
      s.vx += (s.x - mouseX) * 0.01;
      s.vy += (s.y - mouseY) * 0.01;
      s.active = 255;
    }
    
    // Physics update
    s.x += s.vx; s.y += s.vy; s.rot += s.vrot;
    s.vx *= 0.98; s.vy *= 0.98; // Friction
    s.active = max(0, s.active - 5);
    
    // Bounce off walls
    if(s.x < 0 || s.x > width) s.vx *= -1;
    if(s.y < 0 || s.y > height) s.vy *= -1;
    s.x = constrain(s.x, 0, width);
    s.y = constrain(s.y, 0, height);
    
    // Draw
    push();
    translate(s.x, s.y);
    rotate(s.rot);
    if (s.active > 0) {
      stroke(255, 0, 0, s.active);
      strokeWeight(3);
    } else {
      noStroke();
    }
    fill(s.col);
    
    if(s.type === 'circle') circle(0, 0, s.size);
    else if(s.type === 'rect') rect(0, 0, s.size, s.size * 0.6);
    else if(s.type === 'triangle') triangle(-s.size/2, s.size/2, s.size/2, s.size/2, 0, -s.size/2);
    else { stroke(0); strokeWeight(4); line(-s.size/2, 0, s.size/2, 0); }
    pop();
  }
}

function windowResized() { resizeCanvas(windowWidth, windowHeight); }