let nodes=[], pulse=0;
function setup(){
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  reset();
}
function reset(){
  nodes=[];
  for(let i=0; i<200; i++){
    nodes.push({
      p: createVector(random(width), random(height)),
      v: p5.Vector.random2D(),
      h: random(80, 160) // Cyber greens to cyans
    });
  }
}
function draw(){
  background(10, 10, 12, 40);
  pulse *= 0.9;
  
  let target = createVector(mouseX, mouseY);
  
  for(let i=0; i<nodes.length; i++){
    let n = nodes[i];
    let force = p5.Vector.sub(target, n.p);
    let d = max(force.mag(), 20);
    force.setMag((mouseIsPressed ? 6 : -1) / d * 30 + pulse / d);
    
    n.v.add(force);
    n.v.add(p5.Vector.random2D().mult(0.06));
    n.v.limit(4);
    n.p.add(n.v);
    
    // Constrain to the full window
    if(n.p.x < 0) { n.p.x = 0; n.v.x *= -1; }
    if(n.p.x > width)   { n.p.x = width;   n.v.x *= -1; }
    if(n.p.y < 0){ n.p.y = 0;n.v.y *= -1; }
    if(n.p.y > height)  { n.p.y = height;  n.v.y *= -1; }
  }
  
  blendMode(ADD);
  for(let i=0; i<nodes.length; i++){
    for(let j=i+1; j<nodes.length; j++){
      let d = p5.Vector.dist(nodes[i].p, nodes[j].p);
      if(d < 85){
        let alpha = map(d, 0, 85, 70, 0);
        stroke((nodes[i].h + frameCount*0.3) % 360, 90, 100, alpha);
        strokeWeight(map(d, 0, 85, 2, 0.2));
        line(nodes[i].p.x, nodes[i].p.y, nodes[j].p.x, nodes[j].p.y);
      }
    }
  }
  
  noStroke();
  for(const n of nodes){
    fill((n.h + frameCount*0.3) % 360, 90, 100, 85);
    circle(n.p.x, n.p.y, 4 + sin(frameCount*0.06 + n.h)*2);
  }
  blendMode(BLEND);
}
function keyPressed(){ if(key===' ') pulse=800; }
function doubleClicked(){ reset(); }
function windowResized(){ resizeCanvas(windowWidth, windowHeight); reset(); }
