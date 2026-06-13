// Sketch C: Artistic Quality - Algorithmic Mondrian
let rects = [];
let colors = ['#FF0000', '#0000FF', '#FFFF00', '#FFFFFF', '#000000'];

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
  splitRect(50, 50, width - 100, height - 100, 4);
}

function draw() {
  // Static generation on setup, gentle pulsing over time
  for(let r of rects) {
    fill(r.c);
    stroke(0);
    strokeWeight(8);
    rect(r.x, r.y, r.w, r.h);
  }
  noLoop();
}

function splitRect(x, y, w, h, depth) {
  if (depth === 0 || (random(1) > 0.6 && depth < 4)) {
    rects.push({x: x, y: y, w: w, h: h, c: random(colors)});
    return;
  }
  
  if (w > h) {
    let split = random(0.3, 0.7) * w;
    splitRect(x, y, split, h, depth - 1);
    splitRect(x + split, y, w - split, h, depth - 1);
  } else {
    let split = random(0.3, 0.7) * h;
    splitRect(x, y, w, split, depth - 1);
    splitRect(x, y + split, w, h - split, depth - 1);
  }
}

function mousePressed() {
  rects = [];
  splitRect(50, 50, width - 100, height - 100, 4);
  redraw();
}
