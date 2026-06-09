let nodes=[], pulse=0;
function setup(){
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  reset();
}
function reset(){
  nodes=[];
  for(let i=0; i<180; i++){
    nodes.push({
      p: createVector(random(width*0.4, width), random(height)),
      v: p5.Vector.random2D(),
      h: random(180, 280) // Cooler blues/purples/cyans
    });
  }
}
function draw(){
  background(240, 15, 5, 30);
  pulse *= 0.92;
  
  // Constrain mouse influence to the right side mostly, or allow reaching over
  let target = createVector(mouseX, mouseY);
  
  for(let i=0; i<nodes.length; i++){
    let n = nodes[i];
    let force = p5.Vector.sub(target, n.p);
    let d = max(force.mag(), 20);
    force.setMag((mouseIsPressed ? 8 : -1.5) / d * 40 + pulse / d);
    
    n.v.add(force);
    n.v.add(p5.Vector.random2D().mult(0.05));
    n.v.limit(4.5);
    n.p.add(n.v);
    
    // Boundary constraints: keep to the right side to leave white space for text
    let leftBound = width * 0.35;
    if(n.p.x < leftBound) { n.p.x = leftBound; n.v.x *= -1; }
    if(n.p.x > width) { n.p.x = width; n.v.x *= -1; }
    if(n.p.y < 0) { n.p.y = 0; n.v.y *= -1; }
    if(n.p.y > height) { n.p.y = height; n.v.y *= -1; }
  }
  
  blendMode(ADD);
  for(let i=0; i<nodes.length; i++){
    for(let j=i+1; j<nodes.length; j++){
      let d = p5.Vector.dist(nodes[i].p, nodes[j].p);
      if(d < 100){
        let alpha = map(d, 0, 100, 60, 0);
        stroke((nodes[i].h + frameCount*0.2) % 360, 80, 100, alpha);
        strokeWeight(map(d, 0, 100, 2, 0.5));
        line(nodes[i].p.x, nodes[i].p.y, nodes[j].p.x, nodes[j].p.y);
      }
    }
  }
  
  noStroke();
  for(const n of nodes){
    fill((n.h + frameCount*0.2) % 360, 80, 100, 80);
    circle(n.p.x, n.p.y, 4 + sin(frameCount*0.05 + n.h)*2);
  }
  blendMode(BLEND);
}
function keyPressed(){ if(key===' ') pulse=1000; }
function doubleClicked(){ reset(); }
function windowResized(){ resizeCanvas(windowWidth, windowHeight); reset(); }
