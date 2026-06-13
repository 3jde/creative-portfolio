let ripples = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
}

function draw() {
  background(40, 80, 100, 25); // Water-like fade
  
  for (let i = ripples.length - 1; i >= 0; i--) {
    let r = ripples[i];
    r.size += 2;
    r.alpha -= 2;
    
    fill(100, 200, 150, r.alpha);
    ellipse(r.x, r.y, r.size);
    
    if (r.alpha <= 0) {
      ripples.splice(i, 1);
    }
  }
}

function mouseMoved() {
  if (frameCount % 3 === 0) {
    ripples.push({x: mouseX, y: mouseY, size: 10, alpha: 150});
  }
}
