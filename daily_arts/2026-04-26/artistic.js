let step = 20;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop();
  background('#e6e4dc');
}

function draw() {
  for (let x = 0; x < width; x += step) {
    for (let y = 0; y < height; y += step) {
      push();
      translate(x + step/2, y + step/2);
      let n = noise(x * 0.01, y * 0.01);
      rotate(n * TWO_PI);
      
      let c = color('#2b2b2b');
      if (random(1) < 0.1) c = color('#d95c50');
      else if (random(1) < 0.1) c = color('#4a7c59');
      else if (random(1) < 0.1) c = color('#f0c967');
      
      stroke(c);
      strokeWeight(map(n, 0, 1, 1, 5));
      line(-step/2, 0, step/2, 0);
      pop();
    }
  }
}

function mousePressed() {
  noiseSeed(millis());
  redraw();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  redraw();
}